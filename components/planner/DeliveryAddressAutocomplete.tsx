"use client";

import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Loader2 } from "lucide-react";
import { loadGoogleMaps } from "@/lib/google-maps-loader";
import { useLang } from "@/lib/i18n/LanguageProvider";

export type VerifiedAddress = {
  address: string;
  placeId: string | null;
  lat: number;
  lng: number;
};

type Suggestion = { placeId: string; primary: string; secondary: string };

/**
 * Google Places Autocomplete (New). Reports a selection ONLY once the user picks
 * a real suggestion (or confirms their current location) — so the parent always
 * has verified lat/lng before requesting a quote. Editing the text after a
 * selection clears it (onSelect(null)), forcing a fresh, verified pick.
 *
 * A fresh session token is used per autocomplete session (reset after each
 * resolved place) to keep Google billing on the per-session model.
 */
export function DeliveryAddressAutocomplete({
  outlet,
  onSelect,
  placeholder,
}: {
  outlet: { lat: number; lng: number } | null;
  onSelect: (sel: VerifiedAddress | null) => void;
  placeholder?: string;
}) {
  const { t } = useLang();
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionTokenRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placesRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Load the Places library once.
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(async (g) => {
        if (cancelled || !g) return;
        placesRef.current = await g.maps.importLibrary("places");
        sessionTokenRef.current = new placesRef.current.AutocompleteSessionToken();
      })
      .catch(() => {
        /* loader already reset itself; stay in manual-less idle */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const fetchSuggestions = async (input: string) => {
    const places = placesRef.current;
    if (!places || input.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setBusy(true);
    try {
      const request: Record<string, unknown> = {
        input,
        sessionToken: sessionTokenRef.current,
        includedRegionCodes: ["my"],
        language: "en",
      };
      if (outlet) {
        request.locationBias = { center: { lat: outlet.lat, lng: outlet.lng }, radius: 30000 };
      }
      const { suggestions: raw } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      const mapped: Suggestion[] = (raw ?? [])
        .map((s: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = (s as any).placePrediction;
          if (!p) return null;
          return {
            placeId: p.placeId,
            primary: p.mainText?.text ?? p.text?.text ?? "",
            secondary: p.secondaryText?.text ?? "",
          };
        })
        .filter(Boolean) as Suggestion[];
      setSuggestions(mapped);
      setOpen(mapped.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setBusy(false);
    }
  };

  const onInput = (value: string) => {
    setText(value);
    if (hasSelection) {
      setHasSelection(false);
      onSelect(null); // editing invalidates the verified pick
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 280);
  };

  const choose = async (s: Suggestion) => {
    const places = placesRef.current;
    if (!places) return;
    setOpen(false);
    setBusy(true);
    try {
      const place = new places.Place({ id: s.placeId });
      await place.fetchFields({ fields: ["formattedAddress", "location", "id"] });
      const loc = place.location;
      const lat = typeof loc?.lat === "function" ? loc.lat() : loc?.lat;
      const lng = typeof loc?.lng === "function" ? loc.lng() : loc?.lng;
      if (typeof lat !== "number" || typeof lng !== "number") return;
      const address = place.formattedAddress ?? [s.primary, s.secondary].filter(Boolean).join(", ");
      setText(address);
      setHasSelection(true);
      onSelect({ address, placeId: place.id ?? s.placeId, lat, lng });
      // New session token after a resolved place (per Google session billing).
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    } catch {
      /* leave as unselected — user can retry */
    } finally {
      setBusy(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation || !placesRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const g = await loadGoogleMaps();
          if (!g) return;
          const { Geocoder } = await g.maps.importLibrary("geocoding");
          const geocoder = new Geocoder();
          const { lat, lng } = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const { results } = await geocoder.geocode({ location: { lat, lng } });
          const best = results?.[0];
          const address = best?.formatted_address ?? `Current location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
          setText(address);
          setHasSelection(true);
          onSelect({ address, placeId: best?.place_id ?? null, lat, lng });
        } catch {
          /* ignore — keep manual entry available */
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div ref={boxRef} className="relative">
      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium text-ink-secondary">{t("misc.addr.label")}</span>
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => onInput(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder={placeholder ?? t("misc.addr.placeholder")}
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-line-medium bg-white px-3 pr-9 text-sm text-ink-primary outline-none placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          {busy && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-muted" />
          )}
        </div>
      </label>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-[1020] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-line-medium bg-white py-1 shadow-lg">
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                onClick={() => choose(s)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-secondary"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink-primary">{s.primary}</span>
                  {s.secondary && <span className="block truncate text-xs text-ink-secondary">{s.secondary}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:text-ink-muted"
        >
          {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
          {t("misc.addr.useCurrent")}
        </button>
        {hasSelection && <span className="text-xs font-medium text-green-text">{t("misc.addr.verified")}</span>}
      </div>
    </div>
  );
}

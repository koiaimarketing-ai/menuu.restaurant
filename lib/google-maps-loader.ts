/**
 * Browser-only Google Maps JS loader. Loads the Maps JS API with the
 * `places` + `marker` + `geometry` libraries on demand, exactly once.
 *
 * Env-gated: with no NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY the loader resolves to
 * `null` so callers can degrade gracefully (manual address field, no map) instead
 * of crashing. The browser key must be domain-restricted in the Google console.
 */

export const mapsBrowserKey = (): string | undefined =>
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY || undefined;

export const mapsConfigured = (): boolean => Boolean(mapsBrowserKey());

// google.maps typings aren't installed; keep this loose but local.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleMaps = any;

let promise: Promise<GoogleMaps | null> | null = null;

/**
 * Resolve the loaded `google.maps` namespace, or `null` when unconfigured.
 * Safe to call repeatedly — the script tag is only injected once.
 */
export function loadGoogleMaps(): Promise<GoogleMaps | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (promise) return promise;

  const key = mapsBrowserKey();
  if (!key) {
    promise = Promise.resolve(null);
    return promise;
  }

  promise = new Promise<GoogleMaps | null>((resolve, reject) => {
    // Already present (e.g. fast refresh) — reuse it.
    if ((window as { google?: GoogleMaps }).google?.maps) {
      resolve((window as unknown as { google: GoogleMaps }).google);
      return;
    }

    const params = new URLSearchParams({
      key,
      libraries: "places,marker,geometry",
      loading: "async",
      v: "weekly",
    });
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const g = (window as unknown as { google?: GoogleMaps }).google;
      if (g?.maps) resolve(g);
      else reject(new Error("Google Maps loaded without maps namespace"));
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps JS"));
    document.head.appendChild(script);
  }).catch((err) => {
    // Reset so a later retry can re-attempt the load.
    promise = null;
    throw err;
  });

  return promise;
}

/** Decode a Google encoded polyline into [{lat,lng}] without the geometry lib. */
export function decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
  const points: Array<{ lat: number; lng: number }> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const len = encoded.length;

  while (index < len) {
    let result = 0;
    let shift = 0;
    let b: number;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

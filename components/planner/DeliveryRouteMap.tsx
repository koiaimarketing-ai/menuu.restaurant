"use client";

import { useEffect, useRef } from "react";
import { loadGoogleMaps, decodePolyline } from "@/lib/google-maps-loader";

type LatLng = { lat: number; lng: number };

/**
 * Compact Google Map showing the outlet → destination route. Draws the real
 * route polyline returned by the quote endpoint, fits both markers in view, and
 * animates a motorbike marker along the polyline (~6s), replaying whenever the
 * route changes. Honours prefers-reduced-motion (stationary marker at origin).
 *
 * Renders nothing useful without a configured browser key — the loader resolves
 * to null and the placeholder note stays visible.
 */
export function DeliveryRouteMap({
  origin,
  destination,
  polyline,
  outletName,
}: {
  origin: LatLng;
  destination: LatLng;
  polyline: string | null;
  outletName: string;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const g = await loadGoogleMaps();
      if (cancelled || !g || !elRef.current) return;

      const { Map } = await g.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await g.maps.importLibrary("marker");

      const path: LatLng[] = polyline ? decodePolyline(polyline) : [origin, destination];

      const map =
        mapRef.current ??
        new Map(elRef.current, {
          mapId: "WARUNG_JAKARTA_DELIVERY",
          disableDefaultUI: true,
          gestureHandling: "cooperative",
        });
      mapRef.current = map;

      // Fit both endpoints (and the whole path) into view.
      const bounds = new g.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 40);

      // Route line.
      new g.maps.Polyline({
        path,
        map,
        geodesic: true,
        strokeColor: "#C8472E",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });

      // Endpoint markers.
      const storePin = document.createElement("div");
      storePin.textContent = "🍽️";
      storePin.title = outletName;
      storePin.style.fontSize = "22px";
      new AdvancedMarkerElement({ map, position: origin, content: storePin });

      const homePin = document.createElement("div");
      homePin.textContent = "📍";
      homePin.title = "Your location";
      homePin.style.fontSize = "22px";
      new AdvancedMarkerElement({ map, position: destination, content: homePin });

      // Bike marker.
      const bikeEl = document.createElement("div");
      bikeEl.textContent = "🛵";
      bikeEl.style.fontSize = "26px";
      bikeEl.style.transition = "transform 0.1s linear";
      const bike = new AdvancedMarkerElement({ map, position: origin, content: bikeEl });

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || path.length < 2) {
        bike.position = origin;
        return;
      }

      // Animate along the decoded path over ~6s using cumulative segment lengths.
      const seg: number[] = [0];
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1];
        const b = path[i];
        const d = Math.hypot(b.lat - a.lat, b.lng - a.lng);
        seg.push(seg[i - 1] + d);
      }
      const totalLen = seg[seg.length - 1] || 1;
      const DURATION = 6000;
      let start: number | null = null;

      const step = (ts: number) => {
        if (cancelled) return;
        if (start === null) start = ts;
        const t = Math.min((ts - start) / DURATION, 1);
        const target = t * totalLen;
        // find current segment
        let i = 1;
        while (i < seg.length && seg[i] < target) i++;
        const a = path[i - 1];
        const b = path[Math.min(i, path.length - 1)];
        const segStart = seg[i - 1];
        const segLen = (seg[Math.min(i, seg.length - 1)] - segStart) || 1;
        const f = Math.min(Math.max((target - segStart) / segLen, 0), 1);
        bike.position = { lat: a.lat + (b.lat - a.lat) * f, lng: a.lng + (b.lng - a.lng) * f };
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // brief pause then replay
          rafRef.current = requestAnimationFrame((next) => {
            start = next + 800;
            rafRef.current = requestAnimationFrame(step);
          });
        }
      };
      rafRef.current = requestAnimationFrame(step);
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [origin, destination, polyline, outletName]);

  return (
    <div
      ref={elRef}
      className="h-44 w-full overflow-hidden rounded-xl border border-line-warm bg-secondary"
      aria-label={`Delivery route from ${outletName} to your location`}
    />
  );
}

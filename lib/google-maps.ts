/**
 * Server-side Google Routes + Google Weather helpers. Keys live ONLY on the
 * server (GOOGLE_MAPS_SERVER_KEY / GOOGLE_WEATHER_API_KEY). These functions
 * never run in the browser and never invent data — if a key is missing they
 * throw a typed `NotConfiguredError` so the caller can return a clear state.
 */
import type { WeatherClass } from "./delivery-pricing";

export class NotConfiguredError extends Error {
  constructor(public service: string) {
    super(`${service} not configured`);
    this.name = "NotConfiguredError";
  }
}

export type LatLng = { lat: number; lng: number };

export type RouteResult = {
  distanceMetres: number;
  staticDurationSec: number;
  trafficAwareDurationSec: number;
  trafficAvailable: boolean;
  polyline: string | null;
  travelMode: "TWO_WHEELER" | "DRIVING";
};

const parseDuration = (d?: string) => (d ? Number(String(d).replace("s", "")) : 0);

/** Traffic-aware route via the Google Routes API. */
export async function getTrafficAwareRoute(origin: LatLng, destination: LatLng): Promise<RouteResult> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) throw new NotConfiguredError("Google Routes");

  const call = async (travelMode: "TWO_WHEELER" | "DRIVING") => {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.staticDuration,routes.polyline.encodedPolyline",
      },
      cache: "no-store",
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
        travelMode,
        routingPreference: "TRAFFIC_AWARE",
      }),
    });
    if (!res.ok) throw new Error(`Routes API ${res.status}`);
    return res.json();
  };

  let travelMode: "TWO_WHEELER" | "DRIVING" = "TWO_WHEELER";
  let data = await call(travelMode);
  if (!data?.routes?.length) {
    travelMode = "DRIVING"; // fallback recorded internally
    data = await call(travelMode);
  }
  const route = data?.routes?.[0];
  if (!route) throw new Error("No route returned");

  const staticDurationSec = parseDuration(route.staticDuration);
  const trafficAwareDurationSec = parseDuration(route.duration);
  return {
    distanceMetres: route.distanceMeters ?? 0,
    staticDurationSec,
    trafficAwareDurationSec: trafficAwareDurationSec || staticDurationSec,
    trafficAvailable: Boolean(staticDurationSec && trafficAwareDurationSec),
    polyline: route.polyline?.encodedPolyline ?? null,
    travelMode,
  };
}

// --- current weather at the OUTLET (cached ~10 min per outlet) ---
const weatherCache = new Map<string, { at: number; weather: WeatherClass; tempC: number | null; condition: string }>();
const WEATHER_TTL_MS = 10 * 60 * 1000;

function classifyWeather(probType: string | undefined, intensity: number | undefined): WeatherClass {
  // map Google Weather condition/precip to our buckets
  const t = (probType ?? "").toUpperCase();
  if (!t || t === "NONE" || t === "CLEAR" || t === "CLOUDY") return "clear";
  if (t.includes("THUNDER") || (intensity ?? 0) >= 7.6) return "heavy-rain";
  if ((intensity ?? 0) >= 2.5) return "moderate-rain";
  return "light-rain"; // drizzle / light rain
}

export async function getOutletWeather(outletId: string, coords: LatLng) {
  const cached = weatherCache.get(outletId);
  if (cached && Date.now() - cached.at < WEATHER_TTL_MS) return cached;

  const key = process.env.GOOGLE_WEATHER_API_KEY;
  if (!key) throw new NotConfiguredError("Google Weather");

  const res = await fetch(
    `https://weather.googleapis.com/v1/currentConditions:lookup?key=${key}&location.latitude=${coords.lat}&location.longitude=${coords.lng}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Weather API ${res.status}`);
  const data = await res.json();
  const condition = data?.weatherCondition?.description?.text ?? "Unknown";
  const tempC = data?.temperature?.degrees ?? null;
  const precipType = data?.precipitation?.probability?.type ?? data?.weatherCondition?.type;
  const intensity = data?.precipitation?.qpf?.quantity;
  const weather = classifyWeather(precipType, intensity);
  const result = { at: Date.now(), weather, tempC, condition };
  weatherCache.set(outletId, result);
  return result;
}

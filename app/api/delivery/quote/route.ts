import { NextResponse } from "next/server";
import { getLocation } from "@/data/locations";
import { calculateDeliveryQuote } from "@/lib/delivery-pricing";
import { getTrafficAwareRoute, getOutletWeather, NotConfiguredError, type LatLng } from "@/lib/google-maps";
import { saveQuote, newQuoteId } from "@/lib/delivery-quote-store";

export const runtime = "nodejs";

/**
 * Authoritative delivery quote. Validates the outlet + destination, fetches the
 * Google route + outlet weather, classifies traffic/weather/peak, and runs the
 * single pricing function. Returns a server-stored quote id; the browser never
 * computes or overrides the fee. Never invents distance/fees on failure.
 */
export async function POST(req: Request) {
  let body: {
    outletId?: string;
    destination?: { address?: string; lat?: number; lng?: number; placeId?: string };
    foodSubtotal?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const outlet = body.outletId ? getLocation(body.outletId) : undefined;
  if (!outlet) return NextResponse.json({ error: "invalid_outlet" }, { status: 400 });

  const foodSubtotal = Number(body.foodSubtotal);
  if (!Number.isFinite(foodSubtotal) || foodSubtotal <= 0) {
    return NextResponse.json({ error: "invalid_subtotal" }, { status: 400 });
  }

  // Destination must come from a verified geocoded selection (lat/lng).
  const dest = body.destination;
  const destLatLng: LatLng | null =
    dest && Number.isFinite(dest.lat) && Number.isFinite(dest.lng)
      ? { lat: dest.lat as number, lng: dest.lng as number }
      : null;

  const originLatLng: LatLng | null =
    outlet.latitude != null && outlet.longitude != null
      ? { lat: outlet.latitude, lng: outlet.longitude }
      : null;

  // Google not configured (or coordinates not set up yet) → never fake a fee.
  if (!process.env.GOOGLE_MAPS_SERVER_KEY || !originLatLng) {
    return NextResponse.json(
      { error: "route_unavailable", reason: "not_configured" },
      { status: 503 }
    );
  }
  if (!destLatLng) {
    return NextResponse.json(
      { error: "invalid_destination", reason: "no_coordinates" },
      { status: 400 }
    );
  }

  try {
    const route = await getTrafficAwareRoute(originLatLng, destLatLng);

    // Weather is non-fatal: on failure use multiplier 1.00 + status "unavailable".
    let weatherClass: "clear" | "light-rain" | "moderate-rain" | "heavy-rain" | "unavailable" = "unavailable";
    let weatherMeta: { tempC: number | null; condition: string } | null = null;
    try {
      const w = await getOutletWeather(outlet.id, originLatLng);
      weatherClass = w.weather;
      weatherMeta = { tempC: w.tempC, condition: w.condition };
    } catch {
      weatherClass = "unavailable";
    }

    const quote = calculateDeliveryQuote({
      foodSubtotal,
      distanceMetres: route.distanceMetres,
      trafficAwareDurationSec: route.trafficAwareDurationSec,
      staticDurationSec: route.staticDurationSec,
      trafficAvailable: route.trafficAvailable,
      weather: weatherClass,
    });

    const stored = saveQuote({
      id: newQuoteId(),
      outletId: outlet.id,
      destination: dest,
      quote,
    });

    return NextResponse.json({
      quoteId: stored.id,
      expiresAt: stored.expiresAt,
      quote,
      route: { polyline: route.polyline, travelMode: route.travelMode },
      weather: weatherMeta,
    });
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      return NextResponse.json({ error: "route_unavailable", reason: "not_configured" }, { status: 503 });
    }
    return NextResponse.json({ error: "route_error" }, { status: 502 });
  }
}

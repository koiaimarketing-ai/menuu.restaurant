/**
 * Single source of truth for delivery pricing. Pure, server-side, fully unit
 * testable — it takes already-fetched route/weather/time facts and returns the
 * authoritative fee breakdown. It NEVER fetches anything or invents a distance.
 *
 * Used by /api/delivery/quote after Google Routes + Google Weather have run.
 * The browser only ever displays the values this returns; it never recomputes.
 */

// ---- Configurable pricing values (env-overridable, with safe defaults) ----
const num = (v: string | undefined, fallback: number) => {
  const n = v != null ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
};

export const PLATFORM_FEE = num(process.env.DELIVERY_PLATFORM_FEE, 0.4); // RM
export const FIRST_TIER_DISTANCE_KM = 3;
export const FIRST_TIER_PRICE = num(process.env.DELIVERY_FIRST_3KM_FEE, 5.0); // RM
export const ADDITIONAL_KM_PRICE = num(process.env.DELIVERY_ADDITIONAL_KM_FEE, 1.0); // RM / km
/** The additional service adjustment applied on top of the calculated cost. */
export const DELIVERY_PRICE_MARKUP_PERCENT = num(process.env.DELIVERY_PRICE_MARKUP_PERCENT, 50);
export const DELIVERY_QUOTE_VALID_MINUTES = num(process.env.DELIVERY_QUOTE_VALID_MINUTES, 10);

export type TrafficClass = "normal" | "moderate" | "heavy";
export type WeatherClass = "clear" | "light-rain" | "moderate-rain" | "heavy-rain" | "unavailable";

/** Round UP to the nearest RM0.10 (6.01→6.10, 6.10→6.10, 6.11→6.20). */
export function roundUpToTenSen(value: number): number {
  // subtract a tiny epsilon so exact dimes (6.10) don't bump up via FP error
  return Math.ceil(value * 10 - 1e-9) / 10;
}

export function calculateTrafficMultiplier(trafficRatio: number): {
  trafficClass: TrafficClass;
  multiplier: number;
} {
  if (trafficRatio >= 1.35) return { trafficClass: "heavy", multiplier: 1.5 };
  if (trafficRatio >= 1.15) return { trafficClass: "moderate", multiplier: 1.2 };
  return { trafficClass: "normal", multiplier: 1.0 };
}

export function calculateWeatherMultiplier(weather: WeatherClass): number {
  switch (weather) {
    case "light-rain":
      return 1.5;
    case "moderate-rain":
      return 1.8;
    case "heavy-rain":
      return 2.0;
    case "clear":
    case "unavailable":
    default:
      return 1.0;
  }
}

/** Peak-hour multiplier using Asia/Kuala_Lumpur wall-clock time. */
export function calculatePeakMultiplier(now: Date = new Date()): {
  isPeak: boolean;
  multiplier: number;
} {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const mins = hour * 60 + minute;
  const lunch = mins >= 11 * 60 + 30 && mins <= 13 * 60 + 30; // 11:30–13:30
  const dinner = mins >= 18 * 60 && mins <= 20 * 60 + 30; // 18:00–20:30
  const isPeak = lunch || dinner;
  return { isPeak, multiplier: isPeak ? 1.3 : 1.0 };
}

export type DeliveryQuoteInput = {
  foodSubtotal: number;
  distanceMetres: number;
  trafficAwareDurationSec: number;
  staticDurationSec: number;
  /** false when Google returned no live traffic — we then treat ratio as 1.0 */
  trafficAvailable: boolean;
  weather: WeatherClass;
  now?: Date;
};

export type DeliveryQuote = {
  distanceMetres: number;
  distanceKm: number;
  staticDurationSec: number;
  trafficAwareDurationSec: number;
  trafficRatio: number;
  trafficClass: TrafficClass;
  weatherClass: WeatherClass;
  isPeak: boolean;
  peakMultiplier: number;
  weatherMultiplier: number;
  trafficMultiplier: number;
  dynamicMultiplier: number;
  // breakdown (all RM, two decimals when displayed)
  distanceFee: number;
  conditionAdjustment: number;
  platformFee: number;
  serviceAdjustment: number;
  finalDeliveryFee: number;
  foodSubtotal: number;
  totalPayable: number;
  markupPercent: number;
};

/** The one and only delivery-fee calculation. */
export function calculateDeliveryQuote(input: DeliveryQuoteInput): DeliveryQuote {
  const distanceKm = input.distanceMetres / 1000;

  // Step 2 — base distance fee (do NOT round distance to whole km first)
  const distanceFee =
    distanceKm <= FIRST_TIER_DISTANCE_KM
      ? FIRST_TIER_PRICE
      : FIRST_TIER_PRICE + (distanceKm - FIRST_TIER_DISTANCE_KM) * ADDITIONAL_KM_PRICE;

  // Step 3 — multipliers (take the highest, never compound them)
  const trafficRatio =
    input.trafficAvailable && input.staticDurationSec > 0
      ? input.trafficAwareDurationSec / input.staticDurationSec
      : 1.0;
  const { trafficClass, multiplier: trafficMultiplier } = input.trafficAvailable
    ? calculateTrafficMultiplier(trafficRatio)
    : { trafficClass: "normal" as TrafficClass, multiplier: 1.0 };
  const weatherMultiplier = calculateWeatherMultiplier(input.weather);
  const { isPeak, multiplier: peakMultiplier } = calculatePeakMultiplier(input.now);
  const dynamicMultiplier = Math.max(peakMultiplier, weatherMultiplier, trafficMultiplier);

  // Step 4 — calculated cost
  const calculatedDeliveryCost = distanceFee * dynamicMultiplier + PLATFORM_FEE;

  // Step 5 — required additional markup, then round up to RM0.10
  const finalDeliveryFee = roundUpToTenSen(
    calculatedDeliveryCost * (1 + DELIVERY_PRICE_MARKUP_PERCENT / 100)
  );

  // customer-facing breakdown lines (sum exactly to finalDeliveryFee)
  const conditionAdjustment = distanceFee * (dynamicMultiplier - 1);
  const serviceAdjustment = finalDeliveryFee - calculatedDeliveryCost;

  const foodSubtotal = input.foodSubtotal;
  const totalPayable = Math.round((foodSubtotal + finalDeliveryFee) * 100) / 100;

  return {
    distanceMetres: input.distanceMetres,
    distanceKm,
    staticDurationSec: input.staticDurationSec,
    trafficAwareDurationSec: input.trafficAwareDurationSec,
    trafficRatio,
    trafficClass,
    weatherClass: input.weather,
    isPeak,
    peakMultiplier,
    weatherMultiplier,
    trafficMultiplier,
    dynamicMultiplier,
    distanceFee: Math.round(distanceFee * 100) / 100,
    conditionAdjustment: Math.round(conditionAdjustment * 100) / 100,
    platformFee: PLATFORM_FEE,
    serviceAdjustment: Math.round(serviceAdjustment * 100) / 100,
    finalDeliveryFee,
    foodSubtotal,
    totalPayable,
    markupPercent: DELIVERY_PRICE_MARKUP_PERCENT,
  };
}

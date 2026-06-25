// Single source of truth for review rating + count shown across the whole site.
// Update here only — every review block reads from this so numbers never drift.
export const REVIEW_INFO = {
  rating: "4.6",
  reviewsCount: 376,
  quote: "Tastes just like home in Jakarta.",
} as const;

export type DayHours = {
  status: "open" | "closed";
  open: string | null;
  close: string | null;
};

export type SpecialHours = {
  date: string;
  branchId: string;
  status: "open" | "closed";
  open?: string;
  close?: string;
  label: string;
};

export type Location = {
  id: "ss4" | "kl-central-walk";
  name: string;
  shortName: string;
  alternativeName?: string;
  timezone: string;
  closingSoonMinutes: number;
  addressLines: string[];
  phone: string;
  whatsapp: string;
  latitude: number | null;
  longitude: number | null;
  placeId: string;
  googleMapsUrl: string;
  mapEmbedUrl?: string;
  /** Full, human-readable address used to build map embeds and navigation links. */
  mapQuery: string;
  /** Branch-specific Waze deep link. */
  wazeUrl: string;
  regularHours: Record<string, DayHours>;
  specialHours: SpecialHours[];
  facilities: string[];
  menuStatus: "pending" | "confirmed-from-supplied-pdf";
};

// Menuu outlets. Taman Sea keeps the internal id "ss4" (default branch id used
// across the planner/menu pricing). KLCC reuses the pre-existing
// "kl-central-walk" id — its menu prices already exist (same as ss4 via P()).
// KLCC is a TEST outlet added so the menu-page location dropdown can be
// exercised with 2 options; delete its entry to go back to a single outlet.
export const locations: Location[] = [
  {
    id: "ss4",
    name: "Menuu",
    shortName: "Taman Sea",
    timezone: "Asia/Kuala_Lumpur",
    closingSoonMinutes: 60,
    addressLines: [
      "No 42-1, Jalan SS2/4A",
      "Taman Sea",
      "47300 Petaling Jaya",
      "Selangor",
    ],
    phone: "+60167068931",
    whatsapp: "+60167068931",
    latitude: null,
    longitude: null,
    placeId: "",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Menuu%2C%20No%2042-1%20Jalan%20SS2%2F4A%2C%20Taman%20Sea%2C%2047300%20Petaling%20Jaya",
    mapEmbedUrl: "",
    mapQuery:
      "Menuu, No 42-1, Jalan SS2/4A, Taman Sea, 47300 Petaling Jaya, Selangor",
    wazeUrl:
      "https://www.waze.com/ul?q=Menuu%20Taman%20Sea%20Petaling%20Jaya&navigate=yes",
    regularHours: {
      monday: { status: "open", open: "10:00", close: "22:00" },
      tuesday: { status: "open", open: "10:00", close: "22:00" },
      wednesday: { status: "open", open: "10:00", close: "22:00" },
      thursday: { status: "open", open: "10:00", close: "22:00" },
      friday: { status: "open", open: "10:00", close: "22:00" },
      saturday: { status: "open", open: "10:00", close: "22:00" },
      sunday: { status: "open", open: "10:00", close: "22:00" },
    },
    specialHours: [],
    facilities: [
      "Outdoor seating",
      "Vegetarian options",
      "Dine-in",
      "Lunch",
      "Dinner",
    ],
    menuStatus: "confirmed-from-supplied-pdf",
  },
  {
    id: "kl-central-walk",
    name: "Menuu",
    shortName: "KLCC",
    timezone: "Asia/Kuala_Lumpur",
    closingSoonMinutes: 60,
    addressLines: [
      "Lot 241, Level 2",
      "Suria KLCC",
      "50088 Kuala Lumpur",
    ],
    phone: "+60167068931",
    whatsapp: "+60167068931",
    latitude: null,
    longitude: null,
    placeId: "",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Menuu%2C%20Suria%20KLCC%2C%2050088%20Kuala%20Lumpur",
    mapEmbedUrl: "",
    mapQuery: "Menuu, Suria KLCC, 50088 Kuala Lumpur",
    wazeUrl:
      "https://www.waze.com/ul?q=Suria%20KLCC%20Kuala%20Lumpur&navigate=yes",
    regularHours: {
      monday: { status: "open", open: "10:00", close: "22:00" },
      tuesday: { status: "open", open: "10:00", close: "22:00" },
      wednesday: { status: "open", open: "10:00", close: "22:00" },
      thursday: { status: "open", open: "10:00", close: "22:00" },
      friday: { status: "open", open: "10:00", close: "22:00" },
      saturday: { status: "open", open: "10:00", close: "22:00" },
      sunday: { status: "open", open: "10:00", close: "22:00" },
    },
    specialHours: [],
    facilities: ["Dine-in", "Lunch", "Dinner"],
    menuStatus: "confirmed-from-supplied-pdf",
  },
];

export const getLocation = (id: string) =>
  locations.find((l) => l.id === id);

/** Normalize a Malaysian phone ("016-706 8931", "0167068931", "+60167068931"
 *  or "60167068931") to E.164 digits carrying the 60 country code. */
const digits60 = (phone: string): string => {
  const d = phone.replace(/[^0-9]/g, "");
  return d.startsWith("60") ? d : "60" + d.replace(/^0/, "");
};

/** E.164 tel: href, e.g. "+60167068931" -> "tel:+60167068931". */
export const telHref = (phone: string): string => `tel:+${digits60(phone)}`;

/** WhatsApp link, e.g. "+60167068931" -> "https://wa.me/60167068931". */
export const waHref = (phone: string): string => `https://wa.me/${digits60(phone)}`;

export const restaurant = {
  name: "Menuu",
  cuisine: "Indonesian",
  rating: 4.6,
  reviewCount: 376,
  priceRange: "RM20–40 per person",
  taxNote:
    "All prices are subject to 6% government tax and 10% service charge.",
};

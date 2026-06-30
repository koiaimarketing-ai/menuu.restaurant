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

// Single Menuu outlet (Taman Sea, Petaling Jaya). The internal id stays "ss4"
// because it is the default branch id used across the planner/menu pricing —
// reusing it keeps the per-item price data and branch logic working without a
// type-wide rename. There is only one location now, so branch-switching UI is
// hidden whenever `locations.length < 2`.
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
    phone: "016-921 4297",
    whatsapp: "016-921 4297",
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
];

export const getLocation = (id: string) =>
  locations.find((l) => l.id === id);

/** Malaysian E.164 tel: href, e.g. "010-829 9409" -> "tel:+60108299409". */
export const telHref = (phone: string): string =>
  `tel:+60${phone.replace(/[^0-9]/g, "").replace(/^0/, "")}`;

/** WhatsApp link, e.g. "010-829 9409" -> "https://wa.me/60108299409". */
export const waHref = (phone: string): string =>
  `https://wa.me/60${phone.replace(/[^0-9]/g, "").replace(/^0/, "")}`;

export const restaurant = {
  name: "Menuu",
  cuisine: "Indonesian",
  rating: 4.6,
  reviewCount: 376,
  priceRange: "RM20–40 per person",
  taxNote:
    "All prices are subject to 6% government tax and 10% service charge.",
};

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

export const locations: Location[] = [
  {
    id: "ss4",
    name: "Warung Jakarta SS4",
    shortName: "SS4",
    timezone: "Asia/Kuala_Lumpur",
    closingSoonMinutes: 60,
    addressLines: [
      "35, Jalan SS 4C/5",
      "Taman Rasa Sayang",
      "47301 Petaling Jaya",
      "Selangor",
    ],
    phone: "016-404 7058",
    whatsapp: "016-404 7058",
    latitude: null,
    longitude: null,
    placeId: "",
    // TODO: replace with verified SS4 Google Maps URL
    googleMapsUrl: "",
    mapEmbedUrl: "",
    mapQuery:
      "Warung Jakarta SS4, 35 Jalan SS 4C/5, Taman Rasa Sayang, 47301 Petaling Jaya, Selangor",
    wazeUrl: "https://waze.com/ul/hw2838n377",
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
    menuStatus: "pending",
  },
  {
    id: "kl-central-walk",
    name: "Warung Jakarta KLCW",
    shortName: "KLCW",
    alternativeName: "Warung Jakarta, Kuala Lumpur City Walk",
    timezone: "Asia/Kuala_Lumpur",
    closingSoonMinutes: 60,
    addressLines: [
      "Block BX 2A – BX 3A",
      "Jalan P. Ramlee, KL City Walk",
      "50250 Kuala Lumpur",
      "Wilayah Persekutuan Kuala Lumpur",
    ],
    phone: "010-829 9409",
    whatsapp: "010-829 9409",
    latitude: null,
    longitude: null,
    placeId: "",
    // TODO: replace with verified KL Central Walk coordinates / Place ID if precise pin needed
    googleMapsUrl: "",
    mapEmbedUrl: "",
    mapQuery:
      "Warung Jakarta, Block BX 2A - BX 3A, Jalan P. Ramlee, KL City Walk, 50250 Kuala Lumpur",
    wazeUrl: "https://waze.com/ul/hw283fqqjh",
    regularHours: {
      monday: { status: "open", open: "10:00", close: "17:30" },
      tuesday: { status: "open", open: "10:00", close: "17:30" },
      wednesday: { status: "open", open: "10:00", close: "17:30" },
      thursday: { status: "open", open: "10:00", close: "17:30" },
      friday: { status: "open", open: "10:00", close: "17:30" },
      saturday: { status: "open", open: "10:00", close: "17:30" },
      sunday: { status: "closed", open: null, close: null },
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
  name: "Warung Jakarta",
  cuisine: "Indonesian",
  rating: 4.6,
  reviewCount: 376,
  priceRange: "RM20–40 per person",
  taxNote:
    "All prices are subject to 6% government tax and 10% service charge.",
};

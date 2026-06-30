import { menu, type MenuItem } from "@/data/menu";

export type CategoryPresentation = "featured" | "featured-thumb" | "standard";

export type PlannerSection = {
  id: string;
  label: string;
  blurb: string;
  catIds: string[];
  /** "featured" = large standalone hero image; "standard" = thumbnail cards. */
  presentation: CategoryPresentation;
  /** Large featured product photo (featured presentation only). */
  featuredImage?: string;
  /** When true, the banner image is a square food illustration (no baked-in
   * title), so render it as a title + contained illustration instead of a
   * full-width wide banner. */
  illustrationBanner?: boolean;
};

/**
 * Food categories. Chicken Noodle / Meat Ball / Fried Food / Toast use the new
 * featured hero layout; Rice Meal / À La Carte / Vegetables keep the original
 * standard thumbnail-card design. (Display labels/blurbs are localised via
 * `menu.section.<id>.*`; these are fallbacks.)
 */
export const FOOD_SECTIONS: PlannerSection[] = [
  { id: "mie-ayam", label: "Noodle Horfun", blurb: "Malaysian-style noodle favourites with comforting broth, dry sauce and local flavours.", catIds: ["mie-ayam"], presentation: "featured-thumb", featuredImage: "/images/menu-banner-mie-ayam.png" },
  { id: "bakso", label: "Fish Ball Bihun Noodle", blurb: "Comforting Malaysian meatball bowls with noodles, soup and local sides.", catIds: ["bakso"], presentation: "featured-thumb", featuredImage: "/images/menu-banner-bakso.png" },
  { id: "nasi-meals", label: "Rice Meal", blurb: "Malaysian rice meals inspired by Malay, Chinese and Indian everyday favourites.", catIds: ["nasi-meals"], presentation: "featured-thumb", featuredImage: "/images/menu-banner-rice-meal.png" },
  { id: "ala-carte", label: "À La Carte", blurb: "Single dishes and local favourites to enjoy on their own or with rice.", catIds: ["ala-carte"], presentation: "featured-thumb", featuredImage: "/images/menu-banner-ala-carte.png" },
  { id: "vegetables", label: "Vegetable Dishes", blurb: "Vegetable dishes and small sides to complete your meal.", catIds: ["vegetables"], presentation: "featured-thumb", featuredImage: "/images/menu-banner-vegetables.png" },
  { id: "gorengan", label: "Fried Food", blurb: "Crispy Malaysian snacks and fried favourites for sharing.", catIds: ["gorengan"], presentation: "featured-thumb", featuredImage: "/images/menu-banner-gorengan.png" },
  { id: "roti-bakar", label: "Toast", blurb: "Malaysian kopitiam toast with kaya, butter and classic fillings.", catIds: ["roti-bakar"], presentation: "featured", featuredImage: "/images/menu-banner-roti-bakar.png" },
];

/** Add-ons render after the beverages group as a standard thumbnail section. */
export const ADDON_SECTION: PlannerSection = {
  id: "add-ons",
  label: "Add-On",
  blurb: "Add more to make your meal even better.",
  catIds: ["add-ons"],
  presentation: "featured-thumb",
  featuredImage: "/images/menu-banner-addon.png",
};

/** Beverage subsections shown vertically under one "Beverages" group. */
export const BEVERAGE_SUBSECTIONS: PlannerSection[] = [
  { id: "jamu", label: "Kopitiam Classics", blurb: "Malaysian kopitiam drinks and refreshing traditional favourites.", catIds: ["jamu"], presentation: "standard" },
  { id: "coffee", label: "Coffee", blurb: "Rich and aromatic coffee prepared for a smooth, comforting finish.", catIds: ["coffee"], presentation: "standard" },
  { id: "non-coffee", label: "Non-Coffee", blurb: "Creamy, refreshing and comforting drinks without coffee.", catIds: ["non-coffee"], presentation: "standard" },
  { id: "other-drinks", label: "Soft Drink", blurb: "Refreshing everyday drinks to complete your meal.", catIds: ["soft-drinks"], presentation: "standard" },
];

export const BEVERAGE_GROUP = {
  id: "beverages",
  label: "Beverage",
  blurb: "Refreshing traditional drinks, handcrafted coffee and everyday favourites for every meal.",
  featuredImage: "/images/menu-banner-beverages.png",
  subsections: BEVERAGE_SUBSECTIONS,
};

/** Top-level pills for the sticky category nav (beverages collapses to one). */
export const TOP_NAV_SECTIONS: { id: string; label: string }[] = [
  ...FOOD_SECTIONS.map((s) => ({ id: s.id, label: s.label })),
  { id: BEVERAGE_GROUP.id, label: BEVERAGE_GROUP.label },
  { id: ADDON_SECTION.id, label: ADDON_SECTION.label },
];

export const sectionItems = (s: PlannerSection): MenuItem[] =>
  menu
    .filter((m) => s.catIds.includes(m.category))
    .sort((a, b) => a.sortOrder - b.sortOrder);

// Curated vegetarian-friendly items (plant / dairy / egg based — no meat or
// seafood). Indicative only; guests should confirm with staff. Mapped to the
// Malaysian menu (e.g. Vegetable Pakora, Fried Popiah, toast, egg, papadom).
export const VEG_IDS = new Set<string>([
  "bakwan-goreng", // Vegetable Pakora
  "pisang-goreng", // Fried Popiah
  "roti-bakar-coklat", // Kaya Butter Toast
  "roti-bakar-keju", // Peanut Butter Toast
  "roti-bakar-coklat-keju", // Milo & Kaya Toast
  "sayur-buncis-toge", // Stir-Fried Bean Sprouts
  "telor-krispi", // Acar Jelatah
  "addon-bakso-urat", // Fried Egg
  "addon-bakso-goreng", // Boiled Egg
  "addon-pangsit-goreng", // Papadom
  "addon-pangsit-rebus", // Begedil
  "addon-tahu-isi-bakso", // Fried Tofu
  "addon-kerupuk-merah", // Extra Rice
  "addon-soo-hoon", // Extra Noodles
  // beverages (the veg leaf is hidden on drinks, but these are veg for the
  // vegetarian-only filter):
  "kunyit-asam",
  "wedang-jahe",
  "yin-yang-earl-grey",
  "kopi-gula-aren",
  "kopi-o",
  "kopi-susu",
  "mineral-water",
  "teh-botol-sosro",
  "soda-gembira",
  "es-jeruk",
  "tea-o-jawa",
  "plain-water",
  "coke",
  "coke-zero",
  "sprite",
]);

export const isVegetarian = (id: string): boolean => VEG_IDS.has(id);

/** Beverage/drinks categories — never show ingredient symbols on these. */
export const BEVERAGE_CAT_IDS = new Set<string>(["jamu", "coffee", "non-coffee", "soft-drinks"]);
export const isBeverageItem = (item: MenuItem): boolean => BEVERAGE_CAT_IDS.has(item.category);

/**
 * Whether to render the vegetarian leaf for an item. True only for vegetarian
 * food — beverages never show it, even if the data marks them vegetarian.
 */
export const showVegLeaf = (item: MenuItem): boolean =>
  isVegetarian(item.id) && !isBeverageItem(item);

// Fish / seafood dishes on the Malaysian menu (fish ball, grilled fish, prawn
// fritter, fish crackers, fish cake).
export const FISH_IDS = new Set<string>([
  "bakso-urat", // Fish Ball Kuey Teow Soup
  "ikan-kembung-balado", // Ikan Bakar Sambal
  "tahu-isi-goreng", // Cucur Udang (prawn fritter)
  "pangsit-goreng-10", // Keropok Lekor (fish crackers)
  "addon-kerupuk-emping", // Fish Cake
]);

// Beef dishes — one cow icon represents all beef (beef balls, beef soup).
export const BEEF_IDS = new Set<string>([
  "bakso-halus", // Beef Ball Noodle Soup
  "bakso-campur", // Mixed Ball Noodle Soup (incl. beef)
  "soto-betawi", // Sup Daging
]);

export const showFishIcon = (item: MenuItem): boolean =>
  FISH_IDS.has(item.id) && !isBeverageItem(item);
export const showBeefIcon = (item: MenuItem): boolean =>
  BEEF_IDS.has(item.id) && !isBeverageItem(item);

// Chicken dishes — any item whose (original Malay) name contains "ayam".
export const showChickenIcon = (item: MenuItem): boolean =>
  /ayam|chicken/i.test(item.name) && !isBeverageItem(item);

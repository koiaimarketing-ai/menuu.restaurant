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
};

/**
 * Food categories. Mie Ayam / Bakso / Gorengan / Roti Bakar use the new
 * featured hero layout; Nasi Meals / À La Carte / Vegetables keep the original
 * standard thumbnail-card design.
 */
export const FOOD_SECTIONS: PlannerSection[] = [
  { id: "mie-ayam", label: "Mie Ayam", blurb: "Handcrafted yellow wheat noodles topped with savoury chicken and warm broth.", catIds: ["mie-ayam"], presentation: "featured", featuredImage: "/images/menu-bg-mie-ayam.png" },
  { id: "bakso", label: "Bakso", blurb: "Comforting Indonesian meatball soup with noodles, tofu, crispy wonton and aromatic garnishes.", catIds: ["bakso"], presentation: "featured", featuredImage: "/images/menu-bg-bakso.png" },
  { id: "nasi-meals", label: "Rice Meal", blurb: "Traditional Indonesian rice plates with rich flavours and authentic sambals.", catIds: ["nasi-meals"], presentation: "featured-thumb", featuredImage: "/images/menu-bg-rice-meal.png" },
  { id: "ala-carte", label: "À La Carte", blurb: "Signature mains served on their own.", catIds: ["ala-carte"], presentation: "featured-thumb", featuredImage: "/images/menu-bg-ala-carte.png" },
  { id: "vegetables", label: "Vegetables & Sides", blurb: "Fresh vegetable plates and comforting small sides.", catIds: ["vegetables"], presentation: "featured-thumb", featuredImage: "/images/menu-bg-vegetables.png" },
  { id: "gorengan", label: "Gorengan", blurb: "Crispy Indonesian favourites, freshly fried and perfect for sharing.", catIds: ["gorengan"], presentation: "featured", featuredImage: "/images/menu-bg-gorengan.png" },
  { id: "roti-bakar", label: "Roti Bakar", blurb: "Toasted Indonesian bread with warm, comforting fillings and classic sweet flavours.", catIds: ["roti-bakar"], presentation: "featured", featuredImage: "/images/menu-bg-roti-bakar.png" },
];

/** Add-ons render after the beverages group as a standard thumbnail section. */
export const ADDON_SECTION: PlannerSection = {
  id: "add-ons",
  label: "Add-On / Sides",
  blurb: "Add more to make your meal even better.",
  catIds: ["add-ons"],
  presentation: "featured-thumb",
  featuredImage: "/images/menu-bg-addon.png",
};

/** Beverage subsections shown vertically under one "Beverages" group. */
export const BEVERAGE_SUBSECTIONS: PlannerSection[] = [
  { id: "jamu", label: "Traditional Jamu", blurb: "Traditional Indonesian herbal drinks prepared with aromatic roots, spices and natural ingredients.", catIds: ["jamu"], presentation: "standard" },
  { id: "coffee", label: "Coffee", blurb: "Rich and aromatic coffee prepared for a smooth, comforting finish.", catIds: ["coffee"], presentation: "standard" },
  { id: "non-coffee", label: "Non-Coffee", blurb: "Creamy, refreshing and comforting drinks without coffee.", catIds: ["non-coffee"], presentation: "standard" },
  { id: "other-drinks", label: "Soft Drink", blurb: "Refreshing everyday drinks to complete your meal.", catIds: ["soft-drinks"], presentation: "standard" },
];

export const BEVERAGE_GROUP = {
  id: "beverages",
  label: "Beverages",
  blurb: "Refreshing traditional drinks, handcrafted coffee and everyday favourites for every meal.",
  featuredImage: "/images/menu-bg-beverages.png",
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

// Curated vegetarian-friendly items (plant / dairy / egg based — no meat,
// seafood or bakso). Indicative only; guests should confirm with staff.
export const VEG_IDS = new Set<string>([
  "tahu-isi-goreng",
  "tempe-mendoan",
  "bakwan-goreng",
  "pisang-goreng",
  "roti-bakar-coklat",
  "roti-bakar-keju",
  "roti-bakar-coklat-keju",
  "sayur-tempe-kacang",
  "telor-krispi",
  "nasi-putih",
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
  "addon-kerupuk-emping",
  "addon-kerupuk-merah",
  "addon-soo-hoon",
  "addon-mihun",
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

// Fish / seafood dishes (ikan, teri, lele, kembung).
export const FISH_IDS = new Set<string>([
  "ikan-kembung-balado-meal",
  "ikan-pecel-lele-meal",
  "ikan-kembung-balado",
  "ikan-pecel-lele",
  "ikan-teri-terong-pete",
]);

// Beef dishes — includes sapi (beef tongue, soto betawi) and bakso (beef balls).
// One cow icon represents all beef, per the brief.
export const BEEF_IDS = new Set<string>([
  "mie-ayam-bakso",
  "bakso-halus",
  "bakso-urat",
  "bakso-goreng",
  "bakso-campur",
  "nasi-soto-betawi",
  "lidah-sapi-meal",
  "soto-betawi",
  "lidah-sapi",
  "sayur-buncis-toge",
  "addon-bakso-halus",
  "addon-bakso-urat",
  "addon-bakso-goreng",
  "addon-tahu-isi-bakso",
]);

export const showFishIcon = (item: MenuItem): boolean =>
  FISH_IDS.has(item.id) && !isBeverageItem(item);
export const showBeefIcon = (item: MenuItem): boolean =>
  BEEF_IDS.has(item.id) && !isBeverageItem(item);

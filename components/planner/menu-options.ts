import { menu, type MenuItem } from "@/data/menu";
import { isBeverageItem } from "./sections";

// ---- Cart sequencing by food code ------------------------------------------
// Category display order: A Chicken Noodle, B Meat Ball, C Rice Meal,
// D À La Carte, E Vegetables & Sides, F Fried Food, G Toast, H Beverages,
// T Add-On / Sides.
const CATEGORY_ORDER: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, T: 9,
};

export const categoryCode = (item: MenuItem): string =>
  (item.code ?? "").match(/^[A-Z]+/)?.[0] ?? "";

const codeParts = (code?: string) => {
  const m = (code ?? "").match(/^([A-Z]+)(\d+)$/);
  return { prefix: m?.[1] ?? "", number: Number(m?.[2] ?? 0) };
};

/** A cart-line-like object: needs itemId + lineId for code lookup + stable order. */
type SortableLine = { itemId: string; lineId: string };

/**
 * Order cart lines by menu sequence: category (A,B,C,D,S,G,F,H,T) → number
 * ascending → original insertion order. Same code stays grouped; different
 * options under one code follow the order they were added (createdAt-like).
 */
export function sortLines<T extends SortableLine>(lines: T[]): T[] {
  const order = new Map(lines.map((l, i) => [l.lineId, i]));
  const codeOf = (itemId: string) => menu.find((m) => m.id === itemId)?.code;
  return [...lines].sort((a, b) => {
    const ca = codeParts(codeOf(a.itemId));
    const cb = codeParts(codeOf(b.itemId));
    const cat = (CATEGORY_ORDER[ca.prefix] ?? 999) - (CATEGORY_ORDER[cb.prefix] ?? 999);
    if (cat !== 0) return cat;
    if (ca.number !== cb.number) return ca.number - cb.number;
    return (order.get(a.lineId) ?? 0) - (order.get(b.lineId) ?? 0);
  });
}

/** True when the item must be configured in the modal before adding:
 * Mie Ayam (A) / Bakso (B) / Drinks (H), or any item with a required choice.
 * Drinks always open the modal so the user can pick hot/cold, ice, sweetness,
 * add-ice, etc. before adding. */
export function itemNeedsModal(item: MenuItem): boolean {
  const cc = categoryCode(item);
  return (
    cc === "A" ||
    cc === "B" ||
    cc === "H" ||
    isBeverageItem(item) ||
    (item.choices?.some((c) => c.required) ?? false)
  );
}

/**
 * Derives which detail-modal options/add-ons are relevant for a menu item from
 * its category + ingredient tags — so we never show every option on every item.
 * An item may override the derived set via `availableOptions` in the menu data.
 * Labels are i18n keys (see dict-misc `misc.opt.*`). Add-ons carry a price and a
 * per-add-on quantity; options are free and only change the cart line key.
 */

export type AddOn = { key: string; labelKey: string; price: number };
export type OptionGroup = {
  key: string;
  labelKey: string;
  choices: { value: string; labelKey: string }[];
};

export const itemKind = (item: MenuItem): "food" | "beverage" =>
  isBeverageItem(item) ? "beverage" : "food";

// Canonical option values → i18n key. The modal renders t(labelKey).
const OPTION_LABEL: Record<string, string> = {
  "No Milk": "misc.opt.noMilk",
  "No Eggs": "misc.opt.noEggs",
  "No Peanut": "misc.opt.noPeanut",
  "No Soybean": "misc.opt.noSoybean",
  "No Garlic": "misc.opt.noGarlic",
  "No Onion": "misc.opt.noOnion",
  "Less Spicy": "misc.opt.lessSpicy",
};

export const optionLabelKey = (value: string): string => OPTION_LABEL[value] ?? value;

// Add-on key → original (Malay) name shown in the cart/receipt (e.g. "Telur").
export const ADDON_ORIGINAL: Record<string, string> = {
  sambal: "Sambal",
  rice: "Nasi",
  egg: "Telur",
};

/**
 * Detail rows for a cart line's choices + special request.
 *
 * Deliberately language-INDEPENDENT: category labels are always English
 * (Noodle / Add-on / Option / Remark) and values keep their original menu form
 * (e.g. "Mihun", "Telur") — even in Chinese mode — while the surrounding cart UI
 * (subtotal, totals, buttons) stays translated. This keeps the kitchen-facing
 * detail unambiguous regardless of the customer's chosen UI language.
 */
export function describeLine(
  choices: Record<string, string>,
  note: string | undefined
): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  for (const [k, v] of Object.entries(choices)) {
    if (!v) continue;
    if (k === "Add-ons") {
      const parts = v.split(", ").map((p) => {
        const m = p.match(/^(.+?)\s*x\s*(\d+)$/i);
        const key = m ? m[1].trim() : p;
        const n = m ? m[2] : "1";
        return `${ADDON_ORIGINAL[key] ?? key} x${n}`;
      });
      out.push({ label: "Add-on", value: parts.join(", ") });
    } else if (k === "Option") {
      out.push({ label: "Option", value: v });
    } else {
      out.push({ label: k, value: v });
    }
  }
  if (note) out.push({ label: "Remark", value: note });
  return out;
}

// Plain items that should never auto-show options (vermicelli, glass noodle,
// crackers, plain rice, plain water).
const PLAIN_IDS = new Set([
  "addon-soo-hoon",
  "addon-mihun",
  "addon-kerupuk-emping",
  "addon-kerupuk-merah",
  "plain-water",
  "mineral-water",
]);

/** Multi-select "Option" chips (free). Returns ordered, de-duped option values. */
export function getFoodOptions(item: MenuItem): { value: string; labelKey: string }[] {
  // Explicit per-item override from the menu data wins.
  if (item.availableOptions) {
    return item.availableOptions.map((v) => ({ value: v, labelKey: optionLabelKey(v) }));
  }

  const values: string[] = [];
  const push = (...v: string[]) => v.forEach((x) => values.push(x));

  if (itemKind(item) === "beverage") {
    // Milk / creamy drinks only.
    if (/susu|gula-aren|earl-grey/.test(item.id)) push("No Milk");
  } else if (!PLAIN_IDS.has(item.id)) {
    if (item.spicy) push("Less Spicy", "No Garlic", "No Onion");
    if (item.category === "mie-ayam") push("No Soybean", "No Garlic", "No Onion", "No Eggs");
    if (item.category === "bakso") push("No Soybean", "No Garlic", "No Onion");
    if (/telor|egg/.test(item.id)) push("No Eggs");
    if ((item.category === "nasi-meals" || item.category === "ala-carte") && !item.spicy)
      push("No Garlic", "No Onion");
  }

  const seen = new Set<string>();
  return values
    .filter((v) => (seen.has(v) ? false : (seen.add(v), true)))
    .map((v) => ({ value: v, labelKey: optionLabelKey(v) }));
}

// Standard food add-ons (compact, no image, per-add-on quantity).
const FOOD_ADDONS: AddOn[] = [
  { key: "sambal", labelKey: "misc.opt.addSambal", price: 0 },
  { key: "rice", labelKey: "misc.opt.addRice", price: 3.2 },
  { key: "egg", labelKey: "misc.opt.addEgg", price: 3.0 },
];

export function getAddOns(item: MenuItem): AddOn[] {
  if (itemKind(item) === "beverage") return [];
  if (item.category === "add-ons") return []; // add-on items don't nest add-ons
  if (item.category === "roti-bakar") return []; // toast: no savoury add-ons
  if (item.category === "gorengan") return []; // fried snacks: no rice/egg add-ons
  if (PLAIN_IDS.has(item.id)) return [];
  return FOOD_ADDONS;
}

/** Single-select beverage option groups (sweetness, ice). Temperature is handled
 * separately via item.availableHotCold in the modal. */
export function getBeverageGroups(item: MenuItem): OptionGroup[] {
  if (itemKind(item) !== "beverage") return [];

  if (item.category === "soft-drinks") {
    return [
      {
        key: "Ice",
        labelKey: "misc.opt.iceLabel",
        choices: [
          { value: "Add ice", labelKey: "misc.opt.addIce" },
          { value: "No ice", labelKey: "misc.opt.noIce" },
        ],
      },
    ];
  }

  if (/water/.test(item.id)) return [];

  return [
    {
      key: "Sweetness",
      labelKey: "misc.opt.sweetnessLabel",
      choices: [
        { value: "Normal sweet", labelKey: "misc.opt.normalSweet" },
        { value: "Less sweet", labelKey: "misc.opt.lessSweet" },
        { value: "No sugar", labelKey: "misc.opt.noSugar" },
      ],
    },
    {
      key: "Ice",
      labelKey: "misc.opt.iceLabel",
      choices: [
        { value: "Normal ice", labelKey: "misc.opt.normalIce" },
        { value: "Less ice", labelKey: "misc.opt.lessIce" },
        { value: "No ice", labelKey: "misc.opt.noIce" },
      ],
    },
  ];
}

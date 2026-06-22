export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  portion?: string;
  choices?: { label: string; options: string[]; required?: boolean }[];
  complimentaryItem?: string;
  availableHotCold?: boolean;
  spicy?: boolean;
  recommended?: boolean;
  image?: string;
  branchPrices: {
    ss4: number | null;
    "kl-central-walk": number | null;
  };
  sortOrder: number;
};

export type Category = {
  id: string;
  label: string;
  blurb?: string;
};

export const categories: Category[] = [
  { id: "recommended", label: "Recommended", blurb: "Warung Jakarta picks our guests come back for." },
  { id: "mie-ayam", label: "Mie Ayam", blurb: "Comes with complimentary Tea O Jawa." },
  { id: "bakso", label: "Bakso", blurb: "Comes with complimentary Tea O Jawa." },
  { id: "nasi-meals", label: "Nasi Meals", blurb: "Complete rice meals." },
  { id: "ala-carte", label: "À La Carte", blurb: "Main dishes on their own." },
  { id: "vegetables", label: "Vegetables & Sides", blurb: "Small plates and sides." },
  { id: "gorengan", label: "Gorengan", blurb: "Crispy fried snacks." },
  { id: "roti-bakar", label: "Roti Bakar", blurb: "Toasted bread, sweet fillings." },
  { id: "jamu", label: "Traditional Jamu", blurb: "Traditional Indonesian drinks." },
  { id: "coffee", label: "Coffee", blurb: "Hot and iced coffee." },
  { id: "non-coffee", label: "Non-Coffee", blurb: "Teas, juices and more." },
  { id: "soft-drinks", label: "Soft Drinks", blurb: "Canned soft drinks." },
  { id: "add-ons", label: "Add-Ons", blurb: "Small extras to complete your meal." },
];

const P = (kl: number | null): MenuItem["branchPrices"] => ({
  ss4: null,
  "kl-central-walk": kl,
});

let order = 0;
const next = () => ++order;

export const menu: MenuItem[] = [
  // A. Mie Ayam
  {
    id: "mie-ayam-original",
    name: "Mie/Bihun Ayam Original",
    category: "mie-ayam",
    complimentaryItem: "Tea O Jawa",
    choices: [{ label: "Noodle", options: ["Mie", "Bihun"], required: true }],
    recommended: true,
    image: "/images/dish-topdown.png",
    branchPrices: P(23.9),
    sortOrder: next(),
  },
  {
    id: "mie-ayam-manis",
    name: "Mie/Bihun Ayam Manis",
    category: "mie-ayam",
    complimentaryItem: "Tea O Jawa",
    choices: [{ label: "Noodle", options: ["Mie", "Bihun"], required: true }],
    branchPrices: P(23.9),
    sortOrder: next(),
  },
  {
    id: "mie-ayam-bakso",
    name: "Mie/Bihun Ayam Bakso",
    category: "mie-ayam",
    complimentaryItem: "Tea O Jawa",
    choices: [{ label: "Noodle", options: ["Mie", "Bihun"], required: true }],
    branchPrices: P(27.9),
    sortOrder: next(),
  },

  // B. Bakso
  {
    id: "bakso-halus",
    name: "Bakso Sapi Halus",
    category: "bakso",
    complimentaryItem: "Tea O Jawa",
    choices: [{ label: "Noodle", options: ["Soo Hoon", "Mihun"], required: true }],
    branchPrices: P(17.9),
    sortOrder: next(),
  },
  {
    id: "bakso-urat",
    name: "Bakso Sapi Urat",
    category: "bakso",
    complimentaryItem: "Tea O Jawa",
    choices: [{ label: "Noodle", options: ["Soo Hoon", "Mihun"], required: true }],
    branchPrices: P(18.9),
    sortOrder: next(),
  },
  {
    id: "bakso-goreng",
    name: "Bakso Sapi Goreng",
    category: "bakso",
    complimentaryItem: "Tea O Jawa",
    choices: [{ label: "Noodle", options: ["Soo Hoon", "Mihun"], required: true }],
    branchPrices: P(18.9),
    sortOrder: next(),
  },
  {
    id: "bakso-campur",
    name: "Bakso Sapi Campur",
    category: "bakso",
    complimentaryItem: "Tea O Jawa",
    choices: [{ label: "Noodle", options: ["Soo Hoon", "Mihun"], required: true }],
    recommended: true,
    image: "/images/dish-steam.png",
    branchPrices: P(18.9),
    sortOrder: next(),
  },

  // D. Nasi Meals
  {
    id: "nasi-soto-betawi",
    name: "Nasi Soto Betawi",
    category: "nasi-meals",
    recommended: true,
    image: "/images/dish-window.png",
    branchPrices: P(28.9),
    sortOrder: next(),
  },
  {
    id: "nasi-ayam-geprek",
    name: "Nasi Ayam Geprek",
    category: "nasi-meals",
    spicy: true,
    recommended: true,
    image: "/images/signature-dish.png",
    branchPrices: P(26.9),
    sortOrder: next(),
  },
  {
    id: "ikan-kembung-balado-meal",
    name: "Ikan Goreng Kembung Balado",
    category: "nasi-meals",
    branchPrices: P(15.2),
    sortOrder: next(),
  },
  {
    id: "ikan-pecel-lele-meal",
    name: "Ikan Goreng Pecel Lele",
    category: "nasi-meals",
    branchPrices: P(14.2),
    sortOrder: next(),
  },
  {
    id: "lidah-sapi-meal",
    name: "Lidah Sapi Oseng Pedas",
    category: "nasi-meals",
    spicy: true,
    recommended: true,
    branchPrices: P(23.9),
    sortOrder: next(),
  },

  // E. À La Carte
  {
    id: "soto-betawi",
    name: "Soto Betawi",
    category: "ala-carte",
    description:
      "Slow-cooked beef in a comforting milk broth with fried potato and diced tomato.",
    branchPrices: P(25.9),
    sortOrder: next(),
  },
  {
    id: "ayam-geprek",
    name: "Ayam Geprek",
    category: "ala-carte",
    description:
      "Crispy battered fried chicken served with mixed spicy geprek sambal.",
    spicy: true,
    branchPrices: P(17.2),
    sortOrder: next(),
  },
  {
    id: "ikan-kembung-balado",
    name: "Ikan Goreng Kembung Balado",
    category: "ala-carte",
    description: "Deep-fried chub mackerel served with balado sauce.",
    branchPrices: P(8.9),
    sortOrder: next(),
  },
  {
    id: "ikan-pecel-lele",
    name: "Ikan Goreng Pecel Lele",
    category: "ala-carte",
    description: "Deep-fried catfish served with sambal tomato terasi.",
    branchPrices: P(7.2),
    sortOrder: next(),
  },
  {
    id: "ikan-teri-terong-pete",
    name: "Ikan Teri Oseng Terong Pete",
    category: "ala-carte",
    description:
      "Deep-fried anchovies with fried eggplant and petai, tossed with sambal merah.",
    branchPrices: P(7.9),
    sortOrder: next(),
  },
  {
    id: "lidah-sapi",
    name: "Lidah Sapi Oseng Pedas",
    category: "ala-carte",
    description: "Stir-fried beef tongue in bumbu balado.",
    spicy: true,
    branchPrices: P(15.9),
    sortOrder: next(),
  },

  // F. Vegetables & Sides
  {
    id: "sayur-tempe-kacang",
    name: "Sayur Oseng Tempe Kacang Panjang",
    category: "vegetables",
    description: "Stir-fried tempeh with long beans.",
    branchPrices: P(5.9),
    sortOrder: next(),
  },
  {
    id: "sayur-buncis-toge",
    name: "Sayur Tumis Buncis Toge Bakso",
    category: "vegetables",
    description: "Stir-fried green beans, bean sprouts and bakso.",
    branchPrices: P(4.2),
    sortOrder: next(),
  },
  {
    id: "telor-krispi",
    name: "Telor Krispi",
    category: "vegetables",
    description: "Crispy fried egg.",
    branchPrices: P(4.2),
    sortOrder: next(),
  },
  {
    id: "nasi-putih",
    name: "Nasi Putih",
    category: "vegetables",
    description: "Steamed white rice.",
    branchPrices: P(3.2),
    sortOrder: next(),
  },

  // G. Gorengan
  {
    id: "tahu-isi-goreng",
    name: "Tahu Isi Goreng",
    category: "gorengan",
    portion: "3 pcs",
    branchPrices: P(9.9),
    sortOrder: next(),
  },
  {
    id: "tempe-mendoan",
    name: "Tempe Mendoan",
    category: "gorengan",
    portion: "4 pcs",
    branchPrices: P(9.9),
    sortOrder: next(),
  },
  {
    id: "bakwan-goreng",
    name: "Bakwan Goreng",
    category: "gorengan",
    portion: "4 pcs",
    recommended: true,
    branchPrices: P(9.9),
    sortOrder: next(),
  },
  {
    id: "pangsit-goreng-5",
    name: "Pangsit Goreng",
    category: "gorengan",
    portion: "5 pcs",
    branchPrices: P(9.9),
    sortOrder: next(),
  },
  {
    id: "pangsit-goreng-10",
    name: "Pangsit Goreng",
    category: "gorengan",
    portion: "10 pcs",
    branchPrices: P(14.0),
    sortOrder: next(),
  },
  {
    id: "pisang-goreng",
    name: "Pisang Goreng",
    category: "gorengan",
    recommended: true,
    choices: [
      {
        label: "Flavour",
        options: ["Original", "Coklat", "Keju", "Coklat + Keju"],
        required: true,
      },
    ],
    branchPrices: P(9.9),
    sortOrder: next(),
  },

  // H. Roti Bakar
  {
    id: "roti-bakar-coklat",
    name: "Roti Bakar Coklat",
    category: "roti-bakar",
    branchPrices: P(12.9),
    sortOrder: next(),
  },
  {
    id: "roti-bakar-keju",
    name: "Roti Bakar Keju",
    category: "roti-bakar",
    branchPrices: P(15.9),
    sortOrder: next(),
  },
  {
    id: "roti-bakar-coklat-keju",
    name: "Roti Bakar Coklat Keju",
    category: "roti-bakar",
    branchPrices: P(17.9),
    sortOrder: next(),
  },

  // I. Traditional Jamu
  {
    id: "kunyit-asam",
    name: "Kunyit Asam",
    category: "jamu",
    availableHotCold: true,
    recommended: true,
    branchPrices: P(9.0),
    sortOrder: next(),
  },
  {
    id: "wedang-jahe",
    name: "Wedang Jahe",
    category: "jamu",
    availableHotCold: true,
    branchPrices: P(11.0),
    sortOrder: next(),
  },

  // J. Coffee
  {
    id: "yin-yang-earl-grey",
    name: "Yin & Yang Earl Grey",
    category: "coffee",
    availableHotCold: true,
    branchPrices: P(11.0),
    sortOrder: next(),
  },
  {
    id: "kopi-gula-aren",
    name: "Kopi Gula Aren/Melaka",
    category: "coffee",
    availableHotCold: true,
    branchPrices: P(9.0),
    sortOrder: next(),
  },
  {
    id: "kopi-o",
    name: "Kopi O",
    category: "coffee",
    branchPrices: P(7.0),
    sortOrder: next(),
  },
  {
    id: "kopi-susu",
    name: "Kopi Susu",
    category: "coffee",
    branchPrices: P(8.0),
    sortOrder: next(),
  },

  // K. Non-Coffee
  {
    id: "mineral-water",
    name: "Mineral Water",
    category: "non-coffee",
    branchPrices: P(3.5),
    sortOrder: next(),
  },
  {
    id: "teh-botol-sosro",
    name: "Teh Botol Sosro",
    category: "non-coffee",
    branchPrices: P(5.0),
    sortOrder: next(),
  },
  {
    id: "soda-gembira",
    name: "Soda Gembira",
    category: "non-coffee",
    branchPrices: P(5.0),
    sortOrder: next(),
  },
  {
    id: "es-jeruk",
    name: "Es Jeruk",
    category: "non-coffee",
    branchPrices: P(6.0),
    sortOrder: next(),
  },
  {
    id: "tea-o-jawa",
    name: "Tea O Jawa",
    category: "non-coffee",
    availableHotCold: true,
    choices: [{ label: "Sugar", options: ["Sugar", "No sugar"], required: true }],
    branchPrices: P(3.0),
    sortOrder: next(),
  },
  {
    id: "plain-water",
    name: "Plain Water",
    category: "non-coffee",
    availableHotCold: true,
    branchPrices: P(1.0),
    sortOrder: next(),
  },

  // L. Soft Drinks
  { id: "coke", name: "Coke", category: "soft-drinks", branchPrices: P(5.0), sortOrder: next() },
  { id: "coke-zero", name: "Coke Zero", category: "soft-drinks", branchPrices: P(5.0), sortOrder: next() },
  { id: "sprite", name: "Sprite", category: "soft-drinks", branchPrices: P(5.0), sortOrder: next() },

  // C. Add-Ons
  { id: "addon-bakso-halus", name: "Bakso Sapi Halus", category: "add-ons", portion: "3 pcs", branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-bakso-urat", name: "Bakso Sapi Urat", category: "add-ons", portion: "2 pcs", branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-bakso-goreng", name: "Bakso Sapi Goreng", category: "add-ons", portion: "2 pcs", branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-pangsit-goreng", name: "Pangsit Goreng", category: "add-ons", portion: "2 pcs", branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-pangsit-rebus", name: "Pangsit Rebus", category: "add-ons", portion: "2 pcs", branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-tahu-isi-bakso", name: "Tahu Isi Bakso Sapi", category: "add-ons", portion: "2 pcs", branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-pangsit-bawang", name: "Pangsit Bawang", category: "add-ons", portion: "2 pcs", branchPrices: P(1.5), sortOrder: next() },
  { id: "addon-kerupuk-emping", name: "Kerupuk Emping", category: "add-ons", branchPrices: P(5.0), sortOrder: next() },
  { id: "addon-kerupuk-merah", name: "Kerupuk Merah", category: "add-ons", branchPrices: P(3.0), sortOrder: next() },
  { id: "addon-soo-hoon", name: "Soo Hoon", category: "add-ons", branchPrices: P(3.2), sortOrder: next() },
  { id: "addon-mihun", name: "Mihun", category: "add-ons", branchPrices: P(3.2), sortOrder: next() },
];

// Real dish photography (filenames mapped to item ids).
const MENU_IMAGES: Record<string, string> = {
  "mie-ayam-original": "/images/menu-mie-ayam.png",
  "mie-ayam-manis": "/images/menu-mie-ayam.png",
  "mie-ayam-bakso": "/images/menu-mie-ayam.png",
  "bakso-halus": "/images/menu-bakso.png",
  "bakso-urat": "/images/menu-bakso.png",
  "bakso-goreng": "/images/menu-bakso.png",
  "bakso-campur": "/images/menu-bakso.png",
  "nasi-soto-betawi": "/images/menu-nasi-soto-betawi.png",
  "nasi-ayam-geprek": "/images/menu-nasi-ayam-geprek.png",
  "ikan-kembung-balado-meal": "/images/menu-ikan-kembung-balado.png",
  "ikan-pecel-lele-meal": "/images/menu-ikan-pecel-lele-meal.png",
  "lidah-sapi-meal": "/images/menu-lidah-sapi-meal.png",
  "soto-betawi": "/images/menu-soto-betawi.png",
  "ayam-geprek": "/images/menu-ayam-geprek.png",
  "ikan-kembung-balado": "/images/menu-ikan-kembung-balado.png",
  "ikan-pecel-lele": "/images/menu-ikan-pecel-lele.png",
  "ikan-teri-terong-pete": "/images/menu-ikan-teri.png",
  "lidah-sapi": "/images/menu-lidah-sapi.png",
  "sayur-tempe-kacang": "/images/menu-sayur-tempe.png",
  "sayur-buncis-toge": "/images/menu-sayur-buncis.png",
  "telor-krispi": "/images/menu-telor-krispi.png",
  "nasi-putih": "/images/menu-nasi-putih.png",
  "tahu-isi-goreng": "/images/menu-tahu-isi.png",
  "tempe-mendoan": "/images/menu-tempe-mendoan.png",
  "roti-bakar-keju": "/images/menu-roti-keju.png",
  // beverages share one tasteful beverage photo
  "yin-yang-earl-grey": "/images/menu-beverage.png",
  "kopi-gula-aren": "/images/menu-beverage.png",
  "kopi-o": "/images/menu-beverage.png",
  "kopi-susu": "/images/menu-beverage.png",
  "kunyit-asam": "/images/menu-beverage.png",
  "wedang-jahe": "/images/menu-beverage.png",
  "teh-botol-sosro": "/images/menu-beverage.png",
  "soda-gembira": "/images/menu-beverage.png",
  "es-jeruk": "/images/menu-beverage.png",
  "tea-o-jawa": "/images/menu-beverage.png",
  "mineral-water": "/images/menu-beverage.png",
  "plain-water": "/images/menu-beverage.png",
  "coke": "/images/menu-beverage.png",
  "coke-zero": "/images/menu-beverage.png",
  "sprite": "/images/menu-beverage.png",
};
menu.forEach((m) => {
  if (MENU_IMAGES[m.id]) m.image = MENU_IMAGES[m.id];
});

export const getMenuByCategory = (catId: string) =>
  menu.filter((m) => m.category === catId).sort((a, b) => a.sortOrder - b.sortOrder);

export const recommendedItems = menu.filter((m) => m.recommended);

// Items seen in Google content but not confirmed in the KLCW PDF.
export const pendingMenuItems = [
  "Sarawak Laksa",
  "Mee Kolok",
  "Salted Egg Pasta",
  "Buttermilk Chicken Waffle",
  "Butter Beer",
];

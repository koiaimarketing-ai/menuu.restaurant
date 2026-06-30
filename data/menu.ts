export type MenuItem = {
  id: string;
  /** Display code shown before the name, e.g. "A1". Assigned per category. */
  code?: string;
  name: string;
  category: string;
  description?: string;
  portion?: string;
  choices?: { label: string; options: string[]; required?: boolean }[];
  /** Optional override of the detail-modal "Option" chips (free preferences).
   * When set, exactly these are shown; when omitted they are derived from the
   * item's category + tags. Use `[]` for plain items that need no options. */
  availableOptions?: string[];
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
  { id: "recommended", label: "Recommended", blurb: "Menuu picks our guests come back for." },
  { id: "mie-ayam", label: "Mie Ayam", blurb: "Malaysian-style noodle favourites with comforting broth, dry sauce and local flavours." },
  { id: "bakso", label: "Bakso", blurb: "Comforting Malaysian meatball bowls with noodles, soup and local sides." },
  { id: "nasi-meals", label: "Nasi Meals", blurb: "Malaysian rice meals inspired by Malay, Chinese and Indian everyday favourites." },
  { id: "ala-carte", label: "À La Carte", blurb: "Single dishes and local favourites to enjoy on their own or with rice." },
  { id: "vegetables", label: "Vegetables & Sides", blurb: "Vegetable dishes and small sides to complete your meal." },
  { id: "gorengan", label: "Gorengan", blurb: "Crispy Malaysian snacks and fried favourites for sharing." },
  { id: "roti-bakar", label: "Roti Bakar", blurb: "Malaysian kopitiam toast with kaya, butter and classic fillings." },
  { id: "jamu", label: "Traditional Jamu", blurb: "Malaysian kopitiam drinks and refreshing traditional favourites." },
  { id: "coffee", label: "Coffee", blurb: "Local kopitiam coffee, pulled and brewed the Malaysian way." },
  { id: "non-coffee", label: "Non-Coffee", blurb: "Teas, juices, Milo and everyday non-coffee drinks." },
  { id: "soft-drinks", label: "Soft Drinks", blurb: "Chilled canned soft drinks." },
  { id: "add-ons", label: "Add-Ons", blurb: "Add more local sides to complete your meal." },
];

// Single Menuu outlet now: the confirmed menu prices apply to the only outlet,
// so both branch keys carry the same price.
const P = (kl: number | null): MenuItem["branchPrices"] => ({
  ss4: kl,
  "kl-central-walk": kl,
});

let order = 0;
const next = () => ++order;

// Malaysian mixed menu (Malay / Chinese / Indian). Item ids, prices and dish
// photos are preserved from the original data; names, descriptions and option
// choices are Malaysian. Display names/descriptions are localised in dict-menu.
export const menu: MenuItem[] = [
  { id: "mie-ayam-original", name: "Curry Chicken Mee", category: "mie-ayam", description: "Yellow mee served with curry chicken, tofu puff, long beans and sambal.", choices: [{"label":"Noodle Type","options":["Yellow Mee","Mee Hoon","Kuey Teow"],"required":true},{"label":"Spice Level","options":["Normal","Less Spicy","Extra Spicy"]},{"label":"Soup","options":["Curry Soup","Dry Curry Sauce"]}], spicy: true, recommended: true, branchPrices: P(23.9), sortOrder: next() },
  { id: "mie-ayam-manis", name: "Ipoh Chicken Hor Fun", category: "mie-ayam", description: "Smooth kuey teow with shredded chicken, light broth and fried shallots.", choices: [{"label":"Noodle Type","options":["Kuey Teow","Mee Hoon"],"required":true},{"label":"Style","options":["Soup","Dry"]}], branchPrices: P(23.9), sortOrder: next() },
  { id: "mie-ayam-bakso", name: "Hainanese Chicken Noodles", category: "mie-ayam", description: "Chicken noodles served with fragrant sauce, cucumber and house chilli.", choices: [{"label":"Noodle Type","options":["Yellow Mee","Mee Hoon","Kuey Teow"],"required":true},{"label":"Style","options":["Dry","Soup"]},{"label":"Chicken","options":["Steamed","Roasted"]}], branchPrices: P(27.9), sortOrder: next() },
  { id: "bakso-halus", name: "Beef Ball Noodle Soup", category: "bakso", description: "Beef balls served with noodles in clear broth and fried garlic.", choices: [{"label":"Noodle Type","options":["Yellow Mee","Mee Hoon","Kuey Teow"],"required":true},{"label":"Style","options":["Clear Soup","Dry"]}], branchPrices: P(17.9), sortOrder: next() },
  { id: "bakso-urat", name: "Fish Ball Kuey Teow Soup", category: "bakso", description: "Fish balls with smooth kuey teow, vegetables and light broth.", choices: [{"label":"Noodle Type","options":["Kuey Teow","Mee Hoon","Yellow Mee"],"required":true},{"label":"Style","options":["Soup","Dry"]}], branchPrices: P(18.9), sortOrder: next() },
  { id: "bakso-goreng", name: "Chicken Ball Curry Mee", category: "bakso", description: "Chicken balls served in Malaysian curry broth with noodles and tofu puff.", choices: [{"label":"Noodle Type","options":["Yellow Mee","Mee Hoon","Mixed"],"required":true},{"label":"Spice Level","options":["Less Spicy","Normal","Extra Spicy"]}], spicy: true, branchPrices: P(18.9), sortOrder: next() },
  { id: "bakso-campur", name: "Mixed Ball Noodle Soup", category: "bakso", description: "Mixed beef ball, fish ball and chicken ball served with noodles.", choices: [{"label":"Noodle Type","options":["Yellow Mee","Mee Hoon","Kuey Teow"],"required":true},{"label":"Style","options":["Clear Soup","Curry Soup","Dry"]}], recommended: true, branchPrices: P(18.9), sortOrder: next() },
  { id: "nasi-soto-betawi", name: "Nasi Lemak Ayam Rendang", category: "nasi-meals", description: "Coconut rice with chicken rendang, sambal, egg, cucumber and peanuts.", choices: [{"label":"Sambal Level","options":["Less","Normal","Extra"]},{"label":"Egg","options":["Boiled Egg","Fried Egg"]}], spicy: true, recommended: true, branchPrices: P(28.9), sortOrder: next() },
  { id: "nasi-ayam-geprek", name: "Hainanese Chicken Rice", category: "nasi-meals", description: "Fragrant chicken rice served with steamed or roasted chicken and chilli sauce.", choices: [{"label":"Chicken","options":["Steamed","Roasted"],"required":true},{"label":"Rice","options":["Chicken Rice","White Rice"]},{"label":"Sauce","options":["Normal","Less Sauce","Chilli Separate"]}], recommended: true, branchPrices: P(26.9), sortOrder: next() },
  { id: "ikan-kembung-balado-meal", name: "Banana Leaf Chicken Rice", category: "nasi-meals", description: "Rice served with curry chicken, vegetables, papadom and curry gravy.", choices: [{"label":"Curry","options":["Chicken Curry","Fish Curry Gravy","Dhal"]},{"label":"Spice Level","options":["Mild","Normal","Spicy"]}], spicy: true, branchPrices: P(15.2), sortOrder: next() },
  { id: "ikan-pecel-lele-meal", name: "Char Siew Rice", category: "nasi-meals", description: "BBQ-style chicken char siew served with rice, cucumber and sauce.", choices: [{"label":"Sauce Level","options":["Normal","Less Sauce","More Sauce"]},{"label":"Rice","options":["White Rice","Chicken Rice"]}], branchPrices: P(14.2), sortOrder: next() },
  { id: "lidah-sapi-meal", name: "Nasi Kandar Ayam Goreng", category: "nasi-meals", description: "Rice with fried chicken, mixed curry gravy, vegetables and papadom.", choices: [{"label":"Gravy","options":["Kuah Campur","Dhal Only","Curry Only"]},{"label":"Spice Level","options":["Mild","Normal","Spicy"]}], spicy: true, recommended: true, branchPrices: P(23.9), sortOrder: next() },
  { id: "soto-betawi", name: "Sup Daging", category: "ala-carte", description: "Malaysian beef soup with herbs, potatoes and fried shallots.", choices: [{"label":"Soup Level","options":["Normal","More Soup"]},{"label":"Spice Level","options":["Mild","Normal","Extra Pepper"]}], branchPrices: P(25.9), sortOrder: next() },
  { id: "ayam-geprek", name: "Ayam Goreng Berempah", category: "ala-carte", description: "Spiced fried chicken with crispy herbs and house sambal.", choices: [{"label":"Cut","options":["Drumstick","Thigh","Mixed"]},{"label":"Spice Level","options":["Normal","Extra Sambal"]}], spicy: true, branchPrices: P(17.2), sortOrder: next() },
  { id: "ikan-kembung-balado", name: "Ikan Bakar Sambal", category: "ala-carte", description: "Grilled fish with sambal sauce and lime.", choices: [{"label":"Sambal Level","options":["Less","Normal","Extra"]},{"label":"Sauce","options":["Sambal On Top","Sambal Separate"]}], spicy: true, branchPrices: P(8.9), sortOrder: next() },
  { id: "ikan-pecel-lele", name: "Fried Chicken Chop", category: "ala-carte", description: "Crispy chicken chop served with black pepper or mushroom sauce.", choices: [{"label":"Sauce","options":["Black Pepper","Mushroom","Garlic Butter"],"required":true},{"label":"Side","options":["Fries","Rice","Salad"]}], branchPrices: P(7.2), sortOrder: next() },
  { id: "ikan-teri-terong-pete", name: "Kam Heong Chicken", category: "ala-carte", description: "Wok-fried chicken with curry leaves, dried chilli and savoury sauce.", choices: [{"label":"Spice Level","options":["Mild","Normal","Extra Spicy"]},{"label":"Sauce Level","options":["Normal","More Sauce"]}], spicy: true, branchPrices: P(7.9), sortOrder: next() },
  { id: "lidah-sapi", name: "Mutton Varuval", category: "ala-carte", description: "Indian-style dry mutton cooked with spices, curry leaves and onions.", choices: [{"label":"Spice Level","options":["Mild","Normal","Extra Spicy"]}], spicy: true, branchPrices: P(15.9), sortOrder: next() },
  { id: "sayur-tempe-kacang", name: "Kangkung Belacan", category: "vegetables", description: "Stir-fried kangkung with belacan and chilli.", choices: [{"label":"Spice Level","options":["Less Spicy","Normal","Extra Spicy"]},{"label":"Belacan","options":["Less","Normal"]}], spicy: true, branchPrices: P(5.9), sortOrder: next() },
  { id: "sayur-buncis-toge", name: "Stir-Fried Bean Sprouts", category: "vegetables", description: "Bean sprouts stir-fried with garlic and spring onion.", choices: [{"label":"Garlic","options":["Normal","Extra Garlic"]},{"label":"Style","options":["Crunchy","Softer"]}], branchPrices: P(4.2), sortOrder: next() },
  { id: "telor-krispi", name: "Acar Jelatah", category: "vegetables", description: "Malaysian cucumber and pineapple pickle with sweet-sour dressing.", choices: [{"label":"Dressing","options":["Less","Normal","More"]},{"label":"Spice Level","options":["Non-Spicy","Mild","Spicy"]}], branchPrices: P(4.2), sortOrder: next() },
  { id: "tahu-isi-goreng", name: "Cucur Udang", category: "gorengan", description: "Prawn fritters served with chilli sauce.", choices: [{"label":"Sauce","options":["Chilli Sauce","Peanut Sauce","No Sauce"]}], branchPrices: P(9.9), sortOrder: next() },
  { id: "tempe-mendoan", name: "Curry Puff", category: "gorengan", description: "Pastry filled with curried potato and chicken.", choices: [{"label":"Filling","options":["Potato Chicken","Potato Only"]},{"label":"Heat","options":["Warm","Room Temperature"]}], branchPrices: P(9.9), sortOrder: next() },
  { id: "bakwan-goreng", name: "Vegetable Pakora", category: "gorengan", description: "Indian-style vegetable fritters with spices.", choices: [{"label":"Sauce","options":["Mint Chutney","Chilli Sauce","No Sauce"]},{"label":"Spice Level","options":["Mild","Normal"]}], recommended: true, branchPrices: P(9.9), sortOrder: next() },
  { id: "pangsit-goreng-5", name: "Fried Wonton", category: "gorengan", description: "Crispy wonton filled with chicken and vegetables.", portion: "5 pcs", choices: [{"label":"Sauce","options":["Chilli Sauce","Mayo","No Sauce"]}], branchPrices: P(9.9), sortOrder: next() },
  { id: "pangsit-goreng-10", name: "Keropok Lekor", category: "gorengan", description: "Terengganu-style fish crackers served with chilli sauce.", portion: "10 pcs", choices: [{"label":"Style","options":["Crispy","Soft"]},{"label":"Sauce","options":["Chilli Sauce","No Sauce"]}], branchPrices: P(14), sortOrder: next() },
  { id: "pisang-goreng", name: "Fried Popiah", category: "gorengan", description: "Crispy spring rolls filled with vegetables.", choices: [{"label":"Sauce","options":["Chilli Sauce","Sweet Sauce","No Sauce"]},{"label":"Cut","options":["Cut","Do Not Cut"]}], recommended: true, branchPrices: P(9.9), sortOrder: next() },
  { id: "roti-bakar-coklat", name: "Kaya Butter Toast", category: "roti-bakar", description: "Toasted bread with kaya and cold butter slices.", choices: [{"label":"Toast Level","options":["Light","Normal","Extra Crispy"]},{"label":"Sweetness","options":["Normal","Less Kaya"]}], branchPrices: P(12.9), sortOrder: next() },
  { id: "roti-bakar-keju", name: "Peanut Butter Toast", category: "roti-bakar", description: "Toasted bread with creamy peanut butter.", choices: [{"label":"Toast Level","options":["Light","Normal","Extra Crispy"]},{"label":"Spread","options":["Normal","Extra Peanut Butter"]}], branchPrices: P(15.9), sortOrder: next() },
  { id: "roti-bakar-coklat-keju", name: "Milo & Kaya Toast", category: "roti-bakar", description: "Toasted bread with kaya and Milo powder.", choices: [{"label":"Toast Level","options":["Light","Normal","Extra Crispy"]},{"label":"Sweetness","options":["Normal","Less Sweet"]}], branchPrices: P(17.9), sortOrder: next() },
  { id: "kunyit-asam", name: "Teh Tarik", category: "jamu", description: "Pulled milk tea, Malaysian kopitiam style.", availableHotCold: true, recommended: true, branchPrices: P(9), sortOrder: next() },
  { id: "wedang-jahe", name: "Sirap Bandung", category: "jamu", description: "Rose syrup milk drink.", branchPrices: P(11), sortOrder: next() },
  { id: "yin-yang-earl-grey", name: "Kopi O", category: "coffee", description: "Local black coffee.", availableHotCold: true, branchPrices: P(11), sortOrder: next() },
  { id: "kopi-gula-aren", name: "Kopi", category: "coffee", description: "Local coffee with condensed milk.", availableHotCold: true, branchPrices: P(9), sortOrder: next() },
  { id: "kopi-o", name: "Cham", category: "coffee", description: "Malaysian coffee and tea mix.", availableHotCold: true, branchPrices: P(7), sortOrder: next() },
  { id: "kopi-susu", name: "White Coffee", category: "coffee", description: "Ipoh-style white coffee.", availableHotCold: true, branchPrices: P(8), sortOrder: next() },
  { id: "mineral-water", name: "Mineral Water", category: "non-coffee", description: "Bottled drinking water.", branchPrices: P(3.5), sortOrder: next() },
  { id: "teh-botol-sosro", name: "Chinese Tea", category: "non-coffee", description: "Light Chinese tea.", availableHotCold: true, branchPrices: P(5), sortOrder: next() },
  { id: "soda-gembira", name: "Milo Ais", category: "non-coffee", description: "Iced Milo drink.", branchPrices: P(5), sortOrder: next() },
  { id: "es-jeruk", name: "Fresh Lime Juice", category: "non-coffee", description: "Lime drink with refreshing citrus flavour.", branchPrices: P(6), sortOrder: next() },
  { id: "tea-o-jawa", name: "Barley", category: "non-coffee", description: "Homemade barley drink.", availableHotCold: true, branchPrices: P(3), sortOrder: next() },
  { id: "plain-water", name: "Soya Bean", category: "non-coffee", description: "Fresh soya bean drink.", branchPrices: P(1), sortOrder: next() },
  { id: "coke", name: "Coke", category: "soft-drinks", description: "Chilled soft drink.", branchPrices: P(5), sortOrder: next() },
  { id: "coke-zero", name: "Coke Zero", category: "soft-drinks", description: "Chilled soft drink.", branchPrices: P(5), sortOrder: next() },
  { id: "sprite", name: "Sprite", category: "soft-drinks", description: "Chilled soft drink.", branchPrices: P(5), sortOrder: next() },
  { id: "addon-bakso-halus", name: "Sambal", category: "add-ons", description: "House sambal.", choices: [{"label":"Spice Level","options":["Mild","Normal","Extra Spicy"]}], branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-bakso-urat", name: "Fried Egg", category: "add-ons", description: "Sunny-side-up egg.", choices: [{"label":"Doneness","options":["Runny","Fully Cooked"]}], branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-bakso-goreng", name: "Boiled Egg", category: "add-ons", description: "Boiled egg.", choices: [{"label":"Doneness","options":["Soft","Fully Boiled"]}], branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-pangsit-goreng", name: "Papadom", category: "add-ons", description: "Crispy Indian papadom.", choices: [{"label":"Quantity","options":["1 pc","2 pcs"]}], branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-pangsit-rebus", name: "Begedil", category: "add-ons", description: "Potato patty.", choices: [{"label":"Quantity","options":["1 pc","2 pcs"]}], branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-tahu-isi-bakso", name: "Fried Tofu", category: "add-ons", description: "Fried tofu pieces.", choices: [{"label":"Sauce","options":["Chilli Sauce","Peanut Sauce","No Sauce"]}], branchPrices: P(4.9), sortOrder: next() },
  { id: "addon-pangsit-bawang", name: "Keropok", category: "add-ons", description: "Crispy crackers.", choices: [{"label":"Quantity","options":["Small","Regular"]}], branchPrices: P(1.5), sortOrder: next() },
  { id: "addon-kerupuk-emping", name: "Fish Cake", category: "add-ons", description: "Sliced fish cake.", choices: [{"label":"Style","options":["Fried","Soup"]}], branchPrices: P(5), sortOrder: next() },
  { id: "addon-kerupuk-merah", name: "Extra Rice", category: "add-ons", description: "Extra white rice.", choices: [{"label":"Rice Type","options":["White Rice","Chicken Rice","Coconut Rice"]}], branchPrices: P(3), sortOrder: next() },
  { id: "addon-soo-hoon", name: "Extra Noodles", category: "add-ons", description: "Add extra noodles to noodle dishes.", choices: [{"label":"Noodle Type","options":["Yellow Mee","Mee Hoon","Kuey Teow"]}], branchPrices: P(3.2), sortOrder: next() },
  { id: "addon-mihun", name: "Extra Curry Gravy", category: "add-ons", description: "Extra curry or dhal gravy.", choices: [{"label":"Gravy Type","options":["Chicken Curry","Fish Curry","Dhal"]},{"label":"Spice Level","options":["Mild","Normal","Spicy"]}], branchPrices: P(3.2), sortOrder: next() },
];

// Per-item card thumbnails. Noodle sections (Noodle Horfun + Fish Ball Bihun
// Noodle) use the noodle illustration; Rice Meal uses the rice illustration;
// beverages use the water illustration; À La Carte + Vegetables keep their dish
// photos; Fried Food + Toast have no thumbnail (text-only cards).
const MENU_IMAGES: Record<string, string> = {
  // Noodle Horfun (mie-ayam) + Fish Ball Bihun Noodle (bakso) → noodle
  "mie-ayam-original": "/images/menu-noodle.png",
  "mie-ayam-manis": "/images/menu-noodle.png",
  "mie-ayam-bakso": "/images/menu-noodle.png",
  "bakso-halus": "/images/menu-noodle.png",
  "bakso-urat": "/images/menu-noodle.png",
  "bakso-goreng": "/images/menu-noodle.png",
  "bakso-campur": "/images/menu-noodle.png",
  // Rice Meal → rice
  "nasi-soto-betawi": "/images/menu-rice.png",
  "nasi-ayam-geprek": "/images/menu-rice.png",
  "ikan-kembung-balado-meal": "/images/menu-rice.png",
  "ikan-pecel-lele-meal": "/images/menu-rice.png",
  "lidah-sapi-meal": "/images/menu-rice.png",
  // À La Carte → steak illustration thumbnail
  "soto-betawi": "/images/thumb-steak.png",
  "ayam-geprek": "/images/thumb-steak.png",
  "ikan-kembung-balado": "/images/thumb-steak.png",
  "ikan-pecel-lele": "/images/thumb-steak.png",
  "ikan-teri-terong-pete": "/images/thumb-steak.png",
  "lidah-sapi": "/images/thumb-steak.png",
  // Vegetables & Sides → vege illustration thumbnail
  "sayur-tempe-kacang": "/images/thumb-vege.png",
  "sayur-buncis-toge": "/images/thumb-vege.png",
  "telor-krispi": "/images/thumb-vege.png",
  // Fried Food → curry puff illustration thumbnail
  "tahu-isi-goreng": "/images/thumb-curry-puff.png",
  "tempe-mendoan": "/images/thumb-curry-puff.png",
  "bakwan-goreng": "/images/thumb-curry-puff.png",
  "pangsit-goreng-5": "/images/thumb-curry-puff.png",
  "pangsit-goreng-10": "/images/thumb-curry-puff.png",
  "pisang-goreng": "/images/thumb-curry-puff.png",
  // Beverages → water
  "kunyit-asam": "/images/menu-water.png",
  "wedang-jahe": "/images/menu-water.png",
  "yin-yang-earl-grey": "/images/menu-water.png",
  "kopi-gula-aren": "/images/menu-water.png",
  "kopi-o": "/images/menu-water.png",
  "kopi-susu": "/images/menu-water.png",
  "mineral-water": "/images/menu-water.png",
  "teh-botol-sosro": "/images/menu-water.png",
  "soda-gembira": "/images/menu-water.png",
  "es-jeruk": "/images/menu-water.png",
  "tea-o-jawa": "/images/menu-water.png",
  "plain-water": "/images/menu-water.png",
  "coke": "/images/menu-water.png",
  "coke-zero": "/images/menu-water.png",
  "sprite": "/images/menu-water.png",
};
menu.forEach((m) => {
  if (MENU_IMAGES[m.id]) m.image = MENU_IMAGES[m.id];
});

// Assign per-category display codes (e.g. A1, B2). Beverages share one "H"
// series; add-ons use "T". Numbered in menu order within each prefix.
const CODE_PREFIX: Record<string, string> = {
  "mie-ayam": "A",
  bakso: "B",
  "nasi-meals": "C",
  "ala-carte": "D",
  vegetables: "E",
  gorengan: "F",
  "roti-bakar": "G",
  jamu: "H",
  coffee: "H",
  "non-coffee": "H",
  "soft-drinks": "H",
  "add-ons": "T",
};
const codeCounters: Record<string, number> = {};
menu.forEach((m) => {
  const prefix = CODE_PREFIX[m.category];
  if (!prefix) return;
  codeCounters[prefix] = (codeCounters[prefix] ?? 0) + 1;
  m.code = `${prefix}${codeCounters[prefix]}`;
});

export const getMenuByCategory = (catId: string) =>
  menu.filter((m) => m.category === catId).sort((a, b) => a.sortOrder - b.sortOrder);

export const recommendedItems = menu.filter((m) => m.recommended);

// Items seen in Google content but not confirmed in the supplied menu.
export const pendingMenuItems = [
  "Sarawak Laksa",
  "Mee Kolok",
  "Salted Egg Pasta",
  "Buttermilk Chicken Waffle",
  "Butter Beer",
];

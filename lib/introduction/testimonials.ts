// 13 restaurant-owner testimonials — kept in their original language (not tied to
// the UI language toggle, which is natural for real reviews).
// Image avatars point at /images/testimonials/*.jpg. Drop those files into
// public/images/testimonials/ to swap the initial fallback for a real portrait.

export type Testimonial = {
  name: string;
  role: string;
  language: "Malay" | "Chinese" | "English";
  initial: string;
  image: string | null;
  review: string;
  rating: number;
};

export const TESTIMONIALS: Testimonial[] = [
  { name: "Hafiz", role: "Nasi kandar stall owner", language: "Malay", initial: "H", image: null, review: "Website MENUU memang mesra mobile. Pelanggan boleh tengok menu dulu, baru datang. Senang untuk kami dan pelanggan.", rating: 5 },
  { name: "Nur Aisyah", role: "Cafe owner", language: "Malay", initial: "A", image: "/images/testimonials/nur-aisyah.jpg", review: "Lepas guna MENUU, pelanggan lebih mudah faham apa yang kami jual. Banyak yang dah pilih makanan sebelum sampai.", rating: 5 },
  { name: "Farid", role: "Burger stall owner", language: "Malay", initial: "F", image: null, review: "Saya suka sebab tak perlu bayar komisen macam platform delivery. MENUU bantu pelanggan order direct dengan kami.", rating: 5 },
  { name: "Azlan", role: "Warung owner", language: "Malay", initial: "A", image: null, review: "Pelanggan dari Google boleh terus tengok menu dan rancang order. Nampak lebih kemas dan profesional.", rating: 5 },
  { name: "Siti Mariam", role: "Restaurant owner", language: "Malay", initial: "S", image: "/images/testimonials/siti-mariam.jpg", review: "MENUU bantu kurangkan soalan berulang tentang menu. Pelanggan dah boleh tengok harga dan pilihan sebelum datang.", rating: 5 },
  { name: "Mei Ling", role: "Cafe owner", language: "Chinese", initial: "M", image: "/images/testimonials/mei-ling.jpg", review: "顾客可以先看菜单，再决定要吃什么。到店之前已经有想法，点餐过程更顺畅。", rating: 5 },
  { name: "Tan Wei Jian", role: "Hawker stall owner", language: "Chinese", initial: "T", image: null, review: "MENUU 让我们的餐厅看起来更专业。顾客从 Google 找到我们后，可以直接浏览菜单。", rating: 5 },
  { name: "Lim Pei Yee", role: "Dessert shop owner", language: "Chinese", initial: "L", image: null, review: "不用被平台抽高佣金，顾客可以直接联系店家。对小店来说很有帮助。", rating: 5 },
  { name: "Amirul", role: "Restaurant owner", language: "English", initial: "A", image: null, review: "MENUU makes our menu easier to discover from Google. Customers can browse first and arrive with a clearer decision.", rating: 5 },
  { name: "Nadia", role: "Cafe owner", language: "English", initial: "N", image: "/images/testimonials/nadia.jpg", review: "It feels more professional than just sending a PDF menu. Customers can explore our food properly before visiting.", rating: 5 },
  { name: "Jason Tan", role: "Restaurant manager", language: "English", initial: "J", image: null, review: "The biggest win is direct ordering. We keep more margin and still give customers a smooth browsing experience.", rating: 5 },
  { name: "Chloe Wong", role: "Bakery owner", language: "English", initial: "C", image: "/images/testimonials/chloe-wong.jpg", review: "Customers often check our menu before coming. MENUU makes that journey feel clean, simple, and branded.", rating: 5 },
  { name: "Suresh", role: "Mamak restaurant owner", language: "English", initial: "S", image: null, review: "No commission, no complicated setup. It helps us look modern while keeping the customer relationship direct.", rating: 5 },
];

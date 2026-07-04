// Warung Jakarta /menu — faithful replica content for the hero phone preview.
import type { LucideIcon } from "lucide-react";
import { Store, Bike, CalendarDays } from "lucide-react";

export type WjItem = { code: string; name: string; price: number; pcs?: string };
export type WjGroup = { label: string; items: WjItem[] };
export type WjCategory = { id: string; name: string; desc: string; items?: WjItem[]; groups?: WjGroup[] };

export const WJ = {
  brand: "Warung Jakarta",
  brandSub: "RASA ORIGINAL JAKARTA",
  eyebrow: "Rancang Hidangan Anda Sekarang",
  titleA: "Pilih lokasi anda",
  titleB: "dan rancang hidangan",
  desc: "Terokai menu penuh, rancang hidangan anda, dan nikmati pengalaman menjamu selera yang lancar.",
  rating: "4.6",
  reviews: "500+ Ulasan Gabungan",
  branchHeading: "PILIH CAWANGAN PILIHAN ANDA",
  modeHeading: "APA RANCANGAN ANDA?",
  modeNote:
    "Ini bukan prapesanan. Bina senarai hidangan untuk merancang lawatan kumpulan anda — ia tidak menempah meja atau menghantar pesanan.",
  chipsNote: "Menu penuh ada di bawah. Ketik kategori untuk terus ke situ.",
  veg: "Mesra vegetarian",
  add: "Tambah",
  planTitle: "Pelan Makan Anda",
  itemWord: "Item",
  emptyTitle: "Pelan makan anda masih kosong",
  emptyDesc: "Pilih hidangan dari menu untuk mula merancang makan anda.",
  pay: "Bayar",
  receipt: "Resit",
  privacy: "Senarai anda peribadi dan selamat.",
};

// Item detail bottom-sheet labels + options
export const SHEET = {
  remark: "Catatan",
  remarkPlaceholder: "cth. kurang pedas, tanpa daun bawang",
  allergy: "Alahan",
  addons: "Tambahan",
  addToPlan: "Tambah ke Pelan",
};

export const ALLERGIES = ["Egg", "Peanut", "Seafood", "Dairy", "Spicy", "Gluten"];

export const ADDONS: { id: string; label: string; price: number }[] = [
  { id: "noodles", label: "Tambah Mi", price: 2.0 },
  { id: "egg", label: "Telur Goreng", price: 1.5 },
  { id: "broth", label: "Tambah Kuah", price: 1.0 },
  { id: "sambal", label: "Sambal Extra", price: 1.0 },
];

export const BRANCHES = [
  { id: "SS4", badge: "OPEN DAILY", status: "Buka", hours: "10:00 AM – 10:00 PM", open: true },
  { id: "KLCW", badge: "MON–SAT", status: "Tutup", hours: "10:00 AM – 5:30 PM", open: false },
];

export const MODES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "datang", label: "Datang", icon: Store },
  { id: "hantar", label: "Hantar", icon: Bike },
  { id: "book", label: "Book", icon: CalendarDays },
];

export const CATEGORIES: WjCategory[] = [
  {
    id: "mie-ayam",
    name: "Mie Ayam",
    desc: "Mie gandum kuning buatan tangan disiram ayam berperisa dan kuah hangat.",
    items: [
      { code: "A1", name: "Mie/Bihun Ayam Original", price: 23.9 },
      { code: "A2", name: "Mie/Bihun Ayam Kicap Manis", price: 23.9 },
      { code: "A3", name: "Mie/Bihun Ayam Bakso", price: 27.9 },
    ],
  },
  {
    id: "bakso",
    name: "Bakso",
    desc: "Sup bebola daging Indonesia yang menyelerakan dengan mi, tauhu, wantan rangup dan hiasan beraroma.",
    items: [
      { code: "B1", name: "Bakso Daging Lembut", price: 17.9 },
      { code: "B2", name: "Bakso Daging Urat", price: 18.9 },
      { code: "B3", name: "Bakso Daging Goreng", price: 18.9 },
      { code: "B4", name: "Bakso Daging Campur", price: 18.9 },
    ],
  },
  {
    id: "set-nasi",
    name: "Set Nasi",
    desc: "Hidangan nasi tradisional Indonesia dengan perisa kaya dan sambal asli.",
    items: [
      { code: "C1", name: "Nasi Soto Betawi", price: 28.9 },
      { code: "C2", name: "Nasi Ayam Geprek", price: 26.9 },
      { code: "C3", name: "Nasi Ikan Kembung Goreng Balado", price: 15.2 },
      { code: "C4", name: "Nasi Ikan Keli Goreng", price: 14.2 },
      { code: "C5", name: "Nasi Lidah Lembu Tumis Pedas", price: 23.9 },
    ],
  },
  {
    id: "a-la-carte",
    name: "À La Carte",
    desc: "Hidangan utama istimewa secara berasingan.",
    items: [
      { code: "D1", name: "Soto Betawi", price: 25.9 },
      { code: "D2", name: "Ayam Geprek", price: 17.2 },
      { code: "D3", name: "Ikan Kembung Goreng Balado", price: 8.9 },
      { code: "D4", name: "Ikan Keli Goreng", price: 7.2 },
      { code: "D5", name: "Ikan Bilis Tumis Terung Petai", price: 7.9 },
      { code: "D6", name: "Lidah Lembu Tumis Pedas", price: 15.9 },
    ],
  },
  {
    id: "sayur-lauk",
    name: "Sayur & Lauk",
    desc: "Hidangan sayur segar dan lauk kecil yang menyelerakan.",
    items: [
      { code: "S1", name: "Tempe Tumis Kacang Panjang", price: 5.9 },
      { code: "S2", name: "Kacang Buncis Tauge Tumis Bakso", price: 4.2 },
      { code: "S3", name: "Telur Goreng Rangup", price: 4.2 },
    ],
  },
  {
    id: "gorengan",
    name: "Gorengan",
    desc: "Kegemaran Indonesia yang rangup, baru digoreng dan sesuai dikongsi bersama.",
    items: [
      { code: "G1", name: "Tauhu Sumbat Goreng", pcs: "3 pcs", price: 9.9 },
      { code: "G2", name: "Tempe Mendoan", pcs: "4 pcs", price: 9.9 },
      { code: "G3", name: "Cucur Sayur", pcs: "4 pcs", price: 9.9 },
      { code: "G4", name: "Wantan Goreng", pcs: "5 pcs", price: 9.9 },
      { code: "G5", name: "Wantan Goreng", pcs: "10 pcs", price: 14.0 },
      { code: "G6", name: "Pisang Goreng", price: 9.9 },
    ],
  },
  {
    id: "roti-bakar",
    name: "Roti Bakar",
    desc: "Roti bakar Indonesia dengan inti hangat yang menyelerakan dan perisa manis klasik.",
    items: [
      { code: "F1", name: "Roti Bakar Coklat", price: 12.9 },
      { code: "F2", name: "Roti Bakar Keju", price: 15.9 },
      { code: "F3", name: "Roti Bakar Coklat Keju", price: 17.9 },
    ],
  },
  {
    id: "minuman",
    name: "Minuman",
    desc: "Minuman tradisional yang menyegarkan, kopi buatan tangan dan kegemaran harian untuk setiap hidangan.",
    groups: [
      {
        label: "Jamu Tradisional",
        items: [
          { code: "H1", name: "Air Kunyit Asam", price: 9.0 },
          { code: "H2", name: "Air Halia Hangat", price: 11.0 },
        ],
      },
      {
        label: "Kopi",
        items: [
          { code: "H3", name: "Yin & Yang Earl Grey", price: 11.0 },
          { code: "H4", name: "Kopi Gula Aren/Melaka", price: 9.0 },
          { code: "H5", name: "Kopi O", price: 7.0 },
          { code: "H6", name: "Kopi Susu", price: 8.0 },
        ],
      },
      {
        label: "Bukan Kopi",
        items: [
          { code: "H7", name: "Air Mineral", price: 3.5 },
          { code: "H8", name: "Teh Botol Sosro", price: 5.0 },
          { code: "H9", name: "Soda Gembira", price: 5.0 },
          { code: "H10", name: "Air Oren Ais", price: 6.0 },
          { code: "H11", name: "Teh O Jawa", price: 3.0 },
          { code: "H12", name: "Air Kosong", price: 1.0 },
        ],
      },
      {
        label: "Minuman Ringan",
        items: [
          { code: "H13", name: "Coke", price: 5.0 },
          { code: "H14", name: "Coke Zero", price: 5.0 },
          { code: "H15", name: "Sprite", price: 5.0 },
        ],
      },
    ],
  },
  {
    id: "tambahan",
    name: "Tambahan / Lauk",
    desc: "Tambah lagi untuk menjadikan hidangan anda lebih sempurna.",
    items: [
      { code: "T1", name: "Bakso Daging Lembut", pcs: "3 pcs", price: 4.9 },
      { code: "T2", name: "Bakso Daging Urat", pcs: "2 pcs", price: 4.9 },
      { code: "T3", name: "Bakso Daging Goreng", pcs: "2 pcs", price: 4.9 },
      { code: "T4", name: "Wantan Goreng", pcs: "2 pcs", price: 4.9 },
      { code: "T5", name: "Wantan Rebus", pcs: "2 pcs", price: 4.9 },
      { code: "T6", name: "Tauhu Sumbat Bakso Daging", pcs: "2 pcs", price: 4.9 },
      { code: "T7", name: "Wantan Bawang", pcs: "2 pcs", price: 1.5 },
      { code: "T8", name: "Keropok Emping Melinjo", price: 5.0 },
      { code: "T9", name: "Keropok Udang Merah", price: 3.0 },
      { code: "T10", name: "Soohun", price: 3.2 },
      { code: "T11", name: "Mihun", price: 3.2 },
    ],
  },
];

// flat lookup of every item by code (for cart math)
export const ITEM_BY_CODE: Record<string, WjItem> = {};
for (const c of CATEGORIES) {
  for (const it of c.items ?? []) ITEM_BY_CODE[it.code] = it;
  for (const g of c.groups ?? []) for (const it of g.items) ITEM_BY_CODE[it.code] = it;
}

export const rm = (n: number) => `RM ${n.toFixed(2)}`;

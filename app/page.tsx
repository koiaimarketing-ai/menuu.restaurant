import { HeroSection } from "@/components/hero/HeroSection";
import { FloatingDish } from "@/components/hero/FloatingDish";
import { OurStory } from "@/components/OurStory";
import { HomeContent } from "@/components/home/HomeContent";
import { menu } from "@/data/menu";

// Warung Jakarta Picks — featured dishes (in order).
const PICK_IDS = [
  "mie-ayam-original",
  "bakso-campur",
  "tempe-mendoan",
  "nasi-ayam-geprek",
  "ikan-kembung-balado-meal",
  "ikan-pecel-lele-meal",
];
const featuredPicks = PICK_IDS.map((id) => menu.find((m) => m.id === id)).filter(
  (m): m is NonNullable<typeof m> => Boolean(m)
);

export default function HomePage() {
  const picks = featuredPicks.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.branchPrices["kl-central-walk"],
  }));

  return (
    <>
      {/* ===================== HERO ===================== */}
      <HeroSection />

      {/* ===== DISH TRANSITION LAYER — sits above both section backgrounds ===== */}
      <FloatingDish />

      {/* ===== OUR STORY — second section, receives the dish overlap ===== */}
      <OurStory />

      {/* ===== Remaining sections (translated client content) ===== */}
      <HomeContent picks={picks} />
    </>
  );
}

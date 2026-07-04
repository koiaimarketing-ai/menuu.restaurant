import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./introduction.css";
import { LanguageProvider } from "@/components/introduction/providers/language-provider";
import { Navbar } from "@/components/introduction/layout/navbar";
import { StickyCta } from "@/components/introduction/layout/sticky-cta";
import { Footer } from "@/components/introduction/layout/footer";
import { ModernScrollbar } from "@/components/introduction/ui/modern-scrollbar";

// The introduction landing page carries its OWN fonts + chrome, scoped to this
// route. The restaurant site's navbar/footer/floating chrome are suppressed on
// /introduction by SiteChrome (see components/SiteChrome.tsx).
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MENUU — Malaysia's First Pre-Arrival Restaurant Ordering Website",
  description:
    "A mobile-friendly website that lets customers browse your menu, decide what to eat, and order or enquire before they arrive. No transaction fees. Better branding from Google.",
};

export default function IntroductionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className={`intro-scope ${display.variable} ${sans.variable}`}>
      <LanguageProvider>
        <Navbar />
        {children}
        <StickyCta />
        <Footer />
        <ModernScrollbar />
      </LanguageProvider>
    </div>
  );
}

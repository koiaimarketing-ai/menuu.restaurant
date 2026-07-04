import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MealPlanProvider } from "@/lib/meal-plan-store";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ReceiptHost } from "@/components/planner/ReceiptHost";
import { CheckoutHost } from "@/components/planner/CheckoutHost";
import { AmbientAudioProvider } from "@/lib/ambient-audio";
import { EntranceOverlay } from "@/components/EntranceOverlay";
import { AmbientSoundToggle } from "@/components/AmbientSoundToggle";
import { BackToTop } from "@/components/BackToTop";
import { MobileScrollbar } from "@/components/MobileScrollbar";
import { MobileMenuCta } from "@/components/MobileMenuCta";

// Pre-paint gate: show the entrance at most once per "day cycle" that resets at
// 09:00 local (Malaysia) time. We only set data-entrance="show" when the stored
// next-show timestamp has passed. If localStorage is unavailable, show normally.
// Runs before paint so there is never a flash of Home first.
// Never on /introduction — the overlay doesn't render there, and the attribute's
// body scroll lock (html[data-entrance="show"]) would otherwise stick forever
// and kill all anchor/section scrolling on that page.
const ENTRANCE_GATE = `(function(){try{
  if(location.pathname.indexOf("/introduction")===0)return;
  var KEY="warung_welcome_next_show_at";
  var next=Number(localStorage.getItem(KEY)||0);
  if(!next||Date.now()>=next){document.documentElement.setAttribute('data-entrance','show');}
}catch(e){document.documentElement.setAttribute('data-entrance','show');}})();`;

// Menuu brand type system: Bricolage Grotesque (display/headings) +
// DM Sans (body/UI). Kept on the existing CSS variable names (--font-fraunces =
// heading, --font-manrope = body) so every existing usage picks them up.
const fraunces = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const manrope = DM_Sans({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Menuu | Authentic Indonesian-Style Food in Petaling Jaya",
  description:
    "Discover comforting Indonesian-style food, homemade noodles, bakso and street-food favourites at Menuu — Taman Sea, Petaling Jaya.",
};

// viewportFit "cover" is required for env(safe-area-inset-*) to resolve to real
// values — without it the bottom CTA + back-to-top ignore the iOS home indicator
// and Android gesture area. Applies site-wide.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ms"
      className={`${fraunces.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: ENTRANCE_GATE }} />
        <LanguageProvider>
        <MealPlanProvider>
          <AmbientAudioProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ReceiptHost />
            <CheckoutHost />
            <AmbientSoundToggle />
            <BackToTop />
            <MobileScrollbar />
            <MobileMenuCta />
            <EntranceOverlay />
          </AmbientAudioProvider>
        </MealPlanProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

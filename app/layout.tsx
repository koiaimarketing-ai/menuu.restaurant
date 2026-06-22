import type { Metadata } from "next";
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

// Pre-paint gate: show the entrance on every full page load (refresh / new tab)
// before paint, so there is never a flash of Home first. Internal client
// navigations don't re-run this and keep the (already dismissed) overlay hidden.
const ENTRANCE_GATE = `document.documentElement.setAttribute('data-entrance','show');`;

// Warung Jakarta brand type system: Bricolage Grotesque (display/headings) +
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
  title: "Warung Jakarta | Indonesian Food in SS4 & KL Central Walk",
  description:
    "Discover Indonesian comfort food, homemade noodles, bakso and Jakarta favourites at Warung Jakarta in SS4 and KL Central Walk.",
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
            <EntranceOverlay />
          </AmbientAudioProvider>
        </MealPlanProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Menuu brand palette — Blue / White ----
        // Primary #2258DA, White surfaces, Deep Navy #081127 text.
        // Clean blue-and-white: ~70% white / 20% blue / 10% navy-ink.
        primary: {
          DEFAULT: "#2258DA", // Primary Blue
          hover: "#1D46B7", // Primary Blue Dark / hover
          active: "#1D46B7",
          soft: "#EEF3FF", // soft blue tint
        },
        heading: "#081127", // Deep Navy — titles & main headings
        body: "#202F4F", // Ink Blue — paragraph & secondary text
        cream: "#F8F9FC", // page background
        coral: "#6A93F1", // accent blue (glow / highlight)
        secondary: "#EEF3FF", // soft blue tint surface (chips/badges)
        sand: "#DDE4F7", // light border blue
        copper: "#1D46B7",
        espresso: "#081127",
        // forest/green tokens are the meal-planner accent — mapped onto the
        // primary blue so CTAs and price highlights stay on-palette.
        forest: {
          DEFAULT: "#1D46B7",
          light: "#2258DA",
          hover: "#15357F",
        },
        green: {
          DEFAULT: "#2258DA",
          hover: "#1D46B7",
          active: "#1D46B7",
          text: "#1D46B7", // deep blue for totals/prices (AA on white)
          dark: "#1D46B7",
          soft: "#EEF3FF",
          bd: "#DDE4F7",
        },
        ink: {
          primary: "#081127", // Deep Navy
          secondary: "#202F4F", // Ink Blue
          supporting: "#6B7589", // Muted Slate
          muted: "#6B7589", // Muted Slate
        },
        line: {
          light: "#DDE4F7", // light border blue
          medium: "#DDE4F7",
          warm: "rgba(8,17,39,0.12)",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(8,17,39,0.08)",
        card: "0 14px 40px rgba(8,17,39,0.10)",
      },
      maxWidth: {
        site: "1320px",
      },
    },
  },
  plugins: [],
};

export default config;

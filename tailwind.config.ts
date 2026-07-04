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
          dark: "#1D46B7", // /introduction alias (primary-dark)
          accent: "#6A93F1", // /introduction alias (primary-accent)
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
          DEFAULT: "#202F4F", // /introduction: text-ink
          primary: "#081127", // Deep Navy
          secondary: "#202F4F", // Ink Blue
          supporting: "#6B7589", // Muted Slate
          muted: "#6B7589", // Muted Slate
          700: "#2b3c5e", // /introduction ramp
          800: "#202F4F",
          900: "#081127",
          950: "#081127",
        },
        line: {
          DEFAULT: "#DDE4F7", // /introduction: border-line
          light: "#DDE4F7", // light border blue
          medium: "#DDE4F7",
          warm: "rgba(8,17,39,0.12)",
        },
        // ---- /introduction landing tokens (additive; only that route uses them) ----
        brand: {
          50: "#eef3ff", 100: "#dde4f7", 200: "#c2d2f6", 300: "#9db8f4",
          400: "#6a93f1", 500: "#3d6fe6", 600: "#2258da", 700: "#1d46b7",
          800: "#173a99", 900: "#102c73",
        },
        mist: { 50: "#f8f9fc", 100: "#eef3ff" },
        navy: "#081127",
        page: "#f8f9fc",
        slate: "#6b7589",
        "soft-blue": "#eef3ff",
        "border-blue": "#dde4f7",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"], // /introduction headings
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

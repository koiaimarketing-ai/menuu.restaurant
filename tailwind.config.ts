import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Warung Jakarta brand palette ----
        // Red #E24A34 (primary), White (surfaces), Dark Coffee Brown #3B241B (text).
        // 70% white / 20% red / 10% brown overall ratio.
        primary: {
          DEFAULT: "#E24A34", // Warung Jakarta Red
          hover: "#C73D28",
          active: "#B5331F",
          soft: "#FDE8E4", // light red tint (gradient B end)
        },
        heading: "#3B241B", // Dark Coffee Brown
        body: "#4A352B",
        cream: "#FFF8F6", // near-white warm base
        coral: "#F6C9BE", // soft red glow
        secondary: "#F7EDE9", // warm light neutral (chips/badges)
        sand: "#E7D8D0",
        copper: "#B5331F",
        espresso: "#3B241B",
        // forest/green were the old meal-planner accent — remapped onto brand red
        // so meal-plan CTAs and price highlights stay on-palette.
        forest: {
          DEFAULT: "#B5331F",
          light: "#C73D28",
          hover: "#9E2C1A",
        },
        green: {
          DEFAULT: "#E24A34",
          hover: "#C73D28",
          active: "#B5331F",
          text: "#B5331F", // deep red for totals/prices (AA on white)
          dark: "#B5331F",
          soft: "#FDE8E4",
          bd: "#F3C5BA",
        },
        ink: {
          primary: "#3B241B", // Dark Coffee Brown
          secondary: "#6B5249",
          supporting: "#7C6358",
          muted: "#8A7164",
        },
        line: {
          light: "#EFE4DF",
          medium: "#E3D5CE",
          warm: "rgba(59,36,27,0.14)",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(59,36,27,0.08)",
        card: "0 14px 40px rgba(59,36,27,0.10)",
      },
      maxWidth: {
        site: "1320px",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pit-lane at night: wet asphalt, running lights, flame.
        asphalt: {
          50: "#f4f5f6",
          200: "#c7ccd1",
          400: "#5b6470",
          700: "#1b1f26", // panels
          800: "#12151a",
          900: "#0a0c0f", // page background
          950: "#050608",
        },
        flame: {
          300: "#ffb27a",
          400: "#ff8a3d",
          500: "#ff5a1f", // primary accent
          600: "#e6420f",
          700: "#b32f09",
        },
        ember: {
          400: "#ff4d4d",
          500: "#ff2d2d", // secondary accent / danger
          600: "#d81e1e",
        },
        caution: {
          400: "#ffd23f",
          500: "#ffc400", // yellow flag accent
        },
        chrome: {
          300: "#e7e9ec",
          400: "#c9ccd1",
          600: "#8b909a",
        },
      },
      fontFamily: {
        // Display: condensed, bold, numeral-forward — livery / race-number energy.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(255,90,31,0.08) 0%, rgba(10,12,15,0) 60%)",
      },
      animation: {
        marquee: "marquee 26s linear infinite",
        "spin-slow": "spin 3.2s linear infinite",
        flicker: "flicker 2.6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.72" },
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,90,31,0.35), 0 18px 40px -12px rgba(255,90,31,0.35)",
        panel: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.8)",
      },
    },
  },
  plugins: [],
};
export default config;

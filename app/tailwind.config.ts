import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm neutrals — Linear / Vercel inspired (no pure black)
        bg: {
          DEFAULT: "#FAFAF9",
          subtle: "#F4F4F5",
          dark: "#0F0F10",
          "dark-subtle": "#161618",
          "dark-elevated": "#1C1C1F",
        },
        border: {
          DEFAULT: "#E4E4E7",
          dark: "#27272A",
        },
        text: {
          primary: "#18181B",
          secondary: "#52525B",
          muted: "#A1A1AA",
          "primary-dark": "#F5F5F5",
          "secondary-dark": "#A1A1AA",
          "muted-dark": "#71717A",
        },
        accent: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          subtle: "#EEF2FF",
          "subtle-dark": "#1E1B4B",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": "11px",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};

export default config;

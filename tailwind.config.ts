import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
        },
        border: "var(--border)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          foreground: "var(--danger-foreground)",
        },
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
        },
        brand: {
          teal: "#19C59E",
          blue: "#3B82F6",
          purple: "#7C5CFF",
          dark: "#080C12",
          slate: "#8B95A7",
        },
      },
      boxShadow: {
        "glow-teal":   "0 0 25px -5px rgba(25, 197, 158, 0.35), 0 0 8px -3px rgba(25, 197, 158, 0.2)",
        "glow-blue":   "0 0 25px -5px rgba(59, 130, 246, 0.35), 0 0 8px -3px rgba(59, 130, 246, 0.2)",
        "glow-purple": "0 0 25px -5px rgba(124, 92, 255, 0.35), 0 0 8px -3px rgba(124, 92, 255, 0.2)",
        "glow-teal-lg": "0 0 45px -8px rgba(25, 197, 158, 0.45)",
        "card-hover":  "0 20px 40px -12px rgba(0, 0, 0, 0.45), 0 0 20px -8px rgba(25, 197, 158, 0.12)",
        "inset-top":   "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
      borderRadius: {
        sm:   "8px",
        md:   "10px",
        lg:   "14px",
        xl:   "18px",
        "2xl": "22px",
        "3xl": "28px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":  "linear-gradient(135deg, #19C59E 0%, #3B82F6 50%, #7C5CFF 100%)",
        "brand-gradient-r": "linear-gradient(to right, #19C59E, #3B82F6)",
        "cyber-grid": "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "3.5rem 3.5rem",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px -4px rgba(25, 197, 158, 0.3)" },
          "50%":       { boxShadow: "0 0 30px -4px rgba(25, 197, 158, 0.7)" },
        },
        "shimmer-slide": {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "fade-in-up":    "fade-in-up 0.5s ease forwards",
        "fade-in":       "fade-in 0.4s ease forwards",
        "slide-in-left": "slide-in-left 0.4s ease forwards",
        "float-y":       "float-y 3s ease-in-out infinite",
        "glow-pulse":    "glow-pulse 2.5s ease-in-out infinite",
        "shimmer":       "shimmer-slide 2.4s ease-in-out infinite",
        "gradient-shift":"gradient-shift 5s ease infinite",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

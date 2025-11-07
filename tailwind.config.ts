import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Doodle Design System Colors
        doodle: {
          cream: "#F5F5DC",
          sketch: "#2D2D2D",
          green: "#7FD8BE",
          orange: "#FF9671",
          purple: "#A685E2",
          blue: "#6FB1FC",
          yellow: "#FFE66D",
          pink: "#FFAAC9",
          mint: "#B4F8C8",
          lavender: "#CFBAF0",
          peach: "#FFC09F",
        },
        // Legacy AI bubble colors (keep for backward compatibility)
        "bubble-blue": "#3B82F6",
        "bubble-purple": "#A855F7",
        "bubble-pink": "#EC4899",
        "bubble-orange": "#F97316",
        "bubble-green": "#10B981",
        "bubble-cyan": "#06B6D4",
        "bubble-yellow": "#FBBF24",
        "bubble-rose": "#F43F5E",
        "bubble-indigo": "#6366F1",
        "bubble-teal": "#14B8A6",
      },
      fontFamily: {
        hand: ["var(--font-hand)", "cursive"],
        sketch: ["var(--font-sketch)", "cursive"],
        comic: ["var(--font-comic)", "cursive"],
        indie: ["var(--font-indie)", "cursive"],
      },
      fontSize: {
        display: ["56px", { lineHeight: "1.1" }],
        h1: ["48px", { lineHeight: "1.2" }],
        h2: ["36px", { lineHeight: "1.2" }],
        h3: ["28px", { lineHeight: "1.3" }],
        h4: ["24px", { lineHeight: "1.4" }],
      },
      boxShadow: {
        doodle:
          "2px 2px 0px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.05)",
        "doodle-hover":
          "6px 6px 0px rgba(0, 0, 0, 0.15), 12px 12px 0px rgba(0, 0, 0, 0.08)",
        "doodle-lg":
          "4px 4px 0px rgba(0, 0, 0, 0.1), 8px 8px 0px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "bounce-gentle": "bounceGentle 2s infinite",
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 1s ease-in-out",
      },
      keyframes: {
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(5deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "25%": { transform: "translateX(-5px) rotate(-3deg)" },
          "75%": { transform: "translateX(5px) rotate(3deg)" },
        },
        shimmer: {
          "0%, 100%": { transform: "translateX(-20px)" },
          "50%": { transform: "translateX(100px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

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
        // AI bubble color palette (8-10 vibrant options)
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
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 1s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;

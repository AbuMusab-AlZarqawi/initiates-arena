/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        mono: ["Space Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        obsidian: "#0a0a0f",
        void: "#06060a",
        ritty: { DEFAULT: "#c0392b", light: "#e74c3c", muted: "#7b241c" },
        bitty: { DEFAULT: "#27ae60", light: "#2ecc71", muted: "#1a6b3c" },
        ritualist: { DEFAULT: "#7d3c98", light: "#9b59b6", muted: "#4a235a" },
        radiant: { DEFAULT: "#f39c12", light: "#f1c40f", muted: "#9a6007" },
        slate: {
          850: "#1a1a2e",
          900: "#12121e",
          950: "#0d0d18",
        },
      },
      animation: {
        "slide-in-left": "slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shake": "shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        "rank-badge": "rankBadge 1s ease forwards",
        "flash": "flash 0.3s ease-in-out",
      },
      keyframes: {
        slideInLeft: {
          "0%": { transform: "translateX(-120%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(120%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px currentColor" },
          "50%": { boxShadow: "0 0 30px currentColor, 0 0 60px currentColor" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-2px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(4px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-6px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(6px, 0, 0)" },
        },
        rankBadge: {
          "0%": { transform: "scale(0) rotate(-10deg)", opacity: "0" },
          "60%": { transform: "scale(1.2) rotate(3deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};

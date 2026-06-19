/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        canvas: "#0a0c0b",
        panel: "#0f1311",
        panel2: "#141a17",
        panel3: "#1a211d",
        line: "#242b26",
        lineSoft: "#1b211c",
        ink: "#e9ece7",
        muted: "#8b948c",
        faint: "#5b635b",
        jade: {
          DEFAULT: "#3ddc97",
          soft: "#8af0c6",
          deep: "#16a37a",
        },
        amber: {
          DEFAULT: "#f5b13d",
          soft: "#f9cf7c",
        },
        ember: "#fb7185",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel:
          "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 18px 50px -24px rgba(0,0,0,0.85)",
        glow: "0 0 0 1px rgba(61,220,151,0.25), 0 0 26px -6px rgba(61,220,151,0.35)",
        amberGlow: "0 0 0 1px rgba(245,177,61,0.22), 0 0 22px -6px rgba(245,177,61,0.3)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sheen: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        sheen: "sheen 2.6s linear infinite",
        pulseDot: "pulseDot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

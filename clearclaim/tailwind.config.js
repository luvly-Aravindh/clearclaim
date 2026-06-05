/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#00BE5D",
          dark: "#00984A",
          deep: "#007038",
          light: "#D4EFD5",
          soft: "#EAF7E9",
        },
        navy: {
          DEFAULT: "#161D34",
          2: "#283655",
          3: "#3A4866",
        },
        blue: {
          DEFAULT: "#678EF0",
          light: "#EEF2FC",
        },
        yellow: {
          DEFAULT: "#FEB066",
          light: "#FFE6C2",
        },
        red: {
          DEFAULT: "#EC7D8C",
          light: "#F8D3D8",
        },
        slate: "#4A5468",
        mute: "#8590A0",
      },
      fontFamily: {
        archivo: ["Archivo", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(22,29,52,0.04), 0 1px 3px rgba(22,29,52,0.06)",
        md: "0 6px 16px rgba(22,29,52,0.05), 0 12px 32px rgba(22,29,52,0.07)",
        lg: "0 12px 40px rgba(22,29,52,0.08), 0 32px 80px rgba(22,29,52,0.10)",
        green:
          "0 8px 24px rgba(0,190,93,0.28), 0 2px 6px rgba(0,190,93,0.18)",
        "green-lg":
          "0 14px 36px rgba(0,190,93,0.36), 0 4px 10px rgba(0,190,93,0.22)",
      },
    },
  },
  plugins: [],
};

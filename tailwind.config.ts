import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  // เพิ่มส่วนนี้เข้าไป เพื่อให้ Tailwind อ่านไฟล์ในโปรเจกต์
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}", // เพิ่มโฟลเดอร์ context ของคุณด้วย
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-kanit)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;

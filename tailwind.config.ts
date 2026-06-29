import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        hover: "var(--hover)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        like: "var(--like)",
      },
      maxWidth: { feed: "640px" },
      borderRadius: { xl2: "18px" },
    },
  },
  plugins: [],
};
export default config;

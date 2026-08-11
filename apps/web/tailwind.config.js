/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: "#0a0c14",
          surface: "#13161f",
          border: "#242939",
          text: "#eef0f6",
          muted: "#8b93a7",
          accent: "#6366f1",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Verde principal del diseño
        primary: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#d1fae5",
        },
      },
    },
  },
  plugins: [],
};

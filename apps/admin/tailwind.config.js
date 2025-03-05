/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", 
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#F4E1D2",
          200: "#E9C3A5",
          300: "#DFA678",
          400: "#D4885B",
          500: "#B3804C", // Glavna primarna boja
          600: "#8F663D",
          700: "#6B4C2E",
          800: "#48321F",
          900: "#241910",
        },
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [],
};

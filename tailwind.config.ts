import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['"Nunito"', "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
        sen: ['"Sen"', "sans-serif"],
      },
      animation: {
        carousel: "carousel 120s infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;

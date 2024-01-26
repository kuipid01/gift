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
          dark: "#333333",
          "light-gray": "#9fa29c",
          "lighter-grey": "#c6c7c0",
          light: "#efefef",
       
      },
    },
  },
  plugins: [],
};
export default config;

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
        primary: "#25D366", // WhatsApp green
        secondary: "#128C7E",
        background: "#E5DDD5",
        surface: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
export default config;
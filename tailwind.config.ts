import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      'black-900': '#222831',
      'black-600': '#31363F',
      'blue-500': '#55989C',
      'blue-300': '#76ABAE',
      white: '#EEEEEE'
    }
  },
  plugins: [],
};
export default config;

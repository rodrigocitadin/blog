import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx"
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      light: '#EEEEEE',
      'black-900': '#222831',
      'black-600': '#31363F',
      'blue-500': '#55989C',
      'blue-300': '#76ABAE'
    }
  },
  plugins: [],
};
export default config;

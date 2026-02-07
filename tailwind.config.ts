import type { Config } from "tailwindcss";
import tatvaPreset from "./tailwind-preset";

const config: Config = {
  presets: [tatvaPreset],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [],
};

export default config;

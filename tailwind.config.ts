import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        mist: "#f4f1ea",
        paper: "#fffdf8",
        line: "#d9d3c7",
        moss: "#5f7355",
        clay: "#a15c38",
        bluegray: "#52687a"
      }
    }
  },
  plugins: []
};

export default config;

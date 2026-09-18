import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        muted: "#64748b",
        brand: { 50: "#eef5ff", 100: "#dbeafe", 500: "#2563eb", 600: "#1d4ed8", 700: "#1e40af" },
        mint: "#12b981"
      },
      boxShadow: { soft: "0 18px 50px rgba(15, 35, 65, .08)" }
    }
  },
  plugins: []
};
export default config;

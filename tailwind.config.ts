import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      colors: {
        ink: {
          900: "#1a1a1a",
          800: "#2d2d2d",
          700: "#404040",
          600: "#555555",
          500: "#737373",
          400: "#9a9a9a",
          300: "#bfbfbf",
          200: "#d9d9d9",
          100: "#efefef",
          50: "#fafafa"
        },
        paper: {
          900: "#e8e2d5",
          500: "#f5f1e8",
          200: "#faf7f0",
          100: "#fdfbf6",
          50: "#fffef9"
        },
        moss: {
          900: "#3d4a35",
          700: "#5f7355",
          500: "#7a8f6f",
          300: "#a8b8a0",
          100: "#dce5d7",
          50: "#f0f4ed"
        },
        clay: {
          900: "#6b3d24",
          700: "#a15c38",
          500: "#c07a56",
          300: "#e0b8a0",
          100: "#f3e2d6",
          50: "#faf1ea"
        },
        line: {
          DEFAULT: "#e5dfd3",
          strong: "#c9c1b0",
          soft: "#efeadd"
        }
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26, 26, 26, 0.04), 0 1px 3px rgba(26, 26, 26, 0.03)",
        card: "0 2px 8px rgba(26, 26, 26, 0.04), 0 1px 3px rgba(26, 26, 26, 0.03)",
        elevated: "0 8px 24px rgba(26, 26, 26, 0.06), 0 2px 6px rgba(26, 26, 26, 0.03)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.6)"
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",
        wide: "0.01em",
        wider: "0.03em",
        widest: "0.08em"
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }]
      },
      borderRadius: {
        lg: "10px",
        xl: "14px",
        "2xl": "18px"
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      }
    }
  },
  plugins: []
};

export default config;

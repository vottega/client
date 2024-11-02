import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadein: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        draw: {
          to: {
            "stroke-dashoffset": "0",
          },
        },
        "bounce-horizontal": {
          "0%": {
            transform: "translateX(0px)",
            "timing-function": "ease-in",
          },
          "37%": {
            transform: "translateX(5px)",
            "timing-function": "ease-out",
          },
          "55%": {
            transform: "translateX(-5px)",
            "timing-function": "ease-in",
          },
          "73%": {
            transform: "translateX(4px)",
            "timing-function": "ease-out",
          },
          "82%": {
            transform: "translateX(-4px)",
            "timing-function": "ease-in",
          },
          "91%": {
            transform: "translateX(2px)",
            "timing-function": "ease-out",
          },
          "96%": {
            transform: "translateX(-2px)",
            "timing-function": "ease-in",
          },
          "100%": {
            transform: "translateX(0px)",
            "timing-function": "ease-in",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s 'ease-out'",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadein: "fadein 0.5s ease-in-out",
        draw: "draw 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "bounce-horizontal": "bounce-horizontal 0.5s 0.25s",
      },
      screens: {
        tall: {
          raw: "(min-height: 800px)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

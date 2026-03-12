/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{astro,ts,tsx}',
    './src/layouts/**/*.{astro,ts,tsx}',
  ],
  safelist: [
    // ... deine bisherigen Einträge
    'bg-primary', 'text-primary-foreground',
    'hover:bg-primary', 'hover:bg-primary/90', 'hover:bg-primary/80',
    'active:bg-primary/95',
    'hover:shadow-md', 'hover:shadow-lg',
    'hover:scale-105', 'hover:scale-110',
  ],
  theme: {
    extend: {
      colors: {
        // primary explizit priorisieren
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        // ─── Semantische Status-Farben ───────────────────────────────
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(355.7 100% 97.3%)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(0 0% 10%)",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(0 0% 100%)",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(0 0% 100%)",
        },
        // ─── Brand-Farben ────────────────────────────────────────────
        brand: {
          primary:      "hsl(var(--brand-primary))",
          "primary-soft": "hsl(var(--brand-primary-soft))",
          secondary:    "hsl(var(--brand-secondary))",
          accent:       "hsl(var(--brand-accent))",
        },
        // ─── Neutrale Palette ────────────────────────────────────────
        neutral: {
          50:  "hsl(var(--neutral-50))",
          100: "hsl(var(--neutral-100))",
          200: "hsl(var(--neutral-200))",
          300: "hsl(var(--neutral-300))",
          400: "hsl(var(--neutral-400))",
          500: "hsl(var(--neutral-500))",
          600: "hsl(var(--neutral-600))",
          700: "hsl(var(--neutral-700))",
          800: "hsl(var(--neutral-800))",
          900: "hsl(var(--neutral-900))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
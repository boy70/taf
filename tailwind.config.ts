import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Dynamic color classes used in getTypeColor functions
    'bg-red-100', 'text-red-800', 'border-red-300',
    'bg-yellow-100', 'text-yellow-800', 'border-yellow-300',
    'bg-green-100', 'text-green-800', 'border-green-300',
    'bg-blue-100', 'text-blue-800', 'border-blue-300',
    'bg-gray-100', 'text-gray-800', 'border-gray-300',
    // Additional dynamic classes that might be used
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500',
    'bg-red-600', 'bg-yellow-600', 'bg-green-600', 'bg-blue-600',
    'text-red-500', 'text-yellow-500', 'text-green-500', 'text-blue-500',
    'text-red-600', 'text-yellow-600', 'text-green-600', 'text-blue-600',
    'text-red-700', 'text-yellow-700', 'text-green-700', 'text-blue-700',
    'text-red-800', 'text-yellow-800', 'text-green-800', 'text-blue-800',
    // Border classes
    'border-red-200', 'border-yellow-200', 'border-green-200', 'border-blue-200',
    'border-red-300', 'border-yellow-300', 'border-green-300', 'border-blue-300',
  ],
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
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          background: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        neutral: {
          200: 'hsl(0 0% 89.8%)',
          300: 'hsl(0 0% 83.1%)',
          400: 'hsl(0 0% 64.9%)',
          500: 'hsl(0 0% 45.1%)',
          600: 'hsl(0 0% 32.9%)',
          700: 'hsl(0 0% 25.1%)',
          800: 'hsl(0 0% 14.9%)',
          900: 'hsl(0 0% 9%)',
          950: 'hsl(0 0% 3.9%)',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        'disc-dominant': 'hsl(var(--disc-dominant))',
        'disc-influencer': 'hsl(var(--disc-influencer))',
        'disc-steady': 'hsl(var(--disc-steady))',
        'disc-conscientious': 'hsl(var(--disc-conscientious))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient': 'gradient 8s ease infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite'
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-blue': 'linear-gradient(135deg, #667eea 0%, #4299e1 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-rose': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'glow': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glow-purple': '0 20px 25px -5px rgba(139, 92, 246, 0.3)'
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem'
      },
      backdropBlur: {
        'xs': '2px'
      },
      opacity: {
        '5': '0.05',
        '10': '0.1',
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}

export default config


import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--colors-primary)',
        secondary: 'var(--colors-secondary)',
        ink: 'var(--colors-ink)',
        sand: 'var(--colors-sand)',
        clay: 'var(--colors-clay)',
        moss: 'var(--colors-moss)',
        sun: 'var(--colors-sun)',
        rose: 'var(--colors-rose)',
        slate: 'var(--colors-slate)',
        mist: 'var(--colors-mist)',
      },
      spacing: {
        '1': 'var(--spacing-1)',
        '2': 'var(--spacing-2)',
        '3': 'var(--spacing-3)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
      },
      fontFamily: {
        sans: 'var(--typography-fontFamily-sans)',
        serif: 'var(--typography-fontFamily-serif)',
        display: 'var(--typography-fontFamily-display)',
        mono: 'var(--typography-fontFamily-mono)',
      },
      fontSize: {
        base: ['var(--typography-fontSize-base)', { lineHeight: 'var(--typography-fontSize-base-line-height)' }],
        lg: ['var(--typography-fontSize-lg)', { lineHeight: 'var(--typography-fontSize-lg-line-height)' }],
        xl: ['var(--typography-fontSize-xl)', { lineHeight: 'var(--typography-fontSize-xl-line-height)' }],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms ease-out both',
        'fade-up-delay': 'fade-up 700ms ease-out 120ms both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;

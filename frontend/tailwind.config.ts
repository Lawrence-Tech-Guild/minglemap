import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--colors-primary)',
        secondary: 'var(--colors-secondary)',
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
        mono: 'var(--typography-fontFamily-mono)',
      },
      fontSize: {
        base: ['var(--typography-fontSize-base)', { lineHeight: 'var(--typography-fontSize-base-line-height)' }],
        lg: ['var(--typography-fontSize-lg)', { lineHeight: 'var(--typography-fontSize-lg-line-height)' }],
        xl: ['var(--typography-fontSize-xl)', { lineHeight: 'var(--typography-fontSize-xl-line-height)' }],
      },
    },
  },
  plugins: [],
} satisfies Config;

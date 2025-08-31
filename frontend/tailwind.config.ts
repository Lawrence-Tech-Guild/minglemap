import type { Config } from 'tailwindcss';
import tokens from './design-tokens.json';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      fontFamily: tokens.typography?.fontFamily,
      fontSize: tokens.typography?.fontSize,
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background, #151414)',
        foreground: 'var(--color-text, #ffffff99)',
        primary: {
          DEFAULT: 'var(--color-primary, #663399)',
          foreground: '#ffffff',
          dark: '#4f0996',
          shadow: '#975dd1'
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #ffffff)',
          foreground: '#151414'
        },
        accent: {
          DEFAULT: 'var(--color-accent, #d9f45f)',
          foreground: '#000000'
        },
        card: {
          DEFAULT: 'var(--color-card, #1c1b1b)',
          foreground: '#ffffff'
        },
        border: 'var(--color-border, #2a2b28)',
      },
      fontFamily: {
        sans: ['var(--font-main)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      maxWidth: {
        container: '1369px',
      }
    },
  },
  plugins: [],
};

export default config;

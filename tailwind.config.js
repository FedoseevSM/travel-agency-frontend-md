/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      colors: {
        ocean: {
          lightest: 'var(--color-ocean-lightest)',
          lighter: 'var(--color-ocean-lighter)',
          light: 'var(--color-ocean-light)',
          DEFAULT: 'var(--color-ocean)',
          medium: 'var(--color-ocean-medium)',
          deep: 'var(--color-ocean-deep)',
          deeper: 'var(--color-ocean-deeper)',
          dark: 'var(--color-ocean-dark)',
          darker: 'var(--color-ocean-darker)',
          darkest: 'var(--color-ocean-darkest)',
        },
        bg: {
          primary: 'var(--color-background)',
          alt: 'var(--color-background-alt)',
          overlay: 'var(--color-overlay)',
        },
        text: {
          primary: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          accent: 'var(--color-text-accent)',
        },
      },
    },
  },
  plugins: [],
};
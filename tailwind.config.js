import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand design tokens — single source of truth.
        // Full scales so every shade is available (primary-50 … primary-950).
        // The old pastel palette (primary: #F0F4C3 …) was removed: pale tones
        // failed WCAG contrast on white surfaces (invisible text).
        // primary maps to Tailwind's `purple` scale on purpose: the codebase
        // already uses purple-* utilities, so tokens and raw classes converge
        // on ONE purple instead of two competing families (violet ≠ purple).
        primary: colors.purple,
        secondary: colors.fuchsia,
        accent: colors.amber,
      },
      fontFamily: {
        heading: ['"Baloo 2"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

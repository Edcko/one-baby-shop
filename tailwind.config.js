/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F0F4C3',    // verde pálido
        secondary: '#E1BEE7',  // lavanda
        accent: '#FFECB3',     // amarillo crema
      },
      fontFamily: {
        heading: ['"Baloo 2"', 'cursive'],
        body:    ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

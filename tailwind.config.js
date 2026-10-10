/**
 * Paleta "Lino" — dirección de Dannia (2026-10-09):
 * fondo neutro beige lino, acentos terracota/miel/oliva, wordmark
 * multicolor (one naranja · baby miel · shop azul polvo). "Divertido".
 *
 * primary → terracotta (acción principal: botones, enlaces)
 * secondary → olive   (acompañante: gradientes, tags)
 * accent    → honey   (destellos: badges, estrellas, ahorros)
 */
const terracotta = {
  50: '#FBF3EF',
  100: '#F6E3DA',
  200: '#EDC8B7',
  300: '#E0A68C',
  400: '#D28566',
  500: '#C4674A',
  600: '#A85539',
  700: '#8A452E',
  800: '#6C3624',
  900: '#4F2819',
  950: '#2E170E',
}

const olive = {
  50: '#F6F7F0',
  100: '#EAEDDC',
  200: '#D5DABA',
  300: '#BCC492',
  400: '#9DA56E',
  500: '#7A8450',
  600: '#626B3E',
  700: '#4B5330',
  800: '#363C23',
  900: '#242817',
  950: '#13150B',
}

const honey = {
  50: '#FBF6E9',
  100: '#F6EBCC',
  200: '#EDD695',
  300: '#E3BE5C',
  400: '#DDAC35',
  500: '#D99A1F',
  600: '#B47C15',
  700: '#8E5F10',
  800: '#6A4611',
  900: '#462F0E',
  950: '#291A07',
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: terracotta,
        secondary: olive,
        accent: honey,
        // Fondos y tinta de la paleta Lino
        linen: { DEFAULT: '#F5F0E8', dark: '#EAE2D4' },
        ink: { DEFAULT: '#3E3630', soft: '#6B6157', light: '#9C9186' },
        // Azul polvo — reservado al wordmark ("shop")
        dustblue: { DEFAULT: '#5B7E9E', dark: '#46647F', light: '#8FA9BE' },
      },
      fontFamily: {
        heading: ['"Baloo 2"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

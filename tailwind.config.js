/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'verde-oscuro': '#1a3d2b',
        'verde-medio': '#2d6a4f',
        'verde-claro': '#40916c',
        'verde-logo': '#8fb49b',
        'dorado': '#c9a84c',
        'dorado-claro': '#d4b96a',
        'dorado-suave': '#e8d5a0',
        'crema': '#f5f0e8',
        'blanco-calido': '#fdfaf4',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'lato': ['Lato', 'sans-serif'],
        'allura': ['Allura', 'cursive'],
      },
      boxShadow: {
        'card': '0 6px 12px -2px rgba(26, 61, 43, 0.35), 0 3px 6px -1px rgba(26, 61, 43, 0.25)',
        'card-hover': '0 12px 24px -4px rgba(26, 61, 43, 0.45), 0 6px 12px -2px rgba(26, 61, 43, 0.3)',
        'gold': '0 4px 15px rgba(201, 168, 76, 0.3)',
      }
    },
  },
  plugins: [],
}

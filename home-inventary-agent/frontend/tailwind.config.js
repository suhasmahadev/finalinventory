/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#efebe9',
          100: '#d7ccc8',
          200: '#bcaaa4',
          300: '#a1887f',
          400: '#8d6e63',
          500: '#795548',
          600: '#6d4c41',
          700: '#5d4037',
          800: '#4e342e',
          900: '#3e2723',
          950: '#281815',
        },
        beige: {
          50: '#fdfbf7',
          100: '#f7f3e8',
          200: '#efead8',
          300: '#e5dec3',
          400: '#d7cdaa',
          500: '#c5b68b',
          600: '#a6956b',
          700: '#867652',
          800: '#6d5f44',
          900: '#5a4e3a',
          950: '#30291e',
        },
        // Mapping legacy colors to new theme to prevent crashes before refactor
        navy: {
          900: '#3e2723', // Map to Brown 900
          800: '#4e342e', // Map to Brown 800
          700: '#5d4037', // Map to Brown 700
        },
        emerald: {
          500: '#8d6e63', // Map to Brown 400 (Accent)
          600: '#795548', // Map to Brown 500
          100: '#efebe9', // Map to Brown 50
        },
        slate: {
          50: '#fdfbf7', // Map to Beige 50
          100: '#f7f3e8', // Map to Beige 100
          200: '#efead8', // Map to Beige 200
          300: '#e5dec3',
          400: '#d7cdaa',
          500: '#795548', // Brown text
          600: '#5d4037',
          700: '#4e342e',
          800: '#3e2723',
          900: '#281815',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Optional for headings if user wants "professional"
      },
    },
  },
  plugins: [],
}

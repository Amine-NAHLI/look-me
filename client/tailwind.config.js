/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff', // Blanc pur
        foreground: '#334155', // Gris doux
        secondary: '#fdf2f8', // Rose extrêmement léger
        accent: '#ec4899', // Rose vif (Pink 500)
        'accent-light': '#fbcfe8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

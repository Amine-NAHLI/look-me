/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FCF8F8',
        foreground: '#1C1B1B',
        secondary: '#F0EDEC',
        accent: '#9B0044',
        'accent-light': '#FFD9DF',
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#E91E8C',
          600: '#C01370',
          700: '#9A0F5A',
          800: '#831843',
          900: '#50072B',
        },
        gray: {
          50: '#F8F8F8',
          100: '#F3F4F6',
          200: '#EEEEEE',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B6B6B',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#1A1A2E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}

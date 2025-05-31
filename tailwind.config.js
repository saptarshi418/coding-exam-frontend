/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: '#1A1A2E',
        secondaryBg: '#1F4068',
        primaryText: '#E0E0E0',
        accentRed: '#FF6B6B',
        accentGreen: '#6BFF6B',
        accentBlue: '#6B8AFF',
      }
    },
  },
  plugins: [],
}

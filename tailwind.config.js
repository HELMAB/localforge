/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'Kantumruy Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

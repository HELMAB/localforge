/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kantumruy Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

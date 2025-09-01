/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
              montserrat: ['Montserrat', 'sans-serif'],
              playfair: ['Playfair Display', 'serif'],
              opensans: ['Open Sans', 'sans-serif'],
          },
    },
  },
  plugins: [],

  
}

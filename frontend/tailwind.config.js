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
      colors: {
        accent: {
          50: '#D169A7',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],

  
}

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
        background: {
          50: '#fff9f3',
          100: '#f2e9e1',
          200: '#faefe0',
          300: '#6ee7b7',
        },
        accent: {
          50: '#a7cbd1',
          100: '#f5f5f4',
          200: '#e7e5e4',
        },
        element: {
          50: '#92415b',
          100: '#9e6f6d',
          200: '#9b6686',
          300: '#9b6686'
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

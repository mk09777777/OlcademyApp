/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./Card/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF002E',
        light: '#FEF2F2',
        background: '#FEF2F2',
        textprimary: '#222222',
        textsecondary: '#333333',
        smalltext: '#333333',
        success: '#333333',
        border: '#D9D9D9',
      },
      fontFamily: {
        outfit: ['outfit', 'sans-serif'],
        'outfit-bold': ['outfit-bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
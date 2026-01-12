/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./Card/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#02757A',
        light: '#d9e9e9ff',
        background: '#ffffff',
        primarytext: '#02757A',
        textprimary: '#222222',
        textsecondary: '#333333',
        smalltext: '#666666',
        success: '#048520',
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
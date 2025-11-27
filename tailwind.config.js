// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#132D65",
        secondary: "#EAEAEA",
        third : "#DDDBDB",
        myred :"#9C050C"
      },
      fontFamily: {
        montserrat: ['"Montserrat"', "sans-serif"],
        playwrite: ['"Playwrite US Trad"', "cursive"],
        monoto: ['"Monoton"', 'Helvetica', 'sans-serif'], 
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],

}

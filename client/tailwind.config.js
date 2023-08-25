/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
colors: {
  "theme" : "#25a451",
  "grey": "#4B4B4B"
},
borderColor: {
  'theme-color': '#25a451',
  'table-color': '#16161699',
  'inputBorder' : '#25a451',
},
backgroundImage : {
"gradient" : "linear-gradient(90deg, #FF5858 0%, #25a451 100%)"
},
backgroundColor: {
  'theme-color': '#25a451',
  'theme-light-color' : '##92d1a8',
},
screens: {
  '4xl': {'min': '1600px'},
  '3xl': {'min': '1440px'},
  '2xl': {'min': '1366px'},
  'xl': {'min': '1280px'},
  'lg': {'min': '1024px'},
  'md': {'min': '768px'},
  'sm': {'min': '640px'},
  'xs': {'min': '375px'},
},
boxShadow:{
  "btnshd":"0px 1px 0px rgba(0, 0, 0, 0.08), inset 0px -1px 0px rgba(0, 0, 0, 0.2)",
  "inputshadow":"inset 0px 1px 0px #898F94",
  "focusshadow": "0 0 0 4px rgba(146,209,168,.25)",
  'tableRowsShadow':'inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)'

},

    },
    
  },
  plugins: [],
}
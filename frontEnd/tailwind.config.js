/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing:{
        "20":"100px",
        "30":"600px",
        "1001":"400px",

      }
    },
  },
  plugins: [],
}

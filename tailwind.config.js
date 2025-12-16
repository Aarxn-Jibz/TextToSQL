/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#61cf5a",
        "secondary": "#50864c",
        "background-page": "#000000",
        "surface": "#0c0c0c",
        "surface-highlight": "#161616",
        "code-bg": "#050505",
      },
      fontFamily: {
        "nerd": ["3270 Nerd Font", "monospace"], 
        "display": ["Be Vietnam Pro", "sans-serif"],
      },
      borderRadius: {
        "lg": "2rem", 
        "xl": "3rem"
      },
    },
  },
  plugins: [],
}
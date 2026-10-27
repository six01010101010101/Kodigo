/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: "#58CC02",
          "green-dark": "#46A302",
          blue: "#1CB0F6",
          "blue-dark": "#1899D6",
          red: "#FF4B4B",
          "red-dark": "#EA2B2B",
          yellow: "#FFC800",
          "yellow-dark": "#E5A500",
          purple: "#CE82FF",
          "purple-dark": "#A55EEA",
          card: "#FFFFFF",
          border: "#E5E5E5",
          charcoal: "#4B4B4B",
          gray: "#777777",
          "bg-light": "#F7F7F7"
        }
      },
      boxShadow: {
        'duo-green': '0 4px 0 #46A302',
        'duo-blue': '0 4px 0 #1899D6',
        'duo-yellow': '0 4px 0 #E5A500',
        'duo-red': '0 4px 0 #EA2B2B',
        'duo-gray': '0 4px 0 #E5E5E5',
        'duo-purple': '0 4px 0 #A55EEA'
      }
    },
  },
  plugins: [],
}

// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
 	 colors: {
 	   lohn: {
  		bgLight: "#f9fafb",
     		bgDark: "#2e3440",
      		textLight: "#111827",
      		textDark: "#eceff4",
      		cardLight: "#ffffff",
      		cardDark: "#3b4252",
      		borderLight: "#e5e7eb",
      		borderDark: "#4c566a",
      		primary: "#2563eb",
      		primaryHover: "#1e40af",
    	      },
 	    },
	},
  },
  plugins: [],
};
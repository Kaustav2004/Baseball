module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Adjust paths based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#27343D", // Light base
          DEFAULT: "#1B2730", //card element
          dark: "#1B2730", // Dark base
        },
        secondary: {
          light: "#DCE8EC", // Light Yellow
          DEFAULT: "#DCE8EC", // text colour
          dark: "#b45309", // Dark Yellow
        },
        accent: {
          light: "#f9a8d4", // Light Pink
          DEFAULT: "#ec4899", // Base Pink
          dark: "#9d174d", // Dark Pink
        },
      },
    },
  },
  plugins: [],
};

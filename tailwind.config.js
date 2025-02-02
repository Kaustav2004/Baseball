module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Adjust paths based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        // primary: {
        //   light: "#27343D", // Light base
        //   DEFAULT: "#1B2730", //card element
        //   dark: "#05141C", // Dark base
        // },
        // secondary: {
        //   light: "#DCE8EC", // Light Yellow
        //   DEFAULT: "#DCE8EC", // text colour
        //   dark: "#b45309", // Dark Yellow
        // },
        primary: {
          100: "#1F3A5F", // Dark Blue
          200: "#4d648d", // Muted Blue
          300: "#acc2ef", // Light Blue
        },
        accent: {
          100: "#3D5A80", // Deep Accent
          200: "#cee8ff", // Soft Accent
        },
        text: {
          100: "#FFFFFF", // White Text
          200: "#e0e0e0", // Light Gray Text
        },
        bg: {
          100: "#0F1C2E", // Dark Background
          200: "#1f2b3e", // Medium Dark Background
          300: "#374357", // Lighter Background
        },
        custom: {
          900: "#161b2b", // rgb(22, 27, 43)
          800: "#334363", // rgb(51, 67, 99)
          700: "#596e9c", // rgb(89, 110, 156)
          600: "#8fa5c2", // rgb(143, 165, 194)
          100: "#e5ebf2", // rgb(229, 235, 242)
        },
      },
    },
  },
  plugins: [],
};

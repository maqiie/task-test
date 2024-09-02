// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{html,js}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Include all relevant file types
  ],
  theme: {
    extend: {
      // Extend the default theme with custom values if needed
      colors: {
        primary: '#4a90e2', // Example of a custom color
        secondary: '#d1d5db', // Example of a custom color
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    // Add plugins if needed
  ],
}

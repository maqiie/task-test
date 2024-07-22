module.exports = {
  // Your ESLint configuration settings
  plugins: [
    'react-hooks',
    // other plugins
  ],
  rules: {
          'no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    // Add other rules you want to change to warnings here
  },
  // other settings
};

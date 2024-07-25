module.exports = {
  // Your ESLint configuration settings
  plugins: [
    'react-hooks',
    // other plugins
  ],
  rules: {
    'no-unused-vars': 'warn', // Change 'no-unused-vars' rule to show warnings instead of errors
    'react-hooks/rules-of-hooks': 'error', // Enforce rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies in useEffect
    // Add other rules you want to change to warnings here
  },
  // Add other configurations if needed
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // other configurations
  ],
};

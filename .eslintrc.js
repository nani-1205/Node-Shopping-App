// .eslintrc.js
module.exports = {
    env: {
      node: true,     // Specifies that this is a Node.js environment.
      es2021: true,   // Enables ES2021 (ES12) features.  Use 'es2022', 'es2023', etc. for later versions.
    },
    extends: [
      'eslint:recommended', // Includes ESLint's recommended rules for JavaScript.
    ],
    parserOptions: {
      ecmaVersion: 'latest', // Use the latest ECMAScript version supported by ESLint.
      sourceType: 'module',  // Use 'module' if you're using ES modules (import/export).  Use 'script' for older CommonJS (require).
    },
    rules: {
      // Add your custom rule overrides here.
      'no-unused-vars': 'warn',  // Warn about unused variables (instead of error).
      'no-console': 'off',       // Allow console.log statements (good for development, but consider removing in production).
      'indent': ['error', 2],   // Enforce 2-space indentation.
      'quotes': ['error', 'single'], // Enforce single quotes.
      'semi': ['error', 'always'],    // Require semicolons.
    },
  };
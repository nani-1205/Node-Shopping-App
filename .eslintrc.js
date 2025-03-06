   // .eslintrc.js
   module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
    },
    overrides: [
        {
        files: ['.eslintrc.js'],
        parserOptions: {
            sourceType: 'script',
        },
        },
    ],
    };
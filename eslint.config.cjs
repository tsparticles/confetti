// Flat config for ESLint (compatible with newer ESLint versions)
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    // files and directories to ignore
    ignores: ['node_modules/**', 'public/**', '.git/**', '.planning/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prettier/prettier': 'warn',
    },
  },
];

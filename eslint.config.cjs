// Minimal flat ESLint config compatible with ESLint v10+
module.exports = [
  {
    // files and directories to ignore
    ignores: ['node_modules/**', '.git/**', '.planning/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];

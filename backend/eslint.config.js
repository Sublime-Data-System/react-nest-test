const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: ['dist/**'],
  },
  ...tsPlugin.configs['flat/recommended'],
];

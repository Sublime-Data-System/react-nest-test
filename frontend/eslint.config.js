import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/**'],
  },
  ...tsPlugin.configs['flat/recommended'],
  reactHooks.configs['recommended-latest'],
];

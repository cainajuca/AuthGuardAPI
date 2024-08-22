import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'], // only typescript files
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypeScript,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      //'no-console': 'warn', // Uncomment for non dev environment
      'indent': ['error', 'tab'],
    },
  },
];

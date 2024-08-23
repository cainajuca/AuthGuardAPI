import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'], // Only TypeScript files
    ignores: ['**/*.json'], // Ignore all JSON files
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
      'import': importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'indent': ['error', 'tab'],
      'import/no-unresolved': 'error',
      'import/order': ['error', { 'newlines-between': 'always' }],
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          '**/test.ts', 
          '**/test.tsx', 
          '**/*.test.ts', 
          '**/*.test.tsx', 
          '**/*.d.ts',
        ],
      }],
    },
  },
];

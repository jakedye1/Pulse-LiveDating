const expo = require('eslint-config-expo/flat');

module.exports = [
  {
    ignores: ['**/.expo/**', '**/node_modules/**', '**/dist/**', '**/.expo-shared/**', '**/*.d.ts'],
  },
  ...expo,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
];

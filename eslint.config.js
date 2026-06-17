import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.ds-sync', '.design-sync', 'ds-bundle'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Node build scripts (the design-library generator) — grant the Node globals they use.
    files: ['design/**/*.mjs'],
    languageOptions: { globals: { console: 'readonly', process: 'readonly', URL: 'readonly' } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // The two classic, high-value hooks rules — not react-hooks v7's stricter additions
      // (sync-ref-during-render / setState-in-effect), which flag legitimate patterns here.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);

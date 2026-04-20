import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const nextFlatConfig = {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...(nextPlugin.configs.recommended?.rules ?? {}),
    ...(nextPlugin.configs['core-web-vitals']?.rules ?? {}),
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'error',
    '@next/next/no-page-custom-font': 'warn',
    '@next/next/google-font-display': 'warn',
    '@next/next/google-font-preconnect': 'warn',
  },
};

export default [
  nextFlatConfig,
  js.configs.recommended,

  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**', 'coverage/**', '.husky/**', 'public/**'],
  },

  // TypeScript + React
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Node.js
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // React
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
      'react-hooks': reactHooks,
      react: react,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      ...typescript.configs.recommended.rules,

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Import sorting: React/Next → side-effects → Node → 3rd-party → @/* aliases → styles
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [['^react', '^next', '^react-dom'], [String.raw`^\u0000`], ['^node:'], [String.raw`^@?\w`], ['^@/'], [String.raw`^.+\.s?css$`]],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'off',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-relative-packages': 'error',

      // Enforce @/* alias — block relative imports (except CSS)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Use @/* alias imports instead of relative parent imports.',
            },
          ],
        },
      ],

      // Prevent shared from importing feature code
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/shared/**/*',
              from: './src/app/**/*',
              message: 'Shared code cannot import from app features.',
            },
          ],
        },
      ],

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-unescaped-entities': 'off',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'eol-last': ['error', 'always'],

      // Handled by Prettier
      'comma-dangle': 'off',
      semi: 'off',
      quotes: 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'computed-property-spacing': 'off',
      'key-spacing': 'off',
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    },
  },

  // Test files
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: null,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        require: 'readonly',
        vi: 'readonly',
        // DOM types
        window: 'readonly',
        document: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'no-console': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      'no-restricted-imports': 'off',
      'simple-import-sort/imports': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-restricted-paths': 'off',
    },
  },

  // Config files (no type-aware rules)
  {
    files: [
      'next.config.*',
      'jest.config.*',
      'postcss.config.*',
      'eslint.config.*',
      'tailwind.config.*',
      '.prettierrc.*',
      'vitest.config.*',
      'playwright.config.*',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: { project: null },
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      'no-console': 'off',
      'import/no-commonjs': 'off',
      'no-restricted-imports': 'off',
    },
  },

  prettier,
];

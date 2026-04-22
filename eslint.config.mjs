import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';
import path from 'node:path';

const tailwindEntryCss = path.join(import.meta.dirname, 'src/app/globals.css');
const disableTypeChecked = typescript.configs['flat/disable-type-checked'];

const eslintConfig = [
  ...nextVitals,
  js.configs.recommended,
  ...typescript.configs['flat/strict-type-checked'],
  ...typescript.configs['flat/stylistic-type-checked'],

  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**', 'coverage/**', '.husky/**', 'public/**', 'src/**/*.d.ts', '.skills/**'],
  },

  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: disableTypeChecked.languageOptions,
    rules: disableTypeChecked.rules,
  },

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
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
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      tailwindcss,
      'unused-imports': unusedImports,
    },
    rules: {
      // `no-undef` không đáng tin trên TypeScript; compiler xử lý chính xác hơn.
      'no-undef': 'off',

      // Dùng plugin unused-imports làm nguồn sự thật duy nhất cho unused code.
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],

      // Giữ tính chặt nhưng tránh rule formatting gây nhiễu.
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
      '@typescript-eslint/consistent-type-exports': ['error', { fixMixedExportsWithInlineTypeSpecifier: true }],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' }],
      '@typescript-eslint/no-empty-object-type': ['warn', { allowInterfaces: 'with-single-extends' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
      '@typescript-eslint/prefer-nullish-coalescing': ['error', { ignorePrimitives: { boolean: false, string: false } }],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react-dom$', '^next', '^next/'],
            [String.raw`^\u0000`],
            ['^node:'],
            [String.raw`^@?\w`],
            ['^@/'],
            [String.raw`^.+\.s?css$`],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',

      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'off',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-relative-packages': 'error',
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/shared/**/*',
              from: './src/app/**/*',
              message: 'Shared code cannot import from app features.',
            },
            {
              target: './src/shared/constants/**/*',
              from: ['./src/shared/components/**/*', './src/shared/hooks/**/*', './src/shared/stores/**/*', './src/shared/lib/**/*'],
              message: 'Shared constants must stay foundational and cannot depend on UI, hooks, stores, or lib code.',
            },
            {
              target: './src/shared/types/**/*',
              from: ['./src/shared/components/**/*', './src/shared/hooks/**/*', './src/shared/stores/**/*', './src/shared/lib/**/*'],
              message: 'Shared types must remain dependency-light and cannot import UI, hooks, stores, or lib code.',
            },
            {
              target: ['./src/shared/hooks/**/*', './src/shared/stores/**/*'],
              from: './src/shared/components/**/*',
              message: 'Hooks and stores must not depend on shared UI components.',
            },
            {
              target: './src/shared/lib/**/*',
              from: './src/shared/components/**/*',
              message: 'Shared lib code must not depend on shared UI components.',
            },
            {
              target: './src/shared/components/base/**/*',
              from: ['./src/shared/components/common/**/*', './src/shared/components/layouts/**/*', './src/shared/components/skeletons/**/*'],
              message: 'Base UI primitives cannot depend on higher-level shared components.',
            },
            {
              target: ['./src/shared/components/common/**/*', './src/shared/components/skeletons/**/*'],
              from: './src/shared/components/layouts/**/*',
              message: 'Common and skeleton components cannot depend on layout components.',
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/router',
              message: 'App Router projects must use next/navigation instead of next/router.',
            },
            {
              name: 'next/head',
              message: 'Prefer the Metadata API in the App Router instead of next/head.',
            },
          ],
          patterns: [
            {
              group: ['../*'],
              message: 'Relative imports going up are restricted. Use @/* alias instead.',
            },
          ],
        },
      ],

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prefer-read-only-props': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['coerce', 'ternary'] }],
      'react/no-array-index-key': 'error',
      'react/iframe-missing-sandbox': 'error',
      'react/no-unescaped-entities': 'off',
      'react/no-unstable-nested-components': 'error',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],

      'react-hooks/exhaustive-deps': 'error',

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-arrow-callback': 'error',
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'eol-last': ['error', 'always'],

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
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.mts', '.cts'] },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mts', '.cts'],
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts'] },
      tailwindcss: {
        callees: ['cn', 'clsx', 'cva'],
        classRegex: '^class(Name)?$',
        config: tailwindEntryCss,
        cssFiles: ['src/**/*.css'],
        cssFilesRefreshRate: 0,
        skipClassAttribute: false,
      },
    },
  },

  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
    plugins: { jest: jestPlugin },
    settings: {
      // Repo đang dùng Vitest; dùng Jest rules như một proxy cho test hygiene cơ bản.
      jest: { version: 29 },
    },
    languageOptions: {
      ...disableTypeChecked.languageOptions,
      parser: typescriptParser,
      parserOptions: {
        ...disableTypeChecked.languageOptions.parserOptions,
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
      ...disableTypeChecked.rules,

      'no-undef': 'off',
      'no-console': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
      'no-restricted-imports': 'off',
      'simple-import-sort/imports': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-restricted-paths': 'off',
      'import/no-cycle': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/no-array-index-key': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },

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
      'lint-staged.config.*',
    ],
    languageOptions: {
      ...disableTypeChecked.languageOptions,
      parser: typescriptParser,
      parserOptions: {
        ...disableTypeChecked.languageOptions.parserOptions,
      },
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
      ...disableTypeChecked.rules,
      'no-undef': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
      'no-console': 'off',
      'no-restricted-imports': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-commonjs': 'off',
      'import/no-cycle': 'off',
    },
  },

  prettier,
];

export default eslintConfig;

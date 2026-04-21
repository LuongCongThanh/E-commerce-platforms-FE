import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import path from 'node:path';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';

// ─── Next.js ────────────────────────────────────────────────────────────────
// Tách ra biến riêng vì nextPlugin không có `files` filter —
// nó cần apply toàn bộ project (bao gồm cả .js config files).
const nextFlatConfig = {
  plugins: { '@next/next': nextPlugin },
  rules: {
    // Kế thừa toàn bộ recommended + core-web-vitals của Next.js
    ...(nextPlugin.configs.recommended?.rules ?? {}),
    ...(nextPlugin.configs['core-web-vitals']?.rules ?? {}),

    // Bắt buộc dùng <Link> thay <a href> để không bypass client-side navigation
    '@next/next/no-html-link-for-pages': 'error',
    // Bắt buộc dùng <Image> của Next.js để tự động tối ưu ảnh (lazy load, WebP, size)
    '@next/next/no-img-element': 'error',
    // Cảnh báo khi import font trực tiếp vào page thay vì dùng next/font
    '@next/next/no-page-custom-font': 'warn',
    // Google Font cần display=swap để tránh FOIT (Flash of Invisible Text)
    '@next/next/google-font-display': 'warn',
    // Google Font cần preconnect để giảm latency kết nối DNS
    '@next/next/google-font-preconnect': 'warn',
  },
};

const tailwindEntryCss = path.join(import.meta.dirname, 'src/app/globals.css');

export default [
  nextFlatConfig,

  // Bộ rule JS cơ bản: no-unused-vars, no-undef, no-redeclare, v.v.
  js.configs.recommended,

  // ─── Ignore patterns ──────────────────────────────────────────────────────
  {
    ignores: [
      '.next/**', // Build output của Next.js
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**', // Vitest coverage output
      '.husky/**', // Git hooks (shell scripts, không phải JS)
      'public/**', // Static assets
    ],
  },

  // ─── TypeScript + React (áp dụng cho mọi *.ts / *.tsx) ───────────────────
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        // Bật type-aware rules (no-unnecessary-type-assertion, switch-exhaustiveness…)
        // — cần trỏ đúng tsconfig để parser hiểu type information
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser globals — khai báo để ESLint không báo "no-undef"
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
        // Node.js globals — cần cho next.config.ts, middleware.ts
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // React 17+ không cần import React trong JSX,
        // nhưng khai báo global để tránh false positive ở một số rule
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
      'react-hooks': reactHooks,
      react,
      'simple-import-sort': simpleImportSort,
      tailwindcss,
      'unused-imports': unusedImports,
    },
    rules: {
      // Kế thừa toàn bộ @typescript-eslint/recommended làm baseline
      ...typescript.configs.recommended.rules,

      // ── TypeScript: fixes từ recommended ──────────────────────────────────

      // FIX: recommended báo "empty object is useless" cho `interface Props {}`
      // — allowInterfaces vì pattern này hợp lệ trong React (component chưa có props)
      // — allowObjectTypes vì `type X = {}` đôi khi cần để extend sau
      '@typescript-eslint/no-empty-object-type': ['warn', { allowInterfaces: 'always', allowObjectTypes: 'always' }],

      // ── TypeScript: quality rules ──────────────────────────────────────────

      // `any` làm mất type safety — warn thay vì error để không block dev khi prototyping
      '@typescript-eslint/no-explicit-any': 'warn',

      // Biến khai báo nhưng không dùng gây nhầm lẫn — warn để dev tự dọn dần
      '@typescript-eslint/no-unused-vars': 'warn',

      // Phát hiện import statement thừa (đã import nhưng không dùng gì cả)
      'unused-imports/no-unused-imports': 'warn',

      // Biến/param thừa — bỏ qua nếu tên bắt đầu bằng _ (convention "intentionally unused")
      'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],

      // Bắt buộc dùng `import type` cho type-only imports để:
      // 1) Tree-shaking tốt hơn (bundler loại bỏ hoàn toàn lúc runtime)
      // 2) Tránh circular dependency ngầm
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // REMOVED: no-floating-promises — rule này yêu cầu viết `void fn()` hoặc `await fn()`
      // trước mọi Promise, gây verbose không cần thiết trong event handlers
      '@typescript-eslint/no-floating-promises': 'off',

      // REMOVED: no-misused-promises — rule này block async function trong onClick, forEach...
      // gây false positive với React event handlers (async () => { await doSomething() })
      '@typescript-eslint/no-misused-promises': 'off',

      // Await một giá trị không phải Promise → logic sai, thường là nhầm lẫn
      '@typescript-eslint/await-thenable': 'error',

      // `a && a.b` → `a?.b` — ngắn hơn, ít lỗi null/undefined hơn
      '@typescript-eslint/prefer-optional-chain': 'error',

      // Tắt — quá strict, gây nhiều false positive với pattern thông thường (if(str), if(arr))
      '@typescript-eslint/strict-boolean-expressions': 'off',

      // Tắt — TypeScript inference đủ tốt, không cần annotate return type mọi nơi
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Dùng `!` (non-null assertion) che giấu lỗi runtime — phải xử lý đúng cách
      '@typescript-eslint/no-non-null-assertion': 'error',

      // ── TypeScript: strict rules (mới thêm) ───────────────────────────────

      // `||` không phân biệt được falsy (0, '', false) vs null/undefined
      // → dùng `??` để chỉ fallback khi null/undefined
      // ignorePrimitives.string: tắt cho string vì `str || 'default'` là pattern phổ biến hợp lệ
      '@typescript-eslint/prefer-nullish-coalescing': ['warn', { ignorePrimitives: { string: true, boolean: true } }],

      // Phát hiện `as Type` không cần thiết (TypeScript đã infer đúng rồi)
      // — loại bỏ noise, giúp code gọn hơn
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // Bắt buộc dùng `as` thay `<Type>` để tránh conflict với JSX syntax
      // — `<Type>value` bị parse nhầm là JSX element trong .tsx
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow-as-parameter' }],

      // Switch trên union type phải handle mọi case — tránh runtime error khi thêm case mới
      // Đặc biệt hữu ích với discriminated union (action types, status, role...)
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      // `const x: number = 5` → `const x = 5` — TypeScript infer được, annotation thừa
      '@typescript-eslint/no-inferrable-types': 'warn',

      // `Array<string>` → `string[]` cho kiểu đơn giản (dễ đọc hơn)
      // — complex type vẫn dùng Array<T> được (vd: Array<string | number>)
      '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],

      // Bắt lỗi khi dùng namespace/module cũ (TS 1.x style) thay vì ES modules
      '@typescript-eslint/no-namespace': 'error',

      // ── Import order ──────────────────────────────────────────────────────
      // Thứ tự: React/Next → side-effects → Node built-ins → 3rd-party → @/* internal → CSS
      // Giúp đọc code nhanh hơn, tránh circular dependency khó phát hiện
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^react', '^next', '^react-dom'], // 1. Framework core
            [String.raw`^\u0000`], // 2. Side-effect imports (import 'xxx')
            ['^node:'], // 3. Node.js built-ins
            [String.raw`^@?\w`], // 4. Third-party packages
            ['^@/'], // 5. Internal alias (@/shared, @/app…)
            [String.raw`^.+\.s?css$`], // 6. CSS/SCSS files
          ],
        },
      ],

      // Export cũng cần sắp xếp để dễ đọc barrel files (index.ts)
      'simple-import-sort/exports': 'error',

      // Tailwind CSS:
      // - Prettier plugin sorts classes
      // - ESLint catches semantic mistakes and shorthand opportunities
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',

      // Import cùng một module 2 lần → merge lại, giảm bundle size
      'import/no-duplicates': 'error',

      // Tắt — TypeScript compiler xử lý unresolved imports chính xác hơn ESLint
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'off',

      // Import đường dẫn tuyệt đối (/src/…) không hoạt động cross-platform
      'import/no-absolute-path': 'error',

      // Module tự import chính nó → vòng lặp vô hạn
      'import/no-self-import': 'error',

      // import '../../components' khi có thể viết '../components' → gây nhầm lẫn depth
      'import/no-useless-path-segments': 'error',

      // Import từ package khác bằng relative path (../node_modules/…) → không portable
      'import/no-relative-packages': 'error',

      // Chỉ block relative parent imports 2+ cấp (../../)
      // — cho phép ../ trong cùng feature folder (vd: interceptors/ import ../client)
      // — vẫn yêu cầu @/* cho import xuyên feature
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*', '../../../*', '../../../../*'],
              message: 'Imports going 2+ levels up must use @/* alias instead.',
            },
          ],
        },
      ],

      // Kiến trúc: shared/ không được import từ app/ (feature code)
      // — shared phải pure và không biết gì về feature cụ thể
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

      // ── React ─────────────────────────────────────────────────────────────

      // Props của component nên readonly — React không cho phép mutate props từ bên trong
      // Bắt lỗi ngay tại compile time thay vì runtime
      'react/prefer-read-only-props': 'warn',

      // React 17+ JSX Transform tự inject React — không cần import thủ công
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // TypeScript thay thế PropTypes hoàn toàn — không cần khai báo 2 lần
      'react/prop-types': 'off',

      // <Component></Component> → <Component /> khi không có children — ngắn hơn
      'react/self-closing-comp': 'error',

      // <Input disabled={true}> → <Input disabled> — JSX convention
      'react/jsx-boolean-value': ['error', 'never'],

      // <div className={'foo'}> → <div className="foo"> — bỏ curly brace thừa
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // <React.Fragment> → <> </> — syntax ngắn hơn
      'react/jsx-fragments': ['error', 'syntax'],

      // Đánh dấu biến JSX là "đã dùng" để tránh false positive với no-unused-vars
      'react/jsx-uses-vars': 'error',

      // Array index làm key gây bug khi list thay đổi thứ tự (reconciliation sai)
      'react/no-array-index-key': 'warn',

      // <Component children={<Child/>}> → <Component><Child/></Component> — đúng pattern
      'react/no-children-prop': 'error',

      // dangerouslySetInnerHTML + children cùng lúc → React throw error lúc runtime
      'react/no-danger-with-children': 'error',

      // Tắt — text tiếng Việt có nhiều ký tự đặc biệt, rule này gây nhiều false positive
      'react/no-unescaped-entities': 'off',

      // ── React: strict rules (mới thêm) ────────────────────────────────────

      // Component định nghĩa bên trong render bị tạo lại mỗi lần re-render
      // → React unmount và remount toàn bộ subtree → mất state, lag UI
      // Đặc biệt nguy hiểm trong React 19 concurrent mode
      'react/no-unstable-nested-components': 'error',

      // <>{children}</> dư thừa khi không cần wrapper — xoá đi để JSX gọn hơn
      // allowExpressions: cho phép <>{condition && <Comp/>}</> (cần fragment để return)
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],

      // Bắt các direct mutation của state (this.state.x = y) — chỉ dùng setState/dispatch
      'react/no-direct-mutation-state': 'error',

      // ── React Hooks ───────────────────────────────────────────────────────

      // Hook chỉ được gọi ở top-level và trong React function — vi phạm gây bug khó debug
      'react-hooks/rules-of-hooks': 'error',

      // Thiếu dependency trong useEffect/useCallback/useMemo → stale closure bug
      'react-hooks/exhaustive-deps': 'warn',

      // ── General JS ────────────────────────────────────────────────────────

      // console.log sót lại trong production làm lộ thông tin nội bộ
      // — cho phép warn/error/info vì chúng có mục đích logging hợp lệ
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // debugger statement không được commit — nếu còn thì là vô tình bỏ sót
      'no-debugger': 'error',

      // alert/confirm/prompt block UI thread và trải nghiệm xấu — dùng toast/dialog thay thế
      'no-alert': 'error',

      // var có function scope gây bug với closures trong loop — dùng const/let
      'no-var': 'error',

      // Ưu tiên const để signal biến không thay đổi, giảm side effect ngoài ý muốn
      'prefer-const': 'error',

      // Arrow function ngắn hơn, không bind `this`, nhất quán hơn trong callbacks
      'prefer-arrow-callback': 'error',

      // Trailing space không nhìn thấy được nhưng gây nhiễu trong git diff
      'no-trailing-spaces': 'error',

      // Nhiều blank line liên tiếp không có giá trị, làm code dài không cần thiết
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],

      // Thiếu newline cuối file gây lỗi với một số tool Unix và noisy git diff
      'eol-last': ['error', 'always'],

      // ── Tắt các rule formatting (Prettier xử lý) ─────────────────────────
      // eslint-config-prettier ở cuối cũng tắt các rule này,
      // nhưng khai báo rõ ở đây để tránh conflict khi debug
      'comma-dangle': 'off',
      semi: 'off',
      quotes: 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'computed-property-spacing': 'off',
      'key-spacing': 'off',
    },
    settings: {
      // Tự detect phiên bản React từ package.json — không cần hardcode
      react: { version: 'detect' },
      'import/resolver': {
        // Resolver TypeScript: hiểu paths alias trong tsconfig (@/* → src/*)
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
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

  // ─── Test files (*.test.ts / *.spec.tsx …) ────────────────────────────────
  // Nới lỏng nhiều rule vì test code có pattern khác production code:
  // mock, assertion, spy, require() dynamic import…
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    plugins: { jest: jestPlugin },
    settings: {
      // Khai báo version rõ ràng vì project dùng Vitest, không có gói jest cài đặt
      jest: { version: 29 },
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        // Tắt project để tránh lỗi type-checking trong test setup files
        // và tăng tốc độ lint (test files không cần type-aware rules)
        project: null,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Jest/Vitest globals (describe, it, expect, vi…)
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        require: 'readonly', // jest.mock() factory thường dùng require()
        vi: 'readonly', // Vitest global
        // DOM globals cần cho @testing-library/react
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
      // Bộ rule jest/vitest recommended: no-disabled-tests, no-focused-tests…
      ...jestPlugin.configs.recommended.rules,

      'no-console': 'off', // console.log hợp lệ trong test để debug
      '@next/next/no-img-element': 'off', // Test render component không cần Next.js Image
      '@typescript-eslint/no-explicit-any': 'off', // Mock/spy thường cần cast any
      '@typescript-eslint/no-non-null-assertion': 'off', // Assertion trong test là intentional
      '@typescript-eslint/no-unused-vars': 'off', // Setup variables đôi khi không dùng trực tiếp
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': 'off', // Test import linh hoạt hơn
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      'no-restricted-imports': 'off', // Test files được phép relative import
      'simple-import-sort/imports': 'off', // Import order ít quan trọng trong test
      '@typescript-eslint/no-require-imports': 'off', // jest.mock() dùng require()
      'import/no-restricted-paths': 'off', // Test có thể import từ bất kỳ layer nào
      'react/no-unstable-nested-components': 'off', // Test helpers thường wrap components
    },
  },

  // ─── Config files (next.config.ts, vitest.config.ts…) ────────────────────
  // Các file cấu hình thường dùng CommonJS, không có JSX, không cần type-aware rules
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
      parser: typescriptParser,
      parserOptions: {
        // Tắt project — config files nằm ngoài tsconfig include,
        // bật lên sẽ gây lỗi "File not included in tsconfig"
        project: null,
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
      // Tắt tất cả type-aware rules vì không có project reference
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      'no-console': 'off', // Config files thường log thông tin build
      'import/no-commonjs': 'off', // Một số config vẫn dùng require()
      'no-restricted-imports': 'off',
    },
  },

  // ─── Prettier (phải đặt CUỐI CÙNG) ───────────────────────────────────────
  // Tắt tất cả ESLint rule liên quan đến formatting để không xung đột với Prettier.
  // Thứ tự quan trọng: config này override mọi rule formatting đã khai báo ở trên.
  prettier,
];

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // 教材・経験録の記事は「meta（定数）＋ 本文（default component）」を同居させる設計のため、
    // fast-refresh の only-export-components ルールを content 配下では無効化する。
    files: ['src/content/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])

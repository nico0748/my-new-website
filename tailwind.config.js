/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // .tsx を忘れずに追加
  ],
  theme: {
    extend: {
      // CSS 変数（RGB 三値）に紐付けた色。`bg-accent/10` `text-accent` `border-accent/30`
      // のように Tailwind のα記法がそのまま効く（<alpha-value> がαに展開される）。
      colors: {
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'brand-bg': 'rgb(var(--bg-rgb-s) / <alpha-value>)',
        'brand-surface': 'rgb(var(--surface-rgb) / <alpha-value>)',
        'brand-text': 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        amber: 'rgb(var(--amber-rgb) / <alpha-value>)',
        magenta: 'rgb(var(--magenta-rgb) / <alpha-value>)',
      },
      // ダーク・ターミナル（英数=等幅 / 和文=ゴシック）
      fontFamily: {
        'mincho':       ['"Noto Sans JP"', 'sans-serif'],          // 本文（和文）
        'display':      ['"JetBrains Mono"', '"Noto Sans JP"', 'monospace'], // 見出し
        'handwritten':  ['"JetBrains Mono"', 'monospace'],
        'noto-serif':   ['"Noto Sans JP"', 'sans-serif'],
        'rounded':      ['"Noto Sans JP"', 'sans-serif'],
        'mono':         ['"JetBrains Mono"', 'monospace'],
      },
      // clamp() に対応するカスタムフォントサイズを追加
      fontSize: {
        'hero-title': 'clamp(100px, 12vw, 240px)',
        'hero-ruby': 'clamp(25px, 4vw, 50px)',
        'hero-lead': 'clamp(1rem, 2.5vw, 1.75rem)',
        'hero-tag': 'clamp(1rem, 2.5vw, 1.5rem)',
        'fade-in': 'fadeIn 3.5s cubic-bezier(0.33, 1, 0.68, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

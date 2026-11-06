/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // .tsx を忘れずに追加
  ],
  theme: {
    extend: {
      // Calm Dark（英数=Inter / 和文=Noto Sans JP、コードのみ等幅）
      fontFamily: {
        'sans': ['Inter', '"Noto Sans JP"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      // 動きのカーブはサイト全体で 1 本（--motion-ease。未定義でも同じ値になるよう fallback を持つ）
      transitionTimingFunction: {
        'motion': 'var(--motion-ease, cubic-bezier(0.22, 1, 0.36, 1))',
      },
      keyframes: {
        // Skills 詳細のレベルリング: 0 から今のレベルまで線を引く（終わりは要素自身の stroke-dasharray。175.9 は SkillsPage の RING_LENGTH）
        'ring-draw': {
          from: { strokeDasharray: '0 175.9', opacity: '0' },
        },
      },
      animation: {
        // 0.2 秒待って（パネルが開き始めてから）0.5 秒で描く。動きを減らす設定では motion-reduce:animate-none と組で使う
        'ring-draw': 'ring-draw 0.5s var(--motion-ease, cubic-bezier(0.22, 1, 0.36, 1)) 0.2s backwards',
      },
    },
  },
  plugins: [],
};

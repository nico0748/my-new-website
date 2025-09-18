/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // .tsx を忘れずに追加
  ],
  theme: {
    extend: {
      // 'Concert One' フォントを追加
      fontFamily: {
        'concert-one': ['"Concert One"', 'sans-serif'],
      },
      // clamp() に対応するカスタムフォントサイズを追加
      fontSize: {
        'hero-title': 'clamp(100px, 12vw, 240px)',
        'hero-ruby': 'clamp(25px, 4vw, 50px)',
        'hero-lead': 'clamp(1rem, 2.5vw, 1.75rem)',
        'hero-tag': 'clamp(1rem, 2.5vw, 1.5rem)',
      },
      // フェードインアニメーションを追加
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      // アニメーションのプロパティを追加
      animation: {
        'fade-in': 'fadeIn 3.5s cubic-bezier(0.33, 1, 0.68, 1) forwards',
      },
    },
  },
  plugins: [],
};

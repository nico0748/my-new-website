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
    },
  },
  plugins: [],
};

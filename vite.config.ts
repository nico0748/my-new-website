import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon_io/favicon.ico', 'favicon_io/apple-touch-icon.png', 'sns_icon_round.png'],
      manifest: {
        name: 'NICOLABO -にこラボ-',
        short_name: 'NICOLABO',
        description: 'NICOLABO -にこラボ- ホビーサイトです。プロフィールや作品を紹介しています。',
        theme_color: '#2563eb',
        background_color: '#f4f6fb',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        lang: 'ja',
        icons: [
          {
            src: '/favicon_io/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon_io/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/favicon_io/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        // 趣味の記録（OFF-HOURS）の写真は増え続けるので precache せず、表示されたものだけ runtime でキャッシュする
        globIgnores: ['off-hours/**'],
        // /api/*（Vercel Function）は SPA の index.html に差し替えない。SW の入ったブラウザで /api/github などを直接開くと
        // 関数の応答ではなく index.html が返ってしまうため
        navigateFallbackDenylist: [/^\/api\//],
        // Learn 教材（多数の TSX 記事 + highlight.js）でメイン JS が肥大し、
        // 既定の precache 上限 2 MiB を超えてビルドが失敗するため引き上げる。
        // ※ 恒久対策は Learn ルートのコード分割（React.lazy）でメインチャンクを縮小すること。
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB
        runtimeCaching: [
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Sheets API
          {
            urlPattern: /^https:\/\/sheets\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-sheets-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // 趣味の記録（OFF-HOURS）の写真
          {
            urlPattern: /\/off-hours\/.*\.(?:webp|png|jpe?g)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'off-hours-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // プロジェクト Markdown
          {
            urlPattern: /\/projects\/.*\.md$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'markdown-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5177,
  },
})

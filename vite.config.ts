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
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 },
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
          // Topics / Study 記事本文（id ごとに内容不変 → CacheFirst で高速化・オフライン可）
          // ※ 記事の「索引」は上の Google Sheets（NetworkFirst）が常に最新を取りにいくため、
          //   新規記事は index 経由で即座に反映され、本文だけキャッシュされる。
          {
            urlPattern: /\/(topics|study)\/.*\.md$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'article-md-cache',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
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

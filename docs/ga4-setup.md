# GA4（Google Analytics 4）セットアップ手順

このサイト（Vite + React + React Router / Vercel デプロイ）に GA4 でアクセス計測を入れるための手順。
**コード側の組み込みは実装済み**なので、あとは「測定 ID を発行 → 環境変数に入れる → 再デプロイ」で計測が始まります。

---

## 全体像

| 区分 | 内容 | 誰が |
|---|---|---|
| ① GA プロパティ作成 | GA4 プロパティ + ウェブ データストリームを作り、測定 ID `G-XXXXXXXXXX` を取得 | あなた（GA 管理画面） |
| ② 環境変数を設定 | `VITE_GA_MEASUREMENT_ID` にその ID を設定（ローカル + Vercel） | あなた |
| ③ 再デプロイ | Vercel でビルドし直す（env はビルド時に埋め込まれる） | あなた |
| ④ 動作確認 | GA リアルタイム / DebugView で計測を確認 | あなた |
| コード組み込み | gtag 読込・SPA のページ遷移計測 | **実装済み** |

---

## ① GA4 プロパティと測定 ID の取得

1. <https://analytics.google.com/> にログイン。
2. 管理（歯車）→「プロパティを作成」→ プロパティ名・タイムゾーン（日本）・通貨を設定。
3. 「データストリーム」→「ウェブ」を選択し、URL に `` を入力して作成。
4. 作成したストリームの詳細に表示される **測定 ID `G-XXXXXXXXXX`** をコピー。

> Googleタグ（gtag.js）のスニペットが案内されますが、**HTML に貼り付ける必要はありません**。読み込みはコード側（`src/lib/analytics.ts`）が測定 ID を使って自動で行います。

---

## ② 環境変数 `VITE_GA_MEASUREMENT_ID`

Vite では `VITE_` 接頭辞の変数だけがフロントに露出します（`import.meta.env.VITE_GA_MEASUREMENT_ID`）。

### ローカル（`.env.local`）

```bash
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

※ ローカル（`npm run dev`）では**計測は常に無効**にしています（自分のアクセスで数字が汚れないように）。ローカルで挙動を試したい場合は `npm run build && npm run preview`（本番ビルド）で確認します。

### Vercel（本番）

Vercel ダッシュボード → 対象プロジェクト → **Settings → Environment Variables** で追加：

- **Key**: `VITE_GA_MEASUREMENT_ID`
- **Value**: `G-XXXXXXXXXX`
- **Environments**: Production（必要なら Preview も）

`.env.example` にもプレースホルダを追記済みです。

---

## ③ 再デプロイ

環境変数は**ビルド時**に埋め込まれるため、追加後は再ビルドが必要です。

- Vercel の Deployments から最新を **Redeploy**、または
- 何かコミットして push（自動デプロイ）。

---

## ④ 動作確認

本番 URL を開いた状態で、次のいずれかで確認します。

- **GA リアルタイム**: 管理画面 → レポート → リアルタイム。自分のアクセスが「過去 30 分」に現れる。
- **DebugView**: ブラウザ拡張「Google Analytics Debugger」を ON にするか、Chrome DevTools の Network で `google-analytics.com/g/collect`（または `.../collect`）へのリクエストが飛んでいるかを確認。
- ページを何ページか遷移し、SPA のルート遷移ごとに `page_view` が送られることを確認。

> 反映まで数分かかることがあります。**広告ブロッカー / トラッキング防止**が有効だと送信されないため、確認時は無効化するか別ブラウザで。

---

## 実装のしくみ（コード側・変更不要）

- `src/lib/analytics.ts`
  - `initGA()` … 本番ビルドかつ測定 ID がある時だけ `gtag.js` を読み込み初期化。SPA 用に `send_page_view: false`。
  - `pageview(path)` … ルート遷移ごとに `page_view` を手動送信。
  - `trackEvent(name, params)` … 任意のカスタムイベント送信用（下記）。
  - `useAnalytics()` … `useLocation` を監視し、初回＋遷移ごとに `pageview` を呼ぶフック。
- `src/App.tsx` の先頭で `useAnalytics()` を呼び出し済み。
  - `AnimatePresence` によるページ切替（`/`, `/learn`, `/learn/:domain/:id` など）すべてが 1 ページビューとして計測されます。

### なぜ `send_page_view:false` か

GA4 の自動ページビューは**初回ロードしか拾わない**（SPA のクライアント遷移を取りこぼす／URL 更新で二重計測になる）ため、自動を止めて**ルート遷移ごとに自前で 1 回だけ**送る方式にしています。

### カスタムイベントを送りたいとき（任意）

```ts
import { trackEvent } from "../lib/analytics";

// 例: 教材の「コースを始める」クリックを計測
trackEvent("start_course", { domain: "web" });
```

---

## 補足

- **プライバシー**: GA4 は既定で IP を匿名化して扱います。Cookie 同意バナーは今回は入れていません（必要になれば「同意まで gtag を読み込まない」方式に拡張可能）。
- **PWA / Service Worker**: `gtag.js` はランタイムに外部（googletagmanager.com）から読み込むため、`vite-plugin-pwa` の precache 対象外。特別な設定は不要です（オフライン計測が欲しい場合のみ追加対応）。
- **費用**: GA4 は無料。

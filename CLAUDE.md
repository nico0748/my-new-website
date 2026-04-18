# CLAUDE.md — プロジェクトルール

このファイルは Claude Code がこのリポジトリで作業する際に従うべきルールをまとめたものです。

---

## プロジェクト概要

React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion で構築された個人ポートフォリオサイト。

- **データソース**: Google Sheets API（`VITE_GOOGLE_SHEETS_API_KEY`, `VITE_SPREADSHEET_ID`）
- **デプロイ**: Vercel（`vercel.json` で SPA リライト設定済み）
- **開発サーバー**: `npm run dev` → `http://localhost:5177`

---

## デザインルール

### テーマ: ライトテーマ + 方眼紙背景

- **背景色**: `#f4f6fb`
- **方眼紙パターン**: `GraphPaperBackground` コンポーネントを使用（`src/components/ui/GraphPaperBackground.tsx`）
  - ページルートに必ず `<GraphPaperBackground>` でラップする
  - 星空背景（`StarryBackground`）は使わない
- **カラーパレット**:
  - テキスト（主）: `#1e293b`
  - テキスト（副）: `#64748b`
  - アクセント: `#2563eb`（blue-600）
  - カード背景: `rgba(255,255,255,0.75)` + `backdrop-blur`
  - カードボーダー: `rgba(99, 152, 219, 0.2)`

### カードスタイル（glassmorphism）

```tsx
style={{
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(99, 152, 219, 0.2)',
  boxShadow: '0 4px 24px rgba(37, 99, 235, 0.07)',
}}
```

### セクションタイトル

`SectionWrapper` を使用し、タイトルの下に必ずブルーのアクセントライン（ドット装飾）が表示される。

### タイポグラフィ

- フォント: `M PLUS Rounded 1c`（body）、`Concert One`（display）
- タイトルの `letter-spacing`: `-0.03em`
- コード: `JetBrains Mono` または `Fira Code`

---

## アーキテクチャルール

### ルーティング

| パス | ページ | 備考 |
|---|---|---|
| `/` | PortfolioPage | メインポートフォリオ |
| `/hobbys` | HobbyPage | 趣味ページ |
| `/projects/:id` | ProjectDetailPage | Markdownで詳細を表示 |
| `/skills` | SkillsPage | 技術スタック一覧（カテゴリ行＋クリック展開） |
| `/skills/:category` | → `/skills` | リダイレクト |
| `/watched-anime` 等 | アニメページ群 | 既存 |

- 新しいページを追加する場合は `src/App.tsx` にルートを追加し、`src/pages/` 以下にページコンポーネントを作成する。

### データフロー

1. `src/lib/googleSheets.ts` で Google Sheets から行データを取得
2. `src/lib/dataMapper.ts` で型付きオブジェクトに変換
3. ページコンポーネントで `useState` + `useEffect` により非同期取得

新しいデータ型を追加する際は `dataMapper.ts` に `interface` と `mapXxx()` 関数を追加する。

### コンポーネント配置

| 種類 | 場所 |
|---|---|
| UIパーツ（汎用） | `src/components/ui/` |
| レイアウト（ヘッダー等）| `src/components/layouts/` |
| セクション単位の機能 | `src/features/<feature-name>/` |
| ページ | `src/pages/` |

---

## プロジェクト詳細ページ（Markdown）

- `public/projects/<プロジェクトID>.md` にMarkdownファイルを置くと自動表示される
- Markdownのスタイルは `src/index.css` の `.prose-custom` クラスで定義
- `react-markdown` + `remark-gfm` でレンダリング（GFM対応: テーブル・チェックボックス等）

---

## PWA

- `vite-plugin-pwa` で Service Worker と webmanifest を自動生成
- キャッシュ戦略は `vite.config.ts` の `workbox.runtimeCaching` で管理
- アイコンは `public/favicon_io/android-chrome-{192,512}x192.png` を使用

---

## Git / PR ルール

### ブランチ命名規則

```
feat/<機能名>      # 新機能
fix/<バグ内容>     # バグ修正
refactor/<内容>   # リファクタリング
docs/<内容>       # ドキュメント
```

### PR の切り方

**1機能 = 1PR** を原則とする。複数の機能を同時に実装した場合は機能ごとにブランチを切り、スタック式にPRを作成する。

例（依存関係がある場合）:
```
feat/modern-ui-design → main
feat/project-detail-markdown → main（feat/modern-ui-design に依存）
feat/pwa → main（feat/project-detail-markdown に依存）
```

### コミットメッセージ

```
feat: 機能の要約（日本語可）

- 変更点1
- 変更点2

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

## 禁止事項

- `StarryBackground` をポートフォリオページに使用しない（方眼紙背景に統一）
- ダークテーマ（`#0B0C10`, `#1F2833`）をポートフォリオページに使用しない
- ハードコードされたデータを `src/` 以下に置かない（Google Sheets に移行済み）
- 未使用の `console.log` をコミットしない
- `--no-verify` フラグは使わない

---

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動（localhost:5177）
npm run build    # TypeScript チェック + Vite ビルド
npm run lint     # ESLint
npm run preview  # ビルド結果のプレビュー
```

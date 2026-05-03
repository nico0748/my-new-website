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

### テーマ: 和風 × 妖狐（wa-iro.com オマージュ）

- **背景色**: `#f5ede1`（生成り / きなり）— 和紙の地色
- **和紙背景**: `WashiBackground` コンポーネントを使用（`src/components/ui/WashiBackground.tsx`）
  - ページルートに必ず `<WashiBackground>` でラップする
  - 旧 `GraphPaperBackground` / `StarryBackground` / `CircuitBoardBackground` は使わない
- **テーマモード**: 和風ライトのみ（ダークモード未対応・`ThemeToggle` は撤去済み）
- **カラーパレット（CSS 変数経由で参照）**:
  - テキスト（主）: `var(--text-primary)` `#2c1810`（墨色）
  - テキスト（副）: `var(--text-secondary)` `#5e4836`（代赭）
  - テキスト（淡）: `var(--text-muted)` `#8b7355`（黄朽葉）
  - アクセント: `var(--accent)` `#c8443c`（緋色 — fox shrine vermillion）
  - 妖狐 gold: `var(--accent-gold)` `#c89b3c`（山吹色）
  - 朱印: `var(--seal-red)` `#9c2e29`
  - カード背景: `var(--card-bg)` `rgba(253, 248, 238, 0.78)`（絹白 半透明）
  - カードボーダー: `var(--card-border)` `rgba(200, 68, 60, 0.18)`

### カードスタイル（和紙 glassmorphism）

```tsx
style={{
  background: 'var(--card-bg)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid var(--border-color)',
  boxShadow: '0 4px 24px var(--card-shadow)',
}}
```

### セクションタイトル

`SectionWrapper` を使用。各セクションは漢数字（壱・弐・参…）の朱印風ラベル + ローマ字ラベル + メインタイトル + 朱の点アクセントで構成される。

### 装飾要素

- **朱印**: `HankoSeal` コンポーネントで落款風の装飾を配置可能
- **青海波パターン**: `SeigaihaPattern` を背景に極薄で重ねる（`WashiBackground` 内で既に適用済み）
- **Hero**: 鳥居 + 月 + 雲のシルエット SVG を `--accent-fox` 色で薄く描画

### タイポグラフィ（明朝体ベース）

- ディスプレイ（見出し・ロゴ）: `Hina Mincho`（wa-iro.com と同じ）
- 本文: `Shippori Mincho B1` / `Noto Serif JP`
- 手書き風: `Klee One`
- コードブロック（`.prose-custom code`/`pre` 内のみ）: `JetBrains Mono`
- 文字間隔: `letter-spacing: 0.04em` 〜 `0.1em` を基本（明朝体は和文の字間を広めに取る）
- インラインで等幅フォント `JetBrains Mono` を使う場合は `Hina Mincho` への置換を検討

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

- `StarryBackground` / `CircuitBoardBackground` / 旧 `GraphPaperBackground` を使用しない（`WashiBackground` に統一）
- ダークテーマ・ブルー基調の旧パレット（`#0B0C10`, `#2563eb` など）をポートフォリオに使用しない
- 和文には基本的にゴシック体（`M PLUS Rounded 1c` 等）を新規採用しない（既存の hobby 系のみ残置可）。新規追加は明朝体（`Hina Mincho` / `Shippori Mincho B1`）を選ぶ
- ハードコードされたデータを `src/` 以下に置かない（Google Sheets に移行済み）
- ハードコードされた色（`#xxxxxx`）を直接書かず、CSS 変数（`var(--accent)` 等）経由で参照する
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

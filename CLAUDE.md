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

### テーマ: ダーク・ターミナル（IT / エンジニア系）

漆黒地にエレクトリック・シアンのアクセント。ターミナル / ハッカー系の演出（演出重視ハイブリッド：Hero とセクション見出しに `$` プロンプト・タイピング・点滅カーソルを被せ、中身は普通に読める）。

- **背景色**: `#0a0d12`（漆黒・近黒）
- **背景コンポーネント**: `TerminalBackground` を使用（`src/components/ui/TerminalBackground.tsx`）
  - ページルートに必ず `<TerminalBackground>` でラップする
  - 漆黒 + 極薄シアングリッド + 微グロー + 走査線で構成
  - 旧 `WashiBackground` / `SeigaihaPattern` / `GraphPaperBackground` / `StarryBackground` は削除済み・使わない
- **テーマモード**: ダーク単独（ライトモード未対応・`ThemeToggle` なし）
- **カラーパレット（CSS 変数経由で参照）**:
  - テキスト（主）: `var(--text-primary)` `#e6edf3`（オフホワイト）
  - テキスト（副）: `var(--text-secondary)` `#9da7b3`
  - テキスト（淡）: `var(--text-muted)` `#5c6773`
  - アクセント: `var(--accent)` `#00e5cc`（エレクトリック・シアン）
  - サブ（アンバー）: `var(--accent-gold)` = `var(--accent-amber)` `#ffb454`
  - サブ（マゼンタ）: `var(--accent-fox)` = `var(--accent-magenta)` `#ff5c8a`
  - カード背景: `var(--card-bg)` `rgba(17, 22, 29, 0.72)`（グラス 半透明）
  - カードボーダー: `var(--card-border)` `rgba(0, 229, 204, 0.18)`
  - サーフェス: `var(--surface)` `#11161d`
  - グリッド線: `var(--grid-line)` `rgba(0, 229, 204, 0.06)`
  - ※ 旧変数名 `--seal-red` は名前のみ残置（値はシアン）。新規参照では使わない。

### カードスタイル（グラス glassmorphism）

```tsx
style={{
  background: 'var(--card-bg)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid var(--card-border)',
  boxShadow: '0 4px 24px var(--card-shadow)',
}}
```

### セクションタイトル

`SectionWrapper` を使用。各セクションは連番ラベル（`01`・`02`…）+ ターミナルプロンプト風ラベル（`~/works ❯`）+ メインタイトル（点滅カーソル付き）+ シアンの下線アクセントで構成される。

### 装飾要素

- **降るグリフ**: `TerminalParticles` コンポーネント（`0 1 { } ; / >` 等が背景にゆっくり落ちる）。旧 `SakuraPetals` の後継。
- **グリッド / 走査線**: `TerminalBackground` 内で適用済み。
- **Hero**: ターミナルウィンドウ（信号機ドット + タイトルバー）の中で `whoami` → 名前をタイピング表示、`cat role.txt` → 肩書きを表示。点滅カーソル `_`（`.terminal-cursor` クラス）。
- **ターミナルバッジ**: monospace の `{ dev }` `>_` 等を小さなバッジで配置（旧 `HankoSeal` 朱印の後継）。

### タイポグラフィ（英数=等幅 / 和文=ゴシック）

- ディスプレイ（見出し・ロゴ）: `JetBrains Mono`（等幅）
- 本文（和文）: `Noto Sans JP`（ゴシック）
- コードブロック / ターミナル演出: `JetBrains Mono`
- 文字間隔: `letter-spacing: 0.01em` 〜 `0.02em` を基本（等幅は字間を詰める）
- 等幅フォントは日本語グリフを持たないため、和文が混じる箇所は `'JetBrains Mono', 'Noto Sans JP'` の順でフォールバックさせる

---

## アーキテクチャルール

### ルーティング

| パス | ページ | 備考 |
|---|---|---|
| `/` | PortfolioPage | メインポートフォリオ |
| `/hobbys` | HobbyPage | 趣味ページ |
| `/projects/:id` | ProjectDetailPage | Markdownで詳細を表示 |
| `/topics` | TopicsPage | セキュリティ等のトピック一覧（カテゴリ絞り込み） |
| `/topics/:id` | TopicDetailPage | Markdownで詳細を表示（md 無しは description + externalUrl にフォールバック） |
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

## Topics コンテンツ（セキュリティ等）

- データソースは Google Sheets の **「Topics」シート**（既存の Projects と同じ仕組み）
  - ヘッダー列: `id, title, description, category, date, tags, thumbnail, author, markdownFile, externalUrl, source`
  - 型・マッパーは `src/lib/dataMapper.ts` の `TopicItem` / `mapTopicData`（新しい順にソート）
- 記事本文は `public/topics/<id>.md` に置くと `/topics/:id` で自動表示（`.prose-custom`）。md が無い場合は `description` ＋ `externalUrl` にフォールバック
- **カテゴリ**: `news` / `cve` / `vuln` / `daily` / `it` / `other`（自由文字列・未知は other 扱い）。色・ラベル・絵文字は `src/lib/topicCategories.ts` の `getTopicCategoryStyle` で一元管理。新カテゴリはここに追加する
- 一覧 `TopicsPage` / 詳細 `TopicDetailPage` / カード `TopicCard`。トップページ（`portfolioPage.tsx`）にも最新3件の抜粋セクション（`id="topics"`）あり
- `source = "auto"` / `externalUrl` は将来の自動取り込み（CVE/ニュースフィード）用に予約済み

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

- 旧 `WashiBackground` / `SeigaihaPattern` / `StarryBackground` / `GraphPaperBackground` を使用しない（`TerminalBackground` に統一）
- 和風パレット（`#f5ede1` 生成り / `#c8443c` 緋色 / `#2c1810` 墨色 など）や明朝体（`Hina Mincho` / `Shippori Mincho B1`）をポートフォリオに新規採用しない（ダーク・ターミナルに統一）
- 見出し・ロゴは等幅（`JetBrains Mono`）、和文本文はゴシック（`Noto Sans JP`）を使う。明朝体・手書き体（`Klee One`）は新規採用しない
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

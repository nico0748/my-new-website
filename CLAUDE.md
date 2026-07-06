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
| `/learn` | LearnPage | 教材トップ（分野カード一覧） |
| `/learn/:domain` | LearnDomainPage | 分野ページ（章ごとに記事を整理） |
| `/learn/:domain/:id` | LearnDetailPage | 記事詳細（本文は TSX コンポーネント） |
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

## Study コンテンツ（学習記録）

学習・深掘りした内容の記録。Topics と同一構造（claude-obsidian で執筆 → Google Sheets へ送信 → サイト表示）。

- データソースは Google Sheets の **「Study」シート**（ヘッダー列は Topics と同一）
  - 型・マッパーは `src/lib/dataMapper.ts` の `StudyItem` / `mapStudyData`（新しい順にソート）
- 記事本文は `public/study/<id>.md` に置くと `/study/:id` で自動表示。md が無い場合は `description` ＋ `externalUrl` にフォールバック
- **カテゴリ**: `language` / `framework` / `cs` / `security` / `infra` / `book` / `other`（自由文字列・未知は other）。色・ラベル・絵文字は `src/lib/studyCategories.ts` の `getStudyCategoryStyle` で一元管理
- 一覧 `StudyPage` / 詳細 `StudyDetailPage` / カード `StudyCard`。トップにも最新3件の抜粋セクション（`id="study"`）あり
- **GAS（`scripts/gas/`）は Topics/Study 兼用**: `append-topic.gs` は `sheet` パラメータで追記先を切替（許可リスト `['Topics','Study']`）、`notify-topics.gs` は両シートの onChange を1トリガーで Slack 通知（シートごとに最終通知行を管理）

---

## Learn コンテンツ（IT 教材知識）

Web・インフラ・セキュリティを分野ごとに体系立ててまとめた教材集。Study/Topics が「時系列フロー型（新しい順のフィード）」なのに対し、Learn は **分野→章→記事で体系立てた「ストック型（教科書）」**。日付順ではなく章の順序で読ませる。

### データの持ち方 — ⚠️ Sheets ではなく TSX 同居（教材のみの例外）

- 記事は **`src/content/learn/<domain>/<id>.tsx`** に置く。各ファイルが次の2つを export する：
  - `export const meta: LearnMeta` … 一覧・絞り込み・章の並び順に使うメタ情報
  - `export default function Article()` … 本文（自由な TSX。演出の自由度を優先）
- **索引は `import.meta.glob` で自動生成**（`src/lib/learnRegistry.ts`）。記事を増やすときは TSX を1本足すだけ。レジストリやページの編集は不要
- 記事本文は `.learn-docs .prose` でラップされるので、素の `<h2>`/`<p>`/`<ul>` はそのまま整形される。加えて `src/components/learn/kit.tsx` の部品（`Section` `Callout` `Code` `Steps`/`Step` `KeyPoints` `ComparisonTable` `KVList` `TipBox` `Figure` `Cmd` `Lead` `Divider`）でリッチに書ける
- ⚠️ **これは「ハードコードされたデータを `src/` に置かない」ルールの教材専用の例外**。教材本文はデータではなくコード（自由度の高い表現）であるため。Study/Topics/Projects 等は従来どおり Google Sheets を使う

### デザイン — ⚠️ ポートフォリオとは独立（Learn 専用スタイル）

- Learn はポートフォリオのダーク・ターミナル調を**踏襲しない**。**Progate 系のライトなドキュメント調**（Inter フォント／ティール `#22b0a0` ＋ ピンク CTA `#ff5c7a` ／白背景・ネイビー見出し）で構成する
- 専用 CSS は `src/styles/learn.css`。**すべて `.learn-docs` 配下にスコープ**し、グローバル（index.css のダークテーマ・Tailwind）に影響させない。CSS 変数も `.learn-docs` 上で定義（`--accent` 等の portfolio 変数は使わない）
- レイアウトは2系統:
  - **`/learn`（ランディング）= `LearnPage`**: サイドバーなしの Progate 系マーケティング面。ヒーロー＋ミント帯＋**コースカード（`.course-grid` / `.course-card`）**。body 背景は `useEffect` で白に切替
  - **`/learn/:domain`・`/learn/:domain/:id` = `LearnDomainPage` / `LearnDetailPage`**: `LearnLayout`（固定ヘッダー＋進捗バー＋左サイドバー `DomainNav` ＋ 780px 本文）。詳細は本文 h2 から「On this page」自動生成＋前後ナビ
- **⚠️ 絵文字（emoji / ピクトグラム）は Learn UI 全体で使わない**。分野アイコンは `public/learn/covers/<domain>.svg` の**カバー画像**で表現する（`←`/`→` 等の矢印記号は可）
- 「分野」は UI 上 **「コース」** と表記する（内部キーは `domain` のまま）

### 区分（コース・章・レベル）

- **コース（domain / URL）**: `web`（ティール `#22b0a0`） / `infra`（アンバー `#e6a532`） / `security`（ピンク `#f0637e`）。将来 `cs` / `dev` を追加可能。各コースは `accent`（色）・`cover`（カバー画像パス）・`description` を持つ
- **章（section）**: コースごとに定義（例: web = `web-basics` / `frontend` / `backend` / `api`）。配列順が表示順
- **レベル（level）**: `intro`(入門) / `basic`(基礎) / `practice`(実践)
- **order**: 章内の並び順（体系順。日付ではない）
- コーススタイル・章定義・レベルは `src/lib/learnCategories.ts` で一元管理。コース/章を増やすときはここに追加し、カバー画像を `public/learn/covers/` に置く
- 一覧 `LearnPage` / コース `LearnDomainPage`（学習パス）/ 詳細 `LearnDetailPage`
- **メタ任意項目**: `minutes`（目安の所要時間・分）を持たせるとカード/詳細に「約N分」表示
- **学習進捗（localStorage）**: 見出し読了 `nicotech:read:<path>#<anchor>`（`kit.tsx` の `Section` チェックボックス）→ 全見出し読了で記事完了 `nicotech:done:<path>` を `LearnLayout` が自動設定。コース進捗は `src/lib/learnProgress.ts`（`getCourseProgress` 等）で集計し、コースページの進捗バー・ランディングのカード進捗に反映。変更時は `nicotech:progress` イベントを発火し `useProgressTick` で再描画
- **⚠️ トップ（`portfolioPage.tsx`）・ヘッダー nav には出さない**。教材ライブラリはポートフォリオとは独立させ、`/learn` への直接アクセス（ルーティング）のみで到達させる方針。導線セクションやnavリンクを追加しないこと

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
- ハードコードされたデータを `src/` 以下に置かない（Google Sheets に移行済み）。※例外は Learn 教材のみ（`src/content/learn/` の TSX 記事。詳細は「Learn コンテンツ」節）
- **Learn（`/learn`）UI で絵文字（emoji / ピクトグラム）を使わない**。コース・カテゴリのアイコンは `public/learn/covers/` のカバー画像か SVG アイコンで表現する（矢印記号 `←`/`→` は可）
- Learn のデザインにポートフォリオのダーク・ターミナル調（`TerminalBackground`・`--accent` 等の portfolio 変数）を持ち込まない。Learn は `.learn-docs` スコープの専用スタイル（`src/styles/learn.css`・Progate 系ライトテーマ）で統一する
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

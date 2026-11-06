# CLAUDE.md — プロジェクトルール

このファイルは Claude Code がこのリポジトリで作業する際に従うべきルールをまとめたものです。

---

## プロジェクト概要

React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion で構築された個人ポートフォリオサイト。

- **データソース**: Google Sheets API（`VITE_GOOGLE_SHEETS_API_KEY`, `VITE_SPREADSHEET_ID`）
- **デプロイ**: Vercel（`vercel.json` で SPA リライト設定済み）。**本番は `main` ブランチのみ**、`develop` などその他のブランチは Preview デプロイ
- **開発サーバー**: `npm run dev` → `http://localhost:5177`
- **アクセス計測**: GA4（`VITE_GA_MEASUREMENT_ID`）。`src/lib/analytics.ts` の `useAnalytics()` を `App.tsx` で呼び、SPA のルート遷移ごとに `page_view` を送信。**本番ビルド かつ 本番ドメイン（`nico-labo748.dev`）の時だけ有効**（dev と Vercel の Preview では無効）。手順は `docs/ga4-setup.md`

---

## デザインルール

### テーマ: Calm Dark（落ち着いた大人のダーク・余白重視）

2026-11 に旧「ダーク・ターミナル」調から刷新。参考は https://newt239.dev 。装飾は最小限にし、**静かなタイポグラフィと整った余白**で見せる（2026-11 に「狭い1カラム」はやめ、一覧は広い幅で段組みにした）。カードやグロー、ネオン色、ターミナル演出（`$` プロンプト・点滅カーソル・走査線・グリッド）は使わない。

- **レイアウト**: `src/components/layouts/SiteLayout.tsx` の `SiteLayout` でページをラップする（ヘッダー＋本文＋フッター込み）。コンテナは `CONTENT_WIDTH`（`max-w-[1080px]` ＋左右余白 `px-5 sm:px-8 lg:px-10`）で全ページ共通。**文章ブロックは `READABLE_WIDTH`（`max-w-[680px]`、日本語で1行 38〜42 字前後）に収める**（紹介文・ページのリード・Timeline の説明・作品詳細の Markdown は 760px まで）。セクション間は `mt-24 md:mt-32`、ヒーローの上は `pt-12 md:pt-20`
- **部品**: `SectionHeading`（小さな大文字見出し）/ `MoreLink`（「すべて見る →」）/ `PageTitle`（下層ページのタイトル）/ `Loading`
- **Works / Articles は画像付きのボックス（スマホ1段・タブレット2段・PC 3段、`gap-5 lg:gap-6`。トップには最大6件）**: `WorkList`（サムネイル）/ `ArticleList`（OGP 画像）。枠線は `border-white/[0.08]`、ホバーで少し明るく。画像が無い場合は静かなプレースホルダー
- **Skills** はカテゴリごとのレーダーチャート（`SkillRadarChart`、recharts）をボックスで並べる
- **Activity**（GitHub の活動。SKILLS と TIMELINE のあいだ、`<SectionHeading id="activity">`）は `GitHubActivity`（`src/components/ui/GitHubActivity.tsx`）。専用ページ・NAV 追加は無し。中は OFF-HOURS と同じ形の小見出し（アイコン＋名前、右に 13px 淡色の補足）が 2 つ。データは「GitHub（ACTIVITY）」節
  - **コントリビューション**（`CalendarDays`、右に「過去 1 年 · N 件」、md 未満は「直近半年 · N 件」＝見えている 26 週の合計）: 枠の箱に入れず**地の上にじかに**置くヒートマップ。左に曜日ラベル（月 / 水 / 金）、右に週ごとの列（`weeks.length` 個。53 と決め打ちしない。各列は `flex-1 min-w-0`、中は `weekday` で行を決める 7 行で、最初・最後の欠けた週は空ける）。マス目は `aspect-ratio: 1`・角丸 2px・間 3px（md 未満 2px）で幅に合わせて伸び縮みし、全体の max-width（週数 × 17px − 3px ＋ 曜日ラベル幅）で **14px を超えない**（lg で 14px・md で約 10px・390px で約 10px）。横スクロールはしない。**md 未満は直近 26 週だけ**（古い列に `max-md:hidden`。月ラベルは各週の列の中に absolute で置くので列と一緒に消える）。月ラベル（13px 淡色）は週の最初の日の `date.slice(5,7)` が前の列と変わる列に「11月」（1 列目は次のラベルまで 2 列以内なら出さない。日付は文字列のまま扱い Date で読み直さない）。色は `index.css` の `--heat-0`〜`--heat-4`（`--bg` に淡色 / セージ `--accent-2` を混ぜたもの。`--card-bg` の上では沈む）で、段階は GitHub の `contributionLevel` のまま（しきい値を持たない）。セルの `title` は「2026.11.05 · 3 件」（フォーカスは付けない）。グリッドに `role="img"` と `aria-label`、凡例「少ない ■■■■■ 多い」は aria-hidden。今日の強調・streak・活動日数・最多の日は出さない
  - **リポジトリ**（`FolderGit2`、右に「最近更新した順」）: `ArticleList` のカードから画像を外した形（名前 17px / 説明 14px 2 行まで / 下段 13px 淡色「TypeScript · 2026.10.28 更新」、↗ は下段の右端にホバーで）。カード全体が外部リンク。選び方は `src/lib/github.ts` の `pickRepos()`: Projects シートの `repoUrl` に載っているものを除く（小文字にし末尾の `/` と `.git` を外して比べる。WORKS 以外のコードを見せる欄）→ 説明のあるものを優先（3 件に満たないときだけ説明の無いもので埋める）→ 先頭から 3 件。**PC 3 列 3 件 / タブレット 2 列 2 件（3 件目を隠す）/ スマホ 1 列 3 件**。Projects を読み終えるまでは小見出しごと出さない（後から入れ替わらないように）。言語の色の点・スター・フォーク数は出さない
  - 締めに `MoreLink external`「すべてのリポジトリを見る」（Profile シートの `githubUrl`、無ければ `https://github.com/nico0748` に `?tab=repositories`）。出典の注記は付けない（自己紹介とフッターに同じリンクがある）。カレンダーが無い / 0 件ならコントリビューションの欄、リポジトリが 0 件ならリポジトリの欄を出さず、両方無ければセクション（見出し・MoreLink 含む）ごと出さない。読み込み中の文言は出さない
- **Timeline** は `Timeline`（年見出し + 縦線 + 「期間 · 種別」→ タイトル → 説明）。継続中の項目は差し色のドット
- **Off-hours**（趣味の記録、TIMELINE の下）は `OffHoursBoard`。カテゴリ（アニメ → 音楽 → イベント → 同人作品）ごとに見出し（アイコン＋名前、右に出典）を立て、1 件 1 枚のカード（64px 角のサムネイル＋タイトル `↗`＋補足行）を **PC 4 列・タブレット 2 列・スマホ 1 列**で並べる。件数はアニメ 8 / 音楽 12 / イベント 8 / 同人作品 4（スマホは 4 / 6 / 4 / 4）。URL があればカード全体がリンクで、ホバーで枠が明るくなる。アニメだけは `/anime` と同じ `AnimeCard`（横長サムネイルが上、スマホも 2 列）で、押すと `/anime` のポップアップへ（下に「すべてのアニメを見る →」）。**お気に入り（`isFavorite`）が 1 件でもあればお気に入りだけ**を出し（見出しの右は「お気に入り · Annict の視聴記録より」、押すと `/anime?tab=favorite` のポップアップ）、1 件も無ければ最近の作品。画像が無い・読めなければ lucide-react のアイコン（stroke 1.75）。リードは「コードの外で、観て、聴いて、手に取って、足を運んだもの。」
- **アニメ**（`/anime`）: タブは お気に入り → 見てる → 見た → 見たい。**最初に開くのはお気に入り**（1 件も無ければタブごと出さず 見てる から）。スマホでタブが収まらないときは横スクロール。選んだタブの下線（2px）は中央から左右へ伸びる。タブの下に**放送時期の絞り込み** `AnimeSeasonFilter`（年のセレクト → その年の季節のボタン「すべて / 冬 / 春 / 夏 / 秋」、件数付き。`?season=2024-winter` / `?season=2024` で URL に残し、タブを切り替えても保つ）。⚠️ 季節は文字順で並べない。年の中は 冬 → 春 → 夏 → 秋（Annict の区分）で、比較は `dataMapper.ts` の `ANIME_SEASONS` / `parseSeason()` / `seasonRank()` を使う。`AnimeCard`（`src/components/ui/AnimeCard.tsx`）を PC 4 列・タブレット 3 列・スマホ 2 列で 48 件ずつ。サムネイル `AnimeThumb` は **40:21 の横長の枠**に揃え、横長の画像（幅/高さ ≥ 1.5）は枠いっぱい、縦長・正方形は全体を収めて左右を同じ画像のぼかしで埋める。画像が読めなければ公式 X のアイコン → Tv アイコン。カードを押すと `AnimeModal`（画像・タイトル・状態・放送時期・種別・話数、公式サイト / Annict / Wikipedia / ハッシュタグのリンク、原作・監督・アニメーション制作・キャスト・Annict の記録数）
  - **画像とタイトルは Works と同じモーフ**: `.vt-anime-img` / `.vt-anime-title` が `view-transition-class: project-img / project-title` に `anime-morph`（ポップアップより手前に出す z-index）を足したもの。名前は `animeVtName()`。一覧では**最後に開いた作品のカードだけ**に名前を付ける（数百件に付けるとスナップショットが重いため。押した瞬間に `flushSync` で付けてから遷移）。トップの OFF-HOURS のアニメは全カードに付ける
  - 開閉は `<Link viewTransition>` / `navigate(-1)` による同じページ内の遷移。その間だけ `html[data-vt="modal"]` が付き（`AnimePage` の `useModalTransitionFlag`、`UNSAFE_ViewTransitionContext` で判定）、ページ全体のフェードを止めて背景（`anime-backdrop`）とパネル（`anime-panel`）だけを動かす
- **ソーシャルリンク** は `SocialLinks`。1件1枚のカード（サービス名＋ユーザー ID、右端にアイコン）を縦に積み、トップの自己紹介では**名前と同じ高さから右側に**置く（タブレット未満では紹介文の下。右カラムは 300px）。**アイコンは各サービス本来の色**（`--brand-x` / `--brand-github` / `--brand-qiita` / `--brand-linkedin`）、ID は主テキスト色、サービス名は副テキスト色。URL は Profile シートの `xUrl` / `githubUrl` / `qiitaUrl` / `linkedinUrl`。ID は URL から自動で取り出すが、LinkedIn は `linkedinLabel`（例 `細澤 悠真`）で表示名を上書きできる。アイコンは各サービス公式のロゴマーク（Qiita も公式マーク。Simple Icons 由来）。自己紹介のアバターは `w-24`（md 以上 `w-32`）。Profile シートの取得とリンクの組み立ては `src/lib/profile.ts`（`fetchProfile()` はモジュール内キャッシュ、`socialLinksOf()`）に一本化し、トップとフッターで共有する
- **フッター**（`SiteLayout` 内の `SiteFooter`）: 罫線の下に、左はサイト内リンク（Home / Works / Articles / Skills。ヘッダーの NAV と同じ）、右は SNS のテキストリンク（自己紹介と同じ X / GitHub / Qiita / LinkedIn、`↗` 付き）、最下段に `© 年 NICOLABO`。SNS は Profile シートを読み終えてから出す。ページを足したら `NAV` に足せばヘッダーとフッターの両方に出る
- **背景**: `SiteBackground`（インクネイビー一色＋上部にごく僅かな青い明るさ）。`SiteLayout` が内部で使う
- **テーマモード**: ダーク単独
- **カラーパレット（CSS 変数経由で参照）**:
  - 背景: `var(--bg)` `#0f1217`（インクネイビー＝青みのある黒） / サーフェス `var(--surface)` `#161a21`
  - テキスト（主）: `var(--text-primary)` `#e8eaee` / （本文）`var(--text-body)` `#c9cdd4`
  - テキスト（副）: `var(--text-secondary)` `#9ba2ad` / （淡）`var(--text-muted)` `#666d78`
  - アクセント（主）: `var(--accent)` `#cbbf9f`（サンドベージュ）。セクション見出しと左の短い線・「すべて見る →」（`.link-accent`）
  - アクセント（従）: `var(--accent-2)` `#8fb59b`（セージ）/ `var(--accent-3)` `#86a7cf`（ダスティブルー）/ `var(--accent-4)` `#d9b65a`（マスタードイエロー）/ `var(--accent-5)` `#a89be0`（ラベンダー）。スキルのチャートと `/skills` のカテゴリ（件数・選択中のスキルの枠線）は `src/lib/skillColors.ts` の `skillColor()` でカテゴリ名から色を決める（Frontend=緑 / Backend=青 / Database=黄 / Infrastructure=紫）。サンドは見出しの色なのでチャートには使わない
  - 罫線: `var(--border-color)` `rgba(160,180,210,0.1)`（青みを帯びた薄い線）
- **リンク**: 通常は `.link-quiet`（副テキスト色 → ホバーで主テキスト色）。外部リンクは `↗`
- **アニメーション**:
  - **動きの型は 2 つだけ**: 内容は `Reveal` のフェードアップ、構造は **1px の線が起点から伸びる**形（線を使うのは見出しの印・時間軸・現在地など構造を表すものだけ）。イージングは `index.css` の `--motion-ease`（`cubic-bezier(.22, 1, .36, 1)`）1 本で、`--view-transition-easing` もこれを参照する。文字が先・飾りは後、遅延は `min()` で 0.8s まで
  - **一度きり**: ポートフォリオでは無限ループ（点滅・パルス・走り続ける動き）を使わない。繰り返すのは利用者が操作したときだけ。本文段落・数値・ヘッダー・背景・アバターは動かさない
  - **スクロールで下からフェードイン**は `src/components/ui/Reveal.tsx` の `Reveal` で包む（一度だけ・同じフレームで入った要素は DOM 順に 0.1 秒ずつずらす）。トップでは Profile → WORKS → ARTICLES → SKILLS → ACTIVITY → TIMELINE → OFF-HOURS の各見出し・カード・Activity のヒートマップ（小見出しごと 1 つ。セルを順に点ける演出はしない）・年ごとの Timeline・Off-hours の箱を個別に包んでいる。`WorkList` / `ArticleList` のカードは常に Reveal 付き
  - ページ遷移（View Transition）で入ってきたときは、最初の画面に入る Reveal は**アニメせず即表示**する（遷移アニメとの二重化と、共有要素のモーフ後のちらつきを防ぐ）。**戻る / 進む**でスクロール位置が復元されたときも、遷移アニメの最中に画面へ入った Reveal は即表示（IntersectionObserver のコールバックで `useViewTransitionState` を見る）。新しく Reveal を足すときもこの仕組みに乗せ、framer-motion の `initial={{ opacity: 0 }}` や新しい初期 transform を `view-transition-name` を持つ要素（作品・アニメの画像とタイトル、`site-header`、`nav-indicator`）とその祖先に付けないこと
  - **線の演出**は `index.css` の「線の演出」節のクラスを、一番近い Reveal の中の要素に付ける（新しい IntersectionObserver は増やさず、Reveal の `.is-shown` / `.is-instant` と `--reveal-delay` に乗る。Reveal の外では最初から終状態）: `.draw-x`（横線を左から）/ `.draw-y`（縦線を上から）/ `.draw-dot`（線上の点を `--i` の順に）/ `.brighten`（文の一部を `--i` の順に副テキスト色 → 主テキスト色へ）。使っている所は `SectionHeading` の短い線（文字の 0.25s 後に 0.6s）、Timeline の縦線（年ごとに 0.9s）と過去の項目の点（継続中の差し色の点は最初から出す）、OFF-HOURS のリードの 4 つの動詞（0.4s・120ms 間隔）。framer-motion の `reducedMotion` は opacity や線を止めないので、線の演出は CSS で書く
  - **ヘッダーの現在地**: 選択中の NavLink の下に 16px のサンドの線（`view-transition-name: nav-indicator`）。ページを移ると View Transition で隣の項目へ滑る（名前は常に 1 つだけ）
  - **名前の切替**（nico ⇄ 本名）は切り替えたときだけ、枠の中で古い語が上へ抜け、新しい語が下から入る（0.35s。ページを開いたときは動かさない）。見出しの名前は表示中の名前から取り、ボタンに `aria-label` は付けない（本名が読み上げられるため）。操作の説明は本名を含まない `aria-describedby`（「表示名を切り替えます」）
  - 画面遷移は `index.css` の View Transitions 節で制御。ページ全体は「旧ページを先に消し、新ページを少し遅らせて下から浮かべる」。作品の画像・タイトルは `vt-project-img` / `vt-project-title`（`view-transition-class`）＋ `projectVtName()` の名前でモーフし、時間とカーブは `--vt-morph-duration` / `--vt-morph-easing`
  - サイト内リンクは `<Link viewTransition>` にする（ヘッダー・フッター・「すべて見る →」も対応済み）。スクロール位置は `RootLayout` の `<ScrollRestoration />` が管理（新しいページは先頭から、戻る / 進むは復元）
  - `prefers-reduced-motion: reduce` では Reveal も線の演出も画面遷移も動かさず、最初から終状態を出す（`index.css` のグローバル規則は時間を縮めるだけで遅延が残るので、遅延のある演出は個別に `transition: none` にする）

### タイポグラフィ

- 本文・見出しとも `var(--font-sans)` = `Inter` + `Noto Sans JP`
- 等幅 `JetBrains Mono` はコード（`pre` / `code`）のみ
- 見出しは `font-semibold` 程度に留め、極端に太くしない。本文の行間は広め（`leading-[2.1]` 前後）
- 文字サイズは大きめ（2026-11 に一段階拡大）。目安: 本文・自己紹介・カードのタイトル `17px` / カードの説明 `14px` / 補足（タグ・日付）`13px` / ナビ・リンク `15px` / セクション見出し（WORKS など）`19px`（md 以上 `21px`、`font-semibold`。「すべて見る →」の 15px と差を付ける）。`text-xs` `text-sm` は使わず px 指定で揃える。Markdown（`.prose-custom`）は `1.0625rem`

---

## アーキテクチャルール

### ルーティング

| パス | ページ | 備考 |
|---|---|---|
| `/` | PortfolioPage | メインポートフォリオ |
| `/projects/:id` | ProjectDetailPage | 作品の詳細（本文は記事テンプレートの TSX、無ければ Markdown） |
| `/projects` | ProjectsPage | 作品一覧（行リスト） |
| `/articles` | ArticlesPage | 自分が書いた記事の一覧（Qiita + Articles シート）。各記事は外部サイトへ遷移 |
| `/topics/*` | → `/` | 廃止（リダイレクト） |
| `/study/*` | → `/articles` | 廃止（リダイレクト） |
| `/skills` | SkillsPage | 技術スタック一覧（カテゴリ行＋クリック展開） |
| `/skills/:category` | → `/skills` | リダイレクト |
| `/learn` | LearnPage | 教材トップ（分野カード一覧） |
| `/learn/:domain` | LearnDomainPage | 分野ページ（章ごとに記事を整理） |
| `/learn/:domain/:id` | LearnDetailPage | 記事詳細（本文は TSX コンポーネント） |
| `/anime` | AnimePage | アニメの記録（お気に入り / Annict の 見てる / 見た / 見たい をタブで切り替え、`?tab=favorite\|watching\|watched\|wanna`。既定はお気に入り、無ければ 見てる）。放送時期の絞り込みは `?season=2024-winter`（年だけなら `?season=2024`）。カードを押すと `?id=` でポップアップ |
| `/hobbys` | → `/` | 廃止（リダイレクト）。趣味の記録はトップの Off-hours に移行 |
| `/watched-anime`・`/watching-anime`・`/to-watch-anime` | → `/anime?tab=...` | 旧アニメ一覧（リダイレクト） |

- 新しいページを追加する場合は `src/App.tsx` の `appRoutes` にルートを追加し、`src/pages/` 以下にページコンポーネントを作成する。
- ルーターは **data router（`createBrowserRouter`、`src/main.tsx`）**。`<Link viewTransition>` による一覧 → 詳細の共有要素モーフは data router でしか効かないため、`BrowserRouter` / `<Routes>` に戻さないこと

## Works（Projects シート）

- 列: `id, title, description, thumbnail, tags, liveUrl, repoUrl, period, images`
  - `period`: 制作期間（例 `2025.04 - 2025.07`、継続中は `2026.10 -`）
  - `images`: 詳細ページのギャラリーに並べる追加画像（カンマ区切り。画像は `public/projects/images/`）
  - `thumbnail`: 自作アプリ（PaperLens / SecOwl）は「左にアプリ名、右に Mac の画面に映したアプリ」の 16:10 画像（2000×1250 の WebP）。元の画面スクリーンショットは `public/projects/images/<id>-*.webp` に置く
- 取得は `src/lib/projects.ts` の `fetchProjects()` に一本化（モジュール内キャッシュ）。詳細ページが最初の描画から画像とタイトルを出せるようにするためで、これが無いと View Transition のモーフが効かない
- 一覧カードと詳細ページは `projectVtName("img" | "title", id)` で同じ `view-transition-name` を付ける
- 詳細ページ（`/projects/:id`）は 画像ギャラリー＋右サイドバー（タイトル・期間・技術構成・リンク）→ 本文（「Works 記事」節。`src/content/works/<id>.tsx`、無ければ `public/projects/<id>.md`）→ 前後の作品ナビ

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

## Works 記事（作品詳細の本文）

作品詳細（`/projects/:id`）の本文は、独自コンポーネントの記事テンプレートで書く（2026-11 に Markdown から移行。理由は読みやすさと、アプリの説明に動く図を入れるため）。

- **本文**: `src/content/works/<作品 id>.tsx` に default export の記事コンポーネントを 1 つ置くだけ（ファイル名 = Projects シートの id）。`src/lib/worksRegistry.ts` が lazy の `import.meta.glob` で自動索引する（eager の glob と併用しない。本文がメインチャンクに入る）。タイトル・期間・タグはシートが正なので、TSX に meta は置かない
- **表示の優先順位**: TSX → シートの `markdownFile` / `public/projects/<id>.md`（従来の `.prose-custom`）→ 「詳しい紹介は準備中です。」。切り替えは `src/components/works/WorkBody.tsx`。Suspense は本文だけに巻く（ヘッダーの View Transition のモーフを壊さないため）。前後の作品の本文は先読み
- **外枠** `WorkArticle`: 本文 680px（1 行 38〜42 字）、lg 以上で右に sticky の目次（`Section` の h2 だけ。現在地はサンドの 1px の線）。lg 未満は本文の先頭に折りたたみの目次
- **部品** `src/components/works/kit.tsx`: `Lead`（冒頭 19px）/ `Section`（h2。`id` 必須、`no` で淡色の章番号、`toc` で目次の短い名前。見出しの前にサンドの短い線）/ `Sub`（h3、`no="2-1"`）/ `H4` / `Figure`（スクリーンショット＋13px のキャプション、押すと拡大）/ `Table`（横スクロール。4 列以上は `stack` で md 未満を縦積み）/ `Stats`（数字は動かさない）/ `Code`（highlight.js）/ `Callout` / `Quote` / `Fn`＋`Footnotes`。素の `p` `ul` `ol` `strong` `code` `a` もそのまま整形される
- **動く図** `src/components/works/motion.tsx`: `Flow`（処理の流れ。PC はステップ 4 つまで横並び、それより多いかスマホは縦。各ノードに `value` の札）/ `Layers`（構成図。層を積み、`aside` で別経路、`boundary` で「端末の中」などの枠）
  - 動きはノードのフェードと 1px の線の 2 つだけ、`--motion-ease`。見えたら（半分以上）1 回だけ描いて止まり、終わると「もう一度再生」を出す。ループ・点滅・数字のカウントアップ・線上を走る点はしない
  - **遅延の上限の例外**: 図は 1 ステップ 0.45s、間隔 `min(0.3s, 2.0s / (n - 1))`、図全体 2.5s 前後（サイト全体の「遅延 0.8s まで」は図には当てはめない）
  - 図は `Reveal` で包まない（再生管理は図ごとに 1 つ）。View Transition の最中（戻る / 進む）に見えた図は描かずに終状態。`prefers-reduced-motion: reduce`・JS 無し・印刷は最初から終状態（初期状態の CSS は no-preference の `.is-armed` の中だけ）
  - 図の内容は本文かキャプションでも文章で書く（`label` は読み上げ用の 1 文）
- **スタイル**は `src/styles/works-article.css`（`.work-layout` / `.work-article` / `.wfig` スコープ）。`index.css` の変数を参照するだけで、Learn（`.learn-docs`）のスタイルは持ち込まない
- 書き方は doujin-pp・paperlens の記事が見本（H1 は書かない。ページ側に作品名の h1 がある。太字は 1 段落に 1 つまで、400 字を超える段落は分ける）
- 画像は `public/projects/images/<id>-*.webp`
- `portfolio` はまだ Markdown（`public/projects/portfolio.md`）。TSX を足せば自動で切り替わる

---

## Articles（自分が書いた記事）

旧 Topics・Study は 2026-11 に廃止。トップの「Articles」と `/articles` は、自分が外部サイトに書いた記事へのリンク集。

- **Qiita**: `src/lib/articles.ts` の `fetchArticles()` が Qiita API v2（`/api/v2/users/nico0748/items`、CORS 対応・未認証 60req/h）からクライアント側で取得。sessionStorage に 30 分キャッシュ
- **Qiita 以外（Zenn / note 等）**: Google Sheets の **「Articles」シート**（`id, title, url, platform, date, tags`）に手で追記。`platform` が空なら URL から自動判定（`detectPlatform`）
- 両者をマージして日付の新しい順に表示。型は `src/lib/dataMapper.ts` の `ArticleItem`
- **OGP 画像**: `api/ogp.js`（Vercel Function）が記事ページの `og:image` を取り出して返す（`/api/ogp?url=...`、CDN キャッシュ 1 週間）。SSRF 対策で取得先は記事プラットフォームのホストに限定（新しい掲載先を足すときは `ALLOWED_HOSTS` に追加）。Articles シートの `image` 列で上書き可。ローカルの `npm run dev` では関数が動かないためプレースホルダー表示になる

## Off-hours（OffHours シート）

趣味の記録（アニメ・音楽・イベント・同人作品）。詳細と経緯は `docs/off-hours.md`。

- 列: `date, category, title, subtitle, url, image`。`date` は日付セル（表示 `yyyy-mm-dd`）、`category` はドロップダウン（アニメ / 音楽 / イベント / 同人作品。英字キー `anime` / `music` / `event` / `indie` も可）
- 取得は `src/lib/offHours.ts` の `fetchOffHours()`（モジュール内キャッシュ）。変換は `dataMapper.ts` の `mapOffHoursData()`。Profile 等の `Promise.all` には入れない（ソーシャルリンクの表示が遅れるため）
- ⚠️ シートは公開物（API キーがバンドルに入る）。見られて困るものは書かない。表示側でも次を守る:
  - 未来の日付は出さない。イベントは当日も出さない（翌日から表示）
  - 同人作品は全年齢のみ。DLsite の URL は全年齢フロア（`home` / `comic` / `soft`）以外なら行ごと捨てる。同人作品の画像は使わない
  - `url` は `https://` のみ、`image` は `https://` か `/off-hours/...`（写真は `public/off-hours/`、EXIF を消す。PWA の precache からは除外済み）
  - 価格・購入数・私的なメモの列は作らない
- **アニメ**: 手入力の記録のあとに、Annict から 6 時間ごとに同期している `all-watching-anime`（見てる）/ `all-watched-anime`（見た）のシートを並べる（`src/lib/anime.ts` の `fetchTopAnime()`。お気に入りがあればお気に入りだけ、無ければ 見てる＋見た。シートごとの取得は `fetchAnimeList(status)`、変換は `mapAnimeRows()`）。**お気に入り**は 見てる・見た のシートの `isFavorite` 列（P 列のチェックボックス）。列は同期スクリプトが作り、印は作品 id について書き戻す（行の並びが変わってもずれない。見てる・見た から外れた作品の印はスクリプトプロパティ `FAVORITE_IDS` に控える）。見たい のシートには列を作らない（未視聴なのでお気に入りの対象外）。`/anime` は `all-wanna-watch-anime`（見たい）も読む。同期は Apps Script `scripts/gas/annict-sync.gs`（参照コピー。実体はシートに紐づく Apps Script）で、`media` 以降の詳細の列のうち `media, episodes_count, watchers_count, wikipedia_url, twitter_hashtag` は一覧と同じ REST API、`original, director, studio, cast` は GraphQL API でまとめて取る（GraphQL は失敗したバッチを飛ばして続け、その作品は前回の値を残す。`Staff.roleOther` は Annict のデータに null があり 1 件でクエリ全体が落ちるので取らない）。`cast` は 1 行 1 人「キャラクター名：声優名」。視聴日は無いので放送クール（`release_season`）の新しい順。補足行は「2026年夏 · 視聴中」、画像は `official_site_twitter_image_url`、リンクは `official_site_url`。見出しの右に「Annict の視聴記録より」
- **Spotify**: 音楽は手入力の記録のあとに「最近よく聴いている」曲（直近 4 週間のトップトラック、最大 12 曲、explicit 除外）。`api/spotify.js`（Vercel Function、権限は `user-top-read` のみ、CDN 1 日キャッシュ）→ `src/lib/spotify.ts` の `fetchTopTracks()`。再生中・再生履歴は取らない。環境変数 `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REFRESH_TOKEN`（`VITE_` を付けない）。未設定なら空配列で、曲の欄は出ない。手順は `docs/spotify-setup.md`。ジャケットは切り抜かず、Spotify のロゴ（`--brand-spotify`）とリンクを添える

## GitHub（ACTIVITY）

トップの ACTIVITY（コントリビューションのヒートマップと、WORKS 以外のリポジトリ）。手順は `docs/github-setup.md`。

- `api/github.js`（Vercel Function）が GraphQL API v4 にクエリ 1 本（1 point）で、`nico0748`（関数内の定数 `LOGIN`）の公開・非 fork・非アーカイブのリポジトリ（push の新しい順に 30 件）とコントリビューションのカレンダーを取り、`{ repos: { name, description, url, language, pushedOn }[], calendar: { total, weeks: { date, weekday, count, level }[][] } | null }` に絞って返す（GraphQL の応答をそのまま返さない）。`isPrivate` の確かめ直し・`nico0748/nico0748`（プロフィール README）の除外・説明の絵文字除去（`:rocket:` の略記も）・push 日の JST の日付化（`2026.10.28`）は関数側
- **取らないもの**: 言語の hex 色・stargazerCount・totalCount・`commitContributionsByRepository` などリポジトリ名を含むコントリビューション・時刻
- 環境変数 `GITHUB_READ_TOKEN`（`VITE_` を付けない。`GITHUB_TOKEN` は gh CLI 等の広いトークンを拾う恐れがあるので使わない）。fine-grained PAT・Public repositories の読み取りのみ・期限付き。未設定なら 200 の `{ repos: [], calendar: null }`（`s-maxage=300`）で、セクションは出ない
- キャッシュ: 成功は `public, s-maxage=21600, stale-while-revalidate=604800`（6 時間・1 週間）。失敗（非 200・`errors`・`user` が null・タイムアウト 5 秒・例外）は **502 + `no-store`**（CDN の正常なキャッシュを空で上書きしない）。GET 以外は 405、クエリ付きは 400。トークンは応答にもログにも出さない
- クライアントは `src/lib/github.ts` の `fetchGitHubActivity()`（モジュール内で pending を共有、`getCachedGitHubActivity()`）。JSON 以外（`npm run dev` では関数が動かず関数のソースが、古い SW では index.html が返る）・非 ok・形が違うものは空として扱い、**失敗したあとはそのタブでは取り直さない**。`portfolioPage` の useEffect で `fetchTopTracks` と並べて呼ぶ（Sheets の `Promise.all` には入れない）
- 型（`GitHubRepo` / `ContributionDay` / `ContributionCalendar` / `GitHubActivity`）は `src/lib/github.ts` に置く（API 由来の型は lib 側。`dataMapper.ts` はシートの行用）
- PWA の Service Worker は `/api/*` を index.html に差し替えない（`vite.config.ts` の `navigateFallbackDenylist`。/api/spotify・/api/ogp も同じ）

## Timeline シート

- 列: `start, end, title, description, type, href`
- `start` / `end` は **`YYYY-MM`**（年だけなら `YYYY`）。`end` は継続中なら `present`、単発なら空欄。セルは書式「書式なしテキスト」にして日付への自動変換を防ぐ
- `type`: `education` / `work` / `project` / `certification` / `other`。`href` は外部 URL か `/projects/xxx` のようなサイト内パス
- 並び順はサイト側で `start` の新しい順に並べ替える（旧形式の `year` 列 "2025/04~07" も読めるが、新規は start/end で書く）
- Topics / Study シートと `scripts/gas/` の Slack 通知の GAS（`notify-topics.gs` 等）はサイトからは参照しない（残置）

---

## Learn コンテンツ（IT 教材知識）

Web・インフラ・セキュリティを分野ごとに体系立ててまとめた教材集。Study/Topics が「時系列フロー型（新しい順のフィード）」なのに対し、Learn は **分野→章→記事で体系立てた「ストック型（教科書）」**。日付順ではなく章の順序で読ませる。

### データの持ち方 — ⚠️ Sheets ではなく TSX 同居（教材のみの例外）

- 記事は **`src/content/learn/<domain>/<id>.tsx`** に置く。各ファイルが次の2つを export する：
  - `export const meta: LearnMeta` … 一覧・絞り込み・章の並び順に使うメタ情報
  - `export default function Article()` … 本文（自由な TSX。演出の自由度を優先）
- **索引は `import.meta.glob` で自動生成**（`src/lib/learnRegistry.ts`）。記事を増やすときは TSX を1本足すだけ。レジストリやページの編集は不要
- 記事本文は `.learn-docs .prose` でラップされるので、素の `<h2>`/`<p>`/`<ul>` はそのまま整形される。加えて `src/components/learn/kit.tsx` の部品（`Section` `Callout` `Code` `Steps`/`Step` `KeyPoints` `ComparisonTable` `KVList` `TipBox` `Figure` `Cmd` `Lead` `Divider`）でリッチに書ける
- ⚠️ **これは「ハードコードされたデータを `src/` に置かない」ルールの教材専用の例外**。教材本文はデータではなくコード（自由度の高い表現）であるため。Projects 等は従来どおり Google Sheets を使う

### デザイン — ⚠️ ポートフォリオとは独立（Learn 専用スタイル）

- Learn はポートフォリオの Calm Dark 調を**踏襲しない**。**Progate 系のライトなドキュメント調**（Inter フォント／ティール `#22b0a0` ＋ ピンク CTA `#ff5c7a` ／白背景・ネイビー見出し）で構成する
- 専用 CSS は `src/styles/learn.css`。**すべて `.learn-docs` 配下にスコープ**し、グローバル（index.css のダークテーマ・Tailwind）に影響させない。CSS 変数も `.learn-docs` 上で定義（`--accent` 等の portfolio 変数は使わない）
- レイアウトは2系統:
  - **`/learn`（ランディング）= `LearnPage`**: サイドバーなしの Progate 系マーケティング面。ヒーロー＋ミント帯＋**コースカード（`.course-grid` / `.course-card`）**。body 背景は `useEffect` で白に切替
  - **`/learn/:domain`・`/learn/:domain/:id` = `LearnDomainPage` / `LearnDetailPage`**: `LearnLayout`（固定ヘッダー＋進捗バー＋左サイドバー `DomainNav` ＋ 780px 本文）。詳細は本文 h2 から「On this page」自動生成＋前後ナビ
- **⚠️ 絵文字（emoji / ピクトグラム）は Learn UI 全体で使わない**。分野アイコンは `public/learn/covers/<domain>.svg` の**カバー画像**で表現する（`←`/`→` 等の矢印記号は可）
- **図解の動きは「見えたときに 1 回描いて止まる」**（`src/components/learn/diagrams.tsx`）。図の半分以上が見えたら `usePlayOnce`（同ディレクトリ）が `.is-playing` を付け、各要素の animation を 1 回だけ流して終状態で止める。**無限ループ（`infinite`・SMIL の `repeatCount="indefinite"`・マーチングアント）は使わない**（WCAG 2.2.2）。タイミングは線 1 本 0.45s・間隔 `min(0.3s, 2.0s/(n-1))`・図全体 2.5s 以内。走るドットは描き終えた後に 1 回だけ
  - 繰り返すのは利用者が「もう一度再生」を押したときだけ。再生はクラスの付け直しで行い、**再マウントや要素の後挿入をしない**（`LearnLayout` の目次は本文の MutationObserver で組み立てているため）。ボタンも最初から置き、CSS で出し入れする
  - **`prefers-reduced-motion: reduce` では最初から終状態**（線は描き終えた状態・ドットと再生ボタンは出さない）。index.css のグローバル規則は delay を残すので、動きの指定は `@media screen and (prefers-reduced-motion: no-preference)` の中にだけ書く
  - 読了チェックはクリックした瞬間だけ印を描く（localStorage からの復元では動かさない）。ロゴのカーソルは 3 回点滅して点いたまま止まる
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
### IT用語辞書と関連語（`it-terms` コース専用の仕組み）

- `src/content/learn/it-terms/*.tsx` の `ComparisonTable`（`["用語","英語","意味"]`）から用語を機械抽出し、`src/lib/itTerms.ts`（**自動生成・直接編集しない**）を作る。再生成は `python3 scripts/gen-it-terms.py`
- 各記事は末尾で **`export const RELATED: Record<string, string[]>`**（見出し語 → 関連語）を export する。関連語は検索パレット（`LearnSearch`）の**関連語チップ**として表示され、クリックでその語を再検索する
- 関連語の値は**コース内に実在する見出し語**を指すこと。生成時に「スラッシュ分割・括弧除去」による別名解決（`リクエスト` → `リクエスト / レスポンス`）・自己参照除去・重複除去が走り、解決できない語は警告を出して捨てられる
- 用語や関連語を足したら **必ず `python3 scripts/gen-it-terms.py` を再実行**して `itTerms.ts` を更新する

- **⚠️ トップ（`portfolioPage.tsx`）・ヘッダー nav には出さない**。教材ライブラリはポートフォリオとは独立させ、`/learn` への直接アクセス（ルーティング）のみで到達させる方針。導線セクションやnavリンクを追加しないこと

---

## PWA

- `vite-plugin-pwa` で Service Worker と webmanifest を自動生成
- キャッシュ戦略は `vite.config.ts` の `workbox.runtimeCaching` で管理
- アイコンは `public/favicon_io/android-chrome-{192,512}x192.png` を使用

---

## Git / PR ルール

### ブランチ運用（develop 起点・main がデプロイ）

| ブランチ | 役割 | デプロイ |
|---|---|---|
| `main` | **本番**。リリース済みの状態のみを置く | Vercel の Production |
| `develop` | **デフォルトブランチ**。教材追加や機能開発を集約する統合ブランチ | Vercel の Preview |
| `feat/*` 等 | 個別作業ブランチ。`develop` から切って `develop` に戻す | Vercel の Preview |

- **作業ブランチは必ず `develop` から切り、PR のベースも `develop`** にする（`main` を直接ベースにしない）
- 本番に出すときだけ **`develop` → `main` のリリース PR** を作ってマージする。`main` へマージ＝本番デプロイなので、内容を確認してから行う
- `main` へ直接コミット・直接 push はしない

### コースの公開制御（PUBLISHED_DOMAINS）

どのコースを**本番サイトに出すか**は、ブランチではなく `src/lib/learnCategories.ts` の
`PUBLISHED_DOMAINS` で制御する（コードは develop / main で共通。マージ衝突を避けるため）。

- **本番ドメイン（`nico-labo748.dev`）** … `PUBLISHED_DOMAINS` にあるコースだけ表示
- **dev サーバー / Vercel の Preview** … 全コースが表示される（執筆中の確認用）
- 未公開コースは一覧・検索・直リンク（`/nicotech/<domain>`）すべてで遮断される
- **コースが完成したら `PUBLISHED_DOMAINS` に 1 行追加して `develop` → `main` へリリース**する

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
feat/modern-ui-design → develop
feat/project-detail-markdown → develop（feat/modern-ui-design に依存）
feat/pwa → develop（feat/project-detail-markdown に依存）

develop → main（リリース時。マージすると本番へデプロイされる）
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

- ターミナル演出（`$` プロンプト・点滅カーソル・グリッド/走査線背景・ネオン色・グロー）やグラスモーフィズムのカードをポートフォリオに持ち込まない（Calm Dark に統一）
- 和風パレットや明朝体・手書き体を新規採用しない。見出し・本文は `var(--font-sans)`（Inter + Noto Sans JP）
- ハードコードされたデータを `src/` 以下に置かない（Google Sheets に移行済み。記事は Qiita API）。※例外は Learn 教材（`src/content/learn/` の TSX 記事。詳細は「Learn コンテンツ」節）と Works 記事（`src/content/works/`。「Works 記事」節）。どちらも本文はデータではなく表現なので
- **Learn（`/learn`）UI で絵文字（emoji / ピクトグラム）を使わない**。コース・カテゴリのアイコンは `public/learn/covers/` のカバー画像か SVG アイコンで表現する（矢印記号 `←`/`→` は可）
- **絵文字（emoji / ピクトグラム文字）をサイト全体で使わない**。カテゴリ・状態の記号は `src/components/ui/CategoryIcon.tsx` のピクトグラム（Lucide 相当の 24 viewBox / stroke 2）で表す。矢印記号 `←`/`→`/`↗`/`❯`/`▸` は可
- Learn のデザインにポートフォリオの Calm Dark 調（`SiteBackground`・`--accent` 等の portfolio 変数）を持ち込まない。Learn は `.learn-docs` スコープの専用スタイル（`src/styles/learn.css`・Progate 系ライトテーマ）で統一する
- ハードコードされた色（`#xxxxxx`）を直接書かず、CSS 変数（`var(--accent)` 等）経由で参照する
- 未使用の `console.log` をコミットしない
- `--no-verify` フラグは使わない
- `main` に直接コミット・push しない（必ず `develop` 経由でリリース PR を通す）

---

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動（localhost:5177）
npm run build    # TypeScript チェック + Vite ビルド
npm run lint     # ESLint
npm run preview  # ビルド結果のプレビュー
```

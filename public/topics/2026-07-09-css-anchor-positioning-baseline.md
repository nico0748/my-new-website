# CSS アンカー位置指定（Anchor Positioning）が Baseline 入り、Firefox 147 で全主要ブラウザ対応へ

> トピック: CSS Anchor Positioning の Baseline 化｜出典: web.dev / CSS-Tricks｜種別: Web 標準・CSS 機能

## 一行サマリー

Firefox 147 が CSS Anchor Positioning に対応したことで同機能が「Baseline Newly available」となり、ツールチップやポップオーバーの位置合わせを JavaScript（Floating UI 等）なしで純粋な CSS だけで実現できるようになった。

## 🔰 初学者向け（何が・なぜ重要か）

Web でボタンの隣に「ふきだし（ツールチップ）」やメニューを出したいとき、これまでは JavaScript で「ボタンの座標を測って、そこに合わせてふきだしを動かす」処理が必要でした。スクロールするたびに測り直す必要があり、Floating UI や Popper.js といった専用ライブラリを使うのが定番でした。

**CSS アンカー位置指定** は、この「他の要素にくっつけて位置を決める」作業を CSS だけでできるようにする仕組みです。「この要素を、あのボタンの下に貼り付けて」と CSS で宣言するだけ。座標計算もスクロール追従もブラウザが面倒を見てくれます。JavaScript のライブラリを1つ減らせるので、コードが軽く・シンプルになります。

そして今回、Firefox が対応したことで **主要ブラウザすべてで使える状態（Baseline）** になりました。つまり「もう安心して実務で使ってよい」段階に入ったということです。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- **Firefox 147** が CSS Anchor Positioning をサポートし、同機能が **Baseline Newly available** に到達。Chrome・Safari は先行対応済みで、Firefox 対応で主要ブラウザが揃った。
- 併せて 2026 年の Web プラットフォームでは、スクロール駆動アニメーション（Chrome/Safari 出荷済み、Firefox も開発進行）、名前のみのコンテナクエリ（Baseline 化）、`@container` の `style()` クエリ（Firefox 151 で対応、カスタムプロパティのコンテナスタイルクエリが Baseline 化）なども前進。
- 具体的な仕様値・プロパティ名（`anchor-name` / `position-anchor` / `anchor()` / `position-try` 等）は各仕様と MDN で要確認。

### 仕組み / 背景（なぜこう設計されたか）

従来の「JS で座標測定」方式には根本的な弱点があった。レイアウトは本来ブラウザのレンダリングエンジンが計算しているのに、JS がその結果を `getBoundingClientRect()` で読み取り、別要素へ反映する――つまりレイアウト情報が「エンジン → JS → DOM」と往復する。スクロールやリサイズのたびにこれを繰り返すと、強制同期レイアウト（layout thrashing）を招き、パフォーマンスとちらつきの原因になる。

Anchor Positioning は、この関係を宣言的にレンダリングエンジン内で完結させる。ある要素に `anchor-name` で名前を付け、別要素からその名前を参照して `anchor()` 関数で辺・位置を指定する。位置合わせはレイアウトの一部としてエンジンが解決するため、JS 往復が消える。さらに `position-try`（フォールバック位置）で「画面端で見切れそうなら別の位置へ自動で回避」する挙動も宣言できる。これはライブラリが担ってきた「衝突回避」をブラウザ標準に取り込んだ形だ。トレードオフは、複雑な条件付き配置ロジックは依然ライブラリの方が柔軟な場合があること、そして古いブラウザ向けにはプログレッシブエンハンスメント（機能検出＋フォールバック）が要る点。

### 実務での使いどころ・移行の勘所

ツールチップ、ポップオーバー、ドロップダウン、コンテキストメニュー、`popover` 属性や `<dialog>` と組み合わせた UI で威力を発揮する。既存で Floating UI / Popper.js を使っている箇所は、まず単純なケースから CSS 置き換えを検討するとバンドルサイズを削れる。Baseline Newly available は「主要ブラウザの最新版で使える」段階なので、古い環境を支える必要があるプロダクトでは `@supports (anchor-name: --x)` 等での機能検出とフォールバックを用意したい。アクセシビリティ（フォーカス管理・エスケープ）は CSS だけでは解決しないため、`popover`/`dialog` の標準機能と併用するのが定石。

## 📖 用語解説（このトピックとのつながり）

- **Baseline**: 主要ブラウザで安全に使える機能の到達度を示す指標。「Newly available＝最新版で揃った」段階。
- **Anchor Positioning**: 要素を別要素に紐付けて位置を決める CSS 機能。本トピックの主役。
- **`anchor()` / `anchor-name` / `position-try`**: それぞれ参照・命名・フォールバック位置を担うプロパティ/関数。
- **layout thrashing（強制同期レイアウト）**: JS の測定と DOM 変更が交互に起きて再計算を多発させる現象。本機能が解消する課題。
- **プログレッシブエンハンスメント**: 新機能を使いつつ、非対応環境向けに代替を用意する設計方針。

## 影響範囲 / 推奨アクション

- 影響: あらゆる Web フロントエンド。ツールチップ/ポップオーバー系 UI の実装コストとバンドルサイズに直結。
- 推奨: 新規 UI は CSS Anchor Positioning を第一選択に。既存の Floating UI 依存箇所を段階置換。古い環境向けに `@supports` でフォールバックを用意。

## リンク

- Baseline（web.dev）: https://web.dev/baseline
- Interop 2026（CSS-Tricks）: https://css-tricks.com/interop-2026/
- 新機能まとめ（web.dev, May 2026）: https://web.dev/blog/web-platform-05-2026

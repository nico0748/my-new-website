# @starting-style と transition-behavior: allow-discrete — JS なしで出現アニメと display 遷移

> トピック: `@starting-style` と `transition-behavior: allow-discrete`｜出典: MDN / web.dev｜種別: CSS アニメーション機能の相互運用

## 一行サマリー

要素が初めて描画される瞬間の「開始状態」を定義できる `@starting-style` と、`display` や `overflow` のような離散プロパティにも遷移を効かせる `transition-behavior: allow-discrete` が主要ブラウザで揃い、Baseline 機能として使えるようになった。これにより、ポップオーバーやダイアログの「出現（enter）／消滅（exit）」を JavaScript なしの純 CSS で滑らかに表現できる。

## 🔰 初学者向け（何が・なぜ重要か）

メニューやモーダルが「パッと出てパッと消える」のは少し安っぽく見えます。フワッと現れてスッと消えると上質に感じます。ところが CSS のアニメーション（transition）には長年2つの壁がありました。1つは「要素が最初に現れる瞬間には、アニメの出発点がないので効かない」問題。もう1つは「`display: none`（非表示）に切り替わる瞬間はアニメできない」問題です。そのため、これらは JavaScript で無理やり実装するのが常識でした。

`@starting-style` は前者を、`transition-behavior: allow-discrete` は後者を解決します。前者は「現れる直前はこういう見た目から始めてね」という出発点を指定でき、後者は「非表示に切り替わるときも、消えるアニメが終わるまで待ってね」と指示できます。この2つが全ブラウザで使えるようになったことで、ポップアップやダイアログの出入りの演出を、追加ライブラリなしの CSS だけで自然に作れるようになりました。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- `@starting-style { ... }`: 要素が DOM に初めて出現した（または `display: none` から表示された）際の**開始スタイル**を定義。transition の出発点を与える。
- `transition-behavior: allow-discrete`: `display` や `content-visibility` など従来アニメ不可だった離散（discrete）プロパティにも遷移を許可。例えば `display: none` への切替を、他プロパティのアニメ完了まで遅延できる。
- 典型パターン: `[popover]` や `<dialog>` に対し、`opacity`/`transform` を transition し、`transition: display 0.2s allow-discrete` を併記、`@starting-style` で `opacity: 0` を指定して enter/exit を両立。
- Popover API（`popover` 属性）や `<dialog>` と組み合わせることで、開閉トグルも含めて宣言的に完結できる。
- これらは相互運用が成立し Baseline 機能として整理された（entry/exit アニメの標準解）。

### 仕組み / 背景（なぜこう設計されたか）

CSS transition は「2つの計算済みスタイルの差」を補間する仕組みだ。要素が生まれた瞬間には「前の状態」が存在しないため、初回描画には transition が効かない——これが「enter アニメが JS 頼み」だった根本原因だ。`@starting-style` は「初回描画時に限り適用される仮想的な前状態」を用意することで、この欠落を埋める。ブラウザは初回に starting-style を、次フレームで本来のスタイルを適用し、その差を補間する。

`display` が離散値である点も壁だった。`none` と `block` の中間は数学的に存在せず、切り替えは瞬間的に起きるため、消滅時に他のアニメを待たずに要素が消えてしまう。`allow-discrete` は離散プロパティの切替を「アニメの最終フレームまで遅延」させる特別ルールを導入し、opacity フェードアウトの完了後に `display: none` を適用する、といった協調を可能にする。トレードオフは挙動の直感性——「離散なのに遅延する」という特殊ルールの理解コストと、starting-style の適用タイミング（初回のみ）を誤ると効かない点。だが、これらは「宣言的に enter/exit を書く」ための最小限の言語拡張であり、JS アニメの命令的な状態管理を CSS 側へ移せる意義は大きい。

### 実務での使いどころ・移行の勘所

トースト、ポップオーバー、ドロップダウン、モーダル/ダイアログの出現・消滅演出に最適。Popover API や `<dialog>` と組み合わせると、開閉ロジックまで含めて JS を大幅に減らせる。移行は「JS でクラス付替えして enter/exit していた箇所」を、`@starting-style` ＋ `transition ... allow-discrete` へ置換するところから。注意点は、`@starting-style` は初回描画にのみ効くため、再表示の演出は `display` 遷移側で担うこと。`prefers-reduced-motion` 対応を忘れず、複雑な連鎖アニメは依然 JS/Web Animations が有利な場合もある。

## 📖 用語解説（このトピックとのつながり）

- **@starting-style**: 要素出現時の開始スタイルを定義。enter アニメの出発点。本トピックの中核。
- **transition-behavior: allow-discrete**: display 等の離散プロパティに遷移を許可。exit アニメの鍵。
- **離散プロパティ（discrete）**: 中間値を持たない値（display 等）。従来アニメ不可だった対象。
- **Popover API / <dialog>**: 宣言的な開閉 UI。本機能と組み合わせて JS を削減できる。
- **prefers-reduced-motion**: 動きを抑える設定。演出無効化に必須。

## 影響範囲 / 推奨アクション

- 影響: UI に出現/消滅演出を持つ全フロントエンド。JS アニメ依存の削減に直結。
- 推奨: ポップオーバー/ダイアログの enter/exit を CSS へ移行。`@starting-style` は初回限定の挙動に注意。`prefers-reduced-motion` を同梱。

## リンク

- MDN @starting-style: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN transition-behavior: https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
- Baseline 2026: https://web.dev/baseline/2026

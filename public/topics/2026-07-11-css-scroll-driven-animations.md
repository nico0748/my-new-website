# CSS スクロール駆動アニメーション — JS なしで scroll/view を時間軸に

> トピック: CSS scroll-driven animations の普及・Interop 2026 入り ｜ 出典: MDN / Chrome for Developers / caniuse ｜ 種別: Web 標準・ブラウザ実装状況

## 一行サマリー

スクロール量そのものをアニメーションの「時間軸」に使える CSS scroll-driven animations が Chrome/Edge/Safari 26 で安定化し、2026年時点でグローバル約82%が対応。Firefox 安定版だけがフラグ裏のため Baseline 化は保留中だが、Interop 2026 の重点項目に選ばれ、`IntersectionObserver` を使ったスクロール連動 JS を置き換えつつある。

## 🔰 初学者向け（何が・なぜ重要か）

「スクロールに合わせて要素がふわっと出てくる」「上部のプログレスバーが読み進めた分だけ伸びる」——こうした演出は、これまで JavaScript でスクロール位置を監視して作るのが定番だった。だが JS でスクロールを常時監視するのは、書くのが面倒で、動きがカクつきやすい（メインスレッドが忙しいと遅れる）弱点があった。

**scroll-driven animations は、この"スクロール連動"を CSS だけで書けるようにする機能だ**。ポイントは発想の転換にある。ふつうのアニメーションは「時間」で進む（1秒かけてフェードイン）。この機能では、時間の代わりに**スクロールの進み具合**を"時計"にする。スクロールを半分すればアニメーションも半分進む、というわけだ。巻き戻せば動きも巻き戻る。

比喩でいえば、映画のフィルムを「秒数」で再生する代わりに「あなたが回すハンドルの角度」で再生するようなもの。観客がハンドルを回した分だけ映像が進む。CSS がブラウザ内部でこの連動を担うので、JS よりなめらかで、コードもぐっと短くなる。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

中核は `animation-timeline` プロパティと 2 種類のタイムラインだ。

- **`scroll()` タイムライン（スクロール進行タイムライン）**: 最も近いスクロールコンテナのスクロール量に連動。`animation-timeline: scroll(root block)` のように軸とスクローラを指定。ページ全体の読了プログレスバー等に使う。
- **`view()` タイムライン（ビュー進行タイムライン）**: 要素がスクロールポート（表示領域）を横切る進捗に連動。要素が見え始めてから消えるまでの間でアニメーションを進める。「画面に入ってきたらフェードイン」に最適。
- 名前付きタイムライン（`scroll-timeline-name` / `view-timeline-name`）で、離れた要素同士を紐づけることも可能。

実装状況（2026年6月時点）: Chrome/Edge 115+、Opera 101+、Safari 26 が完全対応。Firefox は `layout.css.scroll-driven-animations.enabled` フラグ裏（Nightly は既定 ON）。caniuse でグローバル約 **82.58%**。Firefox 安定版が未有効のため**技術的には Baseline 未達**だが、**Interop 2026** の優先項目に指定されている。

### 仕組み / 背景（なぜこう設計されたか）

**なぜ CSS へ持ち込むのか**。従来の `IntersectionObserver` + JS では、(1) スクロール／交差イベントをメインスレッドで処理するため、JS が詰まると描画が遅延しジャンク（カクつき）が出る、(2) 手続き的なコードが冗長、という課題があった。scroll-driven animations は連動計算をブラウザのコンポジタ（合成）側で行える設計のため、メインスレッドの負荷と独立してなめらかに動く。これが最大の利点だ。

**タイムラインという抽象**。CSS アニメーションはもともと「document timeline（時間）」に沿って進む。今回追加されたのは、その時計を"スクロール"や"要素の可視進捗"に差し替える仕組みだ。既存の `@keyframes` をそのまま流用でき、学習コストが低い。

**トレードオフ**。(1) スクロール量に厳密連動するため、要素の初期・終端状態の設計を誤ると意図せぬ表示になりやすい。(2) Firefox 安定版が未対応の間はプログレッシブ・エンハンスメントが前提——「完成状態を既定に書き、対応ブラウザだけアニメを重ねる」書き方が推奨される（非対応ブラウザは `animation-timeline` 行を無視するだけで壊れない）。(3) 過度な連動演出はアクセシビリティ上 `prefers-reduced-motion` での抑制を要する。

### 実務での使いどころ・移行の勘所

読了プログレスバー、スクロールで進むストーリーテリング、要素の入場アニメ、視差（パララックス）などに向く。既存の `IntersectionObserver` によるフェードイン実装は、対応ブラウザでは CSS だけに置き換えられ、JS を削減できる。移行の勘所は「フォールバック優先」——アニメを外した見た目を既定（デフォルト表示）として書き、`@supports (animation-timeline: scroll())` で上乗せする。Firefox 全体対応と Baseline 化までは JS フォールバックを残す判断もあり得る。

## 📖 用語解説（このトピックとのつながり）

- **animation-timeline**: アニメーションの進行を何に連動させるかを決める CSS プロパティ。本機能の中心。
- **scroll() / view()**: それぞれ「スクロール量」「要素の可視進捗」を時計にするタイムライン関数。
- **IntersectionObserver**: 要素が表示領域に入ったかを JS で監視する API。本機能が置き換える対象。
- **コンポジタ（合成スレッド）**: レイヤーを合成して画面を作るブラウザ内部の仕組み。メインスレッドと別に動くため、ここで処理できるとなめらか。
- **Baseline / Interop 2026**: Baseline は主要ブラウザ横断の対応状況を示す指標。Interop はブラウザ各社が年次で相互運用性を高める重点機能セット。本機能は後者入り、前者は Firefox 待ち。
- **prefers-reduced-motion**: 動きの抑制を望むユーザー設定を検知するメディアクエリ。過度な連動演出の抑制に使う。

## 影響範囲 / 推奨アクション

- スクロール連動 UI を持つサイトは、対応ブラウザ向けに JS を CSS へ置換して軽量化を検討。
- 必ずフォールバック優先で書き、`prefers-reduced-motion` で抑制を用意。
- Firefox 全体対応・Baseline 化の時期は「要確認」（2026年7月時点で Firefox 安定版は未有効）。本格全面移行はそれを待つ選択も可。

## リンク

- MDN: CSS scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- Chrome for Developers 解説: https://developer.chrome.com/blog/scroll-triggered-animations
- caniuse（animation-timeline: scroll()）: https://caniuse.com/mdn-css_properties_animation-timeline_scroll
- Web features explorer: https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/

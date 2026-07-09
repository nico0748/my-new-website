# 同一ドキュメント View Transitions が Baseline 入り — Firefox 対応でページ内アニメが標準技術に

> トピック: View Transition API（same-document）が Baseline Newly available｜出典: web.dev / MDN｜種別: Web 標準の相互運用達成

## 一行サマリー

同一ドキュメント内の状態遷移をブラウザ側でスムーズにアニメーション化する View Transition API が、Firefox 144 の対応をもって主要ブラウザで足並みが揃い、Baseline Newly available（新たに広く使える機能）となった。これにより SPA のタブ切り替えやリスト並べ替えなどを、JavaScript のアニメーションライブラリなしで宣言的に滑らかに見せられる。

## 🔰 初学者向け（何が・なぜ重要か）

Web ページで「表示が切り替わる瞬間」は、そのままだとパッと入れ替わって少し唐突に感じます。たとえば一覧から詳細へ切り替えるとき、フワッと繋がって見えると気持ちよく、内容の関係も分かりやすくなります。こうした「切り替えの演出」は、これまで各自が JavaScript のアニメーションライブラリを入れて手作りしていました。

View Transition API は、この演出を**ブラウザ標準の機能**として提供します。開発者は「この状態からこの状態へ変える」とだけ指示すれば、ブラウザが切り替え前後の見た目を写真のように撮って、その間を自動で滑らかに繋いでくれます。今回のニュースは、この機能に最後まで対応していなかった Firefox が追いついたことで、「全ブラウザで安心して使える機能（Baseline）」の仲間入りをした、という話です。つまり、追加ライブラリなしで滑らかな画面遷移を作れる時代が、実務レベルで到来したということです。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- Firefox 144 が same-document（SPA）View Transitions を実装し、Chromium・Safari と合わせて主要ブラウザで相互運用が成立。web.dev が「Baseline Newly available」と告知。
- 中核 API は `document.startViewTransition(callback)`。callback 内で DOM を更新すると、ブラウザが遷移前後のスナップショット（`::view-transition-old(name)` / `::view-transition-new(name)`）を生成し、CSS で補間する。
- 疑似要素ツリー（`::view-transition` ルート → `::view-transition-group` → `image-pair` → old/new）に対して CSS アニメーションを当てられる。要素ごとの連続性は `view-transition-name` で対応付ける。
- 進行中に特定スタイルを当てる view-transition 系の擬似クラスも Baseline Newly available として整理された。
- 注意: これは**同一ドキュメント（SPA）版**。クロスドキュメント（MPA）版は別項で扱うとおり Firefox 未対応のため Baseline ではない。

### 仕組み / 背景（なぜこう設計されたか）

従来の「切り替えアニメ」は、旧要素と新要素を同時に DOM に存在させ、位置・不透明度を手動で補間する必要があった。これはレイアウト計算・z-index 管理・後片付けが煩雑で、ライブラリ依存とバグの温床だった。View Transition API は発想を変え、「遷移の瞬間だけ、旧状態と新状態をそれぞれ**静的なスナップショット画像**として切り出し、その2枚の間をコンポジタ（合成）層でアニメーションする」設計を採った。DOM の実体は一度きりの更新で済み、演出はブラウザの合成処理が担うため、メインスレッドを塞ぎにくく滑らかになる。

トレードオフもある。スナップショットは撮影時点の見た目であり、遷移中はインタラクティブでない（クリック等は効かない）。また `view-transition-name` は同一ページ内で一意でなければならず、動的リストでは名前付けの設計が要る。とはいえ「宣言的に指示し、合成は委譲する」という一般原理は、CSS アニメーションや Web Animations と同じ思想の延長線上にあり、パフォーマンス特性が読みやすい。

### 実務での使いどころ・移行の勘所

タブ切り替え、リストの並べ替え・フィルタ、モーダルの出し入れ、詳細ビューへの展開など「同一ページ内で連続性を示したい」場面に最適。React/Vue/Svelte いずれもラッパーやフレームワーク側の統合が進むが、素の API でも数行で導入できる。`@media (prefers-reduced-motion: reduce)` で演出を無効化するアクセシビリティ配慮を必ず入れること。既存のアニメーションライブラリからの置き換えは、まず局所（1つの遷移）から段階的に。SSR/ハイドレーションとの相性や、遷移中の非インタラクティブ期間の短さも確認したい。

## 📖 用語解説（このトピックとのつながり）

- **View Transition API**: 状態遷移をブラウザがアニメーション化する仕組み。本トピックの主役。
- **Baseline Newly available**: 主要ブラウザの最新版で相互運用が成立し「新たに広く使える」段階。今回この機能が到達。
- **same-document / cross-document**: SPA 内遷移か、ページ遷移（MPA）か。今回 Baseline なのは前者。
- **`view-transition-name`**: 遷移前後で「同じ要素」と見なす対応付けの名前。連続アニメの鍵。
- **prefers-reduced-motion**: 動きを抑えたいユーザー設定。演出無効化に必須。

## 影響範囲 / 推奨アクション

- 影響: SPA を作る全フロントエンド。アニメライブラリ依存の削減、体感品質の向上に直結。
- 推奨: 局所的な遷移から導入。`prefers-reduced-motion` 対応を同梱。クロスドキュメント版はまだ Baseline でない点に留意。

## リンク

- web.dev 告知: https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available
- MDN View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- Baseline 2026: https://web.dev/baseline/2026

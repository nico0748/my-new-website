# HTML Invoker Commands が Baseline 到達 — command/commandfor で JS 不要のUI操作

> トピック: Invoker Commands API の Baseline 化 ｜ 出典: MDN / InfoQ / Web features explorer ｜ 種別: HTML 標準・ブラウザ対応状況

## 一行サマリー

ボタンに `command` と `commandfor` の2属性を足すだけで、ダイアログやポップオーバーの開閉を JavaScript なしで宣言的に制御できる Invoker Commands API が、Safari 26.2 の対応で全主要ブラウザに揃い Baseline に到達した。イベントリスナーの定型コードを丸ごと削減できる。

## 🔰 初学者向け（何が・なぜ重要か）

「ボタンを押したらメニューが開く」——Web でごくありふれた動きだが、これまでは必ず JavaScript が必要だった。ボタンにクリックを監視する処理を書き、開く対象を探して、`open` を切り替える。数行とはいえ毎回書くし、書き方を間違えるとキーボード操作やスクリーンリーダーで正しく動かないこともあった。

**Invoker Commands は、この「押したら◯◯する」を HTML の属性だけで書けるようにする**。ボタンに `commandfor="対象のID"` で操作したい相手を、`command="show-popover"` などで何をするかを指定する。すると JS を一切書かなくても、ボタンがその相手を開閉してくれる。

例えるなら、これまでは「ボタン」と「その配線」を別々に用意して手ではんだ付けしていたのが、コンセントに挿すだけで動く家電のように、HTML の中で完結するようになった。しかもブラウザが標準で用意する動きなので、キーボードやスクリーンリーダー対応も最初から正しく効く。「全主要ブラウザで使える（Baseline）」状態になったので、もう遠慮なく本番で使える。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

`<button>` 要素に 2 つの属性が加わった。

- **`commandfor`**: 操作対象の要素の `id` を指定。
- **`command`**: 実行するアクション名を指定。ブラウザ組み込みコマンドは `show-popover` / `hide-popover` / `toggle-popover` / `show-modal` / `close` / `request-close`。
- JS からは `HTMLButtonElement.commandForElement` と `.command` プロパティで対応。
- `--` 始まりのカスタムコマンド（例 `command="--rotate-left"`）を投げると、対象要素で `CommandEvent` が発火し、必要な処理だけを JS で受けられる（配線は宣言的、振る舞いだけ命令的）。

対応状況: Chrome 135、Firefox 144 が先行し、**Safari 26.2** の対応で全主要ブラウザが揃い **Baseline に到達**（2026年初頭に完了）。`<dialog>` や Popover API と組み合わせるのが基本形。

### 仕組み / 背景（なぜこう設計されたか）

**なぜ宣言的にするのか**。「ボタンを押すと別要素を操作する」は Web で最頻出のパターンだが、従来は `addEventListener('click', ...)` → 対象を `querySelector` → 状態切り替え、という定型を毎回手書きしていた。定型コードはバグ源であり、特にフォーカス管理・`aria-*`・Esc キーでの閉じるといったアクセシビリティ配線を漏らしやすい。宣言的 API はこの「振る舞いの契約」をブラウザ側に移し、正しい既定挙動（フォーカストラップ、キーボード操作、支援技術への通知）を保証する。

**Popover API との関係**。先行して標準化された Popover API（`popover` 属性、`popovertarget`）は主にポップオーバー用途だった。Invoker Commands はそれを一般化し、`<dialog>` のモーダル制御や、将来的な組み込みコマンド拡張、カスタムコマンドの発火までを一つの枠組みに統合する。HTML の「相互作用を要素間で結ぶ」語彙を拡張したものと位置づけられる。

**トレードオフ**。組み込みコマンドは現状ポップオーバー／ダイアログ中心で、任意の DOM 操作を宣言的にこなせるわけではない（それはカスタムコマンド＋最小限の JS で補う設計）。また `id` 参照ベースのため、動的リスト内で ID 一意性の管理が要る。

### 実務での使いどころ・移行の勘所

モーダル、ドロワー、トースト、メニュー、ツールチップなど「ボタンで開閉する UI」全般で、既存のクリックハンドラを属性に置換できる。特にデザインシステムのボタン／ダイアログ部品は、宣言化でアクセシビリティ品質が底上げされる。移行は段階的に可能——Baseline 到達済みなのでフォールバック不要のケースも多いが、古いブラウザを含む要件では従来 JS を残す。カスタムコマンドは「配線は HTML、処理は最小 JS」に切り分けられるため、イベント委譲の見通しが良くなる。

## 📖 用語解説（このトピックとのつながり）

- **宣言的（declarative）**: 「どうやるか」でなく「何をしたいか」を書くスタイル。HTML 属性で意図を表すのが宣言的、JS でイベントを組むのが命令的。本 API は前者化。
- **Popover API / `<dialog>`**: それぞれポップオーバーとモーダルの標準要素・API。Invoker Commands の主な操作対象。
- **CommandEvent**: カスタムコマンド発火時に対象要素で起きるイベント。宣言的配線＋必要最小限の JS 処理を橋渡し。
- **Baseline**: 主要ブラウザ横断で安定利用できる状態を示す指標。本 API は Safari 26.2 対応で到達。
- **フォーカストラップ**: モーダル内にキーボードフォーカスを閉じ込めるアクセシビリティ処理。組み込みコマンドが自動で担保。

## 影響範囲 / 推奨アクション

- 開閉系 UI を持つ全プロジェクトで、クリックハンドラの属性置換を検討。特にデザインシステムの部品で効果大。
- Baseline 到達済みのため、対象ブラウザ要件次第でフォールバック不要。古いブラウザ要件がある場合のみ従来 JS を併存。
- カスタムコマンドで「宣言的配線＋薄い JS」の分離設計を導入すると保守性が上がる。

## リンク

- MDN: Invoker Commands API: https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
- InfoQ: HTML Invoker Commands Achieve Baseline: https://www.infoq.com/news/2026/01/html-invoker-commands/
- MDN: HTMLButtonElement.commandForElement: https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/commandForElement
- Web features explorer: https://web-platform-dx.github.io/web-features-explorer/features/invoker-commands/

# CSS corner-shape — border-radius の角を squircle・切り欠き・面取りに変える

> トピック: CSS `corner-shape`｜出典: MDN・Smashing Magazine・Frontend Masters｜種別: Web 標準 / CSS

## 一行サマリー

`border-radius` が作る「丸い角」の形そのものを変える `corner-shape` プロパティが、2026 年に話題化している。`round` だけでなく `squircle`（丸と四角の中間・iOS 風）、`notch`（90 度の切り欠き）、`bevel`（面取り）、`scoop`（えぐり）、任意の `superellipse()` を指定でき、角のデザイン表現が一気に広がる。2026 年時点では Chromium 系（Chrome 139+）中心で対応率は約 67%。

## 🔰 初学者向け（何が・なぜ重要か）

Web で角を丸くするときは `border-radius` を使う。ただしこれは「円弧の丸み」しか作れず、みんな似たような丸角になりがちだった。iOS のアイコンのような「ちょっと四角寄りの、なめらかな角（squircle）」や、チケットのような「切り欠き」を作りたくても、標準の丸角では表現できなかった。

`corner-shape` は、`border-radius` で指定した「角の大きさ」はそのままに、**角の“かたち”だけを差し替える**プロパティ。丸のかわりに squircle、切り欠き、面取りなどを選べる。たとえるなら、角の丸みの半径は決めたうえで、「その角を丸で削るか、斜めに削るか、四角くえぐるか」を選べるようになった、というイメージ。

デザインの幅が広がる一方で、`border-radius` が 0 だと `corner-shape` は効かない（削る量がゼロなら形も出ない）点だけ注意。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- **役割**: `border-radius` が作る角の形状を変更する。ボーダー・アウトライン・影・背景も指定した角形状に追従する。
- **値**: `round`（＝従来の丸角、`superellipse(1)`）、`squircle`（`superellipse(2)`、丸と四角の中間の凸曲線）、`notch`（`superellipse(-infinity)`、90 度の凹角）、`bevel`（面取り）、`scoop`（凹のえぐり）、および任意曲率の `superellipse()`。
- **前提条件**: `border-radius` が未指定または 0 に解決されると `corner-shape` は無効。
- **対応状況（要確認）**: 2026 年時点で Chrome 139+ など Chromium 系のみ。2026 年 5 月時点で対応率は約 67%。

### 仕組み / 背景（なぜこう設計されたか）

角の丸みは数学的には「超楕円（superellipse）」という曲線族で一般化できる。円は超楕円の特殊なケース（指数 1）で、指数を上げると角が四角寄りの squircle になり、負の無限大に振ると凹んだ切り欠き（notch）になる。`corner-shape` は、この **超楕円の指数をデザイナーが選べるようにした**もの。`superellipse()` 関数で連続的に、あるいは `squircle` / `notch` / `bevel` / `scoop` などのキーワードで代表的な形を指定する。

「半径（どれだけ削るか）」を `border-radius` に、「形状（どう削るか）」を `corner-shape` に分離した設計がポイント。両者を掛け合わせることで、少ないプロパティで多彩な角を表現できる。ボーダー・影・背景クリップが同じ角形状に従うのも、角を「箱の輪郭の一部」として一貫して扱うため。トレードオフは、Chromium 先行で相互運用がまだ途上な点、そして squircle のような滑らかな角は描画コストがわずかに増える点。非対応ブラウザでは通常の丸角にフォールバックする（＝安全に足せる）。

### 実務での使いどころ・移行の勘所

ブランドらしさを出すボタン/カード/アイコン、iOS 風の squircle、チケット/クーポンの切り欠き、装飾的な面取りなどに有効。移行の勘所は、(1) `border-radius` は必ずセットで指定する（0 だと無効）、(2) 非対応ブラウザでは自動的に丸角へ落ちるため装飾用途ならフォールバック設計は最小限で済む、(3) 情報を担う切り欠き（例: 意味のある形）を使う場合は非対応時の見え方を確認する。対応率が上がるまでは「対応ブラウザでの上乗せ表現」として使うのが無難。

## 📖 用語解説（このトピックとのつながり）

- **corner-shape**: border-radius の角の「かたち」を差し替えるプロパティ。
- **superellipse（超楕円）**: 円と四角を連続的に繋ぐ曲線族。corner-shape の理論的基盤。
- **squircle**: 丸と四角の中間の角。iOS アイコン等でおなじみ。`superellipse(2)`。
- **notch / bevel / scoop**: 切り欠き / 面取り / えぐり。角形状のバリエーション。
- **border-radius**: 角の大きさ（半径）を決める既存プロパティ。corner-shape の前提。

## 影響範囲 / 推奨アクション

- ボタン/カード/アイコンの角表現を CSS だけで多様化でき、ブランド表現に効く。
- 必ず border-radius とセットで指定。非対応時は丸角に自動フォールバック。
- Chromium 先行のため、意味を持つ角形状は非対応環境の見え方を確認。

## リンク

- corner-shape（MDN・仕様/リファレンス）: https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape
- Beyond border-radius: CSS corner-shape（Smashing Magazine）: https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/
- Understanding CSS corner-shape and the Power of the Superellipse（Frontend Masters）: https://frontendmasters.com/blog/understanding-css-corner-shape-and-the-power-of-the-superellipse/

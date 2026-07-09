# Chrome 143 — `@container anchored()` と font-language-override、Smart Card API まで広がる Web プラットフォーム

> トピック: Chrome 143 の新機能｜出典: Chrome for Developers 公式リリースノート｜種別: ブラウザ定期リリース

## 一行サマリー

Chrome 143 は、アンカー配置のフォールバック状態に応じて子孫要素をスタイルできる `@container anchored(fallback)`、OpenType のグリフ置換言語を CSS から上書きする `font-language-override`、FedCM の構造化 JSON 応答、Smart Card API などを追加し、DevTools には MCP サーバー統合や masonry エディタが載った。

## 🔰 初学者向け（何が・なぜ重要か）

ブラウザの Chrome は約4週間ごとに新しい版が出て、そのたびに「Web ページで使える新しい道具」が増えます。143 で特に面白いのはツールチップや吹き出しの見た目に関する新機能です。

CSS には最近「アンカー配置」という仕組みが入りました。吹き出しをボタンなどの目印（アンカー）にくっつけて表示し、画面からはみ出しそうなら自動で反対側に回り込む、という賢い配置機能です。ただ困ったことに、「上に出たか下に出たか」で矢印の向きなどを変えたくても、CSS からは「今どっちに回り込んだのか」が分かりませんでした。143 の `@container anchored(fallback)` は、まさに「今どの回り込みが使われているか」で中身のスタイルを切り替えられるようにするものです。天気に応じて服装を変えるように、配置結果に応じて飾りを変えられるわけです。

また DevTools（開発者ツール）には AI エージェントと連携するための MCP サーバーが組み込まれ、AI にページの調査やデバッグを手伝わせる流れが公式ツールに入ってきました。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- **`@container anchored(fallback)`**: アンカー配置要素の子孫を、`position-try-fallbacks` のどれが適用されたかに基づいてスタイルできるコンテナクエリ拡張。ツールチップの「矢印（tether）」の向き替えやフォールバック時のアニメーション切替が CSS だけで可能に。
- **`font-language-override`**: OpenType のグリフ置換に使う言語システムを4文字タグで直接指定。多言語コンテンツで OS/ページ言語設定と異なる字形（例: セルビア語イタリック等の言語依存グリフ）を明示制御できる。
- **FedCM の構造化応答**: Identity Provider が `id_assertion_endpoint` から文字列でなく構造化 JSON を返せるようになり、手動のシリアライズ/パースが不要に。
- **Digital Credential 発行**: 発行者サイトがウォレットアプリへの資格情報プロビジョニングを開始できる（Android は CredMan、Desktop はクロスデバイス）。
- **Smart Card API**: PC/SC 実装へのアクセスを Web に開放し、スマートカードアプリのWeb移行を可能にする。
- **DevTools**: MCP サーバー v0.11.0 統合、トレース共有の改善、`@starting-style` サポート、masonry エディタ、Lighthouse 13。
- セキュリティ修正13件を含む（詳細な脆弱性内訳は要確認）。

### 仕組み / 背景（なぜこう設計されたか)

アンカー配置（CSS Anchor Positioning）は「JS で座標計算して吹き出しを置く」Floating UI 系ライブラリの機能を宣言的に置き換える仕様だが、宣言的にした代償として「実行時にどのフォールバックが選ばれたか」という状態が CSS から見えなくなっていた。JS なら計算結果をそのまま使えるが、CSS では状態を「クエリできる」形で公開する仕組みが要る。`@container anchored()` は、コンテナクエリという既存の「祖先の状態で子孫を分岐する」枠組みにアンカー解決結果を載せた設計で、新しい擬似クラスを増やすよりカスケードとの整合性が取りやすい。

FedCM や Digital Credentials、Smart Card API に共通するのは「これまでネイティブアプリや拡張機能、独自プロトコルに逃げていた領域を Web 標準の権限モデル内に取り込む」方向性である。特に FedCM はサードパーティ Cookie 廃止後の連合認証の受け皿であり、応答の構造化はIdP実装の堅牢化（文字列連結による JSON 生成というバグ温床の除去）を狙う。

トレードオフ: プラットフォーム API の拡大は攻撃面の拡大でもある。Smart Card API のようなハードウェア接点は権限プロンプトとオリジン分離が生命線で、企業ポリシー管理下での利用が主用途になる。

### 実務での使いどころ・移行の勘所

- Floating UI / Popper.js でツールチップを実装しているプロジェクトは、Anchor Positioning + `@container anchored()` + `interestfor` の組で「JS ゼロのツールチップ」への置き換えを検討できる段階。ただし全ブラウザの Baseline 状況を確認のこと（Chrome 先行機能が多い）。
- FedCM 構造化応答は IdP 実装者向け。RP 側は変更不要。
- DevTools MCP は Claude や Gemini などのエージェントにパフォーマンストレースや DOM 検査を委譲するワークフローの土台。CI でのパフォーマンス分析自動化と相性が良い。

## 📖 用語解説（このトピックとのつながり）

- **アンカー配置（Anchor Positioning）**: 要素を別要素基準で配置する CSS 仕様。本リリースはその「フォールバック状態の観測」を追加した。
- **position-try-fallbacks**: はみ出し時の代替配置候補リスト。`@container anchored()` はどの候補が採用されたかを条件にできる。
- **FedCM**: ブラウザ仲介の連合認証 API。3rd-party Cookie 依存のログインウィジェットの後継。
- **MCP（Model Context Protocol）**: AI エージェントとツールを繋ぐプロトコル。DevTools が公式にサーバーを積んだことで「ブラウザ自体が AI の道具」になった。
- **PC/SC**: スマートカード通信の業界標準 API。Smart Card API はこれへの Web からの橋渡し。

## 影響範囲 / 推奨アクション

- ツールチップ/ポップオーバー系 UI ライブラリの利用箇所を棚卸しし、ネイティブ化のロードマップを引く好機。
- IdP 運用者は FedCM エンドポイントの JSON 構造化対応を検討。
- Chrome 管理下の組織は 143 のセキュリティ修正適用を通常サイクルで。

## リンク

- リリースノート: https://developer.chrome.com/release-notes/143
- New in Chrome 143: https://developer.chrome.com/blog/new-in-chrome-143
- DevTools 143: https://developer.chrome.com/blog/new-in-devtools-143

# Interest Invokers（interestfor）と popover=hint — ツールチップを JS なしで作る

> トピック: HTML `interestfor` 属性（Interest Invokers）と `popover="hint"`｜出典: una.im / MDN / InfoQ｜種別: Web 標準（新機能・展開中）

## 一行サマリー

ホバーやキーボードフォーカスで「興味を示した」ときに要素を開く HTML の `interestfor` 属性（Interest Invokers）と、他のポップオーバーを閉じずに一時的な補助情報を出す `popover="hint"` を組み合わせると、ツールチップやホバーカードを JavaScript なしで作れる。先に Baseline 化した Invoker Commands（`command` / `commandfor`）の「クリック起動」に対し、こちらは「ホバー/フォーカス起動」を宣言的に担う新層。

## 🔰 初学者向け（何が・なぜ重要か）

「アイコンにマウスを乗せると小さな説明が出る」——このツールチップやホバーカードは定番ですが、正しく作るのは意外と面倒でした。マウス・キーボード・タッチそれぞれの操作、開閉のタイミング、スクリーンリーダー対応などを JavaScript で丁寧に書く必要があったからです。

新しい `interestfor` 属性は、この「ホバー/フォーカスしたら出す」という定番動作をブラウザ標準に任せる仕組みです。たとえるなら、これまで毎回手配線していた「近づいたら光るセンサー」を、ボタンに標準装備できるようになったイメージ。`popover="hint"` と組み合わせると、「補助的なヒント」を他の開いているメニューを邪魔せずに重ねて表示できます。

嬉しいのは、キーボード操作やアクセシビリティの面倒をブラウザが見てくれるので、**少ないコードで、しかも壊れにくいツールチップ**が作れること。少し前に定着した「ボタンを押したら開く」標準機能（Invoker Commands）の、ホバー版が来た格好です。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- **Invoker Commands（前提）**: `command` と `commandfor` 属性で、ボタンから別要素を宣言的に操作する仕組み。`toggle-popover` / `show-popover` / `hide-popover` などのコマンドを持つ。2026年1月に Safari 26.2 の対応で Baseline 到達（Chrome 135 / Firefox 144 が先行）。
- **Interest Invokers（新層）**: `interestfor` 属性は、ユーザーが対象に「興味を示した」とき——マウスホバー、キーボードフォーカス等——に発火する。`popover="hint"` と併用することで、ツールチップやホバーカードを追加スクリプトなしで実現できる。
- **popover="hint"**: スタック上の他ポップオーバーを閉じずに開ける新しい popover タイプ。ヒント/補助情報の重畳に向く。

（`interestfor` は展開途上の機能であり、Baseline 到達可否・対応ブラウザは MDN 互換表で要確認。プログレッシブ・エンハンスメント前提。）

### 仕組み / 背景（なぜこう設計されたか）

ポップアップ系 UI は「どの操作で開き・閉じ、フォーカスをどう移し、支援技術にどう伝えるか」というアクセシビリティ要件が本質的に複雑で、JS 実装が微妙にずれがちだった。Popover API はまず「クリックで開閉するオーバーレイ」を標準化し、Invoker Commands が「起動をボタン属性で宣言する」層を足した。だが「ホバーで開くツールチップ」はイベントモデルとタッチ端末の扱い（ホバーの概念が薄い）が異なり、別途 `interestfor` として抽象化された。

設計の要点は、開閉トリガーを**宣言的属性**に落とすことでブラウザが一貫したアクセシビリティ挙動（フォーカス管理、ロール付与、キーボード等価操作）を保証できる点。トレードオフは、細かなアニメーションや遅延ロジックのカスタマイズには限界があり、複雑なホバーカードでは JS 併用が残ること、そして Baseline 未達の機能はフォールバック設計が必須になること。

### 実務での使いどころ・移行の勘所

情報アイコンのツールチップ、ユーザー名ホバーカード、用語のヒント表示など「補助情報を軽く出す」UI に最適。Popover API + Invoker Commands（クリック開閉）で土台を作り、`interestfor` + `popover="hint"`（ホバー/フォーカス）を上乗せする構成が素直。`interestfor` 未対応環境向けに、対象を常設リンク/開閉可能にするなどのフォールバックを用意する。タッチ端末では「ホバー」が成立しないため、フォーカス/タップ経路の確認を必ず行う。

## 📖 用語解説（このトピックとのつながり）

- **interestfor（Interest Invokers）**: ホバー/フォーカスで対象を開く HTML 属性。本トピックの主役。
- **popover="hint"**: 他ポップオーバーを閉じずに重ねる補助ポップオーバー型。ツールチップ用途。
- **Invoker Commands（command / commandfor）**: クリック起動を宣言する属性群。`interestfor` のクリック版に相当し、既に Baseline。
- **Popover API**: オーバーレイUIの標準基盤。上記機能の土台。
- **プログレッシブ・エンハンスメント**: 未対応環境でも基本機能が成立する設計。展開途上機能に必須。

## 影響範囲 / 推奨アクション

ツールチップ/ホバーカードを低コスト・高アクセシビリティで実装できる。Invoker Commands は Baseline 済みで即採用可、`interestfor` は対応状況を確認しフォールバック前提で導入。タッチ/キーボード経路の検証を設計に含めること。

## リンク

- una.im「What is popover=hint?」: https://una.im/popover-hint/
- InfoQ「HTML Invoker Commands Achieve Baseline」: https://www.infoq.com/news/2026/01/html-invoker-commands/
- MDN Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

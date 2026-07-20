# スクリーンショット撮影チェックリスト

教材記事に差し込んだプレースホルダの一覧です。**合計 190 枚 / 131 記事**。

各項目の SVG を、実際に撮影したキャプチャに差し替えてください。
画像を PNG などで用意する場合は、記事側の `Figure` の `src` の拡張子も合わせて変更します。

## Web基礎（`web`）— 56 枚

### Angular 入門① — コンポーネントとテンプレート

記事: `/nicotech/web/angular-01`

- [ ] **ng serve 実行後にブラウザで http://localhost:4200 を開いた Angular の初期画面**
    - 差し替え先: `public/learn/shots/web/angular-01-01.svg`
    - キャプション: ng serve が通れば localhost:4200 にこの初期画面が出る。ここが Angular 開発のスタート地点。
    - 挿入位置: 「Angular CLI でプロジェクトを作る」節の Steps 直後（TipBox の直前）

### API の認証・認可 — API キー / OAuth2 / JWT

記事: `/nicotech/web/api-auth`

- [ ] **jwt.io にトークンを貼り付け、ヘッダ・ペイロード・署名がデコード表示された画面**
    - 差し替え先: `public/learn/shots/web/api-auth-01.svg`
    - キャプション: ペイロードは Base64 なので、貼り付けるだけで誰でも中身が読める。機密情報を入れてはいけない理由が一目で分かる。
    - 挿入位置: 「JWT の検証」節、payload の Code 直後（Callout「検証で必ず見る 3 点」の直前）

### API テスト — Postman / curl / Thunder Client

記事: `/nicotech/web/api-testing`

- [ ] **Postman でコレクションを開き、右上の環境切り替えドロップダウンが見えている画面**
    - 差し替え先: `public/learn/shots/web/api-testing-01.svg`
    - キャプション: 左のコレクションでリクエストを整理し、右上の環境を切り替えるだけで開発・本番を行き来できる。
    - 挿入位置: 「Postman — コレクションと環境変数」節の環境変数の説明直後（Callout の直前）
- [ ] **VS Code の Thunder Client でリクエストを送信し、レスポンスが右ペインに表示された画面**
    - 差し替え先: `public/learn/shots/web/api-testing-02.svg`
    - キャプション: エディタを離れずにリクエストと結果を並べて確認できる。実装しながらの動作確認はこれが速い。
    - 挿入位置: 「Thunder Client — エディタ内で完結」節の説明文直後

### 非同期処理 — Promise と async / await

記事: `/nicotech/web/async-promise-await`

- [ ] **Chrome DevTools の Network タブで、直列に await した3本のリクエストが階段状に並ぶウォーターフォール**
    - 差し替え先: `public/learn/shots/web/async-promise-await-01.svg`
    - キャプション: 直列に await すると、リクエストが階段状にずれて並ぶ。この形が見えたら並行化の余地がある合図。
    - 挿入位置: Callout「じわじわ遅いの正体はウォーターフォール」直後（「コールバックとその限界」節の直前）

### 検証ツール（ブラウザ DevTools）の使い方

記事: `/nicotech/web/browser-devtools`

- [ ] **Chrome DevTools の Elements パネルで要素を選択し、右の Styles ペインが表示された状態**
    - 差し替え先: `public/learn/shots/web/browser-devtools-01.svg`
    - キャプション: 左が DOM ツリー、右が選択要素に効いている CSS。ここで値を書き換えると即座に画面へ反映される。
    - 挿入位置: 「Elements」節の KVList 直後（TipBox の直前）
- [ ] **Chrome DevTools の Network タブでリクエストを1本選び、Headers タブを開いた状態**
    - 差し替え先: `public/learn/shots/web/browser-devtools-02.svg`
    - キャプション: 通信一覧から1本選ぶと、送ったヘッダと返ってきたヘッダが並ぶ。API 調査の起点はここ。
    - 挿入位置: 「Network — 通信の中身を見る」節の KVList 直後（TipBox の直前）
- [ ] **Chrome DevTools の Performance パネルで録画後の Flame Chart と Long Task が見える状態**
    - 差し替え先: `public/learn/shots/web/browser-devtools-03.svg`
    - キャプション: 横幅がそのまま所要時間。幅の広いブロックと Long Task の印が、最初に手を付けるべき場所。
    - 挿入位置: 「Performance」節の KVList 直後（SubSection「計測 → ボトルネック特定 → 改善」の直前）

### 開発におすすめの Chrome 拡張機能

記事: `/nicotech/web/chrome-extensions`

- [ ] **Wappalyzer のポップアップで、開いているサイトの技術スタックが一覧表示された画面**
    - 差し替え先: `public/learn/shots/web/chrome-extensions-01.svg`
    - キャプション: ツールバーのアイコンを押すだけで、フレームワーク・CMS・解析ツール・ホスティングが並ぶ。
    - 挿入位置: 「技術スタックを調べる」節の Wappalyzer 説明直後（TipBox の直前）
- [ ] **React Developer Tools の Components タブでツリーと props/state を表示した画面**
    - 差し替え先: `public/learn/shots/web/chrome-extensions-02.svg`
    - キャプション: 左にコンポーネントの木、右に選択中の props / state / hooks。値をその場で書き換えて挙動も試せる。
    - 挿入位置: 「フレームワークをデバッグする」節、React Developer Tools の説明直後（Vue.js devtools の直前）
- [ ] **Chrome 拡張のインストール時に出る権限確認ダイアログ（全サイトのデータの読み取りと変更）**
    - 差し替え先: `public/learn/shots/web/chrome-extensions-03.svg`
    - キャプション: インストール前に出るこのダイアログが、その拡張に渡す権限の全て。読み飛ばさず吟味する。
    - 挿入位置: 「安全に使う — 権限とリスク」節、host_permissions の説明直後（Steps の直前）

### Cookie とは

記事: `/nicotech/web/cookie`

- [ ] **Chrome DevTools の Application タブで Cookies を開き、HttpOnly / Secure / SameSite の列が見える状態**
    - 差し替え先: `public/learn/shots/web/cookie-01.svg`
    - キャプション: 実際に発行された Cookie は Application タブで一覧できる。属性が意図どおり付いているかはここで確認する。
    - 挿入位置: 「Cookie の属性」節の KVList 直後（「Cookie の種類」節の直前）

### CORS の仕組みとハマりどころ

記事: `/nicotech/web/cors`

- [ ] **Chrome DevTools の Console に赤字で出た CORS policy によるブロックのエラーメッセージ**
    - 差し替え先: `public/learn/shots/web/cors-01.svg`
    - キャプション: この赤字を初めて見て焦る人は多い。ブラウザが止めているだけで、API 自体は動いていることが多い。
    - 挿入位置: Lead 直後（「同一オリジンポリシー」節の直前）
- [ ] **Chrome DevTools の Network タブで OPTIONS プリフライトを選び Access-Control-Allow-* ヘッダを表示した状態**
    - 差し替え先: `public/learn/shots/web/cors-02.svg`
    - キャプション: Network に OPTIONS が1本挟まっているのがプリフライト。許可ヘッダが返っているかをここで確かめる。
    - 挿入位置: 「プリフライト（OPTIONS）の仕組み」節、preflight response の Code 直後

### CSS の基礎 — セレクタ・ボックスモデル・レイアウト

記事: `/nicotech/web/css-basics`

- [ ] **Chrome DevTools の Computed タブに出るボックスモデル図（margin/border/padding/content の数値）**
    - 差し替え先: `public/learn/shots/web/css-basics-01.svg`
    - キャプション: DevTools の Computed タブには4層が入れ子の図で出る。実際に何 px 効いているかはここで読む。
    - 挿入位置: 「ボックスモデル」節の Code 直後（Callout「width の落とし穴と box-sizing」の直前）
- [ ] **Chrome DevTools の Styles ペインで、詳細度に負けた宣言が取り消し線で表示されている状態**
    - 差し替え先: `public/learn/shots/web/css-basics-02.svg`
    - キャプション: 負けた宣言には取り消し線が入る。「書いたのに効かない」ときは、まずこの線を探す。
    - 挿入位置: 「カスケードと詳細度」節の Code 直後（SubSection「詳細度は 3 つ組で数える」の直前）

### データベースの基礎 — RDB と SQL

記事: `/nicotech/web/database-basics`

- [ ] **同じ検索を EXPLAIN ANALYZE で実行し、インデックス作成前後の実行計画と所要時間を並べた結果**
    - 差し替え先: `public/learn/shots/web/database-basics-01.svg`
    - キャプション: EXPLAIN ANALYZE を前後で比べると、全件走査が索引探索に変わり所要時間が桁で縮むのが数字で見える。
    - 挿入位置: 「インデックス — 検索を速くする」節、CREATE INDEX の Code 直後

### エディタ拡張おすすめ（VS Code）

記事: `/nicotech/web/editor-extensions`

- [ ] **VS Code で ESLint の波線と Error Lens のインライン表示が同時に出ている画面**
    - 差し替え先: `public/learn/shots/web/editor-extensions-01.svg`
    - キャプション: ESLint が波線で指摘し、Error Lens がその行の右に内容を出す。マウスを乗せずに原因が読める。
    - 挿入位置: Error Lens の説明直後（Callout「保存時オートフォーマットを設定」の直前）
- [ ] **VS Code の GitLens が行末に「誰がいつ変更したか」を薄く表示している画面**
    - 差し替え先: `public/learn/shots/web/editor-extensions-02.svg`
    - キャプション: カーソルのある行の末尾に、その行を最後に変更した人・時期・コミットが薄字で出る。
    - 挿入位置: 「Git を扱う」節の GitLens 説明直後（「すぐ確認する — プレビュー」節の直前）

### Express — Node.js の軽量 Web フレームワーク

記事: `/nicotech/web/express`

- [ ] **node app.js を起動したターミナルに、logger ミドルウェアのアクセスログが流れている様子**
    - 差し替え先: `public/learn/shots/web/express-01.svg`
    - キャプション: ブラウザでアクセスするたび、logger が出したメソッドとパスがターミナルに流れる。通っている証拠が目で見える。
    - 挿入位置: 「ミドルウェア」節、middleware.js の Code 直後（Callout「express.json() もミドルウェア」の直前）

### fetch で API と通信する

記事: `/nicotech/web/fetch-api`

- [ ] **Chrome DevTools の Network タブで 404 を返した fetch リクエストと、Console 側の表示**
    - 差し替え先: `public/learn/shots/web/fetch-api-01.svg`
    - キャプション: Network では赤く 404 と出ているのに、Console には例外が出ていない。これが「fetch は reject しない」の実物。
    - 挿入位置: 「ステータス確認」節の check-status.js 直後（Callout「reject されるのは通信できないときだけ」の直前）

### GraphQL 入門

記事: `/nicotech/web/graphql`

- [ ] **GraphiQL でクエリを書いて実行し、右に結果 JSON・右端にスキーマのドキュメントが出た画面**
    - 差し替え先: `public/learn/shots/web/graphql-01.svg`
    - キャプション: 左でクエリを書くと補完が効き、右に結果が出る。スキーマがそのままドキュメントとして引ける。
    - 挿入位置: 「Query と Mutation」節の response JSON 直後（「Resolver」節の直前）

### gRPC 入門

記事: `/nicotech/web/grpc`

- [ ] **grpcurl でサービスのメソッドを呼び出し、レスポンスが JSON で表示されたターミナル**
    - 差し替え先: `public/learn/shots/web/grpc-01.svg`
    - キャプション: バイナリで直接は読めないため、grpcurl のような専用ツールで JSON に起こして中身を確認する。
    - 挿入位置: Callout「デバッグしにくさが落とし穴」直後（Divider の直前）

### ログインの仕組み — Cookie / Session / JWT / OAuth / OIDC

記事: `/nicotech/web/how-login-works`

- [ ] **「Google でログイン」を押したときに表示される Google の同意画面**
    - 差し替え先: `public/learn/shots/web/how-login-works-01.svg`
    - キャプション: この同意画面こそが OAuth の本体。「何を許可するか」がここに列挙され、押した瞬間に権限が委譲される。
    - 挿入位置: 「OAuth」節の身近な例 KVList 直後（Callout「OAuth は本来『認可』のための仕組み」の直前）

### Web ページが表示されるまでの流れ

記事: `/nicotech/web/how-web-page-loads`

- [ ] **Chrome DevTools の Network で1本のリクエストの Timing タブ（DNS/接続/SSL/TTFB の内訳）**
    - 差し替え先: `public/learn/shots/web/how-web-page-loads-01.svg`
    - キャプション: ここまでの各ステップが、実際に何ミリ秒かかったかを内訳で確認できる。遅さの原因を工程単位で切り分けられる。
    - 挿入位置: 「各ステップの時間の目安」節の ComparisonTable 直後（Callout「2 回目以降が速い理由」の直前）

### HTTP の基礎 — リクエスト/レスポンスの仕組み

記事: `/nicotech/web/http-basics`

- [ ] **curl -v の実行結果で、送ったリクエスト行と返ってきたレスポンスヘッダが両方見えるターミナル**
    - 差し替え先: `public/learn/shots/web/http-basics-01.svg`
    - キャプション: 行頭の記号で向きが分かる。ここまで説明した4パート構造が、そのままテキストとして流れているのが見える。
    - 挿入位置: 「ヘッダ」節、curl -v の Code 直後

### Go 言語まとめ

記事: `/nicotech/web/lang-go`

- [ ] **go run -race を実行し、DATA RACE が検出されたときのターミナル出力**
    - 差し替え先: `public/learn/shots/web/lang-go-01.svg`
    - キャプション: レースディテクタは「どの goroutine がどの行で同じ変数を触ったか」まで出す。競合は勘ではなく計測で見つける。
    - 挿入位置: Callout「並行処理の落とし穴」直後（「ネットワークサーバーとしての Go」節の直前）

### Ruby on Rails とは

記事: `/nicotech/web/lang-ruby-on-rails`

- [ ] **rails generate scaffold を実行し、生成されたファイル一覧が並ぶターミナル**
    - 差し替え先: `public/learn/shots/web/lang-ruby-on-rails-01.svg`
    - キャプション: 1コマンドでモデル・ビュー・コントローラ・マイグレーションが一気に生成される。この量が CoC の恩恵。
    - 挿入位置: Callout「Scaffold / Generator で骨組みを自動生成」直後
- [ ] **rails server のログに、N+1 で同じ SELECT が何度も並んでいる様子**
    - 差し替え先: `public/learn/shots/web/lang-ruby-on-rails-02.svg`
    - キャプション: 開発サーバのログを見ると、同じ形の SELECT がずらりと並ぶ。N+1 はここで気づくのが一番早い。
    - 挿入位置: Callout「よくある落とし穴 — N+1 問題」直後（SubSection「他フレームワークとの位置づけ」の直前）

### Rust 言語まとめ

記事: `/nicotech/web/lang-rust`

- [ ] **cargo build で借用チェッカのエラーが出たターミナル画面。エラー番号・該当行のハイライト・help の説明まで写す**
    - 差し替え先: `public/learn/shots/web/lang-rust-01.svg`
    - キャプション: 借用エラーは「バグ」ではなく証明の失敗。cargo が該当行と理由まで示してくれる
    - 挿入位置: 「借用チェッカとライフタイム」節、dangle() のコンパイルエラー例の Code 直後

### NestJS — TypeScript 製の本格 Web フレームワーク

記事: `/nicotech/web/nestjs`

- [ ] **nest generate resource users を実行した直後のターミナル。生成された Module/Controller/Service/DTO のファイル一覧が並んだ状態**
    - 差し替え先: `public/learn/shots/web/nestjs-01.svg`
    - キャプション: CLI 1 コマンドで Module / Controller / Service / DTO が一式生成される
    - 挿入位置: 「CLI でプロジェクトを作る」節、Steps の直後

### Next.js — React のフルスタックフレームワーク

記事: `/nicotech/web/nextjs`

- [ ] **next build の出力。ルートごとに Static / SSG / Dynamic の記号とサイズが並んだ一覧表の部分**
    - 差し替え先: `public/learn/shots/web/nextjs-01.svg`
    - キャプション: next build の出力を読むと、どのページが静的化され、どれが都度生成かが一目で分かる
    - 挿入位置: 「レンダリング方式」節、4 方式の比較表の直後（キャッシュの Bridge の前）
- [ ] **Vercel のデプロイ画面。リポジトリ接続後、ビルドログとプレビュー URL が表示された状態**
    - 差し替え先: `public/learn/shots/web/nextjs-02.svg`
    - キャプション: リポジトリを繋ぐだけで、ビルドからプレビュー URL の発行までが自動で進む
    - 挿入位置: 「デプロイ」節、Steps の直後

### OpenAPI / Swagger でドキュメント化

記事: `/nicotech/web/openapi-swagger`

- [ ] **Swagger UI の画面。エンドポイントを展開し Try it out で実行したレスポンス欄まで写す**
    - 差し替え先: `public/learn/shots/web/openapi-swagger-01.svg`
    - キャプション: YAML を書くだけで、その場で叩けるドキュメント画面が手に入る
    - 挿入位置: 「Swagger UI で可視化」節、説明文の直後

### Python の Web フレームワーク — Django / FastAPI / Flask

記事: `/nicotech/web/python-web-frameworks`

- [ ] **Django の自動生成された管理画面(admin)。モデル一覧と Post の編集フォームが見える状態**
    - 差し替え先: `public/learn/shots/web/python-web-frameworks-01.svg`
    - キャプション: モデルを登録するだけで、この管理画面が丸ごと生成される
    - 挿入位置: Django 節「admin が強力」Callout の直後
- [ ] **FastAPI の /docs を開いた画面。自動生成された Swagger UI とスキーマ表示**
    - 差し替え先: `public/learn/shots/web/python-web-frameworks-02.svg`
    - キャプション: 型ヒントを書いただけで、この対話的ドキュメントが自動で立ち上がる
    - 挿入位置: FastAPI 節「/docs を開くだけ」Callout の直後

### React 入門① — コンポーネントと JSX

記事: `/nicotech/web/react-basics-01`

- [ ] **npm run dev で Vite の開発サーバを起動したターミナルと、localhost で開いた React の初期画面**
    - 差し替え先: `public/learn/shots/web/react-basics-01-01.svg`
    - キャプション: npm run dev で表示された URL を開くと、この初期画面が出れば準備完了
    - 挿入位置: 「02 環境構築（Vite で作成）」節、npm create vite の Code 直後
- [ ] **astexplorer.net に JSX を貼った画面。左にソース、中央に AST、右に変換後コードが並んだ状態**
    - 差し替え先: `public/learn/shots/web/react-basics-01-02.svg`
    - キャプション: JSX・AST・変換後の JS が同時に並ぶので、脱糖の過程がそのまま目で追える
    - 挿入位置: 「04 JSX が変換される仕組み」節、ASTExplorer を紹介する TipBox の直後

### React コミットフェーズ

記事: `/nicotech/web/react-commit-phase`

- [ ] **React DevTools の Profiler タブ。記録したコミットのバーが並び、1 コミットを選んだ状態**
    - 差し替え先: `public/learn/shots/web/react-commit-phase-01.svg`
    - キャプション: Profiler では 1 本のバーが 1 コミット。実際に反映が起きた単位を目で確認できる
    - 挿入位置: 「コミットで行われること」節、StepFlow 図の直後

### 仮想 DOM の正体 — Fiber ノード

記事: `/nicotech/web/react-fiber-node`

- [ ] **React DevTools の Components タブ。コンポーネントの木構造と、選択したノードの props/state パネル**
    - 差し替え先: `public/learn/shots/web/react-fiber-node-01.svg`
    - キャプション: DevTools に見えている木が、内部では Fiber ノードのつながりそのもの
    - 挿入位置: 「tag と stateNode の役割」節の末尾

### React 入門③ — Hooks を使いこなす

記事: `/nicotech/web/react-hooks-03`

- [ ] **エディタで useEffect の依存配列に react-hooks/exhaustive-deps の警告が出ている様子。警告文のツールチップまで写す**
    - 差し替え先: `public/learn/shots/web/react-hooks-03-01.svg`
    - キャプション: 依存の入れ忘れはエディタ上で警告される。何を足すべきかまで提示される
    - 挿入位置: 「04 useEffect」節、依存配列の警告 Callout の直後

### React の宣言的 UI 実装 — 仮想 DOM と差分検出

記事: `/nicotech/web/react-virtual-dom`

- [ ] **React DevTools の Highlight updates を有効にし、state 更新で再描画された箇所だけが枠で光っている画面**
    - 差し替え先: `public/learn/shots/web/react-virtual-dom-01.svg`
    - キャプション: Highlight updates を有効にすると、実際に更新された範囲だけが光る
    - 挿入位置: VDomDiffFigure の直後

### React・Vue・Angular の比較と使い分け

記事: `/nicotech/web/react-vue-angular-compare`

- [ ] **Lighthouse でフロントエンドを計測したレポート画面。Performance のスコアと各指標の内訳**
    - 差し替え先: `public/learn/shots/web/react-vue-angular-compare-01.svg`
    - キャプション: 速い/遅いはフレームワーク名ではなく、こうした実測値で判断する
    - 挿入位置: 「パフォーマンス」節、Lighthouse に言及する TipBox の直後

### SPA / SSR / CSR / SSG / ISR とは

記事: `/nicotech/web/rendering-patterns`

- [ ] **CSR のページと SSR のページで「ページのソースを表示」した結果を並べたもの。空の div と中身入り HTML の違いが分かるように**
    - 差し替え先: `public/learn/shots/web/rendering-patterns-01.svg`
    - キャプション: ソース表示で一目瞭然。CSR は空の器、SSR は最初から中身が入っている
    - 挿入位置: 「初回表示はレイテンシの勝負」節、CSR-timeline の説明文の直後

### RevenueCat — アプリ内課金基盤

記事: `/nicotech/web/revenuecat`

- [ ] **RevenueCat のダッシュボード画面。MRR・継続率・チャーンのグラフが並んだ状態**
    - 差し替え先: `public/learn/shots/web/revenuecat-01.svg`
    - キャプション: SDK を入れるだけで、売上・継続率・チャーンがここに集約される
    - 挿入位置: 「主な機能」節の箇条書きの直後

### 実務で迷わない HTTP ステータスコード

記事: `/nicotech/web/status-codes`

- [ ] **ブラウザ DevTools の Network タブ。Status 列に 200 / 304 / 401 / 404 などが混在した一覧**
    - 差し替え先: `public/learn/shots/web/status-codes-01.svg`
    - キャプション: 実務でコードを読むのはこの画面。Status 列を眺めるだけで異常の当たりが付く
    - 挿入位置: 「よく出るコード早見表」節、「迷ったら 2 段階で読む」Callout の直後

### Tailwind CSS — ユーティリティファースト

記事: `/nicotech/web/tailwind-css`

- [ ] **エディタで Tailwind CSS IntelliSense がクラス名を補完し、対応する CSS をプレビュー表示している様子**
    - 差し替え先: `public/learn/shots/web/tailwind-css-01.svg`
    - キャプション: 語彙を暗記しなくても、補完と CSS プレビューで書きながら覚えられる
    - 挿入位置: 「主要なユーティリティ」節、color / typography の TipBox の直後

### トランザクション — データを壊さない仕組み

記事: `/nicotech/web/transaction`

- [ ] **psql のターミナルを2つ並べ、片方が FOR UPDATE でロック中にもう片方が待たされ、デッドロック検知エラーが出た画面**
    - 差し替え先: `public/learn/shots/web/transaction-01.svg`
    - キャプション: ロック待ちで固まる様子と、DB が片方を強制 ROLLBACK する瞬間
    - 挿入位置: 「ロックとデッドロック」節、デッドロックの Callout の直後

### TypeScript の特徴

記事: `/nicotech/web/typescript`

- [ ] **エディタで number の変数に文字列を代入し、赤波線と型エラーのツールチップが出ている様子**
    - 差し替え先: `public/learn/shots/web/typescript-01.svg`
    - キャプション: 実行するまでもなく、書いた瞬間にエディタが誤りを指摘してくれる
    - 挿入位置: 「TypeScript の 5 つの特徴」節、features.ts の Code 直後

### Vue.js 入門① — テンプレートとリアクティビティ

記事: `/nicotech/web/vue-01`

- [ ] **Vue DevTools の Components タブ。選択したコンポーネントの ref/reactive な状態が一覧表示された状態**
    - 差し替え先: `public/learn/shots/web/vue-01-01.svg`
    - キャプション: 追跡されている値かどうかは Vue DevTools で確認できる。ここに出なければ追跡は切れている
    - 挿入位置: 「実務での使いどころと落とし穴」節、「なぜか更新されない」の Callout の直後

### Web 開発支援 SaaS 6 選

記事: `/nicotech/web/web-dev-saas-tools`

- [ ] **MakeSwift の編集画面。既存の React コンポーネントをドラッグ&ドロップでページに配置している様子**
    - 差し替え先: `public/learn/shots/web/web-dev-saas-tools-01.svg`
    - キャプション: エンジニアが作った部品を、非エンジニアがこの画面で並べ替えられる
    - 挿入位置: 「サイト構築 / MakeSwift」節の KVList の直後
- [ ] **LiveBlocks を組み込んだ画面。複数ユーザーのカーソルと名前ラベルが同時に表示されている状態**
    - 差し替え先: `public/learn/shots/web/web-dev-saas-tools-02.svg`
    - キャプション: 上のコードだけで、この共同編集の見た目と同期が手に入る
    - 挿入位置: 「リアルタイム共同編集 / LiveBlocks」節、Room.tsx の後の TipBox の直後

### Web のセッションとは

記事: `/nicotech/web/web-session`

- [ ] **DevTools の Application タブ > Cookies。セッション ID の Cookie と HttpOnly / Secure / SameSite 列が見える状態**
    - 差し替え先: `public/learn/shots/web/web-session-01.svg`
    - キャプション: 実際のセッション ID と HttpOnly / Secure / SameSite の設定はここで確認できる
    - 挿入位置: 「セッション ID の扱い」節、保存場所の KVList の直後

### Webhook — イベント駆動の連携

記事: `/nicotech/web/webhook`

- [ ] **webhook.site で受信した Webhook の詳細画面。リクエストヘッダの署名と JSON ボディが見える状態**
    - 差し替え先: `public/learn/shots/web/webhook-01.svg`
    - キャプション: 署名ヘッダとイベント ID が実際にどう届くかは、この画面で確かめられる
    - 挿入位置: 「受信側の実装チェックリスト」節、ngrok に言及する TipBox の直後

### API とは — REST / SOAP / gRPC / GraphQL

記事: `/nicotech/web/what-is-api`

- [ ] **ターミナルで curl を実行し、返ってきた JSON レスポンスが表示された画面**
    - 差し替え先: `public/learn/shots/web/what-is-api-01.svg`
    - キャプション: ブラウザもアプリも介さず、ターミナル 1 行で API の往復をそのまま覗ける
    - 挿入位置: 「システム同士はこうやって会話している」節、curl の Code 直後

### Web とインターネットの違い

記事: `/nicotech/web/what-is-web`

- [ ] **ターミナルで ping example.com と curl -I https://example.com を続けて実行した結果を1画面に写したもの**
    - 差し替え先: `public/learn/shots/web/what-is-web-01.svg`
    - キャプション: 同じホストでも、返ってくる情報の層がまったく違うことが見比べられる
    - 挿入位置: 「手を動かして層を体感する」節、ping / curl の Steps の直後

## インフラ基礎（`infra`）— 16 枚

### 複数サービスを束ねる — 通信・DB・healthcheck・リバースプロキシ

記事: `/nicotech/infra/compose-multi-service`

- [ ] **docker compose ps の実行結果。5サービスが Up、postgres と redis が healthy の一覧**
    - 差し替え先: `public/learn/shots/infra/compose-multi-service-01.svg`
    - キャプション: healthcheck を入れたあとの compose ps。DB とキャッシュに healthy が付き、その後で backend が立っている。
    - 挿入位置: 「起動順序と healthcheck」節、healthcheck の Code ブロックと Callout の間
- [ ] **完成した掲示板をブラウザで開いた画面。投稿フォームと一覧、閲覧数が表示された状態**
    - 差し替え先: `public/learn/shots/infra/compose-multi-service-02.svg`
    - キャプション: ブラウザから見えるのはこの1画面だけ。その裏で nginx・frontend・backend・PostgreSQL・Redis が動いている。
    - 挿入位置: 「本番に向けた仕上げ」節の末尾、final-architecture の Figure の直後

### Docker の基礎 — イメージ・コンテナ・ホストを掴む

記事: `/nicotech/infra/docker-basics`

- [ ] **sudo docker run hello-world の実行結果。Hello from Docker! のメッセージが出たターミナル**
    - 差し替え先: `public/learn/shots/infra/docker-basics-01.svg`
    - キャプション: Hello from Docker! が出れば導入成功。pull → create → start が実際に走ったログも同時に読める。
    - 挿入位置: 「公式リポジトリからインストールする」節、インストール手順の Code ブロックの直後

### docker-compose — 役割で分けて、宣言的に束ねる

記事: `/nicotech/infra/docker-compose`

- [ ] **docker compose up -d の実行結果。Network と Container の Created / Started が並ぶ画面**
    - 差し替え先: `public/learn/shots/infra/docker-compose-01.svg`
    - キャプション: up -d の出力。ネットワークが自動作成され、続いてコンテナが Created から Started へ進むのが読み取れる。
    - 挿入位置: 「最初の compose と、build / image の違い」節、compose コマンドの Code ブロックの直後

### docker run — コンテナを動かす・つなぐ・残す

記事: `/nicotech/infra/docker-run`

- [ ] **docker ps の実行結果。CONTAINER ID / IMAGE / PORTS / NAMES の表が並んだターミナル**
    - 差し替え先: `public/learn/shots/infra/docker-run-01.svg`
    - キャプション: docker ps の出力。PORTS 列の 0.0.0.0:8080 の表記で、どのポートがどこにつながっているか読み取れる。
    - 挿入位置: 「最初のコンテナ — nginx」節、docker run/ps/curl の Code ブロックの直後

### Dockerfile — 自分のイメージを作り、本番向けに仕上げる

記事: `/nicotech/infra/dockerfile`

- [ ] **docker build の2回目の実行ログ。各ステップに CACHED と表示された行が見える状態**
    - 差し替え先: `public/learn/shots/infra/dockerfile-01.svg`
    - キャプション: 2回目のビルド。変更のないステップに CACHED が付き、そこは再実行されないのでビルドが一気に速くなる。
    - 挿入位置: 「最初の Dockerfile」節、レイヤーキャッシュの Callout の直前
- [ ] **docker images の実行結果。1段ビルドとマルチステージのイメージ SIZE を並べて比較**
    - 差し替え先: `public/learn/shots/infra/dockerfile-02.svg`
    - キャプション: 同じアプリを1段ビルドとマルチステージで作った結果。SIZE 列を並べると削減幅がそのまま数字で見える。
    - 挿入位置: 「マルチステージビルド」節、マルチステージ Dockerfile の Code ブロックの直後

### fail2ban — ログ監視で攻撃を自動ブロックする

記事: `/nicotech/infra/fail2ban`

- [ ] **sudo fail2ban-client status sshd の実行結果。Currently banned の IP 一覧が見える状態**
    - 差し替え先: `public/learn/shots/infra/fail2ban-01.svg`
    - キャプション: 実際に BAN されている IP の一覧。Total failed / Total banned の数字が、攻撃を止めた実績になる。
    - 挿入位置: 「jail は jail.local で設定する」節、fail2ban-client の Code ブロックの直後

### ファイアウォール — UFW でサーバーの入口を絞る

記事: `/nicotech/infra/firewall-ufw`

- [ ] **sudo ufw status verbose の実行結果。deny(incoming) と 22/80/443 の ALLOW 行**
    - 差し替え先: `public/learn/shots/infra/firewall-ufw-01.svg`
    - キャプション: 有効化後の ufw status verbose。Default が deny (incoming) で、明示的に許可した3つだけが ALLOW に並ぶ。
    - 挿入位置: 「UFW の設定」節、ufw コマンド一式の Code ブロックの直後

### SSH 鍵認証 — サーバーへの安全な入口

記事: `/nicotech/infra/ssh-key-auth`

- [ ] **初回 ssh 接続のフィンガープリント確認から、ログイン成功後の Ubuntu ウェルカム表示までのターミナル**
    - 差し替え先: `public/learn/shots/infra/ssh-key-auth-01.svg`
    - キャプション: フィンガープリント確認に yes と答えるとログイン完了。プロンプトが ubuntu@... に変わればサーバーの中にいる。
    - 挿入位置: 「Oracle が作った鍵で初回ログイン」節、フィンガープリント確認の説明段落の直後

### systemd とプロセス管理 — サーバーで何が動いているか

記事: `/nicotech/infra/systemd-process`

- [ ] **systemctl status ssh の実行結果。active (running) が緑で表示された画面**
    - 差し替え先: `public/learn/shots/infra/systemd-process-01.svg`
    - キャプション: systemctl status の出力。Loaded / Active / 直近のログまで1画面で読めるのが systemd の便利なところ。
    - 挿入位置: 「systemd — Linux の init システム」節、systemctl コマンドの Code ブロックの直後
- [ ] **htop の画面。CPU/メモリのバーとプロセス一覧が見える状態**
    - 差し替え先: `public/learn/shots/infra/systemd-process-02.svg`
    - キャプション: htop の画面。上のバーで CPU・メモリの逼迫を一目で掴み、下の一覧で犯人のプロセスを探す。
    - 挿入位置: 「プロセスとポートを見る」節、ps/htop/ss の Code ブロックの直後
- [ ] **auth.log を grep した結果。Failed password や Invalid user が並ぶターミナル**
    - 差し替え先: `public/learn/shots/infra/systemd-process-03.svg`
    - キャプション: 立てて数時間の VPS でもこの量。世界中のボットが常時 SSH を叩きに来ているのが実際に見える。
    - 挿入位置: 「実際に来ている攻撃を見る」節、grep の Code ブロックと Callout の間

### VPS の基礎 — 素のサーバーを1台持つ

記事: `/nicotech/infra/vps-basics`

- [ ] **Oracle Cloud のインスタンス作成画面。イメージに Ubuntu 24.04、Shape に VM.Standard.E2.1.Micro を選んだ状態**
    - 差し替え先: `public/learn/shots/infra/vps-basics-01.svg`
    - キャプション: インスタンスの作成画面。イメージとシェイプをこの組み合わせにすると Always Free の対象になる。
    - 挿入位置: 「Ubuntu インスタンスを作成する」節、設定値の ComparisonTable の直後
- [ ] **作成後のインスタンス詳細ページ。Public IP・Username(ubuntu)・State(Running) が見える範囲**
    - 差し替え先: `public/learn/shots/infra/vps-basics-02.svg`
    - キャプション: インスタンス詳細ページ。この3点（Public IP / Username / State）が次の SSH ログインで必要になる。
    - 挿入位置: 「作成後に確認すること」節、3項目の Steps の直後
- [ ] **セキュリティリストの受信ルール一覧。0.0.0.0/0 TCP 22 の行が見える状態**
    - 差し替え先: `public/learn/shots/infra/vps-basics-03.svg`
    - キャプション: セキュリティリストの受信ルール。初期状態では SSH（22）だけが全世界から許可されている。
    - 挿入位置: 「クラウド側ファイアウォール — セキュリティリスト」節、本文段落と CIDR の Callout の間

## セキュリティ基礎（`security`）— 32 枚

### アクセス制御モデルと最小権限

記事: `/nicotech/security/access-control-iam`

- [ ] **AWS IAM のポリシー編集画面。Action に * を含む過剰なポリシーと、最小権限に絞ったポリシーの JSON を並べて表示（自分の検証用アカウント）**
    - 差し替え先: `public/learn/shots/security/access-control-iam-01.svg`
    - キャプション: IAM ポリシーの実物。ワイルドカード 1 文字で権限範囲がどれだけ広がるかを画面で確かめる
    - 挿入位置: 「IAM — クラウドでの認可」節、過剰権限の箇条書きの直後（danger Callout の直前）

### デジタル署名と PKI・証明書

記事: `/nicotech/security/certificates-pki`

- [ ] **ブラウザ（Chrome）のアドレスバーの鍵アイコンから開いた証明書ビューア。サーバ証明書から中間 CA、ルート CA へと続く証明書チェーンのツリーが見える状態**
    - 差し替え先: `public/learn/shots/security/certificates-pki-01.svg`
    - キャプション: ブラウザの証明書ビューア。図で見たチェーンが実際に階層として表示される
    - 挿入位置: 「PKI と証明書チェーン」節、openssl s_client の Code ブロックの直前
- [ ] **自分のローカル検証環境（自己署名証明書のサーバ）にアクセスしたときのブラウザの証明書エラー警告画面。警告文と詳細リンクが見える状態**
    - 差し替え先: `public/learn/shots/security/certificates-pki-02.svg`
    - キャプション: 検証に失敗したときブラウザが出す警告。これを「面倒だから」と無視する実装が証明書検証不備になる
    - 挿入位置: 「証明書検証不備と中間者攻撃」節、danger Callout の直前

### 暗号の実装ミス

記事: `/nicotech/security/crypto-pitfalls`

- [ ] **同じ画像を AES-ECB と AES-GCM で暗号化した結果を並べた比較。ECB 側は元画像の輪郭が透けて見えることが分かる（自分の検証スクリプトの出力）**
    - 差し替え先: `public/learn/shots/security/crypto-pitfalls-01.svg`
    - キャプション: ECB と GCM の比較。ECB では元画像の輪郭がそのまま残ってしまう
    - 挿入位置: 「AES-ECB は模様が透ける」Callout の直後（次の Section の直前）

### クロスサイトリクエストフォージェリ (CSRF)

記事: `/nicotech/security/csrf`

- [ ] **ブラウザ DevTools の Application タブ、Cookies 一覧。SameSite 列に Lax / Strict / None が表示され、Secure 属性も確認できる状態（自分の検証環境）**
    - 差し替え先: `public/learn/shots/security/csrf-01.svg`
    - キャプション: DevTools で自分のサイトの Cookie を確認する。SameSite が実際にどう設定されているかはここで見える
    - 挿入位置: SameSite の ComparisonTable の直後（「併用したい対策」SubSection の直前）

### 脆弱性の共通言語 — CVE / CVSS / CWE

記事: `/nicotech/security/cve-cvss-cwe`

- [ ] **NVD の CVE 詳細ページ。CVSS のスコアとベクター文字列、CWE 分類、影響を受ける製品情報が並んで表示されている画面**
    - 差し替え先: `public/learn/shots/security/cve-cvss-cwe-01.svg`
    - キャプション: NVD の CVE 詳細ページ。CWE・CVE・CVSS の三つが一画面に並んで表示される
    - 挿入位置: 「CVSS — 深刻度スコア」節、ベクター文字列の説明の直後（danger Callout の直前）

### CVE ライフサイクルと責任ある開示

記事: `/nicotech/security/cve-disclosure`

- [ ] **自分の GitHub リポジトリの Security タブにある Report a vulnerability（非公開の脆弱性報告）の入力画面**
    - 差し替え先: `public/learn/shots/security/cve-disclosure-01.svg`
    - キャプション: GitHub の私的脆弱性報告フォーム。OSS ならここが最も摩擦の少ない入口になる
    - 挿入位置: 「報告窓口の探し方」の StepFlow の直後（info Callout の直前）

### 多層防御と攻撃ライフサイクル

記事: `/nicotech/security/defense-in-depth`

- [ ] **MITRE ATT&CK Enterprise マトリクスの公開サイト。戦術が列、技術が行として並んだ一覧画面**
    - 差し替え先: `public/learn/shots/security/defense-in-depth-01.svg`
    - キャプション: MITRE ATT&CK のマトリクス。攻撃ライフサイクルの各段に具体的な技術がひもづいている
    - 挿入位置: 「MITRE ATT&CK — 攻撃の共通言語」SubSection の説明段落の直後

### DevSecOps とシフトレフト

記事: `/nicotech/security/devsecops`

- [ ] **自分の GitHub リポジトリの Dependabot alerts 画面。依存パッケージの既知脆弱性が深刻度付きで一覧表示されている状態**
    - 差し替え先: `public/learn/shots/security/devsecops-01.svg`
    - キャプション: SCA の実際の見え方。依存に潜む既知脆弱性がリポジトリ上でそのまま通知される
    - 挿入位置: 「4 種類のチェックの役割分担」KVList の直後（tip Callout の直前）

### EDR とエンドポイント防御

記事: `/nicotech/security/edr-endpoint`

- [ ] **EDR コンソールの検知詳細画面。プロセス系統樹（親子プロセスのツリー）とコマンドライン、ATT&CK の技術 ID が表示されている状態（検証環境またはベンダー公開のデモ画面）**
    - 差し替え先: `public/learn/shots/security/edr-endpoint-01.svg`
    - キャプション: EDR の調査画面。プロセス系統樹で「どこから入り何をしたか」を再構成する
    - 挿入位置: 「EDR の仕組み」節の KVList 直後（MITRE ATT&CK マッピングの SubSection 直前）

### ファジング

記事: `/nicotech/security/fuzzing`

- [ ] **自分の検証環境で AFL++ を実行中のステータス画面。実行速度、発見したパス数、クラッシュ件数のカウンタが並ぶターミナル表示**
    - 差し替え先: `public/learn/shots/security/fuzzing-01.svg`
    - キャプション: AFL++ の実行画面。カバレッジが広がりクラッシュが積み上がる様子がリアルタイムに見える
    - 挿入位置: ツール比較の ComparisonTable の直後（「ハーネス設計が成果を左右する」Section の直前）

### JWT の仕組みと脆弱性

記事: `/nicotech/security/jwt`

- [ ] **JWT デコーダに JWT を貼り付けた画面。header と payload の JSON が平文で読めており、署名部分だけが検証対象であることが分かる状態（自分の検証用トークン）**
    - 差し替え先: `public/learn/shots/security/jwt-01.svg`
    - キャプション: デコーダに貼るだけで中身が読める。JWS の Payload は暗号化されていないことが一目で分かる
    - 挿入位置: 「構造 — header.payload.signature」節の KVList 直後（Payload は暗号化されていない Callout の直前）

### 悪用状況を測る — KEV・EPSS・GHSA

記事: `/nicotech/security/kev-epss-ghsa`

- [ ] **CISA の KEV（Known Exploited Vulnerabilities）カタログの公開ページ。CVE ID、製品名、追加日、是正期限が並んだ一覧**
    - 差し替え先: `public/learn/shots/security/kev-epss-ghsa-01.svg`
    - キャプション: KEV カタログの実物。是正期限まで明記されているのが特徴
    - 挿入位置: 「KEV」節、掲載条件の KVList 直後（warn Callout の直前）

### ログ・SIEM・SOC

記事: `/nicotech/security/logging-siem-soc`

- [ ] **OSS の SIEM（自分の検証環境）のダッシュボード。ログイン失敗の多発から成功、権限昇格までを時系列で並べた相関アラートの詳細画面**
    - 差し替え先: `public/learn/shots/security/logging-siem-soc-01.svg`
    - キャプション: SIEM の相関アラート。バラバラのログが 1 本の攻撃シナリオとして並ぶ
    - 挿入位置: 「相関分析の実例」の説明段落の直後（「SIEM と SOAR は相補的」Section の直前）

### OAuth 2.0 — 認可の委譲

記事: `/nicotech/security/oauth2`

- [ ] **自分の検証用アプリで表示させた OAuth の同意画面。要求されているスコープの一覧と、許可・拒否のボタンが見える状態**
    - 差し替え先: `public/learn/shots/security/oauth2-01.svg`
    - キャプション: 同意画面はフローの第 2 ステップそのもの。ここで表示されるスコープが委譲される権限の範囲になる
    - 挿入位置: 認可コードグラントの SequenceDiagram の直後（「そのほかのグラントタイプ」Section の直前）

### OWASP Top 10 入門 — Web の代表的な脆弱性

記事: `/nicotech/security/owasp-top10`

- [ ] **owasp.org の OWASP Top 10 (2021) 公式ページ。10 カテゴリの一覧が見える状態**
    - 差し替え先: `public/learn/shots/security/owasp-top10-01.svg`
    - キャプション: 一次情報は owasp.org。順位や分類は改訂で動くので、必ず公式ページで最新版を確認する
    - 挿入位置: 「10 カテゴリの全体像」の LayerStack 直後、深掘り対応表の前

### パスワードと多要素認証（MFA）

記事: `/nicotech/security/passwords-mfa`

- [ ] **自分の検証アカウントで認証アプリ(TOTP)を登録する画面。QR コードと確認コード入力欄**
    - 差し替え先: `public/learn/shots/security/passwords-mfa-01.svg`
    - キャプション: TOTP の登録画面。QR コードで共有鍵を認証アプリに渡し、生成された 6 桁コードで登録を確定する
    - 挿入位置: 「MFA 手法とその強度」の比較表の後、「なぜ SMS は格下げされたのか」の直前
- [ ] **ブラウザのパスキー(WebAuthn)登録ダイアログ。生体認証を求める OS のプロンプト**
    - 差し替え先: `public/learn/shots/security/passwords-mfa-02.svg`
    - キャプション: パスキー登録時のダイアログ。鍵の生成と署名は端末側で完結し、秘密鍵はブラウザにもサーバにも渡らない
    - 挿入位置: FIDO2/WebAuthn 節の仕組み説明の後、「パスキーはパスワードの置き換えを目指す」Callout の直前

### 脆弱性診断とペネトレーションテスト

記事: `/nicotech/security/pentest`

- [ ] **ローカル Docker で起動した OWASP Juice Shop のトップ画面(学習用の演習環境)**
    - 差し替え先: `public/learn/shots/security/pentest-01.svg`
    - キャプション: 学習は自分の手元に立てた演習環境で。OWASP Juice Shop は意図的に脆弱な練習用アプリ
    - 挿入位置: 「許可なきテストは違法」Callout の後、Bridge の直前

### SAML とシングルサインオン（SSO）

記事: `/nicotech/security/saml-sso`

- [ ] **自分の検証 IdP テナントで SAML アプリの設定画面。SSO URL・エンティティ ID・署名証明書の項目**
    - 差し替え先: `public/learn/shots/security/saml-sso-01.svg`
    - キャプション: IdP 側の SAML アプリ設定。SSO URL・エンティティ ID・署名証明書を SP と交換して信頼関係を結ぶ
    - 挿入位置: 「仕様は層に分かれている」Callout の後、「Web ブラウザ SSO の流れ」の直前

### SAST と DAST — 静的解析と動的解析

記事: `/nicotech/security/sast-dast`

- [ ] **自分のリポジトリの CI で SAST(CodeQL または Semgrep)のアラート一覧が表示された画面**
    - 差し替え先: `public/learn/shots/security/sast-dast-01.svg`
    - キャプション: SAST は CI に組み込むと、コミット単位で該当ファイルと行番号つきのアラートが返る
    - 挿入位置: SAST 節の CodeQL/Semgrep 紹介の後、「SAST は誤検知が多い」Callout の直前
- [ ] **自分の検証環境に対する OWASP ZAP のスキャン結果画面。アラートのツリーと詳細**
    - 差し替え先: `public/learn/shots/security/sast-dast-02.svg`
    - キャプション: DAST は外から投げたリクエストと応答を根拠にアラートを出す。原因のコード行までは示さない
    - 挿入位置: DAST 節の ZAP/Burp 紹介の後、「DAST の最大のリスクはスコープ事故」Callout の直前

### セキュリティヘッダと TLS ハードニング

記事: `/nicotech/security/security-headers`

- [ ] **DevTools の Network タブでレスポンスヘッダを開き、セキュリティヘッダが並んでいる状態**
    - 差し替え先: `public/learn/shots/security/security-headers-01.svg`
    - キャプション: 実際に何が返っているかは DevTools の Network タブで確認できる。まず現状のヘッダを見るところから始める
    - 挿入位置: 「主要なセキュリティヘッダ一覧」の比較表の後、X-XSS-Protection の Callout の直前
- [ ] **自分のサイトで CSP Report-Only を有効にし、DevTools Console に違反が出ている画面**
    - 差し替え先: `public/learn/shots/security/security-headers-02.svg`
    - キャプション: Report-Only 中は違反が Console に出るだけでブロックされない。ここで正規リソースを洗い出してポリシーへ反映する
    - 挿入位置: CSP 段階移行の Report-Only コード例の後、'unsafe-inline' の Callout の直前
- [ ] **securityheaders.com で自分のサイトを計測したレポート画面。評価と各ヘッダの有無**
    - 差し替え先: `public/learn/shots/security/security-headers-03.svg`
    - キャプション: 外部の計測サービスでベースラインを取り、設定変更のたびに再計測して差分を確かめる
    - 挿入位置: TLS ハードニング節の KVList の後、「計測 → 設定 → 再計測を反復する」Callout の直前

### セッション管理と攻撃

記事: `/nicotech/security/session-management`

- [ ] **DevTools の Application タブの Cookies 一覧。HttpOnly・Secure・SameSite の列が見える状態**
    - 差し替え先: `public/learn/shots/security/session-management-01.svg`
    - キャプション: 属性が実際に効いているかは DevTools の Cookies 一覧で確認できる。チェックが抜けている列がそのまま弱点になる
    - 挿入位置: Set-Cookie のコード例の後、「__Host- プレフィックスも有効」Callout の直前

### サプライチェーン攻撃

記事: `/nicotech/security/supply-chain`

- [ ] **自分の GitHub リポジトリの Dependabot alerts 画面。依存パッケージの脆弱性一覧**
    - 差し替え先: `public/learn/shots/security/supply-chain-01.svg`
    - キャプション: SCA の身近な例。依存グラフを既知脆弱性データベースと突き合わせ、危険な依存を継続的に知らせてくれる
    - 挿入位置: 「SBOM と SCA が土台になる理由」の後、「ゼロトラストの発想を供給網にも」Callout の直前

### 脅威モデリング — STRIDE

記事: `/nicotech/security/threat-modeling`

- [ ] **Microsoft Threat Modeling Tool で DFD を描き、トラストバウンダリを引いた画面**
    - 差し替え先: `public/learn/shots/security/threat-modeling-01.svg`
    - キャプション: 専用ツールで DFD を描くと、トラストバウンダリをまたぐ要素から STRIDE 脅威が自動で列挙される
    - 挿入位置: 「DFD とトラストバウンダリ」節の説明の後、「境界を越えるデータは疑う」Callout の直前

### TLS/SSL — 通信の暗号化

記事: `/nicotech/security/tls`

- [ ] **ブラウザのアドレスバーの鍵アイコンから開いた証明書情報。発行者・有効期限・SAN**
    - 差し替え先: `public/learn/shots/security/tls-01.svg`
    - キャプション: 鍵アイコンから証明書を開くと、ハンドシェイクでサーバが提示した証明書の中身をそのまま確認できる
    - 挿入位置: 「TLS/SSL とは」節の KVList の後、「TLS ハンドシェイク」節の直前
- [ ] **自分の検証サーバに testssl.sh を実行したターミナル出力。対応プロトコルと暗号スイート**
    - 差し替え先: `public/learn/shots/security/tls-02.svg`
    - キャプション: 実測すると、有効なプロトコルと暗号スイートが一覧で出る。古い TLS や弱い暗号が残っていないかをここで確かめる
    - 挿入位置: 「設定は実測で確かめる」Callout の後、Bridge の直前

### 脆弱性管理とトリアージ

記事: `/nicotech/security/vuln-management`

- [ ] **CISA の KEV(Known Exploited Vulnerabilities)カタログの Web 画面。CVE の一覧と期限**
    - 差し替え先: `public/learn/shots/security/vuln-management-01.svg`
    - キャプション: KEV カタログは公開されている。実悪用が確認された CVE と是正期限が一覧で参照できる
    - 挿入位置: トリアージ節の KEV/EPSS/CVSS の KVList の後、「KEV に無い = 安全ではない」Callout の直前

### ゼロトラスト

記事: `/nicotech/security/zero-trust`

- [ ] **自分の検証テナントの管理コンソールで条件付きアクセスポリシーを設定する画面**
    - 差し替え先: `public/learn/shots/security/zero-trust-01.svg`
    - キャプション: 条件付きアクセスは PDP の実体。利用者・デバイス・場所などの条件と、許可/ブロックの制御を画面上で組み立てる
    - 挿入位置: 「関連技術と成熟度モデル」の KVList の後、CISA 5 本柱の SubSection の直前

## 開発基礎（`dev`）— 4 枚

### Git と GitHub とは

記事: `/nicotech/dev/git-and-github`

- [ ] **git log --oneline --graph --all の実行結果。分岐と合流の枝が描かれたターミナル**
    - 差し替え先: `public/learn/shots/dev/git-and-github-01.svg`
    - キャプション: 左端に描かれる線がそのまま DAG の形。枝分かれと、マージで合流する点が目で追える。
    - 挿入位置: 「コミット履歴は DAG」節、説明段落と離散数学の Bridge の間
- [ ] **GitHub の Pull Request 画面。Files changed の差分とレビューコメントが見える状態**
    - 差し替え先: `public/learn/shots/dev/git-and-github-02.svg`
    - キャプション: Pull Request の画面。差分・レビューコメント・CI の結果が1か所に集まるのが GitHub の中心的な価値。
    - 挿入位置: 「GitHub の主な機能」節、機能リストの直後

### コンフリクト発生時の対処方法

記事: `/nicotech/dev/resolving-merge-conflicts`

- [ ] **コンフリクト後の git status。Unmerged paths に both modified が並んだターミナル**
    - 差し替え先: `public/learn/shots/dev/resolving-merge-conflicts-01.svg`
    - キャプション: まず git status。Unmerged paths に出ているファイルが、手で直すべき対象のすべて。
    - 挿入位置: 「解決の手順」節、マージ解決コマンドの Code ブロックの直後
- [ ] **VS Code のマージエディタ。Current / Incoming / Result の3ペインが並んだ画面**
    - 差し替え先: `public/learn/shots/dev/resolving-merge-conflicts-02.svg`
    - キャプション: VS Code のマージエディタ。自分側・相手側を見比べながら、下の Result に最終形を組み立てられる。
    - 挿入位置: 「やり直し・便利な道具」節、道具の KVList と締めの段落の間

## Claude Code基礎（`claude-code`）— 17 枚

### 1. Claude Code とは

記事: `/nicotech/claude-code/claude-code-01-what-is`

- [ ] **ターミナルで claude を起動した直後の REPL 画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-01-what-is-01.svg`
    - キャプション: Claude Code はターミナルの中で動く。起動するとこの対話画面（REPL）が立ち上がる
    - 挿入位置: 1章「Claude Code とは」ブラウザ版との比較表の直後

### 2. インストール ─ 環境をセットアップする

記事: `/nicotech/claude-code/claude-code-02-install`

- [ ] **claude --version を実行しバージョンが表示された画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-02-install-01.svg`
    - キャプション: この形でバージョン番号が表示されればインストール成功
    - 挿入位置: 2章「動作確認」claude --version の説明文の直後
- [ ] **初回起動時のログイン方法の選択画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-02-install-02.svg`
    - キャプション: 初回起動時のログイン方法の選択。契約しているアカウントの種類に合わせて選ぶ
    - 挿入位置: 3章「ログイン」ログイン手順の説明段落の直後
- [ ] **claude doctor の診断結果が一覧表示された画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-02-install-03.svg`
    - キャプション: claude doctor の出力。認証状態・PATH・設定・MCP サーバーの状態がまとめて確認できる
    - 挿入位置: 6章「課題」課題1のコードブロックの直後

### 3. 基本的な使い方 ─ 日常のワークフローを身につける

記事: `/nicotech/claude-code/claude-code-03-basics`

- [ ] **Shift+Tab で権限モードが切り替わり画面隅にモード名が出た状態**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-03-basics-01.svg`
    - キャプション: 今どのモードなのかは画面の隅に出る。Shift+Tab を押すたびにここの表示が変わる
    - 挿入位置: 2章「権限モード」3モードの比較表の直後
- [ ] **スラッシュを押したときのコマンド候補一覧**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-03-basics-02.svg`
    - キャプション: スラッシュを押すと候補が一覧で出る。覚えていなくてもここから探せる
    - 挿入位置: 4章「スラッシュコマンドとTab補完」コマンド一覧表の直後
- [ ] **/rewind の巻き戻しポイント選択画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-03-basics-03.svg`
    - キャプション: /rewind はどの時点まで戻すかをリストから選べる
    - 挿入位置: 3章「チェックポイントと巻き戻し」/rewind の出力例コードブロックの直後

### 4. プロンプトとセッション管理 ─ Claudeとうまく会話する

記事: `/nicotech/claude-code/claude-code-04-prompt-session`

- [ ] **claude --resume の過去セッション一覧の選択画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-04-prompt-session-01.svg`
    - キャプション: claude --resume の一覧。日時と冒頭のやりとりを手がかりに、戻りたいセッションを選ぶ
    - 挿入位置: 3章「セッションは一時的」再開方法の比較表の直後
- [ ] **/context のコンテキスト使用状況の表示**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-04-prompt-session-02.svg`
    - キャプション: /context の表示。何がどれだけ容量を使っているかが内訳で分かる
    - 挿入位置: 4章「コンテキストウィンドウの仕組み」コマンド比較表の直後

### 5. CLAUDE.md と Plan モード ─ Claudeに記憶と計画力を持たせる

記事: `/nicotech/claude-code/claude-code-05-claude-md-plan`

- [ ] **/init を実行して CLAUDE.md の雛形が生成された画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-05-claude-md-plan-01.svg`
    - キャプション: /init はプロジェクトを読んだうえで CLAUDE.md の雛形を書いてくれる
    - 挿入位置: 3章「CLAUDE.md を書いてみる」/init の説明段落の直後
- [ ] **Plan モードで計画が提示され承認を求められている画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-05-claude-md-plan-02.svg`
    - キャプション: Plan モードでは、この承認プロンプトが出るまで一切ファイルが変更されない
    - 挿入位置: 5章「Plan モード」使用感のコードブロックの直後

### 6. Subagents と Skills ─ Claudeを専門特化させる

記事: `/nicotech/claude-code/claude-code-06-subagents-skills`

- [ ] **/agents の Subagent 作成メニュー画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-06-subagents-skills-01.svg`
    - キャプション: /agents のメニュー。既存の Subagent の確認と、新規作成をここから行う
    - 挿入位置: 2章「カスタム Subagent を作る」/agents の説明段落の直後
- [ ] **自作 Skill が呼び出されて動いている画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-06-subagents-skills-02.svg`
    - キャプション: Skill が呼び出されると、その名前が画面に出る。定義したとおりの手順で動いているか確認する
    - 挿入位置: 8章「課題」課題2の commit-message Skill 確認手順の直後

### 7. MCP と Hooks ─ 外部連携と自動化

記事: `/nicotech/claude-code/claude-code-07-mcp-hooks`

- [ ] **/mcp で MCP サーバーの接続状態が一覧表示された画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-07-mcp-hooks-01.svg`
    - キャプション: /mcp の一覧。どのサーバーが接続済みか、認証が通っているかがここで分かる
    - 挿入位置: 2章「MCP とは」MCP サーバー追加・確認コードブロックの直後
- [ ] **cat ~/.claude-edit.log で Hook のログが溜まっている画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-07-mcp-hooks-02.svg`
    - キャプション: 編集のたびに1行ずつ追記されていれば、Hook は正しく発火している
    - 挿入位置: 9章「課題」課題3のログ確認手順の直後

### 8. Plugins と Git Worktree ─ チーム開発と並列実行

記事: `/nicotech/claude-code/claude-code-08-plugins-worktree`

- [ ] **git worktree list の出力（worktree が2つ並ぶ）**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-08-plugins-worktree-01.svg`
    - キャプション: git worktree list の出力。パスとブランチが別々に並んでいれば分離できている
    - 挿入位置: 4章「Git Worktree の基本操作」一覧・削除コードブロックの直後
- [ ] **2つのターミナルを並べた Writer と Reviewer の作業画面**
    - 差し替え先: `public/learn/shots/claude-code/claude-code-08-plugins-worktree-02.svg`
    - キャプション: Writer と Reviewer を左右に並べる。別 worktree なので互いのファイルを壊さない
    - 挿入位置: 5章「実践パターン: Writer / Reviewer」フィードバック手順の直後

## 競技プログラミング（`kyopro`）— 2 枚

### Python 競プロチートシート

記事: `/nicotech/kyopro/python-paiza-cheatsheet`

- [ ] **paiza の問題ページで自分のコードを実行し、入力例1に対する出力と期待される出力が並んで表示されている画面**
    - 差し替え先: `public/learn/shots/kyopro/python-paiza-cheatsheet-01.svg`
    - キャプション: 入力例1で実行し、自分の出力と期待される出力を並べて突き合わせる
    - 挿入位置: 15. デバッグの型 — 「提出前に必ず入力例1で検算する」の直後
- [ ] **実行時に Traceback が出た画面。エラーの型名・メッセージ・何行目かが表示されている部分がわかるように**
    - 差し替え先: `public/learn/shots/kyopro/python-paiza-cheatsheet-02.svg`
    - キャプション: 実行環境に出る Traceback。最終行の「型名: メッセージ」と、その上の行番号だけ見れば原因はほぼ絞れる
    - 挿入位置: 14. エラーメッセージの読み方 — 見出し直後、エラー一覧表の直前

## 技術スタック一覧（`stack`）— 23 枚

### AIエージェント開発の技術スタック

記事: `/nicotech/stack/ai-agent-stack`

- [ ] **LangSmith のトレース画面。1リクエストの思考・ツール呼び出しの各ステップと所要時間・コストが並ぶ様子**
    - 差し替え先: `public/learn/shots/stack/ai-agent-stack-01.svg`
    - キャプション: トレースを見ると、エージェントが「何を考え、どの道具をいつ呼んだか」が1ステップずつ追える
    - 挿入位置: 「記憶・評価・監視」節の比較表の直後

### 認証・認可の技術スタック

記事: `/nicotech/stack/auth-stack`

- [ ] **Clerk の埋め込みサインイン UI。メール入力欄と Google ログインボタンが並んだ既製コンポーネント**
    - 差し替え先: `public/learn/shots/stack/auth-stack-01.svg`
    - キャプション: 「UI コンポーネント込み」とは、このログイン画面ごと配置できるということ
    - 挿入位置: 「認証プラットフォーム / ライブラリ」節の比較表の直後（選び方 Callout の前）

### BaaS / ヘッドレスCMS の技術スタック

記事: `/nicotech/stack/baas-cms-stack`

- [ ] **Supabase ダッシュボードの Table Editor。Postgres のテーブルを表形式で編集している画面**
    - 差し替え先: `public/learn/shots/stack/baas-cms-stack-01.svg`
    - キャプション: BaaS ではブラウザの管理画面から直接テーブルを作り、データを覗ける
    - 挿入位置: 「BaaS」節の比較表の直後（Supabase の Callout の前）
- [ ] **microCMS の管理画面。API スキーマで定義した項目に沿って記事コンテンツを入力している様子**
    - 差し替え先: `public/learn/shots/stack/baas-cms-stack-02.svg`
    - キャプション: ヘッドレス CMS の管理画面。ここで入れた内容が API 経由でフロントに届く
    - 挿入位置: 「ヘッドレス CMS」節の比較表の直後

### バックエンドの技術スタック

記事: `/nicotech/stack/backend-stack`

- [ ] **Swagger UI (OpenAPI) の画面。エンドポイント一覧を展開し Try it out で API を実行した結果**
    - 差し替え先: `public/learn/shots/stack/backend-stack-01.svg`
    - キャプション: OpenAPI で書いた仕様は、こうしてブラウザで読めて試せる形になる
    - 挿入位置: 「周辺スタック」節の比較表の直後（OpenAPI 行の受け）

### CI/CD・IaC の技術スタック

記事: `/nicotech/stack/cicd-stack`

- [ ] **GitHub Actions のワークフロー実行画面。ジョブが緑のチェックで並び、ステップのログを展開した様子**
    - 差し替え先: `public/learn/shots/stack/cicd-stack-01.svg`
    - キャプション: push するたびにこの画面でテストとデプロイが自動で流れていく
    - 挿入位置: 「CI/CD」節の比較表の直後（まず GitHub Actions の Callout の前）

### クラウドの技術スタック

記事: `/nicotech/stack/cloud-stack`

- [ ] **AWS マネジメントコンソールのトップ画面。サービス検索と EC2 などのサービス一覧が見える状態**
    - 差し替え先: `public/learn/shots/stack/cloud-stack-01.svg`
    - キャプション: 表に並ぶサービス名は、実際にはこうしたコンソールから選んで使う
    - 挿入位置: 「三大クラウドの対応表」の直後

### Docker / コンテナの技術スタック

記事: `/nicotech/stack/container-stack`

- [ ] **docker compose up 後のコンテナ一覧 (docker compose ps)。nginx・アプリ・postgres・redis が同時に動いている様子**
    - 差し替え先: `public/learn/shots/stack/container-stack-01.svg`
    - キャプション: コマンド一発で、入口・アプリ・DB・キャッシュが揃って立ち上がる
    - 挿入位置: 「典型的な構成イメージ」節のリスト直後

### データ分析 / データ基盤の技術スタック

記事: `/nicotech/stack/data-analytics-stack`

- [ ] **BigQuery コンソールのクエリエディタ。SQL を実行し大量データの集計結果とスキャン量が表示された画面**
    - 差し替え先: `public/learn/shots/stack/data-analytics-stack-01.svg`
    - キャプション: DWH の操作は基本的に SQL。巨大なデータでも数秒で集計結果が返る
    - 挿入位置: 「データウェアハウス（DWH）」節の比較表の直後
- [ ] **Metabase のダッシュボード画面。グラフと数値カードを並べた BI ダッシュボード**
    - 差し替え先: `public/learn/shots/stack/data-analytics-stack-02.svg`
    - キャプション: 整えたデータの最終的な出口が、こうした BI ダッシュボード
    - 挿入位置: 「変換 と BI」節の比較表の直後

### 開発ツール / バージョン管理の技術スタック

記事: `/nicotech/stack/devtools-stack`

- [ ] **GitHub のプルリクエスト画面。差分 (Files changed) とレビューコメント、CI のチェック結果が並ぶ様子**
    - 差し替え先: `public/learn/shots/stack/devtools-stack-01.svg`
    - キャプション: 協業の中心はこの画面。差分・レビュー・自動テストが1か所に集まる
    - 挿入位置: 「バージョン管理とホスティング」節の比較表の直後
- [ ] **VS Code のエディタ画面。左に拡張機能パネル、コードに ESLint の警告が波線で表示されている状態**
    - 差し替え先: `public/learn/shots/stack/devtools-stack-02.svg`
    - キャプション: エディタと拡張機能が組み合わさると、書いている最中に問題が指摘される
    - 挿入位置: 「エディタ / IDE」節の比較表の直後

### 拡張機能開発の技術スタック

記事: `/nicotech/stack/extension-stack`

- [ ] **Chrome の chrome://extensions 画面。デベロッパーモードを ON にして未パッケージの拡張機能を読み込んだ状態**
    - 差し替え先: `public/learn/shots/stack/extension-stack-01.svg`
    - キャプション: 開発中の拡張は、この画面からフォルダを指定して読み込んで動かす
    - 挿入位置: 「ブラウザ拡張の構成要素」節の比較表の直後（権限 Callout の前）

### ゲーム開発の技術スタック

記事: `/nicotech/stack/game-stack`

- [ ] **Unity エディタの画面。シーンビュー・ヒエラルキー・インスペクターが並ぶ標準レイアウト**
    - 差し替え先: `public/learn/shots/stack/game-stack-01.svg`
    - キャプション: ゲームエンジンは「コードを書く道具」というより、この統合開発環境そのもの
    - 挿入位置: 「3大ゲームエンジン」節の比較表の直後（得意分野で選ぶ Callout の前）

### 3D / グラフィックスの技術スタック

記事: `/nicotech/stack/graphics-stack`

- [ ] **Three.js 公式サンプルの表示結果。ブラウザ上で 3D モデルが描画され、マウスで視点を回せる様子**
    - 差し替え先: `public/learn/shots/stack/graphics-stack-01.svg`
    - キャプション: ライブラリを使うと、この程度の 3D 表現がブラウザだけで動く
    - 挿入位置: 「低レベル API とライブラリ」節の比較表の直後（まずは Three.js の Callout の前）

### ホスティング / デプロイ先の技術スタック

記事: `/nicotech/stack/hosting-stack`

- [ ] **Vercel のプロジェクト画面。git push ごとのデプロイ履歴とプレビュー URL が並ぶダッシュボード**
    - 差し替え先: `public/learn/shots/stack/hosting-stack-01.svg`
    - キャプション: 「git push で自動デプロイ」の実体は、この履歴が1件ずつ増えていくこと
    - 挿入位置: 「フロントエンド向き（Jamstack / エッジ）」節の比較表の直後

### 機械学習のための技術スタック

記事: `/nicotech/stack/machine-learning-stack`

- [ ] **MLflow の実験一覧画面。ハイパーパラメータと精度を run ごとに並べて比較している様子**
    - 差し替え先: `public/learn/shots/stack/machine-learning-stack-01.svg`
    - キャプション: 実験管理ツールを入れると、試した条件と結果が自動で1つの表に積み上がる
    - 挿入位置: 「実験管理と MLOps」節の比較表の直後

### モバイルアプリケーション開発の技術スタック

記事: `/nicotech/stack/mobile-app-stack`

- [ ] **App Store Connect のアプリ提出画面。ビルドのアップロードと審査ステータスが表示された状態**
    - 差し替え先: `public/learn/shots/stack/mobile-app-stack-01.svg`
    - キャプション: コードが完成した後に待つのがこの工程。審査を通って初めてユーザーに届く
    - 挿入位置: 「選び方の指針」リストの直後（配信・審査 Callout の前）

### 監視・可観測性の技術スタック

記事: `/nicotech/stack/observability-stack`

- [ ] **Grafana のダッシュボード。Prometheus のメトリクスを折れ線グラフで並べた監視画面**
    - 差し替え先: `public/learn/shots/stack/observability-stack-01.svg`
    - キャプション: メトリクスを見るとは、実際にはこうしたグラフの壁を眺めること
    - 挿入位置: 「代表ツール」節の比較表の直後
- [ ] **Sentry のエラー詳細画面。スタックトレースと発生回数・影響ユーザー数が表示された様子**
    - 差し替え先: `public/learn/shots/stack/observability-stack-02.svg`
    - キャプション: エラー追跡ツールは「どのコード行で・何人に」起きたかまで教えてくれる
    - 挿入位置: 「代表ツール」節の Grafana 図の直後

### 決済の技術スタック

記事: `/nicotech/stack/payment-stack`

- [ ] **Stripe ダッシュボードの支払い一覧画面。決済のステータスとサブスクリプションが並ぶ状態**
    - 差し替え先: `public/learn/shots/stack/payment-stack-01.svg`
    - キャプション: 決済サービスに任せると、入金・返金・サブスクの管理までこの画面で完結する
    - 挿入位置: 「代表的な決済サービス」節の比較表の直後

### テストの技術スタック

記事: `/nicotech/stack/testing-stack`

- [ ] **Playwright のテスト実行レポート (HTML reporter)。失敗したテストのスクリーンショットとトレースが見える画面**
    - 差し替え先: `public/learn/shots/stack/testing-stack-01.svg`
    - キャプション: E2E が落ちたとき、レポートには「どの画面で止まったか」が画像で残る
    - 挿入位置: 「言語圏ごとの定番」節の比較表の直後（Vitest の Callout の前）
- [ ] **Storybook の画面。左のサイドバーで選んだ UI コンポーネントが単体で表示されている様子**
    - 差し替え先: `public/learn/shots/stack/testing-stack-02.svg`
    - キャプション: アプリを起動しなくても、部品ごとに見た目と振る舞いを確認できる
    - 挿入位置: 「UI コンポーネント開発」節の説明文の直後

## React実践開発（`react-practice`）— 10 枚

### 作るアプリと Vite プロジェクトの作成

記事: `/nicotech/react-practice/app-and-vite-setup`

- [ ] **npm create vite@latest をテンプレート未指定で実行したときの対話画面。Framework で React、Variant で TypeScript を矢印キーで選ぶところ**
    - 差し替え先: `public/learn/shots/react-practice/app-and-vite-setup-01.svg`
    - キャプション: テンプレートを省くと対話で聞かれる。Framework は React、Variant は TypeScript を選ぶ
    - 挿入位置: 「手順1 — プロジェクトを生成する」の Callout「対話形式で聞かれたとき」の直後
- [ ] **npm run dev 後に http://localhost:5173 を開いた Vite + React の初期画面。ロゴと count is 0 ボタンが見える状態**
    - 差し替え先: `public/learn/shots/react-practice/app-and-vite-setup-02.svg`
    - キャプション: この初期画面が出れば成功。ボタンを押すと数字が増える
    - 挿入位置: 「手順3 — 開発サーバーを起動する」で初期画面を説明する段落の直後

### コンポーネント設計と管理

記事: `/nicotech/react-practice/component-design`

- [ ] **TaskListPage をブラウザで表示した画面。2件のタスクが並び、片方のチェックボックスが完了になっている状態**
    - 差し替え先: `public/learn/shots/react-practice/component-design-01.svg`
    - キャプション: 親（TaskListPage）が状態を持ち、子（TaskItem）が表示する。チェックすると親の toggle が呼ばれる
    - 挿入位置: 「親コンポーネント — 一覧画面」のコードブロック直後

### CRUD — データ操作の4つの基本

記事: `/nicotech/react-practice/crud-basics`

- [ ] **DevTools の Network タブ。追加・完了切替・削除の操作で POST / PATCH / DELETE のリクエストとステータスが並んだ状態**
    - 差し替え先: `public/learn/shots/react-practice/crud-basics-01.svg`
    - キャプション: Network タブを開いて操作すると、CRUD がそのままメソッドとして飛んでいるのが見える
    - 挿入位置: 「UI とつなぐ」の onAdd/onToggle/onDelete コードブロック直後

### Google のタスクと連携する（OAuth・CRUD）

記事: `/nicotech/react-practice/google-calendar-api`

- [ ] **Google Cloud Console のライブラリ画面で Google Tasks API を有効化するところ（有効にするボタンが見える状態）**
    - 差し替え先: `public/learn/shots/react-practice/google-calendar-api-01.svg`
    - キャプション: 手順1: ライブラリから Google Tasks API を探し、有効化する
    - 挿入位置: 「準備 — OAuth クライアント ID とスコープ」の Steps 直後
- [ ] **OAuth 2.0 クライアント ID の作成画面。承認済みの JavaScript 生成元に http://localhost:5173 を入力した状態**
    - 差し替え先: `public/learn/shots/react-practice/google-calendar-api-02.svg`
    - キャプション: 手順2: 承認済みの JavaScript 生成元に開発サーバーの URL を登録する。ここが抜けると認可が弾かれる
    - 挿入位置: 「準備 — OAuth クライアント ID とスコープ」の Steps 直後（01 の次）
- [ ] **Google と連携ボタンを押したときに出る Google の同意ダイアログ。タスクの表示と編集の権限を求めている画面**
    - 差し替え先: `public/learn/shots/react-practice/google-calendar-api-03.svg`
    - キャプション: 連携ボタンを押すと、要求した scope の内容がこの同意ダイアログに提示される
    - 挿入位置: 「React に組み込む」の GoogleTasksPage コードブロック直後

### React Router でルーティング（設定と原理）

記事: `/nicotech/react-practice/react-router-basics`

- [ ] **一覧画面の Link をクリックして詳細へ遷移した直後のブラウザ。アドレスバーが /tasks/1 に変わり、画面が詳細に切り替わっている**
    - 差し替え先: `public/learn/shots/react-practice/react-router-basics-01.svg`
    - キャプション: Link を押すとアドレスバーが /tasks/1 に変わり、表示だけが差し替わる（再読み込みは起きない）
    - 挿入位置: 「画面を移動する — Link」の遷移リンクのコードブロック直後
- [ ] **DevTools の Network タブ。Link で遷移しても HTML ドキュメントの再取得リクエストが発生していないことが分かる一覧**
    - 差し替え先: `public/learn/shots/react-practice/react-router-basics-02.svg`
    - キャプション: Network タブで確認すると、遷移しても HTML の再取得は発生していない ─ これが SPA の速さの正体
    - 挿入位置: 「まとめ — 遷移の流れ」の StepFlow 直後

### 状態管理 — useState・リフトアップ・Context・useReducer

記事: `/nicotech/react-practice/state-management`

- [ ] **React DevTools の Components タブで TaskProvider を選択し、右ペインに Context の値（tasks 配列）が表示されている画面**
    - 差し替え先: `public/learn/shots/react-practice/state-management-01.svg`
    - キャプション: React DevTools の Components タブなら、Provider が配っている値を目で確認できる
    - 挿入位置: 「Context で共有状態を配る」の使う側コードブロック直後

## Angular実践開発（`angular-practice`）— 9 枚

### Angular Router でルーティング（設定と原理）

記事: `/nicotech/angular-practice/angular-router-basics`

- [ ] **routerLink をクリックして詳細へ遷移した直後のブラウザ。アドレスバーが /tasks/1 に変わり router-outlet の中身だけ差し替わった状態**
    - 差し替え先: `public/learn/shots/angular-practice/angular-router-basics-01.svg`
    - キャプション: ヘッダーはそのまま、router-outlet の中身だけが差し替わる。アドレスバーは /tasks/1 に変わる
    - 挿入位置: 「画面を移動する — routerLink」の直後（ActivatedRoute 節の前）

### 作るアプリと Angular CLI でのプロジェクト作成

記事: `/nicotech/angular-practice/app-and-angular-cli-setup`

- [ ] **ng new taskflow 実行時の対話画面。Which stylesheet format のリストから CSS を矢印キーで選んでいる状態**
    - 差し替え先: `public/learn/shots/angular-practice/app-and-angular-cli-setup-01.svg`
    - キャプション: ng new は対話で聞いてくる。スタイル形式は CSS、SSR は No を選ぶ
    - 挿入位置: 「手順1 — Angular CLI を用意してプロジェクトを生成する」の対話コードブロック直後
- [ ] **ng serve 後に http://localhost:4200 を開いた Angular の初期ウェルカム画面（Hello, taskflow が表示された状態）**
    - 差し替え先: `public/learn/shots/angular-practice/app-and-angular-cli-setup-02.svg`
    - キャプション: この初期画面が出れば成功。Vite の 5173 に対し、Angular の既定は 4200
    - 挿入位置: 「手順2 — 開発サーバーを起動する」で初期画面を説明する段落の直後

### コンポーネント設計と管理

記事: `/nicotech/angular-practice/component-design`

- [ ] **TaskListComponent をブラウザで表示した画面。@for で並んだ2件のタスクと、片方が完了になったチェックボックス**
    - 差し替え先: `public/learn/shots/angular-practice/component-design-01.svg`
    - キャプション: 親（TaskList）が状態を持ち、子（TaskItem）が表示する。チェックすると @Output が親へ emit される
    - 挿入位置: 「親コンポーネント — 一覧画面（@for / @if）」のコードブロック直後（track の Callout の前）

### 依存性注入（DI）とサービス

記事: `/nicotech/angular-practice/dependency-injection`

- [ ] **Angular DevTools の Injector Tree タブ。TaskService が Root Injector に解決され、コンポーネントへ注入されている様子**
    - 差し替え先: `public/learn/shots/angular-practice/dependency-injection-01.svg`
    - キャプション: Angular DevTools の Injector Tree なら、どのサービスがどの Injector で解決されたか実物で追える
    - 挿入位置: 「DI の仕組み — Injector が型をキーに解決する（IoC）」の SequenceDiagram 後の段落直後

### HttpClient で CRUD（データ取得と API 連携）

記事: `/nicotech/angular-practice/httpclient-crud`

- [ ] **DevTools の Network タブ。GET /api/tasks と POST /api/tasks がステータス 200 / 201 で並んでいる状態**
    - 差し替え先: `public/learn/shots/angular-practice/httpclient-crud-01.svg`
    - キャプション: Network タブで実際の往復を確認する。ここに何も出ないときは購読忘れを疑う
    - 挿入位置: 「ブラウザと API の往復」の SequenceDiagram 直後

### リアクティブフォームで入力を扱う

記事: `/nicotech/angular-practice/reactive-forms`

- [ ] **タイトル欄を空のまま離れたときのフォーム画面。タイトルは必須ですのエラーが赤字で表示され、追加ボタンが無効化されている**
    - 差し替え先: `public/learn/shots/angular-practice/reactive-forms-01.svg`
    - キャプション: 入力欄に触れて離れると（touched）エラーが出て、無効な間は追加ボタンが押せない
    - 挿入位置: 「テンプレートとつなぐ」のコードブロック直後（touched の Callout の前）
- [ ] **DevTools の Console タブ。valueChanges と debounceTime により、入力が落ち着いたタイミングだけログが出ている様子**
    - 差し替え先: `public/learn/shots/angular-practice/reactive-forms-02.svg`
    - キャプション: Console で見ると、1 文字ごとではなく入力が止まってからログが出るのが分かる
    - 挿入位置: 「valueChanges は Observable」の入力監視コードブロック直後

### RxJS と Observable で状態を管理する

記事: `/nicotech/angular-practice/rxjs-and-state`

- [ ] **タスクを1件追加した直後の画面。一覧と残り件数の表示が同時に更新されている（BehaviorSubject が全購読者へ配信した結果）**
    - 差し替え先: `public/learn/shots/angular-practice/rxjs-and-state-01.svg`
    - キャプション: next() で流れた新しい配列が、一覧と派生の残り件数へ同時に届く（単一情報源からの配信）
    - 挿入位置: 「operator を少しだけ — map / filter」の派生 Observable の説明段落直後

## API実践開発（`api-practice`）— 21 枚

### SQLite データベースを構築する

記事: `/nicotech/api-practice/building-sqlite-db`

- [ ] **go run ./scripts/seed で件数が表示された画面**
    - 差し替え先: `public/learn/shots/api-practice/building-sqlite-db-01.svg`
    - キャプション: シードの実行結果。2回続けて流しても件数が変わらないことも合わせて確認する
    - 挿入位置: 「手順4 — 実行してデータを投入する」期待される出力の直後
- [ ] **sqlite3 CLI で .tables と SELECT を実行した画面**
    - 差し替え先: `public/learn/shots/api-practice/building-sqlite-db-02.svg`
    - キャプション: sqlite3 CLI で中身を直接のぞいたところ。件数と先頭数件が期待どおりか確かめる
    - 挿入位置: 「手順5 — 投入結果を確認する」sqlite3 プロンプト内で実行するコードブロックの直後

### データソースを選ぶ — SchaleDB か自前データか

記事: `/nicotech/api-practice/choosing-data-source`

- [ ] **SchaleDB の data/en/students.json をエディタで開いた画面**
    - 差し替え先: `public/learn/shots/api-practice/choosing-data-source-01.svg`
    - キャプション: 実物の students.json。1件あたりのフィールド数と、配列であることを目で確かめておく
    - 挿入位置: 「選択肢A — SchaleDB のデータを使う」リポジトリ内パスのコードブロックの直後

### database/sql で SQLite に接続する

記事: `/nicotech/api-practice/db-connection`

- [ ] **curl /characters が DB の中身を JSON で返した画面**
    - 差し替え先: `public/learn/shots/api-practice/db-connection-01.svg`
    - キャプション: ダミーではなく DB に入れた実データが返っていれば、接続と store 層の配線は成功
    - 挿入位置: 「store をサーバに繋ぐ」go run . と curl のコードブロックの直後

### エラーハンドリングとステータスコード

記事: `/nicotech/api-practice/error-handling`

- [ ] **curl -si で id=abc を叩き 400 が返った画面**
    - 差し替え先: `public/learn/shots/api-practice/error-handling-01.svg`
    - キャプション: ステータス行が 400、ボディが統一形の JSON になっているかを両方確認する
    - 挿入位置: 「curl でエラーを確かめる」400 のレスポンス例の直後
- [ ] **curl -si -X POST で 405 が返った画面**
    - 差し替え先: `public/learn/shots/api-practice/error-handling-02.svg`
    - キャプション: 自分では書いていない 405 と Allow ヘッダが返る。ルータが自動で面倒を見ている証拠
    - 挿入位置: 「curl でエラーを確かめる」405 のレスポンス例の直後

### Go 環境構築とプロジェクト設計

記事: `/nicotech/api-practice/go-setup-and-project`

- [ ] **go version を実行しバージョンが表示された画面**
    - 差し替え先: `public/learn/shots/api-practice/go-setup-and-project-01.svg`
    - キャプション: go version の実行結果。ここが 1.22 以上であることを必ず確認してから先へ進む
    - 挿入位置: 「手順0 — Go が入っているか確認する」期待される出力の直後
- [ ] **go run . で listening on :8080 が出た画面**
    - 差し替え先: `public/learn/shots/api-practice/go-setup-and-project-02.svg`
    - キャプション: この表示のまま止まって見えるのが正常。サーバはここで待ち受け続けている
    - 挿入位置: 「手順4 — 起動して curl で叩く」listening on :8080 の出力直後
- [ ] **別ターミナルで curl localhost:8080 を叩いた応答**
    - 差し替え先: `public/learn/shots/api-practice/go-setup-and-project-03.svg`
    - キャプション: 別タブから curl を叩いて応答が返れば、サーバとクライアントの往復が成立している
    - 挿入位置: 「手順4」curl の期待される出力（hello, character-api）の直後

### net/http で HTTP サーバを立てる

記事: `/nicotech/api-practice/http-server-basics`

- [ ] **左で go run . 右で curl /health を叩いた2画面**
    - 差し替え先: `public/learn/shots/api-practice/http-server-basics-01.svg`
    - キャプション: サーバ用と curl 用でターミナルを2つ使う。この形が以降ずっと基本になる
    - 挿入位置: 「まず「Hello」を返す最小サーバ」起動と curl の Steps ブロックの直後
- [ ] **curl /characters を jq で整形した JSON 配列**
    - 差し替え先: `public/learn/shots/api-practice/http-server-basics-02.svg`
    - キャプション: jq を通すと配列の構造が読みやすくなる。キー名が camelCase になっているかも確認する
    - 挿入位置: 「curl で動作確認する」Step「一覧を取得する」の出力直後
- [ ] **curl -i で存在しない id を叩き 404 が返った画面**
    - 差し替え先: `public/learn/shots/api-practice/http-server-basics-03.svg`
    - キャプション: -i を付けるとステータス行が見える。ボディだけでなくステータスまで確認する癖をつける
    - 挿入位置: 「curl で動作確認する」Step「存在しない ID とステータスを確認する」の出力直後

### 一覧取得と単一取得のエンドポイント

記事: `/nicotech/api-practice/list-and-get-endpoints`

- [ ] **curl で全件取得した JSON 一覧の先頭部分**
    - 差し替え先: `public/learn/shots/api-practice/list-and-get-endpoints-01.svg`
    - キャプション: 全件取得の実行結果。SQLite に投入したデータがそのまま JSON で出ていることを確認する
    - 挿入位置: 「curl で動作を確かめる」GET /characters のレスポンス例の直後
- [ ] **curl で id=1 を取得した単一 JSON の応答**
    - 差し替え先: `public/learn/shots/api-practice/list-and-get-endpoints-02.svg`
    - キャプション: 1 件取得は配列ではなくオブジェクトが返る。一覧との形の違いを見比べておく
    - 挿入位置: 「curl で動作を確かめる」GET /characters/1 のレスポンス例の直後

### ミドルウェアとロギング

記事: `/nicotech/api-practice/middleware-logging`

- [ ] **サーバー側に構造化 JSON ログが出力された画面**
    - 差し替え先: `public/learn/shots/api-practice/middleware-logging-01.svg`
    - キャプション: リクエストのたびに method・path・status・elapsed を含む1行が積み上がっていく
    - 挿入位置: 「main.go でチェーンを組んで適用する」サーバーのログ出力例の直後
- [ ] **curl -i のヘッダに X-Request-ID が並んだ画面**
    - 差し替え先: `public/learn/shots/api-practice/middleware-logging-02.svg`
    - キャプション: ハンドラ本体では書いていないヘッダが付いていれば、ミドルウェアが効いている
    - 挿入位置: 「main.go でチェーンを組んで適用する」curl -i のヘッダ説明段落の直後

### 検索・絞り込み（クエリパラメータ）

記事: `/nicotech/api-practice/query-and-filter`

- [ ] **school と role で絞り込んだ curl の応答**
    - 差し替え先: `public/learn/shots/api-practice/query-and-filter-01.svg`
    - キャプション: 絞り込みが効くと、指定した学校とロールのキャラだけが limit 件数分だけ返る
    - 挿入位置: 「curl で確かめる」絞り込みレスポンス（抜粋）の直後
- [ ] **インジェクションを試して空配列が返った画面**
    - 差し替え先: `public/learn/shots/api-practice/query-and-filter-02.svg`
    - キャプション: 攻撃文字列を入れても構文は壊れず、ただの「該当なし」として空配列が返る
    - 挿入位置: 「curl で確かめる」インジェクション試行のレスポンス（空配列）の直後

### テストと PostgreSQL への移行

記事: `/nicotech/api-practice/testing-and-postgres`

- [ ] **go test ./... -v が PASS した実行結果**
    - 差し替え先: `public/learn/shots/api-practice/testing-and-postgres-01.svg`
    - キャプション: サブテスト名が日本語でそのまま並ぶので、どのケースが通ったか一目で分かる
    - 挿入位置: 「httptest でハンドラを単体テストする」go test の実行結果ブロックの直後
- [ ] **docker compose ps で db が healthy になった画面**
    - 差し替え先: `public/learn/shots/api-practice/testing-and-postgres-02.svg`
    - キャプション: STATUS が healthy になるまで待つ。ここを飛ばすと Ping が失敗する
    - 挿入位置: 「Docker Compose で Postgres を起動する」docker compose up / ps の直後
- [ ] **psql で移行後の characters を SELECT した画面**
    - 差し替え先: `public/learn/shots/api-practice/testing-and-postgres-03.svg`
    - キャプション: 投入後に psql で中身を確認する。SQLite のときと同じ行が入っていれば移行成功
    - 挿入位置: 「データ移行（seed）」psql に seed.sql を流し込むコードブロックの直後


/** 技術スタック解説データ（「技術スタック一覧」コース専用）。
 *  記事中の <Tech id="..."> をクリックすると右ドロワーに表示される。
 *  各エントリは「どんな技術か / 具体的に何ができるか / どんな状況で採用されるか / 近い技術との比較」を持つ。
 *  ⚠️ バージョン断定・「最新」表記は避け、evergreen な説明にする。 */

export interface TechRelated {
  /** 比較対象の表示名 */
  name: string;
  /** 同 id があればその技術もクリックで開ける（任意） */
  id?: string;
  /** ひとことの違い・比較メモ */
  note: string;
}

export interface TechEntry {
  id: string;
  name: string;
  /** 分類ラベル（ドロワー見出しのチップ） */
  category: string;
  /** どのような技術か（1〜2文） */
  summary: string;
  /** より具体的に何ができるか */
  canDo: string[];
  /** どのような状況で採用されるか */
  whenAdopted: string[];
  /** 近しい技術の列挙と比較 */
  related: TechRelated[];
  /** 採用している有名プロダクト・企業の例（"Netflix", "Slack" 等） */
  usedBy?: string[];
  /** 本文中で name 以外に自動リンクさせたい表記ゆれ（例: "Rails", "Postgres"） */
  aliases?: string[];
  /** true の場合は自動リンクの対象から除外（短すぎ・誤検出しやすい名前など） */
  noAuto?: boolean;
}

export const TECH_STACKS: Record<string, TechEntry> = {
  // ───────── フロントエンド ─────────
  react: {
    id: "react", name: "React", category: "フロントエンド / UI ライブラリ",
    summary: "Meta 製の UI ライブラリ。コンポーネント単位で画面を組み立て、状態に応じて宣言的に再描画する。フロントエンドの事実上の標準。",
    canDo: [
      "再利用可能なコンポーネントで UI を構築する",
      "状態(state)と仮想DOMで画面を効率的に更新する",
      "豊富なライブラリ（ルーター・状態管理・UI 部品）と組み合わせる",
    ],
    whenAdopted: [
      "採用実績・求人・情報量が最多で、迷ったときの第一候補",
      "SPA・管理画面など操作の多いアプリ",
      "Next.js と組み合わせてフルスタックにも展開したいとき",
    ],
    related: [
      { name: "Vue", id: "vue", note: "学習しやすく段階導入向き。React より規約が親切" },
      { name: "Angular", id: "angular", note: "全部入りのフルフレームワーク。React は自分で組み合わせる" },
      { name: "Svelte", id: "svelte", note: "コンパイル方式でランタイムが軽い" },
    ],
    usedBy: ["Facebook", "Instagram", "Netflix", "Airbnb", "Discord"],
  },
  vue: {
    id: "vue", name: "Vue", category: "フロントエンド / UI フレームワーク",
    summary: "学習しやすさと単一ファイルコンポーネント(SFC)が特徴の UI フレームワーク。HTML に近い書き味で段階的に導入できる。",
    canDo: [
      "テンプレート・スクリプト・スタイルを1ファイルにまとめて書く",
      "リアクティブなデータバインディングで画面を更新",
      "小さく始めて徐々に大規模化する",
    ],
    whenAdopted: [
      "学習コストを抑えたいチーム・個人",
      "既存ページへの部分導入",
      "中小〜中規模アプリ",
    ],
    related: [
      { name: "React", id: "react", note: "エコシステムと実績は React が最大" },
      { name: "Nuxt", id: "nuxt", note: "Vue のメタフレームワーク（SSR 等）" },
      { name: "Svelte", id: "svelte", note: "さらに軽量。記述量が少ない" },
    ],
    usedBy: ["GitLab", "Nintendo", "Grammarly", "Alibaba"],
  },
  angular: {
    id: "angular", name: "Angular", category: "フロントエンド / フルフレームワーク",
    summary: "Google 製の『全部入り』フロントエンドフレームワーク。ルーティング・DI・フォーム・HTTP などを標準装備し、規約に沿って大規模開発できる。",
    canDo: [
      "追加ライブラリ選定なしで大規模 SPA を構築",
      "DI（依存性注入）で構造化された設計",
      "TypeScript 前提で型安全に開発",
    ],
    whenAdopted: [
      "大規模・エンタープライズ開発",
      "チームで統一された規約・構造を重視するとき",
      "長期保守を見据えた堅牢な基盤が欲しいとき",
    ],
    related: [
      { name: "React", id: "react", note: "React はライブラリで自由に組み合わせる。Angular は最初から揃う" },
      { name: "Vue", id: "vue", note: "より軽量で学習しやすい" },
    ],
    usedBy: ["Google", "Gmail", "Forbes", "Microsoft Office(Web)"],
  },
  svelte: {
    id: "svelte", name: "Svelte", category: "フロントエンド / UI フレームワーク",
    summary: "コンパイル時に素の JavaScript へ変換する UI フレームワーク。ランタイムを持たず、軽量・高速なのが特徴。",
    canDo: [
      "少ない記述量でリアクティブな UI を書く",
      "ランタイムが小さく高速なアプリを作る",
      "SvelteKit でフルスタック化する",
    ],
    whenAdopted: [
      "パフォーマンス・軽さを重視するアプリ",
      "バンドルサイズを小さくしたいとき",
    ],
    related: [
      { name: "React", id: "react", note: "実績・エコシステムは React が上" },
      { name: "SolidJS", id: "solidjs", note: "同じく高速。JSX を使う点が異なる" },
      { name: "SvelteKit", id: "sveltekit", note: "Svelte のメタフレームワーク" },
    ],
  },
  solidjs: {
    id: "solidjs", name: "SolidJS", category: "フロントエンド / UI ライブラリ",
    summary: "JSX で書けて、細粒度リアクティビティにより仮想DOMなしで高速に動作する UI ライブラリ。",
    canDo: [
      "React 風の JSX で書きつつ高いパフォーマンスを得る",
      "仮想DOMを介さず必要な箇所だけ更新",
    ],
    whenAdopted: [
      "React の書き味を保ちつつ速度を追求したいとき",
    ],
    related: [
      { name: "React", id: "react", note: "API が似るが内部は別物。Solid は再レンダリングしない" },
      { name: "Svelte", id: "svelte", note: "同じく軽量。Svelte はコンパイル方式" },
    ],
  },
  nextjs: {
    id: "nextjs", name: "Next.js", category: "フロントエンド / メタフレームワーク",
    summary: "React ベースのフルスタックフレームワーク。ページ単位で SSR/SSG/CSR を選べ、ルーティングや API まで含めてアプリを作り切れる。",
    canDo: [
      "サーバーサイドレンダリング(SSR)・静的生成(SSG)で高速・SEO 対応",
      "API ルートでバックエンド処理も同居させる",
      "画像最適化・ルーティングなどを標準機能で",
    ],
    whenAdopted: [
      "SEO・初期表示速度が重要な公開サイト",
      "React でフロントとバックをまとめて作りたいとき",
    ],
    related: [
      { name: "React", id: "react", note: "Next.js は React の上に構築される" },
      { name: "Nuxt", id: "nuxt", note: "Vue 版に相当" },
      { name: "Remix", note: "同じ React 系メタフレームワーク。Web 標準志向" },
    ],
    usedBy: ["Netflix(一部)", "TikTok", "Notion(一部)", "Hulu"],
  },
  nuxt: {
    id: "nuxt", name: "Nuxt", category: "フロントエンド / メタフレームワーク",
    summary: "Vue ベースのフルスタックフレームワーク。Next.js の Vue 版にあたり、SSR/SSG やルーティングを標準で提供する。",
    canDo: ["Vue アプリを SSR/SSG 付きで構築", "ファイルベースルーティング", "サーバー API を同居"],
    whenAdopted: ["Vue で SEO・SSR が必要なとき", "Vue でフルスタックにしたいとき"],
    related: [
      { name: "Next.js", id: "nextjs", note: "React 版に相当" },
      { name: "Vue", id: "vue", note: "Nuxt は Vue の上に構築される" },
    ],
  },
  sveltekit: {
    id: "sveltekit", name: "SvelteKit", category: "フロントエンド / メタフレームワーク",
    summary: "Svelte のメタフレームワーク。ルーティング・SSR・サーバー処理を備え、軽量なフルスタックアプリを作れる。",
    canDo: ["Svelte アプリを SSR/SSG で構築", "サーバー/クライアントを1つの枠組みで"],
    whenAdopted: ["Svelte で本格的なアプリを作りたいとき"],
    related: [
      { name: "Next.js", id: "nextjs", note: "React 版に相当" },
      { name: "Svelte", id: "svelte", note: "SvelteKit は Svelte の上に構築される" },
    ],
  },
  typescript: {
    id: "typescript", name: "TypeScript", category: "言語 / JavaScript 拡張",
    summary: "JavaScript に静的型付けを加えた言語。型により補完・エラー検出・リファクタリングの安全性が高まり、実務ではほぼ標準。",
    canDo: ["型でバグを早期に検出", "エディタ補完・リファクタリングを強化", "大規模コードを安全に保守"],
    whenAdopted: ["中〜大規模のフロント/バック開発", "チームでの共同開発"],
    related: [
      { name: "JavaScript", note: "TS はコンパイルで JS になる。型注釈が加わったもの" },
    ],
    usedBy: ["Slack", "Airbnb", "Microsoft", "ほぼ全ての大規模JSプロジェクト"],
  },
  tailwind: {
    id: "tailwind", name: "Tailwind CSS", category: "フロントエンド / CSS",
    summary: "ユーティリティクラスを組み合わせてスタイルを当てる CSS フレームワーク。HTML 側で完結し、デザインの一貫性と速度を両立する。",
    canDo: ["クラス名だけで素早くスタイリング", "デザインシステムを統一", "未使用 CSS を自動削除して軽量化"],
    whenAdopted: ["素早く一貫した UI を作りたいとき", "コンポーネント志向の開発"],
    related: [
      { name: "CSS Modules", note: "コンポーネント単位で CSS をスコープ化する手法" },
      { name: "CSS-in-JS", note: "JS 内にスタイルを書く手法（styled-components 等）" },
    ],
  },
  vite: {
    id: "vite", name: "Vite", category: "フロントエンド / ビルドツール",
    summary: "高速な開発サーバーと本番バンドルを提供するビルドツール。ネイティブ ES モジュールを活かして起動・更新が非常に速い。",
    canDo: ["瞬時に立ち上がる開発サーバー", "高速な HMR（ホットリロード）", "本番向けの最適化ビルド"],
    whenAdopted: ["モダンなフロント開発全般", "webpack より速い開発体験が欲しいとき"],
    related: [
      { name: "webpack", note: "従来の定番バンドラ。設定は柔軟だが起動は遅め" },
      { name: "Turbopack", note: "Next.js 向けの高速バンドラ" },
    ],
  },

  // ───────── バックエンド ─────────
  nodejs: {
    id: "nodejs", name: "Node.js", category: "バックエンド / ランタイム",
    summary: "サーバーサイドで JavaScript/TypeScript を動かす実行環境。フロントと同じ言語でバックエンドを書けるのが最大の利点。",
    canDo: ["JS/TS で API・サーバーを構築", "npm の膨大なパッケージを利用", "非同期 I/O で多数の接続をさばく"],
    whenAdopted: ["フロントと言語を統一したいとき", "リアルタイム通信・I/O 中心の処理"],
    related: [
      { name: "Deno", note: "TypeScript 標準対応の新しいランタイム" },
      { name: "Bun", note: "高速を売りにする新興ランタイム" },
    ],
  },
  express: {
    id: "express", name: "Express", category: "バックエンド / フレームワーク",
    summary: "Node.js で最も普及した軽量 Web フレームワーク。ミドルウェアを積み重ねて API を作る、シンプルで自由な設計。",
    canDo: ["REST API を手早く構築", "ミドルウェアで機能を追加", "自由な構成で小さく始める"],
    whenAdopted: ["小〜中規模 API", "軽量・シンプルさを重視するとき"],
    related: [
      { name: "NestJS", id: "nestjs", note: "構造化された大規模向け。Express の上にも構築できる" },
      { name: "Fastify", id: "fastify", note: "より高速な代替" },
      { name: "Hono", id: "hono", note: "エッジ対応の軽量・高速フレームワーク" },
    ],
  },
  nestjs: {
    id: "nestjs", name: "NestJS", category: "バックエンド / フレームワーク",
    summary: "TypeScript 製の構造化されたバックエンドフレームワーク。DI やモジュール構造を備え、Angular に似た設計で大規模開発に向く。",
    canDo: ["モジュール・DI で構造化された API", "型安全なバックエンド", "マイクロサービスにも対応"],
    whenAdopted: ["大規模・チーム開発", "統一された規約が欲しいとき"],
    related: [
      { name: "Express", id: "express", note: "より自由・軽量。NestJS は規約が多い" },
      { name: "Spring Boot", id: "spring-boot", note: "Java 版の構造化フレームワークに近い思想" },
    ],
  },
  fastify: {
    id: "fastify", name: "Fastify", category: "バックエンド / フレームワーク",
    summary: "Node.js の高速・低オーバーヘッドな Web フレームワーク。スキーマベースの検証と高いスループットが特徴。",
    canDo: ["高スループットな API", "スキーマによる入出力検証", "プラグインで拡張"],
    whenAdopted: ["性能が重要な Node API", "Express より速さが欲しいとき"],
    related: [
      { name: "Express", id: "express", note: "最も普及。Fastify はより高速" },
      { name: "Hono", id: "hono", note: "エッジ環境向けで軽量" },
    ],
  },
  hono: {
    id: "hono", name: "Hono", category: "バックエンド / フレームワーク",
    summary: "エッジ環境でも動く軽量・高速な Web フレームワーク。Cloudflare Workers など様々なランタイムで動作する。",
    canDo: ["エッジ/サーバーレスで API を動かす", "軽量・高速なルーティング", "複数ランタイムに対応"],
    whenAdopted: ["エッジ・サーバーレス構成", "軽量な API"],
    related: [
      { name: "Express", id: "express", note: "Node 前提の定番。Hono は多ランタイム対応" },
    ],
  },
  django: {
    id: "django", name: "Django", category: "バックエンド / フレームワーク",
    summary: "Python の『全部入り』Web フレームワーク。ORM・管理画面・認証などを標準装備し、規約に沿って素早く開発できる。",
    canDo: ["ORM で DB を扱い CRUD を高速実装", "自動生成される管理画面", "認証・セキュリティ機能を標準で"],
    whenAdopted: ["CRUD 中心の Web/業務アプリ", "Python でデータ/ML と連携したいとき"],
    related: [
      { name: "FastAPI", id: "fastapi", note: "API 特化・非同期。Django はフルスタック" },
      { name: "Flask", id: "flask", note: "軽量・最小構成" },
      { name: "Ruby on Rails", id: "rails", note: "同じ『規約優先』のフルスタック思想" },
    ],
    usedBy: ["Instagram", "Spotify(一部)", "Pinterest", "Mozilla"],
  },
  fastapi: {
    id: "fastapi", name: "FastAPI", category: "バックエンド / フレームワーク",
    summary: "Python の高速な API フレームワーク。型ヒントから自動でバリデーションと API ドキュメント(OpenAPI)を生成する。",
    canDo: ["型ヒントで入出力を自動検証", "OpenAPI ドキュメントを自動生成", "非同期で高スループットな API"],
    whenAdopted: ["API サーバー・マイクロサービス", "ML モデルの推論 API", "型と速度を重視するとき"],
    related: [
      { name: "Django", id: "django", note: "フルスタック。FastAPI は API 特化" },
      { name: "Flask", id: "flask", note: "より最小。FastAPI は型・非同期が標準" },
    ],
  },
  flask: {
    id: "flask", name: "Flask", category: "バックエンド / フレームワーク",
    summary: "Python の軽量(マイクロ)Web フレームワーク。最小構成から必要な機能だけ足していく自由な設計。",
    canDo: ["小さな API・Web アプリを手早く", "必要な拡張だけ追加", "学習・試作に最適"],
    whenAdopted: ["小規模アプリ・プロトタイプ", "構成を自分で決めたいとき"],
    related: [
      { name: "FastAPI", id: "fastapi", note: "型・非同期・自動ドキュメントが標準" },
      { name: "Django", id: "django", note: "全部入り。Flask は最小" },
    ],
  },
  rails: {
    id: "rails", name: "Ruby on Rails", category: "バックエンド / フレームワーク",
    summary: "Ruby の『規約優先(CoC)』フルスタックフレームワーク。少ない記述で CRUD を素早く形にでき、スタートアップに人気。",
    canDo: ["ORM(ActiveRecord)で DB を扱う", "規約に沿って高速に CRUD 実装", "フロントまで一体で開発"],
    whenAdopted: ["素早くプロダクトを立ち上げたいとき", "CRUD 中心のサービス"],
    related: [
      { name: "Laravel", id: "laravel", note: "PHP 版の同種フレームワーク" },
      { name: "Django", id: "django", note: "Python 版のフルスタック" },
    ],
    usedBy: ["GitHub", "Shopify", "Airbnb(初期)", "Netflix(社内)"],
    aliases: ["Rails"],
  },
  laravel: {
    id: "laravel", name: "Laravel", category: "バックエンド / フレームワーク",
    summary: "PHP の代表的なフルスタックフレームワーク。ORM・認証・キューなどを備え、学習資料が豊富で中小規模の Web に強い。",
    canDo: ["ORM(Eloquent)で DB を操作", "認証・キュー・スケジューラを標準で", "素早く Web アプリを構築"],
    whenAdopted: ["PHP 環境・レンタルサーバー", "中小規模の Web/EC/CMS"],
    related: [
      { name: "Ruby on Rails", id: "rails", note: "同じ規約優先の思想" },
      { name: "Django", id: "django", note: "Python 版のフルスタック" },
    ],
  },
  "spring-boot": {
    id: "spring-boot", name: "Spring Boot", category: "バックエンド / フレームワーク",
    summary: "Java(Kotlin)の定番バックエンドフレームワーク。堅牢・高機能で、大規模・エンタープライズシステムの標準。",
    canDo: ["大規模・堅牢な API/バックエンド", "DI・トランザクション・セキュリティを標準で", "豊富な企業向け連携"],
    whenAdopted: ["エンタープライズ・大規模システム", "長期保守・堅牢性を重視するとき"],
    related: [
      { name: "ASP.NET Core", id: "aspnet", note: "C# 版の高性能フレームワーク" },
      { name: "NestJS", id: "nestjs", note: "TypeScript で似た構造化思想" },
    ],
    usedBy: ["Netflix", "Amazon(一部)", "Uber(一部)", "多くの金融機関"],
  },
  aspnet: {
    id: "aspnet", name: "ASP.NET Core", category: "バックエンド / フレームワーク",
    summary: "Microsoft の C# 製バックエンドフレームワーク。高性能でクロスプラットフォーム、Azure との親和性が高い。",
    canDo: ["高性能な API/Web アプリ", "C#/.NET 資産を活用", "Windows/クラウドと統合"],
    whenAdopted: ["Microsoft 環境・企業システム", "高い性能が必要なとき"],
    related: [
      { name: "Spring Boot", id: "spring-boot", note: "Java 版の大規模向け" },
    ],
  },
  go: {
    id: "go", name: "Go", aliases: ["golang", "Golang"], category: "言語 / バックエンド",
    summary: "Google 製の軽量・高速な言語。並行処理が得意で、単一バイナリにコンパイルできるため配布・運用が容易。",
    canDo: ["高速・低リソースな API を作る", "goroutine で並行処理", "単一バイナリで簡単にデプロイ"],
    whenAdopted: ["高負荷・並行処理が必要なサービス", "軽量な配布・マイクロサービス・CLI"],
    related: [
      { name: "Rust", id: "rust", note: "さらに高速・安全だが学習は難しめ" },
      { name: "Node.js", id: "nodejs", note: "Go は型・並行処理と配布のしやすさが強み" },
    ],
    usedBy: ["Google", "Uber", "Docker(実装言語)", "Kubernetes(実装言語)"],
  },
  rust: {
    id: "rust", name: "Rust", category: "言語 / システム・バックエンド",
    summary: "所有権モデルにより、GC なしでメモリ安全と高速性を両立する言語。パフォーマンスと安全性が最重要な領域で採用される。",
    canDo: ["C/C++ 並みの速度で安全なコード", "高性能な API(Axum/Actix)や CLI", "WebAssembly・システムプログラミング"],
    whenAdopted: ["性能・安全性が最重要なとき", "低レイヤ・高負荷処理"],
    related: [
      { name: "Go", id: "go", note: "Go はより学習しやすい。Rust はより高速・厳密" },
    ],
    usedBy: ["Discord", "Dropbox", "Cloudflare", "Figma(一部)"],
  },

  // ───────── API ─────────
  rest: {
    id: "rest", name: "REST", category: "API 設計",
    summary: "URL(リソース)と HTTP メソッドで操作を表す API 設計スタイル。最も普及しており、汎用 Web API の第一候補。",
    canDo: ["リソース単位で CRUD を表現", "HTTP の仕組みをそのまま活用", "幅広いツール・情報を利用"],
    whenAdopted: ["汎用的な Web API 全般", "迷ったときの標準"],
    related: [
      { name: "GraphQL", id: "graphql", note: "取得項目を柔軟に指定できる。複雑な UI 向き" },
      { name: "gRPC", id: "grpc", note: "高速なサービス間通信向き" },
    ],
  },
  graphql: {
    id: "graphql", name: "GraphQL", category: "API 設計",
    summary: "クライアントが必要なデータの形を1回のクエリで指定できる API 仕様。過不足のないデータ取得ができる。",
    canDo: ["必要なフィールドだけ取得(過剰・不足を防ぐ)", "1リクエストで複数リソースをまとめて取得", "型付きスキーマで契約を明確化"],
    whenAdopted: ["画面ごとに必要データが変わる複雑な UI", "多様なクライアントが同じ API を使うとき"],
    related: [
      { name: "REST", id: "rest", note: "よりシンプルで普及。GraphQL は柔軟だが複雑" },
      { name: "gRPC", id: "grpc", note: "サービス間の高速通信向き" },
    ],
    usedBy: ["GitHub API", "Shopify", "Facebook", "GitLab"],
  },
  grpc: {
    id: "grpc", name: "gRPC", category: "API 設計",
    summary: "Protocol Buffers による型定義をもとに、バイナリで高速に通信する RPC フレームワーク。サービス間通信に強い。",
    canDo: ["高速・低容量なバイナリ通信", "proto から各言語のコードを生成", "双方向ストリーミング"],
    whenAdopted: ["マイクロサービス間の通信", "低レイテンシが必要な内部 API"],
    related: [
      { name: "REST", id: "rest", note: "人間に読みやすく汎用的。gRPC は機械間で高速" },
      { name: "GraphQL", id: "graphql", note: "クライアント主導のデータ取得向き" },
    ],
  },
  openapi: {
    id: "openapi", name: "OpenAPI (Swagger)", aliases: ["OpenAPI", "Swagger"], category: "API 仕様",
    summary: "REST API の仕様を機械可読な形式で記述する標準。ドキュメント生成・クライアント生成・モックに使える。",
    canDo: ["API 仕様書を自動生成・共有", "仕様からクライアント/サーバーコードを生成", "モックやテストに活用"],
    whenAdopted: ["チームで API 仕様を共有するとき", "フロント/バックの並行開発"],
    related: [
      { name: "REST", id: "rest", note: "OpenAPI は REST API を記述する仕様" },
    ],
  },

  // ───────── データベース ─────────
  postgresql: {
    id: "postgresql", name: "PostgreSQL", category: "データベース / RDB",
    summary: "高機能で拡張性の高いリレーショナルDB。JSON・全文検索・地理情報・ベクトルまで扱え、迷ったときの第一候補。",
    canDo: ["トランザクションと複雑な結合で整合性を担保", "JSON や全文検索も1つで扱う", "拡張(pgvector 等)で機能追加"],
    whenAdopted: ["ほとんどの Web アプリの主データベース", "整合性と多機能を両立したいとき"],
    related: [
      { name: "MySQL", id: "mysql", note: "普及率が高い。PostgreSQL はより多機能" },
      { name: "SQLite", id: "sqlite", note: "軽量・組込み向け" },
      { name: "MongoDB", id: "mongodb", note: "スキーマレスな NoSQL" },
    ],
    usedBy: ["Apple(一部)", "Instagram", "Reddit", "Spotify"],
    aliases: ["Postgres"],
  },
  mysql: {
    id: "mysql", name: "MySQL", category: "データベース / RDB",
    summary: "世界的に普及したリレーショナルDB。情報・ホスティング対応が豊富で、Web の定番。MariaDB という派生もある。",
    canDo: ["定番の RDB として CRUD を担う", "豊富なホスティング/ツールを利用", "レプリケーションでスケール"],
    whenAdopted: ["普及度・情報量を重視するとき", "一般的な Web サービス"],
    related: [
      { name: "PostgreSQL", id: "postgresql", note: "より高機能・拡張性が高い" },
      { name: "SQLite", id: "sqlite", note: "軽量・組込み" },
    ],
  },
  sqlite: {
    id: "sqlite", name: "SQLite", category: "データベース / RDB",
    summary: "ファイル1つで完結する軽量なリレーショナルDB。サーバー不要で、組込み・モバイル・小規模に最適。",
    canDo: ["サーバーなしで SQL を使う", "アプリに埋め込んで配布", "テスト・試作を手軽に"],
    whenAdopted: ["モバイル・デスクトップアプリの内部DB", "小規模・単一ファイルで済ませたいとき"],
    related: [
      { name: "PostgreSQL", id: "postgresql", note: "本格運用・多人数同時アクセス向き" },
      { name: "MySQL", id: "mysql", note: "サーバー型の定番" },
    ],
  },
  mongodb: {
    id: "mongodb", name: "MongoDB", category: "データベース / NoSQL",
    summary: "ドキュメント指向の NoSQL データベース。JSON ライクな柔軟なスキーマでデータを保存でき、スキーマ変更に強い。",
    canDo: ["スキーマレスに柔軟なデータを保存", "水平スケール(シャーディング)", "階層的なデータをそのまま格納"],
    whenAdopted: ["スキーマが定まらない/変わりやすいデータ", "大量データの水平スケール"],
    related: [
      { name: "PostgreSQL", id: "postgresql", note: "整合性・結合は RDB が得意。JSON も扱える" },
      { name: "DynamoDB", note: "AWS のマネージド NoSQL" },
    ],
    usedBy: ["Uber", "eBay(一部)", "Adobe", "Forbes"],
  },
  redis: {
    id: "redis", name: "Redis", category: "データベース / キャッシュ",
    summary: "メモリ上で動く超高速なキーバリューストア。キャッシュ・セッション・カウンタなど『速くて消えてもよいデータ』に使う。",
    canDo: ["頻繁に読むデータをキャッシュして高速化", "セッションやカウンタを保持", "Pub/Sub・簡易キューにも利用"],
    whenAdopted: ["DB の負荷軽減・高速化", "セッション管理・レートリミット・ランキング"],
    related: [
      { name: "PostgreSQL", id: "postgresql", note: "永続の『真実の源』。Redis はその写し(キャッシュ)" },
      { name: "Memcached", note: "同じくキャッシュ用途。Redis の方が高機能" },
    ],
    usedBy: ["Twitter/X", "GitHub", "Stack Overflow", "Airbnb"],
  },
  elasticsearch: {
    id: "elasticsearch", name: "Elasticsearch", category: "データベース / 検索",
    summary: "全文検索とログ分析に強い分散型の検索エンジン。大量テキストの高速な検索・集計ができる。",
    canDo: ["高速な全文検索・あいまい検索", "ログの収集・分析・可視化", "大量データの集計"],
    whenAdopted: ["サイト内検索・ログ基盤", "テキスト検索が中心のとき"],
    related: [
      { name: "OpenSearch", note: "Elasticsearch から派生した OSS" },
      { name: "Meilisearch", note: "手軽で高速な軽量検索エンジン" },
    ],
  },
  pgvector: {
    id: "pgvector", name: "pgvector / ベクトルDB", aliases: ["pgvector"], category: "データベース / ベクトル",
    summary: "埋め込み(ベクトル)を保存し類似検索する仕組み。pgvector は PostgreSQL 拡張で、AI/RAG の意味検索に使う。",
    canDo: ["テキスト/画像の埋め込みを保存", "類似度(意味)で近いデータを検索", "RAG の検索基盤にする"],
    whenAdopted: ["AI エージェント・RAG の意味検索", "レコメンド・類似コンテンツ探索"],
    related: [
      { name: "Pinecone", note: "マネージドなベクトルDB サービス" },
      { name: "Qdrant", note: "OSS の高速ベクトルDB" },
      { name: "PostgreSQL", id: "postgresql", note: "pgvector は Postgres の拡張として動く" },
    ],
  },

  // ───────── コンテナ / インフラ ─────────
  docker: {
    id: "docker", name: "Docker", category: "コンテナ",
    summary: "アプリと実行環境を1つのイメージに固めて、どこでも同じに動かすコンテナ技術。開発〜本番の環境差をなくす。",
    canDo: ["アプリを環境ごとイメージ化して配布", "『自分の PC では動く』問題を解消", "複数サービスを分離して動かす"],
    whenAdopted: ["環境の再現性が欲しいとき", "複数サービスを1台で動かす構成", "CI/CD の土台"],
    related: [
      { name: "Podman", note: "デーモン不要・rootless が得意な Docker 互換ツール" },
      { name: "Docker Compose", id: "compose", note: "複数コンテナを束ねる" },
      { name: "Kubernetes", id: "kubernetes", note: "大規模なコンテナ運用" },
    ],
    usedBy: ["ほぼ全ての現代的なWeb企業", "Google", "Spotify", "PayPal"],
  },
  compose: {
    id: "compose", name: "Docker Compose", category: "コンテナ / オーケストレーション",
    summary: "複数コンテナを1枚の YAML で宣言的に束ねて起動するツール。1台のサーバーで数サービスを動かすのに最適。",
    canDo: ["複数サービスを1コマンドで起動", "ネットワーク・依存関係・環境変数を宣言的に管理", "開発〜小規模本番を再現"],
    whenAdopted: ["1台の VPS で数サービスを動かすとき", "ローカル開発環境の統一"],
    related: [
      { name: "Kubernetes", id: "kubernetes", note: "多数サーバー・大規模向け。Compose は1台向け" },
      { name: "Docker", id: "docker", note: "Compose は Docker を束ねる仕組み" },
    ],
  },
  kubernetes: {
    id: "kubernetes", name: "Kubernetes (k8s)", category: "コンテナ / オーケストレーション",
    summary: "多数のコンテナを複数サーバーにまたがって自動でスケール・配置・自己修復するオーケストレーター。大規模運用の標準。",
    canDo: ["負荷に応じた自動スケール", "障害時の自動復旧・再配置", "宣言的に大規模なコンテナ群を管理"],
    whenAdopted: ["大量のコンテナ・複数サーバー運用", "高可用性・自動スケールが必要なとき"],
    related: [
      { name: "Docker Compose", id: "compose", note: "1台なら Compose で十分。k8s は大規模向け" },
      { name: "EKS/GKE/AKS", note: "各クラウドのマネージド Kubernetes" },
    ],
    aliases: ["k8s"],
  },
  nginx: {
    id: "nginx", name: "nginx", category: "インフラ / Web サーバー",
    summary: "高速な Web サーバー兼リバースプロキシ。静的配信や、リクエストを裏のサービスへ振り分ける『入口』として使う。",
    canDo: ["静的ファイルの高速配信", "リバースプロキシで /api や / を振り分け", "SSL 終端・ロードバランス"],
    whenAdopted: ["アプリの前段に置く入口", "複数サービスを1つのドメインでまとめるとき"],
    related: [
      { name: "Traefik", note: "自動 HTTPS・コンテナ連携が得意" },
      { name: "Caddy", note: "設定が簡単で自動 HTTPS 標準" },
    ],
  },
  podman: {
    id: "podman", name: "Podman", category: "コンテナ",
    summary: "Docker 互換のコンテナツール。デーモンを持たず rootless で動かせるため、セキュリティ面で好まれる。",
    canDo: ["Docker と同じコマンド体系で操作", "デーモンなし・rootless で実行", "OCI イメージを扱う"],
    whenAdopted: ["rootless・セキュリティ重視の環境", "デーモンレス運用"],
    related: [
      { name: "Docker", id: "docker", note: "最も普及。Podman はデーモン不要が強み" },
    ],
  },

  // ───────── クラウド ─────────
  aws: {
    id: "aws", name: "AWS", category: "クラウド",
    summary: "Amazon のクラウド。サービス数・シェアが最大で、情報も求人も豊富。迷ったときの第一候補。",
    canDo: ["仮想マシン(EC2)・保存(S3)・DB(RDS)など何でも揃う", "サーバーレス(Lambda)・コンテナ(ECS/EKS)", "世界規模のインフラを従量課金で"],
    whenAdopted: ["実務で最も潰しが効くクラウド", "スタートアップ〜大企業まで幅広く"],
    related: [
      { name: "Azure", id: "azure", note: "Microsoft 製品との統合に強い" },
      { name: "GCP", id: "gcp", note: "データ分析・ML に強み" },
    ],
  },
  azure: {
    id: "azure", name: "Azure", category: "クラウド",
    summary: "Microsoft のクラウド。Windows・Active Directory・Office など Microsoft 製品との統合に強く、企業導入で人気。",
    canDo: ["仮想マシン・App Service・Functions", "Active Directory 等と統合", "エンタープライズ向けの連携"],
    whenAdopted: ["Microsoft 環境・社内システム", "企業のクラウド移行"],
    related: [
      { name: "AWS", id: "aws", note: "シェア・サービス数が最大" },
      { name: "GCP", id: "gcp", note: "データ/ML に強み" },
    ],
  },
  gcp: {
    id: "gcp", name: "GCP", category: "クラウド",
    summary: "Google のクラウド。データ分析(BigQuery)や機械学習、コンテナ(GKE)に強みを持つ。",
    canDo: ["BigQuery で大規模データ分析", "GKE でコンテナ運用", "Vertex AI で機械学習"],
    whenAdopted: ["データ分析・ML が中心のとき", "コンテナ志向の構成"],
    related: [
      { name: "AWS", id: "aws", note: "総合力・シェアが最大" },
      { name: "Azure", id: "azure", note: "Microsoft 統合に強い" },
    ],
  },
  vps: {
    id: "vps", name: "VPS", category: "クラウド / インフラ",
    summary: "OS ごと1台の仮想サーバーを借りる形態。月額固定で分かりやすく安価。自分で運用する分、基盤を理解する学習に最適。",
    canDo: ["OS から自由に構成する", "月額固定で安く1台を運用", "Docker などを自分で載せる"],
    whenAdopted: ["基盤を学びたいとき", "小さく安く始めたいとき", "個人サービスの運用"],
    related: [
      { name: "AWS", id: "aws", note: "従量課金で高機能。VPS は月額固定でシンプル" },
      { name: "サーバーレス", note: "運用を任せられるが制約あり。VPS は自由だが要運用" },
    ],
  },

  // ───────── モバイル ─────────
  swift: {
    id: "swift", name: "Swift", category: "モバイル / iOS",
    summary: "Apple の iOS/macOS 開発言語。SwiftUI と組み合わせて、最新 OS 機能を最高品質で扱えるネイティブ開発。",
    canDo: ["iOS/macOS ネイティブアプリを開発", "SwiftUI で宣言的に UI 構築", "OS 最新機能をいち早く利用"],
    whenAdopted: ["最高の UX・iOS 専用アプリ", "カメラ・AR など OS 機能を使うとき"],
    related: [
      { name: "Kotlin", id: "kotlin", note: "Android 側の対になる言語" },
      { name: "Flutter", id: "flutter", note: "1コードで両 OS 対応(クロス)" },
    ],
  },
  kotlin: {
    id: "kotlin", name: "Kotlin", category: "モバイル / Android",
    summary: "Android 開発の主要言語。Jetpack Compose と組み合わせてネイティブアプリを作る。Java とも相互運用できる。",
    canDo: ["Android ネイティブアプリを開発", "Jetpack Compose で宣言的 UI", "Java 資産と併用"],
    whenAdopted: ["Android 専用の高品質アプリ", "OS 機能を最大限使いたいとき"],
    related: [
      { name: "Swift", id: "swift", note: "iOS 側の対になる言語" },
      { name: "Kotlin Multiplatform", note: "ロジックを共有しつつ UI はネイティブ" },
    ],
  },
  flutter: {
    id: "flutter", name: "Flutter", category: "モバイル / クロスプラットフォーム",
    summary: "Google 製のクロスプラットフォーム開発フレームワーク。Dart で書き、独自エンジンで描画するため iOS/Android で UI が均一。",
    canDo: ["1つのコードで iOS/Android を開発", "Web・デスクトップにも展開", "均一で美しい UI を高速描画"],
    whenAdopted: ["コストを抑えて両 OS へ出したいとき", "UI の一貫性を重視するとき"],
    related: [
      { name: "React Native", id: "react-native", note: "Web の React 知識を活かせる。Flutter は独自描画" },
      { name: "Swift", id: "swift", note: "ネイティブは最高品質だがコスト2倍" },
    ],
    usedBy: ["Google Pay", "BMW", "Alibaba", "eBay(一部)"],
  },
  "react-native": {
    id: "react-native", name: "React Native", category: "モバイル / クロスプラットフォーム",
    summary: "React でモバイルアプリを作るフレームワーク。ネイティブ UI を呼び出し、Web の React 知識をそのまま活かせる。",
    canDo: ["React でネイティブアプリを開発", "1コードで iOS/Android 対応", "Web の知識・エコシステムを再利用"],
    whenAdopted: ["Web で React を使っているチーム", "コストを抑えて両 OS 対応したいとき"],
    related: [
      { name: "Flutter", id: "flutter", note: "独自描画で UI 均一。RN はネイティブ UI を利用" },
      { name: "React", id: "react", note: "同じ React の考え方をモバイルへ" },
    ],
    usedBy: ["Instagram", "Discord", "Shopify", "Microsoft(一部)"],
  },

  // ───────── デスクトップ ─────────
  electron: {
    id: "electron", name: "Electron", category: "デスクトップ",
    summary: "Web 技術(HTML/CSS/JS)でデスクトップアプリを作るフレームワーク。Chromium と Node.js を同梱し、どの OS でも表示が均一。",
    canDo: ["Web 技術でデスクトップアプリを開発", "OS 間で均一な表示", "Node.js で OS 機能にアクセス"],
    whenAdopted: ["Web の知識を活かして素早く作りたいとき", "表示の均一性・実績を重視するとき"],
    related: [
      { name: "Tauri", id: "tauri", note: "OS 標準 WebView で軽量。Electron は重いが均一" },
    ],
    usedBy: ["VS Code", "Slack", "Discord", "Figma(デスクトップ)"],
  },
  tauri: {
    id: "tauri", name: "Tauri", category: "デスクトップ",
    summary: "Rust + Web フロントで作る軽量なデスクトップフレームワーク。OS 標準の WebView を使うため、バイナリが小さく省メモリ。",
    canDo: ["軽量・省メモリなデスクトップアプリ", "小さい配布バイナリ", "Rust による安全なバックエンド処理"],
    whenAdopted: ["軽さ・セキュリティ・配布サイズを重視するとき", "Web フロント資産を活かしたいとき"],
    related: [
      { name: "Electron", id: "electron", note: "実績・均一性は上だが重い。Tauri は軽い" },
    ],
  },
  qt: {
    id: "qt", name: "Qt", category: "デスクトップ / GUI",
    summary: "C++(Python も可)の老舗クロスプラットフォーム GUI フレームワーク。高性能で、組込み機器でも使われる。",
    canDo: ["Win/mac/Linux 対応の GUI を開発", "高い描画性能", "組込み・産業機器にも展開"],
    whenAdopted: ["高性能な GUI が必要なとき", "既存の C++ 資産を活かすとき"],
    related: [
      { name: "Electron", id: "electron", note: "Web 技術で手軽。Qt は高性能・ネイティブ寄り" },
    ],
  },

  // ───────── 拡張機能 ─────────
  "chrome-extension": {
    id: "chrome-extension", name: "ブラウザ拡張 (Manifest V3)", aliases: ["ブラウザ拡張", "Manifest V3"], category: "拡張機能",
    summary: "Web 技術でブラウザに機能を足す仕組み。現行仕様は Manifest V3 で、Service Worker と Content Script で構成する。",
    canDo: ["開いているページの DOM を操作・情報収集", "ツールバー UI や設定画面を追加", "バックグラウンドでイベント処理"],
    whenAdopted: ["Web ページの操作を自動化したいとき", "Web 技術から拡張開発に入るとき"],
    related: [
      { name: "VS Code 拡張", id: "vscode-extension", note: "エディタを拡張する。開発者向け" },
    ],
  },
  "vscode-extension": {
    id: "vscode-extension", name: "VS Code 拡張", aliases: ["VS Code 拡張機能"], category: "拡張機能",
    summary: "TypeScript で VS Code に機能を足す仕組み。コマンド・言語サポート・UI などを追加でき、開発者向けツールの定番。",
    canDo: ["エディタにコマンド・機能を追加", "言語サポートやフォーマッタを実装", "Marketplace で配布"],
    whenAdopted: ["開発体験を良くするツールを作るとき", "社内向けの開発支援"],
    related: [
      { name: "ブラウザ拡張", id: "chrome-extension", note: "ブラウザを拡張する。Web 操作向き" },
    ],
  },

  // ───────── AI エージェント ─────────
  langchain: {
    id: "langchain", name: "LangChain", category: "AI エージェント / フレームワーク",
    summary: "LLM アプリ・エージェントを組み立てるための最も普及したフレームワーク。プロンプト・ツール・チェーンなどの部品が豊富。",
    canDo: ["LLM とツール・データ源を連携させる", "プロンプトや処理の流れ(チェーン)を組む", "RAG やエージェントを実装する"],
    whenAdopted: ["まず LLM アプリを素早く形にしたいとき", "多様なツール連携が必要なとき"],
    related: [
      { name: "LangGraph", id: "langgraph", note: "複雑な分岐・状態遷移を扱う。同じ LangChain 系" },
      { name: "LlamaIndex", id: "llamaindex", note: "RAG(データ検索連携)に強い" },
    ],
  },
  langgraph: {
    id: "langgraph", name: "LangGraph", category: "AI エージェント / フレームワーク",
    summary: "エージェントを『グラフ(状態遷移)』として設計するフレームワーク。分岐・ループ・人手介入を伴う複雑な処理に強い。",
    canDo: ["状態を持つ複雑なエージェントを設計", "分岐・ループ・再試行を明示的に制御", "人間の承認(human-in-the-loop)を挟む"],
    whenAdopted: ["長い手順・条件分岐が多いエージェント", "本番運用で制御性が必要なとき"],
    related: [
      { name: "LangChain", id: "langchain", note: "部品が豊富。LangGraph は制御フローに特化" },
      { name: "CrewAI", note: "複数エージェントの協調に特化" },
    ],
  },
  llamaindex: {
    id: "llamaindex", name: "LlamaIndex", category: "AI エージェント / RAG",
    summary: "データの取り込み〜検索に強い LLM フレームワーク。社内文書などを LLM に接続する RAG の構築が得意。",
    canDo: ["各種データを取り込みインデックス化", "検索して LLM の回答根拠にする(RAG)", "クエリエンジンを構築"],
    whenAdopted: ["社内文書に基づく回答を作りたいとき", "RAG が中心のアプリ"],
    related: [
      { name: "LangChain", id: "langchain", note: "汎用的。LlamaIndex はデータ検索に特化" },
      { name: "RAG", id: "rag", note: "LlamaIndex が得意とする手法" },
    ],
  },
  rag: {
    id: "rag", name: "RAG（検索拡張生成）", aliases: ["RAG"], category: "AI エージェント / 手法",
    summary: "外部データを検索し、その結果を根拠として LLM に回答させる手法。最新・社内情報に基づいた回答と幻覚の抑制に役立つ。",
    canDo: ["社内ドキュメントに基づいて回答", "モデルが知らない最新情報を扱う", "回答の根拠(出典)を示す"],
    whenAdopted: ["社内ナレッジ検索・サポートボット", "幻覚(hallucination)を減らしたいとき"],
    related: [
      { name: "pgvector / ベクトルDB", id: "pgvector", note: "RAG の検索基盤" },
      { name: "LlamaIndex", id: "llamaindex", note: "RAG 構築に強いフレームワーク" },
    ],
  },
  mcp: {
    id: "mcp", name: "MCP (Model Context Protocol)", aliases: ["MCP", "Model Context Protocol"], category: "AI エージェント / 連携",
    summary: "LLM にツールやデータ源を標準化された形で接続するためのプロトコル。共通仕様で様々な機能をエージェントに繋げる。",
    canDo: ["ツール・データ源を標準インターフェースで接続", "自作/既製の MCP サーバーを再利用", "エージェントに機能を安全に足す"],
    whenAdopted: ["複数のツール連携を統一したいとき", "再利用可能な連携を作りたいとき"],
    related: [
      { name: "Function calling", note: "モデルに関数を呼ばせる基本機能。MCP は接続を標準化" },
    ],
  },
  ollama: {
    id: "ollama", name: "Ollama", category: "AI / ローカル実行",
    summary: "オープンな LLM を手元の PC やサーバーで手軽に動かすツール。API サーバーとしても使え、機密データを外に出さずに済む。",
    canDo: ["ローカルでオープンモデルを実行", "簡単なコマンドでモデルを切替", "ローカル API として利用"],
    whenAdopted: ["機密データを外部に送りたくないとき", "コスト・オフライン実行を重視するとき"],
    related: [
      { name: "vLLM", id: "vllm", note: "本番の高スループット推論向け" },
      { name: "LM Studio", note: "GUI でローカル LLM を扱う" },
    ],
  },
  vllm: {
    id: "vllm", name: "vLLM", category: "AI / 推論サーバー",
    summary: "オープン LLM を高スループットで提供する推論エンジン。効率的なメモリ管理で、本番のセルフホスト推論に使われる。",
    canDo: ["高速・高スループットな LLM 推論", "複数リクエストを効率的に処理", "OpenAI 互換 API を提供"],
    whenAdopted: ["自前でモデルを本番運用するとき", "大量アクセスを捌く必要があるとき"],
    related: [
      { name: "Ollama", id: "ollama", note: "手軽なローカル実行向け。vLLM は本番規模" },
    ],
  },
  huggingface: {
    id: "huggingface", name: "Hugging Face", aliases: ["Hugging Face Transformers"], category: "AI / モデルハブ",
    summary: "事前学習済みモデルとライブラリ(Transformers)を提供するプラットフォーム。既存モデルの利用・微調整の中心地。",
    canDo: ["公開モデルをダウンロードして使う", "Transformers で推論・微調整(ファインチューニング)", "データセットを共有・利用"],
    whenAdopted: ["既存モデルを活用・カスタマイズするとき", "研究・実験"],
    related: [
      { name: "PyTorch", id: "pytorch", note: "多くのモデルの土台となる深層学習フレームワーク" },
    ],
  },
  langsmith: {
    id: "langsmith", name: "LangSmith / Langfuse", aliases: ["LangSmith", "Langfuse"], category: "AI エージェント / 可観測性",
    summary: "LLM アプリの各ステップの入出力・コスト・遅延を記録し、評価(Eval)する可観測性ツール。本番運用の品質管理に使う。",
    canDo: ["各ステップの入出力・コストを追跡", "回答品質を評価(Eval)", "問題箇所をデバッグ"],
    whenAdopted: ["LLM アプリを本番運用するとき", "品質・コストを継続的に監視したいとき"],
    related: [
      { name: "LangChain", id: "langchain", note: "LangSmith は LangChain と親和性が高い" },
    ],
  },

  // ───────── 機械学習 ─────────
  python: {
    id: "python", name: "Python", category: "言語 / データ・ML",
    summary: "機械学習・データ分析のデファクト言語。ライブラリが最も充実し、読みやすい文法で試作から本番まで幅広く使える。",
    canDo: ["データ処理・可視化・ML を一貫して行う", "豊富なライブラリを利用", "Web(Django/FastAPI)にも展開"],
    whenAdopted: ["機械学習・データ分析", "スクリプト・自動化", "AI 関連の開発全般"],
    related: [
      { name: "R", note: "統計解析に強い言語" },
      { name: "Julia", note: "数値計算向けの新しい言語" },
    ],
    usedBy: ["Instagram(バックエンド)", "Dropbox", "YouTube(一部)", "NASA"],
  },
  numpy: {
    id: "numpy", name: "NumPy", category: "機械学習 / 数値計算",
    summary: "多次元配列と高速な数値演算を提供する Python ライブラリ。ほぼすべてのデータ/ML ライブラリの土台。",
    canDo: ["行列・ベクトルの高速計算", "他ライブラリの基盤データ構造を提供"],
    whenAdopted: ["数値計算が絡むあらゆる場面", "pandas/PyTorch 等の下支え"],
    related: [
      { name: "pandas", id: "pandas", note: "NumPy を土台に表データを扱う" },
    ],
  },
  pandas: {
    id: "pandas", name: "pandas", category: "機械学習 / データ処理",
    summary: "表形式データ(データフレーム)を扱う Python ライブラリ。読み込み・整形・集計・結合をコードで行える。",
    canDo: ["CSV/Excel などの読み込み・加工", "フィルタ・集計・結合", "前処理・探索的分析(EDA)"],
    whenAdopted: ["データ分析・前処理の中心", "機械学習の入力データ準備"],
    related: [
      { name: "Polars", note: "より高速な新しいデータフレームライブラリ" },
      { name: "NumPy", id: "numpy", note: "pandas の数値計算の土台" },
    ],
  },
  "scikit-learn": {
    id: "scikit-learn", name: "scikit-learn", category: "機械学習 / 古典 ML",
    summary: "回帰・分類・クラスタリングなど古典的な機械学習を統一 API で扱える Python ライブラリ。ML の基本を学ぶ入口。",
    canDo: ["回帰・分類・クラスタリングを実装", "前処理・評価・パイプライン化", "統一 API で手軽にモデル比較"],
    whenAdopted: ["表形式データの基本的な ML", "ML の学習・試作"],
    related: [
      { name: "XGBoost / LightGBM", id: "xgboost", note: "表データで高精度な勾配ブースティング" },
      { name: "PyTorch", id: "pytorch", note: "深層学習はこちら" },
    ],
  },
  xgboost: {
    id: "xgboost", name: "XGBoost / LightGBM", aliases: ["XGBoost", "LightGBM"], category: "機械学習 / 勾配ブースティング",
    summary: "決定木を組み合わせる勾配ブースティングのライブラリ。表形式データで非常に高精度で、実務やコンペの定番。",
    canDo: ["表データで高精度な予測", "特徴量の重要度を把握", "大規模データでも高速に学習(LightGBM)"],
    whenAdopted: ["表形式データの予測タスク", "高精度が必要なとき"],
    related: [
      { name: "scikit-learn", id: "scikit-learn", note: "基本的な ML。ブースティングはより高精度" },
      { name: "PyTorch", id: "pytorch", note: "画像・言語など非構造データ向け" },
    ],
  },
  pytorch: {
    id: "pytorch", name: "PyTorch", category: "機械学習 / 深層学習",
    summary: "研究・実装で主流の深層学習フレームワーク。動的な計算グラフで柔軟にモデルを書け、画像・音声・言語などを扱う。",
    canDo: ["ニューラルネットを構築・学習", "GPU で高速に訓練", "研究の最新手法をすぐ実装"],
    whenAdopted: ["画像・音声・言語など非構造データ", "深層学習の研究・開発"],
    related: [
      { name: "TensorFlow/Keras", note: "同じ深層学習FW。本番・モバイル配備に実績" },
      { name: "JAX", note: "高速な数値計算・研究向け" },
      { name: "Hugging Face", id: "huggingface", note: "PyTorch 上の事前学習モデルを活用" },
    ],
    usedBy: ["OpenAI(初期)", "Tesla(Autopilot)", "Meta AI", "多くの研究機関"],
  },
  mlflow: {
    id: "mlflow", name: "MLflow / W&B", aliases: ["MLflow", "Weights & Biases", "W&B"], category: "機械学習 / 実験管理",
    summary: "学習のパラメータ・精度・成果物を記録して比較する実験管理ツール。再現性を確保し、モデル開発を体系化する。",
    canDo: ["実験のパラメータ・結果を記録", "複数モデルを比較", "モデルを登録・バージョン管理"],
    whenAdopted: ["多数の実験を整理・比較したいとき", "チームで再現性を担保するとき"],
    related: [
      { name: "Weights & Biases", note: "可視化・共同作業に強い実験管理" },
      { name: "MLOps", note: "実験管理は MLOps の一部" },
    ],
  },

  // ───────── フロントエンド周辺（状態管理・ビルド・UI） ─────────
  redux: {
    id: "redux", name: "Redux Toolkit", aliases: ["Redux"], category: "フロントエンド / 状態管理",
    summary: "アプリ全体の状態を1つのストアで一元管理するライブラリ。Redux Toolkit は定型コードを大幅に減らした公式の推奨形。",
    canDo: ["画面をまたぐ状態を予測可能に管理", "状態変更の履歴・デバッグがしやすい"],
    whenAdopted: ["大規模で状態が複雑なアプリ", "厳密な状態管理が欲しいとき"],
    related: [
      { name: "Zustand", id: "zustand", note: "より軽量・シンプルな状態管理" },
      { name: "TanStack Query", id: "tanstack-query", note: "サーバーデータの管理はこちらが得意" },
    ],
  },
  zustand: {
    id: "zustand", name: "Zustand", category: "フロントエンド / 状態管理",
    summary: "最小限の API で使える軽量な状態管理ライブラリ。ボイラープレートが少なく学習コストが低い。",
    canDo: ["手軽にグローバル状態を持つ", "少ないコードで状態を共有"],
    whenAdopted: ["Redux は大げさな中小規模アプリ", "手早く状態管理したいとき"],
    related: [
      { name: "Redux Toolkit", id: "redux", note: "より厳格・大規模向け" },
      { name: "Pinia", id: "pinia", note: "Vue 向けの同種ライブラリ" },
    ],
  },
  pinia: {
    id: "pinia", name: "Pinia", category: "フロントエンド / 状態管理",
    summary: "Vue の公式推奨状態管理ライブラリ。型安全でシンプルな API を持つ。",
    canDo: ["Vue アプリの状態を一元管理", "型安全に状態を扱う"],
    whenAdopted: ["Vue で状態管理が必要なとき"],
    related: [
      { name: "Zustand", id: "zustand", note: "React 向けの軽量状態管理" },
      { name: "Vue", id: "vue", note: "Pinia は Vue 用" },
    ],
  },
  "tanstack-query": {
    id: "tanstack-query", name: "TanStack Query", aliases: ["React Query"], category: "フロントエンド / データ取得",
    summary: "サーバーデータの取得・キャッシュ・再取得を扱うライブラリ（旧 React Query）。非同期データの状態管理を大幅に簡略化する。",
    canDo: ["API データのキャッシュと自動再取得", "ローディング/エラー状態を宣言的に扱う"],
    whenAdopted: ["サーバーデータを多用する SPA", "自前のフェッチ管理が煩雑になったとき"],
    related: [
      { name: "Redux Toolkit", id: "redux", note: "クライアント状態向け。サーバーデータは Query が得意" },
    ],
  },
  remix: {
    id: "remix", name: "Remix", category: "フロントエンド / メタフレームワーク",
    summary: "React ベースのフルスタックフレームワーク。Web 標準に忠実で、サーバーとのデータのやり取りを重視する。",
    canDo: ["SSR とネストされたルーティング", "フォーム・データ取得を Web 標準で"],
    whenAdopted: ["Web 標準志向の React アプリ"],
    related: [
      { name: "Next.js", id: "nextjs", note: "同じ React 系。最も普及" },
    ],
  },
  deno: {
    id: "deno", name: "Deno", category: "バックエンド / ランタイム",
    summary: "TypeScript を標準サポートし、セキュアな設計を持つ JavaScript ランタイム。Node.js の作者による再設計版。",
    canDo: ["設定なしで TypeScript を実行", "権限ベースの安全な実行"],
    whenAdopted: ["TS をそのまま動かしたいとき", "セキュアなスクリプト実行"],
    related: [
      { name: "Node.js", id: "nodejs", note: "最も普及。Deno はより現代的な設計" },
      { name: "Bun", id: "bun", note: "速度を売りにする新興ランタイム" },
    ],
  },
  bun: {
    id: "bun", name: "Bun", category: "バックエンド / ランタイム",
    summary: "起動・実行が高速な JavaScript ランタイム兼ツールキット。パッケージ管理やバンドルも内蔵する。",
    canDo: ["高速に JS/TS を実行", "インストール・テスト・バンドルを一体で"],
    whenAdopted: ["速度を重視する開発", "ツールチェーンを1つにまとめたいとき"],
    related: [
      { name: "Node.js", id: "nodejs", note: "最も普及・安定" },
      { name: "Deno", id: "deno", note: "セキュリティ志向の代替" },
    ],
  },
  webpack: {
    id: "webpack", name: "webpack", category: "フロントエンド / ビルドツール",
    summary: "従来から定番のモジュールバンドラ。設定の柔軟性が高い一方、起動は Vite などより遅め。",
    canDo: ["複雑なビルド要件に細かく対応", "多様なローダー/プラグインで拡張"],
    whenAdopted: ["既存の大規模プロジェクト", "細かいビルド制御が必要なとき"],
    related: [
      { name: "Vite", id: "vite", note: "起動・HMR が高速な現代的代替" },
      { name: "Turbopack", id: "turbopack", note: "Next.js 向けの高速バンドラ" },
    ],
  },
  turbopack: {
    id: "turbopack", name: "Turbopack", category: "フロントエンド / ビルドツール",
    summary: "Rust 製の高速バンドラ。Next.js の開発サーバー高速化を狙って作られている。",
    canDo: ["大規模プロジェクトでも高速な更新", "Next.js と統合"],
    whenAdopted: ["Next.js で開発体験を高速化したいとき"],
    related: [
      { name: "Vite", id: "vite", note: "汎用の高速ビルドツール" },
      { name: "webpack", id: "webpack", note: "従来の定番" },
    ],
  },
  mui: {
    id: "mui", name: "MUI", aliases: ["Material UI"], category: "フロントエンド / UI 部品",
    summary: "Material Design ベースの React 向け UI コンポーネントライブラリ。既製の部品で素早く UI を組める。",
    canDo: ["既製の高品質な UI 部品を利用", "テーマでデザインを統一"],
    whenAdopted: ["デザインを一から作らず素早く形にしたいとき"],
    related: [
      { name: "shadcn/ui", id: "shadcn", note: "コピー＆カスタマイズ型の UI 部品" },
      { name: "Chakra UI", note: "アクセシビリティ重視の UI ライブラリ" },
    ],
  },
  shadcn: {
    id: "shadcn", name: "shadcn/ui", category: "フロントエンド / UI 部品",
    summary: "コンポーネントをプロジェクトにコピーして使う UI 集。Tailwind CSS ベースで自由にカスタマイズできる。",
    canDo: ["必要な部品だけ取り込み自分で所有", "Tailwind で細かくカスタマイズ"],
    whenAdopted: ["デザインの自由度と再利用を両立したいとき"],
    related: [
      { name: "MUI", id: "mui", note: "パッケージ型の UI ライブラリ" },
      { name: "Tailwind CSS", id: "tailwind", note: "shadcn/ui の土台" },
    ],
  },

  // ───────── バックエンド周辺（ORM・認証・ジョブ） ─────────
  prisma: {
    id: "prisma", name: "Prisma", category: "バックエンド / ORM",
    summary: "TypeScript/Node.js 向けの型安全な ORM。スキーマ定義から型とクエリクライアントを生成する。",
    canDo: ["型安全に DB を操作", "マイグレーションを管理", "スキーマから型を自動生成"],
    whenAdopted: ["TypeScript バックエンドで DB を扱うとき"],
    related: [
      { name: "TypeORM", id: "typeorm", note: "デコレータベースの Node 向け ORM" },
      { name: "SQLAlchemy", id: "sqlalchemy", note: "Python の代表的 ORM" },
    ],
  },
  typeorm: {
    id: "typeorm", name: "TypeORM", category: "バックエンド / ORM",
    summary: "TypeScript/JavaScript 向けの ORM。エンティティをクラスで定義し、デコレータでマッピングする。",
    canDo: ["クラスで DB モデルを定義", "リレーションやマイグレーションを扱う"],
    whenAdopted: ["Node/NestJS で従来型 ORM を使いたいとき"],
    related: [
      { name: "Prisma", id: "prisma", note: "スキーマ駆動で型安全さが高い" },
    ],
  },
  sqlalchemy: {
    id: "sqlalchemy", name: "SQLAlchemy", category: "バックエンド / ORM",
    summary: "Python の代表的な ORM/DB ツールキット。柔軟なクエリ構築と ORM 機能を提供する。",
    canDo: ["Python から DB を操作", "生 SQL に近い制御も可能"],
    whenAdopted: ["Python バックエンド（FastAPI/Flask 等）で DB を扱うとき"],
    related: [
      { name: "Prisma", id: "prisma", note: "TypeScript 向けの型安全 ORM" },
    ],
  },
  celery: {
    id: "celery", name: "Celery", category: "バックエンド / 非同期ジョブ",
    summary: "Python の分散タスクキュー。メール送信や重い処理をバックグラウンドで非同期に実行する。",
    canDo: ["時間のかかる処理を裏で実行", "定期タスク・リトライを管理"],
    whenAdopted: ["Python アプリで非同期処理が必要なとき"],
    related: [
      { name: "BullMQ", note: "Node.js のジョブキュー" },
      { name: "Sidekiq", note: "Ruby のジョブキュー" },
    ],
  },
  jwt: {
    id: "jwt", name: "JWT", aliases: ["JSON Web Token"], category: "認証 / トークン",
    summary: "署名付きのトークンでユーザー情報を安全にやり取りする方式。ステートレスな認証に使われる。",
    canDo: ["サーバーにセッションを持たず認証", "API 間で認証情報を受け渡す"],
    whenAdopted: ["SPA/モバイルからの API 認証", "マイクロサービス間の認証"],
    related: [
      { name: "セッション", note: "サーバー側で状態を持つ従来型認証" },
      { name: "OAuth", id: "oauth", note: "外部サービス連携の認可の仕組み" },
    ],
  },
  oauth: {
    id: "oauth", name: "OAuth", category: "認証 / 認可",
    summary: "『Google でログイン』のように、外部サービスの権限を安全に委譲する認可の標準プロトコル。",
    canDo: ["外部アカウントでのログインを実現", "パスワードを預けずに権限を委譲"],
    whenAdopted: ["ソーシャルログイン", "他サービスの API を代理で使うとき"],
    related: [
      { name: "JWT", id: "jwt", note: "トークンの表現形式としてよく併用される" },
    ],
  },

  // ───────── データベース（追加） ─────────
  firestore: {
    id: "firestore", name: "Firestore", category: "データベース / NoSQL",
    summary: "Google(Firebase)のマネージドなドキュメント型 NoSQL。リアルタイム同期とスケールが特徴。",
    canDo: ["リアルタイムにデータを同期", "サーバーレスでスケール"],
    whenAdopted: ["モバイル/Web のリアルタイムアプリ", "バックエンドを最小限にしたいとき"],
    related: [
      { name: "MongoDB", id: "mongodb", note: "自前運用も可能なドキュメント DB" },
    ],
  },
  memcached: {
    id: "memcached", name: "Memcached", category: "データベース / キャッシュ",
    summary: "シンプルで高速なメモリキャッシュ。純粋なキャッシュ用途に特化している。",
    canDo: ["高速なキャッシュを提供", "セッションの一時保存"],
    whenAdopted: ["純粋なキャッシュだけが欲しいとき"],
    related: [
      { name: "Redis", id: "redis", note: "より多機能（永続化・データ構造）" },
    ],
  },
  cassandra: {
    id: "cassandra", name: "Cassandra", aliases: ["ScyllaDB"], category: "データベース / NoSQL",
    summary: "大量の書き込みと水平スケールに強い分散型ワイドカラム DB。時系列や大規模データ向き。",
    canDo: ["膨大な書き込みを分散して処理", "無停止でスケール"],
    whenAdopted: ["超大規模・高書き込みのシステム", "時系列データ"],
    related: [
      { name: "MongoDB", id: "mongodb", note: "ドキュメント型 NoSQL" },
    ],
  },
  neo4j: {
    id: "neo4j", name: "Neo4j", category: "データベース / グラフ",
    summary: "ノードとエッジでデータを表すグラフデータベース。つながりの探索が高速。",
    canDo: ["人間関係・推薦などの関係を辿る", "複雑なつながりを高速に検索"],
    whenAdopted: ["ソーシャルグラフ・推薦・不正検知"],
    related: [
      { name: "PostgreSQL", id: "postgresql", note: "一般的な関係データは RDB で十分なことも" },
    ],
  },
  dynamodb: {
    id: "dynamodb", name: "DynamoDB", category: "データベース / NoSQL",
    summary: "AWS のフルマネージドなキーバリュー/ドキュメント DB。高スケール・低レイテンシが特徴。",
    canDo: ["サーバーレスで自動スケール", "大規模でも安定した低遅延"],
    whenAdopted: ["AWS 上の高スケールなアプリ", "運用を任せたいとき"],
    related: [
      { name: "MongoDB", id: "mongodb", note: "自前運用も可能なドキュメント DB" },
    ],
  },
  pinecone: {
    id: "pinecone", name: "Pinecone", category: "データベース / ベクトル",
    summary: "フルマネージドなベクトルデータベース。埋め込みの保存と高速な類似検索を提供する。",
    canDo: ["埋め込みを保存し意味検索", "運用不要でスケール"],
    whenAdopted: ["RAG・レコメンドの検索基盤を手早く用意したいとき"],
    related: [
      { name: "Qdrant", id: "qdrant", note: "OSS の高速ベクトル DB" },
      { name: "pgvector", id: "pgvector", note: "PostgreSQL 拡張として使える" },
    ],
  },
  qdrant: {
    id: "qdrant", name: "Qdrant", category: "データベース / ベクトル",
    summary: "Rust 製の高速な OSS ベクトルデータベース。自前ホストもクラウドも選べる。",
    canDo: ["埋め込みの類似検索", "フィルタ付きのベクトル検索"],
    whenAdopted: ["セルフホストしたい RAG 基盤"],
    related: [
      { name: "Pinecone", id: "pinecone", note: "フルマネージド型" },
      { name: "pgvector", id: "pgvector", note: "Postgres 拡張型" },
    ],
  },
  opensearch: {
    id: "opensearch", name: "OpenSearch", aliases: ["Meilisearch"], category: "データベース / 検索",
    summary: "Elasticsearch から派生した OSS の検索・分析エンジン。全文検索やログ分析に使う。",
    canDo: ["全文検索・集計", "ログの収集と可視化"],
    whenAdopted: ["OSS ライセンスで検索基盤を作りたいとき"],
    related: [
      { name: "Elasticsearch", id: "elasticsearch", note: "派生元。機能はほぼ同等" },
    ],
  },

  // ───────── コンテナ / インフラ（追加） ─────────
  containerd: {
    id: "containerd", name: "containerd", aliases: ["runc"], category: "コンテナ / ランタイム",
    summary: "Docker の下で実際にコンテナを動かす標準ランタイム。Kubernetes からも直接利用される。",
    canDo: ["イメージの取得とコンテナ実行", "上位ツール(Docker/k8s)の土台"],
    whenAdopted: ["低レイヤのコンテナ実行基盤として"],
    related: [
      { name: "Docker", id: "docker", note: "containerd を含む上位のツール群" },
    ],
  },
  traefik: {
    id: "traefik", name: "Traefik", category: "インフラ / リバースプロキシ",
    summary: "コンテナと連携し、自動でルーティングと HTTPS 化を行うリバースプロキシ。",
    canDo: ["サービスを自動検出してルーティング", "Let's Encrypt で自動 HTTPS"],
    whenAdopted: ["Docker/k8s 環境の入口", "証明書管理を自動化したいとき"],
    related: [
      { name: "nginx", id: "nginx", note: "定番。設定は手動寄り" },
      { name: "Caddy", id: "caddy", note: "設定が簡単で自動 HTTPS 標準" },
    ],
  },
  caddy: {
    id: "caddy", name: "Caddy", category: "インフラ / Web サーバー",
    summary: "設定が非常にシンプルで、自動 HTTPS を標準搭載した Web サーバー/リバースプロキシ。",
    canDo: ["最小設定で HTTPS を有効化", "静的配信・リバースプロキシ"],
    whenAdopted: ["手軽に HTTPS 付きで公開したいとき"],
    related: [
      { name: "nginx", id: "nginx", note: "高機能・高速だが設定は手動" },
      { name: "Traefik", id: "traefik", note: "コンテナ自動連携が強い" },
    ],
  },
  prometheus: {
    id: "prometheus", name: "Prometheus", category: "インフラ / 監視",
    summary: "メトリクスを収集・保存する監視システム。時系列データをクエリでき、アラートも設定できる。",
    canDo: ["サーバー/アプリのメトリクスを収集", "しきい値でアラート"],
    whenAdopted: ["システムの監視・可観測性が必要なとき"],
    related: [
      { name: "Grafana", id: "grafana", note: "収集したメトリクスを可視化する相棒" },
    ],
  },
  grafana: {
    id: "grafana", name: "Grafana", category: "インフラ / 可視化",
    summary: "メトリクスやログをダッシュボードで可視化するツール。Prometheus 等と組み合わせて使う。",
    canDo: ["メトリクスをグラフで可視化", "ダッシュボードとアラートを作成"],
    whenAdopted: ["監視データを見やすくしたいとき"],
    related: [
      { name: "Prometheus", id: "prometheus", note: "データ収集側。Grafana は表示側" },
    ],
  },

  // ───────── クラウド（サービス別） ─────────
  ec2: {
    id: "ec2", name: "Amazon EC2", aliases: ["EC2"], category: "クラウド / IaaS",
    summary: "AWS の仮想マシンサービス。OS から自由に構成できる、クラウドの最も基本的な計算資源。",
    canDo: ["仮想サーバーを必要な分だけ起動", "OS・ミドルウェアを自由に構成"],
    whenAdopted: ["自由度の高いサーバーが欲しいとき", "既存アプリのクラウド移行"],
    related: [
      { name: "AWS Lambda", id: "lambda", note: "サーバー管理不要のサーバーレス" },
      { name: "VPS", id: "vps", note: "月額固定でシンプルな代替" },
    ],
  },
  lambda: {
    id: "lambda", name: "AWS Lambda", aliases: ["Lambda"], category: "クラウド / サーバーレス",
    summary: "サーバーを意識せず関数単位でコードを実行する AWS のサーバーレスサービス。使った分だけ課金。",
    canDo: ["イベントに応じて関数を自動実行", "サーバー運用なしでスケール"],
    whenAdopted: ["軽量な API・バッチ・イベント処理", "運用を最小化したいとき"],
    related: [
      { name: "Cloud Run", id: "cloudrun", note: "コンテナ単位のサーバーレス" },
      { name: "Amazon EC2", id: "ec2", note: "常時起動の仮想マシン" },
    ],
  },
  cloudrun: {
    id: "cloudrun", name: "Cloud Run", category: "クラウド / サーバーレス",
    summary: "コンテナをそのままサーバーレスで動かせる GCP のサービス。リクエストに応じて自動スケールする。",
    canDo: ["コンテナをデプロイするだけで公開", "ゼロから自動スケール"],
    whenAdopted: ["コンテナを手軽に本番公開したいとき", "運用を任せたいとき"],
    related: [
      { name: "AWS Lambda", id: "lambda", note: "関数単位のサーバーレス" },
      { name: "Kubernetes", id: "kubernetes", note: "大規模・自前運用向け" },
    ],
  },
  s3: {
    id: "s3", name: "Amazon S3", aliases: ["S3"], category: "クラウド / ストレージ",
    summary: "AWS のオブジェクトストレージ。画像・動画・バックアップなどのファイルを安価かつ大容量に保存できる。",
    canDo: ["大量のファイルを保存・配信", "静的サイトのホスティング"],
    whenAdopted: ["ユーザーアップロードやバックアップの保存", "静的アセットの配信"],
    related: [
      { name: "Cloud Storage", note: "GCP の相当サービス" },
      { name: "Blob Storage", note: "Azure の相当サービス" },
    ],
  },

  // ───────── モバイル（追加） ─────────
  swiftui: {
    id: "swiftui", name: "SwiftUI", category: "モバイル / iOS UI",
    summary: "Apple の宣言的 UI フレームワーク。Swift で iOS/macOS の画面を少ないコードで構築できる。",
    canDo: ["宣言的に UI を記述", "プレビューで即確認"],
    whenAdopted: ["新規の iOS/macOS アプリ"],
    related: [
      { name: "Swift", id: "swift", note: "SwiftUI を書く言語" },
      { name: "Jetpack Compose", id: "jetpack-compose", note: "Android 側の宣言的 UI" },
    ],
  },
  "jetpack-compose": {
    id: "jetpack-compose", name: "Jetpack Compose", category: "モバイル / Android UI",
    summary: "Android の宣言的 UI ツールキット。Kotlin で少ないコードで画面を構築できる。",
    canDo: ["宣言的に Android UI を記述", "状態に応じた再描画"],
    whenAdopted: ["新規の Android アプリ"],
    related: [
      { name: "Kotlin", id: "kotlin", note: "Compose を書く言語" },
      { name: "SwiftUI", id: "swiftui", note: "iOS 側の宣言的 UI" },
    ],
  },
  "kotlin-multiplatform": {
    id: "kotlin-multiplatform", name: "Kotlin Multiplatform", aliases: ["KMP"], category: "モバイル / クロスプラットフォーム",
    summary: "ビジネスロジックを Kotlin で共有しつつ、UI は各 OS ネイティブで作るクロスプラットフォーム技術。",
    canDo: ["ロジックを iOS/Android で共有", "UI はネイティブ品質を維持"],
    whenAdopted: ["UI 品質を保ちつつ重複を減らしたいとき"],
    related: [
      { name: "Flutter", id: "flutter", note: "UI も共有する。KMP はロジックのみ共有" },
      { name: "React Native", id: "react-native", note: "JS で UI も共有" },
    ],
  },
  "dotnet-maui": {
    id: "dotnet-maui", name: ".NET MAUI", category: "モバイル / クロスプラットフォーム",
    summary: "C#/.NET で iOS/Android/デスクトップ向けアプリを作るクロスプラットフォームフレームワーク。",
    canDo: ["C# 資産で複数プラットフォームに対応", "ネイティブ UI を呼び出す"],
    whenAdopted: [".NET 環境・企業内アプリ"],
    related: [
      { name: "Flutter", id: "flutter", note: "Dart 製のクロス開発" },
    ],
  },
  dart: {
    id: "dart", name: "Dart", category: "言語 / モバイル",
    summary: "Flutter で使われる Google 製の言語。UI 記述に適した文法と高速な実行が特徴。",
    canDo: ["Flutter アプリを記述", "AOT/JIT で高速に実行"],
    whenAdopted: ["Flutter を使うとき"],
    related: [
      { name: "Flutter", id: "flutter", note: "Dart で書くクロス開発 FW" },
    ],
  },

  // ───────── デスクトップ / 言語（追加） ─────────
  dotnet: {
    id: "dotnet", name: ".NET (WPF / WinUI)", aliases: [".NET", "WPF", "WinUI"], category: "デスクトップ / GUI",
    summary: "Microsoft の C# 製アプリ基盤。WPF/WinUI で Windows のデスクトップ業務アプリを作る定番。",
    canDo: ["Windows ネイティブ GUI を構築", "C#/.NET 資産を活用"],
    whenAdopted: ["Windows 中心の業務アプリ"],
    related: [
      { name: "Qt", id: "qt", note: "クロスプラットフォームの GUI" },
      { name: "Electron", id: "electron", note: "Web 技術でクロス GUI" },
    ],
  },
  cpp: {
    id: "cpp", name: "C++", category: "言語 / システム",
    summary: "高性能・低レイヤ制御が可能な言語。ゲーム・組込み・高速な GUI(Qt)など性能が要る領域で使われる。",
    canDo: ["ハードウェアに近い高速な処理", "既存の巨大な C++ 資産を活用"],
    whenAdopted: ["性能が最重要な領域", "組込み・ゲーム・システム"],
    related: [
      { name: "Rust", id: "rust", note: "メモリ安全を保証する現代的代替" },
    ],
  },
  java: {
    id: "java", name: "Java", category: "言語 / バックエンド",
    summary: "堅牢で移植性が高い言語。エンタープライズシステムや Android で長く使われる。",
    canDo: ["大規模・堅牢なバックエンドを構築", "豊富な企業向けライブラリを利用"],
    whenAdopted: ["エンタープライズ・大規模システム"],
    related: [
      { name: "Kotlin", id: "kotlin", note: "Java と相互運用できる現代的言語" },
      { name: "Spring Boot", id: "spring-boot", note: "Java の定番フレームワーク" },
    ],
  },
  csharp: {
    id: "csharp", name: "C#", category: "言語 / バックエンド・アプリ",
    summary: "Microsoft の汎用言語。ASP.NET Core・.NET・Unity など幅広い領域で使われる。",
    canDo: ["Web・デスクトップ・ゲームを開発", ".NET エコシステムを活用"],
    whenAdopted: ["Microsoft 環境", "Unity でのゲーム開発"],
    related: [
      { name: "Java", id: "java", note: "似た立ち位置の言語" },
      { name: "ASP.NET Core", id: "aspnet", note: "C# のバックエンドFW" },
    ],
  },
  javascript: {
    id: "javascript", name: "JavaScript", aliases: ["JS"], category: "言語 / Web",
    summary: "ブラウザで動く唯一の標準言語。Node.js によりサーバーでも動き、Web の中心的存在。",
    canDo: ["ブラウザの UI を動かす", "Node.js でサーバーも書く"],
    whenAdopted: ["あらゆる Web 開発"],
    related: [
      { name: "TypeScript", id: "typescript", note: "型を加えた実務標準" },
    ],
  },

  // ───────── AI モデル / ツール ─────────
  openai: {
    id: "openai", name: "OpenAI (GPT)", aliases: ["OpenAI", "GPT", "ChatGPT"], category: "AI / LLM",
    summary: "GPT シリーズを提供する API 型 LLM。高性能で、テキスト生成・要約・コード生成などに幅広く使える。",
    canDo: ["高品質なテキスト/コード生成", "API ですぐアプリに組み込む"],
    whenAdopted: ["まず高性能な LLM を手軽に使いたいとき"],
    related: [
      { name: "Claude", id: "claude", note: "Anthropic の LLM" },
      { name: "Gemini", id: "gemini", note: "Google の LLM" },
    ],
  },
  claude: {
    id: "claude", name: "Claude", aliases: ["Anthropic"], category: "AI / LLM",
    summary: "Anthropic の API 型 LLM。長文の扱いや丁寧な推論、コーディング支援に強みを持つ。",
    canDo: ["長文の理解・生成", "コーディングや分析の支援"],
    whenAdopted: ["高性能な LLM を API で使いたいとき"],
    related: [
      { name: "OpenAI (GPT)", id: "openai", note: "GPT 系の LLM" },
      { name: "Gemini", id: "gemini", note: "Google の LLM" },
    ],
  },
  gemini: {
    id: "gemini", name: "Gemini", category: "AI / LLM",
    summary: "Google の API 型 LLM。マルチモーダル対応や Google サービスとの連携が特徴。",
    canDo: ["テキスト・画像などを扱う", "Google エコシステムと連携"],
    whenAdopted: ["Google 環境で LLM を使うとき"],
    related: [
      { name: "OpenAI (GPT)", id: "openai", note: "GPT 系の LLM" },
      { name: "Claude", id: "claude", note: "Anthropic の LLM" },
    ],
  },
  llama: {
    id: "llama", name: "Llama", aliases: ["Mistral", "Qwen", "Gemma"], category: "AI / オープンモデル",
    summary: "Meta の代表的なオープンウェイト LLM。自前ホストや微調整ができ、Mistral・Qwen・Gemma なども同種。",
    canDo: ["モデルを自前で動かす・改変する", "機密データを外部に出さず利用"],
    whenAdopted: ["コスト・機密性・カスタマイズを重視するとき"],
    related: [
      { name: "Ollama", id: "ollama", note: "オープンモデルを手軽に動かすツール" },
      { name: "vLLM", id: "vllm", note: "本番の高スループット推論" },
    ],
  },
  lmstudio: {
    id: "lmstudio", name: "LM Studio", category: "AI / ローカル実行",
    summary: "GUI でオープン LLM を手元にダウンロードして動かせるデスクトップアプリ。",
    canDo: ["GUI でモデルを試す", "ローカル API サーバーを立てる"],
    whenAdopted: ["手元で気軽に LLM を試したいとき"],
    related: [
      { name: "Ollama", id: "ollama", note: "CLI 中心のローカル実行" },
    ],
  },
  crewai: {
    id: "crewai", name: "CrewAI", aliases: ["AutoGen"], category: "AI エージェント / マルチエージェント",
    summary: "複数の AI エージェントに役割を与えて協調させるフレームワーク。AutoGen も同種のマルチエージェント基盤。",
    canDo: ["役割ごとのエージェントを協調させる", "分業でタスクを解かせる"],
    whenAdopted: ["複数エージェントの協調が必要な複雑タスク"],
    related: [
      { name: "LangGraph", id: "langgraph", note: "状態遷移でエージェントを制御" },
      { name: "LangChain", id: "langchain", note: "汎用のエージェント/LLM 基盤" },
    ],
  },
  "function-calling": {
    id: "function-calling", name: "Function calling", aliases: ["関数呼び出し"], category: "AI エージェント / 連携",
    summary: "LLM に『どの関数をどの引数で呼ぶべきか』を判断させ、ツールを実行させる仕組み。エージェントの基礎。",
    canDo: ["LLM に外部ツール/APIを呼ばせる", "構造化された出力を得る"],
    whenAdopted: ["LLM に検索・計算・DB 操作をさせたいとき"],
    related: [
      { name: "MCP", id: "mcp", note: "ツール接続を標準化したプロトコル" },
    ],
  },
  playwright: {
    id: "playwright", name: "Playwright", category: "ブラウザ自動化 / テスト",
    summary: "ブラウザを自動操作するツール。E2E テストや、エージェントの Web 操作に使われる。",
    canDo: ["ブラウザ操作を自動化", "E2E テストを書く"],
    whenAdopted: ["Web の自動操作・テスト", "エージェントにブラウザ操作をさせるとき"],
    related: [
      { name: "Selenium", note: "従来からのブラウザ自動化ツール" },
    ],
  },

  // ───────── 機械学習（追加） ─────────
  tensorflow: {
    id: "tensorflow", name: "TensorFlow / Keras", aliases: ["TensorFlow", "Keras"], category: "機械学習 / 深層学習",
    summary: "Google 製の深層学習フレームワーク。本番・モバイル配備に実績があり、Keras は使いやすい高レベル API。",
    canDo: ["ニューラルネットを構築・学習", "モバイル/組込みへ配備(TF Lite)"],
    whenAdopted: ["本番配備・モバイル推論を重視するとき"],
    related: [
      { name: "PyTorch", id: "pytorch", note: "研究・実装で主流。より柔軟" },
      { name: "JAX", id: "jax", note: "高速な数値計算・研究向け" },
    ],
  },
  jax: {
    id: "jax", name: "JAX", category: "機械学習 / 数値計算",
    summary: "Google 製の高速な数値計算ライブラリ。自動微分と GPU/TPU 対応で、研究や大規模学習に使われる。",
    canDo: ["自動微分で勾配計算", "GPU/TPU で高速に計算"],
    whenAdopted: ["最先端研究・大規模学習・高速化が必要なとき"],
    related: [
      { name: "PyTorch", id: "pytorch", note: "より一般的で扱いやすい" },
    ],
  },
  catboost: {
    id: "catboost", name: "CatBoost", category: "機械学習 / 勾配ブースティング",
    summary: "カテゴリ変数の扱いに優れた勾配ブースティングライブラリ。前処理を減らせるのが特徴。",
    canDo: ["カテゴリ特徴量をそのまま扱う", "表データで高精度な予測"],
    whenAdopted: ["カテゴリ変数が多い表データ"],
    related: [
      { name: "XGBoost / LightGBM", id: "xgboost", note: "同じ勾配ブースティングの定番" },
    ],
  },
  polars: {
    id: "polars", name: "Polars", category: "機械学習 / データ処理",
    summary: "Rust 製の高速なデータフレームライブラリ。大きなデータでも pandas より速く処理できる。",
    canDo: ["大規模な表データを高速に処理", "並列・遅延評価で効率化"],
    whenAdopted: ["pandas が遅いと感じる大きなデータ"],
    related: [
      { name: "pandas", id: "pandas", note: "最も普及。Polars はより高速" },
    ],
  },
  spark: {
    id: "spark", name: "Apache Spark", aliases: ["Spark"], category: "機械学習 / 分散処理",
    summary: "大規模データを複数マシンで分散処理するエンジン。1台に載らないデータの ETL や分析に使う。",
    canDo: ["巨大データを分散処理", "SQL・ストリーミング・ML を統合"],
    whenAdopted: ["1台に収まらない大規模データ処理"],
    related: [
      { name: "Dask", id: "dask", note: "Python 寄りの分散処理" },
    ],
  },
  dask: {
    id: "dask", name: "Dask", category: "機械学習 / 分散処理",
    summary: "pandas/NumPy に近い API で並列・分散処理ができる Python ライブラリ。",
    canDo: ["メモリに載らないデータを分割処理", "既存の Python コードを並列化"],
    whenAdopted: ["Python 資産を活かして大規模処理したいとき"],
    related: [
      { name: "Apache Spark", id: "spark", note: "より大規模・多言語な分散基盤" },
    ],
  },
  airflow: {
    id: "airflow", name: "Airflow", aliases: ["Apache Airflow"], category: "機械学習 / パイプライン",
    summary: "処理の依存関係をDAGで定義し、スケジュール実行するワークフローオーケストレーター。",
    canDo: ["前処理→学習→評価などを自動実行", "定期実行・依存管理・再試行"],
    whenAdopted: ["データ/ML パイプラインの自動化・運用"],
    related: [
      { name: "Kubeflow", id: "kubeflow", note: "Kubernetes 上の ML パイプライン" },
    ],
  },
  kubeflow: {
    id: "kubeflow", name: "Kubeflow", category: "機械学習 / MLOps",
    summary: "Kubernetes 上で ML のパイプラインや学習・配信を管理する基盤。大規模な MLOps 向け。",
    canDo: ["k8s 上で学習・パイプラインを実行", "スケーラブルなモデル配信"],
    whenAdopted: ["Kubernetes を使う大規模 ML 運用"],
    related: [
      { name: "Airflow", id: "airflow", note: "汎用のワークフロー基盤" },
      { name: "MLflow / W&B", id: "mlflow", note: "実験管理に特化" },
    ],
  },
  bentoml: {
    id: "bentoml", name: "BentoML", aliases: ["TorchServe", "Triton"], category: "機械学習 / モデル配信",
    summary: "学習済みモデルを API として配信するためのフレームワーク。推論サーバーの構築・パッケージ化を助ける。",
    canDo: ["モデルを API として公開", "推論サーバーをコンテナ化"],
    whenAdopted: ["学習したモデルを本番で提供するとき"],
    related: [
      { name: "FastAPI", id: "fastapi", note: "自前で推論 API を書く選択肢" },
    ],
  },
  mlops: {
    id: "mlops", name: "MLOps", category: "機械学習 / 運用",
    summary: "データ整備・学習・デプロイ・監視までを継続的に回す、機械学習版の DevOps の考え方と実践。",
    canDo: ["モデル開発を再現可能に体系化", "本番の精度劣化を監視・改善"],
    whenAdopted: ["ML を継続的に本番運用するとき"],
    related: [
      { name: "MLflow / W&B", id: "mlflow", note: "実験管理は MLOps の一部" },
      { name: "Docker", id: "docker", note: "再現性のあるML環境の土台" },
    ],
  },
  sagemaker: {
    id: "sagemaker", name: "Amazon SageMaker", aliases: ["SageMaker", "Vertex AI"], category: "機械学習 / クラウド基盤",
    summary: "AWS のフルマネージド ML プラットフォーム。データ準備から学習・デプロイ・監視まで一貫して行える（GCP は Vertex AI）。",
    canDo: ["クラウドで学習・チューニング・配信", "運用まで一体で管理"],
    whenAdopted: ["クラウドで ML を運用したいとき"],
    related: [
      { name: "Vertex AI", note: "GCP の相当サービス" },
      { name: "MLflow / W&B", id: "mlflow", note: "クラウド非依存の実験管理" },
    ],
  },

  // ═════════ 開発ツール / バージョン管理 ═════════
  git: {
    id: "git", name: "Git", category: "開発ツール / バージョン管理",
    summary: "コードの変更履歴を分散管理するバージョン管理システム。ブランチで並行開発し、履歴を追える。ほぼ全ての開発の土台。",
    canDo: ["変更履歴の記録と巻き戻し", "ブランチで並行開発・マージ", "チームでのコード共有"],
    whenAdopted: ["あらゆるソフトウェア開発", "個人・チーム問わず標準"],
    related: [
      { name: "GitHub", id: "github", note: "Git のホスティング＋協業サービス" },
      { name: "Mercurial", note: "かつての代替 VCS。今は Git が主流" },
    ],
    usedBy: ["ほぼ全てのIT企業", "Linux カーネル開発"],
  },
  github: {
    id: "github", name: "GitHub", category: "開発ツール / コード共有",
    summary: "Git リポジトリのホスティングと、Issue・Pull Request・CI(Actions)を備えた開発プラットフォーム。OSS の中心地。",
    canDo: ["コードのホスティングとレビュー(PR)", "Issue でタスク管理", "Actions で CI/CD"],
    whenAdopted: ["OSS・チーム開発", "ポートフォリオ公開"],
    related: [
      { name: "GitLab", id: "gitlab", note: "自己ホスト・CI 統合に強い代替" },
      { name: "Bitbucket", note: "Atlassian 製。Jira 連携が強い" },
    ],
    usedBy: ["世界中の開発者・OSS", "Microsoft(所有)"],
  },
  gitlab: {
    id: "gitlab", name: "GitLab", category: "開発ツール / DevOps プラットフォーム",
    summary: "Git ホスティングに CI/CD・課題管理・セキュリティを統合した DevOps プラットフォーム。自己ホストできるのが強み。",
    canDo: ["リポジトリ管理と CI/CD を一体で", "自社サーバーに自己ホスト", "計画〜運用まで一気通貫"],
    whenAdopted: ["自己ホスト要件のある企業", "統合された DevOps を求めるとき"],
    related: [
      { name: "GitHub", id: "github", note: "OSS・エコシステムが最大" },
    ],
    usedBy: ["NASA", "Sony", "Goldman Sachs"],
  },
  vscode: {
    id: "vscode", name: "VS Code", category: "開発ツール / エディタ",
    summary: "Microsoft 製の軽量で拡張性の高いコードエディタ。豊富な拡張機能で多言語・多用途に対応し、事実上の標準。",
    canDo: ["多言語のコーディング・デバッグ", "拡張機能で機能を追加", "Git 統合・リモート開発"],
    whenAdopted: ["あらゆる言語の開発", "軽量なエディタが欲しいとき"],
    related: [
      { name: "JetBrains", id: "jetbrains", note: "言語特化の高機能 IDE 群" },
      { name: "Neovim", note: "ターミナルベースの高速エディタ" },
    ],
    usedBy: ["世界中の開発者（最も普及）"],
  },
  jetbrains: {
    id: "jetbrains", name: "JetBrains", aliases: ["IntelliJ IDEA", "IntelliJ", "PyCharm", "WebStorm"], category: "開発ツール / IDE",
    summary: "IntelliJ IDEA・PyCharm・WebStorm など言語特化の高機能 IDE 群。強力な補完・リファクタリング・解析が特徴。",
    canDo: ["高度なコード補完・リファクタリング", "言語ごとに最適化された IDE", "デバッグ・テスト統合"],
    whenAdopted: ["Java/Kotlin など特定言語の本格開発", "大規模プロジェクト"],
    related: [
      { name: "VS Code", id: "vscode", note: "軽量・汎用。JetBrains は重厚・高機能" },
    ],
    usedBy: ["Google(Android Studio の基盤)", "多くの企業開発チーム"],
  },
  eslint: {
    id: "eslint", name: "ESLint", category: "開発ツール / Lint",
    summary: "JavaScript/TypeScript のコードを静的解析し、バグの元やスタイル違反を指摘するリンター。",
    canDo: ["コードの問題を自動検出", "チームでコード規約を統一", "自動修正(--fix)"],
    whenAdopted: ["JS/TS プロジェクト全般"],
    related: [
      { name: "Prettier", id: "prettier", note: "整形担当。ESLint は問題検出担当" },
      { name: "Biome", id: "biome", note: "Lint と整形を1つで高速に" },
    ],
  },
  prettier: {
    id: "prettier", name: "Prettier", category: "開発ツール / フォーマッタ",
    summary: "コードを一定のスタイルに自動整形するフォーマッタ。書式の議論をなくし、差分をきれいに保つ。",
    canDo: ["保存時にコードを自動整形", "チームで書式を統一"],
    whenAdopted: ["JS/TS/CSS など多言語のフロント開発"],
    related: [
      { name: "ESLint", id: "eslint", note: "問題検出担当。Prettier は整形担当" },
      { name: "Biome", id: "biome", note: "Lint＋整形を統合した高速代替" },
    ],
  },
  biome: {
    id: "biome", name: "Biome", category: "開発ツール / Lint・整形",
    summary: "Rust 製で高速な、Lint とフォーマットを1つにまとめたツール。ESLint+Prettier の統合・高速化を狙う。",
    canDo: ["高速に Lint と整形を実行", "設定を1つに集約"],
    whenAdopted: ["ESLint/Prettier の速度・設定を簡素化したいとき"],
    related: [
      { name: "ESLint", id: "eslint", note: "エコシステムは ESLint が最大" },
      { name: "Prettier", id: "prettier", note: "整形の定番。Biome は統合型" },
    ],
  },
  npm: {
    id: "npm", name: "npm", category: "開発ツール / パッケージマネージャ",
    summary: "Node.js 標準のパッケージマネージャ。世界最大のパッケージレジストリからライブラリを導入・管理する。",
    canDo: ["依存パッケージのインストール・管理", "スクリプトの実行", "パッケージの公開"],
    whenAdopted: ["Node.js/フロント開発全般"],
    related: [
      { name: "pnpm", id: "pnpm", note: "高速・省ディスクな代替" },
      { name: "Yarn", id: "yarn", note: "かつての人気代替" },
    ],
  },
  pnpm: {
    id: "pnpm", name: "pnpm", category: "開発ツール / パッケージマネージャ",
    summary: "ハードリンクで依存を共有し、高速かつ省ディスクな Node パッケージマネージャ。モノレポとの相性も良い。",
    canDo: ["高速なインストール", "ディスク使用量を削減", "モノレポ管理"],
    whenAdopted: ["大規模・モノレポ", "npm の速度に不満があるとき"],
    related: [
      { name: "npm", id: "npm", note: "標準。pnpm はより高速・省容量" },
      { name: "Yarn", id: "yarn", note: "もう一つの代替" },
    ],
  },
  yarn: {
    id: "yarn", name: "Yarn", category: "開発ツール / パッケージマネージャ",
    summary: "高速化とロックファイルで注目された Node パッケージマネージャ。ワークスペース(モノレポ)機能を持つ。",
    canDo: ["依存管理・ワークスペース", "決定的なインストール"],
    whenAdopted: ["既存の Yarn プロジェクト", "モノレポ"],
    related: [
      { name: "npm", id: "npm", note: "標準" },
      { name: "pnpm", id: "pnpm", note: "より高速・省容量" },
    ],
  },
  poetry: {
    id: "poetry", name: "Poetry", aliases: ["uv"], category: "開発ツール / Python パッケージ管理",
    summary: "Python の依存関係と仮想環境を一元管理するツール。pyproject.toml で再現性の高い環境を作れる（uv はより高速な新興）。",
    canDo: ["依存の解決とロック", "仮想環境の管理", "パッケージのビルド・公開"],
    whenAdopted: ["Python プロジェクトの依存管理", "再現性を重視するとき"],
    related: [
      { name: "pip", id: "pip", note: "標準。Poetry は依存解決・環境管理が強い" },
      { name: "uv", note: "Rust 製で非常に高速な新しいツール" },
    ],
  },
  pip: {
    id: "pip", name: "pip", category: "開発ツール / Python パッケージ管理",
    summary: "Python 標準のパッケージインストーラ。PyPI からライブラリを導入する最も基本的な手段。",
    canDo: ["パッケージのインストール", "requirements.txt で依存を管理"],
    whenAdopted: ["Python 開発全般"],
    related: [
      { name: "Poetry", id: "poetry", note: "依存解決・仮想環境まで管理" },
    ],
  },
  cargo: {
    id: "cargo", name: "Cargo", category: "開発ツール / Rust パッケージ管理",
    summary: "Rust の公式ビルドツール兼パッケージマネージャ。依存管理・ビルド・テストを一体で扱う。",
    canDo: ["依存管理とビルド", "テスト・ドキュメント生成"],
    whenAdopted: ["Rust 開発全般"],
    related: [
      { name: "npm", id: "npm", note: "JS 版の立ち位置" },
    ],
  },
  turborepo: {
    id: "turborepo", name: "Turborepo", aliases: ["Nx"], category: "開発ツール / モノレポ",
    summary: "複数パッケージを1リポジトリで扱うモノレポのビルドを高速化するツール。キャッシュと並列化で CI を短縮する（Nx も同種）。",
    canDo: ["変更箇所だけ再ビルド", "ビルド結果をキャッシュ・共有", "複数アプリ/ライブラリを一元管理"],
    whenAdopted: ["複数アプリ/パッケージを持つ大規模開発"],
    related: [
      { name: "Nx", note: "より多機能なモノレポ基盤" },
      { name: "pnpm", id: "pnpm", note: "ワークスペースでモノレポの土台に" },
    ],
    usedBy: ["Vercel(開発元)", "多くの大規模フロント"],
  },

  // ═════════ CI/CD・IaC ═════════
  "github-actions": {
    id: "github-actions", name: "GitHub Actions", category: "CI/CD",
    summary: "GitHub に統合された CI/CD。push などのイベントで、テスト・ビルド・デプロイのワークフローを自動実行する。",
    canDo: ["push/PR で自動テスト・ビルド", "デプロイの自動化", "豊富な既製アクションを利用"],
    whenAdopted: ["GitHub を使うプロジェクトの CI/CD", "個人〜中規模"],
    related: [
      { name: "GitLab CI", id: "gitlab-ci", note: "GitLab 統合の CI/CD" },
      { name: "CircleCI", id: "circleci", note: "独立系の CI/CD サービス" },
    ],
    usedBy: ["無数の OSS・企業リポジトリ"],
  },
  "gitlab-ci": {
    id: "gitlab-ci", name: "GitLab CI", category: "CI/CD",
    summary: "GitLab に統合された CI/CD。.gitlab-ci.yml でパイプラインを定義し、自己ホスト環境でも動かせる。",
    canDo: ["パイプラインでテスト〜デプロイ", "自己ホストランナーで実行"],
    whenAdopted: ["GitLab を使う組織", "自己ホスト CI が必要なとき"],
    related: [
      { name: "GitHub Actions", id: "github-actions", note: "GitHub 統合の CI/CD" },
      { name: "Jenkins", id: "jenkins", note: "自己ホストの老舗 CI" },
    ],
  },
  circleci: {
    id: "circleci", name: "CircleCI", category: "CI/CD",
    summary: "独立系のクラウド CI/CD サービス。並列実行やキャッシュで高速なパイプラインを組める。",
    canDo: ["クラウドで CI/CD を実行", "並列化でビルドを高速化"],
    whenAdopted: ["ホスティングに依存しない CI が欲しいとき"],
    related: [
      { name: "GitHub Actions", id: "github-actions", note: "GitHub 統合で手軽" },
    ],
  },
  jenkins: {
    id: "jenkins", name: "Jenkins", category: "CI/CD",
    summary: "自己ホスト型の老舗 CI/CD サーバー。プラグインが非常に豊富で、あらゆる環境に対応できる。",
    canDo: ["自社環境で CI/CD を構築", "プラグインで自在に拡張"],
    whenAdopted: ["オンプレ・厳密な制御が必要な組織"],
    related: [
      { name: "GitHub Actions", id: "github-actions", note: "クラウドで手軽な現代的代替" },
      { name: "ArgoCD", id: "argocd", note: "k8s への GitOps デプロイ" },
    ],
  },
  terraform: {
    id: "terraform", name: "Terraform", category: "IaC（インフラのコード化）",
    summary: "クラウドインフラを宣言的なコードで定義・構築するツール。AWS/Azure/GCP など多数のプロバイダに対応する。",
    canDo: ["インフラをコードで再現可能に構築", "複数クラウドを統一的に管理", "変更を差分(plan)で確認"],
    whenAdopted: ["クラウドインフラの構築・管理", "再現性・レビューが必要なとき"],
    related: [
      { name: "Pulumi", id: "pulumi", note: "汎用言語で書ける IaC" },
      { name: "Ansible", id: "ansible", note: "サーバー構成管理が得意" },
      { name: "CloudFormation", id: "cloudformation", note: "AWS 専用の IaC" },
    ],
    usedBy: ["Uber", "Slack", "多くのクラウド運用企業"],
  },
  pulumi: {
    id: "pulumi", name: "Pulumi", category: "IaC（インフラのコード化）",
    summary: "TypeScript/Python など汎用プログラミング言語でインフラを定義できる IaC ツール。",
    canDo: ["使い慣れた言語でインフラを記述", "ループや関数で柔軟に構成"],
    whenAdopted: ["プログラマブルな IaC を求めるとき"],
    related: [
      { name: "Terraform", id: "terraform", note: "専用言語(HCL)。より普及" },
    ],
  },
  ansible: {
    id: "ansible", name: "Ansible", category: "IaC / 構成管理",
    summary: "サーバーの設定やソフト導入を宣言的に自動化する構成管理ツール。エージェント不要で SSH 経由で動く。",
    canDo: ["複数サーバーの設定を一括自動化", "冪等な構成管理", "アプリのデプロイ"],
    whenAdopted: ["複数サーバーの構成管理", "オンプレ・ハイブリッド環境"],
    related: [
      { name: "Terraform", id: "terraform", note: "インフラ作成が得意。Ansible は設定が得意" },
    ],
  },
  argocd: {
    id: "argocd", name: "ArgoCD", category: "CI/CD / GitOps",
    summary: "Git リポジトリの状態を正として Kubernetes に自動デプロイする GitOps ツール。",
    canDo: ["Git を正としたクラスタ同期", "デプロイ状態の可視化", "自動ロールバック"],
    whenAdopted: ["Kubernetes 運用での継続的デプロイ"],
    related: [
      { name: "Kubernetes", id: "kubernetes", note: "ArgoCD のデプロイ先" },
      { name: "GitHub Actions", id: "github-actions", note: "ビルド/CI と組み合わせる" },
    ],
  },
  cloudformation: {
    id: "cloudformation", name: "CloudFormation", category: "IaC（AWS）",
    summary: "AWS 公式の IaC サービス。テンプレートで AWS リソースを宣言的に構築・管理する。",
    canDo: ["AWS リソースをコードで構築", "スタック単位で管理・削除"],
    whenAdopted: ["AWS 専用でインフラを固めるとき"],
    related: [
      { name: "Terraform", id: "terraform", note: "マルチクラウド対応の代替" },
    ],
  },

  // ═════════ テスト ═════════
  jest: {
    id: "jest", name: "Jest", category: "テスト / JavaScript",
    summary: "Meta 製の JavaScript テストフレームワーク。設定が少なく、モックやスナップショットも標準装備。",
    canDo: ["ユニット/結合テストを書く", "モック・スナップショットテスト", "カバレッジ計測"],
    whenAdopted: ["React/Node の定番テスト", "既存プロジェクト"],
    related: [
      { name: "Vitest", id: "vitest", note: "Vite 前提で高速な現代的代替" },
      { name: "Testing Library", id: "testing-library", note: "UI の振る舞いテストと併用" },
    ],
  },
  vitest: {
    id: "vitest", name: "Vitest", category: "テスト / JavaScript",
    summary: "Vite ネイティブの高速テストフレームワーク。Jest 互換の API を持ちつつ起動・実行が速い。",
    canDo: ["高速なユニットテスト", "Jest からの移行が容易", "TypeScript をそのまま実行"],
    whenAdopted: ["Vite ベースのモダンなフロント", "Jest の速度に不満があるとき"],
    related: [
      { name: "Jest", id: "jest", note: "最も普及。Vitest はより高速" },
    ],
  },
  cypress: {
    id: "cypress", name: "Cypress", category: "テスト / E2E",
    summary: "ブラウザ上で動く E2E テストツール。実際の操作を自動化し、UI の一連の流れを検証する。",
    canDo: ["ブラウザ操作を自動テスト", "実行の様子を可視化・録画"],
    whenAdopted: ["Web アプリの E2E テスト"],
    related: [
      { name: "Playwright", id: "playwright", note: "複数ブラウザ対応で高速な代替" },
      { name: "Selenium", id: "selenium", note: "従来からの E2E 自動化" },
    ],
  },
  pytest: {
    id: "pytest", name: "pytest", category: "テスト / Python",
    summary: "Python の代表的テストフレームワーク。シンプルな記法とプラグインの豊富さが特徴。",
    canDo: ["ユニット/結合テスト", "フィクスチャで前処理を共有", "プラグインで拡張"],
    whenAdopted: ["Python プロジェクトのテスト全般"],
    related: [
      { name: "unittest", note: "Python 標準のテスト。pytest はより簡潔" },
    ],
  },
  junit: {
    id: "junit", name: "JUnit", category: "テスト / Java",
    summary: "Java の定番ユニットテストフレームワーク。JVM 系テストの標準的存在。",
    canDo: ["Java/Kotlin のユニットテスト", "CI と統合"],
    whenAdopted: ["Java/Spring などの JVM 開発"],
    related: [
      { name: "pytest", id: "pytest", note: "Python 側の定番" },
    ],
  },
  "testing-library": {
    id: "testing-library", name: "Testing Library", category: "テスト / UI",
    summary: "『ユーザーが操作するように』UI をテストする方針のライブラリ。実装詳細に依存しないテストを促す。",
    canDo: ["表示・操作の振る舞いをテスト", "アクセシビリティを意識した検証"],
    whenAdopted: ["React/Vue などの UI コンポーネントテスト"],
    related: [
      { name: "Jest", id: "jest", note: "実行基盤として併用" },
      { name: "Cypress", id: "cypress", note: "E2E はこちら" },
    ],
  },
  selenium: {
    id: "selenium", name: "Selenium", category: "テスト / ブラウザ自動化",
    summary: "多言語対応の老舗ブラウザ自動化ツール。E2E テストや Web スクレイピングに長く使われてきた。",
    canDo: ["ブラウザ操作を自動化", "多言語・多ブラウザで実行"],
    whenAdopted: ["既存の E2E 資産", "多言語環境"],
    related: [
      { name: "Playwright", id: "playwright", note: "高速・安定した現代的代替" },
      { name: "Cypress", id: "cypress", note: "開発者体験に優れた代替" },
    ],
  },
  storybook: {
    id: "storybook", name: "Storybook", category: "フロントエンド / UI 開発",
    summary: "UI コンポーネントを単体で開発・カタログ化するツール。状態ごとの見た目を確認・共有できる。",
    canDo: ["コンポーネントを独立して開発", "状態別の見た目をカタログ化", "デザイナーと共有"],
    whenAdopted: ["デザインシステム・コンポーネント駆動開発"],
    related: [
      { name: "Testing Library", id: "testing-library", note: "振る舞いテストと補完し合う" },
    ],
    usedBy: ["GitHub", "Airbnb", "Shopify"],
  },

  // ═════════ 認証・認可プラットフォーム ═════════
  auth0: {
    id: "auth0", name: "Auth0", category: "認証・認可プラットフォーム",
    summary: "ログイン・ソーシャル連携・多要素認証などを提供する認証プラットフォーム。自前実装の手間と事故を減らす。",
    canDo: ["ログイン/サインアップを即導入", "ソーシャルログイン・MFA", "トークン発行・管理"],
    whenAdopted: ["認証を自作せず堅牢に済ませたいとき"],
    related: [
      { name: "Clerk", id: "clerk", note: "モダンなUI付きで開発者体験が良い" },
      { name: "Keycloak", id: "keycloak", note: "自己ホストできる OSS" },
    ],
    usedBy: ["多くの SaaS・企業"],
  },
  clerk: {
    id: "clerk", name: "Clerk", category: "認証・認可プラットフォーム",
    summary: "React/Next.js 向けに UI コンポーネントまで用意された認証サービス。導入が速く開発者体験が良い。",
    canDo: ["ログイン UI を数行で導入", "ユーザー・組織管理", "セッション管理"],
    whenAdopted: ["Next.js などモダンフロントで素早く認証を入れたいとき"],
    related: [
      { name: "Auth0", id: "auth0", note: "汎用・実績のある代替" },
      { name: "Supabase Auth", id: "supabase-auth", note: "DB とセットの認証" },
      { name: "NextAuth", id: "nextauth", note: "自前ホスト型のライブラリ" },
    ],
  },
  "firebase-auth": {
    id: "firebase-auth", name: "Firebase Auth", category: "認証・認可プラットフォーム",
    summary: "Firebase の認証サービス。メール・電話・ソーシャルログインを手軽に導入でき、モバイルと相性が良い。",
    canDo: ["各種ログインを簡単に導入", "モバイル/Web で共通の認証"],
    whenAdopted: ["Firebase を使うモバイル/Web アプリ"],
    related: [
      { name: "Supabase Auth", id: "supabase-auth", note: "OSS 志向の代替" },
      { name: "Auth0", id: "auth0", note: "より汎用な認証基盤" },
    ],
  },
  "supabase-auth": {
    id: "supabase-auth", name: "Supabase Auth", category: "認証・認可プラットフォーム",
    summary: "Supabase に組み込まれた認証。PostgreSQL の行レベルセキュリティと連携し、DB と一体で権限管理できる。",
    canDo: ["ログインと DB 権限を一体管理", "ソーシャルログイン", "行レベルセキュリティと連携"],
    whenAdopted: ["Supabase を使うアプリ"],
    related: [
      { name: "Firebase Auth", id: "firebase-auth", note: "Google 系の代替" },
      { name: "Clerk", id: "clerk", note: "UI 込みで手軽" },
    ],
  },
  keycloak: {
    id: "keycloak", name: "Keycloak", category: "認証・認可プラットフォーム",
    summary: "自己ホストできる OSS の認証・ID 管理基盤。シングルサインオン(SSO)やフェデレーションに対応する。",
    canDo: ["SSO・ID 連携を自社で構築", "OAuth/OIDC/SAML に対応"],
    whenAdopted: ["自己ホスト要件・企業内 SSO"],
    related: [
      { name: "Auth0", id: "auth0", note: "マネージド型の代替" },
    ],
  },
  nextauth: {
    id: "nextauth", name: "NextAuth (Auth.js)", aliases: ["NextAuth", "Auth.js"], category: "認証・認可ライブラリ",
    summary: "Next.js 向けの認証ライブラリ。自前のDBやプロバイダと組み合わせ、サービスに依存せず認証を実装できる。",
    canDo: ["ソーシャル/メール認証を自前実装", "セッション/JWT を管理"],
    whenAdopted: ["Next.js で外部サービスに頼らず認証したいとき"],
    related: [
      { name: "Clerk", id: "clerk", note: "UI 込みのサービス型" },
      { name: "Auth0", id: "auth0", note: "フルマネージドな代替" },
    ],
  },

  // ═════════ 監視・可観測性 ═════════
  datadog: {
    id: "datadog", name: "Datadog", category: "監視・可観測性",
    summary: "メトリクス・ログ・トレースを統合的に監視する SaaS。インフラからアプリまで一元的に可視化する。",
    canDo: ["サーバー/アプリを統合監視", "ダッシュボード・アラート", "分散トレーシング"],
    whenAdopted: ["本番システムの総合監視", "運用を効率化したいとき"],
    related: [
      { name: "New Relic", id: "newrelic", note: "同種の統合監視 SaaS" },
      { name: "Grafana", id: "grafana", note: "OSS の可視化。Prometheus と組む" },
    ],
    usedBy: ["Airbnb", "Samsung", "多くの SaaS"],
  },
  sentry: {
    id: "sentry", name: "Sentry", category: "監視 / エラー追跡",
    summary: "アプリのエラーや例外を収集・通知するエラートラッキングツール。発生箇所やスタックトレースを可視化する。",
    canDo: ["本番エラーをリアルタイム収集", "発生状況・影響ユーザーを把握", "リリースとの紐付け"],
    whenAdopted: ["フロント/バックのエラー監視"],
    related: [
      { name: "Datadog", id: "datadog", note: "より広範な統合監視" },
    ],
    usedBy: ["Disney", "GitHub", "Cloudflare"],
  },
  newrelic: {
    id: "newrelic", name: "New Relic", category: "監視・可観測性",
    summary: "アプリのパフォーマンス監視(APM)を中心とした可観測性プラットフォーム。ボトルネックの特定に強い。",
    canDo: ["アプリの性能を計測(APM)", "トレース・ダッシュボード"],
    whenAdopted: ["アプリのパフォーマンス監視"],
    related: [
      { name: "Datadog", id: "datadog", note: "同種の統合監視 SaaS" },
    ],
  },
  opentelemetry: {
    id: "opentelemetry", name: "OpenTelemetry", aliases: ["OTel"], category: "監視 / 計装標準",
    summary: "メトリクス・ログ・トレースを収集するためのベンダー中立な標準規格・SDK。監視ツールを乗り換えても計装を再利用できる。",
    canDo: ["標準化された方法で計装", "収集先(Datadog等)を自由に選ぶ"],
    whenAdopted: ["特定監視ツールにロックインされたくないとき"],
    related: [
      { name: "Datadog", id: "datadog", note: "OTel データの収集先の一つ" },
      { name: "Grafana", id: "grafana", note: "可視化と組み合わせる" },
    ],
  },

  // ═════════ ホスティング / デプロイ先（PaaS・エッジ） ═════════
  vercel: {
    id: "vercel", name: "Vercel", category: "ホスティング / PaaS",
    summary: "フロントエンド(特に Next.js)に最適化されたホスティング。git 連携で push するだけでデプロイ・プレビューできる。",
    canDo: ["git push で自動デプロイ", "プレビュー環境を自動生成", "エッジ配信・サーバーレス関数"],
    whenAdopted: ["Next.js/フロントの公開", "手軽にデプロイしたいとき"],
    related: [
      { name: "Netlify", id: "netlify", note: "同種の Jamstack ホスティング" },
      { name: "Cloudflare Pages", id: "cloudflare", note: "エッジ配信に強い" },
    ],
    usedBy: ["Next.js(開発元)", "多くのモダンWebサイト"],
  },
  netlify: {
    id: "netlify", name: "Netlify", category: "ホスティング / PaaS",
    summary: "静的サイト・Jamstack 向けのホスティング。ビルド・CDN 配信・フォームや関数まで手軽に扱える。",
    canDo: ["静的サイトの自動ビルド・配信", "サーバーレス関数", "フォーム処理"],
    whenAdopted: ["静的サイト・Jamstack の公開"],
    related: [
      { name: "Vercel", id: "vercel", note: "Next.js に強い同種サービス" },
      { name: "Cloudflare Pages", id: "cloudflare", note: "エッジ配信型" },
    ],
  },
  cloudflare: {
    id: "cloudflare", name: "Cloudflare", aliases: ["Cloudflare Pages", "Cloudflare Workers"], category: "ホスティング / CDN・エッジ",
    summary: "世界規模の CDN・エッジ基盤。Pages で静的サイト、Workers でエッジ関数を動かせ、DDoS 対策やDNSも提供する。",
    canDo: ["エッジで高速配信・関数実行", "DDoS 対策・WAF", "DNS・キャッシュ"],
    whenAdopted: ["低遅延なグローバル配信", "エッジで処理を動かしたいとき"],
    related: [
      { name: "Vercel", id: "vercel", note: "フロント特化のホスティング" },
      { name: "Fastly", note: "同種のエッジ/CDN" },
    ],
    usedBy: ["Discord", "Shopify", "多くの大規模サイト"],
  },
  render: {
    id: "render", name: "Render", category: "ホスティング / PaaS",
    summary: "Web サービス・DB・cron などをまとめて手軽にデプロイできる PaaS。Heroku の後継として人気。",
    canDo: ["アプリ/DB/ワーカーをデプロイ", "git 連携で自動デプロイ"],
    whenAdopted: ["バックエンド込みで手軽にデプロイしたいとき"],
    related: [
      { name: "Railway", id: "railway", note: "同種の手軽な PaaS" },
      { name: "Heroku", id: "heroku", note: "老舗の PaaS" },
      { name: "Fly.io", id: "flyio", note: "エッジ寄りの PaaS" },
    ],
  },
  railway: {
    id: "railway", name: "Railway", category: "ホスティング / PaaS",
    summary: "数クリックでアプリや DB をデプロイできる開発者フレンドリーな PaaS。個人開発や試作に向く。",
    canDo: ["アプリ/DB を素早くデプロイ", "環境変数・DB をGUIで管理"],
    whenAdopted: ["個人開発・試作を素早く公開したいとき"],
    related: [
      { name: "Render", id: "render", note: "同種の PaaS" },
      { name: "Fly.io", id: "flyio", note: "エッジ配置型" },
    ],
  },
  flyio: {
    id: "flyio", name: "Fly.io", category: "ホスティング / PaaS",
    summary: "アプリをユーザーに近いエッジで動かせる PaaS。コンテナをグローバルに分散配置して低遅延を狙う。",
    canDo: ["アプリを世界各地のエッジで実行", "低遅延なグローバル配信"],
    whenAdopted: ["レイテンシを抑えたいグローバルサービス"],
    related: [
      { name: "Render", id: "render", note: "オーソドックスな PaaS" },
      { name: "Cloudflare Workers", id: "cloudflare", note: "より軽量なエッジ実行" },
    ],
  },
  heroku: {
    id: "heroku", name: "Heroku", category: "ホスティング / PaaS",
    summary: "PaaS の草分け的存在。git push で即デプロイできる手軽さで長く親しまれてきた。",
    canDo: ["git push で即デプロイ", "アドオンで DB 等を追加"],
    whenAdopted: ["素早い試作・学習", "既存 Heroku アプリ"],
    related: [
      { name: "Render", id: "render", note: "後継として人気の代替" },
      { name: "Railway", id: "railway", note: "モダンな代替" },
    ],
  },

  // ═════════ BaaS / ヘッドレスCMS ═════════
  firebase: {
    id: "firebase", name: "Firebase", category: "BaaS",
    summary: "Google の BaaS。認証・リアルタイムDB(Firestore)・ホスティング・通知などを、バックエンドを書かずに使える。",
    canDo: ["認証・DB・ホスティングを即利用", "リアルタイム同期", "プッシュ通知"],
    whenAdopted: ["モバイル/Web を素早く立ち上げたいとき", "バックエンドを最小化したいとき"],
    related: [
      { name: "Supabase", id: "supabase", note: "PostgreSQL ベースの OSS 代替" },
      { name: "Appwrite", id: "appwrite", note: "自己ホスト可能な OSS BaaS" },
    ],
    usedBy: ["多くのモバイルアプリ", "スタートアップ"],
  },
  supabase: {
    id: "supabase", name: "Supabase", category: "BaaS",
    summary: "『OSS 版 Firebase』を掲げる BaaS。PostgreSQL を中心に、認証・ストレージ・リアルタイムを提供する。",
    canDo: ["PostgreSQL を即利用", "認証・ストレージ・リアルタイム", "自己ホストも可能"],
    whenAdopted: ["SQL(RDB)を使いたい BaaS 用途", "OSS 志向"],
    related: [
      { name: "Firebase", id: "firebase", note: "NoSQL 中心の Google 製" },
      { name: "PlanetScale", id: "planetscale", note: "MySQL 系のマネージド DB" },
    ],
    usedBy: ["多くのスタートアップ・個人開発"],
  },
  appwrite: {
    id: "appwrite", name: "Appwrite", category: "BaaS",
    summary: "自己ホストできる OSS の BaaS。認証・DB・ストレージ・関数をまとめて提供する。",
    canDo: ["BaaS 機能を自社サーバーで運用", "認証・DB・ストレージ・関数"],
    whenAdopted: ["自己ホスト要件のある BaaS 用途"],
    related: [
      { name: "Firebase", id: "firebase", note: "マネージドな代替" },
      { name: "Supabase", id: "supabase", note: "PostgreSQL ベースの OSS 代替" },
    ],
  },
  contentful: {
    id: "contentful", name: "Contentful", category: "ヘッドレスCMS",
    summary: "コンテンツを API で配信するヘッドレス CMS。表示はフロント側に任せ、コンテンツ管理だけを担う。",
    canDo: ["コンテンツを API で配信", "多チャネル(Web/アプリ)へ再利用"],
    whenAdopted: ["表示と管理を分離したいメディア/コーポレートサイト"],
    related: [
      { name: "Sanity", id: "sanity", note: "リアルタイム編集に強い" },
      { name: "Strapi", id: "strapi", note: "自己ホスト OSS の代替" },
      { name: "microCMS", id: "microcms", note: "日本製で導入しやすい" },
    ],
  },
  sanity: {
    id: "sanity", name: "Sanity", category: "ヘッドレスCMS",
    summary: "リアルタイム共同編集とカスタマイズ性に優れたヘッドレス CMS。編集画面自体をコードで構築できる。",
    canDo: ["構造化コンテンツを API 配信", "編集 UI をカスタマイズ"],
    whenAdopted: ["柔軟なコンテンツモデルが必要なとき"],
    related: [
      { name: "Contentful", id: "contentful", note: "エンタープライズ寄りの定番" },
    ],
  },
  strapi: {
    id: "strapi", name: "Strapi", category: "ヘッドレスCMS",
    summary: "自己ホストできる OSS のヘッドレス CMS。管理画面と API を自動生成し、自由にカスタマイズできる。",
    canDo: ["自社で CMS を運用", "REST/GraphQL API を自動生成"],
    whenAdopted: ["自己ホスト・カスタマイズ重視の CMS"],
    related: [
      { name: "Contentful", id: "contentful", note: "SaaS 型の代替" },
      { name: "WordPress", id: "wordpress", note: "従来型 CMS(ヘッドレス利用も可)" },
    ],
  },
  microcms: {
    id: "microcms", name: "microCMS", category: "ヘッドレスCMS",
    summary: "日本製のヘッドレス CMS。日本語ドキュメントが充実し、国内の Web 制作で導入しやすい。",
    canDo: ["コンテンツを API 配信", "日本語での手厚いサポート"],
    whenAdopted: ["国内案件・日本語運用のサイト"],
    related: [
      { name: "Contentful", id: "contentful", note: "海外発の定番" },
    ],
  },
  wordpress: {
    id: "wordpress", name: "WordPress", category: "CMS",
    summary: "世界で最も使われている CMS。ブログや企業サイトを、コードを書かずに構築・運用できる。ヘッドレス利用も可能。",
    canDo: ["ノーコードでサイト構築・運用", "プラグイン/テーマで拡張", "API 経由のヘッドレス利用"],
    whenAdopted: ["ブログ・企業サイト・メディア全般"],
    related: [
      { name: "Strapi", id: "strapi", note: "モダンなヘッドレス CMS" },
      { name: "Contentful", id: "contentful", note: "API ファーストの CMS" },
    ],
    usedBy: ["全Webサイトの約4割", "多くの企業・メディア"],
  },

  // ═════════ メッセージング / リアルタイム ═════════
  kafka: {
    id: "kafka", name: "Apache Kafka", aliases: ["Kafka"], category: "メッセージング / イベント基盤",
    summary: "大量のイベント(メッセージ)を高スループットで流す分散ストリーミング基盤。サービス間を疎結合につなぐ。",
    canDo: ["大量イベントを安定して配送", "サービス間を非同期に連携", "ログ/イベントの永続化"],
    whenAdopted: ["大規模なイベント駆動・データ連携"],
    related: [
      { name: "RabbitMQ", id: "rabbitmq", note: "汎用メッセージキュー。Kafka は大規模ストリーム向き" },
      { name: "NATS", id: "nats", note: "軽量・高速なメッセージング" },
    ],
    usedBy: ["LinkedIn(開発元)", "Uber", "Netflix"],
  },
  rabbitmq: {
    id: "rabbitmq", name: "RabbitMQ", category: "メッセージング / キュー",
    summary: "柔軟なルーティングを備えた定番のメッセージキュー。タスクの非同期処理やサービス間連携に使う。",
    canDo: ["タスクを非同期に処理", "柔軟なメッセージルーティング"],
    whenAdopted: ["ジョブキュー・サービス間連携"],
    related: [
      { name: "Apache Kafka", id: "kafka", note: "大規模ストリーム向き" },
      { name: "NATS", id: "nats", note: "より軽量" },
    ],
  },
  nats: {
    id: "nats", name: "NATS", category: "メッセージング",
    summary: "軽量・高速なメッセージングシステム。シンプルな Pub/Sub からストリーミングまで対応する。",
    canDo: ["低遅延な Pub/Sub", "マイクロサービス間の通信"],
    whenAdopted: ["軽量・高速なメッセージングが欲しいとき"],
    related: [
      { name: "RabbitMQ", id: "rabbitmq", note: "機能豊富なキュー" },
      { name: "Apache Kafka", id: "kafka", note: "大規模ストリーム" },
    ],
  },
  sqs: {
    id: "sqs", name: "Amazon SQS / SNS", aliases: ["SQS", "SNS"], category: "メッセージング（AWS）",
    summary: "AWS のフルマネージドなメッセージキュー(SQS)と通知(SNS)。運用不要で非同期処理・ファンアウトを実現する。",
    canDo: ["マネージドなキューで非同期処理", "SNS で複数宛先へ通知"],
    whenAdopted: ["AWS 上の非同期処理・疎結合化"],
    related: [
      { name: "RabbitMQ", id: "rabbitmq", note: "自己運用のキュー" },
      { name: "Apache Kafka", id: "kafka", note: "大規模ストリーム" },
    ],
  },
  websocket: {
    id: "websocket", name: "WebSocket", category: "リアルタイム通信",
    summary: "サーバーとブラウザ間で双方向にリアルタイム通信するプロトコル。チャットや通知、共同編集の基盤。",
    canDo: ["双方向のリアルタイム通信", "サーバーからのプッシュ"],
    whenAdopted: ["チャット・通知・ライブ更新"],
    related: [
      { name: "Socket.IO", id: "socketio", note: "WebSocket を扱いやすくするライブラリ" },
      { name: "Server-Sent Events", note: "サーバー→クライアントの一方向配信" },
    ],
  },
  socketio: {
    id: "socketio", name: "Socket.IO", category: "リアルタイム通信",
    summary: "WebSocket を扱いやすくする定番ライブラリ。再接続やルーム機能を備え、リアルタイム機能を素早く実装できる。",
    canDo: ["リアルタイム双方向通信を手軽に", "ルーム/名前空間で配信を分ける"],
    whenAdopted: ["Node.js でチャット/通知を作るとき"],
    related: [
      { name: "WebSocket", id: "websocket", note: "土台のプロトコル" },
      { name: "Pusher", id: "pusher", note: "マネージドなリアルタイム基盤" },
    ],
  },
  trpc: {
    id: "trpc", name: "tRPC", category: "API / 型安全通信",
    summary: "TypeScript のフロントとバックで型を共有し、コード生成なしで型安全に API を呼べる仕組み。",
    canDo: ["型安全な API 呼び出し", "スキーマ定義なしで補完が効く"],
    whenAdopted: ["TS でフロント/バックを一体開発するとき"],
    related: [
      { name: "GraphQL", id: "graphql", note: "多クライアント向け。tRPC は TS 一体型に特化" },
      { name: "REST", id: "rest", note: "汎用。tRPC は型連携が強い" },
    ],
  },
  pusher: {
    id: "pusher", name: "Pusher", aliases: ["Ably"], category: "リアルタイム / マネージド",
    summary: "リアルタイム機能をAPIで提供するマネージドサービス。自前で WebSocket 基盤を運用せず通知や同期を実装できる（Ably も同種）。",
    canDo: ["リアルタイム通知/更新を手軽に", "スケールを気にせず配信"],
    whenAdopted: ["自前でリアルタイム基盤を運用したくないとき"],
    related: [
      { name: "Socket.IO", id: "socketio", note: "自前実装のライブラリ" },
      { name: "WebSocket", id: "websocket", note: "土台のプロトコル" },
    ],
  },

  // ═════════ データ分析 / データ基盤 ═════════
  bigquery: {
    id: "bigquery", name: "BigQuery", category: "データ分析 / データウェアハウス",
    summary: "GCP のサーバーレスなデータウェアハウス。巨大なデータに対して SQL で高速に集計・分析できる。",
    canDo: ["巨大データを SQL で高速集計", "サーバー管理不要でスケール"],
    whenAdopted: ["大規模データ分析・BI の基盤"],
    related: [
      { name: "Snowflake", id: "snowflake", note: "マルチクラウドの DWH" },
      { name: "ClickHouse", id: "clickhouse", note: "自己ホスト可の高速分析DB" },
    ],
    usedBy: ["Spotify", "多くのデータ分析基盤"],
  },
  snowflake: {
    id: "snowflake", name: "Snowflake", category: "データ分析 / データウェアハウス",
    summary: "クラウド型のデータウェアハウス。計算とストレージを分離し、マルチクラウドで大規模分析を行える。",
    canDo: ["大規模データを SQL で分析", "計算資源を柔軟にスケール"],
    whenAdopted: ["企業のデータ基盤・分析"],
    related: [
      { name: "BigQuery", id: "bigquery", note: "GCP ネイティブの DWH" },
      { name: "Databricks", note: "ML 寄りのデータ基盤" },
    ],
  },
  clickhouse: {
    id: "clickhouse", name: "ClickHouse", category: "データ分析 / 列指向DB",
    summary: "列指向で超高速な集計を行う OSS の分析用データベース。ログ分析やリアルタイム集計に強い。",
    canDo: ["巨大データの高速集計", "リアルタイム分析"],
    whenAdopted: ["ログ・イベントの大規模分析"],
    related: [
      { name: "DuckDB", id: "duckdb", note: "手元で動く軽量な分析DB" },
      { name: "BigQuery", id: "bigquery", note: "フルマネージドな DWH" },
    ],
  },
  duckdb: {
    id: "duckdb", name: "DuckDB", category: "データ分析 / 組込み分析DB",
    summary: "『分析版 SQLite』。ファイルやデータフレームに対してその場で高速に SQL 分析できる組込みDB。",
    canDo: ["ローカルで CSV/Parquet を SQL 分析", "pandas とシームレスに連携"],
    whenAdopted: ["手元での分析・前処理・試作"],
    related: [
      { name: "SQLite", id: "sqlite", note: "トランザクション向け。DuckDB は分析向け" },
      { name: "ClickHouse", id: "clickhouse", note: "サーバー型の大規模分析" },
    ],
  },
  dbt: {
    id: "dbt", name: "dbt", category: "データ分析 / 変換(ELT)",
    summary: "データウェアハウス内のデータを SQL で変換・整備するツール。分析用データの構築をコードとして管理する。",
    canDo: ["SQL でデータ変換をモデル化", "テスト・ドキュメント・依存管理"],
    whenAdopted: ["DWH のデータ整備(ELT)を体系化したいとき"],
    related: [
      { name: "BigQuery", id: "bigquery", note: "dbt の変換先 DWH の一つ" },
      { name: "Airflow", id: "airflow", note: "パイプライン全体のオーケストレーション" },
    ],
  },
  metabase: {
    id: "metabase", name: "Metabase", aliases: ["Tableau", "Looker"], category: "データ分析 / BI",
    summary: "SQL を書かずにグラフやダッシュボードを作れる OSS の BI ツール。Tableau・Looker も同種の可視化製品。",
    canDo: ["データを可視化・ダッシュボード化", "非エンジニアでも分析"],
    whenAdopted: ["社内のデータ可視化・意思決定"],
    related: [
      { name: "Grafana", id: "grafana", note: "監視メトリクス寄りの可視化" },
      { name: "Tableau", note: "商用の高機能 BI" },
    ],
  },

  // ═════════ ゲーム開発 ═════════
  unity: {
    id: "unity", name: "Unity", category: "ゲーム開発 / エンジン",
    summary: "2D/3D ゲームを C# で開発できる最も普及したゲームエンジン。モバイル・PC・コンソール・VR/AR に幅広く対応。",
    canDo: ["2D/3D ゲームを開発", "多プラットフォームへ書き出し", "アセットストアで素材活用"],
    whenAdopted: ["モバイル/インディーゲーム", "VR/AR・リアルタイム3D"],
    related: [
      { name: "Unreal Engine", id: "unreal", note: "高品質グラフィック志向" },
      { name: "Godot", id: "godot", note: "軽量な OSS エンジン" },
    ],
    usedBy: ["Pokémon GO", "原神", "多くのモバイルゲーム"],
  },
  unreal: {
    id: "unreal", name: "Unreal Engine", category: "ゲーム開発 / エンジン",
    summary: "高品質なリアルタイム3D表現に強いゲームエンジン。C++/Blueprint で開発し、AAA タイトルや映像制作に使われる。",
    canDo: ["フォトリアルな3D表現", "C++ とビジュアルスクリプト(Blueprint)", "映像・建築ビジュアライズ"],
    whenAdopted: ["高品質3Dゲーム・映像制作"],
    related: [
      { name: "Unity", id: "unity", note: "モバイル/インディーに強い" },
      { name: "Godot", id: "godot", note: "軽量 OSS" },
    ],
    usedBy: ["Fortnite", "多くの AAA ゲーム"],
  },
  godot: {
    id: "godot", name: "Godot", category: "ゲーム開発 / エンジン",
    summary: "軽量で完全 OSS のゲームエンジン。独自言語 GDScript で手軽に 2D/3D ゲームを作れる。",
    canDo: ["2D/3D ゲームを OSS で開発", "軽量で扱いやすい"],
    whenAdopted: ["インディー・個人開発", "OSS 志向"],
    related: [
      { name: "Unity", id: "unity", note: "エコシステム最大" },
      { name: "Unreal Engine", id: "unreal", note: "高品質3D向き" },
    ],
  },

  // ═════════ 3D / グラフィックス ═════════
  threejs: {
    id: "threejs", name: "Three.js", category: "3D / Web グラフィックス",
    summary: "ブラウザで3Dを描画する定番 JavaScript ライブラリ。WebGL を扱いやすくラップし、Web 上の3D表現を実現する。",
    canDo: ["ブラウザで3Dシーンを描画", "モデル読み込み・アニメーション"],
    whenAdopted: ["Web の3Dビジュアル・製品ビューア"],
    related: [
      { name: "WebGL", id: "webgl", note: "Three.js が使う低レベル API" },
      { name: "WebGPU", id: "webgpu", note: "次世代の高性能グラフィック API" },
    ],
    usedBy: ["多くのインタラクティブサイト"],
  },
  webgl: {
    id: "webgl", name: "WebGL", category: "3D / グラフィックス API",
    summary: "ブラウザで GPU を使い2D/3Dを描画する低レベル API。Three.js などのライブラリの土台。",
    canDo: ["GPU による高速描画", "シェーダで表現を制御"],
    whenAdopted: ["低レベルに描画を制御したいとき"],
    related: [
      { name: "Three.js", id: "threejs", note: "WebGL を扱いやすくする" },
      { name: "WebGPU", id: "webgpu", note: "後継の高性能 API" },
    ],
  },
  webgpu: {
    id: "webgpu", name: "WebGPU", category: "3D / グラフィックス API",
    summary: "WebGL の後継となる次世代グラフィック/計算 API。GPU をより効率的に使え、描画や機械学習にも活用できる。",
    canDo: ["高性能な描画・GPU 計算", "モダンな GPU 機能を活用"],
    whenAdopted: ["最新の高性能グラフィック・GPGPU"],
    related: [
      { name: "WebGL", id: "webgl", note: "従来の API。WebGPU は後継" },
    ],
  },

  // ═════════ 決済 ═════════
  stripe: {
    id: "stripe", name: "Stripe", category: "決済",
    summary: "開発者フレンドリーな決済プラットフォーム。API でカード決済・サブスク・返金などを組み込める。",
    canDo: ["カード決済・サブスクを実装", "請求・返金・不正対策", "多通貨対応"],
    whenAdopted: ["EC・SaaS の決済導入"],
    related: [
      { name: "PayPal", id: "paypal", note: "個人間・普及度の高い決済" },
      { name: "RevenueCat", id: "revenuecat", note: "アプリ内課金に特化" },
    ],
    usedBy: ["Amazon(一部)", "Shopify", "Zoom", "Slack"],
  },
  paypal: {
    id: "paypal", name: "PayPal", category: "決済",
    summary: "世界的に普及したオンライン決済サービス。アカウント間送金や、カードを預けない決済を提供する。",
    canDo: ["オンライン決済・送金", "買い手保護"],
    whenAdopted: ["個人向け・越境 EC の決済"],
    related: [
      { name: "Stripe", id: "stripe", note: "開発者向けで柔軟" },
    ],
  },
  revenuecat: {
    id: "revenuecat", name: "RevenueCat", category: "決済 / アプリ内課金",
    summary: "iOS/Android のアプリ内課金・サブスクを横断管理する基盤。ストアごとの実装差を吸収し、分析も提供する。",
    canDo: ["アプリ内課金を一元管理", "サブスクの状態・分析を取得"],
    whenAdopted: ["モバイルアプリのサブスク課金"],
    related: [
      { name: "Stripe", id: "stripe", note: "Web の決済に強い" },
    ],
  },

  // ═════════ フロントエンド（追加） ═════════
  astro: {
    id: "astro", name: "Astro", category: "フロントエンド / メタフレームワーク",
    summary: "デフォルトで JS を最小化し、高速な静的サイトを作るフレームワーク。必要な箇所だけ動的化(アイランド)する。",
    canDo: ["高速な静的サイトを構築", "React/Vue 等を部分的に混在", "コンテンツ主体サイトに最適"],
    whenAdopted: ["ブログ・ドキュメント・LP など表示速度重視のサイト"],
    related: [
      { name: "Next.js", id: "nextjs", note: "アプリ寄り。Astro はコンテンツ寄り" },
      { name: "Qwik", id: "qwik", note: "同じく高速志向の新興" },
    ],
  },
  qwik: {
    id: "qwik", name: "Qwik", category: "フロントエンド / UI フレームワーク",
    summary: "初期表示に必要な JS を極限まで遅延ロード(resumability)し、大規模でも高速に保つフレームワーク。",
    canDo: ["必要になるまで JS を読み込まない", "高速な初期表示"],
    whenAdopted: ["パフォーマンスを最重視するとき"],
    related: [
      { name: "Astro", id: "astro", note: "静的寄りの高速化アプローチ" },
      { name: "SolidJS", id: "solidjs", note: "高速な細粒度更新" },
    ],
  },
  preact: {
    id: "preact", name: "Preact", category: "フロントエンド / UI ライブラリ",
    summary: "React 互換の軽量(3KB級)ライブラリ。API を保ちつつバンドルサイズを大幅に削減できる。",
    canDo: ["React 互換で軽量な UI", "バンドルを小さく保つ"],
    whenAdopted: ["軽さが重要な埋め込み/ウィジェット"],
    related: [
      { name: "React", id: "react", note: "本家。Preact はより軽量" },
    ],
  },
  htmx: {
    id: "htmx", name: "htmx", category: "フロントエンド / ハイパーメディア",
    summary: "HTML の属性だけで Ajax や部分更新を実現するライブラリ。JS を書かずに動的な UI を作れる。",
    canDo: ["属性で部分更新・Ajax", "サーバー主体のまま動的化"],
    whenAdopted: ["サーバーサイド中心で軽く動的化したいとき"],
    related: [
      { name: "React", id: "react", note: "本格 SPA 向け。htmx は最小限" },
    ],
  },
  zod: {
    id: "zod", name: "Zod", category: "フロントエンド / バリデーション",
    summary: "TypeScript ファーストのスキーマ定義・バリデーションライブラリ。入力検証と型を1つの定義から得られる。",
    canDo: ["入力データを検証", "スキーマから型を推論", "フォーム/APIの安全性向上"],
    whenAdopted: ["TS で入力検証・型安全を高めたいとき"],
    related: [
      { name: "TypeScript", id: "typescript", note: "Zod は TS と深く統合" },
    ],
  },
  sass: {
    id: "sass", name: "Sass", aliases: ["SCSS"], category: "フロントエンド / CSS",
    summary: "変数・ネスト・ミックスインなどを備えた CSS 拡張。大規模なスタイルを構造的に書ける定番プリプロセッサ。",
    canDo: ["変数・ネストで CSS を整理", "ミックスインで再利用"],
    whenAdopted: ["従来型の大規模 CSS 設計"],
    related: [
      { name: "Tailwind CSS", id: "tailwind", note: "ユーティリティ主体の現代的手法" },
      { name: "CSS-in-JS", note: "JS 内にスタイルを書く手法" },
    ],
  },
  "styled-components": {
    id: "styled-components", name: "styled-components", aliases: ["Emotion"], category: "フロントエンド / CSS-in-JS",
    summary: "コンポーネント単位で JS 内に CSS を書く CSS-in-JS ライブラリ。props に応じた動的スタイルが得意（Emotion も同種）。",
    canDo: ["コンポーネントにスタイルを閉じ込める", "props で動的にスタイル変更"],
    whenAdopted: ["React で動的なスタイルを扱うとき"],
    related: [
      { name: "Tailwind CSS", id: "tailwind", note: "ユーティリティ主体の代替" },
      { name: "Sass", id: "sass", note: "従来型のプリプロセッサ" },
    ],
  },

  // ═════════ バックエンド / 言語（追加） ═════════
  koa: {
    id: "koa", name: "Koa", category: "バックエンド / フレームワーク",
    summary: "Express の作者らによる軽量な Node フレームワーク。async/await 前提でモダンなミドルウェアを書ける。",
    canDo: ["軽量な API 構築", "async/await ベースのミドルウェア"],
    whenAdopted: ["モダンで最小構成の Node API"],
    related: [
      { name: "Express", id: "express", note: "最も普及。Koa はより現代的な設計" },
      { name: "Fastify", id: "fastify", note: "高速志向の代替" },
    ],
  },
  phoenix: {
    id: "phoenix", name: "Phoenix", category: "バックエンド / フレームワーク",
    summary: "Elixir 製の高生産性 Web フレームワーク。LiveView によりリアルタイム UI をサーバー側で構築できる。",
    canDo: ["高い並行性でリアルタイム機能", "LiveView で JS を書かず動的 UI"],
    whenAdopted: ["リアルタイム・高並行なサービス"],
    related: [
      { name: "Ruby on Rails", id: "rails", note: "設計思想が近い。Phoenix は並行性が強い" },
      { name: "Elixir", id: "elixir", note: "Phoenix を書く言語" },
    ],
  },
  ktor: {
    id: "ktor", name: "Ktor", category: "バックエンド / フレームワーク",
    summary: "JetBrains 製の Kotlin 用軽量 Web フレームワーク。コルーチンで非同期な API を簡潔に書ける。",
    canDo: ["Kotlin で軽量な API", "コルーチンによる非同期処理"],
    whenAdopted: ["Kotlin で軽量バックエンドを作るとき"],
    related: [
      { name: "Spring Boot", id: "spring-boot", note: "重厚・多機能な JVM 定番" },
    ],
  },
  drizzle: {
    id: "drizzle", name: "Drizzle ORM", category: "バックエンド / ORM",
    summary: "TypeScript 製の軽量 ORM。SQL に近い記述と型安全性を両立し、エッジ環境でも動く。",
    canDo: ["型安全に SQL 風のクエリ", "軽量・エッジ対応"],
    whenAdopted: ["TS で軽量・高速な DB アクセスをしたいとき"],
    related: [
      { name: "Prisma", id: "prisma", note: "スキーマ駆動で高機能。Drizzle は軽量" },
    ],
  },
  elixir: {
    id: "elixir", name: "Elixir", category: "言語 / バックエンド",
    summary: "Erlang VM 上で動く関数型言語。高い並行性と耐障害性を持ち、リアルタイム/大量接続に強い。",
    canDo: ["大量同時接続を安定処理", "耐障害性の高いシステム"],
    whenAdopted: ["チャット・リアルタイム・高信頼システム"],
    related: [
      { name: "Phoenix", id: "phoenix", note: "Elixir の定番 Web フレームワーク" },
      { name: "Go", id: "go", note: "並行処理が得意な別系統" },
    ],
    usedBy: ["Discord", "Pinterest(一部)"],
  },
  scala: {
    id: "scala", name: "Scala", category: "言語 / バックエンド",
    summary: "JVM 上で動く関数型＋オブジェクト指向のハイブリッド言語。大規模データ処理(Spark)でよく使われる。",
    canDo: ["JVM 上で高度な型・関数型を活用", "大規模データ処理"],
    whenAdopted: ["データ基盤(Spark)・大規模バックエンド"],
    related: [
      { name: "Java", id: "java", note: "同じ JVM。Scala はより関数型" },
      { name: "Apache Spark", id: "spark", note: "Scala で書かれた分散処理" },
    ],
    usedBy: ["Twitter/X(一部)", "LinkedIn(一部)"],
  },
  php: {
    id: "php", name: "PHP", category: "言語 / Web",
    summary: "Web 開発で長く使われるサーバーサイド言語。レンタルサーバーとの相性が良く、WordPress や Laravel の基盤。",
    canDo: ["動的な Web ページ/API を構築", "手軽にレンタルサーバーで公開"],
    whenAdopted: ["中小規模 Web・CMS・EC"],
    related: [
      { name: "Laravel", id: "laravel", note: "PHP の定番フレームワーク" },
      { name: "Ruby", id: "ruby", note: "似た立ち位置のスクリプト言語" },
    ],
    usedBy: ["WordPress", "Wikipedia", "Facebook(初期)"],
  },
  ruby: {
    id: "ruby", name: "Ruby", category: "言語 / Web",
    summary: "読みやすさと生産性を重視したスクリプト言語。Ruby on Rails により Web 開発で広く使われる。",
    canDo: ["少ないコードで Web/ツールを構築", "高い開発生産性"],
    whenAdopted: ["スタートアップの素早い開発", "スクリプト・自動化"],
    related: [
      { name: "Ruby on Rails", id: "rails", note: "Ruby の代表的フレームワーク" },
      { name: "Python", id: "python", note: "似た用途のスクリプト言語" },
    ],
    usedBy: ["GitHub", "Shopify", "Airbnb"],
  },
  zig: {
    id: "zig", name: "Zig", category: "言語 / システム",
    summary: "C の代替を狙う低レベル言語。シンプルさと明示性を重視し、高速・小型なバイナリを作れる。",
    canDo: ["低レベルで高速なコード", "C との相互運用"],
    whenAdopted: ["システム/組込み・高速化が必要なとき"],
    related: [
      { name: "Rust", id: "rust", note: "安全性を型で保証。Zig は明示性重視" },
      { name: "C++", id: "cpp", note: "従来の低レベル言語" },
    ],
  },

  // ═════════ データベース（追加） ═════════
  planetscale: {
    id: "planetscale", name: "PlanetScale", category: "データベース / マネージド",
    summary: "MySQL 互換のサーバーレス DB。ブランチ機能でスキーマ変更を安全に扱え、水平スケールに強い。",
    canDo: ["MySQL 互換 DB をマネージドで利用", "スキーマをブランチで安全に変更"],
    whenAdopted: ["スケールするMySQL系DBを手軽に使いたいとき"],
    related: [
      { name: "Supabase", id: "supabase", note: "PostgreSQL 系のマネージド" },
      { name: "CockroachDB", id: "cockroachdb", note: "分散 SQL DB" },
    ],
  },
  cockroachdb: {
    id: "cockroachdb", name: "CockroachDB", category: "データベース / 分散SQL",
    summary: "水平スケールと高可用性を備えた分散 SQL データベース。PostgreSQL 互換で、地理分散にも対応する。",
    canDo: ["無停止でスケールする SQL DB", "地理分散・高可用性"],
    whenAdopted: ["グローバル・高可用性が必要な RDB"],
    related: [
      { name: "PostgreSQL", id: "postgresql", note: "互換。Cockroach は分散に強い" },
    ],
  },
  timescaledb: {
    id: "timescaledb", name: "TimescaleDB", category: "データベース / 時系列",
    summary: "PostgreSQL 拡張として動く時系列データベース。IoT やメトリクスなど時間軸データの保存・集計に強い。",
    canDo: ["時系列データを効率的に保存", "時間軸の集計を高速化"],
    whenAdopted: ["IoT・監視メトリクス・時系列分析"],
    related: [
      { name: "PostgreSQL", id: "postgresql", note: "拡張として動く" },
      { name: "ClickHouse", id: "clickhouse", note: "列指向の大規模分析" },
    ],
  },

  // ═════════ モバイル（追加） ═════════
  expo: {
    id: "expo", name: "Expo", category: "モバイル / React Native 基盤",
    summary: "React Native の開発を大幅に簡略化するフレームワーク/ツール群。ビルドや配信、ネイティブ機能利用を容易にする。",
    canDo: ["React Native 開発を簡単に始める", "クラウドビルド・OTA 更新", "ネイティブ機能を手軽に利用"],
    whenAdopted: ["React Native を素早く立ち上げたいとき"],
    related: [
      { name: "React Native", id: "react-native", note: "Expo はその開発基盤" },
    ],
  },
  ionic: {
    id: "ionic", name: "Ionic", category: "モバイル / クロスプラットフォーム",
    summary: "Web 技術(HTML/CSS/JS)でモバイルアプリを作るフレームワーク。Capacitor でネイティブ機能にアクセスする。",
    canDo: ["Web 技術でモバイルアプリ開発", "既存 Web スキルを活用"],
    whenAdopted: ["Web エンジニアが手早くアプリ化したいとき"],
    related: [
      { name: "Capacitor", id: "capacitor", note: "Ionic のネイティブ連携基盤" },
      { name: "React Native", id: "react-native", note: "ネイティブ UI を使う代替" },
    ],
  },
  capacitor: {
    id: "capacitor", name: "Capacitor", category: "モバイル / ネイティブブリッジ",
    summary: "Web アプリをネイティブアプリとして包み、カメラ等のネイティブ機能へアクセスできるようにするランタイム。",
    canDo: ["Web アプリをネイティブ化", "プラグインでネイティブ機能を利用"],
    whenAdopted: ["既存 Web アプリをアプリ化するとき"],
    related: [
      { name: "Ionic", id: "ionic", note: "Capacitor と組み合わせる UI" },
      { name: "Tauri", id: "tauri", note: "デスクトップ側の類似アプローチ" },
    ],
  },

  // ═════════ AI（追加） ═════════
  weaviate: {
    id: "weaviate", name: "Weaviate", aliases: ["Chroma", "Milvus"], category: "AI / ベクトルDB",
    summary: "OSS のベクトルデータベース。埋め込みの保存・類似検索に加え、ハイブリッド検索やモジュール連携に対応（Chroma・Milvus も同種）。",
    canDo: ["埋め込みの意味検索", "キーワード＋ベクトルのハイブリッド検索"],
    whenAdopted: ["RAG・推薦のベクトル検索基盤"],
    related: [
      { name: "Qdrant", id: "qdrant", note: "同種の OSS ベクトルDB" },
      { name: "pgvector", id: "pgvector", note: "Postgres 拡張型" },
    ],
  },
  "semantic-kernel": {
    id: "semantic-kernel", name: "Semantic Kernel", aliases: ["Haystack", "DSPy"], category: "AI エージェント / フレームワーク",
    summary: "Microsoft 製の LLM オーケストレーションフレームワーク。C#/Python でプラグインやプランニングを組める（Haystack・DSPy も同系統）。",
    canDo: ["LLM とツール/メモリを連携", "プランニングでタスクを分解"],
    whenAdopted: [".NET/エンタープライズで LLM アプリを作るとき"],
    related: [
      { name: "LangChain", id: "langchain", note: "最も普及した同種フレームワーク" },
      { name: "LlamaIndex", id: "llamaindex", note: "RAG に強い" },
    ],
  },
  whisper: {
    id: "whisper", name: "Whisper", category: "AI / 音声認識",
    summary: "OpenAI の音声認識モデル。多言語の文字起こし・翻訳を高精度で行える。オープンに利用できる。",
    canDo: ["音声を文字起こし", "多言語の翻訳・字幕生成"],
    whenAdopted: ["文字起こし・字幕・音声アプリ"],
    related: [
      { name: "Hugging Face", id: "huggingface", note: "モデルの入手・実行に利用" },
    ],
  },
  "stable-diffusion": {
    id: "stable-diffusion", name: "Stable Diffusion", aliases: ["ComfyUI"], category: "AI / 画像生成",
    summary: "テキストから画像を生成するオープンな拡散モデル。ローカルでも動かせ、ComfyUI 等の UI で細かく制御できる。",
    canDo: ["テキストから画像を生成", "画像の加工・inpainting", "ローカルで実行・カスタマイズ"],
    whenAdopted: ["画像生成・クリエイティブ用途"],
    related: [
      { name: "ComfyUI", note: "ノードベースの生成 UI" },
      { name: "Hugging Face", id: "huggingface", note: "モデルの配布元" },
    ],
  },

  // ═════════ 機械学習（追加） ═════════
  optuna: {
    id: "optuna", name: "Optuna", category: "機械学習 / ハイパラ最適化",
    summary: "ハイパーパラメータ探索を自動化する Python ライブラリ。効率的な探索で精度を引き上げる。",
    canDo: ["ハイパーパラメータを自動探索", "探索を可視化・分析"],
    whenAdopted: ["モデルの精度を追い込みたいとき"],
    related: [
      { name: "scikit-learn", id: "scikit-learn", note: "探索対象のモデルを提供" },
    ],
  },
  ray: {
    id: "ray", name: "Ray", category: "機械学習 / 分散実行",
    summary: "Python の処理を分散・並列化するフレームワーク。分散学習・ハイパラ探索・推論配信などをスケールさせる。",
    canDo: ["学習/推論を分散・並列化", "大規模なチューニング"],
    whenAdopted: ["大規模な ML ワークロード"],
    related: [
      { name: "Dask", id: "dask", note: "データ処理寄りの分散" },
      { name: "Apache Spark", id: "spark", note: "大規模データ処理基盤" },
    ],
  },
  onnx: {
    id: "onnx", name: "ONNX", category: "機械学習 / モデル交換",
    summary: "学習済みモデルをフレームワーク間で共有するための標準フォーマット。PyTorch のモデルを別環境で高速推論できる。",
    canDo: ["モデルをフレームワーク非依存に変換", "最適化された推論(ONNX Runtime)"],
    whenAdopted: ["学習と推論で環境を分けたいとき", "推論の高速化"],
    related: [
      { name: "PyTorch", id: "pytorch", note: "ONNX へ書き出せる" },
      { name: "TensorFlow / Keras", id: "tensorflow", note: "同じく相互変換の対象" },
    ],
  },
  opencv: {
    id: "opencv", name: "OpenCV", category: "機械学習 / 画像処理",
    summary: "画像・映像処理の定番ライブラリ。フィルタ・特徴抽出・物体検出など古典的なコンピュータビジョンを幅広く扱う。",
    canDo: ["画像/動画の前処理・解析", "顔・物体検出などの CV 処理"],
    whenAdopted: ["画像処理・コンピュータビジョン全般"],
    related: [
      { name: "PyTorch", id: "pytorch", note: "深層学習での画像認識" },
    ],
  },
  spacy: {
    id: "spacy", name: "spaCy", category: "機械学習 / 自然言語処理",
    summary: "実用的な自然言語処理(NLP)ライブラリ。品詞解析・固有表現抽出などを高速に行える。",
    canDo: ["テキストの解析(品詞・固有表現)", "NLP パイプライン構築"],
    whenAdopted: ["古典的〜実務的な NLP 処理"],
    related: [
      { name: "Hugging Face", id: "huggingface", note: "深層学習ベースの NLP" },
    ],
  },
  lightning: {
    id: "lightning", name: "PyTorch Lightning", category: "機械学習 / 深層学習",
    summary: "PyTorch の定型コード(学習ループ等)を整理し、研究〜本番のコードを構造化するフレームワーク。",
    canDo: ["学習ループの定型を省略", "分散学習・ロギングを簡単に"],
    whenAdopted: ["PyTorch のコードを整理・スケールしたいとき"],
    related: [
      { name: "PyTorch", id: "pytorch", note: "その上に構築される" },
    ],
  },
};

export const getTech = (id: string): TechEntry | undefined => TECH_STACKS[id];

/** 自動リンク用: name と aliases から {text, id} を長い順に並べて返す（noAuto は除外）。 */
export interface TechMatch { text: string; id: string; }
let _autoCache: TechMatch[] | null = null;
export const getAutoLinkMatches = (): TechMatch[] => {
  if (_autoCache) return _autoCache;
  const out: TechMatch[] = [];
  for (const entry of Object.values(TECH_STACKS)) {
    if (entry.noAuto) continue;
    out.push({ text: entry.name, id: entry.id });
    for (const a of entry.aliases ?? []) out.push({ text: a, id: entry.id });
  }
  // 長いものから先にマッチさせる（"Ruby on Rails" を "Rails" より先に）
  out.sort((a, b) => b.text.length - a.text.length);
  _autoCache = out;
  return out;
};


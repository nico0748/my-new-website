import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, Divider, ComparisonTable } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "project-structure-and-files",
  title: "ディレクトリ構成と各ファイルの役割",
  description: "Angular CLI が生成するファイルの意味と、index.html → main.ts → AppComponent というアプリの起点の流れ。コンポーネントが .ts/.html/.css の3点セットである点や、実践向けのディレクトリ構成も設計する。",
  domain: "angular-practice",
  section: "setup",
  order: 2,
  level: "practice",
  tags: ["Angular", "プロジェクト構成"],
  updated: "2026-07-07",
  minutes: 12,
};

export default function Article() {
  return (
    <>
      <Lead>
        <Cmd>ng new taskflow</Cmd> で生成されたフォルダには、React（Vite）より多くのファイルが並んでいます。CLI が
        「全部入り」で用意するぶん最初は面食らいますが、役割が分かれば怖くありません。ここでは各ファイルの意味と、
        <strong>アプリがどこから動き始めるか</strong>を追い、最後に実践で使いやすいディレクトリ構成を設計します。
      </Lead>

      <Section>生成されるファイル</Section>
      <Code lang="text" filename="taskflow/（初期状態・主要ファイル）">{`taskflow/
├─ angular.json          ← Angular CLI の設定（ビルド・serve・test の入口）
├─ package.json          ← 依存パッケージと npm scripts の定義
├─ tsconfig.json         ← TypeScript の設定（strict 等）
├─ tsconfig.app.json     ← アプリ用の TS 設定（tsconfig.json を継承）
└─ src/                  ← アプリのソースコード（ここを書いていく）
   ├─ index.html         ← ブラウザが最初に読む HTML。<app-root> が置かれる
   ├─ main.ts            ← アプリの起点。bootstrapApplication で起動する
   ├─ styles.css         ← 全体のスタイル
   └─ app/               ← アプリ本体
      ├─ app.component.ts    ← ルートコンポーネント（ロジック・クラス）
      ├─ app.component.html  ← ルートコンポーネントのテンプレート（見た目）
      ├─ app.component.css   ← ルートコンポーネントのスタイル
      ├─ app.config.ts       ← アプリ全体の設定（providers をまとめる）
      └─ app.routes.ts       ← ルーティング定義（URL → コンポーネント）`}</Code>
      <Callout variant="info" title="Vite との違い：ファイルが多い理由">
        Vite の React ひな形は <Cmd>main.tsx</Cmd> / <Cmd>App.tsx</Cmd> 程度と最小限ですが、Angular は
        <strong>ルーティング（app.routes.ts）・アプリ設定（app.config.ts）・テスト設定</strong>まで最初から揃えます。
        「後から足す」のではなく「最初から全部ある」のが Angular の思想です。
      </Callout>

      <Section>各ファイルの役割</Section>
      <KVList
        items={[
          { key: "src/index.html", val: "ブラウザが最初に読む唯一の HTML。中に <app-root></app-root> がある（ここに UI が描画される）" },
          { key: "src/main.ts", val: "アプリの起点。bootstrapApplication(AppComponent, appConfig) で起動する（エントリーポイント）" },
          { key: "src/app/app.component.ts", val: "ルートコンポーネントのロジック。@Component デコレータ付きのクラス" },
          { key: "src/app/app.component.html", val: "ルートコンポーネントの見た目（テンプレート）" },
          { key: "src/app/app.component.css", val: "ルートコンポーネントに閉じたスタイル（他へ漏れない）" },
          { key: "src/app/app.config.ts", val: "アプリ全体の設定。provideRouter などの providers をまとめる" },
          { key: "src/app/app.routes.ts", val: "ルーティング定義（URL パス → 表示するコンポーネント）" },
          { key: "angular.json", val: "CLI の設定。ビルド・serve・test の入口やアセットの場所を定義" },
          { key: "package.json", val: "依存パッケージと ng 系コマンドを定義" },
          { key: "tsconfig.json", val: "TypeScript の型チェック・コンパイル設定（strict 既定）" },
        ]}
      />

      <Section>アプリの起点 — index.html から main.ts へ</Section>
      <p>
        SPA（シングルページアプリ）では、HTML は<strong>ほぼ空っぽ</strong>です。中身は JavaScript が後から描画します。
        <Cmd>index.html</Cmd> の要点は次の 1 行です。
      </p>
      <Code lang="html" filename="src/index.html">{`<body>
  <app-root></app-root>   <!-- ① Angular がこのタグの中に UI を描画する -->
</body>`}</Code>
      <p>
        <Cmd>&lt;app-root&gt;</Cmd> は、ルートコンポーネント（<Cmd>AppComponent</Cmd>）の<strong>セレクタ（目印のタグ名）</strong>です。
        React が <Cmd>&lt;div id="root"&gt;</Cmd> という「器」を使うのに対し、Angular は<strong>専用のカスタムタグ</strong>を器にします。
        では、誰がこのタグの中に描画するのか——それが <Cmd>main.ts</Cmd> です。
      </p>

      <SubSection>main.ts を 1 行ずつ読む</SubSection>
      <Code lang="typescript" filename="src/main.ts">{`import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`}</Code>
      <KVList
        items={[
          { key: "import { bootstrapApplication }", val: "アプリを起動する関数を Angular から取り込む（NgModule 不要の standalone 起動）" },
          { key: "import { appConfig }", val: "アプリ全体の設定（providers）を app.config.ts から取り込む" },
          { key: "import { AppComponent }", val: "最上位コンポーネント（<app-root> の中身）を取り込む" },
          { key: "bootstrapApplication(AppComponent, appConfig)", val: "AppComponent を起動し、index.html の <app-root> に描画する。ここでアプリが動き出す" },
          { key: ".catch(...)", val: "起動時のエラーをコンソールに出す（保険）" },
        ]}
      />
      <StepFlow
        steps={[
          { title: <>ブラウザが <Cmd>index.html</Cmd> を読む</>, desc: <>中に <Cmd>&lt;app-root&gt;</Cmd> という空のタグがある</> },
          { title: <><Cmd>main.ts</Cmd> が実行される</>, desc: <><Cmd>bootstrapApplication(AppComponent, appConfig)</Cmd> を呼ぶ</> },
          { title: <><Cmd>AppComponent</Cmd> が描画される</>, desc: <><Cmd>&lt;app-root&gt;</Cmd> の中に UI が差し込まれ、アプリが動き出す</> },
        ]}
        caption="index.html → main.ts → AppComponent の順に起動が伝播する"
      />

      <SubSection>app.config.ts — アプリ全体の設定</SubSection>
      <p>
        <Cmd>appConfig</Cmd> は、アプリ全体で使う機能を<strong>providers（提供物）</strong>としてまとめた設定です。ルーティングや HTTP 通信は、
        ここに登録して初めて使えるようになります。
      </p>
      <Code lang="typescript" filename="src/app/app.config.ts">{`import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),   // ルーティングを有効化（app.routes.ts を渡す）
    // provideHttpClient(),   // ← HTTP 通信を使う章で追加する
  ],
};`}</Code>
      <Callout variant="tip" title="providers = アプリに機能を「注入」する場所">
        <Cmd>provideRouter(routes)</Cmd> でルーターを、<Cmd>provideHttpClient()</Cmd> で HTTP クライアントを有効化します。
        React でいえば「アプリ全体を <Cmd>&lt;BrowserRouter&gt;</Cmd> で包む」のに近い役割を、<strong>設定ファイル 1 箇所</strong>で宣言するのが Angular 流です。
      </Callout>

      <Section>コンポーネントは .ts / .html / .css の3点セット</Section>
      <p>
        Angular の大きな特徴が<strong>関心の分離</strong>です。1 つのコンポーネントは、原則として次の 3 ファイルで構成されます。
      </p>
      <KVList
        items={[
          { key: ".ts", val: "ロジック。@Component デコレータ付きのクラス。データや処理を書く" },
          { key: ".html", val: "テンプレート（見た目）。@if / @for など Angular の構文で描画する" },
          { key: ".css", val: "スタイル。既定でそのコンポーネントに閉じる（他へ漏れない）" },
        ]}
      />
      <Code lang="typescript" filename="src/app/app.component.ts">{`import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",                    // index.html の <app-root> に対応
  standalone: true,                        // NgModule 不要の自己完結コンポーネント
  imports: [RouterOutlet],                 // このテンプレートで使う部品を宣言
  templateUrl: "./app.component.html",     // 見た目は別ファイル（分離）
  styleUrl: "./app.component.css",         // スタイルも別ファイル（分離）
})
export class AppComponent {
  title = "taskflow";                      // テンプレートから参照できるデータ
}`}</Code>
      <Callout variant="info" title="React との対比：一体化 vs 分離">
        React は 1 つの <Cmd>.tsx</Cmd> にロジック（JS）と見た目（JSX）を<strong>一体で</strong>書きます。Angular は
        <strong>ロジック（.ts）とテンプレート（.html）とスタイル（.css）を分離</strong>します。ファイル数は増えますが、
        「見た目を直したいときは .html だけ見ればよい」という<strong>役割の明確さ</strong>が得られます。どちらが優れているというより、思想の違いです。
      </Callout>
      <p>
        <Cmd>@Component</Cmd> の中の <Cmd>selector</Cmd> がタグ名、<Cmd>imports</Cmd> がこの部品で使う他の部品（standalone なので
        各コンポーネントが自分で宣言）、<Cmd>templateUrl</Cmd> / <Cmd>styleUrl</Cmd> が見た目とスタイルの参照先です。
        テンプレート内の <Cmd>&lt;router-outlet&gt;</Cmd>（<Cmd>RouterOutlet</Cmd>）に、ルーティングで選ばれた画面が差し込まれます。
      </p>

      <Section>⚠️ CLI のバージョンで名前が変わる — 読み替え表</Section>
      <p>
        Angular CLI は <strong>v20 以降でファイル名・クラス名の既定が変わりました</strong>。
        「<Cmd>.component</Cmd> を付けない」「クラス名に <Cmd>Component</Cmd> / <Cmd>Service</Cmd> の接尾辞を付けない」方針になっています。
        本コースのコード例は v18 系の命名で書いてあるので、新しい CLI（検証は <strong>22.0.7</strong>）を使っている場合は次の表で読み替えてください。
      </p>
      <ComparisonTable
        headers={["対象", "本コースの記述（v18 系）", "CLI v20 以降の実際"]}
        rows={[
          ["ルートの部品", "app.component.ts / .html / .css", "app.ts / app.html / app.css"],
          ["ルートのクラス名", "AppComponent", "App"],
          ["画面の部品", "task-list.component.ts", "task-list.ts"],
          ["画面のクラス名", "TaskListComponent", "TaskList"],
          ["サービス", "task.service.ts / TaskService", "task.ts / クラス Task"],
          ["サービスのデコレータ", "@Injectable({ providedIn: 'root' })", "@Service()（雛形の既定）"],
          [<><Cmd>standalone: true</Cmd> の記述</>, "明示的に書く", "既定なので書かれない（v19+ で standalone が既定）"],
          ["app.config.ts の providers", "provideRouter(routes) のみ", "provideBrowserGlobalErrorListeners() が既定で追加される"],
        ]}
      />
      <Callout variant="info" title="どちらの書き方でも動く">
        <Cmd>@Injectable(&#123; providedIn: 'root' &#125;)</Cmd> も <Cmd>standalone: true</Cmd> の明記も、
        新しい CLI で<strong>そのまま有効</strong>です（非推奨になったわけではありません）。変わったのは
        <strong>雛形が生成する名前と既定値</strong>だけなので、本コースのコードをそのまま書いても動きます。
        チーム内では<strong>どちらかに揃える</strong>ことのほうが大事です。
      </Callout>

      <Section>実践向けのディレクトリ構成</Section>
      <p>
        初期状態は最小限なので、アプリが育つ前に「役割ごとのフォルダ」を用意しておくと迷いません。このコースでは次の構成で進めます。
      </p>
      <Code lang="text" filename="src/app/（このコースの構成）">{`src/app/
├─ app.component.ts/.html/.css   ← ルート（<router-outlet> を置く）
├─ app.config.ts                 ← providers（provideRouter 等）
├─ app.routes.ts                 ← ルーティング定義
├─ pages/                        ← 画面（URL に対応するコンポーネント）
│  ├─ task-list/                 ← 一覧（.ts/.html/.css の3点セット）
│  ├─ task-detail/               ← 詳細
│  └─ new-task/                  ← 新規作成
├─ components/                   ← 再利用する UI 部品
│  ├─ task-item/
│  └─ task-form/
├─ services/                     ← データ取得・状態などのロジック（DI で注入）
│  └─ task.service.ts
└─ models/                       ← 型定義（interface）
   └─ task.model.ts`}</Code>
      <KVList
        items={[
          { key: "pages/", val: "URL に対応する「画面」。ルーティングの行き先になる" },
          { key: "components/", val: "ボタンやカードなど、複数画面で使い回す部品" },
          { key: "services/", val: "API 通信・状態などのロジック。DI（依存性注入）で各コンポーネントに渡す（React の hooks/lib に相当）" },
          { key: "models/", val: "TypeScript の型（Task など interface）をまとめる" },
        ]}
      />
      <Callout variant="tip" title="Angular では ng generate でフォルダごと作る">
        上のフォルダは手作業ではなく <Cmd>ng generate component pages/task-list</Cmd> のように CLI で作ります。すると
        <strong>フォルダ＋3点セット＋テストファイル</strong>が規約どおりに生成され、<Cmd>app.config.ts</Cmd> や親の <Cmd>imports</Cmd> への
        接続もしやすくなります。次章以降で実際に使います。
      </Callout>

      <Bridge course="ソフトウェア工学（関心の分離・モジュール性）">
        コンポーネントを <strong>.ts / .html / .css</strong> に分けるのも、<strong>pages / components / services / models</strong> に分けるのも、
        講義で学ぶ<strong>関心の分離（separation of concerns）</strong>と<strong>高凝集・低結合</strong>の実践です。
        Angular はさらに <strong>DI（依存性注入）</strong>という仕組みで「ロジック（service）」を「画面（component）」から切り離し、
        テストしやすく・差し替えやすくします。ファイルが分かれているぶん、変更の影響範囲が読みやすく、チーム開発で認知負荷が下がります。
      </Bridge>

      <Quiz
        question="Angular アプリが最初に動き出す（描画が始まる）流れとして正しいのは？"
        options={[
          <><Cmd>index.html</Cmd> だけで完結する</>,
          <><Cmd>app.component.ts</Cmd> が自動実行される</>,
          <><Cmd>index.html</Cmd> の <Cmd>&lt;app-root&gt;</Cmd> に、<Cmd>main.ts</Cmd> の <Cmd>bootstrapApplication(AppComponent, appConfig)</Cmd> が描画する</>,
          <><Cmd>angular.json</Cmd> がコンポーネントを描画する</>,
        ]}
        answer={2}
        explanation={<><Cmd>main.ts</Cmd> が <Cmd>bootstrapApplication(AppComponent, appConfig)</Cmd> を呼び、<Cmd>AppComponent</Cmd>（セレクタ <Cmd>app-root</Cmd>）を <Cmd>index.html</Cmd> の <Cmd>&lt;app-root&gt;</Cmd> に描画します。ここがアプリの起点です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "index.html は <app-root> という空のタグを持つ入口（React の <div id=\"root\"> に相当）",
          "main.ts が起点：bootstrapApplication(AppComponent, appConfig) でアプリが動き出す（standalone 起動・NgModule 不要）",
          "app.config.ts の providers（provideRouter 等）で機能を有効化。app.routes.ts がルーティング定義",
          "コンポーネントは .ts（ロジック）/ .html（テンプレート）/ .css（スタイル）の3点セット。React の一体化と対照的",
          "実践では pages / components / services / models に役割で分ける。フォルダは ng generate で作るのが Angular 流",
        ]}
      />
    </>
  );
}

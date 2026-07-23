import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, Divider, ComparisonTable, Figure } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "app-and-angular-cli-setup",
  title: "作るアプリと Angular CLI でのプロジェクト作成",
  description: "この実践コースで作るタスク管理アプリの全体像と、Angular CLI で TypeScript プロジェクトを立ち上げる手順を、実行コマンド・期待される出力・つまずき対処まで一つずつ確認する。React（Vite）との違いも対比する。",
  domain: "angular-practice",
  section: "setup",
  order: 1,
  level: "practice",
  tags: ["Angular", "CLI", "セットアップ"],
  updated: "2026-07-07",
  minutes: 15,
};

export default function Article() {
  return (
    <>
      <Lead>
        この実践コースでは、手を動かしながら<strong>タスク管理アプリ</strong>を一から作ります。React 実践コースと<strong>同じ題材</strong>を、
        今度は <strong>Angular</strong> で作ることで、フレームワークの違いが体で分かるようにします。この記事では作るものを決め、
        <strong>Angular CLI</strong> で開発環境を立ち上げ、ブラウザに初期画面が出るところまでを、コマンドを一つも飛ばさずに進めます。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <p>この記事を終えると、次の状態になります。</p>
      <KVList
        items={[
          { key: "ゴール", val: "Angular CLI で TypeScript プロジェクトを作り、http://localhost:4200 に初期画面が表示できる" },
          { key: "所要時間", val: "約15分（CLI インストールとビルドの待ち時間を含む）" },
          { key: "前提①", val: "Node.js（LTS 版・v18 以上）が入っている" },
          { key: "前提②", val: "ターミナル（macOS: ターミナル.app、Windows: PowerShell 等）が使える" },
          { key: "前提③", val: "エディタ（VS Code を推奨）がある" },
        ]}
      />

      <SubSection>作るアプリ — タスク管理アプリ（TaskFlow）</SubSection>
      <p>
        題材は<strong>タスク管理アプリ（TaskFlow）</strong>です。一覧・詳細・新規作成の 3 画面を行き来する構造で、
        実務で必要になる<strong>ルーティング・コンポーネント分割・依存性注入（DI）・データ取得</strong>がひととおり登場します。
        React 実践コースと同じアプリを作るので、「同じものを別のフレームワークで組むと何が変わるか」を実感できます。
      </p>
      <FlowChain
        nodes={[
          { label: "一覧", sub: "/", variant: "alt" },
          { label: "詳細", sub: "/tasks/:id" },
          { label: "新規作成", sub: "/tasks/new", variant: "cta" },
        ]}
        caption="この 3 画面を行き来するアプリを、コースを通して作る"
      />

      <Section>Angular とは — 全部入りのフレームワーク</Section>
      <p>
        <strong>Angular（アンギュラー）</strong>は Google が開発する、大規模アプリ向けの Web フレームワークです。React が「UI を描く
        ライブラリ」で、ルーター・状態管理・HTTP 通信などは別ライブラリを組み合わせるのに対し、Angular は<strong>それらを最初から同梱</strong>した
        「全部入り（バッテリー同梱）」の設計です。
      </p>
      <KVList
        items={[
          { key: "TypeScript 前提", val: "Angular は TypeScript で書くのが標準（型・デコレータが前提の設計）" },
          { key: "全部入り", val: "ルーティング・HTTP・フォーム・テストが公式に含まれる（追加ライブラリ選定が要らない）" },
          { key: "デコレータ＋クラス", val: "@Component などのデコレータを付けたクラスで部品を定義する（React の関数コンポーネントと対照的）" },
          { key: "テンプレート/スタイル分離", val: "ロジック（.ts）・見た目（.html）・スタイル（.css）をファイルで分ける（React は JSX に一体化）" },
          { key: "standalone（2025-2026 標準）", val: "従来の NgModule ではなく、部品を自己完結させる standalone コンポーネントが既定" },
        ]}
      />
      <Callout variant="info" title="standalone と NgModule">
        以前の Angular は <Cmd>NgModule</Cmd>（部品をまとめて登録する箱）が必須でしたが、近年は
        <strong>standalone コンポーネント</strong>（各部品が自分の依存を <Cmd>imports</Cmd> に持つ）が標準になり、NgModule は不要になりました。
        このコースでは <Cmd>NgModule</Cmd> を使わない、<strong>2025-2026 の書き方</strong>で進めます。
      </Callout>

      <Section>Angular CLI とは — 規約と自動生成の道具</Section>
      <p>
        <strong>Angular CLI</strong>（コマンドラインツール）は、プロジェクトの生成・開発サーバー起動・ビルド・テスト・部品の雛形生成までを担う
        「公式の司令塔」です。React では Vite などのツールを自分で選びますが、Angular は CLI が<strong>決められた規約（convention）</strong>に沿って
        すべてを自動生成（scaffolding）します。
      </p>
      <KVList
        items={[
          { key: "ng new", val: "プロジェクト一式を生成（ルーティング・テスト設定まで含む）" },
          { key: "ng serve", val: "開発サーバーを起動（HMR 付き。既定ポートは 4200）" },
          { key: "ng build", val: "本番用に最適化してビルド（dist/ に出力）" },
          { key: "ng generate", val: "コンポーネント・サービス等の雛形を規約通りに自動生成（次章以降で多用）" },
          { key: "ng test", val: "ユニットテストを実行（Karma/Jasmine もしくは Vitest 等が設定済み）" },
        ]}
      />
      <Callout variant="tip" title="なぜ CLI に任せるのか">
        「どこに何を置くか」「どう命名するか」を CLI が決めてくれるので、チームで<strong>迷いが減り</strong>、書き方が揃います。
        自由度は Vite より低いぶん、<strong>規約に乗れば速い</strong>のが Angular の思想です。
      </Callout>

      <Section>手順0 — Node.js が入っているか確認する</Section>
      <p>まず、ターミナルを開いて次の 2 つを実行します。バージョンが表示されれば OK です。</p>
      <Code lang="bash" filename="ターミナル">{`node -v
npm -v`}</Code>
      <p>次のように<strong>バージョン番号</strong>が返ってくれば準備完了です（数値は環境で異なります）。</p>
      <Code lang="text" filename="期待される出力">{`v20.11.0
10.2.4`}</Code>
      <Callout variant="warn" title="command not found / 古い場合">
        <Cmd>command not found: node</Cmd> と出たら Node.js が未インストールです。<Cmd>v18</Cmd> 未満なら古すぎて Angular CLI が動きません。
        いずれも <strong>nvm</strong>（Node のバージョン管理ツール）で LTS を入れるのが安全です
        （<Cmd>nvm install --lts</Cmd> → <Cmd>nvm use --lts</Cmd>）。入れ直したら再度 <Cmd>node -v</Cmd> で確認します。
      </Callout>

      <Section>手順1 — Angular CLI を用意してプロジェクトを生成する</Section>
      <p>
        まず Angular CLI をグローバルに入れます（一度入れれば以後どのプロジェクトでも <Cmd>ng</Cmd> コマンドが使えます）。
      </p>
      <Code lang="bash" filename="ターミナル">{`npm install -g @angular/cli`}</Code>
      <p>入ったか確認します。バージョンが表示されれば成功です。</p>
      <Code lang="bash" filename="ターミナル">{`ng version`}</Code>
      <Code lang="text" filename="期待される出力（抜粋）">{`     _                      _                 ____ _     ___
    / \\   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \\ | '_ \\ / _\` | | | | |/ _\` | '__|   | |   | |    | |
  / ___ \\| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \\_\\_| |_|\\__, |\\__,_|_|\\__,_|_|       \\____|_____|___|
               |___/

Angular CLI: 18.2.0
Node: 20.11.0
Package Manager: npm 10.2.4`}</Code>
      <p>
        アプリを置きたいフォルダに移動してから、次を実行してプロジェクトを生成します。<Cmd>taskflow</Cmd> がプロジェクト名です。
      </p>
      <Code lang="bash" filename="ターミナル">{`ng new taskflow`}</Code>
      <p>実行すると、CLI が<strong>いくつか対話で質問</strong>してきます。次のように答えてください。</p>
      <Code lang="text" filename="対話（矢印キー / y・n で回答）">{`? Which stylesheet format would you like to use?
❯ CSS                            ← CSS を選ぶ（矢印キーで選んで Enter）
  SCSS
  Sass
  Less

? Do you want to enable Server-Side Rendering (SSR) ... ? (y/N)
  → N（今回は SPA として作るので No。そのまま Enter）`}</Code>
      <Figure
        src="/learn/shots/angular-practice/app-and-angular-cli-setup-01.svg"
        alt="ng new taskflow の対話画面。stylesheet format のリストから CSS を矢印キーで選んでいるターミナル"
        caption="ng new は対話で聞いてくる。スタイル形式は CSS、SSR は No を選ぶ"
      />
      <Callout variant="info" title="ルーティングは自動で入る">
        Angular の新しい CLI は<strong>ルーティングを既定で有効化</strong>し、<Cmd>app.routes.ts</Cmd> を最初から生成します
        （以前は「Add routing? (y/N)」と聞かれました）。もし聞かれたら <strong>Yes</strong> を選んでください。
        このコースは 3 画面を行き来するので、ルーティングは必須です。
      </Callout>
      <p>回答が終わると、CLI がファイル生成と <Cmd>npm install</Cmd> を自動で行い、次のような出力が流れます。</p>
      <Code lang="text" filename="期待される出力（抜粋）">{`CREATE taskflow/README.md (1067 bytes)
CREATE taskflow/angular.json (2778 bytes)
CREATE taskflow/package.json (1043 bytes)
CREATE taskflow/tsconfig.json (901 bytes)
CREATE taskflow/src/index.html (293 bytes)
CREATE taskflow/src/main.ts (250 bytes)
CREATE taskflow/src/app/app.component.ts (317 bytes)
CREATE taskflow/src/app/app.component.html (20239 bytes)
CREATE taskflow/src/app/app.component.css (0 bytes)
CREATE taskflow/src/app/app.config.ts (310 bytes)
CREATE taskflow/src/app/app.routes.ts (77 bytes)
...
✔ Packages installed successfully.`}</Code>
      <Callout variant="tip" title="ng new が全部やってくれる">
        Vite の場合は「生成 → <Cmd>npm install</Cmd> → 起動」を自分で順に打ちますが、<Cmd>ng new</Cmd> は
        <strong>生成と依存インストールまでを一括</strong>で行い、テスト設定やルーティングの雛形も同時に用意します。これが「全部入り CLI」の実感です。
      </Callout>

      <SubSection>生成先フォルダと、対話を省略するフラグ</SubSection>
      <p>
        <Cmd>ng new taskflow</Cmd> は<strong>カレントディレクトリに <Cmd>taskflow/</Cmd> という子フォルダを作り</strong>、その中に一式を展開します。
        すでに作業用フォルダを用意していて<strong>その直下に直接置きたい</strong>場合は、<Cmd>--directory .</Cmd> を付けます。
      </p>
      <Code lang="bash" filename="ターミナル">{`# 例) sample-angular-app/ の直下に直接生成する
cd sample-angular-app
ng new taskflow --directory .`}</Code>
      <p>
        また、対話をすべて飛ばしたいときはフラグで先に答えられます。CI や、手順を再現したいときに便利です。
      </p>
      <Code lang="bash" filename="ターミナル">{`ng new taskflow --style=css --ssr=false --defaults`}</Code>

      <Callout variant="warn" title="CLI のバージョンで生成されるファイル名が変わる">
        本コースのコード例は <Cmd>app.component.ts</Cmd> / <Cmd>AppComponent</Cmd> という
        <strong>CLI 18 系の命名</strong>で書いています。<strong>CLI 20 以降（検証は 22.0.7）では
        <Cmd>app.ts</Cmd> / クラス <Cmd>App</Cmd> のように「.component」やクラスの接尾辞が付かなくなりました</strong>。
        新しい CLI を使う場合は、次章の対応表で読み替えてください。中身の考え方は変わりません。
      </Callout>

      <Section>手順2 — 開発サーバーを起動する</Section>
      <p>生成されたフォルダに入り、開発サーバーを起動します。</p>
      <Code lang="bash" filename="ターミナル">{`cd taskflow
ng serve`}</Code>
      <p>初回はビルドに数秒〜十数秒かかります。次のように<strong>ローカル URL</strong> が表示されれば起動成功です。</p>
      <Code lang="text" filename="期待される出力">{`Initial chunk files | Names         |  Raw size
main.js             | main          | 234.86 kB
polyfills.js        | polyfills     |  90.20 kB
styles.css          | styles        |  96 bytes

Application bundle generation complete. [3.421 seconds]

Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help`}</Code>
      <p>
        表示された <Cmd>http://localhost:4200/</Cmd> をブラウザで開くと、<strong>Angular のロゴと「Hello, taskflow」のウェルカム画面</strong>が出ます。
        ここまで来ればセットアップは成功です。ファイルを保存すると自動で再ビルドされ、ブラウザに反映されます（HMR）。
      </p>
      <Figure
        src="/learn/shots/angular-practice/app-and-angular-cli-setup-02.svg"
        alt="localhost:4200 に表示された Angular の初期ウェルカム画面。ロゴと Hello, taskflow が並んでいる"
        caption="この初期画面が出れば成功。Vite の 5173 に対し、Angular の既定は 4200"
      />
      <Callout variant="warn" title="よくあるつまずき">
        <ul>
          <li><strong>ポート 4200 が使用中</strong>：<Cmd>Port 4200 is already in use.</Cmd> と出ます。別ポートで起動するには <Cmd>ng serve --port 4300</Cmd> のように指定します。</li>
          <li><strong>ng: command not found</strong>：CLI のグローバルインストールが済んでいません。<Cmd>npm install -g @angular/cli</Cmd> をやり直します（権限エラーなら <Cmd>sudo</Cmd> か nvm 環境を確認）。</li>
          <li><strong>Node のバージョンが低い / 合わない</strong>：<Cmd>The Angular CLI requires a minimum Node.js version...</Cmd> と出ます。<Cmd>nvm use --lts</Cmd> で対応 LTS に切り替えます。</li>
          <li><strong>URL を開いても表示されない</strong>：<Cmd>ng serve</Cmd> を実行したターミナルを<strong>閉じない</strong>こと。停止は <Cmd>Ctrl + C</Cmd>。</li>
        </ul>
      </Callout>

      <Section>Vite（React 実践）との違い</Section>
      <p>同じ「タスク管理アプリ」を作るのに、立ち上げ方はこう変わります。</p>
      <ComparisonTable
        headers={["観点", "React（Vite）", "Angular（CLI）"]}
        rows={[
          [
            "プロジェクト生成",
            <><Cmd>npm create vite@latest</Cmd>（ひな形は最小限）</>,
            <><Cmd>ng new</Cmd>（ルーティング・テストまで一式）</>,
          ],
          [
            "依存インストール",
            <>生成後に <Cmd>npm install</Cmd> を自分で実行</>,
            <><Cmd>ng new</Cmd> が自動で実行</>,
          ],
          [
            "開発サーバー起動",
            <><Cmd>npm run dev</Cmd></>,
            <><Cmd>ng serve</Cmd></>,
          ],
          ["既定ポート", <>5173</>, <>4200</>],
          [
            "ルーター / HTTP",
            <>別ライブラリを追加（react-router 等）</>,
            <>公式に同梱（provideRouter / provideHttpClient）</>,
          ],
          [
            "部品の雛形生成",
            <>手作業でファイルを作る</>,
            <><Cmd>ng generate</Cmd> で自動生成</>,
          ],
        ]}
      />

      <Section>次章の予告 — ng generate で部品を量産する</Section>
      <p>
        次章ではファイル構成を読み解きますが、その先では <Cmd>ng generate</Cmd>（略記 <Cmd>ng g</Cmd>）を多用します。たとえば
        <Cmd>ng g component pages/task-list</Cmd> と打つだけで、<Cmd>.ts</Cmd>/<Cmd>.html</Cmd>/<Cmd>.css</Cmd> の 3 点セットと
        テストファイルまでが<strong>規約どおりに自動生成</strong>されます。「手で作らず CLI に作らせる」のが Angular 流です。
      </p>

      <Bridge course="ソフトウェア工学（規約による自動化・ツールチェーン）">
        Angular CLI が「雛形を規約どおりに生成する」仕組みは、講義で学ぶ<strong>Convention over Configuration（設定より規約）</strong>と
        <strong>スキャフォールディング</strong>の実践です。命名・配置・ビルド設定を人が毎回決めるのではなく<strong>ツールに委ねる</strong>ことで、
        認知負荷とヒューマンエラーを減らし、チーム全体の一貫性を担保します。「自由度を少し諦めて、標準化で速度と品質を稼ぐ」という
        トレードオフの好例です。
      </Bridge>

      <Quiz
        question="Angular CLI で新規プロジェクトを生成し、開発サーバーを起動する正しい流れは？"
        options={[
          <><Cmd>npm create vite@latest taskflow</Cmd> → <Cmd>npm run dev</Cmd></>,
          <><Cmd>ng new taskflow</Cmd>（対話で CSS/ルーティング等を回答）→ <Cmd>cd taskflow</Cmd> → <Cmd>ng serve</Cmd></>,
          <><Cmd>ng build</Cmd> → <Cmd>ng test</Cmd></>,
          <><Cmd>node taskflow.js</Cmd> を実行する</>,
        ]}
        answer={1}
        explanation={<><Cmd>ng new</Cmd> がプロジェクト生成と依存インストールまでを一括で行い（対話でスタイル形式や SSR を回答）、<Cmd>ng serve</Cmd> で開発サーバーが <Cmd>http://localhost:4200</Cmd> に立ち上がります。<Cmd>npm create vite</Cmd> は React 側の手順です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "作るのは React 実践と同じタスク管理アプリ（一覧 / 詳細 / 新規作成の3画面）。前提は Node.js v18 以上",
          "Angular は TypeScript 前提の「全部入り」FW。デコレータ＋クラスで書き、standalone が2025-2026の標準（NgModule 不要）",
          "Angular CLI は規約に沿って生成・起動・ビルド・テストを担う司令塔。ng new / ng serve / ng build / ng generate",
          "手順: npm install -g @angular/cli → ng new taskflow（CSS・ルーティングを回答）→ cd taskflow → ng serve",
          "既定ポートは 4200（Vite は 5173）。ng new は install まで一括、CLI がテスト設定・ルーティング雛形も生成する",
        ]}
      />
    </>
  );
}

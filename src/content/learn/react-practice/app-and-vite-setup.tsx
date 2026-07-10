import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "app-and-vite-setup",
  title: "作るアプリと Vite プロジェクトの作成",
  description: "この実践コースで作るタスク管理アプリの全体像と、Vite で React+TypeScript プロジェクトを立ち上げる手順を、実行コマンド・期待される出力・つまずき対処まで一つずつ確認する。",
  domain: "react-practice",
  section: "setup",
  order: 1,
  level: "practice",
  tags: ["React", "Vite", "セットアップ"],
  updated: "2026-07-07",
  minutes: 15,
};

export default function Article() {
  return (
    <>
      <Lead>
        この実践コースでは、手を動かしながら<strong>タスク管理アプリ</strong>を一から作ります。React の書き方は基礎コースで学んだ前提で、
        ここからは「実際のアプリをどう組み立てるか」を、完成させながら身につけます。この記事では作るものを決め、
        <strong>Vite</strong> で開発環境を立ち上げ、ブラウザに初期画面が出るところまでを、コマンドを一つも飛ばさずに進めます。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <p>この記事を終えると、次の状態になります。</p>
      <KVList
        items={[
          { key: "ゴール", val: "Vite で React+TypeScript のプロジェクトを作り、http://localhost:5173 に初期画面が表示できる" },
          { key: "所要時間", val: "約15分（インストールの待ち時間を含む）" },
          { key: "前提①", val: "Node.js（LTS 版・v18 以上）が入っている" },
          { key: "前提②", val: "ターミナル（macOS: ターミナル.app、Windows: PowerShell 等）が使える" },
          { key: "前提③", val: "エディタ（VS Code を推奨）がある" },
        ]}
      />

      <SubSection>作るアプリ — タスク管理アプリ</SubSection>
      <p>
        題材は<strong>タスク管理アプリ（TaskFlow）</strong>です。一覧・詳細・新規作成の 3 画面を行き来する構造で、
        実務で必要になる<strong>ルーティング・コンポーネント分割・状態管理・データ取得</strong>がひととおり登場します。
      </p>
      <FlowChain
        nodes={[
          { label: "一覧", sub: "/", variant: "alt" },
          { label: "詳細", sub: "/tasks/:id" },
          { label: "新規作成", sub: "/tasks/new", variant: "cta" },
        ]}
        caption="この 3 画面を行き来するアプリを、コースを通して作る"
      />

      <Section>Vite とは — 開発を支えるビルドツール</Section>
      <p>
        React アプリは、ブラウザがそのままでは理解できない <Cmd>.tsx</Cmd>（JSX + TypeScript）で書きます。これを
        ブラウザ用の JavaScript に<strong>変換（トランスパイル）</strong>し、たくさんのファイルを<strong>まとめる（バンドル）</strong>のが
        ビルドツールの仕事です。<strong>Vite（ヴィート）</strong>は、その現代的な定番です。
      </p>
      <KVList
        items={[
          { key: "開発サーバー", val: "npm run dev で起動。ブラウザで即プレビューできる" },
          { key: "HMR（即時反映）", val: "保存した瞬間、ページを再読み込みせず変更だけ差し替える" },
          { key: "本番ビルド", val: "npm run build で最適化して dist/ に出力（圧縮・tree shaking）" },
          { key: "設定とプラグイン", val: "vite.config.ts で設定。@vitejs/plugin-react が JSX/HMR を担う" },
        ]}
      />
      <p>
        Vite が速いのは、<strong>開発時と本番時で仕組みを分けている</strong>からです。開発時はブラウザ標準の <strong>ES Modules</strong> をそのまま使い、
        画面が要求したファイルだけを <Cmd>esbuild</Cmd>（Go 製の高速変換器）で都度変換します（全体を事前にまとめないので一瞬で起動）。
        本番は <Cmd>Rollup</Cmd> で全体をまとめ、不要コード除去・圧縮まで最適化します。
      </p>

      <Section>手順0 — Node.js が入っているか確認する</Section>
      <p>まず、ターミナルを開いて次の 2 つを実行します。バージョンが表示されれば OK です。</p>
      <Code lang="bash" filename="ターミナル">{`node -v
npm -v`}</Code>
      <p>次のように<strong>バージョン番号</strong>が返ってくれば準備完了です（数値は環境で異なります）。</p>
      <Code lang="text" filename="期待される出力">{`v20.11.0
10.2.4`}</Code>
      <Callout variant="warn" title="command not found / 古い場合">
        <Cmd>command not found: node</Cmd> と出たら Node.js が未インストールです。<Cmd>v18</Cmd> 未満なら古すぎます。
        いずれも <strong>nvm</strong>（Node のバージョン管理ツール）で LTS を入れるのが安全です
        （<Cmd>nvm install --lts</Cmd> → <Cmd>nvm use --lts</Cmd>）。入れ直したら再度 <Cmd>node -v</Cmd> で確認します。
      </Callout>

      <Section>手順1 — プロジェクトを生成する</Section>
      <p>
        アプリを置きたいフォルダに移動してから、次を実行します。<Cmd>taskflow</Cmd> がプロジェクト名、
        <Cmd>--template react-ts</Cmd> が「React + TypeScript のひな形」の指定です。
      </p>
      <Code lang="bash" filename="ターミナル">{`npm create vite@latest taskflow -- --template react-ts`}</Code>
      <p>初回は <Cmd>create-vite</Cmd> の取得可否を聞かれることがあります。<Cmd>y</Cmd> で進めると、次のような出力が出ます。</p>
      <Code lang="text" filename="期待される出力">{`> npx
> create-vite taskflow --template react-ts

Scaffolding project in /Users/you/dev/taskflow...

Done. Now run:

  cd taskflow
  npm install
  npm run dev`}</Code>
      <Callout variant="tip" title="対話形式で聞かれたとき">
        テンプレート指定を省くと、対話形式で選択を求められます。その場合は
        <strong>Framework → React</strong>、<strong>Variant → TypeScript</strong> を矢印キーで選んで Enter します。
        上のように <Cmd>--template react-ts</Cmd> を付けておけば、この質問はスキップされます。
      </Callout>

      <Section>手順2 — 依存パッケージをインストールする</Section>
      <p>生成されたフォルダに入り、必要なパッケージを入れます。</p>
      <Code lang="bash" filename="ターミナル">{`cd taskflow
npm install`}</Code>
      <p>数十秒〜1 分ほどで、次のように「追加した数」が表示されれば成功です。</p>
      <Code lang="text" filename="期待される出力">{`added 275 packages, and audited 276 packages in 9s

found 0 vulnerabilities`}</Code>
      <Callout variant="info" title="node_modules と package-lock.json">
        インストールで <Cmd>node_modules/</Cmd>（実体のパッケージ群）と <Cmd>package-lock.json</Cmd>（固定バージョンの記録）が作られます。
        <Cmd>node_modules</Cmd> は巨大なので Git 管理せず、<Cmd>.gitignore</Cmd> に入れます（Vite のひな形は最初から除外設定済み）。
      </Callout>

      <Section>手順3 — 開発サーバーを起動する</Section>
      <Code lang="bash" filename="ターミナル">{`npm run dev`}</Code>
      <p>次のように、<strong>ローカル URL</strong> が表示されれば起動成功です。</p>
      <Code lang="text" filename="期待される出力">{`  VITE v6.0.0  ready in 412 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help`}</Code>
      <p>
        表示された <Cmd>http://localhost:5173/</Cmd> をブラウザで開くと、<strong>Vite + React のロゴと「count is 0」ボタン</strong>のある初期画面が出ます。
        ボタンを押すたびに数字が増えれば、React が正しく動いています。ここまで来ればセットアップは成功です。
      </p>
      <Callout variant="warn" title="よくあるつまずき">
        <ul>
          <li><strong>ポートが使用中</strong>：<Cmd>Port 5173 is in use, trying another one...</Cmd> と出て <Cmd>5174</Cmd> 等で起動します。表示された URL を開けば OK。</li>
          <li><strong>画面が真っ白</strong>：ターミナルにエラーが出ていないか確認。多くは保存し忘れか、直前の編集の構文エラーです。</li>
          <li><strong>URL を開いても表示されない</strong>：<Cmd>npm run dev</Cmd> を実行したターミナルを<strong>閉じない</strong>こと。サーバーは起動中だけ動きます。止めるときは <Cmd>Ctrl + C</Cmd>。</li>
        </ul>
      </Callout>

      <Section>動作確認 — 変更が即反映されるか（HMR 体験）</Section>
      <p>
        開発サーバーを起動したまま、エディタで <Cmd>src/App.tsx</Cmd> を開き、見出しの文言を書き換えて<strong>保存</strong>します。
      </p>
      <Code lang="tsx" filename="src/App.tsx（一部を書き換え）">{`// 例: どこかの文言を書き換えて保存する
<h1>TaskFlow をこれから作る</h1>`}</Code>
      <p>
        保存した瞬間、ブラウザが<strong>再読み込みなしで</strong>変更を反映します。これが <strong>HMR</strong> です。
        「保存 → 即確認」のループが速いほど開発が快適になります。
      </p>

      <Section>覚えておく 3 つのコマンド（npm scripts）</Section>
      <KVList
        items={[
          { key: "npm run dev", val: "開発サーバーを起動（HMR 付き）。開発中はこれを使う" },
          { key: "npm run build", val: "本番用に最適化してビルド。dist/ に成果物が出る" },
          { key: "npm run preview", val: "build 後の dist/ をローカルで確認する" },
        ]}
      />
      <p>これらの定義は <Cmd>package.json</Cmd> の <Cmd>scripts</Cmd> にあります（次章でファイルの中身を読み解きます）。</p>

      <Bridge course="コンパイラ / ソフトウェア工学（ビルドツールチェーン）">
        <Cmd>.tsx</Cmd> をブラウザ用 JS に変換する工程は、講義で学ぶ<strong>コンパイラ</strong>のパイプライン（字句解析・構文解析・コード生成）の応用です。
        Vite は開発時に <strong>esbuild</strong> で高速変換し、本番は <strong>Rollup</strong> で<strong>バンドル</strong>（依存グラフをたどって 1 つにまとめ、
        使われないコードを削る＝tree shaking）します。「人が読む形で書き、ツールが機械向けに変換する」という分業が、開発体験と実行効率を両立させています。
      </Bridge>

      <Quiz
        question="npm run dev で起動した開発サーバーの URL を開いても画面が出ません。まず確認すべきことは？"
        options={[
          <>パソコンを再起動する</>,
          <><Cmd>npm run dev</Cmd> を実行したターミナルが開いたまま（サーバー起動中）か、URL とポート番号が合っているか</>,
          <><Cmd>npm run build</Cmd> を先に実行する</>,
          <>ブラウザを別のものに変える</>,
        ]}
        answer={1}
        explanation={<>開発サーバーは <Cmd>npm run dev</Cmd> のプロセスが動いている間だけ有効です。ターミナルを閉じると止まります。また、ポートが使用中だと <Cmd>5174</Cmd> 等に変わるので、ターミナルに表示された URL を開きます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "作るのはタスク管理アプリ（一覧 / 詳細 / 新規作成の3画面）。前提は Node.js v18 以上",
          "Vite は .tsx をブラウザ用 JS に変換・最適化するビルドツール。開発は esbuild、本番は Rollup",
          "手順: node -v で確認 → npm create vite@latest <名前> -- --template react-ts → npm install → npm run dev",
          "http://localhost:5173 に初期画面が出れば成功。サーバーは dev 実行中のみ動く（停止は Ctrl+C）",
          "保存で即反映（HMR）。よく使うのは dev / build / preview の3コマンド",
        ]}
      />
    </>
  );
}

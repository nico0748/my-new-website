import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "project-structure-and-files",
  title: "ディレクトリ構成と各ファイルの役割",
  description: "Vite が生成するファイルの意味と、index.html → main.tsx → App.tsx というアプリの起点の流れ。実践向けのディレクトリ構成も設計する。",
  domain: "react-practice",
  section: "setup",
  order: 2,
  level: "practice",
  tags: ["React", "Vite", "プロジェクト構成"],
  updated: "2026-07-07",
  minutes: 12,
};

export default function Article() {
  return (
    <>
      <Lead>
        <Cmd>npm create vite</Cmd> で生成されたフォルダには、たくさんのファイルが並んでいます。最初は「どれが何？」となりますが、
        役割が分かれば怖くありません。ここでは各ファイルの意味と、<strong>アプリがどこから動き始めるか</strong>を追い、
        最後に実践で使いやすいディレクトリ構成を設計します。
      </Lead>

      <Section>生成されるファイル</Section>
      <Code lang="text" filename="taskflow/（初期状態）">{`taskflow/
├─ index.html            ← ブラウザが最初に読むHTML（アプリの入口）
├─ package.json          ← 依存パッケージとnpm scriptsの定義
├─ vite.config.ts        ← Vite の設定
├─ tsconfig.json         ← TypeScript の設定
├─ public/               ← そのまま公開される静的ファイル（favicon等）
└─ src/                  ← アプリのソースコード（ここを書いていく）
   ├─ main.tsx           ← アプリの起点。React を DOM に描画する
   ├─ App.tsx            ← ルートコンポーネント
   ├─ index.css          ← 全体のスタイル
   └─ assets/            ← 画像など`}</Code>

      <Section>各ファイルの役割</Section>
      <KVList
        items={[
          { key: "index.html", val: "ブラウザが最初に読む唯一のHTML。中に <div id=\"root\"> と main.tsx の読み込みがある" },
          { key: "src/main.tsx", val: "アプリの起点。React を #root に描画する（エントリーポイント）" },
          { key: "src/App.tsx", val: "画面の最上位コンポーネント。ここから UI が枝分かれする" },
          { key: "package.json", val: "依存パッケージと dev/build 等のコマンドを定義" },
          { key: "vite.config.ts", val: "Vite の設定（プラグイン・エイリアス・ビルド設定）" },
          { key: "tsconfig.json", val: "TypeScript の型チェック・コンパイル設定" },
          { key: "public/", val: "変換せずそのまま配信する静的ファイル（/favicon.svg など）" },
        ]}
      />

      <Section>アプリの起点 — index.html から main.tsx へ</Section>
      <p>
        SPA（シングルページアプリ）では、HTML は<strong>ほぼ空っぽ</strong>です。中身は JavaScript が後から描画します。
        <Cmd>index.html</Cmd> の要点は次の 2 行です。
      </p>
      <Code lang="html" filename="index.html">{`<body>
  <div id="root"></div>                       <!-- ① React が描画する空の器 -->
  <script type="module" src="/src/main.tsx"></script>  <!-- ② 起点スクリプト -->
</body>`}</Code>
      <p>
        <Cmd>{"<div id=\"root\">"}</Cmd> は React が UI を差し込む「器」です。<Cmd>main.tsx</Cmd> がその器を見つけて、React を描画します。
      </p>

      <SubSection>main.tsx を 1 行ずつ読む</SubSection>
      <Code lang="tsx" filename="src/main.tsx">{`import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`}</Code>
      <KVList
        items={[
          { key: "import { createRoot }", val: "React を実 DOM に接続する関数を react-dom から取り込む" },
          { key: "import App from \"./App\"", val: "自分で書いたルートコンポーネントを読み込む（default export を受け取る）" },
          { key: "import \"./index.css\"", val: "CSS を読み込む（副作用インポート。値は受け取らない）" },
          { key: "document.getElementById(\"root\")", val: "index.html の器を取得。! は「必ず存在する」という TS の表明" },
          { key: ".render(<App />)", val: "その器の中に <App /> を描画する。ここでアプリが動き出す" },
        ]}
      />
      <Callout variant="info" title="StrictMode とは">
        <Cmd>StrictMode</Cmd> は開発時だけ働く「厳しめチェック」です。よくない書き方（副作用の重複など）を洗い出すため、
        <strong>開発中はあえてコンポーネントを2回実行</strong>します。本番ビルドでは無効なので、パフォーマンスへの影響はありません。
      </Callout>

      <Section>実践向けのディレクトリ構成</Section>
      <p>
        初期状態は最小限なので、アプリが育つ前に「役割ごとのフォルダ」を用意しておくと迷いません。このコースでは次の構成で進めます。
      </p>
      <Code lang="text" filename="src/（このコースの構成）">{`src/
├─ main.tsx              ← 起点
├─ App.tsx               ← ルーティングの定義を置く
├─ pages/                ← 画面（URLに対応するコンポーネント）
│  ├─ TaskListPage.tsx
│  ├─ TaskDetailPage.tsx
│  └─ NewTaskPage.tsx
├─ components/           ← 再利用するUI部品
│  ├─ TaskItem.tsx
│  └─ TaskForm.tsx
├─ context/              ← アプリ全体で共有する状態
│  └─ TaskContext.tsx    （Provider と useTasks をここに置く）
├─ lib/                  ← API通信・ユーティリティ
│  └─ api.ts
└─ types/                ← 型定義
   └─ task.ts`}</Code>
      <Callout variant="info" title="カスタムフックの置き場所について">
        「ロジックの再利用」を担う<strong>カスタムフック</strong>は <Cmd>hooks/</Cmd> にまとめる流儀もあります。
        このコースでは、状態を配る <Cmd>TaskProvider</Cmd> と、それを受け取る <Cmd>useTasks</Cmd> は
        <strong>セットで読んだほうが分かりやすい</strong>ため、同じ <Cmd>context/TaskContext.tsx</Cmd> に置きます。
        フックが増えてきたら <Cmd>hooks/</Cmd> を作って切り出す、という順番で構いません。
      </Callout>
      <KVList
        items={[
          { key: "pages/", val: "URL に対応する「画面」。ルーティングの行き先になる" },
          { key: "components/", val: "ボタンやカードなど、複数画面で使い回す部品" },
          { key: "hooks/", val: "状態やロジックを切り出したカスタムフック（use〜）" },
          { key: "lib/", val: "API 通信・日付整形など、UI に依存しない処理" },
          { key: "types/", val: "TypeScript の型（Task など）をまとめる" },
        ]}
      />
      <Callout variant="tip" title="迷ったら「役割で分ける」">
        小規模なうちは上のような<strong>役割ベース</strong>で十分です。規模が大きくなったら、機能ごとにまとめる
        <strong>features ベース</strong>（<Cmd>features/tasks/</Cmd> の下に components・hooks・api をまとめる）に移行します。
        大事なのは「関係するものを近くに置き、探しやすくする」ことです。
      </Callout>

      <Bridge course="ソフトウェア工学（モジュール性・関心の分離）">
        ディレクトリ設計は、講義で学ぶ<strong>関心の分離（separation of concerns）</strong>と<strong>凝集度・結合度</strong>の実践です。
        「画面（pages）」「部品（components）」「ロジック（hooks/lib）」を分けるのは、<strong>高凝集・低結合</strong>——関係するものは近くに、
        依存は少なく——を作るため。変更の影響範囲が読める構成は、それ自体が設計品質です。「どこに何があるか」を規約で決めておくと、
        チームでも認知負荷が下がります。
      </Bridge>

      <Quiz
        question="React アプリが最初に動き出す（描画が始まる）のはどのファイル？"
        options={[
          <><Cmd>index.html</Cmd> だけで完結する</>,
          <><Cmd>App.tsx</Cmd> が自動実行される</>,
          <><Cmd>main.tsx</Cmd> が #root を取得して render する</>,
          <><Cmd>package.json</Cmd> がコンポーネントを描画する</>,
        ]}
        answer={2}
        explanation={<><Cmd>index.html</Cmd> の <Cmd>{"<script src=\"/src/main.tsx\">"}</Cmd> が <Cmd>main.tsx</Cmd> を読み込み、<Cmd>createRoot(...).render(&lt;App /&gt;)</Cmd> で <Cmd>#root</Cmd> に描画します。ここがアプリの起点です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "index.html は空の器 <div id=\"root\"> と main.tsx の読み込みを持つ入口",
          "main.tsx が起点：createRoot(#root).render(<App />) でアプリが動き出す",
          "App.tsx はルートコンポーネント。ここからUIが枝分かれする",
          "実践では pages / components / hooks / lib / types に役割で分けると迷わない",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { StepFlow, SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "react-router-basics",
  title: "React Router でルーティング（設定と原理）",
  description: "SPA が「ページを再読み込みせず画面を切り替える」原理（History API）を理解し、React Router で一覧・詳細・新規作成のルーティングを設定する。",
  domain: "react-practice",
  section: "state-routing",
  order: 1,
  level: "practice",
  tags: ["React", "ルーティング", "React Router"],
  updated: "2026-07-07",
  minutes: 13,
};

export default function Article() {
  return (
    <>
      <Lead>
        タスク管理アプリには「一覧」「詳細」「新規作成」の 3 画面があります。URL に応じて表示を切り替えるのが<strong>ルーティング</strong>です。
        SPA では、これを<strong>ページ全体を再読み込みせず</strong>に行うのが肝。まず原理を押さえ、<Cmd>React Router</Cmd> で設定します。
      </Lead>

      <Section>SPA のルーティングとは（原理）</Section>
      <p>
        従来の Web は、リンクを踏むたびに<strong>サーバーから新しい HTML を取得</strong>し、ページ全体が再読み込みされました。
        SPA（シングルページアプリ）は違います。最初に 1 枚の HTML と JS を読み込んだ後は、
        <strong>URL を書き換えつつ、JavaScript が表示するコンポーネントだけを差し替えます</strong>。
      </p>
      <SequenceDiagram
        actors={["ブラウザ(JS)", "Router"]}
        messages={[
          { from: 0, to: 1, label: "① Link クリック（/tasks/1 へ）" },
          { from: 1, to: 1, label: "② history.pushState で URL 変更" },
          { from: 1, to: 0, label: "③ URL に一致する画面を描画", cta: true },
        ]}
        caption="ページ全体を再読み込みせず、URL と表示を切り替える"
      />
      <Callout variant="info" title="鍵は History API">
        ブラウザには <Cmd>history.pushState()</Cmd> という API があり、<strong>ページを再読み込みせずに URL を書き換え</strong>られます。
        戻る/進むボタンを押すと <Cmd>popstate</Cmd> イベントが発火します。React Router はこの仕組みを包み、
        「今の URL」に一致するコンポーネントを描画してくれます。これが SPA ルーティングの正体です。
      </Callout>

      <Section>導入 — react-router-dom</Section>
      <Code lang="bash" filename="ターミナル">{`npm install react-router-dom`}</Code>
      <p>まずアプリ全体を <Cmd>BrowserRouter</Cmd> で包みます。これでルーティング機能が使えるようになります。</p>
      <Code lang="tsx" filename="src/main.tsx">{`import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>          {/* ← アプリ全体をルーターで包む */}
      <App />
    </BrowserRouter>
  </StrictMode>
);`}</Code>

      <Section>ルートを定義する</Section>
      <p>
        <Cmd>App.tsx</Cmd> に「どの URL でどのコンポーネントを表示するか」を <Cmd>Routes</Cmd> / <Cmd>Route</Cmd> で書きます。
      </p>
      <Code lang="tsx" filename="src/App.tsx">{`import { Routes, Route } from "react-router-dom";
import { TaskListPage } from "./pages/TaskListPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { NewTaskPage } from "./pages/NewTaskPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskListPage />} />
      <Route path="/tasks/new" element={<NewTaskPage />} />
      <Route path="/tasks/:id" element={<TaskDetailPage />} />
      <Route path="*" element={<p>ページが見つかりません</p>} />
    </Routes>
  );
}`}</Code>
      <KVList
        items={[
          { key: "path=\"/\"", val: "URL がこれと一致したら element を表示する" },
          { key: ":id（コロン）", val: "動的セグメント。/tasks/1 でも /tasks/2 でもマッチし、id を取り出せる" },
          { key: "path=\"*\"", val: "どれにも一致しないときのフォールバック（404 表示）" },
          { key: "element", val: "その URL で描画するコンポーネントを渡す" },
        ]}
      />
      <Callout variant="warn" title="具体的なパスを先に書く">
        <Cmd>/tasks/new</Cmd> を <Cmd>/tasks/:id</Cmd> より<strong>先に</strong>置きます。順序を逆にすると、<Cmd>new</Cmd> が
        <Cmd>:id</Cmd>（id="new"）として解釈されてしまうことがあります。具体的なルートを上に、という原則です。
      </Callout>

      <Section>画面を移動する — Link</Section>
      <p>
        遷移には <Cmd>{"<a>"}</Cmd> ではなく <Cmd>{"<Link>"}</Cmd> を使います。<Cmd>{"<a>"}</Cmd> はページ全体を再読み込みしてしまい、
        SPA の利点（速い遷移・状態の保持）が消えるからです。
      </p>
      <Code lang="tsx" filename="遷移リンク">{`import { Link } from "react-router-dom";

<Link to={\`/tasks/\${task.id}\`}>詳細を見る</Link>
<Link to="/tasks/new">新規作成</Link>`}</Code>
      <Figure
        src="/learn/shots/react-practice/react-router-basics-01.svg"
        alt="一覧画面から詳細へ遷移した直後のブラウザ。アドレスバーが /tasks/1 に変わり、表示も詳細に切り替わっている"
        caption="Link を押すとアドレスバーが /tasks/1 に変わり、表示だけが差し替わる（再読み込みは起きない）"
      />

      <Section>URL からパラメータを取り出す — useParams</Section>
      <p>詳細ページでは、URL の <Cmd>:id</Cmd> 部分を <Cmd>useParams</Cmd> で受け取ります。</p>
      <Code lang="tsx" filename="src/pages/TaskDetailPage.tsx">{`import { useParams } from "react-router-dom";

export function TaskDetailPage() {
  const { id } = useParams();   // /tasks/1 なら id === "1"
  return <p>タスク {id} の詳細</p>;
}`}</Code>

      <Section>プログラムから遷移する — useNavigate</Section>
      <p>「作成ボタンを押したら一覧へ戻る」のように、<strong>処理の後に遷移</strong>したいときは <Cmd>useNavigate</Cmd> を使います。</p>
      <Code lang="tsx" filename="src/pages/NewTaskPage.tsx">{`import { useNavigate } from "react-router-dom";

export function NewTaskPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ...タスクを保存する処理...
    navigate("/");   // 保存できたら一覧へ移動
  };

  return <form onSubmit={handleSubmit}>{/* 入力欄など */}</form>;
}`}</Code>

      <Section>まとめ — 遷移の流れ</Section>
      <StepFlow
        steps={[
          { title: "Link をクリック（または navigate 実行）", desc: "遷移を依頼する" },
          { title: "History API で URL を書き換え", desc: "ページは再読み込みしない（pushState）" },
          { title: "Router が現在の URL とルートを照合", desc: "path とマッチする Route を探す" },
          { title: "一致した element を描画", desc: "画面のうち必要な部分だけ差し替わる" },
        ]}
        caption="SPA ルーティングの一巡"
      />
      <Figure
        src="/learn/shots/react-practice/react-router-basics-02.svg"
        alt="DevTools の Network タブ。画面遷移しても HTML ドキュメントの再取得リクエストが記録されていない"
        caption="Network タブで確認すると、遷移しても HTML の再取得は発生していない ─ これが SPA の速さの正体"
      />

      <Bridge course="ネットワーク / 状態機械 / グラフ理論">
        URL は<strong>アプリの「今の状態」を表す住所</strong>です。ルーティングは「URL という<strong>状態</strong>」から「表示（コンポーネント）」への写像——
        講義で学ぶ<strong>状態機械</strong>の考え方に対応します。<Cmd>history.pushState</Cmd> はネットワークの授業で触れる
        <strong>ブラウザ History API</strong> で、URL を変えても<strong>サーバーへリクエストを送らない</strong>のがポイント（だから速い）。
        ルート定義は木構造（ネスト可能）で、URL のパスをたどってノードを選ぶのは<strong>木の探索</strong>そのものです。
        「URL を状態の正とする」設計により、リロードや共有・戻る/進むが自然に機能します。
      </Bridge>

      <Quiz
        question="SPA でページ内リンクに <a href> ではなく <Link> を使う主な理由は？"
        options={[
          <><Cmd>{"<a>"}</Cmd> は使えないから</>,
          <><Cmd>{"<a>"}</Cmd> はページ全体を再読み込みし、SPA の速い遷移や状態保持が失われるから</>,
          <>見た目が変わるから</>,
          <><Cmd>{"<Link>"}</Cmd> の方が SEO に良いから</>,
        ]}
        answer={1}
        explanation={<><Cmd>{"<a>"}</Cmd> は通常のページ遷移（サーバーへのリクエスト＋全体再読み込み）を起こします。<Cmd>{"<Link>"}</Cmd> は History API で URL だけを書き換え、必要なコンポーネントだけを差し替えるため、速く・状態も保てます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "SPA は History API（pushState/popstate）で、再読み込みせず URL と表示を切り替える",
          "BrowserRouter で全体を包み、Routes / Route に path と element を定義する",
          ":id は動的セグメント。useParams で取り出す。* は 404 フォールバック",
          "遷移は <Link>（<a> は再読み込みで NG）。処理後の遷移は useNavigate",
          "URL＝アプリの状態。Router が URL とルート木を照合し、一致部分だけ描画する",
        ]}
      />
    </>
  );
}

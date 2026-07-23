import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider, Figure } from "../../../components/learn/kit";
import type { CSSProperties } from "react";

export const meta: LearnMeta = {
  id: "state-management",
  title: "状態管理 — useState・リフトアップ・Context・useReducer",
  description: "ローカル状態から Context・useReducer までを、タスクアプリの CRUD を題材に段階的に。prop drilling の解消と、状態管理ライブラリの位置づけも。",
  domain: "react-practice",
  section: "state-routing",
  order: 2,
  level: "practice",
  tags: ["React", "状態管理", "Context"],
  updated: "2026-07-07",
  minutes: 13,
};

const pdPanel: CSSProperties = {
  flex: 1, minWidth: 250, background: "var(--color-surface)",
  border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px",
};
const pdTitle: CSSProperties = { fontSize: 13, fontWeight: 700, color: "var(--color-navy)", marginBottom: 12 };
const pdNode = (accent: string): CSSProperties => ({
  border: `2px solid ${accent}`, borderRadius: 8, padding: "8px 12px",
  fontSize: 13.5, color: "var(--color-text)", background: "var(--color-surface)",
});
const pdMuted: CSSProperties = { color: "var(--color-text-secondary)", fontSize: 12 };
const pdPass: CSSProperties = { fontSize: 11, color: "var(--color-cta)", fontWeight: 700, textAlign: "center", margin: "5px 0" };
const pdDirect: CSSProperties = { fontSize: 11, color: "var(--color-primary)", fontWeight: 700, textAlign: "center", margin: "5px 0" };

export default function Article() {
  return (
    <>
      <Lead>
        アプリが育つと「この状態をどこに置くか」が悩みになります。React の状態管理は、<Cmd>useState</Cmd> →
        リフトアップ → <Cmd>Context</Cmd> → <Cmd>useReducer</Cmd> と段階があります。タスクアプリの CRUD を題材に、
        必要に応じて道具を足していく考え方を身につけます。
      </Lead>

      <Section>状態には種類がある</Section>
      <KVList
        items={[
          { key: "ローカル状態", val: "1つのコンポーネント内で完結（入力欄の値・開閉フラグ）。useState" },
          { key: "共有状態", val: "複数の画面・部品で共有（tasks 一覧・ログインユーザー）。リフトアップ/Context" },
          { key: "サーバー状態", val: "サーバーが持つデータのコピー（API から取得）。TanStack Query 等が向く" },
        ]}
      />
      <p>まずはローカルと共有を扱います。サーバー状態は「データ取得」章で深掘りします。</p>

      <Section>リフトアップの限界 — prop drilling</Section>
      <p>
        共有状態は共通の親に置く（リフトアップ）のが基本でした。しかし階層が深いと、<strong>使わない中間コンポーネントにも
        props をバケツリレー</strong>することになります。これを <strong>prop drilling</strong> と呼びます。
      </p>
      <div className="dgm">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* 左: prop drilling */}
          <div style={pdPanel}>
            <div style={pdTitle}>prop drilling（バケツリレー）</div>
            <div style={pdNode("var(--color-navy)")}>App<span style={pdMuted}> — tasks を持つ</span></div>
            <div style={pdPass}>↓ props: tasks を渡す</div>
            <div style={pdNode("var(--color-border)")}>Layout<span style={pdMuted}> — 使わない（素通り）</span></div>
            <div style={pdPass}>↓ props: tasks を渡す</div>
            <div style={pdNode("var(--color-border)")}>Sidebar<span style={pdMuted}> — 使わない（素通り）</span></div>
            <div style={pdPass}>↓ props: tasks を渡す</div>
            <div style={pdNode("var(--color-cta)")}>TaskList<span style={pdMuted}> — ここで初めて使う</span></div>
          </div>
          {/* 右: Context */}
          <div style={pdPanel}>
            <div style={pdTitle}>Context で直接届ける</div>
            <div style={pdNode("var(--color-primary)")}>App / TaskProvider<span style={pdMuted}> — tasks を提供</span></div>
            <div style={{ ...pdMuted, textAlign: "center", margin: "8px 0" }}>Layout・Sidebar は間にあるが<br />props を渡さなくてよい</div>
            <div style={pdDirect}>┈┈ useTasks() で直接 ┈┈▶</div>
            <div style={pdNode("var(--color-primary)")}>TaskList<span style={pdMuted}> — そのまま受け取って使う</span></div>
          </div>
        </div>
        <div className="dgm-caption">
          prop drilling は「使わない中間」にも props を通す。Context は提供元から使う場所へ直接届ける
        </div>
      </div>

      <Section>Context で共有状態を配る</Section>
      <p>
        <Cmd>Context</Cmd> は「離れた子孫に、props を経由せず値を届ける」仕組みです。<Cmd>createContext</Cmd> で入れ物を作り、
        <Cmd>Provider</Cmd> で値を配り、<Cmd>useContext</Cmd> で受け取ります。
      </p>
      <Code lang="tsx" filename="src/context/TaskContext.tsx">{`import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "../types/task";

interface TaskContextValue {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string) =>
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title, done: false }]);

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask }}>
      {children}
    </TaskContext.Provider>
  );
}

// 受け取り側を短く書くためのカスタムフック
export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks は TaskProvider の中で使ってください");
  return ctx;
}`}</Code>
      <p>あとは <Cmd>App</Cmd> を <Cmd>{"<TaskProvider>"}</Cmd> で包み、どの子孫からでも <Cmd>useTasks()</Cmd> で読めます。</p>
      <Code lang="tsx" filename="使う側（どの深さでもOK）">{`function TaskList() {
  const { tasks, toggleTask } = useTasks();   // props 不要で直接取れる
  return (
    <ul>
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={toggleTask} />
      ))}
    </ul>
  );
}`}</Code>
      <Figure
        src="/learn/shots/react-practice/state-management-01.svg"
        alt="React DevTools の Components タブで TaskProvider を選び、Context の値である tasks 配列を確認している画面"
        caption="React DevTools の Components タブなら、Provider が配っている値を目で確認できる"
      />
      <Callout variant="warn" title="Context の使いどころ">
        Context は「全体で共有する少数の状態（テーマ・ログインユーザー・カート）」に向きます。<strong>頻繁に変わる大きな状態</strong>を
        1 つの Context に詰めると、値が変わるたびに<strong>読んでいる全コンポーネントが再描画</strong>されます。分割するか、後述のライブラリを検討します。
      </Callout>

      <Section>アプリに組み込む — ここまでを実際に動かす</Section>
      <p>
        ファイルを作っただけでは<strong>画面は何も変わりません</strong>。<Cmd>TaskContext.tsx</Cmd> はまだどこからも読み込まれていないからです。
        ここで 2 つのファイルを書き換えて、実際に Context 経由でタスクが表示される状態にします。
      </p>

      <SubSection>① main.tsx を TaskProvider で包む</SubSection>
      <p>
        <Cmd>BrowserRouter</Cmd> の<strong>内側</strong>に置きます。こうするとルーティングで切り替わるどの画面からも
        <Cmd>useTasks()</Cmd> が使えます。
      </p>
      <Code lang="tsx" filename="src/main.tsx">{`import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";   // ← 追加
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TaskProvider>        {/* ← 追加: この内側なら全画面から useTasks() が使える */}
        <App />
      </TaskProvider>
    </BrowserRouter>
  </StrictMode>
);`}</Code>

      <SubSection>② TaskListPage を useTasks() 版に書き換える</SubSection>
      <p>
        前章まで <Cmd>TaskListPage</Cmd> は自分で <Cmd>useState</Cmd> を持っていました。これを Context から受け取る形に変えます。
        <strong>自前の state が消えて、代わりに 1 行で共有状態を取れる</strong>のがポイントです。追加フォームも付けて、書き込み側も試します。
      </p>
      <Code lang="tsx" filename="src/pages/TaskListPage.tsx">{`import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskItem } from "../components/TaskItem";

export function TaskListPage() {
  // タスク本体は Context から。useState<Task[]> はもう要らない
  const { tasks, addTask, toggleTask } = useTasks();
  // 入力欄の文字だけは、この画面ローカルの state で持つ
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;   // 空文字は追加しない
    addTask(title);              // Context の関数を呼ぶ
    setTitle("");                // 入力欄を空に戻す
  };

  return (
    <div>
      <h1>タスク一覧</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="やることを入力"
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={toggleTask} />
        ))}
      </ul>
    </div>
  );
}`}</Code>

      <SubSection>③ 動作を確認する</SubSection>
      <p>
        <Cmd>npm run dev</Cmd> で開発サーバーを起動し、<Cmd>http://localhost:5173</Cmd> を開きます。次の 3 つが確認できれば成功です。
      </p>
      <KVList
        items={[
          { key: "追加できる", val: "入力欄に文字を入れて「追加」を押すと、一覧に増える" },
          { key: "切り替えられる", val: "チェックボックスを押すと完了状態が変わる" },
          { key: "state が消えていない", val: "TaskListPage に useState<Task[]> が無いのに一覧が保持される（＝Context が効いている）" },
        ]}
      />
      <Callout variant="info" title="最初は空で正しい">
        <Cmd>TaskProvider</Cmd> の初期値は <Cmd>useState&lt;Task[]&gt;([])</Cmd>、つまり<strong>空の配列</strong>です。
        起動直後に一覧が空なのは正常で、「追加」を押して初めて表示されます。最初から数件入れておきたい場合は、
        この初期値に配列リテラルを書けば構いません（データを取得して埋めるのは次章の「CRUD」で扱います）。
      </Callout>
      <Callout variant="warn" title="lint の警告が 1 件出ることがある">
        <Cmd>TaskContext.tsx</Cmd> はコンポーネント（<Cmd>TaskProvider</Cmd>）とフック（<Cmd>useTasks</Cmd>）を
        同じファイルから export しているため、テンプレート同梱の lint が
        <Cmd>Fast refresh only works when a file only exports components</Cmd> という警告を出します。
        <strong>動作に問題はありません</strong>。気になる場合は <Cmd>useTasks</Cmd> を別ファイル
        （例: <Cmd>src/hooks/useTasks.ts</Cmd>）に切り出すと消えます。
      </Callout>

      <Section>useReducer で CRUD をまとめる</Section>
      <p>
        追加・切替・更新・削除…と操作が増えると、<Cmd>useState</Cmd> の更新関数が散らばります。<Cmd>useReducer</Cmd> は
        「現在の状態 + 操作（action）→ 次の状態」を<strong>1 つの関数（reducer）</strong>に集約します。状態遷移が一覧できて見通しが良くなります。
      </p>
      <Code lang="tsx" filename="src/reducers/tasksReducer.ts">{`import type { Task } from "../types/task";

type Action =
  | { type: "add"; title: string }
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string };

export function tasksReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "add":
      return [...state, { id: crypto.randomUUID(), title: action.title, done: false }];
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "remove":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}`}</Code>
      <Code lang="tsx" filename="使う側">{`const [tasks, dispatch] = useReducer(tasksReducer, []);

dispatch({ type: "add", title: "牛乳を買う" });
dispatch({ type: "toggle", id });
dispatch({ type: "remove", id });`}</Code>
      <Callout variant="tip" title="Context × useReducer">
        実務では <strong>Context に <Cmd>state</Cmd> と <Cmd>dispatch</Cmd> を載せて配る</strong>パターンが定番です。
        「状態の形と遷移は reducer に集約、配布は Context」で、小〜中規模なら外部ライブラリなしでも十分戦えます。
      </Callout>

      <Section>状態管理ライブラリの位置づけ</Section>
      <ComparisonTable
        headers={["道具", "向いている規模・用途"]}
        rows={[
          [<Cmd>useState</Cmd>, "ローカルな単純状態"],
          [<>リフトアップ / <Cmd>Context</Cmd></>, "少数の共有状態（テーマ・ユーザー・タスク一覧）"],
          [<Cmd>useReducer</Cmd>, "操作が多く、状態遷移を集約したいとき"],
          ["Zustand / Jotai", "軽量なグローバル状態。Context の再描画問題を回避したい"],
          ["Redux Toolkit", "大規模・複雑な状態と、厳密な履歴・デバッグが要るとき"],
          ["TanStack Query", "サーバー状態（取得・キャッシュ・再取得）。次章で扱う"],
        ]}
      />
      <p>「まず useState → 困ったら Context/useReducer → それでも辛ければライブラリ」と、必要になってから足すのが健全です。</p>

      <Bridge course="計算モデル（状態機械）／ソフトウェア工学（単一情報源）">
        <Cmd>useReducer</Cmd> の <Cmd>reducer(state, action)</Cmd> は、講義で学ぶ<strong>有限状態機械の遷移関数 δ(状態, 入力) → 次状態</strong>そのものです。
        「現在の状態と操作から次の状態が一意に決まる」純粋関数にすることで、テストしやすく、時間をさかのぼるデバッグ（time-travel）も可能になります。
        状態を 1 か所に集約する<strong>単一情報源（single source of truth）</strong>は、UI の不整合を根本から防ぐ設計原則です。
      </Bridge>

      <Quiz
        question="中間コンポーネントが使いもしない props を、深い子孫へ延々と受け渡してしまう問題を何と呼ぶ？"
        options={[
          <>リフトアップ</>,
          <>prop drilling（バケツリレー）</>,
          <>レンダリング</>,
          <>ミューテーション</>,
        ]}
        answer={1}
        explanation={<>prop drilling です。共有したい値が深い階層で使われるとき、<Cmd>Context</Cmd> を使うと中間を経由せず直接届けられます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "状態はローカル / 共有 / サーバーに分けて考える",
          "共有はまずリフトアップ。階層が深いと prop drilling → Context で解消",
          "Context は createContext / Provider / useContext。頻繁に変わる巨大状態は再描画に注意",
          "useReducer は reducer(state, action) に遷移を集約。Context と組み合わせるのが定番",
          "困ってから Zustand/Redux 等を足す。サーバー状態は TanStack Query（次章）",
        ]}
      />
    </>
  );
}

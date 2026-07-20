import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider, Figure } from "../../../components/learn/kit";
import type { CSSProperties } from "react";

export const meta: LearnMeta = {
  id: "component-design",
  title: "コンポーネント設計と管理",
  description: "タスク一覧を例に、UI をコンポーネントへ分割し、props と状態のリフトアップで管理する。ファイル内の import・export・return の読み方も丁寧に。",
  domain: "react-practice",
  section: "components",
  order: 1,
  level: "practice",
  tags: ["React", "コンポーネント", "設計"],
  updated: "2026-07-07",
  minutes: 12,
};

const box = (color: string): CSSProperties => ({
  position: "relative", border: `2px solid ${color}`, borderRadius: 8,
  padding: "24px 12px 12px", marginTop: 14, background: "var(--color-surface)",
});
const tag = (bg: string): CSSProperties => ({
  position: "absolute", top: -10, left: 12, background: bg, color: "#fff",
  fontSize: 11.5, fontWeight: 700, padding: "2px 10px", borderRadius: 999, whiteSpace: "nowrap",
});
const itemRow: CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--color-border)",
  borderRadius: 6, padding: "7px 10px", marginTop: 8, fontSize: 14, color: "var(--color-text)",
};
const cbox: CSSProperties = { width: 14, height: 14, border: "2px solid var(--color-text-secondary)", borderRadius: 3, flexShrink: 0 };
const cboxOn: CSSProperties = { width: 14, height: 14, border: "2px solid var(--color-primary)", background: "var(--color-primary)", borderRadius: 3, flexShrink: 0 };
const itemTag: CSSProperties = { marginLeft: "auto", fontSize: 10.5, color: "var(--color-navy)", fontWeight: 700 };

export default function Article() {
  return (
    <>
      <Lead>
        React の画面は<strong>コンポーネント</strong>（UI の部品）の組み合わせで作ります。ここではタスク一覧を題材に、
        「どう分割するか」「どう連携させるか」を設計し、あわせて実務でつまずきやすい
        <strong>import・export・return の読み方</strong>を 1 つずつ確認します。
      </Lead>

      <Section>分割の考え方 — 単一責任</Section>
      <p>
        1 つのコンポーネントに<strong>1 つの役割</strong>を持たせます。大きな画面をそのまま書くのではなく、
        「一覧」「1 件の行」「追加フォーム」のように意味のかたまりで切り出すと、読みやすく再利用しやすくなります。
      </p>
      <div className="dgm">
        <div style={box("var(--color-primary)")}>
          <span style={tag("var(--color-primary)")}>TaskListPage — 画面（親・状態を持つ）</span>

          <div style={box("var(--color-cta)")}>
            <span style={tag("var(--color-cta)")}>TaskForm — 追加フォーム</span>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, border: "1px solid var(--color-border)", borderRadius: 6, padding: "6px 10px", color: "var(--color-text-secondary)", fontSize: 13 }}>新しいタスク…</div>
              <div style={{ background: "var(--color-cta)", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>追加</div>
            </div>
          </div>

          <div style={box("var(--color-navy)")}>
            <span style={tag("var(--color-navy)")}>TaskList — 一覧（map で TaskItem を並べる）</span>
            <div style={itemRow}><span style={cbox} />牛乳を買う<span style={itemTag}>= TaskItem</span></div>
            <div style={itemRow}><span style={cboxOn} />React を学ぶ<span style={itemTag}>= TaskItem</span></div>
          </div>
        </div>
        <div className="dgm-caption">1 つの画面（親）を、役割ごとの部品（子）に切り分ける ─ これがコンポーネント設計</div>
      </div>

      <Section>まず型を決める</Section>
      <p>データの形（型）を先に決めると、以降のコードが安全になります。</p>
      <Code lang="tsx" filename="src/types/task.ts">{`export interface Task {
  id: string;
  title: string;
  done: boolean;
}`}</Code>

      <Section>子コンポーネント — TaskItem</Section>
      <p>1 件のタスクを表示する部品です。データは <strong>props</strong> で親から受け取ります。</p>
      <Code lang="tsx" filename="src/components/TaskItem.tsx">{`import type { Task } from "../types/task";

interface Props {
  task: Task;
  onToggle: (id: string) => void;   // 完了を切り替える「親の関数」を受け取る
}

export function TaskItem({ task, onToggle }: Props) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
        />
        {task.title}
      </label>
    </li>
  );
}`}</Code>
      <Callout variant="tip" title="子から親へは「関数を渡す」">
        子コンポーネントは自分でデータを書き換えず、<strong>親から渡された関数（<Cmd>onToggle</Cmd>）を呼ぶ</strong>だけにします。
        こうすると「状態を持つのは親、表示するのは子」という役割分担がはっきりします（＝データは上から下、通知は下から上）。
      </Callout>

      <Section>親コンポーネント — 一覧画面</Section>
      <p>タスクの<strong>状態を持ち</strong>、子部品を組み合わせるのが親（画面）です。</p>
      <Code lang="tsx" filename="src/pages/TaskListPage.tsx">{`import { useState } from "react";
import type { Task } from "../types/task";
import { TaskItem } from "../components/TaskItem";

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "牛乳を買う", done: false },
    { id: "2", title: "React を学ぶ", done: true },
  ]);

  // done を反転した新しい配列を作って state を更新する
  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div>
      <h1>タスク一覧</h1>
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={toggle} />
        ))}
      </ul>
    </div>
  );
}`}</Code>
      <Figure
        src="/learn/shots/react-practice/component-design-01.svg"
        alt="ブラウザに表示されたタスク一覧。2件のタスクが並び、片方のチェックボックスが完了になっている"
        caption="親（TaskListPage）が状態を持ち、子（TaskItem）が表示する。チェックすると親の toggle が呼ばれる"
      />

      <Section>状態はどこに置く？ — リフトアップ</Section>
      <p>
        「タスクの一覧（<Cmd>tasks</Cmd>）」は、一覧表示にも追加にも使います。こういう<strong>複数の部品が共有する状態</strong>は、
        それらの<strong>共通の親</strong>に置きます。これを<strong>状態のリフトアップ</strong>と呼びます。子は props で受け取り、
        変更は親の関数を呼んで依頼します。
      </p>
      <ComparisonTable
        headers={["向き", "何を渡す", "例"]}
        rows={[
          ["親 → 子", "データ（props）", "task, tasks"],
          ["子 → 親", "通知（コールバック関数）", "onToggle, onDelete"],
        ]}
      />

      <Section>コンポーネントのコードを 1 行ずつ読む</Section>
      <p>
        ここまで書いた <Cmd>TaskItem</Cmd> を、ファイルの上から順に、要素をもれなく読み解きます。1 つのコンポーネントには
        <strong>「import → 型 → 宣言（＋分割代入）→ return → export」</strong>がひととおり詰まっています。この“型”が身につくと、他人のコードもスッと読めます。
      </p>
      <Code lang="tsx" filename="src/components/TaskItem.tsx（全体）">{`import type { Task } from "../types/task";           // ① 型を取り込む

interface Props {                                    // ② props の型（契約）
  task: Task;                                        //    データ
  onToggle: (id: string) => void;                    //    関数も型で受け取る
}

export function TaskItem({ task, onToggle }: Props) { // ③ export + 宣言 + props を分割代入
  return (                                            // ④ 画面(JSX)を返す
    <li>
      <label>
        <input
          type="checkbox"                             //    文字列の属性はそのまま
          checked={task.done}                         // ⑤ {} は式。値を属性へ渡す
          onChange={() => onToggle(task.id)}          // ⑥ イベントに関数を渡す（呼ばない）
        />
        {task.title}                                  // ⑦ {} で値を画面に埋め込む
      </label>
    </li>
  );
}`}</Code>
      <p>
        まず骨格から。② <Cmd>interface Props</Cmd> は「何を渡すか」を決める型で、<Cmd>{"onToggle: (id: string) => void"}</Cmd> のように
        <strong>関数も型で受け取れます</strong>。③ <Cmd>{"export function TaskItem({ task, onToggle }: Props)"}</Cmd> は「公開する関数コンポーネント」の宣言で、
        引数の props を<strong>分割代入</strong>で受けています（<Cmd>props.task</Cmd> と書かず <Cmd>task</Cmd> と書ける）。戻り値の JSX の型は自動で推論されます。
        以下、<strong>import</strong>・<strong>return</strong>・<strong>export</strong> をもう少し詳しく見ます。
      </p>

      <SubSection>import — 何を取り込むか</SubSection>
      <Code lang="tsx" filename="import の4つの形">{`import { useState } from "react";           // 名前付き（{} 付き・複数可）
import App from "./App";                    // デフォルト（{} なし・名前は自由）
import type { Task } from "../types/task";  // 型だけ（実行コードに残らない）
import "./index.css";                       // 副作用インポート（値は受け取らない）`}</Code>
      <KVList
        items={[
          { key: "名前付き（{} 付き）", val: "import { useState } from \"react\"。相手の export した「名前」で取り込む。複数を , で並べられる" },
          { key: "デフォルト（{} なし）", val: "import App from \"./App\"。相手の default export を好きな名前で受け取る（1ファイル1つ）" },
          { key: "型だけ（import type）", val: "型情報のみ。ビルド時に消え、実行コードには残らない" },
          { key: "副作用インポート", val: "import \"./index.css\"。値は受け取らず、読み込む（CSS 適用など）ためだけに書く" },
          { key: "相対 vs パッケージ", val: "\"./\" や \"../\" 始まりは自分のファイル、それ以外は node_modules のパッケージ" },
        ]}
      />

      <SubSection>export — 外に公開する</SubSection>
      <Code lang="tsx" filename="export の2種類">{`// 名前付きエクスポート（1ファイルに複数OK）
export function TaskItem() { /* ... */ }
// → import { TaskItem } from "./TaskItem"

// デフォルトエクスポート（1ファイルに1つ）
export default function App() { /* ... */ }
// → import App from "./App"（名前は自由）`}</Code>
      <Callout variant="warn" title="どちらを使う？">
        このコースは<strong>名前付きエクスポート</strong>を基本にします。名前が固定されるので、インポート側のタイポや名前ゆれを防げます。
        （ページのエントリーなど、1 ファイル 1 公開が明確な場合だけ default を使う、という運用が扱いやすいです。）
      </Callout>

      <SubSection>return — 何を画面に出すか</SubSection>
      <p>
        コンポーネント関数が <Cmd>return</Cmd> する <strong>JSX</strong> が、そのまま画面になります。一覧の <Cmd>return</Cmd> の中身を分解します。
      </p>
      <Code lang="tsx" filename="return の中身">{`return (
  <ul>
    {tasks.map((task) => (            // ① 配列を JSX の配列に変換
      <TaskItem
        key={task.id}                // ② key: どの要素かを React に伝える（必須）
        task={task}                  // ③ props: データを子へ渡す
        onToggle={toggle}            // ④ props: 関数を子へ渡す
      />
    ))}
  </ul>
);`}</Code>
      <KVList
        items={[
          { key: "{ } の中は JavaScript", val: "JSX の中で {} を書くと、その中は式として評価される（tasks.map(...) など）" },
          { key: "map で一覧を作る", val: "配列を .map() で <TaskItem /> の配列に変換すると、まとめて描画される" },
          { key: "key が必須の理由", val: "再描画時に「どの要素が同じか」を React が対応づけるための目印。安定した id を渡す" },
          { key: "task={task} は props", val: "属性のように書くと、子コンポーネントに値が渡る" },
        ]}
      />

      <Bridge course="ソフトウェア工学（コンポーネント指向・単一責任）">
        コンポーネント分割は、講義で学ぶ<strong>単一責任の原則</strong>と<strong>モジュール分割</strong>の実践そのもの。「表示する子」と「状態を持つ親」に分けるのは
        <strong>関心の分離</strong>で、<Cmd>props</Cmd> は<strong>モジュール間のインターフェース（契約）</strong>にあたります。
        「データは上から下（props）、通知は下から上（コールバック）」という一方向データフローは、状態変化の経路を追いやすくし、
        バグの温床である<strong>双方向の暗黙依存</strong>を避けるための設計判断です。
      </Bridge>

      <Quiz
        question="配列 tasks を一覧表示するとき、<TaskItem /> に必ず渡すべき「React が要素を対応づけるための目印」はどれ？"
        options={[
          <Cmd>id</Cmd>,
          <Cmd>key</Cmd>,
          <Cmd>ref</Cmd>,
          <Cmd>index</Cmd>,
        ]}
        answer={1}
        explanation={<><Cmd>key</Cmd> です。再描画時に新旧の要素を対応づけるために使い、<Cmd>task.id</Cmd> のような<strong>安定した一意の値</strong>を渡します。配列の <Cmd>index</Cmd> を key にすると並び替えで崩れやすいので避けます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "コンポーネントは単一責任で分割（画面=親が状態、部品=子が表示）",
          "データは props で親→子、通知はコールバック関数で子→親（一方向データフロー）",
          "共有する状態は共通の親へ置く（リフトアップ）",
          "import: {} 付き=名前付き / なし=default、type は実行時に消える",
          "return の JSX 内 {} は JavaScript。map で一覧化し、key に安定したidを渡す",
        ]}
      />
    </>
  );
}

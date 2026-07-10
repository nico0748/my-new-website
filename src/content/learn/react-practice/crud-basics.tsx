import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "crud-basics",
  title: "CRUD — データ操作の4つの基本",
  description: "Create / Read / Update / Delete という4操作と、HTTP メソッド・SQL との対応。タスクアプリの API を fetch で関数化し、UI とつなぐ。",
  domain: "react-practice",
  section: "data-fetching",
  order: 1,
  level: "practice",
  tags: ["CRUD", "API", "REST"],
  updated: "2026-07-07",
  minutes: 11,
};

export default function Article() {
  return (
    <>
      <Lead>
        アプリがデータを扱うとき、やることは突き詰めると 4 つ——<strong>作る・読む・更新する・削除する</strong>。
        これを <strong>CRUD（クラッド）</strong>と呼びます。タスクアプリを例に、CRUD と HTTP メソッドの対応を押さえ、
        fetch で API 関数を組み立てて UI とつなぎます。
      </Lead>

      <Section>CRUD とは</Section>
      <p>
        CRUD は Create / Read / Update / Delete の頭文字。データベースでも Web API でも、操作はこの 4 つに整理できます。
        それぞれが HTTP メソッド・SQL と対応します。
      </p>
      <ComparisonTable
        headers={["CRUD", "HTTP メソッド", "SQL", "タスクアプリでの操作"]}
        rows={[
          ["Create（作成）", "POST", "INSERT", "タスクを追加する"],
          ["Read（読取）", "GET", "SELECT", "一覧・詳細を表示する"],
          ["Update（更新）", "PUT / PATCH", "UPDATE", "完了に切り替える・編集する"],
          ["Delete（削除）", "DELETE", "DELETE", "タスクを削除する"],
        ]}
      />
      <Callout variant="tip" title="PUT と PATCH の違い">
        <Cmd>PUT</Cmd> は<strong>全体の置き換え</strong>、<Cmd>PATCH</Cmd> は<strong>一部だけ更新</strong>です。「完了フラグだけ変える」なら PATCH が自然。
        <Cmd>GET</Cmd>/<Cmd>PUT</Cmd>/<Cmd>DELETE</Cmd> は冪等（何回送っても結果が同じ）、<Cmd>POST</Cmd> は非冪等（送るたびに増える）——リトライ設計で効いてきます。
      </Callout>

      <Section>タスク API の設計</Section>
      <p>REST の作法では、リソース（tasks）を URL で表し、操作はメソッドで分けます。</p>
      <Code lang="text" filename="エンドポイント設計">{`GET    /tasks         一覧を取得
GET    /tasks/:id     1件を取得
POST   /tasks         新規作成（body に title 等）
PATCH  /tasks/:id     一部更新（done を切り替え）
DELETE /tasks/:id     削除`}</Code>

      <Section>fetch で CRUD を関数化する</Section>
      <p>
        UI のあちこちに <Cmd>fetch</Cmd> を散らすと保守しづらいので、<Cmd>lib/api.ts</Cmd> にまとめます。各関数が CRUD の 1 操作に対応します。
      </p>
      <Code lang="tsx" filename="src/lib/api.ts">{`import type { Task } from "../types/task";

const BASE = "/api";

// Read（一覧）
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(\`\${BASE}/tasks\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Create
export async function createTask(title: string): Promise<Task> {
  const res = await fetch(\`\${BASE}/tasks\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, done: false }),
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Update（部分更新：done の切り替えなど）
export async function updateTask(id: string, patch: Partial<Task>): Promise<Task> {
  const res = await fetch(\`\${BASE}/tasks/\${id}\`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Delete
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(\`\${BASE}/tasks/\${id}\`, { method: "DELETE" });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
}`}</Code>
      <Callout variant="warn" title="fetch は 404/500 でも成功扱い">
        <Cmd>fetch</Cmd> は通信が成立すればエラーで解決しません。各関数で <Cmd>res.ok</Cmd> を確認して <Cmd>throw</Cmd> しているのはそのためです
        （詳しくは Web基礎の「fetch で API と通信する」を参照）。
      </Callout>

      <Section>UI とつなぐ</Section>
      <p>
        画面側は API 関数を呼び、結果を state に反映します。作成・更新・削除の<strong>後にどう画面を更新するか</strong>が実務のポイントです。
      </p>
      <FlowChain
        nodes={[
          { label: "UI 操作", sub: "追加/完了/削除", variant: "alt" },
          { label: "api.ts", sub: "fetch" },
          { label: "サーバー", sub: "DB を更新" },
          { label: "state 更新", sub: "再描画", variant: "cta" },
        ]}
        caption="操作 → API → サーバー → 画面反映 の一巡"
      />
      <Code lang="tsx" filename="作成して一覧に反映">{`const [tasks, setTasks] = useState<Task[]>([]);

const onAdd = async (title: string) => {
  const created = await createTask(title);      // サーバーに作成
  setTasks((prev) => [...prev, created]);        // 返ってきた1件を state に足す
};

const onToggle = async (task: Task) => {
  const updated = await updateTask(task.id, { done: !task.done });
  setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
};

const onDelete = async (id: string) => {
  await deleteTask(id);
  setTasks((prev) => prev.filter((t) => t.id !== id));  // 画面からも消す
};`}</Code>
      <Callout variant="info" title="再取得 or ローカル更新、そして楽観的更新">
        更新後の画面反映は 2 通り。(1) もう一度 <Cmd>getTasks()</Cmd> して<strong>作り直す</strong>（確実・やや遅い）、
        (2) 返ってきた結果で<strong>ローカルの配列を更新</strong>する（速い・上のコード）。さらに、サーバー応答を待たず先に画面を更新し、
        失敗したら戻す<strong>楽観的更新（optimistic update）</strong>もあります。TanStack Query を使うとこれらが楽になります。
      </Callout>

      <Bridge course="データベース／ネットワーク（REST・冪等性）">
        CRUD は、データベースの授業で学ぶ <Cmd>INSERT/SELECT/UPDATE/DELETE</Cmd> と一対一で対応します。REST API はこの 4 操作を
        <strong>「リソース（名詞）× HTTP メソッド（動詞）」</strong>で表現する設計思想。<Cmd>GET/PUT/DELETE</Cmd> が冪等で <Cmd>POST</Cmd> が非冪等という性質は、
        ネットワークが不安定でも安全にリトライできるかを左右します。フロント・バック・DB を貫いて「同じ 4 操作」が現れるのが CRUD の普遍性です。
      </Bridge>

      <Quiz
        question="タスクの「完了フラグだけ」を切り替えるとき、最も自然な HTTP メソッドは？"
        options={[
          <Cmd>GET</Cmd>,
          <Cmd>POST</Cmd>,
          <Cmd>PATCH</Cmd>,
          <Cmd>DELETE</Cmd>,
        ]}
        answer={2}
        explanation={<>一部だけの更新なので <Cmd>PATCH</Cmd> が自然です（全体置換なら <Cmd>PUT</Cmd>）。<Cmd>POST</Cmd> は新規作成、<Cmd>GET</Cmd> は取得、<Cmd>DELETE</Cmd> は削除です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "CRUD = Create / Read / Update / Delete。データ操作の4つの基本",
          "対応：POST / GET / PUT・PATCH / DELETE（SQL の INSERT/SELECT/UPDATE/DELETE）",
          "fetch を lib/api.ts に関数化し、各関数で res.ok を確認する",
          "更新後は「再取得」か「ローカル更新」で画面に反映。楽観的更新も選択肢",
        ]}
      />
    </>
  );
}

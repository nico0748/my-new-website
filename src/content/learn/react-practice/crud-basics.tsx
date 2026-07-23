import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Bridge, Quiz, Divider, Figure } from "../../../components/learn/kit";
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

      <Section>叩く先を用意する — モック API と proxy</Section>
      <p>
        この後に書く <Cmd>src/lib/api.ts</Cmd> は <Cmd>/api/tasks</Cmd> へリクエストを送ります。ところが今の状態では
        <strong>その URL に応答するサーバーが存在しません</strong>。このまま進めると、すべてのリクエストが 404 になり
        「コードは書いたのに何も動かない」状態になります。先に叩ける API を用意します。
      </p>
      <p>
        実務では別チームが用意した API を使いますが、学習段階では <strong>json-server</strong> が手軽です。
        JSON ファイルを 1 つ置くだけで、REST の作法どおりの API が立ち上がります。
      </p>

      <SubSection>① json-server を入れて、初期データを置く</SubSection>
      <Code lang="bash" filename="ターミナル">{`npm install -D json-server`}</Code>
      <p>プロジェクト直下（<Cmd>package.json</Cmd> と同じ階層）に <Cmd>db.json</Cmd> を作ります。この中身がそのまま API のデータになります。</p>
      <Code lang="json" filename="db.json">{`{
  "tasks": [
    { "id": "1", "title": "牛乳を買う", "done": false },
    { "id": "2", "title": "React を学ぶ", "done": true }
  ]
}`}</Code>

      <SubSection>② API サーバーを起動する</SubSection>
      <p>
        <strong>開発サーバー（npm run dev）とは別のターミナル</strong>を開いて実行します。2 つ同時に動かしておくのがこの章の基本形です。
      </p>
      <Code lang="bash" filename="ターミナル2（API 用）">{`npx json-server db.json --port 3001`}</Code>
      <p>さらに別のターミナルから、API が応答するか確かめます。</p>
      <Code lang="bash" filename="ターミナル3（確認用）">{`curl http://localhost:3001/tasks`}</Code>
      <Code lang="text" filename="期待される出力">{`[
  { "id": "1", "title": "牛乳を買う", "done": false },
  { "id": "2", "title": "React を学ぶ", "done": true }
]`}</Code>

      <SubSection>③ Vite の proxy で /api を転送する</SubSection>
      <p>
        ここで問題が 1 つあります。画面は <Cmd>localhost:5173</Cmd>、API は <Cmd>localhost:3001</Cmd> と<strong>ポートが違う</strong>ため、
        ブラウザから直接叩くと<strong>オリジンが異なる</strong>と判断され、CORS で弾かれます。
      </p>
      <p>
        開発中の定番は、Vite の <strong>proxy</strong> です。「<Cmd>/api</Cmd> で始まるリクエストだけ、裏で 3001 に転送してもらう」設定を書きます。
        こうするとブラウザから見た通信相手は 5173 のままなので、オリジンは同じになり CORS が起きません。
      </p>
      <Code lang="ts" filename="vite.config.ts">{`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/tasks へのリクエストを http://localhost:3001/tasks へ転送する
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        // 転送するとき先頭の /api を取り除く（/api/tasks → /tasks）
        rewrite: (path) => path.replace(/^\\/api/, ""),
      },
    },
  },
});`}</Code>
      <Callout variant="warn" title="設定したら開発サーバーを再起動する">
        <Cmd>vite.config.ts</Cmd> は<strong>起動時に一度だけ</strong>読まれます。編集しても自動では反映されないので、
        <Cmd>npm run dev</Cmd> のターミナルで <Cmd>Ctrl + C</Cmd> → もう一度 <Cmd>npm run dev</Cmd> してください。
        「設定を書いたのに 404 のまま」の原因はたいていこれです。
      </Callout>
      <p>再起動したら、<strong>5173 側</strong>から API が引けるか確認します。ここが通れば配線は完了です。</p>
      <Code lang="bash" filename="ターミナル3（確認用）">{`curl http://localhost:5173/api/tasks`}</Code>
      <p>3001 に直接投げたときと<strong>同じ JSON</strong> が返れば成功です。</p>

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
      <Figure
        src="/learn/shots/react-practice/crud-basics-01.svg"
        alt="DevTools の Network タブに POST・PATCH・DELETE のリクエストとステータスコードが並んでいる画面"
        caption="Network タブを開いて操作すると、CRUD がそのままメソッドとして飛んでいるのが見える"
      />
      <Callout variant="info" title="再取得 or ローカル更新、そして楽観的更新">
        更新後の画面反映は 2 通り。(1) もう一度 <Cmd>getTasks()</Cmd> して<strong>作り直す</strong>（確実・やや遅い）、
        (2) 返ってきた結果で<strong>ローカルの配列を更新</strong>する（速い・上のコード）。さらに、サーバー応答を待たず先に画面を更新し、
        失敗したら戻す<strong>楽観的更新（optimistic update）</strong>もあります。TanStack Query を使うとこれらが楽になります。
      </Callout>

      <SubSection>完成形 — TaskListPage を API とつなぐ</SubSection>
      <p>
        断片だけでは動かないので、ここまでをまとめた <Cmd>TaskListPage</Cmd> の全体を示します。
        <Cmd>useEffect</Cmd> で初回に一覧を取得し、読み込み中とエラーの表示も入れています。
      </p>
      <Code lang="tsx" filename="src/pages/TaskListPage.tsx">{`import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { getTasks, createTask, updateTask, deleteTask } from "../lib/api";

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);   // 読み込み中かどうか
  const [error, setError] = useState<string | null>(null);

  // 初回だけ一覧を取得する（第2引数の [] が「初回のみ」の意味）
  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const created = await createTask(title);       // サーバーに作成
    setTasks((prev) => [...prev, created]);        // 返ってきた1件を足す
    setTitle("");
  };

  const onToggle = async (task: Task) => {
    const updated = await updateTask(task.id, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const onDelete = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <p>読み込み中…</p>;
  if (error) return <p>読み込みに失敗しました: {error}</p>;

  return (
    <div>
      <h1>タスク一覧</h1>

      <form onSubmit={onAdd}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="やることを入力"
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(task)}
              />
              {task.title}
            </label>
            <button onClick={() => onDelete(task.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`}</Code>
      <p>
        <Cmd>npm run dev</Cmd> と <Cmd>json-server</Cmd> の両方が起動している状態で開くと、
        <Cmd>db.json</Cmd> に書いた 2 件が表示されます。追加・完了切り替え・削除を行うと、
        <strong>db.json の中身が実際に書き換わる</strong>のを確認できます。ブラウザを再読み込みしても内容が残っていれば、
        サーバー側に保存できている証拠です。
      </p>
      <Callout variant="info" title="前章の Context とどう組み合わせるか">
        前章では状態を <Cmd>TaskProvider</Cmd> に持たせました。API と組み合わせる場合は、
        <strong>この <Cmd>useEffect</Cmd> と CRUD 関数を Provider 側へ移す</strong>のが自然です。そうすると
        「どの画面からでも <Cmd>useTasks()</Cmd> で最新の一覧が取れる」形になります。
        ここでは流れを追いやすくするため、まずはページ内に閉じた形で示しました。
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

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KVList, KeyPoints, Bridge, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "google-calendar-api",
  title: "Google のタスクと連携する（OAuth・CRUD）",
  description: "自作アプリのタスクを、Google カレンダーに表示される Google Tasks と同期する。OAuth2 でのアクセストークン取得と、Tasks API での CRUD を実装する。",
  domain: "react-practice",
  section: "data-fetching",
  order: 2,
  level: "practice",
  tags: ["API", "OAuth", "Google"],
  updated: "2026-07-07",
  minutes: 15,
};

export default function Article() {
  return (
    <>
      <Lead>
        自作のタスクを、<strong>Google カレンダーに表示されるタスク</strong>と同期してみましょう。カレンダー上の「タスク」は
        <strong>Google Tasks API</strong> で操作できます。ここでは OAuth2 でアクセストークンを取り、前章の CRUD を
        実在の外部 API に対して行います（イベントを扱う場合は Google Calendar API も同じ考え方です）。
      </Lead>

      <Section>全体像 — 認可してから API を叩く</Section>
      <p>
        他人の Google データを勝手には読めません。まずユーザー本人に<strong>「このアプリにタスクの読み書きを許可」</strong>してもらい、
        その証として<strong>アクセストークン</strong>を得ます。以降は毎回のリクエストにそのトークンを付けて API を呼びます。
      </p>
      <SequenceDiagram
        actors={["アプリ", "Google 認可", "Tasks API"]}
        messages={[
          { from: 0, to: 1, label: "① 認可を要求（scope: tasks）" },
          { from: 1, to: 0, label: "② 同意 → アクセストークン", cta: true },
          { from: 0, to: 2, label: "③ Bearer トークンで CRUD" },
          { from: 2, to: 0, label: "④ タスクデータを返す", cta: true },
        ]}
        caption="OAuth2：認可でトークンを得て、API を呼ぶ"
      />

      <Section>準備 — OAuth クライアント ID とスコープ</Section>
      <Steps>
        <Step title="Google Cloud でプロジェクト作成">
          Google Cloud Console でプロジェクトを作り、<strong>Google Tasks API を有効化</strong>します。
        </Step>
        <Step title="OAuth クライアント ID を発行">
          「認証情報」で <Cmd>OAuth 2.0 クライアント ID</Cmd>（ウェブアプリ）を作り、承認済みの JavaScript 生成元に
          <Cmd>http://localhost:5173</Cmd> を登録します。
        </Step>
        <Step title="スコープを決める">
          読み書きなら <Cmd>https://www.googleapis.com/auth/tasks</Cmd>、読み取りだけなら <Cmd>.../auth/tasks.readonly</Cmd>。
        </Step>
      </Steps>
      <Figure
        src="/learn/shots/react-practice/google-calendar-api-01.svg"
        alt="Google Cloud Console のライブラリ画面で Google Tasks API を有効化しようとしている状態"
        caption="手順1: ライブラリから Google Tasks API を探し、有効化する"
      />
      <Figure
        src="/learn/shots/react-practice/google-calendar-api-02.svg"
        alt="OAuth 2.0 クライアント ID の作成画面。承認済みの JavaScript 生成元に localhost:5173 を入力している"
        caption="手順2: 承認済みの JavaScript 生成元に開発サーバーの URL を登録する。ここが抜けると認可が弾かれる"
      />
      <Callout variant="tip" title="クライアント ID は .env に">
        クライアント ID は <Cmd>.env</Cmd> に置き、<Cmd>import.meta.env.VITE_GOOGLE_CLIENT_ID</Cmd> で読み込みます
        （Vite では <Cmd>VITE_</Cmd> 始まりの変数だけがフロントに露出します）。
      </Callout>

      <Section>アクセストークンを得る（Google Identity Services）</Section>
      <p>
        ブラウザからの認可には Google の <Cmd>google.accounts.oauth2</Cmd>（GIS）を使います。<Cmd>index.html</Cmd> に
        <Cmd>{"<script src=\"https://accounts.google.com/gsi/client\" async>"}</Cmd> を読み込んでおきます。
      </p>
      <Code lang="ts" filename="src/lib/googleAuth.ts">{`// GIS のトークンクライアントを初期化し、アクセストークンを受け取る
let accessToken = "";

export function requestGoogleToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-expect-error GIS はグローバルに読み込まれる
    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/tasks",
      callback: (resp: { access_token?: string; error?: string }) => {
        if (resp.error || !resp.access_token) return reject(resp.error);
        accessToken = resp.access_token;
        resolve(accessToken);
      },
    });
    client.requestAccessToken();   // ← ここでユーザーに同意ダイアログが出る
  });
}

export const getAccessToken = () => accessToken;`}</Code>
      <Callout variant="danger" title="秘密情報はフロントに置かない">
        この方式で得るのは<strong>短命なアクセストークン</strong>です。<strong>クライアントシークレットや refresh token を
        フロントに置いてはいけません</strong>（ブラウザのコードは誰でも読めます）。長期のオフラインアクセスや機密操作が必要なら、
        認可コードフローを<strong>サーバー側</strong>で処理し、トークンはサーバーで保管します。学習・個人利用の範囲でこの実装に留めます。
      </Callout>

      <Section>Tasks API で CRUD する</Section>
      <p>
        取得したトークンを <Cmd>Authorization: Bearer</Cmd> ヘッダーに載せて呼びます。既定のタスクリストは <Cmd>@default</Cmd> です。
      </p>
      <KVList
        items={[
          { key: "Read", val: "GET  https://tasks.googleapis.com/tasks/v1/lists/@default/tasks" },
          { key: "Create", val: "POST https://tasks.googleapis.com/tasks/v1/lists/@default/tasks（body に title）" },
          { key: "Update", val: "PATCH .../lists/@default/tasks/{taskId}（status: \"completed\" 等）" },
          { key: "Delete", val: "DELETE .../lists/@default/tasks/{taskId}" },
        ]}
      />
      <Code lang="ts" filename="src/lib/googleTasks.ts">{`import { getAccessToken } from "./googleAuth";

const BASE = "https://tasks.googleapis.com/tasks/v1/lists/@default/tasks";

function authHeaders() {
  return {
    Authorization: \`Bearer \${getAccessToken()}\`,
    "Content-Type": "application/json",
  };
}

// Read: タスク一覧
export async function listGoogleTasks() {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  const data = await res.json();
  return data.items ?? [];       // items が無いことがあるので既定値
}

// Create: タスク追加
export async function addGoogleTask(title: string) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Update: 完了に切り替え
export async function completeGoogleTask(id: string) {
  const res = await fetch(\`\${BASE}/\${id}\`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: "completed" }),
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Delete
export async function deleteGoogleTask(id: string) {
  const res = await fetch(\`\${BASE}/\${id}\`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
}`}</Code>

      <Section>React に組み込む</Section>
      <p>「連携」ボタンで認可し、成功したら一覧を取得して state に入れます。ローディングとエラーも state で扱います。</p>
      <Code lang="tsx" filename="src/pages/GoogleTasksPage.tsx">{`import { useState } from "react";
import { requestGoogleToken } from "../lib/googleAuth";
import { listGoogleTasks, addGoogleTask } from "../lib/googleTasks";

export function GoogleTasksPage() {
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      await requestGoogleToken();          // 認可（同意ダイアログ）
      setTasks(await listGoogleTasks());   // 取得して反映
    } catch (e) {
      setError(e instanceof Error ? e.message : "失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={connect} disabled={loading}>
        {loading ? "接続中…" : "Google と連携"}
      </button>
      {error && <p>エラー: {error}</p>}
      <ul>{tasks.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
    </div>
  );
}`}</Code>
      <Figure
        src="/learn/shots/react-practice/google-calendar-api-03.svg"
        alt="Google と連携ボタンを押したときに表示される Google の同意ダイアログ。タスクの表示と編集の権限を求めている"
        caption="連携ボタンを押すと、要求した scope の内容がこの同意ダイアログに提示される"
      />
      <Callout variant="info" title="CORS と本番運用">
        Google の API はブラウザからの呼び出し（CORS）に対応していますが、多くの外部 API はそうではありません。その場合は
        <strong>自前のバックエンドを経由</strong>させます。また、トークンの更新（refresh）・秘密情報の保管・レート制限対応は
        本番ではサーバー側で行うのが基本です。

      </Callout>

      <SubSection>関連する既習の章</SubSection>
      <p>
        ここで使った考え方は、Web基礎の「fetch で API と通信する」、API 章の「API の認証・認可（OAuth2）」、
        セキュリティの「認証の仕組み（OAuth）」で詳しく扱っています。あわせて読むと理解が深まります。
      </p>

      <Bridge course="情報セキュリティ（OAuth2・最小権限）／ネットワーク">
        OAuth2 は、講義で学ぶ<strong>認可の委譲</strong>そのもの。ユーザーがパスワードをアプリに渡すことなく、
        <strong>限定した権限（scope）だけ</strong>を短命トークンで貸し出します。<Cmd>tasks</Cmd> だけを要求するのは<strong>最小権限の原則</strong>、
        トークンを短命にするのは漏洩時の被害（爆発半径）を抑えるため。「秘密はサーバーに、公開情報だけクライアントに」という
        <strong>信頼境界</strong>の線引きが、そのまま安全な実装の分かれ目になります。
      </Bridge>

      <Quiz
        question="ブラウザだけで OAuth2 を扱うとき、フロントのコードに置いて良いのはどれ？"
        options={[
          <>クライアントシークレット</>,
          <>refresh token（長期）</>,
          <>短命のアクセストークン（scope を絞ったもの）</>,
          <>ユーザーの Google パスワード</>,
        ]}
        answer={2}
        explanation={<>フロントに置いてよいのは、権限を絞った<strong>短命のアクセストークン</strong>だけです。クライアントシークレットや refresh token はサーバー側で保管し、パスワードはそもそもアプリが受け取りません（それが OAuth の目的です）。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "外部データは OAuth2 で認可 → アクセストークン取得 → Bearer で API を呼ぶ",
          "Google カレンダーのタスクは Google Tasks API（/lists/@default/tasks）で CRUD",
          "GIS でトークン取得。クライアントシークレット・refresh token はフロントに置かない",
          "取得結果は state（loading/error 含む）で管理し、UI に反映する",
          "scope は最小限・トークンは短命に。機密操作や更新はサーバー側で行うのが基本",
        ]}
      />
    </>
  );
}

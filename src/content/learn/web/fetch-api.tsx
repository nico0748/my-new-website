import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "fetch-api",
  title: "fetch で API と通信する",
  description: "ブラウザから API を呼ぶ標準関数 fetch。GET/POST、JSON の送受信、ステータス確認、エラー処理、React での使い方までを実例で。",
  domain: "web",
  section: "frontend",
  order: 6.7,
  level: "basic",
  tags: ["JavaScript", "fetch", "API"],
  updated: "2026-07-07",
  minutes: 10,
};

export default function Article() {
  return (
    <>
      <Lead>
        フロントエンドがサーバーの<strong>API</strong>からデータを取ってくる——その標準の手段が <Cmd>fetch</Cmd> です。
        戻り値は <Cmd>Promise</Cmd> なので、前章の <Cmd>async / await</Cmd> がそのまま活きます。GET / POST、JSON の送受信、
        つまずきやすいエラー処理までを実務目線で押さえます。
      </Lead>

      <Section>fetch の基本（GET）</Section>
      <p>
        <Cmd>fetch(url)</Cmd> はリクエストを送り、<Cmd>Response</Cmd> オブジェクトで解決する Promise を返します。
        本文（ボディ）は <Cmd>await res.json()</Cmd> で JavaScript の値に変換します。
      </p>
      <Code lang="js" filename="get.js">{`async function getUser() {
  const res = await fetch("https://api.example.com/users/1");
  const user = await res.json();   // ボディを JSON としてパース
  console.log(user.name);
}`}</Code>

      <SequenceDiagram
        actors={["ブラウザ", "API サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① GET /users/1（fetch）" },
          { from: 1, to: 0, label: "② 200 OK + JSON", cta: true },
          { from: 0, to: 1, label: "③ POST /users（作成）" },
          { from: 1, to: 0, label: "④ 201 Created + JSON", cta: true },
        ]}
        caption="fetch はブラウザとサーバーの HTTP 往復そのもの"
      />

      <Section>POST でデータを送る</Section>
      <p>
        作成・更新では第 2 引数にオプションを渡します。<Cmd>method</Cmd>、<Cmd>headers</Cmd>（多くは JSON 指定）、
        <Cmd>body</Cmd>（<Cmd>JSON.stringify</Cmd> で文字列化）が基本セットです。
      </p>
      <Code lang="js" filename="post.js">{`const res = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Taro", email: "taro@example.com" }),
});
const created = await res.json();`}</Code>

      <Section>ステータス確認 — fetch の要注意点</Section>
      <p>
        大きな落とし穴があります。<strong><Cmd>fetch</Cmd> は 404 や 500 でも reject しません</strong>。通信自体が成立すれば
        「成功」として解決します。エラー扱いにするには <Cmd>res.ok</Cmd>（ステータスが 200〜299 か）を自分で確認します。
      </p>
      <Code lang="js" filename="check-status.js">{`async function getUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) {
    // 404 や 500 はここで初めてエラーにできる
    throw new Error(\`HTTP \${res.status}\`);
  }
  return res.json();
}`}</Code>
      <Callout variant="warn" title="reject されるのは「通信できないとき」だけ">
        <Cmd>fetch</Cmd> が reject するのは、ネットワーク遮断・DNS 失敗・CORS 拒否など<strong>通信そのものが成立しない</strong>場合です。
        サーバーが 4xx / 5xx を返した場合は<strong>成功扱い</strong>なので、<Cmd>res.ok</Cmd> のチェックを必ず入れます。
      </Callout>

      <SubSection>エラー処理の型</SubSection>
      <Code lang="js" filename="try-catch.js">{`try {
  const user = await getUser(1);
  // 正常系
} catch (err) {
  // 通信失敗 or res.ok=false（上で throw した分）をまとめて捕捉
  console.error("取得に失敗:", err.message);
}`}</Code>

      <Section>ヘッダーと認証</Section>
      <p>
        認証が必要な API では、<Cmd>Authorization</Cmd> ヘッダーにトークンを載せます（詳細は API 章の「認証・認可」で扱います）。
      </p>
      <Code lang="js" filename="auth.js">{`const res = await fetch("/api/me", {
  headers: { Authorization: \`Bearer \${token}\` },
});`}</Code>
      <KVList
        items={[
          { key: "res.ok", val: "ステータスが 200〜299 なら true" },
          { key: "res.status", val: "HTTP ステータスコード（404 など）" },
          { key: "res.json()", val: "ボディを JSON としてパース（Promise を返す）" },
          { key: "res.text()", val: "ボディを文字列として取得" },
          { key: "res.headers.get()", val: "レスポンスヘッダーを1つ取得" },
        ]}
      />

      <Callout variant="info" title="CORS で弾かれたら">
        別オリジンの API を叩くと <strong>CORS</strong>（同一オリジンポリシー）でブロックされることがあります。これはブラウザの安全機構で、
        許可はサーバー側の設定が必要です。詳しくは API 章の「CORS の仕組みとハマりどころ」を参照してください。
      </Callout>

      <Section>React で使う</Section>
      <p>
        コンポーネントでは、取得を <Cmd>useEffect</Cmd> の中で行い、結果・ローディング・エラーを <Cmd>state</Cmd> で管理するのが定番です。
      </p>
      <Code lang="tsx" filename="UserCard.tsx">{`function UserCard({ id }: { id: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;                       // アンマウント後の setState を防ぐ
    setLoading(true);
    fetch(\`/api/users/\${id}\`)
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then((data) => { if (alive) setUser(data); })
      .catch((e) => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };        // クリーンアップ
  }, [id]);

  if (loading) return <p>読み込み中…</p>;
  if (error) return <p>エラー: {error}</p>;
  return <p>{user?.name}</p>;
}`}</Code>
      <Callout variant="tip" title="キャンセルには AbortController">
        入力のたびに検索する画面などでは、古いリクエストを<strong>中断</strong>したいことがあります。
        <Cmd>const c = new AbortController()</Cmd> を作り、<Cmd>{"fetch(url, { signal: c.signal })"}</Cmd> に渡して、
        不要になったら <Cmd>c.abort()</Cmd> で中止できます。実務では TanStack Query や SWR などのライブラリで
        キャッシュ・再取得・キャンセルをまとめて扱うことも多いです。
      </Callout>

      <Bridge course="ネットワーク / 分散システム">
        <Cmd>fetch</Cmd> の 1 回は、講義で学ぶ<strong>クライアント・サーバモデル</strong>の HTTP リクエスト/レスポンス往復そのものです。
        <Cmd>method</Cmd>・<Cmd>headers</Cmd>・<Cmd>body</Cmd> はそのまま HTTP メッセージの構成要素、<Cmd>res.status</Cmd> はステータスライン。
        「通信は失敗しうる」ことを前提に <Cmd>res.ok</Cmd> 確認・<Cmd>try/catch</Cmd>・タイムアウト・リトライを組むのは、
        <strong>信頼性の低いネットワーク上で堅牢に通信する</strong>という分散システムの基本姿勢です。ネットワーク越しの呼び出しは
        ローカル関数と違って<strong>遅く・失敗しうる</strong>——この前提を忘れないことが実務の分かれ目です。
      </Bridge>

      <Quiz
        question={<>API が <Cmd>404 Not Found</Cmd> を返したとき、次のコードはどう動く？<br /><Cmd>{"const res = await fetch(url); const data = await res.json();"}</Cmd></>}
        options={[
          <>fetch が reject し、catch に飛ぶ</>,
          <>res.ok は false だが reject はせず、そのまま次の行へ進む</>,
          <>自動で例外が投げられ処理が止まる</>,
          <>res が null になる</>,
        ]}
        answer={1}
        explanation={
          <>
            <Cmd>fetch</Cmd> は 4xx / 5xx でも<strong>成功扱い</strong>で解決します。<Cmd>res.ok</Cmd> は false になりますが、
            自分で確認して <Cmd>throw</Cmd> しない限りエラーにはなりません。だから <Cmd>if (!res.ok) throw ...</Cmd> を挟むのが定石です。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "fetch(url) は Response で解決する Promise。ボディは await res.json() で取り出す",
          "POST は { method, headers, body: JSON.stringify(...) } を第2引数に渡す",
          "fetch は 404/500 でも reject しない。res.ok / res.status を自分で確認する",
          "認証は Authorization: Bearer、別オリジンは CORS に注意",
          "React では useEffect + state（loading/error）で扱い、クリーンアップやキャンセルを意識する",
        ]}
      />
    </>
  );
}

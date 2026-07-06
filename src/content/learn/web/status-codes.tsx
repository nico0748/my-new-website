import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "status-codes",
  title: "実務で迷わない HTTP ステータスコード",
  description: "401 と 403 の違い、302 と 307、429 の使いどころ。API を設計・デバッグするときに効くステータスの選び方。",
  domain: "web",
  section: "web-basics",
  order: 3,
  level: "basic",
  tags: ["HTTP", "API", "設計"],
  updated: "2026-07-07",
  minutes: 4,
};

export default function Article() {
  return (
    <>
      <Lead>
        ステータスコードは「サーバからの一言メッセージ」。正しく選ぶとクライアントが適切に振る舞えます。よく迷うペアを整理します。
      </Lead>

      <Section>まず百の位でカテゴリを掴む</Section>
      <p>
        3 桁の数字は、百の位が「大分類」、下 2 桁が「具体」を表す<strong>階層的なコード体系</strong>です。まず百の位で「どのカテゴリのできごとか」を掴めば、細かいコードを覚えていなくても対処の方向が決まります。
      </p>
      <ComparisonTable
        headers={["範囲", "意味", "主なコード", "だれの責任か"]}
        rows={[
          ["1xx", "情報（処理継続中）", "100, 101", "—"],
          ["2xx", "成功", "200, 201, 204", "正常"],
          ["3xx", "リダイレクト", "301, 302, 304, 307, 308", "クライアントが再要求"],
          ["4xx", "クライアント側エラー", "400, 401, 403, 404, 429", "呼び出し側"],
          ["5xx", "サーバ側エラー", "500, 502, 503, 504", "サーバ側"],
        ]}
      />
      <p>
        この「4xx はクライアントのせい／5xx はサーバのせい」という切り分けが、監視・ログ集計・障害対応の起点になります。たとえば 5xx の急増はサーバ側の不具合を、4xx の急増は呼び出し側の使い方の誤り（あるいは攻撃）を疑うサインです。
      </p>

      <Bridge course="ネットワーク（アプリケーション層）/ エラー設計">
        ステータスコードは、<strong>プロトコルにおける「応答コード」</strong>という設計パターンの一例です。ネットワークの講義で SMTP（メール）や FTP を扱うと、やはり <Cmd>250</Cmd> や <Cmd>550</Cmd> のような 3 桁コードで結果を返しているのに気づきます。「百の位でカテゴリ、下 2 桁で詳細」という階層化は、人間にもプログラムにも読みやすい<strong>エラー分類の共通設計</strong>で、これは各プロトコルが独立に採用したのではなく、機械可読なステータス表現の定石として広まったものです。
      </Bridge>

      <Section>401 と 403 の違い</Section>
      <p>
        <Cmd>401 Unauthorized</Cmd> は「あなたが誰か分からない（認証して）」、<Cmd>403 Forbidden</Cmd> は「あなたが誰かは分かるが権限がない」。認証（Authentication）と認可（Authorization）の区別がそのまま出ます。
      </p>
      <Callout variant="info" title="覚え方">
        401 = ログインすれば解決するかも。403 = ログインしても解決しない。
      </Callout>
      <p>
        API を設計するときは、この 2 つを取り違えると利用者を混乱させます。「トークンが期限切れ」なら <Cmd>401</Cmd> を返してクライアントに再ログイン（トークン更新）を促し、「一般ユーザーが管理者専用 API を叩いた」なら <Cmd>403</Cmd> を返す、というのが正しい使い分けです。
      </p>
      <Callout variant="warn" title="存在を隠したいときは 404 を返すこともある">
        セキュリティ上、「その資源がある／ない」自体を秘密にしたい場合、権限のないユーザーには <Cmd>403</Cmd>（＝存在は認める）ではなく <Cmd>404</Cmd>（＝そもそも無いふり）を返す設計もあります。情報を漏らさないという観点でのステータス選択です。
      </Callout>

      <Section>リダイレクト 301 / 302 / 307 / 308</Section>
      <ul>
        <li><Cmd>301</Cmd> 恒久リダイレクト（メソッドが GET に変わりうる）</li>
        <li><Cmd>308</Cmd> 恒久・メソッド保持</li>
        <li><Cmd>302</Cmd> 一時リダイレクト（メソッドが変わりうる）</li>
        <li><Cmd>307</Cmd> 一時・メソッド保持</li>
      </ul>

      <Section>429 Too Many Requests</Section>
      <p>
        レート制限に達したことを伝えます。<Cmd>Retry-After</Cmd> ヘッダで「何秒後に再試行してよいか」を返すのが親切な設計です。クライアント側はこの値を読んで待機し、<strong>指数バックオフ</strong>（再試行のたびに待ち時間を倍にする）でリトライすると、サーバへの集中を避けられます。
      </p>

      <Section>ステータス選択はエラー設計そのもの</Section>
      <p>
        API 実装では「例外が起きたとき、どのステータスで返すか」を必ず決めます。これは座学の<strong>例外処理</strong>を HTTP の語彙に翻訳する作業です。入力が不正なら <Cmd>400</Cmd>、資源が無ければ <Cmd>404</Cmd>、想定外の内部エラーは <Cmd>500</Cmd>、と例外の種類ごとにコードを対応づけます。
      </p>
      <Code lang="ts" filename="api/handler.ts">{`try {
  const user = await findUser(id);       // 見つからなければ例外
  if (!hasPermission(user)) {
    return res.status(403).json({ error: "forbidden" });
  }
  return res.status(200).json(user);
} catch (e) {
  if (e instanceof NotFoundError) {
    return res.status(404).json({ error: "not found" });
  }
  if (e instanceof ValidationError) {
    return res.status(400).json({ error: e.message });
  }
  return res.status(500).json({ error: "internal error" });  // 想定外
}`}</Code>
      <SubSection>クライアント側の対処もカテゴリで分岐する</SubSection>
      <p>
        呼び出す側も、百の位で対処を分けます。4xx は「リクエストを直せば解決」、5xx は「時間をおいてリトライ」が基本方針です。
      </p>
      <Code lang="ts" filename="client.ts">{`const res = await fetch(url);
if (res.ok) return res.json();                 // 2xx
if (res.status === 401) return relogin();      // 認証やり直し
if (res.status === 429) return retryAfter(res); // 待ってから再試行
if (res.status >= 500) return retryWithBackoff(); // サーバ復旧待ち
throw new Error("修正が必要なリクエストです");    // その他 4xx`}</Code>

      <Bridge course="ソフトウェア工学（例外処理・契約による設計）">
        講義で習う<strong>例外処理</strong>と<strong>契約による設計（事前条件・事後条件）</strong>が、ステータスコードの設計としてそのまま現れます。「事前条件を満たさない呼び出しは 4xx（呼び出し側の契約違反）」「サーバが事後条件を守れなかったら 5xx（提供側の失敗）」という対応づけを意識すると、コードの選択に迷いません。座学の「誰の責任で失敗したかを型で表す」という発想が、HTTP では 3 桁の数字として実務に落ちているわけです。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "まず百の位でカテゴリ（4xx=呼び出し側 / 5xx=サーバ側）を掴む",
          "401=認証が必要 / 403=認可がない（隠したいときは 404 も）",
          "恒久は 301/308、一時は 302/307。メソッド保持は 307/308",
          "レート制限は 429 + Retry-After、クライアントは指数バックオフで再試行",
          "ステータス選択は例外処理の翻訳。例外の種類ごとにコードを対応づける",
        ]}
      />
    </>
  );
}

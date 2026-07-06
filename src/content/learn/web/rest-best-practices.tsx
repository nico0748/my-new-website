import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, Bridge, TipBox, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "rest-best-practices",
  title: "REST API 設計のベストプラクティス",
  description: "リソース指向の URL、メソッドとステータスコードの正しい使い方、バージョニング、統一エラーフォーマットなど、実務で効く REST 設計の勘所。",
  domain: "web",
  section: "api",
  order: 2,
  level: "basic",
  tags: ["API", "REST", "設計"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        REST は「URL でリソースを指し、HTTP メソッドで操作を表す」というシンプルな原則に立つ設計スタイルです。原則に沿って設計すると、API は<strong>予測可能</strong>で、ドキュメントを読まなくても次の挙動が想像できるようになります。実務で効く勘所を順に押さえましょう。
      </Lead>

      <Section>リソース指向の URL — 名詞・複数形</Section>
      <p>
        URL は「操作」ではなく「リソース（もの）」を表します。動詞は HTTP メソッドが担うので、パスには<strong>名詞・複数形</strong>を使うのが基本です。
      </p>
      <Code lang="text" filename="URL 設計">{`# Good — 名詞・複数形。操作はメソッドで表す
GET    /users
GET    /users/42
POST   /users
GET    /users/42/orders          # ネストで関係を表す

# Bad — URL に動詞を入れている
GET    /getUser?id=42
POST   /createUser
POST   /users/42/delete`}</Code>
      <p>
        階層は「所属」を表すのに使いますが、深くしすぎない（2 階層まで）のが目安です。<Cmd>/users/42/orders/9/items/3</Cmd> のように深くなったら、<Cmd>/items/3</Cmd> のようにトップレベル化を検討します。
      </p>
      <Bridge course="ソフトウェア工学 / 命名と一貫性">
        「良い名前は最良のドキュメント」——変数・関数の命名規約を全体で揃えると読み手の認知負荷が下がる、という原則がそのまま URL 設計に効きます。<Cmd>/users</Cmd> があるなら <Cmd>/orders</Cmd> も <Cmd>/products</Cmd> も複数形、ID は同じ位置、ネストの深さも揃える。<strong>一貫性はそれ自体が仕様書</strong>で、使う側は 1 つのエンドポイントを覚えれば残りを推測できます。授業で「命名規則をプロジェクト全体で統一せよ」と言われた理由は、この「予測可能性」を作るためです。
      </Bridge>

      <Section>メソッドの正しい使い方</Section>
      <ComparisonTable
        headers={["メソッド", "意味", "冪等", "安全"]}
        rows={[
          [<Cmd>GET</Cmd>, "取得（副作用なし）", "はい", "はい"],
          [<Cmd>POST</Cmd>, "新規作成・処理実行", "いいえ", "いいえ"],
          [<Cmd>PUT</Cmd>, "全体置換", "はい", "いいえ"],
          [<Cmd>PATCH</Cmd>, "部分更新", "状況次第", "いいえ"],
          [<Cmd>DELETE</Cmd>, "削除", "はい", "いいえ"],
        ]}
      />

      <SubSection>「安全」と「冪等」を厳密に定義する</SubSection>
      <p>
        表の「安全」「冪等」は感覚語ではなく、数学的にきちんと定義できる性質です。ここを曖昧にすると、リトライやキャッシュの設計で事故ります。
      </p>
      <KVList
        items={[
          { key: "安全 (safe)", val: "呼んでもサーバの状態を変えない。GET は何回叩いても副作用ゼロ。ゆえに自由にキャッシュ・先読みできる" },
          { key: "冪等 (idempotent)", val: "1 回でも N 回でも、適用後の状態が同じ。DELETE /users/42 を 2 回送っても、結果は「42 が存在しない」で不変" },
        ]}
      />
      <p>
        形式的に書くと、冪等な操作 <Cmd>f</Cmd> は <Cmd>f(f(x)) = f(x)</Cmd> を満たします（関数を 2 回合成しても 1 回と同じ）。安全は冪等より強い条件で、「状態を全く動かさない＝恒等写像」とみなせます。この 2 語を区別できると、「どの操作はリトライ安全か」「どこにキャッシュを効かせられるか」が式で判断できるようになります。
      </p>
      <Bridge course="離散数学 / 代数（冪等元・恒等写像）">
        冪等性の <Cmd>f(f(x)) = f(x)</Cmd> は、代数で習う<strong>冪等元</strong>（<Cmd>e·e = e</Cmd> を満たす要素）そのものです。集合演算の和集合 <Cmd>A ∪ A = A</Cmd> や、論理の <Cmd>A ∧ A = A</Cmd> が冪等なのと同じ構造が、HTTP メソッドの設計原則になっています。「安全＝状態を動かさない＝恒等写像」も写像論の言葉で捉えられます。抽象代数の性質が、ネットワークの信頼性設計（リトライしてよいか）という超実務的な判断に直結しているのは面白いところです。
      </Bridge>
      <Callout variant="warn" title="非冪等なメソッドのリトライは危険">
        <Cmd>POST</Cmd> は冪等ではないので、レスポンスが返る前にタイムアウトして再送すると<strong>二重に作成</strong>されえます。「送ったはずだが応答が来ない」＝「サーバに届いていない」とは限りません。届いた後で応答が失われたケースを、クライアントは区別できないのです。だから決済のような操作には後述の <Cmd>Idempotency-Key</Cmd> が要ります。
      </Callout>

      <Section>ステータスコードを正しく返す</Section>
      <p>200 を返して本文にエラーを詰める、という設計はやめましょう。HTTP のステータスで結果を伝えるのが REST の作法です。</p>
      <ul>
        <li><strong>201 Created</strong> — <Cmd>POST</Cmd> で作成成功。<Cmd>Location</Cmd> ヘッダに新リソースの URL を返す</li>
        <li><strong>204 No Content</strong> — 成功したが返す本文がない（<Cmd>DELETE</Cmd> 等）</li>
        <li><strong>400 Bad Request</strong> — リクエストの形式・値が不正</li>
        <li><strong>401 / 403</strong> — 未認証 / 権限なし</li>
        <li><strong>404 Not Found</strong> — リソースが存在しない</li>
        <li><strong>409 Conflict</strong> — 競合（重複作成・楽観ロック違反など）</li>
        <li><strong>422 Unprocessable Entity</strong> — 形式は正しいがバリデーション不合格</li>
      </ul>

      <Section>バージョニング</Section>
      <p>
        破壊的変更に備えて、最初から API にバージョンを付けておきます。もっとも一般的なのは URL パスに埋める方式です。
      </p>
      <Code lang="text" filename="versioning">{`GET /v1/users/42          # パス方式（分かりやすく主流）
Accept: application/vnd.myapp.v1+json   # ヘッダ方式（URL を汚さない）`}</Code>
      <Callout variant="tip" title="いつ上げるか">
        フィールド追加のような後方互換な変更ではバージョンを上げません。フィールド削除・型変更・意味の変更など<strong>既存クライアントを壊す変更</strong>のときにだけ v2 を切ります。
      </Callout>

      <Section>統一エラーレスポンス設計</Section>
      <p>
        エラーの形は API 全体で 1 つに統一します。機械が判別する <Cmd>code</Cmd>、人間が読む <Cmd>message</Cmd>、詳細の <Cmd>details</Cmd> を持たせるのが定番です。
      </p>
      <Code lang="json" filename="error response (422)">{`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": [
      { "field": "email", "issue": "形式が正しくありません" },
      { "field": "age",   "issue": "0 以上で指定してください" }
    ],
    "requestId": "req_a1b2c3"
  }
}`}</Code>
      <p>
        <Cmd>requestId</Cmd> を含めておくと、ユーザーからの問い合わせ時にサーバログと突き合わせられて調査が速くなります。標準化を狙うなら <Cmd>application/problem+json</Cmd>（RFC 9457）に沿う手もあります。
      </p>

      <Section>冪等性を実装で保証する — Idempotency-Key</Section>
      <p>
        <Cmd>PUT</Cmd> / <Cmd>DELETE</Cmd> は設計上「何度送っても結果が同じ」ですが、<Cmd>POST</Cmd> は冪等ではないため、ネットワークリトライで二重作成が起きえます。決済のような重要な作成では <Cmd>Idempotency-Key</Cmd> ヘッダをクライアントに送らせ、サーバが同一キーを重複実行しないようにします。
      </p>
      <Code lang="http" filename="request — POST /payments">{`POST /payments HTTP/1.1
Idempotency-Key: 4f8c-2b1a-9d7e   # クライアントが一意な鍵を生成
Content-Type: application/json

{ "amount": 5000, "currency": "JPY" }`}</Code>
      <p>
        サーバは受け取った鍵を保存し、<strong>初回だけ実際に処理し、以降は保存済みの結果をそのまま返す</strong>ようにします。こうすると、クライアントがタイムアウトで何度再送しても課金は 1 回きり。「非冪等な操作を、鍵によって冪等に変える」という発想です。
      </p>
      <TipBox>
        Idempotency-Key の本質は「操作の同一性を鍵で判定し、既に見た操作は再実行しない」——これはメモ化（一度計算した結果をキャッシュして再計算しない）と同じ構造です。鍵 → 結果 のマップを持つだけで、非冪等な処理を冪等に見せられます。
      </TipBox>
      <Bridge course="ネットワーク / 信頼性・at-least-once 配送">
        ネットワークの授業で「TCP は再送で信頼性を確保する」「メッセージ配送は at-most-once / at-least-once / exactly-once に分類される」と習ったはずです。HTTP リトライは典型的な<strong>at-least-once</strong>（最低 1 回は届くが重複しうる）。Idempotency-Key は、重複しうる配送の上で<strong>exactly-once の効果</strong>をアプリ層で作り出す仕組みです。下位層（ネットワーク）の不確実性を、上位層（アプリ）の設計で吸収する——プロトコル階層で学んだ「各層の責務分担」の実例です。
      </Bridge>

      <Section>フィルタ・ソート・ページングの基本</Section>
      <p>一覧取得は絞り込み・並べ替え・分割をクエリパラメータで表現します。パスではなくクエリに置くのがポイントです。</p>
      <Code lang="text" filename="query">{`GET /users?status=active&role=admin      # フィルタ
GET /users?sort=-createdAt               # ソート（- は降順）
GET /users?page=2&limit=20               # ページング
GET /users?fields=id,name,email          # 部分レスポンス`}</Code>
      <Callout variant="info" title="命名の一貫性">
        <Cmd>snake_case</Cmd> と <Cmd>camelCase</Cmd> のどちらでもよいので、API 全体で<strong>1 つに統一</strong>します。日付は ISO 8601（<Cmd>2026-07-07T09:00:00Z</Cmd>）、金額は最小単位の整数など、表現も揃えると使う側が迷いません。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "URL は名詞・複数形でリソースを表し、操作は HTTP メソッドで表す",
          "ステータスコードで結果を正しく伝える（201/204/400/404/409/422 など）",
          "破壊的変更に備えて最初から /v1 とバージョンを付ける",
          "エラーは code / message / details で API 全体を統一する",
          "冪等性を意識し、POST の二重実行は Idempotency-Key で防ぐ",
          "フィルタ・ソート・ページングはクエリで表現し、命名を統一する",
        ]}
      />
    </>
  );
}

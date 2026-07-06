import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, TipBox, Bridge, Steps, Step, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "graphql",
  title: "GraphQL 入門",
  description: "必要なデータだけをクエリで取得する GraphQL。REST との違い、スキーマと型、Query/Mutation/Resolver、単一エンドポイントの考え方を学ぶ。",
  domain: "web",
  section: "api",
  order: 6,
  level: "basic",
  tags: ["GraphQL", "API", "スキーマ"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>GraphQL</strong> は「クライアントが欲しいデータの形を宣言し、サーバがその形どおりに返す」ための API 用クエリ言語です。REST が「URL ごとに決まった塊」を返すのに対し、GraphQL は「1 本のエンドポイントに、必要なフィールドだけを問い合わせる」設計です。2015 年に Facebook（当時）が公開しました。モバイルアプリの画面ごとに必要なデータが違い、REST の固定エンドポイントでは通信効率が悪かった、という現実の課題から生まれています。
      </Lead>

      <Section>なぜ生まれたか — 背景と設計思想</Section>
      <p>
        GraphQL の核にあるのは「<strong>API の形を、サーバではなくクライアントが決める</strong>」という発想の転換です。REST では「この URL はこの塊を返す」とサーバ側が固定します。画面が増えるたびに新しい URL を足すか、既存のレスポンスに項目を追加していくことになり、レスポンスは肥大化しがちです。GraphQL は、取得したいフィールドをクライアントがクエリで宣言することで、この結合をほどきます。
      </p>
      <p>
        設計思想として重要なのは、GraphQL が<strong>「型付きのグラフ」を API のモデルにしている</strong>点です。データを「リソースの集合」ではなく「型と型が関連（エッジ）でつながったグラフ」として捉え、クライアントはそのグラフを起点ノードからたどって必要な部分だけを切り出します。<Cmd>user → posts → author</Cmd> のように関連をたどれるのはこのためです。
      </p>

      <Bridge course="グラフ理論 / データ構造">
        GraphQL の「Graph」は文字どおりグラフ理論のグラフです。型を<strong>ノード</strong>、フィールドの参照関係を<strong>エッジ</strong>と見なすと、1 本のクエリは「ある起点ノードから隣接ノードをたどる<strong>グラフ探索</strong>」になります。<Cmd>user(id:"1") &#123; posts &#123; author &#125; &#125;</Cmd> は、user ノードから posts エッジをたどり、さらに author エッジをたどる深さ優先の探索そのものです。講義で書いた DFS / BFS が、そのまま API のデータ取得モデルになっている、と捉えると腑に落ちます。
      </Bridge>

      <Section>REST との違い</Section>
      <p>
        REST では、リソースごとに URL が分かれます。ユーザ情報は <Cmd>GET /users/1</Cmd>、その投稿一覧は <Cmd>GET /users/1/posts</Cmd> のように、画面に必要な情報を集めるだけで何度もリクエストが必要になりがちです。GraphQL は 1 回のクエリで、関連するデータをまとめて取得できます。
      </p>

      <SubSection>オーバーフェッチ / アンダーフェッチの解消</SubSection>
      <ul>
        <li><strong>オーバーフェッチ</strong> — 名前しか要らないのに、REST の <Cmd>/users/1</Cmd> が住所も電話番号も返してしまう「取りすぎ」。</li>
        <li><strong>アンダーフェッチ</strong> — 1 つの画面を作るのに複数の URL を叩かないと情報が揃わない「足りない」。</li>
      </ul>
      <p>
        GraphQL では欲しいフィールドを明示するので取りすぎがなく、関連データも一度のクエリでたどれるので不足も起きにくくなります。
      </p>

      <Section>スキーマと型定義</Section>
      <p>
        GraphQL の中心は<strong>スキーマ</strong>です。サーバが「どんな型があり、どんなフィールドを問い合わせられるか」を型で宣言し、それが API の契約になります。スキーマは SDL（Schema Definition Language）で書きます。
      </p>

      <Code lang="graphql" filename="schema.graphql">{`type User {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
}

type Query {
  user(id: ID!): User
}

type Mutation {
  createPost(title: String!, body: String!): Post!
}`}</Code>

      <p>
        <Cmd>!</Cmd> は「必須（null 不可）」、<Cmd>[Post!]!</Cmd> は「Post の配列で、配列も要素も null にならない」を表します。型が API のドキュメントも兼ねる点が GraphQL の大きな強みです。
      </p>

      <SubSection>スキーマの主な構成要素</SubSection>
      <KVList
        items={[
          { key: "type", val: "オブジェクト型。フィールドの集合を定義する（User, Post など）" },
          { key: "scalar", val: "最小単位の型。String / Int / Float / Boolean / ID の 5 つが組み込み" },
          { key: "Query", val: "読み取りの入口（root 型）。ここに書いたフィールドが問い合わせ可能になる" },
          { key: "Mutation", val: "書き込みの入口。作成・更新・削除の操作をここに定義する" },
          { key: "input", val: "引数用のオブジェクト型。Mutation の入力をまとめるのに使う" },
          { key: "enum / interface / union", val: "列挙・多相を表す型。REST の JSON にはない表現力" },
        ]}
      />

      <Bridge course="形式言語 / 型システム">
        スキーマ（SDL）は、それ自体が 1 つの<strong>型付き言語</strong>です。<Cmd>type</Cmd> や <Cmd>!</Cmd> といったキーワードは文法（形式言語）で定義され、クエリはその文法に従うかどうかを<strong>パーサ</strong>で検証されます。さらにサーバは、クエリのフィールドが本当にスキーマの型に存在するかを実行前に<strong>型検査（type checking）</strong>します。「未定義のフィールドはコンパイル前に弾く」という、講義で学ぶ静的型付けと同じ仕組みが、ネットワーク越しの API に持ち込まれていると考えると分かりやすいです。クエリ言語（Query）は、この型システムの上で「どの部分グラフを取り出すか」を記述する DSL です。
      </Bridge>

      <Section>Query と Mutation</Section>
      <p>
        読み取りは <Cmd>Query</Cmd>、書き込み（作成・更新・削除）は <Cmd>Mutation</Cmd> という 2 つの入口に分かれます。クライアントは欲しいフィールドをそのまま書きます。
      </p>

      <Code lang="graphql" filename="query">{`query {
  user(id: "1") {
    name
    posts {
      title
    }
  }
}`}</Code>

      <p>返ってくる JSON は、クエリの形をそのままなぞります。要求した <Cmd>name</Cmd> と各投稿の <Cmd>title</Cmd> だけが返ります。</p>

      <Code lang="json" filename="response">{`{
  "data": {
    "user": {
      "name": "Yuma",
      "posts": [{ "title": "GraphQL 入門" }]
    }
  }
}`}</Code>

      <Section>Resolver — フィールドを値に解決する</Section>
      <p>
        スキーマは「形」を決めるだけです。実際に各フィールドの値をどこから取ってくるかは <strong>Resolver（リゾルバ）</strong>という関数が担います。フィールド 1 つ 1 つに対応する関数を書き、DB やほかの API から値を返します。
      </p>

      <Code lang="typescript" filename="resolvers.ts">{`const resolvers = {
  Query: {
    user: (_parent, args) => db.users.find(args.id),
  },
  User: {
    posts: (parent) => db.posts.filterByUser(parent.id),
  },
};`}</Code>

      <p>
        Resolver は<strong>フィールド単位で連鎖して呼ばれる</strong>点がポイントです。<Cmd>Query.user</Cmd> が User を返すと、そのクエリが <Cmd>posts</Cmd> を要求していれば <Cmd>User.posts</Cmd> リゾルバが親（parent）の User を受け取って続けて呼ばれます。クエリで「グラフをたどる」動きが、そのまま「リゾルバが親から子へ連鎖する」実行に対応します。
      </p>

      <Callout variant="warn" title="N+1 問題に注意">
        ユーザ一覧（N 件）を取り、各ユーザの posts を Resolver で個別に取ると、最初の一覧取得の 1 回に加えてユーザの数だけ DB 問い合わせが飛ぶ「N+1 問題」が起きます。10 人なら 11 回、100 人なら 101 回。件数に比例してクエリが増えるため、そのままでは性能が線形に悪化します。
      </Callout>

      <Bridge course="データベース">
        N+1 問題は GraphQL 特有ではなく、<strong>データベースのクエリ最適化</strong>そのものです。授業で学ぶ「ループの中で毎回 SELECT を投げるな、JOIN か <Cmd>IN</Cmd> でまとめろ」という原則が、リゾルバ層で再登場します。定番の <Cmd>DataLoader</Cmd> は、同一ティック内に発生した個別の <Cmd>find(1) find(2) find(3)</Cmd> を<strong>バッチ化</strong>して <Cmd>WHERE id IN (1,2,3)</Cmd> の 1 クエリにまとめ、さらに結果を<strong>キャッシュ</strong>します。クエリプランやインデックス、実行計画の知識がそのまま実務の性能問題に効く好例です。
      </Bridge>

      <Steps>
        <Step title="計測する">
          まず本当に N+1 が起きているかをログや APM で確認する。1 リクエストで発行された SQL の本数を数えるのが手っ取り早い。
        </Step>
        <Step title="DataLoader を挟む">
          リゾルバから直接 DB を叩かず、<Cmd>loader.load(id)</Cmd> を経由させる。同一イベントループ内の呼び出しがまとめて 1 クエリになる。
        </Step>
        <Step title="リクエスト単位で作る">
          DataLoader のキャッシュはリクエストごとに新規生成する。使い回すと古いデータが残る（後述の落とし穴）。
        </Step>
      </Steps>

      <Section>単一エンドポイントとクライアント</Section>
      <p>
        GraphQL の HTTP 通信は原則 <Cmd>POST /graphql</Cmd> という 1 本のエンドポイントに集約されます。URL 設計を増やす必要がなく、クエリの中身で「何を取るか」を表現します。クライアント側では <strong>Apollo Client</strong> や <strong>urql</strong>、Relay などが定番で、キャッシュ管理・ローディング状態・再取得を扱いやすくしてくれます。
      </p>

      <FlowChain
        nodes={[
          { label: "クライアント", variant: "alt" },
          { label: "単一エンドポイント", sub: "/graphql" },
          { label: "リゾルバ" },
          { label: "複数のデータ源", sub: "DB / API" },
        ]}
        caption="1 回のクエリで必要なデータだけ取得"
      />

      <Section>実務での使いどころ</Section>
      <p>
        GraphQL が特に効くのは、<strong>1 画面が多数の関連データを必要とする</strong>ケースです。SNS のタイムライン（投稿＋著者＋コメント＋いいね数）、ダッシュボード、モバイルアプリのように「画面ごとに欲しいデータが違う」場面で威力を発揮します。逆に、単純な CRUD だけ・ファイルダウンロード・CDN キャッシュを効かせたい公開 API では REST の方が素直です。
      </p>
      <TipBox>
        「BFF（Backend For Frontend）」層に GraphQL を置き、その裏で複数のマイクロサービス（REST / gRPC）を集約するパターンが実務で定番です。フロントは 1 本のクエリで済み、サービス分割の複雑さは GraphQL 層が吸収します。
      </TipBox>

      <Callout variant="danger" title="公開 API では「クエリの重さ」が攻撃面になる">
        クライアントが自由にクエリを組める＝深くネストしたクエリで DB を過負荷にする攻撃（悪意ある巨大クエリ）が可能になります。外部公開する場合は<strong>クエリの深さ制限・複雑度スコアリング・タイムアウト・永続化クエリ（許可したクエリだけ受け付ける）</strong>を必ず入れます。「クライアントに自由を渡す」設計の裏返しのコストです。
      </Callout>

      <Section>メリットとデメリット</Section>
      <ComparisonTable
        headers={["観点", "メリット", "デメリット"]}
        rows={[
          ["データ取得", "必要なフィールドだけ／過不足なし", "クエリ設計をクライアントに委ねる"],
          ["型・仕様", "スキーマが契約＆ドキュメントになる", "サーバ実装（Resolver）が増える"],
          ["キャッシュ", "クライアント側が賢くキャッシュ", "HTTP キャッシュ（CDN）が効きにくい"],
          ["運用", "エンドポイントが 1 本で単純", "N+1・クエリ複雑度の監視が必要"],
          ["セキュリティ", "型で入力を検証できる", "重いクエリ対策（深さ/複雑度制限）が要る"],
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "GraphQL は「欲しいデータの形を宣言」して 1 本のエンドポイントに問い合わせる",
          "スキーマ（型）が API の契約であり、Query は読み取り・Mutation は書き込み",
          "各フィールドの値は Resolver が解決する。N+1 は DataLoader で対策",
          "REST のオーバー／アンダーフェッチを解消できるが、CDN キャッシュは効きにくい",
        ]}
      />
    </>
  );
}

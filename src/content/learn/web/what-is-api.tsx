import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, Bridge, TipBox, Figure, Divider } from "../../../components/learn/kit";
import { FlowChain, LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "what-is-api",
  title: "API とは — REST / SOAP / gRPC / GraphQL",
  description: "ソフトウェア同士をつなぐ約束事 API。REST を中心に、HTTP メソッドとリソース設計、代表的な API スタイルの違いを理解する。",
  domain: "web",
  section: "api",
  order: 1,
  level: "intro",
  tags: ["API", "REST", "GraphQL"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>API（Application Programming Interface）</strong>は、ソフトウェア同士がデータや機能をやり取りするための「窓口」であり「約束事（仕様）」です。相手の内部実装を知らなくても、決められた形式でリクエストを送れば決められた形式でレスポンスが返る — この取り決めこそが API です。
      </Lead>

      <Section>API という考え方 — なぜ「窓口」が必要か</Section>
      <p>
        API のやり取りは HTTP と同じく<strong>リクエストとレスポンスの往復</strong>です。呼び出す側（クライアント）が API にリクエストを送り、その裏側にあるサーバが処理をしてレスポンスを返します。地図の埋め込み、決済、SNS ログイン、天気情報 — 私たちが普段触れているサービスの多くは、他社が公開している API を組み合わせて成り立っています。
      </p>
      <p>
        API の本質は「<strong>使う側と作る側の間に引かれた 1 本の境界線</strong>」です。使う側は境界の向こうで何が起きているか（どんな言語で書かれ、どんな DB を使い、どんなアルゴリズムで処理しているか）を一切知らなくてよい。決められた形式で頼めば、決められた形式で答えが返る。この「知らなくてよい」という性質こそが、巨大なソフトウェアを人間が扱える理由です。
      </p>

      <FlowChain
        nodes={[
          { label: "クライアント", sub: "利用する側", variant: "alt" },
          { label: "API", sub: "仕様/インターフェース" },
          { label: "サーバー", sub: "提供する側" },
        ]}
        caption="決められた約束(API)を介してやり取りする"
      />
      <ul>
        <li><strong>自分で作って提供する</strong> — 自社のデータや機能を外部に公開する</li>
        <li><strong>他の API を使う</strong> — 地図・決済・SNS・天気などを組み込む</li>
      </ul>

      <Section>システム同士は「こうやって」会話している</Section>
      <p>
        抽象的な「窓口」の話を、実際の 1 往復で覗いてみましょう。あなたのアプリが天気 API に「東京の天気を教えて」と頼むとき、ネットワーク上を流れているのは、実は次のような<strong>ただのテキスト</strong>です。
      </p>
      <Code lang="http" filename="① クライアント → サーバー（リクエスト）">{`GET /v1/weather?city=Tokyo HTTP/1.1
Host: api.example.com
Authorization: Bearer abc123
Accept: application/json`}</Code>
      <Code lang="http" filename="② サーバー → クライアント（レスポンス）">{`HTTP/1.1 200 OK
Content-Type: application/json

{ "city": "Tokyo", "tempC": 28, "condition": "Sunny" }`}</Code>
      <p>
        構造はとてもシンプルです。リクエストは「<strong>動詞（GET）＋住所（パス）＋付帯情報（ヘッダ）</strong>」、レスポンスは「<strong>状態（200 OK）＋中身（JSON）</strong>」。人間同士の「〇〇をください」「はい、どうぞ」という会話と同じで、送る側が用件を、返す側が結果と「うまくいったか」を伝えます。この 1 往復こそが API の実体です。
      </p>
      <p>
        この会話は特別な道具がなくても手元から再現できます。<Cmd>curl</Cmd> を使えば、ターミナルから 1 行で同じリクエストを送り、返ってきた中身をそのまま見られます。
      </p>
      <Code lang="bash" filename="手元から同じ会話をする">{`curl -H "Authorization: Bearer abc123" \\
  "https://api.example.com/v1/weather?city=Tokyo"`}</Code>

      <Figure src="/learn/shots/web/what-is-api-01.svg" alt="ターミナルで curl を実行し JSON レスポンスが返ってきた画面" caption="ブラウザもアプリも介さず、ターミナル 1 行で API の往復をそのまま覗ける" />
      <Callout variant="tip" title="流儀が違うだけで、やっていることは同じ">
        REST も GraphQL も gRPC も、突き詰めれば「リクエストを送って、結果を受け取る」というこの往復です。違うのは<strong>話し方の流儀</strong>（URL の組み立て方・データ形式・使うプロトコル）だけ。まずこの 1 往復のイメージを持っておくと、どのスタイルも同じ骨格に見えてきます。
      </Callout>

      <Bridge course="ソフトウェア工学 / インターフェースと抽象化">
        講義で習う「<strong>インターフェースは実装と分離せよ</strong>」「<strong>情報隠蔽（information hiding）</strong>」という原則が、Web ではそのまま API という形で現れます。関数のシグネチャ（引数と戻り値の型）を決めれば中身を差し替えても呼び出し側は壊れない — これと全く同じ発想で、API は「エンドポイント＋リクエスト／レスポンス形式」という契約だけを外に見せ、サーバ内部の実装は隠します。授業で `interface` と `class` を分けて設計した経験は、そのまま「API 仕様」と「サーバ実装」を分ける設計に対応します。
      </Bridge>

      <Section>API がもたらす「疎結合」</Section>
      <p>
        API を挟むと、クライアントとサーバは<strong>お互いの都合に振り回されなくなります</strong>。サーバ側が DB を MySQL から PostgreSQL に移しても、内部の関数名を変えても、API の形（契約）さえ守っていればクライアントは何も直さなくてよい。逆にクライアントを Web から iOS アプリに変えても、同じ API を叩けば同じデータが得られます。
      </p>
      <KVList
        items={[
          { key: "モジュール性", val: "システムを独立した部品に分け、部品ごとに開発・テスト・交換できる" },
          { key: "疎結合 (loose coupling)", val: "部品同士が「契約」だけでつながり、内部変更が波及しない" },
          { key: "再利用性", val: "1 つの API を Web・モバイル・他社サービスから同時に使い回せる" },
          { key: "並行開発", val: "API 仕様を先に決めれば、フロントとバックが同時に着手できる" },
        ]}
      />
      <Bridge course="ソフトウェア工学 / モジュール性・結合度と凝集度">
        「<strong>結合度は低く、凝集度は高く</strong>」という設計指標を覚えているでしょうか。API はまさに結合度を下げる装置です。モジュール間を関数呼び出しではなく「ネットワーク越しの契約」でつなぐことで、片方を丸ごと別チーム・別言語・別サーバに置いても壊れない。マイクロサービスは、この「API による疎結合」を組織とデプロイの単位にまで押し広げた設計と言えます。
      </Bridge>

      <Section>代表的な API スタイル</Section>
      <p>
        「API」と一口に言っても、通信方式やデータ形式によっていくつかのスタイルに分かれます。現在の Web で最も広く使われているのは REST ですが、用途に応じて gRPC や GraphQL が選ばれることも増えています。
      </p>

      <ComparisonTable
        headers={["スタイル", "データ形式", "特徴", "向いている用途"]}
        rows={[
          ["REST", "JSON", "HTTP をそのまま使いシンプル。学習コスト低", "一般的な Web / モバイル API"],
          ["SOAP", "XML", "厳格な仕様・型・トランザクション", "企業システム・金融・レガシー連携"],
          ["gRPC", "Protocol Buffers", "HTTP/2 ベースで高速・双方向通信", "マイクロサービス間通信"],
          ["GraphQL", "クエリで指定", "必要な項目だけ取得。過不足なし", "複雑・多様なデータ取得"],
        ]}
      />

      <Callout variant="info" title="オーバーフェッチ / アンダーフェッチ">
        REST では「1 エンドポイント = 固定のレスポンス」のため、不要な項目まで返る（オーバーフェッチ）／複数回呼ぶ必要がある（アンダーフェッチ）が起きがちです。GraphQL はクライアントが欲しい項目だけをクエリで指定でき、これを解決します。
      </Callout>

      <Section>REST API の基本</Section>
      <SubSection>HTTP メソッドで操作を表す</SubSection>
      <p>
        REST では「リソース（URL）」に対して「HTTP メソッド」で操作を指定します。同じ <Cmd>/users</Cmd> というリソースでも、メソッドが変われば意味が変わります。
      </p>

      <ComparisonTable
        headers={["メソッド", "エンドポイント", "意味"]}
        rows={[
          [<Cmd>GET</Cmd>, <Cmd>/users</Cmd>, "ユーザー一覧を取得"],
          [<Cmd>GET</Cmd>, <Cmd>/users/{"{id}"}</Cmd>, "特定ユーザーを取得"],
          [<Cmd>POST</Cmd>, <Cmd>/users</Cmd>, "ユーザーを新規作成"],
          [<Cmd>PUT</Cmd>, <Cmd>/users/{"{id}"}</Cmd>, "ユーザーを全体更新"],
          [<Cmd>PATCH</Cmd>, <Cmd>/users/{"{id}"}</Cmd>, "ユーザーを部分更新"],
          [<Cmd>DELETE</Cmd>, <Cmd>/users/{"{id}"}</Cmd>, "ユーザーを削除"],
        ]}
      />

      <SubSection>JSON でやり取りする</SubSection>
      <p>
        REST API のデータ形式は JSON が主流です。たとえばユーザーを新規作成する場合、次のようなリクエストを送ると、サーバは作成結果を含むレスポンスを返します。
      </p>

      <Code lang="json" filename="request — POST /users">{`{
  "name": "Taro",
  "email": "taro@example.com"
}`}</Code>

      <Code lang="json" filename="response — 201 Created">{`{
  "id": 123,
  "name": "Taro",
  "email": "taro@example.com",
  "createdAt": "2026-07-07T09:30:00Z"
}`}</Code>

      <Callout variant="tip" title="適切なステータスコードを返す">
        作成なら <Cmd>201 Created</Cmd>、取得成功なら <Cmd>200 OK</Cmd>、不正なリクエストは <Cmd>400</Cmd>、見つからなければ <Cmd>404</Cmd> — REST ではステータスコードで結果を表現します（詳しくは「HTTP の基礎」章を参照）。
      </Callout>

      <Section>API は「契約」である — 仕様を先に決める</Section>
      <p>
        現場では実装より先に API 仕様を書くことがよくあります。<strong>OpenAPI（Swagger）</strong>という形式でエンドポイント・パラメータ・レスポンスの型を YAML で定義しておくと、それが「契約書」になります。フロント担当はこの契約を見てモックを作り、バック担当は契約を満たすよう実装する — 両者が並行して動けます。
      </p>
      <Code lang="yaml" filename="openapi.yaml（抜粋）">{`paths:
  /users/{id}:
    get:
      summary: 特定ユーザーを取得
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: OK
        "404":
          description: Not Found`}</Code>
      <p>
        この仕様は単なるドキュメントに留まりません。ここからクライアント SDK を自動生成したり、リクエストが契約どおりか自動検証したり、テストを回したりできます。API の抽象度は「人間が読む文章」から「機械が検証できる契約」へと引き上げられます。
      </p>
      <Bridge course="ソフトウェア工学 / 契約による設計 (Design by Contract)">
        「事前条件・事後条件・不変条件」で関数の振る舞いを定めた<strong>契約による設計</strong>を、API のスケールで実践したのが OpenAPI です。「id は整数（事前条件）を渡せば、200 でユーザー、または 404 が返る（事後条件）」——この契約を型で書き下しておくと、破った側（クライアント or サーバ）が機械的に検出されます。授業で assert を書いて契約を守らせたのと同じことを、ネットワーク越しにやっているわけです。
      </Bridge>

      <SubSection>抽象化の層としての API</SubSection>
      <p>
        1 回の API 呼び出しの裏では、実は何層もの抽象化が積み重なっています。あなたが叩く <Cmd>GET /users/42</Cmd> は、その下の各層に「頼むだけ」で仕事が進みます。各層は下の層の内部を知りません。
      </p>
      <LayerStack
        layers={[
          { label: "アプリ / UI", sub: "画面はデータの形だけ知る" },
          { label: "API（HTTP 契約）", sub: "GET /users/42 → JSON" },
          { label: "アプリケーションロジック", sub: "認可・整形・組み立て" },
          { label: "データベース", sub: "SQL / インデックス走査" },
        ]}
        caption="上の層は下の層の「窓口」だけを見て、内部は知らない"
      />
      <TipBox>
        「上の層は下の層のインターフェースだけに依存する」——これは OS のシステムコール、ライブラリの関数、ネットワークのプロトコル階層すべてに共通する構造です。API を学ぶことは、この普遍的な「層の設計」を Web の文脈で学び直すことでもあります。
      </TipBox>

      <Section>落とし穴 — 抽象化が漏れるとき</Section>
      <Callout variant="warn" title="抽象化は完璧には隠せない（漏れのある抽象化）">
        API は内部を隠しますが、<strong>性能・エラー・制約は隠しきれません</strong>。「1 件取得するだけ」に見える API が、裏で重い集計をしていて遅い。ネットワークは関数呼び出しと違い、遅延・タイムアウト・部分的失敗が起きる。こうした「隠したはずの下層の事情が漏れてくる」現象を Leaky Abstraction（漏れのある抽象化）と呼びます。API を使う側も、境界の向こうが「ネットワーク越しの他人のマシン」であることは忘れてはいけません。
      </Callout>

      <Section>良い API の条件</Section>
      <p>
        使われる API には共通点があります。エンドポイントやレスポンスに一貫性があり、直感的に理解でき、状況に応じた適切なステータスコードを返し、認証・入力検証などのセキュリティが担保され、そして何よりドキュメントが整っていることです。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "API はソフト同士をつなぐ「窓口」であり「約束事（仕様）」",
          "主要スタイルは REST / SOAP / gRPC / GraphQL。Web の主流は REST",
          "REST は「リソース（URL）× HTTP メソッド」で操作を表す",
          "データ形式は JSON が主流。結果はステータスコードで返す",
          "良い API の条件は一貫性・分かりやすさ・適切なコード・セキュリティ・ドキュメント",
        ]}
      />
    </>
  );
}

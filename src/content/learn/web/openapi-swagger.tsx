import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, TipBox, Bridge, Steps, Step, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "openapi-swagger",
  title: "OpenAPI / Swagger でドキュメント化",
  description: "API 仕様を機械可読に記述する OpenAPI と、それを可視化する Swagger UI。スキーマ駆動開発とコード生成のメリットを理解する。",
  domain: "web",
  section: "api",
  order: 9,
  level: "basic",
  tags: ["OpenAPI", "Swagger", "ドキュメント"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        API は「どのパスに、どんなパラメータで、何が返るか」を関係者全員が正確に知る必要があります。それを人間にも機械にも読める形で書く標準が <strong>OpenAPI</strong> です。手書きのドキュメントと違い、仕様書がそのままテスト・コード生成・UI に使えるのが強みです。
      </Lead>

      <Section>なぜ「機械可読な仕様」が要るのか</Section>
      <p>
        自然言語で書いた API ドキュメントは、必ず実装とズレます。「このフィールドは省略可だっけ？」「404 のときのボディは？」といった曖昧さが、フロントとバックの認識違いを生みます。OpenAPI は、この仕様を<strong>曖昧さのない機械可読なフォーマット</strong>で書くことで、人間の解釈の余地を消します。仕様が機械に読めれば、そこからドキュメント UI・入力バリデーション・テスト・型・モックサーバをすべて<strong>自動導出</strong>できます。
      </p>

      <Bridge course="形式仕様記述 / ソフトウェア工学">
        OpenAPI 仕様は、講義で扱う<strong>形式仕様記述（formal specification）</strong>の身近な実例です。「仕様書＝散文」ではなく「仕様書＝機械が検証できる契約」にする、という考え方は、Z 記法や契約による設計（Design by Contract）の事前条件・事後条件と同じ発想です。API の入力（parameters / requestBody）が事前条件、出力（responses のスキーマ）が事後条件に対応します。そして「実装が契約を満たすか」を CI で自動検証する<strong>契約テスト</strong>は、仕様と実装の乖離を機械的に検出する—まさに形式手法が目指す「仕様を正とする開発」の実務版です。
      </Bridge>

      <Section>OpenAPI とは</Section>
      <p>
        <strong>OpenAPI Specification（OAS）</strong>は、REST API の仕様を YAML / JSON で記述するための標準フォーマットです。かつて「Swagger 仕様」と呼ばれていたものが標準化され、現在は OpenAPI という名前になっています（記述形式が OpenAPI、周辺ツール群が Swagger、という整理が分かりやすいです）。2025-2026 時点では <Cmd>3.1</Cmd> 系が主流で、JSON Schema と完全互換になっています。
      </p>

      <Section>YAML での定義</Section>
      <p>
        仕様は <Cmd>paths</Cmd>（エンドポイント）と <Cmd>components</Cmd>（再利用する型）で構成します。次は「ユーザ 1 件を取得する GET」の最小例です。
      </p>

      <Code lang="yaml" filename="openapi.yaml">{`openapi: 3.1.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      summary: ユーザを取得
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: 成功
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "404":
          description: 見つからない
components:
  schemas:
    User:
      type: object
      required: [id, name]
      properties:
        id: { type: string }
        name: { type: string }
        age: { type: integer }`}</Code>

      <p>
        <Cmd>$ref</Cmd> で <Cmd>User</Cmd> 型を再利用している点に注目してください。型を一箇所で定義し、レスポンスやリクエストから参照することで、仕様の重複と食い違いを防げます。
      </p>

      <SubSection>仕様の主な構成要素</SubSection>
      <KVList
        items={[
          { key: "info", val: "API のタイトル・バージョンなどのメタ情報" },
          { key: "paths", val: "エンドポイント。パスごとにメソッド・パラメータ・レスポンスを定義" },
          { key: "components/schemas", val: "再利用するデータ型。$ref で参照して重複を防ぐ" },
          { key: "parameters", val: "path / query / header などの入力（事前条件にあたる）" },
          { key: "responses", val: "ステータスコードごとの返却スキーマ（事後条件にあたる）" },
          { key: "securitySchemes", val: "認証方式（Bearer / API キー / OAuth など）の定義" },
        ]}
      />

      <Section>Swagger UI で可視化</Section>
      <p>
        <strong>Swagger UI</strong> は、OpenAPI ファイルを読み込んでインタラクティブなドキュメント画面を自動生成するツールです。エンドポイント一覧・パラメータ・レスポンス例が表示され、ブラウザ上で <Cmd>Try it out</Cmd> から実際に API を叩いて確認できます。同系統に、より軽量な <Cmd>Redoc</Cmd> や <Cmd>Scalar</Cmd> もあります。
      </p>

      <Callout variant="tip" title="コードから自動生成もできる">
        FastAPI（Python）や NestJS（TypeScript）などは、実装のコードから OpenAPI 仕様を自動出力します。仕様と実装が乖離しにくく、まず試したい構成です。
      </Callout>

      <Section>スキーマ駆動開発</Section>
      <p>
        OpenAPI の真価は<strong>スキーマ駆動開発（Schema-Driven / API-First）</strong>にあります。実装より先に仕様（スキーマ）を合意し、それを「唯一の正（Single Source of Truth）」として開発を進める進め方です。
      </p>
      <SubSection>この進め方の利点</SubSection>
      <ul>
        <li><strong>並行開発</strong> — 仕様が先に固まるので、フロントとバックが同時に着手できる（モックサーバも仕様から生成できる）。</li>
        <li><strong>ずれの検出</strong> — 実装が仕様に沿っているかを CI で自動検証できる（契約テスト）。</li>
        <li><strong>共通言語</strong> — 仕様書が関係者すべての共通言語になり、認識違いが減る。</li>
      </ul>

      <SubSection>スキーマ駆動開発の流れ</SubSection>
      <Steps>
        <Step title="仕様を合意する">
          実装前に <Cmd>openapi.yaml</Cmd> をレビューして関係者で合意する。ここが「唯一の正」になる。
        </Step>
        <Step title="仕様から生成する">
          型付きクライアント・サーバ雛形・モックサーバ・ドキュメントを仕様から一括生成する。
        </Step>
        <Step title="並行実装する">
          フロントは生成クライアント（or モック）で、バックは生成雛形で同時に開発する。
        </Step>
        <Step title="CI で契約を検証する">
          実装レスポンスが仕様どおりかを契約テストで検証し、乖離を自動で弾く。
        </Step>
      </Steps>

      <Section>クライアント / サーバのコード生成</Section>
      <p>
        OpenAPI ファイルから、型付きのクライアント SDK やサーバの雛形を自動生成できます。手書きの通信コードや型定義を減らし、仕様変更にも追従しやすくなります。
      </p>

      <FlowChain
        nodes={[
          { label: "openapi.yaml", variant: "alt", sub: "唯一の仕様" },
          { label: "ジェネレータ", sub: "コード生成" },
          { label: "成果物", variant: "cta", sub: "型/SDK/雛形/UI" },
        ]}
        caption="1 つの仕様から、複数の成果物が派生する"
      />

      <Bridge course="コンパイラ / ソフトウェア工学">
        仕様から型やクライアントを吐き出すコードジェネレータは、講義で学ぶ<strong>コンパイラの構造</strong>そのものです。YAML/JSON の仕様を<strong>構文解析（パース）</strong>して抽象構文木（AST）に相当する内部モデルを作り、それを走査して各言語のソースを<strong>コード生成（emit）</strong>する—「フロントエンドで意味を取り込み、バックエンドでターゲット言語に落とす」という二段構えは、まさにコンパイラのパイプラインです。OpenAPI が「ソース言語」、TypeScript/Go のクライアントが「ターゲット言語」だと捉えると、字句解析・構文解析・コード生成の授業が実務でどう使われるかが見えてきます。
      </Bridge>

      <Code lang="bash" filename="terminal">{`# openapi-generator でクライアントを生成
openapi-generator-cli generate \\
  -i openapi.yaml \\
  -g typescript-fetch \\
  -o ./src/api

# 軽量な TS 型だけ欲しい場合
npx openapi-typescript openapi.yaml -o ./src/api/schema.d.ts`}</Code>

      <Callout variant="warn" title="生成物は編集しない">
        自動生成されたコードを手で直すと、次の生成で上書きされて消えます。カスタマイズは生成物をラップする層で行い、生成ディレクトリはコミット対象外にするか「編集禁止」を徹底しましょう。
      </Callout>

      <Section>設計優先 vs 実装優先</Section>
      <p>
        OpenAPI 仕様の作り方には 2 つの流儀があります。どちらが正解ということはなく、チームやフェーズで使い分けます。
      </p>
      <ComparisonTable
        headers={["観点", "設計優先（Design-First）", "実装優先（Code-First）"]}
        rows={[
          ["書く順序", "先に YAML を書く → 実装", "先にコードを書く → 仕様を自動出力"],
          ["向く場面", "複数チーム・外部公開・API-First", "小規模・素早く動かしたい"],
          ["並行開発", "しやすい（仕様が先に固まる）", "しにくい（実装が先に要る）"],
          ["乖離リスク", "契約テストで管理", "実装から出るので乖離しにくい"],
          ["代表ツール", "手書き YAML ＋ openapi-generator", "FastAPI / NestJS の自動出力"],
        ]}
      />

      <Callout variant="warn" title="仕様と実装の乖離が最大の敵">
        設計優先で書いた仕様を、実装だけ変えて仕様を放置すると、機械可読という利点が丸ごと嘘になります。仕様は「一度書いて終わり」ではなく、<strong>CI で実装と突き合わせ続ける</strong>もの。契約テストや <Cmd>schemathesis</Cmd> のような仕様ベースのテストで、乖離を機械的に検出し続けるのが実務のキモです。
      </Callout>

      <Section>メリットまとめ</Section>
      <ul>
        <li>ドキュメント・テスト・コード生成が 1 つの仕様ファイルから派生する。</li>
        <li>型付きクライアントで、フロント側のリクエスト/レスポンスが安全になる。</li>
        <li>仕様が機械可読なので、Lint・差分検知・モックまで自動化できる。</li>
      </ul>
      <TipBox>
        まず試すなら FastAPI や NestJS のような「実装から仕様を自動出力する」フレームワークが手軽です。仕様と実装が構造的に乖離しにくく、生成された Swagger UI をそのまま社内ドキュメントにできます。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "OpenAPI は API 仕様を YAML/JSON で記述する標準（3.1 系が主流）",
          "Swagger UI などが仕様を読み込み、試せるドキュメント画面を自動生成する",
          "スキーマ駆動開発では仕様を唯一の正とし、フロント/バックを並行開発できる",
          "仕様からクライアント SDK・サーバ雛形・型を生成でき、生成物は手で編集しない",
        ]}
      />
    </>
  );
}

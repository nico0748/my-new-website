import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider, Figure } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "backend-stack",
  title: "バックエンドの技術スタック",
  description: "サーバー側でロジックとデータを扱う層の代表スタック。言語・フレームワークの比較、API 方式（REST/GraphQL/gRPC）、ORM・認証・非同期処理など周辺スタックを俯瞰する。",
  domain: "stack",
  section: "backend",
  order: 1,
  level: "basic",
  tags: ["バックエンド", "API", "フレームワーク", "ORM"],
  updated: "2026-07-09",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        バックエンドは、表に出ない<strong>ロジックとデータ</strong>を担う層です。フロントからの API を受け、データベースを読み書きし、認証や外部連携を行います。言語・フレームワークを軸に、代表スタックを俯瞰します。
      </Lead>

      <Section>言語 × フレームワーク</Section>
      <ComparisonTable
        headers={["言語", "代表フレームワーク", "特徴"]}
        rows={[
          ["JavaScript / TypeScript", <><Tech id="express">Express</Tech>・<Tech id="nestjs">NestJS</Tech>・<Tech id="fastify">Fastify</Tech>・<Tech id="hono">Hono</Tech></>, "フロントと同じ言語。NestJS は構造化された大規模向け"],
          ["Python", <><Tech id="django">Django</Tech>・<Tech id="fastapi">FastAPI</Tech>・<Tech id="flask">Flask</Tech></>, "Django は全部入り、FastAPI は型と非同期で API 向き"],
          ["Ruby", <Tech id="rails">Ruby on Rails</Tech>, "規約優先で開発が速い。スタートアップに人気"],
          ["PHP", <Tech id="laravel">Laravel</Tech>, "学習資料が豊富。中小規模の Web に強い"],
          [<Tech id="go">Go</Tech>, "Echo・Gin・chi", "軽量・高速・並行処理が得意。単一バイナリ配布"],
          ["Java / Kotlin", <Tech id="spring-boot">Spring Boot</Tech>, "大規模・堅牢。企業システムの定番"],
          ["C#", <Tech id="aspnet">ASP.NET Core</Tech>, "高性能。Windows/クラウド(Azure)との親和性"],
          [<Tech id="rust">Rust</Tech>, "Axum・Actix", "高速・安全。パフォーマンス重視の新興"],
        ]}
      />

      <Section>API の方式</Section>
      <ComparisonTable
        headers={["方式", "特徴", "向いている場面"]}
        rows={[
          [<Tech id="rest">REST</Tech>, "URL とHTTP メソッドで表現。最も普及", "汎用的な Web API の第一候補"],
          [<Tech id="graphql">GraphQL</Tech>, "クライアントが必要なデータ形を指定", "画面ごとに取得項目が変わる複雑な UI"],
          [<Tech id="grpc">gRPC</Tech>, "バイナリで高速。型定義(proto)ベース", "サービス間通信・マイクロサービス"],
        ]}
      />
      <Callout variant="info" title="まずは REST から">
        迷ったら REST が無難です。情報も多く、ほとんどの要件を満たせます。GraphQL や gRPC は「REST だと困る具体的な理由」が出てきてから採用を検討するのが安全です。
      </Callout>

      <Section>周辺スタック</Section>
      <ComparisonTable
        headers={["役割", "代表", "何をするか"]}
        rows={[
          ["ORM / DB アクセス", "Prisma・TypeORM・SQLAlchemy・ActiveRecord", "SQL を書かずにコードで DB を操作"],
          ["認証 / 認可", "JWT・セッション・OAuth・Auth0/Clerk", "ログインとアクセス制御"],
          ["非同期処理 / ジョブ", "Celery・BullMQ・Sidekiq", "メール送信・重い処理をバックグラウンドで"],
          ["キャッシュ", <Tech id="redis">Redis</Tech>, "頻繁に読むデータを高速化"],
          ["API 仕様", <Tech id="openapi">OpenAPI (Swagger)</Tech>, "API の仕様書を機械可読で共有"],
        ]}
      />
      <Figure
        src="/learn/shots/stack/backend-stack-01.svg"
        alt="Swagger UI の画面。エンドポイント一覧を展開し、その場で API を実行した結果が表示されている"
        caption="OpenAPI で書いた仕様は、こうしてブラウザで読めて試せる形になる"
      />

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>フロントと言語を揃えたい</strong> → Node.js（NestJS / Express）</li>
        <li><strong>データ/ML と連携</strong> → Python（FastAPI / Django）</li>
        <li><strong>とにかく速く CRUD</strong> → Rails / Laravel</li>
        <li><strong>高負荷・並行処理・軽量配布</strong> → Go</li>
        <li><strong>大規模・堅牢なエンタープライズ</strong> → Java(Spring) / C#(ASP.NET)</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "言語×FW：Node(NestJS/Express)、Python(FastAPI/Django)、Rails、Go、Spring 等",
          "API は迷ったら REST。複雑な取得は GraphQL、サービス間は gRPC",
          "ORM で DB 操作、認証は JWT/セッション/OAuth、重い処理はジョブに逃がす",
          "キャッシュ(Redis)と API 仕様(OpenAPI)は実務でほぼ必須の周辺スタック",
          "フロントと言語統一なら Node、データ連携なら Python が有力",
        ]}
      />
    </>
  );
}

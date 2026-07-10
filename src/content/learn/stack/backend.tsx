import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

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
          ["JavaScript / TypeScript", "Express・NestJS・Fastify・Hono", "フロントと同じ言語。NestJS は構造化された大規模向け"],
          ["Python", "Django・FastAPI・Flask", "Django は全部入り、FastAPI は型と非同期で API 向き"],
          ["Ruby", "Ruby on Rails", "規約優先で開発が速い。スタートアップに人気"],
          ["PHP", "Laravel", "学習資料が豊富。中小規模の Web に強い"],
          ["Go", "Echo・Gin・chi", "軽量・高速・並行処理が得意。単一バイナリ配布"],
          ["Java / Kotlin", "Spring Boot", "大規模・堅牢。企業システムの定番"],
          ["C#", "ASP.NET Core", "高性能。Windows/クラウド(Azure)との親和性"],
          ["Rust", "Axum・Actix", "高速・安全。パフォーマンス重視の新興"],
        ]}
      />

      <Section>API の方式</Section>
      <ComparisonTable
        headers={["方式", "特徴", "向いている場面"]}
        rows={[
          ["REST", "URL とHTTP メソッドで表現。最も普及", "汎用的な Web API の第一候補"],
          ["GraphQL", "クライアントが必要なデータ形を指定", "画面ごとに取得項目が変わる複雑な UI"],
          ["gRPC", "バイナリで高速。型定義(proto)ベース", "サービス間通信・マイクロサービス"],
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
          ["キャッシュ", "Redis", "頻繁に読むデータを高速化"],
          ["API 仕様", "OpenAPI (Swagger)", "API の仕様書を機械可読で共有"],
        ]}
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

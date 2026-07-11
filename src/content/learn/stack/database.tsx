import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "database-stack",
  title: "データベースの技術スタック",
  description: "データを保存する層の代表スタック。リレーショナル(RDB)とNoSQL の違い、用途別の代表製品、キャッシュ・全文検索・ベクトルDB など特化型までを俯瞰する。",
  domain: "stack",
  section: "database",
  order: 1,
  level: "basic",
  tags: ["データベース", "RDB", "NoSQL", "Redis"],
  updated: "2026-07-09",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        データベースは<strong>データを保存する層</strong>です。まず「表で厳密に持つ RDB」と「柔軟な NoSQL」の違いを掴み、そこにキャッシュや検索などの<strong>特化型</strong>を組み合わせて実際のスタックを作ります。
      </Lead>

      <Section>まず RDB か NoSQL か</Section>
      <ComparisonTable
        headers={["種類", "データの持ち方", "強み", "代表"]}
        rows={[
          ["リレーショナル(RDB)", "表（行・列）＋スキーマ", "整合性・複雑な結合・トランザクション", "PostgreSQL・MySQL"],
          ["NoSQL", "文書/キー値/列/グラフなど", "柔軟なスキーマ・水平スケール", "MongoDB・DynamoDB・Redis"],
        ]}
      />
      <Callout variant="tip" title="迷ったら RDB（PostgreSQL）">
        多くのアプリは、まず RDB で始めるのが堅実です。中でも PostgreSQL は機能が豊富で、JSON も全文検索もこなせます。「RDB では困る明確な理由」が出てから NoSQL を足すのが安全な進め方です。
      </Callout>

      <Section>リレーショナル DB</Section>
      <ComparisonTable
        headers={["製品", "特徴"]}
        rows={[
          [<Tech id="postgresql">PostgreSQL</Tech>, "高機能で拡張性が高い。JSON・全文検索・地理情報・ベクトルまで対応"],
          [<><Tech id="mysql">MySQL</Tech> / MariaDB</>, "普及率が高く情報が豊富。Web の定番"],
          [<Tech id="sqlite">SQLite</Tech>, "ファイル1つで動く軽量DB。組込み・モバイル・小規模に最適"],
          ["クラウドマネージド", "Amazon RDS / Aurora・Cloud SQL など。運用を任せられる"],
        ]}
      />

      <Section>NoSQL / 特化型</Section>
      <ComparisonTable
        headers={["種類", "代表", "用途"]}
        rows={[
          ["ドキュメント", <><Tech id="mongodb">MongoDB</Tech>・Firestore</>, "スキーマが変わりやすいデータ"],
          ["キーバリュー / キャッシュ", <><Tech id="redis">Redis</Tech>・Memcached</>, "高速なキャッシュ・セッション・カウンタ"],
          ["ワイドカラム", "Cassandra・ScyllaDB", "大量書き込み・時系列"],
          ["全文検索", <><Tech id="elasticsearch">Elasticsearch</Tech>・OpenSearch・Meilisearch</>, "テキスト検索・ログ分析"],
          ["グラフ", "Neo4j", "人間関係・推薦などつながりの探索"],
          ["ベクトル", <><Tech id="pgvector">pgvector</Tech>・Pinecone・Qdrant</>, "AI/RAG の類似検索（埋め込み）"],
        ]}
      />
      <Callout variant="info" title="RDB と Redis は役割が違う">
        RDB は「消えたら困る真実の源」、Redis は「速くて消えてもよいキャッシュ」。同じ『データを持つ』でも性格が正反対で、実務では両方を組み合わせるのが定番です（詳しくはインフラ基礎の compose 記事も参照）。
      </Callout>

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>ほとんどのアプリ</strong> → PostgreSQL / MySQL（まず RDB）</li>
        <li><strong>軽量・組込み</strong> → SQLite</li>
        <li><strong>高速キャッシュ・セッション</strong> → Redis</li>
        <li><strong>全文検索・ログ分析</strong> → Elasticsearch 系</li>
        <li><strong>AI の類似検索</strong> → ベクトル DB（pgvector 等）</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "まず RDB(表・厳密) か NoSQL(柔軟) か。多くはまず RDB で始める",
          "RDB の第一候補は PostgreSQL、次いで MySQL。軽量なら SQLite",
          "Redis はキャッシュ/セッション、Elasticsearch は全文検索の定番",
          "AI/RAG の類似検索にはベクトルDB(pgvector 等)",
          "RDB(真実の源) と Redis(キャッシュ) は役割が違い、両方併用が定番",
        ]}
      />
    </>
  );
}

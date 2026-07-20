import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-data",
  title: "データ・データベース用語",
  description: "テーブル・カラム・レコード・クエリ・RDB/NoSQL・トランザクション・インデックス・スキーマ・DWH/ETLなど、データとデータベースの基本用語を収録。",
  domain: "it-terms",
  section: "data",
  order: 1,
  level: "intro",
  tags: ["データ", "データベース", "SQL"],
  updated: "2026-07-18",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        データを「保存する・取り出す・分析する」ときに出てくる用語です。まず表（テーブル）の構造、次に操作、最後に分析基盤の順に整理します。
      </Lead>

      <Section>データベースの基本構造</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["データベース", "Database", "決まった形式で整理されたデータの集まり"],
          ["RDB", "Relational Database", "行と列の表（テーブル）でデータを管理する方式"],
          ["RDBMS", "RDB Management System", "RDB を管理する専用ソフト。MySQL / PostgreSQL など"],
          ["NoSQL", "NoSQL", "表形式にとらわれない DB。文書型・KV型など。柔軟・大規模向き"],
          ["テーブル", "Table", "行と列からなる表。データの入れ物"],
          ["カラム", "Column", "表の「列」。項目（名前・メールなど）"],
          ["レコード / ロー", "Record / Row", "表の「行」。1件分のデータ"],
          ["フィールド", "Field", "行と列が交差する1つのデータ項目"],
          ["主キー / 外部キー", "Primary / Foreign Key", "行を一意に識別する列 / 別テーブルを参照する列"],
          ["スキーマ", "Schema", "データの構造・型を定義したもの（設計図）"],
        ]}
      />

      <Section>データの操作</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["SQL", "Structured Query Language", "RDB を操作するための専用言語"],
          ["クエリ", "Query", "データベースへの命令（抽出・更新など）"],
          ["CRUD", "Create/Read/Update/Delete", "作成・読み取り・更新・削除。データ操作の4基本"],
          ["JOIN", "Join", "複数テーブルを関連づけて結合し、まとめて取得すること"],
          ["インデックス", "Index", "検索を速くするための索引。本の索引と同じ発想"],
          ["トランザクション", "Transaction", "複数の処理を「全部やるか、全部取り消すか」でまとめる単位"],
          ["ロック", "Lock", "同時更新の衝突を防ぐため、データに一時的な鍵をかけること"],
          ["キャッシュ", "Cache", "よく使うデータを高速な場所に一時保存し、読み込みを速くする仕組み"],
          ["マイグレーション", "Migration", "DB の構造やデータを新しい形へ移行すること"],
          ["ORM", "Object-Relational Mapping", "DB の行を、プログラムのオブジェクトとして扱う仕組み"],
        ]}
      />

      <Section>データ分析・基盤</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["DWH", "Data Warehouse", "分析のために全社のデータを集約した大規模なデータベース"],
          ["データマート", "Data Mart", "特定の目的向けに絞って加工したデータベース"],
          ["ETL", "Extract/Transform/Load", "データを抽出・変換・書き込みする一連の処理"],
          ["データレイク", "Data Lake", "生データをそのまま大量に貯めておく保管場所"],
          ["BI ツール", "Business Intelligence", "データを可視化・分析して意思決定を助けるツール"],
          ["データマイニング", "Data Mining", "大量データから有益なパターンや知見を掘り出すこと"],
          ["バッチ / ストリーム", "Batch / Stream", "まとめて定期処理 / 発生した端から逐次処理"],
        ]}
      />

      <Section>もう一歩 — 専門用語</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["ACID", "ACID", "トランザクションが守る4性質（原子性・一貫性・分離性・永続性）"],
          ["分離レベル", "Isolation Level", "同時実行時にどこまで干渉を防ぐかの段階設定"],
          ["楽観 / 悲観ロック", "Optimistic / Pessimistic Lock", "更新時に衝突を確認 / 先に鍵をかけて待たせる"],
          ["デッドロック", "Deadlock", "互いに相手のロックを待ち続けて処理が止まる状態"],
          ["正規化 / 非正規化", "Normalization", "重複を排除して分割 / あえて重複を持たせ速度を優先"],
          ["レプリケーション", "Replication", "同じデータを複数の DB に複製して可用性・分散を高める"],
          ["シャーディング / パーティション", "Sharding / Partition", "データを分割して複数に分散 / 表を内部で分割して管理"],
          ["OLTP / OLAP", "OLTP / OLAP", "日々の取引処理向け / 集計・分析向けの処理方式"],
          ["ビュー / ストアドプロシージャ", "View / Stored Procedure", "仮想の表 / DB 内に保存した処理手続き"],
          ["ベクトル DB / 全文検索", "Vector DB / Full-text Search", "意味の近さで検索 / 文章中の語で検索する仕組み"],
          ["コネクションプール", "Connection Pool", "DB 接続を使い回して効率化する仕組み"],
          ["プレースホルダ", "Placeholder / Prepared Statement", "値を安全に埋め込み、SQL インジェクションを防ぐ書き方"],
        ]}
      />

      <Callout variant="info" title="仕組みから学ぶなら">
        RDB・SQL・トランザクション・インデックスは「Web基礎（バックエンド）」で、分析基盤や DWH は「技術スタック一覧（データ分析）」で詳しく扱っています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "構造: テーブル（表）＝カラム（列）×レコード（行）。スキーマ=設計図",
          "操作: SQL でクエリを投げる。CRUD が基本、JOIN で結合、インデックスで高速化",
          "安全: トランザクション=全部か無か、ロック=同時更新の衝突防止",
          "分析: DWH に集約 → ETL で整形 → BI ツールで可視化",
        ]}
      />
    </>
  );
}

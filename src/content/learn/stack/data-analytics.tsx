import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "data-analytics-stack",
  title: "データ分析 / データ基盤の技術スタック",
  description: "データを集めて分析するための代表スタック。データウェアハウス(BigQuery/Snowflake)、分析用DB(ClickHouse/DuckDB)、変換(dbt)、BI(Metabase)を俯瞰する。",
  domain: "stack",
  section: "data-analytics",
  order: 1,
  level: "basic",
  tags: ["BigQuery", "Snowflake", "dbt", "BI"],
  updated: "2026-07-09",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        アプリの DB は「日々の処理」向き、分析は「大量データの集計」向きで、得意なツールが違います。データを集める<strong>データウェアハウス</strong>、整える<strong>変換ツール</strong>、見せる<strong>BI</strong>——この流れで捉えます。
      </Lead>

      <Section>データウェアハウス（DWH）</Section>
      <ComparisonTable
        headers={["製品", "特徴"]}
        rows={[
          [<Tech id="bigquery">BigQuery</Tech>, "GCP のサーバーレス DWH。巨大データを SQL で高速集計"],
          [<Tech id="snowflake">Snowflake</Tech>, "マルチクラウドの DWH。計算とストレージを分離"],
        ]}
      />

      <Section>分析用データベース</Section>
      <ComparisonTable
        headers={["製品", "特徴"]}
        rows={[
          [<Tech id="clickhouse">ClickHouse</Tech>, "列指向で超高速。ログ・リアルタイム分析に強い"],
          [<Tech id="duckdb">DuckDB</Tech>, "『分析版 SQLite』。手元で CSV/Parquet を SQL 分析"],
        ]}
      />
      <Callout variant="info" title="トランザクション用DBとは別物">
        <Tech id="postgresql">PostgreSQL</Tech> などは日々の読み書き(トランザクション)向き、DWH や <Tech id="clickhouse">ClickHouse</Tech> は大量データの集計向き。役割が違うので、分析は分析用に切り出すのが定石です。
      </Callout>

      <Section>変換 と BI</Section>
      <ComparisonTable
        headers={["役割", "代表", "何をするか"]}
        rows={[
          ["変換(ELT)", <Tech id="dbt">dbt</Tech>, "DWH 内のデータを SQL で整備・モデル化"],
          ["オーケストレーション", <Tech id="airflow">Airflow</Tech>, "取り込み〜変換のパイプラインを自動化"],
          ["BI / 可視化", <Tech id="metabase">Metabase</Tech>, "ダッシュボードで可視化（Tableau・Looker も同種）"],
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "アプリDBは処理向き、分析は集計向きでツールが違う",
          "DWH は BigQuery(GCP) / Snowflake(マルチクラウド)",
          "分析用DBは ClickHouse(大規模) / DuckDB(手元)",
          "dbt で DWH のデータを整備、Airflow でパイプライン自動化",
          "可視化は Metabase/Tableau/Looker などの BI",
        ]}
      />
    </>
  );
}

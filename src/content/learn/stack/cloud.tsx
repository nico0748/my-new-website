import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "cloud-stack",
  title: "クラウドの技術スタック",
  description: "アプリを動かす基盤を借りるクラウドの代表スタック。AWS / Azure / GCP の三大クラウドと VPS の違い、IaaS/PaaS/サーバーレスの区分、代表サービスの対応表を俯瞰する。",
  domain: "stack",
  section: "cloud",
  order: 1,
  level: "basic",
  tags: ["クラウド", "AWS", "Azure", "GCP"],
  updated: "2026-07-09",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        クラウドは、サーバーやデータベースなどの<strong>基盤を必要な分だけ借りる</strong>仕組みです。まず「どこまで自分で管理するか（IaaS / PaaS / サーバーレス）」の区分を掴み、そのうえで三大クラウドと VPS を比較します。
      </Lead>

      <Section>管理範囲の区分</Section>
      <ComparisonTable
        headers={["区分", "借りるもの", "自分の管理範囲", "代表"]}
        rows={[
          ["VPS", "1台の仮想サーバー", "OS から上ぜんぶ（自由・要運用）", "さくらVPS・ConoHa・Oracle Cloud"],
          ["IaaS", "仮想マシン・ネットワーク", "OS から上", "EC2・Azure VM・Compute Engine"],
          ["PaaS", "実行環境まで", "アプリのコードだけ", "App Runner・App Service・Cloud Run"],
          ["サーバーレス（FaaS）", "関数の実行だけ", "関数のコードだけ（サーバー意識なし）", "Lambda・Azure Functions・Cloud Functions"],
        ]}
      />
      <Callout variant="info" title="下に行くほど『自由』、上に行くほど『楽』">
        VPS/IaaS は自由度が高い代わりに運用（更新・セキュリティ・監視）を自分で担います。PaaS/サーバーレスは運用を任せられる代わりに制約があります。学習は VPS で基盤を理解し、実務は要件に応じて選ぶ、が王道です。
      </Callout>

      <Section>三大クラウドの対応表</Section>
      <ComparisonTable
        headers={["カテゴリ", "AWS", "Azure", "GCP"]}
        rows={[
          ["仮想マシン", "EC2", "Virtual Machines", "Compute Engine"],
          ["コンテナ実行", "ECS / EKS", "AKS", "GKE / Cloud Run"],
          ["サーバーレス関数", "Lambda", "Functions", "Cloud Functions"],
          ["オブジェクト保存", "S3", "Blob Storage", "Cloud Storage"],
          ["マネージド RDB", "RDS / Aurora", "Azure SQL", "Cloud SQL"],
          ["CDN", "CloudFront", "Front Door / CDN", "Cloud CDN"],
        ]}
      />

      <Section>それぞれの持ち味</Section>
      <ComparisonTable
        headers={["プロバイダ", "特徴・強み"]}
        rows={[
          ["AWS", "サービス数・シェアが最大。情報も求人も豊富。迷ったら第一候補"],
          ["Azure", "Microsoft 製品（Windows・AD・Office）との統合。企業導入に強い"],
          ["GCP", "データ分析・ML（BigQuery 等）とコンテナ（GKE）に強み"],
          ["VPS", "月額固定で分かりやすく安い。1台を自分で運用する学習に最適"],
        ]}
      />

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>基盤を理解したい・小さく安く始める</strong> → VPS</li>
        <li><strong>実務で最も潰しが効く</strong> → AWS</li>
        <li><strong>Microsoft 環境・社内システム</strong> → Azure</li>
        <li><strong>データ分析・機械学習が中心</strong> → GCP</li>
        <li><strong>運用の手間を最小化</strong> → サーバーレス / PaaS（Cloud Run・App Service 等）</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "管理範囲で VPS / IaaS / PaaS / サーバーレス を区分。下ほど自由、上ほど楽",
          "三大クラウドは AWS(最大シェア)・Azure(MS 統合)・GCP(データ/ML)",
          "各社サービスは対応関係にある（EC2↔VM↔Compute Engine など）",
          "VPS は月額固定で安く、基盤を学ぶのに最適",
          "実務は AWS が無難、要件次第で Azure/GCP、運用軽減はサーバーレス",
        ]}
      />
    </>
  );
}

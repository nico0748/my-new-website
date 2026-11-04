import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-cloud",
  title: "クラウド用語",
  description: "パブリック/プライベートクラウド・責任共有モデル・FaaS・AWS(EC2/S3/Lambda)・Azure・Google Cloud の主要サービス・FinOps・マルチテナントなど、クラウドの基本用語を収録。",
  domain: "it-terms",
  section: "cloud",
  order: 1,
  level: "intro",
  tags: ["クラウド", "AWS", "SaaS"],
  updated: "2026-08-21",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        クラウドの用語は「どんな形態か」「どのサービスを使うか」「どう運用しコストを抑えるか」の3つに整理できます。サービス名は3大クラウド（AWS / Azure / Google Cloud）で呼び名が違うだけの同種のものが多く、対応づけて覚えると一気に楽になります。
      </Lead>

      <Section>クラウドの形態と考え方</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["パブリッククラウド", "Public Cloud", "事業者の設備を不特定多数で共有して使う一般的なクラウド"],
          ["プライベートクラウド", "Private Cloud", "自社専用に構築・占有するクラウド環境"],
          ["クラウドネイティブ", "Cloud Native", "最初からクラウド前提で、コンテナや自動スケールを活かす作り方"],
          ["リフト＆シフト", "Lift and Shift", "既存システムをほぼそのままクラウドへ移す移行方式"],
          ["クラウド移行", "Cloud Migration", "オンプレミスの資産をクラウドへ移す取り組み全体"],
          ["責任共有モデル", "Shared Responsibility Model", "事業者と利用者で守る範囲を分担する考え方。設定ミスは利用者責任"],
          ["ベンダーロックイン", "Vendor Lock-in", "特定事業者の仕組みに依存し、乗り換えが難しくなる状態"],
          ["FaaS", "Function as a Service", "関数単位でコードを預け、呼ばれたときだけ実行される形態"],
          ["BaaS / mBaaS", "Backend as a Service", "認証やDBなどバックエンド一式をサービスとして借りる形態"],
          ["CaaS（コンテナ as a Service）", "Container as a Service", "コンテナの実行基盤をサービスとして借りる形態"],
          ["DaaS（デスクトップ）", "Desktop as a Service", "仮想デスクトップをクラウドから配信する形態"],
          ["XaaS", "Anything as a Service", "あらゆるものをサービスとして提供する潮流の総称"],
          ["エッジコンピューティング", "Edge Computing", "利用者に近い場所で処理し、遅延と通信量を減らす方式"],
          ["マネージドサービス", "Managed Service", "運用（バックアップ・パッチ・冗長化）を事業者が担うサービス"],
          ["フルマネージド / セルフマネージド", "Fully / Self Managed", "運用をすべて任せる / 自分で面倒を見る"],
        ]}
      />

      <Section>AWS の主要サービス</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["AWS", "Amazon Web Services", "Amazon が提供する最大手のクラウドサービス群"],
          ["EC2", "Elastic Compute Cloud", "仮想サーバーを立てて使う、AWS の基本の計算サービス"],
          ["S3", "Simple Storage Service", "ファイルを大量に置けるオブジェクトストレージ"],
          ["EBS", "Elastic Block Store", "EC2 に接続して使う、ディスクのようなブロックストレージ"],
          ["RDS", "Relational Database Service", "MySQL や PostgreSQL を運用込みで借りられるマネージド DB"],
          ["DynamoDB", "DynamoDB", "AWS のマネージド NoSQL（キーバリュー型）データベース"],
          ["Lambda", "AWS Lambda", "サーバーを持たずに関数を実行できる、AWS の FaaS"],
          ["IAM", "Identity and Access Management", "誰が何をしてよいかを定義する、権限管理の中核サービス"],
          ["IAM ロール / IAM ポリシー", "IAM Role / Policy", "一時的に権限を借りる仕組み / 何を許すかを書いた定義"],
          ["セキュリティグループ", "Security Group", "インスタンス単位で通信を許可・拒否する仮想ファイアウォール"],
          ["サービスアカウント", "Service Account", "人ではなくプログラムに割り当てる、権限を持つアカウント"],
          ["CloudFront", "CloudFront", "AWS の CDN。世界各地にコンテンツを配信する"],
          ["Route 53", "Route 53", "AWS の DNS サービス。名前解決とルーティングを担う"],
          ["ELB / ALB", "Elastic / Application Load Balancer", "AWS のロードバランサ。複数サーバーへ通信を振り分ける。HTTP 向けが ALB"],
          ["ECS / EKS", "Elastic Container Service / Kubernetes Service", "AWS のコンテナ実行基盤 / マネージド Kubernetes"],
          ["CloudWatch", "CloudWatch", "AWS の監視サービス。メトリクス・ログ・アラームを扱う"],
          ["CloudFormation", "CloudFormation", "AWS 構成をテンプレートで管理する IaC サービス"],
          ["SQS / SNS", "Simple Queue / Notification Service", "AWS のメッセージキュー / 通知配信サービス"],
          ["API Gateway", "Amazon API Gateway", "API の受け口を作り、認証・流量制御・転送をまとめて担う"],
        ]}
      />

      <Section>Azure と Google Cloud</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["Microsoft Azure", "Azure", "Microsoft のクラウド。企業向け製品との連携が強い"],
          ["Azure Virtual Machines", "Azure VM", "Azure の仮想サーバー。AWS の EC2 に相当"],
          ["Azure Blob Storage", "Blob Storage", "Azure のオブジェクトストレージ。S3 に相当"],
          ["Azure Functions", "Azure Functions", "Azure の FaaS。Lambda に相当"],
          ["Microsoft Entra ID", "Entra ID", "Microsoft の ID 基盤（旧 Azure Active Directory）"],
          ["Google Cloud（GCP）", "Google Cloud Platform", "Google のクラウド。データ分析と機械学習に強み"],
          ["Compute Engine", "Compute Engine", "Google Cloud の仮想サーバー。EC2 に相当"],
          ["Cloud Storage", "Cloud Storage", "Google Cloud のオブジェクトストレージ。S3 に相当"],
          ["BigQuery", "BigQuery", "巨大データを高速に集計できる Google Cloud のデータウェアハウス"],
          ["Cloud Run", "Cloud Run", "コンテナをリクエスト単位で動かす Google Cloud のサーバーレス実行環境"],
          ["GKE", "Google Kubernetes Engine", "Google Cloud のマネージド Kubernetes"],
          ["Firebase", "Firebase", "認証・DB・ホスティングをまとめて使える Google の BaaS"],
        ]}
      />

      <Section>運用・コスト・組織</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["オンデマンド", "On-demand", "使った分だけ都度課金される、標準の利用形態"],
          ["リザーブドインスタンス", "Reserved Instance / Savings Plans", "長期利用を約束して割引を受ける契約形態"],
          ["スポットインスタンス", "Spot Instance", "空き容量を安く使えるが、途中で回収されうる形態"],
          ["FinOps", "FinOps", "クラウド費用を可視化し、開発と経理が協力して最適化する取り組み"],
          ["コスト最適化", "Cost Optimization", "不要資源の停止や適正サイズ化で費用を下げること"],
          ["タグ付け", "Tagging", "資源にラベルを付け、費用や所有者を分類・集計できるようにすること"],
          ["クォータ", "Quota / Service Limit", "アカウントごとに決まった利用上限。緩和申請で引き上げる"],
          ["コントロールプレーン / データプレーン", "Control / Data Plane", "設定や制御を担う層 / 実際の通信・処理を担う層"],
          ["マルチテナント / シングルテナント", "Multi / Single Tenant", "複数利用者で基盤を共有 / 利用者ごとに専有"],
          ["ゾーン冗長 / リージョン冗長", "Zonal / Regional Redundancy", "同一地域内で分散 / 地域をまたいで分散し災害に備える"],
          ["データレジデンシー", "Data Residency", "データを置く国・地域の制約。法規制で指定されることがある"],
          ["CSPM", "Cloud Security Posture Management", "クラウド設定の危険な状態を継続的に検出・是正する仕組み"],
          ["課金アラート", "Billing Alert", "費用が閾値を超えたら通知する設定。事故的な高額請求を防ぐ"],
          ["ランディングゾーン", "Landing Zone", "アカウント構成や権限・監査の初期設計をひな形化したもの"],
          ["Vercel / Netlify", "Vercel / Netlify", "Git 連携でフロントエンドを自動デプロイできるホスティングサービス"],
          ["Cloudflare Workers", "Cloudflare Workers", "世界中のエッジで JavaScript を実行できるサーバーレス基盤"],
        ]}
      />

      <Callout variant="info" title="手を動かして学ぶなら">
        仮想化・コンテナ・IaC の仕組みは「インフラ・クラウド・仮想化用語」と「インフラ基礎」コース、サービスの選び方は「技術スタック一覧（クラウド / ホスティング）」で扱っています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "形態は IaaS / PaaS / SaaS ＋ FaaS。任せる範囲が広いほど運用は楽、自由度は下がる",
          "責任共有モデル: 事業者はクラウド「の」セキュリティ、利用者はクラウド「内」の設定に責任",
          "3大クラウドは対応関係で覚える（EC2 ≒ Azure VM ≒ Compute Engine、S3 ≒ Blob ≒ Cloud Storage）",
          "コストは設計で決まる。タグ付け・課金アラート・リザーブド/スポットの使い分けが基本",
        ]}
      />
    </>
  );
}

/** 関連語マップ（検索パレットの関連語チップ用。本文には表示されない）。 */
export const RELATED: Record<string, string[]> = {
  "パブリッククラウド": ["プライベートクラウド", "クラウド", "マルチクラウド / ハイブリッドクラウド"],
  "プライベートクラウド": ["パブリッククラウド", "オンプレミス", "仮想化"],
  "クラウドネイティブ": ["コンテナ", "マイクロサービス", "サーバーレス"],
  "リフト＆シフト": ["クラウド移行", "オンプレミス", "仮想マシン"],
  "クラウド移行": ["リフト＆シフト", "オンプレミス", "クラウドネイティブ"],
  "責任共有モデル": ["CSPM", "IAM", "クラウド"],
  "ベンダーロックイン": ["マルチクラウド / ハイブリッドクラウド", "オープンソース", "コンテナ"],
  "FaaS": ["サーバーレス", "Lambda", "Azure Functions"],
  "BaaS / mBaaS": ["Firebase", "SaaS", "FaaS"],
  "CaaS（コンテナ as a Service）": ["コンテナ", "ECS / EKS", "Cloud Run"],
  "DaaS（デスクトップ）": ["シンクライアント", "仮想化", "SaaS"],
  "XaaS": ["IaaS", "PaaS", "SaaS"],
  "エッジコンピューティング": ["CDN", "レイテンシ", "IoT"],
  "マネージドサービス": ["フルマネージド / セルフマネージド", "RDS", "クラウド"],
  "フルマネージド / セルフマネージド": ["マネージドサービス", "保守・運用フェーズ", "オンプレミス"],
  "AWS": ["EC2", "S3", "Microsoft Azure", "Google Cloud（GCP）"],
  "EC2": ["インスタンス", "Azure Virtual Machines", "Compute Engine"],
  "S3": ["Azure Blob Storage", "Cloud Storage", "ストレージ"],
  "EBS": ["S3", "ボリューム / マウント", "ストレージ"],
  "RDS": ["RDBMS", "DynamoDB", "マネージドサービス"],
  "DynamoDB": ["NoSQL", "RDS", "KVS"],
  "Lambda": ["FaaS", "サーバーレス", "Azure Functions"],
  "IAM": ["認証 / 認可", "最小権限の原則", "責任共有モデル"],
  "CloudFront": ["CDN", "Route 53", "S3"],
  "Route 53": ["DNS", "名前解決", "CloudFront"],
  "ELB / ALB": ["ロードバランサ", "ロードバランシング", "オートスケーリング"],
  "ECS / EKS": ["Kubernetes（K8s）", "コンテナ", "GKE"],
  "CloudWatch": ["モニタリング", "オブザーバビリティ", "アラート / 閾値"],
  "CloudFormation": ["IaC", "プロビジョニング", "ランディングゾーン"],
  "SQS / SNS": ["メッセージキュー", "Pub/Sub", "イベント駆動アーキテクチャ"],
  "API Gateway": ["API", "レートリミット", "BFF"],
  "Microsoft Azure": ["AWS", "Google Cloud（GCP）", "Microsoft Entra ID"],
  "Azure Virtual Machines": ["EC2", "Compute Engine", "仮想マシン"],
  "Azure Blob Storage": ["S3", "Cloud Storage", "ストレージ"],
  "Azure Functions": ["Lambda", "FaaS", "サーバーレス"],
  "Microsoft Entra ID": ["シングルサインオン", "IDaaS", "IAM"],
  "Google Cloud（GCP）": ["AWS", "Microsoft Azure", "BigQuery"],
  "Compute Engine": ["EC2", "Azure Virtual Machines", "仮想マシン"],
  "Cloud Storage": ["S3", "Azure Blob Storage", "ストレージ"],
  "BigQuery": ["DWH", "データレイク", "OLTP / OLAP"],
  "Cloud Run": ["サーバーレス", "コンテナ", "CaaS（コンテナ as a Service）"],
  "GKE": ["Kubernetes（K8s）", "ECS / EKS", "コンテナ"],
  "Firebase": ["BaaS / mBaaS", "認証 / 認可", "PaaS"],
  "オンデマンド": ["従量課金", "リザーブドインスタンス", "スポットインスタンス"],
  "リザーブドインスタンス": ["オンデマンド", "スポットインスタンス", "コスト最適化"],
  "スポットインスタンス": ["オンデマンド", "リザーブドインスタンス", "オートスケーリング"],
  "FinOps": ["コスト最適化", "課金アラート", "タグ付け"],
  "コスト最適化": ["FinOps", "オートスケーリング", "リザーブドインスタンス"],
  "タグ付け": ["FinOps", "コスト最適化", "ランディングゾーン"],
  "クォータ": ["レートリミット", "オートスケーリング", "キャパシティ"],
  "コントロールプレーン / データプレーン": ["Kubernetes（K8s）", "サービスメッシュ", "ロードバランサ"],
  "マルチテナント / シングルテナント": ["SaaS", "パブリッククラウド", "VPC"],
  "ゾーン冗長 / リージョン冗長": ["リージョン / AZ", "冗長化", "フェイルオーバー"],
  "データレジデンシー": ["コンプライアンス", "個人情報保護法", "リージョン / AZ"],
  "CSPM": ["責任共有モデル", "DevSecOps / シフトレフト", "IAM"],
  "課金アラート": ["FinOps", "コスト最適化", "アラート / 閾値"],
  "ランディングゾーン": ["IaC", "IAM", "タグ付け"],
  "IAM ロール / IAM ポリシー": ["IAM", "最小権限の原則", "サービスアカウント"],
  "セキュリティグループ": ["ファイアウォール", "VPC", "IAM"],
  "サービスアカウント": ["IAM ロール / IAM ポリシー", "IAM", "API キー / ベアラートークン"],
  "Vercel / Netlify": ["PaaS", "Cloudflare Workers", "SSG / ISR"],
  "Cloudflare Workers": ["エッジコンピューティング", "FaaS", "Vercel / Netlify"],
};

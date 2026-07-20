import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-infra",
  title: "インフラ・クラウド・仮想化用語",
  description: "サーバー・インスタンス・仮想化・コンテナ・スケールアウト/アップ・冗長化・可用性・IaaS/PaaS/SaaS・プロビジョニングなど、インフラとクラウドの基本用語を収録。",
  domain: "it-terms",
  section: "infra",
  order: 1,
  level: "intro",
  tags: ["インフラ", "クラウド", "仮想化"],
  updated: "2026-07-18",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        アプリを「どこで・どう動かすか」に関する用語です。物理サーバーから仮想化・コンテナ・クラウドへと、抽象度が上がっていく流れで整理します。
      </Lead>

      <Section>サーバーと仮想化</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["サーバー", "Server", "サービスやデータを提供する側のコンピュータ"],
          ["オンプレミス", "On-Premises", "自社で物理的な機器を持って運用する形態（クラウドの対義）"],
          ["仮想化", "Virtualization", "1台の物理資源を論理的に分割/集約し、柔軟に扱う技術"],
          ["仮想マシン", "Virtual Machine (VM)", "仮想化で作った、独立した OS を持つ仮想のコンピュータ"],
          ["ハイパーバイザ", "Hypervisor", "1台の上で複数の仮想マシンを動かす基盤ソフト"],
          ["インスタンス", "Instance", "クラウド上で起動した1台分の仮想サーバー"],
          ["コンテナ", "Container", "アプリと動作環境をまとめて軽量に隔離する仕組み。Docker が代表"],
          ["オーケストレーション", "Orchestration", "多数のコンテナの配置・管理を自動化すること。Kubernetes が代表"],
          ["イメージ", "Image", "コンテナや仮想マシンを起動するための雛形（テンプレート）"],
        ]}
      />

      <Section>クラウドのサービス形態</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["クラウド", "Cloud", "インターネット経由で計算資源やサービスを借りて使う形態"],
          ["IaaS", "Infrastructure as a Service", "サーバーやストレージなどのインフラを借りる形態"],
          ["PaaS", "Platform as a Service", "OS や実行環境まで用意された、開発の土台を借りる形態"],
          ["SaaS", "Software as a Service", "完成したソフトをネット経由で使う形態。Gmail など"],
          ["サーバーレス", "Serverless", "サーバー管理を意識せず、コードの実行だけに集中できる形態"],
          ["プロビジョニング", "Provisioning", "必要な資源を用意し、使える状態に割り当てること"],
          ["リージョン / AZ", "Region / Availability Zone", "クラウドの地理的な地域 / その中の独立した設備単位"],
        ]}
      />

      <Section>拡張性・信頼性</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["スケールアウト / イン", "Scale Out / In", "サーバーの台数を増やす / 減らして処理能力を調整する"],
          ["スケールアップ / ダウン", "Scale Up / Down", "1台の性能（CPU・メモリ）を上げる / 下げる"],
          ["冗長化", "Redundancy", "予備を用意し、一部が壊れても止まらないようにすること"],
          ["可用性", "Availability", "システムが停止せず使い続けられる度合い"],
          ["フェイルオーバー", "Failover", "障害時に待機系へ自動で切り替えること"],
          ["ロードバランシング", "Load Balancing", "処理を複数サーバーに分散して負荷を平準化すること"],
          ["キャパシティ", "Capacity", "処理・保存できる容量の上限"],
          ["ミドルウェア", "Middleware", "OS とアプリの間で働くソフト。Web サーバー・DB など"],
        ]}
      />

      <Section>コンテナ・オーケストレーション</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["Dockerfile", "Dockerfile", "コンテナイメージの作り方を書いた手順書"],
          ["レジストリ", "Registry", "コンテナイメージを保管・配布する場所（Docker Hub など）"],
          ["ボリューム / マウント", "Volume / Mount", "コンテナ外にデータを保存する領域 / それを結び付けること"],
          ["Kubernetes（K8s）", "Kubernetes", "多数のコンテナの配置・自動復旧・拡張を管理する基盤"],
          ["Pod / ノード / クラスタ", "Pod / Node / Cluster", "コンテナの最小単位 / 動かすサーバー / それらの集まり"],
          ["ヘルスチェック", "Health Check", "サービスが正常かを定期的に確認する仕組み"],
          ["リバースプロキシ", "Reverse Proxy", "外からの通信を受け、内部のサービスへ振り分ける中継（nginx など）"],
        ]}
      />

      <Section>CI/CD・自動化・運用</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["CI / CD", "Continuous Integration / Delivery", "変更を自動でテスト・統合 / 自動でリリースまで届ける仕組み"],
          ["パイプライン", "Pipeline", "ビルド→テスト→デプロイを自動でつなげた一連の流れ"],
          ["IaC", "Infrastructure as Code", "インフラの構成をコードで管理する手法（Terraform / Ansible）"],
          ["デプロイ戦略", "Blue-Green / Canary / Rolling", "無停止で切り替える / 一部に先行公開 / 順番に入れ替える"],
          ["オートスケーリング", "Auto Scaling", "負荷に応じてサーバー数を自動で増減させる仕組み"],
          ["systemd / デーモン", "systemd / Daemon", "サービスを常駐起動・管理する仕組み / 常駐プロセス"],
          ["cron", "cron", "決まった時刻に処理を自動実行する仕組み"],
          ["オブザーバビリティ", "Observability", "メトリクス・ログ・トレースでシステムの状態を可視化すること"],
          ["SLA / SLO / SLI", "SLA / SLO / SLI", "品質保証の約束 / 目標値 / 実測指標"],
          ["SRE", "Site Reliability Engineering", "信頼性をエンジニアリングで支える運用の考え方"],
        ]}
      />

      <Callout variant="info" title="運用の実際を学ぶなら">
        Linux・コンテナ・クラウド・スケーリング・冗長化は「インフラ基礎」コースで、Docker / Kubernetes / Terraform などの具体的な技術は「技術スタック一覧」で扱っています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "抽象度: 物理サーバー → 仮想マシン → コンテナ → サーバーレス と管理の手間が減る",
          "クラウド形態: IaaS=インフラ、PaaS=土台、SaaS=完成品を借りる",
          "スケール: アウト/イン=台数、アップ/ダウン=1台の性能",
          "信頼性: 冗長化＋フェイルオーバーで可用性（止まらなさ）を高める",
        ]}
      />
    </>
  );
}

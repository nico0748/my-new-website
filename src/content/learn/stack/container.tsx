import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Cmd, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "container-stack",
  title: "Docker / コンテナの技術スタック",
  description: "アプリを環境ごと箱に固めるコンテナのスタック。Docker とその周辺ツール、compose・オーケストレーション、そして nginx・Redis・PostgreSQL など『部品として使う定番イメージ』を俯瞰する。",
  domain: "stack",
  section: "container",
  order: 1,
  level: "basic",
  tags: ["Docker", "コンテナ", "nginx", "Redis"],
  updated: "2026-07-09",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        コンテナは、アプリと実行環境を<strong>1つの箱（イメージ）に固めて</strong>どこでも同じに動かす技術です。中心は Docker ですが、実際のスタックは「土台のランタイム」「束ねる仕組み」「部品として借りる定番イメージ」の3層で捉えると見通しが良くなります。
      </Lead>

      <Section>ランタイムと基本ツール</Section>
      <ComparisonTable
        headers={["ツール", "役割"]}
        rows={[
          ["Docker", "コンテナを作る・動かす標準ツール（イメージ / コンテナ / build）"],
          ["containerd / runc", "Docker の下で実際にコンテナを動かす下位ランタイム"],
          ["Podman", "デーモン不要・rootless が得意な Docker 互換ツール"],
          ["BuildKit / buildx", "高速・マルチプラットフォームなイメージビルド"],
        ]}
      />
      <Callout variant="info" title="標準化されているから移植できる">
        イメージやランタイムの仕様は <strong>OCI（Open Container Initiative）</strong>で標準化されています。だから Docker で作ったイメージは Podman でも Kubernetes でも動きます。ツールは違っても中身は互換、と捉えると安心です。
      </Callout>

      <Section>束ねる仕組み（オーケストレーション）</Section>
      <ComparisonTable
        headers={["ツール", "規模", "特徴"]}
        rows={[
          ["Docker Compose", "1台のサーバー", "複数コンテナを1枚の YAML で宣言的に束ねる。個人〜小規模の定番"],
          ["Kubernetes (k8s)", "多数のサーバー", "大量のコンテナを自動でスケール・配置・自己修復。大規模向け"],
          ["マネージド k8s / PaaS", "クラウド", "EKS・GKE・AKS や、より手軽な Cloud Run・ECS など"],
        ]}
      />
      <Callout variant="tip" title="1台なら compose で十分">
        「1台の VPS で数サービス」なら Docker Compose が十分かつ最適です。Kubernetes は大規模スケールが必要になってからで問題ありません（インフラ基礎コースでも同じ方針です）。
      </Callout>

      <Section>部品として使う定番イメージ</Section>
      <p>
        コンテナ開発では、自作アプリだけでなく<strong>出来合いの公式イメージを部品として組み合わせ</strong>ます。<Cmd>nginx</Cmd> や <Cmd>redis</Cmd> がまさにそれです。
      </p>
      <ComparisonTable
        headers={["イメージ", "役割"]}
        rows={[
          ["nginx", "Web サーバー / リバースプロキシ（入口の振り分け役）"],
          ["redis", "キャッシュ・セッション・カウンタ（高速なキーバリュー）"],
          ["postgres / mysql", "リレーショナルデータベース（永続データ）"],
          ["node / python / golang", "アプリの実行環境ベース（自作イメージの土台）"],
          ["traefik / caddy", "自動 HTTPS 対応のリバースプロキシ"],
          ["grafana / prometheus", "監視・メトリクスの可視化"],
        ]}
      />

      <Section>典型的な構成イメージ</Section>
      <ul>
        <li><strong>入口</strong>：nginx（リバースプロキシ）</li>
        <li><strong>アプリ</strong>：自作イメージ（Node / Python / Go 等）</li>
        <li><strong>データ</strong>：PostgreSQL（永続）＋ Redis（キャッシュ）</li>
        <li>これらを <Cmd>docker compose up</Cmd> 一発で束ねて起動する</li>
      </ul>
      <Callout variant="info" title="詳しくはインフラ基礎コースへ">
        Docker のイメージ/コンテナの仕組み、Dockerfile、compose での複数サービス構築は、本サイトの<strong>インフラ基礎コース「コンテナ」章</strong>で手を動かしながら学べます。ここではスタックの地図として俯瞰しました。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "コンテナは『ランタイム / 束ねる仕組み / 定番イメージ』の3層で捉える",
          "中心は Docker。仕様は OCI で標準化され、ツールが違っても互換",
          "束ね方は 1台=Compose、大規模=Kubernetes。1台なら compose で十分",
          "nginx(入口)・redis(キャッシュ)・postgres(DB)を部品として組み合わせる",
          "典型構成は nginx + 自作アプリ + PostgreSQL + Redis を compose で起動",
        ]}
      />
    </>
  );
}

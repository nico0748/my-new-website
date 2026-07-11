import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "cicd-stack",
  title: "CI/CD・IaC の技術スタック",
  description: "テスト〜デプロイを自動化する CI/CD と、インフラをコードで管理する IaC の代表スタック。GitHub Actions・Terraform・Ansible・ArgoCD などを俯瞰する。",
  domain: "stack",
  section: "cicd",
  order: 1,
  level: "basic",
  tags: ["CI/CD", "GitHub Actions", "Terraform", "IaC"],
  updated: "2026-07-09",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        コードを書いた後の「テスト → ビルド → デプロイ」を自動化するのが <strong>CI/CD</strong>、サーバーやクラウドの構成をコードで再現可能にするのが <strong>IaC</strong> です。手作業と属人化をなくし、変更を安全に速く届けます。
      </Lead>

      <Section>CI/CD（自動化パイプライン）</Section>
      <ComparisonTable
        headers={["ツール", "特徴", "向いている場面"]}
        rows={[
          [<Tech id="github-actions">GitHub Actions</Tech>, "GitHub 統合・既製アクション豊富", "GitHub を使うなら第一候補"],
          [<Tech id="gitlab-ci">GitLab CI</Tech>, "GitLab 統合・自己ホスト可", "GitLab 組織・オンプレ"],
          [<Tech id="circleci">CircleCI</Tech>, "独立系クラウド CI", "ホスティング非依存の CI"],
          [<Tech id="jenkins">Jenkins</Tech>, "自己ホスト・プラグイン豊富", "オンプレ・厳密な制御"],
        ]}
      />
      <Callout variant="tip" title="まず GitHub Actions">
        GitHub を使っているなら <Tech id="github-actions">GitHub Actions</Tech> が最も手軽です。<Tech id="jenkins">Jenkins</Tech> はオンプレや細かい制御が要る大規模組織で今も現役です。
      </Callout>

      <Section>IaC（インフラのコード化）</Section>
      <ComparisonTable
        headers={["ツール", "得意なこと", "備考"]}
        rows={[
          [<Tech id="terraform">Terraform</Tech>, "クラウドインフラの構築", "マルチクラウド対応の定番。HCL で記述"],
          [<Tech id="pulumi">Pulumi</Tech>, "汎用言語で IaC", "TypeScript/Python で書ける"],
          [<Tech id="ansible">Ansible</Tech>, "サーバーの構成管理", "エージェント不要・SSH 経由"],
          [<Tech id="cloudformation">CloudFormation</Tech>, "AWS 専用の IaC", "AWS に特化"],
        ]}
      />
      <Callout variant="info" title="作る(Terraform) と 設定する(Ansible)">
        <Tech id="terraform">Terraform</Tech> は「インフラを作る」、<Tech id="ansible">Ansible</Tech> は「作ったサーバーを設定する」のが得意。役割が違うので併用されることも多いです。
      </Callout>

      <Section>GitOps</Section>
      <p>
        <Tech id="argocd">ArgoCD</Tech> は、Git リポジトリの状態を正として <Tech id="kubernetes">Kubernetes</Tech> に自動デプロイする GitOps ツールです。CI でビルドし、ArgoCD で宣言的にデプロイ、という組み合わせが定番です。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "CI/CD はテスト〜デプロイを自動化。GitHub なら GitHub Actions が手軽",
          "自己ホスト・大規模制御は GitLab CI / Jenkins",
          "IaC はインフラをコード化。定番は Terraform(マルチクラウド)",
          "Terraform=作る、Ansible=設定する、で役割が分かれる",
          "Kubernetes への継続デプロイは ArgoCD(GitOps)",
        ]}
      />
    </>
  );
}

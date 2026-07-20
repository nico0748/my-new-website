import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider, Figure } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "observability-stack",
  title: "監視・可観測性の技術スタック",
  description: "本番運用を支える監視の代表スタック。メトリクス・ログ・トレースの3本柱を捉え、Datadog・Sentry・Grafana/Prometheus・OpenTelemetry を俯瞰する。",
  domain: "stack",
  section: "observability",
  order: 1,
  level: "basic",
  tags: ["監視", "Datadog", "Sentry", "OpenTelemetry"],
  updated: "2026-07-09",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        作って動かした後に必要なのが<strong>可観測性</strong>——「何が起きているか」を把握する力です。<strong>メトリクス・ログ・トレース</strong>の3本柱を、どのツールで集めて見るかがこの章の地図です。
      </Lead>

      <Section>可観測性の3本柱</Section>
      <ComparisonTable
        headers={["柱", "何を見るか"]}
        rows={[
          ["メトリクス", "CPU・メモリ・リクエスト数などの数値"],
          ["ログ", "アプリが出力するイベントの記録"],
          ["トレース", "リクエストがどのサービスをどう通ったか"],
        ]}
      />

      <Section>代表ツール</Section>
      <ComparisonTable
        headers={["ツール", "形態", "得意"]}
        rows={[
          [<Tech id="datadog">Datadog</Tech>, "SaaS", "メトリクス/ログ/トレースを統合監視"],
          [<Tech id="sentry">Sentry</Tech>, "SaaS", "エラー・例外の追跡（発生箇所の特定）"],
          [<Tech id="newrelic">New Relic</Tech>, "SaaS", "アプリ性能監視(APM)"],
          [<><Tech id="prometheus">Prometheus</Tech> + <Tech id="grafana">Grafana</Tech></>, "OSS", "メトリクス収集(Prometheus)＋可視化(Grafana)"],
          [<Tech id="opentelemetry">OpenTelemetry</Tech>, "標準規格", "ベンダー中立な計装。収集先を選べる"],
        ]}
      />
      <Figure
        src="/learn/shots/stack/observability-stack-01.svg"
        alt="Grafana のダッシュボード。Prometheus のメトリクスが折れ線グラフで並んでいる"
        caption="メトリクスを見るとは、実際にはこうしたグラフの壁を眺めること"
      />
      <Figure
        src="/learn/shots/stack/observability-stack-02.svg"
        alt="Sentry のエラー詳細画面。スタックトレースと発生回数・影響ユーザー数が表示されている"
        caption="エラー追跡ツールは「どのコード行で・何人に」起きたかまで教えてくれる"
      />
      <Callout variant="info" title="OpenTelemetry でロックインを避ける">
        <Tech id="opentelemetry">OpenTelemetry</Tech> で標準的に計装しておくと、収集先（Datadog など）を後から乗り換えても計装コードを再利用できます。特定ツールへの依存を避けたいときに有効です。
      </Callout>
      <Callout variant="tip" title="まず Sentry から">
        小さく始めるなら、まず <Tech id="sentry">Sentry</Tech> でエラー監視を入れるのが費用対効果が高いです。規模が大きくなったら <Tech id="datadog">Datadog</Tech> 等で統合監視へ広げます。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "可観測性はメトリクス・ログ・トレースの3本柱",
          "統合監視 SaaS は Datadog / New Relic",
          "エラー追跡は Sentry が手軽で効果的",
          "OSS 構成は Prometheus(収集)+Grafana(可視化)",
          "OpenTelemetry で計装を標準化しロックインを回避",
        ]}
      />
    </>
  );
}

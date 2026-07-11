import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "hosting-stack",
  title: "ホスティング / デプロイ先の技術スタック",
  description: "作ったアプリを『どこに載せるか』の地図。フロント向き PaaS(Vercel/Netlify)、汎用 PaaS(Render/Railway/Fly.io)、エッジ(Cloudflare)を俯瞰する。",
  domain: "stack",
  section: "hosting",
  order: 1,
  level: "intro",
  tags: ["ホスティング", "Vercel", "Cloudflare", "PaaS"],
  updated: "2026-07-09",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        コードが完成したら「どこに載せて公開するか」を決めます。自分でサーバーを運用する（前章のクラウド/VPS）代わりに、<strong>PaaS やエッジ基盤に任せる</strong>と、デプロイと運用が一気に楽になります。
      </Lead>

      <Section>フロントエンド向き（Jamstack / エッジ）</Section>
      <ComparisonTable
        headers={["サービス", "特徴"]}
        rows={[
          [<Tech id="vercel">Vercel</Tech>, "Next.js に最適化。git push で自動デプロイ・プレビュー"],
          [<Tech id="netlify">Netlify</Tech>, "静的サイト/Jamstack の定番。ビルド・関数・フォーム"],
          [<Tech id="cloudflare">Cloudflare</Tech>, "エッジ配信・Workers・DDoS 対策。低遅延なグローバル配信"],
        ]}
      />

      <Section>汎用 PaaS（バックエンド込み）</Section>
      <ComparisonTable
        headers={["サービス", "特徴"]}
        rows={[
          [<Tech id="render">Render</Tech>, "アプリ/DB/ワーカーをまとめてデプロイ。Heroku の後継的存在"],
          [<Tech id="railway">Railway</Tech>, "数クリックでデプロイ。個人開発・試作向き"],
          [<Tech id="flyio">Fly.io</Tech>, "ユーザーに近いエッジでアプリを実行"],
          [<Tech id="heroku">Heroku</Tech>, "PaaS の草分け。git push で即デプロイ"],
        ]}
      />
      <Callout variant="tip" title="選び方">
        フロント（特に <Tech id="nextjs">Next.js</Tech>）は <Tech id="vercel">Vercel</Tech>、バックエンド込みで手軽に出すなら <Tech id="render">Render</Tech> / <Tech id="railway">Railway</Tech>、低遅延なグローバル配信やエッジ処理は <Tech id="cloudflare">Cloudflare</Tech> が目安です。
      </Callout>
      <Callout variant="info" title="PaaS と自前運用の使い分け">
        手軽さなら PaaS、細かい制御やコストなら自前の <Tech id="vps">VPS</Tech> / <Tech id="aws">AWS</Tech>。学習は VPS で基盤を理解し、実務は要件で選ぶのが王道です（クラウドの章も参照）。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "『どこに載せるか』は PaaS/エッジに任せると運用が楽",
          "フロントは Vercel(Next.js) / Netlify(静的)",
          "エッジ配信・Workers は Cloudflare",
          "バックエンド込みは Render / Railway / Fly.io / Heroku",
          "手軽さ=PaaS、制御・コスト=自前 VPS/AWS で使い分け",
        ]}
      />
    </>
  );
}

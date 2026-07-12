import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Cmd, KVList, ComparisonTable } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-basics",
  title: "Claude Code 基礎",
  description: "Claude Code の基本的な使い方から拡張機能までを段階的に学ぶセクションの概要。目標学習時間・受講者向けの進め方・カリキュラム全体像。",
  domain: "dev",
  section: "claude-code",
  order: 1,
  level: "intro",
  tags: ["Claude Code", "AI", "開発ツール"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>（目標学習時間：12〜16時間）</Lead>

      <p>このセクションでは、Claude Code の基本的な使い方から拡張機能までを段階的に学びます。</p>
      <p>
        Claude Code は ターミナルで動くエージェント型 AI コーディングアシスタントです。コードを書くだけでなく、
        ファイル検索・コマンド実行・ドキュメント作成・デバッグまで、ターミナルからできることなら何でも手伝ってくれます。
        研修を進める上で、また入社後の業務でも非常に強力な相棒になります。
      </p>

      <Section>受講者の皆さんへ</Section>
      <KVList
        items={[
          {
            key: "エンジニア志望",
            val: "全章を順番に進めてください。④拡張機能編は今後の研修課題で実際に使います。手を動かして、自分なりの CLAUDE.md や Skills を育てていきましょう。",
          },
          {
            key: "営業志望",
            val: "①〜③までを必ず完了させ、④以降は概要を掴むことを心がけてください。Claude Code を使って研修課題を効率よく進めるための基礎が身につきます。",
          },
        ]}
      />

      <Section>進め方</Section>
      <p>
        下のデータベースを 「学習順（既定）」 ビューで開いて、上から順番に進めてください。各ページには以下が含まれます。
      </p>
      <ul>
        <li>学習目標</li>
        <li>学習コンテンツ（5つの節構成）</li>
        <li>ハンズオン演習</li>
        <li>提出課題（一部の章のみ）</li>
      </ul>

      <Section>Claude Code カリキュラム</Section>
      <ComparisonTable
        headers={["タイトル", "章", "目標学習時間", "対象"]}
        rows={[
          ["1. Claude Code とは", "①導入", "1時間", "全員"],
          ["2. インストール ─ 環境をセットアップする", "②セットアップ・基本操作", "1時間", "全員"],
          ["3. 基本的な使い方 ─ 日常のワークフローを身につける", "②セットアップ・基本操作", "2時間", "全員"],
          ["4. プロンプトとセッション管理 ─ Claudeとうまく会話する", "②セットアップ・基本操作", "1.5時間", "全員"],
          [<>5. <Cmd>CLAUDE.md</Cmd> と Plan モード ─ Claudeに記憶と計画力を持たせる</>, "③コンテキスト管理", "2時間", "全員"],
          ["6. Subagents と Skills ─ Claudeを専門特化させる", "④拡張機能", "3時間", "全員"],
          ["7. MCP と Hooks ─ 外部連携と自動化", "④拡張機能", "3時間", "全員"],
          ["8. Plugins と Git Worktree ─ チーム開発と並列実行", "⑤応用ワークフロー", "2時間", "エンジニア志望"],
        ]}
      />
    </>
  );
}

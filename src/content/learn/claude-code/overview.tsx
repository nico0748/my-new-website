import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Cmd, ComparisonTable } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-basics",
  title: "Claude Code 基礎 — コース概要",
  description: "Claude Code の基本的な使い方から拡張機能までを段階的に学ぶコースの概要。目標学習時間・進め方・コース全体像。",
  domain: "claude-code",
  section: "intro",
  order: 1,
  level: "intro",
  tags: ["Claude Code", "AI", "開発ツール"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>（目標学習時間：12〜16時間）</Lead>

      <p>このコースでは、Claude Code の基本的な使い方から拡張機能までを段階的に学びます。</p>
      <p>
        Claude Code は ターミナルで動くエージェント型 AI コーディングアシスタントです。コードを書くだけでなく、
        ファイル検索・コマンド実行・ドキュメント作成・デバッグまで、ターミナルからできることなら何でも手伝ってくれます。
        日々の開発において非常に強力な相棒になります。
      </p>

      <Section>進め方</Section>
      <p>各章には以下が含まれます。上から順番に進めてください。</p>
      <ul>
        <li>学習目標</li>
        <li>学習コンテンツ（5つの節構成）</li>
        <li>ハンズオン演習</li>
      </ul>

      <Section>コース全体像</Section>
      <ComparisonTable
        headers={["タイトル", "章", "目標学習時間", "レベル"]}
        rows={[
          ["1. Claude Code とは", "①導入", "1時間", "入門"],
          ["2. インストール ─ 環境をセットアップする", "②セットアップ・基本操作", "1時間", "入門"],
          ["3. 基本的な使い方 ─ 日常のワークフローを身につける", "②セットアップ・基本操作", "2時間", "基礎"],
          ["4. プロンプトとセッション管理 ─ Claudeとうまく会話する", "②セットアップ・基本操作", "1.5時間", "基礎"],
          [<>5. <Cmd>CLAUDE.md</Cmd> と Plan モード ─ Claudeに記憶と計画力を持たせる</>, "③コンテキスト管理", "2時間", "基礎"],
          ["6. Subagents と Skills ─ Claudeを専門特化させる", "④拡張機能", "3時間", "実践"],
          ["7. MCP と Hooks ─ 外部連携と自動化", "④拡張機能", "3時間", "実践"],
          ["8. Plugins と Git Worktree ─ チーム開発と並列実行", "⑤応用ワークフロー", "2時間", "実践"],
        ]}
      />
    </>
  );
}

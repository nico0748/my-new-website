import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "owasp-top10",
  title: "OWASP Top 10 入門 — Web の代表的な脆弱性",
  description: "Web アプリで狙われやすい脆弱性の定番リスト。XSS・SQLi・アクセス制御不備を中心に、原理と対策の勘所を掴む。",
  domain: "security",
  section: "web-sec",
  order: 1,
  level: "basic",
  tags: ["OWASP", "XSS", "SQLi", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>OWASP Top 10</strong> は、Web アプリで頻出かつ影響の大きい脆弱性をまとめた業界標準のリストです。まずは代表的な 3 つの原理と防ぎ方を押さえましょう。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        本記事は「どんな攻撃があり、なぜ起きるか」を理解するための入門です。攻撃手順そのものではなく、防御の考え方に焦点を当てます。
      </Callout>

      <Section>A03: インジェクション（SQLi）</Section>
      <p>
        ユーザー入力を検証せずに SQL 文へ連結すると、入力が「データ」ではなく「命令」として解釈されてしまいます。
      </p>
      <Code lang="sql" filename="危険な例（連結）">{`-- ユーザー入力を直接埋め込むと危険
SELECT * FROM users WHERE name = '" + input + "';`}</Code>
      <Callout variant="tip" title="対策: プレースホルダ">
        値を必ず<strong>プレースホルダ（プリペアドステートメント）</strong>で渡し、入力を命令ではなくデータとして扱わせます。ORM も同様の効果があります。
      </Callout>

      <Section>A07 系: クロスサイトスクリプティング（XSS）</Section>
      <p>
        ページに埋め込まれたユーザー入力がスクリプトとして実行される脆弱性。他人のセッションを盗む等に悪用されます。
      </p>
      <ul>
        <li>出力時に<strong>エスケープ</strong>（<Cmd>&lt;</Cmd> → <Cmd>&amp;lt;</Cmd> 等）を徹底する</li>
        <li>フレームワークの自動エスケープを無効化しない（React の <Cmd>dangerouslySetInnerHTML</Cmd> は最小限に）</li>
        <li><Cmd>Content-Security-Policy</Cmd> ヘッダで実行元を制限する</li>
      </ul>

      <Section>A01: アクセス制御の不備</Section>
      <p>
        「URL を直接叩けば他人のデータが見える」「本来禁止の操作ができる」といった、認可チェック漏れ。近年もっとも多い分類です。
      </p>
      <Callout variant="warn" title="サーバ側で必ず検証">
        画面上でボタンを隠すだけでは不十分。<strong>すべての操作をサーバ側で認可チェック</strong>し、デフォルト拒否（許可したものだけ通す）で設計します。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "インジェクションはプレースホルダで「入力＝データ」に固定して防ぐ",
          "XSS は出力エスケープ + CSP。自動エスケープを無効化しない",
          "アクセス制御はサーバ側で必ず検証し、デフォルト拒否で設計",
          "OWASP Top 10 は定期的に更新される。最新版を一次情報で確認する",
        ]}
      />

      <Callout variant="info" title="このトピックについて">
        セキュリティは扱いが繊細な領域です。ここでは防御の考え方のみを扱っています。実際の検証は必ず自分が管理する環境・許可された対象に限定してください。
      </Callout>
    </>
  );
}

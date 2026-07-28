import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, ComparisonTable, KVList, Steps, Step, KeyPoints, TipBox, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "poc-triage",
  title: "PoC 検証とトリアージ — FP 排除・最小 PoC・CVSS",
  description: "検出候補を手動で裏取りして誤検知（False Positive）を排除し、実害を安全に示す最小限の PoC を作り、CVSS v3.1 で深刻度を採点する。1脆弱性1枚の指摘個票にまとめるまで。",
  domain: "vuln-research",
  section: "poc",
  order: 1,
  level: "practice",
  tags: ["PoC", "トリアージ", "CVSS", "False Positive", "指摘個票"],
  updated: "2026-07-25",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        調査で挙がった「候補」は、まだ脆弱性ではありません。<strong>手動で裏取りして誤検知を排除</strong>し、<strong>第三者が再現できる最小の PoC</strong>で影響を安全に示し、<strong>CVSS で深刻度を採点</strong>して初めて「指摘」になります。この章は、発見を<strong>報告できる品質</strong>に引き上げる工程です。
      </Lead>

      <Section>Step 1 — False Positive を排除する</Section>
      <p>
        自動スキャナの検出やパターン一致は<strong>誤検知（False Positive）</strong>を多く含みます。すべての候補を<strong>手動で再現</strong>し、「本当に成立するか」を確かめます。裏取りできないものは指摘にしません。
      </p>
      <KVList
        items={[
          { key: "再現できるか", val: "同じ手順で同じ結果になるか。1回きり・環境依存は要注意" },
          { key: "本当に脆弱性か", val: "仕様・想定内の挙動を脆弱性と誤認していないか" },
          { key: "前提条件は現実的か", val: "成立に必要な条件（特定権限・特殊設定）が実運用でありうるか" },
        ]}
      />

      <Section>Step 2 — 最小限の PoC を作る</Section>
      <p>
        PoC（Proof of Concept）は「攻撃の完成品」ではなく、<strong>脆弱性の存在と影響を、必要十分な最小限で示す証拠</strong>です。派手さより<strong>再現性・安全性</strong>を優先します。
      </p>
      <Callout variant="danger" title="PoC の安全ルール">
        <ul>
          <li><strong>破壊しない</strong>：データの削除・改ざん・大量取得はしない。「できること」は最小の証拠で示す。</li>
          <li><strong>他人に触れない</strong>：自分が用意したアカウント・データの範囲で実証する。</li>
          <li><strong>広げない</strong>：一度成立を確認したら、権限昇格や横展開を実際には行わない（影響は文章で説明）。</li>
          <li><strong>証跡を残す</strong>：日時・URL・リクエスト/レスポンスを記録。機微情報はマスキング。</li>
        </ul>
      </Callout>
      <Steps>
        <Step title="再現手順を確定する">
          誰がやっても同じ結果になる手順に整理する（前提・アカウント・操作順）。
        </Step>
        <Step title="証跡を取る">
          該当の HTTP リクエスト/レスポンスとスクリーンショットを、URL・時刻つきで保存する。
        </Step>
        <Step title="影響を言語化する">
          「この PoC が成立すると、何が起きるか」を技術的影響（C/I/A）と事業影響に分けて書く。
        </Step>
      </Steps>

      <Section>Step 3 — CVSS で深刻度を採点する</Section>
      <p>
        深刻度は感覚ではなく、共通指標 <strong>CVSS（Common Vulnerability Scoring System）v3.1</strong> のベクタで採点します。脆弱性間で<strong>判定基準を一貫</strong>させることが重要です。
      </p>
      <ComparisonTable
        headers={["深刻度", "CVSS スコア帯"]}
        rows={[
          ["緊急（Critical）", "9.0 – 10.0"],
          ["重要（High）", "7.0 – 8.9"],
          ["警告（Medium）", "4.0 – 6.9"],
          ["注意（Low）", "0.1 – 3.9"],
          ["なし（None）", "0"],
        ]}
      />
      <SubSection>3つの評価基準</SubSection>
      <KVList
        items={[
          { key: "基本評価基準 (Base)", val: "脆弱性固有の最悪ケース。AV(攻撃元)/AC(複雑さ)/PR(必要権限)/UI(ユーザ関与)/S(スコープ)/C・I・A(機密性・完全性・可用性への影響)" },
          { key: "現状評価基準 (Temporal)", val: "悪用コードの成熟度・修正状況・情報の信頼性など、時点で変わる要素" },
          { key: "環境評価基準 (Environmental)", val: "対象システム固有の事情での緩和/増幅（重要資産か・補完統制があるか）" },
        ]}
      />
      <Code lang="text" filename="CVSS v3.1 ベクタの例（記録に残す）">{`CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N  → Base 6.5（警告）
# AV:N ネットワーク経由 / AC:L 容易 / PR:L 一般権限が必要
# UI:N ユーザ操作不要 / S:U スコープ不変 / C:H 機密性に高影響`}</Code>
      <Callout variant="tip" title="採点の根拠を必ず文章で残す">
        スコアだけでなく<strong>「なぜその値にしたか」</strong>を残します。後で揺れないよう、同種の脆弱性は同じ基準で採点し、<strong>OWASP Risk Rating</strong>（発生可能性 × 影響度）でも言語化しておくと、非技術者への説明がしやすくなります。
      </Callout>

      <Section>Step 4 — 指摘個票にまとめる（1脆弱性1枚）</Section>
      <p>
        確定した脆弱性は、<strong>1件ごとに「指摘個票」</strong>へ起票します。この個票が、次章の報告書「個別の脆弱性の報告」にそのまま統合されます。記載事項は次のとおりです。
      </p>
      <ComparisonTable
        headers={["個票の項目", "内容"]}
        rows={[
          ["通し番号 / 脆弱性名称", "報告書内での連番と名称（例: 反射型 XSS）"],
          ["識別子", "CWE-XX（該当すれば CVE）・WSTG-ID"],
          ["リスク評価（深刻度）", "緊急/重要/警告/注意/なし ＋ CVSS ベクタ・スコア"],
          ["発見場所", "URL・画面位置/画面遷移・スクリーンショット（マスキング済）"],
          ["リクエスト/レスポンス", "該当 HTTP メッセージ（機微情報マスキング）"],
          ["判断理由", "脆弱性の発動に最も因果関係が深い事項（第三者再現可能な根拠）"],
          ["脆弱性の解説", "一般的な仕組み＋本件での成立条件"],
          ["影響 / 脅威", "技術的影響（C/I/A）と事業的影響（金銭・評判・コンプラ・プライバシー）"],
          ["対策", "恒久対策（コードレベル）＋短期回避策（設定レベル）"],
        ]}
      />
      <TipBox>
        この章の完了条件は「<strong>全指摘に、再現手順・証跡・CVSS・修正案が揃った個票が存在する</strong>」こと。ここまで来れば、あとは個票を束ねて報告書にするだけです（次章）。
      </TipBox>

      <Callout variant="warn" title="修正案まで書くのが調査者の仕事">
        「危ない」だけでは相手は動けません。<strong>どの入力を・どの層で・どう検証/エンコード/認可すれば直るか</strong>（恒久対策）と、すぐ効く回避策（WAF ルール・ヘッダ・権限縮小）をセットで書きます。実装可能性まで考えるのがプロの報告です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "候補は手動で裏取りし、False Positive を排除してから指摘にする",
          "PoC は最小・非破壊・再現可能に。他人データに触れず、影響は文章で説明する",
          "深刻度は CVSS v3.1 ベクタで採点し、判定基準を脆弱性間で一貫させる",
          "スコアだけでなく採点根拠を文章で残す（OWASP Risk Rating も併用）",
          "1脆弱性1枚の指摘個票に、再現手順・証跡・CVSS・修正案まで揃える",
        ]}
      />

      <Callout variant="info" title="次章">
        次章「診断報告書の作成」で、指摘個票を統合し、書籍準拠の構成で報告書にまとめます（本コースの中心）。
      </Callout>
    </>
  );
}

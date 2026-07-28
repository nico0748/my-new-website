import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, ComparisonTable, KVList, Steps, Step, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "overview-authorization",
  title: "コース概要と大前提 — 許可・法律・倫理",
  description: "脆弱性調査は「許可」から始まる。RoE（Rules of Engagement）・関係法令・倫理を最初に固め、偵察→調査→PoC→報告→開示という全体フロー（NIST SP800-115 準拠）を俯瞰する。無許可の検証は絶対にしない。",
  domain: "vuln-research",
  section: "recon",
  order: 1,
  level: "practice",
  tags: ["脆弱性診断", "許可", "RoE", "法律", "倫理"],
  updated: "2026-07-25",
  minutes: 16,
};

export default function Article() {
  return (
    <>
      <Lead>
        このコースは、<strong>許可された範囲</strong>で行う脆弱性調査の実践をまとめます。偵察・Web 脆弱性の調査・PoC 検証・報告・責任ある開示までを、受託診断のエンゲージメント（NIST SP800-115 準拠）に沿って通しで扱います。<strong>技術より先に「許可・法律・倫理」を固める</strong>——これが脆弱性リサーチの出発点であり、最も重要な章です。
      </Lead>

      <Callout variant="danger" title="最重要 — 許可のない検証は絶対にしない">
        脆弱性の検証は、対象への<strong>書面での許可</strong>（またはバグバウンティ等の明示的な許可プログラム）が無い限り<strong>行いません</strong>。無許可の探索・攻撃は、技術的に「軽い」操作であっても<strong>不正アクセス禁止法などに触れる犯罪</strong>になり得ます。本コースの内容は、<strong>自分が管理する環境</strong>か<strong>明示的に許可された対象</strong>にのみ適用してください。
      </Callout>

      <Section>脆弱性調査の2つの文脈</Section>
      <p>
        同じ「脆弱性を探す」でも、前提が大きく異なる2つの文脈があります。どちらでも<strong>「許可の範囲」</strong>が生命線です。
      </p>
      <ComparisonTable
        headers={["観点", "受託脆弱性診断", "個人の脆弱性リサーチ"]}
        rows={[
          ["対象", "クライアントのシステム", "バグバウンティ / 許可されたプログラム / 自分の環境"],
          ["許可の形", "契約 ＋ RoE（書面合意）", "プログラムのポリシー（スコープ・禁止事項）"],
          ["成果物", "診断報告書・報告会・リテスト", "脆弱性レポート（プラットフォーム経由）"],
          ["説明責任", "重い（事業影響への翻訳・優先度合意）", "再現手順と影響の明確な提示"],
          ["このコースの主眼", "◎ 全フローを通しで", "○ 偵察〜PoC〜開示を援用"],
        ]}
      />
      <p>
        本コースは<strong>受託診断の背骨</strong>（契約・許可範囲・納品・説明責任）を軸にしつつ、個人リサーチにも通じる作法として偵察〜PoC〜開示を扱います。
      </p>

      <Section>全体フロー — E0 から E5 まで</Section>
      <p>
        脆弱性調査は「ツールを実行して終わり」ではありません。<strong>準備 → 情報収集 → 調査 → 検証・トリアージ → 報告 → 修正確認</strong>という一連の流れで、<strong>E0（許可）と E4（報告）が特に重い</strong>のが特徴です。
      </p>
      <Steps>
        <Step title="E0 事前準備 — スコープと許可の確定">
          対象範囲（URL / FQDN / IP / API / 画面）を確定し、<strong>RoE を書面合意</strong>する。ここが無ければ始めない。
        </Step>
        <Step title="E1 情報収集 — 構成把握と攻撃面マッピング">
          ヒアリング＋非破壊の偵察で、画面・API・認証境界の「地図」を作る。（次章）
        </Step>
        <Step title="E2 診断実行 — カテゴリ別に網羅">
          WSTG に沿って認証・認可・注入・偽造・ロジックなどを調査。破壊的ペイロードは使わない。
        </Step>
        <Step title="E3 検証・トリアージ — FP 排除と重大度確定">
          手動で裏取りして誤検知を排除し、最小の PoC・CVSS・修正案を個票にまとめる。
        </Step>
        <Step title="E4 報告 — 納品と説明責任">
          個票を統合して診断報告書を作成。非技術者と開発者、二層の読み手に向けて書く。
        </Step>
        <Step title="E5 リテスト — 修正の確認で締める">
          修正後に再診断し、「修正済 / 部分対応 / 未対応 / 再発」を判定して報告書に追記。
        </Step>
      </Steps>
      <Callout variant="info" title="成果物の流れ">
        <Cmd>スコープ/RoE</Cmd> → <Cmd>チェックリスト（進捗）</Cmd> → <Cmd>指摘個票 ×N</Cmd> → <Cmd>診断報告書（統合納品）</Cmd> → <Cmd>リテスト追記</Cmd>。各フェーズの合意点（クライアントの承認）を必ず残します。
      </Callout>

      <Section>関係法令とガイドライン</Section>
      <p>
        「どこまでやってよいか」を判断するために、関連する法令と基準を最初に押さえます。<strong>知らなかったでは済まない</strong>領域です。
      </p>
      <KVList
        items={[
          { key: "不正アクセス禁止法", val: "他人の ID/パスワードでの不正ログインやアクセス制御を回避する行為を禁止。許可なき『試し』も対象になりうる" },
          { key: "威力業務妨害罪 / 電子計算機損壊等業務妨害罪", val: "DoS・大量負荷・システム停止を招く行為は業務妨害になりうる（RoE で禁止行為として明記）" },
          { key: "不正指令電磁的記録に関する罪（ウイルス作成罪）", val: "悪意あるコードの作成・提供・保管を規制。PoC の取り扱いにも注意" },
          { key: "個人情報保護法", val: "検証中に個人情報へ触れる場合の取扱い。証跡のマスキングが必須" },
        ]}
      />
      <SubSection>拠り所にする基準・ガイドライン</SubSection>
      <p>
        調査の網羅性と報告の妥当性は、公的な基準に紐づけて担保します。
      </p>
      <ul>
        <li><strong>OWASP Top 10</strong> — Web の代表的なリスクの共通言語</li>
        <li><strong>OWASP WSTG（Web Security Testing Guide）</strong> — カテゴリ別のテスト手順の一次資料</li>
        <li><strong>Web 健康診断 / OWASP Web システムセキュリティ要件書</strong> — 診断項目の基準</li>
        <li><strong>PCI DSS</strong> — カード情報を扱う場合の要求</li>
        <li><strong>CWE / CVE / CVSS</strong> — 脆弱性の種類・識別・深刻度の共通指標（報告で使う）</li>
      </ul>

      <Section>倫理の原則 — 調査者が必ず守ること</Section>
      <Callout variant="warn" title="この5原則を全フェーズで守る">
        <ol>
          <li><strong>許可の範囲を出ない</strong>：スコープ外の対象・機能には触れない。迷ったら止めて確認する。</li>
          <li><strong>壊さない</strong>：検出は<strong>無害な検証文字列</strong>で確認し、破壊的・DoS 的なペイロードは使わない。</li>
          <li><strong>データを守る</strong>：他人の個人情報・秘密情報を閲覧・保存・持ち出ししない。触れたら最小限＋マスキング。</li>
          <li><strong>記録を残す</strong>：いつ・何を・どう検証したかの証跡を残し、第三者が再現・検証できるようにする。</li>
          <li><strong>報告まで完了させる</strong>：発見して終わりにせず、責任を持って報告・開示する。悪用・公表しない。</li>
        </ol>
      </Callout>

      <Bridge course="情報セキュリティ / 職業倫理・コンプライアンス">
        脆弱性調査士の仕事は「攻撃者と同じ技術を、<strong>正反対の目的（守るため）と厳格な許可の下で</strong>使う」ことです。技術力よりも<strong>スコープ管理・説明責任・記録</strong>という職業倫理が信頼の源泉になります。セキュリティ基礎コースで学んだ攻撃手法の知識を、ここでは「許可された検証」という枠の中で運用します。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "脆弱性調査は許可から始まる。書面の許可（RoE / プログラムのポリシー）が無ければ検証しない",
          "全体フローは E0 準備 → E1 情報収集 → E2 調査 → E3 検証・トリアージ → E4 報告 → E5 リテスト",
          "受託の重心は E0（許可）と E4（報告）。個人リサーチでもスコープと責任ある開示が要",
          "関係法令: 不正アクセス禁止法・業務妨害罪・ウイルス作成罪・個人情報保護法を必ず意識",
          "倫理5原則: 範囲を出ない/壊さない/データを守る/記録を残す/報告まで完了させる",
        ]}
      />

      <Callout variant="info" title="次章">
        次章「偵察・情報収集」で、許可された範囲で攻撃面（画面・API・認証境界）の地図を作る非破壊の手順を扱います。
      </Callout>
    </>
  );
}

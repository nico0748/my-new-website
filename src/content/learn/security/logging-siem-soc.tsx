import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain, StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "logging-siem-soc",
  title: "ログ・SIEM・SOC",
  description: "多数のログを集約・正規化・相関して攻撃の兆候を検知する SIEM と、それを運用する SOC。相関分析の実例、SIEM と SOAR の相補関係、NIST SP800-92 を学ぶ。",
  domain: "security",
  section: "incident",
  order: 8,
  level: "basic",
  tags: ["SIEM", "SOC", "SOAR", "ログ管理", "相関分析"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        攻撃の兆候は、たいてい一本のログには現れません。「ログイン失敗が続いた」「その後成功した」「直後に権限が上がった」——それぞれ単独では日常の出来事でも、<strong>つなげて見ると攻撃の輪郭</strong>が浮かびます。この「つなげて見る」を機械化するのが <strong>SIEM</strong> で、それを人が運用する組織が <strong>SOC</strong> です。監視は「ログを集めるだけ」では完成せず、相関と対応があって初めて機能します。
      </Lead>

      <Section>SOC — 監視を担う組織</Section>
      <p>
        <strong>SOC（Security Operations Center）</strong>は、各種機器のログやテレメトリを集約・相関し、攻撃の兆候を早期に検知する組織・機能です。24 時間 365 日の監視を担い、検知したアラートを調査（トリアージ）し、本物のインシデントなら対応へ引き渡します。SOC の中核ツールが SIEM です。
      </p>

      <Section>SIEM — ログを集約し相関する</Section>
      <p>
        <strong>SIEM（Security Information and Event Management）</strong>は、サーバ・ネットワーク機器・EDR・WAF・クラウドなど多様なソースからログを一元収集し、正規化して相関分析する基盤です。処理は次の段階で進みます。
      </p>
      <StepFlow
        steps={[
          { title: "1. 収集（Collection）", desc: "エージェント・syslog・API で、多様なソースからログとイベントを一元的に取り込む。" },
          { title: "2. 正規化（Normalization）", desc: "機器ごとにバラバラな形式を共通スキーマへ変換し、タイムスタンプを整合させる。" },
          { title: "3. 相関分析（Correlation）", desc: "ルールベース＋振る舞いロジックで、複数ログにまたがる攻撃パターンを検出する。単独ログでは見えない連鎖をここで拾う。" },
          { title: "4. アラート・可視化", desc: "タイムラインや相関マップで、潜伏期間（ドウェルタイム）を露出させる。" },
          { title: "5. 保管・監査", desc: "長期保管し、コンプライアンス報告やインシデント調査のフォレンジック基盤にする。" },
        ]}
        caption="SIEM の処理段階。散在するログを集めて共通形式にそろえ、相関でつなげて初めて攻撃の兆候が見える。"
      />

      <SubSection>相関分析の実例</SubSection>
      <p>
        SIEM の価値は<strong>相関</strong>にあります。たとえば次の連鎖を考えてみましょう。それぞれのログは単独では見過ごされがちですが、時系列でつなぐと明確な攻撃シナリオになります。
      </p>
      <FlowChain
        nodes={[
          { label: "失敗ログイン多発", sub: "総当たり?", variant: "cta" },
          { label: "ログイン成功", sub: "突破された?" },
          { label: "権限昇格操作", sub: "管理者化", variant: "alt" },
        ]}
        caption="相関の例。同一 IP からのログイン失敗の多発 → 成功 → 直後の権限昇格を、一連の攻撃として検知する。"
      />
      <p>
        「失敗ログインの多発」だけなら打ち間違いかもしれません。「ログイン成功」も正常な出来事です。しかしこの三つが<strong>短時間に同一アカウント・同一 IP で連続</strong>したなら、総当たり攻撃が成功し、侵入者が権限を上げようとしている可能性が高い——SIEM はこうした「単独では見えない攻撃」を相関ルールで検知します。検知ルールは MITRE ATT&CK にマッピングし、攻撃シナリオ（ユースケース）単位で体系化するのが定石です。

      </p>

      <Section>SIEM と SOAR は相補的</Section>
      <p>
        SIEM は「気づく」仕組みですが、それだけでは対応まで手が回りません。そこで<strong>SOAR（Security Orchestration, Automation and Response）</strong>と組み合わせます。両者は役割が分かれています。
      </p>
      <KVList
        items={[
          { key: "SIEM = 検知（detect）", val: "ログを集約・相関して脅威の兆候に気づく。「何かおかしい」を見つける役。" },
          { key: "SOAR = 対応（respond）", val: "検知された脅威に対し、プレイブックに沿って端末隔離・トークン失効・チケット起票などを自動/半自動で実行する。「気づいたら動く」役。" },
        ]}
      />
      <p>
        つまり <strong>SIEM が検知し、SOAR が対応する</strong>という相補関係です。人手だけでは、大量のアラートに対応が追いつかず「アラート疲労」に陥ります。定型的な初動を SOAR で自動化することで、SOC アナリストは本当に判断が必要な事象に集中できます。
      </p>
      <Callout variant="warn" title="ログは集めるだけでは意味がない">
        SIEM の導入・チューニング・運用にはコストがかかり、ログ量に比例してライセンス費用も増えます。何より、集めたログを相関ルールで使い、アラートに対応する運用フローがなければ、ただの高価なログ倉庫になります。「収集・正規化・相関・対応」がそろって初めて監視は機能します。
      </Callout>
      <Callout variant="info" title="NIST SP 800-92 — ログ管理の指針">
        ログ管理のベストプラクティス（収集・分析・保管）を示すのが <strong>NIST SP 800-92（Guide to Computer Security Log Management）</strong>です。SIEM は、この指針を実装する手段として位置づけられます。「どのログを、どれだけの期間、どう保護して保管するか」を設計する土台になります。
      </Callout>

      <Bridge course="オペレーティングシステム / ネットワーク / データベース（集約と相関）">
        SIEM が扱うログの多くは、OS の講義で習う<strong>システムログ・監査ログ</strong>や、ネットワークの<strong>フローログ・接続状態</strong>です。「何が実行され、誰がログインし、どこへ通信したか」という OS・ネットワークの基礎知識が、そのまま「どのログを見れば何が分かるか」の判断力になります。また SIEM の相関分析は、データベースの講義で習う<strong>異なるソースの結合（JOIN）とタイムスタンプによる時系列突合</strong>の応用で、「バラバラのイベントを共通キーでつなぎ、意味のあるパターンを抽出する」という考え方は、まさにクエリ処理そのものです。座学の記憶階層・ログ・結合演算が、脅威検知という運用に凝縮されています。
      </Bridge>

      <Divider />

      <Quiz
        question="SIEM と SOAR の関係として正しいものはどれですか。"
        options={[
          "SIEM が対応を自動実行し、SOAR がログを収集する",
          "SIEM が検知（ログの集約・相関で気づく）、SOAR が対応（隔離・失効などを自動実行）という相補関係",
          "どちらもログを保管するだけで、検知や対応の機能は持たない",
          "SIEM は単一ログしか見られず、相関はできない",
        ]}
        answer={1}
        explanation="SIEM は多様なログを集約・正規化・相関して脅威の兆候に「気づく（detect）」役、SOAR はその検知を受けてプレイブックで端末隔離・トークン失効などを「実行する（respond）」役で、両者は相補関係にあります。SIEM の本質は単独ログでは見えない連鎖を捉える相関分析です。"
      />

      <KeyPoints
        items={[
          "SOC はログ・テレメトリを集約・相関して攻撃の兆候を早期検知する組織・機能",
          "SIEM は収集・正規化・相関・アラート・保管の段階でログを処理する",
          "相関の例: 失敗ログイン多発 → 成功 → 権限昇格 を一連の攻撃として検知する",
          "SIEM が検知、SOAR が対応（隔離・失効・起票の自動化）という相補関係",
          "ログは集めるだけでは無意味。相関ルールと対応フローがあって初めて機能する（NIST SP 800-92）",
        ]}
      />
    </>
  );
}

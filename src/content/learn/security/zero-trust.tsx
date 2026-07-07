import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "zero-trust",
  title: "ゼロトラスト",
  description: "「社内ネットワークだから安全」を捨て、アクセスのたびに検証する設計思想。境界防御の限界、PDP/PEP という論理構成、ZTNA と CISA 成熟度モデルの 5 本柱まで。",
  domain: "security",
  section: "sec-basics",
  order: 7,
  level: "basic",
  tags: ["ゼロトラスト", "境界防御", "アクセス制御"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        かつてセキュリティは「社内は安全、社外は危険」という前提で、境界に壁を築いていました。しかしクラウド・リモートワーク・BYOD が当たり前になり、その境界は曖昧になりました。そこで生まれたのが
        <strong> ゼロトラスト</strong>——「ネットワークの位置による暗黙の信頼を排し、すべてのアクセスを都度検証する」という設計思想です。
      </Lead>

      <Section>境界防御の限界</Section>
      <p>
        従来の<strong>境界防御（ペリメタモデル）</strong>は、社内ネットワークとインターネットの間にファイアウォールという壁を置き、「壁の内側は信頼できる」と見なす考え方でした。一度中に入れば、内部のリソースには比較的自由にアクセスできます。
      </p>
      <p>
        この前提の弱点は明白です。攻撃者が<strong>一度でも壁の内側に入り込むと（初期侵入）</strong>、内側は信頼されているため、そこから横展開（lateral movement）し放題になります。前の章で学んだ攻撃ライフサイクルを思い出してください。境界防御は「初期侵入」までは防げても、その後の「権限昇格」「横展開」を止める仕組みが弱いのです。さらにクラウドやリモートワークでは、そもそも守るべきものが壁の外にあり、「内側／外側」という区分自体が意味をなさなくなりました。
      </p>
      <Callout variant="warn" title="『内側だから安全』という暗黙の信頼を捨てる">
        ゼロトラストの出発点は、「ネットワーク上の位置・所属・所有関係だけを根拠とした暗黙の信頼を、一切与えない」ことです。社内ネットワークからのアクセスであっても、それだけでは信頼しません。場所ではなく、<strong>アクセスするたびに主体（誰か）とデバイス（何を使っているか）を明示的に検証する</strong>——これが本質です。
      </Callout>

      <Section>都度検証 — アイデンティティ中心へ</Section>
      <p>
        ゼロトラストのパラダイムシフトは、セキュリティの軸足を「ネットワーク境界に基づくセグメンテーション」から「<strong>アイデンティティ中心の継続的検証</strong>」へ移すことです。デファクトの定義文書は NIST SP 800-207「Zero Trust Architecture（ZTA）」で、次のような原則を掲げます。
      </p>
      <KVList
        items={[
          { key: "暗黙の信頼を与えない", val: "ネットワーク位置・所有関係だけを根拠に信頼しない" },
          { key: "セッション確立前に検証", val: "リソースへのアクセス前に、主体とデバイスを個別かつ動的に認証・認可する" },
          { key: "最小権限・セッション単位", val: "アクセスはセッション単位で、必要最小限の権限だけ許可する" },
          { key: "すべてを明示的に検証", val: "すべての主体・資産・ワークフローを明示的に認証／認可する" },
        ]}
      />

      <Section>PDP と PEP — アクセス判断を担う二つの役割</Section>
      <p>
        ゼロトラストを実装する論理アーキテクチャの中心にあるのが、<strong>PDP</strong> と <strong>PEP</strong> という二つの役割です。
      </p>
      <KVList
        items={[
          { key: "PDP（Policy Decision Point）", val: "アクセスの可否を『判断する』頭脳。Policy Engine と Policy Administrator から成る" },
          { key: "PEP（Policy Enforcement Point）", val: "PDP の判断を実際に『強制する』手。接続を確立したり遮断したりする" },
        ]}
      />
      <p>
        流れはこうです。利用者がリソースへアクセスしようとすると、まず PEP がそれを受け止めて PDP に判断を仰ぎます。PDP は、ID/IAM の情報・デバイスの状態（EDR のテレメトリなど）・脅威インテリジェンス・ログといった複数のシグナルを総合して可否を判断し、その結果を PEP に返します。PEP は判断どおりに接続を許可または遮断します。<strong>この「判断」と「強制」の分離</strong>が、ゼロトラストの構造的な核心です。
      </p>

      <SequenceDiagram
        actors={["利用者", "PEP", "PDP"]}
        messages={[
          { from: 0, to: 1, label: "① リソースへアクセス要求" },
          { from: 1, to: 2, label: "② 判断を仰ぐ（ID・デバイス状態）" },
          { from: 2, to: 1, label: "③ 可否を判断して返す", cta: true },
          { from: 1, to: 0, label: "④ 判断どおり許可 / 遮断を強制", cta: true },
        ]}
        caption="ゼロトラストのアクセス判断。PEP が受け止め、PDP が複数シグナルから可否を判断し、PEP が強制する。アクセスのたびに繰り返される。"
      />

      <Section>関連技術と成熟度モデル</Section>
      <p>
        ゼロトラストを支える具体的な技術も押さえておきましょう。
      </p>
      <KVList
        items={[
          { key: "ZTNA（Zero Trust Network Access）", val: "VPN に代わる、アプリ単位のアクセス制御" },
          { key: "マイクロセグメンテーション", val: "ネットワークを細かく区切り、内部の横展開を抑止する" },
          { key: "MFA・SSO・条件付きアクセス", val: "アイデンティティ検証を強化する仕組み" },
        ]}
      />
      <SubSection>CISA ゼロトラスト成熟度モデルの 5 本柱</SubSection>
      <p>
        ゼロトラストは製品ではなく<strong>設計思想・戦略</strong>であり、一気に導入するものではなく段階的に成熟させていくものです。その指針が CISA の Zero Trust Maturity Model で、次の <strong>5 本柱</strong>で構成されます。
      </p>
      <KVList
        items={[
          { key: "Identity（アイデンティティ）", val: "誰であるかの検証。ここから段階的に成熟させるのが定石" },
          { key: "Devices（デバイス）", val: "接続してくる端末の状態・健全性" },
          { key: "Networks（ネットワーク）", val: "通信の分離・暗号化・マイクロセグメンテーション" },
          { key: "Applications & Workloads（アプリ／ワークロード）", val: "アプリ単位のアクセス制御" },
          { key: "Data（データ）", val: "データ自体の分類・保護" },
        ]}
      />
      <Callout variant="tip" title="思想であって製品ではない">
        「ゼロトラスト製品を買えば完成」ではありません。ID 基盤・デバイス管理・ポリシー整備といった前提投資が大きく、過度な検証は UX や運用負荷を高めます。だからこそ、CISA の成熟度モデルや NIST SP 800-207 を指針に、Identity 柱から段階的に成熟させていくのが現実的なアプローチです。
      </Callout>

      <Bridge course="分散システム / 情報セキュリティ（アクセス制御）">
        ゼロトラストの「判断（PDP）と強制（PEP）の分離」は、分散システムやアクセス制御理論で習う<strong>Policy Decision Point / Policy Enforcement Point</strong>という古典的な設計パターンそのものです。認可ロジックを一箇所に集約し、各所の PEP がそれを参照して強制する——これは<strong>関心の分離</strong>と<strong>ポリシーの一元管理</strong>という設計原則の応用です。また「暗黙の信頼を置かない」という発想は、分散システムで習う<strong>ビザンチン障害耐性</strong>（構成要素を無条件には信頼しない）とも通じます。座学の「信頼できないノードを前提に設計する」という思想が、企業ネットワークの設計原理として現れているのです。
      </Bridge>

      <Quiz
        question={
          <>
            ゼロトラストにおいて、「アクセスの可否を判断する頭脳」と「その判断を実際に強制する手」を指す用語の組み合わせはどれでしょうか。
          </>
        }
        options={[
          "判断 = PEP、強制 = PDP",
          "判断 = PDP、強制 = PEP",
          "判断 = ZTNA、強制 = MFA",
          "判断も強制も PDP が一括で行う",
        ]}
        answer={1}
        explanation={
          <>
            アクセス可否を判断するのが <strong>PDP（Policy Decision Point）</strong>、その判断を実際に接続の許可/遮断として強制するのが <strong>PEP（Policy Enforcement Point）</strong>です。「判断」と「強制」を分離し、判断ロジックを一元管理するのがゼロトラストの構造的な核心です。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "境界防御は初期侵入を許すと横展開を止めにくい。クラウド/リモートで内外の区分も崩れた",
          "ゼロトラストはネットワーク位置による暗黙の信頼を排し、アクセスのたびに都度検証する",
          "軸足を境界セグメンテーションからアイデンティティ中心の継続的検証へ移す",
          "PDP が可否を判断し、PEP が接続の許可/遮断を強制する（判断と強制の分離）",
          "ゼロトラストは製品でなく戦略。CISA 成熟度モデルの 5 本柱を Identity から段階的に成熟させる",
        ]}
      />
    </>
  );
}

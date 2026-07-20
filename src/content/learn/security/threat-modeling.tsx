import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Steps, Step, ComparisonTable, Figure, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "threat-modeling",
  title: "脅威モデリング — STRIDE",
  description: "設計段階で脅威を体系的に洗い出す手法。STRIDE の 6 カテゴリと、それぞれが破るセキュリティ特性を対応づけ、DFD とトラストバウンダリを使った進め方を学ぶ。",
  domain: "security",
  section: "sec-basics",
  order: 6,
  level: "basic",
  tags: ["脅威モデリング", "STRIDE", "セキュア設計"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        脆弱性は、実装のあとに探すよりも、<strong>設計の段階で洗い出す</strong>ほうがはるかに安く直せます。「このシステムに、どんな攻撃がありうるか」を設計時に体系的に列挙する活動が脅威モデリングです。その代表的なフレームワークが、Microsoft 由来の <strong>STRIDE</strong>。6 カテゴリで脅威を漏れなくあぶり出します。
      </Lead>

      <Section>脅威モデリングとは — 設計段階で脅威を列挙する</Section>
      <p>
        脅威モデリング（Threat Modeling）とは、システムの設計を分解して<strong>どんな脅威が存在しうるかを体系的に列挙・分類・評価し、優先順位をつけて対策（緩和策）を設計する</strong>活動です。実装後にペネトレーションテストで穴を探すのが「作ってから壊す」なら、脅威モデリングは「作る前に壊し方を想像する」アプローチです。
      </p>
      <p>
        なぜ設計段階なのでしょうか。脆弱性は、実装後・リリース後に見つかるほど修正コストが跳ね上がるからです。設計図の段階で「ここは認証が要る」「この境界はデータが改ざんされうる」と気づければ、コードを書く前に手を打てます。これを<strong>左シフト（left shift）</strong>と呼びます。
      </p>

      <Section>STRIDE の 6 カテゴリ</Section>
      <p>
        STRIDE は 6 つの脅威カテゴリの頭文字です。優れているのは、各カテゴリが<strong>破られるセキュリティ特性と 1 対 1 で対応している</strong>点です。前章までに学んだ CIA（機密性・完全性・可用性）に、認証・認可・否認防止を足した形になっています。
      </p>
      <ComparisonTable
        headers={["カテゴリ", "脅威", "破られる特性", "主な緩和策"]}
        rows={[
          ["Spoofing（なりすまし）", "他者の認証情報を悪用して別人を装う", "認証（Authentication）", "強力な認証、MFA"],
          ["Tampering（改ざん）", "保存・転送中データの不正な改変", "完全性（Integrity）", "署名、ハッシュ、TLS"],
          ["Repudiation（否認）", "操作を否定し追跡できなくする", "否認防止（Non-repudiation）", "監査ログ、署名"],
          ["Information Disclosure（情報漏えい）", "権限のない者への情報露出", "機密性（Confidentiality）", "暗号化、アクセス制御"],
          ["Denial of Service（サービス拒否）", "正規利用者の利用を妨害", "可用性（Availability）", "レート制限、冗長化"],
          ["Elevation of Privilege（権限昇格）", "付与以上の権限の取得", "認可（Authorization）", "最小権限、入力検証"],
        ]}
      />
      <Callout variant="tip" title="6 カテゴリを『順番に当てはめる』のが肝">
        STRIDE の価値は、各要素に対して S・T・R・I・D・E を機械的に順に当てはめることで、<strong>思いつきに頼らず網羅的に</strong>脅威を洗い出せる点にあります。「この入力にはなりすまし（S）はあるか？ 改ざん（T）は？…」と 6 つの問いを順に投げる。人間が見落としがちな脅威を、チェックリストの力で拾い上げる仕組みです。
      </Callout>

      <Section>DFD とトラストバウンダリ</Section>
      <p>
        STRIDE を当てはめる前に、システムを図にして分解します。使うのが <strong>DFD（データフロー図）</strong>です。DFD では、外部実体（利用者・外部サービス）・プロセス（処理）・データストア（DB・ファイル）・そしてデータの流れを描きます。
      </p>
      <p>
        DFD で最も重要なのが<strong>トラストバウンダリ（信頼境界）</strong>です。これは「信頼度の異なる領域の境目」を表す線で、たとえば「インターネット（信頼できない）とサーバー内部（信頼できる）の境目」がそれにあたります。<strong>脅威は、このトラストバウンダリをまたぐところで最も生まれやすい</strong>——だから、境界をまたぐ各要素に重点的に STRIDE を当てるのがコツです。
      </p>
      <Figure src="/learn/shots/security/threat-modeling-01.svg" alt="Microsoft Threat Modeling Tool で DFD とトラストバウンダリを描いた画面" caption="専用ツールで DFD を描くと、トラストバウンダリをまたぐ要素から STRIDE 脅威が自動で列挙される" />

      <Callout variant="warn" title="境界を越えるデータは疑う">
        トラストバウンダリを越えて入ってくるデータは、常に「攻撃者が作ったかもしれない」と疑うのが鉄則です。信頼できる領域の内側だけで完結する処理には脅威が少なく、境界をまたぐ入出力に脅威が集中します。DFD を描く目的の半分は、この「疑うべき境界」を可視化することにあります。
      </Callout>

      <Section>進め方の手順</Section>
      <Steps>
        <Step title="1. 対象のモデル化">
          DFD で外部実体・プロセス・データストア・トラストバウンダリを描きます。まず「何がどこを流れるか」を絵にします。
        </Step>
        <Step title="2. 脅威の特定">
          トラストバウンダリをまたぐ各要素に STRIDE の 6 カテゴリを当てはめ、脅威を列挙します。
        </Step>
        <Step title="3. 評価・優先度づけ">
          列挙した各脅威のリスクを評価します（CVSS や DREAD などの尺度を使う）。すべてに同じ力をかけるのではなく、重いものから対処します。
        </Step>
        <Step title="4. 緩和策の設計">
          各脅威に対策を割り当て、リスクへの対応方針（受容・転嫁・回避・低減）を決めます。結果は要件・テストケース・脅威リストとして資産化します。
        </Step>
      </Steps>
      <StepFlow
        steps={[
          { title: "モデル化", desc: "DFD でトラストバウンダリを描く" },
          { title: "脅威の特定", desc: "境界をまたぐ要素に STRIDE を当てる" },
          { title: "評価・優先度づけ", desc: "各脅威のリスクを評価して並べる" },
          { title: "緩和策の設計", desc: "対策を割り当て、受容/転嫁/回避/低減を決める" },
        ]}
        caption="脅威モデリングの流れ。図にして分解 → 6 カテゴリで洗い出し → 評価 → 対策、という順で進める。"
      />
      <SubSection>STRIDE 以外の手法</SubSection>
      <p>
        脅威モデリングの手法は STRIDE だけではありません。攻撃シミュレーション中心の <strong>PASTA</strong>、プライバシーに特化した <strong>LINDDUN</strong>、攻撃の木で分析する <strong>Attack Trees</strong> などがあります。ツールでは <strong>Microsoft Threat Modeling Tool</strong> が DFD から STRIDE 脅威を自動列挙してくれます。まずは網羅性に優れ共通言語になりやすい STRIDE から始めるのが定石です。
      </p>

      <Bridge course="ソフトウェア工学 / 情報セキュリティ">
        脅威モデリングは、ソフトウェア工学で習う<strong>要求分析・設計レビュー</strong>にセキュリティの視点を組み込んだものです。DFD は座学で学ぶ<strong>データフロー図</strong>そのもので、システムを外部実体・プロセス・データストアに分解する構造化分析の技法が、そのまま攻撃面の分析に使われます。STRIDE が CIA に認証・認可・否認防止を足した形になっているのも示唆的で、前章までに学んだ基礎概念が、設計レビューの網羅的チェックリストへと具体化されているのです。「作る前に考える」という上流工程の思想が、最も費用対効果の高いセキュリティ対策になります。
      </Bridge>

      <Quiz
        question={
          <>
            攻撃者が一般ユーザー権限のアカウントを使い、本来は管理者しか実行できない操作を実行できてしまいました。これは STRIDE のどのカテゴリで、破られた特性は何でしょうか。
          </>
        }
        options={[
          "Spoofing（なりすまし）／ 認証",
          "Tampering（改ざん）／ 完全性",
          "Elevation of Privilege（権限昇格）／ 認可",
          "Denial of Service（サービス拒否）／ 可用性",
        ]}
        answer={2}
        explanation={
          <>
            「付与された以上の権限を取得した」ので、これは <strong>Elevation of Privilege（権限昇格）</strong>で、破られた特性は<strong>認可（Authorization）</strong>です。本人確認（認証）は通っているが、その先の「何をしてよいか」の制御（認可）が破られている点がポイントです。緩和策は最小権限と入力検証になります。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "脅威モデリングは設計段階で脅威を体系的に列挙する活動（左シフト）",
          "STRIDE の 6 カテゴリはそれぞれ破られる特性と 1 対 1 対応（CIA + 認証・認可・否認防止）",
          "DFD で描き、トラストバウンダリをまたぐ要素に重点的に STRIDE を当てる",
          "進め方: モデル化 → 脅威の特定 → 評価・優先度づけ → 緩和策の設計",
          "境界を越えて入るデータは常に疑う。結果は要件・テストとして資産化する",
        ]}
      />
    </>
  );
}

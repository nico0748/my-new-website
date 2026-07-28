import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KVList, Steps, Step, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "disclosure",
  title: "責任ある開示 — リテストと調整された開示",
  description: "受託ではリテストで修正を確認して締める。個人リサーチでは、窓口の探し方（security.txt / バグバウンティ / IPA→JPCERT/CC）、開示タイムライン、CVE 採番、そして『悪用・公表しない』という責任ある開示の作法をまとめる。",
  domain: "vuln-research",
  section: "disclosure",
  order: 1,
  level: "practice",
  tags: ["責任ある開示", "リテスト", "coordinated disclosure", "CVE"],
  updated: "2026-07-25",
  minutes: 16,
};

export default function Article() {
  return (
    <>
      <Lead>
        脆弱性は「見つけて終わり」ではなく、<strong>直って初めて価値になります</strong>。受託では<strong>リテスト</strong>で修正を確認して締め、個人リサーチでは<strong>責任ある開示（coordinated/responsible disclosure）</strong>で、報告先と協調しながら安全に世に伝えます。この章は、発見を<strong>正しく着地させる</strong>ための作法です。
      </Lead>

      <Section>受託の締め — E5 リテスト</Section>
      <p>
        クライアントが修正を実施したら、該当指摘を<strong>再診断</strong>し、直ったことを確認します。修正確認まで行って、ようやくエンゲージメントが完了します。
      </p>
      <Steps>
        <Step title="修正パッチ適用後に再診断">
          報告した各指摘を、同じ再現手順でもう一度検証する。
        </Step>
        <Step title="判定して報告書に追記">
          「修正済 / 部分対応 / 未対応 / 再発」で判定し、確認日とともに報告書へ追記する。
        </Step>
        <Step title="副作用を確認">
          修正によって<strong>別の問題が出ていないか</strong>（デグレ・新たな露出）も併せて確認する。
        </Step>
      </Steps>

      <Section>個人リサーチ — 責任ある開示とは</Section>
      <p>
        許可されたプログラムや自分の環境で脆弱性を見つけた場合、<strong>攻撃者より先に、開発元が直せるように伝える</strong>のが責任ある開示です。<strong>公表や悪用が先行してはいけません。</strong>
      </p>
      <ComparisonTable
        headers={["開示スタイル", "内容", "評価"]}
        rows={[
          ["責任ある開示（coordinated）", "開発元へ非公開で報告 → 修正 → 合意の上で公開", "推奨。利用者を守れる"],
          ["フルディスクロージャ（即時全公開）", "詳細を修正前に公開する", "利用者を危険に晒す。原則避ける"],
          ["無報告・悪用", "報告せず放置/悪用する", "論外。違法・非倫理"],
        ]}
      />

      <Section>報告先（窓口）の探し方</Section>
      <p>
        まず<strong>正規の窓口</strong>を探します。窓口がある場合はそれに従うのが最優先です。
      </p>
      <KVList
        items={[
          { key: "security.txt", val: "サイトの /.well-known/security.txt に報告先・ポリシーが書かれていることがある（RFC 9116）" },
          { key: "バグバウンティ / VDP", val: "HackerOne・Bugcrowd 等のプログラムや、企業独自の脆弱性開示ポリシー（VDP）。スコープと報奨・ルールが明記される" },
          { key: "SECURITY.md / GitHub Private Reporting", val: "OSS はリポジトリの SECURITY.md や GitHub の私的脆弱性報告（GHSA）で受け付けることが多い" },
          { key: "公的ルート（日本）", val: "窓口が無い/連絡がつかない場合、IPA へ届出 → JPCERT/CC が調整する『情報セキュリティ早期警戒パートナーシップ』" },
        ]}
      />
      <Code lang="text" filename="/.well-known/security.txt の例">{`Contact: mailto:security@example.com
Policy: https://example.com/security-policy
Preferred-Languages: ja, en
Expires: 2027-01-01T00:00:00Z`}</Code>

      <Section>開示のタイムライン</Section>
      <p>
        報告から公開までは、開発元と<strong>協調して段階を踏みます</strong>。一般には数十日〜90日程度の修正猶予を置くのが慣行です（プログラムの規定が優先）。
      </p>
      <Steps>
        <Step title="① 非公開で報告">
          再現手順・影響・CVSS・修正案を、正規窓口へ非公開で伝える（報告書と同じ品質で）。
        </Step>
        <Step title="② 受領確認と修正の待機">
          開発元の受領を確認し、修正の猶予期間を設ける。進捗を協調的にやり取りする。
        </Step>
        <Step title="③ 必要なら CVE を採番">
          広く影響する脆弱性は CNA（CVE 採番機関）経由で <Cmd>CVE-ID</Cmd> を採番し、識別子を付ける。
        </Step>
        <Step title="④ 合意の上で公開">
          修正リリース後、開発元と合意したタイミングで詳細を公開する（利用者が対処できる状態で）。
        </Step>
      </Steps>
      <Callout variant="tip" title="悪用されやすさも見て優先度を測る">
        公開・対応の優先度は CVSS だけでなく、<strong>KEV（悪用が確認済みか）</strong>や <strong>EPSS（悪用されやすさの予測）</strong>も参考にします。実際に攻撃が観測されているものは、スコアに関わらず最優先です。
      </Callout>

      <Section>受け取る側の備え（自分がサービス運営者なら）</Section>
      <p>
        逆に、自分たちのサービスが報告を<strong>受ける側</strong>になることもあります。報告してもらいやすい導線を用意しておくのも、セキュリティ運用の一部です。
      </p>
      <KVList
        items={[
          { key: "窓口の明示", val: "security.txt / security@ ドメインメール / SECURITY.md で報告先を公開する" },
          { key: "セーフハーバー", val: "善意の報告者を法的に追及しない旨（VDP のセーフハーバー条項）を明記する" },
          { key: "受領と対応の約束", val: "受領連絡・対応方針・開示の進め方をポリシーに書いておく" },
        ]}
      />

      <Callout variant="danger" title="最後に — 法と倫理の再確認">
        窓口の有無に関わらず、<strong>許可のない対象を勝手に調べることは違法になりうる</strong>（不正アクセス禁止法など）ことを忘れないでください。責任ある開示は「許可された発見」を前提に成立します。<strong>見つけた事実を交渉材料にしたり、公表をちらつかせて対価を要求したりする</strong>のは、恐喝等にあたる重大な逸脱です。あくまで<strong>利用者を守るため</strong>に、協調的に伝えます。
      </Callout>

      <Bridge course="セキュリティ基礎 / 脆弱性管理・責任ある開示">
        「セキュリティ基礎」コースでも、CVE ライフサイクル・SECURITY.md/security.txt・IPA→JPCERT/CC の公的ルート・KEV/EPSS を扱っています。本コースはそれを<strong>調査者の実務フロー（発見 → 報告 → 開示）</strong>として運用する視点でまとめました。制度の詳細は基礎コースを参照してください。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "受託は E5 リテストで『修正済/部分対応/未対応/再発』を判定し副作用も確認して締める",
          "個人リサーチは責任ある開示: 非公開で報告→修正猶予→合意の上で公開（悪用・即時全公開はしない）",
          "窓口は security.txt / バグバウンティ・VDP / SECURITY.md、無ければ IPA→JPCERT/CC",
          "広く影響するものは CVE を採番。優先度は CVSS に加え KEV・EPSS も見る",
          "許可なき調査は違法になりうる。発見を対価要求の材料にしない。目的は利用者保護",
        ]}
      />

      <Callout variant="tip" title="コース修了">
        許可 → 偵察 → 調査 → PoC・トリアージ → 報告 → 開示、の一周をやり切りました。技術の派手さより<strong>スコープ・記録・説明責任</strong>が信頼を作ります。まずは自分の環境や許可されたプログラムで、この流れを最後まで通してみてください。
      </Callout>
    </>
  );
}

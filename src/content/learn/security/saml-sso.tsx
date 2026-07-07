import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "saml-sso",
  title: "SAML とシングルサインオン（SSO）",
  description: "XML ベースで認証情報（アサーション）を交換し、ドメインを跨いだ Web SSO を実現する OASIS 標準。IdP/SP、XML 署名、Web Browser SSO Profile、XML 署名ラッピング（XSW）、OIDC との比較を図解で。",
  domain: "security",
  section: "auth",
  order: 6,
  level: "basic",
  tags: ["SAML", "SSO", "IdP", "SP", "アサーション", "XML署名"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        社内で一度ログインすれば、メール・経費精算・勤怠システムに再ログインなしで入れる——この
        <strong>シングルサインオン（SSO）</strong>を、企業で長く支えてきた標準が <strong>SAML（Security Assertion Markup Language）</strong>です。
        SAML は認証情報を <strong>XML のアサーション</strong>として組織間でやり取りし、<strong>ドメインを跨いだ Web ブラウザ SSO</strong> を実現する OASIS 標準です。
      </Lead>

      <Section>登場人物：IdP と SP</Section>
      <p>
        SAML の世界は 2 つの主役で回っています。両者は事前に信頼関係を結んでおきます。
      </p>
      <KVList
        items={[
          { key: "Identity Provider（IdP）", val: "ユーザーを認証し、認証結果（アサーション）を発行する側。認証の元締め（SAML authority）。" },
          { key: "Service Provider（SP）", val: "アサーションを受け取り、それを信頼してサービスを提供する側。各業務アプリ。" },
        ]}
      />
      <p>
        1 つの IdP が多数の SP にアサーションを提供でき、1 つの SP が複数の IdP を信頼することもできます（多対多のフェデレーション）。
        だからこそ「一度のログインで多くのアプリに入れる」SSO が成立します。
      </p>

      <Section>アサーション — SAML の核</Section>
      <p>
        <strong>アサーション（assertion）</strong>は「いつ・どの主体が・どう認証されたか」「どんな属性を持つか」「何が許可されるか」を
        <strong>XML で表した主張</strong>です。3 種類あります。
      </p>
      <ComparisonTable
        headers={["種類", "表すもの"]}
        rows={[
          ["Authentication（認証）", "いつ・どう本人確認されたか"],
          ["Attribute（属性）", "所属・メール・ロールなどのユーザー属性"],
          ["Authorization Decision（認可判断）", "何が許可されるか（実際は SP 側で判断することが多い）"],
        ]}
      />
      <Callout variant="info" title="仕様は層に分かれている">
        SAML 2.0 は複数の仕様に分かれます。<strong>Core</strong>（アサーションの構文と要求応答プロトコル）、
        <strong>Bindings</strong>（HTTP へどう載せるか：HTTP-Redirect / HTTP-POST / Artifact）、
        <strong>Profiles</strong>（具体的なユースケース。最重要が <Cmd>Web Browser SSO Profile</Cmd>）、
        そして <strong>Metadata</strong>（IdP/SP のエンドポイントや証明書を XML で交換し相互接続を容易にする）です。
      </Callout>

      <Section>Web ブラウザ SSO の流れ</Section>
      <p>
        SAML の代表的なユースケースが <strong>Web Browser SSO Profile</strong> です。ユーザーが SP にアクセスすると、
        SP がユーザーを IdP へ送って認証させ、その結果（署名付きアサーション）を受け取ってセッションを確立します。
        <strong>ブラウザが IdP と SP の間を仲介</strong>する点が特徴です。
      </p>
      <SequenceDiagram
        actors={["ユーザー", "SP（サービス）", "IdP（認証元）"]}
        messages={[
          { from: 0, to: 1, label: "① SP にアクセス（未認証）" },
          { from: 1, to: 0, label: "② AuthnRequest を作成しリダイレクト", cta: true },
          { from: 0, to: 2, label: "③ IdP でログイン（必要なら MFA）" },
          { from: 2, to: 0, label: "④ 署名付き SAML Response（アサーション）", cta: true },
          { from: 0, to: 1, label: "⑤ アサーションを SP へ POST" },
          { from: 1, to: 0, label: "⑥ 署名検証 → セッション確立" },
        ]}
        caption="SP → IdP → SP の Web ブラウザ SSO。ブラウザが両者を仲介し、SP が署名を検証して信頼する"
      />

      <Section>セキュリティ — XML 署名と検証</Section>
      <p>
        アサーションは <strong>XML Signature</strong> で署名され、改ざんを検知できます（必要に応じて XML Encryption で暗号化）。
        SP 側は<strong>署名の検証</strong>に加えて、次を厳密に確認する必要があります。
      </p>
      <ul>
        <li><strong>発行者（Issuer）</strong> — 信頼した IdP からのものか</li>
        <li><strong>受信者（Audience）</strong> — 自分（SP）宛てか</li>
        <li><strong>有効期間（NotBefore / NotOnOrAfter）</strong> — 期限内か</li>
        <li><strong>一回限りの使用</strong> — リプレイされていないか</li>
      </ul>

      <SubSection>XML 署名ラッピング（XSW）</SubSection>
      <Callout variant="danger" title="署名した要素と評価する要素をずらす攻撃">
        <strong>XML 署名ラッピング（XSW: XML Signature Wrapping）</strong>は、アサーションの XML 構造を巧妙に操作し、
        <strong>署名が付いている（正当な）要素</strong>と、<strong>SP が実際に評価する（攻撃者が差し込んだ）要素</strong>をずらして、署名検証をすり抜ける古典的攻撃です。
        SP の署名検証ロジックが「どの要素に署名が掛かっているか」を厳密に確認していないと成立します。
        対策は、<strong>署名対象の要素を厳密に特定して評価する</strong>こと、実績ある検証ライブラリを使い自前実装を避けること、スキーマ検証を効かせることです。
        署名なしアサーションの受理や Audience 未検証も、同様に認証バイパスにつながります。
      </Callout>

      <Section>SAML と OIDC の比較</Section>
      <ComparisonTable
        headers={["観点", "SAML 2.0", "OIDC"]}
        rows={[
          ["データ形式", "XML", "JSON / JWT"],
          ["通信スタイル", "ブラウザ経由の POST/Redirect", "REST ベース"],
          ["主戦場", "エンタープライズ Web SSO", "モバイル / SPA / ソーシャルログイン"],
          ["署名", "XML Signature", "JWS（JWT 署名）"],
          ["新規採用", "既存資産で根強い", "おおむね新規はこちら"],
        ]}
      />
      <p>
        SAML は XML の重さやモバイル/SPA との相性の悪さから、新規開発では OIDC が選ばれる傾向にあります。
        一方で、既存のエンタープライズ SSO では依然として広く使われており、<strong>両方に対応する IdP（Okta・Entra ID など）</strong>も多く存在します。
      </p>

      <Bridge course="情報セキュリティ / 分散システム">
        SAML は、講義で学ぶ<strong>信頼された第三者（TTP）を介した連合認証</strong>と<strong>デジタル署名による真正性・完全性の保証</strong>の実装例です。
        IdP を信頼の起点とし、その署名付きアサーションを SP が検証して受け入れる構図は、認証局を頂点とする PKI の信頼モデルと同じ発想です。
        XSW 攻撃は「<strong>署名した対象と、実際に処理する対象が一致しているか</strong>」という、署名検証の本質的な落とし穴を突くもので、
        座学の「メッセージ認証は『何に署名したか』まで含めて検証する必要がある」という原則を、XML の文脈で痛烈に示した例と言えます。
      </Bridge>

      <Divider />

      <Quiz
        question="SAML の Web ブラウザ SSO で、SP が IdP を信頼して本人性を受け入れる根拠は何か？"
        options={[
          "SP が IdP のパスワードを直接検証するから",
          "IdP が発行した XML 署名付きアサーションを SP が検証するから",
          "ブラウザが暗号化されているから",
          "同じドメインを共有しているから",
        ]}
        answer={1}
        explanation="SP は IdP のパスワードを扱いません。IdP がユーザーを認証し、その結果を XML Signature で署名したアサーションとして返し、SP がその署名（と発行者・受信者・有効期間）を検証することで信頼が成立します。ここを甘くすると XSW などで認証バイパスされます。"
      />

      <KeyPoints
        items={[
          "SAML は XML ベースのアサーションでドメインを跨いだ Web SSO を実現する OASIS 標準",
          "IdP が認証してアサーションを発行し、SP が署名を検証して信頼する（多対多のフェデレーション）",
          "最重要は Web Browser SSO Profile。ブラウザが SP と IdP を仲介する",
          "XML 署名ラッピング（XSW）は署名要素と評価要素をずらす攻撃。厳密な署名検証が対策",
          "新規は JSON/JWT ベースの OIDC が主流だが、エンタープライズ SSO では SAML が根強い",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Bridge, Cmd, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram, LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "oidc",
  title: "OpenID Connect（OIDC）",
  description: "OAuth 2.0 の上に認証層を足した標準。ID Token（JWT）・openid スコープ・UserInfo/Discovery/JWKS・nonce/state/iss/aud 検証まで。ID Token と Access Token を混同しないことが要点。",
  domain: "security",
  section: "auth",
  order: 5,
  level: "basic",
  tags: ["OIDC", "OpenID Connect", "ID Token", "認証", "SSO"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        前の記事で「OAuth 2.0 は認可であって認証ではない」と学びました。では「Google でログイン」のような
        <strong>ソーシャルログイン</strong>はどう実現するのでしょうか。その答えが <strong>OpenID Connect（OIDC）</strong>です。
        OIDC は OAuth 2.0 の上に<strong>「認証（本人確認）」の層</strong>を薄く載せた標準で、現代の SSO・ソーシャルログインの基盤になっています。
      </Lead>

      <Section>OAuth に「認証」を足す</Section>
      <p>
        OAuth 2.0 単体では「アクセストークンでリソースにアクセスできる」ことしか保証されず、
        <strong>そのユーザーが誰なのか・いつどう認証されたのか</strong>を標準的に伝える手段がありません。
        OIDC はこれを補い、認証結果を<strong>ID Token</strong>という標準化された形で返します。
      </p>
      <LayerStack
        layers={[
          { label: "OpenID Connect（認証層）", sub: "ID Token で「誰がログインしたか」を伝える" },
          { label: "OAuth 2.0（認可層）", sub: "アクセストークンでリソースアクセスを委譲" },
        ]}
        caption="OIDC は OAuth 2.0 を土台に、その上へ認証（アイデンティティ）層を重ねる"
      />
      <p>
        OAuth の役割はそのまま引き継ぎますが、呼び名が変わります。認可サーバーを <strong>OpenID Provider（OP）</strong>、
        クライアントを <strong>Relying Party（RP）</strong> と呼びます。認証を要求するには、認可リクエストに
        <strong> <Cmd>openid</Cmd> スコープ</strong>を含めます。これが「OAuth ではなく OIDC を使う」というスイッチです。
      </p>

      <Section>ID Token — 認証結果を表す JWT</Section>
      <p>
        <strong>ID Token</strong> は認証結果を表すトークンで、<strong>JWT 形式</strong>で発行され、署名されているため RP が検証できます。
        中には「誰が・いつ・どう認証されたか」を示すクレーム（主張）が入っています。
      </p>
      <KVList
        items={[
          { key: <Cmd>iss</Cmd>, val: "発行者（OP の識別子）。想定した OP からのトークンかを検証する" },
          { key: <Cmd>sub</Cmd>, val: "ユーザーの一意 ID（subject）。RP はこれでユーザーを識別する" },
          { key: <Cmd>aud</Cmd>, val: "受信者（RP のクライアント ID）。自分宛てのトークンかを検証する" },
          { key: <><Cmd>exp</Cmd> / <Cmd>iat</Cmd></>, val: "有効期限・発行時刻" },
          { key: <Cmd>nonce</Cmd>, val: "リプレイ防止用の値。認可要求時に送った値と一致するか検証する" },
          { key: <><Cmd>auth_time</Cmd> / <Cmd>acr</Cmd> / <Cmd>amr</Cmd></>, val: "認証時刻・認証コンテキスト・認証手段（MFA を使ったか等）" },
        ]}
      />

      <Callout variant="danger" title="ID Token と Access Token を混同しない">
        これが OIDC 最大の注意点です。<strong>ID Token は RP がユーザーを識別するためのもの</strong>、
        <strong>Access Token は API 認可のためのもの</strong>で、目的がまったく異なります。
        ID Token を API 認可に使う、Access Token をユーザー識別に使う——といった取り違えは脆弱性の源になります。役割を厳格に分けてください。
      </Callout>

      <Section>認証コードフロー（OIDC）</Section>
      <p>
        もっとも標準的で安全なのは、OAuth の認可コードグラントを基にした<strong>Authorization Code Flow</strong>です。
        違いは、トークン交換時に Access Token と一緒に <strong>ID Token</strong> が返ってくる点です。SPA/モバイルでは PKCE を併用します。
      </p>
      <SequenceDiagram
        actors={["ユーザー(RP)", "RP サーバー", "OpenID Provider"]}
        messages={[
          { from: 0, to: 1, label: "① ログイン開始" },
          { from: 1, to: 2, label: "② openid スコープ付き認可要求" },
          { from: 2, to: 0, label: "③ ログイン & 同意" },
          { from: 2, to: 1, label: "④ 認可コードを返す", cta: true },
          { from: 1, to: 2, label: "⑤ コードでトークン要求" },
          { from: 2, to: 1, label: "⑥ ID Token + Access Token", cta: true },
        ]}
        caption="OIDC 認証コードフロー。トークン交換で ID Token（認証結果）が加わる"
      />

      <Section>補助エンドポイントと機能</Section>
      <KVList
        items={[
          { key: "UserInfo Endpoint", val: "Access Token を提示して、追加のユーザークレーム（名前・メール等）を取得する OIDC 固有のエンドポイント" },
          { key: "Discovery（.well-known/openid-configuration）", val: "OP のエンドポイントや対応機能をメタデータとして自動取得する" },
          { key: "JWKS（jwks_uri）", val: "ID Token の署名検証用の公開鍵セットを公開する。RP はここから鍵を取得して検証する" },
        ]}
      />

      <Section>検証すべきこと</Section>
      <p>
        RP は受け取った ID Token を<strong>必ず検証</strong>します。署名さえ通れば OK、ではありません。次のいずれかが欠けると、
        別 OP／別 RP 向けのトークンの受理や、リプレイを許してしまいます。
      </p>
      <ul>
        <li><strong>署名</strong> — JWKS から取得した公開鍵で検証する</li>
        <li><Cmd>iss</Cmd> — 想定した OP の発行か</li>
        <li><Cmd>aud</Cmd> — 自分（RP）宛てか</li>
        <li><Cmd>exp</Cmd> — 有効期限内か</li>
        <li><Cmd>nonce</Cmd> / <Cmd>state</Cmd> — リプレイ・CSRF 対策。認可要求時に送った値と一致するか</li>
      </ul>

      <Callout variant="tip" title="OIDC と SAML はどう違う？">
        機能は近いですが、OIDC は <strong>JSON/JWT・REST ベース</strong>でモバイル/SPA に向き、
        SAML は <strong>XML ベース</strong>でエンタープライズ Web SSO に根強く残っています。新規はおおむね OIDC が選ばれます（SAML は次の記事で扱います）。
        認証の強度を上げたいときは、OP 側で <strong>MFA</strong> を組み合わせるのが定石です。
      </Callout>

      <Bridge course="情報セキュリティ / 分散システム">
        OIDC は、講義で学ぶ<strong>フェデレーテッド ID（連合認証）</strong>と<strong>デジタル署名による真正性検証</strong>の実装です。
        RP は OP を<strong>信頼された第三者（trusted third party）</strong>として扱い、その署名付き主張（ID Token）を根拠に本人性を受け入れます。
        これは PKI や認証局の「署名を検証して信頼を移譲する」構図と同じ発想です。<Cmd>nonce</Cmd> による<strong>リプレイ攻撃対策</strong>、
        <Cmd>aud</Cmd> による<strong>受信者の限定</strong>は、いずれも座学の「認証プロトコルが満たすべき性質」を具体化したもの。
        「トークンの各クレームを漏れなく検証する」という規律が、そのままプロトコルの安全性を左右します。
      </Bridge>

      <Divider />

      <Quiz
        question="OIDC で「このユーザーは誰か」を RP が識別するために使うべきトークンはどれか？"
        options={[
          "Access Token（API 認可用）",
          "Refresh Token（再発行用）",
          "ID Token（認証結果を表す JWT）",
          "どれでもよい。役割は同じ",
        ]}
        answer={2}
        explanation="ユーザー識別は ID Token の役割です。Access Token は API 認可用で、これでユーザーを識別するのは典型的な誤用（脆弱性源）になります。役割を分けることが OIDC の要点です。"
      />

      <KeyPoints
        items={[
          "OIDC は OAuth 2.0 の上に認証層を載せた標準。openid スコープで認証を要求する",
          "認証結果は ID Token（JWT）で返る。iss/sub/aud/exp/nonce などのクレームを持つ",
          "ID Token（識別用）と Access Token（API 認可用）は目的が違う。混同は脆弱性",
          "UserInfo / Discovery / JWKS で情報取得・自動設定・署名鍵配布を行う",
          "署名・iss・aud・exp・nonce/state をすべて検証する。省略は受理ミスやリプレイを招く",
        ]}
      />
    </>
  );
}

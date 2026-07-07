import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "jwt",
  title: "JWT の仕組みと脆弱性",
  description: "header.payload.signature の 3 部構成、Base64URL で平文が読める（JWS）、登録済みクレーム、HS/RS/ES 署名、そして alg:none や鍵取り違え（HS/RS confusion）という危険と、その防ぎ方まで。",
  domain: "security",
  section: "auth",
  order: 7,
  level: "basic",
  tags: ["JWT", "JWS", "トークン", "alg:none", "署名"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>JWT（JSON Web Token, RFC 7519）</strong>は、クレーム（主張）を JSON で表現し、URL セーフな
        <strong> <Cmd>header.payload.signature</Cmd> の 3 部構成</strong>にコンパクトに詰め込んだトークン形式です。
        OAuth のアクセストークンや OIDC の ID Token の実体としても広く使われます。便利な一方、
        署名検証の実装ミスが致命的な脆弱性を生むため、<strong>仕組みと危険の両方</strong>を正しく理解する必要があります。
      </Lead>

      <Section>構造 — header.payload.signature</Section>
      <p>
        もっとも一般的な <strong>JWS 形式（署名付き）</strong>の JWT は、ピリオド（<Cmd>.</Cmd>）で区切られた 3 つの
        <strong> Base64URL</strong> エンコード部から成ります。
      </p>
      <FlowChain
        nodes={[
          { label: "Header", sub: "alg / typ", variant: "primary" },
          { label: "Payload", sub: "クレーム（可読）", variant: "alt" },
          { label: "Signature", sub: "改ざん検知", variant: "cta" },
        ]}
        caption="header . payload . signature の 3 部構成。ドットで連結された 1 本の文字列になる"
      />
      <Code lang="text" filename="JWT の実体">{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← header（署名アルゴリズム）
.
eyJzdWIiOiIxMjM0IiwibmFtZSI6IlRhcm8ifQ  ← payload（クレーム・可読）
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQ  ← signature（改ざん検知用）`}</Code>
      <KVList
        items={[
          { key: "Header（JOSE ヘッダ）", val: "トークン種別（typ）と署名アルゴリズム（alg）。例：{\"alg\":\"HS256\",\"typ\":\"JWT\"}" },
          { key: "Payload（クレームセット）", val: "クレームの JSON。署名対象だが暗号化はされない（JWS の場合）" },
          { key: "Signature", val: "Header と Payload を alg で署名（または MAC）した値。改ざんがあれば検証に失敗する" },
        ]}
      />

      <Callout variant="warn" title="Payload は「暗号化」されていない — 誰でも読める">
        JWS の Payload は Base64URL でエンコードされているだけで、<strong>暗号化ではありません</strong>。
        誰でもデコードして中身を読めます。署名が保証するのは<strong>改ざん検知（完全性・真正性）</strong>であって、機密性ではありません。
        <strong>パスワードや個人情報などの機密を Payload に入れてはいけません</strong>（機密性が必要なら暗号化する JWE を使います）。
      </Callout>

      <Section>クレーム（Claims）</Section>
      <p>
        Payload に入る各項目をクレームと呼びます。標準で意味が定められた<strong>登録済みクレーム（Registered Claims）</strong>があります。
      </p>
      <KVList
        items={[
          { key: <Cmd>iss</Cmd>, val: "発行者（issuer）" },
          { key: <Cmd>sub</Cmd>, val: "主体（subject＝ユーザー等）" },
          { key: <Cmd>aud</Cmd>, val: "受信者（audience）" },
          { key: <><Cmd>exp</Cmd> / <Cmd>nbf</Cmd> / <Cmd>iat</Cmd></>, val: "有効期限 / 有効開始 / 発行時刻" },
          { key: <Cmd>jti</Cmd>, val: "トークンの一意 ID（リプレイ検知等に）" },
        ]}
      />
      <Code lang="json" filename="payload（デコード後）">{`{
  "iss": "https://auth.example.com",
  "sub": "1234",
  "aud": "my-api",
  "exp": 1720000000,
  "role": "admin"
}`}</Code>

      <Section>署名アルゴリズム — HS / RS / ES</Section>
      <ComparisonTable
        headers={["系統", "方式", "特徴"]}
        rows={[
          ["HS256/384/512", "共通鍵（HMAC）", "署名・検証に同じ秘密鍵を使う。鍵を知る全員が署名も偽造もできる"],
          ["RS256/384/512", "公開鍵（RSA 署名）", "秘密鍵で署名・公開鍵で検証。検証側に秘密を渡さず配布できる（分散向き）"],
          ["ES256/384/512", "公開鍵（ECDSA）", "楕円曲線。RSA より小さい鍵で同等の強度"],
        ]}
      />
      <p>
        マイクロサービスのように「発行はしないが検証だけしたい」サービスが多い構成では、公開鍵を配れば済む
        <strong>RS256 / ES256</strong> が向きます。単一サーバでシンプルに済むなら <strong>HS256</strong> でも構いませんが、鍵の共有範囲に注意します。
      </p>

      <Section>危険① alg:none — 署名を無効化するトークン</Section>
      <Callout variant="danger" title="なぜ危険で、どう防ぐか">
        RFC は署名を無効化する <Cmd>alg: "none"</Cmd>（Unsecured JWT）も定義しています。このとき signature 部は空になります。
        問題は、<strong>検証側が誤ってこれを受け入れてしまう</strong>と、攻撃者が任意の Payload（例：<Cmd>role: admin</Cmd>）を
        <strong>署名なしで偽造</strong>でき、そのまま認証・認可を突破できることです。実装上の典型的な脆弱性源です。
        <br />
        <strong>防ぎ方：</strong>検証時に<strong>許可するアルゴリズムを明示的に固定</strong>し（例：RS256 のみ）、
        <Cmd>none</Cmd> を拒否します。「トークンの <Cmd>alg</Cmd> ヘッダをそのまま信じて検証方式を決める」実装にしないことが肝心です。
      </Callout>

      <Section>危険② 鍵取り違え（HS/RS confusion）</Section>
      <Callout variant="danger" title="公開鍵を HMAC 共通鍵として悪用する攻撃">
        <strong>アルゴリズム混同（alg confusion）</strong>は、RS256 を期待する検証器に対し、攻撃者が <Cmd>alg: HS256</Cmd> のトークンを送りつける攻撃です。
        RS256 の検証器は本来<strong>公開鍵</strong>を持っていますが、<Cmd>alg</Cmd> をトークン任せにしていると、
        検証側がその<strong>公開鍵を HMAC の共通鍵として使って</strong>署名を検証してしまいます。公開鍵は誰でも入手できるため、
        攻撃者はその公開鍵で HS256 署名を作れてしまい、<strong>署名検証を通過</strong>させられます。
        <br />
        <strong>防ぎ方：</strong>ここでも<strong><Cmd>alg</Cmd> をトークン任せにせず、検証側で使う方式を固定</strong>することが根治策です（RS256 を期待するなら RS256 のみを許可）。
      </Callout>

      <Section>その他の実務上の落とし穴</Section>
      <ul>
        <li><strong>弱い HMAC 秘密鍵</strong> — 推測可能な短い鍵はブルートフォースで署名を偽造される。十分に長くランダムに</li>
        <li><strong>失効が困難</strong> — JWT はステートレスで即時失効が難しい。<Cmd>exp</Cmd> を短くし、リフレッシュトークン＋失効リストやイントロスペクションで補う</li>
        <li><strong><Cmd>exp</Cmd>/<Cmd>aud</Cmd>/<Cmd>iss</Cmd> の検証漏れ</strong> — 署名さえ通れば OK とせず、期限切れ・想定外の受信者・別発行者を必ず弾く</li>
      </ul>

      <Bridge course="情報セキュリティ / 暗号理論">
        JWT の署名は、講義で学ぶ<strong>メッセージ認証（完全性・真正性）</strong>の実装です。HS256 は <strong>HMAC</strong>——
        共通鍵とハッシュ関数で「鍵を知る者しか作れないタグ」を付けるもので、機密性（暗号化）ではない点が要注意です。
        RS256/ES256 は<strong>デジタル署名</strong>で、秘密鍵＝署名生成／公開鍵＝検証という非対称性を使います。
        <Cmd>alg:none</Cmd> や HS/RS confusion は、「<strong>検証方式をメッセージ（トークン）自身に決めさせてはならない</strong>」という
        暗号プロトコル設計の鉄則を破ると何が起きるかを示す好例です。座学の「鍵をどこまで配ってよいか」「署名検証は方式まで含めて固定する」が、
        そのまま実装のセキュリティを左右します。
      </Bridge>

      <Divider />

      <Quiz
        question="RS256 を期待する JWT 検証器で「HS/RS confusion（アルゴリズム混同）」攻撃が成立してしまう主因はどれか？"
        options={[
          "Payload を暗号化していないから",
          "検証に使うアルゴリズムをトークンの alg ヘッダ任せにしているから",
          "exp（有効期限）が長すぎるから",
          "Base64URL エンコードが弱いから",
        ]}
        answer={1}
        explanation="検証側が alg をトークン任せにすると、攻撃者が HS256 を指定し、検証器が持つ RSA 公開鍵を HMAC 共通鍵として使わせて署名を通せます。防御は「検証側で許可アルゴリズムを固定する」ことです。alg:none も同じ根で防げます。"
      />

      <KeyPoints
        items={[
          "JWT は header.payload.signature の 3 部構成。各部は Base64URL エンコード",
          "JWS の Payload は暗号化ではなく可読。署名は改ざん検知であって機密性ではない。機密は入れない",
          "登録済みクレーム iss/sub/aud/exp を検証する。署名さえ通れば OK にしない",
          "alg:none は署名なし偽造を許す。許可アルゴリズムを固定して拒否する",
          "HS/RS confusion は公開鍵を HMAC 鍵に悪用する攻撃。alg をトークン任せにしないのが根治",
        ]}
      />
    </>
  );
}

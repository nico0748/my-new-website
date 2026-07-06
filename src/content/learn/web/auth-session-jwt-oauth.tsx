import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "auth-session-jwt-oauth",
  title: "認証の仕組み — Session / JWT / OAuth",
  description: "「誰がログインしているか」を確認する 3 つの代表的な認証方式を、仕組み・メリット・使い分けで比較する。",
  domain: "web",
  section: "backend",
  order: 12,
  level: "basic",
  tags: ["認証", "JWT", "OAuth", "セッション"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        HTTP はステートレス（毎回のリクエストが独立）なため、サーバは「今アクセスしてきたのが誰か」を自力では覚えていません。
        そこで<strong>「誰がログインしているか」を確認する仕組み＝認証</strong>が必要になります。代表的な 3 方式が
        <strong> Session</strong>・<strong>JWT</strong>・<strong>OAuth</strong> です。
      </Lead>

      <Section>前提 — 認証と認可、そしてパスワードの保存</Section>
      <p>
        混同しやすい 2 語をまず分けます。<strong>認証（Authentication）</strong>は「<em>あなたは誰か</em>」を確かめること、<strong>認可（Authorization）</strong>は「<em>その人に何をさせてよいか</em>」を決めることです。ログインは認証、管理者だけ削除できるといった権限判定は認可。この章の 3 方式は主に「認証」を扱いますが、JWT の <Cmd>role</Cmd> クレームや OAuth の <Cmd>scope</Cmd> のように認可情報を運ぶこともあります。
      </p>
      <p>
        そしてどの方式でも土台になるのが<strong>パスワードの安全な保存</strong>です。平文で持つのは論外、単純なハッシュも不十分で、<strong>ソルト付きの遅いハッシュ</strong>（bcrypt / scrypt / Argon2）で保存します。
      </p>

      <Code lang="javascript" filename="password.js">{`import bcrypt from "bcrypt";

// 登録時: ソルト自動生成 + 十分な計算コスト(cost=12)でハッシュ化
const hash = await bcrypt.hash(plainPassword, 12);
// → DB には hash だけ保存。平文は絶対に残さない

// ログイン時: 平文とハッシュを突き合わせる（元に戻すのではない）
const ok = await bcrypt.compare(inputPassword, hash);`}</Code>

      <Bridge course="情報セキュリティ / 暗号理論">
        パスワードハッシュは、暗号理論で学ぶ<strong>一方向性ハッシュ関数</strong>の応用です。「元に戻せない・衝突しにくい」性質を使い、漏洩しても平文が復元されないようにします。<strong>ソルト</strong>は同一パスワードを別ハッシュにしてレインボーテーブル攻撃を無効化し、<strong>ストレッチング（反復による意図的な低速化）</strong>は総当たりのコストを引き上げます。<Cmd>bcrypt.compare</Cmd> が定数時間比較で<strong>タイミング攻撃</strong>を避ける点も、講義のサイドチャネルの話に直結します。認証は「認証（誰か）と認可（何をしてよいか）を分ける」という<strong>脅威モデル</strong>の観点で設計するのが実務の基本です。
      </Bridge>

      <Section>Session 認証</Section>
      <p>
        もっとも古典的で堅牢な方式。ログイン成功時に<strong>サーバ側でセッション情報を保持</strong>し、
        クライアントには推測困難な<strong>セッション ID だけを Cookie で渡します</strong>。以降のリクエストでは Cookie の ID からサーバが状態を復元します。
      </p>

      <Steps>
        <Step title="ログイン">ユーザーが ID/パスワードを送信、サーバが検証</Step>
        <Step title="セッション生成">サーバが状態を保存し、セッション ID を発行</Step>
        <Step title="Cookie で返却"><Cmd>Set-Cookie</Cmd> で ID をブラウザに保存させる</Step>
        <Step title="以降のアクセス">リクエストごとに Cookie の ID を送り、サーバが本人を特定</Step>
      </Steps>

      <Callout variant="tip" title="メリット / デメリット">
        安全・シンプル・ログアウト（セッション破棄）が容易なのが強み。一方でサーバ側に状態を保持するため、
        サーバを複数台に増やすと<strong>セッション共有（Redis 等）が必要でスケールが複雑</strong>になります。会員サイト・管理画面向き。
      </Callout>

      <Section>JWT 認証</Section>
      <p>
        JWT（JSON Web Token）は<strong>署名付きのトークンをクライアント側に保持させる</strong>方式です。
        サーバは状態を持たない（ステートレス）ため、スケールしやすく、分散システム・モバイル・SPA と相性が良いのが特徴。
        リクエストでは <Cmd>Authorization: Bearer &lt;JWT&gt;</Cmd> ヘッダーで送ります。
      </p>

      <SubSection>JWT の構造：header.payload.signature</SubSection>
      <p>JWT は「.（ドット）」で区切られた 3 つの部分から成り、それぞれ Base64URL でエンコードされています。</p>

      <Code lang="text" filename="JWT の 3 部構成">{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← header（署名アルゴリズム）
.
eyJzdWIiOiIxMjM0IiwibmFtZSI6IlRhcm8ifQ  ← payload（ユーザー情報・exp 等）
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQ  ← signature（改ざん検知用の署名）`}</Code>

      <Code lang="json" filename="payload（デコード後）">{`{
  "sub": "1234",
  "name": "Taro",
  "role": "admin",
  "exp": 1720000000
}`}</Code>

      <Callout variant="warn" title="署名と有効期限">
        <strong>signature</strong> により payload が改ざんされていないか検証できます（＝暗号化ではなく「改ざん検知」）。
        <Cmd>exp</Cmd> クレームで有効期限を管理しますが、発行済みトークンの<strong>即時失効が難しい</strong>のが弱点。
        payload は誰でもデコードできるので機密情報は入れず、XSS 対策と HTTPS を徹底します。
      </Callout>

      <SubSection>署名アルゴリズム — HS256 と RS256</SubSection>
      <p>
        署名には大きく 2 系統あります。<strong>HS256</strong> は<strong>共通鍵</strong>（HMAC）で、発行者と検証者が同じ秘密鍵を共有します。<strong>RS256</strong> は<strong>公開鍵暗号</strong>で、<em>秘密鍵で署名し、公開鍵で検証</em>します。マイクロサービスのように「発行はしないが検証だけしたい」サービスが多い場合、公開鍵を配れば済む RS256 が向きます。
      </p>
      <KVList
        items={[
          { key: "HS256（HMAC-SHA256）", val: "共通鍵。単一サーバ・シンプル。鍵を共有する全員が署名も偽造もできる" },
          { key: "RS256（RSA 署名）", val: "秘密鍵で署名・公開鍵で検証。検証側に秘密を渡さずに済む（分散向き）" },
        ]}
      />

      <Bridge course="暗号理論 / 情報セキュリティ">
        JWT の署名は、講義で学ぶ<strong>メッセージ認証（完全性）</strong>の実装です。HS256 は<strong> HMAC</strong>——共通鍵とハッシュ関数で「鍵を知る者しか作れないタグ」を付け、改ざんを検知します（機密性＝暗号化ではない点に注意）。RS256 は<strong>デジタル署名</strong>そのもので、<em>秘密鍵＝署名生成／公開鍵＝検証</em>という公開鍵暗号の非対称性で「本人が発行した」ことと「改ざんされていない」ことを同時に保証します。「鍵をどこまで配ってよいか（共通鍵 vs 公開鍵）」という設計判断が、そのままシステム構成の分散度に対応します。
      </Bridge>

      <Section>OAuth 認証</Section>
      <p>
        OAuth は「Google でログイン」「GitHub でログイン」のように<strong>外部サービスに認可を委任する</strong>仕組みです。
        自社サービスはユーザーのパスワードを一切扱わず、外部の認可サーバーが発行したトークンでリソースにアクセスします。
      </p>

      <SubSection>登場人物</SubSection>
      <ul>
        <li><strong>ユーザー</strong> — ログインしたい本人（リソースオーナー）</li>
        <li><strong>クライアント</strong> — 自社サービス（連携したいアプリ）</li>
        <li><strong>認可サーバー</strong> — Google/GitHub 等。同意を得てトークンを発行</li>
        <li><strong>リソースサーバー</strong> — ユーザー情報などを保持し、トークンで提供</li>
      </ul>

      <SubSection>認可コードフロー（Authorization Code Grant）</SubSection>
      <Steps>
        <Step title="ログイン開始">自社サービスで「Google でログイン」を押す</Step>
        <Step title="リダイレクト">Google の認可サーバーへ遷移し、ユーザーが同意</Step>
        <Step title="認可コード">同意後、認可サーバーが「認可コード」を自社に返す</Step>
        <Step title="トークン取得">自社サーバがコードをアクセストークンに交換</Step>
        <Step title="リソースアクセス">トークンを使ってユーザー情報などを取得</Step>
      </Steps>

      <SequenceDiagram
        actors={["ユーザー", "自社サービス", "認可サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① ログイン" },
          { from: 1, to: 2, label: "② 認可へリダイレクト" },
          { from: 2, to: 0, label: "③ 認可コードを発行", cta: true },
          { from: 0, to: 2, label: "④ コードでトークン要求" },
          { from: 2, to: 1, label: "⑤ アクセストークン", cta: true },
        ]}
        caption="OAuth 認可コードフロー"
      />

      <Callout variant="info" title="OAuth 2.0 の代表的なフロー">
        <Cmd>Authorization Code Grant</Cmd>（Web の標準）／<Cmd>Implicit</Cmd>（現在は非推奨）／
        <Cmd>Client Credentials</Cmd>（サーバ間）／<Cmd>PKCE</Cmd>（SPA・モバイルで認可コードを保護）。
        今は認可コード + PKCE の組み合わせが推奨です。
      </Callout>

      <Section>3 方式の比較</Section>
      <ComparisonTable
        headers={["観点", "Session", "JWT", "OAuth"]}
        rows={[
          ["状態", "サーバが保持（ステートフル）", "クライアントが保持（ステートレス）", "外部の認可サーバーに委任"],
          ["保存場所", "Cookie（ID のみ）", "Cookie / localStorage", "トークンは自社サーバ管理"],
          ["スケール", "共有ストアが必要で複雑", "しやすい", "外部依存"],
          ["失効", "容易（サーバで破棄）", "難しい（exp まで有効）", "トークン失効に対応"],
          ["用途", "会員サイト・管理画面", "API・モバイル・SPA", "外部サービス連携ログイン"],
          ["代表例", "Express + Redis", "Auth0 / 自前 JWT", "Google / GitHub / LINE ログイン"],
        ]}
      />

      <Section>使い分け</Section>
      <ul>
        <li><strong>クローズドな Web アプリ</strong>（社内・会員制）→ <strong>Session</strong></li>
        <li><strong>API・モバイル・SPA</strong>（ステートレスにしたい）→ <strong>JWT</strong></li>
        <li><strong>他サービスと連携</strong>（ソーシャルログイン）→ <strong>OAuth</strong></li>
      </ul>

      <Callout variant="danger" title="共通のセキュリティ対策">
        どの方式でも通信は必ず <strong>HTTPS</strong>。Cookie には <Cmd>HttpOnly</Cmd> と <Cmd>Secure</Cmd>、
        <Cmd>SameSite</Cmd> を付け、XSS・CSRF 対策を徹底します。実運用では Session と JWT、OAuth を組み合わせることも珍しくありません。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "認証は「今アクセスしているのが誰か」を確認する仕組み。HTTP がステートレスだから必要",
          "Session：サーバに状態、Cookie に ID。安全・失効容易だがスケールが複雑",
          "JWT：header.payload.signature の署名付きトークンをクライアント保持。ステートレスで API/SPA 向き",
          "OAuth：外部サービスに認可委任。認可コードフローでトークンを取得（ソーシャルログイン）",
          "使い分けはクローズド Web=Session / API・モバイル=JWT / 外部連携=OAuth。全方式 HTTPS 必須",
        ]}
      />
    </>
  );
}

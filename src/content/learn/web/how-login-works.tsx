import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Figure, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "how-login-works",
  title: "ログインの仕組み — Cookie / Session / JWT / OAuth / OIDC",
  description: "認証は「ログインの仕組み」を積み上げで理解すると分かりやすい。Cookie→Session→JWT→OAuth→OIDC を、身近な例と『私たちがどう触れるか』とともに整理する。",
  domain: "web",
  section: "web-basics",
  order: 7,
  level: "basic",
  tags: ["認証", "ログイン", "OAuth", "OIDC"],
  updated: "2026-07-07",
  minutes: 12,
};

export default function Article() {
  return (
    <>
      <Lead>
        認証（誰がログインしているかを確かめる仕組み）は、用語が多くて難しく見えます。でも
        <strong>「ログインがどう成り立っているか」を順に積み上げて</strong>見ると、一気に分かりやすくなります。
        ここでは <strong>Cookie → Session → JWT → OAuth → OIDC</strong> を、身近な例と「私たちが日常でどう触れているか」とあわせて整理します。
      </Lead>

      <Section>全体像 — 5 つのキーワード</Section>
      <p>まずは「ひとことで何か」と「身近な例」を掴みましょう。詳細はこの後の各節で補足します。</p>
      <ComparisonTable
        headers={["用語", "ひとことで言うと", "身近な例"]}
        rows={[
          ["Cookie", "ブラウザに小さなデータを保存する", "ログイン状態やカートの中身が保たれる"],
          ["Session", "サーバー側で「誰か」を管理する", "放置すると「セッションが切れました」で再ログイン"],
          ["JWT", "認証情報を署名付きトークンにする", "スマホアプリを開き直してもログインしたまま"],
          ["OAuth", "外部サービスにアクセスを許可する（認可）", "「このアプリに写真へのアクセスを許可しますか？」"],
          ["OIDC", "OAuth を拡張した「本人確認」（認証）", "「Google でログイン」で名前・メールが自動で入る"],
        ]}
      />
      <Callout variant="info" title="大きな流れ">
        Cookie と Session は「<strong>同じサイトの中でログインを保つ</strong>」土台。JWT は「<strong>サーバーが状態を持たずに</strong>」保つ工夫（アプリ/API 向け）。
        OAuth と OIDC は「<strong>Google などの別サービスを使ってログイン/連携する</strong>」ための仕組み——と、役割が段階的に広がっていきます。
      </Callout>

      <Section>Cookie — ブラウザに保存する</Section>
      <p>
        HTTP は本来「毎回のリクエストが独立」していて、サーバーは前回のあなたを覚えていません。そこで、サーバーが発行した小さなデータを
        <strong>ブラウザに保存</strong>し、次からのリクエストに自動で付けて送るのが <strong>Cookie</strong> です。これで「ログインしたままの状態」を作れます。
      </p>
      <KVList
        items={[
          { key: "身近な例", val: "「ログイン状態を保持する」にチェックを入れると次回もログイン済み。初訪問時の「Cookie に同意しますか？」バナーや、ブラウザで Cookie を削除するとログアウトするのも Cookie に触れている瞬間" },
        ]}
      />
      <p>詳しくは Web/HTTP の基礎「Cookie とは」で扱っています。</p>

      <Section>Session — サーバー側で管理する</Section>
      <p>
        Cookie に「ユーザー名やパスワード」を直接入れるのは危険です。そこで実際のデータは<strong>サーバー側に保存</strong>し、
        Cookie には<strong>その場所を指す ID（セッション ID）</strong>だけを入れます。ロッカーの「番号札」を持ち歩くイメージです。
      </p>
      <KVList
        items={[
          { key: "身近な例", val: "ログイン後はサーバーが『あなた』を覚えているのでページを移動しても入り直さずに済む。しばらく放置すると「セッションの有効期限が切れました」と出て、もう一度ログインを求められる" },
        ]}
      />
      <p>詳しくは Web/HTTP の基礎「Web のセッションとは」で扱っています。</p>

      <Section>JWT — 認証情報をトークン化する</Section>
      <p>
        Session はサーバーが状態を持つため、サーバーを増やすと共有が面倒になります。そこで、<strong>本人情報と有効期限をまとめ、
        改ざんできないよう署名した「トークン」</strong>を発行し、それをクライアントに持たせるのが <strong>JWT</strong>（JSON Web Token）です。
        サーバーは署名を検証するだけで本人確認でき、状態を持たなくて済みます（ステートレス）。
      </p>
      <Code lang="text" filename="JWT（3つの部分）">{`eyJhbGci...   ← ヘッダー（署名方式）
.
eyJzdWIi...   ← ペイロード（ユーザーID・有効期限など）
.
SflKxwRJ...   ← 署名（改ざん検知用）`}</Code>
      <KVList
        items={[
          { key: "身近な例", val: "スマホアプリを閉じて開き直してもログインしたまま（トークンを端末に保存している）。開発時の Authorization: Bearer <トークン> ヘッダーとして、SPA/モバイルの裏側で使われている" },
        ]}
      />
      <Callout variant="warn" title="署名は「暗号化」ではない">
        JWT のペイロードは<strong>誰でもデコードして読めます</strong>（署名は改ざん検知のためであって秘匿ではない）。パスワードなど秘密情報は入れないこと。
      </Callout>

      <Section>OAuth — Google ログインなど（許可＝認可）</Section>
      <p>
        「新しいサービスに、Google アカウントの情報を使わせたい」とき、<strong>パスワードを相手アプリに渡さずに</strong>、
        「この範囲だけ使ってよい」と<strong>許可（認可）を委譲</strong>するのが <strong>OAuth</strong> です。ホテルの「客室だけ開くカードキー」を渡す感覚——
        マスターキー（パスワード）は渡しません。
      </p>
      <KVList
        items={[
          { key: "身近な例", val: "新規サービスで「このアプリがあなたの Google カレンダーにアクセスします。許可しますか？」の同意画面。写真アプリの『写真へのアクセスを許可』や、外部ツールと『GitHub と連携』するときの承認ボタンで触れている" },
        ]}
      />
      <Figure
        src="/learn/shots/web/how-login-works-01.svg"
        alt="「Google でログイン」を押したときに表示される Google の同意画面"
        caption="この同意画面こそが OAuth の本体。「何を許可するか」がここに列挙され、押した瞬間に権限が委譲される。"
      />
      <Callout variant="info" title="OAuth は本来『認可』のための仕組み">
        OAuth が渡すのは「<strong>何にアクセスしてよいか</strong>」という<strong>権限</strong>であって、「<strong>あなたが誰か</strong>」を確かめる認証は本来の目的ではありません。
        ここを埋めるのが次の OIDC です。
      </Callout>

      <Section>OIDC — OAuth を拡張した「本人確認」（認証）</Section>
      <p>
        <strong>OIDC（OpenID Connect）</strong>は、OAuth 2.0 の上に<strong>「本人確認（認証）」の標準</strong>を乗せたものです。
        OAuth の認可フローに加えて、<strong>ID トークン</strong>（本人情報が入った JWT）を発行します。これにより、アプリは
        「この人は確かに Google の◯◯さん」と<strong>身元</strong>を受け取れます。世の中の「◯◯でログイン」の多くは、実はこの OIDC です。
      </p>
      <SequenceDiagram
        actors={["あなた", "アプリ", "Google"]}
        messages={[
          { from: 0, to: 1, label: "① 「Google でログイン」を押す" },
          { from: 1, to: 2, label: "② Google の同意画面へ" },
          { from: 2, to: 0, label: "③ 許可すると ID トークンを発行", cta: true },
          { from: 0, to: 1, label: "④ ID トークンをアプリへ" },
          { from: 1, to: 1, label: "⑤ 検証して本人確認・ログイン完了", cta: true },
        ]}
        caption="「Google でログイン」の裏側（OIDC）：本人情報が入った ID トークンを受け取る"
      />
      <KVList
        items={[
          { key: "身近な例", val: "「Google でログイン」した瞬間に名前・メール・アイコンがプロフィールに自動で入る。新規登録でパスワードを作らず、Google / Apple / LINE のアカウントでそのまま始められる" },
        ]}
      />
      <Callout variant="tip" title="OAuth と OIDC の違いを一言で">
        <strong>OAuth ＝「何をしてよいか」の許可（認可）</strong>、<strong>OIDC ＝「あなたは誰か」の確認（認証）</strong>。
        OIDC は OAuth の仕組みを使いつつ、ID トークンで<strong>本人確認</strong>を足したもの、と押さえると混乱しません。
      </Callout>

      <Section>つながりと使い分け</Section>
      <ComparisonTable
        headers={["仕組み", "状態の本体を持つのは", "主な用途", "認証 / 認可"]}
        rows={[
          ["Cookie + Session", "サーバー（ブラウザの Cookie は ID 札のみ）", "同一サイト内のログイン維持", "認証の土台"],
          ["JWT", "クライアント（状態はトークンの中）", "API・SPA・モバイル", "認証（ステートレス）"],
          ["OAuth 2.0", "認可サーバー", "他サービスへのアクセス許可", "認可"],
          ["OIDC", "認可サーバー（IDトークン）", "他サービスの ID でログイン", "認証"],
        ]}
      />
      <SubSection>迷ったときの選び方</SubSection>
      <ul>
        <li>自分のサイト内のログイン → <strong>Cookie + Session</strong>（手堅い）</li>
        <li>API・モバイル・SPA でステートレスにしたい → <strong>JWT</strong></li>
        <li>他サービスのデータにアクセスしたい → <strong>OAuth</strong></li>
        <li>「◯◯でログイン」で本人確認したい → <strong>OIDC</strong></li>
      </ul>
      <p>各方式の実装レベルの詳細は、バックエンドの「認証の仕組み — Session / JWT / OAuth」、API の「API の認証・認可」で扱っています。</p>

      <Bridge course="情報セキュリティ（認証と認可・信頼境界）">
        この節で最重要なのは<strong>認証（Authentication＝誰か）と認可（Authorization＝何をしてよいか）の区別</strong>です。講義で学ぶ通り、両者は別物で、
        OAuth は認可、OIDC は認証に対応します。パスワードを相手に渡さず<strong>限定した権限だけを委譲</strong>する OAuth は<strong>最小権限の原則</strong>の実践であり、
        「秘密は渡さない・トークンは短命に」という設計は<strong>信頼境界</strong>の線引きそのもの。私たちが毎日押している「◯◯でログイン」ボタンの裏に、この原則が働いています。
      </Bridge>

      <Quiz
        question={<>「Google でログイン」で、アプリがあなたの<strong>名前やメール（本人情報）</strong>を受け取れるのは、主にどの仕組みのおかげ？</>}
        options={[
          <>Cookie</>,
          <>OAuth（認可）だけ</>,
          <>OIDC（OAuth を拡張した認証）</>,
          <>Session</>,
        ]}
        answer={2}
        explanation={<>OAuth は「アクセスの許可（認可）」まで。そこに<strong>本人確認（認証）</strong>と ID トークンを足したのが <strong>OIDC</strong> で、名前・メールなどの身元情報を受け取れます。「◯◯でログイン」の多くは OIDC です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "認証は「ログインの仕組み」を Cookie→Session→JWT→OAuth→OIDC と積み上げて理解する",
          "Cookie=ブラウザに保存 / Session=サーバーで管理（Cookieには番号札のIDだけ）",
          "JWT=署名付きトークンをクライアントが持つ（ステートレス。ペイロードは読めるので秘密は入れない）",
          "OAuth=許可（認可）の委譲、OIDC=OAuthを拡張した本人確認（認証）。ID トークンで身元を受け取る",
          "『◯◯でログイン』は多くが OIDC。認証と認可の区別が全体を貫く鍵",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, KVList, Bridge, TipBox, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "api-auth",
  title: "API の認証・認可 — API キー / OAuth2 / JWT",
  description: "認証と認可の違いを整理し、API キー・Bearer トークン・JWT 検証・OAuth2 フロー・スコープ・リフレッシュトークンを解説する。",
  domain: "web",
  section: "api",
  order: 3,
  level: "basic",
  tags: ["API", "認証", "JWT"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        API を守るには「誰なのか」を確かめる<strong>認証</strong>と、「何をしてよいか」を決める<strong>認可</strong>の 2 段構えが要ります。API キー・Bearer トークン・JWT・OAuth2 という定番の道具を、使い分けまで含めて整理します。
      </Lead>

      <Section>認証 vs 認可</Section>
      <ComparisonTable
        headers={["", "認証 (Authentication)", "認可 (Authorization)"]}
        rows={[
          ["問い", "あなたは誰か？", "その操作をしてよいか？"],
          ["確認するもの", "本人性（ID / トークン）", "権限（ロール / スコープ）"],
          ["失敗時", "401 Unauthorized", "403 Forbidden"],
        ]}
      />
      <p>認証が通っても認可で弾かれることはあります（ログイン済みだが管理者専用 API を叩いた等）。この 2 つは必ず分けて考えます。</p>
      <Bridge course="情報セキュリティ / アクセス制御・最小権限">
        セキュリティの授業で習う<strong>AAA（Authentication・Authorization・Accounting）</strong>のうち、API が主に扱うのが前 2 つです。「主体（subject）が客体（object）に対しどんな操作（action）を許されるか」という<strong>アクセス制御モデル</strong>そのもの。<strong>最小権限の原則（least privilege）</strong>——各主体には必要最小限の権限だけ与える——は、後述のスコープ設計に直結します。認証は「主体の同定」、認可は「アクセス制御行列の参照」だと対応づけると、講義の抽象論と実務がきれいにつながります。
      </Bridge>

      <Section>API キー</Section>
      <p>
        もっとも単純な方式。事前に発行した文字列をリクエストに載せて本人性を示します。実装が簡単な反面、キー自体が漏れると誰でもなりすませるため、<strong>サーバ間通信</strong>やアクセス制限の緩い読み取り API 向けです。
      </p>
      <Code lang="http" filename="api key">{`GET /v1/weather?city=tokyo HTTP/1.1
Host: api.example.com
X-API-Key: sk_live_9f2c8a1b7e4d`}</Code>
      <Callout variant="warn" title="キーの扱い">
        API キーはクライアント JavaScript に埋め込まない（誰でも見える）こと。フロントから使う場合は自前のバックエンドを経由させ、キーはサーバ側に隠します。
      </Callout>
      <TipBox>
        発行側は API キーを<strong>平文で DB に保存しない</strong>のが定石です。パスワードと同じく<strong>ハッシュ化して保存</strong>し、照合時は「送られてきたキーをハッシュして一致を見る」だけにします。こうすれば DB が漏れてもキー本体は復元できません。「秘密は復元可能な形で持たない」——暗号でいう一方向ハッシュの使いどころです。
      </TipBox>

      <Section>Authorization: Bearer トークン</Section>
      <p>
        ユーザー認証で主流なのが Bearer 方式。ログインで得たトークンを <Cmd>Authorization</Cmd> ヘッダに載せます。「これを持っている者（bearer）に権限を与える」という意味です。
      </p>
      <Code lang="http" filename="bearer">{`GET /v1/me HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.abc`}</Code>

      <Section>JWT の検証</Section>
      <p>
        JWT（JSON Web Token）は <Cmd>ヘッダ.ペイロード.署名</Cmd> の 3 つを <Cmd>.</Cmd> でつないだトークンです。ペイロードにはユーザー ID や有効期限が入っていて、<strong>署名を検証すればサーバは DB を引かずに正当性を確認</strong>できます。
      </p>
      <Code lang="json" filename="JWT payload (decoded)">{`{
  "sub": "42",           // ユーザー ID
  "scope": "read write", // 認可スコープ
  "iat": 1751875200,     // 発行時刻
  "exp": 1751878800      // 有効期限（これを過ぎたら無効）
}`}</Code>
      <Callout variant="danger" title="検証で必ず見る 3 点">
        (1) <Cmd>alg</Cmd> が想定通りか（<Cmd>none</Cmd> を拒否する）、(2) 署名が発行者の鍵で正しく検証できるか、(3) <Cmd>exp</Cmd> が切れていないか。ペイロードは Base64 なので<strong>誰でも読める</strong>ことを忘れず、機微情報を入れないこと。
      </Callout>

      <SubSection>署名 = 改ざん検知の仕組み</SubSection>
      <p>
        JWT が「DB を引かずに正当性を確認できる」のは、末尾の署名のおかげです。署名は <Cmd>署名 = 関数(ヘッダ.ペイロード, 秘密鍵)</Cmd> で計算されます。攻撃者がペイロードを 1 文字でも書き換えると署名が合わなくなり、鍵を持たない限り正しい署名を作り直せません。だからサーバは「署名が合う＝発行者が確かに作り、以後改ざんされていない」と判断できます。
      </p>
      <KVList
        items={[
          { key: "HMAC（HS256）", val: "共通鍵。発行者と検証者が同じ秘密鍵を共有。自前サービス内で完結するとき" },
          { key: "公開鍵署名（RS256 / ES256）", val: "秘密鍵で署名し、公開鍵で検証。検証側に秘密鍵を渡さずに済む。複数サービスや外部連携向け" },
        ]}
      />
      <Bridge course="暗号理論 / MAC・デジタル署名・ハッシュ関数">
        JWT の署名は、暗号の授業で習う 2 つの道具のどちらかです。HS256 は<strong>MAC（メッセージ認証コード）</strong>＝共通鍵ハッシュで、「鍵を知る者だけが正しいタグを作れる」性質で完全性と認証を同時に保証します。RS256 は<strong>デジタル署名</strong>＝公開鍵暗号で、秘密鍵で署名・公開鍵で検証という非対称性を使います。「<Cmd>alg: none</Cmd> を拒否せよ」という警告は、暗号系で最も基本的な<strong>ダウングレード攻撃（アルゴリズム混同攻撃）</strong>そのもの——攻撃者に暗号方式を選ばせてはいけない、という原則の実例です。
      </Bridge>
      <Callout variant="warn" title="ステートレスの代償 — 即時失効ができない">
        署名を検証するだけで済む＝サーバは状態を持たない（ステートレス）のが JWT の利点ですが、裏返すと<strong>「盗まれたトークンを即座に無効化できない」</strong>という弱点になります。<Cmd>exp</Cmd> が切れるまで有効なので、寿命を短くする・失効リスト（ブラックリスト）を別途持つ、といった対策が要ります。ここも「ステートレスにした分の代償を別の仕組みで払う」という設計トレードオフです。
      </Callout>

      <Section>OAuth2 フロー</Section>
      <p>
        「あるサービスのアカウントで別のサービスにログイン／アクセスを許可する」仕組みが OAuth2 です。もっとも標準的な認可コードフロー（＋ PKCE）はこう進みます。
      </p>
      <Steps>
        <Step title="認可リクエスト">
          ユーザーをプロバイダの認可画面へリダイレクトする。<Cmd>client_id</Cmd> と要求スコープ、<Cmd>redirect_uri</Cmd> を付ける。
        </Step>
        <Step title="同意">
          ユーザーが「このアプリに許可する」を承認する。
        </Step>
        <Step title="認可コード発行">
          プロバイダが <Cmd>redirect_uri</Cmd> に短命の認可コードを付けて戻す。
        </Step>
        <Step title="トークン交換">
          アプリのサーバが認可コードとシークレットを送り、アクセストークンとリフレッシュトークンを受け取る。
        </Step>
        <Step title="API 呼び出し">
          アクセストークンを Bearer で載せて保護された API を叩く。
        </Step>
      </Steps>

      <SequenceDiagram
        actors={["クライアント", "認可サーバー", "リソースサーバー"]}
        messages={[
          { from: 0, to: 1, label: "① 認可リクエスト" },
          { from: 1, to: 0, label: "② アクセストークン発行", cta: true },
          { from: 0, to: 2, label: "③ Bearer トークンで API 呼び出し" },
          { from: 2, to: 0, label: "④ 保護リソースを返す", cta: true },
        ]}
        caption="トークンを使った API 認可の流れ"
      />

      <Section>スコープで認可を絞る</Section>
      <p>
        トークンには<strong>スコープ</strong>（許可する操作の範囲）を持たせます。<Cmd>read:profile</Cmd> しか持たないトークンで書き込み API を叩けば 403 を返す、という具合に最小権限を徹底します。
      </p>
      <Code lang="text" filename="scope の設計例">{`read:profile      # プロフィール閲覧のみ
write:profile     # プロフィール編集
read:orders       # 注文履歴の閲覧
admin:users       # ユーザー管理（管理者専用）`}</Code>
      <p>
        「連携アプリにはプロフィール読み取りだけ許可する」なら <Cmd>read:profile</Cmd> だけを渡します。仮にそのアプリのトークンが漏れても、被害はプロフィール閲覧に限定され、注文も削除もされません。<strong>権限を細かく分ける＝被害の上限（爆発半径）を小さくする</strong>という設計です。
      </p>
      <Bridge course="情報セキュリティ / 最小権限・権限昇格・多層防御">
        スコープは<strong>最小権限の原則</strong>を API に落とし込んだものです。授業で扱う「権限を絞れば、たとえ一部が侵害されても被害が広がらない（爆発半径の縮小）」という考え方そのもの。過剰なスコープを与えると<strong>権限昇格</strong>の踏み台になります。アクセストークン短命化・スコープ最小化・失効の 3 段を重ねるのは、単一の防御に頼らず層で守る<strong>多層防御（defense in depth）</strong>——講義のセキュリティ設計原則が、そのまま認可設計のチェックリストになります。
      </Bridge>

      <Section>アクセストークンとリフレッシュトークン</Section>
      <ComparisonTable
        headers={["", "アクセストークン", "リフレッシュトークン"]}
        rows={[
          ["用途", "API 呼び出しに使う", "アクセストークンの再発行"],
          ["寿命", "短命（数分〜1 時間）", "長命（日〜週）"],
          ["漏洩時の被害", "小さい（すぐ失効）", "大きい（安全に保管）"],
        ]}
      />
      <p>
        アクセストークンをあえて短命にし、切れたらリフレッシュトークンで裏側で更新します。こうすると万一アクセストークンが漏れても被害を短時間に抑えられます。リフレッシュトークンは <Cmd>HttpOnly</Cmd> Cookie など安全な場所に保管します。
      </p>

      <Callout variant="info" title="バックエンド側の実装と合わせて読む">
        トークンの発行・保管・失効といったサーバ側の実装は backend 章の認証記事で扱います。本記事は「API 越しに認証・認可がどう見えるか」を中心に整理しました。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "認証（誰か＝401）と認可（何ができるか＝403）は必ず分けて考える",
          "API キーはサーバ間通信向け。クライアントに埋め込まない",
          "ユーザー認証は Authorization: Bearer が主流",
          "JWT は署名・alg・exp を検証。ペイロードは誰でも読めるので機微情報は入れない",
          "OAuth2 認可コードフローで他サービスの認可を安全に受け取る",
          "アクセストークンは短命、リフレッシュトークンで更新して被害を抑える",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "web-session",
  title: "Web のセッションとは",
  description: "ステートレスな HTTP でユーザーの状態を保つ仕組み。サーバーサイド/クライアントサイドの方式、セッション ID、セキュリティ対策を扱う。",
  domain: "web",
  section: "web-basics",
  order: 6,
  level: "basic",
  tags: ["セッション", "Cookie", "認証"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        HTTP はリクエストごとに独立した「ステートレス」なプロトコルです。それでもログインしたまま買い物を続けられるのは、サーバ側で「誰の・どんな状態か」を保持する仕組み <strong>セッション</strong> があるから。Cookie と組み合わせて、ステートレスな世界に「継続」を持ち込む方法を見ていきます。
      </Lead>

      <Section>なぜセッションが必要か</Section>
      <p>
        HTTP はステートレスなので、サーバは前回のリクエストを覚えていません。ログイン状態・カートの中身・CSRF トークンといった「継続する情報」を保つには、状態を保持する仕組みが別途必要です。それがセッションです。
      </p>
      <p>
        Cookie が「状態の<strong>運び役</strong>」だとすれば、セッションは「状態の<strong>置き場所と管理</strong>」です。両者は役割が違い、実務ではほぼ必ずセットで使われます。Cookie にセッション ID を載せて運び、その ID をキーにサーバ側の実データ（ログインユーザーは誰か・カートの中身は何か）を引き当てる——この分担がセッションの核心です。
      </p>

      <Section>セッションの流れ</Section>
      <p>
        セッションは、サーバが発行する<strong>セッション ID</strong> を Cookie で持ち回ることで成立します。ID 自体には意味はなく、サーバ側に保存された実データを引き当てる「鍵」の役割を果たします。
      </p>
      <Steps>
        <Step title="1. セッション開始">
          ユーザーがアクセスすると、サーバがセッションを開始する。
        </Step>
        <Step title="2. セッション ID を付与">
          推測困難なランダム値の ID を発行し、対応する状態をサーバ側に保存する。
        </Step>
        <Step title="3. Cookie で返す">
          <Cmd>Set-Cookie</Cmd> で ID をブラウザに渡す。
        </Step>
        <Step title="4. 以降 ID を送信">
          ブラウザはリクエストのたびに ID を自動で送る。
        </Step>
        <Step title="5. 状態を復元">
          サーバは受け取った ID から保存済みの状態を引き当て、ログイン状態などを復元する。
        </Step>
      </Steps>
      <SequenceDiagram
        actors={["ブラウザ", "サーバー", "セッションストア"]}
        messages={[
          { from: 0, to: 1, label: "① ログイン" },
          { from: 1, to: 2, label: "② セッション生成・保存" },
          { from: 1, to: 0, label: "③ Cookie でセッション ID を返す", cta: true },
          { from: 0, to: 1, label: "④ 以降 ID を送信" },
          { from: 1, to: 2, label: "⑤ ID で状態を復元" },
        ]}
        caption="セッション ID でユーザーの状態を維持する"
      />

      <Section>2 つの保持方式</Section>
      <p>
        状態を「どこに持つか」で 2 方式に分かれます。サーバに実データを置く方式と、署名付きトークンにデータを載せてクライアントに持たせる方式です。
      </p>
      <ComparisonTable
        headers={["方式", "状態の保存先", "特徴"]}
        rows={[
          ["サーバーサイド", "Redis / DB（サーバ側）", "失効が容易・安全。スケール時に共有ストアが必要"],
          ["クライアントサイド", "JWT（クライアント側）", "サーバに状態を持たずスケールしやすい。失効が難しい"],
        ]}
      />

      <Section>状態はどこに永続化するか — メモリ・DB・Redis</Section>
      <p>
        サーバーサイド方式で最初に迷うのが「セッションデータの置き場所」です。素朴に<strong>アプリのメモリ上</strong>に持つと実装は簡単ですが、サーバを再起動したら全員ログアウトしてしまいます。そこで実務では、状態を外部のストアに<strong>永続化</strong>します。
      </p>
      <ComparisonTable
        headers={["保存先", "速度 / 永続性", "使いどころ"]}
        rows={[
          ["プロセスメモリ", "速いが再起動で消える", "開発・学習用。本番には不向き"],
          ["RDB（PostgreSQL 等）", "永続・堅牢だがやや遅い", "監査ログも兼ねたい・件数が少ない"],
          ["Redis（インメモリKVS）", "非常に高速・TTL で自動失効", "本番の定番。大量アクセスに耐える"],
        ]}
      />
      <Code lang="js" filename="app.js">{`// Express + Redis でセッションストアを外出しする
import session from "express-session";
import { RedisStore } from "connect-redis";

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  cookie: { httpOnly: true, secure: true, maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
}));`}</Code>
      <Bridge course="データベース">
        セッションストアの選択は、講義で学ぶ<strong>永続化・トランザクション・インデックス</strong>の実践です。とくに Redis がセッションで好まれる理由は、<strong>「キー（セッション ID）から値（状態）を O(1) で引ける」</strong>というハッシュ表的な性質と、<Cmd>TTL</Cmd>（有効期限）を設定すれば期限切れを DB 側が自動で消してくれる点にあります。「頻繁に読み書きされ、多少消えても致命的でないデータ」をインメモリ KVS に、「消えては困るデータ」を RDB に、と<strong>データの性質でストアを使い分ける</strong>のはデータベース設計の基本判断です。
      </Bridge>

      <Section>スケールとステートフル / ステートレス</Section>
      <p>
        アクセスが増えてサーバを複数台に増やす（水平スケール）と、セッションの置き場所が一気に問題になります。<strong>サーバ A のメモリにだけセッションを持っている</strong>と、次のリクエストがサーバ B に振り分けられた瞬間「そんなユーザー知らない」となってログインが切れてしまうからです。
      </p>
      <KVList
        items={[
          { key: "共有ストア方式", val: "全サーバが同じ Redis を見る。どのサーバに来ても状態を引ける（サーバ自体はステートレスに保てる）" },
          { key: "スティッキーセッション", val: "同じユーザーは常に同じサーバへ振る。手軽だが負荷が偏り、そのサーバが落ちると失われる" },
          { key: "JWT（状態を持たない）", val: "状態をトークン側に載せ、サーバはどこも状態を持たない。スケールは最強だが失効が難しい" },
        ]}
      />
      <Bridge course="分散システム">
        「サーバを増やしたらログインが切れる」問題は、講義で扱う<strong>ステートフル vs ステートレス</strong>のトレードオフそのものです。状態を各サーバが抱える（ステートフル）と水平スケールが難しく、状態を外部ストアやトークンに追い出して<strong>アプリサーバをステートレスにする</strong>ほどスケールしやすくなる——これはロードバランサ・水平スケーリング・可用性設計の根本原理です。JWT が「サーバに状態を持たせない」ことでスケールする一方、「一度発行したら失効できない」という<strong>整合性 vs 可用性</strong>のジレンマを抱えるのも、分散システムで習う CAP 的な発想と地続きです。
      </Bridge>

      <Section>セッション ID の扱い</Section>
      <p>
        セッション ID は<strong>推測困難なランダム値</strong>でなければなりません。ID が推測・窃取されると、そのままなりすましにつながるためです。保存場所には次の選択肢があります。
      </p>
      <KVList
        items={[
          { key: "Cookie", val: "標準的な方法。HttpOnly・Secure と併用する" },
          { key: "URL", val: "履歴やログに残りやすく非推奨" },
          { key: "ヘッダー", val: "API / SPA でよく使う（Authorization 等）" },
        ]}
      />

      <Section>ライフサイクルとタイムアウト</Section>
      <p>
        セッションは<strong>生成 → 利用 → 終了</strong>のライフサイクルを持ちます。放置されたセッションを残し続けるとリスクになるため、タイムアウトを設けます。
      </p>
      <ul>
        <li><strong>アイドルタイムアウト</strong> — 一定時間操作がなければ失効させる</li>
        <li><strong>絶対タイムアウト</strong> — 発行からの経過時間で強制失効させる</li>
      </ul>

      <Section>セキュリティ対策</Section>
      <SubSection>代表的な脅威と防御</SubSection>
      <ul>
        <li><strong>セッションハイジャック</strong> — 通信の盗聴で ID を奪われる。<Cmd>HTTPS</Cmd> で通信を暗号化する</li>
        <li><strong>XSS 経由の窃取</strong> — スクリプトで Cookie を読まれる。<Cmd>HttpOnly</Cmd> でアクセスを封じる</li>
        <li><strong>セッション固定攻撃</strong> — 攻撃者が用意した ID を使わせる。<strong>ログイン時に ID を再生成</strong>する</li>
        <li><strong>放置セッションの悪用</strong> — 適切なタイムアウトで失効させる</li>
      </ul>
      <SubSection>セッション固定攻撃はなぜ「ID 再生成」で防げるのか</SubSection>
      <p>
        セッション固定（session fixation）は、攻撃者が<strong>あらかじめ知っている ID</strong>を被害者に使わせ、被害者がその ID でログインしたところを乗っ取る攻撃です。ポイントは「攻撃者は ID を先に知っている」こと。だから<strong>ログイン成功の瞬間に ID を作り直せば</strong>、攻撃者が握っていた古い ID はただの無効な文字列になり、攻撃が成立しません。認証状態が変わるタイミングで ID を切り替える、という一手が効きます。
      </p>
      <Code lang="js" filename="login.js">{`// ログイン成功時に ID を再生成する（固定攻撃対策）
req.session.regenerate((err) => {
  if (err) return next(err);
  req.session.userId = user.id;  // 新しい ID に認証情報を紐づける
});`}</Code>
      <Bridge course="情報セキュリティ">
        セッションの脅威は、講義で学ぶ<strong>認証（Authentication）・なりすまし・多層防御</strong>の教材そのものです。セッション ID は「ログイン後の自分を証明するトークン」なので、<strong>推測困難（十分なエントロピー）でなければならない</strong>——これは暗号論的乱数の講義がそのまま実務要件になっている例です。「盗聴 → HTTPS」「XSS → HttpOnly」「CSRF → SameSite」「固定 → 再生成」と、<strong>脅威モデルごとに対策を対応付けて設計する</strong>思考は、セキュリティ設計の基本作法です。
      </Bridge>

      <Callout variant="tip" title="実装のイメージ">
        サーバーサイドなら Express + Redis でセッションストアを用意する構成が定番です。ステートレスにスケールさせたい API では、署名付きの JWT を発行してクライアントに持たせる方式が使われます。両者は排他ではなく、<strong>「短命な JWT ＋ サーバ側で管理するリフレッシュトークン」</strong>のように組み合わせて、スケールと失効の両立を狙う設計もよく採られます。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "ステートレスな HTTP で状態を保つため、サーバ側にセッションを持つ（Cookie が運び役、セッションが管理役）",
          "セッション ID を Cookie で持ち回り、ID から状態を復元する",
          "実データの置き場所は用途で選ぶ。本番は TTL で自動失効できる Redis が定番",
          "サーバーを複数台にすると共有ストア or JWT が必要（ステートフル vs ステートレスのトレードオフ）",
          "HTTPS・HttpOnly・ログイン時の ID 再生成・適切なタイムアウトで守る",
        ]}
      />
    </>
  );
}

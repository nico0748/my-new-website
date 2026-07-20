import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, Figure, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "session-management",
  title: "セッション管理と攻撃",
  description: "セッション ID と Cookie 属性（HttpOnly/Secure/SameSite）、セッションハイジャックと固定化（session fixation）、そしてログイン後のセッション ID 再生成という根治策までを図解で押さえる。",
  domain: "security",
  section: "auth",
  order: 3,
  level: "basic",
  tags: ["セッション", "Cookie", "セッション固定", "ハイジャック", "HttpOnly"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        HTTP はステートレスなので、ログイン状態を保つには<strong>セッション</strong>が必要です。
        サーバはログイン後に<strong>セッション ID</strong>を発行し、以降のリクエストではその ID から本人を特定します。
        この「小さな鍵」であるセッション ID をいかに守るかが、セッション管理のセキュリティの中心テーマです。
      </Lead>

      <Section>セッション ID とは何か</Section>
      <p>
        セッション ID は、サーバ側に保持した「誰がログイン中か」という状態への<strong>推測困難な鍵</strong>です。
        クライアントには ID だけを Cookie で渡し、実データ（ユーザー情報・権限など）はサーバ側に置くのが基本設計です。
        ID が漏れたり推測できたりすれば、そのまま<strong>なりすまし</strong>に直結するため、次の性質が求められます。
      </p>
      <KVList
        items={[
          { key: "推測困難", val: "CSPRNG（暗号論的乱数）で十分なエントロピー（128bit 以上）を持たせる" },
          { key: "秘匿", val: "盗聴・XSS・改ざんから守る（Cookie 属性で防御）" },
          { key: "適切な寿命", val: "アイドルタイムアウトと絶対タイムアウトで有効時間を限定する" },
        ]}
      />

      <Section>Cookie 属性でセッション ID を守る</Section>
      <p>
        セッション ID は多くの場合 Cookie で運ばれます。Cookie に付ける 3 つの属性が、それぞれ別の攻撃を防ぎます。
        <strong>どの属性がどの攻撃に効くか</strong>を対応付けて覚えるのがコツです。
      </p>
      <ComparisonTable
        headers={["属性", "何をする", "防げる攻撃"]}
        rows={[
          [<Cmd>HttpOnly</Cmd>, "JavaScript から Cookie を読めなくする", "XSS による ID の窃取"],
          [<Cmd>Secure</Cmd>, "HTTPS 通信でのみ送信する", "盗聴（平文で ID が流れるのを防ぐ）"],
          [<Cmd>SameSite</Cmd>, "他サイト起点の送信を制限する", "CSRF（意図しない自動送信）"],
        ]}
      />
      <Code lang="http" filename="Set-Cookie">{`Set-Cookie: session_id=9f2b...; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`}</Code>
      <Figure src="/learn/shots/security/session-management-01.svg" alt="DevTools の Application タブの Cookies 一覧。HttpOnly・Secure・SameSite の列" caption="属性が実際に効いているかは DevTools の Cookies 一覧で確認できる。チェックが抜けている列がそのまま弱点になる" />

      <Callout variant="tip" title="__Host- プレフィックスも有効">
        Cookie 名に <Cmd>__Host-</Cmd> プレフィックスを付けると、パス・ドメインが固定され、<strong>サブドメインからの上書き</strong>を禁止できます。
        セッション固定の植え付け経路を一つ潰せます。
      </Callout>

      <Section>攻撃① セッションハイジャック</Section>
      <p>
        <strong>セッションハイジャック</strong>は、有効なセッション ID を<strong>盗み取って</strong>なりすます攻撃です。盗む経路は主に次の 3 つです。
      </p>
      <ul>
        <li><strong>盗聴</strong> — 平文（HTTP）通信で ID が流れるのを傍受する（<Cmd>Secure</Cmd> で対策）</li>
        <li><strong>XSS</strong> — スクリプトを注入して <Cmd>document.cookie</Cmd> から ID を読み出す（<Cmd>HttpOnly</Cmd> で対策）</li>
        <li><strong>推測</strong> — ID が短い・規則的だと総当たりや予測で当てられる（CSPRNG で対策）</li>
      </ul>

      <Section>攻撃② セッション固定（Session Fixation）</Section>
      <p>
        セッション固定は少しわかりにくい攻撃です。ハイジャックが「ログイン後の ID を盗む」のに対し、固定は
        <strong>攻撃者が用意した ID を、ログイン前の被害者に持たせておく</strong>点が違います。
        カギは「ログインの前後でセッション ID が<strong>変わらない</strong>」という実装上の隙です。
      </p>
      <SequenceDiagram
        actors={["攻撃者", "被害者", "サーバー"]}
        messages={[
          { from: 0, to: 2, label: "① 未認証セッションIDを取得" },
          { from: 0, to: 1, label: "② 既知のIDを植え付け", cta: true },
          { from: 1, to: 2, label: "③ そのIDのままログイン" },
          { from: 2, to: 1, label: "④ 同じIDのまま認証成立（再生成なし）" },
          { from: 0, to: 2, label: "⑤ 既知IDで被害者としてアクセス", cta: true },
        ]}
        caption="ログイン成功時にセッション ID を再生成しないと、攻撃者が事前に知っている ID がそのまま認証済みになってしまう"
      />
      <p>
        攻撃者は最初に自分で有効な未認証セッション ID を発行させ、それをリンクや Cookie 注入で被害者のブラウザに仕込みます。
        被害者がその ID のままログインし、サーバが<strong>ID を作り直さない</strong>と、認証後も同じ ID が有効なまま——
        攻撃者は最初から知っている ID で被害者として振る舞えてしまいます。
      </p>

      <SubSection>根治策：ログイン成功時にセッション ID を再生成する</SubSection>
      <p>
        セッション固定の根治は<strong>「認証境界でセッション ID を作り直す（rotate する）」</strong>ことです。
        ログイン成功の直後に必ず新しい ID を発行し、旧 ID を失効させれば、たとえ攻撃者が旧 ID を知っていても無効になります。
      </p>
      <Code lang="javascript" filename="login.js (express-session)">{`app.post("/login", (req, res) => {
  if (verify(req.body)) {
    // 認証成功したら「必ず」セッションIDを作り直す
    req.session.regenerate((err) => {
      if (err) return res.sendStatus(500);
      req.session.user = req.body.user; // 新しいIDに認証情報を載せる
      req.session.save(() => res.redirect("/"));
    });
  }
});`}</Code>
      <Callout variant="warn" title="呼び忘れ・呼び出し順序に注意">
        主要フレームワークには再生成 API があります（Java <Cmd>changeSessionId()</Cmd>、PHP <Cmd>session_regenerate_id(true)</Cmd>、
        Rails <Cmd>reset_session</Cmd>、Django は <Cmd>login()</Cmd> が内部で <Cmd>cycle_key()</Cmd> を呼ぶ）。
        ただし<strong>認証属性をバインドした後</strong>に再生成すると旧 ID に情報が残る競合が起き得ます。<strong>再生成 → 認証情報の付与</strong>の順を守ります。
        SSO のコールバック経路など、通常ログイン以外の入口で再生成が抜けるのも頻出パターンです。
      </Callout>

      <Callout variant="danger" title="失効（ログアウト・権限変更）も網羅する">
        セッション固定と対になるのが<strong>不十分な失効</strong>です。ログアウト・タイムアウト・権限変更・パスワード変更のたびに、
        該当セッションを確実に破棄します。とくに <strong>HTTP 経路だけ失効して WebSocket などリアルタイム経路が古い権限を握り続ける</strong>「片手落ち」に注意が必要です。
      </Callout>

      <Bridge course="コンピュータネットワーク / 情報セキュリティ">
        セッション管理は、講義で学ぶ「HTTP のステートレス性」と「状態をどこに持つか」というトレードオフの実装例です。
        状態をサーバ側に持ち、クライアントには推測困難な鍵（セッション ID）だけを預ける——この設計は、
        <strong>ケルベロスなどのチケットベース認証</strong>とも発想が通じます。
        セッション ID の再生成は、<strong>リプレイ攻撃</strong>を「使い回せる資格情報を作らない」ことで防ぐ考え方であり、
        Cookie 属性は<strong>機密性（Secure）・被害の局所化（HttpOnly）・意図しない送信の防止（SameSite）</strong>という多層防御の具体例になっています。
      </Bridge>

      <Divider />

      <Quiz
        question="セッション固定攻撃を根本から防ぐ、最も確実な対策はどれか？"
        options={[
          "Cookie に HttpOnly を付ける",
          "パスワードを強くする",
          "ログイン成功時にセッション ID を再生成（rotate）する",
          "セッションの有効期限を長くする",
        ]}
        answer={2}
        explanation="固定の核心は「ログイン前後で ID が変わらない」ことなので、認証成功時に ID を作り直せば、攻撃者が仕込んだ旧 ID は無効になります。HttpOnly はハイジャック（XSS 経由の窃取）対策で、固定の直接の根治策ではありません。"
      />

      <KeyPoints
        items={[
          "セッション ID はサーバ側状態への推測困難な鍵。CSPRNG で生成し、実データはサーバに置く",
          "HttpOnly=XSS 窃取、Secure=盗聴、SameSite=CSRF を防ぐ。属性と攻撃を対応付けて覚える",
          "ハイジャックは ID を盗む攻撃、固定は事前に仕込んだ ID を使わせる攻撃",
          "セッション固定の根治は「ログイン成功時にセッション ID を再生成」する",
          "ログアウト・権限変更での失効も網羅し、リアルタイム経路の片手落ちに注意する",
        ]}
      />
    </>
  );
}

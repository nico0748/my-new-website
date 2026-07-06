import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "cookie",
  title: "Cookie とは",
  description: "ブラウザに保存される小さなデータ Cookie の仕組み・属性・種類。ログイン維持やセキュリティ属性(HttpOnly/Secure/SameSite)まで。",
  domain: "web",
  section: "web-basics",
  order: 6,
  level: "basic",
  tags: ["Cookie", "セッション", "Web"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        HTTP は 1 回ごとのやり取りを覚えていない「ステートレス」な仕組みです。それでもログイン状態やカートの中身が保たれるのは、ブラウザに保存される小さなデータ <strong>Cookie</strong> が状態を運んでいるから。その仕組みと、安全に使うための属性を押さえましょう。
      </Lead>

      <Section>Cookie は何のためにある</Section>
      <p>
        Cookie はサーバがブラウザに預ける小さなデータで、状態や設定を記憶するために使われます。代表的な用途は次のとおりです。
      </p>
      <ul>
        <li>ログイン状態の維持</li>
        <li>ショッピングカートの内容保持</li>
        <li>ユーザーの設定（言語・テーマなど）の記憶</li>
        <li>アクセス解析や広告のトラッキング</li>
      </ul>

      <SubSection>なぜ Cookie が生まれたのか — HTTP のステートレス性</SubSection>
      <p>
        HTTP は 1 リクエスト・1 レスポンスで完結する<strong>ステートレス</strong>なプロトコルとして設計されました。サーバは「今このリクエストを送ってきた相手が、さっきログインした人と同じか」を、プロトコル自体からは知りようがありません。ステートレスにしたのは、<strong>サーバが個々のクライアントの状態を抱え込まずに済み、単純でスケールしやすい</strong>という設計上の利点があるからです。
      </p>
      <p>
        しかし現実の Web は「ログイン状態を保つ」「カートを覚える」など<strong>状態の継続</strong>を必要とします。そこで「サーバが小さなラベルを発行し、ブラウザがそれを毎回貼り付けて送り返す」ことで、ステートレスなプロトコルの上に擬似的な継続を乗せる——これが Cookie の発明です。
      </p>
      <Bridge course="コンピュータネットワーク">
        講義で「HTTP はステートレス」と習う、その<strong>ステートレス性を補う代表的な仕組み</strong>が Cookie です。TCP のように接続を張りっぱなしにして状態を持つ（ステートフル）のではなく、<strong>状態をクライアント側に外出しして、リクエストごとに運ばせる</strong>という発想。これは「状態をどこに持つか」というネットワーク設計の根本的なトレードオフの一例で、REST API が「ステートレスであること」を原則に掲げるのと同じ思想の裏返しです。
      </Bridge>

      <Section>Cookie の仕組み</Section>
      <p>
        Cookie のやり取りはヘッダを通じて自動で行われます。一度発行されれば、以降のリクエストにブラウザが勝手に付けてくれます。
      </p>
      <Steps>
        <Step title="1. アクセス">ブラウザがサーバにリクエストを送る。</Step>
        <Step title="2. Set-Cookie で渡す">
          サーバがレスポンスの <Cmd>Set-Cookie</Cmd> ヘッダで Cookie を発行する。
        </Step>
        <Step title="3. 以降のリクエストに付与">
          ブラウザは次回以降、<Cmd>Cookie</Cmd> ヘッダに載せて自動送信する。
        </Step>
      </Steps>
      <Code lang="http" filename="exchange">{`# サーバ → ブラウザ
Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax

# ブラウザ → サーバ（以降のリクエスト）
Cookie: session_id=abc123`}</Code>
      <SequenceDiagram
        actors={["ブラウザ", "サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① 最初のアクセス" },
          { from: 1, to: 0, label: "② Set-Cookie で Cookie を渡す", cta: true },
          { from: 0, to: 1, label: "③ 以降は Cookie を自動送信" },
          { from: 1, to: 0, label: "④ ユーザーを識別して応答", cta: true },
        ]}
        caption="Cookie が発行され、以降のリクエストに付与される流れ"
      />

      <Section>Cookie の属性</Section>
      <p>
        1 つの Cookie には値だけでなく、有効範囲や有効期限、セキュリティに関わる属性を付けられます。
      </p>
      <KVList
        items={[
          { key: "Name / Value", val: "Cookie の名前と値（本体）" },
          { key: "Expires / Max-Age", val: "有効期限（絶対時刻 / 相対秒数）" },
          { key: "Domain", val: "送信対象のドメイン" },
          { key: "Path", val: "送信対象のパス" },
          { key: "Secure", val: "HTTPS 通信でのみ送信する" },
          { key: "HttpOnly", val: "JavaScript からアクセス不可にする" },
          { key: "SameSite", val: "クロスサイト送信を制御（Lax / Strict / None）" },
        ]}
      />

      <Section>Cookie の種類</Section>
      <SubSection>発行元による分類</SubSection>
      <ComparisonTable
        headers={["種類", "発行元", "主な用途"]}
        rows={[
          ["ファーストパーティ", "訪問中のサイト自身", "ログイン維持・設定保存"],
          ["サードパーティ", "外部ドメイン", "広告・横断的なトラッキング"],
        ]}
      />
      <SubSection>有効期限による分類</SubSection>
      <ComparisonTable
        headers={["種類", "有効期限", "消えるタイミング"]}
        rows={[
          ["セッション Cookie", "指定なし", "ブラウザを閉じると消える"],
          ["永続 Cookie", "Expires / Max-Age 指定", "期限が来るまで残る"],
        ]}
      />

      <Section>セキュリティ属性の要点</Section>
      <p>
        Cookie にはセッション ID など重要な情報が入るため、盗聴・改ざん・盗み出しへの対策が欠かせません。次の 3 属性が基本の守りです。<strong>どの属性がどの攻撃に効くか</strong>を対応付けて覚えるのがコツです。
      </p>
      <ComparisonTable
        headers={["属性", "何をする", "防げる攻撃"]}
        rows={[
          [<Cmd>HttpOnly</Cmd>, "JavaScript から Cookie を読めなくする", "XSS による Cookie の窃取"],
          [<Cmd>Secure</Cmd>, "HTTPS 通信でのみ送信する", "盗聴（平文で ID が流れるのを防ぐ）"],
          [<Cmd>SameSite</Cmd>, "他サイト起点の送信を制限する", "CSRF（意図しない送信の悪用）"],
        ]}
      />
      <SubSection>SameSite の 3 つの値</SubSection>
      <p>
        <Cmd>SameSite</Cmd> は「別のサイトから自分のサイトへリクエストが飛んだとき、Cookie を付けるか」を制御します。CSRF が「他サイトを踏ませて、被害者のログイン Cookie を自動送信させる」攻撃なので、ここを絞ることが直接の対策になります。
      </p>
      <KVList
        items={[
          { key: "Strict", val: "他サイト起点では一切送らない。最も安全だが、外部リンクから来た直後はログインが切れて見える" },
          { key: "Lax", val: "トップレベルの遷移（リンククリック等）でのみ送る。現在の実質的な既定値でバランスが良い" },
          { key: "None", val: "常に送るが Secure 必須。広告・埋め込みなど正当なクロスサイト用途に限る" },
        ]}
      />
      <Code lang="js" filename="server.js">{`// Express でセキュアな Cookie を発行する例
res.cookie("session_id", sessionId, {
  httpOnly: true,   // JS から読めない → XSS 対策
  secure: true,     // HTTPS のみ → 盗聴対策
  sameSite: "lax",  // クロスサイト制限 → CSRF 対策
  maxAge: 1000 * 60 * 60,  // 1 時間で失効
});`}</Code>
      <Bridge course="情報セキュリティ">
        Cookie の属性は、講義で学ぶ<strong>「機密性（Confidentiality）」「完全性」「多層防御（defense in depth）」</strong>の具体例です。<Cmd>Secure</Cmd> は通信の機密性（盗聴対策）、<Cmd>HttpOnly</Cmd> は XSS という<strong>別の脆弱性の被害を局所化</strong>する保険、<Cmd>SameSite</Cmd> は CSRF という<strong>「正規のリクエストに見えるが意図しない」攻撃</strong>への対策。1 つの属性で全部を守るのではなく、複数の層で重ねて守るという発想が、そのままセキュリティ設計の基本原則になっています。
      </Bridge>

      <Section>Cookie に置いてよいもの・いけないもの</Section>
      <p>
        設計判断として大切なのは<strong>「何を Cookie に載せるか」</strong>です。Cookie は理論上ブラウザ側で書き換え可能なので、金額・権限・ユーザー ID を生で置くと改ざんの標的になります。
      </p>
      <ComparisonTable
        headers={["置いてよい", "置いてはいけない"]}
        rows={[
          ["推測困難なセッション ID（サーバ側の状態への鍵）", "パスワード・クレジットカード番号"],
          ["言語・テーマなど無害な設定値", "「is_admin=true」のような権限フラグ"],
          ["署名付き・暗号化されたトークン", "生の金額・残高・ユーザー ID"],
        ]}
      />
      <Callout variant="warn" title="制約とデメリット">
        Cookie のサイズ上限は通常 4KB と小さく、大量のデータ保存には向きません。また毎リクエストに自動で載るため、無駄に大きな Cookie は<strong>全通信のオーバーヘッド</strong>になります。盗聴・改ざんのリスクやプライバシーへの懸念もあるため、機密情報は Cookie に直接置かず、<strong>推測困難なセッション ID だけを持たせ、実データはサーバ側に置く</strong>設計が基本です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Cookie はステートレスな HTTP に状態を持たせる仕組み。状態をクライアントに外出しして毎回運ばせる",
          "Cookie は Set-Cookie で発行され、以降ブラウザが Cookie ヘッダで自動送信する",
          "属性で有効範囲・有効期限・セキュリティを制御できる",
          "HttpOnly（XSS 対策）・Secure（盗聴対策）・SameSite（CSRF 対策）を対応付けて覚える",
          "機密・改ざんNGな値は載せず、推測困難なセッション ID だけを持たせ実データはサーバ側へ",
        ]}
      />
    </>
  );
}

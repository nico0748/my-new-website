import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, KVList, Bridge, TipBox, Figure, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "cors",
  title: "CORS の仕組みとハマりどころ",
  description: "ブラウザの同一オリジンポリシーと CORS。プリフライト、Access-Control-* ヘッダ、資格情報付きリクエスト、よくあるエラーの対処を理解する。",
  domain: "web",
  section: "api",
  order: 5,
  level: "basic",
  tags: ["CORS", "ブラウザ", "API"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        フロントエンドから API を叩いたら「CORS policy によりブロックされました」というエラーに出くわす — Web 開発の通過儀礼です。CORS は<strong>ブラウザの安全機構</strong>であって API のバグではありません。仕組みを理解すれば怖くありません。
      </Lead>

      <Figure
        src="/learn/shots/web/cors-01.svg"
        alt="Chrome DevTools の Console に赤字で出た CORS policy によるブロックのエラーメッセージ"
        caption="この赤字を初めて見て焦る人は多い。ブラウザが止めているだけで、API 自体は動いていることが多い。"
      />

      <Section>同一オリジンポリシー</Section>
      <p>
        ブラウザは既定で「<strong>同じオリジンにしか自由にアクセスさせない</strong>」というルール（Same-Origin Policy）を課します。オリジンとは<strong>スキーム・ホスト・ポートの 3 点セット</strong>で、1 つでも違えば別オリジンです。
      </p>
      <Code lang="text" filename="origin">{`https://app.example.com          （基準）
https://app.example.com/api      → 同一（パスは無関係）
http://app.example.com           → 別（スキームが違う）
https://api.example.com          → 別（ホストが違う）
https://app.example.com:8080     → 別（ポートが違う）`}</Code>
      <p>これはユーザーを守るための制約です。悪意あるサイトが、ログイン中の別サイトの API を勝手に叩いてデータを盗む、といった攻撃を防ぎます。</p>
      <Callout variant="info" title="同一オリジンポリシーが無かったら何が起きるか">
        あなたが銀行サイトにログイン中に、別タブで開いた悪意あるサイトの JavaScript が <Cmd>fetch("https://bank.example/api/transfer")</Cmd> を実行できてしまう。ブラウザは Cookie を自動で付けるので、<strong>あなたの権限で勝手に送金</strong>されかねません。同一オリジンポリシーは、この「別オリジンのスクリプトが、あなたの認証済みセッションに便乗する」攻撃を根元で防いでいます。
      </Callout>
      <Bridge course="情報セキュリティ / サンドボックス・信頼境界">
        同一オリジンポリシーは、セキュリティで習う<strong>サンドボックス</strong>と<strong>信頼境界（trust boundary）</strong>の一例です。ブラウザは各オリジンを「隔離された箱」として扱い、箱の外（他オリジン）のリソースへ勝手に手を伸ばせないようにします。「<strong>オリジン＝信頼の単位</strong>」であり、スキーム・ホスト・ポートの 3 点が境界線。OS がプロセスをメモリ空間で隔離するのと同じ発想を、ブラウザが Web の文脈で実装したものだと捉えると腑に落ちます。CORS は、この隔離に<strong>サーバの明示的同意でだけ穴を開ける</strong>制御された例外です。
      </Bridge>

      <SubSection>SOP・CORS・CSRF の関係を整理する</SubSection>
      <p>
        紛らわしい 3 つの用語を、守る対象と方向で区別しておきます。
      </p>
      <ComparisonTable
        headers={["用語", "何をするもの", "守る/緩める対象"]}
        rows={[
          ["同一オリジンポリシー (SOP)", "別オリジンの読み取りを既定で禁止する", "ブラウザの基本防御"],
          ["CORS", "SOP に、サーバ同意のもとで穴を開ける", "正当なクロスオリジン利用を許可"],
          [<Cmd>CSRF</Cmd>, "便乗リクエストを送らせる攻撃", "SOP では防ぎきれない別種の脅威"],
        ]}
      />
      <TipBox>
        よくある誤解「CORS を有効にすればセキュアになる」は逆です。CORS は防御を<strong>緩める</strong>仕組み（隔離に穴を開ける）。CSRF のような別種の攻撃には、SameSite Cookie や CSRF トークンといった別の対策が要ります。「何を守り、何を緩めているのか」を取り違えないことが大切です。
      </TipBox>

      <Section>CORS とは</Section>
      <p>
        とはいえ「<Cmd>app.example.com</Cmd> から <Cmd>api.example.com</Cmd> を呼びたい」は正当な要求です。そこで<strong>サーバ側が「このオリジンからのアクセスは許可する」と明示的に宣言</strong>する仕組みが CORS（Cross-Origin Resource Sharing）です。許可を出すのは<strong>API サーバ側</strong>であり、フロント側では解決できない点が重要です。
      </p>

      <Section>プリフライト（OPTIONS）の仕組み</Section>
      <p>
        単純でないリクエスト（<Cmd>PUT</Cmd>/<Cmd>DELETE</Cmd> や独自ヘッダ・<Cmd>application/json</Cmd> の <Cmd>POST</Cmd> 等）では、ブラウザは本番リクエストの前に <Cmd>OPTIONS</Cmd> で「これから叩いてよいか」を確認します。これがプリフライトです。
      </p>
      <Steps>
        <Step title="プリフライト送信">
          ブラウザが自動で <Cmd>OPTIONS</Cmd> を送り、使いたいメソッドとヘッダを申告する。
        </Step>
        <Step title="サーバが許可を返答">
          サーバが <Cmd>Access-Control-Allow-*</Cmd> ヘッダで「そのメソッド・ヘッダ・オリジンを許可する」と応答する。
        </Step>
        <Step title="本番リクエスト">
          許可が確認できて初めて、ブラウザが本来のリクエストを送る。
        </Step>
      </Steps>

      <SequenceDiagram
        actors={["ブラウザ", "サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① プリフライト (OPTIONS)" },
          { from: 1, to: 0, label: "② Access-Control-Allow-* を返す", cta: true },
          { from: 0, to: 1, label: "③ 本リクエスト" },
          { from: 1, to: 0, label: "④ レスポンス", cta: true },
        ]}
        caption="プリフライトで許可を確認してから本リクエスト"
      />

      <Code lang="http" filename="preflight (OPTIONS)">{`OPTIONS /v1/users/42 HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: PATCH
Access-Control-Request-Headers: Content-Type, Authorization`}</Code>
      <Code lang="http" filename="preflight response">{`HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 600`}</Code>
      <Figure
        src="/learn/shots/web/cors-02.svg"
        alt="Chrome DevTools の Network タブで OPTIONS プリフライトを選び Access-Control-Allow-* ヘッダを表示した状態"
        caption="Network に OPTIONS が1本挟まっているのがプリフライト。許可ヘッダが返っているかをここで確かめる。"
      />
      <Callout variant="tip" title="プリフライトを減らす">
        <Cmd>Access-Control-Max-Age</Cmd> を返すと、その秒数だけブラウザがプリフライト結果をキャッシュし、毎回の <Cmd>OPTIONS</Cmd> を省けます。
      </Callout>

      <SubSection>単純リクエストと非単純リクエスト</SubSection>
      <p>
        すべてのリクエストにプリフライトが付くわけではありません。「<strong>単純リクエスト</strong>」と判定される条件を満たすものは、いきなり本番リクエストが飛びます。逆に、そこから 1 つでも外れると非単純と判定され、事前確認（プリフライト）が挟まります。
      </p>
      <KVList
        items={[
          { key: "単純（プリフライト無し）", val: "GET / HEAD / POST で、Content-Type が form 系（text/plain・application/x-www-form-urlencoded・multipart/form-data）、独自ヘッダ無し" },
          { key: "非単純（プリフライト有り）", val: "PUT / DELETE / PATCH、application/json の POST、Authorization など独自ヘッダを付ける、のいずれか" },
        ]}
      />
      <p>
        JSON API はまさに <Cmd>application/json</Cmd> ＋ <Cmd>Authorization</Cmd> を使うので、ほぼ必ずプリフライトが挟まります。「なぜ毎回 <Cmd>OPTIONS</Cmd> が飛ぶのか」の答えはここにあります。
      </p>
      <Bridge course="ネットワーク / ハンドシェイク・事前ネゴシエーション">
        プリフライトは、ネットワークで習う<strong>ハンドシェイク</strong>（本通信の前に条件を確認し合う手続き）の一種です。TCP が SYN/ACK で接続を確立してからデータを送るのと同じで、CORS は <Cmd>OPTIONS</Cmd> で「このメソッド・ヘッダを送ってよいか」を<strong>本番の前に一往復</strong>で確認します。<Cmd>Access-Control-Max-Age</Cmd> によるキャッシュは、毎回のハンドシェイクを省いて往復回数（RTT）を減らす最適化——プロトコル設計で学ぶ「セットアップコストの償却」の典型例です。破壊的な操作を送る前に安全確認を挟む、という<strong>fail-safe</strong>な設計思想が根底にあります。
      </Bridge>

      <Section>レスポンスヘッダ</Section>
      <ul>
        <li><Cmd>Access-Control-Allow-Origin</Cmd> — 許可するオリジン（具体的な 1 つ、または <Cmd>*</Cmd>）</li>
        <li><Cmd>Access-Control-Allow-Methods</Cmd> — 許可する HTTP メソッド</li>
        <li><Cmd>Access-Control-Allow-Headers</Cmd> — 許可するリクエストヘッダ</li>
        <li><Cmd>Access-Control-Allow-Credentials</Cmd> — Cookie 等の資格情報を許可するか</li>
      </ul>

      <Section>資格情報付きリクエスト</Section>
      <p>
        Cookie や <Cmd>Authorization</Cmd> ヘッダを付けてクロスオリジンで送るには、フロントで <Cmd>credentials: "include"</Cmd> を指定し、サーバが <Cmd>Allow-Credentials: true</Cmd> を返す必要があります。
      </p>
      <Code lang="javascript" filename="fetch (credentials)">{`fetch("https://api.example.com/v1/me", {
  credentials: "include",   // Cookie を送る
});`}</Code>
      <Callout variant="danger" title="ワイルドカードとの併用は不可">
        資格情報付きリクエストでは <Cmd>Access-Control-Allow-Origin: *</Cmd> は使えません。ブラウザが拒否します。許可オリジンを<strong>具体的に 1 つ</strong>返す必要があります（複数許可したいならリクエストの <Cmd>Origin</Cmd> を検証して動的に返す）。
      </Callout>

      <Section>よくあるエラーと対処</Section>
      <ul>
        <li><strong>「No 'Access-Control-Allow-Origin' header」</strong> — サーバが CORS ヘッダを返していない。API 側に許可オリジンを設定する。</li>
        <li><strong>プリフライトが 404 / 405</strong> — サーバが <Cmd>OPTIONS</Cmd> を処理していない。CORS ミドルウェアを認証より前に置く。</li>
        <li><strong>資格情報付きで弾かれる</strong> — <Cmd>Allow-Origin: *</Cmd> になっている。具体的なオリジンに変え、<Cmd>Allow-Credentials: true</Cmd> を返す。</li>
        <li><strong>独自ヘッダで失敗</strong> — <Cmd>Access-Control-Allow-Headers</Cmd> にそのヘッダ名を足す。</li>
      </ul>
      <Callout variant="info" title="切り分けのコツ">
        CORS エラーはブラウザだけで起きます。<Cmd>curl</Cmd> や Postman では成功するのに画面で失敗するなら、ほぼ CORS 設定の問題です。まず開発者ツールの Network で <Cmd>OPTIONS</Cmd> のレスポンスヘッダを確認しましょう。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "同一オリジンはスキーム・ホスト・ポートの 3 点が一致すること",
          "CORS はサーバが許可を宣言する仕組み。フロントでは解決できない",
          "非単純リクエストは OPTIONS のプリフライトで事前確認される",
          "許可は Access-Control-Allow-Origin / Methods / Headers で返す",
          "資格情報付きでは * は使えず、具体オリジン + Allow-Credentials: true が必要",
          "CORS エラーはブラウザ限定。Network の OPTIONS レスポンスから切り分ける",
        ]}
      />
    </>
  );
}

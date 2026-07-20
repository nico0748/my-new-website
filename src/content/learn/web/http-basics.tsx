import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "http-basics",
  title: "HTTP の基礎 — リクエスト/レスポンスの仕組み",
  description: "Web のすべての土台である HTTP。クライアントとサーバのやり取り、メソッド、ヘッダ、ボディの構造を最短で押さえる。",
  domain: "web",
  section: "web-basics",
  order: 2,
  level: "intro",
  tags: ["HTTP", "Web", "ネットワーク"],
  updated: "2026-07-07",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        Web ページの表示、API 呼び出し、フォーム送信 — ブラウザとサーバの会話はすべて
        <strong> HTTP（HyperText Transfer Protocol）</strong>で行われます。まずは「1 回のリクエストと 1 回のレスポンス」という基本の型を掴みましょう。
      </Lead>

      <Section>リクエスト/レスポンスモデル</Section>
      <p>
        HTTP は「クライアント（ブラウザ等）が<strong>リクエスト</strong>を送り、サーバが<strong>レスポンス</strong>を返す」というシンプルな往復が基本単位です。1 回の往復は独立しており、サーバは前回のリクエストを覚えていません（＝ステートレス）。
      </p>
      <p>
        なぜ「クライアントが話しかけ、サーバが応える」という一方向の型なのでしょうか。これは HTTP が<strong>要求駆動（request-driven）</strong>のプロトコルとして設計されたためです。サーバは自分からクライアントに話しかけません。この単純さのおかげで、サーバは「来た要求に応えるだけ」の存在になり、実装も運用も見通しがよくなります。
      </p>

      <Code lang="http" filename="request">{`GET /articles/42 HTTP/1.1
Host: nico-labo748.dev
Accept: text/html
User-Agent: Mozilla/5.0`}</Code>

      <Code lang="http" filename="response">{`HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1024

<!DOCTYPE html> ...`}</Code>

      <SubSection>メッセージの構造は 4 パートで決まっている</SubSection>
      <p>
        上のテキストは適当に並んでいるのではなく、厳密な文法（RFC で規定された<strong>形式言語</strong>）に従っています。リクエスト・レスポンスとも構造は共通で、次の 4 パートです。
      </p>
      <KVList
        items={[
          { key: "開始行", val: "リクエストは「メソッド パス バージョン」、レスポンスは「バージョン ステータス」" },
          { key: "ヘッダ群", val: "「名前: 値」を 1 行ずつ。メタ情報（型・長さ・認証など）" },
          { key: "空行", val: "ヘッダの終わりを示す（ここが本文との区切り）" },
          { key: "ボディ", val: "実データ（HTML・JSON・画像など。ない場合もある）" },
        ]}
      />

      <Bridge course="オートマトン・形式言語 / ネットワーク（アプリケーション層プロトコル）">
        HTTP メッセージのパースは、講義で習う<strong>字句解析・構文解析</strong>そのものです。「開始行 → ヘッダの繰り返し → 空行 → ボディ」という並びは<strong>正規言語／文脈自由文法</strong>で書ける構造で、サーバはこれを<strong>有限オートマトン</strong>のように状態遷移しながら読み取ります。座学で「オートマトンなんて何に使うのか」と思った理論が、実は Web サーバーがリクエストを 1 文字ずつ受理する処理として現場に現れているのです。またこれは<strong>アプリケーション層プロトコル</strong>の典型例で、SMTP・FTP なども同じく「テキストのやり取りに文法を定めたもの」という点で共通しています。
      </Bridge>

      <Callout variant="tip" title="ステートレスの補い方">
        ログイン状態のような「継続する情報」は、Cookie・セッション・トークンでリクエストごとに毎回持ち回ることで実現します（詳しくは「認証/認可」章で扱います）。
      </Callout>

      <Section>主要な HTTP メソッド</Section>
      <p>メソッドは「そのリクエストで何をしたいか」を表します。代表的なものは次の 5 つです。</p>
      <ul>
        <li><Cmd>GET</Cmd> — リソースの取得（副作用なし・安全）</li>
        <li><Cmd>POST</Cmd> — 新規作成・処理の実行</li>
        <li><Cmd>PUT</Cmd> — リソースの全体置換（冪等）</li>
        <li><Cmd>PATCH</Cmd> — リソースの部分更新</li>
        <li><Cmd>DELETE</Cmd> — リソースの削除（冪等）</li>
      </ul>

      <p>
        メソッドには「安全（safe）」と「冪等（idempotent）」という 2 つの性質があります。<strong>安全</strong>＝サーバの状態を変えない（<Cmd>GET</Cmd>）。<strong>冪等</strong>＝何回送っても最終結果が同じ。この 2 性質を表で整理すると、メソッドの設計意図が見えてきます。
      </p>
      <ComparisonTable
        headers={["メソッド", "意味", "安全", "冪等"]}
        rows={[
          [<Cmd>GET</Cmd>, "取得", "はい", "はい"],
          [<Cmd>POST</Cmd>, "作成・実行", "いいえ", "いいえ"],
          [<Cmd>PUT</Cmd>, "全体置換", "いいえ", "はい"],
          [<Cmd>PATCH</Cmd>, "部分更新", "いいえ", "場合による"],
          [<Cmd>DELETE</Cmd>, "削除", "いいえ", "はい"],
        ]}
      />

      <Callout variant="warn" title="冪等性（idempotency）に注意">
        同じリクエストを 2 回送っても結果が変わらない性質を「冪等」と呼びます。<Cmd>GET</Cmd>/<Cmd>PUT</Cmd>/<Cmd>DELETE</Cmd> は冪等ですが、<Cmd>POST</Cmd> は冪等ではありません。リトライ設計で効いてきます。たとえば「送信」ボタンを 2 回押すと注文が 2 件作られてしまうのは、<Cmd>POST</Cmd> が非冪等だからです。実務ではこれを避けるため、リクエストに一意な鍵（idempotency key）を持たせて重複を弾く設計を入れます。
      </Callout>

      <Bridge course="ソフトウェア工学（REST・API 設計）">
        講義で習う<strong>一貫性のある設計</strong>や<strong>契約による設計（Design by Contract）</strong>の考え方が、REST の「メソッドの意味を守る」規約として現れます。<Cmd>GET</Cmd> は状態を変えない、<Cmd>PUT</Cmd> は冪等——という約束を守ることで、キャッシュ・プロキシ・リトライといった中間の仕組みが「このメソッドなら安全に再送・キャッシュしてよい」と機械的に判断できます。座学の「事前条件・事後条件」が、API のメソッド選択という具体的な設計判断に落ちてくる好例です。
      </Bridge>

      <Section>ヘッダ — メッセージのメタ情報</Section>
      <p>
        ボディが「中身」なら、ヘッダは「荷札」です。中身の型・長さ・言語・認証情報・キャッシュ方針などを伝えます。よく使うものを押さえておくと、開発者ツールの Network タブが一気に読めるようになります。
      </p>
      <KVList
        items={[
          { key: <Cmd>Content-Type</Cmd>, val: "ボディの型（text/html, application/json など）" },
          { key: <Cmd>Content-Length</Cmd>, val: "ボディのバイト数" },
          { key: <Cmd>Authorization</Cmd>, val: "認証情報（Bearer トークンなど）" },
          { key: <Cmd>Cache-Control</Cmd>, val: "キャッシュの可否と期間" },
          { key: <Cmd>Set-Cookie</Cmd>, val: "サーバがクライアントに保存させる状態" },
        ]}
      />
      <p>
        実際に手元でヘッダを見るには <Cmd>curl -v</Cmd> が手軽です。送ったリクエストと返ってきたレスポンスの両方が表示されます。
      </p>
      <Code lang="bash" filename="terminal">{`curl -v https://example.com
# > GET / HTTP/1.1        ← 送ったリクエスト行
# > Host: example.com
# < HTTP/1.1 200 OK       ← 返ってきたレスポンス
# < Content-Type: text/html`}</Code>
      <Figure
        src="/learn/shots/web/http-basics-01.svg"
        alt="curl -v の実行結果で、送ったリクエスト行と返ってきたレスポンスヘッダが両方見えるターミナル"
        caption="行頭の記号で向きが分かる。ここまで説明した4パート構造が、そのままテキストとして流れているのが見える。"
      />

      <Section>ステータスコードの読み方</Section>
      <SubSection>百の位でカテゴリを掴む</SubSection>
      <ul>
        <li><strong>2xx</strong> 成功（200 OK, 201 Created, 204 No Content）</li>
        <li><strong>3xx</strong> リダイレクト（301 恒久, 302/307 一時, 304 Not Modified）</li>
        <li><strong>4xx</strong> クライアント側エラー（400, 401, 403, 404, 429）</li>
        <li><strong>5xx</strong> サーバ側エラー（500, 502, 503, 504）</li>
      </ul>
      <p>
        ステータスコードは次の章で詳しく扱いますが、「クライアントのせいか（4xx）サーバのせいか（5xx）」を百の位で即座に切り分けられる、という設計がまず大事です。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "HTTP はステートレスなリクエスト/レスポンスの往復が基本単位",
          "メソッドは意図を表す。GET/PUT/DELETE は冪等、POST は非冪等",
          "ステータスは百の位（2xx/3xx/4xx/5xx）でまず大分類を掴む",
          "状態の継続は Cookie・セッション・トークンで毎回持ち回る",
        ]}
      />
    </>
  );
}

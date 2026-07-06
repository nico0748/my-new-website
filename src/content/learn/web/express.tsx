import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, TipBox, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "express",
  title: "Express — Node.js の軽量 Web フレームワーク",
  description: "ルーティングとミドルウェアを中心に、最小構成で Web サーバー/REST API を作る Express の使い方を実例で押さえる。",
  domain: "web",
  section: "backend",
  order: 9,
  level: "basic",
  tags: ["Express", "Node.js", "API"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Express</strong> は Node.js で最も広く使われている軽量 Web フレームワークです。核となる概念は<strong>「ルーティング」</strong>と<strong>「ミドルウェア」</strong>のたった 2 つ。素の <Cmd>http</Cmd> モジュールで書くと <Cmd>if</Cmd> 文だらけになる処理を、これらで見通しよく整理できます。
      </Lead>

      <Section>Express とは — 何を解決するのか</Section>
      <p>
        前章で見たように、Node.js の <Cmd>http</Cmd> モジュールだけでサーバーを書くと、URL とメソッドの判定・ヘッダ設定・ボディのパースをすべて手で書くことになります。Express は<strong>「この URL にこのメソッドで来たら、この関数を実行する」という対応づけ（ルーティング）</strong>と、<strong>リクエストを順に加工していく仕組み（ミドルウェア）</strong>を提供し、この定型処理を劇的に短くします。
      </p>
      <Callout variant="info" title="薄いフレームワーク">
        Express は「あれをしろ、これをしろ」と構造を強制しません。フォルダ構成もエラー処理も自由です。この<strong>薄さ・自由さ</strong>が学びやすさの理由であり、同時に「大規模だと散らかりやすい」弱点でもあります（そこを埋めるのが次章の NestJS）。
      </Callout>

      <SubSection>Web サーバーとは何をしているのか</SubSection>
      <p>
        Express の下では、OS が管理する <strong>TCP ソケット</strong>が待ち受けており、ブラウザからの接続要求を <Cmd>listen</Cmd> したポート（例: 3000 番）で受け付けています。ブラウザは <strong>3 ウェイハンドシェイク</strong>で TCP コネクションを張り、その上に <strong>HTTP リクエスト</strong>（メソッド・パス・ヘッダ・ボディという決まった書式のテキスト）を流し込みます。Node.js の <Cmd>http</Cmd> モジュールがこのバイト列を解析して <Cmd>req</Cmd> オブジェクトに変換し、あなたが返す <Cmd>res</Cmd> を HTTP レスポンスのバイト列に組み立てて同じコネクションで送り返します。Express はさらにその上に「ルーティング」と「ミドルウェア」という薄い層を被せているだけです。
      </p>

      <Bridge course="コンピュータネットワーク">
        座学の TCP/IP 階層モデルで学ぶ「アプリケーション層＝HTTP」「トランスポート層＝TCP」の関係が、そのまま Express の足元にあります。<Cmd>app.listen(3000)</Cmd> はトランスポート層のポートに紐づく待ち受けソケットを開く操作、<Cmd>req.method</Cmd>/<Cmd>req.headers</Cmd> はアプリケーション層 HTTP メッセージのフィールドです。「ステートレスな HTTP」という講義の性質が、後半で扱うセッション・Cookie の必要性に直結します。
      </Bridge>

      <Section>セットアップ</Section>
      <Steps>
        <Step title="プロジェクト初期化と導入">
          <Cmd>npm init -y</Cmd> のあと <Cmd>npm install express</Cmd> を実行します。
        </Step>
        <Step title="最小サーバーを書く">
          下のコードを <Cmd>app.js</Cmd> に保存します。
        </Step>
        <Step title="起動して確認">
          <Cmd>node app.js</Cmd> で起動し、ブラウザで <Cmd>http://localhost:3000</Cmd> を開きます。
        </Step>
      </Steps>

      <Code lang="javascript" filename="app.js">{`import express from "express";

const app = express();

// JSON ボディを自動でパースする（後述のミドルウェア）
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.listen(3000, () => {
  console.log("http://localhost:3000 で起動しました");
});`}</Code>

      <p>
        <Cmd>http</Cmd> モジュール版と比べて、URL・メソッドの分岐が <Cmd>app.get(&quot;/&quot;, ...)</Cmd> の一行に収まっているのが分かります。これがルーティングです。
      </p>

      <Section>ルーティング</Section>
      <p>
        ルーティングは「HTTP メソッド」と「パス」の組み合わせに、ハンドラ関数を対応づけることです。<Cmd>app.get</Cmd>・<Cmd>app.post</Cmd>・<Cmd>app.put</Cmd>・<Cmd>app.delete</Cmd> がそのまま HTTP メソッドに対応します。
      </p>

      <Code lang="javascript" filename="routing.js">{`// GET と POST を同じパスで別々に定義できる
app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

app.post("/users", (req, res) => {
  const newUser = req.body; // express.json() のおかげで参照できる
  res.status(201).json({ id: 2, ...newUser });
});`}</Code>

      <SubSection>ルートパラメータとクエリ</SubSection>
      <p>
        URL の一部を変数として受け取るのが<strong>ルートパラメータ</strong>（<Cmd>:id</Cmd>）、<Cmd>?</Cmd> 以降の検索条件が<strong>クエリ文字列</strong>です。
      </p>

      <Code lang="javascript" filename="params-query.js">{`// GET /users/42        → req.params.id === "42"
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  res.json({ id, name: "User " + id });
});

// GET /search?q=node&page=2
//   → req.query.q === "node", req.query.page === "2"
app.get("/search", (req, res) => {
  const { q, page = "1" } = req.query;
  res.json({ keyword: q, page });
});`}</Code>

      <Callout variant="warn" title="params と query は常に文字列">
        <Cmd>req.params</Cmd> も <Cmd>req.query</Cmd> も値は文字列で届きます。数値として使うなら <Cmd>Number(req.params.id)</Cmd> のように明示的に変換し、不正値のチェックも忘れないようにします。
      </Callout>

      <Section>ミドルウェア — Express の心臓部</Section>
      <p>
        <strong>ミドルウェア</strong>は、リクエストがハンドラに届くまでの間に順番に実行される関数です。<Cmd>(req, res, next)</Cmd> という 3 引数を取り、処理が終わったら <Cmd>next()</Cmd> を呼んで<strong>次のミドルウェアへバトンを渡します</strong>。リクエストが「パイプラインを流れていく」イメージです。
      </p>

      <Code lang="text" filename="ミドルウェアの流れ">{`リクエスト
   │
   ▼
[ logger ] ── next() ──▶ [ express.json() ] ── next() ──▶ [ 認証 ]
                                                            │ next()
                                                            ▼
                                                        [ ハンドラ ]
                                                            │
                                                            ▼
                                                        レスポンス`}</Code>

      <FlowChain
        nodes={[
          { label: "リクエスト", variant: "alt" },
          { label: "ミドルウェア", sub: "express.json 等" },
          { label: "ミドルウェア", sub: "認証など" },
          { label: "ルートハンドラ" },
          { label: "レスポンス", variant: "cta" },
        ]}
        caption="next() で次のミドルウェアへ受け渡される"
      />

      <SubSection>next() の役割と実行順序</SubSection>
      <p>
        ミドルウェアは<strong>登録した順（上から下）に実行されます</strong>。<Cmd>next()</Cmd> を呼ばないと、そこでリクエストが止まりレスポンスが返りません。逆に、条件を満たさないときに <Cmd>res.status(401).end()</Cmd> して <Cmd>next()</Cmd> を呼ばなければ、後続を止められます（＝認証ガード）。
      </p>

      <Code lang="javascript" filename="middleware.js">{`// 自作ミドルウェア: すべてのリクエストをログに出す
function logger(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // これを忘れると処理が止まる
}

// 認証ミドルウェア: トークンが無ければ止める
function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.use(logger);          // 全ルートに適用
app.get("/private", auth, (req, res) => {  // このルートだけ auth
  res.json({ secret: "ok" });
});`}</Code>

      <Callout variant="tip" title="express.json() もミドルウェア">
        <Cmd>app.use(express.json())</Cmd> は「リクエストボディの JSON を解析して <Cmd>req.body</Cmd> に入れる」組み込みミドルウェアです。<strong>これをルート定義より前に置かないと <Cmd>req.body</Cmd> が undefined になります</strong>。順序が意味を持つ好例です。
      </Callout>

      <Bridge course="デザインパターン / ソフトウェア設計">
        ミドルウェアの連なりは、GoF の<strong> Chain of Responsibility（責任の連鎖）</strong>パターンそのものです。各ハンドラは「自分で処理を完結させる（<Cmd>res.end()</Cmd>）」か「次の担当へ委譲する（<Cmd>next()</Cmd>）」かを選び、リクエストという 1 つの要求がチェーンを流れていきます。並べ方を変えるだけで挙動が変わり（＝<strong>Pipeline / パイプ＆フィルタ</strong>）、認証・ログ・圧縮といった<strong>横断的関心事（cross-cutting concern）</strong>を本体ロジックから切り離せる点も、講義で扱う「関心の分離」の具体例です。
      </Bridge>

      <SubSection>ミドルウェアが「合成できる関数」である利点</SubSection>
      <p>
        ミドルウェアはすべて <Cmd>(req, res, next)</Cmd> という同じ形をしています。形が揃っているからこそ<strong>順不同で組み替え・使い回し</strong>ができ、共通処理を 1 本の関数として切り出せます。例えば「特定のルート群にだけ認証をかける」なら、<Cmd>app.use(&quot;/admin&quot;, auth)</Cmd> のようにパスを指定して束ねて適用できます。
      </p>

      <Code lang="javascript" filename="scoped-middleware.js">{`// /admin 以下の全ルートにだけ auth を適用（横断的関心事の局所化）
app.use("/admin", auth);

app.get("/admin/dashboard", (req, res) => res.json({ ok: true }));
app.get("/admin/users", (req, res) => res.json([]));

// /public は auth を通らない
app.get("/public", (req, res) => res.send("誰でも見られる"));`}</Code>

      <Section>req と res — よく使うプロパティ</Section>
      <ComparisonTable
        headers={["対象", "書き方", "意味"]}
        rows={[
          ["req", "req.params", "ルートパラメータ（:id など）"],
          ["req", "req.query", "クエリ文字列（?q=...）"],
          ["req", "req.body", "リクエストボディ（要 express.json()）"],
          ["req", "req.headers", "リクエストヘッダ"],
          ["res", "res.json(obj)", "JSON を返す"],
          ["res", "res.status(code)", "ステータスコードを設定（チェーン可）"],
          ["res", "res.send(body)", "文字列 / バッファを返す"],
        ]}
      />

      <Section>エラーハンドリングミドルウェア</Section>
      <p>
        Express では、<strong>引数が 4 つ（<Cmd>err, req, res, next</Cmd>）のミドルウェア</strong>を「エラーハンドラ」として特別扱いします。ハンドラ内で <Cmd>next(err)</Cmd> を呼ぶか、同期処理で例外が投げられると、ここに集約されます。<strong>他のすべてのルートより後（最後）に登録する</strong>のが鉄則です。
      </p>

      <Code lang="javascript" filename="error-handler.js">{`app.get("/boom", (req, res, next) => {
  try {
    throw new Error("何か失敗した");
  } catch (err) {
    next(err); // エラーハンドラへ渡す
  }
});

// 4 引数 = エラーハンドラ。必ず末尾に置く
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "サーバー内部エラー" });
});`}</Code>

      <Callout variant="warn" title="async のエラーに注意">
        Express 4 では <Cmd>async</Cmd> ハンドラ内で <Cmd>await</Cmd> が投げた例外は自動では拾われず、<Cmd>try/catch</Cmd> + <Cmd>next(err)</Cmd> が必要でした。<strong>Express 5</strong> では async ハンドラが返す reject を自動でエラーハンドラへ流すよう改善されています。使用中のバージョンを確認しましょう。
      </Callout>

      <Section>Router でルートを分割する</Section>
      <p>
        ルートが増えると <Cmd>app.js</Cmd> が肥大化します。<Cmd>express.Router()</Cmd> を使うと、機能ごとにファイルを分けて<strong>ミニアプリのように</strong>まとめられます。
      </p>

      <Code lang="javascript" filename="routes/users.js">{`import express from "express";
const router = express.Router();

router.get("/", (req, res) => res.json([{ id: 1 }]));
router.get("/:id", (req, res) => res.json({ id: req.params.id }));
router.post("/", (req, res) => res.status(201).json(req.body));

export default router;`}</Code>

      <Code lang="javascript" filename="app.js">{`import express from "express";
import usersRouter from "./routes/users.js";

const app = express();
app.use(express.json());

// /users 以下をまるごと usersRouter に委譲
app.use("/users", usersRouter);

app.listen(3000);`}</Code>

      <TipBox>
        <Cmd>app.use(&quot;/users&quot;, usersRouter)</Cmd> と書くと、router 内の <Cmd>/:id</Cmd> は実際には <Cmd>/users/:id</Cmd> になります。プレフィックスを一箇所で管理できるのが Router の利点です。
      </TipBox>

      <Section>REST API の完成例</Section>
      <p>
        ここまでの要素を組み合わせた、メモリ上のデータを CRUD する最小の REST API です。実務では配列を DB アクセスに置き換えます。
      </p>

      <Code lang="javascript" filename="rest-api.js">{`import express from "express";
const app = express();
app.use(express.json());

let todos = [{ id: 1, title: "Learn Express", done: false }];
let nextId = 2;

// 一覧
app.get("/todos", (req, res) => res.json(todos));

// 取得
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Not Found" });
  res.json(todo);
});

// 作成
app.post("/todos", (req, res) => {
  const todo = { id: nextId++, title: req.body.title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// 更新
app.put("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Not Found" });
  Object.assign(todo, req.body);
  res.json(todo);
});

// 削除
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(3000, () => console.log("API ready on :3000"));`}</Code>

      <KVList
        items={[
          { key: "GET /todos", val: "一覧を返す（200）" },
          { key: "GET /todos/:id", val: "1 件返す。無ければ 404" },
          { key: "POST /todos", val: "作成して 201 で返す" },
          { key: "PUT /todos/:id", val: "更新して 200 で返す" },
          { key: "DELETE /todos/:id", val: "削除して 204（本文なし）" },
        ]}
      />

      <Section>実務でハマりやすい落とし穴</Section>
      <p>
        薄いフレームワークゆえ、ミスも自分で防ぐ必要があります。現場で頻出のものを挙げます。
      </p>
      <KVList
        items={[
          { key: "next() の呼び忘れ", val: "レスポンスもエラーも返らず、リクエストが「ぶら下がる」（ハングする）" },
          { key: "二重レスポンス", val: "res を返した後にもう一度 res を触ると ERR_HTTP_HEADERS_SENT。early return を徹底する" },
          { key: "ミドルウェアの順序", val: "express.json() やログ・認証はルート定義より前。エラーハンドラは末尾" },
          { key: "同期例外だけ自動捕捉", val: "Express 4 の async ハンドラの reject は自前で next(err)。Express 5 で改善" },
        ]}
      />
      <Callout variant="danger" title="本番前に必須のミドルウェア">
        素の Express は最小限しか持ちません。本番では <Cmd>helmet</Cmd>（セキュリティヘッダ）・<Cmd>cors</Cmd>（オリジン制御）・レート制限・リクエストサイズ上限などを<strong>自分で追加</strong>する必要があります。「薄い＝安全な既定値も無い」ことを忘れないでください。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Express の核はルーティングとミドルウェアの 2 つだけ。薄くて自由",
          "ルーティングはメソッド + パスにハンドラを対応づけ。:id はパラメータ、? 以降はクエリ",
          "ミドルウェアは登録順に実行。next() で次へ渡す。express.json() はルートより前に置く",
          "エラーハンドラは 4 引数（err, req, res, next）で末尾に登録する",
          "Router で機能ごとに分割し、REST API は CRUD を各メソッドに割り当てる",
        ]}
      />
    </>
  );
}

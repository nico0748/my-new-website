import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, TipBox, Bridge, KeyPoints, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "nodejs",
  title: "Node.js とは — JavaScript 実行環境",
  description: "ブラウザ外で JS を動かす Node.js。イベントループとノンブロッキング I/O、モジュール、npm、標準モジュールでの HTTP サーバーまで。",
  domain: "web",
  section: "backend",
  order: 8,
  level: "basic",
  tags: ["Node.js", "ランタイム", "npm"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Node.js</strong> は、ブラウザの外で JavaScript を動かすための<strong>実行環境（ランタイム）</strong>です。これによって JavaScript はフロントエンドだけの言語ではなくなり、Web サーバー・CLI ツール・ビルドツールまで書ける言語になりました。ここでは Node.js の心臓部である<strong>イベントループ</strong>と、実際にサーバーを書くための基礎を押さえます。
      </Lead>

      <Section>Node.js とは何か</Section>
      <p>
        Node.js の中核は、Google Chrome にも使われている高速な JavaScript エンジン <strong>V8</strong> です。V8 は JavaScript を機械語にコンパイルして実行しますが、それ単体ではファイルを読んだりネットワーク通信をしたりはできません。Node.js は V8 に、<strong>ファイル I/O・ネットワーク・タイマー</strong>などの OS 機能を C++ で実装した層（libuv）を組み合わせ、「サーバーで使える JavaScript」を実現しています。
      </p>

      <Code lang="text" filename="Node.js の構成">{`Node.js
├── V8           … JavaScript を実行するエンジン
├── libuv        … 非同期 I/O・イベントループ（C 実装）
└── 標準ライブラリ … fs / http / path / crypto など`}</Code>

      <Callout variant="info" title="ブラウザの JS との違い">
        ブラウザの JavaScript には <Cmd>window</Cmd> や <Cmd>document</Cmd>（DOM）がありますが、Node.js にはそれらはありません。代わりに <Cmd>process</Cmd>・<Cmd>require</Cmd>・<Cmd>__dirname</Cmd>、そしてファイルやネットワークを扱う標準モジュールがあります。
      </Callout>

      <Bridge course="オペレーティングシステム">
        <Cmd>fs.readFile</Cmd> や <Cmd>http</Cmd> が最終的に呼ぶのは、OS の講義で学ぶ<strong>システムコール（read/write/open/socket など）</strong>です。JavaScript は本来 OS を直接触れませんが、libuv という C 層が<strong>ユーザー空間の JS と、カーネルが提供するシステムコールの橋渡し</strong>をしています。「アプリはカーネルの機能をシステムコール経由で借りる」という OS の基本構図が、Node.js の <Cmd>V8 + libuv</Cmd> という二層構造にそのまま現れています。
      </Bridge>

      <Section>イベントループとノンブロッキング I/O</Section>
      <p>
        Node.js の最大の特徴は<strong>「シングルスレッド + ノンブロッキング I/O」</strong>です。多くのサーバーは「リクエスト 1 つにつきスレッド 1 本」で処理しますが、Node.js は<strong>基本的に 1 本のスレッド</strong>で大量のリクエストをさばきます。なぜそんなことが可能なのでしょうか。
      </p>

      <SubSection>2 つの並行モデル — スレッド vs イベント駆動</SubSection>
      <p>
        「大量のリクエストを同時に捌く」方法は大きく 2 つあります。<strong>スレッドモデル</strong>（1 リクエスト = 1 スレッド。Apache や従来の Java サーバー）と、<strong>イベント駆動モデル</strong>（1 スレッドで待ち行列を回す。Node.js や nginx）です。どちらが優れているという話ではなく、<strong>「何がボトルネックか」で向き不向きが変わる</strong>——ここが本質です。
      </p>
      <ComparisonTable
        headers={["", "スレッドモデル", "イベント駆動モデル"]}
        rows={[
          ["代表例", "Apache / 従来の Java", "Node.js / nginx"],
          ["並行の単位", "OS スレッド", "コールバック / タスク"],
          ["接続あたりコスト", "スレッド 1 本（重い）", "小さなオブジェクト（軽い）"],
          ["得意", "CPU 負荷が重い処理", "I/O が多い処理"],
          ["苦手", "大量同時接続（C10K）", "CPU を長く占有する処理"],
          ["並行の難しさ", "ロック・競合状態", "コールバックの複雑化"],
        ]}
      />

      <Bridge course="並行処理 / オペレーティングシステム">
        講義で学ぶ<strong>「並行（concurrency）と並列（parallelism）は別物」</strong>という区別が、Node.js の心臓部です。Node.js の JS 実行は<strong>シングルスレッド＝並列ではない</strong>のに、I/O を裏に逃がすことで<strong>並行性（見かけ上の同時進行）</strong>を実現します。スレッドモデルが抱える<strong>ロック・デッドロック・競合状態</strong>を、そもそも共有状態を 1 スレッドに閉じることで回避する——これは並行処理論の「共有をなくせば同期問題は消える」という定理の実践です。「なぜ Node は速いのに、なぜ CPU 処理では詰まるのか」は、この並行 vs 並列の理解でスッキリ説明できます。
      </Bridge>

      <SubSection>ブロッキングとノンブロッキングの違い</SubSection>
      <p>
        鍵は「時間のかかる処理（＝ファイル読み込みや DB アクセスなどの I/O）を待たない」ことです。ブロッキング（同期）だと、I/O が終わるまでスレッドは何もできずに止まります。ノンブロッキング（非同期）だと、I/O を <strong>OS に丸投げして即座に次の処理へ進み</strong>、終わったら通知を受け取ります。
      </p>

      <Code lang="javascript" filename="blocking-vs-nonblocking.js">{`const fs = require("fs");

// ブロッキング（同期）: 読み終わるまでここで停止する
const data = fs.readFileSync("big.log", "utf-8");
console.log("読み込み完了");
console.log("この行は上が終わるまで実行されない");

// ノンブロッキング（非同期）: すぐ次へ進み、完了時にコールバック
fs.readFile("big.log", "utf-8", (err, data) => {
  console.log("読み込み完了（あとから呼ばれる）");
});
console.log("この行は readFile を待たずに先に実行される");`}</Code>

      <SubSection>イベントループの回り方</SubSection>
      <p>
        Node.js は「非同期処理の完了通知」を<strong>キュー</strong>に溜め、それを<strong>イベントループ</strong>という無限ループで順番に取り出して JavaScript のコールバックを実行します。JavaScript 自体は 1 本のスレッドで動くので、実際に重い I/O をこなしているのは裏側の libuv（スレッドプール）と OS です。
      </p>

      <Code lang="text" filename="イベントループの概念">{`┌──────────────┐
│ JS 実行(1本) │  ← あなたのコードはここで動く
└──────┬───────┘
       │ I/O を依頼（読み込み・DB 等）
       ▼
┌──────────────┐     完了したら
│ libuv / OS    │ ──────────────▶ ┌───────────┐
│（裏で並行処理）│                  │ キューに   │
└──────────────┘                  │ 完了を積む │
                                  └─────┬─────┘
                            イベントループが
                            順に取り出して実行`}</Code>

      <StepFlow
        steps={[
          { title: "Timers", desc: "setTimeout / setInterval のコールバック" },
          { title: "Pending callbacks", desc: "遅延した I/O コールバック" },
          { title: "Poll", desc: "I/O イベントを取得・実行" },
          { title: "Check", desc: "setImmediate のコールバック" },
          { title: "Close callbacks", desc: "クローズ処理" },
        ]}
        caption="イベントループの主なフェーズ（1 周を繰り返す）"
      />

      <Bridge course="オペレーティングシステム / ネットワーク">
        イベントループが「大量の I/O をどこで待っているか」の正体が、OS の講義で出てくる <strong>I/O 多重化（epoll / kqueue / select）</strong>です。1 スレッドで何千ものソケットを監視し「準備ができたものだけ」を通知する仕組みで、libuv がこれを使っています。<strong>ノンブロッキング I/O ＋ イベント通知</strong>という OS の機能があって初めて、シングルスレッドのイベントループが成立します。「なぜ待たずに次へ進めるのか」は、ブロッキング/ノンブロッキング I/O と多重化の知識で完全に説明できます。
      </Bridge>

      <Callout variant="warn" title="CPU 負荷の重い処理は苦手">
        Node.js が得意なのは「I/O が多く CPU 計算は軽い」処理（API サーバー・チャット等）です。逆に画像変換や大量の数値計算など <strong>CPU を長く占有する処理</strong>を素朴に書くと、1 本のスレッドが塞がり全リクエストが止まります。その場合は Worker Threads や別プロセスへ逃がします。
      </Callout>

      <Callout variant="danger" title="落とし穴 — イベントループを塞ぐな">
        シングルスレッドゆえの最大の罠が<strong>「イベントループのブロック」</strong>です。同期版 API（<Cmd>fs.readFileSync</Cmd> など）や巨大な <Cmd>JSON.parse</Cmd>、重い <Cmd>for</Cmd> ループを1つ挟むだけで、その間<strong>全リクエストの処理が止まります</strong>（1 本しかないスレッドが占有されるため）。原則は「重い CPU 処理は Worker Threads / 別プロセスへ」「I/O は必ず非同期版を使う」。1 人の遅い処理が全員を待たせる、が Node の宿命です。
      </Callout>

      <Section>モジュールシステム — CommonJS と ESM</Section>
      <p>
        Node.js には歴史的に 2 つのモジュール方式があります。従来の <strong>CommonJS</strong>（<Cmd>require</Cmd> / <Cmd>module.exports</Cmd>）と、現在の JavaScript 標準である <strong>ES Modules（ESM）</strong>（<Cmd>import</Cmd> / <Cmd>export</Cmd>）です。
      </p>

      <Code lang="javascript" filename="CommonJS">{`// math.js
function add(a, b) {
  return a + b;
}
module.exports = { add };

// main.js
const { add } = require("./math");
console.log(add(1, 2)); // 3`}</Code>

      <Code lang="javascript" filename="ES Modules">{`// math.mjs
export function add(a, b) {
  return a + b;
}

// main.mjs
import { add } from "./math.mjs";
console.log(add(1, 2)); // 3`}</Code>

      <ComparisonTable
        headers={["", "CommonJS", "ES Modules (ESM)"]}
        rows={[
          ["読み込み", "require()", "import"],
          ["書き出し", "module.exports", "export"],
          ["拡張子/設定", ".js（既定）", '.mjs か package.json の "type":"module"'],
          ["読み込み方式", "同期", "非同期・静的解析"],
          ["現在の推奨", "既存資産で残る", "新規は基本こちら"],
        ]}
      />

      <TipBox>
        2025〜2026 年時点では、新規プロジェクトは <Cmd>package.json</Cmd> に <Cmd>&quot;type&quot;: &quot;module&quot;</Cmd> を書いて ESM を使うのが標準的です。TypeScript を使う場合も出力を ESM に揃えると混乱が減ります。
      </TipBox>

      <Section>npm と package.json</Section>
      <p>
        <strong>npm</strong>（Node Package Manager）は、Node.js に同梱される<strong>パッケージ管理ツール</strong>です。世界中のライブラリを <Cmd>npm install</Cmd> で取得でき、プロジェクトの設定と依存関係は <Cmd>package.json</Cmd> に記録されます。
      </p>

      <Steps>
        <Step title="プロジェクトを初期化">
          <Cmd>npm init -y</Cmd> で <Cmd>package.json</Cmd> の雛形を作ります。
        </Step>
        <Step title="パッケージを追加">
          <Cmd>npm install express</Cmd> のように実行すると、<Cmd>node_modules/</Cmd> に本体が入り <Cmd>package.json</Cmd> の <Cmd>dependencies</Cmd> に記録されます。
        </Step>
        <Step title="スクリプトを定義">
          <Cmd>scripts</Cmd> にコマンドを書けば <Cmd>npm run start</Cmd> で実行できます。
        </Step>
      </Steps>

      <Code lang="json" filename="package.json">{`{
  "name": "my-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^5.0.0"
  }
}`}</Code>

      <Callout variant="tip" title="dependencies と devDependencies">
        本番でも必要なものは <Cmd>dependencies</Cmd>、開発時だけのもの（テスト・型・リンタ）は <Cmd>npm install -D</Cmd> で <Cmd>devDependencies</Cmd> に入れます。<Cmd>package-lock.json</Cmd> はバージョンを固定するファイルで、これも必ずコミットします。
      </Callout>

      <Section>標準モジュール — fs / http / path</Section>
      <p>
        Node.js は追加インストール不要で使える標準モジュールを多数持っています。代表的なものを押さえましょう。
      </p>
      <KVList
        items={[
          { key: "fs", val: "ファイルの読み書き（readFile / writeFile など）" },
          { key: "http", val: "HTTP サーバー / クライアント" },
          { key: "path", val: "OS 差を吸収したパス操作（join / resolve）" },
          { key: "os", val: "OS 情報（CPU / メモリ / プラットフォーム）" },
          { key: "crypto", val: "ハッシュ・暗号・乱数" },
        ]}
      />

      <Section>http モジュールで最小サーバーを書く</Section>
      <p>
        フレームワークを使う前に、Node.js だけで HTTP サーバーがどう成り立つかを見ておきましょう。これが Express の内部で起きていることの正体です。
      </p>

      <Code lang="javascript" filename="server.js">{`import http from "node:http";

const server = http.createServer((req, res) => {
  // req: リクエスト情報 / res: レスポンスを組み立てる
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello, Node.js" }));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("http://localhost:3000 で起動しました");
});`}</Code>

      <p>
        URL やメソッドの判定、ヘッダの設定、404 の処理をすべて手で書いているのが分かります。ルーティングが増えるほど <Cmd>if</Cmd> 文が膨れ上がります。<strong>ここを整理してくれるのが Express</strong> です。
      </p>

      <Section>非同期の書き方の進化 — callback → Promise → async/await</Section>
      <p>
        非同期処理の記法は歴史的に 3 段階で進化しました。同じ「ファイルを読む」処理を 3 通りで比べます。
      </p>

      <Code lang="javascript" filename="callback（旧）">{`import fs from "node:fs";

fs.readFile("a.txt", "utf-8", (err, a) => {
  if (err) return console.error(err);
  fs.readFile("b.txt", "utf-8", (err, b) => {
    if (err) return console.error(err);
    console.log(a + b); // ネストが深くなる（コールバック地獄）
  });
});`}</Code>

      <Code lang="javascript" filename="Promise">{`import fs from "node:fs/promises";

fs.readFile("a.txt", "utf-8")
  .then((a) => fs.readFile("b.txt", "utf-8").then((b) => a + b))
  .then((text) => console.log(text))
  .catch((err) => console.error(err));`}</Code>

      <Code lang="javascript" filename="async/await（現在の標準）">{`import fs from "node:fs/promises";

async function main() {
  try {
    const a = await fs.readFile("a.txt", "utf-8");
    const b = await fs.readFile("b.txt", "utf-8");
    console.log(a + b); // 同期のように読める
  } catch (err) {
    console.error(err);
  }
}
main();`}</Code>

      <Callout variant="tip" title="async/await を基本にする">
        現在は <Cmd>async/await</Cmd> が事実上の標準です。<Cmd>try/catch</Cmd> でエラーを扱え、上から下へ読めるので、新規コードはこれで書きましょう。標準モジュールも <Cmd>node:fs/promises</Cmd> のように Promise 版が用意されています。
      </Callout>

      <Section>Node.js の用途</Section>
      <KVList
        items={[
          { key: "Web / API サーバー", val: "Express・NestJS・Next.js（本章の主題）" },
          { key: "CLI ツール", val: "npm 上のツールの多くは Node 製" },
          { key: "ビルド / 開発ツール", val: "Vite・ESLint・Prettier など" },
          { key: "リアルタイム通信", val: "WebSocket を使ったチャット・通知" },
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "Node.js は V8 + libuv による JavaScript 実行環境。ブラウザ外で JS を動かせる",
          "シングルスレッド + ノンブロッキング I/O。重い I/O は OS に任せてイベントループで捌く",
          "CPU を長く占有する処理は苦手。得意なのは I/O 中心のサーバー",
          "モジュールは ESM（import/export）が新規標準。npm と package.json で依存を管理",
          "http モジュールでサーバーは書けるが煩雑。非同期は async/await が現在の基本",
        ]}
      />
    </>
  );
}

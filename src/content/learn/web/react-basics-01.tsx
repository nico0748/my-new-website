import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, KVList, TipBox, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "react-basics-01",
  title: "React 入門① — コンポーネントと JSX",
  description: "React の考え方、環境構築、JSX の書き方、関数コンポーネントと props を、小さなコード例を積み上げて習得する。",
  domain: "web",
  section: "frontend",
  order: 7,
  level: "basic",
  tags: ["React", "JSX", "コンポーネント"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        React は、UI を<strong>コンポーネント</strong>という小さな部品の組み合わせで組み立てるための
        ライブラリです。この記事では「React とは何か」から始めて、環境構築・JSX・関数コンポーネント・
        props までを、短いコードを一つずつ積み上げながら押さえます。まず全体像を掴み、次の記事で
        state（状態）に進みます。
      </Lead>

      <Section label="01">React とは何か</Section>
      <p>
        React は Meta（旧 Facebook）が開発した UI ライブラリです。特徴は大きく 3 つあります。
        これらを理解すると、なぜ React がこの書き方をするのかが腑に落ちます。
      </p>

      <SubSection>宣言的（declarative）</SubSection>
      <p>
        「DOM をどう操作するか（手続き）」ではなく「状態がこうならば画面はこう見える（結果）」を
        書きます。素の JavaScript では、値が変わるたびに自分で要素を書き換えていました。
      </p>

      <Code lang="js" filename="命令的（素の JS）">{`const el = document.getElementById("count");
let count = 0;
function increment() {
  count += 1;
  el.textContent = String(count); // DOM を自分で書き換える
}`}</Code>

      <p>
        React では「count がこの値なら、こう表示する」とだけ宣言します。DOM の書き換えは React が
        肩代わりします。
      </p>

      <Code lang="jsx" filename="宣言的（React）">{`function Counter() {
  const [count, setCount] = useState(0);
  // 「count がこの値なら、こう見える」を返すだけ
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`}</Code>

      <SubSection>コンポーネント指向</SubSection>
      <p>
        ボタン・カード・ヘッダーといった UI 部品を<strong>コンポーネント</strong>として定義し、
        レゴのように組み合わせて画面を作ります。部品なので再利用でき、テストも局所化できます。
      </p>

      <SubSection>SPA（Single Page Application）との相性</SubSection>
      <p>
        React は主に SPA — 1 枚の HTML を土台に、画面遷移や更新を JavaScript で差し替える構成 —
        で使われます。ページ全体を再読み込みせずに必要な部分だけを更新するため、体感が速く
        アプリのような操作感になります。
      </p>

      <Callout variant="info" title="ライブラリであってフレームワークではない">
        React 自体は「UI を描く」ことに集中したライブラリです。ルーティングやデータ取得などは
        React Router / TanStack Query などの周辺ライブラリ、あるいは Next.js のような
        フレームワークと組み合わせて補います。
      </Callout>

      <Divider />

      <Section label="02">環境構築（Vite で作成）</Section>
      <p>
        今の React 開発では <Cmd>Vite</Cmd> というビルドツールを使うのが標準的です。高速な開発
        サーバと最小限の設定で始められます。次のコマンドでプロジェクトを作成します。
      </p>

      <Code lang="bash" filename="terminal">{`npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev`}</Code>

      <p>
        <Cmd>--template react-ts</Cmd> は「React + TypeScript」のテンプレートです。生成される
        主なファイルは次の通りです。
      </p>

      <KVList
        items={[
          { key: <Cmd>index.html</Cmd>, val: "土台の HTML。空の <div id=\"root\"> がある" },
          { key: <Cmd>src/main.tsx</Cmd>, val: "React を root に描き始めるエントリポイント" },
          { key: <Cmd>src/App.tsx</Cmd>, val: "最初のコンポーネント（ここを書き換えていく）" },
        ]}
      />

      <p>エントリポイントの <Cmd>main.tsx</Cmd> は、おおむね次のような形をしています。</p>

      <Code lang="tsx" filename="src/main.tsx">{`import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`}</Code>

      <p>
        <Cmd>createRoot(...).render(...)</Cmd> が「HTML の root に App コンポーネントを描いて」と
        React に指示している部分です。ここが React アプリの起点になります。
      </p>

      <Divider />

      <Section label="03">JSX の書き方</Section>
      <p>
        JSX は「JavaScript の中に HTML のようなタグを書ける」拡張構文です。見た目は HTML ですが、
        実体は JavaScript の式なので、変数に入れたり関数から返したりできます。
      </p>

      <Code lang="tsx" filename="JSX の基本">{`const element = <h1>Hello, React</h1>;`}</Code>

      <SubSection>波かっこ {"{ }"} で式を埋め込む</SubSection>
      <p>
        JSX の中で <Cmd>{"{ }"}</Cmd> を書くと、その中に JavaScript の<strong>式</strong>を
        埋め込めます。変数・計算・関数呼び出しなど、値になるものは何でも入ります。
      </p>

      <Code lang="tsx" filename="式の埋め込み">{`const name = "Yuma";
const el = <p>こんにちは、{name} さん（{2026 - 1998} 歳）</p>;
// → こんにちは、Yuma さん（28 歳）`}</Code>

      <Callout variant="warn" title="埋め込めるのは「式」だけ">
        <Cmd>{"{ }"}</Cmd> に入れられるのは値になる式です。<Cmd>if</Cmd> 文や <Cmd>for</Cmd> 文
        （＝文）はそのままでは入りません。条件分岐は三項演算子、繰り返しは <Cmd>map</Cmd> を使う
        のが定石です（次の記事で扱います）。
      </Callout>

      <SubSection>属性の書き方（className など）</SubSection>
      <p>
        JSX の属性は基本的に HTML と同じですが、JavaScript の予約語との衝突を避けるため一部が
        別名になっています。特に <Cmd>class</Cmd> は <Cmd>className</Cmd>、
        <Cmd>for</Cmd> は <Cmd>htmlFor</Cmd> です。
      </p>

      <Code lang="tsx" filename="属性">{`// class ではなく className
const box = <div className="card" id="hero">中身</div>;

// 属性値にも {} で式を渡せる
const size = 24;
const icon = <img src="/logo.svg" width={size} alt="ロゴ" />;`}</Code>

      <ComparisonTable
        headers={["HTML", "JSX", "理由"]}
        rows={[
          [<Cmd>class</Cmd>, <Cmd>className</Cmd>, "class は JS の予約語"],
          [<Cmd>for</Cmd>, <Cmd>htmlFor</Cmd>, "for は JS の予約語"],
          ["onclick", <Cmd>onClick</Cmd>, "イベントは camelCase"],
          ["style=\"...\"", <Cmd>{"style={{ }}"}</Cmd>, "style はオブジェクトで渡す"],
        ]}
      />

      <SubSection>フラグメント {"<> </>"}</SubSection>
      <p>
        コンポーネントは<strong>単一のルート要素</strong>しか返せません。並んだ要素を余計な
        <Cmd>div</Cmd> で囲まずにまとめたいときは、<strong>フラグメント</strong>
        <Cmd>&lt;&gt; ... &lt;/&gt;</Cmd> を使います。DOM に余計なノードを増やさずに済みます。
      </p>

      <Code lang="tsx" filename="フラグメント">{`// NG: 2 つの要素を並べて返すことはできない
// return <h1>タイトル</h1><p>本文</p>;

// OK: フラグメントでまとめる（DOM には現れない）
return (
  <>
    <h1>タイトル</h1>
    <p>本文</p>
  </>
);`}</Code>

      <Divider />

      <Section label="04">JSX が変換される仕組み</Section>
      <p>
        JSX はブラウザがそのまま理解できる構文ではありません。ビルド時に
        <Cmd>React.createElement(...)</Cmd> 相当の関数呼び出しへ<strong>変換（トランスパイル）</strong>
        されます。この変換を理解すると、JSX が「ただの JavaScript の式」であることが腹落ちします。
      </p>

      <Code lang="jsx" filename="あなたが書く JSX">{`const el = <h1 className="title">Hello, {name}</h1>;`}</Code>

      <p>これは、コンパイラ（Babel / SWC）によって次のように変換されます。</p>

      <p>
        この変換は魔法ではなく、コンパイラの教科書どおりの処理です。ソース文字列を<strong>字句解析
        （トークン化）</strong>して <Cmd>&lt;</Cmd> <Cmd>h1</Cmd> <Cmd>className</Cmd> …… に切り分け、
        <strong>構文解析</strong>で JSX 要素の<strong>抽象構文木（AST）</strong>を組み立て、その AST を
        <Cmd>createElement</Cmd> 呼び出しの AST へ<strong>変換</strong>し、最後に JavaScript を<strong>コード生成</strong>します。
      </p>

      <Code lang="text" filename="変換パイプライン（概念）">{`JSX 文字列
  → 字句解析(トークン列)
  → 構文解析(JSX の AST)
  → 変換(createElement 呼び出しの AST)
  → コード生成(ブラウザが実行する JS)`}</Code>

      <Code lang="js" filename="変換後（イメージ）">{`const el = React.createElement(
  "h1",                    // タグ名（またはコンポーネント）
  { className: "title" },  // props（属性）のオブジェクト
  "Hello, ",               // 子要素 1
  name                     // 子要素 2
);`}</Code>

      <p>
        <Cmd>createElement</Cmd> が返すのは実際の DOM ではなく、「どんな要素をどんな属性で描きたいか」
        を表した軽量なオブジェクト —— これを<strong>React 要素（仮想 DOM のノード）</strong>と
        呼びます。中身はおおよそこんな形です。
      </p>

      <Code lang="js" filename="React 要素（イメージ）">{`{
  type: "h1",
  props: {
    className: "title",
    children: ["Hello, ", "Yuma"]
  }
}`}</Code>

      <Callout variant="info" title="だから JSX は「式」なのだ">
        JSX は <Cmd>createElement</Cmd> 呼び出しに変換される以上、その結果はただのオブジェクト
        （値）です。だから変数に代入でき、配列に入れられ、関数から <Cmd>return</Cmd> できます。
        React はこのオブジェクトのツリーを見て、実際の DOM を組み立てます。
      </Callout>

      <TipBox>
        React 17 以降は「自動 JSX ランタイム」により <Cmd>import React</Cmd> を書かなくても JSX が
        使えます（内部では <Cmd>jsx()</Cmd> というヘルパに変換されます）。仕組みとしては
        <Cmd>createElement</Cmd> とほぼ同じ、と捉えて問題ありません。
      </TipBox>

      <Bridge course="コンパイラ / 言語処理系">
        JSX → <Cmd>createElement</Cmd> の変換は、講義で作る<strong>ミニコンパイラ</strong>そのものです。
        <strong>字句解析（トークン化）→ 構文解析（AST 構築）→ 意味変換 → コード生成</strong>という
        フロントエンド／バックエンドの流れが、Babel/SWC の JSX 変換に一対一で対応します。
        JSX は「JavaScript の<strong>構文糖衣（syntax sugar）</strong>」——つまり既存言語に糖衣構文を足しただけで、
        脱糖（desugar）すれば普通の関数呼び出しに戻る、という言語処理系の典型例です。
        「なぜ JSX がただの式なのか」は、変換後が式（<Cmd>createElement</Cmd> の戻り値）だから、と説明できます。
      </Bridge>

      <TipBox>
        コンパイラ演習で AST を触ったことがあるなら、<Cmd>ASTExplorer</Cmd>（astexplorer.net）に JSX を貼ると、
        Babel が生成する AST と変換後コードをその場で観察できます。手を動かすと「トランスパイル」が具体になります。
      </TipBox>

      <Divider />

      <Section label="05">関数コンポーネントとレンダリング</Section>
      <p>
        現在の React では、コンポーネントは<strong>「JSX を返す関数」</strong>として書きます
        （関数コンポーネント）。名前は<strong>大文字始まり</strong>が必須です。小文字始まりは
        HTML タグとして扱われてしまいます。
      </p>

      <Code lang="tsx" filename="src/Welcome.tsx">{`function Welcome() {
  return <h1>ようこそ</h1>;
}
export default Welcome;`}</Code>

      <p>定義したコンポーネントは、JSX の中でタグのように書いて使います。</p>

      <Code lang="tsx" filename="src/App.tsx">{`import Welcome from "./Welcome";

function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}`}</Code>

      <p>
        <Cmd>&lt;Welcome /&gt;</Cmd> と書くと、React は <Cmd>Welcome()</Cmd> 関数を呼び出し、
        返ってきた JSX を DOM に反映します。この「コンポーネント関数を呼んで結果を画面に描く」
        処理を<strong>レンダリング</strong>と呼びます。ここでは 2 回使っているので、見出しが 2 つ
        描画されます。
      </p>

      <Callout variant="danger" title="小文字始まりは HTML タグ扱い">
        <Cmd>&lt;welcome /&gt;</Cmd>（小文字）は自作コンポーネントではなく「welcome という HTML
        タグ」と解釈され、意図通り動きません。コンポーネント名は必ず大文字始まりにしてください。
      </Callout>

      <Divider />

      <Section label="06">props でデータを渡す</Section>
      <p>
        コンポーネントに外から値を渡す仕組みが <strong>props</strong>（properties）です。
        HTML の属性のように書いて渡し、受け取る側は関数の第 1 引数（オブジェクト）で受け取ります。
      </p>

      <Code lang="tsx" filename="props を渡す / 受け取る">{`// 受け取る側
function Greeting(props) {
  return <p>こんにちは、{props.name} さん</p>;
}

// 渡す側
<Greeting name="Yuma" />;   // → こんにちは、Yuma さん`}</Code>

      <SubSection>分割代入で受け取る</SubSection>
      <p>
        毎回 <Cmd>props.xxx</Cmd> と書くのは冗長なので、引数の位置で<strong>分割代入</strong>して
        受け取るのが一般的です。
      </p>

      <Code lang="tsx" filename="分割代入">{`function Greeting({ name }) {
  return <p>こんにちは、{name} さん</p>;
}`}</Code>

      <SubSection>デフォルト値</SubSection>
      <p>渡されなかったときの初期値は、分割代入の中で指定できます。</p>

      <Code lang="tsx" filename="デフォルト値">{`function Greeting({ name = "ゲスト" }) {
  return <p>こんにちは、{name} さん</p>;
}

<Greeting />;             // → こんにちは、ゲスト さん
<Greeting name="Yuma" />; // → こんにちは、Yuma さん`}</Code>

      <SubSection>children（タグで囲んだ中身）</SubSection>
      <p>
        コンポーネントのタグで囲んだ中身は、特別な props <Cmd>children</Cmd> として渡ります。
        カードやレイアウトなど「枠だけ用意して中身は差し込む」部品で多用します。
      </p>

      <Code lang="tsx" filename="children">{`function Card({ children }) {
  return <div className="card">{children}</div>;
}

// 使う側：タグの中身が children になる
<Card>
  <h2>タイトル</h2>
  <p>本文</p>
</Card>;`}</Code>

      <SubSection>props に型を付ける（TypeScript）</SubSection>
      <p>
        TypeScript では props の形を <Cmd>type</Cmd>（または <Cmd>interface</Cmd>）で明示します。
        これにより、渡し忘れや型違いをエディタが警告してくれます。
      </p>

      <Code lang="tsx" filename="型付き props">{`type GreetingProps = {
  name: string;
  age?: number;   // ? は「省略可」
};

function Greeting({ name, age = 0 }: GreetingProps) {
  return <p>{name}（{age} 歳）</p>;
}`}</Code>

      <p>
        <Cmd>GreetingProps</Cmd> は、複数のフィールドを束ねた<strong>直積型（レコード型）</strong>です。
        <Cmd>age?</Cmd> の <Cmd>?</Cmd> は「<Cmd>number</Cmd> または <Cmd>undefined</Cmd>」という
        <strong>直和（ユニオン）</strong>を意味します。コンポーネントは <Cmd>GreetingProps → JSX</Cmd> という
        <strong>関数の型</strong>を持つ、と読むと型の全体像が見えてきます。
      </p>

      <Bridge course="型理論 / プログラミング言語論">
        props の型は、講義で習う<strong>型システム</strong>の応用そのものです。オブジェクト型は複数の型を束ねた
        <strong>直積型（product type）</strong>、<Cmd>string | number</Cmd> は<strong>直和型（sum type / union）</strong>、
        <Cmd>age?</Cmd> は <Cmd>T | undefined</Cmd> の糖衣。関数コンポーネント <Cmd>(props) =&gt; JSX</Cmd> は
        <strong>関数型 <Cmd>Props → Element</Cmd></strong> として型付けされます。
        TypeScript がコンパイル時に「渡し忘れ・型違い」を弾けるのは、講義で扱う<strong>型検査（type checking）</strong>と
        <strong>型健全性（soundness）</strong>の恩恵です。「実行前にバグを型で捕まえる」体験が、ここで実感できます。
      </Bridge>

      <Callout variant="tip" title="props は読み取り専用">
        受け取った props をコンポーネント内で書き換えてはいけません（<Cmd>props.name = ...</Cmd> は
        NG）。props は「親から渡された、変更してはならない入力」です。値を変化させたいときは次の
        記事の <Cmd>state</Cmd> を使います。
      </Callout>

      <Divider />

      <Section label="07">コンポーネント分割とツリー</Section>
      <p>
        アプリは複数のコンポーネントを親子に組み合わせた<strong>ツリー構造</strong>になります。
        親が子に props を渡し、子はさらに孫に渡す —— データは基本的に<strong>上から下へ</strong>
        一方向に流れます（単方向データフロー）。
      </p>

      <Code lang="tsx" filename="ツリーの例">{`function Avatar({ url }: { url: string }) {
  return <img className="avatar" src={url} alt="" />;
}

function UserCard({ name, url }: { name: string; url: string }) {
  return (
    <div className="card">
      <Avatar url={url} />
      <span>{name}</span>
    </div>
  );
}

function App() {
  return (
    <UserCard name="Yuma" url="/me.png" />
  );
}`}</Code>

      <p>
        このとき構造は <Cmd>App → UserCard → Avatar</Cmd> というツリーになります。大きな UI ほど、
        「意味のある単位」で小さなコンポーネントに割り、名前を付けて組み合わせると読みやすく
        再利用しやすくなります。
      </p>

      <Steps>
        <Step title="1. 画面を眺めて部品を見つける">
          ヘッダー・カード・ボタンなど、繰り返し / 意味のかたまりを探します。
        </Step>
        <Step title="2. コンポーネントに切り出す">
          かたまりごとに大文字始まりの関数コンポーネントを作ります。
        </Step>
        <Step title="3. 変わる部分を props にする">
          名前や画像 URL など、部品ごとに違う値を props で受け取れるようにします。
        </Step>
        <Step title="4. 親で組み合わせる">
          親コンポーネントで子を並べ、props を渡してツリーを組み立てます。
        </Step>
      </Steps>

      <Divider />

      <KeyPoints
        items={[
          "React は宣言的・コンポーネント指向の UI ライブラリで、主に SPA で使う",
          "Vite で `npm create vite@latest -- --template react-ts` から始める",
          "JSX は {} で式を埋め込め、class は className、囲みは <> </>（フラグメント）",
          "JSX は React.createElement 呼び出しに変換され、返るのは React 要素というオブジェクト",
          "コンポーネントは大文字始まりの「JSX を返す関数」。使うとレンダリングされる",
          "props は親から子への読み取り専用の入力。分割代入・デフォルト値・children・型付けを押さえる",
          "アプリは props が上から下へ流れるコンポーネントツリーになる",
        ]}
      />
    </>
  );
}

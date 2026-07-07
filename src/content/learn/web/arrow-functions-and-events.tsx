import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "arrow-functions-and-events",
  title: "アロー関数とイベントハンドラ（e）",
  description: "React で頻出するアロー関数 () => {} と、イベントハンドラの引数 e（イベントオブジェクト）を、書き方・使いどころ・落とし穴まで基礎から押さえる。",
  domain: "web",
  section: "frontend",
  order: 6.5,
  level: "basic",
  tags: ["JavaScript", "アロー関数", "イベント"],
  updated: "2026-07-07",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        React・Vue・Angular のコードには、<Cmd>{"onClick={() => ...}"}</Cmd> や
        <Cmd>{"onChange={(e) => ...}"}</Cmd> という書き方が必ず出てきます。ここで使われている
        <strong>アロー関数</strong>と、イベントハンドラの引数 <Cmd>e</Cmd>（イベントオブジェクト）は、
        フロントエンドの「読み書きの基礎体力」です。この 2 つを先に押さえると、次章からの React 入門がぐっと楽になります。
      </Lead>

      <Section>アロー関数とは</Section>
      <p>
        アロー関数は、関数を短く書くための記法（ES2015 以降）です。まずは従来の関数式と並べて、同じ意味であることを確認します。
      </p>
      <Code lang="js" filename="function-vs-arrow.js">{`// 従来の関数式
const add = function (a, b) {
  return a + b;
};

// アロー関数（同じ意味）
const add2 = (a, b) => {
  return a + b;
};

add(1, 2);   // 3
add2(1, 2);  // 3`}</Code>

      <SubSection>3 つの省略記法</SubSection>
      <p>アロー関数の持ち味は「短く書ける」こと。次の 3 つを覚えると、他人のコードの読解が一気に速くなります。</p>
      <ul>
        <li>引数が <strong>1 個</strong>なら、引数の括弧を省略できる（<Cmd>{"x => x * 2"}</Cmd>）</li>
        <li>本体が<strong>式 1 つ</strong>なら、<Cmd>{"{}"}</Cmd> と <Cmd>return</Cmd> を省略できる（暗黙の return）</li>
        <li>オブジェクトを返すときは <Cmd>()</Cmd> で包む（<Cmd>{"() => ({ id: 1 })"}</Cmd>）</li>
      </ul>
      <Code lang="js" filename="shorthand.js">{`const double  = x => x * 2;            // 引数1個 → () を省略
const square  = x => x * x;            // 単一の式 → return を省略（暗黙return）
const makeUser = () => ({ id: 1 });    // オブジェクトは () で包む

const greet = () => {                  // 複数行なら {} と return が必要
  const msg = "hello";
  return msg;
};`}</Code>

      <Callout variant="warn" title="{} は「本体ブロック」か「オブジェクト」か">
        <Cmd>{"() => { id: 1 }"}</Cmd> は<strong>オブジェクトを返しません</strong>。この <Cmd>{"{}"}</Cmd> は
        「関数の本体ブロック」と解釈され、<Cmd>id:</Cmd> はラベル扱いになって <Cmd>undefined</Cmd> が返ります。
        オブジェクトを返したいときは <Cmd>{"() => ({ id: 1 })"}</Cmd> と<strong>丸括弧で包む</strong>のが鉄則です。
      </Callout>

      <SubSection>3 つの書き方の違い</SubSection>
      <ComparisonTable
        headers={["", "関数宣言", "関数式", "アロー関数"]}
        rows={[
          ["書き方", "function f() {}", "const f = function () {}", "const f = () => {}"],
          ["this", "呼び出し方で変わる", "呼び出し方で変わる", "定義した場所のものを引き継ぐ（束縛しない）"],
          ["巻き上げ (hoisting)", "関数全体が巻き上がる", "変数だけ（本体は後）", "変数だけ（本体は後）"],
          ["主な用途", "トップレベルの関数", "変数に入れる関数", "コールバック・短い処理"],
        ]}
      />

      <Bridge course="プログラミング言語論 / 関数型プログラミング">
        関数を変数に入れたり、引数として別の関数へ渡したりできる——これは講義で習う<strong>第一級関数（first-class function）</strong>と
        <strong>高階関数（higher-order function）</strong>そのものです。<Cmd>map</Cmd> や <Cmd>onClick</Cmd> に関数を渡すのは、
        「あとで呼んでね」と関数を<strong>コールバック</strong>として託す行為。アロー関数が短く書けることで、この「関数を値として扱う」
        スタイルが自然になります。<Cmd>this</Cmd> を束縛しない性質（レキシカルスコープに従う）も、関数型で重視される
        「参照の透明性・予測可能性」に通じます。
      </Bridge>

      <Section>イベント・ハンドラ・引数 e</Section>
      <p>
        ボタンのクリック、入力欄への文字入力、フォーム送信——ユーザーの操作は<strong>イベント</strong>としてブラウザが検知します。
        「そのイベントが起きたら実行する関数」が<strong>イベントハンドラ</strong>です。ハンドラが呼ばれるとき、
        ブラウザ（React）は<strong>イベントオブジェクト</strong>を第 1 引数として渡します。慣習的に、これを
        <Cmd>e</Cmd>（event の頭文字。<Cmd>ev</Cmd> や <Cmd>event</Cmd> でも可）と名付けます。
      </p>
      <Code lang="tsx" filename="handler.tsx">{`// クリックされたときに呼ばれる関数（= ハンドラ）
// ブラウザが「イベントオブジェクト」を e として渡してくる
<button onClick={(e) => {
  console.log("クリックされた要素:", e.target);
}}>
  送信
</button>`}</Code>

      <SubSection>e からよく使うもの</SubSection>
      <KVList
        items={[
          { key: "e.target", val: "イベントが実際に発生した要素。入力欄なら e.target.value で入力値が取れる" },
          { key: "e.currentTarget", val: "ハンドラを登録した要素（target と一致しないこともある）" },
          { key: "e.preventDefault()", val: "既定動作を止める（フォーム送信でのページ遷移、リンク遷移など）" },
          { key: "e.stopPropagation()", val: "親要素へのイベント伝播（バブリング）を止める" },
          { key: "e.key", val: "キーボードイベントで押されたキー名（例: \"Enter\"）" },
        ]}
      />

      <p>いちばん出番が多いのは、入力欄の値を取る <Cmd>e.target.value</Cmd> と、フォーム送信を止める <Cmd>e.preventDefault()</Cmd> です。</p>
      <Code lang="tsx" filename="form.tsx">{`function SearchBox() {
  const [q, setQ] = useState("");

  return (
    <form onSubmit={(e) => {
      e.preventDefault();        // 送信でページが再読み込みされるのを防ぐ
      console.log("検索:", q);
    }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}  // 入力のたびに値を取り出す
      />
      <button type="submit">検索</button>
    </form>
  );
}`}</Code>

      <Callout variant="info" title="React の e は「合成イベント」">
        React が渡す <Cmd>e</Cmd> は、ブラウザごとの差異を吸収した<strong>合成イベント（SyntheticEvent）</strong>です。
        使い勝手は素の DOM イベントとほぼ同じ。TypeScript では型が付き、たとえば入力の <Cmd>onChange</Cmd> は
        <Cmd>{"(e: React.ChangeEvent<HTMLInputElement>) => void"}</Cmd>、クリックは
        <Cmd>{"React.MouseEvent<HTMLButtonElement>"}</Cmd> のように書けます。型のおかげで <Cmd>e.target.value</Cmd> が
        文字列だと保証され、補完も効きます。
      </Callout>

      <Bridge course="オペレーティングシステム / GUI・イベント駆動プログラミング">
        画面を持つアプリは<strong>イベント駆動（event-driven）</strong>で動きます。OS やブラウザがマウス・キーボードの
        割り込みを受け取り、<strong>イベントループ</strong>がイベントを 1 つずつ取り出して、対応するハンドラ（コールバック）を呼ぶ——
        講義で学ぶこの構造が、そのまま <Cmd>onClick</Cmd> の裏側です。「ハンドラを登録しておき、イベント発生時に呼んでもらう」のは
        <strong>Observer パターン</strong>／コールバックの典型例。<Cmd>e</Cmd> は、そのとき OS/ブラウザが「何が・どこで起きたか」を
        詰めて渡してくる情報パケットだと捉えると腑に落ちます。
      </Bridge>

      <Section>「渡す」と「呼ぶ」を間違えない</Section>
      <p>
        ハンドラには<strong>関数そのものを渡す</strong>のが基本です。うっかり括弧 <Cmd>()</Cmd> を付けると、
        <strong>その場で実行</strong>されてしまい、戻り値がハンドラとして登録されてしまいます（レンダーのたびに即実行される、よくあるバグ）。
      </p>
      <Code lang="tsx" filename="pass-vs-call.tsx">{`// OK: 関数を「渡す」
<button onClick={handleClick}>OK</button>

// NG: その場で「呼んで」しまう（戻り値が渡る＝多くは undefined）
<button onClick={handleClick()}>NG</button>

// 引数を渡したいとき: アロー関数で包んで「呼び出しを遅らせる」
<button onClick={() => handleClick(item.id)}>OK（引数付き）</button>`}</Code>
      <Callout variant="warn" title="引数を渡したいときこそアロー関数">
        「クリック時に <Cmd>handleClick(id)</Cmd> を呼びたい」場合、<Cmd>{"onClick={handleClick(id)}"}</Cmd> は
        レンダー時に即実行されてしまい間違いです。<Cmd>{"onClick={() => handleClick(id)}"}</Cmd> のように
        アロー関数で包み、「クリックされたら呼ぶ」という<strong>実行の先送り</strong>にするのが正解です。
      </Callout>

      <Quiz
        question={<>入力欄 <Cmd>{"<input>"}</Cmd> に打った文字を state に反映するとき、値を取り出す正しい書き方はどれ？</>}
        options={[
          <Cmd>{"onChange={setQ(e.target.value)}"}</Cmd>,
          <Cmd>{"onChange={(e) => setQ(e.target.value)}"}</Cmd>,
          <Cmd>{"onChange={() => setQ(value)}"}</Cmd>,
          <Cmd>{"onChange={setQ(value)}"}</Cmd>,
        ]}
        answer={1}
        explanation={
          <>
            ハンドラには「関数を渡す」ので、アロー関数で包みます。入力値はイベントオブジェクト
            <Cmd>e</Cmd> の <Cmd>e.target.value</Cmd> から取り出します。括弧を付けて
            <Cmd>{"setQ(e.target.value)"}</Cmd> と書くとレンダー時に即実行されてしまい、そもそも
            <Cmd>e</Cmd> も受け取れません。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "アロー関数 () => {} は関数を短く書く記法。引数1個は () 省略、単一式は return 省略、オブジェクトは () で包む",
          "アロー関数は this を束縛しない（定義位置のものを引き継ぐ）。コールバックに向く",
          "イベントハンドラの第1引数 e はイベントオブジェクト。e.target.value・e.preventDefault() が頻出",
          "React の e は合成イベント（SyntheticEvent）。TS では React.ChangeEvent などの型が付く",
          "ハンドラは関数を「渡す」。onClick={f} は OK、onClick={f()} は即実行のバグ。引数付きは () => f(x)",
        ]}
      />
    </>
  );
}

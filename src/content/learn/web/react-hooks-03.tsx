import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, KVList, TipBox, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "react-hooks-03",
  title: "React 入門③ — Hooks を使いこなす",
  description: "useState/useEffect/useRef/useMemo/useCallback/useContext とカスタムフック。副作用や参照の扱いを、Hooks の仕組みとともに実践レベルで。",
  domain: "web",
  section: "frontend",
  order: 9,
  level: "practice",
  tags: ["React", "Hooks", "useEffect"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <Cmd>useState</Cmd> はすでに登場しました。React には他にも<strong>フック（Hooks）</strong>が
        あり、副作用・参照・メモ化・共有状態などを関数コンポーネントから扱えます。この記事では
        主要なフックを、その<strong>仕組みとルール</strong>まで含めて実践レベルで整理し、最後に
        自分だけのフック（カスタムフック）を作ります。
      </Lead>

      <Section label="01">Hooks とは何か</Section>
      <p>
        Hooks は「関数コンポーネントに、状態やライフサイクルなどの機能を<strong>接続（hook into）</strong>
        する」ための関数群です。名前はすべて <Cmd>use</Cmd> で始まります。かつてはクラス
        コンポーネントでしか扱えなかった機能を、関数だけで書けるようにしたのが Hooks です。
      </p>

      <ComparisonTable
        headers={["フック", "役割"]}
        rows={[
          [<Cmd>useState</Cmd>, "状態を持つ"],
          [<Cmd>useEffect</Cmd>, "副作用（外部との同期）を扱う"],
          [<Cmd>useRef</Cmd>, "再描画されない箱・DOM 参照を持つ"],
          [<Cmd>useMemo</Cmd>, "計算結果をメモ化する"],
          [<Cmd>useCallback</Cmd>, "関数をメモ化する"],
          [<Cmd>useContext</Cmd>, "離れた親から値を受け取る"],
        ]}
      />

      <Divider />

      <Section label="02">Hooks のルールと仕組み</Section>
      <p>Hooks には守るべき 2 つのルールがあります。これは仕組みから来る必然です。</p>

      <KeyPoints
        title="Hooks の 2 大ルール"
        items={[
          "コンポーネント（またはカスタムフック）の中でだけ呼ぶ",
          "トップレベルでだけ呼ぶ（if / for / ネスト関数の中で呼ばない）",
        ]}
      />

      <SubSection>なぜ「呼び出し順」が命なのか</SubSection>
      <p>
        React は、フックが<strong>「何番目に呼ばれたか」だけ</strong>で state を管理しています。
        フックに名前の紐付けはなく、内部的には<strong>呼び出し順に並んだ配列</strong>のような
        仕組みで「1 個目の useState はこの値、2 個目はこの値」と対応付けています。
      </p>

      <Code lang="tsx" filename="内部イメージ">{`// React 内部の対応（概念図）
// hooks = [count の状態, name の状態]
function Form() {
  const [count, setCount] = useState(0); // 呼び出し 1 番目
  const [name, setName]   = useState(""); // 呼び出し 2 番目
  // 毎回 同じ順で呼ばれるから、順番だけで復元できる
}`}</Code>

      <p>
        だから、条件分岐でフックを呼ぶと順番がずれ、React が state を取り違えます。
        次は<strong>やってはいけない</strong>例です。
      </p>

      <Code lang="tsx" filename="NG：条件付きで呼ぶ">{`function Bad({ show }: { show: boolean }) {
  if (show) {
    const [x] = useState(0); // ← 呼ばれたり呼ばれなかったりで順序が崩れる
  }
  const [y] = useState(0);   // y の対応先がずれる
}`}</Code>

      <Callout variant="tip" title="条件が要るなら、フックの「中」で分岐する">
        「条件によってフックを呼ぶか変える」のではなく、<strong>常に同じ順でフックを呼び、その値の
        使い方を条件で変える</strong>のが正解です。<Cmd>useEffect</Cmd> の中で
        <Cmd>if (show) {"{ ... }"}</Cmd> と書くのは問題ありません。
      </Callout>

      <p>
        言い換えると、フックの呼び出し列は<strong>「レンダリングのたびに同一の順序をたどる」ことを暗黙の契約</strong>にしています。
        React はその順序を「状態を格納したリンクリストのカーソル」で進めており、呼び出しがずれるとカーソルが別の状態を指してしまう。
        これは、正しい順序で呼ぶことを前提に置いた<strong>手続き的な API 設計</strong>です。
      </p>

      <Bridge course="プログラミング言語論 / 評価戦略">
        「フックは呼び出し順にだけ依存し、条件分岐で呼んではいけない」というルールは、
        講義で扱う<strong>評価順序（evaluation order）</strong>や<strong>環境（束縛の並び）</strong>の話と地続きです。
        React は名前ではなく<strong>呼び出し位置</strong>で状態を紐付ける——これは変数を名前でなく
        <strong>De Bruijn インデックス（位置）</strong>で参照するのに似ています。位置が変われば別物を指す。
        だからこそ「毎回同じ順で、同じ回数だけ評価される」ことが健全性の前提になります。
        <Cmd>eslint-plugin-react-hooks</Cmd> は、この規則を<strong>静的解析</strong>で機械的に検証する——
        コンパイラ理論の「実行前にプログラムの性質を検査する」応用例です。
      </Bridge>

      <Divider />

      <Section label="03">useState 詳説</Section>
      <p>
        基本は前回の通りですが、実践では次の 2 つを押さえておくと安心です。まず、初期値の計算が
        重い場合は<strong>関数を渡す（遅延初期化）</strong>と、初回レンダリング時だけ実行されます。
      </p>

      <Code lang="tsx" filename="遅延初期化">{`// 毎レンダリングで heavy() が走ってしまう
const [v, setV] = useState(heavy());

// 初回だけ heavy() が走る（関数を渡す）
const [v2, setV2] = useState(() => heavy());`}</Code>

      <p>
        次に、TypeScript ではジェネリクスで state の型を明示できます。空配列や null 始まりのときに
        特に有効です。
      </p>

      <Code lang="tsx" filename="型指定">{`const [items, setItems] = useState<string[]>([]);
const [user, setUser]   = useState<User | null>(null);`}</Code>

      <SubSection>なぜ関数の中の値が「次のレンダリングまで残る」のか</SubSection>
      <p>
        関数コンポーネントは呼ばれるたびに変数を宣言し直します。それでも <Cmd>count</Cmd> が保持されるのは、
        値を<strong>関数の外（React 側の記憶領域）に置き、毎回そこから取り出している</strong>からです。
        そして、あるレンダリングで作られたイベントハンドラは、<strong>その時点の <Cmd>count</Cmd> を
        閉じ込めた<Cmd>クロージャ</Cmd></strong>になります。これが「set した直後の行では count がまだ古い」の正体です。
      </p>

      <Code lang="tsx" filename="各レンダリングは自分の値を閉じ込める">{`function Counter() {
  const [count, setCount] = useState(0);
  // この onClick は「今回の count」を閉じ込めたクロージャ
  const onClick = () => setCount(count + 1);
  return <button onClick={onClick}>{count}</button>;
  // 次のレンダリングでは 別の count を閉じ込めた 別の onClick が作られる
}`}</Code>

      <Bridge course="関数型プログラミング / クロージャ">
        <Cmd>useState</Cmd> が「関数を抜けても値を覚えている」のは、講義で習う<strong>クロージャ（closure）</strong>と
        <strong>自由変数の束縛</strong>で説明できます。関数がその<strong>定義環境</strong>を捕捉して持ち歩くから、
        レンダリングごとに <Cmd>count</Cmd> という自由変数の<strong>スナップショット</strong>が別々に閉じ込められる。
        「stale closure（古い値を掴む）」バグは、講義で作る<strong>カウンタ生成関数
        （<Cmd>makeCounter</Cmd>）</strong>で捕捉した変数がクロージャごとに独立するのと同じ現象です。
        <Cmd>setCount(prev =&gt; prev + 1)</Cmd> が安全なのは、閉じ込めた古い値ではなく
        React が渡す<strong>最新の状態</strong>を引数で受け取るから——クロージャの罠を関数型の作法で回避しているわけです。
      </Bridge>

      <Divider />

      <Section label="04">useEffect — 副作用を扱う</Section>
      <p>
        <strong>副作用</strong>とは、レンダリング（JSX を返すこと）以外の処理 —— データ取得、
        購読、タイマー、DOM の直接操作、ログ送信など「外の世界との同期」です。これらは
        <Cmd>useEffect</Cmd> に書きます。
      </p>

      <Code lang="tsx" filename="useEffect の基本">{`import { useEffect, useState } from "react";

function Title({ id }: { id: number }) {
  useEffect(() => {
    document.title = "記事 #" + id; // 副作用
  });
  return <h1>記事 #{id}</h1>;
}`}</Code>

      <SubSection>実行タイミング</SubSection>
      <p>
        <Cmd>useEffect</Cmd> のコールバックは、<strong>レンダリングが画面に反映された「後」</strong>
        に実行されます。描画を邪魔しないため、体感が滑らかになります。
      </p>

      <SubSection>依存配列で「いつ実行するか」を絞る</SubSection>
      <p>
        第 2 引数の<strong>依存配列</strong>で、再実行の条件を指定します。ここが useEffect の要です。
      </p>

      <Code lang="tsx" filename="依存配列の 3 パターン">{`// (1) 依存なし → 毎レンダリング後に実行
useEffect(() => { /* ... */ });

// (2) 空配列 → 初回マウント時に一度だけ
useEffect(() => { /* ... */ }, []);

// (3) 値を列挙 → その値が変わったときだけ
useEffect(() => { /* ... */ }, [id]);`}</Code>

      <Callout variant="warn" title="依存に入れ忘れると「古い値」を掴む">
        effect の中で使っている state / props は、原則すべて依存配列に入れます。入れ忘れると、
        コールバックが古い値を参照し続ける（stale closure）バグになります。ESLint の
        <Cmd>react-hooks/exhaustive-deps</Cmd> が警告してくれます。
      </Callout>

      <SubSection>クリーンアップ関数</SubSection>
      <p>
        effect が<strong>関数を return すると、それが「後始末」</strong>として呼ばれます。タイマー
        解除・購読解除・接続の切断などに使い、メモリリークや二重登録を防ぎます。
      </p>

      <Code lang="tsx" filename="クリーンアップ">{`useEffect(() => {
  const id = setInterval(() => {
    console.log("tick");
  }, 1000);

  // 依存が変わる直前・アンマウント時に呼ばれる
  return () => clearInterval(id);
}, []);`}</Code>

      <p>クリーンアップが呼ばれるのは次の 2 つのタイミングです。</p>
      <Steps>
        <Step title="アンマウント時">
          コンポーネントが画面から消えるとき、最後のクリーンアップが実行される。
        </Step>
        <Step title="再実行の直前">
          依存が変わって effect を実行し直す前に、まず前回のクリーンアップが走る（古い購読を
          止めてから新しく張り直す）。
        </Step>
      </Steps>

      <Code lang="tsx" filename="データ取得の実例">{`function User({ id }: { id: number }) {
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    let alive = true; // 競合防止フラグ
    fetch("/api/users/" + id)
      .then((r) => r.json())
      .then((u) => { if (alive) setData(u); });
    return () => { alive = false; }; // 古い結果を捨てる
  }, [id]);

  return <p>{data?.name ?? "読み込み中"}</p>;
}`}</Code>

      <TipBox>
        React 19 / Strict Mode の開発時は、effect が<strong>意図的に 2 回</strong>実行されます。
        これはクリーンアップの実装漏れをあぶり出すための挙動で、本番ビルドでは 1 回です。上の
        <Cmd>alive</Cmd> フラグのように、二重実行に耐える書き方を身につけましょう。
      </TipBox>

      <Divider />

      <Section label="05">useRef — 再描画されない箱</Section>
      <p>
        <Cmd>useRef</Cmd> は <Cmd>.current</Cmd> という書き換え可能な箱を返します。用途は 2 つ。
        <strong>(1) DOM 要素への参照</strong>と、<strong>(2) 再レンダリングを起こさずに値を保持</strong>
        することです。state と違い、<Cmd>.current</Cmd> を変えても再描画は起きません。
      </p>

      <Code lang="tsx" filename="DOM 参照">{`function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => inputRef.current?.focus();

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focus}>入力欄へフォーカス</button>
    </>
  );
}`}</Code>

      <Code lang="tsx" filename="描画に関係ない値の保持">{`function Timer() {
  const idRef = useRef<number | null>(null); // 再描画不要な保持

  const start = () => {
    idRef.current = window.setInterval(() => console.log("tick"), 1000);
  };
  const stop = () => {
    if (idRef.current) clearInterval(idRef.current);
  };
  return <><button onClick={start}>開始</button><button onClick={stop}>停止</button></>;
}`}</Code>

      <ComparisonTable
        headers={["", "useState", "useRef"]}
        rows={[
          ["変更で再描画", "する", "しない"],
          ["主な用途", "画面に映る値", "DOM 参照・裏方の値"],
          ["読み書き", "value / setX", ".current を直接"],
        ]}
      />

      <Divider />

      <Section label="06">useMemo / useCallback — メモ化</Section>
      <p>
        再レンダリングのたびに重い計算をやり直したり、関数を作り直したりするのを避けるのが
        <strong>メモ化</strong>です。<Cmd>useMemo</Cmd> は<strong>計算結果</strong>を、
        <Cmd>useCallback</Cmd> は<strong>関数そのもの</strong>を、依存が変わるまで使い回します。
      </p>

      <Code lang="tsx" filename="useMemo（値をメモ化）">{`const sorted = useMemo(() => {
  // items が変わらなければ再計算しない
  return [...items].sort((a, b) => a - b);
}, [items]);`}</Code>

      <Code lang="tsx" filename="useCallback（関数をメモ化）">{`// 依存が変わらなければ同じ関数の参照を保つ
const handleClick = useCallback(() => {
  console.log(id);
}, [id]);`}</Code>

      <p>
        <Cmd>useCallback</Cmd> が効くのは、その関数を<strong>props で子に渡し、子が
        <Cmd>React.memo</Cmd> でメモ化されている</strong>ようなケースです。毎回新しい関数を渡すと
        子が不要に再描画されるのを防げます。
      </p>

      <Callout variant="danger" title="メモ化は「常に善」ではない">
        useMemo / useCallback 自体にもコスト（依存比較・関数保持）があります。軽い計算にまで乱用
        すると、かえって読みにくく遅くなります。<strong>計測して重いと分かった箇所</strong>や、
        <strong>参照の同一性が必要な箇所</strong>に絞って使いましょう。
      </Callout>

      <TipBox>
        React 19 には実験的な自動メモ化（React Compiler）があり、将来的には手動の useMemo /
        useCallback が減っていく見込みです。ただし仕組みの理解は今も必須です。
      </TipBox>

      <Divider />

      <Section label="07">useContext — 離れた親から値を受け取る</Section>
      <p>
        props を何段も手渡しする「バケツリレー（prop drilling）」を避け、離れた子孫へ直接値を
        届けるのが <Cmd>useContext</Cmd> です。テーマ・ログインユーザー・言語設定など「多くの場所で
        使う共有値」に向いています。
      </p>

      <Steps>
        <Step title="1. Context を作る">
          <Cmd>createContext</Cmd> で入れ物を作る。
        </Step>
        <Step title="2. Provider で値を配る">
          値を使わせたい範囲を <Cmd>&lt;Ctx.Provider value=...&gt;</Cmd> で囲む。
        </Step>
        <Step title="3. useContext で受け取る">
          子孫のどこからでも <Cmd>useContext(Ctx)</Cmd> で読める。
        </Step>
      </Steps>

      <Code lang="tsx" filename="1) 作る">{`import { createContext, useContext } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<Theme>("light");`}</Code>

      <Code lang="tsx" filename="2) 配る">{`function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}`}</Code>

      <Code lang="tsx" filename="3) 受け取る">{`function Button() {
  const theme = useContext(ThemeContext); // "dark"
  return <button className={theme}>OK</button>;
}`}</Code>

      <Callout variant="info" title="Context は「状態管理」そのものではない">
        Context は値を「配る」仕組みで、値を「持つ」のは <Cmd>useState</Cmd> 等です。実務では
        Provider の中で state を持ち、その値と更新関数をまとめて <Cmd>value</Cmd> に渡す形が定番です。
      </Callout>

      <Divider />

      <Section label="08">カスタムフックを作る</Section>
      <p>
        複数のコンポーネントで使い回したいロジック（フックの組み合わせ）は、<Cmd>use</Cmd> で始まる
        自作の関数 —— <strong>カスタムフック</strong>にまとめられます。中で他のフックを呼べる普通の
        関数です。UI を含まず、<strong>ロジックだけ</strong>を切り出せるのが利点です。
      </p>

      <Code lang="tsx" filename="useToggle（開閉ロジック）">{`import { useState, useCallback } from "react";

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle] as const; // タプルとして返す
}`}</Code>

      <Code lang="tsx" filename="使う側">{`function Panel() {
  const [open, toggle] = useToggle();
  return (
    <>
      <button onClick={toggle}>{open ? "閉じる" : "開く"}</button>
      {open && <div>詳細コンテンツ</div>}
    </>
  );
}`}</Code>

      <p>
        もう一段実用的な例として、ウィンドウ幅を購読するフックを示します。<Cmd>useEffect</Cmd> の
        購読とクリーンアップがそのまま再利用可能な部品になります。
      </p>

      <Code lang="tsx" filename="useWindowWidth">{`import { useState, useEffect } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}`}</Code>

      <Callout variant="tip" title="カスタムフックの掟">
        名前は必ず <Cmd>use</Cmd> で始める（Hooks のルールを ESLint が適用できるように）。そして、
        カスタムフックが返すのは値やハンドラであって JSX ではありません。<strong>見た目はコンポーネント、
        ロジックはカスタムフック</strong>と役割を分けると、テストも再利用もしやすくなります。
      </Callout>

      <Divider />

      <Section label="09">この後 — React の内部へ</Section>
      <p>
        ここまでで、React を「技術習得できるレベル」で使う土台 —— コンポーネント・JSX・state・
        再レンダリング・Hooks —— が揃いました。ここから先は「なぜこう動くのか」を一段深く掘る
        内部シリーズへ橋渡しします。
      </p>

      <KVList
        items={[
          { key: "仮想 DOM と差分", val: "createElement が作る要素ツリーを、React はどう比較（reconciliation）して最小の DOM 更新に落とすのか" },
          { key: "Fiber", val: "レンダリングを中断・再開できる React の内部アーキテクチャ。優先度付きの更新スケジューリング" },
          { key: "コミットフェーズ", val: "計算した差分を実 DOM に反映する瞬間。effect が呼ばれるタイミングとの関係" },
        ]}
      />

      <p>
        「宣言的に書いたら勝手に更新される」その裏側を知ると、依存配列やメモ化、key の意味が
        一段クリアになります。次のシリーズで、その内部機構に踏み込みます。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "Hooks は use で始まり、コンポーネント/カスタムフックのトップレベルでだけ呼ぶ",
          "React はフックを「呼び出し順」で管理する（位置で束縛）。だから条件分岐で呼んではいけない",
          "各レンダリングは自分の state をクロージャに閉じ込める。stale closure は関数型の理屈で理解できる",
          "useEffect は描画後に実行。依存配列で再実行条件を絞り、return でクリーンアップ",
          "useRef は .current の箱。再描画を起こさず値を保持し、DOM 参照にも使う",
          "useMemo は値、useCallback は関数をメモ化。重い箇所・参照同一性が要る箇所に限定",
          "useContext は prop drilling を避けて離れた子孫へ値を配る（値を持つのは state）",
          "再利用したいロジックは use で始まるカスタムフックに切り出す",
        ]}
      />
    </>
  );
}

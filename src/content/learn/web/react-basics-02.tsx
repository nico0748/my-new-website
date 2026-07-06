import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, TipBox, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "react-basics-02",
  title: "React 入門② — state・イベント・レンダリング",
  description: "useState による状態管理、イベント処理、条件分岐とリスト表示、フォーム、状態のリフトアップを、再レンダリングの仕組みとともに学ぶ。",
  domain: "web",
  section: "frontend",
  order: 8,
  level: "basic",
  tags: ["React", "state", "レンダリング"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        前回は props（親から子への入力）を学びました。今回は、コンポーネント自身が持って
        <strong>変化する値 —— state（状態）</strong>を扱います。state が変わると React が画面を
        描き直す —— この<strong>再レンダリング</strong>の仕組みを軸に、イベント処理・条件分岐・
        リスト・フォームまで一気通貫で押さえます。
      </Lead>

      <Section label="01">state — useState で状態を持つ</Section>
      <p>
        ボタンを押した回数、入力欄の文字、開閉フラグ —— こうした「時間とともに変わる値」を
        コンポーネントに持たせるのが <Cmd>useState</Cmd> です。React が用意する
        <strong>フック（Hook）</strong>の 1 つで、値を返すのではなく「値」と「更新関数」のペアを
        配列で返します。
      </p>

      <Code lang="tsx" filename="useState の基本">{`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  //     ^現在値   ^更新関数     ^初期値
  return (
    <button onClick={() => setCount(count + 1)}>
      押した回数: {count}
    </button>
  );
}`}</Code>

      <p>
        <Cmd>useState(0)</Cmd> は「初期値 0 の状態」を作り、<Cmd>[現在値, 更新関数]</Cmd> を返します。
        分割代入で <Cmd>count</Cmd> と <Cmd>setCount</Cmd> という名前を付けています。命名は
        <Cmd>[x, setX]</Cmd> の慣習に従うと読みやすくなります。
      </p>

      <Callout variant="warn" title="値を直接書き換えてはいけない">
        <Cmd>count = count + 1</Cmd> や <Cmd>count++</Cmd> のように直接代入しても React は変化に
        気づかず、画面は更新されません。必ず更新関数 <Cmd>setCount(...)</Cmd> を通してください。
      </Callout>

      <Divider />

      <Section label="02">state 更新で再レンダリングされる仕組み</Section>
      <p>
        ここが React の心臓部です。<strong>状態が変わると、そのコンポーネント関数がもう一度
        呼び出され、返した JSX で画面が更新されます。</strong>流れを分解するとこうなります。
      </p>

      <Steps>
        <Step title="1. 初回レンダリング">
          React が <Cmd>Counter()</Cmd> を呼ぶ。<Cmd>useState(0)</Cmd> が <Cmd>count = 0</Cmd> を返し、
          <Cmd>0</Cmd> を表示。
        </Step>
        <Step title="2. イベント発火">
          ボタンクリックで <Cmd>setCount(count + 1)</Cmd> が呼ばれ、React に「次は 1 だ」と伝わる。
        </Step>
        <Step title="3. 再レンダリング">
          React が<strong>もう一度 <Cmd>Counter()</Cmd> を呼ぶ</strong>。今度は
          <Cmd>useState</Cmd> が最新値 <Cmd>count = 1</Cmd> を返す。
        </Step>
        <Step title="4. 差分だけ DOM に反映">
          新旧の JSX（仮想 DOM）を比較し、変わった箇所だけ実 DOM を書き換える。
        </Step>
      </Steps>

      <p>
        つまり React では、コンポーネント関数は「一度きり」ではなく<strong>状態が変わるたびに
        繰り返し呼ばれます</strong>。関数の中で毎回変数を宣言し直しているのに値が保持されるのは、
        <Cmd>useState</Cmd> が値を React 側に覚えさせているからです。
      </p>

      <Callout variant="info" title="set しても、その行の count はまだ古い">
        <Cmd>setCount</Cmd> は「次のレンダリングに向けた予約」です。同じ関数内の <Cmd>count</Cmd> は
        更新されません。次に関数が呼ばれたときに新しい値になります。
      </Callout>

      <Code lang="tsx" filename="よくある勘違い">{`function Counter() {
  const [count, setCount] = useState(0);
  const onClick = () => {
    setCount(count + 1);
    console.log(count); // ← まだ古い値（このレンダリング中は不変）
  };
  return <button onClick={onClick}>{count}</button>;
}`}</Code>

      <SubSection>関数型更新で「最新値」を安全に使う</SubSection>
      <p>
        続けて 2 回増やしたいとき <Cmd>setCount(count + 1)</Cmd> を 2 回書いても、両方とも古い
        <Cmd>count</Cmd> を見るので 1 しか増えません。前の値を確実に使うには、更新関数に
        <strong>関数</strong>を渡します。
      </p>

      <Code lang="tsx" filename="関数型更新">{`// NG: どちらも古い count を見るので +1 にしかならない
setCount(count + 1);
setCount(count + 1);

// OK: 直前の値を引数で受け取る → +2 になる
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);`}</Code>

      <Bridge course="関数型プログラミング">
        <Cmd>setCount(prev =&gt; prev + 1)</Cmd> に渡すのは、<strong>「今の状態」を受け取り「次の状態」を返す純粋関数</strong>です。
        講義で習う <Cmd>reduce</Cmd>（<Cmd>(acc, x) =&gt; acc'</Cmd>）と同じ形——状態遷移を「関数の適用」として表す発想です。
        直接 <Cmd>count = count + 1</Cmd> と書くのが命令的な破壊的代入なのに対し、関数型更新は
        <strong>前の値から新しい値を計算して返す</strong>だけで元を壊しません（不変性）。
        「なぜ古い値を掴むのか」も、各レンダリングが <Cmd>count</Cmd> を<strong>その時点の定数</strong>として閉じ込めている（クロージャ）から、と関数型の言葉で説明できます。
      </Bridge>

      <Divider />

      <Section label="03">イベントハンドラ</Section>
      <p>
        クリックや入力などのイベントは、<Cmd>onClick</Cmd> / <Cmd>onChange</Cmd> のように
        camelCase の属性に<strong>関数そのもの</strong>を渡します。関数呼び出しの結果ではない点に
        注意してください。
      </p>

      <Code lang="tsx" filename="ハンドラの渡し方">{`// OK: 関数を渡す（クリック時に呼ばれる）
<button onClick={handleClick}>送信</button>

// OK: 引数を渡したいときはアロー関数で包む
<button onClick={() => handleClick(id)}>削除</button>

// NG: これは「今すぐ呼んだ結果」を渡してしまう
<button onClick={handleClick()}>送信</button>`}</Code>

      <p>
        イベントオブジェクトはハンドラの第 1 引数で受け取れます。フォーム送信のリロードを止める
        <Cmd>e.preventDefault()</Cmd> などで使います。
      </p>

      <Code lang="tsx" filename="イベントオブジェクト">{`function handleSubmit(e: React.FormEvent) {
  e.preventDefault();       // 既定のページ遷移を止める
  console.log("submitted");
}`}</Code>

      <Divider />

      <Section label="04">条件付きレンダリング</Section>
      <p>
        「ログイン中なら名前、未ログインならボタン」のように、状態によって表示を切り替えます。
        JSX の <Cmd>{"{ }"}</Cmd> には式しか書けないので、<Cmd>if</Cmd> 文ではなく
        <strong>三項演算子</strong>や <Cmd>&&</Cmd> を使います。
      </p>

      <SubSection>三項演算子（A か B か）</SubSection>
      <Code lang="tsx" filename="三項">{`function Nav({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div>
      {loggedIn ? <span>ようこそ</span> : <button>ログイン</button>}
    </div>
  );
}`}</Code>

      <SubSection>&& （あるときだけ出す）</SubSection>
      <p>
        「条件が真のときだけ表示、偽なら何も出さない」場合は <Cmd>&&</Cmd> が簡潔です。
        左辺が真なら右辺の JSX が、偽なら何も描かれません。
      </p>

      <Code lang="tsx" filename="論理積">{`function Badge({ count }: { count: number }) {
  return (
    <div>
      通知
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}`}</Code>

      <Callout variant="warn" title="&& の落とし穴：0 が表示される">
        <Cmd>{"{count && ...}"}</Cmd> で <Cmd>count</Cmd> が <Cmd>0</Cmd> のとき、React は数値の
        <Cmd>0</Cmd> をそのまま描画してしまいます。<Cmd>{"{count > 0 && ...}"}</Cmd> のように
        必ず<strong>真偽値</strong>にしてから <Cmd>&&</Cmd> を使いましょう。
      </Callout>

      <Divider />

      <Section label="05">UI を状態機械として設計する</Section>
      <p>
        条件付きレンダリングを一歩進めると、<strong>「UI は状態機械（ステートマシン）である」</strong>という
        設計観にたどり着きます。画面がとり得る状態を列挙し、状態ごとに見た目を決め、イベントで状態を遷移させる。
        たとえば非同期データ取得の画面は <Cmd>idle → loading → success / error</Cmd> という
        <strong>有限個の状態</strong>を持つ、まさに有限オートマトンです。
      </p>

      <Code lang="tsx" filename="状態を「文字列の集合」で表す">{`type Status = "idle" | "loading" | "success" | "error";

function Panel() {
  const [status, setStatus] = useState<Status>("idle");
  // 状態ごとに「あるべき見た目」を1対1で決める
  if (status === "loading") return <Spinner />;
  if (status === "error")   return <ErrorView />;
  if (status === "success") return <Result />;
  return <StartButton onClick={() => setStatus("loading")} />;
}`}</Code>

      <p>
        よくある失敗は、<Cmd>isLoading</Cmd> と <Cmd>isError</Cmd> と <Cmd>isDone</Cmd> を
        <strong>別々の boolean</strong>で持つこと。boolean が 3 つなら組み合わせは 2×2×2 = 8 通りあり、
        その大半は<strong>あり得ない状態</strong>（loading かつ error、など）です。1 つの
        <Cmd>Status</Cmd> 型にまとめれば、状態は 4 通りに限定され、矛盾した画面が原理的に作れなくなります。
      </p>

      <ComparisonTable
        headers={["設計", "状態数", "問題"]}
        rows={[
          ["boolean を複数持つ", "2^n 通り（爆発）", "あり得ない組み合わせが表現できてしまう"],
          ["単一の状態型（union）で持つ", "n 通り（有限・明確）", "遷移だけ定義すればよく、矛盾が起きない"],
        ]}
      />

      <Bridge course="オートマトン / 状態機械">
        <Cmd>idle → loading → success/error</Cmd> は、講義で習う<strong>有限オートマトン（FSM）</strong>そのものです。
        <strong>状態集合 Q</strong>（=とり得る画面）、<strong>入力 Σ</strong>（=ユーザー操作・API 応答）、
        <strong>遷移関数 δ: Q×Σ→Q</strong>（=どのイベントでどの状態へ移るか）という定式化が、UI 設計にそのまま使えます。
        「boolean を複数持つと状態が爆発する」のは、<strong>到達不能・不正な状態</strong>を型で排除できていないから。
        状態を union 型で列挙するのは、オートマトンの状態集合 Q を明示的に定義する行為に等しく、
        XState のような状態遷移ライブラリはこの理論を実装に落としたものです。
      </Bridge>

      <Divider />

      <Section label="06">リスト表示 — map と key</Section>
      <p>
        配列から複数の要素を描くときは、<Cmd>Array.map()</Cmd> で「各要素 → JSX」に変換します。
        JSX の中に JSX の配列を置くと、React はそれを並べて描画します。
      </p>

      <Code lang="tsx" filename="map でリスト化">{`const fruits = ["りんご", "みかん", "ぶどう"];

function List() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}`}</Code>

      <SubSection>なぜ key が必要か</SubSection>
      <p>
        <Cmd>key</Cmd> は、リストの各要素を React が<strong>個別に識別する</strong>ための目印です。
        再レンダリング時、React は key を見て「どの要素が追加・削除・移動されたか」を判断し、DOM の
        書き換えを最小限にします。key が無い（または index を使う）と、並び替えや途中削除で
        「状態が別の行に付いてしまう」バグが起きます。
      </p>

      <Callout variant="danger" title="key に配列 index を使わない（並びが変わるなら）">
        <Cmd>key={"{index}"}</Cmd> は要素の追加・削除・並び替えで意味がずれ、入力欄の値が別行に
        残るなどの不具合を生みます。<strong>データ固有の ID</strong>（<Cmd>item.id</Cmd> など）を
        key にしてください。
      </Callout>

      <Code lang="tsx" filename="ID を key に">{`const users = [
  { id: 1, name: "Yuma" },
  { id: 2, name: "Aoi" },
];

<ul>
  {users.map((u) => (
    <li key={u.id}>{u.name}</li>
  ))}
</ul>;`}</Code>

      <Divider />

      <Section label="07">フォームと制御コンポーネント</Section>
      <p>
        React では、入力欄の値も state で管理するのが基本です。<Cmd>value</Cmd> を state に、
        <Cmd>onChange</Cmd> で state を更新する —— このように React が値を握っている入力欄を
        <strong>制御コンポーネント（controlled component）</strong>と呼びます。
      </p>

      <Code lang="tsx" filename="制御された input">{`function NameForm() {
  const [name, setName] = useState("");

  return (
    <form>
      <input
        value={name}                             // 表示値は state
        onChange={(e) => setName(e.target.value)} // 入力で state 更新
      />
      <p>入力中: {name}</p>
    </form>
  );
}`}</Code>

      <p>
        流れは「入力する → <Cmd>onChange</Cmd> 発火 → <Cmd>setName</Cmd> → 再レンダリング →
        <Cmd>value</Cmd> が新しい state に」という一周です。表示は常に state と一致するため、
        バリデーションや整形（大文字化・桁区切りなど）を挟みやすいのが利点です。
      </p>

      <Code lang="tsx" filename="送信ハンドラ">{`function NameForm() {
  const [name, setName] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("送信: " + name);
    setName(""); // 送信後に空へ
  };

  return (
    <form onSubmit={onSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">送信</button>
    </form>
  );
}`}</Code>

      <Divider />

      <Section label="08">状態のリフトアップ</Section>
      <p>
        兄弟どうしのコンポーネントが同じ state を共有したいときは、state を<strong>共通の親へ
        引き上げます（lifting state up）</strong>。親が state を持ち、子には「値」と「更新関数」を
        props で配ります。データは上から、更新の合図は下から、という形です。
      </p>

      <Code lang="tsx" filename="親が state を持つ">{`function Parent() {
  const [text, setText] = useState("");

  return (
    <>
      {/* 入力する子 */}
      <Input value={text} onChange={setText} />
      {/* 表示する子（同じ state を見る） */}
      <Preview value={text} />
    </>
  );
}`}</Code>

      <Code lang="tsx" filename="子は props を受け取るだけ">{`function Input({ value, onChange }: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  );
}

function Preview({ value }: { value: string }) {
  return <p>プレビュー: {value}</p>;
}`}</Code>

      <TipBox>
        「どこに state を置くか」の指針: その state を必要とする<strong>すべてのコンポーネントの
        いちばん近い共通の親</strong>に置く。深すぎる受け渡し（バケツリレー）が辛くなったら、
        次の記事の <Cmd>useContext</Cmd> を検討します。
      </TipBox>

      <Divider />

      <Section label="09">イミュータブル更新の注意</Section>
      <p>
        state がオブジェクトや配列のとき、<strong>直接書き換えてはいけません</strong>。React は
        「参照が変わったか」で変化を判定するため、中身をいじっても<strong>同じ参照のまま</strong>だと
        再レンダリングが起きません。必ず<strong>新しいオブジェクト / 配列</strong>を作って渡します。
      </p>

      <Code lang="tsx" filename="配列の更新">{`const [items, setItems] = useState<string[]>([]);

// NG: 元の配列を破壊（参照が同じ → 再描画されない）
items.push("new");
setItems(items);

// OK: スプレッドで新しい配列を作る
setItems([...items, "new"]);

// 削除も filter で新配列を作る
setItems(items.filter((it) => it !== "new"));`}</Code>

      <Code lang="tsx" filename="オブジェクトの更新">{`const [user, setUser] = useState({ name: "Yuma", age: 28 });

// NG: 直接プロパティを書き換え
user.age = 29;
setUser(user);

// OK: 展開してから上書き（新しいオブジェクト）
setUser({ ...user, age: 29 });`}</Code>

      <Callout variant="tip" title="なぜ参照比較なのか">
        オブジェクトの中身を毎回深く比較するのは重い処理です。React は「参照が同じなら中身も同じ」
        と割り切ることで、変化検出を高速にしています。だから<strong>変えたいときは新しい参照を
        作る</strong>のが React の作法です。
      </Callout>

      <Bridge course="関数型プログラミング">
        「元を壊さず新しい値を作る」——これは関数型で習う<strong>不変データ構造（immutable data）</strong>と
        <strong>副作用の排除</strong>そのものです。<Cmd>push</Cmd>（破壊的）ではなくスプレッド <Cmd>[...arr, x]</Cmd>や
        <Cmd>filter</Cmd>/<Cmd>map</Cmd>（非破壊）を使うのは、講義で習う「純粋な変換で新しい構造を返す」考え方です。
        なぜ React はこれを要求するのか——不変性を守ると、<strong>前後の値を <Cmd>===</Cmd>（参照）で一発比較できる</strong>から。
        可変にすると「いつ誰が中身を変えたか」を追う必要が生まれ、これは並行プログラミングで共有可変状態が難しい理由と同じ構図です。
        不変性は「安全に差分検出するための土台」なのだ、と理論から腑に落とせます。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "useState は [現在値, 更新関数] を返す。更新は必ず set 関数で行う",
          "set するとコンポーネント関数が再実行され、返した JSX の差分だけ DOM に反映される",
          "同じレンダリング中の state は不変。連続更新は setX(prev => ...) の関数型で",
          "イベントは onClick に「関数そのもの」を渡す。引数付きは () => f(x) で包む",
          "条件は三項演算子 / && で。&& は 0 が表示される罠に注意（count > 0 &&）",
          "UI は状態機械。とり得る状態を union 型で列挙し、boolean 乱立の状態爆発を避ける",
          "リストは map で描き、key はデータ固有の ID にする（index は避ける）",
          "フォームは value+onChange の制御コンポーネント、共有 state は親へリフトアップ",
          "オブジェクト/配列の state は参照を変える（スプレッド）＝イミュータブル更新",
        ]}
      />
    </>
  );
}

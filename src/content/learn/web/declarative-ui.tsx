import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, TipBox, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "declarative-ui",
  title: "宣言的 UI とは",
  description: "How(手順)ではなく What(結果)を記述する宣言的 UI の考え方を、命令的アプローチとの対比で理解する。",
  domain: "web",
  section: "frontend",
  order: 5,
  level: "basic",
  tags: ["React", "宣言的UI", "UI"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        React をはじめとするモダンな UI ライブラリの根底にあるのが<strong>宣言的（declarative）</strong>という考え方です。
        「どう作るか（How）」の手順を並べるのではなく、「どうあってほしいか（What）」という結果だけを記述する。
        この発想の転換が、UI 開発を大きくシンプルにしました。命令的 vs 宣言的という対比は React 固有の話ではなく、
        SQL・HTML・関数型プログラミングにも通底する<strong>プログラミングパラダイム</strong>の一つです。
      </Lead>

      <Section>命令的と宣言的の違い</Section>
      <p>
        たとえば「四角形を描く」という指示を考えてみます。<strong>命令的</strong>なアプローチでは、
        「ペンを下ろす → 右に線を引く → 下に線を引く → 左に線を引く → 上に線を引く」と手順を 1 つずつ指示します。
        一方<strong>宣言的</strong>なアプローチでは、ただ「四角形を描く」と結果を宣言するだけ。
        描き方の細部はライブラリ側に任せます。
      </p>

      <ComparisonTable
        headers={["観点", "命令的（Imperative）", "宣言的（Declarative）"]}
        rows={[
          ["記述するもの", "How（手順・過程）", "What（結果・状態）"],
          ["四角形の例", "線を4本引く手順を並べる", "「四角形を描く」と宣言する"],
          ["DOM 操作", "取得して1つずつ書き換える", "状態から自動で反映される"],
          ["コードの見通し", "手順が増えると複雑化", "最終形が読み取りやすい"],
          ["身近な例", "for ループで配列を集計", "SQL の SELECT / GROUP BY"],
        ]}
      />

      <p>
        「命令的か宣言的か」は 0/1 の二択ではなく<strong>グラデーション</strong>です。同じ言語でも、
        <Cmd>for</Cmd> で 1 要素ずつ処理すれば命令的寄り、<Cmd>map</Cmd>/<Cmd>filter</Cmd> で
        「何を得たいか」を書けば宣言的寄りになります。React はこの宣言的な側に UI 全体を寄せた、と捉えると見通しが良くなります。
      </p>

      <Bridge course="プログラミング言語論">
        講義で扱う<strong>プログラミングパラダイム</strong>——手続き型・宣言型・関数型・論理型——の分類が、そのまま UI 設計に効いてきます。
        命令型（C の <Cmd>for</Cmd> ループ）と宣言型（SQL の <Cmd>SELECT</Cmd>、Prolog の規則）の対比で習った
        「<strong>How を隠蔽し What を記述する</strong>」という考え方が、React では「DOM 操作（How）を隠し、状態→見た目の対応（What）だけを書く」という形で現れます。
        パラダイムは言語の飾りではなく、コードの複雑さを左右する設計判断だと実感できるはずです。
      </Bridge>

      <Section>UI コードでの対比</Section>
      <p>
        Web の UI で言えば、命令的は「DOM 要素を取得して属性やテキストを 1 つずつ書き換える」書き方です。
        状態が増えるほど「今どの要素をどう変えるべきか」を全部自分で管理する必要があり、複雑になりがちです。
      </p>

      <Code lang="js" filename="imperative.js">{`// 命令的 — 手順を自分で管理する
const el = document.getElementById("count");
el.textContent = String(count);
if (count > 10) el.classList.add("warning");
else el.classList.remove("warning");`}</Code>

      <p>
        宣言的な React では、「この状態のとき UI はこう見える」という<strong>結果</strong>だけを書きます。
        状態が変われば、あるべき姿へライブラリが自動で差分を反映します。
      </p>

      <Code lang="jsx" filename="declarative.jsx">{`// 宣言的 — あるべき結果だけを書く
function Counter({ count }) {
  return (
    <span className={count > 10 ? "warning" : ""}>
      {count}
    </span>
  );
}`}</Code>

      <Callout variant="tip" title="宣言的が効く理由">
        「状態 → 見た目」の対応だけを書けば、途中の DOM 操作はライブラリに任せられます。
        開発者はビジネスロジックと最終的な見た目に集中でき、バグの温床になりがちな手動 DOM 操作から解放されます。
      </Callout>

      <Section>UI = f(state) という関数の見方</Section>
      <p>
        宣言的 UI をひと言で表すと <Cmd>UI = f(state)</Cmd> ——「UI は、状態を入力に取り、見た目を出力する
        <strong>純粋関数</strong>である」という等式です。同じ <Cmd>state</Cmd> を渡せば必ず同じ UI が返る。
        コンポーネントを「描画手順」ではなく「状態から画面への写像（関数）」として捉えるのが React の世界観です。
      </p>

      <Code lang="tsx" filename="UI は状態の関数">{`// state を入力、JSX（見た目）を出力とする関数
function view(state) {
  return state.loading
    ? <Spinner />
    : <List items={state.items} />;
}
// 同じ state を渡せば、いつでも同じ UI になる（参照透過）`}</Code>

      <p>
        この見方の利点は<strong>予測可能性</strong>です。「今 DOM がどういう状態か」を気にせず、
        「この state ならこの見た目」とだけ考えればよい。命令的な世界では、DOM は過去の操作履歴の
        <strong>累積</strong>で決まるため、いつ・何が・どの順で起きたかを追わないとバグが読めませんでした。
      </p>

      <SubSection>副作用を UI から切り離す</SubSection>
      <p>
        描画関数を純粋に保つため、React は「画面を描く（純粋）」部分と「外の世界に触る（副作用）」部分を分けます。
        API 通信・タイマー・ログ送信といった副作用は <Cmd>useEffect</Cmd> に隔離し、描画そのものは
        state → JSX の純粋な変換に保つ。この分離が、テスト容易性と再現性を生みます。
      </p>

      <Bridge course="関数型プログラミング">
        <Cmd>UI = f(state)</Cmd> は、関数型で学ぶ<strong>純粋関数</strong>・<strong>参照透過性</strong>・
        <strong>副作用の分離</strong>がそのまま UI に持ち込まれた姿です。「同じ入力なら同じ出力（副作用なし）」という
        純粋関数の性質が、コンポーネントの「同じ props/state なら同じ描画」に対応します。
        Haskell が副作用を <Cmd>IO</Cmd> モナドに隔離するのと同じ発想で、React は副作用を <Cmd>useEffect</Cmd> に隔離する。
        「なぜ描画関数を純粋に保つと嬉しいのか」は、関数型の理屈で説明できます。
      </Bridge>

      <TipBox>
        「宣言的」「純粋関数」「不変性」はセットで効きます。state を直接書き換えず<strong>新しい値を作る</strong>
        （イミュータブル更新）から、React は前後の state を比べて差分を計算できる。この連鎖は次の 2 記事（state / Hooks）で具体化します。
      </TipBox>

      <Section>宣言的 UI を支える仕組み</Section>
      <p>
        「結果を宣言するだけ」で画面が更新できるのは、React が内部で<strong>差分検出</strong>を行っているからです。
        現在の UI とあるべき UI を比較し、変わった部分だけを実 DOM に反映する。
        この仕組み（仮想 DOM / Fiber）を理解すると、宣言的 UI がなぜ効率的なのかが腑に落ちます。次章で詳しく見ていきます。
      </p>

      <KVList
        items={[
          { key: "宣言的（あなたが書く）", val: "「この state なら、この見た目」という結果だけを記述する" },
          { key: "差分検出（React がやる）", val: "前回の要素ツリーと今回を比較し、変わった箇所を特定する" },
          { key: "命令的 DOM 操作（React が肩代わり）", val: "特定した差分だけを実 DOM に適用する（あなたは書かない）" },
        ]}
      />

      <Callout variant="warn" title="宣言的でも「逃げ道」は要る">
        フォーカス移動・スクロール位置・動画再生など、DOM を直接触らざるを得ない場面は残ります。
        そのとき React は <Cmd>useRef</Cmd> という<strong>命令的なエスケープハッチ</strong>を用意しています。
        宣言的を基本にしつつ、必要な箇所だけ命令的に降りる——この使い分けが実務では重要です（Hooks 編で扱います）。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "宣言的 UI は How（手順）ではなく What（結果・状態）を記述する",
          "命令的は DOM を1つずつ書き換える。宣言的は「状態→見た目」を書くだけ",
          "途中の DOM 操作はライブラリに任せられ、コードの見通しが良くなる",
          "UI = f(state) — コンポーネントは「状態→見た目」の純粋関数として捉える",
          "副作用は useEffect に隔離し、描画そのものは純粋に保つ（関数型の作法）",
          "宣言的 UI は内部の差分検出（仮想 DOM / Fiber）によって実現されている",
        ]}
      />
    </>
  );
}

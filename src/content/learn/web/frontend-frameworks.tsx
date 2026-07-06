import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KeyPoints, ComparisonTable, TipBox, KVList, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "frontend-frameworks",
  title: "フロントエンドフレームワークとは",
  description: "素の JS の限界から、なぜ React/Vue/Angular のようなフレームワークが必要になったのかを、コンポーネント指向と宣言的 UI の観点で理解する。",
  domain: "web",
  section: "frontend",
  order: 3,
  level: "intro",
  tags: ["フレームワーク", "React", "Vue", "Angular"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        React・Vue・Angular — 現代のフロントエンド開発は<strong>フレームワーク</strong>を中心に回っています。
        しかし、いきなり使い方を覚える前に「なぜこれらが必要になったのか」を理解しておくと、後の学習が驚くほど腑に落ちます。この章では素の JavaScript の限界から出発します。
      </Lead>

      <Section>素の JavaScript で UI を作ると</Section>
      <p>
        ブラウザは <strong>DOM（Document Object Model）</strong>という、HTML をツリー構造にしたものを持っています。
        素の JavaScript でも、この DOM を <Cmd>document.querySelector</Cmd> などで掴んで書き換えれば画面を更新できます。
      </p>
      <Code lang="js">{`let count = 0;
const el = document.querySelector("#count");
const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  count = count + 1;
  el.textContent = count;   // ← 手作業で DOM を更新
});`}</Code>
      <p>
        小さな例なら問題ありません。ボタンを押すと <Cmd>count</Cmd> が増え、<Cmd>el.textContent</Cmd> を書き換えて表示を更新しています。
      </p>

      <Section>jQuery の時代と、その限界</Section>
      <p>
        かつては <strong>jQuery</strong> が DOM 操作を簡潔にし、一世を風靡しました。<Cmd>$("#count").text(count)</Cmd> のように短く書けます。
        しかし jQuery が解決したのは「<strong>書き方</strong>」であって、本質的な問題ではありませんでした。
      </p>
      <SubSection>問題の本質: 状態と表示の手動同期</SubSection>
      <p>
        アプリが育つと、1 つのデータ（状態）が画面の<strong>あちこちに反映</strong>されるようになります。
        カートの個数が「ヘッダのバッジ」「合計金額」「ボタンの活性状態」に同時に効く、といった具合です。
      </p>
      <Code lang="js">{`// カートに追加するたび、関連する表示を「全部」手で直す必要がある
function addToCart(item) {
  cart.push(item);
  updateBadge();       // ヘッダのバッジ
  updateTotalPrice();  // 合計金額
  updateCheckoutBtn(); // 購入ボタンの活性
  // ...更新漏れが1つでもあると画面がズレる
}`}</Code>
      <Callout variant="warn" title="手動同期は必ず破綻する">
        更新箇所が増えるほど「状態は変わったのに、どこかの表示だけ古いまま」というバグが増えます。
        どの操作がどの DOM に影響するかを人間が全部覚えて配線する、という戦い方には限界があります。
      </Callout>

      <Section>なぜフレームワークが必要か</Section>
      <p>フレームワークは、この「手動同期の地獄」を 3 つの考え方で解決します。</p>

      <SubSection>1. 宣言的 UI</SubSection>
      <p>
        「どう更新するか（手順）」ではなく「状態がこうなら画面はこう見える（結果）」を宣言します。
        状態を変えれば、画面の再計算はフレームワークが引き受けます。
      </p>
      <Code lang="jsx">{`// 命令的（素のJS）: どう更新するかを書く
el.textContent = count;

// 宣言的（React）: 状態と表示の対応だけを書く
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`}</Code>
      <p>
        本質を式で書くと、宣言的 UI とは <Cmd>UI = f(state)</Cmd> という<strong>純粋関数</strong>を書くことです。同じ状態を渡せば必ず同じ画面が返る。
        あなたの仕事は「状態 → 画面」の写像 <Cmd>f</Cmd> を定義することだけで、状態が変わったとき DOM をどう差し替えるかは考えません。
      </p>
      <Bridge course="プログラミング言語論（命令的 vs 宣言的 / 関数型）">
        命令的プログラミングは「状態を逐次書き換える手続き」を、宣言的・関数型プログラミングは「入力から出力への写像」を記述します。
        素の JS の <Cmd>el.textContent = count</Cmd> は前者（可変状態への副作用）、React の <Cmd>UI = f(state)</Cmd> は後者（参照透過に近い写像）。
        講義で習う「副作用を減らし、状態遷移を一方向に閉じ込めると、プログラムは追跡・テスト・並行化しやすくなる」という関数型の利点が、そのまま React の設計原理（純粋なレンダー関数・イミュータブルな state）になっています。
        <Cmd>map</Cmd> で配列を JSX に変換する書き方も、関数型の高階関数がそのまま UI 構築に現れた例です。
      </Bridge>
      <TipBox>
        <Cmd>setCount</Cmd> で状態を変えるだけで、表示は自動で追従します。「どの DOM をどう書き換えるか」を書く必要がなくなる — これが宣言的 UI の核心です。
      </TipBox>

      <SubSection>2. 状態と UI の自動同期</SubSection>
      <p>
        フレームワークは状態の変化を検知し、影響する部分だけを効率よく再描画します（React の仮想 DOM 差分など）。
        更新漏れが原理的に起きにくくなります。
      </p>
      <p>
        ここで「状態（state）」を軽く見ないでください。UI とは結局、<strong>有限個の状態と、その間の遷移</strong>の集まりです。
        たとえばデータ取得フォームは <Cmd>idle → loading → success / error</Cmd> という状態を移り変わります。各状態でどの画面を出すかを宣言し、
        イベント（送信・成功・失敗）で状態を遷移させる — これは<strong>有限状態機械（FSM）</strong>そのものです。
      </p>
      <Code lang="jsx">{`// 取得の状態を1つの変数に集約（状態機械）
const [status, setStatus] = useState("idle");
// idle | loading | success | error

if (status === "loading") return <Spinner />;
if (status === "error")   return <ErrorBox />;
return <List />;`}</Code>
      <Bridge course="オートマトン理論 / 状態機械">
        講義で習う有限状態機械（状態集合・初期状態・遷移関数）は、UI 設計の実務に直結します。
        「読み込み中なのにボタンも押せてしまう」「エラー表示と成功表示が同時に出る」といったバグの多くは、<strong>状態を独立したフラグ（<Cmd>isLoading</Cmd>・<Cmd>isError</Cmd>・<Cmd>data</Cmd>）でバラバラに持ち、到達してはいけない組み合わせ</strong>を許してしまうことが原因です。
        FSM の発想で「状態は 1 つの変数に集約し、正当な遷移だけを定義する」と、不正状態（loading かつ error）が<strong>型として表現できなくなり</strong>バグが消えます。XState のようなライブラリはこの理論をそのまま道具にしたものです。
      </Bridge>

      <SubSection>3. コンポーネント指向</SubSection>
      <p>
        UI を「ボタン」「カード」「ヘッダ」といった<strong>再利用可能な部品（コンポーネント）</strong>に分割し、組み合わせて画面を作ります。
        部品ごとに構造・見た目・振る舞いをまとめて閉じ込められるため、大規模でも見通しが保てます。
      </p>
      <Code lang="jsx">{`function Card({ title, body }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

// 同じ部品を何度でも組み合わせられる
<Card title="A" body="..." />
<Card title="B" body="..." />`}</Code>
      <p>
        コンポーネントは <Cmd>props</Cmd>（入力）を受け取り UI（出力）を返す<strong>関数</strong>であり、内部の実装は外から隠れています。
        これはソフトウェア工学で言う<strong>モジュール化・カプセル化・関心の分離</strong>の Web 版です。
      </p>
      <KVList
        items={[
          { key: "カプセル化", val: "見た目・状態・振る舞いを部品内に閉じ込め、外へは props/イベントだけ公開" },
          { key: "関心の分離", val: "Header / Card / Button が各自の責務を持ち、互いに干渉しない" },
          { key: "再利用性", val: "同じ Card を props を変えて何度でも使い回す" },
          { key: "合成", val: "小さな部品を組み合わせて大きな画面を作る（関数合成に近い）" },
        ]}
      />
      <Bridge course="ソフトウェア工学（モジュール化 / 凝集度・結合度）">
        「高凝集・低結合」— 1 つのモジュールは 1 つの責務にまとまり（凝集）、モジュール間の依存は最小限のインターフェースだけ（結合）にする。
        コンポーネント指向はこの原則の実装です。props という明示的なインターフェースだけで通信し、内部状態は隠す設計は、講義で習うモジュール分割の良し悪しの基準（変更が波及しない・単体でテストできる・置換可能）を UI にそのまま適用したもの。
        「巨大な 1 ファイルを部品に割る」判断は、まさに凝集度・結合度を天秤にかける設計判断です。
      </Bridge>

      <Section>SPA との関係</Section>
      <p>
        フレームワークの普及と切り離せないのが <strong>SPA（Single Page Application）</strong>です。
        SPA は最初に 1 枚の HTML を読み込み、その後の画面遷移は<strong>ページ全体を再読み込みせず</strong>、JavaScript が DOM を差し替えて実現します。
      </p>
      <Callout variant="info" title="フレームワークは SPA の相棒">
        画面遷移のたびに大量の DOM を書き換える SPA では、状態と UI の同期がなおさら重要になります。
        だからこそ、その同期を引き受けるフレームワークと SPA は一緒に発展しました（ただし今日では SSR / SSG で SPA 以外の使い方も一般的です）。
      </Callout>

      <Section>ライブラリ と フレームワーク</Section>
      <p>
        よく混同されますが、両者は「主導権が誰にあるか」で区別されます。
      </p>
      <ComparisonTable
        headers={["", "ライブラリ", "フレームワーク"]}
        rows={[
          ["主導権", "あなたが呼び出す", "向こうがあなたのコードを呼ぶ"]  ,
          ["たとえ", "道具箱（必要な時に使う）", "レール（決まった流儀に乗る）"],
          ["自由度", "高い（構成は自分で決める）", "低め（規約に従う）"],
          ["例", "React（自称ライブラリ）, lodash", "Angular, Next.js"],
        ]}
      />
      <TipBox>
        React は厳密には「UI ライブラリ」を自称しますが、ルーティングや状態管理など周辺を組み合わせると実質フレームワークのように使えます。境界は曖昧で、実務上は雰囲気で区別されることも多いです。
      </TipBox>

      <Section>React・Vue・Angular の位置づけ</Section>
      <p>3 大選択肢のざっくりした概観です（詳細な比較は別記事で扱います）。</p>
      <ComparisonTable
        headers={["", "React", "Vue", "Angular"]}
        rows={[
          ["性格", "UI ライブラリ（柔軟)", "段階的に導入できる)", "全部入りフレームワーク"]  ,
          ["書き方", "JSX（JS 中心)", "テンプレート + SFC", "TypeScript + テンプレート"],
          ["学習曲線", "中（周辺選定が必要)", "緩やか", "急（規約が多い)"],
          ["向くもの", "自由な構成・巨大エコシステム", "小〜中規模・素早い導入", "大規模・堅牢な統制"],
        ]}
      />
      <Callout variant="tip" title="どれから学ぶ？">
        求人・情報量・エコシステムの広さから、最初の 1 つには <strong>React</strong> を選ぶ人が多数派です。ただし考え方（宣言的・コンポーネント指向）はどれも共通なので、1 つ身につければ他への移行は容易です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "素の JS / jQuery は「状態と表示の手動同期」が規模とともに破綻する",
          "フレームワークは宣言的 UI・自動同期・コンポーネント指向でこれを解決する",
          "宣言的 UI とは「状態→表示の対応」を書き、更新手順はフレームワークに任せること",
          "SPA（ページ全体を再読み込みしない構成）とフレームワークは一緒に発展した",
          "ライブラリ=自分が呼ぶ / フレームワーク=向こうが呼ぶ（主導権の違い）",
          "React/Vue/Angular は流儀が違うが考え方は共通。まずは1つ選んで習得する",
        ]}
      />
    </>
  );
}

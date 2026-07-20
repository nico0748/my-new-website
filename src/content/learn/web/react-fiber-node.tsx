import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, TipBox, Figure, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "react-fiber-node",
  title: "仮想 DOM の正体 — Fiber ノード",
  description: "React が内部で管理するのは仮想 DOM ではなく Fiber ノードの木構造。key/tag/stateNode など主要プロパティを解説する。",
  domain: "web",
  section: "frontend",
  order: 11,
  level: "practice",
  tags: ["React", "Fiber", "内部構造"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        前章で「仮想 DOM は通称」だと触れました。React が実際に内部で扱っているのは<strong>Fiber ノード</strong>という単位であり、
        それらが親子関係でつながった<strong>Fiber ツリー</strong>を管理しています。「仮想 DOM」という呼び名は、厳密には正確ではないのです。
      </Lead>

      <Section>Fiber ノードと Fiber ツリー</Section>
      <p>
        画面上の各要素（コンポーネントや DOM 要素）に対応して、React は 1 つずつ<strong>Fiber ノード</strong>を持ちます。
        Fiber ノードは単なる「あるべき見た目」の記述に留まらず、そのノードに紐づく<strong>状態や更新の作業単位</strong>としての情報も抱えています。
        これらが木構造（Fiber ツリー）としてつながり、React はこのツリーをたどりながらレンダリングを進めます。
      </p>

      <FlowChain
        nodes={[
          { label: "current ツリー", sub: "表示中" },
          { label: "レンダー", sub: "workInProgress 構築" },
          { label: "コミット", sub: "実 DOM 反映" },
          { label: "current 切替", variant: "cta" },
        ]}
        caption="Fiber ツリーのダブルバッファリング"
      />

      <Callout variant="info" title="なぜ「仮想 DOM」ではないのか">
        「仮想 DOM」は「UI のスナップショットを軽量に持つ」というイメージの通称です。
        実装上の Fiber ノードは、それに加えて更新の優先度・作業の中断/再開・状態への参照まで持つ、より豊かなデータ構造です。
      </Callout>

      <Section>木を「連結リスト」として走査する</Section>
      <p>
        Fiber ツリーは概念上は木ですが、React は各ノードに<strong>3 本のポインタ</strong>を持たせ、
        木の走査を<strong>連結リストのたどり方</strong>に落とし込んでいます。これがデータ構造としての Fiber の肝です。
      </p>

      <KVList
        items={[
          { key: "child", val: "最初の子ノードへのポインタ（1 段下がる）" },
          { key: "sibling", val: "次の兄弟ノードへのポインタ（同じ階層を右へ）" },
          { key: "return", val: "親ノードへのポインタ（1 段上がる。関数の return 先に相当）" },
        ]}
      />

      <Code lang="js" filename="fiber-links.js">{`// 木を再帰ではなく「ポインタ移動のループ」でたどれる
function next(fiber) {
  if (fiber.child) return fiber.child;      // 子があれば降りる
  while (fiber) {
    if (fiber.sibling) return fiber.sibling; // 兄弟があれば横へ
    fiber = fiber.return;                    // なければ親へ戻る
  }
  return null;                               // 走査終了
}`}</Code>

      <p>
        なぜわざわざ連結リスト状にするのか。<strong>再帰</strong>で木をたどると、JavaScript の呼び出しスタックに状態が積まれ、
        途中で<strong>中断できません</strong>（スタックを保存・復元できない）。一方、この <Cmd>child / sibling / return</Cmd> 方式なら
        「今どの Fiber を見ているか」という<strong>1 個のポインタ</strong>さえ覚えておけば、いつでも作業を止めて後で再開できます。
        中断可能なレンダリング（次章のコミット、そして Concurrent 機能）の土台が、この走査方式です。
      </p>

      <Bridge course="データ構造 / アルゴリズム">
        木を<strong>連結リスト的なポインタ走査</strong>に置き換える、という古典的なテクニックの実例です。
        講義で学ぶ「再帰による木の走査」は呼び出しスタックに依存するため中断・再開が難しい。
        <Cmd>child / sibling / return</Cmd> の 3 ポインタで木を<strong>明示的な反復（iteration）</strong>に変換すると、
        走査の「途中状態」がヒープ上の 1 ポインタとして<strong>ファーストクラスの値</strong>になり、保存・復帰が自由になります。
        「再帰 → スタックを自前で持つ反復への変換」は、まさにアルゴリズムの基本テクニックです。
      </Bridge>

      <Section>主要なプロパティ</Section>
      <p>Fiber ノードが持つ代表的なプロパティを 3 つ押さえておきましょう。</p>

      <KVList
        items={[
          { key: "key", val: "一意な識別子。再レンダー時に新旧ノードを対応づける（マッチング）ために使う" },
          { key: "tag", val: "コンポーネントの種別。関数コンポーネント / クラスコンポーネント / DOM 要素などを区別する" },
          { key: "stateNode", val: "実体への参照。実 DOM ノードやクラスコンポーネントのインスタンスを指す" },
        ]}
      />

      <Callout variant="tip" title="key が差分検出を支える">
        リストをレンダーする際に <Cmd>key</Cmd> が重要なのは、この Fiber の <Cmd>key</Cmd> で新旧ノードを対応づけているからです。
        <Cmd>key</Cmd> が安定していれば、React は「同じ要素が移動しただけ」と正しく判断でき、無駄な作り直しを避けられます。
      </Callout>

      <Code lang="jsx" filename="list.jsx">{`// key があることで Fiber の対応づけが安定する
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
// key を index にすると並び替え時に対応づけが崩れやすい`}</Code>

      <Section>tag と stateNode の役割</Section>
      <p>
        <Cmd>tag</Cmd> は「このノードが何者か」を表します。関数コンポーネントなのか、クラスコンポーネントなのか、
        あるいはブラウザの <Cmd>{"<div>"}</Cmd> のような DOM 要素なのか。React はこの種別に応じて処理を分岐させます。
      </p>
      <p>
        <Cmd>stateNode</Cmd> は「実体」への橋渡しです。DOM 要素の Fiber なら対応する実 DOM ノードを、
        クラスコンポーネントの Fiber ならそのインスタンスを指します。この参照があるからこそ、差分検出の結果を実際の画面へ反映できます。
      </p>

      <Figure src="/learn/shots/web/react-fiber-node-01.svg" alt="React DevTools の Components タブでコンポーネントツリーとノードの詳細を表示した画面" caption="DevTools に見えている木が、内部では Fiber ノードのつながりそのもの" />

      <Section>作業単位としての Fiber と協調的スケジューリング</Section>
      <p>
        Fiber の名前は「fiber（繊維）＝軽量な実行単位」に由来します。1 つの Fiber は
        <strong>「このノードに対して行うべき一片の作業」</strong>でもあり、React はツリーを走査しながら
        Fiber を 1 個ずつ処理していきます。ここで重要なのが、<strong>1 個処理するたびに
        「まだブラウザに時間を返すべきか？」を確認する</strong>点です。
      </p>
      <p>
        メインスレッドは 1 本しかなく、そこでは JS の実行・レイアウト・描画・入力処理がすべて順番待ちします。
        もし大きなツリーを一気に処理し切ると、その間クリックやスクロールに反応できず<strong>画面がカクつきます</strong>。
        そこで React は、一定時間（例: 数ミリ秒）作業したら<strong>自ら処理を中断してブラウザに制御を返し</strong>、
        入力や描画を捌かせてから、続きの Fiber から作業を再開します。
      </p>

      <ComparisonTable
        headers={["方式", "中断できるか", "UI の応答性"]}
        rows={[
          ["再帰で一気に走査（旧 Stack 方式）", "できない（スタックに縛られる）", "重い更新で固まる"],
          ["Fiber を 1 個ずつ処理", "できる（1 ポインタで再開）", "こまめに制御を返せる"],
        ]}
      />

      <Bridge course="OS（オペレーティングシステム）">
        これは OS のスケジューリングで学ぶ<strong>協調的（cooperative）マルチタスク</strong>そのものです。
        プリエンプティブ方式（OS が強制的にタスクを切り替える）と違い、協調的方式では
        <strong>タスクが自発的に制御を手放す（yield する）</strong>ことで他の処理へ順番を回します。
        React はまさに、Fiber を 1 単位ずつ処理しては「時間切れなら yield」する協調的スケジューラを
        メインスレッド上に構築しています。<strong>作業の中断・再開</strong>ができるのは、前節の
        <Cmd>child / sibling / return</Cmd> 走査で「途中状態」を 1 ポインタとして保存できるからです。
        「実行単位を細かく分け、こまめに yield して応答性を保つ」という OS の発想が、UI ライブラリの中で生きています。
      </Bridge>

      <TipBox>
        Fiber が「データ構造」であると同時に「作業単位」でもある、という二面性がこの章の核心です。
        次章のコミットフェーズでは、走査で組み上げた作業結果を<strong>中断できない一気の反映</strong>として
        実 DOM へ確定させます。中断できるレンダーと、中断できないコミットの対比に注目してください。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "React が内部で管理するのは仮想 DOM ではなく Fiber ノードの木構造（Fiber ツリー）",
          "child/sibling/return の3ポインタで木を連結リスト的に走査し、再帰なしで中断・再開できる",
          "Fiber は「データ構造」であり「作業単位」でもある",
          "1 単位ずつ処理して時間切れで yield する = 協調的スケジューリング（OS の発想）",
          "key/tag/stateNode は対応づけ・種別・実体参照を担う主要プロパティ",
        ]}
      />
    </>
  );
}

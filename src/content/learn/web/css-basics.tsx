import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KeyPoints, ComparisonTable, TipBox, KVList, Bridge, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "css-basics",
  title: "CSS の基礎 — セレクタ・ボックスモデル・レイアウト",
  description: "見た目を作る CSS の基本。セレクタ、ボックスモデル、Flexbox/Grid、カスケード、そして style.css と global.css の役割を押さえる。",
  domain: "web",
  section: "frontend",
  order: 1,
  level: "intro",
  tags: ["CSS", "スタイル", "フロントエンド"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        HTML が「文書の構造」を担うのに対し、<strong>CSS（Cascading Style Sheets）</strong>は「見た目」を担います。
        色・余白・配置・レスポンシブ — 画面に映るほぼすべての装飾は CSS で作られています。この章では CSS の土台となる考え方を、実例とともに最短で押さえます。
      </Lead>

      <Section>CSS とは何か — 宣言的な言語</Section>
      <p>
        CSS は「どの要素を（セレクタ）」「どう見せるか（プロパティと値）」を宣言するルールの集まりです。1 つのルールは次の形をしています。
      </p>
      <Code lang="css" filename="style.css">{`/* セレクタ { プロパティ: 値; } */
h1 {
  color: #22b0a0;
  font-size: 32px;
  margin-bottom: 16px;
}`}</Code>
      <p>
        セレクタが対象を選び、波括弧の中の宣言（<Cmd>プロパティ: 値;</Cmd>）が見た目を決めます。宣言は複数並べられ、末尾は必ずセミコロンで区切ります。
      </p>
      <p>
        ここで大事なのは、CSS には「まず要素を掴んで、次に色を塗り、それから余白を…」という<strong>手順（アルゴリズム）が一切書かれていない</strong>ことです。
        あなたが書くのは「望む最終状態」だけ。実際にどの順で描画し、どう再計算するかはブラウザ側のレンダリングエンジンが決めます。
        これは C や Java のような命令的（手続き的）言語とは対照的な、<strong>宣言的言語</strong>の典型です。
      </p>
      <Bridge course="プログラミング言語論 / 計算モデル">
        命令的言語（C・Java）が「どう計算するか」を書くのに対し、宣言的言語（CSS・SQL・HTML・Prolog）は「何が欲しいか」を書きます。
        SQL の <Cmd>SELECT … WHERE …</Cmd> が「どのインデックスを使い、どの順で走査するか」をエンジンに任せるのと同じように、
        CSS の <Cmd>.card &#123; color: … &#125;</Cmd> も「どのタイミングで再描画し、どのピクセルから塗るか」をブラウザに委ねます。
        「宣言的だと、実行の詳細を最適化する自由を処理系に与えられる」という座学の原則が、そのまま Web の描画性能に効いています。
      </Bridge>

      <Section>CSS の適用方法（3 つ）</Section>
      <p>CSS を HTML に効かせる方法は 3 通りあります。実務では基本的に外部ファイル（3 番目）を使います。</p>

      <SubSection>1. インラインスタイル</SubSection>
      <p>要素の <Cmd>style</Cmd> 属性に直接書く方法。手軽ですが再利用できず、優先度が高すぎて管理が破綻しやすいので多用は避けます。</p>
      <Code lang="html">{`<p style="color: red; font-weight: bold;">重要</p>`}</Code>

      <SubSection>2. style 要素（内部スタイル）</SubSection>
      <p>HTML の <Cmd>&lt;head&gt;</Cmd> 内に <Cmd>&lt;style&gt;</Cmd> を書く方法。そのページ限定のスタイルに向きます。</p>
      <Code lang="html">{`<head>
  <style>
    p { color: #333; line-height: 1.7; }
  </style>
</head>`}</Code>

      <SubSection>3. 外部スタイルシート（推奨）</SubSection>
      <p>スタイルを別ファイル（例: <Cmd>style.css</Cmd>）に分け、<Cmd>&lt;link&gt;</Cmd> で読み込みます。複数ページで共有でき、キャッシュも効くため、これが基本です。</p>
      <Code lang="html">{`<head>
  <link rel="stylesheet" href="/style.css" />
</head>`}</Code>

      <Callout variant="tip" title="関心の分離">
        構造は HTML、見た目は CSS、振る舞いは JavaScript。役割を分けておくと、片方を変えてももう片方が壊れにくくなります。外部ファイル化はその第一歩です。
      </Callout>

      <Section>セレクタ — 対象を選ぶ</Section>
      <p>セレクタは「どの要素にスタイルを当てるか」を指定します。よく使う 5 種類を押さえましょう。</p>
      <Code lang="css">{`/* 要素セレクタ: すべての p */
p { color: #333; }

/* クラスセレクタ: class="btn" の要素 */
.btn { padding: 8px 16px; }

/* id セレクタ: id="header" の要素（ページ内で1つ） */
#header { position: sticky; }

/* 子孫セレクタ: nav の中の a すべて */
nav a { text-decoration: none; }

/* 擬似クラス: マウスが乗った瞬間 */
.btn:hover { background: #22b0a0; }`}</Code>
      <TipBox>
        実務で最も多用するのは<strong>クラスセレクタ</strong>です。id は原則ページ内で 1 つ、要素セレクタは全体の下地（リセットやベース書式）に使うのが基本方針です。
      </TipBox>

      <Section>ボックスモデル — 余白と枠の仕組み</Section>
      <p>
        すべての要素は「箱（ボックス）」として描画されます。箱は内側から <strong>content（内容）→ padding（内側余白）→ border（枠線）→ margin（外側余白）</strong> の 4 層でできています。
      </p>
      <Code lang="css">{`.card {
  width: 300px;
  padding: 16px;      /* 内容と枠の間の余白 */
  border: 1px solid #ddd;
  margin: 24px;       /* 他の要素との間の余白 */
}`}</Code>

      <Figure
        src="/learn/shots/web/css-basics-01.svg"
        alt="Chrome DevTools の Computed タブに出るボックスモデル図（margin / border / padding / content の数値）"
        caption="DevTools の Computed タブには4層が入れ子の図で出る。実際に何 px 効いているかはここで読む。"
      />
      <Callout variant="warn" title="width の落とし穴と box-sizing">
        デフォルト（<Cmd>content-box</Cmd>）では、<Cmd>width</Cmd> は content だけの幅を指し、padding と border はその外側に足されます。つまり指定より箱が大きくなります。
        <Cmd>box-sizing: border-box</Cmd> にすると、width が「border まで含めた幅」になり直感どおりになります。多くのプロジェクトが全要素にこれを適用します。
      </Callout>
      <Code lang="css" filename="global.css">{`*, *::before, *::after {
  box-sizing: border-box;
}`}</Code>

      <Section>display と position</Section>
      <SubSection>display — 要素の並び方</SubSection>
      <ul>
        <li><Cmd>block</Cmd> — 縦に積まれ、横幅いっぱいに広がる（div, p, h1）</li>
        <li><Cmd>inline</Cmd> — 文中に並び、幅・高さ指定が効かない（span, a）</li>
        <li><Cmd>inline-block</Cmd> — 横に並びつつ幅・高さを指定できる</li>
        <li><Cmd>flex</Cmd> / <Cmd>grid</Cmd> — 子要素をレイアウトする（後述）</li>
        <li><Cmd>none</Cmd> — 非表示（要素自体が消える）</li>
      </ul>
      <SubSection>position — 配置の基準</SubSection>
      <ul>
        <li><Cmd>static</Cmd> — 初期値。通常の流れに従う</li>
        <li><Cmd>relative</Cmd> — 元の位置を基準にずらす。子の absolute の基準にもなる</li>
        <li><Cmd>absolute</Cmd> — 最も近い relative 祖先を基準に浮かせる</li>
        <li><Cmd>fixed</Cmd> — 画面（ビューポート）に固定。スクロールしても動かない</li>
        <li><Cmd>sticky</Cmd> — 通常配置だが、スクロールで一定位置に貼り付く</li>
      </ul>

      <Section>Flexbox — 1 次元レイアウト</Section>
      <p>
        Flexbox は「横一列」または「縦一列」の並びを制御する仕組みです。親に <Cmd>display: flex</Cmd> を指定し、子の配置を <Cmd>justify-content</Cmd>（主軸）と <Cmd>align-items</Cmd>（交差軸）で整えます。
      </p>
      <Code lang="css">{`.toolbar {
  display: flex;
  justify-content: space-between; /* 左右に寄せて間を空ける */
  align-items: center;            /* 縦方向の中央揃え */
  gap: 12px;                      /* 子どうしの間隔 */
}`}</Code>
      <Callout variant="tip" title="迷ったら gap">
        子要素の間隔は、昔は margin で調整していましたが、今は <Cmd>gap</Cmd> が Flexbox / Grid どちらでも使え、端の余分な余白も出ないため第一選択です。
      </Callout>

      <p>
        <Cmd>justify-content: space-between</Cmd> は「両端に寄せ、残りスペースを均等に配る」という<strong>結果</strong>の指定です。ウィンドウ幅が変われば残りスペースも変わりますが、
        あなたはピクセル値を計算しません。「制約（間隔を均等に）」を宣言し、実際の座標は Flexbox のレイアウトアルゴリズムが解きます。
      </p>

      <Section>Grid — 2 次元レイアウト</Section>
      <p>
        Grid は「行と列」の両方を同時に扱えるレイアウトです。カード一覧やページ全体の骨格に向きます。
      </p>
      <Code lang="css">{`.cards {
  display: grid;
  /* 幅280px以上で自動的に列を折り返す定番パターン */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}`}</Code>
      <p>
        <Cmd>minmax(280px, 1fr)</Cmd> は「各列は最小 280px、最大は残り幅の等分（<Cmd>1fr</Cmd>）」という制約です。列数はブラウザが「280px 以上を保ちつつ何列入るか」を計算して決めます。
        メディアクエリで幅ごとに列数を書き分けなくても、制約を 1 行書けば自動で折り返す — これが宣言的レイアウトの威力です。
      </p>
      <Bridge course="制約充足問題（CSP） / 数理最適化">
        Flexbox と Grid のレイアウトエンジンは、実質的に<strong>制約ソルバー</strong>です。「この要素は最小 280px」「間隔は均等」「余りは <Cmd>1fr</Cmd> で分配」といった制約の集合を与えると、
        エンジンがすべてを同時に満たす座標・幅を求解します。これは講義で扱う制約充足問題（CSP）や線形計画に近い構造で、
        実際 CSS のフレックス伸縮（<Cmd>flex-grow</Cmd> / <Cmd>flex-shrink</Cmd>）は「余剰・不足スペースを比率で配分する」線形な解法として仕様化されています。
        「解き方は書かず、制約だけ書く」という発想は、CSS もパズルソルバーも同じ理論の応用です。
      </Bridge>
      <TipBox>
        ざっくりした指針: <strong>一方向の並び（ツールバー・ナビ）は Flexbox</strong>、<strong>格子状の面（カード一覧・ページ骨格）は Grid</strong>。両者は組み合わせて使えます。
      </TipBox>

      <Section>カスケードと詳細度 — 規則ベースの優先順位</Section>
      <p>
        CSS の C は Cascading（カスケード＝段階的に流れ落ちる）。複数のルールが同じ要素に当たったとき、どれが勝つかは次の順で決まります。
      </p>
      <ol>
        <li><strong>重要度（origin / importance）</strong>: <Cmd>!important</Cmd> が付いたものが最優先（乱用は禁物）</li>
        <li><strong>詳細度（specificity）</strong>: id &gt; クラス/擬似クラス &gt; 要素 の順で強い</li>
        <li><strong>記述順（source order）</strong>: 同じ詳細度なら、後に書いた方が勝つ</li>
      </ol>
      <Code lang="css">{`p { color: gray; }        /* 詳細度: 弱 */
.note { color: blue; }    /* 詳細度: 中（クラスが勝つ） */
#lead { color: red; }     /* 詳細度: 強（id が最強） */`}</Code>

      <Figure
        src="/learn/shots/web/css-basics-02.svg"
        alt="Chrome DevTools の Styles ペインで、詳細度に負けた宣言が取り消し線で表示されている状態"
        caption="負けた宣言には取り消し線が入る。「書いたのに効かない」ときは、まずこの線を探す。"
      />

      <SubSection>詳細度は 3 つ組で数える</SubSection>
      <p>
        詳細度は感覚ではなく、<Cmd>(id の数, クラス/擬似クラス/属性の数, 要素/擬似要素の数)</Cmd> という <strong>3 桁のタプル</strong>で機械的に比較されます。
        左の桁ほど強く、桁上がりはしません（クラスを 100 個並べても id 1 個には勝てない）。
      </p>
      <KVList
        items={[
          { key: <Cmd>li</Cmd>, val: "(0,0,1) — 要素1つ" },
          { key: <Cmd>.nav a</Cmd>, val: "(0,1,1) — クラス1 + 要素1" },
          { key: <Cmd>#menu li.active</Cmd>, val: "(1,1,1) — id1 + クラス1 + 要素1" },
          { key: <Cmd>a:hover</Cmd>, val: "(0,1,1) — 擬似クラスはクラス扱い" },
        ]}
      />
      <Bridge course="コンパイラ / 論理・規則ベース推論">
        「複数の規則が同時に当てはまるとき、どの規則を発火させるか」は、規則ベースシステム（エキスパートシステムの推論エンジンや、コンパイラのパターンマッチ）で言う<strong>競合解消（conflict resolution）</strong>そのものです。
        Prolog が節を上から順に試すのも、字句解析器が最長一致を選ぶのも、同じ「優先順位で一意に決める」問題。CSS のカスケードは、詳細度タプルの辞書式順序＋記述順という<strong>全順序</strong>を与えることで、
        どの要素に対しても勝者が必ず 1 つに定まる（曖昧さが残らない）よう設計されています。理論を知っていると「なぜ !important が設計として危険か」も腑に落ちます。
      </Bridge>
      <Callout variant="warn" title="!important に頼らない">
        <Cmd>!important</Cmd> は詳細度の議論を飛び越えて勝ってしまうため、後から上書きが困難になります（上書きするには別の !important が必要になり、優先順位の階層がもう一段生えてしまう）。
        まずはセレクタ設計で解決し、!important は最後の手段にとどめます。
      </Callout>

      <Section>カスタムプロパティ（CSS 変数）</Section>
      <p>
        色や余白などの繰り返し使う値は、CSS 変数（カスタムプロパティ）に切り出すと一元管理できます。<Cmd>--名前</Cmd> で定義し、<Cmd>var(--名前)</Cmd> で参照します。
      </p>
      <Code lang="css" filename="global.css">{`:root {
  --accent: #22b0a0;
  --text: #1a2b4a;
  --space: 16px;
}

.btn {
  background: var(--accent);
  color: white;
  padding: var(--space);
}`}</Code>
      <TipBox>
        <Cmd>:root</Cmd>（＝html 要素）に定義すると、ページ全体のどこからでも参照できます。テーマ色の切り替えやダークモードも、変数の値を差し替えるだけで実現できます。
      </TipBox>

      <Divider />

      <Section>style.css と global.css の役割と使い分け</Section>
      <p>
        プロジェクトが育つと、CSS を役割ごとにファイル分割します。名前は慣習ですが、代表的な 2 つの役割を押さえましょう。
      </p>
      <ComparisonTable
        headers={["", "global.css", "style.css"]}
        rows={[
          ["役割", "サイト全体の土台・共通ルール", "個別のページ / コンポーネントの見た目"]  ,
          ["主な中身", "リセット、box-sizing、CSS 変数、フォント、body 背景", "ボタン、カード、レイアウトなど具体的な部品"],
          ["読み込む場所", "アプリのエントリで一度だけ", "使うページ / 部品ごと"],
          ["変更の影響範囲", "全ページに波及（慎重に）", "そのページ / 部品に限定"],
        ]}
      />

      <SubSection>global.css に置くもの</SubSection>
      <p>すべてのページに共通で効かせたい「地ならし」を集約します。</p>
      <Code lang="css" filename="global.css">{`/* 1. リセット: ブラウザ既定の余白を消す */
* { margin: 0; padding: 0; }
*, *::before, *::after { box-sizing: border-box; }

/* 2. グローバル変数: 全体で使うデザイントークン */
:root {
  --accent: #22b0a0;
  --text: #1a2b4a;
  --bg: #ffffff;
}

/* 3. 共通のベース書式 */
body {
  font-family: "Inter", sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.7;
}`}</Code>

      <SubSection>style.css に置くもの</SubSection>
      <p>特定のページや部品に固有の見た目を書きます。global.css の変数を参照すると一貫性が保てます。</p>
      <Code lang="css" filename="style.css">{`.card {
  background: var(--bg);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.card__title {
  color: var(--accent);
  font-size: 20px;
}`}</Code>

      <Callout variant="info" title="読み込み順が大事">
        global.css を<strong>先に</strong>読み込み、style.css を<strong>後に</strong>読み込みます。こうすると、同じ詳細度のときは後勝ちのルールにより、個別スタイルが土台を上書きできます。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "CSS は「セレクタ { プロパティ: 値; }」で見た目を宣言する",
          "適用はインライン / style 要素 / 外部ファイルの3通り。実務は外部ファイルが基本",
          "ボックスモデルは content→padding→border→margin の4層。box-sizing: border-box で直感的に",
          "1次元の並びは Flexbox、2次元の格子は Grid。間隔は gap",
          "勝敗はカスケード（重要度 → 詳細度 → 記述順）で決まる。!important は最終手段",
          "共通の土台は global.css（リセット・変数・ベース）、個別は style.css。global を先に読み込む",
        ]}
      />
    </>
  );
}

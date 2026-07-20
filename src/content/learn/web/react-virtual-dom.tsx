import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, TipBox, Figure, Divider } from "../../../components/learn/kit";
import { FlowChain, VDomDiffFigure } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "react-virtual-dom",
  title: "React の宣言的 UI 実装 — 仮想 DOM と差分検出",
  description: "仮想 DOM を「下描き用紙」に例え、全再描画・手動更新・差分検出の 3 方式を比較して React の効率的レンダリングを理解する。",
  domain: "web",
  section: "frontend",
  order: 10,
  level: "basic",
  tags: ["React", "仮想DOM", "レンダリング"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        前章で見た宣言的 UI —「結果を宣言するだけで画面が更新される」— を、React はどう実現しているのでしょうか。
        鍵は<strong>仮想 DOM（Virtual DOM）</strong>です。仮想 DOM を「下描き用紙」に例えると、その効率の良さが直感的に理解できます。
      </Lead>

      <Section>仮想 DOM ＝ 下描き用紙</Section>
      <p>
        実 DOM（ブラウザが実際に描画する要素）を<strong>本番のキャンバス</strong>だとすると、
        仮想 DOM はその<strong>軽量な下描き用紙</strong>です。React はまず下描き用紙の上で「あるべき UI」を組み立て、
        本番のキャンバスへは必要な変更だけを写します。実 DOM の操作は重いため、この一手間が効いてきます。
      </p>
      <p>
        データ構造の観点では、仮想 DOM は<strong>木（tree）</strong>です。画面の各要素がノードになり、
        入れ子の親子関係が枝になります。<Cmd>&lt;div&gt;&lt;p&gt;...&lt;/p&gt;&lt;/div&gt;</Cmd> という HTML の入れ子は、
        そのまま「div ノードの子に p ノードがぶら下がる木」に対応します。
        JSX を書くと、React はこの木を<strong>プレーンなオブジェクト</strong>として組み立てます。実 DOM ノードよりずっと軽いのがポイントです。
      </p>

      <Code lang="js" filename="vdom-node.js">{`// <li className="item">Cat</li> はおおよそこの形のオブジェクトになる
const node = {
  type: "li",
  props: { className: "item", children: "Cat" },
};
// これらが children で入れ子になり「木」を成す`}</Code>

      <Section>3 つの更新方式を比べる</Section>
      <p>
        「タコの絵を描いていて、最後の 1 本の足だけを描き直したい」という場面を想像してください。
        更新のやり方には次の 3 通りがあります。
      </p>

      <ComparisonTable
        headers={["方式", "やり方", "評価"]}
        rows={[
          ["方式1：全消し再描画", "絵を全部消して最初から描き直す", "確実だが非効率（無駄が多い）"],
          ["方式2：手動で部分更新", "変わった足だけを自分で描き直す", "効率的だが手間・ミスが起きやすい"],
          ["方式3：差分検出で自動更新", "下描き1と2を比べ、差分だけ自動反映", "効率的かつ手間が少ない（React 方式）"],
        ]}
      />

      <p>
        方式 1 は無駄が多く、方式 2 は「どこが変わったか」を人間が正確に管理し続けなければなりません。
        React が採るのは<strong>方式 3</strong>です。更新前後の仮想 DOM（下描き 1・2）を比較して差分を割り出し、
        変わった部分だけを実 DOM に反映します。
      </p>

      <FlowChain
        nodes={[
          { label: "state 変更", variant: "alt" },
          { label: "仮想 DOM 再構築" },
          { label: "差分検出", sub: "diff" },
          { label: "実 DOM へ最小反映", variant: "cta" },
        ]}
        caption="変わった部分だけを実 DOM に反映"
      />

      <Callout variant="tip" title="差分検出（reconciliation）">
        更新前後の仮想 DOM ツリーを突き合わせ、変わった箇所だけを抽出する処理を「差分検出（reconciliation）」と呼びます。
        開発者は「あるべき結果」を宣言するだけでよく、どこをどう書き換えるかは React が引き受けてくれます。
      </Callout>

      <VDomDiffFigure caption="① 新しい仮想DOMを再構築 → ② 前回とdiffして変更ノード（Fish→Bird）を検出 → ③ 実DOMはその 1 箇所だけを更新（Cat・Dog はスキップ）。" />

      <Figure src="/learn/shots/web/react-virtual-dom-01.svg" alt="React DevTools の Highlight updates で再描画された箇所が枠で光っている画面" caption="Highlight updates を有効にすると、実際に更新された範囲だけが光る" />

      <Section>なぜ「速い」のか — 計算量の話</Section>
      <p>
        「2 つの木を比べて、片方をもう片方に変える最小の編集手順を求める」という問題は、アルゴリズムの世界では
        <strong>tree edit distance（木の編集距離）</strong>と呼ばれ、古くから研究されています。
        そして厄介なことに、任意の木に対する<strong>厳密な</strong>最小差分の計算量は <Cmd>O(n^3)</Cmd> 程度かかります
        （n はノード数）。要素が 1000 個あれば 10 億回規模の比較になり、毎フレームの UI 更新には到底使えません。
      </p>

      <SubSection>React の割り切り — 2 つのヒューリスティック</SubSection>
      <p>
        React は「厳密な最小差分」を諦め、代わりに実用上ほぼ正しい<strong>近似</strong>で <Cmd>O(n)</Cmd> に落とします。
        鍵は 2 つの仮定（ヒューリスティック）です。
      </p>

      <KVList
        items={[
          { key: "同じ階層だけ比べる", val: "木を「移動」させる可能性は捨て、同じ位置（親が同じ）のノードどうしだけを対応づける。階層をまたぐ移動は作り直し扱いにする" },
          { key: "型が違えば作り直す", val: "同じ位置でも要素の型（div → span 等）が変われば、その部分木は丸ごと捨てて再生成する。中を細かく比べない" },
        ]}
      />

      <p>
        この 2 つの割り切りにより、木全体を総当たりせず<strong>ノードを一度ずつ走査するだけ</strong>で済むため、
        計算量は <Cmd>O(n)</Cmd> に近づきます。「理論的な最適」より「実用的に十分速い近似」を選んだ、という設計判断です。
      </p>

      <ComparisonTable
        headers={["手法", "求めるもの", "計算量"]}
        rows={[
          ["厳密な tree edit distance", "本当の最小編集手順", "約 O(n^3)（実用不可）"],
          ["React の reconciliation", "実用上十分な差分", "約 O(n)（ヒューリスティック近似）"],
        ]}
      />

      <Bridge course="アルゴリズム / 計算量理論 / データ構造">
        講義で扱う<strong>「厳密解は高コスト → 問題に合った仮定を置いて近似し、計算量を下げる」</strong>という
        設計パターンの実例です。木の差分（tree diff）という <Cmd>O(n^3)</Cmd> の問題を、
        「移動は考えない」「型が違えば作り直す」という<strong>ドメイン特化のヒューリスティック</strong>で
        <Cmd>O(n)</Cmd> に落としています。UI では「木構造が別の親へ丸ごと飛ぶ」ことは稀、という
        <strong>入力の性質に対する仮定</strong>があるからこそ、この近似が実用上ほぼ損をしません。
        「最悪計算量」ではなく「典型入力での性能」で設計する、良い教材です。
      </Bridge>

      <TipBox>
        React 公式ドキュメントも、この差分アルゴリズムが<strong>ヒューリスティックであり最適解ではない</strong>ことを
        明言しています。だから <Cmd>key</Cmd> を正しく付ける（＝ノードの対応づけを人間が助ける）ことが、
        近似の精度を保つうえで効いてきます。詳細は次章以降の Fiber と key の話につながります。
      </TipBox>

      <Section>宣言的 UI と効率の両立</Section>
      <p>
        この仕組みのおかげで、React では<strong>宣言的な書きやすさ</strong>（結果を宣言するだけ）と
        <strong>効率的な更新</strong>（差分だけ反映）を同時に得られます。
        私たちは方式 2 の面倒な手動更新から解放されつつ、方式 1 のような無駄な全再描画も避けられるのです。
      </p>

      <Callout variant="info" title="「仮想 DOM」は通称">
        実は React が内部で管理しているのは、厳密には仮想 DOM ではなく「Fiber ノード」という木構造です。
        その正体は次章で掘り下げます。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "仮想 DOM は「下描き用紙」、実 DOM は「本番のキャンバス」。実体は軽量なオブジェクトの木構造",
          "更新方式は全再描画・手動更新・差分検出の3つ。React は差分検出を採る",
          "厳密な木の差分は O(n^3)。React はヒューリスティックで O(n) に近似する",
          "近似の仮定は「同階層だけ比較」「型が違えば作り直す」の2つ",
          "宣言的な書きやすさと効率的な更新を両立できるのが仮想 DOM の狙い",
        ]}
      />
    </>
  );
}

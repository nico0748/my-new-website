import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "search-tree",
  title: "探索木（二分探索木）",
  description: "各ノードで「左の子 < 親 < 右の子」を保つ二分探索木(BST)。探索・挿入が平均 O(log N)・最悪 O(N) になる理由、ノードを class で表した挿入・探索・中順走査(ソート列が得られる)の Python 実装、そして Python 標準に平衡木が無く実務は bisect や set/dict で代替する事情、木が偏ると O(N) に劣化する落とし穴までを解説します。",
  domain: "kyopro",
  section: "search-basics",
  order: 3,
  level: "basic",
  tags: ["データ構造", "二分探索木"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>二分探索木（Binary Search Tree, BST）</strong>は、各ノードが「<strong>左の子 &lt; 親 &lt; 右の子</strong>」という
        並びの約束を守る木構造です。この約束のおかげで、二分探索と同じ「半分ずつ絞る」探索が、
        配列ではなく<strong>木の上</strong>でできます。探索木の考え方は、平衡木・set/dict・データベースの索引の土台になります。
      </Lead>

      <Section>概要 — 何を、いつ使うか</Section>
      <p>
        配列の二分探索は速い一方、要素を<strong>挿入・削除</strong>すると並びを保つのに O(N) かかります（要素をずらすため）。
        BST は<strong>挿入・削除・探索のすべてを木をたどりながら</strong>行い、うまく保てば平均 O(log N) で処理できるデータ構造です。
      </p>
      <KVList
        items={[
          { key: "並びの約束（BST 条件）", val: "任意のノードで、左部分木の全値 < 自分の値 < 右部分木の全値" },
          { key: "得意なこと", val: "探索・挿入・削除を動的に（要素が増減しても）そこそこ速く行う" },
          { key: "うれしい性質", val: "中順走査（左→自分→右）で、値が昇順ソート列として取り出せる" },
        ]}
      />

      <Section>計算量 — なぜ平均 O(log N)・最悪 O(N) か</Section>
      <p>
        探索・挿入は<strong>根から葉へ 1 本の道をたどる</strong>だけなので、計算量は<strong>木の高さ</strong>に等しくなります。
      </p>
      <ComparisonTable
        headers={["木の形", "高さ", "探索・挿入の計算量"]}
        rows={[
          ["バランスが取れている", "約 log N", "O(log N)（速い）"],
          ["偏っている（片側だけ伸びる）", "N", "O(N)（連結リスト同然）"],
        ]}
      />
      <p>
        バランスが良ければ高さは <Cmd>log₂N</Cmd> 程度で、各段で子を 1 つ選ぶだけなので O(log N)。
        しかし<strong>ソート済みデータを順に挿入</strong>すると、右へ右へと一直線に伸びて高さ N の
        「棒」になり、事実上の線形探索 O(N) に劣化します。ここが BST の弱点です。
      </p>

      <Section>仕組み・なぜ動くか</Section>
      <StepFlow
        steps={[
          { title: "根から比較を始める", desc: "探したい値 x と現在ノードの値を比べる" },
          { title: "x が小さければ左へ", desc: "左部分木にしか x はあり得ない（BST 条件）" },
          { title: "x が大きければ右へ", desc: "右部分木にしか x はあり得ない" },
          { title: "一致で発見 / 子が無ければ不在", desc: "等しければ見つかった。進む先の子が None なら存在しない" },
        ]}
        caption="各ノードで左右どちらかを選び、探索範囲（部分木）を半分に絞る"
      />
      <p>
        <strong>BST 条件が「片側を捨てる」根拠</strong>です。x が現在ノードより小さいなら、右部分木の値はすべて
        現在ノードより大きい（＝ x より大きい）ので、右は見る必要がありません。二分探索と同じ論理が
        木構造で成り立ちます。挿入も同じ経路をたどり、「進みたい方向の子が空いた場所」に新しいノードを置くだけです。
      </p>

      <Section>Python 実装 — ノード class で挿入・探索・中順走査</Section>
      <Code lang="python" filename="bst.py">{`class Node:
    def __init__(self, val):
        self.val = val
        self.left = None      # 左の子（自分より小さい値）
        self.right = None     # 右の子（自分より大きい値）

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        """BST 条件を保ちながら val を挿入する。"""
        if self.root is None:
            self.root = Node(val)
            return
        cur = self.root
        while True:
            if val < cur.val:                 # 左へ
                if cur.left is None:
                    cur.left = Node(val)      # 空いた場所に置く
                    return
                cur = cur.left
            elif val > cur.val:               # 右へ
                if cur.right is None:
                    cur.right = Node(val)
                    return
                cur = cur.right
            else:
                return                        # 既に存在（重複は入れない）

    def search(self, val):
        """val があれば True。根から葉へ1本の道をたどる → O(高さ)。"""
        cur = self.root
        while cur is not None:
            if val == cur.val:
                return True
            cur = cur.left if val < cur.val else cur.right
        return False

    def inorder(self):
        """中順走査（左→自分→右）。BST では昇順ソート列になる。"""
        result = []
        def rec(node):
            if node is None:
                return
            rec(node.left)        # 左部分木（小さい値）を先に
            result.append(node.val)
            rec(node.right)       # 右部分木（大きい値）を後に
        rec(self.root)
        return result

tree = BST()
for x in [5, 3, 8, 1, 4, 7, 9]:
    tree.insert(x)
print(tree.search(7))    # -> True
print(tree.search(6))    # -> False
print(tree.inorder())    # -> [1, 3, 4, 5, 7, 8, 9]  （昇順！）`}</Code>
      <Callout variant="info" title="中順走査で昇順になる理由">
        中順走査は必ず「左部分木 → 自分 → 右部分木」の順に訪れます。BST では左は自分より小さく右は大きいので、
        再帰的にこの順を守ると、結果は自動的に<strong>昇順</strong>に並びます。「BST に入れて中順で出す」＝
        一種のソートとも言えます。
      </Callout>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "動的な集合の管理", val: "要素が増減しつつ、存在判定・最小/最大・順序付き取り出しをしたいとき" },
          { key: "順序付きの範囲クエリ", val: "「x 以上 y 以下の要素」など、順序を保つ検索（平衡木があれば O(log N)）" },
          { key: "概念理解の土台", val: "平衡二分探索木(AVL・赤黒木)、B木（DBの索引）、ヒープなど、木構造の入口" },
        ]}
      />
      <Callout variant="tip" title="実務・競プロでは「自前 BST」はあまり書かない">
        <p>
          素の BST は偏ると O(N) に落ちるため、実務では<strong>平衡二分探索木</strong>（AVL 木・赤黒木）を使います。
          しかし <strong>Python の標準ライブラリには平衡木がありません</strong>。そのため実戦では次で代替するのが定石です。
        </p>
        <ul>
          <li><strong>順序が要る</strong>: ソート済みリスト＋<Cmd>bisect</Cmd>（挿入は O(N) だが検索は O(log N)）</li>
          <li><strong>存在判定・キー参照だけ</strong>: <Cmd>set</Cmd> / <Cmd>dict</Cmd>（ハッシュで平均 O(1)、ただし順序は保たない）</li>
          <li><strong>本格的に平衡木が要る</strong>: <Cmd>sortedcontainers</Cmd> の <Cmd>SortedList</Cmd> 等（外部ライブラリ）</li>
        </ul>
      </Callout>
      <ComparisonTable
        headers={["やりたいこと", "平衡BST", "set/dict(ハッシュ)", "ソート済み配列+bisect"]}
        rows={[
          ["存在判定", "O(log N)", "平均 O(1)", "O(log N)"],
          ["挿入", "O(log N)", "平均 O(1)", "O(N)（ずらす）"],
          ["最小/最大・順序取り出し", "O(log N)", "不可（順序なし）", "O(1)/O(N)"],
        ]}
      />

      <Section>落とし穴</Section>
      <Callout variant="danger" title="偏ると O(N) に劣化する（最大の弱点）">
        <p>
          素の BST に<strong>ソート済み（または逆順）のデータを順に挿入</strong>すると、木が一直線に伸びて
          高さ N の「棒」になります。こうなると探索・挿入は O(N) で、連結リストと変わりません。
        </p>
        <Code lang="python" filename="degenerate.py">{`tree = BST()
for x in [1, 2, 3, 4, 5]:   # 昇順に入れると…
    tree.insert(x)
# 1
#  \\
#   2
#    \\
#     3
#      \\   ← 右へ一直線。高さ=5、探索は O(N)
#       ...`}</Code>
        <p>
          これを防ぐのが<strong>平衡化</strong>（AVL・赤黒木は挿入時に回転して高さを log N に保つ）です。
          自前で平衡木を書くのは大変なので、前述のとおり Python では bisect や sortedcontainers で代替します。
        </p>
      </Callout>
      <Callout variant="warn" title="再帰の深さ制限（Python）">
        再帰で走査・挿入を書くと、木が深い（偏った）場合に <Cmd>RecursionError</Cmd>（既定は約 1000 段）に達します。
        深くなり得るなら <Cmd>sys.setrecursionlimit</Cmd> を上げるか、探索・挿入は上のように<strong>反復（while ループ）</strong>で書くと安全です。
      </Callout>

      <Bridge course="データ構造 / 計算量理論（アルゴリズムとデータ構造）">
        <p>
          BST は講義で学ぶ<strong>木構造</strong>の中心的な題材で、「計算量は木の高さで決まる」という
          データ構造の本質を体現します。高さを log N に抑える工夫が<strong>平衡二分探索木（AVL・赤黒木）</strong>で、
          回転（rotation）による自己平衡は情報系の定番トピックです。さらに、<strong>データベースの索引</strong>で使われる
          <Cmd>B木 / B+木</Cmd>は、ディスクアクセスを減らすために「1 ノードに多くのキーを持たせて高さを低くした」多分岐の探索木で、
          BST の発想の延長にあります。同じ「順序付き集合」を、ハッシュ（set/dict）は O(1) だが順序を捨て、
          探索木は O(log N) で順序を保つ――<strong>何を犠牲に何を得るか</strong>というトレードオフの理解が、
          データ構造選択の核心です。
        </p>
      </Bridge>

      <Quiz
        question="素の二分探索木(BST)に 1,2,3,...,N を昇順で順に挿入しました。search の計算量は？"
        options={[
          <>常に O(log N)</>,
          <>O(1)</>,
          <>O(N)（木が右へ一直線に偏るため）</>,
          <>O(N log N)</>,
        ]}
        answer={2}
        explanation={<>昇順挿入では新しい値が常に最大となり右の子だけが伸びます。高さ N の「棒」になり、探索は根から葉まで N 段たどるので O(N)。これを避けるには平衡木（AVL・赤黒木）や sortedcontainers を使います。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "二分探索木(BST)は「左の子 < 親 < 右の子」を保つ木。探索・挿入は木の高さ分をたどる",
          "バランスが良ければ高さ log N で O(log N)、偏る（ソート順挿入など）と高さ N で O(N)",
          "中順走査（左→自分→右）で値が昇順ソート列として取り出せる",
          "Python 標準に平衡木は無い → 実務は bisect(順序) / set・dict(存在判定 O(1)) / sortedcontainers で代替",
          "偏りが弱点。平衡化（AVL・赤黒木の回転）が高さを log N に保つ。DBの索引 B木 も探索木の応用",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import {
  Lead,
  Section,
  SubSection,
  Callout,
  Code,
  Cmd,
  KVList,
  KeyPoints,
  ComparisonTable,
  Bridge,
  Quiz,
  TipBox,
  Divider,
} from "../../../components/learn/kit";
import { FlowChain, StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "network-flow",
  title: "ネットワークフロー（最大流・最小カット）",
  description:
    "最大流問題を、残余グラフと増加路という中心概念から解説。フォード・ファルカーソン法と、BFS で増加路を選ぶ Edmonds-Karp（O(V·E^2)）を Python 実装で示し、最大流最小カット定理と二部マッチングへの応用まで扱う。",
  domain: "kyopro",
  section: "dp-flow",
  order: 2,
  level: "practice",
  tags: ["フロー", "最大流", "最小カット"],
  updated: "2026-07-07",
  minutes: 24,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>最大流問題</strong>は「パイプ網（各管に容量がある）で、始点 S から終点 T へ最大どれだけ流せるか」を求める問題です。
        一見すると特殊な設定に見えますが、<strong>マッチング・割り当て・選択問題</strong>など驚くほど多くの問題がこの形に帰着します。
        鍵になるのは<strong>残余グラフ</strong>と<strong>増加路</strong>という 2 つの概念、そして「最大流の値 = 最小カットの容量」という美しい定理です。
        この記事は概念を中心に据えつつ、BFS で増加路を選ぶ <strong>Edmonds-Karp</strong> の動く実装まで一気に見ていきます。
      </Lead>

      <Section>概要 — 最大流問題</Section>
      <p>
        有向グラフの各辺に<strong>容量（capacity）</strong>が付いています。ここに「流量（flow）」を割り当てるとき、次の 2 条件を守ります。
      </p>
      <KVList
        items={[
          { key: "容量制約", val: "各辺の流量は 0 以上・容量以下（管の太さを超えて流せない）" },
          { key: "流量保存", val: "S と T 以外の各頂点で、入ってくる流量の合計 = 出ていく流量の合計" },
          { key: "目的", val: "S から出て T に届く総流量（＝流れの値）を最大化する" },
          { key: "S / T", val: "S = ソース（湧き出し口）、T = シンク（吸い込み口）" },
        ]}
      />
      <FlowChain
        nodes={[
          { label: "S", sub: "source", variant: "alt" },
          { label: "A", sub: "cap 3" },
          { label: "B", sub: "cap 2" },
          { label: "T", sub: "sink", variant: "cta" },
        ]}
        caption="各辺の容量の範囲で、S から T へできるだけ多く流す。ボトルネック（最小容量の辺）が全体の上限を決める。"
      />
      <p>
        身近な比喩は「水道網」や「道路網」です。S から水を流し、途中の合流・分岐を経て T に集める。
        各管の太さ（容量）が決まっているとき、蛇口全開で毎秒どれだけ流せるかが最大流です。
      </p>

      <Section>計算量</Section>
      <p>
        最大流のアルゴリズムは「増加路をどう選ぶか」で計算量が変わります。代表的な 2 つを比較します。
      </p>
      <ComparisonTable
        headers={["アルゴリズム", "増加路の選び方", "計算量", "特徴"]}
        rows={[
          [
            "Ford-Fulkerson",
            "任意（DFS など）",
            <>O(E · F)（F = 最大流の値）</>,
            "整数容量なら必ず停止。容量が大きいと遅くなりうる",
          ],
          [
            "Edmonds-Karp",
            "BFS で最短（辺数最小）",
            <>O(V · E²)</>,
            "容量の大きさに依存しない。実装が素直で頻出",
          ],
          [
            "Dinic",
            "レベルグラフ＋複数経路",
            <>O(V² · E)</>,
            "実務・競技での定番。二部マッチングでは O(E√V)",
          ],
        ]}
      />
      <Callout variant="info" title="Ford-Fulkerson と Edmonds-Karp の関係">
        <strong>Ford-Fulkerson は「増加路を見つけて流す」という枠組みの総称</strong>で、増加路の選び方は決めていません。
        DFS で適当に選ぶと、容量 F に比例した回数だけ反復しうる（F が巨大だと遅い）。
        そこで「<strong>BFS で辺数最小の増加路を選ぶ</strong>」と決めたのが Edmonds-Karp で、
        反復回数が O(V·E) に抑えられ、容量の大きさに依存しない O(V·E²) が保証されます。
      </Callout>

      <Section>仕組み・なぜ増加路で最大流に届くのか</Section>
      <SubSection>残余グラフ（residual graph）</SubSection>
      <p>
        フローアルゴリズムの心臓が<strong>残余グラフ</strong>です。ある辺に容量 <Cmd>cap</Cmd>・現在の流量 <Cmd>f</Cmd> があるとき、
        残余グラフには次の 2 種類の辺を持たせます。
      </p>
      <KVList
        items={[
          { key: "順方向の残余辺", val: "残り容量 cap - f（あとどれだけ流せるか）" },
          { key: "逆方向の残余辺", val: "残り容量 f（流したぶんを『押し戻せる』量）" },
        ]}
      />
      <p>
        逆辺が本質的です。一度流した水を後から<strong>キャンセル（押し戻し）</strong>できるようにしておくことで、
        「最初に選んだ経路が最適でなくても、後から流し直して修正できる」ようになります。
        この逆辺のおかげで、貪欲に増加路を足していくだけで<strong>本当の最大流</strong>に到達できます。
      </p>
      <SubSection>増加路（augmenting path）</SubSection>
      <p>
        <strong>増加路</strong>とは、残余グラフ上で S から T へたどれる「残り容量がすべて正の経路」です。
        増加路が見つかったら、その経路上の<strong>最小の残り容量（ボトルネック）</strong>だけ流します。
        すると経路上の順辺は残り容量が減り、逆辺は増えます。これを<strong>増加路が無くなるまで</strong>繰り返します。
      </p>
      <StepFlow
        steps={[
          {
            title: "残余グラフで S→T の増加路を探す",
            desc: <>Edmonds-Karp では BFS で辺数最小の経路を探す。見つからなければ終了（＝最大流に到達）。</>,
          },
          {
            title: "ボトルネック（経路上の最小残余容量）を求める",
            desc: <>その経路で追加で流せる最大量。ここでは aug と呼ぶ。</>,
          },
          {
            title: "順辺を aug 減らし、逆辺を aug 増やす",
            desc: <>流したぶんを記録し、押し戻し用の逆辺を育てる。総流量に aug を加える。</>,
          },
          {
            title: "1 に戻って繰り返す",
            desc: <>増加路が尽きたときの総流量が最大流。そのとき S 側から到達できる頂点集合が最小カットを与える。</>,
          },
        ]}
        caption="Ford-Fulkerson 系の反復。増加路の探し方を BFS に固定したのが Edmonds-Karp。"
      />
      <SubSection>最大流最小カット定理</SubSection>
      <p>
        <strong>カット</strong>とは、頂点を「S を含む側」と「T を含む側」の 2 グループに分ける切り方です。
        その<strong>容量</strong>は、S 側から T 側へ<strong>渡る辺の容量の合計</strong>で定義します。
      </p>
      <Callout variant="tip" title="最大流最小カット定理（max-flow min-cut theorem）">
        <strong>「S から T への最大流の値」は「S-T を分けるすべてのカットの中で容量が最小のものの値」に等しい</strong>。
        直感的には、全体の流量はどこかの「一番細い断面（最小カット）」で必ず頭打ちになる、ということです。
        増加路が無くなった瞬間、<strong>残余グラフ上で S から到達できる頂点集合</strong>がちょうど最小カットの S 側を与え、
        アルゴリズムが最大流に達したことの証明にもなっています。
      </Callout>

      <Section>Python 実装 — Edmonds-Karp（隣接行列）</Section>
      <p>
        まずは概念を追いやすい<strong>隣接行列</strong>版です。<Cmd>capacity[u][v]</Cmd> に残り容量を持たせ、
        流すたびに順辺を減らし逆辺を増やします（＝行列を残余グラフとして更新する）。頂点数が小さいときに向きます。
      </p>
      <Code lang="python" filename="edmonds_karp_matrix.py">{`from collections import deque

def max_flow(capacity, s, t):
    """capacity[u][v] = 残り容量（副作用で残余グラフに書き換わる）。"""
    n = len(capacity)
    flow = 0
    while True:
        # --- BFS で S->T の増加路（辺数最小）を探す ---
        parent = [-1] * n
        parent[s] = s
        dq = deque([s])
        while dq:
            u = dq.popleft()
            for v in range(n):
                if parent[v] == -1 and capacity[u][v] > 0:
                    parent[v] = u          # v へ来た元を記録
                    dq.append(v)
        if parent[t] == -1:
            break                          # 増加路なし = 最大流に到達

        # --- 経路上のボトルネック（最小残余容量）---
        aug = float("inf")
        v = t
        while v != s:
            u = parent[v]
            aug = min(aug, capacity[u][v])
            v = u

        # --- 残余グラフを更新：順辺を減らし逆辺を増やす ---
        v = t
        while v != s:
            u = parent[v]
            capacity[u][v] -= aug          # 順方向：残り容量が減る
            capacity[v][u] += aug          # 逆方向：押し戻せる量が増える
            v = u

        flow += aug
    return flow

# 使用例：4 頂点（0=S, 3=T）
#   S->1(cap3), S->2(cap2), 1->2(cap1), 1->3(cap2), 2->3(cap3)
cap = [[0, 3, 2, 0],
       [0, 0, 1, 2],
       [0, 0, 0, 3],
       [0, 0, 0, 0]]
print(max_flow(cap, 0, 3))   # -> 4`}</Code>
      <p>
        隣接行列は各 BFS で全頂点対を走査するため、密でない大きなグラフには不向きです。
        辺数が多い・頂点数が大きい場合は、次の<strong>容量付き隣接リスト</strong>版を使います。
      </p>

      <Section>Python 実装 — Edmonds-Karp（容量付き隣接リスト）</Section>
      <p>
        競技で実際に使う骨格がこれです。各辺を <Cmd>[行き先, 残り容量, 逆辺のインデックス]</Cmd> で表し、
        逆辺は容量 0 で対にして張ります。順辺と逆辺が互いのインデックスを指し合うことで、押し戻しを O(1) で行えます。
      </p>
      <Code lang="python" filename="edmonds_karp.py">{`from collections import deque

class MaxFlow:
    def __init__(self, n):
        self.n = n
        self.graph = [[] for _ in range(n)]   # graph[u] = 辺のリスト

    def add_edge(self, u, v, cap):
        # 順辺: [to, cap, 対になる逆辺の index]
        self.graph[u].append([v, cap, len(self.graph[v])])
        # 逆辺: 最初は容量 0（押し戻し用）
        self.graph[v].append([u, 0, len(self.graph[u]) - 1])

    def _bfs(self, s, t):
        # parent[v] = (来た頂点 u, その辺の index)。増加路の復元に使う
        parent = [None] * self.n
        parent[s] = (s, -1)
        dq = deque([s])
        while dq:
            u = dq.popleft()
            for i, (v, cap, _) in enumerate(self.graph[u]):
                if cap > 0 and parent[v] is None:
                    parent[v] = (u, i)
                    if v == t:
                        return parent
                    dq.append(v)
        return parent

    def max_flow(self, s, t):
        flow = 0
        while True:
            parent = self._bfs(s, t)
            if parent[t] is None:
                break                          # 増加路なし = 終了

            # ボトルネックを求める
            aug = float("inf")
            v = t
            while v != s:
                u, i = parent[v]
                aug = min(aug, self.graph[u][i][1])
                v = u

            # 流す：順辺を減らし、対応する逆辺を増やす
            v = t
            while v != s:
                u, i = parent[v]
                self.graph[u][i][1] -= aug     # 順辺の残り容量
                rev = self.graph[u][i][2]      # 逆辺の index
                self.graph[v][rev][1] += aug   # 逆辺の残り容量
                v = u

            flow += aug
        return flow

# 使用例（前と同じグラフ）
mf = MaxFlow(4)
mf.add_edge(0, 1, 3)
mf.add_edge(0, 2, 2)
mf.add_edge(1, 2, 1)
mf.add_edge(1, 3, 2)
mf.add_edge(2, 3, 3)
print(mf.max_flow(0, 3))   # -> 4`}</Code>
      <TipBox>
        <Cmd>add_edge</Cmd> の中で順辺と逆辺が互いのインデックスを保存し合っているのが要点です。
        これにより「順辺 <Cmd>graph[u][i]</Cmd> の逆辺は <Cmd>graph[v][rev]</Cmd>」と O(1) で辿れ、
        残余グラフの更新（流す・押し戻す）が定数時間で済みます。この辺表現はそのまま Dinic 法にも流用できます。
      </TipBox>

      <Section>具体例・使いどころ — 二部マッチングへの応用</Section>
      <p>
        最大流の代表的な応用が<strong>二部マッチング</strong>です。「求職者と求人」「学生と研究室」のように 2 グループがあり、
        可能な組（辺）が与えられたとき、最大で何組ペアにできるかを求めます。次のように<strong>フロー問題へ変換</strong>します。
      </p>
      <StepFlow
        steps={[
          {
            title: "超始点 S と超終点 T を追加する",
            desc: <>左側集合 L の各要素へ S から容量 1 の辺、右側集合 R の各要素から T へ容量 1 の辺を張る。</>,
          },
          {
            title: "元の可能な組を容量 1 の辺にする",
            desc: <>L の要素 l と R の要素 r がペア可能なら l→r に容量 1 の辺。</>,
          },
          {
            title: "S から T への最大流を求める",
            desc: <>容量 1 が「各要素は 1 回しか使えない」を表す。最大流の値 = 最大マッチング数。</>,
          },
        ]}
        caption="容量 1 のフローに落とすと、最大流＝最大マッチングになる（König の定理・最大流最小カットの帰結）。"
      />
      <Code lang="python" filename="bipartite_matching.py">{`# 左 L 人（1..L）と右 R 個（1..R）。edges = ペア可能な (l, r) のリスト。
def bipartite_matching(L, R, edges):
    S, T = 0, L + R + 1            # 超始点 0、超終点 L+R+1
    mf = MaxFlow(L + R + 2)
    for l in range(1, L + 1):
        mf.add_edge(S, l, 1)      # S -> 左（各1回まで）
    for r in range(1, R + 1):
        mf.add_edge(L + r, T, 1)  # 右 -> T（各1回まで）
    for l, r in edges:
        mf.add_edge(l, L + r, 1)  # 左 -> 右（ペア候補）
    return mf.max_flow(S, T)      # = 最大マッチング数

print(bipartite_matching(3, 3, [(1, 1), (1, 2), (2, 1), (3, 3)]))  # -> 3`}</Code>
      <p>
        マッチング以外にも、<strong>プロジェクト選択問題</strong>（利益最大化を最小カットに帰着）、
        <strong>頂点／辺の連結度</strong>（何本切れば分断できるか）、<strong>在庫・輸送の割り当て</strong>など、
        「制約付きで最大限を割り当てる」問題は広くフローに帰着します。「容量 1 の辺 = 使える回数」という発想がモデリングの起点です。
      </p>

      <Section>落とし穴</Section>
      <Callout variant="danger" title="逆辺（押し戻し）を張り忘れる">
        逆辺が無いと「最初に選んだ経路を後から修正」できず、<strong>貪欲が最適に届かない</strong>（間違った答えを出す）ことがあります。
        <Cmd>add_edge</Cmd> では必ず順辺と容量 0 の逆辺を対で張り、流すときは<strong>順辺を減らし逆辺を増やす</strong>——この対称更新を崩さないこと。
        逆辺を張り忘れたフロー実装は、単純な例では通っても複雑な例で落ちます。
      </Callout>
      <Callout variant="warn" title="Ford-Fulkerson は容量が大きいと遅い／非整数だと停止しない恐れ">
        DFS で適当に増加路を選ぶ素朴な Ford-Fulkerson は、反復回数が<strong>最大流の値 F に比例</strong>しうるため、
        容量が巨大だと極端に遅くなります。さらに容量が無理数だと理論上<strong>停止しない</strong>例すらあります。
        <strong>BFS で増加路を選ぶ Edmonds-Karp にすれば</strong>、反復回数が容量に依存せず O(V·E) に収まり安全です。
        競技では最初から Edmonds-Karp か Dinic を使うのが無難です。
      </Callout>
      <Callout variant="warn" title="頂点自体に容量を付けたいとき（頂点分割）">
        「各頂点を通れる回数に上限を付けたい」場合、辺ではなく頂点に容量が要ります。
        このときは<strong>頂点 v を v_in と v_out に分割</strong>し、その間に容量 = 頂点容量の辺を張ります
        （v への入り辺は v_in へ、v からの出辺は v_out から）。頂点制約は必ずこの変換で辺制約に落としてから流します。
      </Callout>

      <Bridge course="グラフ理論 / 組合せ最適化">
        最大流最小カット定理は、<strong>線形計画法の双対性</strong>の一例です。「最大流を求める（主問題）」と
        「最小カットを求める（双対問題）」が同じ最適値を取る——これは組合せ最適化における<strong>強双対性</strong>の代表例で、
        LP 双対・弱双対／強双対の理解にそのままつながります。また二部グラフでは、
        最大マッチングと最小頂点被覆が一致する<strong>König の定理</strong>が最大流最小カットの特殊形として導けます。
        さらにフローは、<strong>ネットワーク信頼性・カット（Menger の定理：点素／辺素な経路数 = 最小カット）・
        画像分割（グラフカット）</strong>など、応用数学と実務の広い領域を貫く共通言語です。
        「制約を容量に、目的を流量に翻訳する」というモデリングの型を身につけると、
        一見バラバラな問題が一つのアルゴリズムで解けるようになります。
      </Bridge>

      <Quiz
        question="残余グラフに『逆辺（容量 0 の押し戻し辺）』を用意するのはなぜ？"
        options={[
          <>グラフを無向にして BFS を速くするため</>,
          <>一度流した水を後から押し戻して<strong>経路の選び直し（修正）</strong>を可能にし、貪欲でも真の最大流に到達できるようにするため</>,
          <>最小カットを計算しないで済ませるため</>,
          <>頂点容量を表現するため</>,
        ]}
        answer={1}
        explanation={
          <>
            逆辺は「流したぶんをキャンセルできる量」を表します。これがあるおかげで、最初に非最適な経路を選んでも
            後から流し直して修正でき、増加路を足していく貪欲な手続きが<strong>最大流に収束</strong>します。
            逆辺が無いと途中の誤った割り当てを取り消せず、最適に届かないことがあります。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "最大流問題は容量制約と流量保存のもとで S→T の総流量を最大化する。多くの割り当て・選択問題がこの形に帰着する",
          "中心概念は残余グラフ（順辺=残り容量、逆辺=押し戻せる量）と増加路。逆辺があるから貪欲でも真の最大流に届く",
          "Ford-Fulkerson は増加路を足す枠組みの総称。BFS で辺数最小の増加路を選ぶ Edmonds-Karp は O(V·E²) で容量に依存しない",
          "最大流最小カット定理：最大流の値 = 最小カットの容量。増加路が尽きたとき S から到達可能な頂点集合が最小カットを与える",
          "二部マッチングは容量 1 のフローに変換して解ける（最大流＝最大マッチング）。頂点容量は頂点分割で辺容量に落とす",
        ]}
      />
    </>
  );
}

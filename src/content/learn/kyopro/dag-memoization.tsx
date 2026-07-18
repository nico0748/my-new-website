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
  id: "dag-memoization",
  title: "DAG と メモ化再帰（DP）",
  description:
    "有向非巡回グラフ（DAG）上の動的計画法を、なぜ循環が無いと解けるのかという原理から解説。トポロジカル順の配列 DP と functools.lru_cache によるメモ化再帰の両実装で、最長経路と経路数え上げを O(V+E) で解く。",
  domain: "kyopro",
  section: "dp-flow",
  order: 1,
  level: "practice",
  tags: ["DP", "DAG", "メモ化"],
  updated: "2026-07-07",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        動的計画法（DP）は「大きな問題を小さな部分問題に分け、答えを再利用する」手法です。その本質を最もはっきり見せてくれるのが
        <strong>DAG（有向非巡回グラフ）上の DP</strong> です。DAG では「部分問題どうしの依存関係が一方向に流れて循環しない」ので、
        <strong>計算する順番が確定</strong>します。この記事では、なぜ循環が無いと解けるのかを原理から確認し、
        <strong>メモ化再帰（lru_cache）</strong>と<strong>トポロジカル順の配列 DP</strong>の両方で、最長経路と経路数え上げを実装します。
      </Lead>

      <Section>概要 — DAG 上の DP とは</Section>
      <p>
        <strong>DAG</strong>（Directed Acyclic Graph, 有向非巡回グラフ）は、辺に向きがあり、
        どこから出発しても元の頂点に戻ってこられない（サイクルが存在しない）グラフです。
        ノードを「部分問題」、辺を「依存関係」とみなすと、多くの DP はそのまま DAG 上の計算になります。
      </p>
      <KVList
        items={[
          { key: "ノード", val: "1 つの部分問題（例: 頂点 v から先の最長経路長）" },
          { key: "辺 u → v", val: "部分問題 u が部分問題 v の答えに依存する" },
          { key: "循環が無い", val: "依存が一方向にしか流れない = 計算順序を一意に決められる" },
          { key: "解ける問題例", val: "最長経路 / 経路数え上げ / 各頂点への到達可否 / コスト最小化" },
        ]}
      />
      <p>
        典型的な題材は 2 つです。<strong>最長経路</strong>（DAG では多項式時間で解ける。一般グラフでは NP 困難）と、
        <strong>経路数え上げ</strong>（始点から終点までの道が何通りあるか）。どちらも「各頂点の答え = 隣の頂点の答えの組み合わせ」で書けます。
      </p>
      <FlowChain
        nodes={[
          { label: "S", sub: "始点", variant: "alt" },
          { label: "A", sub: "中間" },
          { label: "B", sub: "中間" },
          { label: "T", sub: "終点", variant: "cta" },
        ]}
        caption="辺は常に左（先）から右（後）へ向かう。この一方向性こそが DAG の DP を成立させる。"
      />

      <Section>計算量</Section>
      <p>
        DAG 上の DP は、各頂点を 1 度だけ処理し、各辺を 1 度だけ見ます。したがって全体の計算量は
        頂点数 V と辺数 E に対して線形です。
      </p>
      <KVList
        items={[
          { key: "時間計算量", val: "O(V + E)（各頂点1回・各辺1回の走査）" },
          { key: "空間計算量", val: "O(V + E)（隣接リスト）＋ O(V)（dp 配列・メモ）" },
          { key: "メモ化再帰", val: "同じ部分問題を2度計算しないため、素朴な再帰の指数爆発を O(V+E) に落とす" },
          { key: "配列 DP", val: "トポロジカルソート O(V+E) ＋ 遷移 O(V+E)。定数倍が軽く再帰上限も無い" },
        ]}
      />
      <Callout variant="info" title="なぜメモ化で指数から線形になるのか">
        メモ化しない素朴な再帰は、同じ頂点を経路の数だけ何度も訪問し、最悪で指数時間になります。
        メモ化は「一度計算した頂点の答えを保存し、2 度目以降は即返す」ことで、
        各頂点の計算回数を<strong>ちょうど 1 回</strong>に抑えます。これが O(V+E) の正体です。
      </Callout>

      <Section>仕組み・なぜ DAG だと解けるのか</Section>
      <p>
        DP が成立する条件は「部分問題に<strong>循環した依存が無い</strong>こと」です。もし A の答えを出すのに B が必要で、
        B の答えを出すのに A が必要（A → B → A）だと、どちらも先に確定できず計算が止まってしまいます。
        DAG は定義上このような循環を持たないので、<strong>必ず「先に確定できる頂点」が存在</strong>します。
      </p>
      <SubSection>トポロジカル順序 — 計算してよい順番</SubSection>
      <p>
        DAG の頂点は、<strong>「すべての辺が前から後ろへ向かう」一列の並び</strong>（トポロジカル順序）に並べ替えられます。
        この順に処理すれば、ある頂点を計算する時点で、その頂点が依存する頂点はすべて計算済みになっています。
        これが「計算順序が確定する」の意味です。
      </p>
      <StepFlow
        steps={[
          {
            title: "部分問題を頂点に対応させる",
            desc: <>dp[v] = 「頂点 v から先（または v まで）」の答え、と定義する。</>,
          },
          {
            title: "依存関係を辺として書く",
            desc: <>dp[v] が dp[隣] に依存するなら、その向きに辺を張る。循環しなければ DAG。</>,
          },
          {
            title: "先に確定できる頂点から埋める",
            desc: <>トポロジカル順（配列 DP）、または再帰＋メモ化で、依存先を先に解いてから自分を解く。</>,
          },
          {
            title: "答えを取り出す",
            desc: <>始点の dp、または全頂点の dp の最大値・総和などを集約する。</>,
          },
        ]}
        caption="DAG 上の DP の 4 ステップ。循環が無いから 3 番目が必ず実行できる。"
      />
      <TipBox>
        メモ化再帰は「トポロジカルソートを陽に書かず、再帰の呼び出し順に暗黙で任せる」やり方です。
        再帰は依存先へ潜ってから戻るので、戻り値が確定する順序はちょうどトポロジカル順（の逆再帰）になります。
      </TipBox>

      <Section>Python 実装 — メモ化再帰（lru_cache）</Section>
      <p>
        まずは最も書きやすい<strong>メモ化再帰</strong>です。<Cmd>functools.lru_cache</Cmd> をデコレータとして付けるだけで、
        引数ごとの戻り値を自動キャッシュしてくれます。ここでは「頂点 v から出発して到達できる最長経路の辺数」を求めます。
      </p>
      <Code lang="python" filename="longest_path_memo.py">{`import sys
from functools import lru_cache

sys.setrecursionlimit(10 ** 6)  # 再帰上限を引き上げる（後述の落とし穴）
input = sys.stdin.readline

n, m = map(int, input().split())
g = [[] for _ in range(n + 1)]   # 隣接リスト（1-indexed）
for _ in range(m):
    u, v = map(int, input().split())
    g[u].append(v)               # u -> v の有向辺

@lru_cache(maxsize=None)
def longest(v: int) -> int:
    """頂点 v から出発したときの最長経路長（辺の本数）。"""
    best = 0
    for nxt in g[v]:
        best = max(best, longest(nxt) + 1)  # 隣へ進んで +1 本
    return best

# どの頂点から始めてもよいので、全頂点の最大を取る
print(max(longest(v) for v in range(1, n + 1)))`}</Code>
      <p>
        <Cmd>longest(v)</Cmd> は各頂点についてキャッシュされるので、実際に評価されるのは 1 頂点あたり 1 回だけです。
        引数がイミュータブル（ここでは <Cmd>int</Cmd>）である必要がある点に注意してください（リストは渡せません）。
      </p>
      <SubSection>経路数え上げも同じ形</SubSection>
      <p>
        始点 s から終点 t までの経路が何通りあるかも、遷移を「和」に変えるだけで解けます。
      </p>
      <Code lang="python" filename="count_paths_memo.py">{`from functools import lru_cache

@lru_cache(maxsize=None)
def count_paths(v: int) -> int:
    """頂点 v から終点 t までの経路数。"""
    if v == t:
        return 1                  # 自分自身に到達 = 1 通り
    total = 0
    for nxt in g[v]:
        total += count_paths(nxt) # 各隣への経路数を合計
    return total

print(count_paths(s))`}</Code>
      <Callout variant="tip" title="dict で自前メモ化する場合">
        <Cmd>lru_cache</Cmd> が使えない状況（引数がリスト・複雑な状態など）では、辞書で自前管理します。
        <Cmd>{"memo = {}"}</Cmd> を用意し、関数の先頭で <Cmd>if v in memo: return memo[v]</Cmd>、
        末尾で <Cmd>memo[v] = 結果</Cmd> とすれば同じ効果が得られます。
      </Callout>

      <Section>Python 実装 — トポロジカル順の配列 DP</Section>
      <p>
        再帰上限や関数呼び出しのオーバーヘッドを避けたいときは、<strong>トポロジカルソートしてから配列でループ</strong>します。
        ここでは Kahn 法（入次数 0 の頂点から順に取り出す BFS 的手法）でトポロジカル順を作り、その順に <Cmd>dp</Cmd> を埋めます。
      </p>
      <Code lang="python" filename="longest_path_dp.py">{`import sys
from collections import deque
input = sys.stdin.readline

n, m = map(int, input().split())
g = [[] for _ in range(n + 1)]
indeg = [0] * (n + 1)            # 各頂点の入次数
for _ in range(m):
    u, v = map(int, input().split())
    g[u].append(v)
    indeg[v] += 1

# --- Kahn 法でトポロジカルソート ---
order = []
dq = deque(v for v in range(1, n + 1) if indeg[v] == 0)
while dq:
    v = dq.popleft()
    order.append(v)
    for nxt in g[v]:
        indeg[nxt] -= 1          # v を消したぶん入次数を減らす
        if indeg[nxt] == 0:      # 依存元が全部消えたら確定できる
            dq.append(nxt)

# 全頂点を並べ切れなければ循環がある（DAG ではない）
if len(order) != n:
    raise ValueError("グラフに閉路があります（DAG ではありません）")

# --- dp[v] = v を終点とする最長経路長 ---
dp = [0] * (n + 1)
for v in order:                  # トポロジカル順に前から確定
    for nxt in g[v]:
        dp[nxt] = max(dp[nxt], dp[v] + 1)  # v 経由で nxt を更新

print(max(dp))`}</Code>
      <p>
        ポイントは「<strong>order の前から処理すれば、dp[v] を使う時点で dp[v] は既に確定済み</strong>」という不変条件です。
        これはトポロジカル順序が保証してくれます。<Cmd>len(order) != n</Cmd> の判定は、
        そのまま<strong>閉路検出</strong>にもなっています（入次数 0 の頂点が尽きても未処理頂点が残る = 循環）。
      </p>
      <ComparisonTable
        headers={["観点", "メモ化再帰（lru_cache / dict）", "トポロジカル順の配列 DP"]}
        rows={[
          ["書きやすさ", "遷移をそのまま書ける（直感的）", "ソート工程が要る（やや手数）"],
          ["計算順序", "再帰が暗黙に依存先を先に解く", "トポロジカル順を陽に作る"],
          ["再帰上限", <>深いと <Cmd>RecursionError</Cmd> のリスク</>, "無し（ループなので安全）"],
          ["定数倍・速度", "関数呼び出しのぶん重め", "軽い（大きな N で有利）"],
          ["閉路検出", "無限再帰で気づきにくい", <><Cmd>len(order)!=n</Cmd> で明示検出</>],
        ]}
      />

      <Section>具体例・使いどころ</Section>
      <SubSection>最長経路（クリティカルパス）</SubSection>
      <p>
        工程 A が終わらないと工程 B を始められない、といった<strong>依存関係のあるタスクのスケジューリング</strong>で、
        「全体を終えるのに最低何工程（何日）かかるか」は DAG 上の最長経路そのものです。
        プロジェクト管理の<strong>クリティカルパス</strong>や、ビルドシステムの依存解決に現れます。
      </p>
      <SubSection>経路数え上げ・格子状の経路問題</SubSection>
      <p>
        「左上から右下まで、右か下にだけ進んで何通り？」という定番の格子問題も、
        マス目を頂点、移動を辺とみなせば DAG 上の経路数え上げです（右・下にしか進めない = 循環しない）。
        障害物マスを「辺を張らない」で表現すれば、そのまま応用できます。
      </p>
      <Code lang="python" filename="grid_paths.py">{`# H x W グリッド。'.' は通行可、'#' は障害物。左上→右下の経路数。
H, W = map(int, input().split())
grid = [input().rstrip() for _ in range(H)]

MOD = 10 ** 9 + 7
dp = [[0] * W for _ in range(H)]
dp[0][0] = 1 if grid[0][0] == '.' else 0

for i in range(H):
    for j in range(W):
        if grid[i][j] == '#':
            continue             # 障害物には入れない
        if i > 0:
            dp[i][j] += dp[i - 1][j]   # 上から来る
        if j > 0:
            dp[i][j] += dp[i][j - 1]   # 左から来る
        dp[i][j] %= MOD

print(dp[H - 1][W - 1])`}</Code>
      <p>
        二重ループ <Cmd>for i ... for j ...</Cmd> の順序が、実はこのグリッド DAG のトポロジカル順になっています
        （上・左が必ず先に確定する）。「DP のループ順 = トポロジカル順」だと気づくと、多くの DP が同じ枠組みで見えてきます。
      </p>

      <Section>落とし穴</Section>
      <Callout variant="danger" title="循環があると DP は成立しない">
        DAG でない（閉路を含む）グラフでは、部分問題が互いに依存し合い、計算順序が決められません。
        メモ化再帰では<strong>無限再帰</strong>に陥り、配列 DP では<strong>トポロジカルソートが全頂点を並べきれません</strong>。
        入力が本当に DAG か（あるいは無向グラフを誤って向き付けていないか）を必ず確認し、
        必要なら <Cmd>len(order) != n</Cmd> で閉路を検出してください。
      </Callout>
      <Callout variant="warn" title="再帰上限（RecursionError）">
        Python のデフォルト再帰上限は約 1000 です。頂点数が多く鎖状に深い DAG では、メモ化再帰が上限に達して
        <Cmd>RecursionError</Cmd> で落ちます。対策は 2 つ。
        <Cmd>sys.setrecursionlimit(10 ** 6)</Cmd> で上限を上げる（ただしスタックオーバーフローで強制終了する環境もある）か、
        <strong>配列 DP（ループ）へ書き換える</strong>のが確実です。競技では深い DAG は配列 DP が安全です。
      </Callout>
      <Callout variant="warn" title="遷移の向きと dp の定義を混同しない">
        「v から先の答え（後ろ向き集約）」と「v まで来る答え（前向き集約）」は別物です。
        前者はメモ化再帰と相性が良く、後者はトポロジカル順の前進更新と相性が良い、という対応があります。
        <strong>dp の定義</strong>を最初に一文で書き下し、それに合う<strong>ループ／再帰の向き</strong>を選ぶと事故が減ります。
      </Callout>

      <Bridge course="動的計画法 / グラフ理論">
        DP の理論的な足場は「<strong>最適部分構造</strong>（大きい問題の最適解が部分問題の最適解から作れる）」と
        「<strong>部分問題の重なり</strong>（同じ部分問題が何度も現れる）」の 2 つです。
        DAG は、この 2 つを<strong>グラフとして可視化</strong>したものだと言えます。頂点 = 部分問題、辺 = 依存、
        そして「循環しない = 半順序が定義できる = トポロジカルソートできる」という<strong>グラフ理論</strong>の性質が、
        計算順序の存在を保証します。逆に言えば「DP が書けるか」は「部分問題の依存グラフが DAG か」と同値であり、
        <strong>メモ化再帰は DAG の暗黙的な後行順（post-order）走査</strong>に相当します。
        この視点は、後続の最短経路（DAG 上の最短路も同じ枠組み）やフロー問題（残余グラフ上の探索）へそのままつながります。
      </Bridge>

      <Quiz
        question="ある問題を DP で解こうとしたら、部分問題 A の計算に B が、B の計算に A が必要でした。まず何を疑うべき？"
        options={[
          <>メモ化を <Cmd>lru_cache</Cmd> から <Cmd>dict</Cmd> に変えれば解決する</>,
          <>部分問題の依存グラフに<strong>閉路</strong>があり、そのままでは DP が成立しない（DAG ではない）</>,
          <>再帰上限を上げれば必ず解ける</>,
          <>トポロジカルソートを 2 回すればよい</>,
        ]}
        answer={1}
        explanation={
          <>
            A → B → A の相互依存は閉路そのもので、計算順序を決められません。DP の前提（依存が DAG）を満たしていないので、
            状態の取り方を変える・別アルゴリズム（例: 最短経路なら Dijkstra/Bellman-Ford）に切り替えるなどの見直しが必要です。
            メモ化の実装方法や再帰上限は本質的な解決になりません。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "DAG（有向非巡回グラフ）は「部分問題=頂点・依存=辺」とみなした DP の依存関係そのもの。循環が無い＝計算順序が一意に決まるから解ける",
          "計算量は O(V+E)。メモ化で各頂点をちょうど1回だけ計算し、素朴な再帰の指数爆発を線形に抑える",
          "メモ化再帰（lru_cache / dict）は遷移をそのまま書けて直感的。ただし深い DAG では RecursionError に注意（setrecursionlimit か配列 DP）",
          "トポロジカル順の配列 DP（Kahn 法）は再帰上限が無く定数倍も軽い。len(order)!=n はそのまま閉路検出になる",
          "最長経路（クリティカルパス）・経路数え上げ・格子経路が典型。DP のループ順は多くの場合トポロジカル順と一致する",
        ]}
      />
    </>
  );
}

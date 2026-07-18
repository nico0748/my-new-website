import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, ComparisonTable, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "grid-dijkstra",
  title: "グリッド版の最短経路（迷路・BFS/ダイクストラ）",
  description: "二次元グリッド（迷路）を「マス＝ノード、隣接4方向＝辺」とみなすと最短経路問題になる。全辺重み1なら BFS、コスト付きなら 0-1 BFS や heapq で解く。範囲チェック・訪問管理・4方向移動の実装を Python で網羅する。",
  domain: "kyopro",
  section: "shortest-path",
  order: 1,
  level: "basic",
  tags: ["最短経路", "グリッド", "BFS"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        競プロで頻出の「迷路の最短手数」は、実は<strong>グラフの最短経路問題</strong>そのものです。
        グリッド（二次元マス）を「<strong>1マス＝1ノード</strong>」「<strong>隣り合うマス＝辺</strong>」と読み替えれば、
        普通のグラフとして BFS やダイクストラで解けます。この記事では、その読み替え方と、
        <strong>4方向移動・範囲チェック・訪問管理</strong>という 3 点セットを Python 実装で身につけます。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール", val: "迷路をグラフとみなし、BFS（全辺重み1）と 0-1 BFS / heapq（コスト付き）で最短距離を求められる" },
          { key: "前提①", val: "collections.deque と heapq の基本的な使い方を知っている" },
          { key: "前提②", val: "BFS が「近い順（距離の小さい順）に広がる探索」だと理解している" },
          { key: "所要時間", val: "約18分" },
        ]}
      />

      <Section>概要 — グリッドはグラフである</Section>
      <p>
        次のような迷路を考えます。<Cmd>.</Cmd> が通れる道、<Cmd>#</Cmd> が壁で、左上 S から右下 G まで
        上下左右に 1 マスずつ動くとき、<strong>最小何手で着くか</strong>を求める問題です。
      </p>
      <Code lang="text" filename="迷路の例（H=4, W=5）">{`S . # . .
. . # . .
. . . . #
# . . . G`}</Code>
      <p>
        ここで発想を変えます。<strong>各マスをノード</strong>、<strong>隣り合う通行可能なマス同士を辺</strong>とみなすと、
        これは「S から G までの最短経路」というグラフ問題になります。マス <Cmd>(r, c)</Cmd>（行 r・列 c）から
        伸びる辺は、上 <Cmd>(r-1, c)</Cmd>・下 <Cmd>(r+1, c)</Cmd>・左 <Cmd>(r, c-1)</Cmd>・右 <Cmd>(r, c+1)</Cmd> の
        最大 4 本です。壁や盤外へは辺を張りません。
      </p>
      <StepFlow
        steps={[
          { title: "マスをノードに対応させる", desc: <>H×W マスなら最大 H×W 個のノード。座標 <Cmd>(r, c)</Cmd> がそのままノードの識別子になる。</> },
          { title: "隣接4マスを辺とみなす", desc: <>通行可能かつ盤内の隣マスへだけ辺を張る。全辺の「重み（コスト）」は問題設定しだい。</> },
          { title: "重みで手法を選ぶ", desc: <>全辺=1 なら BFS、辺が 0 か 1 なら 0-1 BFS、一般の非負なら heapq ダイクストラ。</> },
        ]}
        caption="グリッド最短経路の考え方 — 3ステップで普通のグラフに落とす"
      />

      <Section>計算量 — マス数 N = H×W が頂点数</Section>
      <p>
        頂点数は <Cmd>N = H×W</Cmd>、各マスの辺は最大 4 本なので辺数も <Cmd>O(N)</Cmd> 程度です。手法ごとの計算量は次のとおり。
      </p>
      <ComparisonTable
        headers={["手法", "辺の重み", "計算量", "データ構造"]}
        rows={[
          ["BFS", "すべて 1", <Cmd>O(H·W)</Cmd>, <>deque（両端キュー）</>],
          ["0-1 BFS", "0 か 1 のみ", <Cmd>O(H·W)</Cmd>, <>deque（0は先頭・1は末尾）</>],
          ["ダイクストラ", "非負（任意）", <Cmd>{"O(H·W·log(H·W))"}</Cmd>, <>heapq（優先度付きキュー）</>],
        ]}
      />
      <Callout variant="tip" title="まず BFS を疑う">
        「1手＝1コスト」で最短<strong>手数</strong>を聞かれたら、迷わず BFS です。log がつかない分、ダイクストラより速く実装も単純。
        コスト（時間・お金・体力など）が辺ごとに違うとき初めて 0-1 BFS やダイクストラを検討します。
      </Callout>

      <Section>仕組みとなぜ — 4方向移動・範囲チェック・訪問管理</Section>
      <SubSection>4方向移動は「差分ベクトル」で回す</SubSection>
      <p>
        上下左右の移動は、行・列の増分をまとめた <Cmd>{"[(-1,0),(1,0),(0,-1),(0,1)]"}</Cmd> を for で回すのが定石です。
        4つの if を並べるより短く、バグりにくく、8方向（斜め）へ拡張するときも差分を足すだけで済みます。
      </p>
      <SubSection>範囲チェックは「動いた後」に必ず行う</SubSection>
      <p>
        新しい座標 <Cmd>(nr, nc)</Cmd> が盤内か（<Cmd>{"0 <= nr < H かつ 0 <= nc < W"}</Cmd>）を、
        配列アクセスの<strong>前に</strong>確認します。これを怠ると <Cmd>IndexError</Cmd> か、
        Python では負のインデックスが「末尾からの参照」になってしまい、<strong>盤の反対側へワープする</strong>という
        気づきにくいバグになります。
      </p>
      <SubSection>訪問管理は「キューに入れる瞬間」に確定させる</SubSection>
      <p>
        BFS では、あるマスに初めて到達したときの距離がそのまま最短距離です。だから
        <strong>キューへ入れる時点で訪問済みにする</strong>のが鉄則。取り出す時に判定すると、同じマスが
        キューに何度も積まれて距離が上書きされ、計算量も膨れます。
      </p>

      <Section>Python 実装① — BFS（全辺重み1・最短手数）</Section>
      <p>
        最も基本の形です。<Cmd>dist</Cmd> を <Cmd>-1</Cmd>（未訪問）で初期化し、開始マスを 0 にして deque で近い順に広げます。
        <Cmd>dist</Cmd> が訪問済みフラグを兼ねる（<Cmd>-1</Cmd> 以外なら訪問済み）ので、別の visited 配列は要りません。
      </p>
      <Code lang="python" filename="bfs_grid.py">{`from collections import deque

def bfs_grid(grid, sr, sc):
    H = len(grid)
    W = len(grid[0])
    # dist[r][c]: 開始マスからの最短手数。-1 は未訪問
    dist = [[-1] * W for _ in range(H)]
    dist[sr][sc] = 0
    dq = deque([(sr, sc)])

    # 上下左右の移動ベクトル
    D = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while dq:
        r, c = dq.popleft()
        for dr, dc in D:
            nr, nc = r + dr, c + dc
            # 1) 範囲チェック（配列アクセスの前に必ず）
            if not (0 <= nr < H and 0 <= nc < W):
                continue
            # 2) 壁は通れない
            if grid[nr][nc] == "#":
                continue
            # 3) 訪問済み（すでに最短が確定）ならスキップ
            if dist[nr][nc] != -1:
                continue
            # 初到達＝最短。キューに入れる瞬間に距離を確定させる
            dist[nr][nc] = dist[r][c] + 1
            dq.append((nr, nc))

    return dist


# 使用例: S から G までの最短手数
grid = [
    list("S.#.."),
    list(".#.#."),
    list("...#."),
    list("#...G"),
]
# S と G の座標を探す
for i in range(len(grid)):
    for j in range(len(grid[0])):
        if grid[i][j] == "S":
            sr, sc = i, j
        if grid[i][j] == "G":
            gr, gc = i, j

dist = bfs_grid(grid, sr, sc)
print(dist[gr][gc])  # G までの最短手数（到達不能なら -1）`}</Code>
      <Callout variant="info" title="なぜ dist を visited 兼用にできるか">
        BFS は距離の小さい順に確定していくため、<Cmd>dist[nr][nc]</Cmd> が <Cmd>-1</Cmd> かどうかが
        「まだ来ていないか」の判定になります。フラグ配列を別に持たなくてよく、メモリと記述量が減ります。
      </Callout>

      <Section>Python 実装② — 0-1 BFS（辺の重みが 0 か 1）</Section>
      <p>
        「壁は 1 回だけ壊せる」「ある方向の移動はコスト 0、別の方向は 1」のように、
        <strong>辺の重みが 0 か 1 の 2 種類だけ</strong>のときは、ダイクストラより速い <strong>0-1 BFS</strong> が使えます。
        コスト 0 の辺は deque の<strong>先頭</strong>へ、コスト 1 の辺は<strong>末尾</strong>へ入れることで、
        優先度付きキューを使わずに最短距離を正しく求められます。
      </p>
      <Code lang="python" filename="zero_one_bfs.py">{`from collections import deque

def zero_one_bfs(grid, sr, sc):
    H = len(grid)
    W = len(grid[0])
    INF = float("inf")
    dist = [[INF] * W for _ in range(H)]
    dist[sr][sc] = 0
    dq = deque([(sr, sc)])

    D = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while dq:
        r, c = dq.popleft()
        # 取り出した後に最短が更新済みなら（古いエントリ）スキップ
        for dr, dc in D:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < H and 0 <= nc < W):
                continue
            # 例: 壁 '#' へ入るのはコスト1、道 '.' はコスト0
            w = 1 if grid[nr][nc] == "#" else 0
            nd = dist[r][c] + w
            if nd < dist[nr][nc]:
                dist[nr][nc] = nd
                if w == 0:
                    dq.appendleft((nr, nc))  # コスト0は先頭へ
                else:
                    dq.append((nr, nc))      # コスト1は末尾へ
    return dist`}</Code>
      <Callout variant="tip" title="0-1 BFS が成り立つ理由">
        deque の先頭は「距離が小さい未処理マス」に保たれます。コスト 0 の辺は距離を増やさないので先頭へ、
        コスト 1 は 1 増えるので末尾へ入れると、常に距離の昇順で取り出せます。heapq の log を省けるのが利点です。
      </Callout>

      <Section>Python 実装③ — heapq ダイクストラ（一般の非負コスト）</Section>
      <p>
        マスごとに「入るのに必要なコスト」が任意の非負整数（例: マスに書かれた数値の分だけ体力を消費）なら、
        <strong>ダイクストラ</strong>を使います。次の記事で本格的に扱いますが、グリッド版の骨格はこうです。
      </p>
      <Code lang="python" filename="dijkstra_grid.py">{`import heapq

def dijkstra_grid(cost, sr, sc):
    # cost[r][c]: そのマスに入るのに必要なコスト（非負）
    H = len(cost)
    W = len(cost[0])
    INF = float("inf")
    dist = [[INF] * W for _ in range(H)]
    dist[sr][sc] = 0
    pq = [(0, sr, sc)]  # (累計コスト, 行, 列)

    D = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while pq:
        d, r, c = heapq.heappop(pq)
        if d > dist[r][c]:
            continue  # 古い（確定済みより悪い）エントリは捨てる
        for dr, dc in D:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < H and 0 <= nc < W):
                continue
            nd = d + cost[nr][nc]
            if nd < dist[nr][nc]:
                dist[nr][nc] = nd
                heapq.heappush(pq, (nd, nr, nc))
    return dist`}</Code>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "最短手数の迷路", val: "S から G まで最小何手か → BFS。到達可能判定にも使える（dist が -1 なら不能）" },
          { key: "壁を k 回壊せる", val: "状態を (r, c, 壊した回数) に拡張して BFS / 0-1 BFS" },
          { key: "コスト付き移動", val: "マスごとに消費が違う → heapq ダイクストラ" },
          { key: "複数スタート", val: "全スタートを最初にキューへ入れる『多始点 BFS』で、最寄りの距離を一括計算" },
          { key: "8方向・ナイト移動", val: "移動ベクトル D を差し替えるだけで対応できる" },
        ]}
      />
      <p>
        経路そのもの（手順）を復元したいときは、各マスに<strong>「どこから来たか（親）」</strong>を記録しておき、
        G から S へ親をたどって逆順に並べます。距離だけでなく経路が必要な問題ではこの前処理を足します。
      </p>

      <Section>落とし穴</Section>
      <Callout variant="warn" title="範囲チェックと訪問管理でハマる典型">
        <ul>
          <li><strong>範囲外アクセス</strong>: 配列を触る前に <Cmd>{"0 <= nr < H and 0 <= nc < W"}</Cmd> を必ず確認。忘れると Python では負インデックスで盤の反対側を参照する静かなバグになる。</li>
          <li><strong>訪問判定の位置</strong>: BFS は<strong>キューへ入れる瞬間</strong>に訪問済みにする。取り出す時に判定すると同じマスが多重に積まれ、距離が壊れる。</li>
          <li><strong>行と列の取り違え</strong>: <Cmd>(r, c)</Cmd> は「行・列」。<Cmd>grid[r][c]</Cmd> の順序と、H（行数）・W（列数）の対応を最初に固定する。</li>
          <li><strong>スタート距離の初期化漏れ</strong>: <Cmd>dist[sr][sc] = 0</Cmd> を忘れると全マス未訪問のまま終わる。</li>
          <li><strong>BFS に重み付き辺を混ぜる</strong>: 辺の重みが 1 以外なら BFS では最短にならない。0/1 なら 0-1 BFS、一般なら heapq へ。</li>
        </ul>
      </Callout>

      <Bridge course="CS基礎 / グラフ理論・最短経路">
        迷路を解く行為は、グラフ理論の<strong>単一始点最短経路</strong>を、頂点が格子状に並んだ特殊なグラフに適用したものです。
        「全辺の重みが等しいグラフでは BFS が最短経路を与える」という定理がそのまま効いており、
        重みが一般化すると 0-1 BFS・ダイクストラへと連続的につながります。格子を明示的な隣接リストに変換せず
        <strong>座標計算で辺を暗黙に生成する</strong>のが、グリッド問題に特有のテクニックです。
      </Bridge>

      <Quiz
        question="全マスが道（重みは一律1）で、S から各マスへの最短手数を求めたい。最も適切な手法は？"
        options={[
          <>heapq を使ったダイクストラ（log つき）</>,
          <>deque を使った BFS（近い順に広げる）</>,
          <>全経路を再帰で全探索する DFS</>,
          <>ベルマンフォード法（全辺を V-1 回緩和）</>,
        ]}
        answer={1}
        explanation={<>全辺の重みが等しいなら BFS が最短を与え、<Cmd>O(H·W)</Cmd> で最速・最も単純です。log のつくダイクストラは重みが異なるとき、DFS は最短保証がなく、ベルマンフォードは負辺用でここでは過剰です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "グリッドは『マス＝ノード、隣接4方向＝辺』でグラフに読み替えられる",
          "全辺重み1（最短手数）は BFS で O(H·W)。dist を -1 初期化して visited 兼用にする",
          "3点セット: 4方向は差分ベクトルで回す / 範囲チェックは配列アクセス前 / 訪問はキュー投入時に確定",
          "辺が0か1なら 0-1 BFS（deque の先頭/末尾）、一般の非負なら heapq ダイクストラ",
          "経路復元は親マスを記録して G から逆にたどる。多始点は全スタートを最初にキューへ入れる",
        ]}
      />
    </>
  );
}

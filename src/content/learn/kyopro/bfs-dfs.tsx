import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain, StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "bfs-dfs",
  title: "幅優先探索(BFS) と 深さ優先探索(DFS)",
  description: "グラフ探索の二大基本、BFS と DFS。BFS は deque で辺の重みが 1 のときの最短ステップ数を求め、DFS は再帰またはスタックで到達可能な頂点をたどる。visited の管理（BFS はキュー投入時に確定）と計算量 O(V+E)、再帰上限の落とし穴までを Python 実装で網羅する。",
  domain: "kyopro",
  section: "graph",
  order: 2,
  level: "basic",
  tags: ["グラフ", "BFS", "DFS"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        グラフを「たどる」方法は大きく 2 つ。<strong>BFS（幅優先探索）</strong>は近い頂点から波紋のように広げ、
        <strong>DFS（深さ優先探索）</strong>は行けるところまで一本道で進んでから戻ります。
        どちらも計算量は <Cmd>O(V + E)</Cmd> で、連結性の判定・最短手数・全探索といった問題の土台になります。
        この記事では両方を Python で実装し、<strong>visited をいつ立てるか</strong>という肝と、再帰の落とし穴までを押さえます。
      </Lead>

      <Section>概要 — 広げる BFS、潜る DFS</Section>
      <p>
        BFS と DFS は「次にどの頂点へ進むか」の順番が違うだけで、どちらも<strong>訪問済み管理（visited）で二度訪問を防ぎ、
        隣接リストで隣をたどる</strong>点は共通です。違いは使うデータ構造に表れます。
      </p>
      <ComparisonTable
        headers={["観点", "BFS（幅優先）", "DFS（深さ優先）"]}
        rows={[
          ["進み方", "近い順に波状に広げる", "行けるだけ潜って戻る"]  ,
          ["データ構造", <>キュー <Cmd>deque</Cmd>（先入れ先出し）</>, <>スタック / 再帰（後入れ先出し）</>],
          ["得意なこと", <>重み 1 の<strong>最短ステップ数</strong></>, <>連結成分・閉路・トポロジカルソート等の<strong>応用</strong></>],
          ["計算量", <Cmd>O(V + E)</Cmd>, <Cmd>O(V + E)</Cmd>],
        ]}
      />
      <FlowChain
        nodes={[
          { label: "始点", sub: "dist=0", variant: "alt" },
          { label: "距離1の層", sub: "隣接" },
          { label: "距離2の層", sub: "隣の隣" },
          { label: "距離3の層", sub: "…", variant: "cta" },
        ]}
        caption="BFS は始点から同じ距離の頂点を層ごとに確定していく。だから最短ステップ数が求まる"
      />

      <Section>計算量 — どちらも O(V + E)</Section>
      <p>
        BFS も DFS も、<strong>各頂点を 1 回ずつ訪問</strong>し、<strong>各辺を（隣接リスト経由で）定数回ずつ走査</strong>します。
        したがって頂点 <Cmd>V</Cmd>・辺 <Cmd>E</Cmd> に対して <Cmd>O(V + E)</Cmd> です。visited で二度訪問を防ぐからこそ、
        この線形時間が保証されます（visited を怠ると同じ頂点を何度も処理して爆発します）。
      </p>

      <Section>仕組み・なぜ — BFS が最短になる理由と visited のタイミング</Section>
      <p>
        BFS は始点から<strong>距離 0 → 1 → 2 …</strong>と、近い頂点をすべて確定してから次の層へ進みます。
        重みがすべて 1 なら、ある頂点に<strong>初めて到達したときの距離が、そのまま最短距離</strong>になります。
        後からもっと短い経路が見つかることはありません（もっと近ければ先に到達しているはず）。
      </p>
      <Callout variant="info" title="肝 — BFS の visited はキュー投入時に立てる">
        BFS では、頂点をキューに<strong>入れた瞬間</strong>に訪問済みにします（<Cmd>dist</Cmd> を確定する）。
        取り出す時ではありません。取り出す時に立てると、同じ頂点が複数回キューに積まれ、距離が正しく最短にならなかったり
        計算量が悪化します。<strong>「入れる＝確定」</strong>と覚えます。
      </Callout>
      <StepFlow
        steps={[
          { title: "始点を入れる", desc: <><Cmd>dist[start]=0</Cmd> にしてキューへ。ここで訪問済み確定</> },
          { title: "先頭を取り出す", desc: <><Cmd>v = q.popleft()</Cmd> で、いちばん早く入った頂点を処理</> },
          { title: "未訪問の隣を確定して入れる", desc: <><Cmd>dist[nxt] = dist[v] + 1</Cmd> にしてキューへ</> },
          { title: "キューが空になるまで繰り返す", desc: <>近い層から順に距離が確定していく</> },
        ]}
        caption="BFS の 1 サイクル。未訪問（dist == -1）の隣だけを距離確定して積む"
      />

      <Section>Python 実装 — BFS</Section>
      <p>
        訪問済み配列を別に持たず、<strong>距離配列 <Cmd>dist</Cmd> の <Cmd>-1</Cmd> を「未訪問」の印</strong>に兼用するのが定石です。
        メモリと行数が減り、最短距離もそのまま得られます。
      </p>
      <Code lang="python" filename="BFS（重み 1 の最短ステップ数）">{`from collections import deque

def bfs(graph, start, n):
    dist = [-1] * n          # -1 = 未訪問。訪問時に最短距離を入れる
    dist[start] = 0
    q = deque([start])
    while q:
        v = q.popleft()      # 先頭（最も早く入った頂点）を取り出す
        for nxt in graph[v]:
            if dist[nxt] == -1:            # 未訪問なら
                dist[nxt] = dist[v] + 1    # 距離を確定
                q.append(nxt)              # キュー投入時に確定（重要）
    return dist              # dist[t] が start->t の最短ステップ数
`}</Code>
      <p>
        グリッド（迷路）の最短手数もこの形です。頂点を <Cmd>(行, 列)</Cmd> とみなし、上下左右の 4 方向を隣接として扱えば、
        同じ BFS で「スタートからゴールまでの最短移動数」が求まります。
      </p>

      <Section>Python 実装 — DFS（再帰版とスタック版）</Section>
      <p>
        DFS は<strong>再帰</strong>で書くと短く直感的です。ただし Python の再帰は既定で深さ約 1000 までしか許されないため、
        大きなグラフでは<strong>再帰上限を引き上げる</strong>か、<strong>明示的なスタック</strong>で書き換えます。
      </p>
      <Code lang="python" filename="DFS（再帰版）">{`import sys
sys.setrecursionlimit(10 ** 6)     # 再帰上限を引き上げる（DFS では必須級）

def dfs(graph, v, visited):
    visited[v] = True
    for nxt in graph[v]:
        if not visited[nxt]:
            dfs(graph, nxt, visited)   # 隣へ潜る

# 使い方
# visited = [False] * n
# dfs(graph, start, visited)
`}</Code>
      <p>
        深い再帰でも落ちないのが<strong>スタック版</strong>です。再帰呼び出しを自前のリスト（スタック）で置き換えます。
        <Cmd>pop()</Cmd> は末尾を取り出す（後入れ先出し）ので、これが「深さ優先」になります。
      </p>
      <Code lang="python" filename="DFS（明示スタック版・再帰なし）">{`def dfs_stack(graph, start, n):
    visited = [False] * n
    stack = [start]
    visited[start] = True          # 積むときに訪問済みにする
    while stack:
        v = stack.pop()            # 末尾を取り出す = 深さ優先
        for nxt in graph[v]:
            if not visited[nxt]:
                visited[nxt] = True
                stack.append(nxt)
    return visited
`}</Code>
      <Callout variant="tip" title="BFS と DFS の実装差はほぼ 1 行">
        キューの <Cmd>popleft()</Cmd>（先頭）を、スタックの <Cmd>pop()</Cmd>（末尾）に変えるだけで BFS が DFS になります。
        「先頭から取れば幅優先、末尾から取れば深さ優先」。データ構造の取り出し口が探索順を決めています。
      </Callout>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "連結性の判定", val: "始点から DFS/BFS して、全頂点を訪問できたか（visited が全 True か）で連結か判定" },
          { key: "最短手数（重み1）", val: "BFS。迷路・すごろく・最小手数のパズルなど" },
          { key: "全探索の骨組み", val: "DFS で状態空間木をたどる（順列・部分集合の列挙）" },
          { key: "領域の数え上げ", val: "グリッドの島（連結領域）の個数を、未訪問マスから BFS/DFS を起こして数える" },
        ]}
      />
      <p>
        「BFS か DFS か」は<strong>最短距離が要るかどうか</strong>で選ぶのが第一基準です。最短ステップ数が欲しいなら BFS 一択。
        単に「たどれるか・全部見るか」なら、実装が短い DFS でも構いません。
      </p>

      <Callout variant="warn" title="落とし穴 — 探索でハマる典型">
        <ul>
          <li><strong>再帰上限（RecursionError）</strong>：Python の既定は約 1000。数万頂点の DFS はすぐ超える。<Cmd>sys.setrecursionlimit(10 ** 6)</Cmd> を冒頭に置くか、スタック版に書き換える。</li>
          <li><strong>BFS の visited を取り出し時に立てる</strong>：同じ頂点が何度もキューに入り、距離が最短にならない・計算量が悪化する。必ず<strong>投入時</strong>に確定する。</li>
          <li><strong>visited を作らない</strong>：閉路のあるグラフで無限ループ、または指数的に遅くなる。</li>
          <li><strong>重み付きグラフに BFS</strong>：重みが 1 でないと BFS は最短にならない。その場合はダイクストラ等を使う。</li>
          <li><strong>グリッドの範囲外参照</strong>：上下左右へ動くとき、盤面の外に出ないか（<Cmd>0 &lt;= r &lt; H</Cmd> 等）を必ず確認する。</li>
        </ul>
      </Callout>

      <Bridge course="グラフ理論 / アルゴリズム（探索）">
        BFS と DFS は、講義の<strong>グラフ理論・アルゴリズム</strong>で最初に学ぶ「グラフ探索」です。
        両者が <Cmd>O(V+E)</Cmd> で全頂点・全辺を「ちょうど 1 回ずつ」処理できるのは、visited による枝刈りの効果です。
        BFS が最短性を持つのは<strong>「層ごとに距離が単調増加する」</strong>という性質から証明され、これは後で学ぶ
        <strong>ダイクストラ法</strong>（重み付きへの一般化）の直感的な出発点でもあります。
        DFS の「潜って戻る」構造は、連結成分・閉路検出・トポロジカルソートといった応用（次章）へ直結します。
      </Bridge>

      <Quiz
        question="始点からの「重み 1 の最短ステップ数」を求めたい。正しい方針は？"
        options={[
          <>DFS を使い、最初に着いた距離を記録する</>,
          <>BFS を使い、頂点を<strong>キューに入れた時</strong>に距離を確定する</>,
          <>BFS を使うが、距離は<strong>取り出した時</strong>に確定する</>,
          <>どちらでも最短になるので好きな方でよい</>,
        ]}
        answer={1}
        explanation={<>最短距離は BFS で求めます。近い層から確定するため、<strong>キュー投入時</strong>に距離を確定するのが正しく、初到達がそのまま最短になります。DFS は最短を保証しません。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "BFS=deque（先頭取り出し）で層状に広げ、重み 1 の最短ステップ数が求まる",
          "DFS=再帰 or スタック（末尾取り出し）で潜って戻る。連結性や全探索の骨組み",
          "どちらも O(V+E)。visited で二度訪問を防ぐから線形時間になる",
          "BFS の visited は「キュー投入時」に立てる。取り出し時ではない",
          "DFS の再帰は sys.setrecursionlimit を上げるか、明示スタックに書き換えて RecursionError を回避",
        ]}
      />
    </>
  );
}

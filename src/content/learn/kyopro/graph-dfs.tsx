import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain, StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "graph-dfs",
  title: "DFS の応用（連結成分・閉路・トポロジカルソート）",
  description: "DFS/BFS の基礎を前提に、実戦でよく問われる 4 つの応用を実装する。連結成分の数え上げ、閉路検出（無向は親方式、有向は 3 色 DFS）、DAG のトポロジカルソート、二部グラフ判定。それぞれ「何を追加で管理するか」を軸に Python 実装で整理する。",
  domain: "kyopro",
  section: "graph",
  order: 3,
  level: "basic",
  tags: ["グラフ", "DFS", "トポロジカルソート"],
  updated: "2026-07-07",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        BFS/DFS そのものはただ「たどる」だけですが、<strong>探索中に何を一緒に記録するか</strong>を変えると、
        いろいろな性質が読み取れます。この記事では前章の探索を土台に、実戦頻出の 4 応用
        <strong>——連結成分の数え上げ・閉路検出・トポロジカルソート・二部グラフ判定——</strong>を Python で実装します。
        どれも「基本の探索 + 少しの追加管理」でできる、という見取り図を持って読み進めてください。
      </Lead>

      <Section>概要 — 応用は「探索 + α の記録」</Section>
      <p>前章の DFS/BFS に、応用ごとに次の情報を足すだけで解けます。</p>
      <ComparisonTable
        headers={["応用", "追加で管理するもの", "判定の合図"]}
        rows={[
          ["連結成分数", "未訪問の頂点から探索を「起こした」回数", "起こした回数 = 成分数"],
          ["閉路検出（無向）", "どこから来たか（親）", "親以外の訪問済み隣接に出会う"],
          ["閉路検出（有向）", "頂点の 3 状態（白・灰・黒）", "探索中（灰）の頂点へ戻る辺"],
          ["トポロジカルソート", "DFS 帰りがけの順序", "帰りがけ順の逆が答え"],
          ["二部グラフ判定", "2 色の塗り分け", "同色どうしが隣接したら失敗"],
        ]}
      />

      <Section>連結成分の数え上げ</Section>
      <p>
        グラフが「いくつのかたまり（連結成分）に分かれているか」は、<strong>未訪問の頂点を見つけるたびに探索を起こし、
        その回数を数える</strong>だけで求まります。1 回の探索で 1 つのかたまりを塗り尽くすので、起こした回数がそのまま成分数です。
      </p>
      <StepFlow
        steps={[
          { title: "全頂点を順に見る", desc: <>頂点 <Cmd>0..n-1</Cmd> をループ</> },
          { title: "未訪問なら探索を起こす", desc: <>ここで成分カウントを <Cmd>+1</Cmd></> },
          { title: "その成分を塗り尽くす", desc: <>DFS/BFS で到達できる頂点を全部 visited に</> },
          { title: "ループ終了", desc: <>起こした回数 = 連結成分数</> },
        ]}
      />
      <Code lang="python" filename="連結成分数（スタック DFS）">{`def count_components(graph, n):
    visited = [False] * n
    count = 0
    for s in range(n):
        if visited[s]:
            continue
        count += 1                 # 新しいかたまりを 1 つ発見
        stack = [s]
        visited[s] = True
        while stack:
            v = stack.pop()
            for nxt in graph[v]:
                if not visited[nxt]:
                    visited[nxt] = True
                    stack.append(nxt)
    return count
`}</Code>
      <Callout variant="tip" title="Union-Find でも解ける">
        連結成分は <strong>Union-Find（素集合データ構造）</strong>でも数えられ、辺を足しながら判定する動的な問題ではそちらが有利です。
        静的なグラフを一度数えるだけなら、この DFS/BFS 版が最も手軽です。
      </Callout>

      <Section>閉路検出 — 無向グラフ（親方式）</Section>
      <p>
        無向グラフでは、DFS 中に<strong>「今来た辺の逆（親）ではない、すでに訪問済みの頂点」</strong>に出会ったら閉路があります。
        親を除外するのがポイントで、これを忘れると、行って戻るだけの 1 本の辺を閉路と誤検出します。
      </p>
      <Code lang="python" filename="無向グラフの閉路検出">{`def has_cycle_undirected(graph, n):
    visited = [False] * n
    for s in range(n):
        if visited[s]:
            continue
        stack = [(s, -1)]          # (頂点, その頂点へ来た親)
        visited[s] = True
        while stack:
            v, parent = stack.pop()
            for nxt in graph[v]:
                if not visited[nxt]:
                    visited[nxt] = True
                    stack.append((nxt, v))
                elif nxt != parent:      # 親以外の訪問済み = 閉路
                    return True
    return False
`}</Code>

      <Section>閉路検出 — 有向グラフ（3 色 DFS）</Section>
      <p>
        有向グラフの閉路検出は、頂点を <strong>白（未探索）・灰（探索中）・黒（探索完了）</strong>の 3 状態で管理します。
        DFS の途中で<strong>「灰（＝今たどっている経路上にある）」の頂点へ向かう辺</strong>を見つけたら、
        それは経路が自分自身に戻る<strong>戻り辺（back edge）</strong>で、閉路の証拠です。
      </p>
      <FlowChain
        nodes={[
          { label: "白", sub: "未探索", variant: "alt" },
          { label: "灰", sub: "探索中（経路上）" },
          { label: "黒", sub: "探索完了", variant: "cta" },
        ]}
        caption="灰の頂点へ向かう辺が見つかれば閉路。黒（完了済み）へ向かうのは閉路ではない"
      />
      <Code lang="python" filename="有向グラフの閉路検出（3 色 DFS）">{`import sys
sys.setrecursionlimit(10 ** 6)

WHITE, GRAY, BLACK = 0, 1, 2       # 未探索 / 探索中 / 探索完了

def has_cycle_directed(graph, n):
    color = [WHITE] * n

    def dfs(v):
        color[v] = GRAY            # 探索開始（経路上に乗せる）
        for nxt in graph[v]:
            if color[nxt] == GRAY:         # 経路上へ戻る辺 = 閉路
                return True
            if color[nxt] == WHITE and dfs(nxt):
                return True
        color[v] = BLACK           # この頂点の探索を完了
        return False

    return any(color[v] == WHITE and dfs(v) for v in range(n))
`}</Code>

      <Section>トポロジカルソート（DAG）</Section>
      <p>
        <strong>DAG（有向非巡回グラフ）</strong>は「依存関係」を表すのに使われ、
        「すべての辺 <Cmd>a → b</Cmd> について <Cmd>a</Cmd> が <Cmd>b</Cmd> より前に来る」並び順を<strong>トポロジカル順序</strong>と呼びます。
        授業の履修順、ビルドの依存解決、タスクの実行順などが典型例です。DFS の<strong>帰りがけ順（探索を終えた順）を逆にする</strong>と得られます。
      </p>
      <Code lang="python" filename="トポロジカルソート（DFS 帰りがけ）">{`import sys
sys.setrecursionlimit(10 ** 6)

def topological_sort(graph, n):
    visited = [False] * n
    order = []

    def dfs(v):
        visited[v] = True
        for nxt in graph[v]:
            if not visited[nxt]:
                dfs(nxt)
        order.append(v)            # 帰りがけ（子を全部処理し終えてから）追加

    for v in range(n):
        if not visited[v]:
            dfs(v)
    order.reverse()                # 逆順がトポロジカル順序
    return order
`}</Code>
      <Callout variant="info" title="Kahn 法（BFS 版）という選択肢">
        トポロジカルソートは、入次数 0 の頂点から順に取り除いていく <strong>Kahn 法（BFS 的な手法）</strong>でも実装できます。
        こちらは<strong>途中で入次数 0 の頂点が尽きたのに未処理が残る＝閉路がある</strong>ことを同時に検出できる利点があります。
        再帰の深さを気にせず書けるので、大きな DAG では Kahn 法が扱いやすいことも多いです。
      </Callout>

      <Section>二部グラフ判定（2 彩色）</Section>
      <p>
        <strong>二部グラフ</strong>は、頂点を 2 グループに分け「辺は必ず別グループ間を結ぶ」ように塗り分けられるグラフです。
        BFS/DFS で<strong>隣を必ず逆の色にしていき、途中で同色どうしが隣接したら二部でない</strong>と判定します。
        これは「奇数長の閉路を含まない」ことと同値です。
      </p>
      <Code lang="python" filename="二部グラフ判定（BFS 2 彩色）">{`from collections import deque

def is_bipartite(graph, n):
    color = [-1] * n               # -1 未着色, 0 / 1 の 2 色
    for s in range(n):
        if color[s] != -1:
            continue
        color[s] = 0
        q = deque([s])
        while q:
            v = q.popleft()
            for nxt in graph[v]:
                if color[nxt] == -1:
                    color[nxt] = color[v] ^ 1    # 隣は逆の色（XOR で反転）
                    q.append(nxt)
                elif color[nxt] == color[v]:     # 同色が隣接 = 二部でない
                    return False
    return True
`}</Code>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "連結成分数", val: "SNS の交友関係が何グループに分かれるか、グリッドの島の数" },
          { key: "無向の閉路検出", val: "全域木（サイクルを含まない）になっているかの確認" },
          { key: "有向の閉路検出", val: "デッドロック検出、依存関係に循環がないかのチェック" },
          { key: "トポロジカルソート", val: "履修の前提順序、ビルド順、タスクスケジューリング" },
          { key: "二部グラフ判定", val: "対戦相手の割り当て、2 グループ分けの可否、マッチング問題の前提" },
        ]}
      />

      <Callout variant="warn" title="落とし穴 — 応用ならではのミス">
        <ul>
          <li><strong>無向の閉路検出で親を除外し忘れる</strong>：<Cmd>nxt != parent</Cmd> を抜くと、1 本の辺を往復しただけで閉路と誤判定する。</li>
          <li><strong>有向で「黒」を閉路扱いする</strong>：閉路は<strong>灰（探索中）</strong>へ戻るときだけ。黒（完了済み）へ向かうのは合流であって閉路ではない。</li>
          <li><strong>トポロジカルソートに閉路がある</strong>：DAG 前提。閉路があると正しい順序は存在しない。Kahn 法なら未処理の残りで検出できる。</li>
          <li><strong>非連結を忘れる</strong>：連結成分・二部判定・トポロジカルソートは、全頂点をループで回して<strong>各連結成分ごとに</strong>探索を起こす。始点 1 個だけだと取りこぼす。</li>
          <li><strong>再帰の深さ</strong>：DFS 応用も <Cmd>sys.setrecursionlimit</Cmd> の引き上げ、または明示スタックを検討する。</li>
        </ul>
      </Callout>

      <Bridge course="グラフ理論">
        ここで扱った性質は、講義の<strong>グラフ理論</strong>の中心的な概念です。連結成分は<strong>連結性</strong>、閉路検出は<strong>木・全域木</strong>、
        トポロジカルソートは<strong>半順序と DAG</strong>、二部グラフ判定は<strong>彩色数（2 彩色可能性）と奇閉路</strong>——
        いずれも「探索木を作りながら、辺を木辺・戻り辺などに分類する」という DFS の理論（辺の分類）に根ざしています。
        実務でも依存解決・スケジューリング・割り当て問題として頻繁に現れます。
      </Bridge>

      <Quiz
        question="有向グラフの DFS 中、いま探索している経路上（灰色）の頂点へ向かう辺を見つけた。これは何を意味する？"
        options={[
          <>単なる合流で、問題ない</>,
          <>グラフに<strong>閉路（サイクル）</strong>がある</>,
          <>その頂点が孤立している</>,
          <>グラフが二部グラフである</>,
        ]}
        answer={1}
        explanation={<>探索中（灰）の頂点へ戻る辺は<strong>戻り辺</strong>で、経路が自分自身に戻る＝閉路の証拠です。すでに探索完了した黒の頂点へ向かう辺は閉路ではありません。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "応用は「基本の探索 + 少しの追加記録」。全頂点をループし連結成分ごとに探索を起こす",
          "連結成分数 = 未訪問から探索を起こした回数",
          "閉路検出：無向は親を除外、有向は白・灰・黒の 3 色で灰への戻り辺を探す",
          "トポロジカルソートは DFS 帰りがけ順の逆。閉路検出も兼ねたいなら Kahn 法",
          "二部グラフ判定は 2 色で隣を逆色に塗り、同色隣接で失敗。奇閉路がないことと同値",
        ]}
      />
    </>
  );
}

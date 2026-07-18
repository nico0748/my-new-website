import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, ComparisonTable, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "warshall-floyd",
  title: "ワーシャルフロイド法（全点対最短路）",
  description: "すべての頂点対（i, j）間の最短距離を一括で求める動的計画法。経由点 k を最外ループに置く3重ループで dp[i][j] を緩和する仕組み、O(V^3) の計算量、負辺への対応と dp[i][i] < 0 による負閉路検出、INF 初期化と対角0の実装を Python で網羅する。",
  domain: "kyopro",
  section: "shortest-path",
  order: 4,
  level: "practice",
  tags: ["最短経路", "全点対", "DP"],
  updated: "2026-07-07",
  minutes: 16,
};

export default function Article() {
  return (
    <>
      <Lead>
        これまでは「1 つの始点から全頂点へ」の最短経路でした。<strong>ワーシャルフロイド法</strong>は、
        <strong>すべての頂点対 (i, j) 間の最短距離を一気に</strong>求めます。
        コードはわずか<strong>3 重ループ</strong>。経由できる頂点を 1 つずつ増やしながら
        <Cmd>dp[i][j]</Cmd> を緩和していく動的計画法で、負辺も扱え、<Cmd>dp[i][i]</Cmd> が負になれば負閉路も検出できます。
        小さめのグラフで「全点間の距離表」が欲しいときの定番です。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール", val: "ワーシャルフロイドを空で書け、なぜ経由点 k を最外ループに置くのか・負閉路をどう検出するかを説明できる" },
          { key: "前提①", val: "隣接行列 dist[i][j] でグラフを表せる（辺がなければ INF、自分自身は 0）" },
          { key: "前提②", val: "最短経路の『緩和』の考え方を知っている（ダイクストラ/ベルマンフォードの章）" },
          { key: "所要時間", val: "約16分" },
        ]}
      />

      <Section>概要 — 全点対（All-Pairs）最短路</Section>
      <p>
        入力は<strong>隣接行列</strong> <Cmd>dist[i][j]</Cmd>（i から j への辺の重み。辺がなければ <Cmd>INF</Cmd>、
        <Cmd>dist[i][i]=0</Cmd>）。出力は同じ形の行列で、各 <Cmd>dist[i][j]</Cmd> が
        <strong>i から j への最短距離</strong>に置き換わります。1 回の実行で <Cmd>V²</Cmd> 通りの最短距離が
        まとめて求まるのが最大の特徴です。
      </p>
      <ComparisonTable
        headers={["手法", "求まるもの", "計算量", "負辺"]}
        rows={[
          [<>ダイクストラ ×V回</>, <>全点対（非負のみ）</>, <Cmd>{"O(V·(V+E) log V)"}</Cmd>, <>不可</>],
          [<>ベルマンフォード ×V回</>, <>全点対</>, <Cmd>O(V²·E)</Cmd>, <>可</>],
          [<>ワーシャルフロイド</>, <>全点対</>, <Cmd>O(V³)</Cmd>, <>可（負閉路も検出）</>],
        ]}
      />
      <Callout variant="tip" title="V が小さいなら迷わずこれ">
        頂点数 <Cmd>V</Cmd> が数百程度（<Cmd>V³</Cmd> が間に合う範囲）で「全頂点間の距離が欲しい」なら、
        実装がたった 3 行の 3 重ループで済むワーシャルフロイドが最も楽で確実です。
      </Callout>

      <Section>仕組みとなぜ — 経由点を1つずつ増やすDP</Section>
      <p>
        中心のアイデアは「<strong>使ってよい経由点の集合を少しずつ広げる</strong>」ことです。
        <Cmd>dp[i][j]</Cmd> を「頂点 <Cmd>0..k</Cmd> だけを中継に使ってよいときの i→j 最短距離」と定義します。
        新しく頂点 <Cmd>k</Cmd> を中継に使えるようにすると、i→j の経路は次の 2 択になります。
      </p>
      <StepFlow
        steps={[
          { title: "k を経由しない", desc: <>これまでどおり <Cmd>dp[i][j]</Cmd>（頂点 k-1 まででの最短）。</> },
          { title: "k を経由する", desc: <>i → k → j に分解。<Cmd>{"dp[i][k] + dp[k][j]"}</Cmd>。</> },
          { title: "短い方を採用（緩和）", desc: <><Cmd>{"dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])"}</Cmd> ですべての (i, j) を更新。</> },
        ]}
        caption="経由点 k を1つ解禁するたびに、全ペアを『k 経由 vs 非経由』で緩和する"
      />
      <SubSection>なぜ k を最外ループに置くのか（最重要）</SubSection>
      <p>
        3 重ループの順序は<strong>必ず k（経由点）を最外</strong>にします。理由は DP の定義にあります。
        <Cmd>dp[i][j]</Cmd> を更新するには、<strong>頂点 k を中継に使ってよい状態の <Cmd>dp[i][k]</Cmd> と <Cmd>dp[k][j]</Cmd></strong>が
        必要です。k を最外にすれば、「頂点 0..k-1 まで解禁済み」という状態が全ペアで揃った上で k を解禁でき、
        更新に使う値の整合性が保たれます。<strong>i や j を最外にすると</strong>、まだ k を経由していない古い値と
        新しい値が混ざり、正しい最短距離になりません。
      </p>

      <Section>計算量 — O(V³)</Section>
      <p>
        <Cmd>k, i, j</Cmd> がそれぞれ <Cmd>V</Cmd> 通りの 3 重ループなので <Cmd>O(V³)</Cmd>、
        メモリは隣接行列の <Cmd>O(V²)</Cmd>。辺の数に依存せず頂点数だけで決まります。
        <Cmd>V</Cmd> が 500 なら <Cmd>V³ ≈ 1.25 億</Cmd> でギリギリ、<Cmd>V</Cmd> が数千を超えると重くなるので、
        その規模で始点が少数なら「ダイクストラを必要な回数だけ」に切り替えます。
      </p>

      <Section>Python 実装 — 距離計算と負閉路検出</Section>
      <p>
        隣接行列 <Cmd>dist</Cmd> を<strong>その場で書き換える</strong>のが定石です。
        初期化では、辺がない所を <Cmd>INF</Cmd>、対角（自分自身）を <Cmd>0</Cmd> にするのが肝心。
      </p>
      <Code lang="python" filename="warshall_floyd.py">{`INF = float("inf")

def warshall_floyd(n, edges):
    # n: 頂点数, edges: [(u, v, w), ...]（有向・負辺可）
    # 1) 隣接行列を初期化
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0                       # 対角は 0（自分自身への距離）
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)      # 多重辺があれば最小を採用

    # 2) 経由点 k を最外ループにして緩和（順序が最重要）
    for k in range(n):
        for i in range(n):
            # i から k へ行けないなら、この i 行は k 経由できない（枝刈り）
            if dist[i][k] == INF:
                continue
            for j in range(n):
                if dist[k][j] == INF:
                    continue
                nd = dist[i][k] + dist[k][j]
                if nd < dist[i][j]:
                    dist[i][j] = nd

    return dist


def has_negative_cycle(dist):
    # dp[i][i] が負になった頂点があれば負閉路がある
    return any(dist[i][i] < 0 for i in range(len(dist)))


# 使用例
n = 4
edges = [(0, 1, 3), (1, 2, -2), (2, 3, 1), (0, 3, 10), (3, 1, 4)]
dist = warshall_floyd(n, edges)
for row in dist:
    print(row)
# 0->3 は 0->1->2->3 = 3-2+1 = 2 が最短
print(has_negative_cycle(dist))  # False`}</Code>
      <Callout variant="info" title="なぜ dp[i][i] < 0 が負閉路なのか">
        <Cmd>dist[i][i]</Cmd> は最初 0（自分自身）です。緩和後に <Cmd>dist[i][i]</Cmd> が負になったなら、
        i から出て i に戻る経路の総和が負、つまり <strong>i を含む負閉路</strong>が存在するということ。
        全対角を見れば負閉路の有無を <Cmd>O(V)</Cmd> で判定できます。
      </Callout>

      <Section>実装②（応用）— 経路復元つき</Section>
      <p>
        「i から j への最短経路の頂点列」も欲しいときは、緩和で更新した瞬間に
        <strong>「i→j の途中で最後に確定した中継点」</strong>を <Cmd>nxt[i][j]</Cmd> に記録し、再帰的にたどります。
      </p>
      <Code lang="python" filename="warshall_floyd_path.py">{`INF = float("inf")

def warshall_floyd_path(n, edges):
    dist = [[INF] * n for _ in range(n)]
    nxt = [[-1] * n for _ in range(n)]     # nxt[i][j]: i の次に進む頂点
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        if w < dist[u][v]:
            dist[u][v] = w
            nxt[u][v] = v

    for k in range(n):
        for i in range(n):
            if dist[i][k] == INF:
                continue
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    nxt[i][j] = nxt[i][k]  # i→k の最初の一歩を引き継ぐ

    return dist, nxt

def restore_path(nxt, i, j):
    if nxt[i][j] == -1:
        return []                          # 到達不能
    path = [i]
    while i != j:
        i = nxt[i][j]
        path.append(i)
    return path`}</Code>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "全頂点間の距離表", val: "『どの2都市間も最短距離を即答したい』ような全点対クエリ。前計算しておけば各問い合わせは O(1)" },
          { key: "小さいグラフ", val: "V が数百までなら O(V^3) で十分。実装が短く バグりにくい" },
          { key: "負辺を含む全点対", val: "ダイクストラが使えない負辺グラフでも、そのまま全点対が求まる" },
          { key: "負閉路の存在判定", val: "対角 dp[i][i] < 0 で検出。到達可能性の推移閉包（重みを 0/1 に）にも応用できる" },
          { key: "グラフの直径・中心", val: "全点対距離から、最も遠いペアの距離（直径）などを計算できる" },
        ]}
      />

      <Section>落とし穴</Section>
      <Callout variant="warn" title="ワーシャルフロイドでハマる典型">
        <ul>
          <li><strong>k を最外にしない</strong>: 最大の落とし穴。ループ順は必ず <Cmd>k → i → j</Cmd>。i や j を最外にすると誤った距離になる。</li>
          <li><strong>対角の初期化漏れ</strong>: <Cmd>dist[i][i] = 0</Cmd> を忘れると経路計算が壊れる。負閉路検出も対角が基準なので必須。</li>
          <li><strong>INF 経由の緩和</strong>: <Cmd>INF + INF</Cmd> や <Cmd>INF + w</Cmd> が別の値と衝突しないよう、<Cmd>float("inf")</Cmd> を使うか、<Cmd>dist[i][k]==INF</Cmd> を枝刈りする。整数 INF なら十分大きく取る。</li>
          <li><strong>多重辺の扱い</strong>: 同じ (u, v) に複数の辺があるなら <Cmd>min</Cmd> で最小を採用。上書きすると最短を取り逃す。</li>
          <li><strong>負閉路があるのに距離を信用</strong>: 負閉路があると一部の距離は意味を持たない。まず対角で検出する。</li>
          <li><strong>規模の見誤り</strong>: <Cmd>V</Cmd> が数千を超えると <Cmd>V³</Cmd> は間に合わない。始点が少数なら個別にダイクストラへ。</li>
        </ul>
      </Callout>

      <Bridge course="CS基礎 / 動的計画法・最短経路">
        ワーシャルフロイドは<strong>動的計画法</strong>の教科書的な例です。「経由してよい頂点集合を 0..k に広げる」という
        <strong>状態の段階的拡張</strong>で部分問題を組み上げ、各段で <Cmd>{"dp[i][j] = min(dp[i][j], dp[i][k]+dp[k][j])"}</Cmd> と
        更新します。k を最外ループにするのは、DP で<strong>依存する部分問題を先に解いておく</strong>という原則そのもの。
        同じ枠組みは、到達可能性を求める<strong>ワーシャルの推移閉包</strong>（重みを真偽の OR/AND に置換）へも一般化でき、
        「緩和を演算に差し替えれば別問題が解ける」という DP の柔軟さを示しています。
      </Bridge>

      <Quiz
        question="ワーシャルフロイドの3重ループで、ループ変数 k（経由点）・i・j の順序として正しいのは？"
        options={[
          <>i を最外、次に j、最内が k</>,
          <>k を最外、次に i、最内が j</>,
          <>j を最外、次に k、最内が i</>,
          <>順序はどれでも同じ結果になる</>,
        ]}
        answer={1}
        explanation={<>k（経由点）を必ず最外に置きます。そうすることで「頂点 0..k-1 まで解禁済み」の状態が全ペアで揃った上で k を解禁でき、更新に使う <Cmd>dp[i][k]</Cmd>・<Cmd>dp[k][j]</Cmd> の整合性が保たれます。i や j を最外にすると古い値と新しい値が混ざり誤答します。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "ワーシャルフロイド＝全頂点対 (i,j) の最短距離を一括で求める DP。1回で V^2 通りが揃う",
          "経由点 k を1つずつ解禁し dp[i][j] = min(dp[i][j], dp[i][k]+dp[k][j]) で緩和",
          "ループ順は必ず k→i→j（k を最外）。i/j を最外にすると誤答する — 最大の落とし穴",
          "計算量 O(V^3)・メモリ O(V^2)。負辺OK、対角 dp[i][i] < 0 で負閉路を検出",
          "初期化は INF（辺なし）＋対角0。多重辺は min。V が数百までなら最も手軽で確実",
        ]}
      />
    </>
  );
}

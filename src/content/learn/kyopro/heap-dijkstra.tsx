import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, ComparisonTable, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "heap-dijkstra",
  title: "ダイクストラ法（ヒープ）",
  description: "非負重みの単一始点最短経路をヒープ（優先度付きキュー）で高速に解く。heapq で『最小の未確定頂点』を取り出す仕組み、O((V+E)log V) の理由、dist 配列と古いエントリのスキップ（if d > dist[v]: continue）まで Python 実装で詳解する。",
  domain: "kyopro",
  section: "shortest-path",
  order: 2,
  level: "practice",
  tags: ["最短経路", "ダイクストラ", "ヒープ"],
  updated: "2026-07-07",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>ダイクストラ法</strong>は、辺の重みがすべて非負のグラフで、1つの始点から
        全頂点への<strong>最短距離</strong>を求める定番アルゴリズムです。鍵は
        <strong>ヒープ（優先度付きキュー）</strong>で「まだ確定していない頂点のうち、距離が最小のもの」を
        高速に取り出すこと。この記事では、その仕組み・計算量・実装の勘所（特に
        <Cmd>{"if d > dist[v]: continue"}</Cmd> の意味）を Python で徹底的に押さえます。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール", val: "heapq を使ったダイクストラを空で書け、なぜ最短が保証されるか・古いエントリをなぜ捨てるかを説明できる" },
          { key: "前提①", val: "隣接リストでグラフを表現できる（graph[u] = [(v, w), ...]）" },
          { key: "前提②", val: "heapq が最小値を O(log N) で push/pop する『最小ヒープ』だと知っている" },
          { key: "所要時間", val: "約20分" },
        ]}
      />

      <Section>概要 — 非負重みの単一始点最短経路</Section>
      <p>
        頂点集合 V・辺集合 E からなる重み付きグラフで、始点 <Cmd>s</Cmd> から各頂点 <Cmd>v</Cmd> への
        最短距離 <Cmd>dist[v]</Cmd> を求めます。前提は<strong>すべての辺の重みが 0 以上</strong>であること。
        この「非負」という条件が、ダイクストラの正しさを支えています（負辺があると使えません。次章のベルマンフォードへ）。
      </p>
      <p>
        基本方針は<strong>貪欲法</strong>です。「暫定距離が最小の未確定頂点を選ぶと、その距離はもう最短で確定できる」
        という性質を使い、確定した頂点から伸びる辺で隣を<strong>緩和（relaxation）</strong>していきます。
        緩和とは <Cmd>{"dist[v] = min(dist[v], dist[u] + w(u,v))"}</Cmd>、つまり「u 経由の方が近ければ更新する」操作です。
      </p>

      <Section>仕組みとなぜ — なぜヒープなのか</Section>
      <p>
        毎ステップで必要なのは「未確定頂点の中で <Cmd>dist</Cmd> が最小のもの」を見つけること。
        これを毎回すべての頂点から線形探索すると <Cmd>O(V)</Cmd> かかり、V 回繰り返して <Cmd>O(V²)</Cmd> になります。
        <strong>ヒープ（最小ヒープ）</strong>を使えば、この「最小の取り出し」が <Cmd>O(log V)</Cmd> で済むため、
        疎なグラフで劇的に速くなります。
      </p>
      <StepFlow
        steps={[
          { title: "始点を push", desc: <><Cmd>dist[s]=0</Cmd> とし、ヒープに <Cmd>(0, s)</Cmd> を入れる。他の頂点は <Cmd>INF</Cmd>。</> },
          { title: "最小を pop", desc: <>ヒープから <Cmd>(d, u)</Cmd> を取り出す。d は「u までの暫定距離」。これが未確定なら u をここで確定。</> },
          { title: "古ければ捨てる", desc: <><Cmd>{"d > dist[u]"}</Cmd> なら、すでにもっと良い距離が確定済みの『古いエントリ』。処理せず次へ。</> },
          { title: "隣を緩和して push", desc: <>u の各隣 v について <Cmd>{"dist[u]+w < dist[v]"}</Cmd> なら更新し、<Cmd>(new, v)</Cmd> をヒープへ。</> },
          { title: "ヒープが空まで繰り返す", desc: <>取り出す距離は常に単調非減少。確定した頂点の距離は二度と変わらない。</> },
        ]}
        caption="ヒープ・ダイクストラの1サイクル — pop → 古さ判定 → 緩和 → push"
      />
      <SubSection>なぜ最小を確定してよいのか（貪欲の正しさ）</SubSection>
      <p>
        重みが非負なので、いま暫定距離が最小の頂点 u に、あとから別経路でより短く到達することはありません。
        別経路は必ずどこかの未確定頂点を通り、その頂点の距離は u 以上なので、そこから先へ辺（非負）を足しても
        u より短くはならないからです。この論法が成り立つのは<strong>非負</strong>だからで、負辺があると崩れます。
      </p>
      <SubSection>「確定済みフラグ」の代わりに古いエントリを捨てる</SubSection>
      <p>
        Python の <Cmd>heapq</Cmd> には要素の優先度を後から下げる操作（decrease-key）がありません。そこで実務的には、
        緩和のたびに<strong>新しい (距離, 頂点) を push し、同じ頂点の古いエントリはヒープに残したまま</strong>にします。
        取り出したときに <Cmd>{"d > dist[u]"}</Cmd>（＝すでに確定した距離より悪い）なら、それは用済みの古いエントリなので
        <Cmd>continue</Cmd> で捨てます。これがダイクストラ実装で最も重要な一行です。
      </p>

      <Section>計算量 — O((V + E) log V)</Section>
      <p>
        各辺の緩和で最大 1 回 push が起きるので、ヒープに入る要素数は <Cmd>O(V + E)</Cmd>。
        push/pop はそれぞれ <Cmd>O(log)</Cmd>（ヒープサイズは高々 <Cmd>O(E)</Cmd> なので <Cmd>log E = O(log V)</Cmd>）。
        よって全体で <Cmd>O((V + E) log V)</Cmd> です。
      </p>
      <ComparisonTable
        headers={["実装", "計算量", "向いている状況"]}
        rows={[
          [<>ヒープ版（heapq）</>, <Cmd>O((V+E) log V)</Cmd>, <>疎なグラフ（E ≪ V²）。競プロの標準</>],
          [<>配列版（線形探索）</>, <Cmd>O(V²)</Cmd>, <>密なグラフ（E ≈ V²）や V が小さいとき</>],
        ]}
      />
      <Callout variant="info" title="ヒープに古いエントリが溜まっても平気">
        同じ頂点のエントリが複数入っても、push 総数は辺数で抑えられ、古いものは pop 時に <Cmd>O(1)</Cmd> で捨てられます。
        だから全体の計算量は増えません。「消さずに捨てる」設計が Python では最も素直で速い書き方です。
      </Callout>

      <Section>Python 実装 — heapq ダイクストラ</Section>
      <p>
        隣接リスト <Cmd>{"graph[u] = [(v, w), ...]"}</Cmd> を入力に、始点 <Cmd>s</Cmd> からの <Cmd>dist</Cmd> を返します。
        <strong>ヒープには (距離, 頂点) のタプル</strong>を入れるのがコツ。タプルは第1要素（距離）で自動的に比較されるので、
        最小距離のエントリが先頭に来ます。
      </p>
      <Code lang="python" filename="dijkstra.py">{`import heapq

def dijkstra(n, graph, s):
    # n: 頂点数, graph[u] = [(v, w), ...] は隣接リスト（w >= 0）
    INF = float("inf")
    dist = [INF] * n
    dist[s] = 0
    pq = [(0, s)]  # (暫定距離, 頂点)。距離で自動ソートされる

    while pq:
        d, u = heapq.heappop(pq)      # 最小の暫定距離を取り出す
        if d > dist[u]:
            continue                  # 古いエントリ（確定済みより悪い）は捨てる
        # ここに来た時点で u の最短距離が確定
        for v, w in graph[u]:
            nd = d + w                # u 経由で v へ行く距離
            if nd < dist[v]:          # 緩和: より短ければ更新
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    return dist


# 使用例
# 5頂点、辺: 0->1(4), 0->2(1), 2->1(2), 1->3(1), 2->3(5)
n = 5
edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)]
graph = [[] for _ in range(n)]
for u, v, w in edges:
    graph[u].append((v, w))   # 有向。無向なら graph[v].append((u, w)) も追加

dist = dijkstra(n, graph, 0)
print(dist)  # [0, 3, 1, 4, inf]  (頂点4へは到達不能)`}</Code>
      <Callout variant="tip" title="経路も欲しいとき — prev 配列で復元">
        緩和して <Cmd>dist[v]</Cmd> を更新するとき、同時に <Cmd>prev[v] = u</Cmd>（v の直前の頂点）を記録します。
        終点から <Cmd>prev</Cmd> をたどって逆順に並べ、最後に反転すれば最短経路そのものが得られます。
      </Callout>

      <Section>実装②（応用）— 経路復元つき</Section>
      <Code lang="python" filename="dijkstra_path.py">{`import heapq

def dijkstra_with_path(n, graph, s, t):
    INF = float("inf")
    dist = [INF] * n
    prev = [-1] * n           # 各頂点の直前の頂点（経路復元用）
    dist[s] = 0
    pq = [(0, s)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                prev[v] = u
                heapq.heappush(pq, (nd, v))

    if dist[t] == INF:
        return INF, []        # t へ到達できない

    # t から s へ prev をたどり、反転して最短経路にする
    path = []
    cur = t
    while cur != -1:
        path.append(cur)
        cur = prev[cur]
    path.reverse()
    return dist[t], path`}</Code>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "道路・路線の最短時間", val: "辺の重み＝所要時間や距離。カーナビ的な最短ルート探索の基礎" },
          { key: "グリッドのコスト付き移動", val: "マスごとに消費が違う迷路。座標を頂点番号に変換して同じ実装で解ける" },
          { key: "拡張ダイクストラ", val: "頂点を (場所, 残り燃料) 等に拡張し、状態空間上で最短を求める" },
          { key: "最小コスト到達", val: "料金・体力・危険度など『非負で足し合わさるコスト』の最小化全般" },
        ]}
      />

      <Section>落とし穴</Section>
      <Callout variant="warn" title="ダイクストラでハマる典型">
        <ul>
          <li><strong>負辺は不可</strong>: 1本でも負の重みがあると貪欲の前提が崩れ、誤った最短距離を返す。負辺があるならベルマンフォード（次章）へ。</li>
          <li><strong>古いエントリのスキップ忘れ</strong>: <Cmd>{"if d > dist[u]: continue"}</Cmd> を書かないと、確定済み頂点を無駄に再展開して遅くなる（結果は正しくても TLE の原因）。</li>
          <li><strong>取り出す前に確定扱いする</strong>: 確定は<strong>pop して古さ判定を通った後</strong>。push した時点では暫定にすぎない。</li>
          <li><strong>タプルの順序ミス</strong>: ヒープには <Cmd>(距離, 頂点)</Cmd> の順で入れる。<Cmd>(頂点, 距離)</Cmd> にすると頂点番号でソートされてしまう。</li>
          <li><strong>無向グラフの辺の入れ忘れ</strong>: 無向なら両方向 <Cmd>graph[u].append((v,w))</Cmd> と <Cmd>graph[v].append((u,w))</Cmd> を張る。</li>
          <li><strong>INF での加算オーバー</strong>: <Cmd>float("inf")</Cmd> なら安全だが、大きな整数を INF に使うと <Cmd>INF + w</Cmd> が別の値と衝突しないよう十分大きく取る。</li>
        </ul>
      </Callout>

      <Bridge course="CS基礎 / データ構造（ヒープ）・貪欲法">
        ダイクストラは<strong>貪欲法</strong>の代表例です。「いま最小の未確定頂点を確定する」という局所最適の選択が、
        辺が非負という条件下では全体最適（真の最短距離）に一致します。その貪欲を高速に回すために
        <strong>優先度付きキュー＝二分ヒープ</strong>を用い、最小要素の取得を <Cmd>O(log V)</Cmd> に落としています。
        「アルゴリズム（貪欲）」と「データ構造（ヒープ）」の組み合わせで計算量が決まるという、
        両者の相互作用を体感できる好例です。
      </Bridge>

      <Quiz
        question="heapq ダイクストラで pop した (d, u) が d > dist[u] を満たすとき、正しい対応は？"
        options={[
          <><Cmd>dist[u] = d</Cmd> に更新してから隣を緩和する</>,
          <>この頂点は最短が未確定なので即座に確定させる</>,
          <><Cmd>continue</Cmd> で処理をスキップする（古いエントリだから）</>,
          <>ヒープ全体を作り直してやり直す</>,
        ]}
        answer={2}
        explanation={<><Cmd>{"d > dist[u]"}</Cmd> は「すでにもっと短い距離が確定済み」を意味する古いエントリです。decrease-key の代わりに push を重ねる方式の副産物なので、そのまま <Cmd>continue</Cmd> で捨てるのが正解です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "ダイクストラ＝非負重みの単一始点最短経路。貪欲に『最小の未確定頂点』を確定していく",
          "ヒープ（heapq）で最小取り出しを O(log V) にし、全体 O((V+E) log V)",
          "ヒープには (距離, 頂点) のタプルを入れる。距離で自動ソートされる",
          "最重要の一行 if d > dist[u]: continue —— 古いエントリを捨てる（Python に decrease-key がないため）",
          "負辺があると使えない（→ ベルマンフォード）。経路は prev 配列で終点から逆にたどって復元",
        ]}
      />
    </>
  );
}

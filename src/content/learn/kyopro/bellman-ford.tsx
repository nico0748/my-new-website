import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, ComparisonTable, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "bellman-ford",
  title: "ベルマンフォード法",
  description: "負の辺を含むグラフでも使える単一始点最短経路アルゴリズム。すべての辺を V-1 回緩和すれば最短が求まる理由、V 回目でも更新が起きたら負閉路と判定できる仕組み、O(VE) の計算量、ダイクストラとの使い分けを Python 実装で網羅する。",
  domain: "kyopro",
  section: "shortest-path",
  order: 3,
  level: "practice",
  tags: ["最短経路", "負辺", "動的計画法"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        ダイクストラは速いですが、<strong>負の辺（マイナスの重み）</strong>があると使えません。
        そこで登場するのが<strong>ベルマンフォード法</strong>です。すべての辺を <Cmd>V-1</Cmd> 回<strong>緩和</strong>するだけで
        最短距離が求まり、さらに <Cmd>V</Cmd> 回目でも更新が起きれば<strong>負閉路（無限に短くできる輪）</strong>を検出できます。
        遅い代わりに守備範囲が広い、という位置づけを実装とともに理解します。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール", val: "ベルマンフォードを書け、なぜ V-1 回で足りるか・V 回目の更新が負閉路を意味する理由を説明できる" },
          { key: "前提①", val: "辺リスト edges = [(u, v, w), ...] でグラフを表せる" },
          { key: "前提②", val: "『緩和 relaxation』= dist[v] を dist[u]+w でより小さく更新する操作、を知っている" },
          { key: "所要時間", val: "約18分" },
        ]}
      />

      <Section>概要 — 負辺OKの単一始点最短経路</Section>
      <p>
        ベルマンフォードは、始点 <Cmd>s</Cmd> から全頂点への最短距離を求めます。ダイクストラとの決定的な違いは
        <strong>辺の重みが負でもよい</strong>こと。ただし<strong>負閉路</strong>（一周すると距離の合計が負になる閉路）が
        始点から到達可能な位置にあると、そこを回り続けることで距離が <Cmd>-∞</Cmd> へ発散し「最短」が定義できません。
        ベルマンフォードはこの負閉路の<strong>存在検出まで</strong>できるのが強みです。
      </p>
      <ComparisonTable
        headers={["観点", "ダイクストラ", "ベルマンフォード"]}
        rows={[
          ["負の辺", <>不可</>, <>可</>],
          ["負閉路の検出", <>できない</>, <>できる</>],
          ["計算量", <Cmd>O((V+E) log V)</Cmd>, <Cmd>O(V·E)</Cmd>],
          ["データ構造", <>ヒープ（優先度付きキュー）</>, <>辺リストだけ（単純な二重ループ）</>],
          ["考え方", <>貪欲法</>, <>動的計画法（緩和の繰り返し）</>],
        ]}
      />

      <Section>仕組みとなぜ — V-1 回の緩和で足りる理由</Section>
      <p>
        中心となる操作は<strong>緩和</strong>です。辺 <Cmd>(u, v, w)</Cmd> について
        <Cmd>{"dist[u] + w < dist[v]"}</Cmd> なら <Cmd>{"dist[v] = dist[u] + w"}</Cmd> に更新します。
        これを<strong>すべての辺に対して 1 巡</strong>行うのを 1 ラウンドと呼びます。
      </p>
      <StepFlow
        steps={[
          { title: "初期化", desc: <><Cmd>dist[s]=0</Cmd>、他は <Cmd>INF</Cmd>。</> },
          { title: "全辺を1巡 緩和（1ラウンド）", desc: <>この 1 巡で「辺を 1 本多く使った最短経路」が少なくとも1頂点分 確定していく。</> },
          { title: "V-1 ラウンド繰り返す", desc: <>最短経路は（負閉路がなければ）辺を高々 V-1 本しか使わない。だから V-1 ラウンドで全頂点が最短に到達する。</> },
          { title: "V ラウンド目で検査", desc: <>もう更新が起きないはず。それでも更新できたら、始点から届く負閉路が存在する。</> },
        ]}
        caption="ベルマンフォードの流れ — 全辺を V-1 回緩和し、V 回目で負閉路を検査"
      />
      <SubSection>なぜ V-1 回で最短が確定するのか</SubSection>
      <p>
        負閉路がなければ、最短経路は同じ頂点を二度通りません（通ればその輪を取り除いた方が短いか同じ）。
        頂点数 <Cmd>V</Cmd> のグラフで同じ頂点を通らない経路は、辺を高々 <Cmd>V-1</Cmd> 本しか使えません。
        1 ラウンドで「経路の 1 本目の辺」が、次のラウンドで「2 本目」が…と、辺の本数分だけ最短が前進していくので、
        <strong>V-1 ラウンド</strong>あれば、どんな最短経路も最後の辺まで確定します。これは
        「辺を k 本まで使った最短距離」を段階的に更新する<strong>動的計画法</strong>そのものです。
      </p>
      <SubSection>なぜ V 回目の更新が負閉路を意味するのか</SubSection>
      <p>
        負閉路がなければ V-1 ラウンドで全頂点が最短に到達し、それ以上緩和しても<strong>もう更新は起きません</strong>。
        逆に <Cmd>V</Cmd> 回目のラウンドでまだ距離を短くできる頂点があるなら、それは「回るほど短くなる」経路、
        すなわち<strong>始点から到達可能な負閉路</strong>が存在する証拠です。
      </p>

      <Section>計算量 — O(V·E)</Section>
      <p>
        <Cmd>V-1</Cmd> ラウンド、各ラウンドで <Cmd>E</Cmd> 本すべての辺を見るので <Cmd>O(V·E)</Cmd>。
        ダイクストラの <Cmd>O((V+E) log V)</Cmd> より遅いですが、実装は辺リストを二重ループするだけで単純明快です。
        頂点・辺が数千程度までなら十分間に合います。
      </p>

      <Section>Python 実装 — 距離計算と負閉路検出</Section>
      <p>
        辺リスト <Cmd>{"edges = [(u, v, w), ...]"}</Cmd> を入力に、始点からの <Cmd>dist</Cmd> を返します。
        V 回目で更新が起きたら負閉路ありとして特別な値を返す形にしています。
      </p>
      <Code lang="python" filename="bellman_ford.py">{`def bellman_ford(n, edges, s):
    # n: 頂点数, edges: [(u, v, w), ...]（有向・w は負でも可）, s: 始点
    INF = float("inf")
    dist = [INF] * n
    dist[s] = 0

    # V-1 = n-1 ラウンド緩和する
    for i in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] == INF:
                continue                 # まだ届いていない頂点は基点にできない
            if dist[u] + w < dist[v]:    # 緩和
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break                        # 更新がなければ早期終了（もう最短が確定）

    # n 回目の緩和で更新が起きれば、始点から届く負閉路がある
    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] == INF:
            continue
        if dist[u] + w < dist[v]:
            has_negative_cycle = True
            break

    return dist, has_negative_cycle


# 使用例
# 頂点4, 辺: 0->1(1), 1->2(-3), 2->3(2), 0->3(5)
n = 4
edges = [(0, 1, 1), (1, 2, -3), (2, 3, 2), (0, 3, 5)]
dist, neg = bellman_ford(n, edges, 0)
print(dist)  # [0, 1, -2, 0]  (0->1->2->3 が最短で 1-3+2=0)
print(neg)   # False  (負閉路なし)`}</Code>
      <Callout variant="tip" title="早期終了で速くする">
        あるラウンドで一度も更新が起きなければ、以降も絶対に更新は起きません。<Cmd>updated</Cmd> フラグで
        <Cmd>break</Cmd> すれば、実際のグラフでは <Cmd>V-1</Cmd> 回に達する前に終わることが多く、平均的に高速化できます。
      </Callout>

      <Section>実装②（応用）— どの頂点が -∞ になるか特定する</Section>
      <p>
        負閉路が「ある/ない」だけでなく、<strong>どの頂点の最短距離が -∞ に発散するか</strong>を知りたいことがあります。
        負閉路検出のラウンドで更新された頂点を <Cmd>-INF</Cmd> 印にし、もう <Cmd>n-1</Cmd> ラウンド伝播させると、
        負閉路の影響を受ける全頂点を特定できます。
      </p>
      <Code lang="python" filename="bellman_ford_neg.py">{`def bellman_ford_neg(n, edges, s):
    INF = float("inf")
    dist = [INF] * n
    dist[s] = 0

    # 1回目: 通常の V-1 ラウンド
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w

    # 2回目: さらに n-1 ラウンド緩和し、更新される頂点を -INF に伝播
    negative = [False] * n
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] == INF:
                continue
            if dist[u] + w < dist[v] or negative[u]:
                dist[v] = -INF
                negative[v] = True

    # dist[v] == -INF の頂点は最短距離が定義できない
    return dist`}</Code>

      <Section>具体例・使いどころ — ダイクストラとの使い分け</Section>
      <p>
        判断基準はただ一つ、<strong>負の辺があるかどうか</strong>です。
      </p>
      <KVList
        items={[
          { key: "負辺がない → ダイクストラ", val: "非負なら圧倒的に速い O((V+E) log V)。まずこちらを検討する" },
          { key: "負辺がある → ベルマンフォード", val: "『割引で得をする移動』『儲かる為替の連鎖』などコストが負になり得る問題" },
          { key: "負閉路の有無を判定したい", val: "為替裁定（アービトラージ）が存在するか等。V 回目の更新で検出" },
          { key: "辺の本数に制限がある最短路", val: "『高々 k 本の辺で行ける最短』は k ラウンドだけ緩和すれば直接求まる" },
        ]}
      />
      <Callout variant="info" title="為替の裁定取引（負閉路の典型応用）">
        通貨の交換レートの積が 1 を超える閉路（一周すると資産が増える）は、対数を取って符号反転すると
        <strong>負閉路</strong>になります。ベルマンフォードの負閉路検出は、こうした「回り続けると無限に得をする」構造を
        見つける道具として使えます。
      </Callout>

      <Section>落とし穴</Section>
      <Callout variant="warn" title="ベルマンフォードでハマる典型">
        <ul>
          <li><strong>INF を基点に緩和してしまう</strong>: <Cmd>dist[u] == INF</Cmd> の頂点から緩和すると <Cmd>INF + w</Cmd> が別頂点を誤更新する。緩和前に <Cmd>if dist[u] == INF: continue</Cmd> を必ず入れる。</li>
          <li><strong>ラウンド数の取り違え</strong>: 緩和は <Cmd>V-1</Cmd> 回。負閉路検査はその後の <Cmd>V</Cmd> 回目。1つずれると誤検出・検出漏れになる。</li>
          <li><strong>負閉路があるのに距離を信用する</strong>: 負閉路があるとき、影響を受ける頂点の <Cmd>dist</Cmd> は最短ではない。まず検出を優先する。</li>
          <li><strong>ダイクストラに負辺を渡す</strong>: 逆パターン。負辺があるグラフでダイクストラを使うと静かに誤答する。負辺を見たらベルマンフォードへ。</li>
          <li><strong>無向グラフの負辺</strong>: 無向グラフに負辺があると、その辺を往復するだけで負閉路になる。問題設定を確認する。</li>
        </ul>
      </Callout>

      <Bridge course="CS基礎 / 最短経路・動的計画法">
        ベルマンフォードは<strong>動的計画法</strong>として理解できます。「辺を高々 k 本使ったときの最短距離」を
        <Cmd>dp[k][v]</Cmd> と置くと、1 ラウンドの全辺緩和が <Cmd>k</Cmd> から <Cmd>k+1</Cmd> への遷移に対応し、
        <Cmd>V-1</Cmd> ラウンドで最終解に達します。ダイクストラが<strong>貪欲法</strong>で局所最適を積み上げるのに対し、
        ベルマンフォードは<strong>段階的な緩和</strong>で全体を底上げする——同じ最短経路問題を、
        アルゴリズム設計の 2 大パラダイム（貪欲 vs DP）から解く好対照になっています。
      </Bridge>

      <Quiz
        question="頂点数 V のグラフでベルマンフォードを実行するとき、V 回目のラウンドでも距離が更新できた。これが意味するのは？"
        options={[
          <>まだ最短が確定していないので、さらに緩和を続ければよい</>,
          <>始点から到達可能な負閉路が存在する</>,
          <>グラフに孤立した頂点がある</>,
          <>実装にバグがあり、ダイクストラを使うべき</>,
        ]}
        answer={1}
        explanation={<>負閉路がなければ最短経路は辺を高々 V-1 本しか使わず、V-1 ラウンドで全頂点が確定します。V 回目でも更新できるのは「回るほど短くなる」経路＝始点から届く負閉路がある証拠です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "ベルマンフォード＝負辺OKの単一始点最短経路。辺リストを V-1 回 全緩和する",
          "V-1 回で足りる理由: 負閉路がなければ最短経路は辺を高々 V-1 本しか使わない（＝辺の本数を段階更新する DP）",
          "V 回目でも更新できたら、始点から到達可能な負閉路が存在する（最短が -∞ に発散）",
          "計算量 O(V·E)。ダイクストラより遅いが辺リストの二重ループだけで単純。INF 基点の緩和は禁止",
          "使い分け: 負辺なし→ダイクストラ、負辺あり/負閉路検出→ベルマンフォード",
        ]}
      />
    </>
  );
}

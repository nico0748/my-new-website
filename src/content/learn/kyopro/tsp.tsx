import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain, StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "tsp",
  title: "巡回セールスマン問題（TSP）",
  description: "全都市をちょうど 1 回ずつ訪れて出発点に戻る、最小コストの巡回路を求める NP 困難問題。訪問済み集合をビットで持つ bit DP（dp[S][v]=集合 S を訪問済みで現在 v の最小コスト）で O(2^N·N^2) に落とす方法を、O(N!) の順列全探索と比較しながら Python 実装で学ぶ。",
  domain: "kyopro",
  section: "graph",
  order: 5,
  level: "practice",
  tags: ["グラフ", "TSP", "bitDP"],
  updated: "2026-07-07",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>巡回セールスマン問題（TSP）</strong>は、「全都市をちょうど 1 回ずつ訪れ、出発点に戻る」経路のうち
        <strong>総移動コストが最小</strong>のものを求める、最適化の代名詞のような問題です。前章のハミルトン閉路にコスト最小化を足したもので、
        一般には<strong>NP 困難</strong>。素朴な全探索は <Cmd>O(N!)</Cmd> で即座に破綻しますが、
        <strong>訪問済み集合をビットで持つ bit DP</strong> を使うと <Cmd>{"O(2^N · N^2)"}</Cmd> まで落ち、<Cmd>N</Cmd> が 16 程度までは現実的に解けます。
      </Lead>

      <Section>概要 — 全都市を一巡りする最小コスト</Section>
      <p>
        都市間の移動コストが行列 <Cmd>dist[i][j]</Cmd> で与えられ、出発点（都市 0 とする）から出て<strong>すべての都市を 1 回ずつ</strong>訪問し、
        最後に出発点へ戻る巡回路の総コストを最小化します。ハミルトン閉路の「存在」ではなく「最小コスト」を問う点が TSP の特徴です。
      </p>
      <FlowChain
        nodes={[
          { label: "都市0", sub: "出発", variant: "alt" },
          { label: "都市を巡る", sub: "全部 1 回ずつ" },
          { label: "都市0", sub: "帰還", variant: "cta" },
        ]}
        caption="出発点を固定し、残りの都市を回り切って戻る。その総コストを最小化する"
      />

      <Section>計算量 — N! の壁を 2^N に落とす</Section>
      <ComparisonTable
        headers={["手法", "計算量", "現実的な N", "考え方"]}
        rows={[
          ["順列全探索", <Cmd>O(N!)</Cmd>, "〜10 程度", "訪問順を全通り試す"],
          ["bit DP", <Cmd>{"O(2^N · N^2)"}</Cmd>, "〜16 程度", "訪問済み集合ごとに最小コストを再利用"],
        ]}
      />
      <p>
        <Cmd>O(N!)</Cmd> は <Cmd>N=13</Cmd> で 60 億超と手に負えなくなります。bit DP の <Cmd>{"2^N · N^2"}</Cmd> は
        <Cmd>N=16</Cmd> でも約 <Cmd>{"1.6 × 10^7"}</Cmd> 程度で、はるかに現実的です。指数関数どうしでも <Cmd>{"2^N"}</Cmd> は
        <Cmd>N!</Cmd> よりずっと緩やかに増えるのがポイントです。
      </p>

      <Section>仕組み・なぜ — 「集合」を状態にすると重複計算が消える</Section>
      <p>
        全探索が遅いのは、<strong>同じ「訪問済みの集合＋現在地」に至る経路を何度も別物として数え直す</strong>からです。
        たとえば <Cmd>{"0→1→2"}</Cmd> と <Cmd>{"0→2→1"}</Cmd> は訪問順こそ違っても、
        「<strong>{"{0,1,2}"} を訪問済みで、いま都市 2 にいる</strong>」という<strong>状態</strong>としては、そこから先の最適な回り方が共通です。
        そこで<strong>「訪問済み集合 <Cmd>S</Cmd> と現在地 <Cmd>v</Cmd>」を状態にまとめ、最小コストだけを覚えておけば</strong>、
        以降の計算を使い回せます。これが動的計画法（DP）の発想です。
      </p>
      <Callout variant="info" title="集合を整数のビットで表す（bit DP）">
        訪問済み集合 <Cmd>S</Cmd> を <Cmd>N</Cmd> ビットの整数で表現します。第 <Cmd>i</Cmd> ビットが 1 なら「都市 <Cmd>i</Cmd> を訪問済み」。
        <Cmd>{"S >> u & 1"}</Cmd> でビット確認、<Cmd>{"S | (1 << u)"}</Cmd> で都市 <Cmd>u</Cmd> を集合に追加、
        <Cmd>(1 &lt;&lt; n) - 1</Cmd> で「全都市訪問済み」を表せます。集合演算を整数の高速なビット演算で行うのがミソです。
      </Callout>
      <p>
        状態 <Cmd>dp[S][v]</Cmd> を<strong>「集合 <Cmd>S</Cmd> の都市を訪問済みで、いま都市 <Cmd>v</Cmd> にいるときの最小コスト」</strong>と定義します。
        初期状態は「都市 0 だけ訪問済み・現在地 0・コスト 0」。遷移は「未訪問の都市 <Cmd>u</Cmd> へ移動して <Cmd>u</Cmd> を集合に加える」です。
      </p>
      <StepFlow
        steps={[
          { title: "初期化", desc: <><Cmd>dp[{"{0}"}][0] = 0</Cmd>。他は無限大（INF）</> },
          { title: "集合 S を小さい順に走査", desc: <>S の各ビットが訪問済みの都市</> },
          { title: "現在地 v から未訪問 u へ遷移", desc: <><Cmd>dp[S|1&lt;&lt;u][u]</Cmd> を <Cmd>dp[S][v] + dist[v][u]</Cmd> で更新</> },
          { title: "全訪問後に出発点へ戻る", desc: <><Cmd>dp[full][v] + dist[v][0]</Cmd> の最小が答え</> },
        ]}
        caption="小さい集合から大きい集合へ埋めていくと、各状態は一度だけ計算される"
      />

      <Section>Python 実装 — bit DP</Section>
      <p>
        集合 <Cmd>S</Cmd> を <Cmd>0</Cmd> から <Cmd>{"2^N - 1"}</Cmd> まで昇順に回すと、
        「小さい集合の答えを使って大きい集合を埋める」順序が自然に守られます（<Cmd>S | (1 &lt;&lt; u)</Cmd> は必ず <Cmd>S</Cmd> より大きい）。
      </p>
      <Code lang="python" filename="TSP を bit DP で解く">{`INF = float("inf")

def tsp(dist, n):
    # dist[i][j]: 都市 i から j への移動コスト
    # dp[S][v]: 都市 0 を出発し、集合 S を訪問済みで、現在地が v のときの最小コスト
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0                     # 集合 {0}（=2進で 1）, 現在地 0, コスト 0

    for S in range(1 << n):
        for v in range(n):
            if dp[S][v] == INF:
                continue             # この状態には到達不能
            for u in range(n):
                if S >> u & 1:
                    continue         # u はすでに訪問済み。スキップ
                nS = S | (1 << u)    # u を訪問済みに加えた集合
                cost = dp[S][v] + dist[v][u]
                if cost < dp[nS][u]:
                    dp[nS][u] = cost # より安ければ更新

    full = (1 << n) - 1              # 全都市を訪問した集合
    # 全訪問後、各終点 v から出発点 0 へ戻るコストを足して最小を取る
    return min(dp[full][v] + dist[v][0] for v in range(n))
`}</Code>
      <Callout variant="tip" title="経路そのものを復元するには">
        最小コストだけでなく<strong>実際の巡回順</strong>が欲しいときは、各 <Cmd>dp[nS][u]</Cmd> を更新した際に
        「どの <Cmd>v</Cmd> から来たか」を <Cmd>parent[nS][u] = v</Cmd> に記録し、最後に <Cmd>full</Cmd> から逆にたどります。
        DP は「最小値を求める」と「その経路を復元する」を分けて考えると整理しやすくなります。
      </Callout>

      <Section>Python 実装 — 順列全探索（比較用）</Section>
      <p>
        <Cmd>N</Cmd> がごく小さいときは、出発点 0 を固定して<strong>残りの都市の並び順を全通り</strong>試すのが最も素直です。
        正しさの確認（bit DP のテスト）にも使えます。
      </p>
      <Code lang="python" filename="TSP を順列全探索で解く（O(N!)）">{`from itertools import permutations

def tsp_brute(dist, n):
    best = INF
    for perm in permutations(range(1, n)):     # 都市 0 を固定、残りを全通り
        route = [0] + list(perm) + [0]         # 0 から出て 0 に戻る
        cost = sum(dist[route[i]][route[i + 1]] for i in range(len(route) - 1))
        best = min(best, cost)
    return best
`}</Code>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "配送・物流", val: "1 台の車で複数拠点を回る配送ルートの最小化（現実の宅配・巡回点検）" },
          { key: "製造・基板", val: "ドリルやレーザーが多数の穴・点を最短で回る加工順の最適化" },
          { key: "競プロ頻出", val: "N が 15 前後に制限された「全部回る最短」系。制約 N ≦ 16 を見たら bit DP を疑う" },
          { key: "近似・大規模", val: "N が大きい実務では厳密解を諦め、近傍探索・遺伝的アルゴリズム等の近似解法を使う" },
        ]}
      />
      <p>
        <strong>問題文に <Cmd>N ≦ 16</Cmd> 前後の小さな制約</strong>があり、「全部の地点を回る最小コスト」を問われたら、
        まず bit DP を思い出すのが定石です。逆に <Cmd>N</Cmd> が数千・数万なら厳密解は現実的でなく、近似解法に切り替えます。
      </p>

      <Callout variant="warn" title="落とし穴 — TSP 実装でつまずく点">
        <ul>
          <li><strong>初期化の勘違い</strong>：<Cmd>dp[1][0] = 0</Cmd>（集合 {"{0}"}・現在地 0）だけを 0 にする。全体を 0 で埋めると全状態が到達可能扱いになり誤答。</li>
          <li><strong>出発点への帰還を忘れる</strong>：巡回（閉路）なので、最後に <Cmd>+ dist[v][0]</Cmd> を足す。単なる経路（戻らない）なら足さない。問題文を要確認。</li>
          <li><strong>N が大きすぎる</strong>：<Cmd>{"2^N"}</Cmd> のメモリと時間。<Cmd>N=20</Cmd> で <Cmd>{"2^20 ≈ 100 万"}</Cmd> 状態 × N とかなり重い。制約を必ず見る。</li>
          <li><strong>非対称・到達不能</strong>：<Cmd>dist[i][j] != dist[j][i]</Cmd>（一方通行）や、辺がない箇所は <Cmd>INF</Cmd> にする。INF 同士の加算でオーバーフローしないよう <Cmd>float("inf")</Cmd> を使う。</li>
          <li><strong>集合を回す順序</strong>：<Cmd>S</Cmd> を昇順に回すこと。降順だと未計算の状態を参照してしまう。</li>
        </ul>
      </Callout>

      <Bridge course="計算複雑性理論（NP 困難） / 動的計画法">
        TSP は<strong>NP 困難</strong>問題の代表格で、講義の<strong>計算複雑性理論</strong>で必ず登場します。
        素朴には <Cmd>O(N!)</Cmd> ですが、<strong>動的計画法</strong>で「訪問済み集合」を状態にまとめると <Cmd>{"O(2^N · N^2)"}</Cmd> まで下がります
        （これは Held-Karp アルゴリズムとして知られる古典です）。それでも指数時間からは逃れられません——
        NP 困難な問題を多項式時間で解く方法は見つかっておらず、ここに<strong>P vs NP 問題</strong>が横たわります。
        「厳密に解けないなら近似で妥協する」という発想（近似アルゴリズム・メタヒューリスティクス）も、この問題を入り口に学びます。
      </Bridge>

      <Quiz
        question={<>TSP の bit DP で <Cmd>dp[S][v]</Cmd> は何を表す？</>}
        options={[
          <>都市 v から都市 S までの距離</>,
          <>集合 S の都市を訪問済みで、現在地が v のときの<strong>最小コスト</strong></>,
          <>都市 v を S 回訪問したコスト</>,
          <>訪問順が S 番目で現在地 v の経路数</>,
        ]}
        answer={1}
        explanation={<>S は「訪問済みの都市集合」をビットで、v は「現在いる都市」を表します。dp[S][v] はその状態に至る最小コストで、状態を共有することで O(N!) の全探索を O(2^N·N^2) に落とします。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "TSP=全都市を 1 回ずつ訪れ出発点に戻る最小コスト巡回。NP 困難",
          "訪問済み集合 S を N ビット整数で表す bit DP が定石（Held-Karp）",
          "dp[S][v]=集合 S 訪問済みで現在 v の最小コスト。計算量 O(2^N·N^2)、N≦16 程度が目安",
          "初期化は dp[{0}][0]=0 のみ。最後に +dist[v][0] で出発点へ戻る",
          "全探索 O(N!) は N=13 で破綻。制約 N≦16 前後を見たら bit DP を疑う",
        ]}
      />
    </>
  );
}

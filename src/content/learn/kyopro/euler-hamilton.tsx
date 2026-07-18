import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "euler-hamilton",
  title: "オイラー路とハミルトン路",
  description: "「すべての辺を 1 回ずつ通る」オイラー路と、「すべての頂点を 1 回ずつ通る」ハミルトン路。名前は似ているが難易度は正反対で、前者は次数を数えるだけで判定でき（Hierholzer 法で構成）、後者は NP 困難でbit DP や全探索が要る。辺 vs 頂点・易しい vs 難しいの対比を Python 実装で体感する。",
  domain: "kyopro",
  section: "graph",
  order: 4,
  level: "practice",
  tags: ["グラフ", "オイラー路", "ハミルトン路"],
  updated: "2026-07-07",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        「一筆書き」の問題には 2 系統あります。<strong>オイラー路</strong>は<strong>すべての辺</strong>を 1 回ずつ通る道、
        <strong>ハミルトン路</strong>は<strong>すべての頂点</strong>を 1 回ずつ通る道です。名前も定義もそっくりですが、
        <strong>難しさは正反対</strong>——オイラー路は次数を数えるだけで存在判定でき（多項式時間）、
        ハミルトン路は一般に<strong>NP 困難</strong>で効率的な判定法が知られていません。この「辺 vs 頂点」「易しい vs 難しい」の対比が本記事の核心です。
      </Lead>

      <Section>概要 — 辺の一筆書き（オイラー） vs 頂点の一巡り（ハミルトン）</Section>
      <ComparisonTable
        headers={["観点", "オイラー路", "ハミルトン路"]}
        rows={[
          ["何を 1 回ずつ通る", <><strong>すべての辺</strong></>, <><strong>すべての頂点</strong></>],
          ["判定", <>次数を数えるだけ <Cmd>O(V + E)</Cmd></>, <>一般に効率的な判定法なし（<strong>NP 困難</strong>）</>],
          ["構成アルゴリズム", <>Hierholzer 法 <Cmd>O(E)</Cmd></>, <>bit DP <Cmd>{"O(2^N · N^2)"}</Cmd> / 全探索 <Cmd>O(N!)</Cmd></>],
          ["直感", "一筆書きの可否", "全都市を一度ずつ回れるか（TSP の兄弟）"],
        ]}
      />
      <FlowChain
        nodes={[
          { label: "オイラー", sub: "辺を全部", variant: "alt" },
          { label: "= 易しい", sub: "次数で判定" },
          { label: "ハミルトン", sub: "頂点を全部" },
          { label: "= 難しい", sub: "NP 困難", variant: "cta" },
        ]}
        caption="対象が「辺」か「頂点」かの違いだけで、計算の難しさは天と地ほど変わる"
      />

      <Section>オイラー路 — 次数だけで存在判定できる</Section>
      <p>
        オイラーの定理により、<strong>連結な無向グラフ</strong>で辺の一筆書き（オイラー路）が存在する条件は、
        <strong>奇数次数（奇数本の辺が出ている）の頂点が 0 個か 2 個</strong>のときだけ、と非常に単純です。
      </p>
      <KVList
        items={[
          { key: "オイラー閉路（始点=終点）", val: "奇数次数の頂点が 0 個。どの頂点から始めても元に戻る一筆書きができる" },
          { key: "オイラー路（始点≠終点）", val: "奇数次数の頂点がちょうど 2 個。その 2 頂点が始点と終点になる" },
          { key: "存在しない", val: "奇数次数の頂点が 4 個以上、または連結でない（辺のある部分がつながっていない）" },
        ]}
      />
      <p>
        なぜ次数で決まるのか。一筆書きで通過点に「入って出る」たびに辺を 2 本使うので、途中の頂点は必ず<strong>偶数次数</strong>になります。
        奇数次数が許されるのは<strong>始点と終点だけ</strong>（片方は出るだけ、片方は入るだけ）。だから奇数次数は 0 個か 2 個、というわけです。
      </p>
      <Code lang="python" filename="オイラー路の存在判定（連結を仮定）">{`def euler_path_exists(graph, n):
    # graph: 無向グラフの隣接リスト（連結であることを前提）
    odd = sum(1 for v in range(n) if len(graph[v]) % 2 == 1)
    return odd == 0 or odd == 2      # 0 個=閉路, 2 個=始点≠終点の路
`}</Code>

      <SubSection>Hierholzer 法 — 実際の経路を構成する</SubSection>
      <p>
        存在するだけでなく<strong>経路そのもの</strong>が欲しいときは <strong>Hierholzer 法</strong>を使います。
        「行き止まりまで辺を使い切りながら進み、戻る途中で未使用の枝道があればそちらへ潜る」という操作をスタックで回し、
        <strong>行き止まりになった頂点から順に経路へ積む（最後に反転）</strong>と、全辺を 1 回ずつ通る道が得られます。計算量は <Cmd>O(E)</Cmd> です。
      </p>
      <Code lang="python" filename="Hierholzer 法（有向グラフ版・概略）">{`from collections import defaultdict, deque

def hierholzer(adj, start):
    # adj[v]: 頂点 v から出る辺の相手を並べた deque（有向グラフ）
    # 使った辺は popleft で取り除いていく
    stack = [start]
    path = []
    while stack:
        v = stack[-1]
        if adj[v]:                   # まだ使える辺がある
            u = adj[v].popleft()     # 辺 v -> u を消費
            stack.append(u)          # u へ潜る
        else:                        # 行き止まり
            path.append(stack.pop()) # 帰りがけに経路へ積む
    path.reverse()                   # 逆順が実際の通り道
    return path                      # 辺を 1 回ずつ通る頂点列
`}</Code>
      <Callout variant="info" title="無向グラフに適用するとき">
        無向グラフでは辺 <Cmd>(u, v)</Cmd> を使ったら<strong>両方向とも「使用済み」</strong>にする必要があります。
        辺に ID を振って <Cmd>used[edge_id]</Cmd> で管理するか、隣接リストから相手側の対応する辺も取り除く実装にします。
        考え方（スタックで潜り、行き止まりから積む）は上と同じです。
      </Callout>

      <Section>ハミルトン路 — 頂点を全部 1 回ずつは NP 困難</Section>
      <p>
        一方、<strong>すべての頂点</strong>を 1 回ずつ通るハミルトン路には、次数のような簡単な判定条件が<strong>ありません</strong>。
        存在判定は <strong>NP 完全</strong>で、頂点数 <Cmd>N</Cmd> が大きいと現実的に解けなくなります。
        競プロでは <Cmd>N</Cmd> が小さい（おおむね 16 程度まで）ことを前提に、<strong>bit DP</strong> か<strong>全探索</strong>で解きます。
      </p>
      <SubSection>bit DP — 訪問済み集合を整数のビットで持つ</SubSection>
      <p>
        肝は<strong>「どの頂点を訪問済みか」を <Cmd>N</Cmd> ビットの整数 <Cmd>S</Cmd> で表す</strong>ことです。
        <Cmd>dp[S][v]</Cmd> を「集合 <Cmd>S</Cmd> の頂点を訪問済みで、いま頂点 <Cmd>v</Cmd> にいる経路が存在するか」と定義すると、
        状態数 <Cmd>{"2^N · N"}</Cmd>・遷移 <Cmd>N</Cmd> で全体 <Cmd>{"O(2^N · N^2)"}</Cmd> になります。
      </p>
      <Code lang="python" filename="ハミルトン路の存在判定（bit DP）">{`def hamilton_path_exists(adj, n):
    # adj[u][v] が True なら辺 u-v あり（隣接行列）
    # dp[S][v]: 集合 S を訪問済みで、末尾（現在地）が v の経路が作れるか
    dp = [[False] * n for _ in range(1 << n)]
    for v in range(n):
        dp[1 << v][v] = True                 # 頂点 v 単独から始める

    for S in range(1 << n):
        for v in range(n):
            if not dp[S][v]:
                continue
            for u in range(n):
                if adj[v][u] and not (S >> u & 1):   # u が未訪問で辺がある
                    dp[S | (1 << u)][u] = True       # u を訪問済みに足す

    full = (1 << n) - 1                       # 全頂点を訪問した集合
    return any(dp[full][v] for v in range(n))
`}</Code>
      <SubSection>全探索（permutations）— N がごく小さいとき</SubSection>
      <p>
        <Cmd>N</Cmd> が 10 程度までなら、頂点の並び順を全通り試す<strong>順列全探索</strong>でも足ります。実装は最短ですが
        <Cmd>O(N!)</Cmd> なので、<Cmd>N=11</Cmd> で約 4000 万、<Cmd>N=13</Cmd> で 60 億超と急速に破綻します。
      </p>
      <Code lang="python" filename="ハミルトン路の存在判定（順列全探索）">{`from itertools import permutations

def hamilton_brute(adj, n):
    for perm in permutations(range(n)):      # 頂点の並びを全通り試す
        if all(adj[perm[i]][perm[i + 1]] for i in range(n - 1)):
            return True                       # 連続する 2 頂点が全て辺でつながる
    return False
`}</Code>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "オイラー路", val: "一筆書きパズル、道路(辺)を全部通る配達・除雪ルート（中国人郵便配達問題の基礎）" },
          { key: "オイラー閉路", val: "ゲノムアセンブリの de Bruijn グラフ、全辺を巡って出発点に戻る巡回" },
          { key: "ハミルトン路", val: "全地点(頂点)を一度ずつ訪れる経路、TSP（次章）の存在判定版" },
          { key: "難易度の勘所", val: "「辺を全部」なら易しい・「頂点を全部」なら難しい、と最初に見分ける" },
        ]}
      />

      <Callout variant="warn" title="落とし穴 — 混同と適用範囲">
        <ul>
          <li><strong>オイラーとハミルトンの取り違え</strong>：「辺を全部」か「頂点を全部」かを最初に確認。判定の難しさが根本から違う。</li>
          <li><strong>連結性の見落とし</strong>：オイラー路は「奇数次数 0/2」に加えて<strong>辺のある頂点が連結</strong>が必要。孤立部分があると一筆書きできない。</li>
          <li><strong>孤立頂点の扱い</strong>：次数 0 の頂点は「辺の一筆書き」には無関係。連結性を見るとき辺を持つ頂点だけを対象にする。</li>
          <li><strong>ハミルトンを多項式時間で解こうとする</strong>：一般には無理。N が大きいなら bit DP でも <Cmd>{"2^N"}</Cmd> が効いて解けない。N の制約を必ず確認する。</li>
          <li><strong>bit DP のメモリ</strong>：<Cmd>{"2^N · N"}</Cmd> の配列。<Cmd>N=20</Cmd> で約 2000 万要素とメモリを圧迫する。N の上限に注意。</li>
        </ul>
      </Callout>

      <Bridge course="グラフ理論 / 計算複雑性理論（P vs NP）">
        オイラー路とハミルトン路の対比は、<strong>計算複雑性理論</strong>の教科書的な例です。
        オイラー路は次数を数えるだけの<strong>多項式時間（クラス P）</strong>で解けるのに対し、ハミルトン路の存在判定は
        <strong>NP 完全</strong>——答えが与えられれば検証は速いが、効率よく<strong>求める</strong>方法は知られていません。
        見た目そっくりの 2 問題が P と NP 完全に分かれるこの事実は、<strong>P vs NP 問題</strong>の直感を養う最良の入り口です。
        次章の TSP（巡回セールスマン問題）は、ハミルトン閉路にコスト最小化を足した NP 困難問題として、この延長線上にあります。
      </Bridge>

      <Quiz
        question="ある無向連結グラフで、奇数次数の頂点がちょうど 2 個あった。何が言える？"
        options={[
          <>オイラー閉路（始点に戻る一筆書き）が存在する</>,
          <>その 2 頂点を始点・終点とする<strong>オイラー路</strong>が存在する</>,
          <>ハミルトン路が必ず存在する</>,
          <>一筆書きは不可能である</>,
        ]}
        answer={1}
        explanation={<>奇数次数が 0 個ならオイラー閉路、ちょうど 2 個ならその 2 頂点を端点とするオイラー路が存在します。次数の判定はオイラー路のもので、ハミルトン路とは無関係です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "オイラー路=すべての辺を 1 回ずつ、ハミルトン路=すべての頂点を 1 回ずつ",
          "オイラー路は易しい：連結かつ奇数次数の頂点が 0 個（閉路）か 2 個（路）で存在。O(V+E)",
          "経路構成は Hierholzer 法：スタックで潜り、行き止まりから積んで反転。O(E)",
          "ハミルトン路は NP 困難：bit DP で dp[S][v]（S=訪問集合）を O(2^N·N^2)、または全探索 O(N!)",
          "「辺 vs 頂点」で難易度が P と NP 完全に分かれる。P vs NP の代表例",
        ]}
      />
    </>
  );
}

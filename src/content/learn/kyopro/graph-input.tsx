import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain, StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "graph-input",
  title: "グラフ構造の入力と表現",
  description: "頂点と辺からなるグラフを、コード上でどう持つか。隣接リスト（defaultdict(list) / list of lists）と隣接行列の使い分け、無向/有向・重み付きの扱い、標準入力から N・M と辺を読む定番コード（1-indexed → 0-indexed 変換）までを Python 実装で押さえる。",
  domain: "kyopro",
  section: "graph",
  order: 1,
  level: "basic",
  tags: ["グラフ", "入力"],
  updated: "2026-07-07",
  minutes: 16,
};

export default function Article() {
  return (
    <>
      <Lead>
        グラフのアルゴリズム（BFS・DFS・最短経路など）は、どれも<strong>「グラフをコード上でどう持つか」</strong>が出発点です。
        ここでつまずくと後続すべてが動きません。この記事では、<strong>隣接リスト</strong>と<strong>隣接行列</strong>という 2 つの表現を、
        無向/有向・重みの有無ごとに整理し、標準入力から頂点数 <Cmd>N</Cmd>・辺数 <Cmd>M</Cmd> と辺を読み込む定番コードを、
        <strong>1-indexed → 0-indexed の変換</strong>まで含めて丸ごと身につけます。
      </Lead>

      <Section>概要 — グラフとは「頂点」と「辺」の集まり</Section>
      <p>
        グラフは<strong>頂点（node / vertex）</strong>の集合と、それらを結ぶ<strong>辺（edge）</strong>の集合でできています。
        競プロでは頂点数を <Cmd>N</Cmd>（または <Cmd>V</Cmd>）、辺数を <Cmd>M</Cmd>（または <Cmd>E</Cmd>）と書くのが定番です。
        辺には次のような種類があり、入力の読み方が変わります。
      </p>
      <KVList
        items={[
          { key: "無向グラフ", val: "辺 (a, b) は a↔b の双方向。両向きに登録する" },
          { key: "有向グラフ", val: "辺 (a, b) は a→b の一方向のみ。片方だけ登録する" },
          { key: "重みなし", val: "辺は「つながっている」ことだけを表す。BFS の最短ステップ数などで使う" },
          { key: "重み付き", val: "辺にコスト w を持たせる。ダイクストラ等の最短経路で使う" },
        ]}
      />
      <p>
        これをコードで持つ方法が主に 2 つあります。ほとんどの問題は<strong>隣接リスト</strong>で解けますが、
        頂点数が小さく「2 頂点間に辺があるか」を <Cmd>O(1)</Cmd> で判定したいときは<strong>隣接行列</strong>が便利です。
      </p>
      <FlowChain
        nodes={[
          { label: "標準入力", sub: "N M と辺", variant: "alt" },
          { label: "パース", sub: "map(int, ...)" },
          { label: "0-indexed 変換", sub: "a -= 1" },
          { label: "隣接リスト構築", sub: "graph[a].append(b)", variant: "cta" },
        ]}
        caption="入力を読み、番号を 0 始まりに直し、隣接リストへ積むまでが定番の流れ"
      />

      <Section>計算量 — メモリと辺走査のコスト</Section>
      <p>
        表現の選択は<strong>メモリ量</strong>と<strong>「ある頂点の隣を全部見る」コスト</strong>で決まります。
        頂点 <Cmd>V</Cmd>・辺 <Cmd>E</Cmd> のグラフで比較します。
      </p>
      <ComparisonTable
        headers={["観点", "隣接リスト", "隣接行列"]}
        rows={[
          ["メモリ", <><Cmd>O(V + E)</Cmd>（辺の数に比例）</>, <><Cmd>{"O(V^2)"}</Cmd>（頂点数の 2 乗）</>],
          ["辺 (a,b) の有無判定", <>隣接を走査 <Cmd>O(次数)</Cmd></>, <><Cmd>adj[a][b]</Cmd> で <Cmd>O(1)</Cmd></>],
          ["ある頂点の隣を全走査", <><Cmd>O(次数)</Cmd>（無駄がない）</>, <><Cmd>O(V)</Cmd>（毎回 V 個見る）</>],
          ["向いている問題", <>疎（辺が少ない）・大きな N</>, <>密・小さな N（数百程度まで）</>],
        ]}
      />
      <p>
        競プロでは <Cmd>N</Cmd> が <Cmd>{"10^5"}</Cmd> を超えることが珍しくありません。このとき隣接行列は
        <Cmd>{"O(V^2) = 10^{10}"}</Cmd> でメモリも時間も破綻します。<strong>迷ったら隣接リスト</strong>が基本方針です。
      </p>

      <Section>仕組み・なぜ — 隣接リストが標準になる理由</Section>
      <p>
        隣接リストは「各頂点 <Cmd>v</Cmd> について、<Cmd>v</Cmd> から行ける相手のリスト」を持つデータ構造です。
        辺の数だけしか要素を持たないので、辺が少ない（疎な）グラフではメモリの無駄がありません。
        BFS/DFS のように<strong>「今いる頂点の隣を順に見る」</strong>操作が中心のアルゴリズムでは、
        隣接リストなら必要な隣だけを走査でき、隣接行列のように毎回 <Cmd>V</Cmd> 個の空きマスを見ずに済みます。
      </p>
      <SubSection>list of lists と defaultdict(list)</SubSection>
      <p>
        隣接リストの実体は 2 つの書き方があります。頂点が <Cmd>0</Cmd> 〜 <Cmd>N-1</Cmd> の連番なら
        <strong>list of lists</strong>（<Cmd>{"[[] for _ in range(N)]"}</Cmd>）が最速・省メモリです。
        頂点が連番でない（文字列・飛び番号）なら <strong>defaultdict(list)</strong> が扱いやすくなります。
      </p>

      <Section>Python 実装 — 定番の入力パターン</Section>
      <p>
        まずは最頻出の<strong>無向・重みなしグラフ</strong>を、標準入力から読み込む形です。競プロの入力は
        <Cmd>1</Cmd> 始まりの頂点番号が多いので、<strong>読み込んだ直後に <Cmd>-= 1</Cmd> して 0 始まりに直す</strong>のが安全な作法です。
      </p>
      <Code lang="python" filename="無向・重みなし（list of lists）">{`import sys
input = sys.stdin.readline

N, M = map(int, input().split())          # 頂点数 N, 辺数 M
graph = [[] for _ in range(N)]            # 0-indexed の隣接リスト

for _ in range(M):
    a, b = map(int, input().split())
    a -= 1                                # 1-indexed -> 0-indexed
    b -= 1
    graph[a].append(b)
    graph[b].append(a)                    # 無向なので両向きに登録

# graph[v] で頂点 v の隣接頂点リストが得られる
print(graph)`}</Code>
      <Callout variant="tip" title="なぜ input = sys.stdin.readline か">
        組み込みの <Cmd>input()</Cmd> は遅く、辺が <Cmd>{"10^5"}</Cmd> 本もあると読み込みだけで TLE することがあります。
        <Cmd>sys.stdin.readline</Cmd> に差し替えるだけで大幅に速くなります（末尾に改行が残る点だけ注意。整数変換なら気にしなくてよい）。
      </Callout>

      <SubSection>有向グラフ — 片方向だけ登録する</SubSection>
      <p>有向グラフは <Cmd>a → b</Cmd> の一方向だけを積みます。無向との違いは <strong>1 行削るだけ</strong>です。</p>
      <Code lang="python" filename="有向・重みなし">{`N, M = map(int, input().split())
graph = [[] for _ in range(N)]

for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    graph[a].append(b)                    # a -> b の一方向のみ`}</Code>

      <SubSection>重み付きグラフ — (相手, コスト) のタプルで持つ</SubSection>
      <p>
        重みがあるときは、隣接リストの要素を<strong>相手頂点とコストのタプル <Cmd>(b, w)</Cmd></strong>にします。
        ダイクストラなどはこの形を前提にします。
      </p>
      <Code lang="python" filename="無向・重み付き">{`N, M = map(int, input().split())
graph = [[] for _ in range(N)]

for _ in range(M):
    a, b, w = map(int, input().split())   # w は辺の重み
    a -= 1
    b -= 1
    graph[a].append((b, w))
    graph[b].append((a, w))

# 走査例: for nxt, cost in graph[v]: ...`}</Code>

      <SubSection>defaultdict(list) — 頂点が連番でないとき</SubSection>
      <Code lang="python" filename="defaultdict 版">{`from collections import defaultdict

graph = defaultdict(list)                 # 初アクセス時に空リストを自動生成
for _ in range(M):
    a, b = map(int, input().split())
    graph[a].append(b)
    graph[b].append(a)

# 存在しないキーを読んでも KeyError にならず [] が返る`}</Code>

      <SubSection>隣接行列 — 頂点数が小さいとき</SubSection>
      <p>
        <Cmd>N</Cmd> が数百程度までなら、<Cmd>{"N x N"}</Cmd> の 2 次元配列で「辺があるか」を <Cmd>O(1)</Cmd> 判定できます。
        後の TSP（巡回セールスマン）などコスト行列が主役の問題で使います。
      </p>
      <Code lang="python" filename="隣接行列（重みなし）">{`N, M = map(int, input().split())
adj = [[0] * N for _ in range(N)]         # 0 = 辺なし, 1 = 辺あり

for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    adj[a][b] = 1
    adj[b][a] = 1                         # 無向。有向ならこの行を消す

# adj[a][b] が 1 なら a-b 間に辺がある`}</Code>

      <Section>具体例・使いどころ</Section>
      <p>
        たとえば「<Cmd>N=4</Cmd> 頂点、辺 <Cmd>(1,2) (1,3) (2,4)</Cmd> の無向グラフ」を 0-indexed で読むと、隣接リストは次のようになります。
      </p>
      <StepFlow
        steps={[
          { title: "頂点0（元1）", desc: <>隣は <Cmd>[1, 2]</Cmd>（元の 2 と 3）</> },
          { title: "頂点1（元2）", desc: <>隣は <Cmd>[0, 3]</Cmd>（元の 1 と 4）</> },
          { title: "頂点2（元3）", desc: <>隣は <Cmd>[0]</Cmd>（元の 1）</> },
          { title: "頂点3（元4）", desc: <>隣は <Cmd>[1]</Cmd>（元の 2）</> },
        ]}
        caption="無向なので、辺 (a,b) を読むたび graph[a] と graph[b] の両方に相手を積む"
      />
      <ComparisonTable
        headers={["こういう問題なら", "この表現"]}
        rows={[
          [<>大きな N・BFS/DFS で連結性や最短手数</>, <>隣接リスト（list of lists）</>],
          [<>頂点が文字列や飛び番号</>, <>defaultdict(list)</>],
          [<>ダイクストラ等の重み付き最短経路</>, <>隣接リスト（(相手, 重み) タプル）</>],
          [<>N が小さくコスト行列が主役（TSP 等）</>, <>隣接行列</>],
        ]}
      />

      <Callout variant="warn" title="落とし穴 — 入力まわりで事故る典型">
        <ul>
          <li><strong>0-indexed 変換の付け忘れ</strong>：入力が 1 始まりなのに <Cmd>-= 1</Cmd> し忘れると、末尾で <Cmd>IndexError</Cmd> か静かに 1 個ずれる。</li>
          <li><strong>無向なのに片方しか積まない</strong>：<Cmd>graph[b].append(a)</Cmd> を忘れると「行きはあるが帰りがない」不完全グラフになる。</li>
          <li><strong>有向なのに両方積む</strong>：逆に有向で両向き登録すると、実在しない逆辺を作ってしまう。</li>
          <li><strong>自己ループ・多重辺</strong>：<Cmd>a == b</Cmd> の辺や同じ辺が複数来る問題がある。BFS/DFS は <Cmd>visited</Cmd> で吸収できるが、次数を数える処理では影響する。</li>
          <li><strong>隣接行列を大きな N で使う</strong>：<Cmd>{"N = 10^5"}</Cmd> で <Cmd>{"[[0]*N for _ in range(N)]"}</Cmd> を作ると <Cmd>MLE</Cmd>。疎なら必ず隣接リスト。</li>
        </ul>
      </Callout>

      <Bridge course="グラフ理論">
        隣接リストと隣接行列は、講義で学ぶ<strong>グラフ理論</strong>の「グラフの表現法」そのものです。
        メモリが <Cmd>O(V+E)</Cmd> か <Cmd>{"O(V^2)"}</Cmd> か、辺走査が <Cmd>O(次数)</Cmd> か <Cmd>O(V)</Cmd> かという計算量の議論は、
        <strong>疎グラフ（sparse）と密グラフ（dense）</strong>の区別と結びつきます。実務でも「どのデータ構造でグラフを持つか」は、
        経路探索・依存関係解決・SNS の友人関係など、あらゆるグラフ処理の性能を左右する最初の設計判断です。
      </Bridge>

      <Quiz
        question={<>頂点数 <Cmd>N = 100000</Cmd>、辺数 <Cmd>M = 200000</Cmd> の無向グラフを BFS したい。適切な表現はどれ？</>}
        options={[
          <>隣接行列。<Cmd>adj[a][b]</Cmd> で辺判定が速いから</>,
          <>隣接リスト（list of lists）。メモリが <Cmd>O(V+E)</Cmd> で済み、隣の走査も無駄がないから</>,
          <>どちらでもよい。計算量は変わらない</>,
          <>そもそも大きすぎて解けない</>,
        ]}
        answer={1}
        explanation={<>隣接行列は <Cmd>{"O(V^2) = 10^{10}"}</Cmd> でメモリが破綻します。辺が少ない（疎な）大きいグラフでは、<Cmd>O(V+E)</Cmd> の隣接リストが正解です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "グラフは頂点 N と辺 M。無向は両向き登録、有向は片方向だけ登録する",
          "隣接リストはメモリ O(V+E)・隣走査 O(次数)。隣接行列はメモリ O(V^2)・辺判定 O(1)",
          "迷ったら隣接リスト。頂点が連番なら list of lists、飛び番号なら defaultdict(list)",
          "重み付きは (相手, 重み) のタプルで持つ。入力は sys.stdin.readline で高速化",
          "競プロ入力は 1-indexed が多い。読んだ直後に -= 1 して 0-indexed に統一するのが安全",
        ]}
      />
    </>
  );
}

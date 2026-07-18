import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "stack-queue",
  title: "スタックとキュー",
  description: "後入れ先出し(LIFO)のスタックと、先入れ先出し(FIFO)のキュー。Python では list.append/pop でスタック、collections.deque の append/popleft でキューを作る。list.pop(0) が O(N) で遅い理由、括弧の対応判定・DFS はスタック / BFS はキュー という定番の使い分けまで、実装コードと計算量から詳しく解説します。",
  domain: "kyopro",
  section: "search-basics",
  order: 4,
  level: "basic",
  tags: ["データ構造", "スタック", "キュー"],
  updated: "2026-07-07",
  minutes: 16,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>スタック（stack）</strong>と<strong>キュー（queue）</strong>は、要素を「入れて・取り出す」順序だけが違う、
        双子のような基本データ構造です。スタックは<strong>後入れ先出し（LIFO）</strong>、キューは<strong>先入れ先出し（FIFO）</strong>。
        括弧の対応チェック、DFS/BFS、シミュレーションなど競プロの土台になります。Python での正しい実装と、
        <strong>やってしまいがちな遅い書き方</strong>を押さえます。
      </Lead>

      <Section>概要 — LIFO と FIFO</Section>
      <KVList
        items={[
          { key: "スタック（LIFO）", val: "最後に入れたものが最初に出る。積み上げた皿・ブラウザの戻る・関数の呼び出し履歴" },
          { key: "キュー（FIFO）", val: "最初に入れたものが最初に出る。行列・順番待ち・印刷ジョブ・BFS の探索順" },
          { key: "共通する操作", val: "追加（push/enqueue）と 取り出し（pop/dequeue）。取り出す“端”が違うだけ" },
        ]}
      />
      <StepFlow
        steps={[
          { title: "スタック: 1→2→3 と積む", desc: "取り出すと 3→2→1（最後に積んだ 3 が先）= LIFO" },
          { title: "キュー: 1→2→3 と並ぶ", desc: "取り出すと 1→2→3（最初に来た 1 が先）= FIFO" },
        ]}
        caption="同じ順に入れても、取り出す順が逆になる"
      />

      <Section>計算量 — どの操作が速いか</Section>
      <p>
        どちらも<strong>端での追加・取り出しを O(1)</strong> で行えるのが要点です。ただし Python では
        <strong>実装の選び方を間違えると O(N) に落ちる</strong>ので注意します。
      </p>
      <ComparisonTable
        headers={["構造 / 操作", "推奨実装", "計算量"]}
        rows={[
          ["スタック: 追加/取り出し", "list.append() / list.pop()", "O(1)"],
          ["キュー: 追加/取り出し", "deque.append() / deque.popleft()", "O(1)"],
          ["キューを list.pop(0) で代用", "list.pop(0)（❌）", "O(N) 要素を前へずらす"],
        ]}
      />

      <Section>Python 実装 — スタック（list）</Section>
      <p>
        スタックは Python の <Cmd>list</Cmd> をそのまま使います。<strong>末尾</strong>で <Cmd>append</Cmd>（積む）と
        <Cmd>pop</Cmd>（引数なし＝末尾を取る）を行い、どちらも O(1) です。
      </p>
      <Code lang="python" filename="stack.py">{`stack = []
stack.append(1)      # 積む: [1]
stack.append(2)      # 積む: [1, 2]
stack.append(3)      # 積む: [1, 2, 3]

top = stack[-1]      # 取り出さずに一番上を覗く（peek）-> 3
print(stack.pop())   # 末尾を取り出す -> 3   （LIFO）
print(stack.pop())   # -> 2
print(stack)         # -> [1]

# 空かどうかは真偽値でそのまま判定できる
while stack:
    print(stack.pop())   # -> 1`}</Code>
      <Callout variant="warn" title="空スタックの pop は例外">
        空の list に <Cmd>pop()</Cmd> すると <Cmd>IndexError</Cmd> になります。取り出す前に
        <Cmd>if stack:</Cmd> や <Cmd>while stack:</Cmd> で空でないことを確かめます。
      </Callout>

      <Section>Python 実装 — キュー（collections.deque）</Section>
      <p>
        キューは <Cmd>collections.deque</Cmd>（両端キュー）を使います。<strong>末尾に append</strong>・
        <strong>先頭から popleft</strong> で FIFO を作り、<strong>どちらも O(1)</strong> です。
      </p>
      <Code lang="python" filename="queue.py">{`from collections import deque

queue = deque()
queue.append(1)        # 末尾に追加: deque([1])
queue.append(2)        # deque([1, 2])
queue.append(3)        # deque([1, 2, 3])

print(queue.popleft()) # 先頭を取り出す -> 1   （FIFO）
print(queue.popleft()) # -> 2
print(queue)           # -> deque([3])

# deque は両端 O(1): appendleft / pop も使える（両端キューとして）
queue.appendleft(0)    # 先頭に追加: deque([0, 3])`}</Code>
      <Callout variant="danger" title="キューを list.pop(0) で作ると遅い（頻出の罠）">
        <p>
          「list でキューも作れるのでは？」と <Cmd>list.pop(0)</Cmd>（先頭取り出し）を使うと、
          先頭を抜いた後に<strong>残り全要素を 1 つずつ前へ詰め直す</strong>ため 1 回 O(N)。ループで N 回繰り返すと
          <strong>O(N²)</strong> になり、N=10^5 で約 100 億回 → TLE します。<Cmd>list.insert(0, x)</Cmd> も同じ理由で O(N) です。
        </p>
        <Code lang="python" filename="slow_queue.py">{`# ❌ 遅い: list.pop(0) は先頭取り出しのたびに全要素をずらす → O(N)
q = list(range(10**5))
while q:
    x = q.pop(0)    # 1回ごとに O(N) → 全体 O(N^2) → TLE

# ✅ 速い: deque なら popleft が O(1) → 全体 O(N)
from collections import deque
q = deque(range(10**5))
while q:
    x = q.popleft() # O(1)`}</Code>
      </Callout>

      <Section>使いどころ — 括弧対応・DFS・BFS</Section>
      <SubSection>括弧の対応判定（スタック）</SubSection>
      <p>
        開き括弧を積み、閉じ括弧が来たら「一番最後に開いたもの」と対応するか確かめる――
        「最後に開いたものが最初に閉じる」ネスト構造は LIFO そのもので、スタックの典型例です。
      </p>
      <Code lang="python" filename="brackets.py">{`def is_balanced(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for c in s:
        if c in '([{':
            stack.append(c)             # 開き括弧を積む
        elif c in ')]}':
            if not stack or stack.pop() != pairs[c]:
                return False            # 相手がいない / 種類が違う
    return not stack                    # 積み残しが無ければ対応OK

print(is_balanced("([]{})"))   # -> True
print(is_balanced("([)]"))     # -> False （交差はダメ）`}</Code>

      <SubSection>DFS はスタック、BFS はキュー</SubSection>
      <p>
        グラフ・迷路の探索は、<strong>次に見る候補をどう取り出すか</strong>で性格が変わります。
        <strong>スタック（LIFO）で深く潜れば DFS</strong>、<strong>キュー（FIFO）で近い順に広げれば BFS</strong>。
        BFS は最短経路（辺の重みが等しいとき）を求められるのが強みです。
      </p>
      <Code lang="python" filename="dfs_bfs.py">{`from collections import deque

graph = {0: [1, 2], 1: [3], 2: [3, 4], 3: [], 4: []}

def dfs(start):
    seen = {start}
    stack = [start]                 # スタック = list
    order = []
    while stack:
        v = stack.pop()             # 最後に入れた頂点から（深く潜る）
        order.append(v)
        for nxt in graph[v]:
            if nxt not in seen:
                seen.add(nxt)
                stack.append(nxt)
    return order

def bfs(start):
    seen = {start}
    queue = deque([start])          # キュー = deque
    order = []
    while queue:
        v = queue.popleft()         # 最初に入れた頂点から（近い順に広げる）
        order.append(v)
        for nxt in graph[v]:
            if nxt not in seen:
                seen.add(nxt)
                queue.append(nxt)
    return order

print(dfs(0))   # 例: [0, 2, 4, 3, 1]（深さ優先）
print(bfs(0))   # 例: [0, 1, 2, 3, 4]（幅優先＝距離の近い順）`}</Code>
      <Callout variant="info" title="訪問済み(seen)はキューに入れる時に付ける">
        BFS で <Cmd>seen</Cmd> の印を「取り出す時」に付けると、同じ頂点が何度もキューに入り重複探索・TLE の原因になります。
        <strong>キューに入れる瞬間に seen へ追加</strong>するのが定石です。DFS も同様の注意が要ります。
      </Callout>

      <Section>落とし穴（まとめ）</Section>
      <Callout variant="warn" title="よくある間違い">
        <ul>
          <li><strong>キューに list.pop(0) を使う</strong>: O(N)。必ず <Cmd>deque.popleft()</Cmd>（O(1)）を使う</li>
          <li><strong>空での取り出し</strong>: <Cmd>pop()</Cmd>/<Cmd>popleft()</Cmd> は空だと例外。<Cmd>while コンテナ:</Cmd> で守る</li>
          <li><strong>peek と pop の混同</strong>: 覗くだけなら <Cmd>stack[-1]</Cmd>・<Cmd>queue[0]</Cmd>（取り出さない）</li>
          <li><strong>DFS/BFS の seen 付け忘れ</strong>: 追加時に印を付けないと無限ループ・重複で TLE</li>
        </ul>
      </Callout>

      <Bridge course="データ構造 / 計算モデル（アルゴリズムとデータ構造・計算理論）">
        <p>
          スタックとキューは<strong>抽象データ型（ADT）</strong>の代表例です。「LIFO で出し入れできる」という
          <strong>操作の契約</strong>だけを定義し、内部が list でも連結リストでも構わない――この
          「インターフェースと実装の分離」はデータ構造設計の基本です。スタックは理論面でも重要で、
          関数呼び出しを支える<strong>コールスタック</strong>や、<strong>プッシュダウンオートマトン（PDA）</strong>＝
          文脈自由文法（括弧の対応など）を認識する計算モデルの中心にあります。有限オートマトンにスタックを
          1 本足すと括弧の入れ子を数えられるようになる、という計算能力の階層は計算理論の見どころです。
          キューは BFS を通じて「距離の近い順に探索する」＝<strong>最短経路（重みなしグラフ）</strong>の基礎になり、
          次章以降のグラフ探索へ直結します。
        </p>
      </Bridge>

      <Quiz
        question="Python で FIFO のキューを効率よく実装する方法として正しいのは？"
        options={[
          <>list を使い、追加は <Cmd>append</Cmd>、取り出しは <Cmd>pop(0)</Cmd></>,
          <>collections.deque を使い、追加は <Cmd>append</Cmd>、取り出しは <Cmd>popleft</Cmd></>,
          <>list を使い、追加は <Cmd>insert(0, x)</Cmd>、取り出しは <Cmd>pop()</Cmd></>,
          <>set を使い、追加は <Cmd>add</Cmd>、取り出しは <Cmd>pop</Cmd></>,
        ]}
        answer={1}
        explanation={<><Cmd>deque</Cmd> は両端の append/popleft が O(1)。list の <Cmd>pop(0)</Cmd> や <Cmd>insert(0, x)</Cmd> は全要素をずらすため O(N) で、繰り返すと O(N²) になります。set は順序を保たないのでキューには使えません。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "スタックは後入れ先出し(LIFO)、キューは先入れ先出し(FIFO)。取り出す端が違うだけの双子構造",
          "スタックは list の append / pop（末尾・O(1)）。キューは deque の append / popleft（O(1)）",
          "list.pop(0) は先頭取り出しで O(N) → キューに使うと O(N²) で TLE。必ず deque を使う",
          "括弧の対応判定・DFS はスタック、BFS はキュー。BFS は重みなしグラフの最短経路が求まる",
          "取り出し前に while コンテナ: で空チェック。DFS/BFS の seen は「追加時」に付ける",
        ]}
      />
    </>
  );
}

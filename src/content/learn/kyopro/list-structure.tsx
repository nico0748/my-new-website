import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "list-structure",
  title: "リスト（動的配列）",
  description: "Python の list は動的配列。append が O(1) 償却で末尾追加できる一方、先頭挿入や pop(0) は O(N)。計算量の内訳とスライス、2次元リストの参照共有の罠まで、競プロで詰まらない使い方を実装とともに整理する。",
  domain: "kyopro",
  section: "search-basics",
  order: 5,
  level: "intro",
  tags: ["データ構造", "配列"],
  updated: "2026-07-07",
  minutes: 14,
};

export default function Article() {
  return (
    <>
      <Lead>
        Python の <Cmd>list</Cmd> は、競プロで最もよく使う入れ物です。見た目は「並んだ箱」ですが、中身は
        <strong>動的配列（dynamic array）</strong>という構造で動いています。この仕組みを知ると、なぜ末尾追加は速く、
        先頭挿入が遅いのかが腑に落ち、TLE（実行時間超過）を避けられるようになります。
      </Lead>

      <Section>概要 — list は「連続したメモリ」に並ぶ動的配列</Section>
      <p>
        Python の <Cmd>list</Cmd> は、要素を<strong>メモリ上に連続して</strong>並べ、必要に応じて自動で領域を広げる
        <strong>動的配列</strong>です。C++ の <Cmd>std::vector</Cmd>、Java の <Cmd>ArrayList</Cmd> に相当します。
        「連続して並ぶ」ことが、後で出てくる計算量の良し悪しをすべて決めます。
      </p>
      <KVList
        items={[
          { key: "添字アクセス", val: "先頭アドレス + i × 要素幅 で一発計算できるので a[i] は O(1)" },
          { key: "末尾追加", val: "余っている領域に書くだけなら O(1)。埋まったら拡張が起きる" },
          { key: "途中の挿入・削除", val: "後ろの要素を全部ずらす必要があり O(N)" },
          { key: "要素の型", val: "何でも入る（異なる型の混在も可）。実体は各要素への参照の配列" },
        ]}
      />

      <Section>計算量 — 操作ごとに速い/遅いがはっきり分かれる</Section>
      <p>
        list の操作は、<strong>末尾に触るもの</strong>は速く、<strong>先頭や途中に触るもの</strong>は遅い、という
        きれいな法則があります。まず一覧で押さえます。
      </p>
      <ComparisonTable
        headers={["操作", "書き方", "計算量", "なぜ"]}
        rows={[
          [<>添字アクセス</>, <Cmd>a[i]</Cmd>, <>O(1)</>, <>アドレス計算だけ</>],
          [<>末尾追加</>, <Cmd>a.append(x)</Cmd>, <>O(1) 償却</>, <>普段は書くだけ。拡張時のみ重い</>],
          [<>末尾削除</>, <Cmd>a.pop()</Cmd>, <>O(1)</>, <>末尾を捨てるだけ</>],
          [<>先頭挿入</>, <Cmd>a.insert(0, x)</Cmd>, <>O(N)</>, <>後ろ全部を1つずらす</>],
          [<>先頭削除</>, <Cmd>a.pop(0)</Cmd>, <>O(N)</>, <>後ろ全部を前に詰める</>],
          [<>途中挿入/削除</>, <Cmd>a.insert(i, x)</Cmd>, <>O(N)</>, <>i より後ろをずらす</>],
          [<>存在判定</>, <Cmd>{"x in a"}</Cmd>, <>O(N)</>, <>先頭から線形に探す</>],
          [<>位置検索</>, <Cmd>a.index(x)</Cmd>, <>O(N)</>, <>先頭から線形に探す</>],
          [<>長さ取得</>, <Cmd>len(a)</Cmd>, <>O(1)</>, <>要素数を保持している</>],
          [<>スライス</>, <Cmd>a[l:r]</Cmd>, <>O(r - l)</>, <>その区間をコピーする</>],
        ]}
      />
      <Callout variant="info" title="「O(1) 償却」とは">
        <Cmd>append</Cmd> は普段はほぼ一瞬ですが、確保済み領域が満杯になると<strong>約2倍の新領域を確保して全要素をコピー</strong>します。
        この重いコピーは頻度が指数的に下がるため、N 回の append をならすと 1 回あたり O(1) に収まります。これを
        <strong>償却計算量（amortized）</strong>と呼びます。「たまに重いが、ならせば軽い」という意味です。
      </Callout>

      <Section>仕組み・なぜ — 連続配置がすべてを決める</Section>
      <p>
        要素がメモリ上に<strong>連続して</strong>並んでいるので、<Cmd>a[i]</Cmd> は「先頭の場所 + i × 幅」という
        足し算1回で場所が分かります。だから添字アクセスは要素数に関係なく一定時間（O(1)）です。
      </p>
      <p>
        逆に、先頭に1つ挿入すると「連続」を保つために<strong>後続の要素すべてを1つずつ後ろへずらす</strong>必要があり、
        N 個ずらすので O(N) になります。<Cmd>pop(0)</Cmd> も同様に、空いた先頭を埋めるため全体を前に詰めます。
        「途中に触ると全体が動く」——これが動的配列の弱点であり、後で学ぶ<strong>連結リスト</strong>や
        <Cmd>collections.deque</Cmd> が存在する理由です。
      </p>
      <SubSection>末尾追加が速い理由（余剰確保）</SubSection>
      <p>
        動的配列は、要素数ぴったりではなく<strong>少し多めの領域</strong>を確保しています。だから追加は「空いている次の箱に書く」だけで済み O(1)。
        満杯になった瞬間だけ、より大きな領域を取り直して全コピー（O(N)）が発生しますが、これが償却されて全体では軽くなります。
      </p>

      <Section>Python 実装 — 基本操作を一通り</Section>
      <Code lang="python" filename="list の基本操作">{`a = [3, 1, 4, 1, 5]

# 添字アクセス（O(1)）
print(a[0])       # 3
print(a[-1])      # 5（末尾。負の添字が使える）

# 末尾追加・末尾削除（O(1)）
a.append(9)       # [3, 1, 4, 1, 5, 9]
last = a.pop()    # last=9, a=[3, 1, 4, 1, 5]

# 途中の挿入・削除（O(N)：後ろをずらすので遅い）
a.insert(1, 99)   # [3, 99, 1, 4, 1, 5]
a.remove(99)      # 先頭から探して最初の99を削除（O(N)）
del a[2]          # 添字で削除

# 先頭の出し入れ（O(N)：競プロでは避けたい）
head = a.pop(0)   # 先頭削除。全体を前に詰めるので重い

# 探索（どちらも O(N)）
print(4 in a)     # True
print(a.index(4)) # 4 の位置

# 長さ・繰り返し
print(len(a))
for i, x in enumerate(a):
    print(i, x)   # 添字と値を同時に取る定番`}</Code>

      <SubSection>スライス — 部分列を切り出す（コピーが起きる）</SubSection>
      <Code lang="python" filename="スライス">{`a = [0, 1, 2, 3, 4, 5]

print(a[1:4])    # [1, 2, 3]   （l 以上 r 未満）
print(a[:3])     # [0, 1, 2]   （先頭から）
print(a[3:])     # [3, 4, 5]   （末尾まで）
print(a[::-1])   # [5,4,3,2,1,0]（逆順。反転の定番）
print(a[::2])    # [0, 2, 4]   （1つ飛ばし）

b = a[:]         # 全体の浅いコピー（O(N)）。b を変えても a は不変
a[1:3] = [9, 9, 9]  # 区間を別の長さで置換もできる`}</Code>
      <Callout variant="warn" title="スライスは毎回コピー = O(区間長)">
        <Cmd>a[l:r]</Cmd> は新しいリストを作るため、区間の長さぶんの時間とメモリを使います。ループの内側で毎回スライスすると、
        気づかぬうちに全体が O(N^2) になりがちです。区間の合計や最大だけ欲しいなら、スライスせず添字で回すか累積和を使います。
      </Callout>

      <Section>2次元リスト — 初期化の罠に注意</Section>
      <p>
        グリッド問題（H 行 W 列の盤面）では 2 次元リストを作ります。正しい作り方は<strong>内包表記で各行を独立に生成する</strong>ことです。
      </p>
      <Code lang="python" filename="2次元リストの正しい初期化">{`H, W = 3, 4

# 正しい：各行が独立した新しいリスト
grid = [[0] * W for _ in range(H)]
grid[0][0] = 1
print(grid)   # [[1,0,0,0], [0,0,0,0], [0,0,0,0]]  ← 1行目だけ変わる`}</Code>
      <Callout variant="danger" title="[[0]*W]*H は全行が同じリスト（最頻出バグ）">
        <p>
          <Cmd>{"[[0]*W]*H"}</Cmd> は「1本のリストを H 個<strong>参照でコピー</strong>」します。つまり全行が<strong>同じ実体</strong>を指すため、
          1マス書き換えると<strong>全行が同時に変わって</strong>しまいます。
        </p>
        <Code lang="python" filename="やってはいけない書き方">{`bad = [[0] * W] * H   # 3行すべてが同じ1本のリストを指す
bad[0][0] = 1
print(bad)   # [[1,0,0,0], [1,0,0,0], [1,0,0,0]]  ← 全行が変わる！`}</Code>
        <p>2次元は必ず <Cmd>{"[[0]*W for _ in range(H)]"}</Cmd> の形で作る、と体で覚えてください。</p>
      </Callout>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "入力の受け皿", val: "a = list(map(int, input().split())) で1行の整数列を受け取る定番" },
          { key: "スタックとして", val: "append で積み、pop で取り出す。DFS・括弧対応・単調スタックに" },
          { key: "盤面・DP表", val: "2次元リストで grid や dp[i][j] を持つ。初期化は内包表記で" },
          { key: "反転・部分列", val: "a[::-1] で反転、a[l:r] で区間切り出し" },
          { key: "キューが欲しいとき", val: "先頭出し入れが要るなら list ではなく collections.deque（両端 O(1)）" },
        ]}
      />
      <Callout variant="tip" title="先頭を頻繁に出し入れするなら deque">
        BFS のキューのように「末尾に足して先頭から取り出す」用途では、<Cmd>list.pop(0)</Cmd> は O(N) で危険です。
        <Cmd>from collections import deque</Cmd> の <Cmd>deque</Cmd> なら <Cmd>append</Cmd> / <Cmd>appendleft</Cmd> /
        <Cmd>popleft</Cmd> がすべて O(1) です。BFS では deque を使うと覚えておきましょう。
      </Callout>

      <Bridge course="データ構造（配列 vs 連結リスト・償却計算量）">
        <p>
          list の「添字は速いが途中挿入は遅い」という性質は、講義で学ぶ<strong>配列（array）</strong>そのものです。
          対になるのが<strong>連結リスト（linked list）</strong>で、こちらは各要素が次への<strong>ポインタ</strong>を持つため
          途中挿入が O(1) の一方、i 番目に飛ぶのに先頭からたどって O(N) かかります。「連続配置 vs ポインタ連結」の
          トレードオフは、データ構造の基本テーマです。
        </p>
        <p>
          また append の「たまに全コピーするが、ならすと O(1)」は<strong>償却計算量（amortized analysis）</strong>の
          代表例で、2倍拡張と<strong>ならし解析（aggregate / potential method）</strong>で説明されます。
        </p>
      </Bridge>

      <Quiz
        question="BFS のキューとして Python の list を使い、末尾に a.append(x)、取り出しに a.pop(0) を使ったら TLE しました。最も適切な対処は？"
        options={[
          <>入力を高速化する</>,
          <><Cmd>collections.deque</Cmd> を使い、取り出しを <Cmd>popleft()</Cmd> にする</>,
          <><Cmd>a.pop(0)</Cmd> を <Cmd>a.pop()</Cmd> に変えるだけ</>,
          <>再帰に書き換える</>,
        ]}
        answer={1}
        explanation={<><Cmd>list.pop(0)</Cmd> は先頭削除で後続を全部ずらすため O(N) です。ループ内で毎回呼ぶと全体 O(N^2) になり TLE します。両端 O(1) の <Cmd>deque</Cmd> の <Cmd>popleft()</Cmd> に置き換えるのが正解です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "list は動的配列。添字アクセス a[i] と末尾 append/pop は速い（append は O(1) 償却）",
          "先頭・途中の insert / remove / pop(0) と in / index は O(N)。全体をずらす/線形探索するため",
          "スライス a[l:r] は毎回コピー（O(区間長)）。ループ内で多用すると O(N^2) に化ける",
          "2次元は [[0]*W for _ in range(H)]。[[0]*W]*H は全行が同じ実体を指す最頻出バグ",
          "先頭を出し入れするキュー用途は list ではなく collections.deque（両端 O(1)）",
        ]}
      />
    </>
  );
}

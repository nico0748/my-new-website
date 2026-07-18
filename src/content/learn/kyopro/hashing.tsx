import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "hashing",
  title: "ハッシュ（dict / set）",
  description: "dict と set は平均 O(1) で挿入・探索できるハッシュテーブル。存在判定・頻度集計・Two Sum といった典型に効く。Counter / defaultdict の使い方、ハッシュ関数と衝突（チェイン法/オープンアドレス法）の概念、最悪 O(N)、キーは不変型という制約まで整理する。",
  domain: "kyopro",
  section: "search-basics",
  order: 8,
  level: "basic",
  tags: ["データ構造", "ハッシュ"],
  updated: "2026-07-07",
  minutes: 15,
};

export default function Article() {
  return (
    <>
      <Lead>
        「その値、もう出てきた？」を一瞬で答えられるのが<strong>ハッシュ</strong>です。Python の <Cmd>dict</Cmd>（辞書）と
        <Cmd>set</Cmd>（集合）は、内部が<strong>ハッシュテーブル</strong>でできていて、挿入も検索も<strong>平均 O(1)</strong>。
        list の <Cmd>in</Cmd> が O(N) なのに対して桁違いに速く、存在判定・頻度集計・Two Sum の定番道具になります。
      </Lead>

      <Section>概要 — dict と set は平均 O(1) の探索・挿入</Section>
      <KVList
        items={[
          { key: "dict（辞書）", val: "キー → 値 の対応表。d[key] で値、key in d で存在判定（平均 O(1)）" },
          { key: "set（集合）", val: "値の集合。重複を持たない。x in s の存在判定が平均 O(1)" },
          { key: "list との違い", val: "list の x in a は先頭から探して O(N)。set/dict はハッシュで一発 O(1)" },
          { key: "順序", val: "dict は挿入順を保持（Python 3.7+）。set は順序なし" },
        ]}
      />
      <ComparisonTable
        headers={["操作", "list", "set / dict"]}
        rows={[
          [<>存在判定 <Cmd>{"x in c"}</Cmd></>, <>O(N)</>, <>平均 O(1)</>],
          [<>挿入</>, <>末尾 O(1)（append）</>, <>平均 O(1)</>],
          [<>削除（値指定）</>, <>O(N)</>, <>平均 O(1)</>],
          [<>キーで値を引く</>, <>—</>, <>平均 O(1)</>],
        ]}
      />

      <Section>計算量 — なぜ O(1) で引けるのか</Section>
      <p>
        list が「先頭から順に見る」のに対し、ハッシュテーブルは<strong>値そのものから置き場所を計算する</strong>ため速いのです。
        値 x を<strong>ハッシュ関数</strong>に通すと整数（ハッシュ値）が出て、それを配列サイズで割った余りが<strong>格納する添字</strong>になります。
        探すときも同じ計算で添字が出るので、探索対象が何個あっても<strong>ほぼ一定時間（平均 O(1)）</strong>でたどり着けます。
      </p>
      <Callout variant="info" title="「平均」O(1) の意味">
        添字がきれいにばらけている限り一発で引けますが、後述の<strong>衝突</strong>が多発すると遅くなります。
        だから理論上の最悪は O(N)。ただし実用上のランダムなデータでは平均 O(1) とみなして設計します。
      </Callout>

      <Section>仕組み・なぜ — ハッシュ関数と衝突</Section>
      <p>
        ハッシュテーブルの中身は「大きめの配列」です。値を<strong>ハッシュ関数</strong>で添字に変換して、その位置に置きます。
        問題は、<strong>異なる値が同じ添字になってしまう</strong>ことがある点です。これを<strong>衝突（collision）</strong>と呼びます。
        衝突をどうさばくかで、主に2つの方式があります。
      </p>
      <ComparisonTable
        headers={["衝突解決法", "考え方", "イメージ"]}
        rows={[
          [<>チェイン法<br/>(chaining)</>, <>同じ添字に来た要素を<strong>連結リストで数珠つなぎ</strong>にして持つ</>, <>各バケツが小さなリストを抱える</>],
          [<>オープンアドレス法<br/>(open addressing)</>, <>埋まっていたら<strong>別の空きマスを探して</strong>そこに置く</>, <>Python の dict/set が採用</>],
        ]}
      />
      <p>
        衝突がほとんど起きなければ探索は O(1) のまま。逆に、悪意ある入力や偏りで全部が同じ添字に集まると、
        1本の長い列を線形に探すことになり<strong>最悪 O(N)</strong>まで劣化します。Python は内部でテーブルを自動的に拡張し、
        混み具合（負荷率）を一定以下に保つことで、実用上は平均 O(1) を維持しています。
      </p>

      <Section>Python 実装 — dict と set の基本</Section>
      <Code lang="python" filename="dict / set の基本操作">{`# set（集合）：存在判定に使う
seen = set()
seen.add(5)          # 追加
seen.add(5)          # 重複は無視される（要素数は増えない）
print(5 in seen)     # True（平均 O(1)）
seen.discard(5)      # 削除（無くてもエラーにならない）

# dict（辞書）：キー→値
count = {}           # 空の辞書
count["apple"] = 3
count["apple"] += 1  # 4
print(count.get("banana", 0))  # 0（無いキーは既定値を返す）
print("apple" in count)        # True

# 便利な集合演算
a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)   # {2, 3}   共通（積集合）
print(a | b)   # {1,2,3,4} 和集合
print(a - b)   # {1}      差集合`}</Code>
      <Callout variant="warn" title="無いキーの参照は KeyError">
        <Cmd>d[key]</Cmd> で存在しないキーを引くと <Cmd>KeyError</Cmd> で落ちます。既定値が欲しいときは
        <Cmd>d.get(key, 0)</Cmd> を使うか、次の <Cmd>defaultdict</Cmd> を使います。
      </Callout>

      <Section>頻度集計 — Counter と defaultdict</Section>
      <p>
        「各要素が何回出たか」を数えるのはハッシュの王道です。標準ライブラリの <Cmd>collections</Cmd> が定番の近道を用意しています。
      </p>
      <Code lang="python" filename="Counter / defaultdict">{`from collections import Counter, defaultdict

# Counter：数え上げの決定版
words = ["a", "b", "a", "c", "a", "b"]
cnt = Counter(words)
print(cnt)              # Counter({'a': 3, 'b': 2, 'c': 1})
print(cnt["a"])         # 3
print(cnt.most_common(2))  # [('a', 3), ('b', 2)] 上位2件

# defaultdict：無いキーを自動で初期化
d = defaultdict(int)    # 既定値 0
for w in words:
    d[w] += 1           # キーが無くても KeyError にならない

# グルーピングにも便利（既定値を空リストに）
groups = defaultdict(list)
for name, team in [("x", 1), ("y", 2), ("z", 1)]:
    groups[team].append(name)   # team ごとに名前を集める`}</Code>

      <Section>Two Sum — 「探しながら記録する」定番パターン</Section>
      <p>
        配列から「和が target になる 2 つの要素」を探す<strong>Two Sum</strong>は、ハッシュの威力が最もよく分かる例です。
        素直に全ペアを試すと O(N^2) ですが、<strong>「今の要素の相棒（target − x）を過去に見たか」を set/dict で照会</strong>すれば O(N) になります。
      </p>
      <Code lang="python" filename="Two Sum（O(N)）">{`def two_sum(a, target):
    seen = {}                    # 値 -> 添字
    for i, x in enumerate(a):
        need = target - x        # x の相棒
        if need in seen:         # 相棒を過去に見た？（平均 O(1)）
            return (seen[need], i)
        seen[x] = i              # 今の値を記録
    return None

print(two_sum([2, 7, 11, 15], 9))   # (0, 1)  → 2 + 7 = 9`}</Code>
      <Callout variant="tip" title="「見たものを記録し、次の照会に使う」">
        存在判定・重複検出・Two Sum・区間和が特定値になる部分列の数え上げ（累積和 + dict）——いずれも
        「<strong>これまで見た値を set/dict に貯め、O(1) で照会する</strong>」という同じ骨格です。この型を覚えると応用が一気に広がります。
      </Callout>

      <Section>落とし穴 — キーは不変型でなければならない</Section>
      <p>
        dict のキーや set の要素にできるのは<strong>ハッシュ可能（hashable）＝不変（immutable）な型</strong>だけです。
        <Cmd>int</Cmd> / <Cmd>str</Cmd> / <Cmd>tuple</Cmd> は OK ですが、<strong>list はキーにできません</strong>
        （中身が変わるとハッシュ値が変わってしまい、置き場所が定まらないため）。
      </p>
      <Code lang="python" filename="キーに使える型・使えない型">{`s = set()
s.add((1, 2))     # OK：tuple は不変
# s.add([1, 2])   # NG：TypeError: unhashable type: 'list'

# 座標などをキーにするときは tuple にする
visited = set()
visited.add((3, 4))          # (行, 列) を訪問済みに
print((3, 4) in visited)     # True

# list をキーにしたいときは tuple 化する
key = tuple([1, 2, 3])       # (1, 2, 3)`}</Code>
      <Callout variant="danger" title="グリッド探索での定番ミス">
        BFS/DFS で訪問済みマスを管理するとき、座標を <Cmd>[r, c]</Cmd>（list）のまま set に入れようとすると
        <Cmd>TypeError: unhashable type: 'list'</Cmd> で落ちます。必ず <Cmd>(r, c)</Cmd> の<strong>tuple</strong>にしてから
        入れるか、2次元の <Cmd>visited</Cmd> 配列を使いましょう。
      </Callout>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "存在判定・重複検出", val: "既出かを set で O(1) 照会。重複があるかは len(a) と len(set(a)) の比較" },
          { key: "頻度集計", val: "Counter で数え上げ、most_common で上位取得" },
          { key: "Two Sum 系", val: "target - x を dict で照会して O(N)。全ペア O(N^2) を回避" },
          { key: "訪問管理", val: "BFS/DFS の visited を set に。座標は必ず tuple" },
          { key: "累積和 + dict", val: "区間和が K の部分列の個数を O(N) で数える定番" },
        ]}
      />

      <Bridge course="データ構造 / ハッシュ関数（ハッシュテーブルと衝突解決）">
        <p>
          dict/set の内部は、講義で学ぶ<strong>ハッシュテーブル</strong>そのものです。要点は
          <strong>ハッシュ関数</strong>（値 → 添字への写像）と<strong>衝突解決</strong>（チェイン法／オープンアドレス法）、
          そして<strong>負荷率（load factor）</strong>に応じた<strong>リハッシュ（テーブル拡張）</strong>。
          これらが揃って「平均 O(1)・最悪 O(N)」という計算量が生まれます。
        </p>
        <p>
          「キーは不変型」という制約も、ハッシュ値が要素の中身から決まる以上、途中で中身が変わると破綻するという
          データ構造の必然です。暗号で使う<strong>暗号学的ハッシュ関数</strong>（SHA など）とは目的が違いますが、
          「入力を固定長の値へ写す」という発想は共通しています。
        </p>
      </Bridge>

      <Quiz
        question="配列から「和が target になる 2 要素」を O(N) で探すには？"
        options={[
          <>二重ループで全ペアを試す</>,
          <>これまで見た値を dict / set に記録し、各 x について target - x を O(1) で照会する</>,
          <>配列をソートしてから線形に足す</>,
          <>list の in で毎回探す</>,
        ]}
        answer={1}
        explanation={<>「相棒 target - x を過去に見たか」を dict/set で平均 O(1) 照会すれば、1回のループ（O(N)）で解けます。全ペアの二重ループは O(N^2)、list の in での照会も O(N) で全体 O(N^2) になります。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "dict / set はハッシュテーブル。挿入・探索・削除が平均 O(1)（list の in は O(N)）",
          "値をハッシュ関数で添字に変換して置くから速い。衝突はチェイン法/オープンアドレス法で解決",
          "衝突が偏ると最悪 O(N)。Python はテーブル自動拡張で平均 O(1) を維持",
          "頻度集計は Counter、無いキーの自動初期化は defaultdict。Two Sum は dict 照会で O(N)",
          "キーは不変型（int/str/tuple）のみ。list は不可。座標は必ず tuple にする",
        ]}
      />
    </>
  );
}

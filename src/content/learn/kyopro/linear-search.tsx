import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "linear-search",
  title: "線形探索",
  description: "配列の先頭から順に一つずつ調べて目的の値を探す、最も基本的な探索アルゴリズム。計算量 O(N) の意味、for+break や enumerate/index を使った Python 実装、そして「毎回 in / index で探すと遅い、集合(set)なら速い」という競プロで頻出の落とし穴までを、なぜそうなるかから詳しく解説します。",
  domain: "kyopro",
  section: "search-basics",
  order: 1,
  level: "intro",
  tags: ["探索", "計算量"],
  updated: "2026-07-07",
  minutes: 12,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>線形探索（linear search / 逐次探索）</strong>は、配列の先頭から順番に一つずつ値を調べ、
        目的のものが見つかったら止める、という最も素直な探索方法です。特別な準備が要らず、
        <strong>データがソートされていなくても使える</strong>のが最大の強みです。まずはこの基本を、
        「なぜ動くか」「どれくらい遅い/速いか」まで含めてしっかり押さえます。
      </Lead>

      <Section>概要 — 何を、いつ使うか</Section>
      <p>
        線形探索は「箱の中身を先頭から順にのぞき、探し物が出てきたらそこで終わり」という発想です。
        アルゴリズムというより<strong>探索の原点</strong>で、他の高度な探索（二分探索・ハッシュ）は
        この素朴なやり方を「もっと速くできないか」と改良したものです。
      </p>
      <KVList
        items={[
          { key: "使う場面", val: "データがソートされていない / 件数が少ない（数百〜数千程度）/ 一度きりの検索" },
          { key: "前提条件", val: "なし。並び順・型・構造を問わず、順に比較できれば使える" },
          { key: "向かない場面", val: "同じ配列に対し何万回も検索する / 件数が非常に多い（この場合は set・二分探索へ）" },
        ]}
      />

      <Section>計算量 — なぜ O(N) なのか</Section>
      <p>
        要素数を <Cmd>N</Cmd> とすると、最悪の場合（目的の値が末尾にある、または存在しない）には
        <strong>全要素を 1 回ずつ調べる</strong>ので、比較回数は N 回です。これを
        <strong>時間計算量 O(N)</strong>（オーダー N）と書きます。N が 2 倍になれば手間もおよそ 2 倍、
        という<strong>データ量に比例</strong>する遅さです。
      </p>
      <ComparisonTable
        headers={["ケース", "比較回数", "計算量"]}
        rows={[
          ["最良（先頭にある）", "1 回", "O(1)"],
          ["平均（真ん中あたり）", "約 N/2 回", "O(N)"],
          ["最悪（末尾 / 存在しない）", "N 回", "O(N)"],
        ]}
      />
      <p>
        オーダー記法では定数倍（N/2 の 1/2 など）を無視するため、平均も最悪も同じ <Cmd>O(N)</Cmd> と表します。
        追加のメモリはほとんど使わないので、<strong>空間計算量は O(1)</strong> です。
      </p>

      <Section>仕組み・なぜ正しく動くか</Section>
      <p>手順はきわめて単純です。</p>
      <StepFlow
        steps={[
          { title: "先頭要素を見る", desc: "インデックス 0 の要素から開始する" },
          { title: "目的の値と比較", desc: "一致すれば「見つかった」としてその位置を返す" },
          { title: "一致しなければ次へ", desc: "インデックスを 1 つ進めて 2 に戻る" },
          { title: "末尾まで一致しなければ", desc: "「見つからなかった」（例: -1）を返す" },
        ]}
        caption="先頭から末尾へ、一つも飛ばさず順に確かめる"
      />
      <p>
        <strong>すべての要素を漏れなく調べる</strong>ので、存在するなら必ず見つかり、末尾まで来て一致が
        なければ「存在しない」と確実に言い切れます。これが正しさ（完全性）の根拠です。
        「飛ばして調べる」二分探索と違い、ソートされていなくても抜けが出ません。
      </p>

      <Section>Python 実装</Section>
      <SubSection>基本形（for + break で位置を返す）</SubSection>
      <Code lang="python" filename="linear_search.py">{`def linear_search(a, target):
    """target が最初に現れる位置(index)を返す。無ければ -1。"""
    for i in range(len(a)):
        if a[i] == target:
            return i        # 見つかった位置ですぐ返す（= break 相当）
    return -1               # 最後まで一致しなければ「なし」

data = [3, 1, 4, 1, 5, 9, 2, 6]
print(linear_search(data, 5))   # -> 4
print(linear_search(data, 7))   # -> -1`}</Code>

      <SubSection>enumerate を使う（インデックスと値を同時に取る）</SubSection>
      <p>
        <Cmd>range(len(a))</Cmd> より <Cmd>enumerate</Cmd> の方が Python らしく読みやすい書き方です。
        インデックス <Cmd>i</Cmd> と値 <Cmd>v</Cmd> を同時に受け取れます。
      </p>
      <Code lang="python" filename="linear_search_enum.py">{`def linear_search(a, target):
    for i, v in enumerate(a):
        if v == target:
            return i
    return -1

# 「存在するか」だけ知りたいなら bool を返す形でもよい
def contains(a, target):
    for v in a:
        if v == target:
            return True
    return False`}</Code>

      <SubSection>組み込みの in / index（実体は線形探索）</SubSection>
      <p>
        Python の <Cmd>x in list</Cmd> や <Cmd>list.index(x)</Cmd> は便利ですが、
        <strong>中身は上と同じ線形探索</strong>で、リストに対しては O(N) で動きます（速くはならない）。
      </p>
      <Code lang="python" filename="builtin.py">{`data = [3, 1, 4, 1, 5]

# 存在判定: 内部で先頭から順に == 比較（O(N)）
print(5 in data)          # -> True

# 位置取得: 最初の一致位置。無いと ValueError を投げる
print(data.index(4))      # -> 2
# print(data.index(99))   # -> ValueError: 99 is not in list

# 例外を避けたいなら in で確認してから、または条件式で
idx = data.index(1) if 1 in data else -1
print(idx)                # -> 1`}</Code>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "最小値・最大値を探す", val: "全要素を1回なめる典型。min()/max() も内部は O(N) の線形走査" },
          { key: "条件に合う最初の要素", val: "「偶数で最初のもの」などは順に見て条件成立で break" },
          { key: "件数が少ない一度きりの検索", val: "ソートやハッシュ化の準備コストの方が高くつく小規模データ" },
          { key: "並びに意味がある探索", val: "「最初に条件を満たす位置」など、順序を保った探索が必要なとき" },
        ]}
      />
      <Code lang="python" filename="usecase.py">{`# 条件に合う「最初の」要素を線形探索で見つける
scores = [55, 62, 48, 90, 73]
first_pass = -1
for i, s in enumerate(scores):
    if s >= 80:            # 最初に 80 以上になった位置で確定
        first_pass = i
        break
print(first_pass)          # -> 3`}</Code>

      <Section>落とし穴</Section>
      <Callout variant="warn" title="毎回 in / index で探すと O(N×Q) に膨れる">
        <p>
          最大の罠は<strong>「ループの中で毎回 <Cmd>x in list</Cmd> を呼ぶ」</strong>ことです。
          リストへの <Cmd>in</Cmd> は 1 回 O(N)。これを Q 回繰り返すと <strong>O(N×Q)</strong> になり、
          N も Q も 10 万規模なら約 100 億回で、確実に TLE（実行時間超過）します。
        </p>
        <Code lang="python" filename="slow.py">{`# ❌ 遅い: queries の各要素で毎回 list を線形探索 → O(N×Q)
data = list(range(10**5))
queries = [i for i in range(10**5)]
count = 0
for q in queries:
    if q in data:     # 1回ごとに O(N)。全体で O(N×Q) ≈ 10^10 → TLE
        count += 1`}</Code>
      </Callout>
      <Callout variant="tip" title="解決: 存在判定は集合(set)で O(1)">
        <p>
          「その値があるか」だけを何度も問うなら、あらかじめ <Cmd>set</Cmd> に入れておきます。
          set への <Cmd>in</Cmd> は<strong>ハッシュ</strong>で平均 <strong>O(1)</strong>。
          全体は O(N + Q) に落ち、劇的に速くなります（同様に「キー→値」は <Cmd>dict</Cmd>）。
        </p>
        <Code lang="python" filename="fast.py">{`# ✅ 速い: 一度 set 化しておけば各問い合わせは O(1) → 全体 O(N+Q)
data = list(range(10**5))
seen = set(data)          # 構築は O(N)
queries = [i for i in range(10**5)]
count = 0
for q in queries:
    if q in seen:         # 平均 O(1)
        count += 1`}</Code>
      </Callout>
      <Callout variant="danger" title="list.index の例外と、重複時の挙動">
        <p>
          <Cmd>list.index(x)</Cmd> は値が無いと <strong>ValueError</strong> を投げて止まります（-1 は返しません）。
          また返るのは<strong>最初に一致した位置だけ</strong>で、重複があっても 2 個目以降は無視されます。
          全位置が欲しいなら内包表記 <Cmd>{"[i for i,v in enumerate(a) if v==x]"}</Cmd> を使います。
        </p>
      </Callout>

      <Bridge course="計算量理論（アルゴリズムとデータ構造）">
        <p>
          線形探索の <Cmd>O(N)</Cmd> は、講義で学ぶ<strong>漸近計算量（オーダー記法）</strong>の最も基本的な例です。
          「入力サイズ N に対して手間がどう伸びるか」だけに注目し、定数倍やマシン速度は無視するのがオーダーの考え方でした。
          ここで大事なのは、<strong>同じ「探索」でもデータ構造を変えると計算量が変わる</strong>という視点です。
          リスト（配列）の探索は O(N)、ハッシュ集合（set）の探索は平均 O(1)、ソート済み配列＋二分探索なら O(log N)。
          「どのデータ構造に載せるか」がそのまま計算量を決める――これは次章以降（二分探索・探索木・スタック/キュー）に共通する、
          競プロで最も効く一手です。
        </p>
      </Bridge>

      <Quiz
        question="10万要素のリスト data に対して、10万個の値 queries それぞれが含まれるかを判定します。最も速いのは？"
        options={[
          <>各 q について <Cmd>q in data</Cmd> をそのまま呼ぶ</>,
          <>先に <Cmd>seen = set(data)</Cmd> を作り、各 q について <Cmd>q in seen</Cmd> を呼ぶ</>,
          <>各 q について <Cmd>data.index(q)</Cmd> を呼ぶ</>,
          <>data を毎回 for で回して自前比較する</>,
        ]}
        answer={1}
        explanation={<>リストへの <Cmd>in</Cmd> / <Cmd>index</Cmd> は 1 回 O(N) なので、Q 回で O(N×Q)≈10^10 となり TLE します。set は構築 O(N)・各判定が平均 O(1) で、全体 O(N+Q)≈2×10^5 に収まります。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "線形探索は先頭から順に比較する最も基本の探索。ソート不要で、どんな並びでも使える",
          "計算量は O(N)（最悪=末尾/不在で N 回比較）。空間は O(1)",
          "Python 実装は for+break / enumerate。全要素を漏れなく調べるので正しさが保証される",
          "list への in / index も中身は線形探索で O(N)。index は不在時に ValueError",
          "何度も存在判定するなら set(平均 O(1))・キー参照は dict にして O(N×Q)→O(N+Q) に落とす",
        ]}
      />
    </>
  );
}

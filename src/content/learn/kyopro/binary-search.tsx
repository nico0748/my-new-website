import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "binary-search",
  title: "二分探索",
  description: "ソート済み配列の中央と比較して探索範囲を毎回半分に絞り込む O(log N) の探索。自前実装(lo, hi, mid)と標準ライブラリ bisect(bisect_left/bisect_right)の両方、さらに「答えで二分探索（めぐる式）」まで、境界の設計と無限ループを避けるコツを含めて詳しく解説します。",
  domain: "kyopro",
  section: "search-basics",
  order: 2,
  level: "basic",
  tags: ["探索", "二分探索", "計算量"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>二分探索（binary search）</strong>は、<strong>ソート済み</strong>の配列に対して、
        真ん中の要素と目的の値を比べ、探す範囲を<strong>毎回半分に捨てていく</strong>探索です。
        線形探索の O(N) を <strong>O(log N)</strong> に激減させる、競プロで最重要のテクニックの一つ。
        本記事では自前実装・標準ライブラリ <Cmd>bisect</Cmd>・そして応用の「答えで二分探索」までを扱います。
      </Lead>

      <Section>概要 — 何を、いつ使うか</Section>
      <p>
        辞書で単語を引くとき、真ん中を開いて「もっと前」「もっと後ろ」と半分ずつ絞りますよね。あれが二分探索です。
        ただし<strong>ソートされていることが絶対条件</strong>です。並んでいるからこそ「中央より大きい/小さい」で
        片側をまるごと捨てられます。
      </p>
      <KVList
        items={[
          { key: "使う場面", val: "ソート済み配列での高速検索 / 挿入位置の特定 / 単調な条件を満たす境界探し" },
          { key: "前提条件", val: "対象がソート済み（昇順など単調）であること" },
          { key: "強み", val: "N=10^9 でも約30回の比較で決着（log2(10^9)≈30）" },
        ]}
      />

      <Section>計算量 — なぜ O(log N) なのか</Section>
      <p>
        1 回の比較で探索範囲が<strong>半分</strong>になります。N 個から始めて N → N/2 → N/4 → … と減り、
        範囲が 1 になるまでの回数が計算量です。「N を何回 2 で割ると 1 になるか」は
        <strong>log₂N</strong> なので、時間計算量は <Cmd>O(log N)</Cmd>。
      </p>
      <ComparisonTable
        headers={["N（要素数）", "線形探索 O(N)", "二分探索 O(log N)"]}
        rows={[
          ["1,000", "最悪 1,000 回", "約 10 回"],
          ["1,000,000", "最悪 100 万回", "約 20 回"],
          ["1,000,000,000", "最悪 10 億回", "約 30 回"],
        ]}
      />
      <p>
        N が 10 億でもたった 30 回。指数的に増えるデータに対して対数的にしか増えない――この差が競プロでの威力です。
        空間計算量は自前実装（反復）なら <Cmd>O(1)</Cmd> です。
      </p>
      <Callout variant="warn" title="前提を忘れずに: ソート込みのコスト">
        二分探索そのものは O(log N) ですが、<strong>未ソートなら先にソートが必要</strong>で、これは O(N log N)。
        「1 回だけ探す」なら線形探索 O(N) の方が速いこともあります。二分探索が効くのは
        <strong>ソート済みを何度も検索する</strong>ときです。
      </Callout>

      <Section>仕組み・なぜ動くか</Section>
      <p>
        探索範囲を左端 <Cmd>lo</Cmd>・右端 <Cmd>hi</Cmd> で表し、中央 <Cmd>mid</Cmd> を調べます。
      </p>
      <StepFlow
        steps={[
          { title: "中央を見る", desc: "mid = (lo + hi) // 2 の要素を目的値と比較" },
          { title: "一致したら終了", desc: "a[mid] == target ならその位置を返す" },
          { title: "小さければ右半分へ", desc: "a[mid] < target なら答えは mid より右。lo = mid + 1" },
          { title: "大きければ左半分へ", desc: "a[mid] > target なら答えは mid より左。hi = mid - 1" },
          { title: "範囲が尽きたら不在", desc: "lo > hi になったら見つからなかった" },
        ]}
        caption="毎回、中央との大小で片側（半分）を丸ごと捨てる"
      />
      <p>
        正しさの鍵は<strong>不変条件</strong>です。「もし target が存在するなら、必ず <Cmd>[lo, hi]</Cmd> の中にある」
        という条件を全ステップで保ちます。<Cmd>a[mid] &lt; target</Cmd> なら mid 以下は答えになり得ないので
        <Cmd>lo = mid + 1</Cmd>、逆なら <Cmd>hi = mid - 1</Cmd>。範囲を必ず縮めながら不変条件を守るので、
        有限回で決着し、答えを取りこぼしません。
      </p>

      <Section>Python 実装 — 自前（lo, hi, mid）</Section>
      <Code lang="python" filename="binary_search.py">{`def binary_search(a, target):
    """ソート済み a から target の位置を返す。無ければ -1。"""
    lo, hi = 0, len(a) - 1          # 閉区間 [lo, hi] を範囲とする
    while lo <= hi:                 # 範囲が空でない間くり返す
        mid = (lo + hi) // 2        # 中央（切り捨て）
        if a[mid] == target:
            return mid              # 見つかった
        elif a[mid] < target:
            lo = mid + 1            # 答えは右半分 → 左端を mid の1つ右へ
        else:
            hi = mid - 1            # 答えは左半分 → 右端を mid の1つ左へ
    return -1                       # lo > hi: 見つからなかった

data = [1, 3, 4, 6, 8, 9, 11]      # 昇順ソート済みであること！
print(binary_search(data, 8))       # -> 4
print(binary_search(data, 5))       # -> -1`}</Code>
      <Callout variant="tip" title="オーバーフロー回避の書き方（Python では不要だが定番）">
        他言語では <Cmd>(lo + hi)</Cmd> が桁あふれするため <Cmd>mid = lo + (hi - lo) // 2</Cmd> と書きます。
        Python の整数は多倍長なので <Cmd>(lo + hi) // 2</Cmd> で問題ありませんが、この癖を知っておくと安全です。
      </Callout>

      <Section>Python 実装 — 標準ライブラリ bisect</Section>
      <p>
        実戦では自前より <Cmd>bisect</Cmd> モジュールを使うのが確実で速いです。
        <strong>挿入すべき位置</strong>を O(log N) で返します。
      </p>
      <KVList
        items={[
          { key: "bisect_left(a, x)", val: "x を入れられる最も左の位置。x と等しい要素があればその手前を指す" },
          { key: "bisect_right(a, x)", val: "x を入れられる最も右の位置。x と等しい要素があればその直後を指す" },
          { key: "insort_left / right", val: "ソート順を保ったまま x を実際に挿入する（挿入自体は O(N)）" },
        ]}
      />
      <Code lang="python" filename="use_bisect.py">{`from bisect import bisect_left, bisect_right

a = [1, 3, 3, 3, 6, 8]

# 「存在するか」＋「位置」: bisect_left の結果を検証する
def index_of(a, x):
    i = bisect_left(a, x)
    if i < len(a) and a[i] == x:
        return i           # x が最初に現れる位置
    return -1              # 無い

print(index_of(a, 3))      # -> 1  （3 の最初の位置）
print(index_of(a, 5))      # -> -1

# x の個数 = 右端 - 左端（重複カウントの定番）
print(bisect_right(a, 3) - bisect_left(a, 3))  # -> 3

# 「x 以上で最小の要素」「x 以下で最大の要素」
i = bisect_left(a, 4)
print(a[i] if i < len(a) else None)   # x以上の最小: -> 6
j = bisect_right(a, 4) - 1
print(a[j] if j >= 0 else None)        # x以下の最大: -> 3`}</Code>

      <Section>応用 — 答えで二分探索（めぐる式）</Section>
      <p>
        二分探索は配列の値だけでなく、<strong>「答えそのもの」を範囲として探す</strong>のにも使えます。
        「条件を満たす最小/最大の値は？」という問題で、<strong>ある値を境に条件が False→True と単調に切り替わる</strong>
        とき、その境界を二分探索で求めます。競プロで頻出の<strong>めぐる式二分探索</strong>です。
      </p>
      <Code lang="python" filename="meguru.py">{`def meguru_bisect(is_ok, ng, ok):
    """is_ok(x) が False→True と単調変化するとき、True になる境界を返す。
    ng: 確実に False 側の値, ok: 確実に True 側の値。"""
    while abs(ok - ng) > 1:
        mid = (ok + ng) // 2
        if is_ok(mid):
            ok = mid       # 条件を満たす側を縮める
        else:
            ng = mid
    return ok

# 例: ソート済み a で「x 以上になる最小の位置」を求める
a = [1, 3, 4, 6, 8, 9, 11]
x = 5
def is_ok(i):
    return a[i] >= x
# ng=-1（絶対に満たさない番兵）, ok=len(a)-... ここでは範囲を [ -1, len(a) ]
print(meguru_bisect(is_ok, -1, len(a) - 1))  # -> 3 （a[3]=6 が最初の x以上）`}</Code>
      <Callout variant="info" title="めぐる式のうれしさ">
        <Cmd>ng</Cmd> と <Cmd>ok</Cmd> の初期値を「絶対に条件を満たさない値 / 満たす値」と決めるだけで、
        境界のどちらを含むか（&lt; か ≤ か）で悩まなくなります。「最小化・最大化問題を判定問題に落とす」典型手法です。
      </Callout>

      <Section>落とし穴</Section>
      <Callout variant="danger" title="ソートされていないと壊れる">
        二分探索は<strong>単調（ソート済み）</strong>を前提に片側を捨てます。未ソートの配列に使うと、
        捨てた側に答えがあっても気づけず、<strong>存在するのに -1 を返す</strong>誤りが起きます。
        使う前に必ず <Cmd>a.sort()</Cmd> 済みか確認しましょう。
      </Callout>
      <Callout variant="warn" title="境界と無限ループ">
        <p>
          最頻出のバグは<strong>更新式の誤り</strong>です。<Cmd>lo = mid + 1</Cmd> / <Cmd>hi = mid - 1</Cmd> の
          <Cmd>+1 / -1</Cmd> を落とすと、範囲が縮まらず<strong>無限ループ</strong>になります。
          閉区間 <Cmd>[lo, hi]</Cmd>（<Cmd>while lo &lt;= hi</Cmd>）で書くなら必ず mid をまたいで動かします。
        </p>
        <ul>
          <li>閉区間: <Cmd>while lo &lt;= hi</Cmd> / <Cmd>lo = mid+1</Cmd> / <Cmd>hi = mid-1</Cmd></li>
          <li>半開区間: <Cmd>while lo &lt; hi</Cmd> / <Cmd>lo = mid+1</Cmd> / <Cmd>hi = mid</Cmd>（hi は縮めるだけ）</li>
          <li>流儀を混ぜない。どちらか一方に統一するのがバグ回避の近道</li>
        </ul>
      </Callout>
      <Callout variant="tip" title="実戦では bisect を第一選択に">
        自前実装は境界ミスの温床です。値の検索・個数・以上/以下の要素なら、まず <Cmd>bisect_left / bisect_right</Cmd>
        で書けないか考えるとバグが激減します。自前が要るのは「答えで二分探索」など bisect で書けない場面です。
      </Callout>

      <Bridge course="分割統治法 / 計算量理論（アルゴリズムとデータ構造）">
        <p>
          二分探索は<strong>分割統治（divide and conquer）</strong>の最小例です。問題を半分に割り、
          片方だけを再帰的に解く――マージソートやクイックソートと同じ骨格を持ちます。計算量が
          <Cmd>O(log N)</Cmd> になるのは、<strong>漸化式 T(N) = T(N/2) + O(1)</strong> を解いた結果で、
          これはマスター定理で扱う典型パターンです。また「最小化問題を <strong>判定問題（is_ok が単調か）</strong>に
          変換して境界を探す」という発想（めぐる式）は、単調性さえ示せれば探索に落とせるという、
          アルゴリズム設計の強力な視点です。<strong>ソート済みという構造が O(N)→O(log N) を生む</strong>点も、
          「データ構造・前処理が計算量を決める」という前章からの一貫したテーマです。
        </p>
      </Bridge>

      <Quiz
        question="ソート済みリスト a に値 x が何個含まれるかを O(log N) で求める式はどれ？"
        options={[
          <><Cmd>a.count(x)</Cmd></>,
          <><Cmd>bisect_right(a, x) - bisect_left(a, x)</Cmd></>,
          <><Cmd>bisect_left(a, x) + bisect_right(a, x)</Cmd></>,
          <><Cmd>len(a) - bisect_left(a, x)</Cmd></>,
        ]}
        answer={1}
        explanation={<><Cmd>bisect_left</Cmd> は x が最初に入る位置、<Cmd>bisect_right</Cmd> は x の直後の位置なので、その差が x の個数です。<Cmd>a.count(x)</Cmd> は正しい値を返しますが線形走査で O(N) です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "二分探索はソート済み配列で中央と比較し、範囲を毎回半分に捨てる。計算量 O(log N)（N=10億でも約30回）",
          "前提はソート済み（単調）。未ソートなら先に O(N log N) のソートが要る",
          "自前実装は閉区間 [lo,hi] で lo=mid+1 / hi=mid-1。+1/-1 を落とすと無限ループ",
          "実戦は bisect_left / bisect_right が確実。存在判定・個数・以上/以下の要素が O(log N) で書ける",
          "「答えで二分探索（めぐる式）」は、is_ok が False→True と単調なら最小化/最大化を判定問題に落とせる",
        ]}
      />
    </>
  );
}

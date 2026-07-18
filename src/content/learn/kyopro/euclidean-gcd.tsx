import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "euclidean-gcd",
  title: "ユークリッドの互除法",
  description: "2数の最大公約数(GCD)を高速に求めるユークリッドの互除法。gcd(a,b)=gcd(b, a%b) がなぜ成り立つのか、計算量が O(log min(a,b)) になる理由、再帰・ループ・math.gcd の3実装、最小公倍数(LCM)への応用までを整理する。",
  domain: "kyopro",
  section: "search-basics",
  order: 6,
  level: "basic",
  tags: ["数論", "GCD"],
  updated: "2026-07-07",
  minutes: 13,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>最大公約数（GCD: Greatest Common Divisor）</strong>を求めるのに、約数を全部調べる必要はありません。
        <strong>ユークリッドの互除法</strong>を使えば、たった数回の割り算で答えが出ます。仕組みは
        <Cmd>gcd(a, b) = gcd(b, a % b)</Cmd> というたった1行の漸化式。約分・周期・格子点など、数論系の問題で土台になります。
      </Lead>

      <Section>概要 — 「割った余りに置き換える」を繰り返す</Section>
      <p>
        ユークリッドの互除法は、2数のうち大きい方を<strong>「小さい方で割った余り」に置き換える</strong>操作を、
        余りが 0 になるまで繰り返すアルゴリズムです。余りが 0 になった瞬間の割る数が GCD になります。
      </p>
      <KVList
        items={[
          { key: "核心の式", val: "gcd(a, b) = gcd(b, a % b)（b が 0 になったら a が答え）" },
          { key: "入力", val: "非負整数 a, b" },
          { key: "出力", val: "a と b の最大公約数（両方を割り切る最大の正整数）" },
          { key: "計算量", val: "O(log min(a, b))。数十億の値でも数十回で終わる" },
        ]}
      />
      <SubSection>手で追う例（gcd(48, 18)）</SubSection>
      <Code lang="text" filename="計算の流れ">{`gcd(48, 18)
= gcd(18, 48 % 18) = gcd(18, 12)
= gcd(12, 18 % 12) = gcd(12, 6)
= gcd(6,  12 % 6)  = gcd(6, 0)
= 6   ← 余りが 0 になった。答えは 6`}</Code>

      <Section>計算量 — なぜ O(log) と速いのか</Section>
      <p>
        1 ステップごとに大きい方が「小さい方で割った余り」に変わります。ここで重要なのは、
        <strong>2 ステップ進むと大きい方の値が必ず半分以下になる</strong>という性質です。
        値が半分ずつ減っていくので、初期値 N に対してステップ数は <Cmd>log N</Cmd> のオーダー、
        つまり <strong>O(log min(a, b))</strong> に収まります。
      </p>
      <Callout variant="info" title="半分以下になる理由（直感）">
        余り <Cmd>a % b</Cmd> は必ず b 未満です。もし <Cmd>a % b</Cmd> が b/2 以上なら、次のステップで b を割った余りは一気に小さくなります。
        場合分けすると、2ステップで大きい方は必ず 1/2 未満になります。最悪ケースは<strong>連続するフィボナッチ数</strong>のときで、
        ちょうど log のステップ数になることが知られています。
      </Callout>
      <ComparisonTable
        headers={["方法", "計算量", "備考"]}
        rows={[
          [<>約数を全列挙して比較</>, <>O(min(a, b))</>, <>10^9 だと間に合わない</>],
          [<>ユークリッドの互除法</>, <>O(log min(a, b))</>, <>10^18 でも一瞬</>],
        ]}
      />

      <Section>仕組み・なぜ — 剰余で共通約数が保たれる</Section>
      <p>
        なぜ <Cmd>gcd(a, b) = gcd(b, a % b)</Cmd> が成り立つのか。鍵は<strong>「a と b の共通約数の集合」と「b と a%b の共通約数の集合」が完全に一致する</strong>ことです。
      </p>
      <SubSection>共通約数が変わらない証明</SubSection>
      <p>
        <Cmd>a = q * b + r</Cmd>（q は商、r は余り <Cmd>a % b</Cmd>）と書けます。
      </p>
      <KVList
        items={[
          { key: "d が a と b を割る ⇒ d は r も割る", val: "r = a − q*b。a も b も d の倍数なら、その差 r も d の倍数" },
          { key: "d が b と r を割る ⇒ d は a も割る", val: "a = q*b + r。b も r も d の倍数なら、その和 a も d の倍数" },
        ]}
      />
      <p>
        つまり「a と b の公約数」＝「b と r の公約数」なので、その中の最大値である GCD も等しくなります。
        そして毎回 r は b より小さくなる（<strong>単調減少</strong>する）ので、有限回で必ず余り 0 に到達し、
        止まったときの割る数が答えになります。
      </p>

      <Section>Python 実装 — 再帰 / ループ / 標準ライブラリ</Section>
      <SubSection>再帰版（式そのまま）</SubSection>
      <Code lang="python" filename="再帰でのGCD">{`def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

print(gcd(48, 18))  # 6
print(gcd(18, 48))  # 6（大小が逆でも1回目の余りで自動的に入れ替わる）`}</Code>
      <p>
        <Cmd>gcd(18, 48)</Cmd> のように「小さい方が先」でも大丈夫です。1 回目で <Cmd>18 % 48 == 18</Cmd> となり
        <Cmd>gcd(48, 18)</Cmd> に化けるので、自動的に大きい方が前に来ます。
      </p>
      <SubSection>ループ版（再帰の深さを気にしない）</SubSection>
      <Code lang="python" filename="ループでのGCD">{`def gcd(a, b):
    while b:
        a, b = b, a % b   # 同時代入で「b と a%b」に置き換える
        # while b: は「b が 0 でない間」の意味
    return a

print(gcd(1071, 1029))  # 21`}</Code>
      <SubSection>標準ライブラリ（本番はこれで十分）</SubSection>
      <Code lang="python" filename="math.gcd / math.lcm">{`import math

print(math.gcd(48, 18))      # 6
print(math.gcd(0, 5))        # 5（片方が0なら他方が答え）

# 3個以上の GCD は reduce でまとめられる
from functools import reduce
nums = [24, 36, 60]
print(reduce(math.gcd, nums))  # 12

# LCM（最小公倍数）も標準にある（Python 3.9+）
print(math.lcm(4, 6))          # 12`}</Code>
      <Callout variant="tip" title="本番は math.gcd を使う">
        仕組みを理解したら、コンテストでは <Cmd>math.gcd</Cmd> を使うのが安全・確実です。自前実装は「なぜ動くか」を説明できるようにしておく用と割り切ってOKです。
      </Callout>

      <Section>最小公倍数（LCM）への応用</Section>
      <p>
        GCD が分かれば<strong>最小公倍数（LCM: Least Common Multiple）</strong>も一発で出ます。次の関係があるからです。
      </p>
      <Code lang="python" filename="LCM の計算">{`import math

def lcm(a, b):
    return a // math.gcd(a, b) * b   # ← a // gcd してから b を掛ける

print(lcm(4, 6))    # 12`}</Code>
      <Callout variant="warn" title="順序に注意：先に割ってから掛ける">
        <p>
          <Cmd>a * b // gcd(a, b)</Cmd> と書くと、<Cmd>a * b</Cmd> が巨大になりオーバーフロー（他言語）や桁増大の原因になります。
          Python 自体は多倍長整数なので壊れませんが、習慣として<strong>先に割ってから掛ける</strong>
          <Cmd>a // gcd(a, b) * b</Cmd> の順を守ると、他言語でも安全でメモリ効率も良くなります。
        </p>
        <p>a は必ず gcd で割り切れるので、この順序でも結果は正確です。</p>
      </Callout>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "約分", val: "分数 a/b を gcd で割ると既約分数になる（a//g, b//g）" },
          { key: "周期・タイミング合わせ", val: "周期 p と q が同時に揃うのは lcm(p, q) ステップ後" },
          { key: "格子・直線上の点", val: "(0,0) から (dx,dy) の線分上にある格子点の個数は gcd(|dx|,|dy|)+1" },
          { key: "互いに素の判定", val: "gcd(a, b) == 1 なら a と b は互いに素（coprime）" },
          { key: "配列全体のGCD", val: "reduce(math.gcd, arr) で複数要素の共通因子を求める" },
        ]}
      />

      <Bridge course="数論 / 計算量（初等整数論・対数オーダー）">
        <p>
          互除法は<strong>初等整数論</strong>の出発点です。「共通約数の集合が剰余で保たれる」性質は、
          発展させると<strong>拡張ユークリッドの互除法</strong>（<Cmd>ax + by = gcd(a, b)</Cmd> を満たす x, y を求める）になり、
          <strong>モジュラ逆元</strong>や<strong>中国剰余定理（CRT）</strong>など、暗号（RSA）にもつながる基礎です。
        </p>
        <p>
          また「値が定数倍ずつ減るから対数回で終わる」という解析は、<strong>計算量</strong>で学ぶ
          <Cmd>O(log N)</Cmd> の典型で、二分探索と同じ「毎回スケールが縮む」構造です。最悪がフィボナッチ数列で達成される点も有名です。
        </p>
      </Bridge>

      <Quiz
        question="gcd(a, b) = gcd(b, a % b) を繰り返すユークリッドの互除法の計算量は？"
        options={[
          <>O(min(a, b))</>,
          <>O(log min(a, b))</>,
          <>O(a * b)</>,
          <>O(sqrt(a))</>,
        ]}
        answer={1}
        explanation={<>2 ステップ進むごとに大きい方の値が半分以下になるため、ステップ数は値の桁数に比例し O(log min(a, b)) です。最悪ケースは連続するフィボナッチ数のときに現れます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "核心は gcd(a, b) = gcd(b, a % b)。余りが 0 になったときの割る数が GCD",
          "計算量は O(log min(a, b))。約数全列挙 O(N) より圧倒的に速い（2ステップで半分以下）",
          "成り立つ理由：a と b の公約数の集合が b と a%b の公約数の集合と完全一致するから",
          "実装は再帰 / while b: のループ / math.gcd の3通り。本番は math.gcd が安全",
          "LCM は a // gcd(a, b) * b（先に割ってから掛ける）。約分・周期・格子点に応用できる",
        ]}
      />
    </>
  );
}

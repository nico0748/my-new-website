import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "primes",
  title: "素数判定とエラトステネスの篩",
  description: "1つの数が素数かを O(√N) の試し割りで判定し、N 以下の素数を O(N log log N) のエラトステネスの篩で列挙し、素因数分解を O(√N) で行う。3つの実装と、√N まで・is_prime[0]/[1]・i*i<=n という定番の落とし穴を整理する。",
  domain: "kyopro",
  section: "search-basics",
  order: 7,
  level: "basic",
  tags: ["数論", "素数", "篩"],
  updated: "2026-07-07",
  minutes: 15,
};

export default function Article() {
  return (
    <>
      <Lead>
        素数がらみの問題は「1個だけ判定したいのか」「範囲内を全部列挙したいのか」で使う道具が変わります。
        単発なら<strong>試し割り O(√N)</strong>、範囲なら<strong>エラトステネスの篩 O(N log log N)</strong>。
        この2つと<strong>素因数分解 O(√N)</strong>を、実装と落とし穴つきで押さえます。
      </Lead>

      <Section>概要 — 3つの道具を使い分ける</Section>
      <KVList
        items={[
          { key: "素数判定（1個）", val: "その数 N が素数か。2 から √N まで割り切れる数を探す。O(√N)" },
          { key: "素数列挙（範囲）", val: "N 以下の素数を全部。エラトステネスの篩。O(N log log N)" },
          { key: "素因数分解（1個）", val: "N を素数の積に分解。2 から √N まで割り続ける。O(√N)" },
        ]}
      />
      <p>
        素数とは、<strong>1 と自分自身以外に約数を持たない 2 以上の整数</strong>です。1 は素数ではありません（約数が1つしかない）。
        2 は唯一の偶数の素数です。
      </p>

      <Section>計算量 — なぜ √N まで見れば十分か</Section>
      <p>
        N が合成数（素数でない）なら、必ず <strong>√N 以下の約数</strong>を持ちます。なぜなら、もし約数 a, b（<Cmd>N = a * b</Cmd>）の
        両方が √N より大きいと、積 <Cmd>a * b</Cmd> が N を超えてしまい矛盾するからです。
        したがって「2 から √N まで」に割り切れる数が1つも無ければ、N は素数だと確定します。調べる範囲が √N までなので O(√N) です。
      </p>
      <ComparisonTable
        headers={["やりたいこと", "アルゴリズム", "計算量"]}
        rows={[
          [<>1つの数の素数判定</>, <>試し割り（2〜√N）</>, <>O(√N)</>],
          [<>N 以下の素数を全列挙</>, <>エラトステネスの篩</>, <>O(N log log N)</>],
          [<>1つの数の素因数分解</>, <>2〜√N で割り続ける</>, <>O(√N)</>],
        ]}
      />
      <Callout variant="info" title="O(N log log N) は「ほぼ O(N)」">
        篩の計算量にある <Cmd>log log N</Cmd> は、N が 10^8 でも 3 程度にしかならない、非常にゆっくり増える項です。
        実質「N にほぼ比例」と考えて構いません。100 万程度までの素数列挙なら一瞬で終わります。
      </Callout>

      <Section>実装1 — 素数判定（試し割り O(√N)）</Section>
      <Code lang="python" filename="is_prime">{`def is_prime(n):
    if n < 2:
        return False          # 0, 1, 負の数は素数でない
    i = 2
    while i * i <= n:         # i が √n 以下の間だけ調べる
        if n % i == 0:
            return False      # 割り切れたら合成数
        i += 1
    return True               # 最後まで割れなければ素数

print(is_prime(1))    # False
print(is_prime(2))    # True
print(is_prime(97))   # True
print(is_prime(100))  # False`}</Code>
      <Callout variant="warn" title="ループ条件は i*i <= n（√ を直接使わない）">
        <p>
          終了条件は <Cmd>{"while i * i <= n"}</Cmd> と書くのが定石です。<Cmd>math.sqrt(n)</Cmd> は<strong>浮動小数点</strong>なので、
          ちょうど平方数のとき誤差で 1 ずれて判定を取りこぼす恐れがあります。整数どうしの掛け算 <Cmd>i * i</Cmd> なら誤差ゼロで安全です。
        </p>
        <p>また <Cmd>{"n < 2"}</Cmd> を <strong>False</strong> にする先頭ガードを忘れると、0 や 1 を素数と誤判定します。</p>
      </Callout>

      <Section>実装2 — エラトステネスの篩（O(N log log N)）</Section>
      <p>
        範囲内の素数を全部欲しいときは、<strong>篩（ふるい）</strong>を使います。アイデアは「素数を見つけたら、その<strong>倍数</strong>を
        まとめて『素数でない』と消していく」こと。2 の倍数、3 の倍数…と消していけば、最後まで消されずに残った数が素数です。
      </p>
      <Code lang="python" filename="エラトステネスの篩">{`def sieve(n):
    # is_prime[k] = k が素数か。長さ n+1 で n も含める
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False   # 0 と 1 は素数でない

    i = 2
    while i * i <= n:                    # √n まで見れば十分
        if is_prime[i]:
            # i*i から開始（i未満の倍数は既に消えている）
            for j in range(i * i, n + 1, i):
                is_prime[j] = False       # i の倍数を消す
        i += 1

    # True のまま残ったものが素数
    return [k for k in range(n + 1) if is_prime[k]]

print(sieve(30))
# [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]`}</Code>
      <SubSection>2つの高速化ポイント</SubSection>
      <KVList
        items={[
          { key: "消し始めは i*i から", val: "2i, 3i… は 2 や 3 の段階で既に消えている。i*i から始めると無駄が減る" },
          { key: "回すのは √n まで", val: "√n より大きい i の倍数は、より小さい素因数で既に消えている" },
        ]}
      />
      <Callout variant="danger" title="篩の最頻出バグ 3 つ">
        <ul>
          <li><strong>長さが足りない</strong>：<Cmd>[True] * (n + 1)</Cmd> と<strong>+1</strong>しないと、添字 n が範囲外になる（<Cmd>IndexError</Cmd>）。</li>
          <li><strong>0 と 1 を消し忘れる</strong>：<Cmd>is_prime[0] = is_prime[1] = False</Cmd> を必ず入れる。忘れると 1 が素数扱いに。</li>
          <li><strong>内側ループの開始位置</strong>：<Cmd>range(i * i, n + 1, i)</Cmd> の終端も <strong>n + 1</strong>（n を含める）。</li>
        </ul>
      </Callout>

      <Section>実装3 — 素因数分解（O(√N)）</Section>
      <p>
        素因数分解も「2 から √N まで割れるだけ割る」で求まります。割り切れる限り同じ素因数で割り続け、最後に残った数が
        1 より大きければ、それ自体が（√N より大きい）素因数です。
      </p>
      <Code lang="python" filename="factorize">{`def factorize(n):
    factors = {}                 # 素因数 -> 指数
    i = 2
    while i * i <= n:
        while n % i == 0:        # i で割れる限り割り続ける
            factors[i] = factors.get(i, 0) + 1
            n //= i
        i += 1
    if n > 1:                    # 残った n は √n より大きい素因数
        factors[n] = factors.get(n, 0) + 1
    return factors

print(factorize(360))   # {2: 3, 3: 2, 5: 1}  → 360 = 2^3 * 3^2 * 5
print(factorize(97))    # {97: 1}             → 97 は素数`}</Code>
      <Callout variant="tip" title="最後の n > 1 の一行を忘れない">
        ループは √N までしか回らないため、N がちょうど大きな素数を1つ含むとき（例：14 = 2 × 7 の 7）は
        ループ内で拾えません。<strong>ループ後に残った <Cmd>n</Cmd> が 1 より大きければ、それも素因数として足す</strong>
        この一行を忘れると分解結果が不完全になります。
      </Callout>

      <Section>具体例・使いどころ</Section>
      <KVList
        items={[
          { key: "約数の個数・総和", val: "素因数分解 2^a * 3^b … から、約数の個数は (a+1)(b+1)…、総和も公式で計算" },
          { key: "多クエリの素数判定", val: "上限が決まっているなら篩で一括前計算し、各クエリは配列参照 O(1) に" },
          { key: "互いに素の判定", val: "素因数分解して共通の素因数が無ければ互いに素" },
          { key: "最小素因数テーブル", val: "篩の変形で各数の最小素因数を記録すると、分解が O(log N) に高速化" },
          { key: "エラトステネスの範囲", val: "N が 10^6〜10^7 程度なら篩、10^12 級の単発判定は試し割り" },
        ]}
      />

      <Bridge course="数論 / 計算量（初等整数論・素因数分解の一意性）">
        <p>
          「合成数は必ず √N 以下の約数を持つ」という観察は<strong>初等整数論</strong>の基本で、素因数分解の一意性
          （<strong>算術の基本定理</strong>：任意の 2 以上の整数は素数の積として一通りに書ける）を土台にしています。
          約数の個数・総和の公式もここから導かれます。
        </p>
        <p>
          篩の <Cmd>O(N log log N)</Cmd> は<strong>計算量</strong>で扱う調和級数の和（1/2 + 1/3 + 1/5 + …）から出ます。
          より大きな数の判定には<strong>Miller-Rabin 素数判定</strong>（確率的・多項式時間）や、暗号（RSA）が依存する
          <strong>素因数分解の困難性</strong>へと発展します。
        </p>
      </Bridge>

      <Quiz
        question="1つの整数 N が素数かどうかを判定するとき、割り算で試す範囲として十分なのは？"
        options={[
          <>2 から N - 1 まで</>,
          <>2 から N / 2 まで</>,
          <>2 から √N まで（i*i が N 以下の間）</>,
          <>2 から N まで</>,
        ]}
        answer={2}
        explanation={<>合成数 N には必ず √N 以下の約数があります（両方の約数が √N より大きいと積が N を超えて矛盾）。よって 2 から √N まで割り切れなければ素数と確定でき、計算量は O(√N) です。誤差を避けるため条件は i*i が N 以下、と整数のまま書きます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "1個の素数判定は試し割り O(√N)。合成数は必ず √N 以下の約数を持つのが根拠",
          "範囲の素数列挙はエラトステネスの篩 O(N log log N)。素数の倍数を消していく",
          "素因数分解は 2〜√N で割り続けて O(√N)。ループ後に残った n>1 も素因数として足す",
          "終了条件は i*i <= n（math.sqrt の浮動小数点誤差を避けるため整数で）",
          "篩の定番バグ：配列長は n+1、is_prime[0]=is_prime[1]=False、消し始めは i*i から",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Section, SubSection, Code, ComparisonTable, Callout, Cmd, Figure } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "python-paiza-cheatsheet",
  title: "Python 競プロチートシート",
  description:
    "標準入出力・型変換・ループ・内包表記・エラーの読み方・DP まで。競プロで使う Python の実践チートシート。",
  domain: "kyopro",
  section: "cheatsheet",
  order: 1,
  level: "intro",
  tags: ["Python", "競プロ"],
  updated: "2026-07-07",
  minutes: 30,
};

export default function Article() {
  return (
    <>
      {/* ── 1 ─────────────────────────────── */}
      <Section>1. 入力を受け取る</Section>

      <SubSection>
        <Cmd>{"input()"}</Cmd>
      </SubSection>
      <p>
        標準入力から <strong>1行</strong> を読み、末尾の改行を除いた <strong>文字列</strong>{" "}
        を返す。数値が欲しくても必ず <Cmd>{"int()"}</Cmd> などで変換が必要。
      </p>
      <Code lang="python" filename="input_basic.py">{`s = input()          # "5"  ← 文字列
n = int(input())     # 5    ← 整数`}</Code>
      <Callout variant="info">
        <Cmd>{"ValueError: invalid literal for int() with base 10: '1 1 2'"}</Cmd>{" "}
        が出たら「1行に複数の値が入っていた」の合図。
      </Callout>

      <SubSection>
        <Cmd>{".split()"}</Cmd>
      </SubSection>
      <p>文字列を空白で区切って <strong>リスト</strong> にする。</p>
      <Code lang="python" filename="split.py">{`"1 4 down gloves".split()     # ['1', '4', 'down', 'gloves']
"a,b,c".split(",")            # ['a', 'b', 'c']   区切り文字を指定`}</Code>
      <ul>
        <li>
          引数なしの <Cmd>{"split()"}</Cmd> は連続空白・タブ・改行をまとめて処理してくれる（一番安全）
        </li>
        <li>
          <strong>返ってくるのは全部 str</strong>。<Cmd>{'d == 0'}</Cmd> ではなく{" "}
          <Cmd>{'d == "0"'}</Cmd> と比較すること
        </li>
      </ul>

      <SubSection>
        <Cmd>{"map(関数, イテラブル)"}</Cmd>
      </SubSection>
      <p>各要素に関数を適用する。「文字列のリスト → 数値のリスト」の定番。</p>
      <Code lang="python" filename="map.py">{`map(int, ["1", "4"])          # 1, 4 （mapオブジェクト。そのままprintしても中身は見えない）`}</Code>
      <p>
        <Cmd>{"map"}</Cmd> は遅延評価なので、リストとして使いたければ <Cmd>{"list()"}</Cmd> で包む。
      </p>

      <SubSection>入力パターン別テンプレ</SubSection>
      <ComparisonTable
        headers={["入力の形", "書き方"]}
        rows={[
          [<>{"5"} （1個の整数）</>, <Cmd>{"n = int(input())"}</Cmd>],
          [<>{"5 3"} （1行に複数）</>, <Cmd>{"n, k = map(int, input().split())"}</Cmd>],
          [<>{"1 2 3 4 5"} （1行に配列）</>, <Cmd>{"a = list(map(int, input().split()))"}</Cmd>],
          ["縦にN行の整数", <Cmd>{"a = [int(input()) for _ in range(n)]"}</Cmd>],
          [
            <>縦にN行の <Cmd>{"L R"}</Cmd></>,
            <Cmd>{"p = [tuple(map(int, input().split())) for _ in range(n)]"}</Cmd>,
          ],
          ["縦にN行の文字列", <Cmd>{"s = [input() for _ in range(n)]"}</Cmd>],
          [
            <>混在 <Cmd>{"1 4 down gloves"}</Cmd></>,
            <><Cmd>{"r, c, d, s = input().split()"}</Cmd> してから <Cmd>{"int(r)"}</Cmd></>,
          ],
        ]}
      />
      <p>
        <strong>迷ったら最初に <Cmd>{"print(input())"}</Cmd> で実物を見る。</strong>{" "}
        これで大半の事故は防げる。
      </p>

      {/* ── 2 ─────────────────────────────── */}
      <Section>2. 出力する</Section>

      <SubSection>
        <Cmd>{"print()"}</Cmd>
      </SubSection>
      <Code lang="python" filename="print.py">{`print(a, b)            # スペース区切り
print(*A)              # リストをバラして渡す（アンパック）→ "51 18"
print(*A, sep=", ")    # 区切り文字を変える
print(*A, sep="\\n")    # 改行区切り
print("".join(row))    # 文字のリストを連結して1行に`}</Code>
      <ul>
        <li>
          <Cmd>{"print(A)"}</Cmd> は <Cmd>{"[51, 18]"}</Cmd> と括弧付きで出てしまう。
          <Cmd>{"print(*A)"}</Cmd> が正解
        </li>
        <li>
          <Cmd>{'" ".join(map(str, A))'}</Cmd> も同じ結果（<Cmd>{"join"}</Cmd> は str のリストしか
          受け取れないので <Cmd>{"map(str, ...)"}</Cmd> が必要）
        </li>
      </ul>

      <SubSection>文字列を作る小技</SubSection>
      <Code lang="python" filename="string_tricks.py">{`"A" * k + "B" * (W - k)      # "AAABB" のような繰り返しは掛け算で一発
"\\n".join(rows)              # 複数行をまとめて1つの文字列に
"#" * W                      # 区切り線など`}</Code>

      <SubSection>「溜めてから出力」パターン（重要）</SubSection>
      <p>
        「条件を満たさなければ <strong>1行も出力してはいけない</strong>」タイプの問題では、
        途中で <Cmd>{"print"}</Cmd> してはいけない。
        <strong>リストに溜めて、全部確定してから出力する。</strong>
      </p>
      <Code lang="python" filename="buffer_output.py">{`ok = True
rows = []
for _ in range(H):
    ...
    if ダメ:
        ok = False
    else:
        rows.append("A" * k + "B" * (W - k))

if ok:
    print("Yes")
    print("\\n".join(rows))
else:
    print("No")`}</Code>

      <SubSection>
        出力が多いときは <Cmd>{"sys.stdout.write"}</Cmd>
      </SubSection>
      <p>
        <Cmd>{"print"}</Cmd> を H 回呼ぶより、1回にまとめるほうが速い。
      </p>
      <Code lang="python" filename="stdout_write.py">{`import sys
sys.stdout.write("Yes\\n" + "\\n".join(rows) + "\\n")   # 末尾の改行を忘れずに`}</Code>

      {/* ── 3 ─────────────────────────────── */}
      <Section>3. 基本の型と変換</Section>
      <ComparisonTable
        headers={["関数", "役割"]}
        rows={[
          [<Cmd>{"int(x)"}</Cmd>, "整数に変換"],
          [<Cmd>{"str(x)"}</Cmd>, "文字列に変換"],
          [<Cmd>{"list(x)"}</Cmd>, "リストに変換"],
          [<Cmd>{"tuple(x)"}</Cmd>, "タプル（変更不可のリスト）に変換"],
          [<Cmd>{"set(x)"}</Cmd>, "集合に変換（重複が消える）"],
          [<Cmd>{"dict()"}</Cmd>, "辞書を作る"],
        ]}
      />

      <SubSection>
        <Cmd>{"tuple()"}</Cmd>
      </SubSection>
      <p>
        リストと似ているが <strong>変更できない</strong>。その代わり{" "}
        <strong>set や dict のキーに使える</strong>。
      </p>
      <Code lang="python" filename="tuple.py">{`watered.add((r, c))    # 座標を集合に入れる → タプルだから可能
                       # add([r, c]) はエラー（リストはキーにできない）`}</Code>

      <SubSection>
        <Cmd>{"set()"}</Cmd>
      </SubSection>
      <p>
        <strong>重複を自動で除く</strong> 集合。「ダブりを除いて数える」問題の定番。
      </p>
      <Code lang="python" filename="set.py">{`s = set()
s.add((2, 3))
s.add((2, 3))     # 2回目は無視される
len(s)            # 1

"a" in s          # 存在チェックが O(1) で速い（リストの in は O(N)）`}</Code>
      <p>集合演算も使える：</p>
      <Code lang="python" filename="set_ops.py">{`a | b   # 和集合    a & b   # 積集合
a - b   # 差集合    a ^ b   # 対称差`}</Code>

      {/* ── 4 ─────────────────────────────── */}
      <Section>4. ループの道具</Section>

      <SubSection>
        <Cmd>{"range()"}</Cmd>
      </SubSection>
      <Code lang="python" filename="range.py">{`range(5)          # 0 1 2 3 4
range(2, 5)       # 2 3 4
range(0, 10, 2)   # 0 2 4 6 8
range(5, 0, -1)   # 5 4 3 2 1  （逆順）
range(n - 2)      # i+2 までアクセスするときの上限`}</Code>
      <p>
        <Cmd>{"for _ in range(K):"}</Cmd> … カウンタを使わないループ（<Cmd>{"_"}</Cmd>{" "}
        は「使い捨て」の慣習）
      </p>

      <SubSection>
        <Cmd>{"enumerate()"}</Cmd>
      </SubSection>
      <p>インデックスと要素を <strong>同時に</strong> 取る。</p>
      <Code lang="python" filename="enumerate.py">{`for i, ch in enumerate(s):
    grid[r + i][c] = ch

for i, x in enumerate(A, start=1):   # 1始まりにもできる`}</Code>

      <SubSection>
        <Cmd>{"zip()"}</Cmd>
      </SubSection>
      <p>複数のリストを <strong>同時に</strong> 回す。</p>
      <Code lang="python" filename="zip.py">{`for x, y in zip(left, right):
    ...

A = [x + y for x, y in zip(left, right)]
trains = sorted(zip(L, R))           # 2本のリストをペアにまとめる`}</Code>

      <SubSection>使い分けの原則</SubSection>
      <Code lang="python" filename="loop_choice.py">{`for x in A:                  # 要素だけ欲しい → これ
for i, x in enumerate(A):    # 番号も欲しい → これ
for x, y in zip(A, B):       # 2本同時 → これ
for i in range(len(A)):      # 上のどれでもない添字計算が必要なときだけ`}</Code>

      {/* ── 5 ─────────────────────────────── */}
      <Section>5. 集計する関数</Section>
      <Code lang="python" filename="aggregate.py">{`sum(A)                        # 合計
max(A) / min(A)               # 最大 / 最小
max(A) - min(A)               # ばらつき
len(A)                        # 個数
sorted(A)                     # ソートした新しいリストを返す`}</Code>

      <SubSection>
        <Cmd>{"key"}</Cmd> 引数
      </SubSection>
      <Code lang="python" filename="key_arg.py">{`max(S, key=len)               # 一番長い「文字列そのもの」
sorted(A, key=lambda x: x[1]) # 2番目の要素でソート
sorted(A, key=abs)            # 絶対値でソート`}</Code>

      <SubSection>条件を満たす個数を数える定番</SubSection>
      <Code lang="python" filename="count_if.py">{`count = sum(1 for a in A if a >= K)      # 軽い（リストを作らない）
count = len([a for a in A if a >= K])    # 同じ結果`}</Code>

      <SubSection>
        <Cmd>{"any()"}</Cmd> / <Cmd>{"all()"}</Cmd>
      </SubSection>
      <Code lang="python" filename="any_all.py">{`any(x > 10 for x in A)     # 1つでも満たせば True
all(x > 10 for x in A)     # 全部満たせば True`}</Code>
      <p>
        False（<Cmd>{"all"}</Cmd>）や True（<Cmd>{"any"}</Cmd>）が確定した時点で打ち切るので速い。
      </p>

      {/* ── 6 ─────────────────────────────── */}
      <Section>6. リスト操作</Section>
      <Code lang="python" filename="list_methods.py">{`A.append(x)          # 末尾に追加
A.pop()              # 末尾を取り出して削除
A.pop(0)             # 先頭を取り出して削除（遅い。dequeを使うべき）
A.insert(i, x)       # i番目に挿入
A.remove(x)          # 値xを1つ削除（無いとエラー）
A.count(x)           # 値xの個数
A.index(x)           # 値xの位置（無いとエラー）
A.reverse()          # その場で反転
A.sort()             # その場でソート（返り値は None！）`}</Code>

      <SubSection>
        <Cmd>{".sort()"}</Cmd> と <Cmd>{"sorted()"}</Cmd> の違い（頻出の罠）
      </SubSection>
      <Code lang="python" filename="sort_vs_sorted.py">{`A.sort()             # A 自身を並び替える。返り値は None
B = sorted(A)        # A はそのまま、新しいリストが返る

B = A.sort()         # ← B は None になる。よくやるミス`}</Code>
      <p>オプション：</p>
      <Code lang="python" filename="sort_options.py">{`A.sort(reverse=True)          # 降順
A.sort(key=len)               # 長さ順
trains.sort()                 # タプルは (第1要素, 第2要素) の辞書順で比較される`}</Code>

      <SubSection>スライス</SubSection>
      <Code lang="python" filename="slice.py">{`A[2:5]        # 2〜4番目
A[:half]      # 先頭からhalf個
A[half:]      # half番目以降
A[::-1]       # 反転したコピー
A[:half][::-1]  # 前半を取って反転
A[i:i+3] == [1, 1, 2]   # 3連続のパターン照合`}</Code>

      <SubSection>1-indexed の区間 [s, e] をスライスする（頻出）</SubSection>
      <p>問題文の「s 番目から e 番目まで」（1始まり・両端含む）は：</p>
      <Code lang="python" filename="slice_1indexed.py">{`A[s-1:e]                 # ← 開始だけ -1、終端はそのまま
length = e - s + 1       # ← 本数は +1
sum(A[s-1:e])            # 区間の合計
for i in range(s-1, e):  # 区間を書き換えるループ
    A[i] += add`}</Code>
      <p>
        <strong>「開始だけ -1、終端はそのまま」</strong>と丸暗記してよい。
        スライスの終端は含まれないので、<Cmd>{"e"}</Cmd> と書くとちょうど <Cmd>{"e-1"}</Cmd>{" "}
        番目（0-indexed）まで取れる。
      </p>
      <Callout variant="warn">
        <strong>本数は <Cmd>{"e - s + 1"}</Cmd></strong>。<Cmd>{"range(e-s)"}</Cmd>{" "}
        にすると最後の1本が漏れて、合計だけ1本足りないのに正しい本数で割ってしまう、
        という気づきにくいバグになる。
      </Callout>

      <SubSection>ループ内で使う変数の初期化位置</SubSection>
      <Code lang="python" filename="init_position.py">{`total = 0                    # ✗ ループの外だと前回の値が残り続ける
for _ in range(Q):
    ...
    total += x

for _ in range(Q):
    total = 0                # ○ 区間ごとにリセット
    ...`}</Code>
      <p>
        「区間ごと」「行ごと」に集計する変数は、<strong>必ずループの中で初期化する</strong>。
      </p>

      {/* ── 7 ─────────────────────────────── */}
      <Section>7. 2次元グリッドの定番</Section>
      <Code lang="python" filename="grid_build.py">{`grid = [["."] * W for _ in range(H)]`}</Code>
      <p>これが <strong>クロスワード・盤面問題の基本形</strong>。分解すると：</p>
      <ol>
        <li>
          <Cmd>{'["."] * W'}</Cmd> … <Cmd>{'"."'}</Cmd> が W 個並んだ 1行分のリスト
        </li>
        <li>
          <Cmd>{"[... for _ in range(H)]"}</Cmd> … それを H 回作ってリストに詰める
        </li>
        <li>
          結果として <Cmd>{"grid[行][列]"}</Cmd> でアクセスできる H×W の表になる
        </li>
      </ol>

      <SubSection>やってはいけない書き方</SubSection>
      <Code lang="python" filename="grid_pitfall.py">{`grid = [["."] * W] * H       # ✗ 全行が同じリストの参照になる
grid[0][0] = "x"             #   → 全行の[0]が "x" に変わる

for _ in range(H):           # ✗ 毎回上書きされて1行しか残らない
    grid = [["."] * W]`}</Code>
      <p>
        必ず <strong>内包表記</strong> で作る。<Cmd>{"for _ in range(H)"}</Cmd>{" "}
        が毎回新しいリストを生成してくれるのがポイント。
      </p>
      <Callout variant="warn">
        なお <Cmd>{"#"}</Cmd> を使いたいときは <strong>必ずクォートで囲む</strong>。
        <Cmd>{"[[#] * W ...]"}</Cmd> と書くと <Cmd>{"#"}</Cmd>{" "}
        以降がコメント扱いになって構文エラーになる。
      </Callout>

      <SubSection>「作る」のか「読む」のかを見極める</SubSection>
      <ComparisonTable
        headers={["問題のタイプ", "やること"]}
        rows={[
          ["空の盤面に自分で書き込む（クロスワード等）", <Cmd>{'grid = [["."] * W for _ in range(H)]'}</Cmd>],
          ["盤面が 入力として与えられる（地上絵・迷路等）", <Cmd>{"grid = [input() for _ in range(H)]"}</Cmd>],
        ]}
      />
      <p>
        読み込むだけなら <strong>文字列のリストのままでOK</strong>。<Cmd>{"grid[r][c]"}</Cmd>{" "}
        でそのままアクセスできるので、わざわざ <Cmd>{"list(input())"}</Cmd>{" "}
        に分解する必要はない（書き換えが必要なときだけ分解する）。
      </p>

      <SubSection>出力</SubSection>
      <Code lang="python" filename="grid_output.py">{`for row in grid:
    print("".join(row))      # 文字を連結して1行ずつ`}</Code>

      <SubSection>数値グリッド・フラグ用</SubSection>
      <Code lang="python" filename="grid_numeric.py">{`grid = [[0] * W for _ in range(H)]
grid = [[False] * W for _ in range(H)]
sum(row.count(True) for row in grid)   # True の総数`}</Code>

      <SubSection>周囲8マス（+自分）を回る</SubSection>
      <Code lang="python" filename="around8.py">{`for dr in (-1, 0, 1):
    for dc in (-1, 0, 1):
        nr, nc = r + dr, c + dc
        if 0 <= nr < H and 0 <= nc < W:   # 範囲チェックを忘れない
            ...`}</Code>
      <p>
        8方向だけなら <Cmd>{"if dr == 0 and dc == 0: continue"}</Cmd> を入れる。
        4方向（上下左右）なら：
      </p>
      <Code lang="python" filename="around4.py">{`for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):`}</Code>

      <SubSection>方向を変数にまとめる</SubSection>
      <Code lang="python" filename="direction_var.py">{`dr, dc = (1, 0) if d == "down" else (0, 1)
grid[r + dr * i][c + dc * i] = ch`}</Code>

      <SubSection>3×3 の模様を探す（中心を全探索）</SubSection>
      <p>
        中心が端に来られないので、走査範囲を <strong>内側に1マス狭める</strong>のがポイント。
      </p>
      <Code lang="python" filename="pattern3x3.py">{`for r in range(1, H - 1):          # ← range(H) にしてはいけない
    for c in range(1, W - 1):
        if (grid[r-1][c-1:c+2] == "###"
                and grid[r][c-1:c+2] == "#.#"
                and grid[r+1][c-1:c+2] == "###"):
            count += 1`}</Code>
      <p>
        <Cmd>{"range(H)"}</Cmd> にすると <Cmd>{"grid[r-1]"}</Cmd> が{" "}
        <strong>負のインデックス（＝末尾を指す）</strong> になり、
        <strong>エラーが出ないまま間違った答えが出る</strong>ので特にたちが悪い。
      </p>

      <SubSection>1-indexed / 0-indexed</SubSection>
      <p>
        問題文は 1 始まり、Python は 0 始まり。<strong>どちらかに決めて絶対にブレさせない</strong>
        のが鉄則。方針は2つあり、問題によって使い分ける。
      </p>
      <p>
        <strong>方針A: 受け取った直後に 0-indexed へ変換</strong>（座標を扱う問題向き）
      </p>
      <Code lang="python" filename="to_0indexed.py">{`r, c = int(r) - 1, int(c) - 1`}</Code>
      <p>
        <strong>方針B: 添字0を捨てて 1-indexed のまま扱う</strong>（「番号がそのまま添字」の問題向き）
      </p>
      <Code lang="python" filename="keep_1indexed.py">{`size = [1] * (N + 1)          # size[0] は使わない（ダミー）
is_leader = [True] * (N + 1)

for i in range(1, N + 1):     # 1〜N を回す
    ...`}</Code>
      <p>
        出席番号・都市番号・頂点番号のように <strong>入力の値をそのまま添字に使いたい</strong>
        ときは方針Bが圧倒的に楽。<Cmd>{"+1"}</Cmd> を忘れると <Cmd>{"IndexError"}</Cmd>
        （N番目が入らない）になるので注意。
      </p>

      <SubSection>フラグ配列で「脱落」を管理する</SubSection>
      <p>
        「もう対象外になったもの」を消すのではなく、<strong>フラグを False にする</strong>のが定石。
        リストから <Cmd>{"remove"}</Cmd> すると添字がズレて事故る。
      </p>
      <Code lang="python" filename="flag_array.py">{`is_leader = [True] * (N + 1)
is_leader[b] = False                       # b は脱落

best = max(size[i] for i in range(1, N+1) if is_leader[i])   # 生存者だけ集計`}</Code>

      {/* ── 8 ─────────────────────────────── */}
      <Section>8. 特殊な組み方のテクニック</Section>
      <p>
        ここまで出てきた「1行に処理を畳み込む書き方」の総まとめ。
        <strong>関数の中に for や if を直接埋め込む</strong>
        書き方は競プロで最頻出なので、読めるようになると一気に楽になる。
      </p>

      <SubSection>8-1. 内包表記の基本構造</SubSection>
      <Code lang="python" filename="comprehension_anatomy.py">{`[  size[i]   for i in range(1, N+1)   if is_leader[i]  ]
    ↑③          ↑①                      ↑②
  何を出すか    何を回すか              何を通すか`}</Code>
      <p>
        <strong>書く順序と実行される順序が逆</strong>なのが最大の混乱ポイント。
        実行は <strong>① 回す → ② 絞る → ③ 変換する</strong> の順。読むときもこの順に読む。
      </p>
      <p>素朴なループに分解すると完全に等価：</p>
      <Code lang="python" filename="comprehension_expand.py">{`# 内包表記
result = [size[i] for i in range(1, N+1) if is_leader[i]]

# 同じ意味
result = []
for i in range(1, N + 1):        # ① 回す
    if is_leader[i]:             # ② 絞る
        result.append(size[i])   # ③ 変換して詰める`}</Code>
      <p>
        <strong>「append するだけの for ループ」は全部内包表記に畳める</strong> と覚えておく。
      </p>

      <SubSection>8-2. 4つの括弧の使い分け</SubSection>
      <ComparisonTable
        headers={["書き方", "名前", "結果"]}
        rows={[
          [<Cmd>{"[x for x in A]"}</Cmd>, "リスト内包表記", <Cmd>{"list"}</Cmd>],
          [<Cmd>{"{x for x in A}"}</Cmd>, "集合内包表記", <>{"set"}（重複が消える）</>],
          [<Cmd>{"{k: v for k, v in A}"}</Cmd>, "辞書内包表記", <Cmd>{"dict"}</Cmd>],
          [<Cmd>{"(x for x in A)"}</Cmd>, <strong>ジェネレータ式</strong>, "1個ずつ流す（リストを作らない）"],
        ]}
      />
      <Code lang="python" filename="four_brackets.py">{`[x * 2 for x in A]                    # 変換
[x for x in A if x > 0]               # フィルタ
[x * 2 for x in A if x > 0]           # 両方
{(r, c) for r, c in points}           # 重複を除いた座標集合
{s: len(s) for s in words}            # 文字列 → 長さ の辞書`}</Code>

      <SubSection>8-3. 関数の引数に直接埋め込む（ジェネレータ式）</SubSection>
      <p>
        <Cmd>{"max"}</Cmd> / <Cmd>{"min"}</Cmd> / <Cmd>{"sum"}</Cmd> / <Cmd>{"any"}</Cmd> /{" "}
        <Cmd>{"all"}</Cmd> / <Cmd>{"sorted"}</Cmd> の引数に渡すときは{" "}
        <strong>角括弧を省略できる</strong>。
      </p>
      <Code lang="python" filename="genexpr_arg.py">{`max(size[i] for i in range(1, N+1) if is_leader[i])     # ← 括弧なし
max([size[i] for i in range(1, N+1) if is_leader[i]])   # ← 括弧あり（同じ結果）`}</Code>
      <p>
        結果は同じだが、<strong>括弧なしはリストをメモリに作らず1個ずつ流す</strong>ので軽い。
        引数が1つだけのときは括弧を省略できるルールになっている（引数が2つ以上あるときは{" "}
        <Cmd>{"sum((x for x in A), 0)"}</Cmd> のように括弧が必要）。
      </p>
      <SubSection>頻出パターン集</SubSection>
      <Code lang="python" filename="genexpr_patterns.py">{`sum(1 for a in A if a >= K)              # 条件を満たす個数を数える
sum(x for x in A if x > 0)               # 条件付き合計
max(size[i] for i in range(1, N+1) if is_leader[i])   # 条件付き最大
any(x > 10 for x in A)                   # 1つでもあるか
all(grid[r+dr][c+dc] == "#" for dr in (-1,0,1) for dc in (-1,0,1))  # 全部そうか
sum(row.count(True) for row in grid)     # 2次元の集計
len({x for x in A})                      # 種類数
next((s for s in A if len(s) >= 5), None)  # 最初に見つかった1つ`}</Code>
      <SubSection>
        <Cmd>{"max()"}</Cmd> の空対策
      </SubSection>
      <p>
        候補が0個だと <Cmd>{"ValueError: max() arg is an empty sequence"}</Cmd> になる。
        「1つも残らない可能性がある」なら <Cmd>{"default"}</Cmd> を付ける。
      </p>
      <Code lang="python" filename="max_default.py">{`max((x for x in A if x > 100), default=0)`}</Code>

      <SubSection>8-4. 多重ループを1行に畳む</SubSection>
      <p>
        <Cmd>{"for"}</Cmd> は <strong>いくつでも並べられる</strong>。左から順に外側のループになる。
      </p>
      <Code lang="python" filename="nested_fold.py">{`# これと
for dr in (-1, 0, 1):
    for dc in (-1, 0, 1):
        ...

# これは同じ順序
[(dr, dc) for dr in (-1, 0, 1) for dc in (-1, 0, 1)]`}</Code>
      <p>条件も好きな位置に挟める：</p>
      <Code lang="python" filename="nested_fold_if.py">{`all(grid[r+dr][c+dc] == "#"
    for dr in (-1, 0, 1)
    for dc in (-1, 0, 1)
    if not (dr == 0 and dc == 0))       # 中心だけ除外`}</Code>
      <p>
        <strong>2次元グリッドの生成</strong>も、実は「変数を使わない多重ループ」：
      </p>
      <Code lang="python" filename="grid_as_nested.py">{`grid = [["."] * W for _ in range(H)]`}</Code>

      <SubSection>8-5. 三項演算子（条件式）</SubSection>
      <p>
        <Cmd>{"if / else"}</Cmd> を <strong>式</strong> として1行に書く。値を返すのがポイント。
      </p>
      <Code lang="python" filename="ternary.py">{`print("silver" if count >= 3 and total >= M else "bronze")
dr, dc = (1, 0) if d == "down" else (0, 1)`}</Code>
      <p>
        構造は <strong><Cmd>{"真のときの値 if 条件 else 偽のときの値"}</Cmd></strong>。
        条件が真ん中に来るので、英語の語順（「Aを出す、もしXなら、でなければB」）で読むと自然。
      </p>
      <p>内包表記と組み合わせると強力：</p>
      <Code lang="python" filename="ternary_comprehension.py">{`[x if x > 0 else 0 for x in A]        # 負の数を0にする（if が前！）
[x for x in A if x > 0]               # 負の数を捨てる（if が後ろ！）`}</Code>
      <Callout variant="info" title="if の位置で意味が変わる">
        <ul>
          <li>
            <Cmd>{"for"}</Cmd> より <strong>前</strong> の <Cmd>{"if"}</Cmd>{" "}
            → 三項演算子（値を置き換える。個数は変わらない）
          </li>
          <li>
            <Cmd>{"for"}</Cmd> より <strong>後ろ</strong> の <Cmd>{"if"}</Cmd>{" "}
            → フィルタ（要素を捨てる。個数が減る）
          </li>
        </ul>
        両方使うこともできる: <Cmd>{"[x*2 if x > 0 else 0 for x in A if x != 5]"}</Cmd>
      </Callout>

      <SubSection>
        8-6. アンパック（<Cmd>{"*"}</Cmd> と <Cmd>{","}</Cmd>）
      </SubSection>
      <Code lang="python" filename="unpack.py">{`print(*A)                     # リストをバラして引数に渡す
n, k = map(int, input().split())          # 複数の値を一度に受け取る
r, c, d, s = input().split()              # 個数が合わないとエラー
a, *rest = [1, 2, 3, 4]                   # a=1, rest=[2,3,4]
x, y = y, x                               # 入れ替え（一時変数不要）
size[a], is_leader[b] = size[a] + size[b], False   # 同時代入`}</Code>
      <p>
        <Cmd>{"f(*args)"}</Cmd>（リスト展開）、<Cmd>{"f(**kwargs)"}</Cmd>
        （辞書展開）として関数呼び出し一般で使える。
      </p>

      <SubSection>8-7. 真偽値の扱い</SubSection>
      <Code lang="python" filename="bool_style.py">{`if is_leader[i] == True:      # 冗長
if is_leader[i]:              # これで同じ

if is_leader[i] == False:     # 冗長
if not is_leader[i]:          # これで同じ`}</Code>
      <p>
        Python では <Cmd>{"True == 1"}</Cmd>、<Cmd>{"False == 0"}</Cmd> なので、
        <strong>足し算で数えられる</strong>：
      </p>
      <Code lang="python" filename="bool_sum.py">{`sum(is_leader)                          # True の個数
sum(a >= K for a in A)                  # 条件を満たす個数（sum(1 for ...) と同じ）`}</Code>
      <p>
        <strong>空のものは False 扱い</strong>（falsy）：
      </p>
      <Code lang="python" filename="falsy.py">{`if not A:            # リストが空なら
if not s:            # 文字列が空なら
if x:                # x が 0 以外なら`}</Code>

      <SubSection>8-8. 比較の連鎖</SubSection>
      <Code lang="python" filename="chained_compare.py">{`if 0 <= nr < H and 0 <= nc < W:      # 範囲チェックの定番
if 1 <= nr <= N:`}</Code>
      <p>
        <Cmd>{"0 <= nr and nr < H"}</Cmd> を短く書ける。Python 独自の便利機能で、
        他の言語からは書けない。
      </p>

      <SubSection>8-9. continue で早期脱出（ネストを浅くする）</SubSection>
      <Code lang="python" filename="guard_continue.py">{`for r in range(1, H-1):
    for c in range(1, W-1):
        if grid[r][c] != ".":
            continue                  # 早めに切り上げる
        if all(...):                  # ← インデントが深くならない
            count += 1`}</Code>
      <p>
        「条件に合わないものを先に弾く」書き方（ガード節）。
        <Cmd>{"if 条件: 処理"}</Cmd> を入れ子にしていくよりネストが浅く、読みやすい。
      </p>

      <SubSection>8-10. 「1行に畳む」の限界</SubSection>
      <p>
        内包表記は便利だが、<strong>畳みすぎると読めなくなる</strong>。目安：
      </p>
      <ComparisonTable
        headers={["状況", "判断"]}
        rows={[
          [<><Cmd>{"for"}</Cmd> 1個 + <Cmd>{"if"}</Cmd> 1個まで</>, "畳んでOK"],
          [<><Cmd>{"for"}</Cmd> 2個以上 + 複雑な条件</>, "素直にループを書く"],
          ["途中で複数の変数を更新する", "畳めない（ループを書く）"],
          ["デバッグしたい", "まずループで書いて、動いてから畳む"],
        ]}
      />
      <p>
        <strong>動くコードを書くのが最優先。</strong>{" "}
        慣れるまでは素朴なループで書いて、後から畳む練習をするのが安全。
      </p>

      {/* ── 9 ─────────────────────────────── */}
      <Section>9. 文字列を探す</Section>
      <Code lang="python" filename="string_search.py">{`"iza" in s            # 含むか（True/False）
s.find("iza")         # 位置。無ければ -1
s.index("iza")        # 位置。無ければ ValueError
s.rfind("a")          # 右から探す
s.count("a")          # 個数
s.startswith("pai")   # 前方一致
s.endswith("ive")     # 後方一致
s.find("a", 3, 8)     # 範囲指定`}</Code>
      <p>リストの中を探す：</p>
      <Code lang="python" filename="list_search.py">{`"pen" in A            # 存在チェック
A.index("pen")        # 位置（無いとエラー → 先に in で確認）`}</Code>
      <p>条件に合うものを探す：</p>
      <Code lang="python" filename="search_condition.py">{`next((s for s in A if len(s) >= 5), None)   # 最初の1つ。無ければ None
[s for s in A if "a" in s]                  # 全部`}</Code>

      {/* ── 10 ─────────────────────────────── */}
      <Section>10. その他の文字列メソッド</Section>
      <Code lang="python" filename="string_methods.py">{`s.strip()             # 前後の空白・改行を除去
s.upper() / s.lower() # 大文字/小文字化
s.replace("a", "b")   # 置換
"".join(list)         # 連結
" ".join(map(str, A)) # 数値リストをスペース区切りの文字列に
s.zfill(3)            # "5" → "005"
s.isdigit()           # 数字だけか
sorted(s)             # 文字のリストに分解してソート（アナグラム判定に）`}</Code>

      {/* ── 11 ─────────────────────────────── */}
      <Section>11. 知っておくと便利</Section>

      <SubSection>
        <Cmd>{"collections.Counter"}</Cmd> — 個数を数える
      </SubSection>
      <Code lang="python" filename="counter.py">{`from collections import Counter
c = Counter("paiza")            # {'a': 2, 'p': 1, 'i': 1, 'z': 1}
c.most_common(1)                # [('a', 2)]  最頻値`}</Code>

      <SubSection>
        <Cmd>{"collections.defaultdict"}</Cmd> — 初期値付き辞書
      </SubSection>
      <Code lang="python" filename="defaultdict.py">{`from collections import defaultdict
d = defaultdict(int)            # 存在しないキーは 0 から始まる
d["a"] += 1                     # KeyError にならない
d = defaultdict(list)
d["a"].append(1)`}</Code>

      <SubSection>
        <Cmd>{"collections.deque"}</Cmd> — 両端キュー（BFSで必須）
      </SubSection>
      <Code lang="python" filename="deque.py">{`from collections import deque
q = deque()
q.append(x)      # 右に追加
q.popleft()      # 左から取り出す（listの pop(0) より圧倒的に速い）`}</Code>

      <SubSection>
        <Cmd>{"itertools.accumulate"}</Cmd> — 累積和
      </SubSection>
      <Code lang="python" filename="accumulate.py">{`from itertools import accumulate
list(accumulate([1, 2, 3, 4]))     # [1, 3, 6, 10]`}</Code>
      <p>
        「左から順に足していった値」がそのままリストになる。
        <strong>前半／後半に分ける問題の定番</strong>。
      </p>
      <Code lang="python" filename="accumulate_use.py">{`acc = list(accumulate(row))
if half in acc:                    # 半分になる位置があるか
    k = acc.index(half) + 1        # アリスがもらう個数（accは0-indexed）`}</Code>
      <p>
        <Cmd>{"in set(accumulate(row))"}</Cmd> にすると判定が O(1)
        になる（要素数が多いときだけ効く）。
      </p>

      <SubSection>
        <Cmd>{"itertools"}</Cmd> — 組み合わせ
      </SubSection>
      <Code lang="python" filename="itertools_combo.py">{`from itertools import permutations, combinations, product
permutations(A, 2)     # 順列
combinations(A, 2)     # 組み合わせ
product(A, repeat=2)   # 直積（多重ループの代わり）`}</Code>

      <SubSection>辞書</SubSection>
      <Code lang="python" filename="dict.py">{`d = {}
d["key"] = 1
d.get("key", 0)        # 無ければ 0 を返す（KeyErrorにならない）
for k, v in d.items(): ...
d.keys() / d.values()`}</Code>

      <SubSection>数値系</SubSection>
      <Code lang="python" filename="numeric.py">{`abs(x)                 # 絶対値
divmod(a, b)           # (商, 余り) を同時に
a // b                 # 切り捨て除算
a % b                  # 余り
pow(a, b, m)           # a**b % m （高速）
round(x, 2)            # 四捨五入
float("inf")           # 無限大（最小値探索の初期値に）`}</Code>

      <SubSection>切り上げ除算のイディオム</SubSection>
      <Code lang="python" filename="ceil_div.py">{`(x + y - 1) // y       # x/y の切り上げ
-(-x // y)             # 同じ（こちらの流派もある）`}</Code>
      <p>
        <Cmd>{"math.ceil(x / y)"}</Cmd> は float 経由なので大きい数で誤差が出る。
        <strong>整数のまま計算するのが安全</strong>。
      </p>

      <SubSection>偶奇判定</SubSection>
      <Code lang="python" filename="parity.py">{`if total % 2:          # 奇数なら True（0以外は truthy）
if total % 2 == 1:     # 同じ意味
if total % 2 == 0:     # 偶数`}</Code>
      <p>「平均をちょうど半分にできるか」＝「合計が偶数か」の判定でよく使う。</p>

      {/* ── 12 ─────────────────────────────── */}
      <Section>12. 実行速度を上げる（速度が評価される問題向け）</Section>

      <SubSection>入力を一括で読む</SubSection>
      <p>
        <Cmd>{"input()"}</Cmd>{" "}
        を何度も呼ぶのが一番のボトルネック。行数が多いときは効果が大きい。
      </p>
      <Code lang="python" filename="fast_input.py">{`import sys
input = sys.stdin.readline        # ① 1行足すだけ。手軽

data = sys.stdin.read().split()   # ② 全部を文字列リストにして添字で取る（最速級）
H, W = int(data[0]), int(data[1])
row = list(map(int, data[2:2+W]))`}</Code>
      <p>
        <Cmd>{"sys.stdin.buffer.read().split()"}</Cmd>{" "}
        にするとバイト列のまま扱うのでさらに速い。
      </p>

      <SubSection>
        <Cmd>{"main()"}</Cmd> 関数に包む
      </SubSection>
      <Code lang="python" filename="main_func.py">{`def main():
    ...
    if ダメ:
        print("No")
        return          # ← 即座に打ち切れる（returnは関数内でしか使えない）

main()`}</Code>
      <ul>
        <li>
          <strong><Cmd>{"return"}</Cmd> で早期終了できる</strong>（残りの入力を読む必要すらなくなる）
        </li>
        <li>
          <strong>ローカル変数はグローバルより速い</strong>ので、それだけで高速化する。競プロの定石
        </li>
      </ul>

      <SubSection>その他</SubSection>
      <Code lang="python" filename="fast_misc.py">{`print("\\n".join(rows))            # printを何度も呼ばない
half in set(acc)                  # inの繰り返しはsetに
sum(row)                          # 自前ループよりCで動く組み込み関数が速い`}</Code>

      {/* ── 13 ─────────────────────────────── */}
      <Section>13. DP（動的計画法）の基本形</Section>
      <p>
        「制限（容量・予算・日数）の中で最大化・最小化」と読めたら、まずこの形を疑う。
        <strong>貪欲法（効率が良い順に選ぶ）では解けない</strong>ので注意。反例が作れてしまう。
      </p>

      <SubSection>0-1 ナップサック（各品物を最大1回だけ選ぶ）</SubSection>
      <Code lang="python" filename="knapsack_01.py">{`n, m = map(int, input().split())     # n個の品物、容量m
dp = [0] * (m + 1)

for _ in range(n):
    b, x = map(int, input().split()) # b=価値, x=重さ
    for j in range(m, x - 1, -1):    # ★ 降順
        dp[j] = max(dp[j], dp[j - x] + b)

print(dp[m])`}</Code>

      <SubSection>状態の意味を固定する（最重要）</SubSection>
      <Code lang="text" filename="dp_state.txt">{`dp[j] = 「j 以内で得られる価値の最大値」`}</Code>
      <ul>
        <li>
          <Cmd>{"j"}</Cmd> は <strong>残り</strong> ではなく <strong>使える上限</strong>
        </li>
        <li>
          <Cmd>{"dp[5] = 100"}</Cmd> なら「容量5あれば最大100稼げる」
        </li>
        <li>
          答えは <Cmd>{"dp[m]"}</Cmd>
        </li>
      </ul>

      <SubSection>遷移の1行を日本語にする</SubSection>
      <Code lang="python" filename="dp_transition.py">{`dp[j] = max(dp[j], dp[j - x] + b)
         ↑選ばない  ↑選ぶ（x消費して、残りj-xで稼いだ分 + この品物のb）`}</Code>
      <p>
        <Cmd>{"max"}</Cmd> の第1引数が <strong>現状維持</strong>、第2引数が{" "}
        <strong>この品物を追加</strong>。<strong>選択肢を2つ並べて良い方を残す</strong>、それだけ。
      </p>

      <SubSection>なぜ降順なのか（DP最大の罠）</SubSection>
      <p>
        <Cmd>{"dp[j]"}</Cmd> は <Cmd>{"dp[j - x]"}</Cmd>（<strong>自分より左</strong>）を参照する。
      </p>
      <ComparisonTable
        headers={["向き", "dp[j-x] の中身", "結果"]}
        rows={[
          [
            <><strong>降順</strong> <Cmd>{"range(m, x-1, -1)"}</Cmd></>,
            <>まだ更新されていない＝<strong>この品物を使う前</strong>の値</>,
            "各品物は最大1回 ✓",
          ],
          [
            <><strong>昇順</strong> <Cmd>{"range(x, m+1)"}</Cmd></>,
            <>すでに更新済み＝<strong>この品物を使った後</strong>の値</>,
            "同じ品物を何回でも使える",
          ],
        ]}
      />
      <p>
        昇順にすると壊れる例（<Cmd>{"b=60, x=2, m=5"}</Cmd>）：
      </p>
      <Code lang="text" filename="dp_ascending_bug.txt">{`j=2: dp[2] = max(0, dp[0]+60) = 60          ← 1回読んだ
j=4: dp[4] = max(0, dp[2]+60) = 60+60 = 120 ← 同じ本を2回読んでいる！`}</Code>
      <Callout variant="info">
        <strong>逆に言えば</strong>、「同じ品物を何個でも使える」問題（個数制限なしナップサック／
        コイン問題）では <strong>わざと昇順にする</strong>のが正解。
        <strong>ループの向きだけで問題の種類が変わる。</strong>
      </Callout>
      <Code lang="python" filename="knapsack_direction.py">{`# 0-1ナップサック（1回まで）
for j in range(m, x - 1, -1):

# 個数無制限ナップサック
for j in range(x, m + 1):`}</Code>

      <SubSection>手で追ってみる（m=5、本3冊）</SubSection>
      <ComparisonTable
        headers={["品物", "価値b", "重さx"]}
        rows={[
          ["①", "60", "3"],
          ["②", "100", "4"],
          ["③", "120", "5"],
        ]}
      />
      <Code lang="text" filename="dp_trace.txt">{`初期:      j: 0  1  2  3  4  5
              0  0  0  0  0  0

①(60,3)後:   0  0  0 60 60 60
②(100,4)後:  0  0  0 60 100 100     ← dp[5] が 60→100 に更新
③(120,5)後:  0  0  0 60 100 120     ← 答え dp[5]=120`}</Code>
      <p>
        「①+② は重さ7で入らない」「③単独が最強」という判断が、<Cmd>{"max"}</Cmd>{" "}
        の積み重ねだけで自動的に出る。
        <strong>全組み合わせを列挙していないのに列挙したのと同じ答えが出る</strong>のが DP。
      </p>

      <SubSection>DP を組む3ステップ</SubSection>
      <ol>
        <li>
          <strong>状態を決める</strong> … <Cmd>{"dp[j] = j 以内での最大値"}</Cmd>
        </li>
        <li>
          <strong>遷移を書く</strong> … <Cmd>{"dp[j] = max(dp[j], dp[j-x] + b)"}</Cmd>（使わない／使う）
        </li>
        <li>
          <strong>初期値と答え</strong> … 全部0からスタート、答えは <Cmd>{"dp[m]"}</Cmd>
        </li>
      </ol>

      <SubSection>「以内」と「ちょうど」の使い分け</SubSection>
      <Code lang="python" filename="dp_within_exact.py">{`dp = [0] * (m + 1)                   # 「j 以内」→ 単調非減少。答えは dp[m]

dp = [-float("inf")] * (m + 1)       # 「ちょうど j」→ 到達不能を -inf で表す
dp[0] = 0                            #   答えは max(dp)`}</Code>
      <p>
        初期値を全部0にすると自動的に「以内」の意味になる。普通は「以内」で十分。
      </p>

      <SubSection>計算量</SubSection>
      <p>O(NM)。品物数×容量。paiza や AtCoder の典型制約なら十分間に合う。</p>

      <SubSection>言い換えのバリエーション</SubSection>
      <p>
        「持ち物選択」「予算内で最大化」「重さ制限」「日数内で読める最大ページ数」など
        <strong>表現が無数にあるが全部同じ型</strong>。下の対応に読み替えれば即座に当てはめられる。
      </p>
      <ComparisonTable
        headers={["ナップサック", "問題文の言葉の例"]}
        rows={[
          ["容量", "夏休みの日数 / 予算 / 耐荷重"],
          ["重さ", "読破日数 / 値段 / 重量"],
          ["価値", "ページ数 / 満足度 / 得点"],
        ]}
      />

      {/* ── 14 ─────────────────────────────── */}
      <Section>14. エラーメッセージの読み方</Section>
      <Figure
        src="/learn/shots/kyopro/python-paiza-cheatsheet-02.svg"
        alt="実行時に Traceback が表示された画面。エラーの型名・メッセージ・発生行が示されている"
        caption="実行環境に出る Traceback。最終行の「型名: メッセージ」と、その上の行番号だけ見れば原因はほぼ絞れる"
      />
      <ComparisonTable
        headers={["エラー", "意味 / 疑うところ"]}
        rows={[
          [
            <Cmd>{"IndexError: list index out of range"}</Cmd>,
            <>添字がはみ出た。<Cmd>{"range(n-2)"}</Cmd> にすべきところを <Cmd>{"range(n)"}</Cmd> にしていないか、行数・列数が逆でないか</>,
          ],
          [
            <Cmd>{"IndexError: list assignment index out of range"}</Cmd>,
            <>上と同じ。グリッドの作り方（<Cmd>{"for"}</Cmd> で上書きしていないか）も疑う</>,
          ],
          [
            <Cmd>{"ValueError: invalid literal for int()"}</Cmd>,
            <><Cmd>{"int()"}</Cmd> に数値でない文字列を渡した。入力形式のズレ（1行に複数値など）</>,
          ],
          [
            <Cmd>{"AttributeError: ... has no attribute 'soplit'"}</Cmd>,
            <>メソッド名のタイポ。<Cmd>{"Did you mean:"}</Cmd> のヒントを読む</>,
          ],
          [
            <Cmd>{"TypeError: 'NoneType' object is not ..."}</Cmd>,
            <><Cmd>{"A.sort()"}</Cmd> の返り値を代入していないか</>,
          ],
          [
            <Cmd>{"KeyError"}</Cmd>,
            <>辞書に無いキー。<Cmd>{"d.get(k, 0)"}</Cmd> か <Cmd>{"defaultdict"}</Cmd> を使う</>,
          ],
          [
            <Cmd>{"ValueError: max() arg is an empty sequence"}</Cmd>,
            <>候補が0個。<Cmd>{"max(..., default=0)"}</Cmd> を付ける</>,
          ],
          [
            <><Cmd>{"SyntaxError"}</Cmd> （<Cmd>{"#"}</Cmd> を使ったとき）</>,
            <><Cmd>{"#"}</Cmd> はコメント開始記号。文字として使うなら <Cmd>{'"#"'}</Cmd> とクォートで囲む</>,
          ],
          [
            <Cmd>{"ValueError: not enough values to unpack"}</Cmd>,
            <><Cmd>{"a, b = ..."}</Cmd> の左右で個数が合っていない。入力の並びを確認</>,
          ],
        ]}
      />

      <SubSection>エラーが出ないバグ（一番厄介）</SubSection>
      <p>
        Python は下記を <strong>すべて文法的に正しいコードとして受け入れる</strong>。
        エラーが出ないまま間違った答えが出るので、<Cmd>{"No"}</Cmd>{" "}
        しか出ない・答えがズレるときはここを疑う。
      </p>
      <ComparisonTable
        headers={["書いたもの", "何が起きるか", "正しくは"]}
        rows={[
          [
            <Cmd>{"found == True"}</Cmd>,
            <><strong>比較しただけ</strong>。結果を捨てている。<Cmd>{"found"}</Cmd> は False のまま</>,
            <Cmd>{"found = True"}</Cmd>,
          ],
          [
            <Cmd>{"row.append"}</Cmd>,
            <><strong>関数を参照しただけ</strong>。呼んでいないので何も起きない</>,
            <Cmd>{"row.append(x)"}</Cmd>,
          ],
          [
            <Cmd>{"grid[-1]"}</Cmd>,
            <>エラーにならず <strong>末尾</strong>を返す。走査範囲を <Cmd>{"range(1, H-1)"}</Cmd> にすべきところを <Cmd>{"range(H)"}</Cmd> にすると静かに壊れる</>,
            <Cmd>{"range(1, H-1)"}</Cmd>,
          ],
          [
            <Cmd>{"d == 0"}</Cmd>,
            <><Cmd>{"input().split()"}</Cmd> の結果は str。<Cmd>{'"0" == 0'}</Cmd> は常に False</>,
            <Cmd>{'d == "0"'}</Cmd>,
          ],
          [
            <Cmd>{"[[0] * W] * H"}</Cmd>,
            <>全行が同じリストの参照。1マス書き換えると全行が変わる</>,
            <Cmd>{"[[0] * W for _ in range(H)]"}</Cmd>,
          ],
          [
            <><Cmd>{"total = 0"}</Cmd> がループの外</>,
            <>前回の集計値が残り続ける</>,
            "ループの中で初期化",
          ],
          [
            <Cmd>{"range(e - s)"}</Cmd>,
            <>区間 <Cmd>{"[s, e]"}</Cmd> の本数は <Cmd>{"e - s + 1"}</Cmd>。最後の1個が漏れる</>,
            <Cmd>{"range(s-1, e)"}</Cmd>,
          ],
          [
            <Cmd>{"B = A.sort()"}</Cmd>,
            <><Cmd>{"sort()"}</Cmd> は None を返す</>,
            <Cmd>{"B = sorted(A)"}</Cmd>,
          ],
        ]}
      />
      <p>
        <strong><Cmd>{"="}</Cmd> と <Cmd>{"=="}</Cmd> の取り違えは最頻出。</strong>
        「<Cmd>{"if"}</Cmd> / <Cmd>{"while"}</Cmd> の条件の中は <Cmd>{"=="}</Cmd>、
        それ以外は <Cmd>{"="}</Cmd>」と覚える。
        <strong>メソッドは <Cmd>{"()"}</Cmd> を付けて初めて実行される</strong>のも同様に事故りやすい。
      </p>

      {/* ── 15 ─────────────────────────────── */}
      <Section>15. デバッグの型</Section>
      <Code lang="python" filename="debug.py">{`parts = input().split()
print(parts)          # ← 実際にどう分かれているか確認`}</Code>
      <p>
        <strong>提出前に必ず入力例1で検算する。</strong>{" "}
        手で計算した答えと一致するか確かめてから提出。
      </p>
      <Figure
        src="/learn/shots/kyopro/python-paiza-cheatsheet-01.svg"
        alt="paiza の問題ページでコードを実行し、入力例1に対する自分の出力と期待される出力が並んで表示されている画面"
        caption="入力例1で実行し、自分の出力と期待される出力を並べて突き合わせる"
      />
    </>
  );
}

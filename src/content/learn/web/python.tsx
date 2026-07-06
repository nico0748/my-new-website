import type { LearnMeta } from "../../../lib/learnCategories";
import {
  Lead,
  Section,
  SubSection,
  Callout,
  Code,
  Cmd,
  Steps,
  Step,
  KeyPoints,
  ComparisonTable,
  KVList,
  TipBox,
  Bridge,
  Divider,
} from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "python",
  title: "Python とは — 文法とエコシステム",
  description:
    "シンプルな文法で幅広い分野に使われる Python。環境構築、基本文法、クラス、例外、エコシステムを実例で押さえる。",
  domain: "web",
  section: "backend",
  order: 2,
  level: "intro",
  tags: ["Python", "言語", "バックエンド"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Python</strong> は「読みやすさ」を第一に設計された汎用プログラミング言語です。Web
        バックエンド、データ分析、AI / 機械学習、自動化スクリプトまで、1
        つの言語で幅広い分野をカバーできるのが最大の強みです。まずは環境構築から基本文法、クラス、例外、エコシステムまでを一気に押さえましょう。
      </Lead>

      <Section>Python とは</Section>
      <p>
        Python は 1991 年に登場した歴史のある言語ですが、いまなお人気ランキングの上位を占め続けています。理由はシンプルで、<strong>コードが英語に近く読みやすい</strong>こと、そして<strong>用途が非常に広い</strong>ことです。
      </p>
      <p>
        たとえば「1 から 5 までを表示する」処理は、波かっこもセミコロンもなく、インデント（字下げ）でブロックを表現します。
      </p>

      <Code lang="python">{`for i in range(1, 6):
    print(i)          # 1 2 3 4 5 を順に出力`}</Code>

      <KVList
        items={[
          { key: "可読性", val: "インデントで構造を強制。誰が書いても似た見た目になる" },
          { key: "用途の広さ", val: "Web・データ分析・AI/ML・自動化・学術計算まで 1 言語で" },
          { key: "豊富なライブラリ", val: "PyPI に 50 万超のパッケージ。車輪の再発明が少ない" },
          { key: "学習コスト", val: "最初の言語として選ばれることが多い低い入り口" },
        ]}
      />

      <Callout variant="info" title="実行方式">
        Python は<strong>インタプリタ言語</strong>です。ソースコードを 1 行ずつ実行するため、コンパイル待ちなしに書いてすぐ動かせます。その代わり実行速度は C / Rust などのコンパイル言語に劣るため、速度が要る部分は C 実装のライブラリ（NumPy 等）に任せるのが定石です。
      </Callout>

      <SubSection>「インタプリタ」は実際どう動くのか</SubSection>
      <p>
        正確には、CPython はソースを一気に機械語へ翻訳するのではなく、まず<strong>バイトコード</strong>（<Cmd>.pyc</Cmd>）へコンパイルし、それを<strong>仮想マシン（VM）</strong>が 1 命令ずつ解釈実行します。つまり「純粋なインタプリタ」ではなく「バイトコードインタプリタ」です。だから初回実行時にわずかなコンパイル時間があり、2 回目以降はキャッシュされた <Cmd>.pyc</Cmd> が使われます。
      </p>

      <Bridge course="言語処理系 / 計算モデル">
        ソース → バイトコード → 仮想マシンが解釈実行、という流れは<strong>言語処理系</strong>の講義で扱う「インタプリタ方式」と「仮想機械」の話そのものです。コンパイラ方式（C）が事前に機械語を吐くのに対し、Python は実行時に VM が仲介するぶん遅い代わりに移植性と対話性を得ています。「なぜ Python は遅いのか／なぜ環境非依存で動くのか」は、この抽象機械を 1 枚挟む設計から説明できます。
      </Bridge>

      <Divider />

      <Section>環境構築（python / pip / venv）</Section>
      <p>
        2025〜2026 時点では Python 3.12 / 3.13 系が主流です。まずはバージョンを確認しましょう。
      </p>

      <Code lang="bash">{`python3 --version   # => Python 3.13.x
pip3 --version      # パッケージ管理ツール`}</Code>

      <SubSection>venv で仮想環境を分離する</SubSection>
      <p>
        プロジェクトごとにライブラリのバージョンがぶつからないよう、<Cmd>venv</Cmd>（仮想環境）でインストール先を分離するのが基本作法です。
      </p>

      <Steps>
        <Step title="仮想環境を作る">
          プロジェクト直下で <Cmd>venv</Cmd> フォルダを作成します。
          <Code lang="bash">{`python3 -m venv .venv`}</Code>
        </Step>
        <Step title="有効化する">
          有効化するとその環境の Python / pip が使われます。
          <Code lang="bash">{`source .venv/bin/activate      # macOS / Linux
# .venv\\Scripts\\activate       # Windows`}</Code>
        </Step>
        <Step title="ライブラリを入れる">
          <Cmd>pip install</Cmd> でパッケージを追加し、依存を書き出します。
          <Code lang="bash">{`pip install requests
pip freeze > requirements.txt`}</Code>
        </Step>
      </Steps>

      <TipBox>
        依存の再現には <Cmd>pip install -r requirements.txt</Cmd> を使います。近年は
        <Cmd> uv</Cmd> や <Cmd>poetry</Cmd> といった高速・高機能なツールも普及していますが、標準の
        <Cmd> venv + pip</Cmd> がまず理解できていれば十分です。
      </TipBox>

      <Divider />

      <Section>基本文法</Section>

      <SubSection>変数と型</SubSection>
      <p>
        型宣言は不要で、代入した値から型が決まります（動的型付け）。任意で<strong>型ヒント</strong>を付けると読みやすさとエディタ補完が向上します。
      </p>

      <Code lang="python">{`name = "Yuma"          # str（文字列）
age = 24               # int（整数）
height = 172.5         # float（浮動小数点数）
is_active = True       # bool（真偽値）
nothing = None         # None（値がないことを表す）

# 型ヒント付き（実行には影響しないが可読性が上がる）
score: int = 100
label: str = "S"`}</Code>

      <SubSection>制御構文</SubSection>
      <p>
        条件分岐は <Cmd>if / elif / else</Cmd>、繰り返しは <Cmd>for</Cmd> と <Cmd>while</Cmd>。ブロックはコロンとインデントで表します。
      </p>

      <Code lang="python">{`score = 82

if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"

for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

n = 3
while n > 0:
    print(n)
    n -= 1`}</Code>

      <SubSection>関数</SubSection>
      <p>
        <Cmd>def</Cmd> で定義します。デフォルト引数やキーワード引数、型ヒントも書けます。
      </p>

      <Code lang="python">{`def greet(name: str, greeting: str = "こんにちは") -> str:
    return f"{greeting}, {name}!"

print(greet("Yuma"))                 # こんにちは, Yuma!
print(greet("Yuma", greeting="Hi"))  # Hi, Yuma!`}</Code>

      <Callout variant="tip" title="f文字列（f-string）">
        文字列の前に <Cmd>f</Cmd> を付けると、<Cmd>{"{ }"}</Cmd> の中に変数や式をそのまま埋め込めます。文字列組み立ての第一選択です。
      </Callout>

      <SubSection>リスト / 辞書 / タプル</SubSection>
      <p>Python の代表的なコレクション型を押さえましょう。</p>

      <Code lang="python">{`# リスト（可変・順序あり）
nums = [1, 2, 3]
nums.append(4)          # [1, 2, 3, 4]

# 辞書（キーと値のペア）
user = {"name": "Yuma", "age": 24}
print(user["name"])     # Yuma

# タプル（不変・順序あり）
point = (10, 20)
x, y = point            # アンパック代入`}</Code>

      <ComparisonTable
        headers={["型", "可変性", "書き方", "主な用途"]}
        rows={[
          ["リスト list", "可変", "[1, 2, 3]", "順序のある要素の集合"],
          ["辞書 dict", "可変", '{"k": "v"}', "キーで値を引く対応表"],
          ["タプル tuple", "不変", "(1, 2)", "変更しない固定データ"],
          ["集合 set", "可変", "{1, 2, 3}", "重複なしの集まり"],
        ]}
      />

      <SubSection>内包表記</SubSection>
      <p>
        リストや辞書を <Cmd>for</Cmd> を 1 行に畳んで生成できます。Python らしい簡潔な書き方です。
      </p>

      <Code lang="python">{`# 0〜9 の 2 乗のリスト
squares = [n * n for n in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 条件付き（偶数だけ）
evens = [n for n in range(10) if n % 2 == 0]
# [0, 2, 4, 6, 8]

# 辞書内包表記
name_len = {name: len(name) for name in ["a", "bb", "ccc"]}
# {"a": 1, "bb": 2, "ccc": 3}`}</Code>

      <Divider />

      <Section>クラスとオブジェクト</Section>
      <p>
        <Cmd>class</Cmd> でデータと振る舞いをまとめます。<Cmd>__init__</Cmd> は初期化メソッド（コンストラクタ）で、各メソッドの第 1 引数 <Cmd>self</Cmd> はそのインスタンス自身を指します。
      </p>

      <Code lang="python">{`class User:
    def __init__(self, name: str, age: int) -> None:
        self.name = name       # インスタンス変数
        self.age = age

    def greet(self) -> str:
        return f"{self.name}（{self.age}歳）です"


u = User("Yuma", 24)
print(u.greet())               # Yuma（24歳）です`}</Code>

      <Callout variant="info" title="継承">
        既存クラスを土台に機能を拡張できます。<Cmd>class Admin(User):</Cmd> のように親クラスを指定し、<Cmd>super().__init__()</Cmd> で親の初期化を呼び出します。
      </Callout>

      <SubSection>ダックタイピング — 型より「振る舞い」</SubSection>
      <p>
        Python は動的型付けなので、「その値がどのクラスか」ではなく「必要なメソッドを持っているか」で動きます。これが<strong>ダックタイピング</strong>です（「アヒルのように鳴くならアヒルだ」）。下の <Cmd>total_area</Cmd> は <Cmd>area()</Cmd> さえ持っていればクラスを問わず受け取れます。継承関係すら要りません。
      </p>

      <Code lang="python">{`class Circle:
    def area(self) -> float:
        return 3.14 * 2 * 2

class Square:
    def area(self) -> float:
        return 3 * 3

# 型を問わない。「area() を持つ」ことだけを期待する
def total_area(shapes) -> float:
    return sum(shape.area() for shape in shapes)

print(total_area([Circle(), Square()]))   # 21.56`}</Code>

      <Bridge course="プログラミング言語論 / 計算モデル">
        「共通の親クラスを継承していなくても、同じメソッドを持てば同じように扱える」というダックタイピングは、講義で習う<strong>多相（ポリモーフィズム）</strong>を<strong>構造的部分型</strong>の形で実現したものです。Java の <Cmd>interface</Cmd>（名前的部分型）が「明示的に implements した型だけ受け付ける」のに対し、Python は「形が合えば通す」。静的型付け vs 動的型付けというトレードオフ（安全性と検査時期 vs 柔軟性と記述量）は、まさに言語論の中心テーマです。
      </Bridge>

      <ComparisonTable
        headers={["観点", "動的型付け（Python）", "静的型付け（Java/TS）"]}
        rows={[
          ["型の確定", "実行時", "コンパイル時"],
          ["エラー検出", "動かして初めて", "書いた時点で"],
          ["柔軟さ", "高い（ダックタイピング）", "契約は固いが窮屈なことも"],
          ["向く場面", "試作・スクリプト・データ処理", "大規模・チーム・長寿命"],
        ]}
      />

      <Callout variant="warn" title="動的型の落とし穴">
        柔軟な反面、型の取り違え（数値のつもりが文字列など）は<strong>実行して初めて</strong>露見します。規模が大きくなったら<strong>型ヒント + mypy</strong> で静的検査を足し、動的型の速さと静的検査の安全を両取りするのが実務の定石です。
      </Callout>

      <Divider />

      <Section>例外処理</Section>
      <p>
        実行中のエラーは<strong>例外</strong>として発生します。<Cmd>try / except</Cmd> で捕捉し、後始末は <Cmd>finally</Cmd> で行います。
      </p>

      <Code lang="python">{`def divide(a: int, b: int) -> float:
    try:
        return a / b
    except ZeroDivisionError:
        print("0 では割れません")
        return 0.0
    finally:
        print("処理完了")


divide(10, 2)   # 5.0 /「処理完了」
divide(10, 0)   # 「0 では割れません」/「処理完了」`}</Code>

      <Callout variant="warn" title="握りつぶさない">
        <Cmd>except Exception: pass</Cmd> のようにすべての例外を無言で捨てるのは避けましょう。想定した例外だけを具体的に捕まえ、それ以外はそのまま上位に伝播させるのが安全です。
      </Callout>

      <Divider />

      <Section>標準ライブラリ</Section>
      <p>
        Python は「バッテリー同梱（batteries included）」と言われ、インストール不要で使える標準ライブラリが非常に充実しています。
      </p>

      <KVList
        items={[
          { key: "datetime", val: "日付・時刻の生成と計算" },
          { key: "json", val: "JSON 文字列と Python オブジェクトの相互変換" },
          { key: "os / pathlib", val: "ファイル・ディレクトリ操作" },
          { key: "re", val: "正規表現によるパターンマッチ" },
          { key: "collections", val: "Counter・defaultdict などの便利データ構造" },
        ]}
      />

      <Code lang="python">{`import json
from datetime import date

data = {"name": "Yuma", "day": str(date.today())}
text = json.dumps(data, ensure_ascii=False)
print(text)   # {"name": "Yuma", "day": "2026-07-07"}`}</Code>

      <Divider />

      <Section>主な用途</Section>
      <p>Python が実際にどの分野で使われているかを整理します。</p>

      <ComparisonTable
        headers={["分野", "何をするか", "代表的なライブラリ / FW"]}
        rows={[
          ["Web バックエンド", "API・Web アプリのサーバ実装", "Django / FastAPI / Flask"],
          ["データ分析", "表形式データの集計・可視化", "pandas / NumPy / Matplotlib"],
          ["AI / 機械学習", "モデルの学習・推論・LLM 連携", "PyTorch / scikit-learn / Transformers"],
          ["自動化 / スクリプト", "ファイル処理・スクレイピング・運用作業", "requests / BeautifulSoup"],
        ]}
      />

      <TipBox>
        Web フレームワークの違いと使い分けは、次章「Python の Web フレームワーク — Django /
        FastAPI / Flask」で詳しく扱います。
      </TipBox>

      <Divider />

      <Section>エコシステム（pip / PyPI）</Section>
      <p>
        外部ライブラリは <strong>PyPI（Python Package Index）</strong>という公式リポジトリで公開され、<Cmd>pip</Cmd> コマンドで取得します。世界中の開発者が公開した 50 万を超えるパッケージが利用でき、これが Python の生産性を支える最大の資産です。
      </p>

      <Code lang="bash">{`pip install requests         # 追加
pip install "requests==2.32"  # バージョン指定
pip uninstall requests       # 削除
pip list                     # 導入済み一覧`}</Code>

      <Callout variant="tip" title="依存はファイルで固定する">
        チームや本番環境で同じ結果を再現するため、<Cmd>requirements.txt</Cmd>（または
        <Cmd> pyproject.toml</Cmd>）に依存を明記し、リポジトリに含めましょう。仮想環境（venv）と組み合わせれば「動く環境」をそのまま共有できます。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Python は可読性と用途の広さが強み。インデントでブロックを表す",
          "CPython は ソース → バイトコード → VM 実行。座学の「インタプリタ方式・仮想機械」そのもの",
          "動的型付け × ダックタイピングは、構造的部分型で多相を実現したもの",
          "環境は venv で分離し、pip で PyPI からライブラリを取得する",
          "リスト / 辞書 / タプルと内包表記が Python らしい基本道具。規模が出たら型ヒント + mypy",
          "Web・データ分析・AI/ML まで、豊富なエコシステムが生産性を支える",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, Bridge, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "lang-rust",
  title: "Rust 言語まとめ",
  description: "安全性・高速性・並行性を兼ね備えた Rust。所有権(Ownership)・借用(Borrowing)・Result 型・Cargo を図解的に理解する。",
  domain: "web",
  section: "backend",
  order: 6,
  level: "practice",
  tags: ["Rust", "所有権", "言語"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Rust</strong> は 2010 年に公開された（Mozilla 発）システムプログラミング言語です。C/C++ 並みの速度を保ちながら、
        <strong>ガベージコレクションなしでメモリ安全</strong>を実現するのが最大の特徴。所有権システムによってコンパイル時にメモリバグとデータ競合を排除します。
      </Lead>

      <Section>なぜ Rust が生まれたか — 「速さ」と「安全」の両立</Section>
      <p>
        プログラミング言語には長年、<strong>「速いが危険（C/C++）」か「安全だが GC で遅い（Java/Go/Python）」</strong>という二分法がありました。C/C++ はメモリを手動管理できて速い反面、解放漏れ・二重解放・ダングリングポインタ・バッファオーバーフローといったメモリバグを生み、これがセキュリティ脆弱性の最大の温床でした（実際 Microsoft や Google の調査で、深刻な脆弱性の約 7 割がメモリ安全性に起因すると報告されています）。一方 GC を持つ言語は安全ですが、実行時に GC がメモリを走査するオーバーヘッドと予測しにくい停止時間を伴います。
      </p>
      <p>
        Rust の設計思想は「<strong>この二択を、実行時コストゼロで崩す</strong>」ことです。GC を使わず、代わりに<strong>コンパイル時に所有権と借用を静的検査</strong>してメモリ安全を保証します。安全性チェックはビルド時に完了するので、実行時には C/C++ と同等のコードになる——これが Rust の言う<strong>「ゼロコスト抽象化」</strong>です。
      </p>

      <Bridge course="型理論 / プログラミング言語論">
        Rust の所有権は、型理論の<strong>アフィン型（affine type）／線形型（linear type）</strong>そのものの実用化です。線形型は「値をちょうど 1 回だけ使う」、アフィン型は「高々 1 回だけ使う（使わなくてもよい＝ドロップ可）」型で、Rust の「ムーブすると元の変数は使えなくなる」はまさにアフィン型の挙動です。講義で学ぶ<strong>型システム＝プログラムの性質をコンパイル時に証明する仕組み</strong>という視点で見ると、Rust は「メモリ安全性という性質を型で証明する言語」として理解できます。
      </Bridge>

      <Section>Rust の 5 つの特徴</Section>
      <ul>
        <li><strong>メモリ安全</strong> — GC なしで解放漏れ・二重解放・ダングリング参照を防ぐ</li>
        <li><strong>高速</strong> — ネイティブコードにコンパイルされ、実行時オーバーヘッドが小さい</li>
        <li><strong>並行性</strong> — 「コンパイル時にスレッドセーフ」を保証（データ競合をコンパイルエラーにする）</li>
        <li><strong>信頼性</strong> — 網羅的な型・パターンマッチで例外の握りつぶしを防ぐ</li>
        <li><strong>Cargo / クレート</strong> — 公式のビルド・パッケージ管理ツールが最初から揃う</li>
      </ul>

      <Code lang="rust" filename="main.rs">{`fn main() {
    println!("Hello, World!");
}`}</Code>

      <SubSection>基本文法</SubSection>
      <Code lang="rust">{`let x = 5;              // 不変（デフォルトで再代入不可）
let mut y = 10;         // mut で可変
const MAX: u32 = 100;   // 定数（型注釈が必須）

fn add(a: i32, b: i32) -> i32 {
    a + b               // 末尾の式が戻り値（セミコロンなし）
}`}</Code>

      <Section>前提知識 — スタックとヒープ</Section>
      <p>
        所有権を理解するには、まず<strong>メモリがどこに置かれるか</strong>を押さえる必要があります。プログラムのメモリは大きく <strong>スタック</strong>と <strong>ヒープ</strong>に分かれます。
      </p>
      <KVList
        items={[
          { key: "スタック", val: "サイズがコンパイル時に確定する値（整数・固定長など）。関数の呼び出し/終了に合わせて自動で積まれ・外される。超高速" },
          { key: "ヒープ", val: "サイズが実行時に決まる/変わる値（可変長の String・Vec など）。確保・解放をどこかで管理する必要がある" },
        ]}
      />
      <p>
        問題は<strong>ヒープ</strong>です。C/C++ では <Cmd>malloc/free</Cmd> を手で対にしなければならず、忘れれば<strong>メモリリーク</strong>、二重に呼べば<strong>二重解放</strong>、解放後に参照すれば<strong>ダングリングポインタ</strong>が起きます。GC 言語はこれを実行時のガベージコレクタに任せます。<strong>Rust は「所有権」という規則で、ヒープの解放タイミングをコンパイル時に一意に決めてしまう</strong>——これが GC なしで安全を実現する仕組みの核心です。
      </p>

      <Bridge course="計算機アーキテクチャ / オペレーティングシステム">
        講義で学ぶ<strong>スタックフレーム・ヒープ領域・ポインタ・仮想メモリ・malloc/free</strong>の知識が、Rust の所有権を「なぜそう設計したか」から理解する鍵です。所有者がスコープを抜けるとき Rust が自動で呼ぶ <Cmd>drop</Cmd> は、C++ の<strong>デストラクタ／RAII（Resource Acquisition Is Initialization）</strong>と同じ発想。「解放をスコープに束ねる」という OS/システムプログラミングの定石を、コンパイラが強制する形にしたのが所有権です。
      </Bridge>

      <Section>所有権（Ownership）</Section>
      <p>
        Rust の中核概念です。<strong>すべての値には所有者が 1 つだけ</strong>存在し、所有者がスコープを外れると値は自動的に解放されます。
        これにより GC なしでメモリを管理できます。所有権が別の変数に移る（<strong>ムーブ</strong>）と、元の変数はもう使えません。
      </p>

      <Code lang="rust">{`let s1 = String::from("hello");
let s2 = s1;            // 所有権が s2 へムーブ
// println!("{}", s1);  // エラー：s1 はもう使えない

let s3 = s2.clone();    // 深いコピーなら両方使える
println!("{} / {}", s2, s3);`}</Code>

      <Callout variant="info" title="なぜムーブなのか">
        コピーではなくムーブにすることで「同じヒープ領域を 2 つの変数が解放してしまう（二重解放）」事故を、コンパイル時に防げます。
        コストのかかる深いコピーが必要なときだけ明示的に <Cmd>clone()</Cmd> を呼ぶ設計です。
      </Callout>

      <Section>借用（Borrowing）</Section>
      <p>
        所有権を渡さずに値を「参照」させるのが借用です。<Cmd>&</Cmd> で不変参照、<Cmd>&mut</Cmd> で可変参照を作ります。
        借用にはコンパイラが厳格なルール（借用チェッカー）を課し、<strong>データ競合をコンパイル時に防ぎます</strong>。
      </p>

      <ComparisonTable
        headers={["参照の種類", "書き方", "同時に持てる数", "目的"]}
        rows={[
          ["不変参照", <Cmd>&value</Cmd>, "複数 OK", "読み取り専用で共有"],
          ["可変参照", <Cmd>&mut value</Cmd>, "1 つだけ", "書き換えを許可"],
        ]}
      />

      <Code lang="rust">{`fn main() {
    let mut s = String::from("hello");

    let r1 = &s;        // 不変参照は複数持てる
    let r2 = &s;
    println!("{} {}", r1, r2);

    let r3 = &mut s;    // 可変参照は同時に 1 つだけ
    r3.push_str(", world");
    println!("{}", r3);
}`}</Code>

      <Callout variant="tip" title="不変 × 複数 / 可変 × 1 のルール">
        「不変参照は何個でも、可変参照は 1 つだけ、しかも両者は同時に存在できない」——これが借用の黄金律です。
        読み手が複数いても書き手が同時にいなければデータ競合は起きない、という直感を型で保証しています。
      </Callout>

      <SubSection>借用チェッカとライフタイム — コンパイラの中で何が起きているか</SubSection>
      <p>
        この黄金律を実際に検査しているのが <strong>借用チェッカ（borrow checker）</strong>です。コンパイラは各参照の<strong>ライフタイム（有効期間）</strong>を追跡し、「参照が指す先の値が、その参照より先に解放されないか」「可変参照と別の参照が期間として重なっていないか」を静的に検証します。つまり借用チェックは<strong>プログラムを実行せずにソースコードから性質を判定する静的解析（データフロー解析）</strong>そのものです。
      </p>

      <Code lang="rust">{`fn dangle() -> &String {   // コンパイルエラー
    let s = String::from("hi");
    &s                     // s は関数終了で解放される
}                          // → 解放済みへの参照を返そうとしている

// 借用チェッカが「戻り値の参照は関数を超えて生き残れない」と検出する`}</Code>

      <Bridge course="コンパイラ / プログラム解析">
        借用チェッカは、コンパイラ講義で学ぶ<strong>静的解析・データフロー解析・生存区間（liveness）解析</strong>の応用です。レジスタ割り当てで使う「変数がどこからどこまで生きているか」の解析と、Rust のライフタイム推論は同じ土俵にあります。「型検査＝プログラムの正しさをコンパイル時に証明する」というコンパイラの役割が、Rust では<strong>メモリ安全性の証明</strong>にまで拡張されている——コンパイラの原理を知っていると、借用エラーは「バグではなく証明の失敗を教えてくれている」と読めるようになります。
      </Bridge>

      <Section>構造体とエラー処理</Section>
      <p>
        データは <Cmd>struct</Cmd> で定義し、振る舞いは <Cmd>impl</Cmd> ブロックに実装します。
        エラーは例外ではなく <strong><Cmd>Result&lt;T, E&gt;</Cmd> 型</strong>で表現し、<Cmd>match</Cmd> や <Cmd>?</Cmd> 演算子で扱います。
      </p>

      <Code lang="rust">{`struct User {
    name: String,
    age: u32,
}

impl User {
    fn new(name: &str, age: u32) -> Self {
        User { name: name.to_string(), age }
    }
}

// Result<T, E> でエラーを値として返す
fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError> {
    let age: u32 = s.parse()?;   // ? は Err なら即 return
    Ok(age)
}

fn main() {
    match parse_age("25") {
        Ok(age) => println!("age = {}", age),
        Err(e)  => println!("error: {}", e),
    }
}`}</Code>

      <Callout variant="warn" title="? 演算子">
        <Cmd>?</Cmd> は「<Cmd>Ok</Cmd> なら中身を取り出し、<Cmd>Err</Cmd> ならその場で関数から早期リターン」する糖衣構文です。
        エラー伝播が一行で書けるため、Rust らしい簡潔なエラーハンドリングの要になります。
      </Callout>

      <Section>並行処理（Arc）</Section>
      <p>
        複数スレッドで同じデータを共有するには <Cmd>Arc</Cmd>（Atomic Reference Counted）を使います。
        <Cmd>Arc::clone</Cmd> は参照カウントを増やすだけで、所有権を安全に共有できます。書き換えが必要なら <Cmd>Mutex</Cmd> と組み合わせます。
      </p>

      <Code lang="rust">{`use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3]);
    let mut handles = vec![];

    for i in 0..3 {
        let data = Arc::clone(&data);   // 参照カウントを +1
        let handle = thread::spawn(move || {
            println!("thread {}: {:?}", i, data);
        });
        handles.push(handle);
    }

    for h in handles {
        h.join().unwrap();              // 全スレッドの完了を待つ
    }
}`}</Code>

      <Callout variant="info" title="Send / Sync — 型でスレッド安全を表す">
        Rust が「コンパイル時にスレッドセーフ」を保証できるのは、<Cmd>Send</Cmd>（別スレッドへ所有権を移して安全）と <Cmd>Sync</Cmd>（複数スレッドから参照して安全）という<strong>マーカートレイト</strong>を型が持つからです。スレッド間で共有できない型をうっかり渡すと<strong>コンパイルエラー</strong>になります。これも「並行の正しさを型で証明する」型理論の応用で、データ競合を実行時ではなくビルド時に潰します。
      </Callout>

      <Callout variant="warn" title="Rust の落とし穴 — 学習者がつまずく所">
        <ul>
          <li><strong>借用チェッカとの格闘</strong>：初学者は「コンパイルが通らない」で止まりがち。多くは「参照を持ちすぎ」か「ライフタイムの不足」で、<Cmd>clone()</Cmd> で所有権を分けるか設計を見直すと解けます。</li>
          <li><strong>安易な <Cmd>.clone()</Cmd> / <Cmd>.unwrap()</Cmd></strong>：借用エラー回避の clone 乱用は性能を落とし、<Cmd>unwrap()</Cmd> は <Cmd>None/Err</Cmd> でパニック（クラッシュ）します。本番では <Cmd>match</Cmd> や <Cmd>?</Cmd> で正しく扱いましょう。</li>
          <li><strong>コンパイルが遅い</strong>：厳密な検査と最適化の代償でビルドは重め。<Cmd>cargo check</Cmd> で型・借用だけ先に回すのが定石です。</li>
        </ul>
      </Callout>

      <Section>Cargo コマンド</Section>
      <p>Cargo はプロジェクト作成・ビルド・テスト・ドキュメント生成まで一手に担う公式ツールです。</p>
      <ul>
        <li><Cmd>cargo new my_app</Cmd> — 新規プロジェクト作成</li>
        <li><Cmd>cargo build</Cmd> — ビルド（<Cmd>--release</Cmd> で最適化ビルド）</li>
        <li><Cmd>cargo run</Cmd> — ビルドして実行</li>
        <li><Cmd>cargo check</Cmd> — 実行ファイルを作らず型・借用チェックだけ（高速）</li>
        <li><Cmd>cargo test</Cmd> — テスト実行</li>
        <li><Cmd>cargo doc --open</Cmd> — ドキュメント生成してブラウザで開く</li>
      </ul>

      <p>
        主な用途は、システムプログラミング・Web バックエンド・クラウド/インフラ・WebAssembly・ブロックチェーンなど、
        <strong>速度と安全性の両方が求められる領域</strong>です。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "Rust は GC なしでメモリ安全を実現するシステム言語。C/C++ 並みに速い",
          "所有権：値の所有者は常に 1 つ。代入でムーブし、元の変数は無効になる",
          "借用：不変参照 & は複数、可変参照 &mut は 1 つだけ。データ競合をコンパイル時に防ぐ",
          "エラーは Result<T, E> 型で表現し、? 演算子と match で扱う",
          "並行処理は Arc で安全に共有。Cargo がビルド・テスト・依存管理を一括で担う",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, ComparisonTable, Bridge, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "lang-go",
  title: "Go 言語まとめ",
  description: "Google 製のシンプルで高速な言語 Go。goroutine/channel による並行処理、基本構文、ユースケースを解説する。",
  domain: "web",
  section: "backend",
  order: 5,
  level: "basic",
  tags: ["Go", "並行処理", "言語"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        Go（Golang）は Google が開発した<strong>シンプルで高速</strong>な言語です。2007 年に開発が始まり 2009 年に公開されました。学びやすい構文でありながらコンパイル・実行が速く、なにより <strong>goroutine / channel による並行処理</strong>を言語レベルで扱えるのが最大の武器です。Web / API・マイクロサービス・CLI・インフラツールなど、サーバーサイドの幅広い場面で使われています。
      </Lead>

      <Section>なぜ Go が生まれたか — 設計思想</Section>
      <p>
        Go は「巨大なコードベースを、大勢のエンジニアが、長期間メンテナンスする」という Google 内部の課題から生まれました。当時の主力だった C++ はビルドが遅く言語仕様が巨大、Java は冗長、動的言語は大規模化で型の安全性を欠く——そのどれもが「速く動くが開発が遅い」または「開発は速いが実行が遅い」というトレードオフを抱えていました。Go はこの二択を崩し、<strong>コンパイル言語の速度・安全性と、スクリプト言語の書きやすさを両立</strong>させることを狙って設計されています。
      </p>
      <p>
        その哲学は「機能を足す」ではなく<strong>「機能を削ぎ落とす」</strong>方向に一貫しています。継承・例外・ジェネリクス（長らく非対応）・演算子オーバーロードを大胆に省き、<strong>誰が書いても似た形になる</strong>ことを優先しました。<Cmd>gofmt</Cmd> による強制整形もこの思想の表れで、「書き方の議論に時間を使わない」ことを言語レベルで実現しています。
      </p>

      <Bridge course="プログラミング言語論">
        大学で学ぶ「言語設計はトレードオフの束である（表現力 vs 単純さ、静的 vs 動的、安全性 vs 柔軟性）」という視点は、Go を理解する最短ルートです。Go は<strong>意図的に表現力を捨てて単純さと保守性を取った</strong>言語で、なぜジェネリクスや例外を長く入れなかったのかを「設計上の選択」として読み解くと、言語論の演習がそのまま実務の言語選定の判断軸になります。
      </Bridge>

      <Section>特徴</Section>
      <ul>
        <li><strong>高速なコンパイルと実行</strong> — ビルドが速く、単一バイナリで配布できる</li>
        <li><strong>並行処理が簡単</strong> — goroutine と channel で軽量に並行を書ける</li>
        <li><strong>シンプルな構文</strong> — 機能を絞り、誰が書いても似た形になる</li>
        <li><strong>静的型付け</strong> — コンパイル時に型エラーを検出</li>
        <li><strong>充実した標準ライブラリ</strong> — HTTP サーバーや JSON 処理が標準で揃う</li>
      </ul>

      <Section>Hello, World と基本</Section>
      <Code lang="go" filename="main.go">{`package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`}</Code>

      <Section>並行処理 — goroutine と channel</Section>
      <p>
        関数呼び出しの前に <Cmd>go</Cmd> を付けるだけで、その処理は<strong>別の軽量スレッド（goroutine）</strong>として並行に走ります。goroutine 同士のデータ受け渡しは <strong>channel</strong> を使い、「メモリを共有するのではなく、通信で共有する」というのが Go の思想です。
      </p>

      <SubSection>goroutine は「OS スレッド」ではない</SubSection>
      <p>
        ここが実装の肝です。OS のスレッドは 1 本あたり数 MB のスタックを確保し、生成・切り替えにはカーネルを経由する<strong>コンテキストスイッチ</strong>のコストがかかります。数万本も立てればメモリと切り替えコストで破綻します。goroutine は違います。<strong>初期スタックはわずか数 KB</strong> で必要に応じて伸縮し、切り替えは Go ランタイム内で完結する（カーネルを跨がない）ため桁違いに軽く、数万〜数十万本を平然と走らせられます。
      </p>
      <p>
        これを実現しているのが Go ランタイムの <strong>M:N スケジューラ</strong>です。M 本の goroutine を N 本の OS スレッドに多重化してマッピングします。ある goroutine が I/O で待ちに入ると、スケジューラはその OS スレッドを別の実行可能な goroutine に割り当て直すので、スレッドが遊びません。
      </p>

      <ComparisonTable
        headers={["", "OS スレッド", "goroutine"]}
        rows={[
          ["初期スタック", "数 MB（固定）", "数 KB（可変）"],
          ["生成コスト", "重い（カーネル経由）", "軽い（ランタイム内）"],
          ["切り替え", "コンテキストスイッチ", "ランタイムが協調的に切替"],
          ["同時本数の目安", "数千で限界", "数十万も可能"],
          ["スケジューリング", "OS カーネル", "Go ランタイム(M:N)"],
        ]}
      />

      <Bridge course="オペレーティングシステム">
        OS の講義で学ぶ<strong>プロセス／スレッド／コンテキストスイッチ／スケジューリング</strong>が、そのまま goroutine の設計に対応します。goroutine は OS スレッドの上に乗る「ユーザーレベルスレッド（グリーンスレッド）」で、Go ランタイムが<strong>ユーザー空間で独自スケジューラを持つ</strong>のがポイント。「なぜ軽いのか」は、カーネルモードへの遷移コストとスタックサイズという OS の基礎知識でそのまま説明できます。<Cmd>GOMAXPROCS</Cmd> が「並列に使う CPU コア数」であることも、マルチコアと並列性の理解に直結します。
      </Bridge>

      <Code lang="go" filename="concurrency.go">{`// goroutine を起動する
go func() {
    fmt.Println("並行に実行される")
}()

// channel で値を送受信する
ch := make(chan int)
go func() { ch <- 42 }() // 送信
v := <-ch                // 受信（42 を受け取る）

// 複数の channel を待つ
select {
case msg := <-ch:
    fmt.Println("受信:", msg)
}`}</Code>

      <Callout variant="tip" title="channel は「型付きのパイプ」">
        <Cmd>make(chan int)</Cmd> は int を流すパイプです。送信 <Cmd>ch &lt;- 42</Cmd> と受信 <Cmd>v := &lt;-ch</Cmd> が同期点になり、ロックを自前で書かずに安全にデータを渡せます。
      </Callout>

      <SubSection>CSP — 「通信で共有する」の理論的背景</SubSection>
      <p>
        「メモリを共有するのではなく、通信で共有せよ（Share memory by communicating）」という Go の標語は、単なるスローガンではなく <strong>CSP（Communicating Sequential Processes）</strong>という 1978 年の並行計算モデル（Tony Hoare 提唱）に根ざしています。CSP では、独立した逐次プロセスが<strong>チャネル経由のメッセージ送受信だけで同期・協調</strong>します。共有変数とロックを使わないので、ロック忘れ・デッドロック・競合といった共有メモリ並行の典型的な事故を、設計レベルで避けられます。
      </p>
      <p>
        Go の channel はこの CSP のチャネルをほぼそのまま言語機能にしたものです。バッファなし channel の送受信が<strong>ランデブー（両者が揃うまで待つ同期点）</strong>になるのも CSP の定義どおりです。
      </p>

      <Bridge course="並行計算モデル / 並行処理論">
        講義で扱う <strong>CSP・アクターモデル・共有メモリ + ロック</strong>という並行モデルの三分類が、そのまま実務のフレーム選択に効きます。Go は CSP 系（channel）、Erlang/Elixir や Akka はアクターモデル、Java/C++ の <Cmd>mutex</Cmd> は共有メモリ系。「デッドロック・競合状態・ランデブー同期」といった理論用語は、channel を使うときの落とし穴とそのまま結びつきます。理論の抽象モデルが「なぜ Go はこう書くのか」の答えになっています。
      </Bridge>

      <SubSection>実務での定番 — ワーカープール</SubSection>
      <p>
        channel の実務での王道は<strong>ワーカープール</strong>です。ジョブを流す channel と結果を受ける channel を用意し、決まった数の goroutine（ワーカー）でさばきます。goroutine を無制限に生やすと OS リソースを食い潰すため、「同時実行数を絞る」この形は API のバッチ処理・クローラ・並列変換などで頻出します。
      </p>

      <Code lang="go" filename="worker_pool.go">{`func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {        // jobs が閉じられるまで受け取り続ける
        results <- j * 2         // 処理結果を送る
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // ワーカーを 3 本だけ起動（同時実行数を 3 に制限）
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    for j := 1; j <= 9; j++ { jobs <- j }
    close(jobs)                  // もう送らない合図

    for a := 1; a <= 9; a++ { <-results }
}`}</Code>

      <Callout variant="warn" title="並行処理の落とし穴">
        <ul>
          <li><strong>goroutine リーク</strong>：受信側がいない channel に送ると永遠にブロックし、その goroutine は解放されません。積み重なるとメモリを食い潰します。</li>
          <li><strong>デッドロック</strong>：バッファなし channel を単一 goroutine 内で送受信するとお互いを待ち続けます（<Cmd>fatal error: all goroutines are asleep - deadlock!</Cmd>）。</li>
          <li><strong>close 忘れ</strong>：<Cmd>range ch</Cmd> は channel が <Cmd>close</Cmd> されないと終わりません。送信完了の合図を忘れると受信側が止まります。</li>
          <li><strong>共有変数への競合</strong>：channel を使わず素の変数を複数 goroutine で書くと競合します。<Cmd>go run -race</Cmd> の<strong>レースディテクタ</strong>で検出しましょう。</li>
        </ul>
      </Callout>

      <Figure
        src="/learn/shots/web/lang-go-01.svg"
        alt="go run -race を実行し、DATA RACE が検出されたときのターミナル出力"
        caption="レースディテクタは「どの goroutine がどの行で同じ変数を触ったか」まで出す。競合は勘ではなく計測で見つける。"
      />

      <Section>ネットワークサーバーとしての Go</Section>
      <p>
        Go が Web/API・マイクロサービスで選ばれる決定的な理由が、この並行モデルとネットワーク I/O の相性です。標準の <Cmd>net/http</Cmd> サーバーは、<strong>受け付けたリクエスト 1 本ごとに goroutine を 1 つ割り当てます</strong>。goroutine が軽量なので「1 接続 = 1 goroutine」でも数万接続を捌け、しかもコードは同期的（上から下に読める）に書けます。「C10K 問題（1 万同時接続）」に対して、開発者がイベントループを意識せず素直な逐次コードで立ち向かえるのが Go の強みです。
      </p>

      <Code lang="go" filename="server.go">{`package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        // このハンドラは接続ごとに別 goroutine で並行実行される
        fmt.Fprintln(w, "Hello from Go server")
    })
    http.ListenAndServe(":8080", nil)
}`}</Code>

      <Bridge course="コンピュータネットワーク">
        講義で学ぶ <strong>TCP/ソケット・ブロッキング vs ノンブロッキング I/O・多重化（epoll/kqueue）・C10K 問題</strong>が Go サーバーの土台です。裏側では Go ランタイムが epoll 等のイベント多重化を使ってノンブロッキング I/O を回していますが、<strong>その複雑さを goroutine が隠蔽</strong>し、開発者にはブロッキング風の素直な API を見せます。「なぜ 1 接続 1 goroutine で大量接続を捌けるのか」は、ソケット多重化とスケジューラの知識で説明できます。
      </Bridge>

      <Section>プロジェクト構成とコマンド</Section>
      <SubSection>典型的な構成</SubSection>
      <KVList
        items={[
          { key: "go.mod", val: "モジュール定義・依存管理" },
          { key: "main.go", val: "エントリポイント" },
          { key: "internal/", val: "外部公開しない内部パッケージ" },
          { key: "pkg/", val: "外部からも使える公開パッケージ" },
        ]}
      />

      <SubSection>よく使うコマンド</SubSection>
      <Code lang="bash" filename="terminal">{`go mod init example.com/app   # モジュール初期化
go run main.go                # ビルドせず実行
go build                      # バイナリを生成
go test ./...                 # 全パッケージのテスト
go fmt ./...                  # 自動整形
go vet ./...                  # 静的解析
go get github.com/pkg/name    # 依存の追加`}</Code>

      <Callout variant="info" title="主なユースケース">
        Web / API サーバー、マイクロサービス、CLI / DevOps ツール、インフラ・監視系。Docker や Kubernetes 自体も Go で書かれています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Go は Google 製のシンプル・高速な静的型付け言語。単一バイナリで配布できる",
          "goroutine（go キーワード）と channel で並行処理を言語レベルで扱える",
          "『メモリ共有ではなく通信で共有』が思想。channel が同期点になる",
          "go run / build / test / fmt など標準ツールが揃い、Web・CLI・インフラで広く使われる",
        ]}
      />
    </>
  );
}

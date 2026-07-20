import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "go-setup-and-project",
  title: "Go 環境構築とプロジェクト設計",
  description: "キャラクターデータを返す REST API を Go で作る実践コースの初回。作るものの全体像を掴み、Go のバージョン確認・モジュール初期化・プロジェクト構成の設計を経て、net/http の最小 HTTP サーバを起動して curl で叩くところまでを、コマンド・期待される出力・つまずき対処まで一つずつ確認する。",
  domain: "api-practice",
  section: "setup",
  order: 1,
  level: "intro",
  tags: ["Go", "環境構築", "net/http"],
  updated: "2026-07-07",
  minutes: 16,
};

export default function Article() {
  return (
    <>
      <Lead>
        この実践コースでは、手を動かしながら<strong>キャラクターデータを返す REST API</strong> を Go で一から作ります。
        フレームワークに頼らず、標準ライブラリの <Cmd>net/http</Cmd> と <Cmd>database/sql</Cmd> だけで、
        一覧・絞り込み・1 件取得ができる読み取り専用の参照 API を完成させます。この記事では作るものの全体像を掴み、
        <strong>Go の環境確認・モジュール初期化・プロジェクト構成の設計</strong>を済ませ、
        最後に<strong>「hello を返す最小の HTTP サーバ」</strong>を起動して <Cmd>curl</Cmd> で応答を受け取るところまでを、
        コマンドを一つも飛ばさずに進めます。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <p>この記事を終えると、次の状態になります。</p>
      <KVList
        items={[
          { key: "ゴール", val: "Go のモジュールを初期化し、net/http で最小サーバを起動して curl localhost:8080 で応答が返る" },
          { key: "所要時間", val: "約16分（Go のインストールが済んでいる前提）" },
          { key: "前提①", val: "Go 1.22 以上が入っている（後述の理由で 1.22 が最低ライン）" },
          { key: "前提②", val: "ターミナル（macOS: ターミナル.app、Windows: PowerShell 等）が使える" },
          { key: "前提③", val: "エディタ（VS Code + Go 拡張を推奨）がある" },
        ]}
      />
      <Callout variant="info" title="なぜ Go 1.22 以上が必須なのか">
        Go 1.22 から標準の <Cmd>http.ServeMux</Cmd>（ルーター）が、<Cmd>{'"GET /characters/{id}"'}</Cmd> のように
        <strong>HTTP メソッド＋パスパターン（パス変数）</strong>を直接書けるようになりました。取り出しは <Cmd>{'r.PathValue("id")'}</Cmd> です。
        このコースはこの新機能に全面的に乗るため、<strong>1.21 以前では動きません</strong>。まず <Cmd>go version</Cmd> で確認します。
      </Callout>

      <Section>作るもの — キャラクター API の全体像</Section>
      <p>
        作るのは、キャラクターの一覧と個別データを <strong>JSON</strong> で返す HTTP サーバです。
        データは <strong>SQLite</strong>（ファイル 1 個で完結する軽量 DB）に持ち、リクエストが来たら SQL で取り出して JSON に整形して返します。
        処理の流れは次の一直線です。
      </p>
      <FlowChain
        nodes={[
          { label: "クライアント", sub: "curl / ブラウザ", variant: "alt" },
          { label: "HTTP サーバ", sub: "Go net/http" },
          { label: "SQLite", sub: "database/sql" },
          { label: "JSON", sub: "レスポンス", variant: "cta" },
        ]}
        caption="リクエスト → サーバ → DB 参照 → JSON を返す。この一本道を、章を追って埋めていく"
      />
      <p>最終的に用意するエンドポイントは、次の 2 つだけです（<strong>読み取り専用</strong>の参照 API）。</p>
      <Code lang="text" filename="エンドポイント設計（このコースのゴール）">{`GET  /characters              一覧を取得（?school= &role= &limit= &offset= で絞り込み）
GET  /characters/{id}         id を指定して 1 件を取得`}</Code>
      <p>
        今回のコースは、まず<strong>「動くものを最短で立ち上げ」</strong>、次章以降でデータソースを決め、DB を作り、
        ハンドラを実装し、絞り込み・エラー処理・テストと段階的に肉付けしていきます。
      </p>

      <Section>手順0 — Go が入っているか確認する</Section>
      <p>ターミナルを開いて、まずバージョンを確認します。</p>
      <Code lang="bash" filename="ターミナル">{`go version  # インストール済み Go のバージョンを表示する`}</Code>
      <p>次のように <strong>1.22 以上</strong>のバージョンが表示されれば準備完了です（数値・OS 名は環境で異なります）。</p>
      <Code lang="text" filename="期待される出力">{`go version go1.22.5 darwin/arm64`}</Code>
      <Figure
        src="/learn/shots/api-practice/go-setup-and-project-01.svg"
        alt="ターミナルで go version を実行し、バージョンが表示された画面"
        caption="go version の実行結果。ここが 1.22 以上であることを必ず確認してから先へ進む"
      />
      <Callout variant="warn" title="command not found / 1.21 以前だった場合">
        <ul>
          <li><Cmd>command not found: go</Cmd> と出たら未インストールです。公式（go.dev/dl）のインストーラを入れるか、macOS なら <Cmd>brew install go</Cmd> が手軽です。</li>
          <li><Cmd>go1.21</Cmd> 以前だと、このコースの <Cmd>ServeMux</Cmd> のパスパターンが使えません。<strong>1.22 以上に更新</strong>してから再度 <Cmd>go version</Cmd> で確認します。</li>
          <li>インストール後に <Cmd>go</Cmd> が見つからないときは、<Cmd>PATH</Cmd> に Go の <Cmd>bin</Cmd>（例: <Cmd>/usr/local/go/bin</Cmd>）が通っているかを確認します。</li>
        </ul>
      </Callout>

      <Section>手順1 — プロジェクトを作りモジュールを初期化する</Section>
      <p>
        アプリを置きたい場所にフォルダを作り、その中に移動してから <Cmd>go mod init</Cmd> を実行します。
        引数の <Cmd>github.com/yourname/character-api</Cmd> が<strong>モジュールパス</strong>で、この後すべての <Cmd>import</Cmd> の起点になります
        （<Cmd>yourname</Cmd> は自分の GitHub ユーザー名などに置き換えます。今は公開しなくても構いません）。
      </p>
      <Code lang="bash" filename="ターミナル">{`mkdir character-api  # プロジェクト用のフォルダを新規作成
cd character-api  # 作成したフォルダへ移動
go mod init github.com/yourname/character-api  # go.mod を生成しモジュールを初期化（引数はモジュールパス）`}</Code>
      <p>次のように出力され、フォルダに <Cmd>go.mod</Cmd> が 1 つ作られます。</p>
      <Code lang="text" filename="期待される出力">{`go: creating new go.mod: module github.com/yourname/character-api`}</Code>
      <p>できた <Cmd>go.mod</Cmd> の中身はこれだけです。<strong>モジュール名と、要求する Go バージョン</strong>が記録されています。</p>
      <Code lang="go.mod" filename="go.mod">{`module github.com/yourname/character-api // このモジュールのパス。全 import の起点になる名前

go 1.22 // このモジュールが要求する最低 Go バージョン`}</Code>
      <Callout variant="info" title="モジュールパスは import の起点">
        後の章で <Cmd>internal/store</Cmd> のコードを使うとき、<Cmd>import "github.com/yourname/character-api/internal/store"</Cmd> のように、
        <strong>モジュールパス＋フォルダパス</strong>で参照します。モジュール名は途中で変えると全 import を直す羽目になるので、最初に決め切ります。
      </Callout>

      <Section>手順2 — プロジェクト構成を設計する</Section>
      <p>
        コードを 1 つの <Cmd>main.go</Cmd> に全部書くこともできますが、育てていくと破綻します。
        このコースでは最初から<strong>役割ごとにフォルダを分けた</strong>構成にします（今は空でよい。作りながら埋めます）。
      </p>
      <Code lang="text" filename="プロジェクト構成">{`character-api/
├── go.mod                    モジュール定義
├── main.go                   エントリポイント（サーバ起動・ルーティング）
├── internal/
│   ├── store/
│   │   └── store.go          DB 接続・クエリ（database/sql）
│   └── api/
│       └── handler.go        HTTP ハンドラ（リクエスト処理・JSON 整形）
├── data/
│   └── characters.db         SQLite のデータベースファイル
└── scripts/
    └── seed/
        └── main.go           初期データ投入スクリプト`}</Code>
      <KVList
        items={[
          { key: "main.go", val: "サーバの起動とルーティングだけを担う入口。中身のロジックは持たせない" },
          { key: "internal/store", val: "DB 接続と SQL を閉じ込める層。ここだけが SQLite を知っている" },
          { key: "internal/api", val: "HTTP の入出力を担う層。リクエストを解釈し、store を呼び、JSON を返す" },
          { key: "data/", val: "SQLite のファイルを置く場所。次章で作る" },
          { key: "scripts/seed", val: "DB に初期データを流し込む使い捨てスクリプト。本番サーバとは別プログラム" },
        ]}
      />
      <Callout variant="tip" title="internal/ という名前には意味がある">
        Go では <Cmd>internal/</Cmd> というフォルダは<strong>特別扱い</strong>され、そのモジュールの外からは import できません。
        「このパッケージは外部公開 API ではなく、あくまで内部実装」という意図をコンパイラに強制させる仕組みです。
        キャラ API の内部ロジックは <Cmd>internal/</Cmd> に置いておくのが素直です。
      </Callout>

      <Section>手順3 — 最小の HTTP サーバを書く</Section>
      <p>
        まず「動く一歩」を作ります。<Cmd>main.go</Cmd> に、<Cmd>GET /</Cmd> へアクセスすると <Cmd>hello</Cmd> を返すだけのサーバを書きます。
        <Cmd>http.NewServeMux()</Cmd> でルーターを作り、<Cmd>{'"GET /"'}</Cmd> というパターンで登録するのがポイントです。
      </p>
      <Code lang="go" filename="main.go">{`package main // 実行可能プログラムは main パッケージに属する（package 文はファイル先頭に必須）

import ( // 使うパッケージをまとめて読み込む import ブロック
	"fmt"      // 書式化・出力用の標準パッケージ
	"net/http" // HTTP サーバ機能の標準パッケージ
)

func main() { // func main() はプログラムの実行開始点（エントリポイント）
	mux := http.NewServeMux() // := で新しいルーター（ServeMux）を作り mux に代入

	// メソッド + パスのパターン（Go 1.22 以降）
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) { // "GET /" のパターンに無名ハンドラを登録。func(w, r) がハンドラの形
		fmt.Fprintln(w, "hello, character-api") // 第1引数 w に文字列を書き込む=レスポンス本文になる
	}) // HandleFunc に渡した無名関数の終わり

	addr := ":8080" // 待ち受けアドレスを文字列として宣言（ホスト省略で全インターフェースの 8080 番）
	fmt.Println("listening on", addr) // 起動メッセージを標準出力へ表示
	if err := http.ListenAndServe(addr, mux); err != nil { // addr で待ち受け開始。失敗時のみ err が返り、nil でなければ真
		panic(err) // 回復不能として即座にプログラムを異常終了させる
	} // if の終わり
} // main 関数の終わり`}</Code>
      <SubSection>コードの読み解き</SubSection>
      <KVList
        items={[
          { key: "http.NewServeMux()", val: "リクエストを受けて、パスに応じたハンドラへ振り分けるルーター（多重化器）" },
          { key: '"GET /"', val: "メソッドが GET かつパスが / のときだけ、このハンドラを呼ぶ（1.22 の新記法）" },
          { key: "func(w, r)", val: "ハンドラ本体。w は書き込み先（レスポンス）、r は受け取ったリクエスト" },
          { key: "fmt.Fprintln(w, ...)", val: "レスポンスボディに文字列を書き込む。これがクライアントに返る" },
          { key: "http.ListenAndServe", val: ":8080 で待ち受け、リクエストごとに mux へ渡す。エラーで返ってきたら panic で止める" },
        ]}
      />

      <Section>手順4 — 起動して curl で叩く</Section>
      <p>プロジェクトのルート（<Cmd>character-api/</Cmd>）で、次を実行します。<Cmd>go run .</Cmd> は「今のフォルダのパッケージをビルドして実行」の意味です。</p>
      <Code lang="bash" filename="ターミナル">{`go run .  # カレントディレクトリのパッケージをビルドして実行`}</Code>
      <p>次のように待ち受けメッセージが出れば起動成功です。このターミナルは<strong>開いたまま</strong>にします（サーバは実行中だけ生きています）。</p>
      <Code lang="text" filename="期待される出力">{`listening on :8080`}</Code>
      <Figure
        src="/learn/shots/api-practice/go-setup-and-project-02.svg"
        alt="go run . を実行し listening on :8080 と表示されたまま待ち受けているターミナル"
        caption="この表示のまま止まって見えるのが正常。サーバはここで待ち受け続けている"
      />
      <p><strong>別のターミナル</strong>を開いて、サーバに <Cmd>curl</Cmd> でアクセスします。</p>
      <Code lang="bash" filename="ターミナル（別タブ）">{`curl localhost:8080  # サーバのルート（/）へ GET リクエストを送る`}</Code>
      <p>先ほどハンドラで書き込んだ文字列が返ってくれば、サーバは正しく動いています。</p>
      <Code lang="text" filename="期待される出力">{`hello, character-api`}</Code>
      <Figure
        src="/learn/shots/api-practice/go-setup-and-project-03.svg"
        alt="別のターミナルで curl localhost:8080 を実行し、応答が返ってきた画面"
        caption="別タブから curl を叩いて応答が返れば、サーバとクライアントの往復が成立している"
      />
      <p>
        ブラウザで <Cmd>http://localhost:8080</Cmd> を開いても同じ文字列が表示されます。停止するには、サーバを動かしているターミナルで <Cmd>Ctrl + C</Cmd> を押します。
      </p>
      <Callout variant="warn" title="よくあるつまずき">
        <ul>
          <li><strong>ポートが使用中</strong>：<Cmd>listen tcp :8080: bind: address already in use</Cmd> は 8080 番が別プロセスに使われている状態。別のアプリを止めるか、コードの <Cmd>addr</Cmd> を <Cmd>":8081"</Cmd> 等に変えます。</li>
          <li><strong>curl が接続できない</strong>：<Cmd>Connection refused</Cmd> はサーバが起動していないサイン。<Cmd>go run .</Cmd> したターミナルを閉じていないか、ポート番号が一致しているかを確認します。</li>
          <li><strong>404 page not found が返る</strong>：<Cmd>/</Cmd> 以外のパス（例 <Cmd>/hello</Cmd>）に GET すると出ます。今は <Cmd>{'"GET /"'}</Cmd> しか登録していないので正常な挙動です。</li>
          <li><strong>no required module / cannot find main module</strong>：<Cmd>go mod init</Cmd> を忘れているか、<Cmd>go.mod</Cmd> のあるフォルダの外で <Cmd>go run</Cmd> しています。ルートに戻って実行します。</li>
        </ul>
      </Callout>

      <Section>次章の予告 — データソースを決める</Section>
      <p>
        サーバの骨格ができました。しかし今はまだ返すデータがありません。次章では<strong>「どのデータを載せるか」</strong>を決めます。
        既製の <strong>SchaleDB</strong>（ブルーアーカイブのオープンデータ）のキャラクターを使う道と、
        <strong>自分の好きなデータ</strong>（アニメ・ゲーム・自作）を用意する道の <strong>2 択</strong>を用意します。
        どちらを選んでも、<strong>共通のスキーマ（表の形）に載せる</strong>ので、以降のコードは一切変わりません。まずはデータ源を選ぶところからです。
      </p>

      <Bridge course="ネットワーク（HTTP・クライアントサーバモデル）">
        今日書いた <Cmd>ListenAndServe</Cmd> は、講義で学ぶ<strong>クライアントサーバモデル</strong>そのものです。サーバは特定の
        <strong>ポート（8080）</strong>で待ち受け（<Cmd>listen</Cmd>）、クライアント（curl / ブラウザ）が <strong>TCP</strong> で接続して <strong>HTTP リクエスト</strong>を送り、
        サーバが <strong>HTTP レスポンス</strong>を返します。<Cmd>{'"GET /"'}</Cmd> の <strong>GET</strong> はメソッド（動詞）、<strong>/</strong> はパス（リソースの場所）で、
        「メソッド × パス」で処理を振り分けるのが REST の基本作法です。<Cmd>net/http</Cmd> は、この TCP 接続の受理・HTTP の解析・レスポンス送出を肩代わりしてくれる標準ライブラリです。
      </Bridge>

      <Quiz
        question="Go 1.22 以上をこのコースの必須条件にしているのは、主に何のためですか？"
        options={[
          <>ジェネリクス（型パラメータ）が使えるようになったから</>,
          <>標準の <Cmd>ServeMux</Cmd> が <Cmd>{'"GET /characters/{id}"'}</Cmd> のようなメソッド＋パス変数のパターンに対応したから</>,
          <>SQLite が標準ライブラリに同梱されたから</>,
          <><Cmd>go run</Cmd> が使えるようになったから</>,
        ]}
        answer={1}
        explanation={<>1.22 で <Cmd>ServeMux</Cmd> がメソッド指定とパス変数（<Cmd>{'r.PathValue("id")'}</Cmd> で取得）に対応しました。これにより外部ルーターなしで REST 風のルーティングが書けます。ジェネリクスは 1.18、<Cmd>go run</Cmd> は昔から使え、SQLite は標準同梱ではありません。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "作るのはキャラクターデータを JSON で返す読み取り専用 REST API。標準ライブラリ net/http + database/sql + SQLite で構成",
          "Go 1.22 以上が必須。ServeMux のメソッド＋パス変数（\"GET /characters/{id}\" と r.PathValue）に依存するため",
          "go mod init github.com/yourname/character-api でモジュールを初期化。モジュール名が全 import の起点になる",
          "構成は main.go（入口）/ internal/store（DB）/ internal/api（HTTP）/ data（DBファイル）/ scripts/seed（投入）に役割分割",
          "mux.HandleFunc(\"GET /\", ...) で最小サーバを書き、go run . → curl localhost:8080 で hello が返れば成功",
        ]}
      />
    </>
  );
}

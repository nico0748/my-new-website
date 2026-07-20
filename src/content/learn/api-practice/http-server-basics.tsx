import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, Steps, Step, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "http-server-basics",
  title: "net/http で HTTP サーバを立てる",
  description: "Go 標準ライブラリの net/http だけで HTTP サーバを起動し、Go 1.22 のメソッド付きルーティング（GET /characters/{id}）と r.PathValue でパスパラメータを受け取り、encoding/json で構造体を JSON にして返すまでを、実行コマンド・期待出力・つまずき対処まで一つずつ確認する。",
  domain: "api-practice",
  section: "server",
  order: 1,
  level: "basic",
  tags: ["net/http", "ServeMux", "JSON"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        いよいよ<strong>サーバを立てて HTTP リクエストに応答</strong>します。フレームワークは使いません。Go の標準ライブラリ
        <Cmd>{"net/http"}</Cmd> だけで、<Cmd>{"GET /characters"}</Cmd> と <Cmd>{"GET /characters/{id}"}</Cmd> の 2 本を用意し、
        <Cmd>{"[]Character"}</Cmd> を JSON にして返すところまで進めます。まだ DB は繋ぎません。ダミーデータを返し、
        <Cmd>{"curl"}</Cmd> で叩いて JSON が返ることを確認します。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール", val: "net/http でサーバを起動し、curl localhost:8080/characters が JSON を返す状態にする" },
          { key: "所要時間", val: "約18分" },
          { key: "前提①", val: "Go 1.22 以上が入っている（go version で確認）" },
          { key: "前提②", val: "モジュール github.com/yourname/character-api を作成済み（前章）" },
          { key: "前提③", val: "curl と jq が使える（jq は無くても可）" },
        ]}
      />
      <p>
        前章「データベース構築」で <Cmd>{"Character"}</Cmd> 型を定義しました。この記事でも使うので、まず軽く再掲します。
        DB のスキーマ列（snake_case）と JSON のキー（camelCase）を、構造体タグで対応づけているのがポイントです。
      </p>
      <Code lang="go" filename="internal/store/character.go">{`package store // このファイルが store パッケージに属すると宣言（package 文はファイル先頭に必須）

// Character は 1 人分のキャラクターデータ。
// DB のカラム（snake_case）を、JSON のキー（camelCase）に対応づける。
type Character struct { // type 名 struct { ... } で新しい構造体型を定義する
	ID          int64  \`json:"id"\`          // int64 型のフィールド。右のタグで JSON キーを id に指定（先頭大文字=外部公開）
	Name        string \`json:"name"\`        // 文字列フィールド。JSON では name というキーで入出力される
	School      string \`json:"school"\`      // 所属学校名の文字列。JSON キーは school
	Club        string \`json:"club"\`        // 部活名の文字列。JSON キーは club
	StarGrade   int    \`json:"starGrade"\`   // int 型。JSON では starGrade（camelCase）に変換される
	SquadType   string \`json:"squadType"\`   // 部隊種別の文字列。JSON キーは squadType
	TacticRole  string \`json:"tacticRole"\`  // 戦術ロールの文字列。JSON キーは tacticRole
	Position    string \`json:"position"\`    // 立ち位置の文字列。JSON キーは position
	BulletType  string \`json:"bulletType"\`  // 弾種の文字列。JSON キーは bulletType
	ArmorType   string \`json:"armorType"\`   // 装甲種別の文字列。JSON キーは armorType
	WeaponType  string \`json:"weaponType"\`  // 武器種別の文字列。JSON キーは weaponType
	Age         string \`json:"age"\`         // 年齢(文字列 例:"16 years old")。JSON キーは age
	Birthday    string \`json:"birthday"\`    // 誕生日を文字列で保持。JSON キーは birthday
	AttackPower int    \`json:"attackPower"\` // 攻撃力の int。JSON では attackPower に変換
	MaxHP       int    \`json:"maxHp"\`       // 最大 HP の int。JSON キーは maxHp（Go 名と綴りが違う例）
	Profile     string \`json:"profile"\`     // プロフィール文の文字列。JSON キーは profile
} // 構造体定義の終わり`}</Code>
      <Callout variant="info" title="構造体タグ（バッククォート）の読み方">
        フィールドの右にある <Cmd>{"`json:\"name\"`"}</Cmd> は<strong>構造体タグ</strong>です。<Cmd>{"encoding/json"}</Cmd> はこれを見て、
        Go の <Cmd>{"Name"}</Cmd> を JSON では <Cmd>{"name"}</Cmd> というキーで出力します。タグが無いと、フィールド名がそのまま
        （先頭大文字の <Cmd>{"Name"}</Cmd>）で出力されてしまうため、API のキー名を制御するのに必須です。
      </Callout>

      <Section>net/http の登場人物を整理する</Section>
      <p>
        Go で HTTP サーバを組むのに必要な部品は、たった 3 つの考え方に整理できます。まずここを言葉で押さえます。
      </p>
      <KVList
        items={[
          { key: "ServeMux（マルチプレクサ）", val: "「どの URL に、どの処理を割り当てるか」の対応表。ルーターに相当する" },
          { key: "ハンドラ関数", val: "1 本のリクエストを処理する関数。func(w http.ResponseWriter, r *http.Request)" },
          { key: "ListenAndServe", val: "指定ポートで待ち受け、届いたリクエストを ServeMux に渡し続ける" },
        ]}
      />
      <SubSection>ハンドラ関数のかたち — w と r の意味</SubSection>
      <p>
        すべてのハンドラは <Cmd>{"func(w http.ResponseWriter, r *http.Request)"}</Cmd> という同じ形をしています。
        引数は 2 つだけです。
      </p>
      <ComparisonTable
        headers={["引数", "型", "役割"]}
        rows={[
          [<Cmd>{"w"}</Cmd>, <Cmd>{"http.ResponseWriter"}</Cmd>, "レスポンスの書き込み先。ここに書いた内容がクライアントへ返る（出口）"],
          [<Cmd>{"r"}</Cmd>, <Cmd>{"*http.Request"}</Cmd>, "受け取ったリクエスト。URL・メソッド・ヘッダ・ボディなどが入っている（入口）"],
        ]}
      />
      <p>
        <Cmd>{"w"}</Cmd> は「出口（レスポンス）」、<Cmd>{"r"}</Cmd> は「入口（リクエスト）」と覚えると迷いません。
        <Cmd>{"r"}</Cmd> がポインタ（<Cmd>{"*http.Request"}</Cmd>）なのは、リクエストが大きな構造体で、コピーを避けて渡すためです。
      </p>

      <Section>まず「Hello」を返す最小サーバ</Section>
      <p>
        いきなり JSON にせず、まず 1 本のハンドラで文字列を返す最小構成から始めます。<Cmd>{"main.go"}</Cmd> にそのまま書きます。
      </p>
      <Code lang="go" filename="main.go">{`package main // 実行可能プログラムは必ず main パッケージにする（ライブラリではない印）

import ( // 複数パッケージをまとめて読み込む import ブロック
	"fmt"      // 標準の書式化・出力パッケージ（Fprintln 等）
	"log"      // ログ出力パッケージ（Println・Fatal 等）
	"net/http" // HTTP サーバ／クライアント機能の標準パッケージ
)

func main() { // func main() はプログラムの実行開始点（エントリポイント）
	// 1. ルーター（対応表）を作る
	mux := http.NewServeMux() // := は短絡変数宣言。新しい ServeMux（ルーター）を作り mux に代入

	// 2. 「/health に来たらこの関数」を登録する
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) { // パスと無名関数(ハンドラ)を対応表に登録。func(w, r) がハンドラのシグネチャ
		fmt.Fprintln(w, "ok") // w に書くとレスポンスボディになる
	}) // HandleFunc に渡した無名関数の終わり

	// 3. :8080 で待ち受け、リクエストを mux にさばかせる
	log.Println("listening on :8080") // 起動メッセージを出力する
	if err := http.ListenAndServe(":8080", mux); err != nil { // if の初期化文で待ち受け開始し戻り値 err を受け、nil でない=失敗を判定
		log.Fatal(err) // エラー内容を出力してプログラムを終了させる（ログ出力+os.Exit(1)）
	} // if 文の終わり
} // main 関数の終わり`}</Code>
      <Steps>
        <Step title="サーバを起動する">
          <Code lang="bash" filename="ターミナル">{`go run .  # カレントディレクトリのパッケージをビルドして即実行する`}</Code>
          <p>次のように出れば待ち受け開始です。このターミナルは<strong>起動中は閉じない</strong>でください。</p>
          <Code lang="text" filename="期待される出力">{`2026/07/07 10:00:00 listening on :8080`}</Code>
        </Step>
        <Step title="別のターミナルから叩く">
          <Code lang="bash" filename="別のターミナル">{`curl localhost:8080/health  # /health エンドポイントへ GET リクエストを送る`}</Code>
          <Code lang="text" filename="期待される出力">{`ok`}</Code>
        </Step>
      </Steps>
      <Figure
        src="/learn/shots/api-practice/http-server-basics-01.svg"
        alt="左のターミナルで go run . を起動し、右のターミナルで curl /health を叩いた画面"
        caption="サーバ用と curl 用でターミナルを2つ使う。この形が以降ずっと基本になる"
      />
      <Callout variant="info" title="なぜ log.Fatal で包むのか">
        <Cmd>{"ListenAndServe"}</Cmd> は正常時は<strong>戻ってこない</strong>（ずっと待ち受ける）関数です。戻ってくるのは
        「ポートが使用中」などで起動に失敗したときだけで、その戻り値は必ずエラーになります。だから <Cmd>{"if err := ...; err != nil"}</Cmd>
        で受けて <Cmd>{"log.Fatal"}</Cmd> で理由を表示して終了させます。エラーを握りつぶさないのが Go の作法です。
      </Callout>

      <Section>Go 1.22 のメソッド付きルーティング</Section>
      <p>
        API では「同じ URL でもメソッドで処理を分けたい」「<Cmd>{"/characters/1"}</Cmd> の <Cmd>{"1"}</Cmd> を取り出したい」という要求が出ます。
        <strong>Go 1.22 以降</strong>、標準の <Cmd>{"ServeMux"}</Cmd> がこれを直接サポートするようになりました。パターンに<strong>メソッドとパス変数</strong>を書けます。
      </p>
      <Code lang="go" filename="ルーティングの登録例">{`mux.HandleFunc("GET /characters", listHandler)      // "GET /characters" はメソッド+パスのパターン。合致時に listHandler を呼ぶよう登録（一覧）
mux.HandleFunc("GET /characters/{id}", getHandler)  // {id} はパス変数。GET /characters/任意 に合致し getHandler を呼ぶ（1 件）`}</Code>
      <p>
        <Cmd>{"{id}"}</Cmd> の部分は<strong>パスパラメータ</strong>で、ハンドラ内では <Cmd>{"r.PathValue(\"id\")"}</Cmd> で文字列として取り出せます。
      </p>
      <Code lang="go" filename="パス変数の取り出し">{`func getHandler(w http.ResponseWriter, r *http.Request) { // ハンドラ関数の定義。w=レスポンス出口、r=リクエスト入口（*はポインタ）
	id := r.PathValue("id") // r.PathValue はパス変数を取り出すメソッド。"/characters/42" なら "42"（文字列）
	// 数値として使うなら strconv.Atoi で変換する（後述）
	_ = id // _ は空白識別子。未使用変数のコンパイルエラーを避けるため id を捨てている
} // getHandler の終わり`}</Code>
      <SubSection>旧来のやり方との違い（軽く）</SubSection>
      <p>
        Go 1.21 以前の <Cmd>{"ServeMux"}</Cmd> はメソッド判定もパス変数も持っていませんでした。そのため、次のような手作業が必要でした。
      </p>
      <ComparisonTable
        headers={["やりたいこと", "旧来（〜1.21）", "Go 1.22 以降"]}
        rows={[
          ["メソッドで分岐", <>ハンドラ内で <Cmd>{"if r.Method != \"GET\""}</Cmd> を自分で書く</>, <>パターンに <Cmd>{"GET "}</Cmd> と書くだけ</>],
          ["ID を取り出す", <><Cmd>{"strings.TrimPrefix"}</Cmd> でパスを自前で分解</>, <><Cmd>{"r.PathValue(\"id\")"}</Cmd> で一発</>],
          ["外部ルーター", <>chi / gorilla/mux を追加していた</>, <>標準だけで足りることが増えた</>],
        ]}
      />
      <Callout variant="tip" title="今からは標準ルーターで十分なことが多い">
        以前は「パス変数が欲しいなら外部ルーター」が定番でしたが、Go 1.22 でその多くが標準に取り込まれました。この教材では
        <strong>依存を増やさず標準の <Cmd>{"ServeMux"}</Cmd> だけ</strong>で進めます。学ぶことが減り、Go のバージョンアップにも強くなります。
      </Callout>

      <Section>encoding/json で構造体を JSON にして返す</Section>
      <p>
        文字列ではなく JSON を返します。Go の値を JSON に変換することを<strong>マーシャリング（marshal）</strong>と呼びます。
        レスポンスへ書くだけなら <Cmd>{"json.NewEncoder(w).Encode(v)"}</Cmd> が簡潔です。JSON を返すときの手順は次の 3 ステップです。
      </p>
      <Steps>
        <Step title="Content-Type ヘッダを立てる">
          <p>これから返すのが JSON だとクライアントに伝えます。<strong>ボディを書く前に</strong>設定します。</p>
          <Code lang="go" filename="">{`w.Header().Set("Content-Type", "application/json") // w.Header() でヘッダ集合を取得し .Set でメソッドチェーン。返す本文が JSON だと宣言する`}</Code>
        </Step>
        <Step title="必要ならステータスコードを書く（省略時 200）">
          <p><Cmd>{"w.WriteHeader(http.StatusOK)"}</Cmd>。省略すると最初の書き込みで自動的に 200 になります。</p>
        </Step>
        <Step title="値をエンコードして書き込む">
          <Code lang="go" filename="">{`json.NewEncoder(w).Encode(characters) // w に書き込む Encoder を作り、.Encode で Go の値を JSON に変換して書き出す（メソッドチェーン）`}</Code>
        </Step>
      </Steps>

      <Section>ダミーデータを返す一覧ハンドラを作る</Section>
      <p>
        DB はまだ繋ぎません。関数内に固定の <Cmd>{"[]Character"}</Cmd> を用意して返します。<Cmd>{"main.go"}</Cmd> を次のように書き換えます。
      </p>
      <Code lang="go" filename="main.go">{`package main // 実行ファイルになる main パッケージ

import ( // 使用する標準パッケージをまとめて読み込む
	"encoding/json" // Go の値と JSON を相互変換するパッケージ
	"log"           // ログ出力用
	"net/http"      // HTTP サーバ機能
	"strconv"       // 文字列と数値の変換用（ParseInt 等）
)

// ※ Character は本来 internal/store にあるが、この章では説明のため同ファイルに置く
type Character struct { // キャラ 1 人分を表す構造体型の定義
	ID   int64  \`json:"id"\`   // ID フィールド。JSON キーは id
	Name string \`json:"name"\` // 名前フィールド。JSON キーは name
	Age  string \`json:"age"\`  // 年齢(文字列)。JSON キーは age
} // 構造体定義の終わり

// ダミーデータ（次章で DB 取得に置き換える）
var dummy = []Character{ // []Character は Character のスライス（可変長リスト）。パッケージ変数として初期化
	{ID: 1, Name: "Shiroko", Age: "16 years old"}, // 複合リテラルで 1 要素目を作成（フィールド名を指定して初期化）
	{ID: 2, Name: "Hoshino", Age: "17 years old"}, // 2 要素目。Go では末尾要素にもカンマが必要
} // スライスリテラルの終わり

func listHandler(w http.ResponseWriter, r *http.Request) { // 一覧を返すハンドラ。w=出口、r=入口
	w.Header().Set("Content-Type", "application/json") // 先にヘッダ。返す本文が JSON だと宣言する
	if err := json.NewEncoder(w).Encode(dummy); err != nil { // dummy を JSON にして w へ書き出し、戻り値 err が nil でなければ失敗
		http.Error(w, err.Error(), http.StatusInternalServerError) // 500 とエラーメッセージをまとめて返すヘルパー
	} // if の終わり
} // listHandler の終わり

func getHandler(w http.ResponseWriter, r *http.Request) { // ID 指定で 1 件返すハンドラ
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64) // パス変数 id を10進・64bit の整数へ変換。値とエラーの2値を同時に受ける
	if err != nil { // 変換に失敗した（数値でない）場合
		http.Error(w, "invalid id", http.StatusBadRequest) // 400 を返す
		return // 以降を実行せずハンドラを抜ける
	} // if の終わり
	for _, c := range dummy { // range でスライスを反復。添字は不要なので _ で捨て、要素を c に受ける
		if c.ID == id { // 要素の ID が指定 id と一致したら
			w.Header().Set("Content-Type", "application/json") // JSON を返すヘッダを設定
			json.NewEncoder(w).Encode(c)                       // 一致した 1 件を JSON にして書き出す
			return                                             // 見つかったので処理を終了
		} // if の終わり
	} // for ループの終わり
	http.Error(w, "not found", http.StatusNotFound) // ループを抜けた=見つからず。404 を返す
} // getHandler の終わり

func main() { // エントリポイント
	mux := http.NewServeMux()                           // ルーター（対応表）を新規作成
	mux.HandleFunc("GET /characters", listHandler)      // GET /characters を listHandler に割り当て
	mux.HandleFunc("GET /characters/{id}", getHandler)  // {id} 付きパスを getHandler に割り当て（パス変数）

	log.Println("listening on :8080") // 起動メッセージを出力
	if err := http.ListenAndServe(":8080", mux); err != nil { // :8080 で待ち受け開始。失敗時のみ err が返る
		log.Fatal(err) // エラーを表示して終了
	} // if の終わり
} // main の終わり`}</Code>
      <p>
        <Cmd>{"http.Error(w, msg, code)"}</Cmd> は「エラーメッセージ＋指定ステータス」をまとめて返すヘルパーです。
        <Cmd>{"http.StatusBadRequest"}</Cmd>（400）や <Cmd>{"http.StatusNotFound"}</Cmd>（404）といった定数を使うと、数字の意味が読みやすくなります。
      </p>

      <Section>curl で動作確認する</Section>
      <p>サーバを起動し直し（<Cmd>{"go run ."}</Cmd>）、別ターミナルから叩きます。</p>
      <Steps>
        <Step title="一覧を取得する">
          <Code lang="bash" filename="別のターミナル">{`curl localhost:8080/characters | jq  # 一覧を取得し jq に渡して JSON を整形表示`}</Code>
          <Code lang="json" filename="期待される出力">{`[
  { "id": 1, "name": "Shiroko", "age": 16 },
  { "id": 2, "name": "Hoshino", "age": 17 }
]`}</Code>
          <Figure
            src="/learn/shots/api-practice/http-server-basics-02.svg"
            alt="curl で /characters を叩き、jq で整形された JSON 配列が表示された画面"
            caption="jq を通すと配列の構造が読みやすくなる。キー名が camelCase になっているかも確認する"
          />
          <p>
            <Cmd>{"jq"}</Cmd> は JSON を整形表示するツールです。入っていなければ <Cmd>{"| jq"}</Cmd> を外せば生の 1 行 JSON が出ます。
          </p>
        </Step>
        <Step title="1 件を取得する">
          <Code lang="bash" filename="別のターミナル">{`curl localhost:8080/characters/2 | jq  # id=2 の 1 件を取得し jq で整形`}</Code>
          <Code lang="json" filename="期待される出力">{`{ "id": 2, "name": "Hoshino", "age": 17 }`}</Code>
        </Step>
        <Step title="存在しない ID とステータスを確認する">
          <p><Cmd>{"-i"}</Cmd> を付けるとステータス行とヘッダも表示されます。404 が返ることを確認します。</p>
          <Code lang="bash" filename="別のターミナル">{`curl -i localhost:8080/characters/999  # -i でステータス行とヘッダも表示。存在しない id で 404 を確認`}</Code>
          <Code lang="text" filename="期待される出力">{`HTTP/1.1 404 Not Found
Content-Type: text/plain; charset=utf-8
...
not found`}</Code>
          <Figure
            src="/learn/shots/api-practice/http-server-basics-03.svg"
            alt="curl -i で存在しない id を叩き、404 のステータス行が表示された画面"
            caption="-i を付けるとステータス行が見える。ボディだけでなくステータスまで確認する癖をつける"
          />
        </Step>
      </Steps>

      <Section>つまずきポイント</Section>
      <Callout variant="warn" title="ありがちな 3 つのミス">
        <ul>
          <li>
            <strong>Content-Type を設定し忘れる</strong>：ヘッダ無しでも JSON 文字列は返りますが、<Cmd>{"Content-Type"}</Cmd> が
            <Cmd>{"text/plain"}</Cmd> のままになり、ブラウザや一部クライアントが JSON として扱ってくれません。必ず設定します。
          </li>
          <li>
            <strong>WriteHeader を Encode の後に呼ぶ</strong>：<Cmd>{"json.NewEncoder(w).Encode(...)"}</Cmd> は最初の書き込みで
            <strong>自動的にヘッダ（200）を確定</strong>させます。その後に <Cmd>{"w.WriteHeader(404)"}</Cmd> を呼んでも
            <Cmd>{"superfluous response.WriteHeader call"}</Cmd> という警告が出て無視されます。ステータスは<strong>ボディを書く前</strong>に決めます。
          </li>
          <li>
            <strong>パターンの前方一致を誤解する</strong>：<Cmd>{"GET /characters"}</Cmd> は「<Cmd>{"/characters"}</Cmd> ちょうど」にマッチし、
            <Cmd>{"/characters/1"}</Cmd> にはマッチしません。<Cmd>{"/characters/1"}</Cmd> には別途 <Cmd>{"GET /characters/{id}"}</Cmd> の登録が必要です
            （末尾スラッシュ <Cmd>{"/characters/"}</Cmd> を書くと配下すべてに広く前方一致するので、意図しない限り避けます）。
          </li>
        </ul>
      </Callout>

      <Bridge course="ネットワーク（HTTP）／OS（並行処理）">
        <p>
          クライアントとサーバは <strong>HTTP のリクエスト／レスポンス</strong>で対話します。<Cmd>{"curl"}</Cmd> が送る
          「メソッド＋パス＋ヘッダ」がリクエスト、サーバが返す「<strong>ステータスコード</strong>＋ヘッダ＋ボディ」がレスポンス——
          この往復こそがネットワークの授業で学ぶ HTTP そのものです。200 / 400 / 404 / 500 といった<strong>ステータスコードの分類</strong>
          （2xx 成功・4xx クライアント起因・5xx サーバ起因）を意識して返すのが REST の基本作法です。
        </p>
        <p>
          そして <Cmd>{"http.ListenAndServe"}</Cmd> は、リクエストが来るたびに<strong>新しい goroutine を起動して各リクエストを並行に処理</strong>します。
          OS の授業で学ぶ<strong>並行処理</strong>を、Go は言語機能（goroutine）として提供しており、開発者はスレッド管理を意識せずに
          「1 リクエスト＝1 ハンドラ呼び出し」を書けます。ただし複数リクエストが同じ変数を触ると競合するため、共有状態の扱いには注意が要ります（次章の DB 接続で重要になります）。
        </p>
      </Bridge>

      <Quiz
        question="ハンドラ内で 404 を返したいのに WriteHeader が効かず superfluous response.WriteHeader call という警告が出ます。原因として最も可能性が高いのは？"
        options={[
          <>ポート番号が間違っている</>,
          <><Cmd>{"json.NewEncoder(w).Encode(...)"}</Cmd> でボディを書いた<strong>後</strong>に <Cmd>{"w.WriteHeader(404)"}</Cmd> を呼んでいる</>,
          <><Cmd>{"Content-Type"}</Cmd> ヘッダを設定していない</>,
          <>ルーティングに <Cmd>{"{id}"}</Cmd> を書き忘れている</>,
        ]}
        answer={1}
        explanation={<>レスポンスへの最初の書き込み時にステータスは確定します。ボディ（Encode）を書いた後の <Cmd>{"WriteHeader"}</Cmd> は手遅れで無視されます。ステータスは<strong>ボディを書く前</strong>に <Cmd>{"WriteHeader"}</Cmd> か <Cmd>{"http.Error"}</Cmd> で決めます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "net/http の三役：ServeMux（対応表）/ ハンドラ func(w, r) / ListenAndServe(:8080, mux)",
          "w は出口（レスポンス）、r は入口（リクエスト）。r は大きいのでポインタ *http.Request",
          "Go 1.22 は GET /characters/{id} のようにメソッド＋パス変数を書け、r.PathValue(\"id\") で取り出せる",
          "JSON は「Content-Type を先に設定 → 必要ならステータス → json.NewEncoder(w).Encode(v)」の順",
          "つまずき：Content-Type 忘れ／Encode 後の WriteHeader（手遅れ）／パターンの前方一致の誤解",
        ]}
      />
    </>
  );
}

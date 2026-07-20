import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "middleware-logging",
  title: "ミドルウェアとロギング",
  description: "ハンドラの前後に共通処理を挟むミドルウェアの仕組みを、型・合成（チェーン）から実装まで学ぶ。log/slog による構造化ログ、リクエストID、パニックからの復帰、CORS を net/http だけで組み立て、main.go でチェーンとして mux に適用する。",
  domain: "api-practice",
  section: "quality",
  order: 1,
  level: "practice",
  tags: ["ミドルウェア", "ロギング", "CORS"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        ここまでで <Cmd>{"GET /characters"}</Cmd> と <Cmd>{"GET /characters/{id}"}</Cmd> が動くようになりました。
        しかし「すべてのリクエストにログを残したい」「どのハンドラで panic が起きても 500 を返して落ちないようにしたい」「ブラウザから叩けるよう CORS を付けたい」——
        これらは<strong>個々のハンドラの仕事ではありません</strong>。全リクエストに共通して被せる処理です。
        この記事では、その受け皿となる<strong>ミドルウェア</strong>を、標準 <Cmd>net/http</Cmd> だけで組み立てます。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール", val: "ロギング・リクエストID・リカバリ・CORS の4つのミドルウェアを実装し、main.go でチェーンとして mux に適用できる" },
          { key: "所要時間", val: "約18分" },
          { key: "前提①", val: "Go 1.22 以上（ルーティングパターン GET /characters/{id} を使う）" },
          { key: "前提②", val: "前章までで internal/api の handler と、統一エラー { \"error\": \"...\" } が実装済み" },
          { key: "使うパッケージ", val: "net/http, log/slog, context, time（すべて標準ライブラリ・追加インストール不要）" },
        ]}
      />

      <Section>ミドルウェアとは — ハンドラを包む「層」</Section>
      <p>
        ミドルウェアは、<strong>ハンドラの前後に共通処理を挟み込む仕組み</strong>です。リクエストは外側の層から順に通り抜けて中心のハンドラに届き、
        レスポンスは逆順で層を戻ってきます。ログ・認証・CORS のような<strong>横断的関心事</strong>（どのエンドポイントにも共通して必要な処理）を、
        ハンドラ本体から切り離して書けるのが利点です。
      </p>
      <LayerStack
        layers={[
          { label: "CORS", sub: "Origin ヘッダを付与 / OPTIONS を捌く" },
          { label: "Logging", sub: "メソッド・パス・ステータス・所要時間を記録" },
          { label: "Recovery", sub: "panic を捕まえて 500 に変換" },
          { label: "RequestID", sub: "リクエストごとの ID を context へ" },
          { label: "Handler", sub: "本体（List / Get）" },
        ]}
        caption="リクエストは上から下へ層を通り、レスポンスは下から上へ戻る"
      />

      <SubSection>ミドルウェアの型 — 「ハンドラを受け取り、ハンドラを返す」</SubSection>
      <p>
        Go のミドルウェアは、<Cmd>{"func(next http.Handler) http.Handler"}</Cmd> という型の関数です。
        「次に呼ぶハンドラ（<Cmd>next</Cmd>）を受け取り、それを包んだ<strong>新しいハンドラを返す</strong>」という形をしています。
        返すハンドラの中で <Cmd>next.ServeHTTP(w, r)</Cmd> を呼ぶ前後に、好きな処理を書けます。
      </p>
      <Code lang="go" filename="ミドルウェアの骨格">{`// これがミドルウェアの基本形。
// next（本来のハンドラ）を包み、新しいハンドラを返す。
func Example(next http.Handler) http.Handler { // 引数も戻り値も http.Handler ＝「ハンドラを受け取りハンドラを返す」ミドルウェアの型
	// http.HandlerFunc は func(w, r) 形の関数を http.Handler に変えるアダプタ。これを return する
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// --- next の前に挟む処理（前処理）--- ここは next 呼び出しの前に実行される

		next.ServeHTTP(w, r) // 内側の層（最終的にハンドラ）を呼ぶ＝ここで制御を1つ内側へ渡す

		// --- next の後に挟む処理（後処理）--- next が返ってきた後に実行される
	}) // http.HandlerFunc の終わり
} // Example の終わり`}</Code>
      <Callout variant="info" title="http.Handler と http.HandlerFunc">
        <Cmd>http.Handler</Cmd> は <Cmd>ServeHTTP(w, r)</Cmd> メソッドを持つインターフェースです。
        <Cmd>http.HandlerFunc</Cmd> は「関数を <Cmd>http.Handler</Cmd> に変える」アダプタで、
        <Cmd>{"func(w, r)"}</Cmd> 形の関数をそのままハンドラとして扱えるようにします。ミドルウェアが返すのはこの <Cmd>HandlerFunc</Cmd> です。
      </Callout>

      <SubSection>合成（チェーン）— 層を重ねる</SubSection>
      <p>
        ミドルウェアは<strong>入れ子にして重ねられます</strong>。<Cmd>A(B(C(handler)))</Cmd> と包めば、A が一番外側、C が一番内側になります。
        これを毎回手で書くと読みにくいので、可変長引数でまとめて適用する小さなヘルパを用意します。
      </p>
      <Code lang="go" filename="internal/middleware/chain.go">{`package middleware // このファイル群がまとまる middleware パッケージの宣言

import "net/http" // HTTP サーバ関連の標準パッケージを取り込む

// Middleware は「ハンドラを受け取りハンドラを返す関数」に付けた型名（別名）。以後この型で使い回す
type Middleware func(http.Handler) http.Handler

// Chain は mws を「左が外側」になるように h へ適用する。
// Chain(h, A, B, C) は A(B(C(h))) と同じ。
func Chain(h http.Handler, mws ...Middleware) http.Handler { // mws ...Middleware は可変長引数（0個以上のミドルウェアをスライスで受ける）
	// 内側から包むので、後ろから順に適用する。
	for i := len(mws) - 1; i >= 0; i-- { // 末尾（一番内側）から先頭へ逆順にループ
		h = mws[i](h) // i 番目のミドルウェアで今の h を包み、その結果を新しい h にする
	} // for ループの終わり
	return h // すべて包み終えたハンドラを返す
}`}</Code>

      <Section>ロギングミドルウェア — 構造化ログでリクエストを記録する</Section>
      <p>
        Go 1.21 から標準の <Cmd>log/slog</Cmd> が使えます。<strong>構造化ログ</strong>（キー・値の組で出す JSON など）は、
        後から検索・集計しやすく、本番の可観測性の土台になります。記録したいのは<strong>メソッド・パス・ステータスコード・所要時間</strong>です。
      </p>
      <SubSection>ステータスコードを捕まえる — ResponseWriter をラップする</SubSection>
      <p>
        ここに一つ落とし穴があります。<Cmd>http.ResponseWriter</Cmd> は<strong>書き込んだステータスコードを後から読み出せません</strong>。
        そこで、<Cmd>WriteHeader</Cmd> を横取りしてコードを控える小さな struct で <Cmd>ResponseWriter</Cmd> を包みます。
      </p>
      <Code lang="go" filename="internal/middleware/logging.go">{`package middleware // middleware パッケージ

import ( // 複数パッケージをまとめて取り込む
	"log/slog" // 構造化ログ（キー・値で出力）の標準パッケージ
	"net/http" // HTTP サーバ関連
	"time"     // 時刻・経過時間の計測
)

// statusRecorder は ResponseWriter を包み、書き込まれた
// ステータスコードを覚えておくためのラッパ。
type statusRecorder struct { // type X struct{...} は構造体（複数フィールドをまとめた型）の定義
	http.ResponseWriter // 埋め込み：Write など他のメソッドはそのまま使える
	status int          // 横取りしたステータスコードを保持するフィールド
} // 構造体定義の終わり

// WriteHeader を横取りして status を控える。
func (r *statusRecorder) WriteHeader(code int) { // (r *statusRecorder) はレシーバ＝この struct に紐づくメソッド定義
	r.status = code                    // 渡されたコードを自分のフィールドに記録
	r.ResponseWriter.WriteHeader(code) // 本来の書き込みも忘れず行う（埋め込んだ元の WriteHeader を呼ぶ）
} // WriteHeader の終わり

// Logging はメソッド・パス・ステータス・所要時間を slog で記録する。
func Logging(logger *slog.Logger) Middleware { // logger を受け取り Middleware（＝ミドルウェア関数）を返す
	return func(next http.Handler) http.Handler { // これが返すミドルウェア本体（next を包む）
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { // 実際に呼ばれるハンドラ
			start := time.Now() // 計測開始時刻を記録
			// WriteHeader が呼ばれない場合の既定は 200。
			rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK} // w を包んだ記録用ラッパを生成（&で作成しポインタを持つ）

			next.ServeHTTP(rec, r) // ← 本物の w ではなく rec を渡すのが肝（これで status を拾える）

			logger.Info("request", // "request" というメッセージで構造化ログを1行出力
				slog.String("method", r.Method),            // HTTP メソッド（GET など）を文字列で記録
				slog.String("path", r.URL.Path),            // リクエストパスを文字列で記録
				slog.Int("status", rec.status),             // 記録しておいたステータスコードを整数で記録
				slog.Duration("elapsed", time.Since(start)), // start からの経過時間を記録（time.Since で差分）
			) // logger.Info の終わり
		}) // http.HandlerFunc の終わり
	} // ミドルウェア本体の終わり
}`}</Code>
      <Callout variant="warn" title="rec を next に渡し忘れると status が取れない">
        <Cmd>next.ServeHTTP(rec, r)</Cmd> の第1引数を、うっかり元の <Cmd>w</Cmd> にしてしまうと、
        ハンドラは <Cmd>w</Cmd> に直接書き込むので <Cmd>rec.status</Cmd> は初期値のまま——ログのステータスが常に 200 になります。
        <strong>包んだ <Cmd>rec</Cmd> を必ず内側へ渡す</strong>こと。ここはラップ漏れが起きやすい定番のミスです。
      </Callout>

      <Section>リクエストID — context にリクエスト単位の識別子を載せる</Section>
      <p>
        1本のリクエストにまつわるログを後から追跡できるよう、<strong>リクエストID</strong>を発行します。
        値は <Cmd>context.Context</Cmd> に載せてハンドラや下位関数へ引き回し、レスポンスヘッダにも返します。
        context のキーは<strong>他パッケージと衝突しない独自型</strong>にするのが作法です。
      </p>
      <Code lang="go" filename="internal/middleware/requestid.go">{`package middleware // middleware パッケージ

import ( // 使うパッケージ群
	"context" // リクエスト単位の値を持ち回す context
	"net/http" // HTTP サーバ関連
	"strconv"  // 数値→文字列などの変換
	"time"     // 時刻（採番の種に使う）
)

// context のキーは独自型にして衝突を避ける（string 直書きは避ける）。
type ctxKey string // string を基にした独自の型。他パッケージの string キーと衝突しない

const requestIDKey ctxKey = "requestID" // context に値を出し入れするときの固定キー（独自型の定数）

func RequestID(next http.Handler) http.Handler { // next を包むミドルウェア（型は func(http.Handler) http.Handler）
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { // 返すハンドラ本体
		id := r.Header.Get("X-Request-ID") // 受信ヘッダに既存のリクエストIDがあれば使う
		if id == "" { // ヘッダに無い（空文字）なら
			// 簡易採番。実務では UUID などを使う。
			id = strconv.FormatInt(time.Now().UnixNano(), 36) // 現在時刻のナノ秒を36進数の文字列にして採番
		} // if の終わり
		ctx := context.WithValue(r.Context(), requestIDKey, id) // 既存 context に「キー＝id」を載せた新しい context を作る
		w.Header().Set("X-Request-ID", id) // レスポンスヘッダにも同じIDを付ける
		next.ServeHTTP(w, r.WithContext(ctx)) // 差し替えた context を下流へ（r.WithContext で ctx 付きの request に）
	}) // http.HandlerFunc の終わり
}

// ハンドラ側から取り出すためのヘルパ。
func RequestIDFrom(ctx context.Context) string { // context からリクエストIDを取り出す関数
	id, _ := ctx.Value(requestIDKey).(string) // ctx.Value で取得し .(string) で型アサーション（第2戻り値の成否は無視）
	return id // 取り出したID（無ければ空文字）を返す
}`}</Code>

      <Section>リカバリミドルウェア — panic を 500 に変換して落とさない</Section>
      <p>
        どこかのハンドラで <Cmd>panic</Cmd> が起きると、そのままではゴルーチンが飛んでサーバーが不安定になります。
        <Cmd>defer</Cmd> と <Cmd>recover()</Cmd> で panic を捕まえ、ログに残したうえで統一エラー形式の 500 を返します。
        <strong>リカバリはできるだけ外側</strong>に置き、内側のどの層で panic が起きても捕捉できるようにします。
      </p>
      <Code lang="go" filename="internal/middleware/recovery.go">{`package middleware // middleware パッケージ

import ( // 使うパッケージ
	"log/slog" // 構造化ログ
	"net/http" // HTTP サーバ関連
)

func Recovery(logger *slog.Logger) Middleware { // logger を受け取りミドルウェアを返す
	return func(next http.Handler) http.Handler { // next を包むミドルウェア本体
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { // 返すハンドラ本体
			defer func() { // defer は「この関数を抜けるとき（panic 時も含む）に実行」を予約する。中で recover して panic を捕まえる
				if err := recover(); err != nil { // recover() は panic を捕捉して値を返す（panic 中でなければ nil）。nil でなければ panic が起きていた
					logger.Error("panic recovered", slog.Any("error", err)) // panic の内容をエラーログに残す（slog.Any は任意型を1フィールドに）
					w.Header().Set("Content-Type", "application/json")       // レスポンスを JSON と宣言
					w.WriteHeader(http.StatusInternalServerError)            // ステータス 500 を書き込む
					w.Write([]byte(\`{"error":"internal server error"}\`))     // 統一エラー形式の本文を返す（文字列をバイト列にして書き込み）
				} // if の終わり
			}() // 直後の () で defer 対象の無名関数を「呼び出す形」で登録
			next.ServeHTTP(w, r) // 内側の層（ハンドラ）を実行。ここで panic が起きても上の defer が拾う
		}) // http.HandlerFunc の終わり
	} // ミドルウェア本体の終わり
}`}</Code>
      <Callout variant="info" title="recover() は defer の中でだけ効く">
        <Cmd>recover()</Cmd> は <Cmd>defer</Cmd> された関数の中で呼んだときだけ panic を止められます。
        通常の行で呼んでも <Cmd>nil</Cmd> が返るだけで無意味です。上のように <Cmd>{"defer func(){ ... }()"}</Cmd> の内側に書くのが定石です。
      </Callout>

      <Section>CORS ミドルウェア — ブラウザからの呼び出しを許可する</Section>
      <p>
        ブラウザは<strong>同一オリジンポリシー</strong>により、別オリジン（別ドメイン・別ポート）の API を既定では JavaScript から読めません。
        サーバーが <Cmd>Access-Control-Allow-Origin</Cmd> などのヘッダを返して<strong>明示的に許可</strong>することで、はじめて越境アクセスが通ります。
        本番前に「実際に叩いてくるフロントのオリジン」を確認して指定します。
      </p>
      <Code lang="go" filename="internal/middleware/cors.go">{`package middleware // middleware パッケージ

import "net/http" // HTTP サーバ関連の標準パッケージ

// 許可するフロントのオリジンを1つに絞る（本番はここを実際のドメインに）。
const allowedOrigin = "https://app.example.com" // 越境アクセスを許すオリジンの定数

func CORS(next http.Handler) http.Handler { // next を包むミドルウェア
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { // 返すハンドラ本体
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)   // 許可オリジンをレスポンスヘッダに付与
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS") // 許可する HTTP メソッドを宣言
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type") // 許可するリクエストヘッダを宣言

		// プリフライト（事前確認）リクエストはここで完結させる。
		if r.Method == http.MethodOptions { // メソッドが OPTIONS＝プリフライトなら
			w.WriteHeader(http.StatusNoContent) // 204（本文なし）を返す
			return // 本体処理はせずここで終了
		} // if の終わり
		next.ServeHTTP(w, r) // 通常リクエストは内側の層へ渡す
	}) // http.HandlerFunc の終わり
}`}</Code>
      <Callout variant="info" title="プリフライトの OPTIONS とは">
        ブラウザは、単純でないリクエスト（カスタムヘッダ付きなど）を送る前に、
        まず <Cmd>OPTIONS</Cmd> メソッドで「この操作をしてよいか」をサーバーに問い合わせます。これが<strong>プリフライト</strong>です。
        サーバーは許可ヘッダを付けて <Cmd>204 No Content</Cmd> を返せばよく、本体処理は不要なのでここで <Cmd>return</Cmd> します。
      </Callout>

      <Section>main.go でチェーンを組んで適用する</Section>
      <p>
        用意した4つを <Cmd>Chain</Cmd> でまとめ、<Cmd>mux</Cmd> 全体に被せます。<strong>並び順が層の順序</strong>になります。
        リカバリとリクエストIDは外側（早い段階）に、ロギングはその内側に置くと、ログにステータスまで正しく載ります。
      </p>
      <Code lang="go" filename="main.go">{`package main // 実行可能プログラムは package main。main 関数が起点

import ( // 使うパッケージ群
	"log/slog" // 構造化ログ
	"net/http" // HTTP サーバ
	"os"       // 標準出力・プロセス終了などOS機能

	"github.com/yourname/character-api/internal/api"        // 自作のハンドラ層
	"github.com/yourname/character-api/internal/middleware" // 本記事で作ったミドルウェア群
	"github.com/yourname/character-api/internal/store"      // DB アクセス層
)

func main() { // プログラムの起点
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil)) // 標準出力へ JSON 形式で書く logger を生成

	db, err := store.Open("data/characters.db") // DB を開く（成否を err で受ける）
	if err != nil { // 開けなかったら
		logger.Error("db open failed", slog.Any("error", err)) // エラーログを残し
		os.Exit(1) // 異常終了コード1で終了
	} // if の終わり
	defer db.Close() // main を抜けるときに DB を確実に閉じる（defer で遅延実行）

	mux := http.NewServeMux() // ルーティング用のマルチプレクサ（振り分け表）を作る
	h := api.NewHandler(db)   // DB を渡してハンドラを生成
	mux.HandleFunc("GET /characters", h.List)     // GET /characters を List に割り当て
	mux.HandleFunc("GET /characters/{id}", h.Get) // GET /characters/{id} を Get に割り当て（{id} はパス変数）

	// 左が外側。RequestID → Recovery → Logging → CORS → mux の順に通る。
	handler := middleware.Chain(mux, // mux 全体に4つのミドルウェアを重ねて適用
		middleware.RequestID,        // 最外層：リクエストIDを発行
		middleware.Recovery(logger), // その内：panic を捕まえて500に
		middleware.Logging(logger),  // その内：リクエストを記録
		middleware.CORS,             // 最内層（mux の直前）：CORS ヘッダ付与
	) // Chain の終わり

	logger.Info("listening", slog.String("addr", ":8080")) // 起動ログを出力
	if err := http.ListenAndServe(":8080", handler); err != nil { // :8080 でサーバ起動。戻ってきたら（＝異常終了）err に入る
		logger.Error("server error", slog.Any("error", err)) // サーバのエラーをログに残す
	} // if の終わり
}`}</Code>
      <p>サーバーを起動して、別のターミナルからリクエストを送ってみます。</p>
      <Code lang="bash" filename="ターミナル">{`go run . # カレントディレクトリのプログラムをビルドして実行（サーバ起動）
# 別のターミナルで
curl -i http://localhost:8080/characters/1 # -i でレスポンスヘッダ込みで GET リクエストを送る`}</Code>
      <p>サーバー側の標準出力に、構造化された JSON ログが1行出れば成功です。</p>
      <Code lang="text" filename="サーバーのログ出力">{`{"time":"2026-07-07T10:12:03.51+09:00","level":"INFO","msg":"listening","addr":":8080"}
{"time":"2026-07-07T10:12:09.02+09:00","level":"INFO","msg":"request","method":"GET","path":"/characters/1","status":200,"elapsed":812000}`}</Code>
      <Figure
        src="/learn/shots/api-practice/middleware-logging-01.svg"
        alt="サーバー側の標準出力に構造化された JSON ログが1行ずつ出力されている画面"
        caption="リクエストのたびに method・path・status・elapsed を含む1行が積み上がっていく"
      />
      <p>
        <Cmd>curl -i</Cmd> のレスポンスヘッダには <Cmd>X-Request-ID</Cmd> と <Cmd>Access-Control-Allow-Origin</Cmd> が並びます。
        ミドルウェアが確かに前後で仕事をしている証拠です。
      </p>
      <Figure
        src="/learn/shots/api-practice/middleware-logging-02.svg"
        alt="curl -i のレスポンスヘッダに X-Request-ID などが並んでいる画面"
        caption="ハンドラ本体では書いていないヘッダが付いていれば、ミドルウェアが効いている"
      />

      <Section>つまずきポイント</Section>
      <Callout variant="warn" title="適用順・ラップ漏れ・CORS 全許可に注意">
        <ul>
          <li><strong>適用順を間違える</strong>：ロギングをリカバリより外側に置くと、panic 時のステータスが正しく記録されないことがあります。「一番外に Recovery、その内に Logging」を基本に。</li>
          <li><strong>ResponseWriter のラップ漏れ</strong>：<Cmd>statusRecorder</Cmd> を作っても、<Cmd>next.ServeHTTP(w, r)</Cmd> と元の <Cmd>w</Cmd> を渡してしまうとステータスが取れません。必ず <Cmd>rec</Cmd> を渡します。</li>
          <li><strong>CORS を <Cmd>{"*"}</Cmd> のまま本番へ</strong>：<Cmd>Access-Control-Allow-Origin: *</Cmd> は「どのサイトからでも叩ける」状態です。開発では楽でも、そのまま公開すると意図しないサイトから API を利用されます。本番は<strong>許可するオリジンを具体的に列挙</strong>します。</li>
          <li><strong>panic を握りつぶす</strong>：リカバリでログを残さず 500 だけ返すと、原因が分からなくなります。必ず <Cmd>logger.Error</Cmd> で記録を残します。</li>
        </ul>
      </Callout>

      <Bridge course="ソフトウェア工学（横断的関心事・デコレータパターン）／ ネットワーク（同一オリジンポリシー・CORS）／ 可観測性（構造化ログ）">
        ミドルウェアは、講義でいう<strong>横断的関心事（cross-cutting concern）</strong>——ログ・認証・エラー処理のように、
        あらゆる機能に散らばりがちな共通処理を1か所に括り出す考え方の実装です。「本体を包んで振る舞いを足す」形は<strong>デコレータパターン</strong>そのもの。
        CORS はネットワークの授業で学ぶ<strong>同一オリジンポリシー</strong>の緩和機構で、サーバーの許可ヘッダによって越境アクセスを制御します。
        そして構造化ログは、運用でシステムの内部状態を外から知る<strong>可観測性（observability）</strong>の入口です。理論の言葉が、そのまま数十行のコードに落ちています。
      </Bridge>

      <Quiz
        question="ロギングミドルウェアで、レスポンスのステータスコードを記録できるようにするために必要なのは？"
        options={[
          <>ハンドラ内で毎回グローバル変数にステータスを保存する</>,
          <><Cmd>http.ResponseWriter</Cmd> を包み、<Cmd>WriteHeader</Cmd> を横取りしてコードを控える小さな struct を作り、それを <Cmd>next</Cmd> に渡す</>,
          <><Cmd>r.Response.StatusCode</Cmd> を読む</>,
          <><Cmd>time.Now()</Cmd> の差分からステータスを推定する</>,
        ]}
        answer={1}
        explanation={<><Cmd>http.ResponseWriter</Cmd> は書き込んだステータスを後から読めないため、<Cmd>WriteHeader</Cmd> を横取りする <Cmd>statusRecorder</Cmd> で包み、それを内側のハンドラへ渡します。元の <Cmd>w</Cmd> を渡すとラップ漏れでステータスが取れません。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "ミドルウェアの型は func(next http.Handler) http.Handler。next を包んで新しいハンドラを返し、前後に処理を挟む",
          "合成（チェーン）は入れ子。Chain(h, A, B, C) = A(B(C(h)))。並び順が層の順序になる",
          "ロギングは log/slog で構造化。ステータスは ResponseWriter を包む statusRecorder で捕捉し、必ず rec を next に渡す",
          "リクエストIDは context.WithValue で載せる（キーは独自型）。リカバリは defer + recover() で panic を 500 に変換",
          "CORS は Access-Control-Allow-* ヘッダと OPTIONS プリフライトで制御。本番で * の全許可のまま出さない",
        ]}
      />
    </>
  );
}

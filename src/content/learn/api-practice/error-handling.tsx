import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "error-handling",
  title: "エラーハンドリングとステータスコード",
  description: "統一エラーレスポンス { \"error\": \"...\" } と writeJSON/writeError ヘルパを整える。不正な id は 400、該当なしは 404、メソッド違いは 405、想定外は 500。番兵エラーと errors.Is で分類し、内部詳細は漏らさずログにだけ残す。",
  domain: "api-practice",
  section: "endpoints",
  order: 3,
  level: "practice",
  tags: ["エラー処理", "HTTPステータス", "設計"],
  updated: "2026-07-07",
  minutes: 14,
};

export default function Article() {
  return (
    <>
      <Lead>
        API は成功だけでなく<strong>失敗の返し方</strong>で品質が決まります。ここまでは <Cmd>http.Error</Cmd> でプレーンテキストを返していましたが、
        本章では<strong>統一されたエラー形式</strong>——<Cmd>{'{ "error": "..." }'}</Cmd>——に揃え、失敗の種類ごとに正しいステータスコードを返し分けます。
        不正な id は <Cmd>400</Cmd>、該当なしは <Cmd>404</Cmd>、許されないメソッドは <Cmd>405</Cmd>、想定外は <Cmd>500</Cmd>。Go の <Cmd>error</Cmd> を返す作法と、
        番兵エラー・<Cmd>errors.Is</Cmd> による分類で、迷わないエラー設計を組み立てます。
      </Lead>

      <Section>統一エラーレスポンスを決める</Section>
      <p>
        エラーの度に違う形（あるときはテキスト、あるときは JSON）だと、クライアントは対処を書けません。<strong>常に同じ JSON 形式</strong>で返すと決めます。
      </p>
      <Code lang="json" filename="エラーレスポンスの型（常にこの形）">{`{ "error": "character not found" }`}</Code>
      <p>
        これを吐く小さなヘルパ <Cmd>writeJSON</Cmd> / <Cmd>writeError</Cmd> を用意し、ハンドラからは常にこの 2 つだけを呼びます。
      </p>
      <Code lang="go" filename="internal/api/respond.go">{`package api // このファイルは api パッケージに属する

import ( // 使う標準ライブラリをまとめて取り込む
	"encoding/json" // JSON の符号化
	"log"           // ログ出力
	"net/http"      // HTTP サーバ機能
) // import ブロックの終わり

// writeJSON は成功レスポンスを JSON で書き出す。
// v any は任意の型を受け取れる引数（構造体でもスライスでも渡せる）
func writeJSON(w http.ResponseWriter, status int, v any) {
	// Content-Type ヘッダを JSON に設定（ヘッダは本文より前に書く必要がある）
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status) // ステータスコードを書き出す（1リクエストで1回だけ）
	// json.NewEncoder(w) は w へ直接書き出すエンコーダを作り、.Encode(v) で v を JSON 化して送る
	if err := json.NewEncoder(w).Encode(v); err != nil { // if の中で err を宣言しつつ判定
		// ここまで来てのエンコード失敗はもう status を変えられない。ログにだけ残す。
		log.Printf("writeJSON encode: %v", err) // %v はエラーを既定書式で埋め込む
	}
} // writeJSON の終わり

// writeError は { "error": msg } の統一形でエラーを書き出す。
// msg はクライアントに見せてよい安全な文言だけを渡すこと。
func writeError(w http.ResponseWriter, status int, msg string) {
	// map[string]string{...} で {"error": msg} を作り、writeJSON に委譲して書き出す
	writeJSON(w, status, map[string]string{"error": msg})
}`}</Code>

      <Section>番兵エラーで失敗の種類を表す</Section>
      <p>
        store 層は「何が起きたか」を<strong>番兵エラー（sentinel error）</strong>で表明します。<Cmd>var ErrNotFound = errors.New(...)</Cmd> のように
        パッケージ変数として定義し、呼び出し側は <Cmd>errors.Is</Cmd> で「これはあの種類のエラーか？」を判定します。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`import ( // 使う標準ライブラリを取り込む
	"database/sql" // sql.ErrNoRows などを使う
	"errors"       // errors.New / errors.Is を使う
	"fmt"          // fmt.Errorf でエラーをラップ
) // import ブロックの終わり

// 失敗の種類を表す番兵エラー。api 層はこれを見てステータスを決める。
// パッケージ変数として1つだけ生成し、比較の目印にする（番兵＝sentinel）
var ErrNotFound = errors.New("character not found")

// Get は id のキャラを1件取得する。多値返却で (Character, error) を返す
func (s *Store) Get(ctx context.Context, id int) (Character, error) {
	// QueryRowContext は1行だけ取得するクエリ。? に id を安全に束縛する
	row := s.db.QueryRowContext(ctx, selectColumns+" WHERE id = ?", id)
	c, err := scanCharacter(row) // 取得した行を Character 構造体へ読み取る
	if errors.Is(err, sql.ErrNoRows) { // errors.Is で「行が無かった」エラーか判定
		return Character{}, ErrNotFound // 空の Character と番兵エラーを返して「無い」を表明
	}
	if err != nil { // それ以外の想定外エラー
		// 想定外の DB エラーは、文脈を付けて上位へラップして返す。
		// %d に id を、%w に元エラー err を包む。%w は errors.Is で中身を辿れる包み方
		return Character{}, fmt.Errorf("store.Get(id=%d): %w", id, err)
	}
	return c, nil // 成功。読み取れた c とエラー無し(nil)を返す
}`}</Code>
      <Callout variant="info" title="%w でラップする意味">
        <Cmd>fmt.Errorf("...: %w", err)</Cmd> は元のエラーを<strong>包んで（wrap）</strong>返します。<Cmd>%w</Cmd> で包むと、外側にメッセージ（文脈）を足しつつ、
        <Cmd>errors.Is</Cmd> / <Cmd>errors.As</Cmd> で<strong>中身の元エラーを判定できる</strong>ようになります。<Cmd>%v</Cmd> だと文字列になるだけで判定できません。
        「どこで起きたか」を積み重ねられるのがラップの利点です。
      </Callout>

      <Section>ハンドラで種類ごとに返し分ける</Section>
      <p>
        api 層は、store から返ったエラーを <Cmd>errors.Is</Cmd> で分類し、対応するステータスに変換します。ここが「Go の error → HTTP ステータス」の翻訳所です。
      </p>
      <Code lang="go" filename="internal/api/handler.go">{`// getCharacter は GET /characters/{id} を処理するハンドラ
func (h *Handler) getCharacter(w http.ResponseWriter, r *http.Request) {
	// 1) 入力が不正 → 400（呼び出し側の誤り）
	// r.PathValue("id") でパス中の {id} 部分を取り出し、strconv.Atoi で int へ変換
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil { // 数字でなければ変換エラー
		writeError(w, http.StatusBadRequest, "id must be an integer") // 400 と文言を返す
		return // 打ち切り（以降を実行しない）
	}

	c, err := h.store.Get(r.Context(), id) // store から取得。(Character, error) を受ける
	// 2) 該当なし → 404
	if errors.Is(err, store.ErrNotFound) { // 番兵エラー ErrNotFound かを Is で判定
		writeError(w, http.StatusNotFound, "character not found") // 404 を返す
		return
	}
	// 3) 想定外（DB エラー等）→ 500。詳細はログにだけ、クライアントには伏せる。
	if err != nil { // 上記2つに該当しないその他のエラー
		log.Printf("getCharacter(id=%d): %v", id, err) // 内部向け: 詳細を記録
		writeError(w, http.StatusInternalServerError, "internal server error") // 外部向け: 抽象化
		return
	}
	// 4) 成功 → 200
	writeJSON(w, http.StatusOK, c) // 200 と取得した c を JSON で返す
}`}</Code>

      <Section>ケース別のステータス早見</Section>
      <ComparisonTable
        headers={["ケース", "原因", "ステータス", "クライアントへの文言"]}
        rows={[
          ["id が数値でない", "strconv.Atoi 失敗", <Cmd>400</Cmd>, "id must be an integer"],
          ["該当キャラなし", "store.ErrNotFound", <Cmd>404</Cmd>, "character not found"],
          ["許されないメソッド", "POST /characters/1 等", <Cmd>405</Cmd>, "method not allowed"],
          ["DB エラー・想定外", "接続断・SQL 異常等", <Cmd>500</Cmd>, "internal server error（詳細は伏せる）"],
        ]}
      />
      <Callout variant="tip" title="405 はルータがほぼ自動で返す">
        Go 1.22 の <Cmd>net/http</Cmd> は、<Cmd>"GET /characters/{"{id}"}"</Cmd> だけ登録して <Cmd>POST</Cmd> で叩かれると、
        自動で <Cmd>405 Method Not Allowed</Cmd> と <Cmd>Allow</Cmd> ヘッダを返してくれます。メソッド指定でルートを定義しておくだけで、405 の面倒を見てくれるわけです。
      </Callout>

      <Section>内部エラーの詳細はクライアントに漏らさない</Section>
      <p>
        <Cmd>500</Cmd> のとき、元のエラー（<Cmd>sql: connection refused ...</Cmd> やスタックトレース）を<strong>そのままレスポンスに載せてはいけません</strong>。
        DB のスキーマ・内部構造・ファイルパスなどが攻撃者へのヒントになります。原則は<strong>「詳細はログへ、クライアントには抽象的な文言」</strong>。
      </p>
      <Code lang="go" filename="漏洩する悪い例 / 安全な例">{`// ⚠️ 悪い例: 内部情報がそのまま外へ漏れる
// err.Error() はエラーの生メッセージ文字列。それを外向けボディに載せてしまっている
writeError(w, 500, err.Error()) // "sql: no such table: characters ..." が見える

// 良い例: 詳細はログ、外向けは一般化した文言
log.Printf("listCharacters: %v", err) // 詳細はサーバのログにだけ記録
// クライアントには固定の一般化文言だけを返す（内部構造を漏らさない）
writeError(w, http.StatusInternalServerError, "internal server error")`}</Code>

      <Section>パニックで落とさない</Section>
      <p>
        1 リクエストの想定外パニックでプロセス全体を巻き込まないよう、<Cmd>recover</Cmd> するミドルウェアを噛ませます。パニックは 500 に変換し、サーバは動き続けます。
      </p>
      <Code lang="go" filename="internal/api/middleware.go">{`// Recover はハンドラを包むミドルウェア。next(次のハンドラ)を受け取り、包んだハンドラを返す
func Recover(next http.Handler) http.Handler {
	// http.HandlerFunc は関数を http.Handler に変換するアダプタ
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() { // defer で登録した無名関数は、この関数を抜ける直前に必ず走る
			if rec := recover(); rec != nil { // recover() でパニックを捕捉。捕まえた値が非 nil なら
				log.Printf("panic: %v", rec) // 内部にだけ詳細を残す
				// パニックを 500 に変換して返す。プロセスは落とさず動き続ける
				writeError(w, http.StatusInternalServerError, "internal server error")
			}
		}() // 無名関数を即時に defer 登録（末尾の () が呼び出し）
		next.ServeHTTP(w, r) // 本来の処理を実行。ここで panic しても上の defer が受け止める
	})
}`}</Code>
      <Callout variant="info" title="エラーは返す、パニックは避ける">
        Go では「想定される失敗」は <Cmd>panic</Cmd> ではなく <Cmd>error</Cmd> を<strong>戻り値で返す</strong>のが作法です。<Cmd>if err != nil</Cmd> で
        呼び出しごとに扱い、多値返却（<Cmd>(値, error)</Cmd>）で「結果か失敗か」を明示します。<Cmd>panic</Cmd> はプログラミングミスなど本当に異常なときだけ。
        だから上の <Cmd>recover</Cmd> は「最後の安全網」であって、通常フローで頼るものではありません。
      </Callout>

      <Section>curl でエラーを確かめる</Section>
      <p>id が数値でない → 400。</p>
      <Code lang="bash" filename="terminal">{`# id に数字でない abc を渡す。-si はヘッダ表示(-i)＋静音(-s) → 400 が返るはず
curl -si http://localhost:8080/characters/abc`}</Code>
      <Code lang="text" filename="レスポンス">{`HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"id must be an integer"}`}</Code>
      <Figure
        src="/learn/shots/api-practice/error-handling-01.svg"
        alt="curl -si で数値でない id を叩き、400 と統一エラー JSON が返った画面"
        caption="ステータス行が 400、ボディが統一形の JSON になっているかを両方確認する"
      />
      <p>存在しない id → 404。</p>
      <Code lang="bash" filename="terminal">{`# 存在しない id=9999 を取得 → 404 が返るはず
curl -si http://localhost:8080/characters/9999`}</Code>
      <Code lang="text" filename="レスポンス">{`HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"error":"character not found"}`}</Code>
      <p>読み取り専用 API に POST → 405（ルータが自動対応）。</p>
      <Code lang="bash" filename="terminal">{`# -X POST でメソッドを POST に指定。読み取り専用ルートなので 405 が返るはず
curl -si -X POST http://localhost:8080/characters/1`}</Code>
      <Code lang="text" filename="レスポンス">{`HTTP/1.1 405 Method Not Allowed
Allow: GET`}</Code>
      <Figure
        src="/learn/shots/api-practice/error-handling-02.svg"
        alt="curl -si -X POST で 405 と Allow ヘッダが返ってきた画面"
        caption="自分では書いていない 405 と Allow ヘッダが返る。ルータが自動で面倒を見ている証拠"
      />

      <Section>つまずきポイント</Section>
      <Callout variant="warn" title="WriteHeader を 2 回呼ぶ">
        <Cmd>w.WriteHeader(200)</Cmd> の後にエラーに気づいて <Cmd>writeError(w, 500, ...)</Cmd> を呼ぶと、「superfluous WriteHeader call」の警告が出て
        <strong>最初のステータスしか効きません</strong>。1 リクエストで書き込むのは 1 回。分岐で <Cmd>return</Cmd> を必ず入れ、二重書き込みを避けます。
      </Callout>
      <Callout variant="warn" title="err.Error() をそのまま返す">
        便利だからと <Cmd>writeError(w, 500, err.Error())</Cmd> とすると、DB のテーブル名・接続文字列・内部パスなどが露出します。500 の外向け文言は
        <strong>常に固定の一般化メッセージ</strong>にし、詳細はログへ。デバッグはログで行います。
      </Callout>
      <Callout variant="warn" title="errors.Is を == で代用してしまう">
        <Cmd>%w</Cmd> でラップされたエラーは <Cmd>err == store.ErrNotFound</Cmd> の等値比較では<strong>一致しません</strong>（外側に包まれているため）。
        必ず <Cmd>errors.Is(err, store.ErrNotFound)</Cmd> を使います。ラップを想定するなら <Cmd>Is</Cmd>、これが Go の分類の作法です。
      </Callout>

      <Bridge course="ネットワーク（HTTP ステータス 4xx/5xx）／ ソフトウェア工学（例外処理・契約による設計）">
        ステータスコードの返し分けは、ネットワークの講義で習う HTTP の<strong>「4xx＝呼び出し側の誤り／5xx＝サーバ側の失敗」</strong>という責任分界そのものです。
        不正な id（400）や該当なし（404）は<strong>クライアントの契約違反</strong>、DB 障害（500）は<strong>サーバが事後条件を守れなかった</strong>——これはソフトウェア工学の
        <strong>契約による設計（事前条件・事後条件）</strong>と 1 対 1 で対応します。さらに、Go が例外機構ではなく <Cmd>error</Cmd> の<strong>戻り値</strong>と <Cmd>errors.Is</Cmd> による分類を選ぶのは、
        「誰の責任でどう失敗したか」を型と値で明示的に扱う設計思想の表れ。座学の「例外処理」を、HTTP では 3 桁の数字へ、Go では多値の <Cmd>error</Cmd> へ翻訳しているのがこの章です。
      </Bridge>

      <SubSection>理解度チェック</SubSection>
      <Quiz
        question={`store が fmt.Errorf("...: %w", sql.ErrConnDone) でラップして返したエラーを、ハンドラで正しく分類するには？`}
        options={[
          <><Cmd>err == store.ErrNotFound</Cmd> と等値比較する</>,
          <><Cmd>errors.Is(err, ...)</Cmd> で判定し、未分類は 500 にフォールバック</>,
          <><Cmd>err.Error()</Cmd> を文字列マッチする</>,
          <><Cmd>panic(err)</Cmd> で落とす</>,
        ]}
        answer={1}
        explanation={<><Cmd>%w</Cmd> で包まれたエラーは等値比較（<Cmd>==</Cmd>）では一致しません。<Cmd>errors.Is</Cmd> は包みの中まで辿って判定できます。どの番兵にも一致しないものは想定外として 500 にフォールバックします。</>}
      />
      <Quiz
        question="DB 接続エラーで 500 を返すとき、レスポンスボディに載せるべき文言は？"
        options={[
          <>元の <Cmd>err.Error()</Cmd>（例: sql: connection refused ...）をそのまま</>,
          <>スタックトレース全体</>,
          <>固定の一般化メッセージ（例: internal server error）。詳細はログにだけ残す</>,
          <>SQL 文と接続文字列</>,
        ]}
        answer={2}
        explanation={<>内部エラーの詳細は攻撃者へのヒントになり得ます。クライアントには抽象的な固定文言を返し、原因調査に必要な詳細はサーバのログにだけ記録します。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "エラーは常に統一形 { \"error\": \"...\" } で返す。writeJSON/writeError に集約する",
          "失敗の種類は番兵エラー（var ErrNotFound = errors.New(...)）で表し、errors.Is で分類する",
          "不正な id=400、該当なし=404、メソッド違い=405（Go 1.22 が自動）、想定外=500",
          "想定外エラーは fmt.Errorf(\"...: %w\", err) で文脈をラップして上位へ渡す",
          "500 の詳細はログにだけ残し、クライアントには一般化した文言だけを返す（情報漏洩を防ぐ）",
          "Go は失敗を error の戻り値で返すのが作法。panic は避け、recover ミドルウェアは最後の安全網",
        ]}
      />
    </>
  );
}

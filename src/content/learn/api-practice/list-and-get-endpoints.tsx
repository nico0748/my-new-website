import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "list-and-get-endpoints",
  title: "一覧取得と単一取得のエンドポイント",
  description: "store 層に List / Get を実装し、api 層で GET /characters と GET /characters/{id} を配線する。SELECT の結果を JSON 配列・単一オブジェクトで返し、見つからないときは 404 を返すまで。",
  domain: "api-practice",
  section: "endpoints",
  order: 1,
  level: "practice",
  tags: ["REST", "SELECT", "JSON"],
  updated: "2026-07-07",
  minutes: 14,
};

export default function Article() {
  return (
    <>
      <Lead>
        いよいよ「読み取り API」の本体を作ります。ここまでで用意した DB 接続を土台に、<strong>store 層</strong>（SQL を発行してデータを取り出す）と
        <strong>api 層</strong>（HTTP を受けて JSON で返す）の 2 つを実装します。作るのは 2 本——全件を返す <Cmd>GET /characters</Cmd> と、
        1 件だけ返す <Cmd>GET /characters/{"{id}"}</Cmd>。curl で叩いて Aru のデータが返ってくるところまで一気に配線します。
      </Lead>

      <Section>この章のゴール</Section>
      <p>
        キャラクターデータを保存した SQLite（<Cmd>data/characters.db</Cmd>）から、HTTP 経由でデータを取り出せるようにします。完成すると次の 2 つが動きます。
      </p>
      <ComparisonTable
        headers={["エンドポイント", "やること", "SQL", "返すもの"]}
        rows={[
          [<Cmd>GET /characters</Cmd>, "全キャラクターの一覧", "SELECT ... ORDER BY id", "JSON 配列"],
          [<Cmd>GET /characters/{"{id}"}</Cmd>, "id 指定で 1 件", "SELECT ... WHERE id = ?", "JSON オブジェクト or 404"],
        ]}
      />
      <p>
        層を 2 つに分けるのがこのコースの設計方針です。<strong>store</strong> は「DB からどう取るか」だけに責任を持ち、<strong>api</strong> は「HTTP でどう受けてどう返すか」だけに責任を持ちます。
      </p>

      <Section>Character 構造体を確認する</Section>
      <p>
        まず、DB の 1 行を Go の値として表す <Cmd>Character</Cmd> 構造体をおさらいします。列名はスネークケース（<Cmd>star_grade</Cmd>）ですが、
        JSON はキャメルケース（<Cmd>starGrade</Cmd>）で返したいので、構造体タグで対応づけます。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`package store // このファイルが属するパッケージ名（DB アクセス層）

import ( // 使う標準ライブラリをまとめて読み込む
	"context"      // タイムアウト/キャンセルを伝える context.Context 用
	"database/sql" // Go 標準の DB アクセス共通 API（*sql.DB など）
	"errors"       // 番兵エラーを作る errors.New / 比較する errors.Is 用
)

// ErrNotFound は「該当する行が無い」ことを表す番兵エラー。
// api 層はこれを見て 404 に変換する（詳しい分類は「エラーハンドリング」の章で扱う）。
var ErrNotFound = errors.New("character not found") // パッケージ変数として1つだけ作り、比較の目印にする

// Character は DB の1行を Go の値として表す構造体（1レコード＝1個の Character）。
type Character struct {
	// 各フィールドの後ろの逆引用符で囲った部分は「構造体タグ」。JSON 化するときのキー名を指定する。
	ID          int    \`json:"id"\`          // 主キー。JSON では id
	Name        string \`json:"name"\`        // 名前。JSON では name
	School      string \`json:"school"\`      // 学校。JSON では school
	Club        string \`json:"club"\`        // 部活。JSON では club
	StarGrade   int    \`json:"starGrade"\`   // 星の数。列名 star_grade → JSON は starGrade
	SquadType   string \`json:"squadType"\`   // 部隊種別。JSON では squadType
	TacticRole  string \`json:"tacticRole"\`  // 戦術ロール。JSON では tacticRole
	Position    string \`json:"position"\`    // 立ち位置。JSON では position
	BulletType  string \`json:"bulletType"\`  // 弾種。JSON では bulletType
	ArmorType   string \`json:"armorType"\`   // 装甲種別。JSON では armorType
	WeaponType  string \`json:"weaponType"\`  // 武器種別。JSON では weaponType
	Age         string \`json:"age"\`         // 年齢(文字列 例:"16 years old")。JSON では age
	Birthday    string \`json:"birthday"\`    // 誕生日。JSON では birthday
	AttackPower int    \`json:"attackPower"\` // 攻撃力。JSON では attackPower
	MaxHP       int    \`json:"maxHp"\`       // 最大HP。JSON では maxHp
	Profile     string \`json:"profile"\`     // 紹介文。JSON では profile
} // Character 構造体の終わり

// Store は *sql.DB を包む薄いラッパ。ハンドラは Store 経由でだけ DB に触れる。
type Store struct {
	db *sql.DB // 実際の DB 接続プール。ポインタ(*)で保持し、コピーせず共有する
} // Store 構造体の終わり

// New は受け取った *sql.DB を包んだ Store を作って返すコンストラクタ関数。
func New(db *sql.DB) *Store {
	return &Store{db: db} // & でアドレスを取り、*Store（ポインタ）として返す
}`}</Code>
      <Callout variant="info" title="構造体タグの読み方">
        <Cmd>{'`json:"starGrade"`'}</Cmd> は「この列を JSON にするときは <Cmd>starGrade</Cmd> という名前で出せ」という指示です。バッククォートで囲むのが Go の書き方で、
        <Cmd>encoding/json</Cmd> がエンコード/デコード時に読み取ります。列名（DB）とキー名（JSON）を橋渡しする 1 行です。
      </Callout>

      <Section>store 層に List を実装する</Section>
      <p>
        全件取得は <Cmd>db.QueryContext</Cmd> で複数行（<Cmd>*sql.Rows</Cmd>）を受け取り、<Cmd>rows.Next()</Cmd> でループしながら 1 行ずつ
        <Cmd>rows.Scan</Cmd> で構造体に詰めます。<strong>Scan に渡すポインタの順番は、SELECT した列の順番と完全に一致</strong>させる必要があります。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`// 全列を id 順で並べた共通の SELECT 句。List と Get で使い回す。
// 逆引用符で囲むと改行を含む「生文字列（raw string）」になり、SQL を複数行で書ける。
const selectColumns = \`SELECT id, name, school, club, star_grade, squad_type,
	tactic_role, position, bullet_type, armor_type, weapon_type,
	age, birthday, attack_power, max_hp, profile
FROM characters\` // 取り出す列を明示的に並べる（列順を固定するため SELECT * は使わない）

// scanCharacter は 1 行を Character に詰める。列順は selectColumns と揃える。
// 引数は「Scan メソッドを持つ何か」を表すインターフェース（*sql.Rows でも *sql.Row でも受けられる）。
func scanCharacter(s interface{ Scan(...any) error }) (Character, error) {
	var c Character // 詰め先となる空の Character をゼロ値で用意
	err := s.Scan( // 現在行の各列を、渡したポインタの指す先へ書き込む
		// & はアドレス演算子。フィールドの「置き場所」を渡し、Scan がそこへ値を代入する。
		&c.ID, &c.Name, &c.School, &c.Club, &c.StarGrade, &c.SquadType,
		&c.TacticRole, &c.Position, &c.BulletType, &c.ArmorType, &c.WeaponType,
		&c.Age, &c.Birthday, &c.AttackPower, &c.MaxHP, &c.Profile,
	) // Scan の引数の並びは SELECT の列の並びと 1 対 1 で対応させる
	return c, err // 詰めた Character と、失敗時のエラーを返す
}

// List は全キャラクターを id の昇順で返す。
// レシーバ (s *Store) により、この関数は Store 型のメソッドになる（s.db でフィールドに触れる）。
func (s *Store) List(ctx context.Context) ([]Character, error) {
	// QueryContext は複数行を返すクエリを実行し、*sql.Rows（行カーソル）を得る。ctx でキャンセル可能。
	rows, err := s.db.QueryContext(ctx, selectColumns+" ORDER BY id")
	if err != nil { // クエリ自体の失敗（構文エラー・接続断など）
		return nil, err // 一覧は無し、エラーを呼び出し元へ返す
	}
	defer rows.Close() // 関数を抜けるとき必ず接続を返す（defer で終了時に自動実行）

	// nil ではなく空スライスで初期化するのがポイント（後述）。
	list := []Character{} // 要素0個のスライス。ここに1件ずつ append していく
	for rows.Next() { // 次の行があれば true。行カーソルを1つ進めながらループ
		c, err := scanCharacter(rows) // 現在行を Character に詰める
		if err != nil { // Scan の失敗（型不一致など）
			return nil, err
		}
		list = append(list, c) // 詰めた1件をスライス末尾に追加（必要なら内部で再確保）
	} // for ループの終わり
	// ループ中に I/O エラーが起きていないか最後に必ず確認する。
	if err := rows.Err(); err != nil { // Next() は途中エラーでも false を返すため、ここで確定確認
		return nil, err
	}
	return list, nil // 全件を詰めたスライスと nil（エラー無し）を返す
}`}</Code>
      <Callout variant="tip" title="rows.Close と rows.Err はセットで覚える">
        <Cmd>defer rows.Close()</Cmd> を忘れると DB 接続がプールに返らず、やがて接続が枯渇します。また <Cmd>rows.Next()</Cmd> のループは
        エラーで途中終了しても <Cmd>false</Cmd> を返すため、ループ後に <Cmd>rows.Err()</Cmd> を確認しないと「途中で壊れたのに成功扱い」になります。
        この 2 つは <Cmd>database/sql</Cmd> の定型です。
      </Callout>

      <Section>store 層に Get を実装する</Section>
      <p>
        1 件取得は <Cmd>db.QueryRowContext</Cmd> を使います。こちらは行が 1 つ（か 0 個）の前提で、<Cmd>QueryRow(...).Scan(...)</Cmd> と続けて書けます。
        行が無いときは <Cmd>Scan</Cmd> が <Cmd>sql.ErrNoRows</Cmd> を返すので、それを自分たちの <Cmd>ErrNotFound</Cmd> に変換して返します。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`// Get は id 指定で 1 件返す。該当が無ければ ErrNotFound を返す。
// これも (s *Store) レシーバを持つ Store のメソッド。ctx でキャンセル、id で対象を指定。
func (s *Store) Get(ctx context.Context, id int) (Character, error) {
	// QueryRowContext は「高々1行」の前提。? はプレースホルダで、第3引数 id が安全に埋め込まれる。
	row := s.db.QueryRowContext(ctx, selectColumns+" WHERE id = ?", id)
	c, err := scanCharacter(row) // その1行を Character に詰める。行が無ければ err に ErrNoRows が入る
	if errors.Is(err, sql.ErrNoRows) { // errors.Is で「行が無い」を判定（ラップされていても見抜ける）
		// DB 都合の ErrNoRows を、アプリの語彙 ErrNotFound に翻訳する。
		return Character{}, ErrNotFound // 空の Character と、自分たちの番兵エラーを返す
	}
	if err != nil { // それ以外の失敗（接続断・型不一致など）
		return Character{}, err
	}
	return c, nil // 見つかった Character と nil（成功）を返す
}`}</Code>
      <Callout variant="info" title="なぜ ErrNoRows をそのまま返さないのか">
        <Cmd>sql.ErrNoRows</Cmd> は「DB ドライバの都合」です。これを api 層まで漏らすと、上位の層が <Cmd>database/sql</Cmd> に依存してしまいます。
        <Cmd>ErrNotFound</Cmd> という自分たちの語彙に変換しておけば、将来 DB を差し替えても api 層のコードは無傷です。エラーの分類は「エラーハンドリング」の章で本格的に扱います。
      </Callout>

      <Section>api 層でハンドラを書く</Section>
      <p>
        HTTP を受けるのが api 層です。Go 1.22 の標準 <Cmd>net/http</Cmd> は、パターンにメソッドとパス変数を書けます（<Cmd>"GET /characters/{"{id}"}"</Cmd>）。
        パス変数は <Cmd>r.PathValue("id")</Cmd> で取り出します。ハンドラは store を呼び、結果を JSON にして書き出すだけに徹します。
      </p>
      <Code lang="go" filename="internal/api/handler.go">{`package api // HTTP を受けて返す層のパッケージ

import (
	"encoding/json" // JSON へのエンコード（json.NewEncoder）用
	"errors"        // errors.Is でエラーの種類を判定するため
	"net/http"      // HTTP サーバー・ルータ・ステータス定数を提供
	"strconv"       // 文字列→数値変換（strconv.Atoi）用

	"github.com/yourname/character-api/internal/store" // 下位の store 層を利用
)

// Handler は HTTP ハンドラ群をまとめ、store への依存を1つ持つ。
type Handler struct {
	store *store.Store // 呼び出す DB アクセス層（ポインタで共有）
} // Handler 構造体の終わり

// New は store を受け取って Handler を作るコンストラクタ。
func New(s *store.Store) *Handler {
	return &Handler{store: s} // 依存を差し込んだ *Handler を返す
}

// Routes はエンドポイントを ServeMux に登録して返す。
func (h *Handler) Routes() *http.ServeMux {
	mux := http.NewServeMux() // ルータ（パスとハンドラの対応表）を作る
	// "GET /characters" のようにメソッド＋パスをパターンに書ける（Go 1.22 以降）。
	mux.HandleFunc("GET /characters", h.listCharacters)     // 一覧取得を割り当て
	mux.HandleFunc("GET /characters/{id}", h.getCharacter)  // {id} はパス変数
	return mux // 設定済みのルータを返す
}

// GET /characters — 全件を JSON 配列で返す。
// w は返信の書き込み先、r は受け取ったリクエスト。
func (h *Handler) listCharacters(w http.ResponseWriter, r *http.Request) {
	list, err := h.store.List(r.Context()) // リクエストの context を渡して全件取得
	if err != nil { // DB 側で失敗したら
		http.Error(w, "internal server error", http.StatusInternalServerError) // 500 を返す
		return // 以降を実行しないよう即 return
	}
	writeJSON(w, http.StatusOK, list) // 成功なら 200 と JSON 配列を書き出す
}

// GET /characters/{id} — 1 件を JSON で返す。無ければ 404。
func (h *Handler) getCharacter(w http.ResponseWriter, r *http.Request) {
	// r.PathValue("id") でパス変数 {id} を文字列で取り出し、Atoi で int に変換する。
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil { // "abc" など数値でないとき Atoi が失敗
		http.Error(w, "invalid id", http.StatusBadRequest) // 400（不正なリクエスト）
		return
	}

	c, err := h.store.Get(r.Context(), id) // id を渡して1件取得
	if errors.Is(err, store.ErrNotFound) { // 「見つからない」番兵エラーなら
		http.Error(w, "character not found", http.StatusNotFound) // 404 を返す
		return
	}
	if err != nil { // それ以外の失敗
		http.Error(w, "internal server error", http.StatusInternalServerError) // 500
		return
	}
	writeJSON(w, http.StatusOK, c) // 成功なら 200 と単一 JSON を書き出す
}

// writeJSON は任意の値を JSON にして書き出す小さなヘルパ。
// v any はどんな型でも受けられる引数（any は interface{} の別名）。
func writeJSON(w http.ResponseWriter, status int, v any) {
	// Content-Type ヘッダは WriteHeader より前にセットする（後からでは反映されない）。
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)             // ステータス行（200/404 など）を書き出す
	json.NewEncoder(w).Encode(v)      // v を JSON に変換してレスポンスへ直接書き込む
}`}</Code>
      <Callout variant="tip" title="ヘッダは WriteHeader より前に">
        <Cmd>w.Header().Set(...)</Cmd> は <Cmd>w.WriteHeader(status)</Cmd> より<strong>前</strong>に呼ぶ必要があります。ステータス行を書いた後にヘッダを足しても反映されません。
        <Cmd>Content-Type</Cmd> を明示しないとブラウザや curl が中身を JSON と認識しないことがあります。
      </Callout>

      <Section>main.go で組み立てて起動する</Section>
      <p>
        DB を開き、store を作り、handler に渡し、ルータを <Cmd>http.ListenAndServe</Cmd> に載せます。ここが「配線図」です。
      </p>
      <Code lang="go" filename="main.go">{`package main // 実行可能プログラムは必ず package main

import (
	"database/sql" // sql.Open で DB を開くため
	"log"          // ログ出力・致命エラー終了（log.Fatalf）用
	"net/http"     // HTTP サーバー起動（ListenAndServe）用

	_ "modernc.org/sqlite" // ドライバ登録（名前は "sqlite"）

	"github.com/yourname/character-api/internal/api"   // 自作の api 層
	"github.com/yourname/character-api/internal/store" // 自作の store 層
)

// main はプログラムの入口。ここで全部品を組み立てて起動する。
func main() {
	// sql.Open は「どのドライバで、どこへ繋ぐか」を登録するだけ（この時点では未接続）。
	db, err := sql.Open("sqlite", "data/characters.db")
	if err != nil { // ドライバ名の間違いなど、設定段階の失敗
		log.Fatalf("db open: %v", err) // ログを出してプログラムを終了
	}
	defer db.Close() // main 終了時に DB をクローズ

	h := api.New(store.New(db)) // store を作り、それを渡して handler を組み立てる（配線）

	log.Println("listening on :8080") // 起動メッセージ
	// ListenAndServe はポート8080で待ち受け、h.Routes() のルータでリクエストを捌く。
	if err := http.ListenAndServe(":8080", h.Routes()); err != nil {
		log.Fatalf("server: %v", err) // サーバーが異常終了したら理由を出して終了
	}
}`}</Code>

      <Section>curl で動作を確かめる</Section>
      <p>
        サーバを <Cmd>go run .</Cmd> で起動したら、別のターミナルから叩きます。まずは全件取得。
      </p>
      <Code lang="bash" filename="terminal">{`curl -s http://localhost:8080/characters | head  # 全件取得（-s=進捗非表示 / head=先頭だけ表示）`}</Code>
      <Code lang="json" filename="GET /characters（抜粋）">{`[
  {
    "id": 1,
    "name": "Aru",
    "school": "Gehenna",
    "club": "Problem Solver 68",
    "starGrade": 3,
    "squadType": "Striker",
    "tacticRole": "DamageDealer",
    "position": "Back",
    "bulletType": "Explosive",
    "armorType": "Light",
    "weaponType": "SMG",
    "age": 17,
    "birthday": "03-12",
    "attackPower": 1204,
    "maxHp": 8320,
    "profile": "ゲヘナの便利屋68を率いる。"
  }
]`}</Code>
      <Figure
        src="/learn/shots/api-practice/list-and-get-endpoints-01.svg"
        alt="curl で全件取得し、JSON 一覧の先頭部分が表示された画面"
        caption="全件取得の実行結果。SQLite に投入したデータがそのまま JSON で出ていることを確認する"
      />
      <p>次に id 指定の 1 件取得。</p>
      <Code lang="bash" filename="terminal">{`curl -s http://localhost:8080/characters/1  # id=1 を1件取得`}</Code>
      <Code lang="json" filename="GET /characters/1">{`{
  "id": 1,
  "name": "Aru",
  "school": "Gehenna",
  "starGrade": 3,
  "tacticRole": "DamageDealer",
  "maxHp": 8320,
  "profile": "ゲヘナの便利屋68を率いる。"
}`}</Code>
      <Figure
        src="/learn/shots/api-practice/list-and-get-endpoints-02.svg"
        alt="curl で id=1 を取得し、単一の JSON オブジェクトが返ってきた画面"
        caption="1 件取得は配列ではなくオブジェクトが返る。一覧との形の違いを見比べておく"
      />
      <p>存在しない id を叩くと 404 が返ります（<Cmd>-i</Cmd> でステータス行も表示）。</p>
      <Code lang="bash" filename="terminal">{`curl -si http://localhost:8080/characters/9999  # 存在しない id（-i でステータス行も表示 → 404 確認）`}</Code>
      <Code lang="text" filename="レスポンス">{`HTTP/1.1 404 Not Found
Content-Type: text/plain; charset=utf-8

character not found`}</Code>

      <Section>store 層と api 層を分ける理由</Section>
      <p>
        小さな API なら 1 ファイルに全部書いても動きます。それでも層を分けるのは、次の実務的な利点があるからです。
      </p>
      <ComparisonTable
        headers={["利点", "内容"]}
        rows={[
          ["テストしやすい", "store は SQL の入出力だけを検証でき、HTTP を立ち上げずに単体テストできる"],
          ["DB を差し替えやすい", "SQLite → PostgreSQL の移行が store 層内で完結し、api 層は触らずに済む"],
          ["責任が明確", "「SQL が変」か「HTTP の返し方が変」かを切り分けやすく、バグの所在がすぐ分かる"],
          ["再利用できる", "同じ store を CLI やバッチからも呼べる（HTTP に縛られない）"],
        ]}
      />

      <Section>つまずきポイント</Section>
      <Callout variant="warn" title="Scan の列順は SELECT と一致させる">
        <Cmd>rows.Scan(&c.ID, &c.Name, ...)</Cmd> のポインタの並びは、<Cmd>SELECT id, name, ...</Cmd> の列の並びと 1 対 1 で対応します。
        ずれてもコンパイルは通り、実行時に「名前の欄に学校名が入る」ような静かなバグになります。<Cmd>SELECT *</Cmd> は列順が不定になり危険なので、
        <strong>列名を明示的に並べて Scan と揃える</strong>のが鉄則です。
      </Callout>
      <Callout variant="warn" title="空の結果は null ではなく空配列 [] を返す">
        <Cmd>var list []Character</Cmd> のまま 1 件も詰めずに JSON 化すると <Cmd>null</Cmd> が出力されます。フロント側は <Cmd>[]Character</Cmd> を期待して
        <Cmd>.map()</Cmd> しようとするので、<Cmd>null</Cmd> だとクラッシュしかねません。<Cmd>list := []Character{}</Cmd> と<strong>空スライスで初期化</strong>すれば、
        0 件でも <Cmd>[]</Cmd> が返り、呼び出し側が安全になります。
      </Callout>
      <Callout variant="warn" title="rows.Close の閉じ忘れ / rows.Err の確認漏れ">
        <Cmd>defer rows.Close()</Cmd> を書かないと接続リークで本番が止まります。<Cmd>rows.Err()</Cmd> を確認しないと、途中で切れた通信を「成功」と誤認します。
        <Cmd>QueryRowContext</Cmd>（1 件）は <Cmd>Close</Cmd> 不要ですが、<Cmd>QueryContext</Cmd>（複数件）は必須——ここを混同しがちです。
      </Callout>

      <Bridge course="データベース論（SQL・クエリ）／ ネットワーク（HTTP）">
        ここでやったのは、講義で習う <Cmd>SELECT</Cmd> 文（関係代数の射影・選択）を、実際のアプリから<strong>プログラムで発行して結果を受け取る</strong>作業です。
        <Cmd>ORDER BY</Cmd> は結果集合の並び、<Cmd>WHERE id = ?</Cmd> は主キーによる 1 行の特定に対応し、DB 論の「主キーは一意」という性質が
        「Get が高々 1 行しか返さない」という設計の根拠になっています。一方、それを外へ届ける <Cmd>GET</Cmd> メソッドと <Cmd>200</Cmd> / <Cmd>404</Cmd> の返し分けは、
        ネットワークの講義で扱う HTTP のリクエスト/レスポンスモデルそのもの。<strong>DB 論（データの取り出し方）とネットワーク（データの届け方）が、1 本の API の中で出会う</strong>のがこの章です。
      </Bridge>

      <SubSection>理解度チェック</SubSection>
      <Quiz
        question="List() が 1 件も見つからなかったとき、JSON で null ではなく [] を返すために必要なのは？"
        options={[
          <>戻り値の型を <Cmd>*[]Character</Cmd> にする</>,
          <><Cmd>var list []Character</Cmd> の代わりに <Cmd>list := []Character{"{}"}</Cmd> と空スライスで初期化する</>,
          <><Cmd>rows.Close()</Cmd> を呼ばないようにする</>,
          <><Cmd>SELECT</Cmd> に <Cmd>ORDER BY</Cmd> を付ける</>,
        ]}
        answer={1}
        explanation={<>nil スライスは JSON では <Cmd>null</Cmd> になります。<Cmd>[]Character{"{}"}</Cmd> と空スライスで初期化しておけば、0 件でも <Cmd>[]</Cmd> が出力され、呼び出し側が安全に <Cmd>.map()</Cmd> できます。</>}
      />
      <Quiz
        question="store.Get が sql.ErrNoRows を受け取ったときの正しい振る舞いは？"
        options={[
          <>そのまま <Cmd>sql.ErrNoRows</Cmd> を api 層まで返す</>,
          <><Cmd>panic</Cmd> させてサーバを止める</>,
          <>自分たちの <Cmd>ErrNotFound</Cmd> に変換して返し、api 層で 404 にする</>,
          <>空の <Cmd>Character{"{}"}</Cmd> を <Cmd>nil</Cmd> エラーで返す</>,
        ]}
        answer={2}
        explanation={<><Cmd>sql.ErrNoRows</Cmd> は DB ドライバ都合のエラーです。アプリの語彙 <Cmd>ErrNotFound</Cmd> に翻訳しておくと、api 層は <Cmd>errors.Is</Cmd> で判定して 404 に変換でき、DB 実装への依存も断てます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "store 層（SQL を発行）と api 層（HTTP を返す）を分けると、テスト・DB 差し替え・切り分けが楽になる",
          "複数件は QueryContext + rows.Next/Scan、1 件は QueryRowContext + Scan。Scan のポインタ順は SELECT の列順と揃える",
          "rows は defer Close、ループ後に rows.Err() を確認する（database/sql の定型）",
          "空の一覧は nil ではなく []Character{} で返し、JSON を null ではなく [] にする",
          "sql.ErrNoRows は ErrNotFound に翻訳し、api 層で errors.Is により 404 に変換する",
          "Go 1.22 の net/http は \"GET /characters/{id}\" と r.PathValue(\"id\") でルーティングできる",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, Steps, Step, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "db-connection",
  title: "database/sql で SQLite に接続する",
  description: "database/sql と SQLite ドライバ（modernc.org/sqlite）で DB に接続し、db.Ping で疎通を確認、コネクションプールの考え方を押さえ、store 層に *sql.DB を隠蔽して 1 件取得（QueryRow/Scan）と複数取得（Query/rows.Next/Scan）を実装する。プレースホルダと sql.ErrNoRows の扱いまでを一つずつ確認する。",
  domain: "api-practice",
  section: "server",
  order: 2,
  level: "basic",
  tags: ["database/sql", "SQLite", "コネクション"],
  updated: "2026-07-07",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        前章のダミーデータを、いよいよ<strong>本物の DB からの取得</strong>に置き換えます。使うのは Go 標準の
        <Cmd>{"database/sql"}</Cmd> と、SQLite ドライバ <Cmd>{"modernc.org/sqlite"}</Cmd>。DB 接続の実体である
        <Cmd>{"*sql.DB"}</Cmd> を <Cmd>{"store"}</Cmd> 層に隠蔽し、1 件取得と複数取得を実装します。「接続はいつ張られるのか」
        「コネクションプールとは何か」という、つまずきやすい勘所も言葉で押さえます。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール", val: "store.New(dsn) で DB に接続し、GetByID / List で SQLite から Character を取得できる" },
          { key: "所要時間", val: "約20分" },
          { key: "前提①", val: "前章の net/http サーバが動いている" },
          { key: "前提②", val: "data/characters.db が作成済み（前々章「データベース構築」）" },
          { key: "前提③", val: "Character 型（json タグ camelCase）を定義済み" },
        ]}
      />

      <Section>ドライバを入れる — 「_」インポートの意味</Section>
      <p>
        <Cmd>{"database/sql"}</Cmd> は<strong>共通インターフェース</strong>だけを提供し、実際に SQLite と喋る処理は
        <strong>ドライバ</strong>が担います。今回は Cgo 不要でクロスコンパイルしやすい純 Go 実装の <Cmd>{"modernc.org/sqlite"}</Cmd> を使います。
      </p>
      <Code lang="bash" filename="ターミナル">{`go get modernc.org/sqlite  # SQLite ドライバ（純 Go 実装）を取得し go.mod に追加する`}</Code>
      <Code lang="go" filename="import 部分">{`import ( // 複数パッケージをまとめて読み込む import ブロック構文
	"database/sql" // DB 共通インターフェース（標準ライブラリ）を読み込む

	_ "modernc.org/sqlite" // ← 「_」でインポート。名前は使わずドライバ登録の副作用だけ得る
) // import ブロックの終わり`}</Code>
      <Callout variant="info" title="なぜ「_」（ブランク識別子）で import するのか">
        ドライバのパッケージは、<Cmd>{"init()"}</Cmd> の中で <Cmd>{"sql.Register(\"sqlite\", ...)"}</Cmd> を呼び、
        自分を <Cmd>{"database/sql"}</Cmd> に<strong>登録</strong>します。私たちのコードはドライバの関数を直接呼ばず、
        <strong>この登録という副作用</strong>だけが欲しいのです。<Cmd>{"_"}</Cmd> を付けると「import はするが名前は使わない」を明示でき、
        「未使用 import」のコンパイルエラーも避けられます。登録名 <Cmd>{"\"sqlite\""}</Cmd> が、後で <Cmd>{"sql.Open"}</Cmd> の第 1 引数になります。
      </Callout>

      <Section>sql.Open はまだ接続を張らない</Section>
      <p>
        最大の勘所です。<Cmd>{"sql.Open"}</Cmd> は名前に反して<strong>その場では接続を張りません</strong>。返ってくる
        <Cmd>{"*sql.DB"}</Cmd> は「接続の設定を持ったプール管理オブジェクト」で、実際の接続は<strong>最初にクエリが必要になった時点で遅延して</strong>張られます。
      </p>
      <Code lang="go" filename="接続の確認">{`// := は短絡変数宣言。db と err を同時に宣言して代入する
db, err := sql.Open("sqlite", "data/characters.db") // 登録名 "sqlite" と DSN を渡し *sql.DB を用意（まだ接続しない）
if err != nil { // if err != nil はエラー処理の定石。エラーがあれば中へ入る
	// ここでのエラーは「DSN が不正」等だけ。接続失敗はまだ検出できない
	return nil, err // 呼び出し元へ nil とエラーを返し処理を打ち切る
} // if の終わり

// 本当に繋がるかは Ping で確かめる（ここで初めて接続を張る）
if err := db.Ping(); err != nil { // if 内だけで使う err を宣言しつつ Ping の結果を判定
	return nil, err // 疎通できなければエラーを返す
} // if の終わり`}</Code>
      <ComparisonTable
        headers={["呼び出し", "何をするか", "ここで接続失敗を検出できるか"]}
        rows={[
          [<Cmd>{"sql.Open(...)"}</Cmd>, "DSN を検証し *sql.DB を用意するだけ（遅延）", "できない"],
          [<Cmd>{"db.Ping()"}</Cmd>, "実際に 1 本接続を張って疎通を確認する", "できる"],
        ]}
      />
      <Callout variant="warn" title="Open が成功したから繋がっている、は誤解">
        <Cmd>{"sql.Open"}</Cmd> が <Cmd>{"err == nil"}</Cmd> を返しても、DB ファイルが無い・権限が無い等の問題は<strong>まだ分かりません</strong>。
        起動時に確実に検出したいなら、必ず <Cmd>{"db.Ping()"}</Cmd>（または最初の実クエリ）で疎通を確かめます。起動直後に落とすほうが、
        後で謎のエラーに悩むより安全です。
      </Callout>

      <Section>*sql.DB はプール — 使い回して共有する</Section>
      <p>
        <Cmd>{"*sql.DB"}</Cmd> は 1 本の接続ではなく<strong>コネクションプール</strong>です。内部に複数の接続を保持し、
        クエリのたびに空いている接続を貸し出し、終わったら返却します。だからハンドラごとに <Cmd>{"sql.Open"}</Cmd> してはいけません。
        <strong>アプリ起動時に一度だけ作り、全ハンドラで共有</strong>します。
      </p>
      <SubSection>プールの調整</SubSection>
      <p>プールの挙動は次の 3 つで調整できます。最初は既定でも動きますが、意味は知っておきます。</p>
      <KVList
        items={[
          { key: "SetMaxOpenConns(n)", val: "同時に開く接続の上限。DB 側の接続数制限に合わせる（例: 25）" },
          { key: "SetMaxIdleConns(n)", val: "アイドル状態で保持しておく接続数。再利用を効かせて接続コストを下げる" },
          { key: "SetConnMaxLifetime(d)", val: "接続の最大寿命。古い接続を定期的に張り直し、切断済み接続の掴みを防ぐ" },
        ]}
      />
      <Code lang="go" filename="プール設定の例">{`db.SetMaxOpenConns(25) // メソッド呼び出し。同時に開く接続数の上限を 25 に設定
db.SetMaxIdleConns(25) // アイドル状態で保持しておく接続数を 25 に設定（再利用のため）
db.SetConnMaxLifetime(5 * time.Minute) // 接続の最大寿命を 5 分に。* は乗算、time.Minute は 1 分を表す定数`}</Code>
      <Callout variant="tip" title="毎回 Open しない理由">
        接続の確立には TCP 接続や認証など<strong>それなりのコスト</strong>がかかります。プールはこの確立済み接続を<strong>再利用</strong>することで、
        リクエストごとの遅延を大きく減らします。ハンドラ内で毎回 <Cmd>{"sql.Open"}</Cmd> すると、プールの利点が消え、接続リークやリソース枯渇の原因になります。
      </Callout>

      <Section>store 層を作る — DB の詳細を隠蔽する</Section>
      <p>
        ハンドラに SQL を直書きすると、DB を差し替えたいときに全ハンドラを触ることになります。そこで
        <strong>DB アクセスを <Cmd>{"internal/store"}</Cmd> に閉じ込め</strong>、ハンドラは <Cmd>{"store.List()"}</Cmd> のような
        メソッドを呼ぶだけにします。まず接続を保持する <Cmd>{"Store"}</Cmd> と、その生成関数 <Cmd>{"New"}</Cmd> を作ります。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`package store // このファイルが属するパッケージ名を宣言

import ( // 使うパッケージをまとめて読み込む
	"database/sql" // DB 共通インターフェース（標準ライブラリ）
	"time" // 時間を扱う標準パッケージ（接続寿命の指定に使う）

	_ "modernc.org/sqlite" // ドライバ登録の副作用だけ得る（「_」インポート）
) // import ブロックの終わり

// Store は DB プールを抱え、データアクセスの窓口になる。
type Store struct { // type ... struct は構造体（複数フィールドをまとめた型）の定義
	db *sql.DB // *sql.DB はポインタ型（DB プールへの参照）。小文字 db は非公開で外から触れない
} // 構造体定義の終わり

// New は dsn で DB に接続し、疎通確認まで済ませた Store を返す。
func New(dsn string) (*Store, error) { // func は関数定義。dsn(文字列)を受け取り (*Store, error) の2値を返す
	db, err := sql.Open("sqlite", dsn) // := で db と err を宣言。*sql.DB を用意（まだ接続しない）
	if err != nil { // エラー処理の定石。DSN 不正などがあれば
		return nil, err // ポインタは nil（値なし）、err を添えて返す
	} // if の終わり
	db.SetMaxOpenConns(25) // 同時接続数の上限を 25 に設定
	db.SetMaxIdleConns(25) // アイドル状態で保持する接続数を 25 に設定
	db.SetConnMaxLifetime(5 * time.Minute) // 接続の最大寿命を 5 分に設定

	if err := db.Ping(); err != nil { // Ping で実際に疎通確認。失敗したら
		db.Close() // 疎通しないなら開きかけを閉じる
		return nil, err // エラーを返して中断する
	} // if の終わり
	return &Store{db: db}, nil // & はアドレス取得。Store を生成しそのポインタと nil(エラーなし)を返す
} // 関数 New の終わり

// Close はアプリ終了時にプールを閉じる。
func (s *Store) Close() error { return s.db.Close() } // (s *Store) はレシーバ。Store 型のメソッドとして定義し、プールを閉じてエラーを返す`}</Code>
      <p>
        <Cmd>{"db"}</Cmd> フィールドは小文字（非公開）なので、パッケージの外から <Cmd>{"*sql.DB"}</Cmd> を直接触れません。
        「DB を使う手段は <Cmd>{"Store"}</Cmd> のメソッドだけ」に絞れます。これが<strong>隠蔽（カプセル化）</strong>です。
      </p>

      <Section>1 件取得 — QueryRow と Scan</Section>
      <p>
        主キーで 1 行だけ取るときは <Cmd>{"QueryRow"}</Cmd> を使います。返る <Cmd>{"*sql.Row"}</Cmd> に対して <Cmd>{"Scan"}</Cmd> を呼び、
        <strong>各列の値を、渡した変数（のアドレス）へ書き込ませ</strong>ます。
      </p>
      <Code lang="go" filename="internal/store/store.go（追記）">{`// GetByID は id で 1 件取得する。見つからなければ sql.ErrNoRows。
func (s *Store) GetByID(id int64) (Character, error) { // Store のメソッド。id(64bit整数)を受け取り (Character, error) を返す
	// ? はプレースホルダ。値は Scan とは別に引数で渡す（後述）
	const q = \`SELECT id, name, school, star_grade, age, max_hp, profile
	           FROM characters WHERE id = ?\` // const は定数宣言。逆引用符で囲んだ複数行の SQL 文字列

	var c Character // var は変数宣言。Character 型のゼロ値で c を用意
	err := s.db.QueryRow(q, id).Scan( // QueryRow で 1 行取得し、続けて Scan で各列を変数へ書き込む
		&c.ID, &c.Name, &c.School, &c.StarGrade, &c.Age, &c.MaxHP, &c.Profile, // & でアドレスを渡す。SELECT の列順と完全に一致させる
	) // Scan 呼び出しの終わり
	if err != nil { // 取得や Scan でエラーがあれば
		return Character{}, err // sql.ErrNoRows もここに含まれる
	} // if の終わり
	return c, nil // 取得した Character と nil(エラーなし)を返す
} // 関数 GetByID の終わり`}</Code>
      <Callout variant="danger" title="Scan の引数はポインタ／列順と一致させる">
        <ul>
          <li>
            <strong>ポインタを渡す</strong>：<Cmd>{"Scan"}</Cmd> は変数に値を<strong>書き込む</strong>ので、<Cmd>{"&c.Name"}</Cmd> のように
            アドレスを渡します。値（<Cmd>{"c.Name"}</Cmd>）を渡すとコンパイルは通っても実行時エラーになります。
          </li>
          <li>
            <strong>SELECT の列順と Scan の引数順を完全に一致させる</strong>：<Cmd>{"SELECT id, name, ..."}</Cmd> なら
            <Cmd>{"Scan(&c.ID, &c.Name, ...)"}</Cmd>。ずれると、型が偶然合ってしまった場合は<strong>間違った列が別のフィールドに入る</strong>という、
            気づきにくいバグになります。<Cmd>{"SELECT *"}</Cmd> を避け、列を明示するのはこの事故を防ぐためでもあります。
          </li>
        </ul>
      </Callout>

      <Section>sql.ErrNoRows の扱い</Section>
      <p>
        <Cmd>{"QueryRow"}</Cmd> で該当行が無いとき、<Cmd>{"Scan"}</Cmd> は特別なエラー <Cmd>{"sql.ErrNoRows"}</Cmd> を返します。
        これは<strong>「異常」ではなく「見つからなかった」という正常な結果</strong>です。<Cmd>{"errors.Is"}</Cmd> で判定して分岐します。
      </p>
      <Code lang="go" filename="呼び出し側での分岐（イメージ）">{`c, err := s.GetByID(id) // := で c と err を宣言。GetByID を呼んで結果を受け取る
if errors.Is(err, sql.ErrNoRows) { // errors.Is は err が特定のエラーかを判定する関数。行が無い場合
	// 見つからない → 次章でここを HTTP 404 につなぐ
} // if の終わり
if err != nil { // それ以外のエラーがある場合
	// それ以外 → サーバエラー（500）扱い
} // if の終わり`}</Code>
      <Callout variant="info" title="次章の予告：404 との対応">
        「該当キャラが居ない」は、HTTP では <Cmd>{"404 Not Found"}</Cmd> が自然です。<Cmd>{"sql.ErrNoRows"}</Cmd> をハンドラで受けて 404 に、
        その他のエラーは 500 に写像する——この「DB のエラー → HTTP ステータス」の橋渡しは、<strong>次章「API エンドポイント実装」</strong>で扱います。
      </Callout>

      <Section>複数取得 — Query と rows のループ</Section>
      <p>
        一覧のように複数行を取るときは <Cmd>{"Query"}</Cmd> を使い、返る <Cmd>{"*sql.Rows"}</Cmd> を
        <Cmd>{"rows.Next()"}</Cmd> で 1 行ずつ進めながら <Cmd>{"Scan"}</Cmd> します。作法が決まっているので型で覚えます。
      </p>
      <Code lang="go" filename="internal/store/store.go（追記）">{`// List は全件を取得する。
func (s *Store) List() ([]Character, error) { // Store のメソッド。[]Character はスライス（可変長配列）を返す
	const q = \`SELECT id, name, school, star_grade, age, max_hp, profile
	           FROM characters ORDER BY id\` // const で複数行 SQL を定数化（逆引用符で囲む）

	rows, err := s.db.Query(q) // 複数行取得は Query。結果カーソル *sql.Rows と err を受け取る
	if err != nil { // クエリ失敗なら
		return nil, err // nil スライスとエラーを返す
	} // if の終わり
	defer rows.Close() // ← 必ず閉じる（リーク防止）。defer は関数終了時にまとめて実行される

	var list []Character // 結果を溜めるスライスを宣言（初期値は nil）
	for rows.Next() { // 次の行がある間ループ。カーソルを 1 行進める
		var c Character // 1 行分を受ける変数を用意
		if err := rows.Scan( // この行を Scan して各列を変数へ書き込む
			&c.ID, &c.Name, &c.School, &c.StarGrade, &c.Age, &c.MaxHP, &c.Profile, // & でアドレス渡し。列順と一致させる
		); err != nil { // Scan の戻り err をその場で判定
			return nil, err // 失敗ならエラーを返す
		} // if の終わり
		list = append(list, c) // append で c をスライス末尾に追加
	} // for ループの終わり
	// ループ後に必ず確認：途中で起きたエラーはここに出る
	if err := rows.Err(); err != nil { // rows.Err() で反復中に起きたエラーを最終確認
		return nil, err // あればエラーを返す
	} // if の終わり
	return list, nil // 集めたスライスと nil(エラーなし)を返す
} // 関数 List の終わり`}</Code>
      <Steps>
        <Step title="Query で行の集合を取る">
          <p><Cmd>{"s.db.Query(q, args...)"}</Cmd> が <Cmd>{"*sql.Rows"}</Cmd>（カーソル）を返します。</p>
        </Step>
        <Step title="defer rows.Close() を即書く">
          <p>取得できたら<strong>すぐ</strong> <Cmd>{"defer rows.Close()"}</Cmd>。閉じ忘れると接続がプールに返らずリークします。</p>
        </Step>
        <Step title="rows.Next() で回して Scan">
          <p>1 行ごとに <Cmd>{"Scan"}</Cmd> して <Cmd>{"append"}</Cmd>。列順と引数順は 1 件取得と同じルールです。</p>
        </Step>
        <Step title="rows.Err() で締める">
          <p>ループはエラーでも <Cmd>{"false"}</Cmd> で抜けます。<strong>ループ後に <Cmd>{"rows.Err()"}</Cmd> を必ず確認</strong>し、取りこぼしを防ぎます。</p>
        </Step>
      </Steps>

      <Section>プレースホルダと SQL インジェクション（触り）</Section>
      <p>
        SQL に値を埋め込むとき、文字列連結で作ってはいけません。<Cmd>{"WHERE id = ?"}</Cmd> の <Cmd>{"?"}</Cmd> が
        <strong>プレースホルダ</strong>で、実際の値は <Cmd>{"Query(q, id)"}</Cmd> のように<strong>別引数として渡します</strong>。
        ドライバが値を安全にエスケープするため、悪意ある入力で SQL を書き換えられる<strong>SQL インジェクション</strong>を防げます。
      </p>
      <Code lang="go" filename="やってはいけない例 / 正しい例">{`// NG：文字列連結（インジェクションの温床）
q := "SELECT * FROM characters WHERE name = '" + name + "'" // + は文字列連結。値を直接埋め込むと危険（この書き方はダメ）

// OK：プレースホルダに任せる
rows, err := s.db.Query("SELECT id, name FROM characters WHERE name = ?", name) // ? に値 name を別引数で渡す。ドライバが安全に処理する`}</Code>
      <Callout variant="tip" title="プレースホルダ記号は DB で異なる">
        SQLite / MySQL は <Cmd>{"?"}</Cmd>、PostgreSQL は <Cmd>{"$1, $2"}</Cmd> を使います。この教材は SQLite なので <Cmd>{"?"}</Cmd> です
        （最終章の PostgreSQL 移行で <Cmd>{"$1"}</Cmd> に置き換えます）。名前による検索と対策の詳しい話は、次章の<strong>「検索」</strong>で扱います。
      </Callout>

      <Section>store をサーバに繋ぐ</Section>
      <p>
        最後に、起動時に <Cmd>{"store.New"}</Cmd> を一度だけ呼び、その <Cmd>{"Store"}</Cmd> をハンドラで共有します（プールの共有）。
      </p>
      <Code lang="go" filename="main.go（要点）">{`func main() { // main はプログラムの入口となる関数
	st, err := store.New("data/characters.db") // := で st と err を宣言。DB に接続した Store を一度だけ作る
	if err != nil { // 接続・疎通に失敗したら
		log.Fatal(err) // 起動時に疎通しないなら即終了
	} // if の終わり
	defer st.Close() // defer で main 終了時にプールを閉じるよう予約

	mux := http.NewServeMux() // ルーティングを担う ServeMux を生成
	// st を閉じ込めたハンドラを登録（次章で本実装）
	mux.HandleFunc("GET /characters", func(w http.ResponseWriter, r *http.Request) { // パスとハンドラを対応付け。func(...) は無名関数
		list, err := st.List() // 共有した Store から全件取得
		if err != nil { // 取得失敗なら
			http.Error(w, "internal error", http.StatusInternalServerError) // 500 エラーを応答
			return // ハンドラを打ち切る
		} // if の終わり
		w.Header().Set("Content-Type", "application/json") // レスポンスヘッダを JSON に設定
		json.NewEncoder(w).Encode(list) // list を JSON に変換してレスポンスに書き出す
	}) // ハンドラ登録の終わり

	log.Println("listening on :8080") // 起動メッセージをログ出力
	log.Fatal(http.ListenAndServe(":8080", mux)) // 8080 番で待ち受け開始。異常終了時はログを出して終了
} // 関数 main の終わり`}</Code>
      <p>起動して <Cmd>{"curl"}</Cmd> で叩き、ダミーではなく DB の中身が返れば接続成功です。</p>
      <Code lang="bash" filename="ターミナル">{`go run . &  # カレントディレクトリのアプリをビルドして起動。& はバックグラウンド実行
curl localhost:8080/characters | jq  # エンドポイントを叩き、返る JSON を jq で整形表示`}</Code>
      <Figure
        src="/learn/shots/api-practice/db-connection-01.svg"
        alt="curl で /characters を叩き、DB から読んだデータが JSON で返ってきた画面"
        caption="ダミーではなく DB に入れた実データが返っていれば、接続と store 層の配線は成功"
      />

      <Section>つまずきポイント</Section>
      <Callout variant="warn" title="ありがちな 4 つのミス">
        <ul>
          <li><strong>Open 直後に接続できていると思い込む</strong>：接続は遅延。<Cmd>{"db.Ping()"}</Cmd> で疎通確認するまで失敗は分かりません。</li>
          <li><strong><Cmd>{"rows.Close()"}</Cmd> 忘れ</strong>：接続がプールに返らずリークし、やがて枯渇します。<Cmd>{"Query"}</Cmd> の直後に <Cmd>{"defer rows.Close()"}</Cmd>。</li>
          <li><strong>Scan に値を渡す</strong>：<Cmd>{"Scan"}</Cmd> は書き込むのでポインタ（<Cmd>{"&c.Name"}</Cmd>）が必須。値渡しは実行時エラー。</li>
          <li><strong>列順と Scan 順の不一致</strong>：SELECT の並びと Scan 引数の並びを完全一致させる。<Cmd>{"SELECT *"}</Cmd> は列順が変わると壊れるので避ける。</li>
        </ul>
      </Callout>

      <Bridge course="OS／データベース論／ソフトウェア工学">
        <p>
          コネクションプールは、OS やデータベースの授業で学ぶ<strong>「有限で高コストな資源をどう再利用するか」</strong>という定番の設計です。
          接続の確立は毎回コストがかかるため、確立済みの接続を貸し借りして使い回します。これはスレッドプールやバッファプールと同じ発想で、
          <Cmd>{"SetMaxOpenConns"}</Cmd> は<strong>資源の上限（同時実行数の制御）</strong>、<Cmd>{"SetConnMaxLifetime"}</Cmd> は<strong>古い資源の回収</strong>にあたります。
        </p>
        <p>
          <Cmd>{"store"}</Cmd> 層で <Cmd>{"*sql.DB"}</Cmd> を非公開にして隠すのは、ソフトウェア工学でいう<strong>カプセル化と関心の分離</strong>です。
          「データがどこにどう保存されているか（DB の詳細）」を <Cmd>{"store"}</Cmd> の内側に閉じ込めると、上位（ハンドラ）は
          <Cmd>{"List()"}</Cmd> や <Cmd>{"GetByID()"}</Cmd> という<strong>意図</strong>だけを知れば済みます。最終章で SQLite から
          PostgreSQL へ移行するとき、変更が <Cmd>{"store"}</Cmd> 内に収まるのは、この分離のおかげです。
        </p>
      </Bridge>

      <Quiz
        question="sql.Open が err == nil を返しました。この時点で確実に言えることは？"
        options={[
          <>DB への接続が張られ、テーブルも存在する</>,
          <>DSN の形式に問題はなく *sql.DB は得られたが、実際に接続できるかはまだ分からない</>,
          <>1 件以上のレコードが取得できる</>,
          <>コネクションプールが満杯になっている</>,
        ]}
        answer={1}
        explanation={<><Cmd>{"sql.Open"}</Cmd> は DSN を検証して <Cmd>{"*sql.DB"}</Cmd> を用意するだけで、接続は遅延します。疎通が確実に必要なら <Cmd>{"db.Ping()"}</Cmd>（または最初の実クエリ）で確かめます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "database/sql は共通 IF、実処理はドライバ。modernc.org/sqlite を _ インポートして sql.Register の副作用だけ得る",
          "sql.Open は接続を張らない（遅延）。db.Ping() で初めて疎通を確認できる",
          "*sql.DB はコネクションプール。起動時に一度作って全ハンドラで共有し、毎回 Open しない",
          "store 層に *sql.DB を隠蔽。1 件は QueryRow().Scan()、複数は Query→rows.Next/Scan→defer Close→rows.Err()",
          "Scan はポインタで列順一致。値はプレースホルダ ? で渡してインジェクションを防ぐ。無い行は sql.ErrNoRows（次章で 404）",
        ]}
      />
    </>
  );
}

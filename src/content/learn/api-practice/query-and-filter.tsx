import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "query-and-filter",
  title: "検索・絞り込み（クエリパラメータ）",
  description: "クエリパラメータで学校・ロールを絞り込み、limit/offset でページングする。動的な WHERE を安全に組み立て、SQL インジェクションをプレースホルダで防ぐ。ORDER BY はホワイトリストで守る。",
  domain: "api-practice",
  section: "endpoints",
  order: 2,
  level: "practice",
  tags: ["クエリ", "WHERE", "SQLインジェクション"],
  updated: "2026-07-07",
  minutes: 15,
};

export default function Article() {
  return (
    <>
      <Lead>
        「全件返す」だけの API は、データが増えると使いものになりません。実務では<strong>絞り込み</strong>（学校で・ロールで）と
        <strong>ページング</strong>（20 件ずつ）が必須です。ここでは <Cmd>?school=Gehenna&role=DamageDealer&limit=20&offset=0</Cmd> のような
        クエリパラメータを受け取り、条件に応じて <Cmd>WHERE</Cmd> を組み立てます。そして最重要——<strong>その組み立て方を間違えると SQL インジェクションで DB を丸ごと抜かれる</strong>。
        なぜ危険か、どう防ぐかを実演で身につけます。
      </Lead>

      <Section>この章のゴール</Section>
      <p>
        <Cmd>GET /characters</Cmd> にクエリパラメータを足して、次のことをできるようにします。
      </p>
      <ComparisonTable
        headers={["クエリ", "意味", "例"]}
        rows={[
          [<Cmd>school</Cmd>, "学校で絞り込み", "?school=Gehenna"],
          [<Cmd>role</Cmd>, "戦術ロールで絞り込み", "?role=DamageDealer"],
          [<Cmd>limit</Cmd>, "1 ページの件数（上限あり）", "?limit=20"],
          [<Cmd>offset</Cmd>, "先頭から何件飛ばすか", "?offset=40"],
        ]}
      />

      <Section>クエリパラメータを取り出す</Section>
      <p>
        <Cmd>net/http</Cmd> では <Cmd>r.URL.Query()</Cmd> でパラメータ集合を得て、<Cmd>.Get("school")</Cmd> で 1 個ずつ取り出します。
        指定が無ければ空文字が返るので、それを「絞り込みなし」として扱います。
      </p>
      <Code lang="go" filename="internal/api/handler.go">{`// (h *Handler) はレシーバ。Handler 型のメソッドとして定義する。w=応答の書き出し口, r=受信リクエスト
func (h *Handler) listCharacters(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query() // URL の ?school=... 部分を解析し、パラメータ集合(url.Values)を得る

	// store.Filter 構造体を初期化。各フィールドにクエリの値を詰める
	f := store.Filter{
		School: q.Get("school"), // .Get はキーの値を1つ返す。無ければ空文字 → 空文字なら絞り込まない
		Role:   q.Get("role"),   // 同様に role を取得
		Limit:  atoiDefault(q.Get("limit"), 20),  // 文字列を数値化。失敗時は既定 20
		Offset: atoiDefault(q.Get("offset"), 0),  // 同上、既定 0
	} // 構造体リテラルの終わり

	// Search を呼ぶ。多値返却で (結果, error) が返る。r.Context() はリクエストのキャンセル文脈
	list, err := h.store.Search(r.Context(), f)
	if err != nil { // err が nil でない = 失敗
		http.Error(w, "internal server error", http.StatusInternalServerError) // 500 とプレーンテキストを書き出す
		return // ここで処理を打ち切る（このあとを実行させない）
	}
	writeJSON(w, http.StatusOK, list) // 成功。200 と結果 list を JSON で書き出す
} // listCharacters の終わり

// atoiDefault は数値変換に失敗したら既定値を返す小さなヘルパ。
func atoiDefault(s string, def int) int {
	n, err := strconv.Atoi(s) // 文字列 s を int へ変換。多値返却 (int, error) を受ける
	if err != nil { // 変換失敗（数字でない・空文字など）
		return def // 既定値を返す
	}
	return n // 変換できた数値を返す
}`}</Code>

      <Section>危険な組み立て方（絶対にやってはいけない）</Section>
      <p>
        まず「やってはいけない例」を先に見ます。ユーザーが送ってきた文字列を、そのまま SQL 文へ<strong>連結</strong>する書き方です。
      </p>
      <Code lang="go" filename="悪い例 — 文字列連結（脆弱）">{`// ⚠️ これは絶対にダメ。ユーザー入力を SQL 文に直接埋め込んでいる。
school := r.URL.Query().Get("school") // メソッドチェーン: Query() で集合→.Get で school の値を取り出す
// + でユーザー入力 school を SQL 文字列にそのまま連結している（ここが脆弱性の原因）
query := "SELECT * FROM characters WHERE school = '" + school + "'"
rows, _ := db.Query(query) // 組み立てた文字列をそのまま実行。_ でエラーを握り潰している（これも悪手）`}</Code>
      <p>
        通常の入力（<Cmd>Gehenna</Cmd>）なら期待通り動きます。しかし攻撃者が <Cmd>school</Cmd> に次の文字列を送ってきたらどうなるでしょう。
      </p>
      <Code lang="text" filename="攻撃者が送る school の値">{`' OR '1'='1`}</Code>
      <p>組み立てられる SQL は次のようになります。</p>
      <Code lang="sql" filename="組み立たった SQL（意図が破壊される）">{`SELECT *                    -- 全カラムを取得する
FROM characters             -- characters テーブルから
WHERE school = '' OR '1'='1' -- school='' は偽だが OR '1'='1' が常に真 → 条件全体が真になり全件漏れる`}</Code>
      <p>
        <Cmd>'1'='1'</Cmd> は常に真なので、<strong>WHERE が無効化されて全件が漏れます</strong>。さらに <Cmd>'; DROP TABLE characters; --</Cmd> のような値なら、
        テーブルを削除する SQL を注入されることもあります。これが<strong>SQL インジェクション</strong>です。原因はただ 1 つ——<strong>「データ（値）」と「コード（SQL 構文）」を文字列連結で混ぜた</strong>こと。
      </p>
      <Callout variant="danger" title="値を文字列連結で SQL に埋め込まない">
        エスケープ処理を自前で頑張る（<Cmd>'</Cmd> を <Cmd>''</Cmd> に置換する等）のは、抜け穴が生まれやすく非推奨です。正解は次に示す
        <strong>プレースホルダ</strong>で、値とコードを構造的に分離することです。
      </Callout>

      <Section>安全な組み立て方 — プレースホルダ</Section>
      <p>
        プレースホルダ（SQLite では <Cmd>?</Cmd>）を使うと、SQL の<strong>構文</strong>と<strong>値</strong>が別々に DB へ渡ります。値は「ただのデータ」として扱われ、
        中に <Cmd>' OR '1'='1</Cmd> が入っていても<strong>SQL として解釈されません</strong>。だから注入が成立しません。
      </p>
      <Code lang="go" filename="良い例 — プレースホルダ（安全）">{`school := r.URL.Query().Get("school") // クエリから school の値を取得
// ? はプレースホルダ。値 school はドライバが「データ」として安全に束縛する。
// QueryContext は ctx（キャンセル文脈）付きで実行。SQL 文と値 school を別々の引数で渡す
rows, err := db.QueryContext(ctx,
	"SELECT id, name, school FROM characters WHERE school = ?", school) // ? に school が安全に差し込まれる`}</Code>
      <Callout variant="tip" title="なぜプレースホルダは安全なのか">
        DB は「SQL 文の構造」を先に受け取って解釈し、あとから「値」を別チャネルで受け取って穴に差し込みます。値が構文へ昇格する経路が存在しないため、
        どんな文字列を入れても構文が壊れません。「値とコードを分離する」——これがインジェクション対策の本質です。
      </Callout>

      <Section>動的な WHERE を安全に組み立てる</Section>
      <p>
        絞り込み条件は「指定されたものだけ」を <Cmd>AND</Cmd> でつなぎたい。そこで<strong>条件文字列のスライス</strong>と<strong>引数のスライス</strong>を並行して貯め、
        最後に <Cmd>strings.Join</Cmd> で連結します。<strong>ユーザーの値は必ず引数スライス（プレースホルダ）側</strong>へ入れ、SQL 文字列側には <Cmd>?</Cmd> しか書きません。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`import "strings" // strings.Join を使うため標準ライブラリを取り込む

// Filter は絞り込み条件をまとめた構造体。ハンドラから渡ってくる
type Filter struct {
	School string // 学校名（空文字なら絞り込まない）
	Role   string // 戦術ロール
	Limit  int    // 取得件数の上限
	Offset int    // 先頭から飛ばす件数
} // Filter 構造体の終わり

// Search は Filter に応じて SQL を組み立て、該当キャラの一覧を返す
func (s *Store) Search(ctx context.Context, f Filter) ([]Character, error) {
	conds := []string{} // 条件文字列（"school = ?" 等）を貯めるスライス。空スライスで初期化
	args := []any{}      // プレースホルダに束縛する値を貯めるスライス。[]any は任意型の可変長引数用

	// 指定があるものだけ条件に足す。値は必ず ? 側（args）へ。
	if f.School != "" { // school が指定されている場合だけ
		conds = append(conds, "school = ?")  // 条件文字列を末尾に追加（SQL 側は ? のみ）
		args = append(args, f.School)        // 対応する値を args に追加（ペアで足すのが肝）
	}
	if f.Role != "" { // role が指定されている場合だけ
		conds = append(conds, "tactic_role = ?") // 条件を追加
		args = append(args, f.Role)              // 値を追加
	}

	query := selectColumns // "SELECT ... FROM characters" の共通部分から組み立て開始
	if len(conds) > 0 {    // 条件が1つ以上あるときだけ WHERE を付ける
		// strings.Join は conds の各要素を " AND " でつなぐ（例: "school = ? AND tactic_role = ?"）
		query += " WHERE " + strings.Join(conds, " AND ")
	}
	query += " ORDER BY id" // 並び順を id 昇順で固定（識別子は連結でなく固定文字列なので安全）

	// limit / offset も値なのでプレースホルダで渡す。
	query += " LIMIT ? OFFSET ?" // ページング用の ? を2つ追加
	// clamp で丸めた値を args に追加。? が2つ増えたので値も2つ足してペアを保つ
	args = append(args, clampLimit(f.Limit), clampOffset(f.Offset))

	// args... で args スライスを可変長引数として展開。? の数と自動で一致する
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil { // クエリ実行に失敗
		return nil, err // スライスは nil、エラーをそのまま返す
	}
	defer rows.Close() // 関数を抜けるとき rows を必ず閉じる（リソース解放）

	list := []Character{} // 結果を貯める空スライス
	for rows.Next() {     // 1 行ずつ前進。次の行があれば true
		c, err := scanCharacter(rows) // 現在行を Character 構造体へ読み取る
		if err != nil {               // 読み取り失敗
			return nil, err
		}
		list = append(list, c) // 読み取れた1件を末尾に追加
	} // for の終わり
	if err := rows.Err(); err != nil { // ループ中に生じた反復エラーを最後に確認
		return nil, err
	}
	return list, nil // 全件を返す。エラーは無し(nil)
}`}</Code>
      <p>
        条件が 1 つも無ければ <Cmd>WHERE</Cmd> 句そのものを付けず、全件（＋ページング）になります。<Cmd>args...</Cmd> の展開により、
        <strong>プレースホルダの数と引数の数が自動で揃う</strong>のがこの書き方の強みです。
      </p>

      <Section>limit / offset のページング</Section>
      <p>
        <Cmd>limit</Cmd> をクライアントの言い値のまま使うと、<Cmd>?limit=100000000</Cmd> で DB とメモリを圧迫できてしまいます。
        <strong>上限でクランプ（頭打ち）</strong>し、負値や 0 は既定値に丸めます。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`const ( // 複数の定数をまとめて宣言
	defaultLimit = 20  // limit 未指定・不正時の既定件数
	maxLimit     = 100 // これ以上は許さない上限
) // const ブロックの終わり

// clampLimit は limit を安全な範囲(1〜maxLimit)に丸める
func clampLimit(n int) int {
	if n <= 0 { // 0 以下（未指定や負値）は
		return defaultLimit // 既定値に戻す
	}
	if n > maxLimit { // 上限を超えたら
		return maxLimit // 過大な要求は頭打ちにする
	}
	return n // 範囲内ならそのまま返す
}

// clampOffset は offset の負値を 0 に丸める
func clampOffset(n int) int {
	if n < 0 { // 負のオフセットは無効なので
		return 0 // 0 に丸める
	}
	return n // 0 以上ならそのまま返す
}`}</Code>

      <Section>並び替えはホワイトリストで守る</Section>
      <p>
        「<Cmd>?sort=name</Cmd> で並び替えたい」という要求はよくあります。しかし <Cmd>ORDER BY</Cmd> の<strong>カラム名はプレースホルダにできません</strong>
        （<Cmd>?</Cmd> は値専用で、識別子には使えない）。ここでユーザー入力を文字列連結すると、また injection の穴が開きます。
        対策は<strong>許可カラムのホワイトリスト</strong>——受け取った値を「あらかじめ用意した安全な文字列」へ写像します。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`// キーはユーザーが送ってよい値、値は実際に埋める安全な SQL 断片。
// map[string]string は「文字列キー→文字列値」の連想配列
var sortWhitelist = map[string]string{
	"id":     "id",                // sort=id なら "id" で並べる
	"name":   "name",              // sort=name なら "name"
	"attack": "attack_power DESC",  // sort=attack なら攻撃力の降順
	"hp":     "max_hp DESC",        // sort=hp なら最大 HP の降順
} // マップの終わり

// orderByClause は sort の値を検証し、安全な ORDER BY 句を返す
func orderByClause(sort string) string {
	// マップ参照の2値受け取り: col=値, ok=キーが存在したか(true/false)
	if col, ok := sortWhitelist[sort]; ok { // ok が true = 許可された値だった
		return " ORDER BY " + col // マップ経由なので安全な文字列しか出ない
	}
	return " ORDER BY id" // 未知の値は既定へフォールバック
}`}</Code>
      <Callout variant="tip" title="識別子はマップで、値はプレースホルダで">
        使い分けの原則。<strong>値（WHERE の右辺・LIMIT・OFFSET）はプレースホルダ <Cmd>?</Cmd></strong>、<strong>識別子（カラム名・並び順）はホワイトリスト（マップ）</strong>。
        識別子はプレースホルダで渡せないので、必ず「事前に定義した安全な文字列だけを出す」設計にします。
      </Callout>

      <Section>curl で確かめる</Section>
      <p>ゲヘナ所属で DamageDealer を、先頭から 2 件だけ取得。</p>
      <Code lang="bash" filename="terminal">{`# ゲヘナ×DamageDealer で先頭から2件だけ取得（-s は進捗表示を消す静音モード）
curl -s "http://localhost:8080/characters?school=Gehenna&role=DamageDealer&limit=2&offset=0"`}</Code>
      <Code lang="json" filename="レスポンス（抜粋）">{`[
  {
    "id": 1,
    "name": "Aru",
    "school": "Gehenna",
    "tacticRole": "DamageDealer",
    "attackPower": 1204
  },
  {
    "id": 5,
    "name": "Iori",
    "school": "Gehenna",
    "tacticRole": "DamageDealer",
    "attackPower": 1350
  }
]`}</Code>
      <Figure
        src="/learn/shots/api-practice/query-and-filter-01.svg"
        alt="school と role で絞り込んだ curl の実行結果"
        caption="絞り込みが効くと、指定した学校とロールのキャラだけが limit 件数分だけ返る"
      />
      <p>
        インジェクションを試しても、プレースホルダのおかげで<strong>ただ「そんな学校は無い」ので空配列が返るだけ</strong>です（構文は壊れません）。
      </p>
      <Code lang="bash" filename="terminal">{`# インジェクションを試す。プレースホルダのおかげで空配列が返るだけで安全
curl -s "http://localhost:8080/characters?school=' OR '1'='1"`}</Code>
      <Code lang="json" filename="レスポンス（安全に空配列）">{`[]`}</Code>
      <Figure
        src="/learn/shots/api-practice/query-and-filter-02.svg"
        alt="インジェクションを試したが空配列だけが返ってきた画面"
        caption="攻撃文字列を入れても構文は壊れず、ただの「該当なし」として空配列が返る"
      />

      <Section>つまずきポイント</Section>
      <Callout variant="warn" title="プレースホルダの数と引数の数がずれる">
        SQL 文中の <Cmd>?</Cmd> の個数と、<Cmd>args</Cmd> の要素数が一致しないと実行時エラーになります。条件を足すたびに <Cmd>conds</Cmd> と <Cmd>args</Cmd> を
        <strong>必ずペアで append</strong>する——このコースの組み立て方はそれを構造的に保証しています。<Cmd>LIMIT ? OFFSET ?</Cmd> を足したら、対応する 2 値の append も忘れずに。
      </Callout>
      <Callout variant="warn" title="ユーザー入力を ORDER BY へ直接入れない">
        <Cmd>"ORDER BY " + r.URL.Query().Get("sort")</Cmd> は識別子インジェクションの穴です。カラム名はプレースホルダで守れないため、
        <strong>必ずホワイトリスト（マップ）経由</strong>にし、未知の値は既定へフォールバックさせます。
      </Callout>
      <Callout variant="warn" title="limit の上限を設けない">
        上限クランプが無いと <Cmd>?limit=99999999</Cmd> の一撃で DB とメモリを枯渇させられます（DoS になりうる）。<Cmd>maxLimit</Cmd> で頭打ちにし、
        負値・0 は既定へ丸めましょう。
      </Callout>

      <Bridge course="情報セキュリティ（インジェクション・入力検証・最小権限）／ データベース論（インデックス）">
        SQL インジェクションは、講義で習う<strong>「信頼できない入力（untrusted input）を、解釈器へ渡す前に無害化する」</strong>という原則の代表例です。
        プレースホルダは<strong>入力検証</strong>ではなく<strong>データとコードの構造的分離</strong>で守る点が本質——だから完璧に効きます。加えて実務では
        <strong>最小権限の原則</strong>（この API の DB ユーザーには <Cmd>SELECT</Cmd> だけ許可し <Cmd>DROP</Cmd> は与えない）で、万一の被害範囲を狭めます。
        一方 <Cmd>WHERE school = ?</Cmd> を速く返すには、DB 論で習う<strong>インデックス</strong>が効きます。<Cmd>school</Cmd> 列にインデックスを張れば全表走査（フルスキャン）を避けられ、
        絞り込みが O(log n) 近くになる——「安全に組み立てる」と「速く引く」は別の関心事で、両方を満たして初めて実用的な検索 API になります。
      </Bridge>

      <SubSection>理解度チェック</SubSection>
      <Quiz
        question="ユーザーが送った並び替えキー（sort）を ORDER BY に使いたい。安全なのはどれ？"
        options={[
          <><Cmd>"ORDER BY " + sort</Cmd> と文字列連結する</>,
          <><Cmd>"ORDER BY ?"</Cmd> とプレースホルダで <Cmd>sort</Cmd> を束縛する</>,
          <>許可カラムのマップ（ホワイトリスト）で安全な文字列に写像し、未知は既定へ</>,
          <>入力の <Cmd>'</Cmd> を <Cmd>''</Cmd> に置換してから連結する</>,
        ]}
        answer={2}
        explanation={<>カラム名などの識別子はプレースホルダで渡せません（<Cmd>?</Cmd> は値専用）。ホワイトリストのマップ経由にして「事前に定義した安全な文字列」だけを出すのが正解です。連結・自前エスケープは穴が残ります。</>}
      />
      <Quiz
        question="?school=' OR '1'='1 を送られてもプレースホルダなら安全なのはなぜ？"
        options={[
          <>Go が自動で <Cmd>'</Cmd> をエスケープして削除するから</>,
          <>DB が SQL の構文と値を別々に受け取り、値が構文として解釈されないから</>,
          <>WHERE 句がクライアント側で実行されるから</>,
          <><Cmd>net/http</Cmd> が危険な文字列を弾くから</>,
        ]}
        answer={1}
        explanation={<>プレースホルダは値とコードを構造的に分離します。DB は構文を先に解釈し、値はデータとして差し込むだけなので、値の中身が SQL 構文へ昇格する経路がありません。だから注入が成立しません。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "クエリは r.URL.Query().Get(\"...\") で取得。空文字なら「絞り込みなし」として扱う",
          "SQL インジェクションの原因は「値」と「コード」を文字列連結で混ぜること。エスケープ自前実装は非推奨",
          "値はプレースホルダ ? で渡す。DB が構文と値を分離するので注入が成立しない",
          "動的 WHERE は conds([]string) と args([]any) をペアで貯め、strings.Join で連結。args... で個数が自動一致",
          "識別子（ORDER BY のカラム名）はプレースホルダ不可。ホワイトリスト（マップ）で守り未知は既定へ",
          "limit は上限クランプ、offset は負値を 0 に丸める。過大要求による DoS を防ぐ",
        ]}
      />
    </>
  );
}

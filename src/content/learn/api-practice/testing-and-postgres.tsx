import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "testing-and-postgres",
  title: "テストと PostgreSQL への移行",
  description: "net/http/httptest とテーブル駆動テストでハンドラを検証し、store をインターフェース化してモックや :memory: SQLite でテストする。後半では SQLite から PostgreSQL へ移行し、Docker Compose での起動・ドライバ切替・SQL 方言の差・データ移行・デプロイの勘所までを実践する。",
  domain: "api-practice",
  section: "quality",
  order: 2,
  level: "practice",
  tags: ["テスト", "httptest", "PostgreSQL"],
  updated: "2026-07-07",
  minutes: 22,
};

export default function Article() {
  return (
    <>
      <Lead>
        API は「動いた」で終わりではありません。<strong>壊れていないことを自動で確かめ続ける</strong>ためにテストを書き、
        本番の負荷に耐えるために<strong>データベースを選び直す</strong>——この2つが運用フェーズの入口です。
        前半で <Cmd>net/http/httptest</Cmd> を使ったハンドラのテストを、後半で SQLite から <strong>PostgreSQL</strong> への移行を実践します。
      </Lead>

      <Section>この記事のゴールと前提</Section>
      <KVList
        items={[
          { key: "ゴール①", val: "httptest とテーブル駆動テストで List / Get ハンドラを検証できる" },
          { key: "ゴール②", val: "store をインターフェース化し、モックや :memory: SQLite でテストを差し込める" },
          { key: "ゴール③", val: "Docker Compose で Postgres を起動し、ドライバとスキーマを切り替えて移行できる" },
          { key: "所要時間", val: "約22分" },
          { key: "前提", val: "Go 1.22 以上 / これまでの handler・store が実装済み / Docker が使える" },
        ]}
      />

      <Section>store をインターフェース化する — テストの差し込み口を作る</Section>
      <p>
        ハンドラが具体的な <Cmd>*store.Store</Cmd>（SQLite 実装）に直接依存していると、テストのたびに本物の DB が要ります。
        そこで、ハンドラが必要とするメソッドだけを<strong>インターフェース</strong>として <Cmd>api</Cmd> パッケージ側に定義し、
        ハンドラはその抽象に依存させます。こうすると、本番では SQLite 実装を、テストでは<strong>モック</strong>を差し込めます。
      </p>
      <Code lang="go" filename="internal/api/handler.go（抜粋）">{`package api // HTTP を受ける層のパッケージ

// Store はハンドラが必要とする操作だけを並べたインターフェース。
// 本番は SQLite 実装、テストはモックがこれを満たす。
// interface は「これらのメソッドを持つ型なら何でも受ける」という抽象の宣言。
type Store interface {
	ListCharacters() ([]Character, error)   // 全件返すメソッドの形（実装は問わない）
	GetCharacter(id int64) (Character, error) // id で1件返すメソッドの形
} // Store インターフェースの終わり

// Handler は具体型ではなく上の抽象 Store に依存する（これがテスト差し込みの鍵）。
type Handler struct {
	store Store // 具象 *store.Store でもモックでも、Store を満たせば入る
} // Handler 構造体の終わり

// NewHandler は Store を満たすものを受け取り Handler を作る。
func NewHandler(s Store) *Handler {
	return &Handler{store: s} // 受け取った実装を差し込んで返す
}`}</Code>
      <Callout variant="tip" title="インターフェースは「使う側」に置く">
        Go では、インターフェースを<strong>実装側ではなく利用側（ここでは api パッケージ）</strong>に置くのが定石です。
        ハンドラは「自分が必要な操作」だけを宣言し、それを満たすものなら何でも受け取れます。これが依存性逆転（DIP）の素直な形です。
      </Callout>

      <Section>httptest でハンドラを単体テストする</Section>
      <p>
        <Cmd>net/http/httptest</Cmd> は、実際にサーバーを起動しなくても<strong>リクエストとレスポンスを擬似的に作れる</strong>標準パッケージです。
        <Cmd>httptest.NewRequest</Cmd> で疑似リクエストを、<Cmd>httptest.NewRecorder</Cmd> でレスポンスを受け取る記録用の <Cmd>ResponseWriter</Cmd> を作り、
        ハンドラに直接渡して結果を検証します。
      </p>
      <SubSection>テーブル駆動テスト — ケースを配列で回す</SubSection>
      <p>
        Go の定番スタイルが<strong>テーブル駆動テスト</strong>です。入力と期待値の組を <Cmd>{"[]struct{...}"}</Cmd> に並べ、
        <Cmd>t.Run</Cmd> でサブテストとして1件ずつ回します。ケースの追加が1行で済み、どのケースが落ちたかも名前で分かります。
      </p>
      <Code lang="go" filename="internal/api/handler_test.go">{`package api // テスト対象と同じパッケージに置く（内部の型に触れられる）

import (
	"encoding/json"     // レスポンス本文の JSON を構造体へ戻す（Decode）ため
	"net/http"          // http.MethodGet やステータス定数を使う
	"net/http/httptest" // サーバー無しで擬似リクエスト/レスポンスを作る
	"testing"           // Go 標準のテスト機構（*testing.T）
)

// mockStore は Store インターフェースを満たすテスト用の実装。
type mockStore struct {
	chars map[int64]Character // id をキーにキャラを持つ疑似データ（map）
} // mockStore の終わり

// ListCharacters を実装＝mockStore が Store インターフェースを満たすための1つ目のメソッド。
func (m *mockStore) ListCharacters() ([]Character, error) {
	// make で長さ0・容量 len(m.chars) のスライスを用意（append 時の再確保を減らす）。
	out := make([]Character, 0, len(m.chars))
	for _, c := range m.chars { // map を1件ずつ走査（キーは無視し値 c だけ使う）
		out = append(out, c) // 値をスライスに集める
	}
	return out, nil // 集めた一覧とエラー無しを返す
}

// GetCharacter を実装＝Store を満たす2つ目のメソッド。
func (m *mockStore) GetCharacter(id int64) (Character, error) {
	c, ok := m.chars[id] // map 参照。2値受けで ok に「存在したか」の真偽が入る
	if !ok { // キーが無かった場合
		return Character{}, ErrNotFound // store 側で定義済みの前提
	}
	return c, nil // 見つかった値を返す
}

// TestGetCharacter は go test が自動で見つけて実行するテスト関数（Test で始まり *testing.T を受ける）。
func TestGetCharacter(t *testing.T) {
	// モックに1件だけ用意し、それを差し込んだハンドラを組み立てる。
	h := NewHandler(&mockStore{chars: map[int64]Character{
		1: {ID: 1, Name: "Aris", School: "Millennium"}, // id=1 のデータ
	}})

	// mux に登録して {id} を解決させる。
	mux := http.NewServeMux()                       // ルータを作り
	mux.HandleFunc("GET /characters/{id}", h.Get)   // パス変数 {id} 付きで割り当てる

	// テーブル駆動テスト：入力と期待値の組を無名構造体のスライスに並べる。
	cases := []struct {
		name       string // サブテスト名（どのケースか分かる）
		path       string // 叩くパス
		wantStatus int    // 期待する HTTP ステータス
		wantName   string // 期待する名前（空文字なら本文検証を省く）
	}{
		{"存在するID", "/characters/1", http.StatusOK, "Aris"},           // 200 が返るはず
		{"存在しないID", "/characters/999", http.StatusNotFound, ""},      // 404 が返るはず
		{"数値でないID", "/characters/abc", http.StatusBadRequest, ""},    // 400 が返るはず
	}

	for _, tc := range cases { // 各ケース tc を順に処理
		// t.Run でサブテスト化。名前が付き、1件落ちても他は続行できる。
		t.Run(tc.name, func(t *testing.T) {
			// NewRequest で疑似リクエストを作る（第3引数 nil はリクエストボディ無し）。
			req := httptest.NewRequest(http.MethodGet, tc.path, nil)
			rec := httptest.NewRecorder() // レスポンスを記録する擬似 ResponseWriter

			mux.ServeHTTP(rec, req) // ハンドラを実行（rec に結果が書き込まれる）

			if rec.Code != tc.wantStatus { // 記録されたステータスが期待と違えば
				// Fatalf はこのサブテストを即中断（以降を実行しない）。
				t.Fatalf("status = %d, want %d", rec.Code, tc.wantStatus)
			}
			if tc.wantName != "" { // 本文検証が必要なケースだけ中身も確認
				var got Character // デコード先
				// レスポンス本文の JSON を Character にデコード。&got で書き込み先を渡す。
				if err := json.NewDecoder(rec.Body).Decode(&got); err != nil {
					t.Fatalf("JSON デコード失敗: %v", err)
				}
				if got.Name != tc.wantName { // 名前が期待と違えば
					// Errorf は記録するが中断はしない（%q は値を引用符付きで表示）。
					t.Errorf("name = %q, want %q", got.Name, tc.wantName)
				}
			}
		}) // t.Run の終わり
	} // for ループの終わり
}`}</Code>
      <p>テストを実行します。<Cmd>./...</Cmd> は全パッケージ、<Cmd>-v</Cmd> は各テストの詳細表示です。</p>
      <Code lang="bash" filename="ターミナル">{`go test ./... -v  # ./... = 全パッケージ、-v = 各テストの詳細を表示`}</Code>
      <Code lang="text" filename="実行結果">{`=== RUN   TestGetCharacter
=== RUN   TestGetCharacter/存在するID
=== RUN   TestGetCharacter/存在しないID
=== RUN   TestGetCharacter/数値でないID
--- PASS: TestGetCharacter (0.00s)
    --- PASS: TestGetCharacter/存在するID (0.00s)
    --- PASS: TestGetCharacter/存在しないID (0.00s)
    --- PASS: TestGetCharacter/数値でないID (0.00s)
PASS
ok      github.com/yourname/character-api/internal/api  0.004s`}</Code>
      <Figure
        src="/learn/shots/api-practice/testing-and-postgres-01.svg"
        alt="go test ./... -v を実行し、サブテストがすべて PASS した画面"
        caption="サブテスト名が日本語でそのまま並ぶので、どのケースが通ったか一目で分かる"
      />
      <Callout variant="info" title="モックの代わりに :memory: SQLite でも良い">
        SQL まで含めて確かめたいときは、モックの代わりに<strong>インメモリ SQLite</strong>を使えます。
        <Cmd>sql.Open("sqlite", ":memory:")</Cmd> で開けば、テストごとにまっさらな DB がメモリ上に作られ、
        終了時に自動で消えます（ファイルもロックも残らない）。「ハンドラのロジックだけ」ならモック、「クエリまで通したい」なら :memory: と使い分けます。
      </Callout>

      <Section>なぜ PostgreSQL へ移行するのか</Section>
      <p>
        SQLite は1ファイルで完結し、セットアップ不要で開発には最高です。しかし<strong>書き込みは事実上1つずつ</strong>（データベース全体をロック）で、
        複数プロセス・複数サーバーから同時に書き込む本番構成には向きません。アクセスが増え、API を複数インスタンスで動かす段になると、
        <strong>クライアント・サーバー型</strong>の PostgreSQL が有力な選択肢になります。
      </p>
      <ComparisonTable
        headers={["観点", "SQLite", "PostgreSQL"]}
        rows={[
          ["形態", "組み込み（1ファイル）", "独立したサーバープロセス"],
          ["同時書き込み", "苦手（DB 全体をロック）", "得意（行レベルロック・MVCC）"],
          ["スケール", "単一マシン向き", "複数サーバー・大規模向き"],
          ["セットアップ", "不要（ファイルだけ）", "サーバー起動・接続設定が要る"],
          ["向く場面", "開発・小規模・組み込み", "本番・高並行・チーム運用"],
        ]}
      />
      <p>
        うれしいのは、Go の <Cmd>database/sql</Cmd> が<strong>DB を抽象化</strong>してくれる点です。ドライバとクエリの方言を差し替えれば、
        ハンドラや大半のロジックは<strong>ほぼ無変更</strong>で移行できます。
      </p>

      <Section>Docker Compose で Postgres を起動する</Section>
      <p>
        ローカルに Postgres を直接入れなくても、Docker で1コマンド起動できます。プロジェクト直下に <Cmd>compose.yaml</Cmd> を置きます。
      </p>
      <Code lang="yaml" filename="compose.yaml">{`services:                # 起動するコンテナ群の定義
  db:                    # db という名前のサービス（1コンテナ）
    image: postgres:16   # 使うイメージ（PostgreSQL 16 公式）
    environment:         # コンテナに渡す環境変数（初期ユーザーやDBを作る）
      POSTGRES_USER: chara      # 作成する DB ユーザー名
      POSTGRES_PASSWORD: secret # そのパスワード
      POSTGRES_DB: characters   # 初期作成するデータベース名
    ports:
      - "5432:5432"        # ホストの5432をコンテナへ
    volumes:
      - pgdata:/var/lib/postgresql/data   # データを永続化
    healthcheck:                          # コンテナが「使える状態か」を判定する設定
      test: ["CMD-SHELL", "pg_isready -U chara -d characters"] # 接続受付できるか確認するコマンド
      interval: 3s       # 3秒ごとにチェック
      timeout: 3s        # 1回のチェックの制限時間
      retries: 10        # 10回連続失敗で unhealthy 扱い

volumes:                 # 名前付きボリューム（データの保存先）の宣言
  pgdata:                # 上で参照した pgdata を定義`}</Code>
      <Code lang="bash" filename="ターミナル">{`docker compose up -d          # バックグラウンドで起動
docker compose ps            # 状態確認（healthy になるまで少し待つ）`}</Code>
      <Figure
        src="/learn/shots/api-practice/testing-and-postgres-02.svg"
        alt="docker compose ps で db コンテナが healthy と表示された画面"
        caption="STATUS が healthy になるまで待つ。ここを飛ばすと Ping が失敗する"
      />
      <Callout variant="warn" title="起動直後は接続できないことがある">
        コンテナが立ち上がっても、Postgres が接続を受け付けるまでに数秒かかります。起動直後に <Cmd>sql.Open</Cmd> して
        <Cmd>db.Ping()</Cmd> するとエラーになることがあるので、上のように <Cmd>healthcheck</Cmd> を入れて <Cmd>healthy</Cmd> を待つか、
        アプリ側で <strong>数回リトライ</strong>してから諦める作りにします。<Cmd>sql.Open</Cmd> 自体は接続を張らない（遅延接続）ため、
        実際の疎通は <Cmd>Ping</Cmd> で確かめます。
      </Callout>

      <Section>ドライバを切り替える</Section>
      <p>
        SQLite では <Cmd>modernc.org/sqlite</Cmd>（ドライバ名 <Cmd>"sqlite"</Cmd>）を使っていました。Postgres では
        <Cmd>github.com/jackc/pgx/v5/stdlib</Cmd> を<strong>ブランクインポート</strong>し、<Cmd>sql.Open("pgx", dsn)</Cmd> で開きます。
        <Cmd>database/sql</Cmd> の API はそのままなので、<Cmd>Query</Cmd> や <Cmd>Exec</Cmd> の呼び出しコードは変わりません。
      </p>
      <Code lang="bash" filename="ターミナル">{`go get github.com/jackc/pgx/v5  # pgx ドライバを依存に追加（go.mod / go.sum を更新）`}</Code>
      <Code lang="go" filename="internal/store/store.go（接続部分）">{`import (
	"database/sql" // DB 共通 API（sql.Open など）
	"os"           // 環境変数を読む os.Getenv 用

	_ "github.com/jackc/pgx/v5/stdlib" // ドライバ登録（ブランクインポート）
) // アンダースコア _ は「名前は使わないが副作用（init でのドライバ登録）だけ欲しい」の意味

// OpenPostgres は Postgres への接続プールを開いて返す関数。
func OpenPostgres() (*sql.DB, error) {
	// 接続情報は環境変数から。コードに秘密を埋め込まない。
	dsn := os.Getenv("DATABASE_URL") // 接続文字列（DSN）を環境変数から取得
	db, err := sql.Open("pgx", dsn) // ← ドライバ名を "pgx" に（この時点では未接続）
	if err != nil { // ドライバ名の間違いなど設定段階の失敗
		return nil, err
	}
	if err := db.Ping(); err != nil { // 実際に疎通確認（ここで初めて接続を試す）
		return nil, err
	}
	return db, nil // 疎通確認できた接続プールを返す
}`}</Code>
      <p>DSN（接続文字列）はこの形です。環境変数 <Cmd>DATABASE_URL</Cmd> に入れて渡します。</p>
      <Code lang="text" filename="DSN の例">{`postgres://chara:secret@localhost:5432/characters?sslmode=disable`}</Code>

      <Section>SQL 方言の差を吸収する</Section>
      <p>
        <Cmd>database/sql</Cmd> は API を統一してくれますが、<strong>SQL 文そのものの方言</strong>までは変換しません。
        SQLite と Postgres では、プレースホルダや自動採番の書き方が違います。ここだけは手で直します。
      </p>
      <ComparisonTable
        headers={["項目", "SQLite", "PostgreSQL"]}
        rows={[
          ["プレースホルダ", "? （位置指定）", "$1, $2 …（番号指定）"]              ,
          ["自動採番の主キー", "INTEGER PRIMARY KEY", "GENERATED ALWAYS AS IDENTITY（または SERIAL）"],
          ["UPSERT", "INSERT OR REPLACE", "INSERT ... ON CONFLICT ... DO UPDATE"],
          ["真偽値", "0 / 1（INTEGER 代用）", "BOOLEAN（true / false）"],
          ["自動採番の取得", "res.LastInsertId()", "INSERT ... RETURNING id を SELECT で受ける"],
        ]}
      />
      <p>スキーマ（テーブル定義）を Postgres 向けに書き直します。</p>
      <Code lang="sql" filename="migrations/postgres.sql">{`CREATE TABLE IF NOT EXISTS characters (          -- characters テーブルを作成（既にあれば何もしない）
    id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- 自動採番の主キー（Postgres 流の書き方）
    name   TEXT    NOT NULL,                      -- 名前列。NULL 禁止
    school TEXT    NOT NULL,                      -- 学校列。NULL 禁止
    rarity INTEGER NOT NULL                       -- レア度（整数）。NULL 禁止
);                                                -- テーブル定義の終わり`}</Code>
      <p>
        クエリ側は、プレースホルダを <Cmd>?</Cmd> から <Cmd>$1, $2</Cmd> に変えます。ハンドラ層は <Cmd>store</Cmd> のメソッドを呼ぶだけなので、
        <strong>変更は store 内の SQL 文字列に閉じます</strong>。
      </p>
      <Code lang="go" filename="internal/store/store.go（クエリの方言差）">{`// SQLite ではこう書いていた：
//   row := db.QueryRow("SELECT id, name, school, rarity FROM characters WHERE id = ?", id)
//   （SQLite のプレースホルダは ? の位置指定）

// Postgres では ? を $1 に変えるだけ。呼び出し側のコードは同じ。
row := db.QueryRow( // 1行取得。QueryRow は Query と違い高々1行前提
	// Postgres は番号付きプレースホルダ。$1 に第2引数の id が入る。
	"SELECT id, name, school, rarity FROM characters WHERE id = $1", id,
) // db.QueryRow 呼び出しの終わり`}</Code>
      <SubSection>データ移行（seed）— シードを Postgres 向けに流用する</SubSection>
      <p>
        既存の投入スクリプト（seed）を Postgres 向けに直します。UPSERT は <Cmd>ON CONFLICT</Cmd> で表現し、
        <Cmd>EXCLUDED</Cmd> で「今回 INSERT しようとした値」を参照します。何度流しても同じ結果になる（冪等）ので安全です。
      </p>
      <Code lang="sql" filename="seed.sql（Postgres 版）">{`INSERT INTO characters (id, name, school, rarity)  -- characters に指定4列を挿入する
VALUES                                             -- 挿入する行を列挙
    (1, 'Aris',  'Millennium', 3),                 -- 1件目のデータ
    (2, 'Hoshino', 'Abydos',   3)                  -- 2件目のデータ
ON CONFLICT (id) DO UPDATE                         -- id が衝突（既存）したら挿入せず更新する
  SET name   = EXCLUDED.name,                      -- EXCLUDED = 今回挿入しようとした値。name を上書き
      school = EXCLUDED.school,                    -- school を上書き
      rarity = EXCLUDED.rarity;                    -- rarity を上書き（＝何度流しても同じ結果＝冪等）`}</Code>
      <Code lang="bash" filename="ターミナル">{`# コンテナの psql に流し込む
# exec -T = 起動中の db コンテナ内で psql を実行、< で seed.sql を標準入力から流す
docker compose exec -T db psql -U chara -d characters < seed.sql`}</Code>
      <Figure
        src="/learn/shots/api-practice/testing-and-postgres-03.svg"
        alt="psql で移行後の characters テーブルを SELECT して中身を確認している画面"
        caption="投入後に psql で中身を確認する。SQLite のときと同じ行が入っていれば移行成功"
      />

      <Section>移行後の全体像とデプロイの勘所</Section>
      <FlowChain
        nodes={[
          { label: "ハンドラ", sub: "無変更", variant: "alt" },
          { label: "database/sql", sub: "共通 API" },
          { label: "pgx ドライバ", sub: "差し替え", variant: "cta" },
          { label: "Postgres", sub: "コンテナ" },
        ]}
        caption="変わるのはドライバと SQL 方言だけ。ハンドラ層は抽象の内側で守られる"
      />
      <p>本番へ出すときに押さえる最小限は次のとおりです。</p>
      <KVList
        items={[
          { key: "接続情報は環境変数", val: "DATABASE_URL で DSN を渡す。パスワードをコードやリポジトリに置かない" },
          { key: "ヘルスチェック", val: "GET /healthz で db.Ping() を返し、ロードバランサ・監視から死活を確認できるようにする" },
          { key: "単一バイナリ配布", val: "go build で1つの実行ファイルにまとまる。ランタイム不要で持ち運びやすい" },
          { key: "環境ごとの設定", val: "開発は :memory: / SQLite、本番は Postgres と、DSN の切り替えだけで差し替える" },
        ]}
      />
      <Code lang="go" filename="ヘルスチェックエンドポイント">{`// GET /healthz を無名関数（その場で書くハンドラ）として登録する。
mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // JSON を返すと宣言（WriteHeader より前に）
	if err := db.Ping(); err != nil { // DB へ疎通できるか確認。失敗＝DB が落ちている
		w.WriteHeader(http.StatusServiceUnavailable) // 503
		// []byte(...) で文字列をバイト列に変換して本文へ書き込む（逆引用符は生文字列で " をそのまま書ける）。
		w.Write([]byte(\`{"status":"down"}\`))
		return // ここで終了（下の ok は書かない）
	}
	w.Write([]byte(\`{"status":"ok"}\`)) // 疎通できたら 200（既定）で ok を返す
}) // HandleFunc 呼び出しの終わり`}</Code>
      <Code lang="bash" filename="ビルドと起動">{`go build -o character-api .   # 単一の実行ファイル character-api を生成
# 行末の \\ は「次の行へ続く」の意味。環境変数 DATABASE_URL を与えてから実行する。
DATABASE_URL="postgres://chara:secret@localhost:5432/characters?sslmode=disable" \\
  ./character-api            # ビルドしたバイナリを起動`}</Code>

      <Section>つまずきポイント</Section>
      <Callout variant="warn" title="方言・接続・待ち・テストの汚染に注意">
        <ul>
          <li><strong>プレースホルダの方言違い</strong>：<Cmd>?</Cmd> のまま Postgres に投げると <Cmd>syntax error at or near "?"</Cmd> で落ちます。<Cmd>$1, $2</Cmd> に直します。</li>
          <li><strong>接続文字列のミス</strong>：ユーザー名・パスワード・DB 名・ポートのどれか1つでも <Cmd>compose.yaml</Cmd> と食い違うと接続できません。<Cmd>sslmode=disable</Cmd> の付け忘れもローカルではよくある原因です。</li>
          <li><strong>起動待ちを飛ばす</strong>：<Cmd>docker compose up -d</Cmd> の直後にアプリを起動すると、Postgres がまだ受け付けておらず <Cmd>Ping</Cmd> が失敗します。<Cmd>healthy</Cmd> を待つかリトライを入れます。</li>
          <li><strong>テストで本番 DB を汚す</strong>：テストの向き先を本番の <Cmd>DATABASE_URL</Cmd> にすると、実データを壊しかねません。テストは<strong>モックか :memory: SQLite、あるいは使い捨てのテスト用コンテナ</strong>に隔離します。</li>
        </ul>
      </Callout>

      <Bridge course="ソフトウェア工学（テスト・依存性逆転）／ データベース論（DBMS の違い・トランザクション分離）／ DevOps（コンテナ・環境ごとの構成）">
        store をインターフェースにしてモックを差し込む形は、講義で学ぶ<strong>依存性逆転（DIP）</strong>と<strong>テスト容易性</strong>の実例です。
        「使う側が抽象を定義し、具体は後から差し替える」——だから本番 DB なしでハンドラを検証できます。
        SQLite と Postgres の比較は、データベース論の<strong>並行制御・トランザクション分離</strong>（行ロック・MVCC）の話が、
        そのまま「同時書き込みに強いか」という実務判断に効いてくる場面。そして Docker Compose での起動・環境変数による構成切り替えは、
        <strong>DevOps</strong> でいう「環境ごとに同じアプリを別設定で動かす」実践そのものです。
      </Bridge>

      <Quiz
        question="SQLite で動いていた SELECT 文を Postgres に移したら syntax error になりました。まず疑うべきは？"
        options={[
          <>Go のバージョンが古い</>,
          <>プレースホルダが <Cmd>?</Cmd> のままで、Postgres の <Cmd>$1, $2</Cmd> 形式になっていない</>,
          <><Cmd>database/sql</Cmd> パッケージが Postgres に非対応</>,
          <>テーブル名を大文字にしていない</>,
        ]}
        answer={1}
        explanation={<><Cmd>database/sql</Cmd> は API を統一しますが SQL 文の方言までは変換しません。SQLite の <Cmd>?</Cmd> を Postgres の <Cmd>$1, $2</Cmd> に直す必要があります。ドライバ（pgx）と <Cmd>database/sql</Cmd> は Postgres に対応しています。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "httptest.NewRequest / NewRecorder でサーバー起動なしにハンドラを検証。ケースは []struct を t.Run で回すテーブル駆動が定番",
          "store をインターフェース化（利用側に定義）し、モックや :memory: SQLite を差し込む＝依存性逆転でテスト容易に",
          "SQLite は開発・小規模向き、Postgres は同時書き込み・スケール・本番向き。移行は Docker Compose で起動できる",
          "database/sql の抽象のおかげでハンドラ層はほぼ無変更。変えるのはドライバ（pgx / sql.Open(\"pgx\", dsn)）と SQL 方言だけ",
          "方言の差：? → $1,$2 / INTEGER PRIMARY KEY → GENERATED ... AS IDENTITY / INSERT OR REPLACE → ON CONFLICT DO UPDATE",
          "デプロイは DSN を環境変数で渡し、GET /healthz で死活確認、単一バイナリで配布。テストは本番 DB を汚さない",
        ]}
      />
    </>
  );
}

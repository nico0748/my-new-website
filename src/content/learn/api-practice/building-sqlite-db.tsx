import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "building-sqlite-db",
  title: "SQLite データベースを構築する",
  description: "ピュア Go の SQLite ドライバ modernc.org/sqlite を導入し、共通スキーマでテーブルとインデックスを作成する。前章で選んだデータ源（SchaleDB の JSON か自前 CSV）を読み込み、トランザクションと INSERT OR REPLACE で冪等にデータを一括投入するシードスクリプトを実装し、実行・件数確認・つまずき対処まで確認する。",
  domain: "api-practice",
  section: "database",
  order: 2,
  level: "basic",
  tags: ["SQLite", "database/sql", "シード"],
  updated: "2026-07-07",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        共通スキーマと構造体は決まりました。この記事では実際に <strong>SQLite のデータベースファイルを作り、データを投入</strong>します。
        まずピュア Go の SQLite ドライバ <Cmd>modernc.org/sqlite</Cmd> を導入し、テーブルとインデックスを作成。
        続いて前章で選んだデータ源（SchaleDB の JSON か自前 CSV）を読み、<strong>トランザクション</strong>と
        <Cmd>INSERT OR REPLACE</Cmd> で<strong>冪等に</strong>一括投入する<strong>シードスクリプト</strong>を書きます。
        実行して「N 件投入しました」が出れば、API に載せるデータの準備は完了です。
      </Lead>

      <Section>なぜ SQLite を選ぶのか</Section>
      <p>
        キャラクターデータのような<strong>読み取り中心・小〜中規模</strong>のデータに、SQLite はよく合います。
        理由はシンプルさです。
      </p>
      <KVList
        items={[
          { key: "サーバ不要", val: "PostgreSQL や MySQL のような常駐プロセスが要らない。DB は 1 つのファイル" },
          { key: "ファイル1個", val: "data/characters.db を配るだけで DB ごと持ち運べる。バックアップもコピーで済む" },
          { key: "SQL がそのまま使える", val: "標準的な SQL が書ける。学んだクエリは PostgreSQL 等へも応用が効く" },
          { key: "移行しやすい", val: "小さく始めて、規模が大きくなったら PostgreSQL へ移す（このコースの終盤で扱う）" },
        ]}
      />
      <Callout variant="info" title="database/sql とドライバの関係">
        Go の <Cmd>database/sql</Cmd> は<strong>DB 共通の窓口（インターフェース）</strong>で、実際に SQLite と話す部分は
        <strong>ドライバ</strong>という別パッケージが担います。<Cmd>database/sql</Cmd> の使い方を覚えれば、ドライバを差し替えるだけで
        別の DB にも移れる——という設計です。今回はそのドライバに <Cmd>modernc.org/sqlite</Cmd> を選びます。
      </Callout>

      <Section>手順1 — SQLite ドライバを導入する</Section>
      <p>
        プロジェクトのルートで、ドライバを取得します。<strong>modernc.org/sqlite</strong> は
        <strong>ピュア Go 実装（cgo 不要）</strong>のドライバで、C コンパイラ（gcc）がなくてもビルドできるのが利点です。
      </p>
      <Code lang="bash" filename="ターミナル">{`go get modernc.org/sqlite # SQLite ドライバを依存に追加して取得する`}</Code>
      <p>取得すると <Cmd>go.mod</Cmd> に依存が追記され、<Cmd>go.sum</Cmd>（チェックサム）も更新されます。</p>
      <Code lang="text" filename="期待される出力（例）">{`go: downloading modernc.org/sqlite v1.34.1
go: added modernc.org/sqlite v1.34.1`}</Code>
      <Callout variant="warn" title="cgo 版（mattn/go-sqlite3）との取り違えに注意">
        SQLite ドライバには、もう一つ有名な <Cmd>github.com/mattn/go-sqlite3</Cmd> があります。こちらは C ライブラリを呼ぶ
        <strong>cgo 版</strong>で、ビルドに <strong>gcc（C コンパイラ）</strong>が必要です（環境によっては <Cmd>CGO_ENABLED=1</Cmd> の設定も）。
        <strong>ドライバ名も違います</strong>——modernc 版は <Cmd>"sqlite"</Cmd>、mattn 版は <Cmd>"sqlite3"</Cmd>。このコースは
        <strong>gcc 不要でハマりにくい modernc 版（ドライバ名 <Cmd>"sqlite"</Cmd>）</strong>で統一します。
      </Callout>

      <Section>手順2 — スキーマファイルを用意する</Section>
      <p>
        前章で決めた共通スキーマを、<Cmd>data/schema.sql</Cmd> というファイルに保存します（投入スクリプトから読み込んで実行します）。
        <Cmd>IF NOT EXISTS</Cmd> を付けておくと、すでに作成済みでもエラーにならず、<strong>何度実行しても安全</strong>になります。
      </p>
      <Code lang="sql" filename="data/schema.sql">{`CREATE TABLE IF NOT EXISTS characters ( -- characters テーブルを作成（既にあれば作らない＝何度でも安全）
  id           INTEGER PRIMARY KEY, -- 主キー。行を一意に識別する整数
  name         TEXT NOT NULL,       -- 名前。NOT NULL で空を禁止
  school       TEXT,                -- 所属学校（文字列）
  club         TEXT,                -- 部活
  star_grade   INTEGER,             -- 星の数（整数）
  squad_type   TEXT,                -- 部隊タイプ
  tactic_role  TEXT,                -- 戦術ロール
  position     TEXT,                -- ポジション
  bullet_type  TEXT,                -- 弾種
  armor_type   TEXT,                -- 装甲種
  weapon_type  TEXT,                -- 武器種
  age          TEXT,                -- 年齢
  birthday     TEXT,                -- 誕生日
  attack_power INTEGER,             -- 攻撃力（整数）
  max_hp       INTEGER,             -- 最大HP（整数）
  profile      TEXT                 -- 紹介文
); -- テーブル定義の終わり

CREATE INDEX IF NOT EXISTS idx_characters_school      ON characters(school);      -- school 列で検索を速くする索引
CREATE INDEX IF NOT EXISTS idx_characters_tactic_role ON characters(tactic_role); -- tactic_role 列の検索用索引`}</Code>
      <p>
        投入するデータファイルも <Cmd>data/</Cmd> に置きます。選択肢Aなら SchaleDB の <Cmd>students.json</Cmd> を、
        選択肢Bなら自前の <Cmd>characters.csv</Cmd> を <Cmd>data/</Cmd> に配置します。
      </p>

      <Section>手順3 — シードスクリプトを書く（選択肢A：JSON）</Section>
      <p>
        <Cmd>scripts/seed/main.go</Cmd> に、DB を作ってデータを流し込むスクリプトを書きます。本番サーバとは別の、
        <strong>使い捨てのプログラム</strong>です。流れは「DB を開く → スキーマ適用 → JSON を読む → トランザクションで一括 INSERT」です。
      </p>
      <Code lang="go" filename="scripts/seed/main.go">{`package main // 実行可能なシードプログラム

import ( // 使うパッケージ群
	"database/sql"  // DB 共通の窓口（インターフェース）
	"encoding/json" // JSON のデコード
	"fmt"           // 画面出力（Printf）
	"log"           // エラー時のログ＆終了（log.Fatal）
	"os"            // ファイル読み込みなどOS機能

	_ "modernc.org/sqlite" // ドライバを副作用 import で登録（"sqlite" が使えるようになる。頭の _ は名前を使わず読み込むだけ）
)

// SchaleDB の students.json をデコードするための構造体。
// JSON のキー（Id, Name ...）に合わせてタグを付ける。
type schaleStudent struct { // type X struct{...} ＝ JSON 1件分をまとめる構造体の定義
	ID                  int    \`json:"Id"\`                  // JSON の Id をこのフィールドに対応させる（逆引用符で囲む中身は構造体タグ）
	Name                string \`json:"Name"\`                // 名前
	School              string \`json:"School"\`              // 所属学校
	Club                string \`json:"Club"\`                // 部活
	StarGrade           int    \`json:"StarGrade"\`           // 星の数（数値）
	SquadType           string \`json:"SquadType"\`           // 部隊タイプ
	TacticRole          string \`json:"TacticRole"\`          // 戦術ロール
	Position            string \`json:"Position"\`            // ポジション
	BulletType          string \`json:"BulletType"\`          // 弾種
	ArmorType           string \`json:"ArmorType"\`           // 装甲種
	WeaponType          string \`json:"WeaponType"\`          // 武器種
	CharacterAge        string \`json:"CharacterAge"\`        // 年齢
	Birthday            string \`json:"Birthday"\`            // 誕生日
	AttackPower1        int    \`json:"AttackPower1"\`        // 攻撃力（数値）
	MaxHP1              int    \`json:"MaxHP1"\`              // 最大HP（数値）
	ProfileIntroduction string \`json:"ProfileIntroduction"\` // 紹介文
} // 構造体定義の終わり

func main() { // プログラムの起点
	// 1) DB ファイルを開く（無ければ作られる）。ドライバ名は "sqlite"
	db, err := sql.Open("sqlite", "data/characters.db") // 第1引数がドライバ名、第2がDBファイルのパス
	if err != nil { // 開けなければ
		log.Fatal(err) // ログを出して即終了
	} // if の終わり
	defer db.Close() // main を抜けるとき DB を閉じる（defer で遅延実行）

	// 2) スキーマを適用（CREATE TABLE / INDEX）
	schemaSQL, err := os.ReadFile("data/schema.sql") // スキーマ定義ファイルを丸ごと読む
	if err != nil { // 読めなければ
		log.Fatal("schema.sql が読めません: ", err) // メッセージ付きで終了
	} // if の終わり
	if _, err := db.Exec(string(schemaSQL)); err != nil { // 読んだSQLを実行（byte列をstringに変換して渡す。第1戻り値は使わず _）
		log.Fatal("スキーマ適用に失敗: ", err) // 失敗なら終了
	} // if の終わり

	// 3) students.json を読み、構造体スライスにデコード
	raw, err := os.ReadFile("data/students.json") // JSON ファイルを丸ごと読む
	if err != nil { // 読めなければ
		log.Fatal("students.json が読めません: ", err) // 終了
	} // if の終わり
	var students []schaleStudent // デコード先＝schaleStudent のスライス（可変長の配列）を宣言
	if err := json.Unmarshal(raw, &students); err != nil { // JSON を students に流し込む（&students でアドレスを渡す）
		log.Fatal("JSON デコードに失敗: ", err) // 失敗なら終了
	} // if の終わり

	// 4) トランザクションで一括 INSERT（途中で失敗したら全部やり直し）
	tx, err := db.Begin() // トランザクション開始。以降の書き込みは Commit まで確定しない
	if err != nil { // 開始に失敗したら
		log.Fatal(err) // 終了
	} // if の終わり

	// プレースホルダ ? で値を渡す（SQL インジェクション対策にもなる）。
	// INSERT OR REPLACE で、同じ id は上書き＝何度流しても重複しない（冪等）。
	stmt, err := tx.Prepare(\`INSERT OR REPLACE INTO characters
		(id, name, school, club, star_grade, squad_type, tactic_role, position,
		 bullet_type, armor_type, weapon_type, age, birthday, attack_power, max_hp, profile)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`) // tx.Prepare はSQL文を事前コンパイルして使い回せる形にする
	if err != nil { // 準備に失敗したら
		tx.Rollback() // ここまでを取り消し
		log.Fatal(err) // 終了
	} // if の終わり
	defer stmt.Close() // 関数終了時に準備した文を閉じる

	for _, s := range students { // range で students を1件ずつ取り出す（インデックスは不要なので _）
		_, err := stmt.Exec( // 準備済みの文に値を当てて実行（? の順に対応。第1戻り値は使わず _）
			s.ID, s.Name, s.School, s.Club, s.StarGrade, s.SquadType, s.TacticRole, s.Position, // 前半8列
			s.BulletType, s.ArmorType, s.WeaponType, s.CharacterAge, s.Birthday, // 中間5列
			s.AttackPower1, s.MaxHP1, s.ProfileIntroduction, // 後半3列
		) // stmt.Exec の終わり
		if err != nil { // 1件でも失敗したら
			tx.Rollback() // 1 件でも失敗したら、この投入をまるごと取り消す
			log.Fatal("INSERT に失敗: ", err) // 終了
		} // if の終わり
	} // for ループの終わり

	// 5) すべて成功したら確定
	if err := tx.Commit(); err != nil { // Commit で全INSERTをまとめて確定
		log.Fatal(err) // 確定に失敗したら終了
	} // if の終わり

	fmt.Printf("%d 件投入しました\\n", len(students)) // 投入件数を表示（%d に件数、末尾 \\n は改行）
}`}</Code>
      <SubSection>ここで押さえる 4 つのポイント</SubSection>
      <KVList
        items={[
          { key: "_ import", val: '_ "modernc.org/sqlite" は「使わないが読み込む」宣言。これでドライバ "sqlite" が登録される' },
          { key: "プレースホルダ ?", val: "値を直接文字列連結せず ? で渡す。安全で、Prepare した文を使い回せて速い" },
          { key: "トランザクション", val: "Begin → 全 INSERT → Commit。途中失敗は Rollback で全取り消し（中途半端に入らない）" },
          { key: "INSERT OR REPLACE", val: "同じ id があれば上書き。何度実行しても件数が二重にならない＝冪等" },
        ]}
      />

      <Section>選択肢B：CSV から投入する版</Section>
      <p>
        自前データ（CSV）を選んだ場合は、読み込み部分だけを差し替えます。<Cmd>encoding/csv</Cmd> で行を読み、
        数値の列（星・攻撃力・HP）は <Cmd>strconv.Atoi</Cmd> で <Cmd>int</Cmd> に変換してから、
        <strong>同じ <Cmd>stmt.Exec</Cmd></strong> に渡します（4 のトランザクション部分は共通です）。
      </p>
      <Code lang="go" filename="scripts/seed/main.go（読み込み部分を CSV 版に）">{`import ( // CSV 版で追加・変更する import
	"encoding/csv" // CSV の読み込み
	"strconv"      // 文字列→数値の変換
	// ... database/sql, fmt, log, os と _ "modernc.org/sqlite" は同じ
)

// data/characters.csv を読む（1 行目はヘッダーなので読み飛ばす）
f, err := os.Open("data/characters.csv") // CSV ファイルを開く（読み込み用のファイルハンドル）
if err != nil { // 開けなければ
	log.Fatal(err) // 終了
} // if の終わり
defer f.Close() // 関数終了時にファイルを閉じる

rows, err := csv.NewReader(f).ReadAll() // 全行を一気に読み、[][]string（行×列）で受け取る
if err != nil { // 読み込み失敗なら
	log.Fatal(err) // 終了
} // if の終わり

for _, row := range rows[1:] { // 先頭のヘッダー行を除く（rows[1:] は2行目以降のスライス）
	id, _ := strconv.Atoi(row[0])   // 0列目（id）を文字列→int に変換（第2戻り値のエラーは無視）
	star, _ := strconv.Atoi(row[4]) // 4列目（星）を int に変換
	atk, _ := strconv.Atoi(row[13]) // 13列目（攻撃力）を int に変換
	hp, _ := strconv.Atoi(row[14])  // 14列目（HP）を int に変換

	_, err := stmt.Exec( // JSON版と同じ準備済み文に値を渡して実行
		id, row[1], row[2], row[3], star, row[5], row[6], row[7], // 前半：数値化した id/star と、文字列のままの列
		row[8], row[9], row[10], row[11], row[12], atk, hp, row[15], // 後半：残りの列と数値化した atk/hp
	) // stmt.Exec の終わり
	if err != nil { // 失敗したら
		tx.Rollback() // この投入をまるごと取り消す
		log.Fatal(err) // 終了
	} // if の終わり
} // for ループの終わり`}</Code>
      <Callout variant="tip" title="どちらの版でも DB の中身は同じ形になる">
        JSON 版でも CSV 版でも、最終的に <Cmd>characters</Cmd> テーブルに入る<strong>行の形は完全に同じ</strong>です。
        だから次章以降（HTTP サーバから DB を読む部分）は、どちらを選んだ人も同一のコードで進められます。
      </Callout>

      <Section>手順4 — 実行してデータを投入する</Section>
      <p>プロジェクトのルートで、シードを実行します。<Cmd>go run ./scripts/seed</Cmd> は「そのフォルダのプログラムを実行」の意味です。</p>
      <Code lang="bash" filename="ターミナル">{`go run ./scripts/seed # scripts/seed フォルダのプログラムをビルドして実行（シード投入）`}</Code>
      <p>次のように件数が表示されれば成功です（SchaleDB の全生徒を入れた場合の一例。実データの件数は取得時期で変わります）。</p>
      <Code lang="text" filename="期待される出力">{`194 件投入しました`}</Code>
      <Figure
        src="/learn/shots/api-practice/building-sqlite-db-01.svg"
        alt="go run ./scripts/seed を実行し、投入件数が表示された画面"
        caption="シードの実行結果。2回続けて流しても件数が変わらないことも合わせて確認する"
      />
      <p>これで <Cmd>data/characters.db</Cmd> にデータが入りました。<strong>もう一度同じコマンドを実行</strong>しても、<Cmd>INSERT OR REPLACE</Cmd> のおかげで件数は二重になりません（冪等）。</p>

      <Section>手順5 — 投入結果を確認する（任意）</Section>
      <p>
        <Cmd>sqlite3</Cmd> コマンド（CLI）が入っていれば、DB を直接のぞいて確認できます（入っていなくても、次章でサーバ経由で確認できるので必須ではありません）。
      </p>
      <Code lang="bash" filename="ターミナル">{`sqlite3 data/characters.db # sqlite3 CLI で対象DBファイルを開く（対話プロンプトが起動）`}</Code>
      <p>対話プロンプトが開いたら、テーブル一覧・スキーマ・件数・先頭数件を確認します。</p>
      <Code lang="sql" filename="sqlite3 プロンプト内で実行">{`.tables -- テーブル一覧を表示（sqlite3 のドットコマンド）
-- => characters

.schema characters -- characters テーブルの定義（CREATE 文）を表示
-- => CREATE TABLE characters ( ... ) と INDEX 定義が表示される

SELECT COUNT(*) FROM characters; -- COUNT(*) で全行数を数える。FROM は対象テーブル
-- => 194

SELECT id, name, school, tactic_role FROM characters LIMIT 5; -- 4列を取り出し LIMIT 5 で先頭5件だけ表示
-- => 10000|Aru|Gehenna|DamageDealer  ... のように5件

.quit -- sqlite3 を終了する`}</Code>
      <Figure
        src="/learn/shots/api-practice/building-sqlite-db-02.svg"
        alt="sqlite3 の対話プロンプトで .tables と SELECT を実行した画面"
        caption="sqlite3 CLI で中身を直接のぞいたところ。件数と先頭数件が期待どおりか確かめる"
      />
      <Callout variant="warn" title="よくあるつまずき">
        <ul>
          <li><strong>sql: unknown driver "sqlite" (forgotten import?)</strong>：ドライバの副作用 import <Cmd>_ "modernc.org/sqlite"</Cmd> を書き忘れています。エラー文の「forgotten import?」がそのままヒントです。</li>
          <li><strong>unable to open database file</strong>：<Cmd>data/</Cmd> フォルダが存在しないと、その中に DB ファイルを作れません。先に <Cmd>mkdir data</Cmd> でフォルダを作ります。</li>
          <li><strong>cannot find package / go.sum エラー</strong>：<Cmd>go get modernc.org/sqlite</Cmd> を実行し忘れているか、モジュールのルート外で実行しています。ルートで <Cmd>go mod tidy</Cmd> を試します。</li>
          <li><strong>ドライバ名の取り違え</strong>：<Cmd>sql.Open("sqlite3", ...)</Cmd> と書くと modernc 版では失敗します。modernc は <Cmd>"sqlite"</Cmd>（末尾に 3 が付かない）です。</li>
          <li><strong>students.json が読めない</strong>：ファイルを <Cmd>data/</Cmd> に置いたか、実行しているカレントディレクトリがプロジェクトのルートかを確認します（相対パス <Cmd>data/...</Cmd> はルート基準）。</li>
        </ul>
      </Callout>

      <Bridge course="データベース論（トランザクション・ACID）">
        シードで使った <Cmd>Begin → Commit / Rollback</Cmd> は、講義で学ぶ<strong>トランザクション</strong>そのものです。
        トランザクションは <strong>ACID</strong> の性質を持ちます——とりわけ<strong>原子性（Atomicity）</strong>：
        「全部成功」か「全部なかったことにする」の二択で、<strong>中途半端な状態を残さない</strong>。
        194 件の投入中に 100 件目で失敗しても、<Cmd>Rollback</Cmd> で 99 件分ごとなかったことにできます。
        もし 1 件ずつ即コミットしていたら、途中まで入った不完全な DB が残ってしまいます。
        さらに、まとめて 1 トランザクションにすると<strong>ディスク書き込みが一括化されて高速</strong>——正しさと速さの両方に効くのがトランザクションです。
      </Bridge>

      <Quiz
        question="シードスクリプトを2回続けて実行しても、キャラクターの件数が二重にならないのはなぜ？"
        options={[
          <>SQLite が自動で重複を検知して消すから</>,
          <>2 回目の実行は Go がスキップするから</>,
          <><Cmd>INSERT OR REPLACE</Cmd> により、同じ id の行は新規追加ではなく上書きされるから（冪等）</>,
          <>トランザクションを使っているから重複しない</>,
        ]}
        answer={2}
        explanation={<><Cmd>INSERT OR REPLACE</Cmd> は、主キー（id）が既存の行と衝突したとき、追加せず既存行を置き換えます。よって同じデータを何度流しても件数は増えません（＝冪等）。トランザクションは「全部入る/全部取り消す」を保証するもので、重複防止そのものは担いません。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "ドライバは modernc.org/sqlite（ピュア Go・cgo 不要・gcc 不要）。ドライバ名は \"sqlite\"、sql.Open(\"sqlite\", \"data/characters.db\")",
          "_ \"modernc.org/sqlite\" の副作用 import を忘れると sql: unknown driver \"sqlite\" になる",
          "schema.sql をプログラムから Exec してテーブル・インデックスを作成（IF NOT EXISTS で安全）",
          "シードは Begin → プレースホルダ ? で一括 INSERT → Commit。失敗時は Rollback で全取り消し（原子性）",
          "INSERT OR REPLACE で冪等に。go run ./scripts/seed を何度流しても件数は二重にならない",
        ]}
      />
    </>
  );
}

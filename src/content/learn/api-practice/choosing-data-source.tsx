import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Figure, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "choosing-data-source",
  title: "データソースを選ぶ — SchaleDB か自前データか",
  description: "API に載せるデータを決める。既製の SchaleDB（ブルーアーカイブのオープンデータ）を使う道と、自分の好きなデータを用意する道の2択を提示し、どちらを選んでも以降のコードが変わらないよう「共通スキーマ」に載せる設計を示す。SchaleDB の JSON フィールド → DB 列の対応表、CREATE TABLE、Go の Character 構造体をここで正式に定義する。",
  domain: "api-practice",
  section: "database",
  order: 1,
  level: "basic",
  tags: ["データベース", "設計", "SchaleDB"],
  updated: "2026-07-07",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        サーバの骨格はできました。次に決めるのは<strong>「どんなデータを返すか」</strong>です。このコースでは
        <strong>2 つの道</strong>を用意します——既製の <strong>SchaleDB</strong>（ブルーアーカイブのオープンデータ）を使う道と、
        <strong>自分の好きなデータ</strong>（アニメ・ゲーム・自作）を用意する道。カギは、どちらを選んでも
        <strong>「共通スキーマ（表の形）」に載せる</strong>こと。テーブルの形を固定しておけば、データ源が違っても以降の SQL・ハンドラ・JSON 整形のコードは
        まったく同じで済みます。この記事で、その<strong>共通スキーマと Go の構造体を正式に定義</strong>します。
      </Lead>

      <Section>この記事のゴール</Section>
      <KVList
        items={[
          { key: "ゴール①", val: "データ源として SchaleDB か自前データかを選べる（判断材料を得る）" },
          { key: "ゴール②", val: "以降ずっと使う共通スキーマ（CREATE TABLE）を確定させる" },
          { key: "ゴール③", val: "スキーマに 1 対 1 で対応する Go の Character 構造体を手に入れる" },
          { key: "設計思想", val: "「スキーマを固定し、データ源を差し替え可能にする」— これが今回の肝" },
        ]}
      />

      <Section>設計の核 — スキーマを固定し、データ源を差し替える</Section>
      <p>
        アプリ開発でありがちな失敗は、特定のデータの形（JSON の構造や CSV の列順）に、コード全体が引きずられることです。
        データ源が変わった瞬間に、SQL もハンドラも書き直し——では応用が効きません。そこで今回は、
        <strong>間に「共通スキーマ」という一枚の壁</strong>を置きます。
      </p>
      <FlowChain
        nodes={[
          { label: "データ源", sub: "SchaleDB / 自前", variant: "alt" },
          { label: "変換", sub: "投入スクリプト" },
          { label: "共通スキーマ", sub: "characters テーブル" },
          { label: "API", sub: "以降は共通", variant: "cta" },
        ]}
        caption="データ源ごとに違うのは「変換（投入）」の部分だけ。共通スキーマから先は、どちらを選んでも同じコード"
      />
      <p>
        つまり、<strong>データ源ごとに変わるのは「投入スクリプト」だけ</strong>。DB にいったん共通の形で入ってしまえば、
        SQL も、それを受ける Go の構造体も、返す JSON も、選択肢に関わらず一本化できます。まずは 2 つの選択肢を見比べましょう。
      </p>

      <Section>選択肢A — SchaleDB のデータを使う</Section>
      <p>
        <strong>SchaleDB</strong> は、ブルーアーカイブのゲームデータを公開しているオープンデータプロジェクトです。
        GitHub リポジトリ <Cmd>github.com/SchaleDB/SchaleDB</Cmd> の中に、生徒（キャラクター）データの JSON があります。
        英語版は次のパスです。
      </p>
      <Code lang="text" filename="SchaleDB リポジトリ内のパス">{`SchaleDB/
└── data/
    └── en/
        └── students.json    ← これを使う（英語版の生徒データ）`}</Code>
      <Figure
        src="/learn/shots/api-practice/choosing-data-source-01.svg"
        alt="SchaleDB の data/en/students.json をエディタで開いた画面"
        caption="実物の students.json。1件あたりのフィールド数と、配列であることを目で確かめておく"
      />
      <p>
        <Cmd>students.json</Cmd> は、生徒オブジェクトが並んだ<strong>配列</strong>です。1 件あたりのフィールドは非常に多い（数十個）のですが、
        今回の API で使うのは<strong>主要フィールドだけ</strong>。それらを共通スキーマの列にどう対応させるかを、下の表で確定させます。
      </p>
      <ComparisonTable
        headers={["JSON フィールド", "型", "DB 列（共通スキーマ）"]}
        rows={[
          [<Cmd>Id</Cmd>, "number", <Cmd>id</Cmd>],
          [<Cmd>Name</Cmd>, "string", <Cmd>name</Cmd>],
          [<Cmd>School</Cmd>, "string", <Cmd>school</Cmd>],
          [<Cmd>Club</Cmd>, "string", <Cmd>club</Cmd>],
          [<Cmd>StarGrade</Cmd>, "number", <Cmd>star_grade</Cmd>],
          [<Cmd>SquadType</Cmd>, "string", <Cmd>squad_type</Cmd>],
          [<Cmd>TacticRole</Cmd>, "string", <Cmd>tactic_role</Cmd>],
          [<Cmd>Position</Cmd>, "string", <Cmd>position</Cmd>],
          [<Cmd>BulletType</Cmd>, "string", <Cmd>bullet_type</Cmd>],
          [<Cmd>ArmorType</Cmd>, "string", <Cmd>armor_type</Cmd>],
          [<Cmd>WeaponType</Cmd>, "string", <Cmd>weapon_type</Cmd>],
          [<Cmd>CharacterAge</Cmd>, "string", <Cmd>age</Cmd>],
          [<Cmd>Birthday</Cmd>, "string", <Cmd>birthday</Cmd>],
          [<Cmd>AttackPower1</Cmd>, "number", <Cmd>attack_power</Cmd>],
          [<Cmd>MaxHP1</Cmd>, "number", <Cmd>max_hp</Cmd>],
          [<Cmd>ProfileIntroduction</Cmd>, "string", <Cmd>profile</Cmd>],
        ]}
      />
      <p>実データのイメージを掴むため、この 5 体を例として本コース全体で使います（値は SchaleDB の主要フィールドから抜粋）。</p>
      <Code lang="json" filename="students.json（抜粋・5体のイメージ）">{`[
  { "Id": 10000, "Name": "Aru",    "School": "Gehenna",    "Club": "Kohshinjo68",   "StarGrade": 3,
    "SquadType": "Main", "TacticRole": "DamageDealer", "Position": "Back",
    "BulletType": "Explosion", "ArmorType": "LightArmor", "WeaponType": "SR",
    "CharacterAge": "16 years old", "Birthday": "March 12th",
    "AttackPower1": 369, "MaxHP1": 2236 },
  { "Id": 10001, "Name": "Eimi",   "School": "Millennium", "Club": "SPTF",          "StarGrade": 3,
    "SquadType": "Main", "TacticRole": "Tanker",       "Position": "Front",
    "BulletType": "Explosion", "ArmorType": "LightArmor", "WeaponType": "SG",
    "CharacterAge": "15 years old", "Birthday": "May 1st",
    "AttackPower1": 113, "MaxHP1": 3066 },
  { "Id": 10002, "Name": "Haruna", "School": "Gehenna",    "Club": "GourmetClub",   "StarGrade": 3,
    "SquadType": "Main", "TacticRole": "DamageDealer", "Position": "Back",
    "BulletType": "Mystic", "ArmorType": "HeavyArmor", "WeaponType": "SR",
    "CharacterAge": "17 years old", "Birthday": "March 1st",
    "AttackPower1": 374, "MaxHP1": 2188 },
  { "Id": 10003, "Name": "Hifumi", "School": "Trinity",    "Club": "RemedialClass", "StarGrade": 3,
    "SquadType": "Main", "TacticRole": "Supporter",    "Position": "Middle",
    "BulletType": "Pierce", "ArmorType": "LightArmor", "WeaponType": "AR",
    "CharacterAge": "16 years old", "Birthday": "November 27th",
    "AttackPower1": 195, "MaxHP1": 2250 },
  { "Id": 10004, "Name": "Hina",   "School": "Gehenna",    "Club": "Fuuki",         "StarGrade": 3,
    "SquadType": "Main", "TacticRole": "DamageDealer", "Position": "Back",
    "BulletType": "Explosion", "ArmorType": "HeavyArmor", "WeaponType": "MG",
    "CharacterAge": "17 years old", "Birthday": "February 19th",
    "AttackPower1": 254, "MaxHP1": 2258 }
]`}</Code>
      <Callout variant="warn" title="ライセンス・利用範囲は各自で確認">
        SchaleDB のデータやゲームのアセットには、それぞれの権利元・ライセンスがあります。<strong>学習目的でローカルに取り込んで動かす</strong>分には手軽ですが、
        公開サービスとして配信する場合は、SchaleDB のリポジトリや原作の利用規約を必ず確認してください。判断に迷うなら、次の選択肢B（自前データ）が安全です。
      </Callout>

      <Section>選択肢B — 自分の好きなデータを使う</Section>
      <p>
        ブルーアーカイブに馴染みがなければ、<strong>自分の好きな題材</strong>（他のアニメ・ゲームのキャラ、自作の設定、なんでも）で構いません。
        ポイントは<strong>「同じ共通スキーマに載せる」</strong>こと。手元で用意しやすい <strong>CSV</strong> か <strong>JSON</strong> に、次の列を並べれば OK です。
      </p>
      <Code lang="text" filename="data/characters.csv（最小例・自前データ）">{`id,name,school,club,star_grade,squad_type,tactic_role,position,bullet_type,armor_type,weapon_type,age,birthday,attack_power,max_hp,profile
1,アカリ,桜ヶ丘学園,園芸部,3,Main,DamageDealer,Back,Explosion,LightArmor,SR,16,4月2日,340,2100,花と爆発をこよなく愛する
2,ミオ,桜ヶ丘学園,生徒会,2,Main,Tanker,Front,Pierce,HeavyArmor,SG,17,9月8日,120,3200,前線を守る頼れる盾
3,ソラ,青凪高校,天文部,3,Support,Healer,Middle,Mystic,LightArmor,AR,15,12月24日,180,2400,星を数えるのが得意`}</Code>
      <p>
        列名（ヘッダー）が共通スキーマと揃っていれば、値は自由です。<strong>星の数値・攻撃力・HP は数値</strong>、それ以外は文字列で入れます。
        次章では、この CSV を読んで DB に流し込むスクリプトも短く示します。
      </p>
      <Callout variant="info" title="どちらを選んでも、この先のコードは同じ">
        選択肢A（SchaleDB の JSON）でも B（自前 CSV）でも、<strong>DB に入った後の形（characters テーブル）は同一</strong>です。
        だから、SQL・ハンドラ・JSON レスポンスを扱うこの先の章は、<strong>どちらを選んだ人も一字一句同じコード</strong>で進められます。
        違うのは次章の「投入スクリプト」の読み込み部分だけです。
      </Callout>

      <Section>共通スキーマを定義する（CREATE TABLE）</Section>
      <p>
        いよいよ、このコースの背骨となる<strong>共通スキーマ</strong>を確定します。SQLite のテーブル定義は次の通りです。
        主キー・<Cmd>NOT NULL</Cmd> 制約・検索用のインデックスまで、この時点で決め切ります。
      </p>
      <Code lang="sql" filename="data/schema.sql">{`CREATE TABLE characters (               -- characters という名前のテーブルを作成する
  id           INTEGER PRIMARY KEY,   -- 主キー（一意・NULL 不可）
  name         TEXT NOT NULL,         -- 名前は必須
  school       TEXT,                  -- 所属学校（TEXT＝文字列型）
  club         TEXT,                  -- 部活
  star_grade   INTEGER,               -- レア度（星の数）
  squad_type   TEXT,                  -- 部隊種別
  tactic_role  TEXT,                  -- 戦術ロール（役割）
  position     TEXT,                  -- 立ち位置
  bullet_type  TEXT,                  -- 攻撃属性
  armor_type   TEXT,                  -- 装甲種別
  weapon_type  TEXT,                  -- 武器種別
  age          TEXT,                  -- 年齢（文字列で保持）
  birthday     TEXT,                  -- 誕生日
  attack_power INTEGER,               -- 攻撃力（INTEGER＝整数型）
  max_hp       INTEGER,               -- 最大 HP（整数）
  profile      TEXT                   -- 紹介文（最後の列はカンマ不要）
);                                      -- テーブル定義の終わり

-- 絞り込み（?school= / ?role=）を速くするためのインデックス
CREATE INDEX idx_characters_school      ON characters(school);      -- school 列に索引を張り検索を速くする
CREATE INDEX idx_characters_tactic_role ON characters(tactic_role); -- tactic_role 列に索引を張り検索を速くする`}</Code>
      <KVList
        items={[
          { key: "PRIMARY KEY", val: "id を主キーに。1 行を一意に識別でき、重複と NULL を許さない" },
          { key: "NOT NULL", val: "name は必須。名前のないキャラは登録できない、という制約をDBに守らせる" },
          { key: "INTEGER / TEXT", val: "SQLite の型。数値の列（star_grade / attack_power / max_hp）は INTEGER、他は TEXT" },
          { key: "CREATE INDEX", val: "school と tactic_role で絞り込むので索引を張る。件数が増えたとき検索が速くなる" },
        ]}
      />

      <Section>Go の構造体を定義する（Character）</Section>
      <p>
        DB の 1 行を、Go では<strong>構造体</strong>で受け取ります。共通スキーマの各列と 1 対 1 で対応させ、
        <strong>構造体タグ</strong>（バッククォートで囲む <Cmd>{'json:"..."'}</Cmd>）で、JSON にしたときのキー名を指定します。
        DB 列は <Cmd>snake_case</Cmd>、Go のフィールドは <Cmd>PascalCase</Cmd>、JSON キーは <Cmd>camelCase</Cmd> と、
        3 つの命名規則をここで橋渡しします。
      </p>
      <Code lang="go" filename="internal/store/store.go">{`package store // このファイルが属するパッケージ名を宣言

// Character は characters テーブルの 1 行に対応する。
// バッククォート内の json タグが、JSON レスポンスでのキー名になる。
type Character struct { // type ... struct で構造体（複数フィールドをまとめた型）を定義
	ID          int    \`json:"id"\` // int は整数型。逆引用符内が構造体タグで JSON では id というキーになる
	Name        string \`json:"name"\` // string は文字列型。JSON キーは name
	School      string \`json:"school"\` // 所属学校。JSON キーは school
	Club        string \`json:"club"\` // 部活。JSON キーは club
	StarGrade   int    \`json:"starGrade"\` // レア度(星の数)。フィールドは PascalCase、JSON は camelCase の starGrade
	SquadType   string \`json:"squadType"\` // 部隊種別。JSON キーは squadType
	TacticRole  string \`json:"tacticRole"\` // 戦術ロール。JSON キーは tacticRole
	Position    string \`json:"position"\` // 立ち位置。JSON キーは position
	BulletType  string \`json:"bulletType"\` // 攻撃属性。JSON キーは bulletType
	ArmorType   string \`json:"armorType"\` // 装甲種別。JSON キーは armorType
	WeaponType  string \`json:"weaponType"\` // 武器種別。JSON キーは weaponType
	Age         string \`json:"age"\` // 年齢(文字列)。JSON キーは age
	Birthday    string \`json:"birthday"\` // 誕生日。JSON キーは birthday
	AttackPower int    \`json:"attackPower"\` // 攻撃力(整数)。JSON キーは attackPower
	MaxHP       int    \`json:"maxHp"\` // 最大 HP(整数)。JSON キーは maxHp
	Profile     string \`json:"profile"\` // 紹介文。JSON キーは profile
} // 構造体定義の終わり`}</Code>
      <SubSection>3 つの命名規則が対応する様子</SubSection>
      <ComparisonTable
        headers={["DB 列（snake_case）", "Go フィールド（PascalCase）", "JSON キー（camelCase）"]}
        rows={[
          [<Cmd>star_grade</Cmd>, <Cmd>StarGrade</Cmd>, <Cmd>starGrade</Cmd>],
          [<Cmd>tactic_role</Cmd>, <Cmd>TacticRole</Cmd>, <Cmd>tacticRole</Cmd>],
          [<Cmd>attack_power</Cmd>, <Cmd>AttackPower</Cmd>, <Cmd>attackPower</Cmd>],
          [<Cmd>max_hp</Cmd>, <Cmd>MaxHP</Cmd>, <Cmd>maxHp</Cmd>],
        ]}
      />
      <Callout variant="tip" title="タグを付けないとどうなるか">
        構造体タグを省くと、<Cmd>encoding/json</Cmd> は<strong>フィールド名をそのまま</strong>キーにします。つまり <Cmd>StarGrade</Cmd> や <Cmd>MaxHP</Cmd> という
        <strong>大文字始まりのキー</strong>で JSON に出てしまい、一般的な JS/TS 側の <Cmd>camelCase</Cmd> 慣習とズレます。
        タグで <Cmd>{'json:"starGrade"'}</Cmd> と明示することで、意図したキー名に固定できます（Go は先頭大文字＝公開フィールドしか JSON 化しない点にも注意）。
      </Callout>

      <Bridge course="データベース論（リレーショナルモデル・正規化）">
        いま決めた <Cmd>characters</Cmd> テーブルは、リレーショナルモデルの<strong>「関係（テーブル）＝行の集合、列＝属性」</strong>そのものです。
        <Cmd>PRIMARY KEY</Cmd> は各行を一意に識別する<strong>候補キー</strong>で、重複と NULL を禁じます。<Cmd>NOT NULL</Cmd> は
        <strong>ドメイン制約</strong>（取りうる値の範囲を DB に守らせる）の一種です。今回は 1 テーブルに全属性を持たせた
        <strong>非正規化寄り</strong>の素直な設計ですが、たとえば「学校（school）」を別テーブルに切り出して <Cmd>school_id</Cmd> で参照すれば、
        <strong>正規化</strong>（重複を排し、更新時の不整合を防ぐ）へ進めます。まずは 1 テーブルで動かし、必要になったら分割する——というのが実務の順序です。
      </Bridge>

      <Quiz
        question="「SchaleDB か自前データか、どちらを選んでも以降のコードが変わらない」——これを可能にしている設計上の工夫は？"
        options={[
          <>データ源ごとにハンドラを別々に用意しているから</>,
          <>共通スキーマ（characters テーブル）を固定し、データ源ごとに違うのは投入スクリプトだけにしているから</>,
          <>SchaleDB と自前データがまったく同じ JSON 構造だから</>,
          <>Go が JSON を自動で SQL に変換してくれるから</>,
        ]}
        answer={1}
        explanation={<>テーブルの形（スキーマ）を先に固定し、その形に「変換して入れる」部分だけをデータ源ごとに用意します。DB に入った後は同じ形なので、SQL・構造体・JSON 整形は一本化できます。SchaleDB の JSON と自前 CSV の構造は違いますが、投入時に共通スキーマへ揃えます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "データ源は2択：SchaleDB（data/en/students.json）を使うか、自前の CSV/JSON を用意するか",
          "肝は「共通スキーマを固定し、データ源を差し替え可能にする」設計。違うのは投入スクリプトだけ",
          "共通スキーマ：characters テーブル（id 主キー / name NOT NULL / 数値列は INTEGER / school・tactic_role に索引）",
          "Go の Character 構造体は各列と1対1。json タグ（バッククォート）で camelCase の JSON キーに橋渡しする",
          "SchaleDB を公開利用する場合はライセンス確認が必要。迷うなら自前データが安全",
        ]}
      />
    </>
  );
}

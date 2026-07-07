import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "database-basics",
  title: "データベースの基礎 — RDB と SQL",
  description: "アプリのデータを永続化する RDB の考え方と SQL の基本（CRUD・JOIN・キー・インデックス・トランザクション）を、実務の勘所とともに。",
  domain: "web",
  section: "backend",
  order: 11.5,
  level: "basic",
  tags: ["データベース", "SQL", "RDB"],
  updated: "2026-07-07",
  minutes: 12,
};

export default function Article() {
  return (
    <>
      <Lead>
        アプリを再起動してもデータが消えないのは、<strong>データベース</strong>に保存しているからです。もっとも広く使われるのが
        <strong>リレーショナルデータベース（RDB）</strong>で、操作には <strong>SQL</strong> という専用言語を使います。
        テーブル・CRUD・JOIN・キー・インデックス・トランザクションという「これだけは」を押さえます。
      </Lead>

      <Section>RDB とは — テーブル・行・列</Section>
      <p>
        RDB はデータを<strong>表（テーブル）</strong>で管理します。1 行（レコード）が 1 件のデータ、列（カラム）が項目です。
        表計算ソフトのシートに似ていますが、型・制約・関係を厳密に扱える点が違います。
      </p>
      <Code lang="text" filename="users テーブル（イメージ）">{`id | name  | email             | created_at
---+-------+-------------------+---------------------
 1 | Taro  | taro@example.com  | 2026-07-01 10:00:00
 2 | Hanako| hanako@example.com| 2026-07-02 09:30:00`}</Code>
      <p>
        アプリは「SQL を組み立てて RDBMS に送り、結果（行の集合）を受け取る」という流れでデータをやり取りします。
      </p>
      <FlowChain
        nodes={[
          { label: "アプリ", sub: "Node / Rails 等", variant: "alt" },
          { label: "SQL 発行", sub: "SELECT ..." },
          { label: "RDBMS", sub: "MySQL / PostgreSQL" },
          { label: "テーブル", sub: "結果を返す", variant: "cta" },
        ]}
        caption="アプリは SQL を通じてデータベースと対話する"
      />
      <KVList
        items={[
          { key: "MySQL", val: "世界で最も普及。Web で定番" },
          { key: "PostgreSQL", val: "高機能・拡張性。近年人気" },
          { key: "SQLite", val: "ファイル1つで動く軽量DB。学習・組み込み向き" },
        ]}
      />

      <Section>SQL の基本 — CRUD</Section>
      <p>
        データ操作は <strong>作成・読み取り・更新・削除</strong> の 4 つ（CRUD）に集約されます。それぞれ SQL の命令に対応します。
      </p>
      <ComparisonTable
        headers={["操作", "意味", "SQL"]}
        rows={[
          ["Create", "作成", "INSERT"],
          ["Read", "読み取り", "SELECT"],
          ["Update", "更新", "UPDATE"],
          ["Delete", "削除", "DELETE"],
        ]}
      />
      <Code lang="sql" filename="crud.sql">{`-- 読み取り: 条件・並び替え・件数制限
SELECT id, name FROM users
WHERE created_at >= '2026-07-01'
ORDER BY created_at DESC
LIMIT 10;

-- 作成
INSERT INTO users (name, email) VALUES ('Taro', 'taro@example.com');

-- 更新（WHERE を忘れると全行更新！）
UPDATE users SET name = 'Taro2' WHERE id = 1;

-- 削除
DELETE FROM users WHERE id = 2;`}</Code>
      <Callout variant="danger" title="WHERE の付け忘れは事故">
        <Cmd>UPDATE</Cmd> や <Cmd>DELETE</Cmd> で <Cmd>WHERE</Cmd> を忘れると、<strong>全行</strong>が更新・削除されます。
        本番で最も多い事故の一つ。実行前に <Cmd>SELECT</Cmd> で対象を確認する、トランザクションで囲む、などの習慣が大切です。
      </Callout>

      <Section>テーブルの関係 — キーと JOIN</Section>
      <p>
        RDB の強みは<strong>テーブル同士の関係（リレーション）</strong>を表せることです。各行を一意に識別する<strong>主キー（PRIMARY KEY）</strong>と、
        他テーブルの主キーを指す<strong>外部キー（FOREIGN KEY）</strong>で「1 対多」などの関係を作ります。
      </p>
      <Code lang="sql" filename="relation.sql">{`-- users(1) --- (多)posts : 1人のユーザーが複数の投稿を持つ
CREATE TABLE posts (
  id      INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),  -- 外部キー
  title   TEXT NOT NULL
);`}</Code>
      <p>
        複数テーブルにまたがる情報は <Cmd>JOIN</Cmd> でつなげて取得します。
      </p>
      <Code lang="sql" filename="join.sql">{`-- 投稿タイトルと、書いたユーザー名を一緒に取る
SELECT posts.title, users.name
FROM posts
JOIN users ON posts.user_id = users.id;`}</Code>
      <Callout variant="info" title="正規化：重複を避けて分割する">
        「ユーザー名を posts テーブルにも持つ」と、名前変更のたびに全投稿を直す必要が出ます。そこでデータを重複させず、
        関係で結ぶ<strong>正規化</strong>を行います。やりすぎると JOIN が増えて遅くなるため、実務では意図的に重複を持たせる
        <strong>非正規化</strong>とのバランスを取ります。
      </Callout>

      <Section>インデックス — 検索を速くする</Section>
      <p>
        テーブルが大きくなると、条件に合う行を探すのに時間がかかります。<strong>インデックス</strong>は「本の索引」のようなもので、
        特定の列での検索を劇的に速くします。ただし書き込みは少し遅くなり、容量も増えるため、<strong>よく検索する列に絞って</strong>張ります。
      </p>
      <Code lang="sql" filename="index.sql">{`-- email で頻繁に検索するなら索引を作る
CREATE INDEX idx_users_email ON users(email);`}</Code>

      <Bridge course="データベース論 / アルゴリズムとデータ構造">
        テーブルと主キー・外部キー・JOIN は、講義で学ぶ<strong>関係モデル（relational model）</strong>そのもの。SQL の <Cmd>SELECT</Cmd> は
        <strong>関係代数</strong>の射影・選択・結合に対応し、<Cmd>JOIN</Cmd> は集合の結合演算です。<strong>インデックス</strong>の正体は
        多くの場合 <strong>B 木（B-tree）</strong>で、全行を舐める <Cmd>O(n)</Cmd> の探索を <Cmd>O(log n)</Cmd> に落とします——
        まさにアルゴリズムの計算量が現場の応答速度に直結する例です。<strong>正規化</strong>も関数従属性という理論から導かれる、
        座学がそのまま設計指針になる分野です。
      </Bridge>

      <Section>トランザクション — 全部やるか、やらないか</Section>
      <p>
        送金のように「複数の更新がすべて成功して初めて意味がある」処理では、<strong>トランザクション</strong>で一連の操作をひとまとめにします。
        途中で失敗したら <Cmd>ROLLBACK</Cmd> で<strong>なかったこと</strong>にでき、中途半端な状態を防げます。
      </p>
      <Code lang="sql" filename="transaction.sql">{`BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;  -- 出金
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;  -- 入金
COMMIT;   -- 両方成功したら確定。途中で失敗したら ROLLBACK`}</Code>
      <KVList
        items={[
          { key: "Atomicity（原子性）", val: "全部成功か、全部なかったことにするか" },
          { key: "Consistency（一貫性）", val: "制約を保った状態から状態へ" },
          { key: "Isolation（分離性）", val: "同時実行しても互いに干渉しない" },
          { key: "Durability（永続性）", val: "コミットした結果は障害でも消えない" },
        ]}
      />

      <Callout variant="warn" title="SQL インジェクションに注意">
        ユーザー入力を文字列連結で SQL に埋め込むと、<strong>SQL インジェクション</strong>で改ざん・情報漏洩されます。
        必ず<strong>プレースホルダ（プリペアドステートメント）</strong>で値を渡します。多くのアプリでは、SQL を直接書かずに
        <strong>ORM</strong>（Prisma・TypeORM・Active Record など）を使い、この対策を含めて安全にデータを扱います。
      </Callout>
      <Code lang="js" filename="safe-query.js">{`// NG: 文字列連結（インジェクションの穴）
db.query("SELECT * FROM users WHERE email = '" + input + "'");

// OK: プレースホルダで値を渡す
db.query("SELECT * FROM users WHERE email = ?", [input]);`}</Code>

      <Quiz
        question={<><Cmd>UPDATE users SET name = 'X';</Cmd> を実行するとどうなる？</>}
        options={[
          <>id が最初の 1 行だけ更新される</>,
          <><Cmd>WHERE</Cmd> が無いので<strong>全行</strong>の name が 'X' になる</>,
          <>エラーになって何も起きない</>,
          <>新しい行が 1 件追加される</>,
        ]}
        answer={1}
        explanation={
          <>
            <Cmd>WHERE</Cmd> を書かない <Cmd>UPDATE</Cmd> は<strong>テーブルの全行</strong>が対象です。本番で頻発する事故なので、
            更新・削除では必ず条件を付け、不安なときはトランザクションで囲みましょう。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "RDB はデータを表（テーブル）で管理し、SQL で操作する",
          "基本は CRUD：INSERT / SELECT / UPDATE / DELETE。UPDATE・DELETE の WHERE 忘れは事故",
          "主キー・外部キーで関係を表し、JOIN で複数テーブルをつなぐ。重複を避けるのが正規化",
          "インデックス（多くは B木）で検索を O(n) → O(log n) に。張りすぎは書き込みを遅くする",
          "トランザクション（ACID）で「全部やるか、やらないか」を保証。入力はプレースホルダで SQLi 対策",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, TipBox, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "transaction",
  title: "トランザクション — データを壊さない仕組み",
  description: "「全部やるか、やらないか」を保証するトランザクション。ACID・同時実行で起きる異常・分離レベル・ロックとデッドロックまで、データを壊さないための基本を押さえる。",
  domain: "web",
  section: "backend",
  order: 11.6,
  level: "basic",
  tags: ["データベース", "トランザクション", "ACID"],
  updated: "2026-07-13",
  minutes: 12,
};

export default function Article() {
  return (
    <>
      <Lead>
        送金・在庫引き当て・ポイント加算——「複数の更新が<strong>すべて成功して初めて意味がある</strong>」処理は、1 つでも途中で失敗するとデータが壊れます。この「全部やるか、1 つも残さず取り消すか」をまとめて保証する単位が<strong>トランザクション</strong>です。データを壊さないための、もっとも基本的な仕組みです。
      </Lead>

      <Section>なぜ必要か — 「中途半端」が一番こわい</Section>
      <p>
        口座 A から口座 B へ 1000 円送る処理を考えます。これは「A から 1000 円引く」「B に 1000 円足す」という<strong>2 つの更新</strong>でできています。もし 1 つ目が成功した直後にサーバが落ちたら——A からはお金が消えたのに、B には届いていない。<strong>1000 円がこの世から消えます</strong>。
      </p>
      <p>
        怖いのは「全部失敗」ではなく、この<strong>中途半端な成功</strong>です。トランザクションは「2 つの更新を 1 つのかたまりとして扱い、途中で失敗したら<strong>両方なかったことにする</strong>」ことで、この状態を防ぎます。
      </p>
      <Code lang="sql" filename="送金をトランザクションで囲む">{`BEGIN;                                                       -- 開始
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;    -- 出金
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;    -- 入金
COMMIT;   -- ここで初めて確定。途中で失敗したら ROLLBACK で全部取り消し`}</Code>
      <KVList
        items={[
          { key: "BEGIN", val: "トランザクション開始。ここから先の変更はまだ「仮」" },
          { key: "COMMIT", val: "すべて成功。変更を確定する（ここで初めて他から見える）" },
          { key: "ROLLBACK", val: "どこかで失敗。開始時点まで巻き戻し、なかったことにする" },
        ]}
      />

      <Section>ACID — トランザクションが守る 4 つの約束</Section>
      <p>
        トランザクションが保証する性質は、頭文字を取って <strong>ACID</strong> と呼ばれます。
      </p>
      <ComparisonTable
        headers={["性質", "意味", "送金の例で言うと"]}
        rows={[
          ["Atomicity（原子性）", "全部成功か、全部取り消しか。中間はない", "出金と入金は必ずセットで成立/取消"],
          ["Consistency（一貫性）", "ルール（制約）を満たした状態から状態へ移る", "残高合計は前後で変わらない"],
          ["Isolation（分離性）", "同時に走る他の処理から干渉されない", "送金中の中途半端な残高を他人が見ない"],
          ["Durability（永続性）", "コミットした結果は障害でも消えない", "確定した送金は電源が落ちても残る"],
        ]}
      />
      <TipBox>
        4 つのうち、実務で理解が浅くなりがちなのが <strong>Isolation（分離性）</strong>です。1 人で使う分には問題が出ませんが、<strong>複数の処理が同時に同じデータを触る</strong>と、途端におかしな結果が起きます。ここを掘り下げます。
      </TipBox>

      <Section>同時実行で起きる異常</Section>
      <p>
        複数のトランザクションが同時に走ると、分離を怠った場合に次のような<strong>異常（アノマリー）</strong>が発生します。
      </p>
      <ComparisonTable
        headers={["異常", "何が起きる", "例"]}
        rows={[
          ["ダーティリード", "他の未確定（コミット前）の変更を読んでしまう", "取り消される予定の残高を見て判断してしまう"],
          ["反復不能読み取り", "同じ行を 2 回読むと値が変わっている", "処理の途中で他人が更新・確定した"],
          ["ファントムリード", "同じ条件で 2 回検索すると件数が変わる", "集計中に他人が行を追加した"],
          ["ロストアップデート", "2 人の更新が上書きし合い、片方が消える", "同時に在庫を減らし、1 回分しか引かれない"],
        ]}
      />
      <Callout variant="warn" title="ロストアップデートは一番身近な事故">
        「在庫を読む → 1 減らして書き戻す」を 2 人が同時にやると、両者とも「残り 10」を読み、両者とも「9」を書き込む。本来 8 になるはずが <strong>9</strong> になり、1 個分の引き当てが消えます。在庫・カウンタ・ポイントなど、<strong>読んで計算して書き戻す</strong>処理は要注意です。
      </Callout>

      <Section>分離レベル — 厳しさと速さのトレードオフ</Section>
      <p>
        どの異常まで許すかを段階で選べるのが<strong>分離レベル（Isolation Level）</strong>です。厳しくするほど安全ですが、待ち（ロック）が増えて<strong>遅く</strong>なります。安全性と性能のトレードオフを、要件に合わせて選びます。
      </p>
      <ComparisonTable
        headers={["分離レベル", "ダーティ", "反復不能", "ファントム", "速度"]}
        rows={[
          ["READ UNCOMMITTED", "起きる", "起きる", "起きる", "最速・最も危険"],
          ["READ COMMITTED", "防ぐ", "起きる", "起きる", "速い（多くの DB の既定）"],
          ["REPEATABLE READ", "防ぐ", "防ぐ", "（DBによる）", "中"],
          ["SERIALIZABLE", "防ぐ", "防ぐ", "防ぐ", "最も安全・最も遅い"],
        ]}
      />
      <p>
        <Cmd>SERIALIZABLE</Cmd> は「あたかも 1 つずつ順番（直列）に実行したのと同じ結果」を保証する最も強いレベルです。PostgreSQL は既定が <Cmd>READ COMMITTED</Cmd>、MySQL（InnoDB）は <Cmd>REPEATABLE READ</Cmd> と、DB によって既定が違う点も実務では要注意です。
      </p>
      <Code lang="sql" filename="分離レベルを指定する">{`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
-- 厳密な一貫性が要る処理
COMMIT;`}</Code>

      <Section>ロックとデッドロック</Section>
      <p>
        分離を実現する主な手段が<strong>ロック</strong>です。あるトランザクションが行を更新している間、他の処理をその行に対して待たせます。ロックには 2 つの考え方があります。
      </p>
      <KVList
        items={[
          { key: "悲観ロック（Pessimistic）", val: "先に鍵をかけて他を待たせる。競合が多い場面向き（SELECT ... FOR UPDATE）" },
          { key: "楽観ロック（Optimistic）", val: "鍵はかけず、更新時に version 列で「途中で変わっていないか」を確認。競合が少ない場面向き" },
        ]}
      />
      <Code lang="sql" filename="悲観ロック — 行を確保してから更新">{`BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;  -- この行をロック
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
COMMIT;`}</Code>
      <Callout variant="danger" title="デッドロック — お互いが相手のロック待ち">
        トランザクション X が行 A をロックして行 B を待ち、同時に Y が行 B をロックして行 A を待つと、<strong>両者が永遠に待ち合う</strong>のがデッドロックです。DB は検知して片方を強制的に <Cmd>ROLLBACK</Cmd> させます。予防策は「<strong>複数行を触る順番をアプリ全体で統一する</strong>」（常に id の小さい順にロックする、など）。
      </Callout>

      <Section>実務の勘所</Section>
      <Callout variant="tip" title="トランザクションは短く保つ">
        トランザクションを開いている間はロックを握り続け、他の処理を待たせます。<strong>ユーザー入力待ちや外部 API 呼び出しをトランザクションの中に入れない</strong>——数秒かかる HTTP 通信をロック中に挟むと、その間ずっと他が詰まります。必要な更新だけを素早く囲んで、すぐ COMMIT するのが鉄則です。
      </Callout>
      <p>
        多くのアプリでは SQL を直接書かず、<strong>ORM</strong>（Prisma・TypeORM・Active Record など）のトランザクション API を使います。書き方は変わっても「一連の処理をひとかたまりにし、失敗したら丸ごと巻き戻す」という本質は同じです。
      </p>
      <Code lang="js" filename="ORM でのトランザクション（Prisma の例）">{`await prisma.$transaction(async (tx) => {
  await tx.account.update({ where: { id: 1 }, data: { balance: { decrement: 1000 } } });
  await tx.account.update({ where: { id: 2 }, data: { balance: { increment: 1000 } } });
}); // コールバックが例外を投げたら自動で ROLLBACK`}</Code>

      <Bridge course="データベース論 / オペレーティングシステム（並行制御）">
        トランザクションの分離は、講義で学ぶ<strong>並行制御（concurrency control）</strong>そのものです。「同時に実行しても、何らかの直列順で実行したのと同じ結果になる」という<strong>直列化可能性（serializability）</strong>が理論上のゴールで、<Cmd>SERIALIZABLE</Cmd> はこれを保証します。ロックによる相互排他・デッドロックの検知と回避は、OS で学ぶ<strong>クリティカルセクション</strong>や<strong>デッドロックの 4 条件</strong>と地続きです。楽観ロックの version チェックは、いわば<strong>CAS（compare-and-swap）</strong>をデータベースの行に対して行っていると捉えられます。
      </Bridge>

      <Divider />

      <SubSection>データベースの基礎に戻る</SubSection>
      <p>
        テーブル・SQL・インデックスなど土台の話は「データベースの基礎 — RDB と SQL」章にまとまっています。あわせて読むと、トランザクションが「どのデータを守っているか」がよりはっきりします。
      </p>

      <KeyPoints
        items={[
          "トランザクションは「全部やるか、全部取り消すか」の単位。中途半端を防ぐ",
          "BEGIN → 更新 → COMMIT（確定）/ ROLLBACK（巻き戻し）が基本の流れ",
          "守る性質は ACID。実務で肝は Isolation（同時実行での干渉防止）",
          "同時実行の異常：ダーティ/反復不能/ファントム/ロストアップデート",
          "分離レベルで安全と速度を選ぶ。ロックはデッドロックに注意し、順番を統一する",
          "トランザクションは短く。外部 API 呼び出しを中に入れない",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "sql-injection",
  title: "SQL インジェクション — 入力が命令になるとき",
  description: "コードとデータの混同という根本原因から、種類（in-band / blind / OOB / second-order）、そしてプリペアドステートメントによる根本対策までを、危険な例と安全な例の対比で理解する。",
  domain: "security",
  section: "web-sec",
  order: 2,
  level: "basic",
  tags: ["SQLi", "インジェクション", "データベース", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>SQL インジェクション（SQLi）</strong>は、アプリがデータベースへ発行する SQL 文に、利用者の入力を無防備に混ぜ込むことで、攻撃者が<strong>クエリの構造そのものを書き換えられてしまう</strong>脆弱性です。長年 OWASP のインジェクション系の代表として挙げられ続けてきた、Web の古典にして最重要の一つです。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。動作する攻撃ペイロードは掲載しません。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>なぜ起きるのか — コードとデータの混同</Section>
      <p>
        SQL はデータベースへの命令言語です。本来、クエリの<strong>構造（コード）</strong>と、そこに埋め込む<strong>値（データ）</strong>ははっきり分かれているべきものです。ところが、次のように入力を文字列連結でクエリに埋め込むと、この境界が消えてしまいます。
      </p>
      <Code lang="sql" filename="危険な例（連結）">{`-- input をそのまま連結している
query = "SELECT * FROM users WHERE name = '" + input + "'";`}</Code>
      <p>
        利用者が名前欄にシングルクォートを含む値を入れると、開いていたクォートが途中で閉じられ、後続の文字が<strong>データではなくクエリ構造の一部</strong>として解釈されます。たとえば条件式が常に真になるような値を与えれば、WHERE 句の意味が変わり、本来 1 件も返らないはずの照合が全件一致になったりします。攻撃者は入力欄という「データの入口」から、クエリという「命令」に手を伸ばしているわけです。
      </p>
      <p>
        根本原因は一貫して「<strong>コードとデータの混同</strong>」です。入力から危険な文字を消す、といったフィルタリングは、抜け道が多く対症療法にとどまります。後述するように、値を最初から「データ」として分離して渡す仕組みこそが本筋です。
      </p>

      <Section>攻撃の入口はどこにでもある</Section>
      <p>
        入力点はフォームだけではありません。URL のクエリパラメータ、HTTP ヘッダ、Cookie、JSON ボディ——サーバが SQL の材料に使うものすべてが入口になり得ます。だからこそ「画面のバリデーションを通したから安全」という思い込みが危険なのです。バリデーションはクライアント側やアプリ手前で行われても、最終的に<strong>データベース層で安全に組み立てられていなければ</strong>意味がありません。
      </p>
      <FlowChain
        nodes={[
          { label: "入力点", sub: "フォーム/URL/Cookie" },
          { label: "アプリ", sub: "文字列連結でSQL構築", variant: "alt" },
          { label: "DB", sub: "構造が改変されたまま実行" },
          { label: "影響", sub: "認証回避・情報漏えい", variant: "cta" },
        ]}
        caption="入力が検証されないまま SQL 文へ連結され、構造ごと改変されて実行される"
      />

      <Section>SQLi の種類</Section>
      <p>
        攻撃結果を「どの経路で受け取るか」で分類すると、対策や検出の勘所が整理できます。
      </p>
      <ComparisonTable
        headers={["種類", "特徴", "結果の受け取り方"]}
        rows={[
          ["In-band（インバンド）", "攻撃と結果の取得が同じ通信路", "エラーメッセージ（error-based）や UNION で応答に直接返る"],
          ["Blind（ブラインド）", "応答にデータは返らない", "条件の真偽でページ挙動が変わる（boolean）／応答遅延（time-based）から 1 ビットずつ推測"],
          ["Out-of-band（OOB）", "別経路を使う", "DNS / HTTP など外部への通信でデータを抜き出す"],
          ["Second-order（二次）", "保存された値が後で悪用される", "いったん保存された入力が、別の処理で危険な文脈に再利用されて発火"],
        ]}
      />
      <Callout variant="warn" title="Second-order に注意">
        入力を保存する時点では無害に見えても、あとで別のクエリがその保存値を<strong>信頼して連結</strong>すると発火します。「入口で一度チェックしたから安全」とは限らず、値を SQL に使うすべての箇所で分離が必要だ、という教訓がここにあります。
      </Callout>

      <Section>影響 — なぜ致命的なのか</Section>
      <KVList
        items={[
          { key: "認証バイパス", val: "ログイン条件を書き換えてログインを回避する" },
          { key: "情報漏えい", val: "資格情報・個人情報・決済情報など全テーブルの機密データ" },
          { key: "改ざん・削除", val: "データの書き換えやレコードの消去" },
          { key: "RCE への発展", val: "DB のファイル操作機能などを介して OS コマンド実行にまで連鎖することもある" },
        ]}
      />

      <Section>根本対策 — プリペアドステートメント</Section>
      <p>
        最重要かつ第一の防御は<strong>プリペアドステートメント（パラメータ化クエリ）</strong>です。クエリの構造をあらかじめ確定させ、値は<strong>プレースホルダ経由でデータとして渡す</strong>——こうすると、値にどんな文字が入っていても構造は変わりません。境界が言語レベルで守られるため、フィルタの抜け道を心配する必要がなくなります。
      </p>
      <Code lang="javascript" filename="危険な書き方（連結）">{`// input が命令に化ける余地がある
const sql = "SELECT * FROM users WHERE name = '" + input + "'";
db.query(sql);`}</Code>
      <Code lang="javascript" filename="安全な書き方（プレースホルダ）">{`// 値は必ずプレースホルダで渡す = 常に「データ」
const sql = "SELECT * FROM users WHERE name = ?";
db.query(sql, [input]);`}</Code>
      <Callout variant="tip" title="ORM も同じ原理">
        多くの ORM やクエリビルダは、内部でパラメータ化を行うため既定で安全です。ただし <Cmd>whereRaw</Cmd> のような<strong>生 SQL 片に入力を混ぜる</strong>と、その部分だけ SQLi が復活します。ORM を使っていても「生 SQL に入力を連結していないか」は必ず確認してください。
      </Callout>
      <SubSection>多層防御として併用するもの</SubSection>
      <ul>
        <li><strong>最小権限の DB アカウント</strong> — アプリ用ユーザに DDL や管理権限を与えない。侵害時の被害を限定する。</li>
        <li><strong>入力検証（許可リスト方式）</strong> — 数値・列挙値のみを通す、といった多層防御。ただし単独では根本対策にならない。</li>
        <li><strong>エラーメッセージを利用者に返さない</strong> — DB のエラーからの情報漏えい（error-based）を防ぐ。</li>
        <li><strong>WAF</strong> — 補助的に配置する。根本対策の代替にはしない。</li>
      </ul>

      <Bridge course="データベース / オートマトン・形式言語">
        SQLi は、データベースの授業で習う<strong>クエリの構文解析</strong>と、形式言語で習う<strong>字句解析</strong>の境界の話そのものです。DB エンジンは受け取った文字列を字句に分解し、文法に従って構文木を組み立てて実行します。文字列連結は、この「字句の並び」に攻撃者が割り込む行為で、シングルクォートは<strong>文字列リテラルの終端トークン</strong>として解釈されるからこそ構造が壊れます。プリペアドステートメントは、構文木の形を先に固定し、値を<strong>葉のノード（リテラル）</strong>としてだけ差し込む——つまり「構造は不変、データだけ可変」を言語機構で保証する仕組みだと理解できます。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "根本原因はコードとデータの混同。フィルタリングは対症療法",
          "入口はフォームだけでなく URL・ヘッダ・Cookie・JSON すべて",
          "種類は in-band / blind / OOB / second-order。結果の受け取り方で分類",
          "第一防御はプリペアドステートメント。値をデータとして分離して渡す",
          "最小権限・入力検証・エラー抑制・WAF を多層防御として併用する",
        ]}
      />

      <Quiz
        question="SQL インジェクションの根本対策として最も適切なのはどれ？"
        options={[
          "入力からシングルクォートを削除する",
          "プリペアドステートメントで値をデータとして渡す",
          "WAF を導入してリクエストを検査する",
          "エラーメッセージを非表示にする",
        ]}
        answer={1}
        explanation="値をプレースホルダ経由で「データ」として渡すプリペアドステートメントが根本対策です。文字削除やエラー抑制・WAF は補助的な多層防御であり、単独では抜け道が残ります。"
      />
    </>
  );
}

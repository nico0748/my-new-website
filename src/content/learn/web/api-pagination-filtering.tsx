import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, Bridge, TipBox, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "api-pagination-filtering",
  title: "ページネーション・フィルタ・レート制限",
  description: "大量データを扱う API の必須テクニック。offset/cursor ページネーション、フィルタ・ソート、レート制限(429)の設計を押さえる。",
  domain: "web",
  section: "api",
  order: 4,
  level: "basic",
  tags: ["API", "設計", "パフォーマンス"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        「全件返す」API は、データが増えた瞬間に破綻します。大量データを安全に扱うには<strong>ページネーション</strong>で分割し、<strong>フィルタ</strong>で絞り、<strong>レート制限</strong>で守るのが定石です。実務で必須の 4 テクニックを押さえましょう。
      </Lead>

      <Section>ページネーション</Section>
      <p>一覧を一定件数ずつに区切って返します。方式は大きく 2 つ。offset 型とカーソル型を使い分けます。</p>

      <SubSection>offset / limit 型</SubSection>
      <p>「何件飛ばして何件返すか」を指定します。実装が簡単で「◯ページ目へ」というジャンプもできますが、大きな offset は DB が遅くなり、途中で挿入・削除が起きると<strong>ズレや重複</strong>が発生します。</p>
      <Code lang="text" filename="offset">{`GET /users?limit=20&offset=40    # 3 ページ目（40 件飛ばして 20 件）`}</Code>
      <Code lang="json" filename="offset response">{`{
  "data": [ /* 20 件 */ ],
  "pagination": {
    "total": 1240,
    "limit": 20,
    "offset": 40
  }
}`}</Code>

      <SubSection>カーソル型</SubSection>
      <p>「この位置の次から」を不透明なカーソル（前回の最後の要素を指す）で示します。offset のようなズレが起きず大規模データでも高速なため、無限スクロールや大量データの標準です。反面、任意ページへのジャンプはできません。</p>
      <Code lang="text" filename="cursor">{`GET /users?limit=20
GET /users?limit=20&cursor=eyJpZCI6NjB9   # nextCursor を次に渡す`}</Code>
      <Code lang="json" filename="cursor response">{`{
  "data": [ /* 20 件 */ ],
  "pagination": {
    "nextCursor": "eyJpZCI6ODB9",
    "hasMore": true
  }
}`}</Code>

      <ComparisonTable
        headers={["", "offset / limit", "カーソル型"]}
        rows={[
          ["任意ページへジャンプ", "できる", "できない"],
          ["大規模データの速度", "遅くなる", "速い"],
          ["挿入・削除でのズレ", "起きる", "起きない"],
          ["向く用途", "管理画面のページ送り", "無限スクロール・大量データ"],
        ]}
      />

      <SubSection>なぜ offset は遅く、カーソルは速いのか</SubSection>
      <p>
        「offset は大きくなると遅い」の正体は<strong>計算量</strong>です。<Cmd>OFFSET 100000 LIMIT 20</Cmd> は「先頭から 10 万件を数えて捨て、次の 20 件を返す」処理になり、捨てる件数に比例して重くなります。ページが後ろになるほど遅くなる、典型的な <strong>O(n)</strong> の走査です。
      </p>
      <Code lang="sql" filename="offset — O(offset) の走査">{`-- 10万件を数えて捨ててから 20 件返す（後ろのページほど遅い）
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 100000;`}</Code>
      <Code lang="sql" filename="cursor — インデックスで O(log n) 探索">{`-- 前回の最後の id を境界に、そこから 20 件だけ読む
SELECT * FROM users WHERE id > 100000 ORDER BY id LIMIT 20;`}</Code>
      <p>
        カーソル型は「<Cmd>id &gt; 前回の最後</Cmd>」という条件で、B 木インデックスの上を<strong>目的の位置へ直接降りて</strong>から 20 件を順に読みます。捨てる工程がないので、何ページ目でも速度が一定です。カーソルの正体は「次に読み始めるインデックス上の位置」なのです。
      </p>
      <Bridge course="アルゴリズムとデータ構造 / 計算量・木構造の探索">
        offset ページングの遅さは、配列を線形走査する <strong>O(n)</strong> と、カーソルが<strong>ソート済みインデックス（B 木）を二分探索的に降りる O(log n)</strong> の違いそのものです。授業で「線形探索より二分探索、そのために木構造を使う」と学んだ判断が、API のページング方式の選択に直結します。<strong>不透明カーソル</strong>（Base64 で ID を包んだ文字列）は、内部の探索位置を外に見せずに渡すための「イテレータの状態」——データ構造で習うイテレータ／カーソルの概念が、まさに同じ名前で API に現れます。
      </Bridge>
      <Bridge course="データベース / インデックス（B 木）・ソート">
        カーソル型が速い前提は「<Cmd>ORDER BY</Cmd> する列にインデックスが張ってある」ことです。DB の授業で習う B 木インデックスは、範囲条件 <Cmd>id &gt; x</Cmd> と順序取得 <Cmd>ORDER BY id</Cmd> の両方を効率化します。インデックスが無ければ DB は全件を並べ替える（コストの高いソート）ため、カーソル型でも速くなりません。<strong>「ページングの設計」と「インデックスの設計」は必ずセット</strong>——講義の索引理論が、そのまま API 性能の土台になります。
      </Bridge>

      <Section>フィルタ・ソート・検索のクエリ設計</Section>
      <p>絞り込み条件はクエリパラメータで表現します。フィールド名を素直にキーにするのが分かりやすく、複数条件は AND として重ねます。</p>
      <Code lang="text" filename="filter & sort">{`GET /orders?status=paid&minTotal=1000       # 複数フィルタ（AND）
GET /orders?sort=-createdAt,total           # 複合ソート（- は降順）
GET /orders?q=coffee                        # 全文検索
GET /orders?createdAt[gte]=2026-01-01       # 範囲は演算子を明示`}</Code>
      <Callout variant="tip" title="予測可能に保つ">
        フィルタ・ソート・ページングは <strong>URL を見ただけで挙動が分かる</strong>のが理想です。許可するソートキーやフィルタ項目はサーバ側でホワイトリスト化し、想定外のキーは無視するか 400 を返します。
      </Callout>

      <Section>レート制限</Section>
      <p>
        1 クライアントが短時間に大量のリクエストを送ると、サーバ全体が不安定になります。単位時間あたりの回数に上限を設け、超えたら <strong>429 Too Many Requests</strong> を返します。
      </p>
      <Code lang="http" filename="rate limit response">{`HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1751878800

{ "error": { "code": "RATE_LIMITED", "message": "リクエストが多すぎます" } }`}</Code>
      <ul>
        <li><Cmd>X-RateLimit-Limit</Cmd> — 期間内の上限回数</li>
        <li><Cmd>X-RateLimit-Remaining</Cmd> — 残り回数（成功レスポンスにも付けると親切）</li>
        <li><Cmd>X-RateLimit-Reset</Cmd> — 上限がリセットされる時刻</li>
        <li><Cmd>Retry-After</Cmd> — 何秒後に再試行してよいか</li>
      </ul>
      <Callout variant="warn" title="クライアント側の作法">
        429 を受けたら即座に再送せず、<Cmd>Retry-After</Cmd> の秒数だけ待ってからリトライします。指定がなければ指数バックオフ（待ち時間を倍々に伸ばす）で再試行します。
      </Callout>

      <SubSection>レート制限のアルゴリズム — トークンバケット / リーキーバケット</SubSection>
      <p>
        「単位時間に何回まで」をどう実装するか。素朴に「1 分ごとにカウンタをリセット」すると、境界をまたいで一気に叩かれる（バースト）問題が出ます。実務では次の 2 つのバケットモデルがよく使われます。
      </p>
      <KVList
        items={[
          { key: "トークンバケット", val: "一定レートでトークンを補充するバケツ。リクエストごとに 1 枚消費し、空なら 429。溜めておける分だけ短時間のバーストを許容できる" },
          { key: "リーキーバケット", val: "リクエストをキューに入れ、一定レートで漏れ出す（処理する）。出力レートが常に一定になり、下流を平滑化して守る" },
        ]}
      />
      <p>
        トークンバケットは「普段は静かだが時々まとめて叩く」正当な利用に優しく、リーキーバケットは「下流の処理速度を絶対に超えさせない」ことを優先します。上限とバースト許容量という 2 つのパラメータで、守りたい相手（サーバ全体か、特定の下流か）に合わせて調整します。
      </p>
      <Bridge course="ネットワーク / トラフィック制御・キューイング理論">
        トークンバケット／リーキーバケットは、ネットワークの授業で習う<strong>トラフィックシェーピング</strong>（回線の帯域制御）で登場するのと<strong>全く同じアルゴリズム</strong>です。ルータがパケットの送出レートを均す仕組みが、API サーバではリクエストレートを均す仕組みとして再利用されています。「バケツにトークンを補充する速度＝許容レート、バケツの深さ＝許容バースト」という抽象は、パケットでもリクエストでもそのまま成立します。<strong>キューイング理論</strong>で扱う到着率と処理率の関係が、429 をいつ返すかの設計判断そのものです。
      </Bridge>
      <TipBox>
        レート制限は分散環境だと途端に難しくなります。サーバが複数台あると各台がバラバラに数えてしまうため、Redis など共有ストアにカウンタ（またはトークン残量）を置いて全台で 1 つの上限を共有します。「複数プロセスから 1 つの共有状態を正しく更新する」——並行処理で習う排他制御・アトミック操作の出番です。
      </TipBox>

      <Section>部分レスポンス</Section>
      <p>
        必要なフィールドだけ返させると、転送量と処理を減らせます。<Cmd>fields</Cmd> で欲しい項目を指定させるのが定番です。
      </p>
      <Code lang="text" filename="partial response">{`GET /users?fields=id,name,avatarUrl    # 巨大な profile 等を省いて軽量化`}</Code>

      <Divider />

      <KeyPoints
        items={[
          "ページネーションは offset 型（ページ送り）とカーソル型（大量データ）を使い分ける",
          "カーソル型は挿入・削除でズレず大規模でも高速。無限スクロールの標準",
          "フィルタ・ソート・検索はクエリで表現し、許可キーをホワイトリスト化する",
          "上限超過は 429 で返し、Retry-After と X-RateLimit-* ヘッダで伝える",
          "429 は待ってからリトライ（指数バックオフ）",
          "fields で部分レスポンスにすると転送量を減らせる",
        ]}
      />
    </>
  );
}

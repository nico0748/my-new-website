import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "async-promise-await",
  title: "非同期処理 — Promise と async / await",
  description: "JavaScript の非同期処理を、コールバック → Promise → async/await の流れで理解する。並行実行・エラー処理・よくある落とし穴まで。",
  domain: "web",
  section: "frontend",
  order: 6.6,
  level: "basic",
  tags: ["JavaScript", "非同期", "Promise"],
  updated: "2026-07-07",
  minutes: 10,
};

export default function Article() {
  return (
    <>
      <Lead>
        API 通信・ファイル読み込み・タイマー——「結果が返るまで<strong>時間がかかる</strong>処理」を扱うのが
        <strong>非同期処理</strong>です。JavaScript はシングルスレッド（同時に 1 つずつ実行）なので、待ち時間の間も画面を固めないために、
        非同期の仕組みが欠かせません。<Cmd>Promise</Cmd> と <Cmd>async / await</Cmd> を軸に、読み書きの基礎を押さえます。
      </Lead>

      <Section>同期と非同期のちがい</Section>
      <p>
        <strong>同期</strong>は「上から順に、1 つ終わってから次へ」。途中に重い処理があると、その間ずっと<strong>止まって（ブロックして）</strong>しまいます。
        <strong>非同期</strong>は「時間のかかる処理を<strong>投げておき</strong>、待っている間に別の処理を進め、終わったら結果を受け取る」やり方です。
      </p>
      <StepFlow
        steps={[
          { title: "重い処理を開始（例: API リクエスト）", desc: "「終わったら教えて」と依頼だけして次へ進む" },
          { title: "待っている間、別の処理を実行", desc: "画面の操作なども止まらない" },
          { title: "処理が完了する", desc: "ネットワークやディスクから結果が返ってくる" },
          { title: "登録しておいた処理（コールバック）が呼ばれる", desc: "結果を使って続きを実行" },
        ]}
        caption="非同期処理の流れ：待つ間もブロックしない"
      />

      <Section>コールバックとその限界</Section>
      <p>
        もっとも素朴な非同期は<strong>コールバック</strong>（「終わったら呼んでね」と渡す関数）です。しかし処理を数珠つなぎにすると、
        入れ子が深くなり読みづらくなります。俗に<strong>コールバック地獄</strong>と呼ばれます。
      </p>
      <Code lang="js" filename="callback-hell.js">{`getUser(1, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // ネストが深くなり、エラー処理も追いにくい
      console.log(comments);
    });
  });
});`}</Code>

      <Section>Promise — 「いつか値になる箱」</Section>
      <p>
        <Cmd>Promise</Cmd> は「非同期処理の結果を表すオブジェクト」です。3 つの状態を持ちます。
      </p>
      <KVList
        items={[
          { key: "pending（待機）", val: "まだ結果が出ていない初期状態" },
          { key: "fulfilled（成功）", val: "値が確定した。.then() で受け取る" },
          { key: "rejected（失敗）", val: "エラーになった。.catch() で受け取る" },
        ]}
      />
      <p>
        <Cmd>.then()</Cmd> をつなげることで、コールバックの深いネストを<strong>横方向のチェーン</strong>に置き換えられます。
        <Cmd>.catch()</Cmd> は途中のどこで失敗しても捕まえられ、<Cmd>.finally()</Cmd> は成功・失敗に関わらず最後に実行されます。
      </p>
      <Code lang="js" filename="promise-chain.js">{`getUser(1)
  .then((user) => getPosts(user.id))
  .then((posts) => getComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((err) => console.error("どこかで失敗:", err))
  .finally(() => console.log("完了"));`}</Code>

      <Section>async / await — 非同期を「同期っぽく」書く</Section>
      <p>
        <Cmd>async / await</Cmd> は Promise の糖衣構文で、非同期処理を<strong>上から下へ読める形</strong>で書けます。
        <Cmd>await</Cmd> は「その Promise が解決するまで待って、値を取り出す」演算子。<Cmd>await</Cmd> は
        <Cmd>async</Cmd> 関数の中でのみ使えます。
      </p>
      <Code lang="js" filename="async-await.js">{`async function showComments() {
  try {
    const user = await getUser(1);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    console.log(comments);
  } catch (err) {
    console.error("どこかで失敗:", err); // try/catch で普通に捕まえられる
  }
}`}</Code>
      <Callout variant="tip" title="await の正体は Promise">
        <Cmd>async</Cmd> 関数は必ず <Cmd>Promise</Cmd> を返します。<Cmd>await x</Cmd> は「x が Promise なら解決を待ち、
        そうでなければそのまま値にする」だけ。つまり <Cmd>async / await</Cmd> は Promise の<strong>見た目を変えたもの</strong>で、
        中身は同じです。エラー処理が <Cmd>.catch()</Cmd> から <Cmd>try / catch</Cmd> になるのが大きな利点です。
      </Callout>

      <SubSection>then チェーン vs async/await</SubSection>
      <ComparisonTable
        headers={["観点", ".then() チェーン", "async / await"]}
        rows={[
          ["見た目", "横に伸びる関数チェーン", "上から下へ手続き的"],
          ["エラー処理", ".catch()", "try / catch"],
          ["条件分岐・ループ", "書きにくい", "普通の if / for が使える"],
          ["デバッグ", "スタックが追いにくい", "追いやすい"],
        ]}
      />

      <Section>複数の非同期をまとめて扱う</Section>
      <p>
        独立した非同期処理は、<strong>直列（1 つずつ待つ）</strong>より<strong>並行（同時に投げてまとめて待つ）</strong>にすると速くなります。
        <Cmd>Promise.all</Cmd> は全部の成功を待ち、1 つでも失敗すると全体が失敗します。
      </p>
      <Code lang="js" filename="parallel.js">{`// 直列: 3 回分の待ち時間が足し算になる（遅い）
const a = await getUser(1);
const b = await getUser(2);
const c = await getUser(3);

// 並行: 同時に投げて、まとめて待つ（速い）
const [x, y, z] = await Promise.all([
  getUser(1),
  getUser(2),
  getUser(3),
]);`}</Code>
      <KVList
        items={[
          { key: "Promise.all", val: "全部成功で配列を返す。1つでも失敗で即 reject" },
          { key: "Promise.allSettled", val: "成功も失敗も全部の結果を返す（一部失敗を許容したいとき）" },
          { key: "Promise.race", val: "最初に決まった1つの結果を返す（タイムアウト実装など）" },
        ]}
      />

      <Callout variant="warn" title="よくある落とし穴">
        <strong>await の付け忘れ</strong>——<Cmd>await</Cmd> を書かないと Promise オブジェクトのまま扱ってしまい、
        値が <Cmd>undefined</Cmd> や <Cmd>[object Promise]</Cmd> になります。また、<Cmd>forEach</Cmd> の中で
        <Cmd>await</Cmd> しても<strong>待ってくれません</strong>。順番に待ちたいなら <Cmd>for ... of</Cmd>、
        並行でよいなら <Cmd>map</Cmd> ＋ <Cmd>Promise.all</Cmd> を使います。
      </Callout>

      <Bridge course="オペレーティングシステム / 並行プログラミング">
        「1 スレッドなのに固まらない」のは、講義で学ぶ<strong>ノンブロッキング I/O</strong>と<strong>イベントループ</strong>のおかげです。
        重い I/O（通信・ディスク）は OS に任せ、完了通知が来たら<strong>コールバックをキューに積んで順に実行</strong>する——
        JavaScript はこの仕組みで<strong>並行（concurrent）</strong>を実現します。CPU を同時に複数使う<strong>並列（parallel）</strong>とは別物、
        という「並行 ≠ 並列」の区別はまさに OS の教科書どおり。<Cmd>Promise</Cmd> は「未来に値が入る」という
        <strong>フューチャー / プロミス</strong>という並行計算モデルの実装です。
      </Bridge>

      <Quiz
        question={<>次のうち、3 つの独立した取得を<strong>最も速く</strong>終える書き方はどれ？</>}
        options={[
          <Cmd>{"const a = await f(1); const b = await f(2); const c = await f(3);"}</Cmd>,
          <Cmd>{"const [a,b,c] = await Promise.all([f(1), f(2), f(3)]);"}</Cmd>,
          <Cmd>{"[1,2,3].forEach(async (n) => await f(n));"}</Cmd>,
          <Cmd>{"const a = f(1), b = f(2), c = f(3);"}</Cmd>,
        ]}
        answer={1}
        explanation={
          <>
            独立した処理は <Cmd>Promise.all</Cmd> で<strong>同時に投げてまとめて待つ</strong>のが最速です。1 番目は直列で待ち時間が足し算になり遅い、
            3 番目は <Cmd>forEach</Cmd> が await を待たないため制御できず、4 番目は await が無く結果を受け取れません。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "非同期は「待つ間もブロックしない」仕組み。JS はシングルスレッドなので必須",
          "Promise は pending → fulfilled / rejected の3状態。.then / .catch / .finally でつなぐ",
          "async/await は Promise の糖衣構文。上から下へ読め、try/catch でエラーを扱える",
          "独立処理は Promise.all で並行化すると速い（allSettled / race も用途あり）",
          "落とし穴: await 付け忘れ、forEach 内の await は待たない（for...of か map+Promise.all）",
        ]}
      />
    </>
  );
}

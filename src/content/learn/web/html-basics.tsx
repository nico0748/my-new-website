import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KeyPoints, ComparisonTable, TipBox, KVList, Bridge, Divider } from "../../../components/learn/kit";
import { DomTreeFigure } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "html-basics",
  title: "HTML の基礎 — 文書構造とマークアップ",
  description: "Web ページの骨格を作る HTML。タグ・要素・属性、文書のひな形、セマンティックな構造、そして DOM とのつながりを最短で押さえる。",
  domain: "web",
  section: "frontend",
  order: 0,
  level: "intro",
  tags: ["HTML", "マークアップ", "フロントエンド"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        Web ページのすべては <strong>HTML（HyperText Markup Language）</strong>から始まります。
        HTML は「文章のどこが見出しで、どこが段落で、どこがリンクか」という<strong>意味と構造</strong>を、タグで印づけ（マークアップ）する言語です。
        見た目（CSS）や動き（JavaScript）を乗せる前に、まずこの骨格を理解しましょう。
      </Lead>

      <Section>HTML とは — 印をつける言語</Section>
      <p>
        HTML は「マークアップ言語」であり、計算や処理を書く<strong>プログラミング言語ではありません</strong>。
        素のテキストに <Cmd>&lt;タグ&gt;</Cmd> で印をつけて、「ここは見出し」「ここは段落」と<strong>役割</strong>を与えるのが仕事です。
        ブラウザはこの印を読み取り、文書の構造を組み立てて画面に描きます。
      </p>
      <Code lang="html">{`<h1>猫について</h1>
<p>猫は<strong>気まぐれ</strong>な動物です。</p>
<a href="https://example.com">詳しく読む</a>`}</Code>
      <p>
        <Cmd>&lt;h1&gt;</Cmd> は見出し、<Cmd>&lt;p&gt;</Cmd> は段落、<Cmd>&lt;a&gt;</Cmd> はリンク。
        タグ名そのものが「これは何か」を表しているのがポイントです。
      </p>

      <Bridge course="形式言語 / 構文解析">
        HTML は<strong>文脈自由文法</strong>に近い規則で書かれたマークアップで、ブラウザの HTML パーサがそれを構文解析して木構造（DOM）を作ります。
        「タグの入れ子＝括弧の対応」「開きタグと閉じタグのネスト」は、講義で扱う<strong>構文木（parse tree）</strong>の生成そのもの。
        プログラミング言語のコンパイラが字句解析→構文解析→木を作るのと同じ流れが、Web ページの表示の最初の一歩で走っています。
      </Bridge>

      <Section>要素・タグ・属性</Section>
      <p>HTML の基本単位は<strong>要素（element）</strong>です。多くの要素は「開始タグ・内容・終了タグ」の 3 点セットでできています。</p>
      <Code lang="html">{`<a href="/about" class="link">会社概要</a>
<!--
  開始タグ: <a href="/about" class="link">
  内容:     会社概要
  終了タグ: </a>
-->`}</Code>
      <KVList
        items={[
          { key: "タグ (tag)", val: "山括弧で囲んだ印。開始 <a> と終了 </a> のペア" },
          { key: "要素 (element)", val: "開始タグ〜終了タグまでの一かたまり全体" },
          { key: "属性 (attribute)", val: "開始タグに書く追加情報。名前=\"値\" の形（href=\"...\", class=\"...\"）" },
          { key: "空要素", val: "内容と終了タグを持たないタグ。<img> <br> <input> など" },
        ]}
      />
      <Callout variant="tip" title="よく使う属性">
        <Cmd>href</Cmd>（リンク先）、<Cmd>src</Cmd>（画像などの参照先）、<Cmd>alt</Cmd>（代替テキスト）、<Cmd>id</Cmd> / <Cmd>class</Cmd>（CSS や JS から掴むための名前）は最頻出です。
        とくに <Cmd>class</Cmd> は CSS の章でそのままスタイルの当て先になります。
      </Callout>

      <Section>文書のひな形</Section>
      <p>1 枚の HTML ファイルは、次の骨格から始まります。丸暗記ではなく「宣言・頭・体」の役割で覚えます。</p>
      <Code lang="html" filename="index.html">{`<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ページのタイトル</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <h1>見出し</h1>
    <p>本文…</p>
  </body>
</html>`}</Code>
      <KVList
        items={[
          { key: <Cmd>&lt;!DOCTYPE html&gt;</Cmd>, val: "「これは HTML5 の文書」という宣言。先頭に必須" },
          { key: <Cmd>&lt;html lang="ja"&gt;</Cmd>, val: "文書全体のルート。lang で言語を示す（読み上げや翻訳に効く）" },
          { key: <Cmd>&lt;head&gt;</Cmd>, val: "画面に出ないメタ情報。文字コード・タイトル・CSS/JS の読み込み" },
          { key: <Cmd>&lt;body&gt;</Cmd>, val: "実際に表示される中身。見出し・段落・画像などはここに書く" },
        ]}
      />
      <Callout variant="warn" title="charset と viewport は必ず入れる">
        <Cmd>&lt;meta charset="UTF-8"&gt;</Cmd> が無いと日本語が文字化けすることがあります。
        <Cmd>viewport</Cmd> の meta が無いと、スマホで PC 版を縮小表示してしまい、レスポンシブが効きません。この 2 行はほぼ定型として入れます。
      </Callout>

      <Section>よく使う要素</Section>
      <SubSection>見出し・段落・強調</SubSection>
      <p><Cmd>&lt;h1&gt;</Cmd>〜<Cmd>&lt;h6&gt;</Cmd> は見出しの階層（h1 が最上位）。ページに h1 は原則 1 つで、見出しは番号を飛ばさず入れ子の意味で使います。</p>
      <Code lang="html">{`<h1>記事タイトル</h1>
<h2>大見出し</h2>
<h3>小見出し</h3>
<p>段落のテキスト。<strong>重要</strong>や<em>強調</em>を混ぜられる。</p>`}</Code>

      <SubSection>リンクと画像</SubSection>
      <Code lang="html">{`<!-- リンク: href に飛び先。別タブは target="_blank" -->
<a href="/contact">お問い合わせ</a>

<!-- 画像: src に場所、alt に代替テキスト（必須級） -->
<img src="/cat.jpg" alt="こちらを見る三毛猫" />`}</Code>
      <Callout variant="tip" title="alt は飾りではない">
        <Cmd>alt</Cmd> は画像が読めない環境（読み上げ・通信失敗・検索エンジン）に「何の画像か」を伝えます。空にせず、内容を短く書くのがアクセシビリティと SEO の基本です。
      </Callout>

      <SubSection>リスト</SubSection>
      <Code lang="html">{`<!-- 順序なし（箇条書き） -->
<ul>
  <li>りんご</li>
  <li>みかん</li>
</ul>

<!-- 順序あり（番号付き） -->
<ol>
  <li>手を洗う</li>
  <li>材料を切る</li>
</ol>`}</Code>

      <Section>ブロック要素とインライン要素</Section>
      <p>要素は大きく 2 系統に分かれます。この区別は、次章の CSS の <Cmd>display</Cmd> にそのままつながります。</p>
      <ComparisonTable
        headers={["", "ブロック要素", "インライン要素"]}
        rows={[
          ["並び方", "縦に積まれ、横幅いっぱい", "文中に横並び"],
          ["代表例", "div, p, h1〜h6, ul, section", "span, a, strong, em, img"],
          ["幅・高さ", "指定できる", "基本は内容なりで効きにくい"],
          ["使いどころ", "文書の大きなかたまり", "文章の一部を装飾・リンク化"],
        ]}
      />

      <Section>セマンティック HTML — 意味で組む</Section>
      <p>
        すべてを <Cmd>&lt;div&gt;</Cmd> で作ることもできますが、役割の分かる<strong>意味を持つタグ（セマンティック要素）</strong>を使うと、
        読み上げソフト・検索エンジン・他の開発者に構造が伝わります。
      </p>
      <Code lang="html" filename="page.html">{`<body>
  <header>サイトのロゴ・ナビ</header>
  <nav>メニュー</nav>
  <main>
    <article>
      <h1>記事タイトル</h1>
      <section>本文のまとまり</section>
    </article>
    <aside>関連リンク</aside>
  </main>
  <footer>コピーライト</footer>
</body>`}</Code>
      <KVList
        items={[
          { key: <Cmd>&lt;header&gt; / &lt;footer&gt;</Cmd>, val: "ページや記事の上端・下端" },
          { key: <Cmd>&lt;nav&gt;</Cmd>, val: "主要なナビゲーション（メニュー）" },
          { key: <Cmd>&lt;main&gt;</Cmd>, val: "そのページの主内容（1 ページに 1 つ）" },
          { key: <Cmd>&lt;article&gt; / &lt;section&gt;</Cmd>, val: "独立した記事 / 意味のあるまとまり" },
        ]}
      />
      <Callout variant="info" title="なぜ div だらけを避けるのか">
        見た目は div でも作れますが、<Cmd>&lt;div&gt;</Cmd> は「意味のない箱」です。セマンティック要素にすると、スクリーンリーダーが「ここはナビ」「ここが本文」と案内でき、
        検索エンジンも構造を理解しやすくなります。まず意味で組み、装飾は CSS に任せるのが定石です。
      </Callout>

      <Section>入れ子は「木」になる — DOM とのつながり</Section>
      <p>
        タグの入れ子（親子関係）は、そのまま<strong>木構造（ツリー）</strong>になります。ブラウザは HTML を解析してこの木＝<strong>DOM（Document Object Model）</strong>を作り、
        各ノードを画面のブロックとして描画します。次の図で、左のツリーと右の表示の対応を見てみましょう。
      </p>
      <DomTreeFigure caption="HTML の入れ子構造 → DOM ツリー → 画面上のブロック。同じ色の要素どうしが対応する。" />
      <TipBox>
        だから「開いたタグは正しく閉じる」「親子の入れ子を崩さない」ことが大切です。閉じ忘れや交差した入れ子（<Cmd>&lt;b&gt;&lt;i&gt;…&lt;/b&gt;&lt;/i&gt;</Cmd>）は、意図しない木を生み、表示や JS の DOM 操作を狂わせます。
      </TipBox>

      <Section>フォームの基本</Section>
      <p>ユーザーからの入力は <Cmd>&lt;form&gt;</Cmd> と入力部品で受け取ります。詳細はバックエンド章に譲り、ここでは形だけ押さえます。</p>
      <Code lang="html">{`<form action="/submit" method="post">
  <label for="name">名前</label>
  <input id="name" name="name" type="text" required />

  <label for="mail">メール</label>
  <input id="mail" name="mail" type="email" />

  <button type="submit">送信</button>
</form>`}</Code>
      <Callout variant="tip" title="label と input を結びつける">
        <Cmd>&lt;label for="name"&gt;</Cmd> と <Cmd>&lt;input id="name"&gt;</Cmd> の <Cmd>for</Cmd>／<Cmd>id</Cmd> を一致させると、ラベルをクリックしても入力欄にフォーカスでき、読み上げ環境でも「何の入力か」が伝わります。
      </Callout>

      <Divider />

      <Section>HTML・CSS・JavaScript の役割分担</Section>
      <p>Web ページは 3 つの言語が役割を分担して成り立ちます。この章の HTML は、その一番下の土台です。</p>
      <ComparisonTable
        headers={["言語", "担当", "たとえ"]}
        rows={[
          ["HTML", "構造・意味（何であるか）", "建物の骨組み"],
          ["CSS", "見た目（どう見せるか）", "内装・塗装"],
          ["JavaScript", "振る舞い（どう動くか）", "電気・設備"],
        ]}
      />
      <Callout variant="info" title="次は CSS へ">
        構造ができたら、次章の <strong>CSS</strong> で見た目を与えます。HTML の <Cmd>class</Cmd> や要素名が、そのまま CSS のセレクタの当て先になります。まずは意味の通る HTML を書けることが出発点です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "HTML はタグで「意味と構造」を印づけするマークアップ言語（処理は書かない）",
          "基本単位は要素。開始タグ＋内容＋終了タグ、追加情報は属性（href/src/alt/class など）",
          "文書は DOCTYPE → html → head（メタ情報）→ body（表示内容）のひな形で始まる",
          "要素はブロック / インラインに大別され、CSS の display につながる",
          "div だけでなくセマンティック要素（header/main/article…）で意味を込める",
          "タグの入れ子はそのまま DOM ツリーになる。正しく閉じ、入れ子を崩さない",
          "HTML=構造 / CSS=見た目 / JS=振る舞い。役割を分けて組む",
        ]}
      />
    </>
  );
}

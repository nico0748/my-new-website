import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, TipBox, KVList, Bridge, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "tailwind-css",
  title: "Tailwind CSS — ユーティリティファースト",
  description: "クラスを組み合わせて素早くスタイリングする Tailwind CSS。セットアップ、主要ユーティリティ、レスポンシブ、ダークモード、@apply までを実例で。",
  domain: "web",
  section: "frontend",
  order: 2,
  level: "basic",
  tags: ["CSS", "Tailwind", "フロントエンド"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Tailwind CSS</strong> は、<Cmd>flex</Cmd>・<Cmd>p-4</Cmd>・<Cmd>text-lg</Cmd> といった小さな「ユーティリティクラス」を
        HTML に直接組み合わせてデザインするフレームワークです。CSS ファイルを行き来せず、マークアップの中だけで見た目を組み立てられるのが最大の特徴です。
      </Lead>

      <Section>ユーティリティファーストとは</Section>
      <p>
        従来の CSS は「<Cmd>.card</Cmd> という名前を決め、その中身を別ファイルに書く」という流れでした。Tailwind は逆に、
        「余白」「色」「配置」といった<strong>1 つの役割だけを持つ極小のクラス</strong>を大量に用意しておき、それらを積み木のように組み合わせます。
      </p>
      <Code lang="html">{`<!-- 1つ1つのクラスが1つの役割を持つ -->
<div class="flex items-center gap-3 p-4 rounded-lg bg-white shadow">
  <img class="w-10 h-10 rounded-full" src="/avatar.png" />
  <span class="text-lg font-bold text-slate-800">こんにちは</span>
</div>`}</Code>
      <TipBox>
        クラス名を考える手間（命名疲れ）がなくなり、HTML を見るだけで見た目が読めるのが利点です。一方でクラスが長くなるため、繰り返し部分はコンポーネント化して対処します。
      </TipBox>

      <SubSection>これは「良い抽象化」の放棄なのか？</SubSection>
      <p>
        「意味のある名前（<Cmd>.card</Cmd>）を捨てて、実装の詳細（<Cmd>p-4 rounded-lg shadow</Cmd>）を HTML に散らすなんて退化では？」
        — 初見では誰もがそう感じます。ソフトウェア工学の基本は「実装を名前の裏に隠す抽象化」だからです。
        しかし Tailwind の主張は<strong>抽象化のレイヤーを 1 段下げた</strong>だけ、というものです。<Cmd>p-4</Cmd> は「16px」ではなく「デザインシステムの余白スケール上の 4 番目」という<strong>語彙</strong>であり、
        生の <Cmd>padding: 16px</Cmd> より抽象的です。抽象化を捨てたのではなく、「名前を付ける単位」をコンポーネント（<Cmd>.card</Cmd>）からデザイントークン（<Cmd>p-4</Cmd>）へ移した、と捉えると腹落ちします。
      </p>
      <Bridge course="ソフトウェア工学 / 抽象化とトレードオフ">
        あらゆる抽象化には代償があります。<Cmd>.card</Cmd> のような意味的抽象は「見た目を 1 箇所で変えられる（凝集）」代わりに「名前と中身の対応を頭に保持する認知コスト」と「間違った粒度で切ると破綻する設計リスク」を負います。
        Tailwind は逆側のトレードオフを選び、抽象を薄くすることで「HTML を読めば見た目が分かる（局所性）」を得る代わりに「クラス列の重複」を受け入れます。
        講義で習う「早すぎる抽象化は害（premature abstraction）」「DRY と局所性はしばしば対立する」という原則の、生きた実例です。どちらが正解ではなく、<strong>何を最適化したいかで選ぶ</strong>のが工学です。
      </Bridge>

      <Section>従来 CSS との比較</Section>
      <ComparisonTable
        headers={["観点", "従来の CSS / BEM", "Tailwind"]}
        rows={[
          ["書く場所", "別の .css ファイル", "HTML のクラス属性に直接"]  ,
          ["命名", "クラス名を毎回考える", "命名不要（既存クラスを組み合わせ)"],
          ["未使用スタイル", "溜まりやすい（消しにくい)", "使わないクラスはビルドで除去される"],
          ["一貫性", "人により値がバラつく", "設定した尺度（4px刻み等）に自然に揃う"],
          ["学習コスト", "CSS そのもの", "クラス名の語彙を覚える"],
        ]}
      />

      <Section>セットアップ</Section>
      <Steps>
        <Step title="インストール">
          npm でパッケージを追加し、設定ファイルを生成します。
          <Code lang="bash">{`npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`}</Code>
        </Step>
        <Step title="スキャン対象を指定">
          生成された <Cmd>tailwind.config.js</Cmd> の <Cmd>content</Cmd> に、クラスを使うファイルを列挙します。ここに書いたファイルだけがスキャンされ、使われたクラスだけが出力されます。
          <Code lang="js" filename="tailwind.config.js">{`export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};`}</Code>
        </Step>
        <Step title="ディレクティブを読み込む">
          エントリの CSS に Tailwind の各レイヤーを注入します。
          <Code lang="css" filename="index.css">{`@tailwind base;      /* リセット + 既定スタイル */
@tailwind components; /* コンポーネント層 */
@tailwind utilities;  /* ユーティリティ本体 */`}</Code>
        </Step>
      </Steps>
      <Callout variant="info" title="v4 では設定がさらに簡素に">
        Tailwind v4 系では、単一の <Cmd>@import "tailwindcss";</Cmd> だけで済み、設定を CSS 内の <Cmd>@theme</Cmd> に書けるようになりました。本記事は理解しやすい v3 系の構成を基準に説明しますが、考え方は共通です。
      </Callout>

      <Section>主要なユーティリティ</Section>
      <p>覚える語彙はカテゴリごとに整理すると早いです。よく使うものを分野別に見ます。</p>

      <SubSection>spacing（余白・サイズ）</SubSection>
      <p>数値は <strong>4px = 1</strong> の尺度。<Cmd>p</Cmd>=padding, <Cmd>m</Cmd>=margin, <Cmd>w/h</Cmd>=幅高さ。</p>
      <Code lang="html">{`<div class="p-4 m-2 w-64 h-32">...</div>
<!-- p-4 = padding:16px, m-2 = margin:8px, w-64 = width:256px -->`}</Code>
      <KVList
        items={[
          { key: <Cmd>p-4</Cmd>, val: "padding 16px（4 × 4px）" },
          { key: <Cmd>px-2</Cmd>, val: "左右 padding 8px（x=横方向）" },
          { key: <Cmd>mt-6</Cmd>, val: "上 margin 24px（t=top）" },
          { key: <Cmd>gap-4</Cmd>, val: "flex/grid の子間隔 16px" },
        ]}
      />
      <TipBox>
        余白を「4px の倍数」に制約するのは、恣意的な <Cmd>margin: 13px</Cmd> を防ぎ、チーム全員のデザインを同じ<strong>尺度（スケール）</strong>に載せる仕組みです。
        制約が自由を奪う代わりに一貫性を生む — これも小さな工学的トレードオフです。
      </TipBox>

      <SubSection>flex / grid（レイアウト）</SubSection>
      <Code lang="html">{`<div class="flex justify-between items-center gap-4">...</div>
<div class="grid grid-cols-3 gap-6">...</div>`}</Code>

      <SubSection>color / typography（色・文字）</SubSection>
      <Code lang="html">{`<p class="text-slate-700 text-lg font-semibold leading-relaxed">
  <span class="bg-teal-500 text-white px-2 rounded">バッジ</span>
</p>`}</Code>
      <TipBox>
        色は <Cmd>text-*</Cmd>（文字）/ <Cmd>bg-*</Cmd>（背景）/ <Cmd>border-*</Cmd>（枠）に、色名と濃さ（<Cmd>50〜950</Cmd>）を組み合わせます。例: <Cmd>bg-teal-500</Cmd>。
      </TipBox>

      <Figure src="/learn/shots/web/tailwind-css-01.svg" alt="エディタで Tailwind CSS IntelliSense がクラス名を補完している様子" caption="語彙を暗記しなくても、補完と CSS プレビューで書きながら覚えられる" />

      <Section>レスポンシブ接頭辞</Section>
      <p>
        画面幅ごとの出し分けは、クラスの前に <Cmd>sm:</Cmd> <Cmd>md:</Cmd> <Cmd>lg:</Cmd> を付けるだけです。Tailwind は<strong>モバイルファースト</strong>で、接頭辞なしが最小画面、接頭辞は「その幅<strong>以上</strong>」に効きます。
      </p>
      <Code lang="html">{`<!-- 標準は縦積み(flex-col)、md(768px)以上で横並び(flex-row) -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">左</div>
  <div class="w-full md:w-1/2">右</div>
</div>`}</Code>
      <TipBox>
        既定のブレークポイントは <Cmd>sm:</Cmd>=640px, <Cmd>md:</Cmd>=768px, <Cmd>lg:</Cmd>=1024px, <Cmd>xl:</Cmd>=1280px。接頭辞なしで小さい画面を作り、上へ差分を足していくのがコツです。
      </TipBox>

      <Section>状態バリアント（hover など）</Section>
      <p>
        マウスオーバーやフォーカスなどの状態も、接頭辞で表せます。<Cmd>hover:</Cmd> <Cmd>focus:</Cmd> <Cmd>active:</Cmd> <Cmd>disabled:</Cmd> などを組み合わせます。
      </p>
      <Code lang="html">{`<button class="bg-teal-500 hover:bg-teal-600 focus:ring-2 disabled:opacity-50">
  送信
</button>`}</Code>

      <Section>ダークモード</Section>
      <p>
        <Cmd>dark:</Cmd> 接頭辞で、ダークモード時のスタイルを指定します。切り替えは、祖先要素（通常 html）に <Cmd>dark</Cmd> クラスを付ける方式が一般的です。
      </p>
      <Code lang="js" filename="tailwind.config.js">{`export default {
  darkMode: "class",  // <html class="dark"> で切替
  // ...
};`}</Code>
      <Code lang="html">{`<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
  ライト/ダーク両対応
</div>`}</Code>

      <Section>@apply — クラスをまとめる</Section>
      <p>
        同じユーティリティの並びが何度も出てくる場合、<Cmd>@apply</Cmd> で CSS 側に名前付きでまとめられます。ボタンなど繰り返す部品に有効です。
      </p>
      <Code lang="css">{`.btn-primary {
  @apply px-4 py-2 rounded-lg bg-teal-500 text-white
         font-semibold hover:bg-teal-600;
}`}</Code>
      <Callout variant="warn" title="@apply は使いすぎない">
        何でも @apply でまとめ直すと、結局「従来 CSS」に逆戻りし Tailwind の利点が薄れます。まずはコンポーネント（React 等）で括るのが第一選択。@apply は本当に共通化したい少数の部品に絞ります。
      </Callout>

      <Section>theme.extend でカスタマイズ</Section>
      <p>
        独自の色や余白は <Cmd>theme.extend</Cmd> に追加します。<Cmd>extend</Cmd> の中に書くと既定値を保ちつつ拡張でき、書いた分だけ <Cmd>bg-brand</Cmd> のように使えます。
      </p>
      <Code lang="js" filename="tailwind.config.js">{`export default {
  theme: {
    extend: {
      colors: { brand: "#22b0a0" },
      spacing: { 18: "4.5rem" },
    },
  },
};`}</Code>

      <Section>JIT（Just-In-Time）とビルドの仕組み</Section>
      <p>
        現在の Tailwind は <strong>JIT エンジン</strong>で動きます。HTML をスキャンし、<strong>実際に使われたクラスだけ</strong>をその場で生成するため、最終的な CSS は非常に小さくなります。
        任意の値（<Cmd>w-[327px]</Cmd> のような角括弧記法）もこの仕組みで使えます。
      </p>
      <p>
        ここで理解すべきは、<strong>あなたが書いた <Cmd>class="p-4"</Cmd> はブラウザに直接届かない</strong>という点です。ビルド時に前処理（プリプロセス）が走り、
        ソースを走査して使用クラスを抽出し、対応する CSS を生成し、本番用に圧縮する。この一連の変換パイプラインを経て、初めてブラウザが読む <Cmd>.css</Cmd> ができます。
      </p>
      <Code lang="text" filename="build-pipeline">{`ソース(.html/.tsx) を走査
  → 使用クラスを抽出 (content の対象のみ)
  → 各クラスに対応する CSS を生成 (JIT)
  → 未使用分は最初から作らない (= purge)
  → minify して出力 (dist/app.css)`}</Code>
      <Bridge course="ソフトウェア工学（ビルド / トランスパイル）/ コンパイラ">
        Tailwind は実質的に<strong>ソースコード変換器（トランスパイラ）</strong>です。入力（クラス名を含む HTML/JSX）を字句・パターンとして走査し、中間表現を経て別の言語（プレーン CSS）へ変換する。
        コンパイラ講義の「字句解析 → 変換 → コード生成」そのままの構造で、JSX を JS に落とす Babel、TypeScript を JS にする tsc、Sass を CSS にする Sass コンパイラと同じ<strong>ビルド段階の変換</strong>に属します。
        「開発時に書く言語」と「実行時に走る言語」が別物で、その間にビルドツールが挟まる — このモデルは現代フロントエンドの至る所（バンドル・minify・tree-shaking）に現れます。Tailwind の purge は tree-shaking の CSS 版と言えます。
      </Bridge>
      <Callout variant="danger" title="動的クラス名は生成されない（頻出の落とし穴）">
        JIT はソースを<strong>静的に文字列として</strong>走査します。<Cmd>{'`bg-${color}-500`'}</Cmd> のように実行時に組み立てたクラス名は、ビルド時には見えないため CSS が生成されず、スタイルが当たりません。
        必要なクラスは完全な文字列で書くか（<Cmd>safelist</Cmd> に登録するか）、条件分岐で完全なクラス名を選ぶ形にします。「ビルド時に決まる情報と実行時に決まる情報の境界」を意識するのがコツです。
      </Callout>
      <ComparisonTable
        headers={["メリット", "デメリット / 注意"]}
        rows={[
          ["命名不要で開発が速い", "クラスが長く HTML が読みにくくなる"],
          ["未使用 CSS が自動で除去され軽量", "content の指定漏れでクラスが効かない"],
          ["尺度が揃いデザインが一貫", "語彙を覚えるまでの立ち上がり"],
          ["任意値や状態も接頭辞で完結", "動的なクラス名（文字列結合）は除去されやすい"],
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "Tailwind は1役割1クラスのユーティリティを組み合わせる「ユーティリティファースト」",
          "セットアップは npm → tailwind.config の content 指定 → @tailwind ディレクティブ",
          "余白は4px=1の尺度。色は text-/bg-/border- に濃さ(50〜950)を組み合わせる",
          "レスポンシブは sm:/md:/lg:（その幅以上・モバイルファースト）、状態は hover:/focus: など",
          "ダークは darkMode:'class' + dark: 接頭辞、共通化は @apply（使いすぎ注意）",
          "JIT で使ったクラスだけ生成され軽量。任意値は角括弧記法で指定できる",
        ]}
      />
    </>
  );
}

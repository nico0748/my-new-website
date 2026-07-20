import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, KVList, TipBox, Bridge, Figure, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "vue-01",
  title: "Vue.js 入門① — テンプレートとリアクティビティ",
  description: "Vue の特徴、単一ファイルコンポーネント(SFC)、テンプレート構文、ref/reactive によるリアクティビティの基礎を実例で学ぶ。",
  domain: "web",
  section: "frontend",
  order: 13,
  level: "basic",
  tags: ["Vue", "SFC", "リアクティブ"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Vue.js</strong> は「データを書き換えれば画面が自動で追従する」宣言的な UI ライブラリです。
        この記事では Vue の思想、単一ファイルコンポーネント（SFC）の書き方、テンプレート構文、そして
        <strong>リアクティビティ（reactivity）の仕組み</strong>までを、小さなコードを積み重ねながら押さえます。
      </Lead>

      <Section>Vue とは — プログレッシブフレームワーク</Section>
      <p>
        Vue は「プログレッシブフレームワーク」を自称します。既存の HTML に少しずつ乗せることも、
        ルーティングや状態管理まで含めた本格的な SPA を組むこともできる、という意味です。
        小さく始めて必要に応じて拡張できるのが最大の特徴です。
      </p>
      <p>Vue の中心にあるのは次の 2 つの考え方です。</p>
      <ul>
        <li><strong>宣言的レンダリング</strong> — 「今のデータならこう表示する」を書けば、更新は Vue が担う</li>
        <li><strong>リアクティビティ</strong> — データの変化を Vue が検知し、影響する箇所だけを再描画する</li>
      </ul>

      <Callout variant="info" title="React との違いをひとことで">
        React が「状態が変わったら再レンダー関数を呼ぶ」明示的モデルなのに対し、Vue はデータを
        <Cmd>Proxy</Cmd> で監視し「触られた値」を自動追跡します。<Cmd>setState</Cmd> のような明示的な更新宣言は不要です。
      </Callout>

      <SubSection>なぜ「宣言的」なのか — 命令的 UI 更新の限界</SubSection>
      <p>
        素の DOM 操作は<strong>命令的（imperative）</strong>です。「合計が変わったら、この <Cmd>span</Cmd> の
        <Cmd>textContent</Cmd> を書き換えて、在庫が 0 なら別の要素を <Cmd>display:none</Cmd> にして…」と、
        <strong>状態が変わるたびに「どこをどう直すか」を手で辿る</strong>必要があります。状態が増えるほど
        「更新し忘れ」「二重更新」「順序依存のバグ」が指数的に増えていきます。
      </p>
      <p>
        宣言的（declarative）レンダリングは、この関係を逆転させます。「<strong>この状態のとき、画面はこうあるべき</strong>」
        という<strong>状態→表示の対応関係だけ</strong>を書き、実際の DOM 差分適用はフレームワークに委ねます。
        開発者は「あるべき姿（What）」に集中し、「どう更新するか（How）」を手放せます。これが React・Vue・Angular に
        共通するモダン UI の中核思想です。
      </p>

      <Bridge course="プログラミング言語論 / 宣言型プログラミング">
        SQL や関数型言語で学ぶ<strong>宣言型 vs 命令型</strong>の対比が、そのまま UI に現れます。命令型は
        「手順（アルゴリズム）」を、宣言型は「満たすべき関係（仕様）」を書く。Vue のテンプレートは
        「状態 <Cmd>s</Cmd> に対する UI は <Cmd>f(s)</Cmd> である」という<strong>純粋関数的な写像</strong>を宣言し、
        差分適用という副作用をランタイムに閉じ込めます。座学で「宣言型は最適化をランタイムに委ねられる」と
        習った通り、Vue は依存追跡によって「変わった箇所だけ」を賢く再計算します。
      </Bridge>

      <Section>環境構築 — Vite で始める</Section>
      <p>公式の足場ツール <Cmd>create-vue</Cmd> を使えば、Vite ベースのプロジェクトが即座に立ち上がります。</p>

      <Code lang="bash" filename="terminal">{`npm create vue@latest my-app
cd my-app
npm install
npm run dev`}</Code>

      <p>
        <Cmd>npm run dev</Cmd> で開発サーバが起動します。Vite は変更したファイルだけを差し替える
        HMR（Hot Module Replacement）を持ち、保存すると即座に画面へ反映されます。
        エントリは <Cmd>src/main.js</Cmd>、ルートコンポーネントは <Cmd>src/App.vue</Cmd> です。
      </p>

      <Code lang="js" filename="src/main.js">{`import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`}</Code>

      <Section>単一ファイルコンポーネント（SFC）</Section>
      <p>
        Vue のコンポーネントは <Cmd>.vue</Cmd> という 1 ファイルに、
        <strong>テンプレート・ロジック・スタイル</strong>の 3 つを同居させます。これが SFC です。
      </p>
      <ul>
        <li><Cmd>&lt;template&gt;</Cmd> — 表示する HTML 構造（何を描くか）</li>
        <li><Cmd>&lt;script setup&gt;</Cmd> — 状態や関数などのロジック</li>
        <li><Cmd>&lt;style&gt;</Cmd> — スタイル（<Cmd>scoped</Cmd> を付けるとそのコンポーネント限定）</li>
      </ul>

      <Code lang="vue" filename="Hello.vue">{`<template>
  <p class="greeting">{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('こんにちは、Vue!')
</script>

<style scoped>
.greeting {
  color: teal;
  font-weight: bold;
}
</style>`}</Code>

      <Callout variant="tip" title="script setup を使う">
        <Cmd>&lt;script setup&gt;</Cmd> は Composition API を最小の記述で書くための構文です。
        トップレベルで宣言した変数・関数はそのままテンプレートで使えます。本記事はすべてこの形で進めます。
      </Callout>

      <Section>テンプレート構文</Section>
      <SubSection>補間 —{" "}{"{{ }}"}</SubSection>
      <p>二重波括弧でデータをテキストとして埋め込みます。中には JavaScript の式も書けます。</p>

      <Code lang="vue" filename="template">{`<template>
  <p>{{ name }} さん、こんにちは</p>
  <p>合計: {{ price * count }} 円</p>
  <p>{{ ok ? '有効' : '無効' }}</p>
</template>`}</Code>

      <SubSection>属性バインディング — v-bind (:)</SubSection>
      <p>
        HTML 属性へデータを流し込むには <Cmd>v-bind</Cmd>、省略形の <Cmd>:</Cmd> を使います。
        補間はテキスト用、属性は <Cmd>:</Cmd> と覚えます。
      </p>

      <Code lang="vue" filename="v-bind">{`<template>
  <img :src="imageUrl" :alt="caption" />
  <a :href="url" :class="{ active: isActive }">リンク</a>
  <button :disabled="isLoading">送信</button>
</template>`}</Code>

      <SubSection>イベント — v-on (@)</SubSection>
      <p>
        DOM イベントは <Cmd>v-on</Cmd>、省略形 <Cmd>@</Cmd> で購読します。
        ハンドラには関数名か、直接インラインの式を書けます。
      </p>

      <Code lang="vue" filename="v-on">{`<template>
  <button @click="count++">直接インクリメント</button>
  <button @click="increment">関数を呼ぶ</button>
  <form @submit.prevent="onSubmit">
    <button type="submit">送信</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => { count.value++ }
const onSubmit = () => { console.log('送信') }
</script>`}</Code>

      <TipBox>
        <Cmd>.prevent</Cmd> や <Cmd>.stop</Cmd> は「イベント修飾子」。
        <Cmd>@submit.prevent</Cmd> は <Cmd>event.preventDefault()</Cmd> を自動で呼びます。
        テンプレート側で完結するので、ハンドラ本体をロジックに集中させられます。
      </TipBox>

      <SubSection>条件分岐と繰り返し — v-if / v-for</SubSection>
      <p>
        <Cmd>v-if</Cmd> は条件が真のときだけ要素を描画（DOM 自体を出し入れ）、
        <Cmd>v-for</Cmd> は配列を反復描画します。<Cmd>v-for</Cmd> には必ず一意な <Cmd>:key</Cmd> を付けます。
      </p>

      <Code lang="vue" filename="v-if-v-for">{`<template>
  <p v-if="items.length === 0">まだ項目がありません</p>
  <ul v-else>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}（{{ item.price }}円）
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'コーヒー', price: 400 },
  { id: 2, name: '紅茶', price: 380 },
])
</script>`}</Code>

      <Callout variant="warn" title=":key を省略しない">
        <Cmd>:key</Cmd> は差分更新で「どの要素が同じものか」を Vue に伝える識別子です。
        配列のインデックスを key にすると並び替えや削除で不具合が出やすいので、
        データ固有の ID を使いましょう。
      </Callout>

      <SubSection>双方向バインディング — v-model</SubSection>
      <p>
        フォーム入力と状態を同期させるのが <Cmd>v-model</Cmd> です。実体は
        「<Cmd>:value</Cmd> で表示 ＋ <Cmd>@input</Cmd> で書き戻し」の糖衣構文で、これ 1 つで双方向になります。
      </p>

      <Code lang="vue" filename="v-model">{`<template>
  <input v-model="text" placeholder="入力してね" />
  <p>入力中: {{ text }}</p>

  <input type="checkbox" v-model="agreed" />
  <span>{{ agreed ? '同意済み' : '未同意' }}</span>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const agreed = ref(false)
</script>`}</Code>

      <Divider />

      <Section>リアクティビティの基礎 — ref と reactive</Section>
      <p>
        Vue で「変化を追跡してほしいデータ」は <Cmd>ref</Cmd> または <Cmd>reactive</Cmd> で包みます。
        素の変数を書き換えても Vue は気づけません。ここが最重要ポイントです。
      </p>

      <SubSection>ref — あらゆる値をリアクティブに</SubSection>
      <p>
        <Cmd>ref</Cmd> は数値・文字列・真偽値・オブジェクトなど何でも包めます。
        <strong>スクリプト内では <Cmd>.value</Cmd> でアクセス</strong>、テンプレート内では自動で外れて <Cmd>.value</Cmd> 不要です。
      </p>

      <Code lang="vue" filename="ref">{`<script setup>
import { ref } from 'vue'

const count = ref(0)

console.log(count.value)   // 0  ← script では .value 必須
count.value++              // 1  ← 書き換えも .value
</script>

<template>
  <!-- template では .value 不要 -->
  <button @click="count++">{{ count }}</button>
</template>`}</Code>

      <SubSection>reactive — オブジェクト専用</SubSection>
      <p>
        <Cmd>reactive</Cmd> はオブジェクトや配列を丸ごとリアクティブにします。
        <Cmd>.value</Cmd> は不要ですが、プリミティブ（数値・文字列単体）には使えず、
        分割代入するとリアクティビティが切れる弱点があります。
      </p>

      <Code lang="vue" filename="reactive">{`<script setup>
import { reactive } from 'vue'

const state = reactive({
  user: 'yuma',
  count: 0,
})

state.count++          // .value 不要でそのまま代入
state.user = 'saka'    // 変更は自動で追跡される

// 注意: 分割代入するとリアクティビティが切れる
// const { count } = state   ← count はただの数値になる
</script>`}</Code>

      <Callout variant="tip" title="ref と reactive の使い分け">
        迷ったら <strong>まず <Cmd>ref</Cmd></strong>。単体の値も、オブジェクトも、配列も包めて統一的に書けます。
        <Cmd>reactive</Cmd> は「関連する状態をまとめたい」ときの選択肢ですが、
        <Cmd>.value</Cmd> の有無が混在して混乱しがちなので、初学者は <Cmd>ref</Cmd> に寄せると安全です。
      </Callout>

      <ComparisonTable
        headers={["観点", "ref", "reactive"]}
        rows={[
          ["対象", "何でも（値・オブジェクト・配列）", "オブジェクト・配列のみ"],
          ["script でのアクセス", ".value が必要", "そのまま（.value 不要）"],
          ["template でのアクセス", "自動で外れる", "そのまま"],
          ["分割代入", "問題なし", "リアクティビティが切れる"],
        ]}
      />

      <Section>Proxy ベースのリアクティビティの仕組み</Section>
      <p>
        「なぜ値を書き換えるだけで画面が更新されるのか」— その正体は JavaScript の
        <Cmd>Proxy</Cmd> です。Vue 3 は <Cmd>reactive</Cmd>（や <Cmd>ref</Cmd> の中身）を Proxy で包み、
        プロパティの <strong>読み取り（get）と書き込み（set）を横取り</strong>しています。
      </p>

      <Steps>
        <Step title="1. 追跡（track）">
          コンポーネントの描画中にリアクティブな値が<strong>読まれる</strong>と、Vue は
          「この描画処理は、この値に依存している」と記録します（依存の収集）。
        </Step>
        <Step title="2. 発火（trigger）">
          その値が<strong>書き換えられる</strong>と、Vue は先ほど記録した依存を辿り、
          関係する描画処理だけを再実行します。無関係な部分は動きません。
        </Step>
      </Steps>

      <FlowChain
        nodes={[
          { label: "get 横取り", sub: "Proxy" },
          { label: "track", sub: "依存を記録" },
          { label: "set 横取り", sub: "Proxy" },
          { label: "trigger", sub: "再描画発火" },
        ]}
        caption="読み取り（get）で依存を貼り、書き込み（set）で貼った依存だけを起こす。これがリアクティビティの一巡"
      />

      <Bridge course="デザインパターン（Observer / Publish-Subscribe）">
        この track / trigger の仕組みは、GoF の <strong>Observer パターン</strong>そのものです。
        「監視される側（Subject＝リアクティブな値）」と「監視する側（Observer＝描画処理）」があり、値が
        <Cmd>get</Cmd> されたときに Observer を<strong>購読リストに登録（subscribe）</strong>、<Cmd>set</Cmd> されたときに
        <strong>登録済み Observer へ通知（notify）</strong>します。座学では「監視対象と監視者を疎結合にし、変化を
        push で伝える」と学びますが、Vue は<strong>依存を明示登録せず自動収集する</strong>点が発展形です。
        購読対象がプロパティ単位で細かく分かれているため、Pub-Sub の「トピック別配信」に近い挙動になります。
      </Bridge>

      <p>Proxy がやっていることを、ごく素朴に書くと次のイメージです（Vue の内部を単純化したもの）。</p>

      <Code lang="js" filename="proxy-concept.js">{`function reactive(target) {
  return new Proxy(target, {
    get(obj, key) {
      track(obj, key)          // 読まれた → 依存を記録
      return obj[key]
    },
    set(obj, key, value) {
      obj[key] = value
      trigger(obj, key)        // 書かれた → 再描画を発火
      return true
    },
  })
}`}</Code>

      <Callout variant="info" title="Vue 2 との違い">
        Vue 2 は <Cmd>Object.defineProperty</Cmd> で各プロパティに getter/setter を仕込む方式でした。
        この方法では「後から追加したプロパティ」や「配列の添字直接代入」を検知できませんでした。
        Vue 3 の <Cmd>Proxy</Cmd> はオブジェクト全体を包むため、これらの制約が解消されています。
      </Callout>

      <Callout variant="warn" title="だから .value / reactive が必要">
        素の <Cmd>let n = 0; n++</Cmd> には Proxy を仕掛けられないため、Vue は変化を追跡できません。
        <Cmd>ref</Cmd> は内部でオブジェクト <Cmd>{`{ value: ... }`}</Cmd> を作り、その <Cmd>value</Cmd> を
        Proxy で監視しています。<strong>「値をオブジェクト経由で触る」</strong>のがリアクティビティの前提条件です。
      </Callout>

      <Bridge course="プログラミング言語論（メタプログラミング / リフレクション）">
        <Cmd>Proxy</Cmd> は JavaScript の<strong>メタプログラミング</strong>機能です。通常のプログラムが「値を操作」するのに対し、
        メタプログラミングは<strong>「操作そのものを操作」</strong>します。<Cmd>get</Cmd> / <Cmd>set</Cmd> といった
        基本演算（言語仕様では「内部メソッド」）へフックを差し込み、プロパティアクセスの意味を書き換えているのが Proxy です。
        座学の言葉では、これは<strong>リフレクション</strong>や<strong>アスペクト指向</strong>（横断的関心を透過的に挟む）に近い発想。
        Vue の作者は「依存追跡」という関心を、アプリのコードに一切書かせず、言語の低レイヤで透過的に注入しているわけです。
        Python の <Cmd>__getattr__</Cmd>、Ruby の <Cmd>method_missing</Cmd> と同じ系譜だと捉えると腑に落ちます。
      </Bridge>

      <Section>computed — 算出プロパティ</Section>
      <p>
        既存の状態から導かれる値は <Cmd>computed</Cmd> で定義します。依存する値が変わったときだけ再計算され、
        変わらなければ<strong>結果をキャッシュ</strong>します。テンプレートに複雑な式を書くより読みやすくなります。
      </p>

      <Code lang="vue" filename="computed">{`<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { name: 'コーヒー', price: 400 },
  { name: '紅茶', price: 380 },
])

// items が変わったときだけ再計算される
const total = computed(() =>
  items.value.reduce((sum, i) => sum + i.price, 0)
)
</script>

<template>
  <p>合計: {{ total }} 円</p>
</template>`}</Code>

      <TipBox>
        「<strong>状態を組み合わせて表示する値</strong>」は <Cmd>computed</Cmd>、
        「<strong>ユーザー操作への反応</strong>」は <Cmd>@click</Cmd> などのイベント、と役割を分けると設計が整います。
        メソッドで同じ計算をしても動きますが、<Cmd>computed</Cmd> はキャッシュが効くぶん効率的です。
      </TipBox>

      <Section>イベント処理のまとめ</Section>
      <p>状態・算出・イベントを組み合わせた、小さなカウンタ全体を見てみましょう。</p>

      <Code lang="vue" filename="Counter.vue">{`<template>
  <div>
    <button @click="decrement" :disabled="count <= 0">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
    <p>{{ doubled }}（2 倍）</p>
    <p v-if="count >= 10">10 に到達しました</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

const increment = () => { count.value++ }
const decrement = () => { if (count.value > 0) count.value-- }
</script>`}</Code>

      <Divider />

      <Section>実務での使いどころと、リアクティビティの落とし穴</Section>
      <p>
        ここまでの仕組みは、実務では「フォーム」「一覧の絞り込み」「ダッシュボードの集計表示」など、
        <strong>状態が頻繁に変わり、それが複数箇所に波及する画面</strong>で威力を発揮します。命令的に書けば
        更新漏れの温床になる箇所を、Vue は依存追跡で自動同期してくれます。一方で、Proxy ベースゆえの
        「追跡が切れる」パターンを知らないと、静かに壊れます。
      </p>

      <KVList
        items={[
          { key: "reactive の分割代入", val: "const { count } = state で取り出すと Proxy から外れ、以後の変化が追跡されない。toRefs で ref 化して渡す" },
          { key: "配列/オブジェクトの丸ごと差し替え", val: "reactive で包んだ変数自体への再代入（state = {...}）は参照が切れる。中身を書き換えるか ref を使う" },
          { key: "非リアクティブ値の混入", val: "props やローカル変数など「包まれていない値」に依存しても再描画は起きない。依存元は必ず ref/reactive にする" },
          { key: "深いネストの性能", val: "巨大なオブジェクトを reactive にすると全階層に Proxy が張られる。読み取り専用なら shallowRef / markRaw で追跡を抑える" },
        ]}
      />

      <Callout variant="danger" title="よくある「なぜか更新されない」の正体">
        「値は変わっているのに画面が動かない」— 8 割はこの<strong>追跡が切れた</strong>ケースです。
        デバッグの鉄則は「<strong>その値は Proxy 経由で読まれているか？</strong>」を確認すること。素の変数・分割代入した値・
        コンポーネント外で作った値は追跡対象外です。リアクティビティは魔法ではなく、
        <strong>get/set を横取りできる経路の上でだけ</strong>成立する、と理解すればバグの見通しが一気に良くなります。
      </Callout>

      <Figure src="/learn/shots/web/vue-01-01.svg" alt="Vue DevTools でコンポーネントのリアクティブな状態を一覧表示した画面" caption="追跡されている値かどうかは Vue DevTools で確認できる。ここに出なければ追跡は切れている" />

      <KeyPoints
        items={[
          "Vue は宣言的レンダリング＋リアクティビティが核。データを書き換えれば画面が追従する",
          "SFC（.vue）は template / script setup / style を 1 ファイルに同居させる",
          "テンプレートは補間 {{ }}・:（v-bind）・@（v-on）・v-if/v-for・v-model が基本",
          "リアクティブな値は ref（.value 必要／何でも包める）か reactive（オブジェクト専用）で作る",
          "仕組みは Proxy による get=track / set=trigger。だから素の変数ではなくオブジェクト経由が必須",
          "導出値は computed でキャッシュ、操作への反応はイベントハンドラで分担する",
        ]}
      />
    </>
  );
}

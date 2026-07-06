import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, KVList, TipBox, Bridge, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "vue-02",
  title: "Vue.js 入門② — Composition API と設計",
  description: "Composition API による状態・算出・監視・ライフサイクル、props/emit、provide/inject、composables による再利用まで実践的に。",
  domain: "web",
  section: "frontend",
  order: 14,
  level: "basic",
  tags: ["Vue", "CompositionAPI", "コンポーネント"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        入門①で掴んだ <Cmd>ref</Cmd> / <Cmd>computed</Cmd> を土台に、この記事では
        <strong>Composition API</strong> を使ったコンポーネント設計を実践します。
        監視（watch）、ライフサイクル、親子の受け渡し（props / emit）、階層をまたぐ共有（provide / inject）、
        そしてロジックを部品化する <strong>composables</strong> まで、再利用しやすい書き方を身につけます。
      </Lead>

      <Section>Composition API vs Options API</Section>
      <p>
        Vue にはコンポーネントの書き方が 2 系統あります。従来からある <strong>Options API</strong>（<Cmd>data</Cmd> /
        <Cmd>methods</Cmd> / <Cmd>computed</Cmd> をオプションとして並べる）と、Vue 3 で主流になった
        <strong>Composition API</strong>（関数として状態とロジックを組み立てる）です。
      </p>

      <ComparisonTable
        headers={["観点", "Options API", "Composition API"]}
        rows={[
          ["構造", "data / methods など役割で区切る", "関心ごとに自由にまとめる"],
          ["状態の宣言", "data() が返すオブジェクト", "ref / reactive"],
          ["ロジック再利用", "mixin（衝突しやすい）", "composables（明快）"],
          ["型推論(TS)", "やや弱い", "強い"],
          ["向くケース", "小規模・学習の入口", "中〜大規模・ロジック共有"],
        ]}
      />

      <Callout variant="info" title="どちらを学ぶべきか">
        新規開発では <strong>Composition API ＋ <Cmd>&lt;script setup&gt;</Cmd></strong> が推奨です。
        本記事もこの前提で進めます。Options API は既存コードを読むときに理解できれば十分です。
      </Callout>

      <SubSection>なぜ Composition API が生まれたか — 「関心の散逸」問題</SubSection>
      <p>
        Options API は <Cmd>data</Cmd> / <Cmd>methods</Cmd> / <Cmd>computed</Cmd> / <Cmd>watch</Cmd> という
        <strong>「種類（HOW）」で棚を分けます</strong>。小さいうちは整然としていますが、コンポーネントが育つと問題が起きます。
        たとえば「検索」という 1 つの機能に必要な状態・算出・監視が <Cmd>data</Cmd> と <Cmd>computed</Cmd> と
        <Cmd>watch</Cmd> の別々の棚に散らばり、<strong>1 つの関心事を追うのに画面を上下に往復</strong>する羽目になります。
      </p>
      <p>
        Composition API は逆に<strong>「関心事（WHAT）」でまとめます</strong>。「検索に関わる ref・computed・watch を
        ひとかたまりに書く」ことができ、さらにそのかたまりを丸ごと関数（composable）に切り出せます。
        これは単なる書き方の好みではなく、<strong>コードの物理的な配置を論理的な関心と一致させる</strong>という
        設計上の狙いです。
      </p>

      <Bridge course="ソフトウェア工学（凝集度 / 関心の分離）">
        Options API の弱点は、ソフトウェア工学でいう<strong>「論理的凝集」</strong>に近い状態です。
        同じ<strong>種類</strong>のコード（全 methods、全 data）を寄せ集めているだけで、<strong>意味的な関連は保証されない</strong>。
        Composition API が目指すのは最上位の<strong>「機能的凝集（functional cohesion）」</strong>—「1 つの目的のために協調する要素を
        1 か所に集める」状態です。座学で「凝集度は高く、結合度は低く」と学ぶ、その<strong>凝集度を上げる具体的手段</strong>が
        composable への切り出し。<strong>関心の分離（Separation of Concerns）</strong>を、ファイル分割ではなく
        <strong>関数の合成</strong>で実現しているのが Composition API の本質です。
      </Bridge>

      <Section>&lt;script setup&gt; の基本形</Section>
      <p>
        <Cmd>&lt;script setup&gt;</Cmd> はコンポーネントの「セットアップ処理」をトップレベルにそのまま書ける構文です。
        インポートした関数、宣言した <Cmd>ref</Cmd> や関数は、追加の <Cmd>return</Cmd> なしでテンプレートから使えます。
      </p>

      <Code lang="vue" filename="Basic.vue">{`<script setup>
import { ref, computed } from 'vue'

const first = ref('Yuma')
const last = ref('Saka')
const fullName = computed(() => \`\${last.value} \${first.value}\`)

const shout = () => { console.log(fullName.value.toUpperCase()) }
</script>

<template>
  <p>{{ fullName }}</p>
  <button @click="shout">叫ぶ</button>
</template>`}</Code>

      <Section>ref と reactive（詳しく）</Section>
      <p>
        入門①の復習ですが、設計の観点で使い分けを整理します。<Cmd>ref</Cmd> は個別の値を、
        <Cmd>reactive</Cmd> は「意味的にまとまった状態」を扱うのに向きます。
      </p>

      <Code lang="vue" filename="state.vue">{`<script setup>
import { ref, reactive } from 'vue'

// 単体の値は ref
const loading = ref(false)

// 関連する状態は reactive でまとめる手もある
const form = reactive({
  email: '',
  password: '',
})

const submit = () => {
  loading.value = true
  console.log(form.email, form.password)
}
</script>`}</Code>

      <TipBox>
        <Cmd>reactive</Cmd> の値をプロパティ単位で他へ渡すと反応が切れます。切りたくない場合は
        <Cmd>toRefs(form)</Cmd> で各プロパティを <Cmd>ref</Cmd> 化してから渡します。
        迷ったら <Cmd>ref</Cmd> 統一が最も事故が少ない選択です。
      </TipBox>

      <Section>computed — 算出プロパティ</Section>
      <p>
        依存が変わったときだけ再計算されキャッシュされる、派生値の定番です。
        書き込み可能な <Cmd>computed</Cmd>（getter / setter）も定義できます。
      </p>

      <Code lang="vue" filename="computed.vue">{`<script setup>
import { ref, computed } from 'vue'

const price = ref(1000)
const taxRate = ref(0.1)

// 読み取り専用の computed
const withTax = computed(() => Math.round(price.value * (1 + taxRate.value)))

// getter / setter を持つ computed
const priceStr = computed({
  get: () => \`\${price.value} 円\`,
  set: (v) => { price.value = Number(v.replace(/[^0-9]/g, '')) },
})
</script>

<template>
  <p>税込: {{ withTax }} 円</p>
  <input v-model="priceStr" />
</template>`}</Code>

      <Section>watch と watchEffect — 変化の監視</Section>
      <p>
        値の変化に反応して<strong>副作用</strong>（API 呼び出し・ログ・ローカル保存など）を実行したいときは
        監視 API を使います。<Cmd>computed</Cmd> は「新しい値を作る」、
        <Cmd>watch</Cmd> は「変化に反応して処理する」と役割が違います。
      </p>

      <SubSection>watch — 特定の値を明示的に監視</SubSection>
      <Code lang="vue" filename="watch.vue">{`<script setup>
import { ref, watch } from 'vue'

const keyword = ref('')
const results = ref([])

// keyword が変わるたびに実行。(新値, 旧値) を受け取れる
watch(keyword, async (next, prev) => {
  if (next === '') { results.value = []; return }
  console.log(\`\${prev} → \${next}\`)
  const res = await fetch(\`/api/search?q=\${next}\`)
  results.value = await res.json()
})
</script>`}</Code>

      <SubSection>watchEffect — 使った値を自動追跡</SubSection>
      <p>
        <Cmd>watchEffect</Cmd> は監視対象を明示せず、コールバック内で<strong>読んだリアクティブ値を自動で追跡</strong>します。
        初回に即実行される点も <Cmd>watch</Cmd> と違います。
      </p>

      <Code lang="vue" filename="watchEffect.vue">{`<script setup>
import { ref, watchEffect } from 'vue'

const userId = ref(1)
const user = ref(null)

// userId を読んでいるので、userId が変わると自動で再実行
watchEffect(async () => {
  const res = await fetch(\`/api/users/\${userId.value}\`)
  user.value = await res.json()
})
</script>`}</Code>

      <ComparisonTable
        headers={["観点", "watch", "watchEffect"]}
        rows={[
          ["監視対象", "明示的に指定", "実行時に自動追跡"],
          ["初回実行", "しない（オプションで可）", "する"],
          ["旧値の取得", "できる", "できない"],
          ["向くケース", "特定値の変化に反応", "複数依存をまとめて反応"],
        ]}
      />

      <Section>ライフサイクルフック</Section>
      <p>
        コンポーネントの生成から破棄までの各タイミングで処理を差し込めます。
        <Cmd>&lt;script setup&gt;</Cmd> では <Cmd>on〜</Cmd> 関数を呼ぶだけで登録できます。
      </p>

      <KVList
        items={[
          { key: "onMounted", val: "DOM に描画された直後。DOM 参照・初期データ取得・外部ライブラリ初期化に" },
          { key: "onUpdated", val: "リアクティブ変化で再描画された後" },
          { key: "onUnmounted", val: "破棄される時。タイマー解除・イベント購読解除など後始末に" },
          { key: "onBeforeMount", val: "描画直前（DOM 生成前）" },
        ]}
      />

      <Code lang="vue" filename="lifecycle.vue">{`<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const now = ref(new Date())
let timer

onMounted(() => {
  // マウント後にタイマー開始
  timer = setInterval(() => { now.value = new Date() }, 1000)
})

onUnmounted(() => {
  // 破棄時に必ず後始末（メモリリーク防止）
  clearInterval(timer)
})
</script>

<template>
  <p>{{ now.toLocaleTimeString() }}</p>
</template>`}</Code>

      <Callout variant="warn" title="後始末を忘れない">
        <Cmd>setInterval</Cmd> やイベントリスナ、外部ライブラリのインスタンスは
        <Cmd>onUnmounted</Cmd> で必ず解放します。放置するとコンポーネントが消えても処理が残り、メモリリークの原因になります。
      </Callout>

      <Divider />

      <Section>props と emit — 親子コンポーネント通信</Section>
      <p>
        Vue のデータフローは基本「<strong>親から子へ props で下ろし、子から親へ emit で上げる</strong>」の一方向です。
        <Cmd>&lt;script setup&gt;</Cmd> では <Cmd>defineProps</Cmd> / <Cmd>defineEmits</Cmd> を使います。
      </p>

      <SubSection>defineProps — 親から受け取る</SubSection>
      <Code lang="vue" filename="Child.vue">{`<script setup>
// 型と既定値を宣言できる
const props = defineProps({
  label: { type: String, required: true },
  count: { type: Number, default: 0 },
})
</script>

<template>
  <p>{{ props.label }}: {{ props.count }}</p>
</template>`}</Code>

      <SubSection>defineEmits — 親へ知らせる</SubSection>
      <p>
        子は props を<strong>直接書き換えてはいけません</strong>（一方向のため）。
        変更したいときは <Cmd>emit</Cmd> でイベントを発火し、親に処理を委ねます。
      </p>

      <Code lang="vue" filename="Counter.vue">{`<script setup>
const props = defineProps({ count: { type: Number, default: 0 } })
const emit = defineEmits(['increment', 'reset'])
</script>

<template>
  <button @click="emit('increment')">+</button>
  <button @click="emit('reset')">リセット</button>
  <span>{{ props.count }}</span>
</template>`}</Code>

      <Code lang="vue" filename="Parent.vue">{`<script setup>
import { ref } from 'vue'
import Counter from './Counter.vue'

const total = ref(0)
</script>

<template>
  <!-- props は : で渡し、emit は @ で受ける -->
  <Counter
    :count="total"
    @increment="total++"
    @reset="total = 0"
  />
</template>`}</Code>

      <Callout variant="tip" title="v-model は props + emit の糖衣">
        親子で双方向にしたいときは、子で <Cmd>defineModel()</Cmd> を使うと
        <Cmd>&lt;Child v-model="value" /&gt;</Cmd> のように書けます。内部的には
        <Cmd>modelValue</Cmd> という props と <Cmd>update:modelValue</Cmd> emit の組み合わせです。
      </Callout>

      <Section>provide と inject — 階層をまたぐ共有</Section>
      <p>
        props は親→子の 1 段ずつのリレーです。深くネストしたコンポーネントへ同じ値を届けるのに
        props をバケツリレーするのは面倒です（prop drilling）。
        <Cmd>provide</Cmd> / <Cmd>inject</Cmd> は、祖先が提供した値を任意の子孫が直接受け取れる仕組みです。
      </p>

      <Steps>
        <Step title="祖先で provide">
          祖先コンポーネントがキーと値を <Cmd>provide</Cmd> で提供する。値に <Cmd>ref</Cmd> を渡せばリアクティブに共有できる。
        </Step>
        <Step title="子孫で inject">
          任意の深さの子孫が同じキーで <Cmd>inject</Cmd> して受け取る。間のコンポーネントを経由する必要がない。
        </Step>
      </Steps>

      <Code lang="vue" filename="App.vue">{`<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')
// キー 'theme' で子孫全体に提供
provide('theme', theme)
</script>`}</Code>

      <Code lang="vue" filename="DeepChild.vue">{`<script setup>
import { inject } from 'vue'

// 何段下にいても直接受け取れる。第2引数は既定値
const theme = inject('theme', 'light')
</script>

<template>
  <div :class="theme">現在のテーマ: {{ theme }}</div>
</template>`}</Code>

      <Callout variant="warn" title="使いすぎに注意">
        <Cmd>provide</Cmd> / <Cmd>inject</Cmd> は依存関係が暗黙的になり、追いにくくなります。
        「テーマ」「ロケール」「認証ユーザー」のような<strong>広範囲で共有する横断的関心</strong>に限定し、
        通常の親子データは props / emit を使いましょう。
      </Callout>

      <Divider />

      <Section>composables — ロジックの再利用</Section>
      <p>
        Composition API 最大の恩恵が <strong>composable</strong> です。
        <Cmd>ref</Cmd> や <Cmd>watch</Cmd> を使った<strong>ステートフルなロジックを普通の関数に切り出し</strong>、
        複数コンポーネントで共有します。慣習として <Cmd>use〜</Cmd> と命名します。
      </p>

      <FlowChain
        nodes={[
          { label: "useMouse", sub: "座標追跡" },
          { label: "useFetch", sub: "非同期取得" },
          { label: "合成", sub: "組み合わせ", variant: "alt" },
          { label: "Component", sub: "利用側", variant: "cta" },
        ]}
        caption="小さな composable を関数のように合成し、コンポーネントは必要な機能を「呼ぶだけ」で取り込む"
      />

      <Bridge course="関数型プログラミング（合成 / 高階関数）">
        composable は関数型の<strong>関数合成（composition）</strong>の考え方を状態管理に持ち込んだものです。
        「小さく、単一の責務を持ち、値（ここではリアクティブ状態）を返す関数」を作り、それらを組み合わせて
        大きな振る舞いを作る。<Cmd>useMouse()</Cmd> や <Cmd>useFetch()</Cmd> は<strong>参照透過ではない</strong>（内部状態を持つ）ものの、
        「入力→戻り値」で機能を配布する形は高階関数・カリー化と同じ発想です。座学で学ぶ「純粋関数は組み合わせやすい」の
        延長で、composable も<strong>他の composable を内部で呼んで合成できる</strong>（例: <Cmd>useAuth</Cmd> が内部で
        <Cmd>useFetch</Cmd> を使う）。Options API の <Cmd>mixin</Cmd> が「継承的に混ぜて名前が衝突する」のに対し、
        composable は「合成的に組み立てて衝突しない」— これは<strong>継承より合成（composition over inheritance）</strong>の
        原則そのものです。
      </Bridge>

      <p>例として「マウス座標を追う」ロジックを composable に切り出します。</p>

      <Code lang="js" filename="composables/useMouse.js">{`import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => { x.value = e.pageX; y.value = e.pageY }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // リアクティブな状態を返す
  return { x, y }
}`}</Code>

      <Code lang="vue" filename="Any.vue">{`<script setup>
import { useMouse } from './composables/useMouse'

// 関数を呼ぶだけで状態とロジックを取り込める
const { x, y } = useMouse()
</script>

<template>
  <p>マウス位置: {{ x }}, {{ y }}</p>
</template>`}</Code>

      <p>非同期データ取得のように「状態＋処理」をまとめて配布したいときも同じ形です。</p>

      <Code lang="js" filename="composables/useFetch.js">{`import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)

  fetch(url)
    .then((r) => r.json())
    .then((json) => { data.value = json })
    .catch((e) => { error.value = e })
    .finally(() => { loading.value = false })

  return { data, error, loading }
}`}</Code>

      <Callout variant="tip" title="composable の設計指針">
        <ul>
          <li><Cmd>use〜</Cmd> と命名し、内部で <Cmd>ref</Cmd> などのリアクティブ状態を作る</li>
          <li>状態と操作関数を<strong>オブジェクトで返す</strong>（分割代入で受け取れる）</li>
          <li>副作用（リスナ登録など）は <Cmd>onMounted</Cmd> / <Cmd>onUnmounted</Cmd> で開始・後始末する</li>
        </ul>
        Options API の <Cmd>mixin</Cmd> と違い、名前の衝突が起きず、どこから来た状態か一目で分かるのが利点です。
      </Callout>

      <SubSection>composable を合成する — 関数の積み木</SubSection>
      <p>
        composable の真価は、<strong>composable が別の composable を呼べる</strong>点にあります。
        低レベルの部品を組み合わせ、より意味のある機能を作れます。
      </p>

      <Code lang="js" filename="composables/useUser.js">{`import { computed } from 'vue'
import { useFetch } from './useFetch'   // 下位の composable を再利用

export function useUser(id) {
  // useFetch の状態をそのまま土台にする（合成）
  const { data, loading, error } = useFetch(\`/api/users/\${id}\`)

  // 上位の関心だけを足す
  const displayName = computed(() =>
    data.value ? \`\${data.value.name} さん\` : '読み込み中'
  )

  return { user: data, displayName, loading, error }
}`}</Code>

      <TipBox>
        <Cmd>useUser</Cmd> は「HTTP をどう叩くか」を <Cmd>useFetch</Cmd> に委ね、自分は「ユーザー表示名を作る」ことだけに集中しています。
        各層が単一の責務を持ち、下位の実装を差し替えても上位は影響を受けにくい。これが<strong>層状の合成</strong>の効き目です。
      </TipBox>

      <Section>実務での設計判断と落とし穴</Section>
      <p>
        composable と <Cmd>provide</Cmd>/<Cmd>inject</Cmd>、そしてストア（Pinia など）は
        「状態をどこに置くか」の選択肢です。粒度を誤ると、共有しすぎて追えなくなったり、逆に重複したりします。
      </p>

      <KVList
        items={[
          { key: "composable のインスタンス性", val: "呼ぶたびに新しい状態を作る（useMouse を2箇所で呼べば座標も2つ）。全体で1つにしたいならストア/inject を使う" },
          { key: "後始末の責務", val: "リスナ登録した composable は onUnmounted で必ず解除。使う側に後始末を強要しない設計にする" },
          { key: "SSR 安全性", val: "window など「サーバに無いもの」への依存は onMounted 内に閉じ込める。トップレベルで触ると SSR で落ちる" },
          { key: "過度な抽象化", val: "1箇所でしか使わないロジックを無理に composable 化しない。再利用の見込みが出てから切り出す（YAGNI）" },
        ]}
      />

      <Callout variant="warn" title="composable は「状態の共有」ではなく「ロジックの共有」">
        よくある誤解が「composable を使えば状態が共有される」というもの。実際は<strong>呼ぶたびに独立した状態が生まれます</strong>。
        「アプリ全体で 1 つの状態（ログインユーザーなど）」が欲しいなら、composable ではなく<strong>ストア</strong>や
        <Cmd>provide</Cmd>/<Cmd>inject</Cmd> の役目です。「ロジックの再利用（composable）」と「状態の集約（store）」を
        混同しないことが、破綻しない設計の分かれ目になります。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "新規開発は Composition API ＋ <script setup> が推奨。関心ごとにロジックをまとめられる",
          "派生値は computed（キャッシュあり）、副作用は watch / watchEffect で分担する",
          "watch は明示監視＋旧値取得、watchEffect は自動追跡＋初回実行",
          "ライフサイクルは onMounted で初期化、onUnmounted で後始末（リーク防止）",
          "親子通信は props で下ろし emit で上げる一方向。props の直接書き換えは禁止",
          "階層をまたぐ共有は provide / inject を横断的関心に限定して使う",
          "ステートフルなロジックは use〜 の composable に切り出して再利用する",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import {
  Lead,
  Section,
  SubSection,
  Callout,
  Code,
  Cmd,
  Bridge,
  Steps,
  Step,
  KeyPoints,
  ComparisonTable,
  KVList,
  TipBox,
  Figure,
  Divider,
} from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "react-vue-angular-compare",
  title: "React・Vue・Angular の比較と使い分け",
  description:
    "3 大フロントエンドフレームワークを、思想・記法・学習コスト・状態管理・エコシステム・パフォーマンスで比較し、プロジェクト別の選び方を示す。",
  domain: "web",
  section: "frontend",
  order: 17,
  level: "basic",
  tags: ["React", "Vue", "Angular", "比較"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        SPA（シングルページアプリケーション）開発の主役は、長らく
        <strong> React・Vue・Angular </strong>
        の 3 つです。どれも「宣言的な UI」「コンポーネント指向」「仮想 DOM やリアクティブ更新による差分描画」という共通の発想を持ちますが、
        <strong>設計思想</strong>と<strong>提供範囲</strong>が大きく異なります。ここでは中立的に、それぞれの強みと選び方を整理します。
      </Lead>

      <Section>技術選定は「トレードオフの意思決定」である</Section>
      <p>
        3 つのフレームワークの比較に入る前に、そもそも「フレームワークを選ぶ」という行為が何なのかを座学の言葉で捉え直しておきましょう。ソフトウェア工学では、
        <strong>唯一の正解が存在せず、複数の相反する品質特性を天秤にかける判断</strong>を「設計上のトレードオフ（design trade-off）」と呼びます。フレームワーク選定はその典型例です。
      </p>
      <p>
        性能を上げれば学習コストや自由度が犠牲になり、自由度を上げれば統一性やチームの立ち上げ速度が犠牲になる——このように、一つの軸を良くすると別の軸が悪化する関係を意識するのが出発点です。だからこそ「どのフレームワークが優れているか」という問いは筋が悪く、
        <strong>「自分たちのプロジェクトはどの軸を優先すべきか」</strong>を先に決める必要があります。
      </p>
      <Bridge course="ソフトウェア工学 / 非機能要件">
        座学の「非機能要件（non-functional requirements）」——性能・保守性・移植性・信頼性・学習容易性など、機能そのものではなく「どう作られているか」の品質——が、そのまま技術選定の評価軸になります。ISO/IEC 25010 の品質モデルが挙げる特性（保守性・効率性・使用性…）を思い出すと、下の比較表の各行がなぜその軸なのかが腑に落ちます。フレームワーク比較とは、抽象的だった非機能要件を具体的な選択肢に落とす演習そのものです。
      </Bridge>

      <SubSection>どの軸で比べるか（評価軸の設計）</SubSection>
      <p>
        比較を始めるには、まず<strong>比較する軸（criteria）</strong>を明示的に決めます。軸が曖昧なまま「なんとなく React が人気だから」で選ぶのは、意思決定理論でいう「基準なき選択」であり、後から後悔しやすい典型パターンです。本記事では次の 6 つの軸を採用します。
      </p>
      <KVList
        items={[
          { key: "提供範囲（scope）", val: "UI だけか、ルーティング・状態・通信まで含むか。責任分界点をどこに引くか。" },
          { key: "学習容易性（learnability）", val: "扱う概念の数と記法の直感性。チームが立ち上がるまでの時間。" },
          { key: "保守性・一貫性（maintainability）", val: "規約の強さ。大人数・長期でコードが散らからないか。" },
          { key: "性能（performance）", val: "初期描画・更新・バンドルサイズ。ただし実装品質に強く依存する。" },
          { key: "型安全性（type safety）", val: "TypeScript との親和性。コンパイル時に誤りをどれだけ捕まえられるか。" },
          { key: "エコシステム（ecosystem）", val: "ライブラリ・情報・人材の集めやすさ。技術以外のリスク要因。" },
        ]}
      />
      <Callout variant="tip" title="軸に重み付けをする">
        軸を並べたら、次はプロジェクトごとに<strong>重み（優先度）</strong>を付けます。スタートアップの MVP なら「学習容易性・立ち上げ速度」の重みが大きく、10 年運用する銀行の基幹系なら「保守性・一貫性・型安全性」の重みが大きい。同じ比較表でも、重みが違えば結論は変わります。これが意思決定を「感覚」から「説明可能な判断」に変えるコツです。
      </Callout>

      <Section>3 つの設計思想</Section>
      <p>
        まず理解すべきは「どこまでを自分たちで担うか」という提供範囲の違いです。3 者はライブラリ寄りからフルスタックまで、きれいにグラデーションを描いています。
      </p>
      <KVList
        items={[
          {
            key: "React（ライブラリ寄り）",
            val: "UI 描画に特化。ルーティング・状態管理・データ取得は別ライブラリを組み合わせて構成する。自由度が高く、選定の責任も開発者側にある。",
          },
          {
            key: "Vue（プログレッシブ）",
            val: "小さく始めて段階的に拡張できる設計。ルーター（Vue Router）や状態管理（Pinia）を公式が用意し、必要に応じて足していける。",
          },
          {
            key: "Angular（フルスタック）",
            val: "ルーティング・HTTP・フォーム・DI・テストまで公式が一式提供する「フレームワーク」。規約が強く、大規模でも統一が保たれる。",
          },
        ]}
      />
      <Callout variant="info" title="ライブラリとフレームワークの違い">
        React は厳密には UI「ライブラリ」で、Angular は「フレームワーク」です。Vue はその中間。この立ち位置の差が、後述する学習コストやチーム運用の性質に直結します。
      </Callout>
      <p>
        この違いは座学で習う<strong>制御の反転（Inversion of Control, IoC）</strong>という概念で説明できます。ライブラリは「あなたがライブラリを呼ぶ」構造で、主導権はアプリ側にあります。フレームワークは「フレームワークがあなたのコードを呼ぶ」構造（いわゆるハリウッド原則: Don't call us, we'll call you）で、主導権は枠組み側にあります。Angular はルーティングやライフサイクルを枠組みが主導し、React は描画以外の主導権を開発者に残す——この一点が、後述する自由度と一貫性のトレードオフの源泉です。
      </p>
      <Bridge course="ソフトウェア工学 / デザインパターン">
        講義で出てくる「制御の反転」「依存性注入（DI）」は抽象的で掴みにくいですが、Angular はまさに DI を中核に据えたフレームワークです。<Cmd>@Injectable</Cmd> なサービスをコンストラクタ引数で受け取る書き方は、座学の DI コンテナそのもの。React で <Cmd>props</Cmd> や Context を手で配線するのと比べると、「枠組みに依存関係の解決を委ねる」という DI の狙いが実感として分かります。
      </Bridge>

      <Section>記法の違い</Section>
      <p>同じ「ボタンを押すとカウントが増える」UI を、3 者はそれぞれ違うスタイルで書きます。</p>

      <SubSection>React — JSX</SubSection>
      <p>JavaScript の中に UI を書く JSX。ロジックとマークアップが同じ関数内に同居します。</p>
      <Code lang="tsx" filename="Counter.tsx">{`function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>count: {count}</button>;
}`}</Code>

      <SubSection>Vue — SFC（単一ファイルコンポーネント）</SubSection>
      <p>
        template・script・style を 1 ファイルにまとめる SFC。HTML に近いテンプレート記法で、ディレクティブ（
        <Cmd>v-if</Cmd>・<Cmd>v-for</Cmd> 等）を使います。
      </p>
      <Code lang="vue" filename="Counter.vue">{`<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <button @click="count++">count: {{ count }}</button>
</template>`}</Code>

      <SubSection>Angular — デコレータ + テンプレート</SubSection>
      <p>
        TypeScript のクラスに <Cmd>@Component</Cmd> デコレータを付け、テンプレートと分離して記述します。近年は Signals による簡潔な記法も加わりました。
      </p>
      <Code lang="ts" filename="counter.component.ts">{`@Component({
  selector: "app-counter",
  template: '<button (click)="count.set(count() + 1)">count: {{ count() }}</button>',
})
export class CounterComponent {
  count = signal(0);
}`}</Code>

      <Section>学習コスト</Section>
      <p>
        習得のしやすさは、扱う概念の数とテンプレート記法の直感性で決まります。
      </p>
      <ul>
        <li>
          <strong>Vue</strong> — HTML ライクなテンプレートで最も入りやすい。初学者や小規模チームの立ち上げが速い。
        </li>
        <li>
          <strong>React</strong> — JSX と JavaScript の知識があれば始められるが、状態・副作用（useEffect）・レンダリングの理解や、周辺ライブラリ選定の学習が続く。
        </li>
        <li>
          <strong>Angular</strong> — DI・RxJS・モジュール構成など前提概念が多く、初期の学習コストは最も高い。ただし覚えれば大規模で一貫して書ける。
        </li>
      </ul>

      <Section>状態管理</Section>
      <p>アプリ全体で共有する状態の扱い方も、思想の違いがそのまま出ます。</p>
      <KVList
        items={[
          {
            key: "React",
            val: "軽量なら Context API、本格的には Redux Toolkit・Zustand・Jotai 等から選択。選択肢が豊富な反面、決めるのは開発者。",
          },
          {
            key: "Vue",
            val: "公式の Pinia が事実上の標準。リアクティブシステムと自然に統合され、記述量が少ない。",
          },
          {
            key: "Angular",
            val: "軽量なら Signals（公式のリアクティブプリミティブ）、大規模の複雑な状態には NgRx（Redux 系）。",
          },
        ]}
      />

      <Section>TypeScript 親和性</Section>
      <p>2025〜2026 年時点では、3 者とも TypeScript が実質標準です。</p>
      <ul>
        <li>
          <strong>Angular</strong> — TypeScript で書かれ、TS 前提で設計されている。型の恩恵が最も自然に効く。
        </li>
        <li>
          <strong>React</strong> — 型定義が成熟し、TSX で堅牢に書ける。Props やフックの型付けも定番化している。
        </li>
        <li>
          <strong>Vue</strong> — Vue 3 以降、<Cmd>script setup</Cmd> と Composition API で型推論が大幅に改善。SFC でも快適に型が効く。
        </li>
      </ul>

      <Section>エコシステム・求人・コミュニティ</Section>
      <p>
        技術選定は性能だけでなく「人が集まるか」「情報が見つかるか」も重要です。
      </p>
      <ul>
        <li>
          <strong>React</strong> — 最大のシェアと求人数。Next.js をはじめメタフレームワークやサードパーティが圧倒的に豊富。情報量も最多。
        </li>
        <li>
          <strong>Vue</strong> — 中国・日本・欧州を中心に根強い人気。Nuxt という強力なメタフレームワークを持つ。ドキュメントの質が高い。
        </li>
        <li>
          <strong>Angular</strong> — Google が支援し、金融・業務系など大企業の採用が多い。長期サポートと安定性を重視する現場に強い。
        </li>
      </ul>

      <Section>パフォーマンス</Section>
      <p>
        実アプリの体感速度は、フレームワーク素の差よりも設計や実装の質に左右されるのが実情です。それでも傾向はあります。
      </p>
      <ul>
        <li>
          <strong>Vue</strong> — コンパイル時最適化とリアクティブシステムで、素の描画性能が高いとされる。
        </li>
        <li>
          <strong>React</strong> — 仮想 DOM ベース。React Compiler（メモ化の自動化）など、実行時最適化の改善が進んでいる。
        </li>
        <li>
          <strong>Angular</strong> — 従来はやや重かったが、Signals と新しい変更検知、スタンドアロン構成で軽量化・高速化が大きく進んだ。
        </li>
      </ul>
      <TipBox>
        バンドルサイズや起動速度が最重要なら、事前計測（Lighthouse 等）で判断すること。フレームワーク名だけで速い/遅いを決めない。
      </TipBox>

      <Figure src="/learn/shots/web/react-vue-angular-compare-01.svg" alt="Lighthouse の計測レポート画面" caption="速い/遅いはフレームワーク名ではなく、こうした実測値で判断する" />

      <Divider />

      <Section>多軸比較表</Section>
      <ComparisonTable
        headers={["軸", "React", "Vue", "Angular"]}
        rows={[
          ["提供範囲", "ライブラリ（UI 中心）", "プログレッシブ", "フルスタック FW"],
          ["記法", "JSX", "SFC（テンプレート）", "デコレータ + テンプレート"],
          ["学習コスト", "中", "低", "高"],
          ["状態管理", "Context / Redux / Zustand", "Pinia（公式標準）", "Signals / NgRx"],
          ["TypeScript", "成熟・定番", "Vue 3 で大幅改善", "ネイティブ（TS 前提）"],
          ["メタ FW", "Next.js", "Nuxt", "Angular 本体に内包"],
          ["主な採用層", "スタートアップ〜大企業まで広い", "中小・個人・アジア圏に厚い", "大企業・業務系に厚い"],
          ["求人・情報量", "最多", "多い", "安定して一定数"],
        ]}
      />

      <Section>使い分けの指針</Section>
      <p>「どれが優れているか」ではなく「どんなプロジェクトにどれが合うか」で選ぶのが正解です。</p>
      <KVList
        items={[
          {
            key: "React を選ぶ",
            val: "自由に構成を組みたい / 求人・採用のしやすさを重視 / Next.js でフルスタックにしたい / エコシステムの広さが欲しい。",
          },
          {
            key: "Vue を選ぶ",
            val: "小さく速く立ち上げたい / チームの学習コストを抑えたい / テンプレート記法が好み / Nuxt を使いたい。",
          },
          {
            key: "Angular を選ぶ",
            val: "大規模・長期運用の業務システム / 強い規約でチームを統一したい / TypeScript と DI を全面活用したい / 一式が公式に揃う安心感が欲しい。",
          },
        ]}
      />
      <Callout variant="tip" title="迷ったら">
        個人開発・学習・求人重視なら React、素早い立ち上げやテンプレート志向なら Vue、堅牢な大規模業務系なら Angular、というのが無難な出発点です。最終的にはチームの既存スキルと採用計画が決め手になります。
      </Callout>

      <SubSection>意思決定の手順（重み付きスコアリング）</SubSection>
      <p>
        「なんとなく」で選ばないために、実務では次のように<strong>軸 × 重み × 評点</strong>で機械的に絞り込みます。これは意思決定理論の「加重和モデル（Weighted Scoring Model）」の簡易版です。
      </p>
      <Steps>
        <Step title="プロジェクトの非機能要件を洗い出す">
          「5 年運用する」「エンジニアを毎年採用する」「初期リリースを 2 か月で」など、制約と目標を言語化する。ここが軸の重み付けの根拠になる。
        </Step>
        <Step title="軸ごとに重みを付ける">
          上で決めた要件から、6 つの軸に 1〜5 の重みを割り振る。長期業務系なら保守性・型安全性を高く、MVP なら学習容易性・立ち上げ速度を高く。
        </Step>
        <Step title="候補を評点し、加重和を取る">
          各フレームワークを軸ごとに採点し、重みを掛けて合計する。数値そのものより「どの軸が効いて差がついたか」を見る。
        </Step>
        <Step title="既存スキルと採用計画で最終補正">
          スコアが拮抗したら、チームが既に書ける言語・フレームワークと、今後採用しやすい人材で決める。技術的正しさより組織的現実が勝つ場面。
        </Step>
      </Steps>
      <Callout variant="warn" title="選定でハマりやすい落とし穴">
        <ul>
          <li><strong>流行だけで選ぶ</strong> — 「今 React が熱いから」は軸なき選択。半年後に運用するのは自分たちで、流行は要件ではない。</li>
          <li><strong>ベンチマークを鵜呑みにする</strong> — フレームワーク素の速度差は、実アプリでは実装品質や設計に埋もれることが多い。自分のユースケースで計測せずに「速い/遅い」を断定しない。</li>
          <li><strong>チームのスキルを無視する</strong> — 最高評点の技術でも、誰も書けなければ生産性は最低になる。既存スキルは最大級の重みを持つ隠れた軸。</li>
          <li><strong>移行コストを見落とす</strong> — 一度選んだフレームワークの乗り換えは高コスト。可逆性の低い決定ほど、慎重に軸を検討する（アーキテクチャの「後戻りできない決定」）。</li>
        </ul>
      </Callout>
      <Bridge course="意思決定理論 / プロジェクトマネジメント">
        この手順は、座学の「多基準意思決定（MCDM: Multi-Criteria Decision Making）」や「加重和モデル」の実践そのものです。重要度の異なる複数基準を数値化し、重み付きで統合して選ぶ——という枠組みは、フレームワーク選定に限らずクラウド選定・ライブラリ選定・アーキテクチャ選定すべてに使い回せます。理論を一度実装に落とすと、以後あらゆる技術選定が「説明できる判断」になります。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "React はライブラリ寄り、Vue はプログレッシブ、Angular はフルスタック。提供範囲がそのまま思想の差",
          "記法は JSX / SFC / デコレータ+テンプレートで三者三様。学習コストは Vue < React < Angular が目安",
          "状態管理は Context・Redux 系 / Pinia / Signals・NgRx。TypeScript は 3 者とも実質標準",
          "React はエコシステムと求人が最大、Vue は立ち上げの速さ、Angular は大規模の一貫性が強み",
          "「優劣」ではなく「プロジェクトとチームへの適合」で選ぶ",
        ]}
      />
    </>
  );
}

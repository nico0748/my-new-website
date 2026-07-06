import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, TipBox, Bridge, KeyPoints, Divider } from "../../../components/learn/kit";
import { LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "backend-node-ecosystem",
  title: "Node.js / Express / NestJS / Next.js とは — 関係を整理",
  description: "JavaScript でサーバーを作るときに登場する Node.js・Express・NestJS・Next.js。それぞれが何で、どういう関係にあり、どう使い分けるのかを最初に整理する。",
  domain: "web",
  section: "backend",
  order: 7,
  level: "intro",
  tags: ["Node.js", "Express", "NestJS", "バックエンド"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        JavaScript でサーバーサイドを書こうとすると、<strong>Node.js</strong>・<strong>Express</strong>・<strong>NestJS</strong>・<strong>Next.js</strong> といった名前が一気に出てきて混乱しがちです。これらは競合しているわけではなく、多くは<strong>「土台」と「その上に乗るもの」</strong>という層の違いです。まず全体の地図を頭に入れてから各論に進みましょう。
      </Lead>

      <Section>まず結論 — 一枚で捉える</Section>
      <p>
        一番の勘所は、<strong>Node.js だけが「実行環境（ランタイム）」</strong>であり、残りの 3 つはその上で動く<strong>「フレームワーク／ライブラリ」</strong>だという点です。Node.js は JavaScript を動かすエンジンそのもので、Express・NestJS・Next.js は「Node.js の上でどう Web アプリを組み立てるか」を助けてくれる道具です。
      </p>

      <Code lang="text" filename="階層イメージ">{`┌─────────────────────────────────────────────┐
│  あなたのアプリ（ビジネスロジック）           │
├───────────────┬───────────────┬─────────────┤
│   Express     │    NestJS     │   Next.js   │  ← フレームワーク
│  （最小・自由）│（本格・TS・DI）│（React 統合）│
├───────────────┴───────────────┴─────────────┤
│              Node.js（ランタイム）            │  ← JS 実行環境
├─────────────────────────────────────────────┤
│           V8 エンジン + OS（Linux 等）        │
└─────────────────────────────────────────────┘`}</Code>

      <LayerStack
        layers={[
          { label: "あなたのアプリ" },
          { label: "フレームワーク", sub: "Express / NestJS / Next.js" },
          { label: "Node.js", sub: "JavaScript 実行環境（ランタイム）" },
          { label: "OS", sub: "Linux / macOS / Windows" },
        ]}
        caption="Node.js の上にフレームワークが乗る"
      />

      <Callout variant="info" title="ランタイムとフレームワークは別レイヤ">
        「Node.js か Express か」という二択は成り立ちません。Express も NestJS も <strong>Node.js の上で動きます</strong>。選ぶのは「Node.js の上に何のフレームワークを乗せるか」です。
      </Callout>

      <Bridge course="ソフトウェアアーキテクチャ / システムソフトウェア">
        この「土台の上に道具が積み重なる」構図は、講義で学ぶ<strong>抽象化の層（レイヤードアーキテクチャ）</strong>そのものです。OS がハードウェアを抽象化し、ランタイムが OS を抽象化し、フレームワークがランタイムを抽象化する——各層は<strong>下位の詳細を隠し、上位に扱いやすいインターフェースを見せる</strong>。この積み重ねの見方を持つと、新しい技術名が出てきても「これはどの層の、何を抽象化する道具か？」と一段で整理できます。名前の暗記ではなく<strong>層の地図</strong>で捉えるのが、エコシステム理解の本質です。
      </Bridge>

      <Section>それぞれが何なのか</Section>

      <SubSection>Node.js — JavaScript 実行環境（ランタイム）</SubSection>
      <p>
        本来ブラウザの中でしか動かなかった JavaScript を、<strong>ブラウザの外（サーバー・PC）で動かせるようにしたのが Node.js</strong> です。Google Chrome の JavaScript エンジン「V8」に、ファイル読み書きやネットワーク通信といった OS 機能へのアクセスを足したものだと考えてください。これ単体でも <Cmd>http</Cmd> モジュールを使えば Web サーバーは作れますが、記述は素朴で手間がかかります。
      </p>

      <SubSection>Express — 最小・自由な Web フレームワーク</SubSection>
      <p>
        Node.js だけでサーバーを書くと定型処理が多く煩雑です。それを<strong>「ルーティング」と「ミドルウェア」という 2 つの単純な概念だけ</strong>で薄く包んだのが Express です。機能が少ない分だけ自由で学びやすく、REST API や小〜中規模サーバーの定番。構造は自分で決める必要があります。
      </p>

      <SubSection>NestJS — 本格・TypeScript・DI のフレームワーク</SubSection>
      <p>
        Express の「自由さ」は、規模が大きくなると<strong>「決まった型がなくて散らかる」</strong>という弱点に変わります。NestJS は Angular に似た <strong>Module / Controller / Service</strong> の構造と <strong>DI（依存性注入）</strong>を最初から強制し、TypeScript 前提で大規模でも破綻しにくい設計を提供します。内部では Express（または Fastify）が動いています。
      </p>
      <p>
        この <strong>Controller（受付）／ Service（業務ロジック）／ Repository（データ）</strong>という役割分担は、まさに<strong>関心の分離（Separation of Concerns）</strong>を構造として強制するものです。「HTTP を受ける係」と「ビジネスルールを持つ係」と「DB を触る係」を分けておけば、片方を差し替えても他方が壊れません。
      </p>

      <Code lang="typescript" filename="users.controller.ts">{`@Controller("users")
export class UsersController {
  // Service を「注入」してもらう（自分で new しない）
  constructor(private readonly users: UsersService) {}

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.users.findOne(id); // 業務ロジックは Service 側に委譲
  }
}`}</Code>

      <Bridge course="ソフトウェア設計 / オブジェクト指向設計">
        NestJS の <strong>DI（依存性注入）</strong>は、講義で学ぶ<strong>依存性逆転の原則（DIP）</strong>と<strong>疎結合／高凝集</strong>の実装です。上のコードで <Cmd>UsersController</Cmd> は <Cmd>UsersService</Cmd> を <strong>自分で <Cmd>new</Cmd> せず、外から渡してもらう</strong>——これにより両者の結合が緩み、テスト時にはモックの Service に差し替えられます。「関心の分離」「単一責任の原則（SRP）」「テスタビリティ」といった設計論の用語が、フレームワークの構造そのものに埋め込まれています。理論を知っていると、なぜ NestJS がこの窮屈な形を強制するのかが腑に落ちます。
      </Bridge>

      <SubSection>Next.js — React フルスタックフレームワーク</SubSection>
      <p>
        Next.js は他の 3 つとは少し毛色が違い、<strong>React を使った「フロントエンド寄り」のフルスタックフレームワーク</strong>です。画面（React コンポーネント）を SSR/SSG で描画するのが主目的ですが、<strong>API Routes / Route Handlers</strong> によってバックエンド（API エンドポイント）も同じプロジェクト内に持てます。「画面と API を一体で作りたい」ときの選択肢です。
      </p>

      <Callout variant="tip" title="Next.js はここでは脇役">
        このバックエンド章の主役は Node.js・Express・NestJS です。Next.js は React の章で本格的に扱いますが、「API も書けるフルスタック React」という位置づけだけここで押さえておけば十分です。
      </Callout>

      <Section>比較表で使い分けを掴む</Section>
      <ComparisonTable
        headers={["", "Node.js", "Express", "NestJS", "Next.js"]}
        rows={[
          ["種類", "ランタイム", "フレームワーク", "フレームワーク", "フレームワーク"],
          ["層", "土台", "Node の上", "Node の上", "Node の上"],
          ["主目的", "JS を実行", "軽量 Web / API", "大規模 Web / API", "React 画面 + API"],
          ["言語", "JS / TS", "JS / TS", "TS 前提", "JS / TS"],
          ["構造の強制", "なし", "弱い（自由）", "強い（型あり）", "中（規約あり）"],
          ["DI", "なし", "なし", "標準搭載", "なし"],
          ["学習コスト", "中", "低", "高", "中"],
        ]}
      />

      <Section>どれを選ぶか — 実践的な指針</Section>
      <KVList
        items={[
          { key: "とにかく仕組みを理解したい", val: "まず Node.js の標準モジュールで小さなサーバーを書く" },
          { key: "軽い API / 小〜中規模サーバー", val: "Express（自由・学習コストが低い）" },
          { key: "大規模・チーム開発・長期運用", val: "NestJS（構造と DI で破綻を防ぐ）" },
          { key: "画面（React）と API を一体で作る", val: "Next.js（Route Handlers で API も同居）" },
        ]}
      />
      <TipBox>
        迷ったら「規模」で決めるのが実務的です。個人・小規模なら Express、チームで長く育てるなら NestJS。両者とも土台は Node.js なので、Node.js の理解は必ず先に効いてきます。
      </TipBox>

      <Bridge course="システム設計 / ソフトウェア工学">
        「小規模は自由な Express、大規模は構造を強制する NestJS」という選択は、システム設計で学ぶ<strong>設計はトレードオフである</strong>という原則の実例です。自由度（開発の速さ）と規約（長期の保守性）は両立せず、<strong>プロジェクトの規模・寿命・チーム人数という文脈で最適解が変わります</strong>。「銀の弾丸はない」「早すぎる最適化を避ける」「YAGNI」といったソフトウェア工学の格言が、そのままフレームワーク選定の判断軸になります。技術選定を「流行」でなく「トレードオフの評価」として語れるかが、設計力の分かれ目です。
      </Bridge>

      <Callout variant="info" title="この章の読み進め方">
        次に <strong>Node.js</strong> でランタイムそのものを理解し、続いて <strong>Express</strong> で「軽量に組む」感覚を、最後に <strong>NestJS</strong> で「大規模でも破綻しない構造」を学ぶ順序がおすすめです。土台 → 軽量 → 本格、と積み上がります。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Node.js だけがランタイム（土台）。Express / NestJS / Next.js はその上に乗るフレームワーク",
          "Express は最小・自由、NestJS は本格・TS・DI、Next.js は React フルスタック（API も持てる）",
          "「Node.js か Express か」ではなく「Node.js の上に何を乗せるか」で考える",
          "選定は規模で。小規模は Express、大規模・長期は NestJS、画面 + API 一体なら Next.js",
        ]}
      />
    </>
  );
}

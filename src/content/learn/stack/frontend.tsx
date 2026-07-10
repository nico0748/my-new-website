import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Cmd, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "frontend-stack",
  title: "フロントエンドの技術スタック",
  description: "画面（UI）を作る層の代表スタック。UI フレームワーク（React/Vue/Angular/Svelte）、メタフレームワーク、ビルドツール、CSS 手法、状態管理までを俯瞰する。",
  domain: "stack",
  section: "frontend",
  order: 1,
  level: "basic",
  tags: ["フロントエンド", "React", "Vue", "CSS"],
  updated: "2026-07-09",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        フロントエンドは、ユーザーの目に触れる<strong>画面（UI）</strong>を作る層です。中心は UI フレームワークですが、実際のスタックはそこにビルドツール・CSS 手法・状態管理・型システムが組み合わさって成り立ちます。層ごとに代表を押さえましょう。
      </Lead>

      <Section>UI フレームワーク</Section>
      <ComparisonTable
        headers={["フレームワーク", "特徴", "向いている場面"]}
        rows={[
          ["React", "巨大なエコシステム。ライブラリで組み立てる自由度", "採用実績・求人が最多。迷ったら第一候補"],
          ["Vue", "学習しやすく、単一ファイルコンポーネントが直感的", "小〜中規模、段階的導入"],
          ["Angular", "全部入りのフルフレームワーク（DI・ルーター等標準）", "大規模・エンタープライズ"],
          ["Svelte", "コンパイル時に素の JS へ変換。ランタイムが軽い", "軽量・高速を重視するアプリ"],
        ]}
      />
      <Callout variant="info" title="ライブラリかフレームワークか">
        React は「UI ライブラリ」で、ルーティングや状態管理は別ライブラリを組み合わせます（自由だが選定が必要）。Angular は「フルフレームワーク」で最初から揃っています（統一感があるが規約が多い）。この設計思想の違いが、学習体験の差になります。
      </Callout>

      <Section>メタフレームワーク（フルスタック化）</Section>
      <p>
        UI フレームワーク単体に、ルーティング・SSR・データ取得などを足して「アプリを作り切れる」ようにしたのがメタフレームワークです。<Cmd>React → Next.js</Cmd>、<Cmd>Vue → Nuxt</Cmd>、<Cmd>Svelte → SvelteKit</Cmd>、<Cmd>Solid → SolidStart</Cmd> のように対応します。
      </p>

      <Section>周辺スタック</Section>
      <ComparisonTable
        headers={["層", "代表", "役割"]}
        rows={[
          ["言語", "TypeScript", "型で安全性と補完を得る。実務ではほぼ標準"],
          ["ビルド/開発サーバー", "Vite・Turbopack・（webpack）", "高速な開発サーバーと本番バンドル"],
          ["CSS 手法", "Tailwind CSS・CSS Modules・CSS-in-JS", "スタイルの書き方。近年は Tailwind が人気"],
          ["状態管理", "Redux Toolkit・Zustand・Pinia・TanStack Query", "画面をまたぐ状態やサーバーデータの管理"],
          ["UI コンポーネント", "MUI・shadcn/ui・Chakra", "既製の UI 部品で開発を加速"],
        ]}
      />

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>実績・求人・情報量</strong> → React（+ Next.js）</li>
        <li><strong>学習のしやすさ・段階導入</strong> → Vue</li>
        <li><strong>大規模で統一された規約</strong> → Angular</li>
        <li><strong>軽さ・パフォーマンス</strong> → Svelte / SolidJS</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "中心は UI フレームワーク：React / Vue / Angular / Svelte",
          "React はライブラリ型で自由、Angular はフルFWで全部入り",
          "各 UI FW にはメタFW(Next.js/Nuxt/SvelteKit)があり、フルスタック化できる",
          "実務スタックは 言語(TS)＋ビルド(Vite)＋CSS(Tailwind)＋状態管理の組合せ",
          "迷ったら React+Next.js、学習しやすさなら Vue が目安",
        ]}
      />
    </>
  );
}

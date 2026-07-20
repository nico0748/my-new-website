import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Cmd, ComparisonTable, KeyPoints, Divider, Figure } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "mobile-app-stack",
  title: "モバイルアプリケーション開発の技術スタック",
  description: "iOS / Android のネイティブ開発と、1つのコードで両対応するクロスプラットフォームの代表スタック。ネイティブ・Flutter・React Native などの違いと選び方を俯瞰する。",
  domain: "stack",
  section: "mobile-app",
  order: 1,
  level: "intro",
  tags: ["モバイル", "iOS", "Android", "クロスプラットフォーム"],
  updated: "2026-07-09",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        スマホアプリの作り方は大きく<strong>ネイティブ</strong>（OS ごとに専用言語で書く）と<strong>クロスプラットフォーム</strong>（1つのコードで iOS/Android 両対応）に分かれます。どちらを選ぶかで、体験の質・開発コスト・チーム構成が変わります。
      </Lead>

      <Section>ネイティブ開発</Section>
      <ComparisonTable
        headers={["OS", "言語", "UI フレームワーク", "特徴"]}
        rows={[
          ["iOS", <Tech id="swift">Swift</Tech>, "SwiftUI / UIKit", "最新 OS 機能をいち早く使える。Apple 公式で情報が安定"],
          ["Android", <><Tech id="kotlin">Kotlin</Tech>（Java）</>, "Jetpack Compose / View", "端末・OS バージョンの多様性に対応する必要がある"],
        ]}
      />
      <Callout variant="info" title="ネイティブの強みと弱み">
        OS の機能・性能を最大限に引き出せ、UX も最も高品質にできます。一方で <strong>iOS と Android を別々に開発</strong>するため、コストは実質2倍になりがちです。
      </Callout>

      <Section>クロスプラットフォーム開発</Section>
      <ComparisonTable
        headers={["フレームワーク", "言語", "描画方式", "特徴"]}
        rows={[
          [<Tech id="flutter">Flutter</Tech>, "Dart", "独自エンジンで描画", "iOS/Android/Web/デスクトップまで単一コード。UI が均一"],
          [<Tech id="react-native">React Native</Tech>, "JavaScript / TypeScript", "ネイティブ UI を呼ぶ", "Web の React 知識を活かせる。エコシステムが広い"],
          ["Kotlin Multiplatform", "Kotlin", "ロジック共有＋UIは各OS", "UI はネイティブのまま、ビジネスロジックだけ共有"],
          [".NET MAUI", "C#", "ネイティブ UI を呼ぶ", "C#/.NET 資産を活かせる。企業内アプリで採用"],
        ]}
      />

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>最高の UX・OS 最新機能・重い処理</strong>（ゲーム、カメラ、AR 等）→ ネイティブ</li>
        <li><strong>コストを抑えて両 OS へ速く出す</strong> → Flutter / React Native</li>
        <li><strong>Web で React を使っている</strong> → React Native で知識を再利用</li>
        <li><strong>UI はネイティブ品質を保ちつつロジックだけ共有</strong> → Kotlin Multiplatform</li>
      </ul>
      <Figure
        src="/learn/shots/stack/mobile-app-stack-01.svg"
        alt="App Store Connect のアプリ提出画面。ビルドのアップロードと審査ステータスが表示されている"
        caption="コードが完成した後に待つのがこの工程。審査を通って初めてユーザーに届く"
      />
      <Callout variant="warn" title="配信・審査という共通のハードル">
        どのスタックでも、<Cmd>App Store</Cmd> / <Cmd>Google Play</Cmd> への審査・署名・ストア掲載という工程は共通で必要です。技術選定だけでなく、<strong>配信と運用</strong>まで含めて計画しましょう。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "ネイティブ(iOS=Swift / Android=Kotlin)は最高品質だがコストは実質2倍",
          "クロスプラットフォームは1コードで両対応。Flutter と React Native が二大勢力",
          "Flutter は独自描画で UI 均一、React Native は Web の React 知識を活かせる",
          "ゲーム/AR など重い処理はネイティブ、コスト重視はクロス",
          "どのスタックでもストア審査・署名・配信の工程は共通で必要",
        ]}
      />
    </>
  );
}

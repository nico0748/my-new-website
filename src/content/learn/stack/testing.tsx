import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "testing-stack",
  title: "テストの技術スタック",
  description: "品質を支えるテストの代表スタック。テストの種類（ユニット/結合/E2E）を捉え、JavaScript・Python・Java 各圏の定番と UI・E2E ツールを俯瞰する。",
  domain: "stack",
  section: "testing",
  order: 1,
  level: "basic",
  tags: ["テスト", "Jest", "Playwright", "pytest"],
  updated: "2026-07-09",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        テストは、変更を安心して加えるための<strong>安全網</strong>です。まず「どのレベルをテストするか」を掴み、そのうえで言語圏ごとの定番ツールを選びます。
      </Lead>

      <Section>テストの種類</Section>
      <ComparisonTable
        headers={["種類", "対象", "特徴"]}
        rows={[
          ["ユニットテスト", "関数・部品単位", "速く大量に回せる。土台"],
          ["結合テスト", "複数部品の連携", "モジュール間の噛み合わせを検証"],
          ["E2E テスト", "ユーザー操作の一連の流れ", "実際に近いが重い。数を絞る"],
        ]}
      />
      <Callout variant="tip" title="テストピラミッド">
        <strong>ユニットを多く・E2E を少なく</strong>が基本形（テストピラミッド）。E2E は価値が高い反面、遅く壊れやすいので、重要な導線に絞ります。
      </Callout>

      <Section>言語圏ごとの定番</Section>
      <ComparisonTable
        headers={["言語", "ユニット/結合", "UI / E2E"]}
        rows={[
          ["JavaScript", <><Tech id="jest">Jest</Tech> / <Tech id="vitest">Vitest</Tech></>, <><Tech id="testing-library">Testing Library</Tech> / <Tech id="playwright">Playwright</Tech> / <Tech id="cypress">Cypress</Tech></>],
          ["Python", <Tech id="pytest">pytest</Tech>, <Tech id="selenium">Selenium</Tech>],
          ["Java / JVM", <Tech id="junit">JUnit</Tech>, <Tech id="selenium">Selenium</Tech>],
        ]}
      />
      <Callout variant="info" title="Vitest は Jest の高速な後継的存在">
        <Tech id="jest">Jest</Tech> が長らく定番でしたが、Vite ベースのプロジェクトでは <Tech id="vitest">Vitest</Tech> が高速で相性が良いです。E2E は <Tech id="playwright">Playwright</Tech> が複数ブラウザ対応で人気です。
      </Callout>

      <Section>UI コンポーネント開発</Section>
      <p>
        <Tech id="storybook">Storybook</Tech> は UI コンポーネントを単体で開発・カタログ化するツールで、テスト（振る舞い確認）とデザイン共有の両面で役立ちます。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "テストはユニット/結合/E2E の3層。ユニット多め・E2E 少なめが基本",
          "JS はユニットに Jest/Vitest、UI に Testing Library",
          "E2E は Playwright / Cypress（旧来は Selenium）",
          "Python は pytest、Java は JUnit が定番",
          "Storybook で UI を単体開発・カタログ化",
        ]}
      />
    </>
  );
}

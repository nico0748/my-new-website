import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "web-app-stack",
  title: "Web アプリケーション開発の技術スタック",
  description: "ブラウザで動く Web アプリを作るための代表的なスタック。SPA / SSR / フルスタックフレームワークの違いと、レンダリング方式・言語ごとの選び方を俯瞰する。",
  domain: "stack",
  section: "web-app",
  order: 1,
  level: "intro",
  tags: ["Web", "SPA", "SSR", "フレームワーク"],
  updated: "2026-07-09",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        Web アプリケーションは「ブラウザで動く画面」と「サーバーで動くロジック・データ」の組み合わせです。まずは<strong>どのレンダリング方式か</strong>（ブラウザで描くか、サーバーで描くか）と<strong>どの言語エコシステムか</strong>で、代表的なスタックを地図として掴みます。
      </Lead>

      <Section>まず3つの型で捉える</Section>
      <ComparisonTable
        headers={["型", "描画の主役", "代表", "向いている用途"]}
        rows={[
          ["SPA（クライアント描画）", "ブラウザ（JS）", "React・Vue・Angular + API", "管理画面・ダッシュボードなど操作の多いアプリ"],
          ["SSR / フルスタック", "サーバー＋ブラウザ", "Next.js・Nuxt・Remix・SvelteKit", "SEO・初期表示が重要な公開サイト"],
          ["サーバー主体（MPA）", "サーバー", "Rails・Laravel・Django", "CRUD 中心の業務・EC・CMS"],
        ]}
      />
      <Callout variant="info" title="SPA と SSR は排他ではない">
        Next.js のようなフルスタックフレームワークは、ページ単位で「サーバーで描く（SSR/SSG）」「ブラウザで描く（CSR）」を混在できます。厳密な二択ではなく<strong>グラデーション</strong>だと捉えると、後の学習が楽になります。
      </Callout>

      <Section>言語エコシステム別の代表スタック</Section>
      <ComparisonTable
        headers={["言語", "フルスタック/フレームワーク", "特徴"]}
        rows={[
          ["JavaScript / TypeScript", "Next.js・Nuxt・SvelteKit・Remix", "フロントと同じ言語でサーバーも書ける。エコシステムが最大"],
          ["Ruby", "Ruby on Rails", "規約優先で開発速度が速い。CRUD が得意"],
          ["PHP", "Laravel", "レンタルサーバーとの相性・学習資料が豊富"],
          ["Python", "Django・Flask・FastAPI", "データ/ML との親和性。Django は全部入り、FastAPI は API 向き"],
          ["Go", "Echo・Gin・標準ライブラリ", "軽量・高速・単一バイナリで配布しやすい"],
          ["Java / Kotlin", "Spring Boot", "大規模・堅牢。エンタープライズの定番"],
        ]}
      />

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>SEO・表示速度が重要な公開サイト</strong> → SSR/SSG（Next.js・Nuxt 等）</li>
        <li><strong>ログイン後の操作中心のアプリ</strong> → SPA + API（React/Vue + バックエンド）</li>
        <li><strong>とにかく早く CRUD を形にしたい</strong> → Rails・Laravel・Django</li>
        <li><strong>チームの既存言語に合わせる</strong> → 学習コストと保守性で有利。言語を軸に選ぶのも正解</li>
      </ul>
      <Callout variant="tip" title="スタックは「フロント × バック × DB」の組み合わせ">
        Web アプリは単一の技術ではなく、フロントエンド・バックエンド・データベースの<strong>組み合わせ</strong>です。この一覧はその入口で、各層の詳細は本コースの「フロントエンド」「バックエンド」「データベース」の章で掘り下げます。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "まず SPA / SSR・フルスタック / サーバー主体(MPA) の3つの型で捉える",
          "SPA と SSR は排他でなくグラデーション。ページ単位で混在できる",
          "JS/TS は Next.js 等でフロントと同じ言語、Rails/Laravel/Django は CRUD が速い",
          "SEO 重視は SSR、操作中心は SPA+API、速さ重視はフルスタックFW",
          "Web アプリは『フロント × バック × DB』の組み合わせで成り立つ",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "baas-cms-stack",
  title: "BaaS / ヘッドレスCMS の技術スタック",
  description: "バックエンドを『書かない』選択肢の代表スタック。Firebase・Supabase などの BaaS と、Contentful・Strapi・microCMS などのヘッドレス CMS を俯瞰する。",
  domain: "stack",
  section: "baas-cms",
  order: 1,
  level: "basic",
  tags: ["BaaS", "Firebase", "Supabase", "ヘッドレスCMS"],
  updated: "2026-07-09",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        バックエンドをフルスクラッチで作らず、<strong>認証・DB・ストレージを丸ごと借りる</strong>のが BaaS、<strong>コンテンツ管理だけを API で借りる</strong>のがヘッドレス CMS。作る範囲を減らして、素早くプロダクトを立ち上げられます。
      </Lead>

      <Section>BaaS（Backend as a Service）</Section>
      <ComparisonTable
        headers={["サービス", "DB", "特徴"]}
        rows={[
          [<Tech id="firebase">Firebase</Tech>, "NoSQL(Firestore)", "認証・リアルタイム DB・ホスティング。モバイルと好相性"],
          [<Tech id="supabase">Supabase</Tech>, "PostgreSQL", "『OSS 版 Firebase』。SQL を使いたいときに"],
          [<Tech id="appwrite">Appwrite</Tech>, "内蔵", "自己ホスト可能な OSS BaaS"],
        ]}
      />
      <Callout variant="tip" title="SQL を使いたいなら Supabase">
        <Tech id="firebase">Firebase</Tech> は NoSQL 中心、<Tech id="supabase">Supabase</Tech> は <Tech id="postgresql">PostgreSQL</Tech> ベース。リレーショナルなデータや SQL を使いたいなら Supabase が有力です。
      </Callout>

      <Section>ヘッドレス CMS</Section>
      <p>
        表示（フロント）と管理（コンテンツ）を分離し、コンテンツを API で配信するのがヘッドレス CMS です。フロントは <Tech id="nextjs">Next.js</Tech> 等で自由に作れます。
      </p>
      <ComparisonTable
        headers={["サービス", "特徴"]}
        rows={[
          [<Tech id="contentful">Contentful</Tech>, "エンタープライズ寄りの定番 SaaS"],
          [<Tech id="sanity">Sanity</Tech>, "リアルタイム編集・カスタマイズ性が高い"],
          [<Tech id="strapi">Strapi</Tech>, "自己ホスト OSS。API を自動生成"],
          [<Tech id="microcms">microCMS</Tech>, "日本製で導入しやすい"],
          [<Tech id="wordpress">WordPress</Tech>, "従来型 CMS（ヘッドレス利用も可）"],
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "BaaS はバックエンド機能を丸ごと借りる。素早い立ち上げに有効",
          "Firebase=NoSQL・モバイル、Supabase=PostgreSQL・OSS 志向",
          "自己ホスト BaaS は Appwrite",
          "ヘッドレス CMS は表示と管理を分離し API で配信",
          "CMS は Contentful/Sanity/Strapi/microCMS、国内は microCMS",
        ]}
      />
    </>
  );
}

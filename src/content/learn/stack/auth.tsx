import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider, Figure } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "auth-stack",
  title: "認証・認可の技術スタック",
  description: "ログインを『自作しない』ための代表スタック。方式(JWT/OAuth)の基礎から、Auth0・Clerk・Firebase Auth・Keycloak などのサービス/ライブラリを俯瞰する。",
  domain: "stack",
  section: "auth",
  order: 1,
  level: "basic",
  tags: ["認証", "Auth0", "Clerk", "OAuth"],
  updated: "2026-07-09",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        認証（誰か）と認可（何をしてよいか）は、自作すると事故が起きやすい領域です。仕組み（<Tech id="jwt">JWT</Tech>・<Tech id="oauth">OAuth</Tech>）の基礎を押さえたうえで、既製のサービスやライブラリに任せるのが現代の定石です。
      </Lead>

      <Section>まず仕組みを押さえる</Section>
      <ComparisonTable
        headers={["要素", "役割"]}
        rows={[
          [<Tech id="jwt">JWT</Tech>, "署名付きトークンでステートレスに認証"],
          [<Tech id="oauth">OAuth</Tech>, "『Google でログイン』のような権限委譲の標準"],
          ["セッション", "サーバー側で状態を持つ従来型認証"],
        ]}
      />

      <Section>認証プラットフォーム / ライブラリ</Section>
      <ComparisonTable
        headers={["名前", "形態", "特徴"]}
        rows={[
          [<Tech id="auth0">Auth0</Tech>, "SaaS", "汎用・実績豊富。多機能な認証基盤"],
          [<Tech id="clerk">Clerk</Tech>, "SaaS", "UI コンポーネント込み。Next.js と好相性"],
          [<Tech id="firebase-auth">Firebase Auth</Tech>, "SaaS", "モバイル/Web で手軽。Firebase とセット"],
          [<Tech id="supabase-auth">Supabase Auth</Tech>, "SaaS(OSS)", "DB(Postgres)権限と一体管理"],
          [<Tech id="keycloak">Keycloak</Tech>, "自己ホスト OSS", "企業内 SSO・ID 連携"],
          [<Tech id="nextauth">NextAuth (Auth.js)</Tech>, "ライブラリ", "外部サービスに頼らず自前実装"],
        ]}
      />
      <Figure
        src="/learn/shots/stack/auth-stack-01.svg"
        alt="Clerk の埋め込みサインイン UI。メール入力欄と外部サービスのログインボタンが並んでいる"
        caption="「UI コンポーネント込み」とは、このログイン画面ごと配置できるということ"
      />
      <Callout variant="tip" title="選び方">
        素早く UI 込みで入れるなら <Tech id="clerk">Clerk</Tech>、汎用・実績重視なら <Tech id="auth0">Auth0</Tech>、自己ホスト要件なら <Tech id="keycloak">Keycloak</Tech>、外部依存を避けたい Next.js なら <Tech id="nextauth">NextAuth</Tech> が目安です。
      </Callout>

      <Callout variant="warn" title="認証は自作しない">
        パスワードハッシュ・トークン管理・多要素認証・セッション無効化——認証は考慮点が多く、自作は事故の温床です。まず既製サービスに任せ、仕組みは理解しておく、が安全です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "認証=誰か、認可=何をしてよいか。まず JWT/OAuth の仕組みを理解",
          "実装は自作せず既製サービス/ライブラリに任せるのが定石",
          "UI 込みで手軽なら Clerk、汎用・実績なら Auth0",
          "自己ホストは Keycloak、外部依存回避の Next.js は NextAuth",
          "Firebase/Supabase は DB とセットで認証を提供",
        ]}
      />
    </>
  );
}

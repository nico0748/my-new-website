import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "payment-stack",
  title: "決済の技術スタック",
  description: "アプリに支払いを組み込むための代表スタック。Web 決済(Stripe/PayPal)とアプリ内課金(RevenueCat)の違い、選び方と注意点を俯瞰する。",
  domain: "stack",
  section: "payment",
  order: 1,
  level: "basic",
  tags: ["Stripe", "PayPal", "RevenueCat", "決済"],
  updated: "2026-07-09",
  minutes: 5,
};

export default function Article() {
  return (
    <>
      <Lead>
        お金を扱う決済は、セキュリティやコンプライアンスの要求が高く、<strong>自前実装は避けて専用サービスに任せる</strong>のが鉄則です。Web の決済か、アプリ内課金かで使うものが変わります。
      </Lead>

      <Section>代表的な決済サービス</Section>
      <ComparisonTable
        headers={["サービス", "領域", "特徴"]}
        rows={[
          [<Tech id="stripe">Stripe</Tech>, "Web 決済", "開発者フレンドリー。カード決済・サブスク・返金を API で"],
          [<Tech id="paypal">PayPal</Tech>, "Web 決済", "世界的に普及。個人間送金・買い手保護"],
          [<Tech id="revenuecat">RevenueCat</Tech>, "アプリ内課金", "iOS/Android のサブスクを横断管理・分析"],
        ]}
      />
      <Callout variant="info" title="Web か アプリ内課金か">
        Web サイト/SaaS の課金は <Tech id="stripe">Stripe</Tech> が定番。一方、モバイルアプリの<strong>アプリ内課金</strong>は各ストアの仕組みに従う必要があり、そこを横断管理するのが <Tech id="revenuecat">RevenueCat</Tech> です。
      </Callout>
      <Callout variant="warn" title="カード情報は自分で持たない">
        カード番号などの機微情報を自前サーバーで保持すると、PCI DSS などの厳しい基準が課されます。決済サービスの仕組み（トークン化）を使い、<strong>機微情報を自社で扱わない</strong>のが安全かつ現実的です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "決済は自前実装せず専用サービスに任せるのが鉄則",
          "Web 決済の定番は Stripe（サブスク・返金まで API で）",
          "個人向け・越境は PayPal も選択肢",
          "モバイルのアプリ内課金は RevenueCat で横断管理",
          "カード情報は自社で保持せず、トークン化の仕組みを使う",
        ]}
      />
    </>
  );
}

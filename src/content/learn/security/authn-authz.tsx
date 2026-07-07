import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "authn-authz",
  title: "認証と認可の違い",
  description: "認証（あなたは誰か / AuthN）と認可（何をしてよいか / AuthZ）は別物。混同がそのまま脆弱性になる理由を、認証バイパスと認可欠落の視点で押さえる。",
  domain: "security",
  section: "auth",
  order: 1,
  level: "intro",
  tags: ["認証", "認可", "AuthN", "AuthZ", "アクセス制御"],
  updated: "2026-07-07",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        セキュリティの世界で最初につまずきやすいのが、<strong>認証（Authentication / AuthN）</strong>と
        <strong>認可（Authorization / AuthZ）</strong>の混同です。英語では頭文字が同じ「Auth」で、日本語でも字面が似ているため一括りにされがちですが、
        両者は<strong>まったく別の問い</strong>に答える仕組みです。この区別が曖昧なままだと、そのまま脆弱性につながります。
      </Lead>

      <Section>認証と認可は「別の問い」に答える</Section>
      <p>
        両者の違いは、「誰か（who）」と「何をしてよいか（what）」という<strong>問いの違い</strong>で捉えると明快です。
      </p>
      <KVList
        items={[
          { key: "認証（AuthN）", val: "「あなたは誰か」を確かめる。ログインの ID/パスワード検証やパスキー、生体認証など。本人確認そのもの。" },
          { key: "認可（AuthZ）", val: "「その人に何をさせてよいか」を決める。管理画面を開けるか、他人の注文を削除できるか、といった権限の判定。" },
        ]}
      />
      <p>
        処理の順序としては<strong>認証が先、認可が後</strong>です。まず「誰か」を確定し、その確定した主体に対して「何を許すか」を判断します。
        逆に言えば、<strong>認証が済んでいても、認可を毎回きちんと判定しなければ意味がありません</strong>。ログインできた＝何でもしてよい、ではないのです。
      </p>

      <FlowChain
        nodes={[
          { label: "リクエスト", sub: "誰かがアクセス" },
          { label: "認証 AuthN", sub: "あなたは誰か", variant: "primary" },
          { label: "認可 AuthZ", sub: "何をしてよいか", variant: "cta" },
          { label: "実行 / 拒否", sub: "許可された操作のみ" },
        ]}
        caption="認証で主体を確定し、その主体に対して認可を判定する。両方が揃って初めて安全な処理になる"
      />

      <Callout variant="tip" title="身近なたとえ">
        建物の入口で<strong>身分証を見せて本人だと確認される</strong>のが認証。
        入ったあと、<strong>入れる部屋と入れない部屋がある</strong>のが認可です。ビルに入れたからといって、社長室に入ってよいわけではありません。
      </Callout>

      <Section>混同が脆弱性を生む</Section>
      <p>
        「認証さえ通れば十分」という思い込みが、代表的な 2 系統の脆弱性を生みます。どちらも OWASP Top 10 の常連です。
      </p>

      <SubSection>認証バイパス（AuthN の欠陥）</SubSection>
      <p>
        正規の資格情報を持たない攻撃者が、認証機構の<strong>抜け穴・代替経路・トークンの偽造</strong>で「認証済みの状態」を手に入れてしまう脆弱性です。
        ログイン画面でだけ認証チェックをしていて内部 URL に直接アクセスできる（強制ブラウジング）、
        <Cmd>isAdmin=true</Cmd> のようなクライアント側パラメータを信じてしまう、署名検証の甘いトークンを受理してしまう——といったパターンが典型です。
        OWASP Top 10 2021 では <strong>A07: Identification and Authentication Failures</strong> にあたります。
      </p>

      <SubSection>認可欠落 / アクセス制御の不備（AuthZ の欠陥）</SubSection>
      <p>
        認証は通っているのに、<strong>「その人がそのリソースにアクセスしてよいか」の判定が抜けている</strong>状態です。
        <Cmd>?id=123</Cmd> を <Cmd>124</Cmd> に書き換えると他人のデータが見えてしまう（IDOR）、
        一般ユーザーが管理用エンドポイントに直接到達できる、といった形で現れます。
        OWASP Top 10 2021 で<strong>第 1 位</strong>に位置づけられた <strong>A01: Broken Access Control</strong> がこれです。影響範囲がもっとも広いカテゴリとされています。
      </p>

      <ComparisonTable
        headers={["観点", "認証（AuthN）", "認可（AuthZ）"]}
        rows={[
          ["答える問い", "あなたは誰か", "何をしてよいか"],
          ["タイミング", "先（主体の確定）", "後（操作ごとに判定）"],
          ["代表的な仕組み", "パスワード / MFA / パスキー / SSO", "RBAC / ABAC / 所有権チェック"],
          ["欠陥の呼び名", "認証バイパス", "アクセス制御の不備・認可欠落"],
          ["OWASP Top 10 2021", "A07", "A01（首位）"],
        ]}
      />

      <Callout variant="danger" title="よくある落とし穴：認可をサーバ側で毎回やらない">
        「ログインした人しか触れないページだから大丈夫」と考えて、<strong>操作ごとの認可判定をサーバ側で省く</strong>のが典型的な事故です。
        UI で管理ボタンを隠しても、リクエストを直接投げれば通ってしまいます。認可は<strong>すべてのエンドポイントでサーバ側が毎回</strong>判定するのが原則です。
      </Callout>

      <Bridge course="情報セキュリティ / 脅威モデリング">
        認証と認可の分離は、講義で学ぶ<strong>脅威モデリング</strong>や<strong>アクセス制御の基礎理論</strong>に直結します。
        「主体（subject）が客体（object）に対してどの操作（action）を許されるか」というアクセス制御行列（access control matrix）の考え方は、
        まさに認可そのものです。認証で「主体を誰と同定するか」を確定し、認可で「その主体に許す操作」を決める——この二段構えは、
        セキュリティの三大要素（機密性・完全性・可用性）を守るための入口にあたります。座学の「主体・客体・操作」というモデルが、
        現場では「AuthN でユーザーを確定し、AuthZ で権限を判定する」という設計判断として現れるのです。
      </Bridge>

      <Divider />

      <Quiz
        question="ログイン済みのユーザーが、URL の id を書き換えて他人の注文情報を閲覧できてしまった。これは主にどちらの欠陥か？"
        options={[
          "認証（AuthN）の欠陥。本人確認ができていない",
          "認可（AuthZ）の欠陥。操作ごとの権限判定が抜けている",
          "暗号（通信の暗号化）の欠陥",
          "どちらでもない。仕様どおりの正常動作",
        ]}
        answer={1}
        explanation="本人としてのログイン（認証）は成立しているのに、そのリソースにアクセスしてよいかの判定（認可）が抜けている典型例です。IDOR と呼ばれ、Broken Access Control（A01）に分類されます。"
      />

      <KeyPoints
        items={[
          "認証（AuthN）は「あなたは誰か」、認可（AuthZ）は「何をしてよいか」を決める別物",
          "順序は認証が先、認可が後。ログインできた＝何でもしてよい ではない",
          "認証の欠陥＝認証バイパス（A07）、認可の欠陥＝アクセス制御の不備（A01・首位）",
          "認可は UI で隠すだけでなく、全エンドポイントでサーバ側が毎回判定する",
        ]}
      />
    </>
  );
}

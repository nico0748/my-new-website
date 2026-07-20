import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "access-control-iam",
  title: "アクセス制御モデルと最小権限",
  description: "RBAC/ABAC、最小権限（PoLP）、デフォルト拒否、垂直/水平の権限昇格、IAM（過剰権限・AssumeRole 連鎖）、集中認可レイヤ。認可を「どう設計するか」を体系立てて押さえる。",
  domain: "security",
  section: "auth",
  order: 8,
  level: "basic",
  tags: ["アクセス制御", "RBAC", "ABAC", "最小権限", "IAM", "権限昇格"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        認証で「誰か」を確定したら、次は<strong>認可＝「その人に何をさせてよいか」の設計</strong>です。
        認可の実装が甘いと、<strong>アクセス制御の不備（Broken Access Control）</strong>——OWASP Top 10 2021 で<strong>第 1 位</strong>——につながります。
        本記事では、認可を体系立てて設計するためのモデル（RBAC/ABAC）と原則（最小権限・デフォルト拒否）、
        そしてクラウドの <strong>IAM</strong> で起きがちな落とし穴までを整理します。
      </Lead>

      <Section>アクセス制御モデル — RBAC と ABAC</Section>
      <p>
        「誰に何を許すか」をどう表現するかで、代表的な 2 つのモデルがあります。
      </p>
      <ComparisonTable
        headers={["モデル", "考え方", "向いている場面"]}
        rows={[
          ["RBAC（ロールベース）", "ユーザーにロール（役割）を割り当て、ロールに権限を紐づける", "組織構造が明確で権限が役割で決まる場合。管理が単純"],
          ["ABAC（属性ベース）", "ユーザー・リソース・環境の属性で動的にポリシー判定する", "細かい条件（部署・時間帯・データ区分等）で制御したい場合。柔軟だが複雑"],
        ]}
      />
      <p>
        RBAC は「管理者ロールなら削除できる」のように<strong>役割で権限を束ねる</strong>ため管理が容易です。
        ABAC は「同じ部署のレコードのみ、業務時間内に限り編集可」のように<strong>属性の組み合わせ</strong>で判定でき、きめ細かい制御に向きます。
        実務では両者を併用することも珍しくありません。
      </p>

      <Section>2 つの原則 — 最小権限とデフォルト拒否</Section>
      <SubSection>最小権限の原則（PoLP: Principle of Least Privilege）</SubSection>
      <p>
        主体には<strong>業務に必要な最小限の権限だけ</strong>を与える、という原則です。過剰な権限は、
        アカウントが乗っ取られたときの<strong>被害範囲（blast radius）を広げます</strong>。
        「とりあえず広めに付ける」の積み重ねが、後述する権限昇格の温床になります。
      </p>
      <SubSection>デフォルト拒否（Deny by Default）</SubSection>
      <p>
        <strong>明示的に許可されたものだけを通し、それ以外はすべて拒否</strong>する設計です。
        「禁止リストで塞ぐ」のではなく「許可リストで開ける」発想にすることで、<strong>設定漏れがそのまま許可になってしまう事故</strong>を防げます。
        新しいエンドポイントを追加したときに、うっかり誰でもアクセスできる状態にならないための守りです。
      </p>
      <FlowChain
        nodes={[
          { label: "リクエスト", sub: "認証済みの主体" },
          { label: "デフォルト拒否", sub: "まず全て拒否", variant: "cta" },
          { label: "ポリシー判定", sub: "RBAC / ABAC" },
          { label: "許可 or 拒否", sub: "明示的に許可のみ通す", variant: "primary" },
        ]}
        caption="デフォルト拒否を土台に、ポリシーで明示的に許可されたものだけを通す"
      />

      <Section>権限昇格 — 垂直と水平</Section>
      <p>
        認可の欠陥を突いて、本来の権限境界を越えてしまうのが<strong>権限昇格（Privilege Escalation）</strong>です。方向で 2 種類に分けられます。
      </p>
      <KVList
        items={[
          { key: "垂直的権限昇格（Vertical）", val: "低権限ユーザーが管理者・root など上位の権限を獲得する。管理機能への直接アクセス、機能レベル認可の欠落（CWE-862）など。" },
          { key: "水平的権限昇格（Horizontal）", val: "同レベルの別ユーザーのデータ・権限へアクセスする。IDOR（?id=123 を 124 に書き換える）が典型（CWE-639）。" },
        ]}
      />
      <Callout variant="warn" title="オブジェクトごとの所有権チェックを毎回">
        水平昇格（IDOR）を防ぐ核心は、<strong>「このリクエストの主体は、このリソースの正当な所有者か」をアクセスのたびにサーバ側で検証</strong>することです。
        認証は通っていても、この<strong>オブジェクトレベルの認可</strong>が抜けていると他人のデータに届いてしまいます。
        「UI に出していないから安全」という隠蔽（security by obscurity）は認可の代わりになりません。
      </Callout>
      <Code lang="javascript" filename="authz.js（水平昇格を防ぐ）">{`// NG 危険：所有権を確認せず ID だけで取得
const order = await db.orders.findById(req.params.id);

// OK 安全：現在のユーザーが所有するレコードに限定
const order = await db.orders.findOne({
  id: req.params.id,
  ownerId: req.user.id, // セッションの主体で必ず絞る
});
if (!order) return res.sendStatus(404);`}</Code>

      <Section>IAM — クラウドでの認可</Section>
      <p>
        クラウド（AWS 等）では、権限管理を <strong>IAM（Identity and Access Management）</strong>が担います。
        便利な反面、権限の設計を誤ると深刻な昇格経路を生みます。
      </p>
      <ul>
        <li><strong>過剰な IAM ポリシー</strong> — <Cmd>*</Cmd>（すべて許可）を安易に付けると、最小権限から大きく外れる</li>
        <li><strong>AssumeRole の連鎖</strong> — ロール A を引き受けられる主体が、A からロール B、B から C…と<strong>連鎖的に昇格</strong>できてしまう経路</li>
        <li><strong><Cmd>iam:PassRole</Cmd> の濫用</strong> — サービスに強い権限のロールを渡せると、それ経由で昇格される</li>
      </ul>
      <Figure src="/learn/shots/security/access-control-iam-01.svg" alt="AWS IAM のポリシー編集画面で、ワイルドカードを含む過剰なポリシーと最小権限に絞ったポリシーを比較したスクリーンショット" caption="IAM ポリシーの実物。ワイルドカード 1 文字で権限範囲がどれだけ広がるかを画面で確かめる" />
      <Callout variant="danger" title="過剰権限は「見えにくい昇格経路」を作る">
        個々の権限は問題なく見えても、<strong>ロールの引き受け（AssumeRole）を辿ると管理者相当に到達できる</strong>——
        という連鎖は、権限を広く付けるほど生まれやすくなります。付与時に最小権限を徹底し、
        <strong>ロール引き受けの経路を定期的に棚卸し</strong>することが重要です。
      </Callout>

      <Section>集中認可レイヤという設計</Section>
      <p>
        認可判定が各所にバラバラに散らばると、どこかで検証が抜けて<strong>アクセス制御の不備</strong>が生まれます。
        これを防ぐのが<strong>認可を一箇所に集約する</strong>設計です。
      </p>
      <KVList
        items={[
          { key: "集中認可レイヤ", val: "ポリシーエンジン（OPA 等）や API ゲートウェイで、全エンドポイントの認可を一元判定する" },
          { key: "サーバ側で毎回", val: "UI で隠すだけでなく、すべての API でサーバ側がロール・所有権を検証する" },
          { key: "失敗をログ・監視", val: "認可失敗を記録し、異常な ID 列挙やロール横断アクセスを検知する" },
        ]}
      />

      <Bridge course="情報セキュリティ / オペレーティングシステム">
        アクセス制御モデルは、講義で学ぶ<strong>アクセス制御行列・保護ドメイン</strong>の理論そのものです。
        「主体・客体・操作」の三つ組で権限を表すモデルは RBAC/ABAC の共通の土台であり、
        OS が学ぶ<strong>ファイルパーミッション・特権分離・カーネル/ユーザーモード</strong>と発想が地続きです。
        <strong>最小権限の原則</strong>はまさに OS の保護機構の設計思想で、SUID バイナリや <Cmd>sudo</Cmd> の誤設定が権限昇格を招くのと、
        クラウドの過剰 IAM ポリシーが AssumeRole 連鎖を招くのは同じ構造です。
        「デフォルト拒否」「多層防御」といった原則を、アプリ層・OS 層・クラウド層のどこでも一貫して適用することが、堅牢な認可の鍵になります。
      </Bridge>

      <Divider />

      <Quiz
        question="一般ユーザーが URL を書き換えて別ユーザーの注文を閲覧できた。この水平的権限昇格（IDOR）を根本から防ぐのはどれか？"
        options={[
          "管理ボタンを UI から隠す",
          "ID を連番ではなくランダムな UUID にするだけ",
          "アクセスのたびに「主体がそのリソースの所有者か」をサーバ側で検証する",
          "パスワードを複雑にする",
        ]}
        answer={2}
        explanation="IDOR の核心は、認証は通っているのにオブジェクトレベルの所有権チェックが抜けていることです。UUID 化や UI での隠蔽は推測を難しくするだけで認可の代わりにはなりません。アクセスごとに所有権をサーバ側で検証するのが根治策です。"
      />

      <KeyPoints
        items={[
          "RBAC は役割で権限を束ね、ABAC は属性で動的判定する。実務では併用も",
          "最小権限（PoLP）で被害範囲を絞り、デフォルト拒否で設定漏れが許可にならないようにする",
          "権限昇格は垂直（上位権限の獲得）と水平（他ユーザーへの越境＝IDOR）に分かれる",
          "IAM は過剰権限・AssumeRole 連鎖・PassRole 濫用に注意。最小権限と経路の棚卸しを徹底",
          "認可は集中レイヤで一元化し、全エンドポイントでサーバ側が毎回・所有権まで検証する",
        ]}
      />
    </>
  );
}

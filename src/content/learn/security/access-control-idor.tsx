import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "access-control-idor",
  title: "アクセス制御の不備と IDOR",
  description: "OWASP A01 首位。認証は通るが認可が欠落する脆弱性。水平/垂直の違い、ID を書き換えるだけの IDOR、デフォルト拒否とサーバ側検証。オープンリダイレクトにも触れる。",
  domain: "security",
  section: "web-sec",
  order: 8,
  level: "basic",
  tags: ["アクセス制御", "IDOR", "認可", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>アクセス制御の不備（Broken Access Control）</strong>は、認証済みユーザーに対する<strong>認可（誰が何をできるか）</strong>の強制が不十分で、本来の権限境界を越えてアクセスできてしまう脆弱性です。OWASP Top 10 2021 で<strong>第 1 位</strong>——テスト対象の平均 3.81% に該当し、約 31.8 万件が確認された、現在もっとも影響範囲の広いカテゴリです。その代表例が <strong>IDOR</strong> です。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>認証は通るが、認可が欠落している</Section>
      <p>
        まず「認証（Authentication）」と「認可（Authorization）」を切り分けます。<strong>認証</strong>は「あなたは誰か」を確かめること、<strong>認可</strong>は「あなたはこれをしてよいか」を確かめることです。アクセス制御の不備は、ログイン（認証）は正しく通っているのに、その先の<strong>認可チェックが抜けている</strong>状態を指します。
      </p>
      <p>
        根本原因は、認可チェックが<strong>サーバ側で・全エンドポイントで・一貫して</strong>実施されていないことにあります。UI で機能ボタンを隠すだけ、URL やパラメータの推測で別リソースに到達できる、ロールの検証が一部のエンドポイントだけ——こうした穴が典型です。「画面に出ていない＝アクセスできない」という<strong>隠蔽による安全性</strong>の思い込みが、この脆弱性を生みます。
      </p>

      <Section>IDOR — ID を書き換えるだけ</Section>
      <p>
        <strong>安全でない直接オブジェクト参照（IDOR）</strong>は、アクセス制御不備の最も分かりやすい形です。<Cmd>/api/orders/1024</Cmd> のように、リソースを推測可能な ID で直接参照させておきながら、サーバが「このリクエストの利用者は ID 1024 のリソースにアクセスする権限があるか」を検証しないと発生します。攻撃者は ID を <Cmd>1025</Cmd> <Cmd>1026</Cmd> と書き換えるだけで、他人のデータを取得・更新・削除できてしまいます。
      </p>
      <FlowChain
        nodes={[
          { label: "ログイン", sub: "認証は成功" },
          { label: "/orders/1024", sub: "自分の注文" },
          { label: "ID を 1025 に改変", sub: "他人の注文へ", variant: "alt" },
          { label: "認可なしで応答", sub: "他人のデータ露出", variant: "cta" },
        ]}
        caption="認証は通るが認可チェックがないため、ID の改変だけで他人の資源に到達する"
      />

      <Section>種類 — 水平と垂直</Section>
      <ComparisonTable
        headers={["方向", "内容", "帰結"]}
        rows={[
          ["水平方向 (Horizontal)", "同じ権限レベルの別ユーザーの資源へアクセス", "他人の個人情報の閲覧・改ざん"],
          ["垂直方向 (Vertical)", "一般ユーザーが管理者専用の機能・データへアクセス", "権限昇格を伴う。管理機能の奪取"],
          ["強制ブラウジング", "認可なしで保護 URL に直接到達", "隠されただけの管理画面への侵入"],
          ["メタデータ改ざん", "JWT クレーム・Cookie・隠しフィールドを改変", "権限の偽装"],
        ]}
      />
      <Callout variant="warn" title="垂直 IDOR は権限昇格に直結">
        水平方向は「同じ立場の他人」への越境ですが、垂直方向は「上位の立場」への越境で、<strong>管理者機能の奪取や全体侵害</strong>に発展します。ID の改変だけでなく、ロールを示すパラメータや JWT のクレームが<strong>サーバ側で再検証されているか</strong>が問われます。
      </Callout>

      <Section>影響</Section>
      <KVList
        items={[
          { key: "大量の情報漏えい", val: "ID を列挙して他ユーザーのデータを一括取得される" },
          { key: "改ざん・削除", val: "書き込み型なら他人のデータを書き換え・消去される" },
          { key: "権限昇格", val: "垂直方向では管理機能を奪われ全体侵害へ" },
        ]}
      />

      <Section>防御 — デフォルト拒否とサーバ側検証</Section>
      <p>
        原則は<strong>デフォルト拒否（deny by default）</strong>です。明示的に許可されたものだけを通し、それ以外はすべて拒否します。そのうえで、<strong>すべてのオブジェクトアクセスでサーバ側の認可チェック</strong>——所有権やロールの検証——を必須にします。
      </p>
      <p>
        実装のコツは、「現在のセッション利用者が所有するレコードか」を<strong>クエリ条件そのものに組み込む</strong>ことです。取得してから権限を確認するのではなく、<strong>最初から自分のものしか取れないクエリ</strong>にすれば、確認漏れが起こりません。
      </p>
      <Code lang="sql" filename="危険な書き方（所有権を検証しない）">{`-- ID さえ合えば誰のものでも返してしまう
SELECT * FROM orders WHERE id = :order_id;`}</Code>
      <Code lang="sql" filename="安全な書き方（所有権をクエリに組み込む）">{`-- 現在のユーザーが所有する行しか取れない
SELECT * FROM orders
WHERE id = :order_id AND user_id = :current_user_id;`}</Code>
      <SubSection>併用したい対策</SubSection>
      <ul>
        <li><strong>中央集約された認可レイヤ</strong> — ポリシーエンジンで認可を一箇所に集め、エンドポイントごとの実装ばらつきを防ぐ。</li>
        <li><strong>間接参照や UUID</strong> — 連番 ID の推測を難しくする。ただし<strong>認可の代替にはしない</strong>（推測困難化は補助）。</li>
        <li><strong>認可失敗のロギングとアラート</strong> — 異常な ID 列挙を検知する。</li>
        <li><strong>2 アカウントでの相互アクセステスト</strong> — 別ユーザーの資源に届かないことを自動テストで担保する。</li>
      </ul>

      <SubSection>関連: オープンリダイレクト</SubSection>
      <p>
        アクセス制御の周辺で見落とされがちなのが<strong>オープンリダイレクト</strong>です。<Cmd>?url=</Cmd> や <Cmd>?next=</Cmd> のようなパラメータでリダイレクト先を外部から指定でき、かつ検証がないと、攻撃者は<strong>正規ドメインのリンク</strong>を踏み台に被害者を攻撃者サイトへ誘導できます。フィッシングの信頼性を高めたり、OAuth の <Cmd>redirect_uri</Cmd> 検証が緩い場合はトークン窃取に直結したりします。防御は、リダイレクト先を<strong>サーバ側の許可リスト</strong>で固定パス・登録済みドメインに限定し、外部 URL を直接受け取らないことです。OAuth では <Cmd>redirect_uri</Cmd> を<strong>完全一致で厳密検証</strong>します。
      </p>

      <Bridge course="オペレーティングシステム / アクセス制御モデル">
        アクセス制御の不備は、OS で習う<strong>アクセス制御モデル</strong>（主体・オブジェクト・許可の三つ組）が Web で崩れる話です。OS はファイルへのアクセスのたびに「この主体（プロセス）はこのオブジェクト（ファイル）に対しこの操作を許されているか」をカーネルが<strong>参照モニタ</strong>として毎回チェックします。Web でも同じで、リクエストごとに<strong>サーバ側の参照モニタ</strong>が認可を判定しなければなりません。IDOR は、この参照モニタが「認証は見るが認可は見ない」状態です。デフォルト拒否は、OS でいう<strong>最小権限の原則</strong>そのもので、「明示的に許可されたものだけ」という設計が、確認漏れを構造的に防ぎます。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "OWASP A01 首位。認証は通るが認可（誰が何をできるか）が欠落する",
          "IDOR は ID を書き換えるだけで他人の資源に到達する代表例",
          "水平方向は同じ立場の他人へ、垂直方向は上位権限へ越境する",
          "デフォルト拒否 + サーバ側の認可チェック。所有権をクエリに組み込む",
          "オープンリダイレクトは許可リストで固定し、redirect_uri は完全一致検証",
        ]}
      />

      <Quiz
        question="IDOR（安全でない直接オブジェクト参照）の本質はどれ？"
        options={[
          "入力がエスケープされず HTML に反映されること",
          "認証は通っているが、オブジェクト単位の認可（所有権チェック）が欠落していること",
          "Cookie が自動付与されること",
          "TLS 設定が古いこと",
        ]}
        answer={1}
        explanation="IDOR はログイン（認証）は成功しているのに、「そのユーザーがそのオブジェクトにアクセスしてよいか」という認可の検証が抜けている状態です。所有権をクエリ条件に組み込むのが有効です。"
      />
    </>
  );
}

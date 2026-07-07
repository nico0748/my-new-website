import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "oauth2",
  title: "OAuth 2.0 — 認可の委譲",
  description: "ユーザーのパスワードを渡さずにアクセス権を委譲する認可フレームワーク。4 つのロール、認可コードグラント / クライアントクレデンシャル、PKCE、OAuth 2.1、そして「認可であって認証ではない」という要点を図解で押さえる。",
  domain: "security",
  section: "auth",
  order: 4,
  level: "basic",
  tags: ["OAuth", "OAuth2.0", "認可", "PKCE", "アクセストークン"],
  updated: "2026-07-07",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>OAuth 2.0</strong>（RFC 6749）は、ユーザーのパスワードを第三者アプリに渡すことなく、
        <strong>限定的なアクセス権（アクセストークン）を委譲する</strong>ための認可フレームワークです。
        「Google Drive の写真だけをこのアプリに読ませる」といった、権限を絞った委譲を安全に実現します。
        最重要ポイントは、OAuth が<strong>「認可」の仕組みであって、それ自体は「認証（本人確認）」を定義しない</strong>ことです。
      </Lead>

      <Section>4 つのロール</Section>
      <p>
        OAuth を理解する第一歩は登場人物を整理することです。RFC 6749 は次の 4 つの役割を定義します。
      </p>
      <KVList
        items={[
          { key: "Resource Owner（リソース所有者）", val: "アクセスを許可できる主体。通常はエンドユーザー本人。" },
          { key: "Client（クライアント）", val: "ユーザーの代わりにリソースへアクセスしたいアプリ。" },
          { key: "Authorization Server（認可サーバー）", val: "ユーザーを認証し同意を得て、アクセストークンを発行する。" },
          { key: "Resource Server（リソースサーバー）", val: "トークンを検証して保護リソース（API）を提供する。" },
        ]}
      />
      <SubSection>トークンとスコープ</SubSection>
      <KVList
        items={[
          { key: "Access Token", val: "リソースアクセスに使う短命の権限証。Bearer トークンとして扱われることが多い。実体は JWT か不透明（opaque）文字列。" },
          { key: "Refresh Token", val: "アクセストークン失効後に再発行を受けるための長命トークン。" },
          { key: "Scope", val: "トークンに紐づく権限範囲（例：read:profile）。最小権限で絞る。" },
        ]}
      />

      <Section>認可コードグラント（Authorization Code Grant）</Section>
      <p>
        もっとも標準的で安全なフローが<strong>認可コードグラント</strong>です。ポイントは、アクセストークン本体を
        <strong>ユーザーのブラウザに一度も晒さない</strong>こと。ブラウザにはいったん<strong>認可コード</strong>という一時的な引換券だけを渡し、
        クライアントのサーバがバックチャネル（サーバ間通信）でそれをトークンに交換します。
      </p>
      <Steps>
        <Step title="認可要求">クライアントがユーザーを認可サーバーへリダイレクトする</Step>
        <Step title="同意">ユーザーが認可サーバーでログインし、要求されたスコープに同意する</Step>
        <Step title="認可コード">認可サーバーが一時的な認可コードをクライアントに返す</Step>
        <Step title="トークン交換">クライアントのサーバがコードをアクセストークンに交換する（バックチャネル）</Step>
        <Step title="リソースアクセス">アクセストークンでリソースサーバーの API を呼ぶ</Step>
      </Steps>
      <SequenceDiagram
        actors={["ユーザー", "クライアント", "認可サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① 連携を開始" },
          { from: 1, to: 2, label: "② 認可へリダイレクト" },
          { from: 2, to: 0, label: "③ ログイン & スコープ同意" },
          { from: 2, to: 1, label: "④ 認可コードを返す", cta: true },
          { from: 1, to: 2, label: "⑤ コード＋secret でトークン要求" },
          { from: 2, to: 1, label: "⑥ アクセストークン発行", cta: true },
        ]}
        caption="OAuth 2.0 認可コードフロー。トークンはブラウザを経由せず、サーバ間で受け渡す"
      />

      <Section>そのほかのグラントタイプ</Section>
      <ComparisonTable
        headers={["グラント", "用途", "現在の位置づけ"]}
        rows={[
          ["Authorization Code", "Web／SPA／モバイル（標準）", "推奨（PKCE 併用）"],
          ["Client Credentials", "ユーザー不在のサーバ間通信（M2M）", "推奨"],
          ["Implicit", "ブラウザ JS 向けの簡略版", "非推奨（2.1 で廃止方向）"],
          ["Resource Owner Password", "アプリがパスワードを直接扱う", "原則非推奨"],
        ]}
      />
      <p>
        <Cmd>Client Credentials</Cmd> は、バッチ処理やサービス間 API のように<strong>ユーザーが介在しない</strong>場面で、
        クライアント自身の資格情報でトークンを取得します。<Cmd>Implicit</Cmd> はトークンをブラウザに直接返すため漏洩リスクが高く、いまは使いません。
      </p>

      <Section>PKCE — 公開クライアントを守る</Section>
      <p>
        SPA やモバイルアプリは<strong>クライアントシークレットを安全に保持できない</strong>「公開クライアント」です。
        シークレットが使えないと、盗まれた認可コードをそのままトークンに交換されてしまう
        <strong>認可コード横取り攻撃</strong>が成立し得ます。これを防ぐのが <strong>PKCE（Proof Key for Code Exchange, RFC 7636）</strong>です。
      </p>
      <Steps>
        <Step title="verifier 生成">クライアントが乱数 code_verifier を生成する</Step>
        <Step title="challenge 送付">そのハッシュ code_challenge を認可要求に含めて送る</Step>
        <Step title="交換時に検証">トークン交換時に元の code_verifier を提示し、認可サーバーがハッシュと突き合わせて検証する</Step>
      </Steps>
      <Callout variant="tip" title="いまは全クライアントで PKCE 推奨">
        当初は公開クライアント向けでしたが、<strong>現在はすべてのクライアントで PKCE が推奨</strong>され、OAuth 2.1 では必須化の方向です。
        認可コードを横取りされても、対応する <Cmd>code_verifier</Cmd> を知らなければトークンに交換できません。
      </Callout>

      <Section>OAuth 2.1 — ベストプラクティスの統合</Section>
      <p>
        <strong>OAuth 2.1</strong> は、複数の RFC と BCP（ベストプラクティス）を整理・統合した版です。
        <strong>Implicit と Password グラントを廃止</strong>し、<strong>Authorization Code + PKCE を中心</strong>に据えます。
        新規実装は基本的にこの構成を選べば大きく外しません。
      </p>

      <Callout variant="danger" title="OAuth を「ログイン」に素朴に使わない">
        OAuth 2.0 は<strong>認可</strong>フレームワークであり、「誰がログインしたか」を標準的に伝える仕組みを持ちません。
        「OAuth でログイン」を素朴に実装すると本人確認として不十分になります。<strong>本人認証が必要なら、上位の OpenID Connect（OIDC）を使う</strong>のが正解です（次の記事で扱います）。
      </Callout>
      <Callout variant="warn" title="実装の落とし穴">
        <Cmd>redirect_uri</Cmd> は完全一致で検証（オープンリダイレクト防止）、<Cmd>state</Cmd> パラメータで CSRF を防ぐ、
        トークンを localStorage に置かない（XSS 窃取対策）、スコープを最小限に絞る——これらを省くと、コードやトークンの窃取につながります。
      </Callout>

      <Bridge course="分散システム / 情報セキュリティ">
        OAuth は、講義で学ぶ<strong>分散システムにおける権限委譲とケイパビリティ（capability）</strong>の実装例です。
        アクセストークンは「これを持っている者にこの範囲の操作を許す」というケイパビリティトークンそのもので、
        パスワード（＝万能の資格情報）を渡す代わりに<strong>スコープで限定した権限だけを移譲</strong>します。
        これは<strong>最小権限の原則</strong>を委譲の設計に落とし込んだものです。認可コードをブラウザに晒さずサーバ間で交換する設計は、
        「秘密を通す経路と通さない経路を分ける」という<strong>信頼境界（trust boundary）</strong>の考え方に直結します。
      </Bridge>

      <Divider />

      <Quiz
        question="OAuth 2.0 について正しい説明はどれか？"
        options={[
          "OAuth 2.0 は認証（本人確認）の標準であり、ログインの実装に十分である",
          "OAuth 2.0 は認可（アクセス権の委譲）の仕組みで、本人認証には OIDC を併用する",
          "Implicit グラントが最も安全で推奨されている",
          "PKCE は機密クライアント専用で、SPA では使えない",
        ]}
        answer={1}
        explanation="OAuth 2.0 は認可フレームワークで、それ自体は「誰がログインしたか」を伝えません。本人認証が必要なら OIDC を重ねます。Implicit は非推奨、PKCE は今や全クライアントで推奨（とくに SPA/モバイルで重要）です。"
      />

      <KeyPoints
        items={[
          "OAuth 2.0 はパスワードを渡さずアクセス権を委譲する認可フレームワーク（RFC 6749）",
          "4 ロール：リソース所有者・クライアント・認可サーバー・リソースサーバー",
          "認可コードグラントはトークンをブラウザに晒さずサーバ間で交換する標準フロー",
          "PKCE は認可コード横取りを防ぐ。今は全クライアントで推奨、OAuth 2.1 で必須化の方向",
          "OAuth は認可であって認証ではない。ログインには OIDC を重ねる",
        ]}
      />
    </>
  );
}

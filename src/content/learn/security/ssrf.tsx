import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "ssrf",
  title: "SSRF — サーバを踏み台にされる",
  description: "サーバに任意の宛先へリクエストを送らせ、外部から届かない内部資源やクラウドメタデータ（169.254.169.254）へ到達する攻撃。allowlist・DNS 再検証・IMDSv2 による防御を理解する。",
  domain: "security",
  section: "web-sec",
  order: 5,
  level: "basic",
  tags: ["SSRF", "クラウド", "内部ネットワーク", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>サーバサイドリクエストフォージェリ（SSRF）</strong>は、攻撃者がアプリケーションサーバを<strong>踏み台</strong>にして、サーバから任意の URL やホストへリクエストを発行させる脆弱性です。サーバは内部ネットワークやクラウドのメタデータエンドポイントに到達できるため、外部攻撃者が<strong>直接は届かない資源へ間接的にアクセス</strong>できてしまいます。OWASP Top 10 2021 では A10 として独立カテゴリになりました。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。具体的なメタデータパスを用いた窃取手順は掲載しません。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>なぜ起きるのか — URL を信頼して取りに行く</Section>
      <p>
        「URL を入力として受け取り、その先からデータを取得する」機能が SSRF の温床です。画像の取り込み、Webhook の送信、外部サイトのプレビュー生成、PDF 化、インポート——いずれも<strong>サーバが利用者の指定した宛先へアクセスする</strong>点が共通します。ここで宛先を十分に検証しないと、攻撃者は宛先に内部アドレスを指定できます。
      </p>
      <p>
        攻撃者が <Cmd>http://169.254.169.254/…</Cmd>（クラウドのメタデータサービス）や <Cmd>http://127.0.0.1:port</Cmd>（サーバ自身の内部サービス）を指定すると、サーバは<strong>自身のネットワーク位置と権限</strong>でそこへアクセスし、結果を攻撃者へ返したり副作用を起こしたりします。外部からは決して届かないアドレスに、信頼されたサーバ経由で手が届いてしまうわけです。
      </p>

      <Section>攻撃の構図</Section>
      <FlowChain
        nodes={[
          { label: "攻撃者", sub: "内部向けURLを指定" },
          { label: "脆弱サーバ", sub: "検証せず取得", variant: "alt" },
          { label: "内部/メタデータ", sub: "169.254.169.254 等", variant: "cta" },
          { label: "認証情報漏えい", sub: "IAM トークン窃取など" },
        ]}
        caption="攻撃者は脆弱サーバを踏み台に、外部から届かない内部資源やメタデータへ到達する"
      />
      <Callout variant="warn" title="クラウドメタデータが特に危険">
        クラウド環境のメタデータサービス（<Cmd>169.254.169.254</Cmd>）は、インスタンスに紐づく<strong>一時的な IAM 認証情報</strong>を返すことがあります。SSRF でこれを窃取されると、攻撃者はサーバの権限でクラウド API を叩けるようになり、<strong>権限昇格やアカウント乗っ取り</strong>へ一気に発展します。SSRF が「単なる情報取得」で済まない理由がここにあります。
      </Callout>

      <Section>SSRF の種類</Section>
      <ComparisonTable
        headers={["種類", "特徴", "攻撃者への結果"]}
        rows={[
          ["基本型 (in-band)", "取得した応答が攻撃者に返る", "内部情報を直接読み取れる"],
          ["ブラインド (Blind)", "応答は返らない", "DNS/HTTP コールバックの有無で到達を確認し、副作用を悪用"],
          ["メタデータ攻撃", "クラウドメタデータへ到達", "一時認証情報（IAM トークン）を窃取し権限昇格へ"],
        ]}
      />

      <Section>影響</Section>
      <KVList
        items={[
          { key: "認証情報の窃取", val: "クラウド一時認証情報を盗みアカウントを乗っ取る" },
          { key: "内部スキャン・API 悪用", val: "内部ネットワークの探索や内部 API の不正利用" },
          { key: "境界の突破", val: "ファイアウォール越しの内部サービスへ到達する" },
          { key: "RCE への連鎖", val: "内部の脆弱なサービス経由でコード実行にまで発展し得る" },
        ]}
      />

      <Section>防御 — 拒否リストではなく許可リスト</Section>
      <p>
        ありがちな失敗は「危ないアドレスを<strong>ブロックリスト</strong>で弾く」やり方です。IP 表記は 10 進・8 進・IPv6・短縮形など多様で、DNS リバインディングやリダイレクトも絡むため、拒否リストは<strong>ほぼ確実に回避されます</strong>。防御は「良い宛先だけを通す」発想に切り替えます。
      </p>
      <SubSection>1. 許可リスト（allowlist）で宛先を限定</SubSection>
      <p>
        接続してよいドメイン/IP を<strong>厳格に列挙</strong>し、それ以外を拒否します。可能なら、利用者に URL を直接入力させず、<strong>識別子から内部でマッピング</strong>して宛先を決めるのが最も安全です。
      </p>
      <SubSection>2. 内部 IP 帯への送信を拒否</SubSection>
      <ul>
        <li>ループバック（<Cmd>127.0.0.0/8</Cmd>）</li>
        <li>リンクローカル（<Cmd>169.254.0.0/16</Cmd>。メタデータの <Cmd>169.254.169.254</Cmd> を含む）</li>
        <li>プライベート帯（<Cmd>10.0.0.0/8</Cmd> ほか RFC1918）</li>
      </ul>
      <SubSection>3. DNS 解決後の IP を再検証</SubSection>
      <p>
        ホスト名を検証しても、<strong>DNS が解決する IP</strong>が内部アドレスを指すよう仕込まれる（DNS リバインディング）ことがあります。名前解決<strong>後</strong>の実際の IP を検証し、リダイレクトは追わない、追う場合も都度検証します。
      </p>
      <Code lang="text" filename="防御の考え方（擬似）">{`# NG: 拒否リスト（回避されやすい）
if host in ["169.254.169.254", "localhost"]: block()

# OK: 許可リスト + 解決後IPの検証
resolved_ip = resolve(host)
if not in_allowlist(host):            reject()
if is_private_or_linklocal(resolved_ip): reject()
# リダイレクトは追わない／追うなら毎回同じ検証を通す`}</Code>
      <SubSection>4. クラウド側・ネットワーク側の対策</SubSection>
      <ul>
        <li><strong>IMDSv2 へ移行</strong> — メタデータ取得にトークンを必須化する方式に切り替え、単純な GET でのメタデータ取得を封じる。</li>
        <li><strong>取得結果をそのまま返さない</strong> — 応答を攻撃者に返さなければ in-band での情報漏えいを抑えられる。</li>
        <li><strong>egress のセグメンテーション</strong> — サーバから外向き通信の宛先をネットワークレベルで制限する。</li>
      </ul>

      <Bridge course="ネットワーク / 信頼境界・多層防御">
        SSRF は、ネットワークで習う<strong>信頼境界</strong>の落とし穴そのものです。多くの設計は「内部ネットワークは信頼境界の内側だから安全」と暗黙に前提しますが、SSRF はその内側にいるサーバを操ることで境界を無効化します。「境界の内側は安全」という前提を捨て、内部通信も検証する——これは<strong>ゼロトラスト</strong>の考え方です。また、許可リスト・IP 帯拒否・解決後 IP の再検証・egress 制限という<strong>複数の独立した層</strong>を重ねるのは、講義で学ぶ多層防御（defense in depth）の実践例で、どれか一枚が破れても次の層で止める設計になっています。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "SSRF はサーバを踏み台に、外部から届かない内部資源へ到達する",
          "特に危険なのはクラウドメタデータ（169.254.169.254）からの認証情報窃取",
          "拒否リストは IP 表記の多様性や DNS リバインディングで回避される",
          "許可リスト + 解決後 IP の再検証 + 内部 IP 帯の拒否が基本",
          "IMDSv2 への移行・結果を返さない・egress 制限を併用する",
        ]}
      />

      <Quiz
        question="SSRF の防御として最も堅牢な方針はどれ？"
        options={[
          "既知の危険アドレスを拒否リストで弾く",
          "許可リストで宛先を限定し、DNS 解決後の IP も再検証する",
          "リクエストを HTTPS に限定する",
          "取得先の応答をログに残す",
        ]}
        answer={1}
        explanation="拒否リストは IP 表記の多様性や DNS リバインディングで回避されます。良い宛先だけを通す許可リストに、名前解決後の実 IP の検証を組み合わせるのが堅牢です。"
      />
    </>
  );
}

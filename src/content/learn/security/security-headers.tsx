import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "security-headers",
  title: "セキュリティヘッダと TLS ハードニング",
  description: "CSP（Report-Only からの段階移行）・HSTS・X-Content-Type-Options・X-Frame-Options・Referrer-Policy・Permissions-Policy と、TLS1.2/1.3 のみ・AEAD 暗号への堅牢化。設定不備を減らす運用の考え方。",
  domain: "security",
  section: "web-sec",
  order: 10,
  level: "basic",
  tags: ["セキュリティヘッダ", "CSP", "HSTS", "TLS", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        ここまではコードの脆弱性を見てきましたが、Web の安全は<strong>設定と運用</strong>でも大きく左右されます。<strong>セキュリティヘッダ</strong>はブラウザに「この振る舞いを禁止せよ」と指示する多層防御の層で、<strong>TLS のハードニング</strong>は通信の暗号を最新・強固に保つ設定です。どちらも「安全でない既定値を放置しない」——OWASP A05（セキュリティ設定不備）への対策そのものです。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        防御・学習目的です。判断軸は OWASP Secure Headers Project・MDN・Mozilla SSL Configuration Generator に基づきます。本番投入前は必ず差分を確認してください。
      </Callout>

      <Section>なぜヘッダで守るのか — 設定不備という穴</Section>
      <p>
        <strong>セキュリティ設定不備</strong>は、コードのバグではなく<strong>設定面</strong>の欠陥です。安全でない既定値、不要機能の公開、そして<strong>セキュリティヘッダの欠如</strong>——OWASP のデータではテスト対象の 90% に何らかの設定不備が見られたとされ、範囲の広さが際立ちます。セキュリティヘッダは、XSS やクリックジャッキングといった攻撃の<strong>被害を低減する保険</strong>を、レスポンスヘッダ一行で有効にできる手軽で強力な層です。
      </p>

      <Section>主要なセキュリティヘッダ一覧</Section>
      <ComparisonTable
        headers={["ヘッダ", "役割", "推奨値の例"]}
        rows={[
          [<Cmd>Content-Security-Policy</Cmd>, "スクリプト等の読み込み元を制限し XSS を低減", "段階移行（下記）。frame-ancestors 'none' 等を明示"],
          [<Cmd>Strict-Transport-Security</Cmd>, "以後 HTTPS を強制（HSTS）", "max-age=63072000; includeSubDomains; preload"],
          [<Cmd>X-Content-Type-Options</Cmd>, "MIME スニッフィングを禁止", "nosniff"],
          [<Cmd>X-Frame-Options</Cmd>, "フレーム埋め込みを禁止（クリックジャッキング対策）", "DENY（新標準は CSP frame-ancestors）"],
          [<Cmd>Referrer-Policy</Cmd>, "リファラの送出を制御", "strict-origin-when-cross-origin"],
          [<Cmd>Permissions-Policy</Cmd>, "camera/mic/geolocation 等の機能を無効化", "未使用機能を () で無効化"],
        ]}
      />
      <Callout variant="warn" title="X-XSS-Protection は使わない">
        古い <Cmd>X-XSS-Protection</Cmd> は現代ブラウザでは非推奨で、無効化が推奨されています。XSS 対策は<strong>出力エスケープと CSP に集約</strong>してください。
      </Callout>

      <Section>CSP は Report-Only から段階移行する</Section>
      <p>
        CSP（Content-Security-Policy）は強力ですが、<strong>いきなり enforce（強制）すると正規のスクリプトやスタイルまで止まり、機能が壊れます</strong>。そこで、まず違反を「報告させるだけで止めない」<Cmd>Content-Security-Policy-Report-Only</Cmd> で配信し、実際の違反を収集します。違反がゼロになったことを確認してから enforce へ切り替える——この段階移行が定石です。
      </p>
      <StepFlow
        steps={[
          { title: "Report-Only で配信", desc: "Content-Security-Policy-Report-Only で違反を収集する。まだブロックはしない" },
          { title: "違反を分析・修正", desc: "report-to で集めた違反を見て、正規リソースをポリシーに反映。インラインは nonce/hash へ移行" },
          { title: "違反ゼロを確認", desc: "厳格な Report-Only を走らせ、正規機能で違反が出ないことを確かめる" },
          { title: "enforce へ切替", desc: "Content-Security-Policy として本適用。frame-ancestors/object-src/base-uri/form-action を明示" },
        ]}
        caption="CSP は Report-Only → 分析 → 違反ゼロ確認 → enforce の順で段階的に導入する"
      />
      <Code lang="http" filename="Report-Only で開始">{`Content-Security-Policy-Report-Only:
  default-src 'self';
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'none';
  form-action 'self';
  report-to csp-endpoint`}</Code>
      <Callout variant="danger" title="'unsafe-inline' は CSP を無力化する">
        インラインスクリプトを許すために <Cmd>'unsafe-inline'</Cmd> を常用すると、CSP の XSS 低減効果がほぼ失われます。インラインは <strong>nonce / hash + <Cmd>strict-dynamic</Cmd></strong> へ移行してください。
      </Callout>

      <Section>HSTS — HTTPS を強制する（不可逆に注意）</Section>
      <p>
        <Cmd>Strict-Transport-Security</Cmd>（HSTS）は、ブラウザに「今後このサイトは必ず HTTPS で接続せよ」と記憶させます。中間者による HTTP へのダウングレードを防ぐ重要な設定ですが、<strong>影響が不可逆で取り消しに時間がかかる</strong>ため、慎重に進めます。
      </p>
      <KVList
        items={[
          { key: "前提", val: "HTTP→HTTPS リダイレクトが完全に機能してから導入する" },
          { key: <Cmd>includeSubDomains</Cmd>, val: "全サブドメインが HTTPS 対応済みであることを確認してから付ける" },
          { key: <Cmd>preload</Cmd>, val: "全配下の HTTPS 化が完了してから hstspreload.org へ申請する（登録解除は困難）" },
        ]}
      />

      <Section>クリックジャッキング・MIME・参照元・機能制御</Section>
      <ul>
        <li><strong>クリックジャッキング</strong> — <Cmd>X-Frame-Options: DENY</Cmd> と CSP の <Cmd>frame-ancestors 'none'</Cmd>（新標準・優先）を併用する。フレーム埋め込みを正当に使う場合のみ許可元を限定する。</li>
        <li><strong>MIME スニッフィング</strong> — <Cmd>X-Content-Type-Options: nosniff</Cmd> で、ブラウザが Content-Type を勝手に推測するのを止める。</li>
        <li><strong>参照元</strong> — <Cmd>Referrer-Policy: strict-origin-when-cross-origin</Cmd>（現代ブラウザ既定だが明示推奨）。</li>
        <li><strong>機能制御</strong> — <Cmd>Permissions-Policy</Cmd> で camera・microphone・geolocation など未使用機能を <Cmd>()</Cmd> で無効化する。デフォルト許可の機能を絞る攻めの設定。</li>
      </ul>

      <Section>TLS ハードニング — 1.2/1.3 のみ・AEAD</Section>
      <p>
        通信の暗号化も設定次第で穴になります。基準は Mozilla SSL Configuration Generator の <strong>Intermediate（汎用サーバ推奨）</strong>です。要点は次の通りです。
      </p>
      <KVList
        items={[
          { key: "許可プロトコル", val: "TLS1.2 / TLS1.3 のみ。SSLv3・TLS1.0・1.1 は無効化" },
          { key: "暗号スイート", val: "PFS + AEAD のみ（TLS1.3: AES-GCM/CHACHA20、TLS1.2: ECDHE-*-GCM/CHACHA20）" },
          { key: "無効化するもの", val: "RC4・3DES・CBC などの弱いスイート" },
          { key: "証明書", val: "有効期限・CN/SAN 一致・チェーン完全性を確認（中間証明書欠落に注意）" },
        ]}
      />
      <Callout variant="tip" title="計測 → 設定 → 再計測を反復する">
        SSL Labs・Mozilla Observatory・securityheaders でベースラインを取り、設定変更のたびに再計測します。<strong>改善は計測と再計測の反復</strong>で進め、本番投入前に必ず差分を確認します。互換要件がなければ Modern 設定も検討します。
      </Callout>

      <Bridge course="ネットワーク / 暗号・多層防御">
        セキュリティヘッダと TLS は、ネットワークで習う<strong>層ごとの責務</strong>を体現しています。TLS は<strong>トランスポート層</strong>で盗聴・改ざん・なりすましを防ぎ、PFS（前方秘匿性）は「鍵が将来漏れても過去の通信は解読されない」性質、AEAD は「暗号化と改ざん検知を一体で行う」方式で、いずれも暗号の授業で扱う概念です。一方セキュリティヘッダは<strong>アプリケーション層</strong>で、ブラウザという実行環境の振る舞いを制約します。CSP の Report-Only からの段階移行は、<strong>fail-safe</strong>（安全側に倒す）設計と<strong>可観測性</strong>（まず観測してから制御する）の実践で、ネットワーク運用で学ぶ「変更は計測と切り戻し可能性を伴って行う」原則そのものです。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "セキュリティヘッダは設定不備（A05）を塞ぐ手軽で強力な多層防御",
          "CSP は Report-Only → 違反ゼロ確認 → enforce の段階移行。'unsafe-inline' は避ける",
          "HSTS は不可逆。HTTP→HTTPS 完全化を確認してから includeSubDomains/preload",
          "nosniff・frame-ancestors・Referrer-Policy・Permissions-Policy を明示する",
          "TLS は 1.2/1.3 のみ・PFS+AEAD。計測→設定→再計測を反復する",
        ]}
      />

      <Quiz
        question="CSP を安全に導入する進め方として正しいのはどれ？"
        options={[
          "最初から enforce で配信し、壊れた機能を後で直す",
          "Report-Only で違反を収集し、違反ゼロを確認してから enforce に切り替える",
          "'unsafe-inline' を許可してすべてのインラインを通す",
          "CSP は使わず X-XSS-Protection に任せる",
        ]}
        answer={1}
        explanation="いきなり enforce すると正規機能が止まります。Report-Only で違反を収集・修正し、違反ゼロを確認してから enforce へ移すのが定石です。'unsafe-inline' は CSP を無力化し、X-XSS-Protection は非推奨です。"
      />
    </>
  );
}

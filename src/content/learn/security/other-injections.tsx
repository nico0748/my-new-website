import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "other-injections",
  title: "その他のインジェクション — デシリアライズ・SSTI・XXE",
  description: "安全でないデシリアライズ（ガジェットチェーン）、SSTI（テンプレ評価→RCE）、XXE（外部実体）。いずれも RCE に至りやすい 3 つを、共通の根本原因「信頼できない入力を評価/復元しない」で束ねて理解する。",
  domain: "security",
  section: "web-sec",
  order: 9,
  level: "practice",
  tags: ["デシリアライズ", "SSTI", "XXE", "RCE", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        SQLi・XSS・OS コマンドに続く、やや進んだインジェクション 3 種——<strong>安全でないデシリアライズ</strong>・<strong>SSTI</strong>・<strong>XXE</strong>——をまとめて扱います。いずれもサーバ側で<strong>RCE（任意コード実行）に至りやすい</strong>危険な脆弱性ですが、根っこは 1 つ。「<strong>信頼できない入力を、評価したり復元したりしてしまう</strong>」という共通の失敗です。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。エンジン固有の RCE ガジェットチェーンや外部実体ペイロードは掲載しません。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>3 つを貫く 1 つの根本原因</Section>
      <p>
        これまで見てきた SQLi や XSS が「入力を<strong>命令として構文解析</strong>させてしまう」問題だったのに対し、この 3 種は「入力を<strong>そのまま評価・復元</strong>してしまう」問題です。テンプレートとして評価する、オブジェクトとして復元する、外部実体を解決する——どれも「データのはずのものに、実行の力を与えてしまった」構図です。
      </p>
      <LayerStack
        layers={[
          { label: "共通の根本原因", sub: "信頼できない入力を評価/復元/解決してしまう" },
          { label: "安全でないデシリアライズ", sub: "入力をオブジェクトへ復元→ガジェットチェーン" },
          { label: "SSTI", sub: "入力をテンプレート構文として評価→RCE" },
          { label: "XXE", sub: "XML 外部実体を解決→ファイル読取・SSRF" },
        ]}
        caption="評価・復元・解決という「実行の力」を、信頼できない入力に与えてしまう点が共通"
      />

      <Section>安全でないデシリアライズ</Section>
      <p>
        シリアライズはオブジェクトをバイト列や文字列へ変換し、デシリアライズはその逆です。多くの言語のネイティブなデシリアライズ機構は、復元の過程でオブジェクトのコンストラクタや<strong>マジックメソッド</strong>（Java の <Cmd>readObject</Cmd>、PHP の <Cmd>__wakeup</Cmd>/<Cmd>__destruct</Cmd>、Python の <Cmd>pickle</Cmd> など）を<strong>自動的に呼び出します</strong>。
      </p>
      <p>
        攻撃者は、復元時にこれら既存クラスのメソッドが連鎖して発火するよう細工したデータを送り込みます。この連鎖を<strong>ガジェットチェーン</strong>と呼び、最終的に危険な操作（コマンド実行など）へ到達させます。入力を「単にデータへ戻す」つもりが、実際には「攻撃者の描いた処理を実行する」ことになってしまうわけです。
      </p>
      <Callout variant="tip" title="対策: 信頼できないデータをネイティブデシリアライズしない">
        最重要は、<Cmd>pickle</Cmd> / Java native / <Cmd>BinaryFormatter</Cmd> などを<strong>外部入力に使わない</strong>ことです。必要ならデータ専用フォーマット（厳密設定の JSON）と<strong>明示的な型許可リスト</strong>を使います。Cookie や隠しフィールドでシリアライズデータを往復させる場合は、<strong>署名/HMAC で完全性を検証</strong>し改ざんを検知します。
      </Callout>

      <Section>SSTI（サーバサイドテンプレートインジェクション）</Section>
      <p>
        テンプレートエンジン（Jinja2・Twig・Freemarker・ERB など）は <Cmd>{`{{ ... }}`}</Cmd> や <Cmd>${'{ ... }'}</Cmd> のような構文を評価して値を埋め込みます。安全な使い方は「テンプレートは固定で、利用者入力は<strong>データとして変数に渡す</strong>」ことです。ところが入力を<strong>テンプレート文字列そのものに連結</strong>すると、入力中のテンプレート構文がエンジンに評価され、変数参照やメソッド呼び出しを経て、しばしば OS コマンド実行にまで到達します。
      </p>
      <p>
        XSS と似ていますが、評価が<strong>クライアントではなくサーバ側</strong>で起きる点が決定的な違いで、影響がはるかに深刻です。
      </p>
      <Code lang="python" filename="危険な書き方（入力をテンプレート本体に）">{`# 入力がテンプレート構文として評価されてしまう
render_template_string("Hello " + user_input)`}</Code>
      <Code lang="python" filename="安全な書き方（入力はデータとして変数へ）">{`# テンプレートは固定。入力は変数の値として渡す
render_template("hello.html", name=user_input)`}</Code>
      <Callout variant="warn" title="ユーザーにテンプレートを許すなら厳格に">
        メール文面やレポート様式などで<strong>ユーザー提供のテンプレート</strong>を許す機能は要注意です。ロジックレスなエンジンや厳格なサンドボックスに限定し、評価コンテキストから危険なオブジェクトへ到達できないようにします。エンジンは最新版に保ち、既知のサンドボックス回避を塞ぎます。
      </Callout>

      <Section>XXE（XML 外部実体参照）</Section>
      <p>
        XML の DTD では<strong>実体（entity）</strong>を定義でき、外部実体は <Cmd>SYSTEM</Cmd> キーワードで <Cmd>file://</Cmd> や <Cmd>http://</Cmd> といった外部リソースを参照できます。XML パーサが<strong>外部実体の解決を有効</strong>にしたまま信頼できない XML を受け付けると、攻撃者は XML 内に外部実体を仕込み、それが展開される際にパーサがローカルファイルや内部 URL へアクセスしてしまいます。展開結果が応答に含まれれば情報が漏えいします。
      </p>
      <p>
        厄介なのは、XXE が<strong>ファイル読み取り・SSRF・DoS</strong>という複数の帰結を持つことです。外部実体に内部 URL を指定すれば SSRF になり、入れ子の実体展開でメモリを枯渇させれば DoS（Billion Laughs）になります。アップロードされる SVG や SAML、SOAP など「気づきにくい XML 入力点」にも注意が必要です。
      </p>
      <Callout variant="tip" title="対策: DTD と外部実体の解決を無効化">
        最重要かつ第一の防御は、XML パーサで<strong>DTD と外部実体の解決を無効化</strong>することです（各言語の安全な設定例は OWASP チートシート参照）。可能なら XML をやめ、より単純な JSON に置き換えます。ファイルアップロードで SVG など XML 系を扱う際は特に注意します。
      </Callout>

      <Section>3 種を横断で整理</Section>
      <ComparisonTable
        headers={["脆弱性", "何を評価/復元するか", "主な帰結", "第一防御"]}
        rows={[
          ["安全でないデシリアライズ", "入力をオブジェクトへ復元", "RCE・権限昇格・DoS", "信頼できない入力をネイティブ復元しない"],
          ["SSTI", "入力をテンプレート構文として評価", "サーバ側 RCE・情報漏えい", "入力はデータとして変数へ渡す"],
          ["XXE", "XML 外部実体を解決", "ファイル読取・SSRF・DoS", "DTD/外部実体の解決を無効化"],
        ]}
      />
      <KVList
        items={[
          { key: "共通の根本原因", val: "信頼できない入力を評価・復元・解決してしまう" },
          { key: "共通の対策の型", val: "そもそも評価/復元させない。必要なら許可リスト・完全性検証・安全な設定" },
          { key: "共通の危険度", val: "いずれもサーバ側 RCE に至りやすく影響が深刻" },
        ]}
      />

      <Bridge course="オートマトン・形式言語 / プログラミング言語処理系">
        この 3 種は、言語処理系で習う「<strong>データとコードの境界</strong>」の話に収束します。デシリアライズは「バイト列 → オブジェクト」という<strong>復元（unmarshalling）</strong>で、ネイティブ機構はその過程で任意のクラスを構築し得るため、実質的に<strong>入力がプログラムを記述</strong>できてしまいます。SSTI はテンプレート言語という<strong>ミニ言語のインタプリタ</strong>に、攻撃者がソースコードを流し込む行為です。XXE は XML という宣言的なデータ記述言語に<strong>外部参照という副作用</strong>が組み込まれていることの落とし穴です。いずれも「データを記述する形式のはずが、実行や参照の力を持っていた」——形式言語の表現力が高すぎると安全性を損なう、という設計上の教訓を共有しています。安全な設計とは、<strong>必要最小限の表現力しか許さない</strong>ことなのです。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "デシリアライズ・SSTI・XXE はいずれも RCE に至りやすい",
          "共通の根本原因は「信頼できない入力を評価/復元/解決してしまう」",
          "デシリアライズ: 信頼できない入力をネイティブ復元しない・署名検証",
          "SSTI: 入力はテンプレート本体でなくデータとして変数へ渡す",
          "XXE: DTD と外部実体の解決を無効化する。SVG/SAML 等の入力点にも注意",
        ]}
      />

      <Quiz
        question="デシリアライズ・SSTI・XXE に共通する根本原因はどれ？"
        options={[
          "Cookie が自動付与されること",
          "信頼できない入力を評価・復元・解決してしまうこと",
          "TLS が有効でないこと",
          "認可チェックが欠落していること",
        ]}
        answer={1}
        explanation="3 種はいずれも「データのはずの入力に、評価（SSTI）・復元（デシリアライズ）・外部参照の解決（XXE）という実行の力を与えてしまう」点が共通します。そもそも評価/復元させないのが対策の型です。"
      />
    </>
  );
}

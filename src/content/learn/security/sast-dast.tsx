import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Cmd, ComparisonTable, Figure, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "sast-dast",
  title: "SAST と DAST — 静的解析と動的解析",
  description: "コードを動かさずに読む SAST と、実際に攻撃して確かめる DAST。テイント解析・ホワイトボックス/ブラックボックス・得意と弱点、CodeQL/Semgrep と ZAP/Burp を対比して押さえる。",
  domain: "security",
  section: "incident",
  order: 3,
  level: "basic",
  tags: ["SAST", "DAST", "静的解析", "動的解析", "テイント解析"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        脆弱性を機械的に見つける手段は、大きく二つに分かれます。コードを<strong>動かさずに読む</strong>のが SAST、実際に<strong>攻撃を投げて挙動を見る</strong>のが DAST です。両者は対立するものではなく、得意分野が正反対だからこそ組み合わせて使います。この違いを理解すると、CI/CD にどのチェックをどの段階で入れるかが見えてきます。
      </Lead>

      <Section>SAST — 動かさずにコードを読む</Section>
      <p>
        <strong>SAST（Static Application Security Testing / 静的アプリケーションセキュリティテスト）</strong>は、ソースコード・バイトコード・バイナリを<strong>実行せずに</strong>解析し、危険なコードパターンから脆弱性を検出します。ソースへのフルアクセスを前提とするため<strong>ホワイトボックス</strong>に分類され、開発ライフサイクルの<strong>早期</strong>（コミット時・ビルド時）にフィードバックを返せるのが最大の強みです。
      </p>
      <p>
        SAST の中核技術が<strong>テイント解析（taint tracking）</strong>です。ユーザー入力などの「汚染源（source）」から、SQL 実行や <Cmd>eval</Cmd> などの「危険な吸い込み口（sink）」まで、途中でサニタイズ（無害化）を経ずにデータが届く経路を追跡します。source から sink へ検証なしに繋がる線が見つかれば、そこが脆弱性の候補です。
      </p>
      <FlowChain
        nodes={[
          { label: "source", sub: "入力（汚染源）", variant: "cta" },
          { label: "データフロー", sub: "変数の受け渡し" },
          { label: "sanitizer?", sub: "無害化があるか" },
          { label: "sink", sub: "危険な処理", variant: "alt" },
        ]}
        caption="テイント解析の考え方。入力（source）から危険な処理（sink）まで、無害化を経ずにデータが届く経路を探す。"
      />
      <KVList
        items={[
          { key: "CodeQL（GitHub）", val: "コードを「データベース」化し、宣言的クエリで source/sink/step を検索する。テイント解析が強力で、既知脆弱性のバリアントを大規模に探せる。ただし完全なビルド環境が必須。" },
          { key: "Semgrep", val: "軽量で、部分的なコードでも動く。パターンマッチ中心で CI 導入が容易。完全ビルドの可否で CodeQL と使い分ける。" },
        ]}
      />
      <Figure src="/learn/shots/security/sast-dast-01.svg" alt="CI 上に表示された SAST のアラート一覧" caption="SAST は CI に組み込むと、コミット単位で該当ファイルと行番号つきのアラートが返る" />

      <Callout variant="warn" title="SAST は誤検知が多い">
        SAST は実行時の防御策（WAF・入力検証）や到達不能なコードを考慮できないため、<strong>誤検知（False Positive）が多い</strong>傾向があります。ビジネスロジックの欠陥や認証・認可の設計不備も苦手です。「アラートが出た＝脆弱」ではなく、人が一件ずつ本当に悪用可能かを確認する前提で使います。
      </Callout>

      <Section>DAST — 実際に攻撃して確かめる</Section>
      <p>
        <strong>DAST（Dynamic Application Security Testing / 動的アプリケーションセキュリティテスト）</strong>は、<strong>稼働中</strong>のアプリに外部から実際に攻撃リクエストを投げ、応答の挙動から脆弱性を検出します。ソースは見ず、攻撃者と同じ外部視点でテストするため<strong>ブラックボックス</strong>に分類され、実施は開発の<strong>後期</strong>（デプロイ後・ステージング）が中心です。
      </p>
      <p>
        DAST の流れは、URL・パラメータ・API を列挙（クロール）し、各入力点に既知の攻撃ペイロードを注入し、レスポンス・エラー・タイミング・反射の有無から脆弱性を推定する、というものです。実際に攻撃が通るかを見るため誤検知は比較的少なく、言語・フレームワークにも依存しません。反面、<strong>原因箇所（コードの行）の特定が難しい</strong>のが弱点です。
      </p>
      <KVList
        items={[
          { key: "OWASP ZAP", val: "無償・OSS の代表格。CI/CD 連携が得意で、本番でも安全なパッシブ中心の baseline スキャンから、能動攻撃を含むステージング限定の full-scan まで段階的に導入できる。" },
          { key: "Burp Suite", val: "プロ診断のデファクト。傍受（Proxy）・手動改変（Repeater）・総当たり（Intruder）を備え、手動と自動を両立する。" },
        ]}
      />
      <Figure src="/learn/shots/security/sast-dast-02.svg" alt="OWASP ZAP のスキャン結果画面。アラートのツリーと詳細" caption="DAST は外から投げたリクエストと応答を根拠にアラートを出す。原因のコード行までは示さない" />

      <Callout variant="danger" title="DAST の最大のリスクはスコープ事故">
        能動スキャンや Intruder は<strong>実際にリクエストを投げます</strong>。本番の状態変更 URL（削除・送金など）を対象に含めると、実データを壊しかねません。スコープを厳密に定義し、本番の破壊的エンドポイントは必ず除外します。
      </Callout>

      <Section>SAST と DAST を対比する</Section>
      <p>
        二つは「中のコードを読む」か「外から攻撃する」かで正反対の性質を持ちます。表で整理すると、なぜ両方が必要かが見えてきます。
      </p>
      <ComparisonTable
        headers={["観点", "SAST（静的）", "DAST（動的）"]}
        rows={[
          ["実行", "コードを実行しない", "稼働中アプリへ攻撃を実施"],
          ["視点", "ホワイトボックス（ソースあり）", "ブラックボックス（ソース不要）"],
          ["タイミング", "コミット時（早期）", "デプロイ後（後期）"],
          ["得意", "コード起因の欠陥・原因箇所の特定", "設定不備・実行時の挙動"],
          ["弱点", "誤検知が多い・実行時可視性なし", "原因箇所の特定が難しい"],
          ["代表ツール", "CodeQL / Semgrep", "OWASP ZAP / Burp Suite"],
        ]}
      />
      <SubSection>両者は補完関係にある</SubSection>
      <p>
        SAST は早く・網羅的に「コードの中の危険」を拾い、DAST は実際に「外から攻撃が通るか」を確かめます。SAST の誤検知の多さを DAST の実証性が補い、DAST の原因特定の弱さを SAST の行番号レベルの指摘が補う——という相補関係です。実務では両者に加え、実行時に内部を計装する IAST や、次章のファジング、依存ライブラリを調べる SCA を組み合わせ、多層で網羅します。
      </p>

      <Bridge course="オートマトン・形式言語 / コンパイラ（プログラム解析）">
        SAST は、コンパイラの講義で習う<strong>プログラム解析</strong>そのものです。ソースを抽象構文木（AST）に変換し、制御フローグラフ（CFG）やデータフローグラフを構築し、その上でテイント（汚染）を伝播させる——これはコンパイラ最適化で学ぶ<strong>データフロー解析</strong>と同じ理論の応用です。「source から sink への到達可能性」を調べることは、オートマトン理論の<strong>到達可能性問題</strong>と地続きです。座学で「構文木やデータフロー解析が何の役に立つのか」と思った理論が、脆弱性を機械的に見つける SAST の中身として現場に現れています。
      </Bridge>

      <Divider />

      <Quiz
        question="SAST と DAST の説明として正しいものはどれですか。"
        options={[
          "SAST はアプリを実際に動かして攻撃し、DAST はソースコードを読む",
          "SAST はコードを動かさず早期に解析し（誤検知が多い）、DAST は稼働中アプリを外から攻撃する（原因特定が難しい）",
          "SAST も DAST も本番環境でのみ実行するべきである",
          "SAST は設定不備の検出が得意で、DAST はコードの行番号を特定できる",
        ]}
        answer={1}
        explanation="SAST は「動かさずにコードを読む」ホワイトボックスで早期・網羅的だが誤検知が多く、DAST は「実際に攻撃して挙動を見る」ブラックボックスで実証的だが原因箇所の特定が難しい、という正反対の性質を持ちます。だからこそ補完的に併用します。"
      />

      <KeyPoints
        items={[
          "SAST は動かさずにコードを読む（ホワイトボックス・早期・誤検知多）。中核はテイント解析",
          "DAST は稼働中アプリに攻撃を投げる（ブラックボックス・後期・原因特定が難）",
          "SAST は CodeQL/Semgrep、DAST は OWASP ZAP/Burp が代表ツール",
          "両者は補完関係。SAST の誤検知を DAST の実証性が、DAST の原因特定の弱さを SAST が補う",
          "DAST は実際にリクエストを投げるため、本番の破壊的 URL を除外するスコープ管理が必須",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-25-notes-reporting",
  title: "25. 記録とレポート — 見つけたものを伝わる形にする",
  description: "Burp Suite Community はプロジェクト保存ができないという前提のもと、Burp内で残せるものと外に出すものを整理し、良い再現手順・重大度の伝え方・証跡の扱い・責任ある開示までをまとめるコース最終章。",
  domain: "burp-practice",
  section: "workflow",
  order: 2,
  level: "practice",
  tags: ["Burp Suite", "レポート", "再現手順", "責任ある開示", "証跡"],
  updated: "2026-07-28",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        どれだけ良い検証をしても、それが伝わらなければ意味がありません。この最終章では、見つけた挙動を第三者に伝わる形にするための記録・レポートの作法を学びます。（目標学習時間：60分）
      </Lead>

      <Callout variant="warn" title="Community 版は「外に出す」前提で設計する">
        Burp Suite Community Edition には<strong>プロジェクトファイルとしてディスクに保存する機能がありません</strong>。Burp を閉じれば Proxy history も Repeater のタブも消えます。つまり、記録は最初から「Burp の外に出す」ことを前提に組み立てる必要があります。
      </Callout>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Burp 内で残せるものと、外部に出すべきものを区別できる</li>
          <li>Copy as curl 等を使い、第三者が再現できる形で手順を残せる</li>
          <li>報告に必要な要素をテンプレートに沿って書ける</li>
          <li>重大度をそのアプリでの実影響ベースで伝えられる</li>
          <li>証跡の扱いと責任ある開示の基本を説明できる</li>
        </ul>
      </Callout>

      <Section>1. Burp 内で残せるもの・外に出すもの</Section>
      <p>
        まず「今このセッション内でだけ有効な記録」と「Burp を閉じても残る記録」を区別しましょう。
      </p>
      <ComparisonTable
        headers={["区分", "手段"]}
        rows={[
          ["Burp 内（セッション中のみ有効）", "Repeater タブ名、HTTP history の Notes と Highlight、Comparer の比較結果、設定のエクスポート（Settings のプロファイルとして）"],
          ["外部に出す（永続化）", "Save item（リクエスト/レスポンスをファイル保存）、Copy as curl command、Copy to file、Logger++ の CSV エクスポート"],
        ]}
      />
      <p>
        作業中は Burp 内の仕組み（タブ名・Notes・Highlight）で整理し、<strong>作業の節目や Burp を閉じる前には必ず外部への退避を行う</strong>という2段構えで運用します。
      </p>

      <Section>2. Copy as curl command で再現手順を渡す</Section>
      <p>
        見つけた挙動を第三者に伝えるとき、Burp のスクリーンショットだけでは相手が自分の環境で再現できません。Repeater や Proxy history の該当リクエストを右クリックし、<strong>Copy as curl command</strong>を選ぶと、そのままターミナルで実行できる curl コマンドとしてコピーできます。
      </p>
      <Code lang="bash" filename="reproduce.sh">{`# 例: レビュー取得APIのidを他商品の値に書き換えて確認した挙動の再現コマンド
curl 'http://localhost:3000/rest/products/2/reviews' \\
  -H 'Cookie: token=eyJhbGciOiJIUzI1NiIs...' \\
  -H 'Accept: application/json' \\
  --compressed

# 期待: 自分がレビューを投稿した商品(id=1)以外は403等で拒否される
# 実際: id=2 のレビュー一覧がそのまま200で返り、投稿者のメールアドレスも含まれる`}</Code>
      <Callout variant="warn" title="コピーした curl には認証情報が含まれる">
        Copy as curl command は Cookie や Authorization ヘッダもそのまま含みます。共有前に、後述する「証跡の扱い」に沿ってトークンをマスクするか、報告先が信頼できる相手であることを確認してください。
      </Callout>

      <Section>3. 報告に必要な要素</Section>
      <p>
        見つけた挙動を報告書やチケットにまとめる際は、次の要素を最低限含めます。
      </p>
      <KVList
        items={[
          { key: "概要", val: "何が起きるのかを一文で要約する（例: 他人のレビュー一覧が投稿者情報込みで閲覧できる）" },
          { key: "影響", val: "この挙動によって何が起こりうるか（個人情報の漏えい、なりすまし等）" },
          { key: "前提条件", val: "再現に必要な条件（ログイン要否、特定のロール、特定の画面遷移を経る必要があるか等）" },
          { key: "再現手順", val: "最小のリクエスト・操作手順。第三者がそのまま追試できる粒度で書く" },
          { key: "証跡", val: "スクリーンショット、curl コマンド、Raw のリクエスト/レスポンス（機微情報はマスク）" },
          { key: "想定される影響範囲", val: "対象が一部の機能だけか、他の類似APIにも同様の不備がありそうか" },
          { key: "推奨される対策", val: "サーバー側での認可チェック追加等、対応の方向性（詳細な実装は開発チーム判断）" },
          { key: "参考情報", val: "関連する既知の脆弱性分類（OWASP Top 10 の該当項目等）や参考URL" },
        ]}
      />

      <Section>4. 良い再現手順・悪い再現手順</Section>
      <p>
        再現手順の質は、報告の説得力に直結します。良い例と悪い例を比べてみましょう。
      </p>
      <ComparisonTable
        headers={["観点", "悪い例", "良い例"]}
        rows={[
          ["環境・アカウント", "「ログインして試したら見えた」とだけ書く", "「一般ユーザーAでログインし、Bのレビューを閲覧できることを確認」のように具体的な役割を明記する"],
          ["最小のリクエスト", "検証時の試行錯誤をそのまま貼り付ける", "再現に必要な最小の1リクエストだけを抜き出して示す"],
          ["期待と実際", "「バグがあります」とだけ書く", "「本来は403が期待されるが、実際には200で他人のデータが返る」のように期待値と実際を対比させる"],
          ["スクリーンショット", "画面全体を漫然と撮る", "URL・ステータスコード・該当箇所が読み取れるよう、必要な範囲を切り取って撮る"],
        ]}
      />

      <Section>5. 重大度の伝え方</Section>
      <p>
        CVSS のようなスコアリング基準は便利な共通言語ですが、<strong>そのアプリ固有の実影響を機械的なスコアだけに丸め込まない</strong>ことが大切です。
      </p>
      <ul>
        <li>スコアだけでなく、「このアプリでは具体的に何ができてしまうのか」を自分の言葉で書き添える</li>
        <li>前提条件が厳しい場合（特定のロールが必要、特殊な操作順序が必要等）は、その厳しさを正直に書く。過大にも過小にも見せない</li>
        <li>影響範囲が限定的なら「限定的である」こと自体も重要な情報として伝える</li>
      </ul>

      <Section>6. 証跡の扱い</Section>
      <p>
        検証中に取得した実データには、他人の個人情報や認証情報が含まれることがあります。次の点に注意して扱いましょう。
      </p>
      <ComparisonTable
        headers={["注意点", "対応"]}
        rows={[
          ["実データを含むレスポンス", "報告に貼る前に、氏名・メールアドレス等の個人情報部分をマスクする"],
          ["認証情報（トークン・パスワード）", "スクリーンショットや curl コマンドから、Cookie/Authorization の値を伏せ字にするか別途安全な経路で共有する"],
          ["検証後のデータ", "報告が完了したら、ローカルに残した検証データ（保存したレスポンス等）は速やかに削除する"],
        ]}
      />

      <Section>7. 責任ある開示</Section>
      <p>
        見つけた不備をどう伝えるかは、対象によって適切な窓口が異なります。
      </p>
      <ul>
        <li><strong>社内のアプリ</strong> — 担当チーム・セキュリティ窓口に直接連絡する</li>
        <li><strong>外部のサービス</strong> — <code>/.well-known/security.txt</code> や公式サイトの脆弱性報告窓口を確認する</li>
        <li><strong>バグバウンティ対象</strong> — HackerOne・Bugcrowd 等、指定されたプラットフォーム経由で報告する</li>
      </ul>
      <p>
        いずれの場合も、<strong>修正が完了し、対象と合意した期日を過ぎるまでは公開しない</strong>のが責任ある開示（Responsible Disclosure）の基本です。焦って先に公開してしまうと、ユーザーを危険にさらすだけでなく、報告者自身の信頼も損ないます。
      </p>

      <Section>8. 次のステップ</Section>
      <p>
        このコースでは Burp Suite の基本操作から拡張・自動化・通し演習・レポートまでを一通り扱いました。ここから先は、実際に手を動かす場を広げていきましょう。
      </p>
      <ul>
        <li>Web Security Academy を分野ごとに埋めていき、個々の脆弱性クラスへの理解を深める</li>
        <li>Scanner や Param Miner など Pro 版の機能を検討し、診断の網羅性を上げる</li>
        <li>関連コースの「脆弱性調査実践」「セキュリティ基礎」にも触れ、偵察・報告・責任ある開示をより深く学ぶ</li>
      </ul>

      <Divider />

      <Quiz
        question="重大度を報告する際の考え方として、最も適切なものはどれですか？"
        options={[
          "CVSS 等のスコアだけを機械的に記載し、そのアプリでの実影響には触れない",
          "前提条件が厳しい場合は報告の説得力が落ちるため、条件を省略して書く",
          "スコアに加えて、そのアプリで具体的に何ができてしまうかと、前提条件の厳しさを正直に書く",
          "影響範囲が限定的な場合は報告する価値が無いので記載しない"
        ]}
        answer={2}
        explanation="CVSS のような共通指標は便利ですが、それだけでは対象アプリ固有の実影響が伝わりません。具体的に何が起こりうるか、前提条件がどれだけ厳しいか（あるいは緩いか）を正直に書き添えることで、報告の精度と信頼性が上がります。"
      />

      <KeyPoints
        items={[
          "Community 版はプロジェクト保存不可。Burp内の仕組み（タブ名・Notes・Highlight）と外部退避（Save item・Copy as curl・Logger++ エクスポート）を組み合わせて記録する",
          "Copy as curl command で第三者が再現できる手順を渡せる。認証情報が含まれる点に注意する",
          "報告には概要・影響・前提条件・再現手順・証跡・想定影響範囲・推奨対策・参考情報を含める",
          "良い再現手順は環境・最小リクエスト・期待と実際が明確。悪い例との対比で質を上げる",
          "重大度はスコアだけでなく、そのアプリでの実影響と前提条件の厳しさを正直に伝える",
          "証跡はマスク処理し、報告後は検証データを削除する。開示は適切な窓口へ、修正後・合意した期日まで公開しない",
        ]}
      />

      <Callout variant="info" title="コースを終えて">
        Burp Suite は「使えること」自体がゴールではなく、仮説を立て、最小の検証で確かめ、伝わる形で残すための道具です。このコースで身につけた型を、Web Security Academy や日々の学習の中で繰り返し使い、体に馴染ませていってください。
      </Callout>
    </>
  );
}

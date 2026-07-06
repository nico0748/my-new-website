import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Code, KVList, TipBox, KeyPoints, ComparisonTable, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "editor-extensions",
  title: "エディタ拡張おすすめ（VS Code）",
  description: "VS Code の開発効率を上げる拡張機能。フォーマッタ・リンター・Git・プレビュー・スニペットなどを用途別に紹介する。",
  domain: "web",
  section: "dev-tools",
  order: 3,
  level: "intro",
  tags: ["VSCode", "拡張機能", "効率化"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>VS Code</strong> は素のままでも十分使えますが、拡張機能を入れると「整形・エラー検知・Git・プレビュー」が
        エディタ内で完結し、開発のテンポが大きく変わります。ここでは定番を用途別に紹介します。
        まずはフォーマッタとリンターだけでも入れておくと効果を実感できます。
      </Lead>

      <p>
        ここで紹介する拡張の多くは、実は<strong>コンパイラの講義で学ぶ技術</strong>でできています。リンターは<strong>静的解析</strong>、
        フォーマッタは<strong>構文木（AST）の再出力</strong>、補完やジャンプは<strong>言語処理系（LSP）</strong>が支えています。
        つまり「便利ツール」の正体は、座学の理論をエディタに組み込んだものです。この記事では各ツールの裏で動く理論も並べて説明します。
      </p>

      <Bridge course="コンパイラ / プログラム解析 / ソフトウェア工学">
        エディタ拡張は、コンパイラ論とソフトウェア工学が実務で交わる代表的な場所です。<strong>字句解析 → 構文解析 → 意味解析</strong>
        というコンパイラのパイプラインのうち、リンタとフォーマッタは前半（構文木の構築と検査・再出力）を、
        型チェックや補完は後半（意味解析）を、それぞれエディタ上で走らせています。そして「機械にできる指摘は機械に任せ、
        人間はレビューで設計に集中する」という運用は、ソフトウェア工学が説く<strong>品質の作り込み</strong>そのものです。
      </Bridge>

      <Section>コードを整える — フォーマッタ / リンター</Section>
      <SubSection>Prettier</SubSection>
      <p>
        <strong>コードフォーマッタ</strong>。インデント・改行・クォートなどのスタイルを保存時に自動で統一します。
        「見た目の議論」をツールに任せられるため、チームでのレビューが本質的な内容に集中できます。
      </p>
      <p>
        Prettier が整形できるのは、コードを一度<strong>AST（抽象構文木）</strong>にパースし、元の改行やスペースを捨てて、
        自分のルールで木を<strong>プリント（再出力）</strong>し直しているからです。だから「どんなにぐちゃぐちゃに書いても同じ形になる」。
        これはコンパイラ論で学ぶ「ソース → 構文木 → 出力」というパイプラインの、出力先を「実行コード」ではなく「整形済みソース」にした応用です。
      </p>
      <SubSection>ESLint</SubSection>
      <p>
        <strong>リンター</strong>。未使用変数・危険な書き方・バグになりやすいパターンを、書いている最中に波線で警告します。
        Prettier が「見た目」、ESLint が「品質・バグ予防」を担当し、両方入れるのが定番です。
      </p>
      <p>
        ESLint がやっているのは<strong>静的解析（static analysis）</strong>——プログラムを<strong>実行せずに</strong>ソースを解析し、
        危険なパターンを検出することです。たとえば「宣言したのに一度も使われない変数」は、コードを走らせなくても AST を辿れば分かります。
      </p>
      <Code lang="javascript" filename="example.js">{`function greet(name) {
  const message = "hello";   // ← 宣言したが使っていない
  return "hi, " + name;      // ESLint: 'message' is assigned a value but never used
}`}</Code>
      <p>
        このバグは実行しても即座には落ちませんが、静的解析なら書いた瞬間に波線で分かります。「実行前に、機械的に、網羅的に」問題を見つけられるのが静的解析の価値です。
      </p>

      <SubSection>フォーマッタとリンターは役割が違う</SubSection>
      <ComparisonTable
        headers={["観点", "フォーマッタ（Prettier）", "リンター（ESLint）"]}
        rows={[
          ["対象", "コードの見た目（スタイル）", "コードの品質・バグの芽"],
          ["やること", "AST を整形ルールで再出力", "AST を検査して問題を検出"],
          ["座学の対応", "構文木の pretty print", "静的解析（プログラム解析）"],
          ["例", "インデント・改行・クォート統一", "未使用変数・== 誤用・危険な API"],
          ["自動修正", "常に整形", "一部は --fix で自動修正可"],
        ]}
      />
      <Callout variant="info" title="役割が違うので両方入れる">
        両者は競合しません。フォーマッタは「読みやすさ」、リンターは「正しさ・安全さ」を担当します。
        Prettier に整形を任せ、ESLint はスタイルの指摘を切って<strong>バグ検出に専念</strong>させる分業が定番です。
      </Callout>
      <SubSection>Error Lens</SubSection>
      <p>
        エラーや警告を、<strong>該当行のすぐ横にインラインで表示</strong>します。
        マウスを乗せて確認する手間がなくなり、問題の位置と内容が一目で分かります。
      </p>
      <Callout variant="tip" title="保存時オートフォーマットを設定">
        Prettier / ESLint は保存時に自動適用させるのが快適です。設定例を <Cmd>settings.json</Cmd> に追加します。
      </Callout>
      <Code lang="json" filename=".vscode/settings.json">{`{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}`}</Code>
      <TipBox>
        保存のたびに Prettier が整形し、ESLint の自動修正可能な問題（<Cmd>--fix</Cmd> 相当）も同時に片づきます。
        この設定を <Cmd>.vscode/settings.json</Cmd> に置いて Git 管理すれば、チーム全員の整形結果が揃い、
        「差分が整形ノイズだらけ」という状態を防げます。
      </TipBox>

      <Section>Git を扱う</Section>
      <SubSection>GitLens</SubSection>
      <p>
        各行に<strong>「誰がいつ変更したか（blame）」</strong>を表示し、コミット履歴・差分・ブランチ操作をエディタ内で辿れます。
        「このコードなぜこうなってる？」を書いた本人・経緯まで遡れるため、既存コードの理解が速くなります。
      </p>

      <Section>すぐ確認する — プレビュー</Section>
      <SubSection>Live Server</SubSection>
      <p>
        HTML ファイルを<strong>ローカルサーバで即プレビュー</strong>し、保存すると自動リロードします。
        素の HTML / CSS を学ぶ段階で、ブラウザを手動更新せずに結果を確認できます。
      </p>

      <Section>フロントエンドの補完を強化する</Section>
      <p>
        補完・定義ジャンプ・ホバー時の型表示などを支えているのが <strong>LSP（Language Server Protocol）</strong>です。
        LSP は、エディタの裏で<strong>言語処理系（言語サーバ）</strong>を常駐させ、開いているコードを解析して
        「この位置で使える候補は何か」「この関数の型は何か」をエディタに返す仕組みです。
      </p>
      <KVList
        items={[
          { key: "Tailwind CSS IntelliSense", val: "Tailwind のクラス名を補完し、色やスペーシングをプレビュー表示" },
          { key: "Auto Rename Tag", val: "開始タグを書き換えると閉じタグも自動で追従。JSX/HTML の編集ミスを防ぐ" },
          { key: "Path Intellisense", val: "import やパス入力でファイル名を補完。相対パスのタイプミスを減らす" },
          { key: "ES7+ React snippets", val: "rafce などの短縮でコンポーネント雛形を展開。定型コードを高速入力" },
        ]}
      />
      <Callout variant="info" title="補完はなぜ賢いのか">
        TypeScript の補完が<strong>文脈に合った候補だけ</strong>を出せるのは、言語サーバがコードを構文解析・型解析しているからです。
        これはコンパイラのフロントエンド（字句・構文・意味解析）を、コンパイル時ではなく<strong>編集中にリアルタイムで</strong>回しているのと同じ。
        補完・エラー波線・定義ジャンプは、すべて同じ解析結果から生まれています。
      </Callout>

      <Bridge course="コンパイラ / プログラミング言語処理系（LSP）">
        LSP は、講義で学ぶ<strong>言語処理系</strong>をエディタと分離して常駐サービス化したものです。
        補完（意味解析による候補列挙）、定義へジャンプ（シンボル解決）、型エラーの波線（型検査）は、
        いずれもコンパイラが内部で持つ情報をエディタに公開しているだけです。「エディタが賢い」のではなく、
        「言語処理系がバックグラウンドで動いている」と捉えると、なぜ言語ごとに拡張を入れるのかが腑に落ちます。
      </Bridge>

      <Section>API をエディタ内でテストする</Section>
      <SubSection>Thunder Client / REST Client</SubSection>
      <p>
        エディタから直接 API を叩けるツールです。<strong>Thunder Client</strong> は GUI で Postman ライクにリクエストを組み立て、
        <strong>REST Client</strong> は <Cmd>.http</Cmd> ファイルにリクエストをテキストで書いて実行します。
        別アプリに切り替えずに動作確認でき、<Cmd>.http</Cmd> ファイルは Git 管理してチームで共有もできます。
      </p>

      <Section>見た目とAI補助</Section>
      <SubSection>Material Icon Theme</SubSection>
      <p>
        ファイル・フォルダに<strong>種類ごとのアイコン</strong>を付け、エクスプローラの見通しを良くします。
        目的のファイルを素早く見つけられるようになります。
      </p>
      <SubSection>GitHub Copilot</SubSection>
      <p>
        文脈から<strong>コードを提案・補完する AI アシスタント</strong>です。定型処理・テスト・繰り返しパターンの入力を大きく減らせます。
      </p>
      <Callout variant="warn" title="AI 提案は必ず読んでから採用する">
        Copilot の提案は便利ですが、誤りや意図しない挙動を含むことがあります。生成されたコードは内容を理解してから採用し、
        テストとレビューを省略しないようにしましょう。
      </Callout>

      <Divider />

      <SubSection>用途別まとめ</SubSection>
      <KVList
        items={[
          { key: "整形 / 品質", val: "Prettier / ESLint / Error Lens" },
          { key: "Git", val: "GitLens" },
          { key: "プレビュー", val: "Live Server" },
          { key: "補完強化", val: "Tailwind CSS IntelliSense / Auto Rename Tag / Path Intellisense / ES7+ React snippets" },
          { key: "API テスト", val: "Thunder Client / REST Client" },
          { key: "見た目 / AI", val: "Material Icon Theme / GitHub Copilot" },
        ]}
      />

      <KeyPoints
        items={[
          "まずは Prettier（整形）と ESLint（品質）を入れ、保存時に自動適用させる",
          "フォーマッタ＝AST の再出力、リンター＝静的解析。座学のコンパイラ技術そのもの",
          "補完・定義ジャンプ・型表示は LSP（言語処理系）がバックグラウンドで解析している",
          "Error Lens と GitLens で「エラーの内容」と「変更の経緯」を可視化",
          "Thunder Client / REST Client でエディタ内 API テスト、Copilot は理解して採用",
        ]}
      />
    </>
  );
}

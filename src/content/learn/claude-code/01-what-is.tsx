import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-01-what-is",
  title: "1. Claude Code とは",
  description: "ターミナルで動くエージェント型 AI アシスタント Claude Code。エージェンティックループ・モデル・ツールの3要素、セッションとコンテキスト、安全に使うための仕組みを理解する。",
  domain: "claude-code",
  section: "intro",
  order: 2,
  level: "intro",
  tags: ["Claude Code", "エージェント", "コンテキスト", "権限モード"],
  updated: "2026-05-05",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        ターミナルで動くエージェント型 AI アシスタント。どのように考え、どのように動くのかを理解しましょう。（目標学習時間：1時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Claude Code が「何で」「どう動くのか」を自分の言葉で説明できる</li>
          <li>エージェンティックループ・モデル・ツールの3要素を理解できる</li>
          <li>自分の開発・業務にどう活かすかをイメージできる</li>
          <li>安全に使うための仕組み（チェックポイント・権限モード）を知っている</li>
        </ul>
      </Callout>

      <Section>1. Claude Code とは（10分）</Section>
      <p>
        Claude Code は「ターミナルで動くエージェント型 AI アシスタント」です。皆さんは ChatGPT や Claude（claude.ai）をブラウザで使ったことがあるかもしれません。Claude Code はそれらと近い兄弟ですが、決定的に違う点があります。
      </p>
      <ComparisonTable
        headers={["", "ブラウザの Claude（claude.ai）", "Claude Code"]}
        rows={[
          ["動く場所", "Web ブラウザの中", "あなたのターミナル（黒い画面）"],
          ["できること", "チャットで質問・文章生成・コード生成", "依頼するとPCのファイルを読み書きしたりコマンドを実行したりする"],
          ["特徴", "テキストの「やりとり」が中心。実際にPCで実行はできず、コピペは自分でやる", "テキストを返すだけでなく「行動」できる（＝エージェント型）"],
        ]}
      />
      <Figure
        src="/learn/shots/claude-code/claude-code-01-what-is-01.svg"
        alt="ターミナルで claude を起動した直後の REPL 画面"
        caption="Claude Code はターミナルの中で動く。起動するとこの対話画面（REPL）が立ち上がる"
      />

      <SubSection>なぜ「エージェント型」が画期的なのか</SubSection>
      <p>たとえば「ログインバグを修正して」と頼んだ場合:</p>
      <ul>
        <li><strong>ブラウザの Claude</strong>は →「こういうコードに直してみてください」と提案を返してくる。あなたが手動でコピペして試す</li>
        <li><strong>Claude Code</strong> は → 自分でファイルを開き、原因箇所を探し、修正コードを書き、テストを走らせ、結果を報告してくれる</li>
      </ul>
      <p>
        つまり、<strong>人間のジュニアエンジニアに「これお願い」と頼むのに近い感覚</strong>で使えます。だから「開発の頼れる相棒」として非常に強力なのです。コーディングが得意ですが、それだけではありません。<strong>コマンドラインからできることであれば、ドキュメント作成・ビルド実行・ファイル検索・調査など、幅広く支援できます</strong>。
      </p>

      <Section>2. エージェンティックループ ─ Claudeはどう考えるか（15分）</Section>
      <p>
        タスクを与えると、Claude は次の3つのフェーズを<strong>繰り返しながら</strong>作業を進めます。これを「<strong>エージェンティックループ</strong>」と呼びます。
      </p>
      <Steps>
        <Step title="① コンテキスト収集">ファイルを読む、検索する、コマンドを実行して状況を把握する。</Step>
        <Step title="② 行動">コードを編集する、コマンドを実行する、ファイルを作成する。</Step>
        <Step title="③ 検証">自分の行動の結果を確認する（テストを走らせる、エラーを読む等）。完了していなければ①に戻る。</Step>
      </Steps>
      <p>このループは依頼の内容に応じて柔軟に変化します。</p>
      <ul>
        <li><strong>コードの質問</strong>であれば、コンテキスト収集だけで完結することもあります</li>
        <li><strong>バグ修正</strong>では、3つのフェーズをすべて何度も繰り返すことがあります</li>
        <li><strong>大規模リファクタリング</strong>では、広範な検証が必要になります</li>
      </ul>
      <p>
        また、ループの途中で<strong>いつでも中断</strong>して、別の方向に誘導したり、追加の情報を提供したりできます。Claude は自律的に動きながらも、あなたの指示に常に応答します。
      </p>
      <Callout variant="tip" title="ポイント">
        Claude は「考えて、動いて、確認して、また考えて」を繰り返します。だから時々時間がかかりますが、その間に賢く動いていると思ってください。
      </Callout>

      <Section>3. モデルとツール（10分）</Section>
      <SubSection>モデル — Claudeの「脳」</SubSection>
      <p>
        Claude Code は <strong>Claudeモデル</strong>を使ってコードを理解し、タスクを推論します。あらゆるプログラミング言語のコードを読み、コンポーネント間の関係を把握した上で、「何を変えれば目的を達成できるか」を判断できます。複数のモデルが利用可能で、それぞれトレードオフがあります。
      </p>
      <ComparisonTable
        headers={["モデル", "向いているケース"]}
        rows={[
          ["Sonnet", "日常的なコーディングタスク全般（普段はこれでOK）"],
          ["Opus", "複雑なアーキテクチャ設計・難しい推論が必要な場面"],
        ]}
      />
      <p>
        セッション中に <Cmd>/model</Cmd> で切り替えるか、起動時に <Cmd>claude --model &lt;name&gt;</Cmd> で指定できます。
      </p>

      <SubSection>ツール — Claudeの「手足」</SubSection>
      <p>
        <strong>ツールが Claude Code をエージェントたらしめています。</strong> ツールがなければ Claude はテキストを返すだけですが、ツールがあれば「行動」できます。Claude Code には、ファイル読み書き・コマンド実行・Web 検索などの基本ツールが組み込まれています。各ツールの使用結果はループにフィードバックされ、次の判断に影響します。
      </p>
      <p>さらに拡張もできます（これらは ④拡張機能編 で詳しく学びます）:</p>
      <ul>
        <li><strong>Skills</strong> で Claude の知識を拡張</li>
        <li><strong>MCP</strong> で外部サービス（Slack・Notion 等）に接続</li>
        <li><strong>Hooks</strong> でワークフローを自動化</li>
        <li><strong>Subagents</strong> にタスクをオフロード</li>
      </ul>

      <Section>4. Claudeがアクセスできるもの・セッションの仕組み（10分）</Section>
      <p>
        ディレクトリで <Cmd>claude</Cmd> を実行すると、Claude Code は以下にアクセスできます。
      </p>
      <ComparisonTable
        headers={["アクセス対象", "内容"]}
        rows={[
          ["プロジェクト", "ディレクトリとサブディレクトリ内のファイル"],
          ["ターミナル", "ビルドツール・git・パッケージマネージャーなど"],
          ["Git の状態", "現在のブランチ・未コミットの変更・コミット履歴"],
          [<Cmd>CLAUDE.md</Cmd>, "プロジェクト固有の指示・慣習・コンテキスト"],
          ["拡張機能", "MCP サーバー・Skills・Subagents"],
        ]}
      />
      <SubSection>セッションは一時的</SubSection>
      <p>
        Claude Code は会話中の内容をローカルに保存しています。各メッセージ・ツール使用・結果が記録されるため、セッションの<strong>巻き戻し・再開・フォーク</strong>が可能です。
      </p>
      <p>
        <strong>ただしセッション間の永続的なメモリはありません。</strong> claude.ai とは異なり、新しいセッションを開始するたびに、Claude は<strong>まっさらな状態から始まります</strong>。セッションをまたいで覚えておいてほしいことは、<Cmd>CLAUDE.md</Cmd> という特別なファイルに書いておきます（⑥章で詳しく学びます）。
      </p>
      <SubSection>コンテキストウィンドウ</SubSection>
      <p>
        Claude が一度に保持できる情報には上限（<strong>コンテキストウィンドウ</strong>）があります。会話履歴・ファイル内容・コマンド出力・<Cmd>CLAUDE.md</Cmd>・Skills が蓄積されていくと、次第に満杯に近づきます。Claude は限界に近づくと自動的にコンテキストを圧縮しますが、<strong>会話の初期に与えた指示が失われることがあります</strong>。だから永続的なルールは <Cmd>CLAUDE.md</Cmd> に書いておくのが基本です。
      </p>

      <Section>5. 安全に使うための仕組み・効果的な使い方（10分）</Section>
      <p>
        「Claudeが勝手にファイルを消したらどうしよう」「変な変更を加えられたら困る」と不安になる方もいるはずです。安心してください。Claude Code には<strong>2つの安全装置</strong>があります。
      </p>
      <Callout variant="info" title="安全装置1: チェックポイント（巻き戻し）">
        Claude がファイルを編集する前に、<strong>現在の内容のスナップショットが自動的に作成されます</strong>。何か問題が起きた場合は <Cmd>Esc</Cmd> を2回押すか、<Cmd>/rewind</Cmd> を実行して以前の状態に戻せます。すべてのファイル編集は元に戻せるので、安心して試せます。
      </Callout>
      <SubSection>安全装置2: 権限モード</SubSection>
      <p><Cmd>Shift+Tab</Cmd> で権限モードを切り替えます。</p>
      <ComparisonTable
        headers={["モード", "動作"]}
        rows={[
          ["Default", "ファイル編集・コマンド実行の前に確認を求める（最初はこれ推奨）"],
          ["Auto-accept edits", "ファイル編集は自動承認、コマンドは確認あり"],
          ["Plan mode", "読み取り専用。計画を作成して承認後に実行できる（後で詳しく）"],
        ]}
      />
      <p>最初は <strong>Default モード</strong>から始めるのが安全です。慣れてきたら状況に応じて使い分けます。</p>

      <SubSection>Claude Code を効果的に使う4つのコツ</SubSection>
      <p><strong>コツ1: まず Claude に聞いてみる</strong>——「hooks はどう設定するの？」「CLAUDE.md の書き方は？」のような質問に Claude 自身が答えてくれます。</p>
      <p><strong>コツ2: 会話を重ねて洗練させる</strong>——完璧なプロンプトを最初から書く必要はありません。大まかな依頼から始めて、少しずつ絞り込んでいけます。</p>
      <Code lang="text" filename="会話例">{`> ログインバグを修正して

[Claude が調査して試みる]

> それじゃない。問題はセッション処理にある。

[Claude がアプローチを調整する]`}</Code>
      <p><strong>コツ3: 最初から具体的に伝える</strong>——最初のプロンプトが具体的であるほど、修正の回数が減ります。関連ファイル・制約・参考にすべきパターンを最初から伝えましょう。</p>
      <Code lang="text" filename="具体的なプロンプト例">{`> 期限切れカードを持つユーザーでチェックアウトフローが壊れています。
> src/payments/ を確認してください。特にトークン更新部分です。
> まず失敗するテストを書いてから修正してください。`}</Code>
      <p><strong>コツ4: 検証方法をセットで渡す</strong>——Claude は自分の作業を確認できるとき、より良い結果を出します。テストケース・期待する出力を一緒に渡しましょう。</p>

      <Section>6. 演習：自分の言葉で説明してみよう（5分）</Section>
      <p>
        次の章でインストールに進む前に、ここまでの内容を自分の言葉で説明できるか確認しましょう。以下の質問に頭の中で答えてみてください。スラスラ答えられない場合は、上の節をもう一度読み返しましょう。
      </p>
      <ol>
        <li>ブラウザ版の Claude と Claude Code の最大の違いは何？</li>
        <li>「エージェンティックループ」の3つのフェーズは？</li>
        <li>Claude Code には永続メモリがありません。だから何が必要？</li>
        <li>Claude が間違った変更をしてしまったとき、元に戻すには？</li>
        <li>あなたが自分のプロジェクトで Claude Code を使うとしたら、どんな場面で使ってみたい？</li>
      </ol>

      <Divider />

      <SubSection>まとめ表</SubSection>
      <ComparisonTable
        headers={["用語", "意味"]}
        rows={[
          ["エージェント型", "テキストを返すだけでなく、実際に行動できる"],
          ["エージェンティックループ", "収集→行動→検証 の繰り返し"],
          ["コンテキストウィンドウ", "Claudeが一度に保持できる情報の上限"],
          ["チェックポイント", <>自動スナップショット。<Cmd>/rewind</Cmd> や <Cmd>Esc x2</Cmd> で巻き戻せる</>],
          ["権限モード", <><Cmd>Shift+Tab</Cmd> で切替。Default / Auto-accept / Plan</>],
          [<Cmd>CLAUDE.md</Cmd>, "セッションをまたいで覚えさせたいことを書くファイル（後の章で）"],
        ]}
      />

      <KeyPoints
        items={[
          "Claude Code はターミナルで動く『行動できる』エージェント型 AI",
          "エージェンティックループ＝収集→行動→検証 の繰り返し",
          "モデル(脳: Sonnet/Opus)とツール(手足)。ツールが行動を可能にする",
          "セッションは一時的で永続メモリなし。恒久ルールは CLAUDE.md へ",
          "安全装置はチェックポイント(巻き戻し)と権限モード(Shift+Tab)",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「2. インストール」で Claude Code を自分のPCにセットアップし、最初のセッションを起動します。その先は基本的な使い方・プロンプト・セッション管理へ進みます。
      </Callout>
    </>
  );
}

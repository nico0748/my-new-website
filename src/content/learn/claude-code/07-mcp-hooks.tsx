import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-07-mcp-hooks",
  title: "7. MCP と Hooks ─ 外部連携と自動化",
  description: "外部サービス（Slack・Notion・GitHub・DB）とつなぐ MCP と、ツール実行前後に処理を挟む Hooks。追加方法・使用例・セキュリティ注意点・設定（settings.json）・使い分けまで。",
  domain: "claude-code",
  section: "extend",
  order: 2,
  level: "practice",
  tags: ["Claude Code", "MCP", "Hooks", "外部連携"],
  updated: "2026-05-05",
  minutes: 180,
};

export default function Article() {
  return (
    <>
      <Lead>
        Claude Code を「外部世界」とつなぐ章です。<strong>MCP</strong> で外部サービス（Slack・Notion・GitHub 等）にアクセスし、<strong>Hooks</strong> でツール実行前後の自動化を行います。この2つで Claude Code は「ターミナル内の AI」から「業務全体の相棒」に進化します。（目標学習時間：3時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>MCP の役割と仕組みが説明できる／既存 MCP サーバーを追加できる</li>
          <li>Hooks のイベントを使い分けられる／MCP と Hooks の使い分けができる</li>
          <li>セキュリティ上の注意点を理解している</li>
        </ul>
      </Callout>

      <Section>1. なぜ外部連携が必要か（10分）</Section>
      <p>Claude Code は強力ですが、<strong>標準のままだとターミナルで完結する作業しかできません</strong>。でも実務では、こんな状況がよくあります。</p>
      <ul>
        <li>「<strong>Slack で来た依頼</strong>を見て、Claude に対応させたい」</li>
        <li>「<strong>Notion の仕様書</strong>を読んで、それに沿って実装してほしい」</li>
        <li>「<strong>GitHub Issue</strong> を解決してプルリクエストまで作ってほしい」</li>
        <li>「<strong>Postgres のテーブル構造</strong>を見て、それに合うコードを書いてほしい」</li>
      </ul>
      <p>
        解決策が MCP と Hooks の連携です。<strong>MCP</strong> =「外のサービスとつなぐ」（Slack や Notion の情報を Claude に見せる）、<strong>Hooks</strong> =「ツール実行前後に何かさせる」（自動でバックアップ・通知・検証など）。
      </p>

      <Section>2. MCP とは ─ 外部サービスとの接続規格（20分）</Section>
      <p>
        <strong>MCP（Model Context Protocol）</strong>は Anthropic が策定した「<strong>AI モデルが外部サービスとやり取りするための共通規格</strong>」です。HTTP が Web の共通規格なのと同じで、MCP があると<strong>1度 MCP サーバーを実装すれば、対応 AI なら何でも使える</strong>ようになります。Claude Code は MCP プロトコルで各サービスの MCP サーバーに接続し、サーバーが各サービスの API を叩きます。
      </p>
      <p>
        MCP サーバーには2種類あります。<strong>既存の MCP サーバーを使う</strong>（最初はこれ。Anthropic や他社が用意した Slack・GitHub・Notion・Linear・Postgres などを追加するだけ）と、<strong>自作する</strong>（独自の社内ツール・DB に接続するため自分で書く。本章では扱わない）。
      </p>
      <Code lang="bash" filename="MCP サーバーの追加・確認・削除">{`# GitHub MCP サーバーを追加
claude mcp add github
# Slack MCP サーバーを追加
claude mcp add slack

# Claude Code 内で状態を確認
/mcp
# サーバーを削除
claude mcp remove github`}</Code>
      <Figure
        src="/learn/shots/claude-code/claude-code-07-mcp-hooks-01.svg"
        alt="/mcp を実行して MCP サーバーの接続状態が一覧表示された画面"
        caption="/mcp の一覧。どのサーバーが接続済みか、認証が通っているかがここで分かる"
      />
      <p>設定ファイル <Cmd>~/.claude.json</Cmd> に手動で書く方法もあります。</p>

      <Section>3. MCP の使用例（15分）</Section>
      <p><strong>例1: GitHub の Issue を解決させる</strong></p>
      <Code lang="text">{`> GitHub の issue #42 を読んで、原因を特定して修正してください。
> 修正後はプルリクエストも作ってください。`}</Code>
      <p>GitHub MCP が自動で ① issue #42 の内容を取得 ② 関連コードを Claude に渡す ③ 修正後に PR 作成 API を叩く。<strong>あなたは GitHub にアクセスせず、ターミナルから出ません</strong>。</p>
      <p><strong>例2: Notion の仕様書を読ませる</strong></p>
      <Code lang="text">{`> Notion の「OAuth実装仕様書」というページを読んで、
> その仕様通りに実装してください。`}</Code>
      <p><strong>例3: Notion に進捗を記録させる</strong>（タスク管理・記録などに使えます）</p>
      <Code lang="text">{`> Notion の作業ログページに、「ログイン機能の実装が完了」と書き込んで`}</Code>

      <Section>4. MCP のセキュリティ注意点（15分）</Section>
      <p>MCP は強力ですが、<strong>セキュリティリスク</strong>があります。使う前に必ず読んでください。</p>
      <Callout variant="danger" title="起こりうるリスク">
        <ul>
          <li><strong>誤ったデータへのアクセス</strong>: チームの Slack 全会話を誤って読んでしまう</li>
          <li><strong>不意の書き込み</strong>: 本番だとして本番データベースを更新</li>
          <li><strong>プロンプトインジェクション</strong>: データ側の悪意のある指示を Claude が実行</li>
          <li><strong>認証情報の漏洩</strong>: API トークンを誤ってコミット</li>
        </ul>
      </Callout>
      <p>対策:</p>
      <ol>
        <li><strong>公式・信頼できる MCP サーバーだけ使う</strong></li>
        <li><strong>MCP サーバーには必要最小限の権限</strong>を付ける（read-only 優先）</li>
        <li><strong>本番環境の DB や Slack には直接接続しない</strong>（開発・staging 環境を使う）</li>
        <li><Cmd>claude mcp</Cmd> で追加するときに表示される<strong>権限を必ず確認</strong></li>
        <li><Cmd>.env</Cmd> や認証情報をリポジトリにコミットしない</li>
      </ol>
      <Callout variant="warn" title="安全に使うための運用ルール（推奨）">
        最初は<strong>個人アカウントや検証用（sandbox）環境</strong>で MCP を試す。本番の Slack / Notion workspace に接続する場合は<strong>影響範囲を必ず確認</strong>してから。DB 系の MCP（Postgres 等）は<strong>読み取り専用ロール</strong>で接続する。
      </Callout>

      <Section>5. Hooks とは ─ ツール実行前後の自動化（20分）</Section>
      <p>
        <strong>Hooks</strong> は「<strong>Claude Code がツールを使う前後に、決まった処理を自動実行する</strong>」仕組みです。例: ファイル編集の前に必ず git stash する、コマンド実行のログをファイルに残す、など。
      </p>
      <ComparisonTable
        headers={["イベント", "いつ発火？", "よくある用途"]}
        rows={[
          ["PreToolUse", "ツール使用の直前", "バックアップ・権限チェック・入力検証"],
          ["PostToolUse", "ツール使用の直後", "ログ・通知・自動コミット"],
          ["Notification", "ユーザーに通知が必要な時", "システム通知・Slack 送信"],
          ["Stop", "セッション終了時", "ログ集計・後処理"],
        ]}
      />

      <Section>6. Hooks の設定方法（15分）</Section>
      <p>
        Hooks は <Cmd>~/.claude/settings.json</Cmd>（ユーザー全体）か <Cmd>./.claude/settings.json</Cmd>（プロジェクト）で設定します。
      </p>
      <Code lang="json" filename="例1: ファイル編集前に自動 git stash">{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "git stash push -m 'auto-stash by claude' || true"
          }
        ]
      }
    ]
  }
}`}</Code>
      <p>
        <Cmd>matcher</Cmd>: どのツールに反応するか（<Cmd>Edit</Cmd>=ファイル編集、<Cmd>Write</Cmd>=新規作成）。<Cmd>command</Cmd>: 実行するシェルコマンド。<Cmd>|| true</Cmd>: stash 対象がないときも失敗扱いにしない。
      </p>
      <Code lang="json" filename="例2: bash 実行のログを取る">{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \\"$(date): bash executed\\" >> ~/.claude-bash.log"
          }
        ]
      }
    ]
  }
}`}</Code>
      <Code lang="json" filename="例3: 危険なコマンドをブロック">{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "[[ ! \\"$CLAUDE_TOOL_INPUT\\" =~ rm[[:space:]]+-rf ]] || (echo 'rm -rf is blocked' && exit 1)"
          }
        ]
      }
    ]
  }
}`}</Code>
      <p><Cmd>rm -rf</Cmd> を含むコマンドが実行されようとしたら<strong>ブロック</strong>します。</p>

      <Section>7. MCP と Hooks の使い分け（10分）</Section>
      <ComparisonTable
        headers={["観点", "MCP", "Hooks"]}
        rows={[
          ["目的", "外部サービス連携", "ツール実行前後の自動化"],
          ["トリガー", "Claude が必要と判断したとき", "ツール使用の前後で自動"],
          ["主な作業", "API 呼び出し", "シェルコマンド実行"],
          ["設定場所", "claude mcp add または ~/.claude.json", "~/.claude/settings.json"],
          ["典型例", "「Slack の最新10件取得して」", "「編集前に必ず git stash」"],
        ]}
      />
      <Callout variant="info" title="組み合わせの例">
        MCP と Hooks を併用: ① ファイル編集が完了したら（<Cmd>PostToolUse</Cmd>）② Slack MCP を経由して ③ チームに「ファイルを更新しました」と通知する。Hooks が「<strong>いつやるか</strong>」を制御し、MCP が「<strong>どこに通知するか</strong>」を提供します。
      </Callout>

      <Section>8. アンチパターン（10分）</Section>
      <Callout variant="danger" title="❌ 信頼性のない MCP サーバーを入れる">
        よく分からない MCP を入れると<strong>認証情報を盗まれる</strong>リスク。<strong>対処</strong>: 公式 or 大手 OSS のものだけ。出所不明のものは使わない。
      </Callout>
      <Callout variant="danger" title="❌ MCP に過剰な権限を与える">
        「とりあえず admin 権限で」だと、プロンプトインジェクションで本番 DB を破壊される可能性。<strong>対処</strong>: <strong>読み取り専用 → 書き込み権限</strong>の順で最小権限を守る。
      </Callout>
      <Callout variant="danger" title="❌ Hooks で重い処理を入れる">
        <Cmd>PreToolUse</Cmd> で大きなビルドや長い処理を入れると毎回タイムアウト。<strong>対処</strong>: Hooks は<strong>短時間で終わる処理</strong>だけにする。
      </Callout>
      <Callout variant="danger" title="❌ Hooks がエラーで止まる">
        Hooks が <Cmd>exit 1</Cmd> で終わるとツール実行自体がブロックされます。意図的でない場合は <Cmd>|| true</Cmd> で必ず success させる。
      </Callout>
      <Callout variant="danger" title="❌ settings.json をチームに無断で書き換える">
        プロジェクトの <Cmd>.claude/settings.json</Cmd> は git で共有される。<strong>チームに影響する変更は事前に相談</strong>。
      </Callout>

      <Section>9. 課題（30分）</Section>
      <p><strong>課題1: MCP の状態を確認する</strong> ── <Cmd>claude</Cmd> を起動 → <Cmd>/mcp</Cmd> → 現在追加されている MCP サーバーがあるか確認（最初は何もないかも）。</p>
      <p><strong>課題2: 簡単な MCP サーバーを追加</strong> ── 試しに GitHub MCP を追加してみましょう（自分の GitHub アカウントを使用）。</p>
      <Code lang="bash">{`claude mcp add github`}</Code>
      <p>ブラウザで OAuth 認証 → <Cmd>claude</Cmd> 起動 → <Cmd>/mcp</Cmd> で GitHub サーバー追加を確認 → 試しに依頼し、実際にリポジトリ一覧が返ってくることを確認しましょう。</p>
      <Code lang="text">{`> 自分のGitHubで最近作ったリポジトリを3つリストして`}</Code>
      <p><strong>課題3: Hooks を設定する</strong> ── <Cmd>~/.claude/settings.json</Cmd> を開いて（なければ新規作成）以下を追加。</p>
      <Code lang="json">{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo \\"$(date): file edited by claude\\" >> ~/.claude-edit.log"
          }
        ]
      }
    ]
  }
}`}</Code>
      <p><Cmd>claude</Cmd> を起動して何度かファイル編集をし、<Cmd>cat ~/.claude-edit.log</Cmd> でログが数行たまっていることを確認しましょう。</p>
      <Figure
        src="/learn/shots/claude-code/claude-code-07-mcp-hooks-02.svg"
        alt="cat ~/.claude-edit.log で Hook が書き出したログが並んでいる画面"
        caption="編集のたびに1行ずつ追記されていれば、Hook は正しく発火している"
      />
      <Callout variant="tip" title="課題4（任意）">
        「<Cmd>rm -rf</Cmd> を実行しようとしたらブロックする」Hook を作り、実際に Claude に <Cmd>rm -rf</Cmd> 系のコマンドを実行させようとしたときに<strong>ブロックされる</strong>ことを確認。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "MCP は外部サービス接続の共通規格。claude mcp add で追加、/mcp で確認",
          "MCP はまず公式・最小権限・sandbox/読み取り専用で。認証情報はコミットしない",
          "Hooks はツール実行前後の自動化（PreToolUse/PostToolUse/Notification/Stop）",
          "設定は settings.json。matcher でツールを絞り、|| true で誤ブロックを防ぐ",
          "MCP=どこに繋ぐか、Hooks=いつ処理するか。併用で通知等を自動化できる",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        最後の章「8. Plugins と Git Worktree」で、拡張機能のパッケージ化と、複数 Claude の並列実行を学びます。
      </Callout>
    </>
  );
}

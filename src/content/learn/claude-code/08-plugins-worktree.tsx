import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, Steps, Step, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-08-plugins-worktree",
  title: "8. Plugins と Git Worktree ─ チーム開発と並列実行",
  description: "自作の Skills / Hooks / Subagents を Plugin として1パッケージで配布し、Git Worktree で複数の Claude Code を並列実行する応用ワークフロー。Plugin の構造、worktree の基本操作、Writer / Reviewer パターンまで。",
  domain: "claude-code",
  section: "advanced",
  order: 1,
  level: "practice",
  tags: ["Claude Code", "Plugins", "Git Worktree", "並列実行"],
  updated: "2026-05-05",
  minutes: 120,
};

export default function Article() {
  return (
    <>
      <Lead>
        応用ワークフローの章です。<strong>Plugins</strong> で自作の Skills / Hooks / Subagents をチームに配布できるようにし、<strong>Git Worktree</strong> で複数の Claude Code を並列実行して開発を加速します。（目標学習時間：2時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Plugin の構造が説明できる／自作 Skills・Hooks をパッケージ化できる</li>
          <li>Git Worktree の仕組みが説明できる／worktree で複数 Claude を並列実行できる</li>
          <li>Writer / Reviewer パターンが実践できる</li>
        </ul>
      </Callout>

      <Section>1. Plugins とは ─ 拡張機能のパッケージ（15分）</Section>
      <p>
        これまでに学んだ Skills・Hooks・Subagents・MCP の設定は<strong>ばらばらに保存</strong>されています。
      </p>
      <ul>
        <li>Skills: <Cmd>.claude/skills/</Cmd></li>
        <li>Hooks: <Cmd>.claude/settings.json</Cmd></li>
        <li>Subagents: <Cmd>.claude/agents/</Cmd></li>
        <li>MCP 設定: <Cmd>~/.claude.json</Cmd></li>
      </ul>
      <p>
        <strong>チームに配布したいとき</strong>、これらを1つずつコピーするのは大変です。<strong>Plugin</strong> はこれらをまとめて<strong>1つのパッケージ</strong>として配布できる仕組みです。Plugin なしだと、ばらばらな設定ファイルを手動でコピーして配布することになりますが、Plugin ありなら1つのパッケージとして配布でき、<strong>1コマンドでインストール</strong>できます。
      </p>

      <Section>2. Plugin の構造（15分）</Section>
      <p>Plugin は以下のディレクトリ構造で構成されます。</p>
      <Code lang="text" filename="Plugin のディレクトリ構造">{`my-plugin/
├── .claude-plugin/
│   └── plugin.json     # メタデータ（必須）
├── skills/             # Skills（オプション）
│   └── my-skill/
│       └── SKILL.md
├── agents/             # Subagents（オプション）
│   └── my-agent.md
├── commands/           # スラッシュコマンド（オプション）
│   └── my-command.md
└── hooks/              # Hooks設定（オプション）
    └── settings.json`}</Code>

      <p><Cmd>plugin.json</Cmd> の中身はこのようになります。</p>
      <Code lang="json" filename=".claude-plugin/plugin.json">{`{
  "name": "my-team-toolkit",
  "version": "1.0.0",
  "description": "チームの開発で使う共通ツール集",
  "author": "Your Team",
  "components": {
    "skills": ["commit-message", "code-review"],
    "agents": ["explorer-jp"],
    "hooks": "hooks/settings.json"
  }
}`}</Code>

      <p><strong>Plugin を作る手順</strong>は次のとおりです。</p>
      <Steps>
        <Step title="ディレクトリ構造を作る">
          <Code lang="bash">{`mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/skills/my-skill
mkdir -p my-plugin/agents`}</Code>
        </Step>
        <Step title="plugin.json を作成">
          上記のサンプルを参考に、メタデータと <Cmd>components</Cmd> を記述する。
        </Step>
        <Step title="各コンポーネントを配置">
          Skills / Agents / Hooks を対応するディレクトリに置く。
        </Step>
        <Step title="配布">
          GitHub などにリポジトリとして公開する。社内なら社内 Git サーバーへ、ローカル配布なら zip でも OK。
        </Step>
      </Steps>

      <p><strong>Plugin を使う側</strong>は、インストールコマンドを叩くだけです。</p>
      <Code lang="bash" filename="Plugin のインストール・確認">{`# Plugin をインストール
claude plugin install <repository-url-or-path>

# インストール済みの Plugin を確認
claude plugin list`}</Code>

      <Section>3. Git Worktree とは ─ 同じリポジトリを複数ディレクトリで（15分）</Section>
      <p>
        Claude Code で複数のタスクを進めるとき、通常のアプローチには<strong>2つの問題</strong>があります。
      </p>
      <p>
        <strong>問題1: コンテキストの汚染。</strong><Cmd>/clear</Cmd> してもファイルシステムは共有されています。バグ修正ブランチに機能追加のコードが<strong>混入するリスク</strong>があります。
      </p>
      <p>
        <strong>問題2: 待ち時間の無駄。</strong>「機能Aの実装（30分）→ 待機 → レビュー（10分）→ 待機 → 機能Bの実装（30分）」のように、Claude が機能Aを実装している間、<strong>機能Bは待つしかありません</strong>。
      </p>
      <Callout variant="tip" title="Git Worktree なら並列に解決">
        1つの <Cmd>.git</Cmd> を共有しながら、<Cmd>my-project/</Cmd>（main・Claude A）、<Cmd>../my-project-feature-a/</Cmd>（feature-a・Claude B）、<Cmd>../my-project-bugfix/</Cmd>（bugfix・Claude C）のように、<strong>それぞれが独立したファイル状態</strong>を持ちます。完全に分離された状態で<strong>同時実行</strong>できます。
      </Callout>

      <Section>4. Git Worktree の基本操作（15分）</Section>
      <p><strong>Worktree を作る</strong></p>
      <Code lang="bash" filename="worktree の作成と Claude 起動">{`# 新しいブランチで worktree を作成
git worktree add ../project-feature-a -b feature-a

# 既存のブランチで worktree を作成
git worktree add ../project-bugfix bugfix-123

# worktree に移動して Claude Code を起動
cd ../project-feature-a
claude`}</Code>

      <p>
        <strong>Claude Code 組み込みの --worktree フラグ。</strong>Claude Code には worktree との統合が組み込まれていて、<strong>ワンコマンドで作成から起動まで完了</strong>します。
      </p>
      <Code lang="bash">{`claude --worktree feature-a`}</Code>
      <p>このコマンドは自動的に、① <Cmd>../[project-name]-feature-a</Cmd> に worktree を作成 → ② <Cmd>feature-a</Cmd> ブランチを作成または切り替え → ③ その worktree で Claude Code を起動、まで行います。</p>

      <p><strong>Worktree の一覧確認と削除</strong></p>
      <Code lang="bash" filename="一覧・削除・クリーンアップ">{`# 一覧確認
git worktree list
# 出力例:
# /Users/you/my-project            abc1234 [main]
# /Users/you/my-project-feature-a  def5678 [feature-a]
# /Users/you/my-project-bugfix     ghi9012 [bugfix-123]

# worktree を削除（ブランチは残る）
git worktree remove ../project-feature-a

# 強制削除（変更が残っていても）
git worktree remove --force ../project-feature-a

# 古い参照をクリーンアップ
git worktree prune`}</Code>

      <Section>5. 実践パターン: Writer / Reviewer（15分）</Section>
      <p>
        2つのターミナルで<strong>実装者 (Writer)</strong> と <strong>レビュアー (Reviewer)</strong> を同時に動かして、<strong>コードの品質を自動的に高める</strong>パターンです。Writer が実装コードを渡し、Reviewer がレビュー結果を返し、それを Writer に反映することで品質の高いコードに仕上げます。
      </p>
      <p><strong>ターミナル1（実装）</strong>:</p>
      <Code lang="bash">{`cd ../project-feature-login
claude`}</Code>
      <Code lang="text">{`> OAuth ログイン機能を実装して。 src/auth/ の既存コードを参照して。`}</Code>
      <p><strong>ターミナル2（レビュー）</strong>:</p>
      <Code lang="bash">{`cd ../project-review
claude`}</Code>
      <Code lang="text">{`> @../project-feature-login/src/auth/oauth.ts をレビューして。
> エッジケース・競合状態・既存コードとの一貫性を確認して。`}</Code>
      <p><strong>レビュー結果をターミナル1にフィードバック</strong>:</p>
      <Code lang="text">{`> レビューフィードバック：[レビュー結果をここに貼り付け]
> これらの問題に対処して。`}</Code>

      <p><strong>その他の実践パターン</strong></p>
      <Code lang="bash" filename="並列バグ修正 / 機能実装とリリース準備の並列化">{`# 複数のバグを同時に修正
git worktree add ../fix-auth-timeout -b fix/auth-timeout
git worktree add ../fix-memory-leak -b fix/memory-leak
# 別のターミナルでそれぞれ claude を起動

# 機能実装とリリース準備の並列化
git worktree add ../feature-notifications -b feature/notifications
git worktree add ../release-prep -b release/v2.1
# 片方で新機能、もう片方でリリースノート`}</Code>

      <Section>6. .env 等の共有ファイルの扱い（10分）</Section>
      <p>
        各 worktree は <Cmd>.gitignore</Cmd> に記載されたファイル（<Cmd>.env</Cmd> など）を<strong>コピーしません</strong>。これは通常の動作ですが、<Cmd>.env</Cmd> がないと開発サーバーが起動できないケースがあります。
      </p>
      <p>
        <strong>解決1: <Cmd>.worktreeinclude</Cmd> ファイル。</strong>プロジェクトルートに <Cmd>.worktreeinclude</Cmd> を作成すると、worktree 作成時に指定ファイルを<strong>シンボリックリンクで共有</strong>できます。<Cmd>.gitignore</Cmd> の<strong>逆の動作</strong>をし、記載されたファイルが worktree にリンクされます。
      </p>
      <Code lang="text" filename=".worktreeinclude">{`.env
.env.local
.env.development`}</Code>
      <p><strong>解決2: 手動でシンボリックリンクを作る</strong></p>
      <Code lang="bash">{`cd ../project-feature-a

# .env をシンボリックリンク
ln -s ../my-project/.env .env
ln -s ../my-project/.env.local .env.local`}</Code>
      <Callout variant="warn" title="機密情報を含む .env に注意">
        <Cmd>.env</Cmd> に<strong>機密情報</strong>が含まれる場合、シンボリックリンクによる共有は注意が必要です。各 worktree が<strong>異なる認証情報を持つ必要がある場合は個別にコピー</strong>してください。
      </Callout>

      <Section>7. アンチパターン（10分）</Section>
      <Callout variant="danger" title="❌ 同じブランチを複数の worktree でチェックアウト">
        <Cmd>git worktree add ../another-main main</Cmd> のように、既にチェックアウト済みのブランチを再度 worktree にするとエラーになります。<strong>対処</strong>: 1ブランチ = 1 worktree のルールを守る。
      </Callout>
      <Callout variant="danger" title="❌ メモリ消費を考えずに大量並列実行">
        複数の Claude Code セッションを同時実行すると、それぞれがメモリを消費します。<strong>通常は 2〜3 セッションが実用的な上限</strong>。
      </Callout>
      <Callout variant="danger" title="❌ worktree が古いまま放置">
        使い終わった worktree を削除せず溜め込むと、ディスク容量を食います。<strong>作業完了したら <Cmd>git worktree remove</Cmd> する習慣</strong>を。
      </Callout>
      <Callout variant="danger" title="❌ Plugin に試作品を入れて配布する">
        「とりあえず動いたから配布」だと、チームに迷惑がかかります。<strong>Plugin は十分テストしてから配布</strong>。
      </Callout>
      <Callout variant="danger" title="❌ plugin.json にセキュリティ情報を含める">
        認証トークン・API キーを <Cmd>plugin.json</Cmd> に書くと、配布した瞬間に漏洩します。<strong>機密情報は環境変数経由</strong>にする。
      </Callout>

      <Section>8. 課題（25分）</Section>
      <p><strong>課題1: Git Worktree の基本操作</strong></p>
      <Steps>
        <Step title="git リポジトリ化（まだの場合）">
          <Code lang="bash">{`cd ~/claude-practice
git init
git add .
git commit -m "initial commit"`}</Code>
        </Step>
        <Step title="worktree を作る">
          <Code lang="bash">{`git worktree add ../claude-practice-feature -b feature/test`}</Code>
        </Step>
        <Step title="一覧を確認">
          <Cmd>git worktree list</Cmd> で2つの worktree が表示されることを確認。
        </Step>
        <Step title="移動して Claude を起動">
          <Code lang="bash">{`cd ../claude-practice-feature
claude`}</Code>
          何か簡単な変更（ファイル追加など）をして、<Cmd>exit</Cmd> してから元のディレクトリに戻る。
        </Step>
        <Step title="分離を確認">
          <Code lang="bash">{`cd ~/claude-practice
ls`}</Code>
          <strong>元のディレクトリには変更が反映されていない</strong>ことを確認（worktree で作業していたので）。
        </Step>
      </Steps>
      <Callout variant="tip" title="確認ポイント">
        <Cmd>git worktree list</Cmd> の出力に、<strong>最低2つの worktree</strong>が表示されていることを確認しましょう。元のディレクトリと、新しく作った worktree が別々のパスで並んでいれば成功です。
      </Callout>

      <p><strong>課題2: Writer / Reviewer パターン</strong> ── ターミナルを2つ開き、1つは <Cmd>~/claude-practice</Cmd> で「<strong>新しい Python 関数を実装して</strong>」と依頼。もう1つは別の場所で起動して「<Cmd>@~/claude-practice/&lt;さっきのファイル&gt;</Cmd> をレビューして」と依頼。レビュー結果を1つ目のターミナルにコピーして、フィードバックを反映する。</p>

      <p><strong>課題3: クリーンアップ</strong> ── 課題1で作った worktree を削除し、1つだけになっていることを確認。</p>
      <Code lang="bash">{`git worktree remove ../claude-practice-feature
git worktree prune
git worktree list`}</Code>

      <Callout variant="tip" title="課題4（任意・上級）シンプルな Plugin を作ってみる">
        <ol>
          <li><Cmd>~/my-first-plugin</Cmd> ディレクトリを作る</li>
          <li>構造を作る:
            <Code lang="bash">{`mkdir -p ~/my-first-plugin/.claude-plugin
mkdir -p ~/my-first-plugin/skills/hello-me`}</Code>
          </li>
          <li><Cmd>~/my-first-plugin/.claude-plugin/plugin.json</Cmd> を作る</li>
          <li><Cmd>skills/hello-me/SKILL.md</Cmd> に<strong>「自分の名前で挨拶する」Skill</strong>を書く</li>
          <li><Cmd>claude plugin install ~/my-first-plugin</Cmd> でインストール</li>
          <li><Cmd>claude</Cmd> を起動して <Cmd>/hello-me</Cmd> で呼び出せるか確認</li>
        </ol>
      </Callout>

      <Divider />

      <ComparisonTable
        headers={["仕組み", "解決すること", "キーコマンド"]}
        rows={[
          ["Plugins", "Skills/Hooks/Agents を1パッケージで配布", "claude plugin install / list"],
          ["Git Worktree", "複数タスクの分離・並列実行", "git worktree add / list / remove"],
          ["Writer/Reviewer", "実装とレビューを同時進行し品質向上", "worktree × 2ターミナル"],
        ]}
      />

      <KeyPoints
        items={[
          "Plugin は Skills/Hooks/Agents/Commands を1パッケージ化して配布する仕組み",
          "plugin.json（.claude-plugin/）が必須メタデータ。install/list で導入・確認",
          "Git Worktree は同一 .git を共有しつつ独立ファイル状態を持ち、並列実行できる",
          "claude --worktree で作成→切替→起動をワンコマンド。使い終えたら remove する",
          "Writer/Reviewer パターンで実装とレビューを並列化し、コード品質を高める",
          "並列は2〜3セッションが上限。.env は .worktreeinclude で共有、機密は個別に",
        ]}
      />

      <Callout variant="tip" title="Claude Code 基礎コース 修了">
        お疲れ様でした。これで Claude Code 基礎コースは完了です。身についたのは、基本概念とインストール／日常ワークフローと安全な操作／プロンプトとセッション管理／CLAUDE.md と Plan モードでの精度向上／Subagents と Skills での専門特化／MCP と Hooks での外部連携・自動化／Plugins と Git Worktree での応用ワークフロー。実際に使い倒すことが一番の上達方法です。困ったらまず Claude に聞き、CLAUDE.md と Skills は毎日少しずつ育て続けましょう。
      </Callout>
    </>
  );
}

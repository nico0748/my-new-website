import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-02-install",
  title: "2. インストール ─ 環境をセットアップする",
  description: "Claude Code を macOS / Windows(WSL) にネイティブインストーラで入れ、ログイン・動作確認する。claude doctor での診断、よくあるトラブルと対処、最初のセッションまで。",
  domain: "claude-code",
  section: "setup",
  order: 1,
  level: "intro",
  tags: ["Claude Code", "インストール", "セットアップ", "WSL"],
  updated: "2026-05-05",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        Claude Code を自分のPCに入れて、最初のセッションを起動できるようになりましょう。（目標学習時間：1時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>自分の PC（macOS / Windows）に Claude Code をインストールできる</li>
          <li>Claude Pro / Max 契約 or API キーでログインできる</li>
          <li><Cmd>claude doctor</Cmd> で自分のセットアップが正常かを確認できる</li>
          <li>最初のセッションを起動して動作確認できる</li>
        </ul>
      </Callout>

      <Section>1. 前提知識と必要なもの（5分）</Section>
      <SubSection>必要な契約</SubSection>
      <p>Claude Code は<strong>無料の claude.ai プランでは使えません</strong>。以下のいずれかが必要です。</p>
      <ComparisonTable
        headers={["プラン", "月額", "おすすめ度"]}
        rows={[
          ["Claude Pro", "$20", "個人利用には十分"],
          ["Claude Max", "$100〜200", "ヘビーに使う人向け（レート制限が高い）"],
          ["Anthropic API キー", "従量課金", "API クレジットがある人向け"],
        ]}
      />
      <Callout variant="info" title="どのプランを選ぶ？">
        まずは Claude Pro（$20/月）で十分に動かせます。使用量が多くレート制限に頻繁に当たるようになったら Claude Max を検討しましょう。
      </Callout>

      <SubSection>システム要件</SubSection>
      <ul>
        <li><strong>macOS</strong>: 13.0 (Ventura) 以降</li>
        <li><strong>Windows</strong>: 10 (1809+) または 11</li>
        <li><strong>Linux</strong>: Ubuntu 20.04+ / Debian 10+ など</li>
        <li><strong>メモリ</strong>: 4GB 以上（8GB 推奨）</li>
        <li><strong>インターネット接続</strong>: 必須（処理は Anthropic のサーバーで行われる）</li>
      </ul>

      <SubSection>2つのインストール方法</SubSection>
      <ComparisonTable
        headers={["方法", "特徴", "おすすめ度"]}
        rows={[
          ["ネイティブインストーラ", "Node.js 不要。1コマンドで完結、自動更新あり", "👉 こちらが現在の推奨"],
          ["npm", "Node.js 18+ が必要。手動アップデート", "npm に慣れている人向け"],
        ]}
      />
      <p>この章では、推奨されているネイティブインストーラを使います。</p>

      <Section>2. インストール手順（15分）</Section>
      <SubSection>macOS の場合</SubSection>
      <Steps>
        <Step title="ターミナルを開く">ターミナル.app を開く（Spotlight で「ターミナル」検索）。</Step>
        <Step title="インストールコマンドを実行">下のコマンドを実行し、完了まで待つ（30秒〜1分）。</Step>
        <Step title="ターミナルを開き直す">PATH を反映させるため、ターミナルを一度閉じて開き直す。</Step>
      </Steps>
      <Code lang="bash" filename="macOS ターミナル">{`curl -fsSL https://claude.ai/install.sh | bash`}</Code>

      <SubSection>Windows の場合</SubSection>
      <p>
        <strong>WSL（Windows Subsystem for Linux）の使用を強く推奨します</strong>。WSL を使えば Windows 内で Linux 環境が動き、互換性の問題が大幅に減ります。
      </p>
      <Code lang="powershell" filename="WSL を使う場合（推奨）">{`# PowerShell を管理者権限で開いて実行 → 再起動
wsl --install

# 再起動後、Ubuntu のターミナルで macOS と同じコマンドを実行
curl -fsSL https://claude.ai/install.sh | bash`}</Code>
      <Code lang="powershell" filename="直接 Windows で使う場合">{`# PowerShell を開く（管理者権限不要）
irm https://claude.ai/install.ps1 | iex`}</Code>

      <SubSection>動作確認</SubSection>
      <Code lang="bash">{`claude --version`}</Code>
      <p>
        バージョン番号が表示されたら成功です。もし <Cmd>command not found</Cmd> と出たら、ターミナルを一度閉じて開き直してください。
      </p>
      <Figure
        src="/learn/shots/claude-code/claude-code-02-install-01.svg"
        alt="claude --version を実行しバージョン番号が表示されたターミナル"
        caption="この形でバージョン番号が表示されればインストール成功"
      />
      <Callout variant="tip" title="claude doctor で詳しく診断">
        <Cmd>claude doctor</Cmd> は認証状態・PATH・設定・MCP サーバー等を一気にチェックしてくれます。<strong>何かおかしいと感じたら、まずこれを実行する</strong>癖をつけておきましょう。
      </Callout>

      <Section>3. ログイン（10分）</Section>
      <p>
        インストールが終わったら、Anthropic のアカウントでログインします。任意のディレクトリで <Cmd>claude</Cmd> を実行すると、初回起動時にブラウザが自動で開いて Anthropic のログイン画面が表示されます。<strong>契約しているアカウント</strong>でログインしてください。認証が完了すると、ターミナルに Claude Code の対話画面（REPL）が表示されます。これで準備完了です。
      </p>
      <Figure
        src="/learn/shots/claude-code/claude-code-02-install-02.svg"
        alt="初回起動時に表示されるログイン方法の選択画面"
        caption="初回起動時のログイン方法の選択。契約しているアカウントの種類に合わせて選ぶ"
      />
      <Code lang="text" filename="動作テスト">{`> Hello! Claude Code が動いているか確認したい。簡単な挨拶をして。`}</Code>
      <p>Claude が返事を返してくれたら成功です。セッションを終了するには <Cmd>/exit</Cmd> か <Cmd>Ctrl + C</Cmd> を2回押します。</p>

      <Section>4. よくあるトラブルと対処（10分）</Section>
      <Callout variant="warn" title="問題1: command not found と出る">
        <strong>原因</strong>: PATH が通っていない / ターミナルが古い設定のまま。<br />
        <strong>対処</strong>: ターミナルを完全に閉じて開き直す。それでもダメなら <Cmd>~/.zshrc</Cmd>（macOS）か <Cmd>~/.bashrc</Cmd>（Linux）に下記を追加して <Cmd>source ~/.zshrc</Cmd>。
      </Callout>
      <Code lang="bash">{`export PATH="$HOME/.local/bin:$PATH"`}</Code>

      <Callout variant="warn" title="問題2: ブラウザでログインしても認証が進まない">
        <strong>原因</strong>: 企業ネットワーク・プロキシなどで OAuth リダイレクトが阻害されている。<br />
        <strong>対処</strong>: API キー認証に切り替える。
      </Callout>
      <Code lang="bash">{`export ANTHROPIC_API_KEY="sk-ant-..."

# ~/.zshrc などに永続化する場合
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.zshrc
source ~/.zshrc`}</Code>

      <Callout variant="danger" title="問題3: macOS で「権限が拒否されました」と出る">
        <strong>原因</strong>: <Cmd>sudo</Cmd> を使ってインストールしようとした。<br />
        <strong>対処</strong>: <strong>絶対に <Cmd>sudo</Cmd> でインストールしないでください</strong>。所有権の問題が発生します。一度アンインストールして、<Cmd>sudo</Cmd> なしでやり直してください。
      </Callout>

      <Callout variant="warn" title="問題4: Node.js のバージョンエラー（npm でインストールした人向け）">
        <strong>原因</strong>: Node.js が古い（v18 未満）。<strong>対処</strong>: <Cmd>nvm</Cmd> で Node.js v18 以上をインストール。
      </Callout>
      <Code lang="bash">{`# nvm をインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Node.js v18 をインストール
nvm install 18
nvm use 18`}</Code>

      <p>
        <strong>問題5: それでも解決しない</strong> ── <Cmd>claude doctor</Cmd> を実行し、表示されるエラーメッセージをそのまま検索したり、公式ドキュメントや Claude 自身に尋ねてみましょう。エラーメッセージ全文を添えると原因の切り分けが早くなります。
      </p>

      <Section>5. プロジェクトを開いて少し触ってみる（10分）</Section>
      <p>
        Claude Code は<strong>プロジェクトディレクトリ</strong>で起動するのが基本です。練習用ディレクトリを作って動かしてみましょう。
      </p>
      <Code lang="bash" filename="練習用ディレクトリを作る">{`# ホームディレクトリに移動
cd ~
# 練習用ディレクトリを作成して移動
mkdir claude-practice
cd claude-practice
# 簡単なファイルを作っておく
echo "# Claude Code 練習プロジェクト" > README.md`}</Code>
      <p>
        <Cmd>claude</Cmd> で起動したら、まず <Cmd>{"> このディレクトリに何があるか教えて"}</Cmd> と入力。Claude が中身を読んで README.md があることを教えてくれます。次に編集を頼みます。
      </p>
      <Code lang="text" filename="編集を頼む">{`> README.md に「開始日」というセクションを追加して、今日の日付を入れて`}</Code>
      <p>
        Claude が変更案を提示します。<strong>Default モード</strong>だと「この変更を適用しますか？」と聞かれるので、<Cmd>y</Cmd> を押すと適用されます。<Cmd>/exit</Cmd> で終了し、<Cmd>cat README.md</Cmd> で実際に書き換わったか確認してみましょう。
      </p>

      <Section>6. 課題（10分）</Section>
      <Code lang="bash" filename="課題1: インストール完了の確認">{`claude --version
claude doctor`}</Code>
      <Figure
        src="/learn/shots/claude-code/claude-code-02-install-03.svg"
        alt="claude doctor の診断結果が一覧表示されたターミナル"
        caption="claude doctor の出力。認証状態・PATH・設定・MCP サーバーの状態がまとめて確認できる"
      />
      <Code lang="text" filename="課題2: 最初のセッション（claude-practice で）">{`> 今日の日付を README.md に追記してから、その内容を表示して。`}</Code>
      <p>
        <strong>課題3: Claude にコードを書かせて実行させる</strong> ── <Cmd>claude-practice</Cmd> ディレクトリで下記のように依頼し、Claude が作ったファイルが実際に動くところまで確認しましょう。
      </p>
      <Code lang="text" filename="課題3 の依頼">{`> hello.py という Python ファイルを作って、「Hello, Claude Code!」と表示するスクリプトを書いて。
> 作ったあと、python3 hello.py で実行して結果を見せて。`}</Code>
      <Callout variant="tip" title="課題4（任意）">
        <Cmd>claude doctor</Cmd> の出力には、Claude が内部で使用している MCP サーバーの状態などが表示されます。「どんな項目がチェックされているか？」「自分の環境ではどんな MCP サーバーが認識されているか？」を読んで考えてみてください（後の MCP 章の予備知識になります）。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Claude Code は無料プラン不可。Pro/Max/API キーのいずれかが必要",
          "推奨はネイティブインストーラ（1コマンド・Node.js 不要・自動更新）",
          "Windows は WSL 経由が強く推奨",
          "claude --version で確認、困ったら claude doctor で診断",
          "sudo でインストールしない。プロジェクトディレクトリで claude を起動",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「3. 基本的な使い方」で、日常的に使うワークフロー（権限モード・チェックポイント・スラッシュコマンドなど）を身につけます。
      </Callout>
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-06-subagents-skills",
  title: "6. Subagents と Skills ─ Claudeを専門特化させる",
  description: "タスクを別コンテキストへ委任する Subagents と、再利用可能なワークフローを SKILL.md で定義する Skills。作り方・フロントマター・使い分け・Output Styles まで、Claude を専門特化させる方法を学ぶ。",
  domain: "claude-code",
  section: "extend",
  order: 1,
  level: "practice",
  tags: ["Claude Code", "Subagents", "Skills", "拡張機能"],
  updated: "2026-05-05",
  minutes: 180,
};

export default function Article() {
  return (
    <>
      <Lead>
        Claude を「特定の仕事に特化させる」2つの方法を学びます。<strong>Subagents</strong> はタスクを別エージェントに委任する仕組み、<strong>Skills</strong> は再利用可能なワークフローを定義する仕組みです。（目標学習時間：3時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Subagent の概念が説明できる／組み込みの Subagent を呼び出せる</li>
          <li>SKILL.md を書いてカスタム Skill を作れる</li>
          <li>Subagent と Skill の使い分けができる／自分用の専門特化ワークフローを作れる</li>
        </ul>
      </Callout>

      <Section>1. なぜ専門特化が必要か（10分）</Section>
      <p>Claude は賢いですが、<strong>1つのセッションで全部やらせる</strong>と以下の問題が出てきます。</p>
      <ul>
        <li><strong>コンテキスト汚染</strong>: 大きなタスクの途中で調査用に大量のファイルを読み込むと、メインの作業に集中できなくなる</li>
        <li><strong>ワンオフな指示</strong>: 決まったワークフローを毎回書くのは無駄</li>
        <li><strong>再現性の欠如</strong>: 同じ品質のコードレビュー・テスト生成を毎回やってもらうのが難しい</li>
      </ul>
      <p>解決策が<strong>専門特化させる2つの方法</strong>です。<strong>Subagent</strong> =「タスクを丸ごと別の人に投げる」感覚、<strong>Skill</strong> =「一度作ったレシピを引き出しから呼び出す」感覚。</p>

      <Section>2. Subagent ─ タスクを別エージェントに委任する（25分）</Section>
      <p>
        Subagent は<strong>メインの Claude セッションとは別のコンテキスト</strong>で動く専門エージェントです。メインのコンテキストを汚染せずに、<strong>重い調査・反復タスク</strong>を任せられます。ポイントは、メイン Claude のコンテキストには「5ファイルで使ってます」という<strong>結果だけ</strong>が入り、詳細な大量ログは Subagent 内で完結することです。
      </p>
      <SubSection>組み込みの Subagent</SubSection>
      <ComparisonTable
        headers={["Subagent", "用途"]}
        rows={[
          ["Explore", "コードベース調査・ファイル検索・パターン抽出"],
          ["Output Style 系", "応答スタイルを変える（後述の Output Styles と連動）"],
        ]}
      />
      <p>使うときは Claude が<strong>自動で判断</strong>して呼び出します。明示的にも呼べます。</p>
      <Code lang="text">{`> Explore Subagent を使って、src/ 内で auth という単語が含まれる関数を全部リストアップして`}</Code>
      <SubSection>カスタム Subagent を作る</SubSection>
      <p>
        <Cmd>/agents</Cmd> コマンドで作成できます。Claude が対話形式で ①名前 ②説明 ③使えるツール ④使うモデル を聞いてきて、雛形を作ってくれます。<Cmd>.claude/agents/&lt;name&gt;.md</Cmd> に保存されます。
      </p>
      <Figure
        src="/learn/shots/claude-code/claude-code-06-subagents-skills-01.svg"
        alt="/agents の Subagent 作成メニューが表示された画面"
        caption="/agents のメニュー。既存の Subagent の確認と、新規作成をここから行う"
      />
      <Code lang="markdown" filename=".claude/agents/code-reviewer.md（例）">{`---
name: code-reviewer
description: コードレビュー専門。プルリクエストやファイル変更を、ベストプラクティス・セキュリティ・可読性の観点でレビューする
tools: Read, Grep, Glob
model: sonnet
---

あなたはシニアエンジニアとして、コードレビューを行います。

レビューの観点:
1. 正しさ: バグや論理エラーがないか
2. 可読性: 名前・構造・コメントが明瞭か
3. 保守性: 将来の変更に耐えるか
4. セキュリティ: 入力検証・認可漏れがないか
5. パフォーマンス: 明らかなボトルネックはないか

レビュー結果は以下の形式で返してください:
- ✅ Good: 良い点
- ⚠️ Warning: 改善推奨（必須ではない）
- ❌ Critical: 必ず直すべき`}</Code>

      <Section>3. Skill ─ 再利用可能ワークフローを定義する（25分）</Section>
      <p>
        Skill は<strong>「この依頼が来たら、こう対応してね」というレシピを、ファイルとして保存しておく仕組み</strong>です。指示を含む <Cmd>SKILL.md</Cmd> ファイルを作ると、Claude がツールキットに追加します。呼び出され方は2つ:「Claude が合いそうと判断して<strong>自動で使う</strong>」か「ユーザーが <Cmd>/skill-name</Cmd> で<strong>直接呼び出す</strong>」。
      </p>
      <p>各 Skill は <Cmd>SKILL.md</Cmd> をエントリーポイントとするディレクトリで構成されます。</p>
      <Code lang="text">{`my-skill/
├── SKILL.md           # メインの指示（必須）
├── template.md        # Claude が記入するテンプレート
├── examples/
│   └── sample.md      # 期待される出力例
└── scripts/
    └── validate.sh    # Claude が実行できるスクリプト`}</Code>
      <p>
        保存場所は用途で選びます：<strong>プラグイン経由</strong>（チームやコミュニティと共有）／<strong>プロジェクトスコープ</strong> <Cmd>./.claude/skills/</Cmd>（このプロジェクトだけ）／<strong>ユーザースコープ</strong> <Cmd>~/.claude/skills/</Cmd>（あなたの全プロジェクト）。
      </p>
      <SubSection>最初の Skill を作ってみる</SubSection>
      <p>例: コードを「アナロジーと図解で説明」する Skill。</p>
      <Code lang="bash" filename="ステップ1: ディレクトリを作る">{`mkdir -p ~/.claude/skills/explain-code`}</Code>
      <Code lang="markdown" filename="ステップ2: ~/.claude/skills/explain-code/SKILL.md">{`---
name: explain-code
description: ビジュアルダイアグラムとアナロジーでコードを説明する。コードの動作を説明するとき・コードベースについて教えるとき・「これはどう動く？」と尋ねたときに使用。
---

コードを説明するとき、必ず以下を含めること：

1. アナロジーから始める: コードを日常生活のものと比較する
2. ダイアグラムを描く: ASCII アートでフロー・構造・関係を示す
3. コードをウォークスルー: 何が起きるかをステップバイステップで説明する
4. 落とし穴を強調する: よくある間違いや誤解は何か？

説明は会話形式に保つ。複雑な概念には複数のアナロジーを使用する。`}</Code>
      <Code lang="text" filename="ステップ3: テスト">{`# Claude に自動で呼び出させる
> このコードはどう動く？

# または直接呼び出す
> /explain-code src/auth/login.ts`}</Code>

      <Section>4. SKILL.md のフロントマター詳細（15分）</Section>
      <p>
        SKILL.md の冒頭にある <Cmd>---</Cmd> 〜 <Cmd>---</Cmd> の部分を<strong>フロントマター</strong>と呼びます。ここで Skill の動作を制御します。
      </p>
      <ComparisonTable
        headers={["フィールド", "必須", "説明"]}
        rows={[
          [<Cmd>name</Cmd>, "いいえ", "Skill の表示名（省略時はディレクトリ名）"],
          [<Cmd>description</Cmd>, "推奨", "いつ使うかを Claude に判断させる重要なフィールド"],
          [<Cmd>argument-hint</Cmd>, "いいえ", "オートコンプリート時のヒント（例: [issue-number]）"],
          [<Cmd>disable-model-invocation</Cmd>, "いいえ", "true にすると Claude が自動ロードしない"],
          [<Cmd>user-invocable</Cmd>, "いいえ", "false にすると / メニューから非表示"],
          [<Cmd>allowed-tools</Cmd>, "いいえ", "使えるツールを制限"],
          [<Cmd>model</Cmd>, "いいえ", "使用するモデル指定"],
          [<Cmd>context</Cmd>, "いいえ", "fork にすると Subagent コンテキストで実行"],
        ]}
      />
      <Callout variant="info" title="description の書き方が肝">
        <Cmd>description</Cmd> は Claude が<strong>自動判断で使うかどうか</strong>を決める材料です。<strong>「いつ使うか」を具体的に書く</strong>のがコツ。悪い例:「<Cmd>description: コードの説明</Cmd>」／良い例:「<Cmd>description: コードを説明するとき、コードベースを教えるとき、「これはどう動く？」と聞かれたときに使用</Cmd>」。
      </Callout>
      <p>引数を渡すには <Cmd>$ARGUMENTS</Cmd> プレースホルダーを使います。</p>
      <Code lang="markdown">{`---
name: fix-issue
description: GitHub イシューを修正する
disable-model-invocation: true
---

GitHub イシュー $ARGUMENTS を修正する。

1. イシューの説明を読む
2. 要件を理解する
3. 修正を実装する
4. テストを書く
5. コミットを作成する`}</Code>
      <p><Cmd>/fix-issue 123</Cmd> を実行すると、Claude は「…GitHub イシュー 123 を修正…」として受け取ります。</p>

      <Section>5. Subagent vs Skill ─ 使い分け（10分）</Section>
      <p>どちらも「専門特化」ですが性質が違います。<strong>コンテキストを分離したいなら Subagent、ワークフローを再利用したいなら Skill</strong>、その都度でよいなら普通のプロンプトで OK です。</p>
      <ComparisonTable
        headers={["観点", "Subagent", "Skill"]}
        rows={[
          ["目的", "タスクの委任", "ワークフローの再利用"],
          ["コンテキスト", "分離（メインに影響しない）", "共有（メインと同じ）"],
          ["呼び出し方", "Claude が自動 or /agents", "Claude が自動 or /skill-name"],
          ["典型例", "大規模調査・並列タスク", "定型ワークフロー・スタイル指示"],
          ["設定ファイル", ".claude/agents/<name>.md", ".claude/skills/<name>/SKILL.md"],
        ]}
      />
      <Callout variant="tip" title="組み合わせも可能">
        Skill のフロントマターに <Cmd>context: fork</Cmd> を追加すると、<strong>Skill を Subagent コンテキストで実行</strong>できます。「再利用可能で、かつコンテキストを汚染しない」最強パターンです。
      </Callout>
      <Code lang="markdown">{`---
name: deep-research
description: トピックを徹底的に調査する
context: fork
agent: Explore
---

$ARGUMENTS を徹底的に調査する：
1. Glob と Grep で関連ファイルを見つける
2. コードを読んで分析する
3. 具体的なファイル参照で発見を要約する`}</Code>

      <Section>6. Output Styles ─ Claudeの応答スタイルを変える（10分）</Section>
      <p>Skills が「<strong>何をするか</strong>」を変えるのに対し、Output Styles は「<strong>どう応答するか</strong>」を変えます。</p>
      <ComparisonTable
        headers={["スタイル", "特徴"]}
        rows={[
          ["Default", "ソフトウェアエンジニアリングタスクを効率的に完了するための既定スタイル"],
          ["Explanatory", "タスクを支援しながら、教育的な「Insights」を提供する（学習中におすすめ）"],
          ["Learning", <>Claude が Insights を共有しつつ、<Cmd>TODO(human)</Cmd> マーカーでユーザー自身が小さな部分を実装する共同学習モード</>],
        ]}
      />
      <Code lang="text">{`# メニューから選ぶ
/output-style
# 直接指定する
/output-style explanatory`}</Code>
      <Callout variant="tip" title="学習中のおすすめ">
        慣れるまでは <Cmd>Explanatory</Cmd> か <Cmd>Learning</Cmd> をおすすめします。Claude がコードを書く理由を解説してくれるので、自分の学習にもなります。
      </Callout>

      <Section>7. アンチパターン（10分）</Section>
      <Callout variant="danger" title="❌ 何でも Skill 化する">
        作りすぎると <Cmd>description</Cmd> の文字予算を食って、Claude が全部の Skill を認識できなくなります。<strong>対処</strong>: <strong>3回以上同じワークフローを繰り返した</strong>タイミングで初めて Skill 化する。
      </Callout>
      <Callout variant="danger" title="❌ description を曖昧に書く">
        「<Cmd>description: 便利な Skill</Cmd>」だと、いつ使えばいいか判断できません。<strong>「ユーザーがこういう発言をしたら使う」という具体的なトリガーキーワード</strong>を入れる。
      </Callout>
      <Callout variant="danger" title="❌ Subagent と Skill の使い分けを意識しない">
        両方作っておくと管理が大変。<strong>コンテキスト分離が必要なら Subagent、再利用したいなら Skill</strong>、と明確に判断。
      </Callout>
      <Callout variant="danger" title="❌ Skill を共有せずに自分専用にする">
        便利な Skill を <Cmd>~/.claude/skills/</Cmd> に置くとチームメンバーは使えません。<strong>対処</strong>: チームで使えるものは <Cmd>.claude/skills/</Cmd> に置いて git でコミット。
      </Callout>

      <Section>8. 課題（35分）</Section>
      <p><strong>課題1: 組み込み Subagent を使う</strong> ── <Cmd>~/claude-practice</Cmd> で <Cmd>claude</Cmd> を起動し、「Explore Subagent を使って、.py ファイルすべてに含まれる関数の一覧を出して」と依頼。Subagent が起動して結果を返すことを確認。</p>
      <p><strong>課題2: カスタム Skill を作る</strong> ──「コミットメッセージ作成」Skill を作ります。</p>
      <Code lang="bash">{`mkdir -p .claude/skills/commit-message`}</Code>
      <Code lang="markdown" filename=".claude/skills/commit-message/SKILL.md">{`---
name: commit-message
description: 良いコミットメッセージを作成する。git の変更内容を確認して、Conventional Commits 形式でコミットメッセージを提案する。「コミットメッセージ作って」「これコミットしたい」と言われたときに使用。
---

git の変更内容を確認して、Conventional Commits 形式のコミットメッセージを作成してください。

手順:
1. git status と git diff で変更内容を確認
2. 変更の種類を判断（feat / fix / docs / refactor / test / chore）
3. 1行サマリ（50文字以内）+ 詳細（必要なら）の形式で提案

形式:
type(scope): summary

詳細説明（必要なら）

例:
feat(auth): OAuth2 ログインを追加

passport-oauth2 を使った OAuth2 認証フローを実装。
Google・GitHub プロバイダに対応。`}</Code>
      <p>ターミナルで何か小さい変更を加えて <Cmd>git add</Cmd> しておき、<Cmd>claude</Cmd> を起動して「コミットメッセージ作って」と依頼。Skill が呼び出され Conventional Commits 形式のメッセージが提案されることを確認しましょう。</p>
      <Figure
        src="/learn/shots/claude-code/claude-code-06-subagents-skills-02.svg"
        alt="自作の Skill が呼び出されてコミットメッセージを提案している画面"
        caption="Skill が呼び出されると、その名前が画面に出る。定義したとおりの手順で動いているか確認する"
      />
      <p><strong>課題3: Output Style を試す</strong> ── <Cmd>/output-style explanatory</Cmd> に切替 → 簡単なコード生成を依頼（例:「フィボナッチ数列を返す関数を Python で書いて」）→ <strong>Insights</strong>（説明）が含まれることを確認 → <Cmd>/output-style default</Cmd> で戻す。</p>
      <Callout variant="tip" title="課題4（任意）">
        <strong>Code Reviewer Subagent</strong> を作る。① <Cmd>/agents</Cmd> で対話的に作成 ② コードファイルを指定してレビューを依頼 ③ Claude が Subagent コンテキストでレビューし、メインに結果を返すか確認。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Subagent はタスクを別コンテキストへ委任。調査ログでメインを汚さない",
          "Skill は SKILL.md でワークフローを再利用可能に。description が肝",
          "使い分け：コンテキスト分離=Subagent、再利用=Skill。context:fork で両立",
          "Output Styles は応答スタイル。学習中は Explanatory / Learning が◎",
          "Skill は3回繰り返したら作る／トリガーを具体的に／チームは .claude に置く",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「7. MCP と Hooks」で、外部サービス連携と、ツール実行前後の自動化を学びます。
      </Callout>
    </>
  );
}

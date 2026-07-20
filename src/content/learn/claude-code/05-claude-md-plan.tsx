import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-05-claude-md-plan",
  title: "5. CLAUDE.md と Plan モード ─ Claudeに記憶と計画力を持たせる",
  description: "毎会話で自動読込される CLAUDE.md でプロジェクト規約を覚えさせ、メモリの階層構造・応用テクニック（@import・.claude/rules・paths）を学ぶ。実装前に計画を立てる Plan モードの使いどころまで。",
  domain: "claude-code",
  section: "context",
  order: 1,
  level: "basic",
  tags: ["Claude Code", "CLAUDE.md", "Plan モード", "メモリ"],
  updated: "2026-05-05",
  minutes: 120,
};

export default function Article() {
  return (
    <>
      <Lead>
        Claude に「永続的な記憶」と「考える時間」を与える章です。<Cmd>CLAUDE.md</Cmd> でプロジェクトのルールを覚えさせ、Plan モードで実装前に計画を立てさせます。この2つを使うと精度が一気に上がります。（目標学習時間：2時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li><Cmd>CLAUDE.md</Cmd> の役割が説明できる／<Cmd>/init</Cmd> で雛形を作れる／効果的な CLAUDE.md を書ける</li>
          <li>メモリの階層構造を理解できる</li>
          <li>Plan モードを起動できる／いつ使うべきか判断できる</li>
        </ul>
      </Callout>

      <Section>1. なぜ CLAUDE.md が必要か（10分）</Section>
      <p>
        Claude Code には永続メモリがありません（前章のおさらい）。新しいセッションを起動するたびに、コードスタイルのルール・よく使うコマンド・アーキテクチャの決定事項を<strong>毎回伝え直す必要があります</strong>。これはめんどくさく、忘れがちです。
      </p>
      <p>
        <strong>CLAUDE.md</strong> はこの問題を解決するための特別なファイルです。Claude が<strong>毎会話の開始時に自動で読み込む</strong>ため、書いた内容がプロジェクト全体で一貫して参照されます。
      </p>

      <Section>2. メモリの階層構造（10分）</Section>
      <p>Claude Code は5種類のメモリロケーションを<strong>階層構造</strong>で提供しています。</p>
      <ComparisonTable
        headers={["メモリタイプ", "保存場所", "共有対象", "用途"]}
        rows={[
          ["エンタープライズポリシー", "OS の管理場所", "組織全員", "IT/DevOps が管理"],
          ["プロジェクトメモリ", <Cmd>./CLAUDE.md</Cmd>, "チーム", "最もよく使う。プロジェクト規約"],
          ["プロジェクトルール", <Cmd>./.claude/rules/*.md</Cmd>, "チーム", "テーマ別に分けたモジュール型ルール"],
          ["ユーザーメモリ", <Cmd>~/.claude/CLAUDE.md</Cmd>, "あなた個人", "個人の好み（全プロジェクト共通）"],
          ["ローカルメモリ", <Cmd>./CLAUDE.local.md</Cmd>, "あなた個人", "このプロジェクトだけの個人設定"],
        ]}
      />
      <Callout variant="info" title="CLAUDE.local.md">
        <Cmd>CLAUDE.local.md</Cmd> は自動的に <Cmd>.gitignore</Cmd> に追加されます。チームに共有すべきでない個人設定はここに書きましょう。
      </Callout>

      <Section>3. CLAUDE.md を書いてみる（20分）</Section>
      <p>
        プロジェクトディレクトリで <Cmd>claude</Cmd> を起動して <Cmd>/init</Cmd> を実行すると、Claude が現在のプロジェクト構造を分析して<strong>スターターファイル</strong>を生成します。これをベースに、自分のプロジェクトに合わせて編集していきます。
      </p>
      <Figure
        src="/learn/shots/claude-code/claude-code-05-claude-md-plan-01.svg"
        alt="/init を実行して CLAUDE.md の雛形が生成されている画面"
        caption="/init はプロジェクトを読んだうえで CLAUDE.md の雛形を書いてくれる"
      />
      <ComparisonTable
        headers={["✅ 書くべきこと", "❌ 書かなくていいこと"]}
        rows={[
          ["Claude が推測できない Bash コマンド", "コードを読めばわかること"],
          ["デフォルトと異なるコードスタイルルール", "標準的な言語規約（Claude が既知）"],
          ["テスト指示と推奨テストランナー", "詳細な API ドキュメント（リンクで十分）"],
          ["リポジトリのコミットルール", "頻繁に変わる情報"],
          ["プロジェクト固有のアーキテクチャ決定", "長い説明やチュートリアル"],
          ["必要な環境変数", "「クリーンなコードを書く」のような自明な内容"],
          ["よくある落とし穴・非自明な動作", "コードベース全ファイルの説明"],
        ]}
      />
      <Code lang="markdown" filename="CLAUDE.md のサンプル（Python プロジェクト用）">{`# プロジェクト概要
Python の演習・練習用プロジェクト

# 環境
- Python 3.11+
- 依存パッケージは requirements.txt に記載

# コードスタイル
- インデントは4スペース（PEP 8 準拠）
- 関数・変数名は snake_case
- 型ヒント（type hints）を可能な限り使用

# テスト
- pytest を使用する
- テストファイルは tests/ ディレクトリに配置
- テストファイル名は test_*.py 形式

# よく使うコマンド
- 依存インストール: pip install -r requirements.txt
- テスト実行: pytest -v
- 型チェック: mypy src/

# ワークフロー
- コード変更後は必ず pytest を実行する
- コミット前に black でフォーマット
- パフォーマンスのため、全テストではなく単一テストを優先実行

# 落とし穴
- venv を有効化してから作業すること（source venv/bin/activate）
- pytest は repo ルートで実行（サブディレクトリでは動かない）`}</Code>
      <Callout variant="warn" title="簡潔さを保つ">
        各ルールについて「<strong>これを削除したら Claude がミスをするか？</strong>」と問いかけてみてください。そうでなければ削除しましょう。<strong>肥大化した CLAUDE.md は逆効果</strong>です（Claude が重要な指示を見落とす原因になる）。
      </Callout>

      <Section>4. CLAUDE.md の応用テクニック（15分）</Section>
      <SubSection>インポート構文 @ で別ファイルを取り込む</SubSection>
      <p>
        CLAUDE.md から別のファイルを <Cmd>@path/to/import</Cmd> 構文でインポートできます。相対パスと絶対パスの両方が使え、インポートされたファイルは<strong>さらに別のファイルをインポートできます</strong>（最大5ホップまで）。
      </p>
      <Code lang="markdown">{`See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow: @docs/git-instructions.md`}</Code>
      <SubSection>.claude/rules/ でルールをモジュール化する</SubSection>
      <p>
        プロジェクトが大きくなると、1つの CLAUDE.md にすべてを詰め込むのは管理しにくくなります。<Cmd>.claude/rules/</Cmd> ディレクトリを使えば、テーマごとにファイルを分けて整理できます。<Cmd>.claude/rules/</Cmd> 内のすべての <Cmd>.md</Cmd> ファイルは<strong>自動的にプロジェクトメモリとして読み込まれます</strong>。
      </p>
      <Code lang="text">{`your-project/
├── CLAUDE.md           # メインの指示
└── .claude/
    └── rules/
        ├── code-style.md   # コードスタイルのルール
        ├── testing.md      # テスト規約
        └── security.md     # セキュリティ要件`}</Code>
      <SubSection>パス固有のルール</SubSection>
      <p>
        特定のファイルパスにだけ適用したいルールは、YAML フロントマターの <Cmd>paths</Cmd> フィールドで指定できます。
      </p>
      <Code lang="markdown">{`---
paths: src/api/**/*.ts
---

# API 開発ルール
- すべての API エンドポイントには入力バリデーションを含める
- 標準のエラーレスポンスフォーマットを使用する`}</Code>
      <ComparisonTable
        headers={["パターン", "マッチするファイル"]}
        rows={[
          [<Cmd>**/*.ts</Cmd>, "任意のディレクトリの TypeScript ファイル"],
          [<Cmd>src/**/*</Cmd>, "src/ 以下のすべてのファイル"],
          [<Cmd>*.md</Cmd>, "プロジェクトルートの Markdown ファイル"],
        ]}
      />

      <Section>5. Plan モード ─ 実装前に計画を立てる（15分）</Section>
      <p>
        <strong>CLAUDE.md</strong> =「いつでも適用される永続的な指示」＝ Claude に<strong>前提条件</strong>を持たせる。<strong>Plan モード</strong> =「実装前に立ち止まる」＝ Claude に<strong>今からの計画</strong>を立てさせる。この2つを組み合わせると、<strong>Claude が暴走するリスクがほぼなくなります</strong>。
      </p>
      <p>Plan モードは Claude を<strong>読み取り専用</strong>にし、計画を立てさせて、<strong>承認後に初めて実行</strong>するモードです。起動方法は3つ:</p>
      <ul>
        <li><strong>方法1</strong>: セッション中に <Cmd>Shift + Tab</Cmd> を3回押す</li>
        <li><strong>方法2</strong>: 起動時に <Cmd>claude --permission-mode plan</Cmd></li>
        <li><strong>方法3</strong>: プロンプト末尾に <Cmd>--plan</Cmd> を付けると、その依頼だけ計画を立てさせられる</li>
      </ul>
      <Code lang="text" filename="Plan モードの使用感">{`> ユーザー認証にOAuth2を追加して

[Plan モード] 計画を立てます：
  1. 既存の認証モジュール src/auth/ を確認
  2. OAuth2 ライブラリを依存に追加（passport-oauth2）
  3. config/oauth.ts に設定を追加
  4. routes/auth.ts に /oauth/callback エンドポイントを追加
  5. ユーザーモデルに provider と providerId を追加
  6. テストケースを書く

この計画で進めてよろしいですか？（y/n）`}</Code>
      <Figure
        src="/learn/shots/claude-code/claude-code-05-claude-md-plan-02.svg"
        alt="Plan モードで計画が提示され、承認を求められている画面"
        caption="Plan モードでは、この承認プロンプトが出るまで一切ファイルが変更されない"
      />

      <Section>6. Plan モードを使うべきタイミング（10分）</Section>
      <p>毎回 Plan モードを使う必要はありません。判断基準を整理します。</p>
      <ComparisonTable
        headers={["Plan モードが効くケース", "Plan モードが不要なケース"]}
        rows={[
          ["新機能の追加（複数ファイルが絡む）", "ちょっとしたバグ修正"],
          ["リファクタリング", "typo の修正"],
          ["不慣れなライブラリの導入", "単一ファイル内の小さな変更"],
          ["大量のファイル削除や移動", "何度もやってきた既知の作業"],
          ["「とりあえず方針だけ立てたい」とき", "—"],
        ]}
      />

      <Section>7. アンチパターン（10分）</Section>
      <Callout variant="danger" title="❌ CLAUDE.md に何でも詰め込む">
        「念のため書いておこう」と書きすぎると、<strong>Claude が重要な指示を見落とす</strong>ようになります。<strong>対処</strong>:「これを削除したら Claude がミスをするか？」を毎回問う。No なら DELETE。
      </Callout>
      <Callout variant="danger" title="❌ CLAUDE.md を最初に完璧に書こうとする">
        最初から完璧を目指して時間を使いすぎないこと。<strong>まず <Cmd>/init</Cmd> で雛形を作って、実作業で Claude がミスしたタイミングで追記</strong>するのが効率的です。
      </Callout>
      <Callout variant="danger" title="❌ Plan モードで計画を見ずに即承認">
        計画を読まずに <Cmd>y</Cmd> を押すと Plan モードの意味がありません。<strong>計画は必ず読んで、おかしい部分はフィードバック</strong>しましょう。
      </Callout>
      <Callout variant="danger" title="❌ 小さな修正まで Plan モードで動かす">
        いちいち計画を立てさせると遅くなります。<strong>Plan モードは「方針が固まっていない」「規模が大きい」ときだけ</strong>使いましょう。
      </Callout>

      <Section>8. 課題（30分）</Section>
      <p>
        <strong>課題1: CLAUDE.md を作る</strong> ── <Cmd>~/claude-practice</Cmd> で <Cmd>claude</Cmd> 起動 → <Cmd>/init</Cmd> で雛形 → <Cmd>exit</Cmd> してエディタで <Cmd>CLAUDE.md</Cmd> を開き、以下を<strong>自分の環境に合わせて</strong>埋める。
      </p>
      <Code lang="markdown">{`# プロジェクト概要
（ここに、何のためのディレクトリか1〜2行で）

# 環境
- Python のバージョン or Node.js のバージョン
- OS

# コードスタイル
- （自分が好きなスタイル。インデント・命名規則など）

# よく使うコマンド
- （実際に使ってる起動・テストコマンド）

# 落とし穴
- （これは Claude に伝えておきたい、というあなた個人の TIPS）`}</Code>
      <p>
        <strong>課題2: CLAUDE.md が機能することを確認</strong> ── <Cmd>claude</Cmd> を起動し、<strong>何も指示せず</strong>に「このプロジェクトの構成を把握して、新しい機能を追加する場合の手順を教えて」と依頼。Claude が CLAUDE.md の内容を<strong>反映した</strong>回答をするか確認。
      </p>
      <p>
        <strong>課題3: Plan モードを使う</strong> ── <Cmd>Shift + Tab</Cmd> 3回で Plan モードに切替、下記の複雑な依頼をする。Claude が<strong>計画</strong>を提示するので、<strong>読んで</strong>不足や疑問を指摘してフィードバック、OK なら承認して実行。
      </p>
      <Code lang="text">{`> greet.py を機能拡張して、以下を全部やってください:
> - コマンドライン引数で複数の名前を受け取る
> - 引数なしの場合は "World" を使う
> - --upper オプションで大文字、--lower オプションで小文字に変換
> - argparse を使う
> - tests/ ディレクトリに pytest テストを書く`}</Code>
      <Callout variant="tip" title="ポイント">
        課題3では、Claude が提示した<strong>計画そのもの</strong>をよく読むことが大事です。<strong>実装結果ではなく計画の段階</strong>で不足や誤りに気づけるのが Plan モードの価値です。
      </Callout>
      <Callout variant="tip" title="課題4（任意）">
        <Cmd>.claude/rules/</Cmd> を試す。① ディレクトリを作る ② <Cmd>testing.md</Cmd> にテストルールを書く ③ CLAUDE.md からテスト関連の記述を削除 ④ Claude を起動してテスト関連の依頼をし、<Cmd>testing.md</Cmd> のルールが効いているか確認。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "CLAUDE.md は毎会話で自動読込される永続メモリ。規約・コマンド・落とし穴を書く",
          "メモリは階層構造（エンプラ/プロジェクト/rules/ユーザー/ローカル）",
          "簡潔に保つ。@import・.claude/rules・paths でモジュール化・限定適用",
          "Plan モードは読み取り専用で計画→承認→実行。暴走を防ぐ",
          "Plan は規模が大きい/方針未定のときだけ。小修正は Default で",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「6. Subagents と Skills」で、専門エージェント・再利用可能なワークフローを学び、Claude を専門特化させます。
      </Callout>
    </>
  );
}

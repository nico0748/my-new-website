import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-03-basics",
  title: "3. 基本的な使い方 ─ 日常のワークフローを身につける",
  description: "起動・対話・修正・確認という Claude Code の日常ワークフロー。権限モードの切替、チェックポイントでの巻き戻し、スラッシュコマンド・@ファイル参照、効果的な使い方とアンチパターンまで。",
  domain: "claude-code",
  section: "setup",
  order: 2,
  level: "basic",
  tags: ["Claude Code", "ワークフロー", "権限モード", "スラッシュコマンド"],
  updated: "2026-06-29",
  minutes: 120,
};

export default function Article() {
  return (
    <>
      <Lead>
        起動・対話・修正・確認 ─ Claude Code の日常ワークフローを身につけましょう。ここを乗り越えると、Claude との作業が一気にスムーズになります。（目標学習時間：2時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Claude Code を起動して質問・依頼を出せる</li>
          <li>権限モード（Default / Auto-accept / Plan）を切り替えて安全に操作できる</li>
          <li>チェックポイントで間違いを巻き戻せる</li>
          <li>Tab 補完・スラッシュコマンドを使いこなせる</li>
          <li>ファイル参照（@）・画像貼り付けなど、便利な入力手法が使える</li>
        </ul>
      </Callout>

      <Section>1. 起動とインタラクション基礎（15分）</Section>
      <p>
        Claude Code は<strong>プロジェクトディレクトリ</strong>で起動するのが基本です。起動すると対話画面（<strong>REPL</strong> = Read-Eval-Print Loop）に入り、プロンプト記号 <Cmd>&gt;</Cmd> の後にメッセージを書きます。
      </p>
      <Code lang="bash">{`cd ~/my-project   # プロジェクトディレクトリに移動
claude            # Claude Code を起動`}</Code>
      <p>何でも自然な日本語/英語で話しかけて OK です。Claude は依頼に応じてファイルを読んだり、コマンドを実行したり、考察を返したりします。</p>
      <Code lang="text" filename="お願いの例">{`> このプロジェクトの構成を説明して
> src/ ディレクトリに何があるか教えて
> README.md を読んで、要約して
> このコードを実行して、結果を見せて`}</Code>
      <ul>
        <li><strong>改行・複数行入力</strong>: <Cmd>Shift + Enter</Cmd> で改行（送信されない）、<Cmd>Enter</Cmd> で送信</li>
        <li><strong>入力をキャンセル</strong>: <Cmd>Esc</Cmd> で現在の処理を中断、<Cmd>Esc</Cmd> 2回で直前の編集まで巻き戻し（チェックポイント）</li>
      </ul>

      <Section>2. 権限モード ─ 安全に操作するための切り替え（15分）</Section>
      <p>
        Claude Code は実際にファイルを書き換えたりコマンドを実行したりするため、「<strong>どこまで自動でやらせるか</strong>」を3段階で切り替えられます。これが<strong>権限モード</strong>です。<Cmd>Shift + Tab</Cmd> を押すたびに、3つのモードがトグルで切り替わります（画面の隅にモード名が表示）。
      </p>
      <ComparisonTable
        headers={["モード", "動作", "いつ使う？"]}
        rows={[
          ["Default", "ファイル編集・コマンド実行の前に確認を求める", "📌 最初はこれ。慣れるまで安全"],
          ["Auto-accept edits", "ファイル編集は自動承認、コマンドは確認あり", "慣れてきて、リファクタリングなど大量編集をするとき"],
          ["Plan mode", "読み取り専用。計画を立てて承認後に実行", "大きな変更の前に、まず計画だけ作りたいとき"],
        ]}
      />
      <Code lang="text" filename="各モードの体感の違い">{`# Default モード
> hello.py を作って
[Claude] hello.py を以下の内容で作成します。よろしいですか？(y/n)
> y
[Claude] 作成しました。

# Auto-accept モード（確認なしで即適用）
> hello.py を作って
[Claude] hello.py を作成しました。

# Plan モード（計画を見せるだけ。承認しないと実行されない）
> hello.py を作って
[Claude] 計画を立てます：
  1. hello.py を新規作成
  2. print文を1行書く
  3. python3で実行確認
この計画でよろしいですか？`}</Code>
      <Callout variant="info" title="おすすめの使い分け">
        <strong>使い始めのうち</strong>は常に Default で OK（何が起こっているか把握する）。<strong>慣れてきたら</strong>大量編集が確実なときだけ Auto-accept に切替。<strong>大きな機能追加・複雑なリファクタリング</strong>は、まず Plan で計画を立ててから Default に戻す。
      </Callout>

      <Section>3. チェックポイントと巻き戻し（10分）</Section>
      <p>
        Claude が変な変更をしても心配いりません。Claude がファイルを編集する前に、<strong>自動でスナップショット（チェックポイント）が作られています</strong>。間違えても元に戻せます。
      </p>
      <ul>
        <li><strong>方法1: <Cmd>Esc</Cmd> を2回押す</strong> ── 直前の編集を取り消します。一番手っ取り早い。</li>
        <li><strong>方法2: <Cmd>/rewind</Cmd> コマンド</strong> ── どの時点まで戻すかをリストから選べます。複数の編集をまとめて巻き戻したいときに便利。</li>
      </ul>
      <Code lang="text">{`> /rewind
[Claude] 巻き戻しポイント:
  1. 5分前 - hello.py を作成
  2. 10分前 - README.md を編集
  3. 15分前 - セッション開始時
どこまで戻しますか？`}</Code>
      <Callout variant="tip" title="大事なポイント">
        チェックポイントがあるから「<strong>試しにやらせてみる</strong>」ができます。怖がらず手を動かしましょう。
      </Callout>

      <Section>4. スラッシュコマンドとTab補完（15分）</Section>
      <p>Claude Code には便利な<strong>スラッシュコマンド</strong>が組み込まれています。<Cmd>/</Cmd> を押すとリストが表示されます。</p>
      <ComparisonTable
        headers={["コマンド", "用途"]}
        rows={[
          [<Cmd>/help</Cmd>, "使えるコマンドの一覧を表示"],
          [<Cmd>/init</Cmd>, "プロジェクト用 CLAUDE.md の作成をガイド（後の章で詳しく）"],
          [<Cmd>/clear</Cmd>, "会話をクリア（コンテキストをまっさらに）"],
          [<Cmd>/compact</Cmd>, "会話を圧縮してコンテキストを節約"],
          [<Cmd>/context</Cmd>, "現在のコンテキスト使用状況を表示"],
          [<Cmd>/model</Cmd>, "使用するモデルを切り替え（Sonnet / Opus）"],
          [<Cmd>/rewind</Cmd>, "編集を巻き戻す"],
          [<Cmd>/doctor</Cmd>, "セットアップ診断"],
          [<Cmd>/agents</Cmd>, "Subagent の管理（後の章で）"],
          [<Cmd>/exit</Cmd>, "セッションを終了"],
        ]}
      />
      <p>
        <strong>Tab 補完</strong>: <Cmd>/</Cmd> の後、コマンド名の途中で <Cmd>Tab</Cmd> を押すと自動補完。<Cmd>/co</Cmd> まで打って Tab で <Cmd>/compact</Cmd> や <Cmd>/context</Cmd> の候補が出ます。
      </p>
      <SubSection>@ でファイル参照</SubSection>
      <p>
        プロンプトの中で <Cmd>@</Cmd> を押すと、プロジェクト内のファイル一覧が出ます。<strong>特定のファイルを Claude に直接渡したい</strong>ときに便利です（<Cmd>@</Cmd> の後に Tab 補完も効きます）。
      </p>
      <Code lang="text">{`> @src/auth/login.ts のロジックを確認して、エッジケースを洗い出して`}</Code>
      <SubSection>画像を貼り付ける</SubSection>
      <p>
        エラー画面のスクリーンショット、UI のデザインなどを<strong>コピーしてそのまま <Cmd>Cmd+V</Cmd>（Mac）/ <Cmd>Ctrl+V</Cmd>（Windows）でペースト</strong>できます。
      </p>
      <Code lang="text">{`> [画像をペースト]
> このエラー画面の意味を教えて。どう対処すればいい？`}</Code>

      <Section>5. 効果的な使い方のコツ（15分）</Section>
      <p>「ただ使う」のと「使いこなす」のは別物です。以下のコツを意識すると生産性がぐっと上がります。</p>
      <p><strong>コツ1: まず Claude に聞いてみる</strong>——「hooks はどう設定するの？」等に Claude 自身が答えてくれます。わからないことはまず Claude に聞く癖を。</p>
      <p><strong>コツ2: 会話を重ねて洗練させる</strong>——大まかな依頼から始めて少しずつ絞り込む。</p>
      <Code lang="text">{`> ログインバグを修正して
[Claude が調査して試みる]
> それじゃない。問題はセッション処理にある。
[Claude がアプローチを調整する]
> session.ts の30行目あたりが怪しい。そこから見て
[Claude が該当箇所を集中的に調査]`}</Code>
      <p><strong>コツ3: 最初から具体的に伝える</strong>——関連ファイル・制約・参考パターンを最初から伝える。</p>
      <Code lang="text">{`# ❌ 悪い例
> ログインを直して

# ✅ 良い例
> 期限切れカードを持つユーザーでチェックアウトフローが壊れています。
> src/payments/ を確認してください。特にトークン更新部分です。
> まず失敗するテストを書いてから修正してください。`}</Code>
      <p><strong>コツ4: 検証方法をセットで渡す</strong>——テストケース・期待する出力を一緒に渡す。</p>
      <Code lang="text">{`> validateEmail を実装してください。
> テストケース：
> 'user@example.com' → true
> 'invalid' → false
> 'user@.com' → false
> 実装後にテストを実行してください。`}</Code>
      <p><strong>コツ5（おまけ）: 指示するのではなく委任する</strong>——目的とコンテキストを伝えれば Claude が判断します。Claude を<strong>有能な同僚</strong>だと思って、「これをこうしてほしい」と目的を伝えるのが一番うまくいきます。</p>
      <Code lang="text">{`> 期限切れカードのチェックアウトフローが壊れています。
> 関連コードは src/payments/ にあります。
> 調査して修正してもらえますか？`}</Code>

      <Section>6. やってはいけないアンチパターン（10分）</Section>
      <Callout variant="danger" title="❌ 1つのセッションで何でもやる">
        タスクを一気にやらせるとコンテキストが汚染されて混乱します。<strong>対処</strong>: タスクが切り替わったら <Cmd>/clear</Cmd> でリセットするか <Cmd>/compact</Cmd> で圧縮。
      </Callout>
      <Callout variant="danger" title="❌ いきなり Auto-accept で大規模変更">
        放置すると大量のファイルが書き換わり戻すのが大変。<strong>対処</strong>: 大きな変更は <strong>Plan で計画 → Default で実行</strong> の順に。
      </Callout>
      <Callout variant="danger" title="❌ エラーを Claude に丸投げ">
        「エラーが出た、直して」だけでは推測でしか動けません。<strong>エラーメッセージそのもの</strong>を貼り付けましょう。
      </Callout>
      <Callout variant="danger" title="❌ 「全部書き直して」と言う">
        既存コードを無視して書き直されるとレビューが大変。<strong>変更範囲を限定</strong>する。例:「<Cmd>src/auth/login.ts</Cmd> の <Cmd>validateToken</Cmd> 関数だけを、Joi バリデーションを使うように書き直して」。
      </Callout>
      <Callout variant="danger" title="❌ チェックポイントを信用しすぎる">
        <Cmd>.git</Cmd> 管理外のファイルや、ターミナルで直接実行したコマンドの副作用（DB 変更等）は巻き戻せません。<strong>対処</strong>: 重要な変更前は <Cmd>git commit</Cmd>。DB や外部 API に影響する操作は Plan モードで確認してから実行。
      </Callout>

      <Section>7. 課題（30分）</Section>
      <p><Cmd>~/claude-practice</Cmd> に移動して <Cmd>claude</Cmd> を起動してください。</p>
      <p>
        <strong>課題1: 権限モードを切り替える</strong> ── <Cmd>Shift + Tab</Cmd> を3回押して Default → Auto-accept → Plan のループを確認し、Default に戻す。<br />
        <strong>課題2: スラッシュコマンド</strong> ── <Cmd>/help</Cmd>・<Cmd>/context</Cmd>・<Cmd>/doctor</Cmd> を実行。
      </p>
      <p><strong>課題3: ファイル参照（@）を使う</strong> ── <Cmd>exit</Cmd> してターミナルで下記ファイルを作り、再度 <Cmd>claude</Cmd> で依頼。</p>
      <Code lang="bash">{`echo "def hello(name):" > greet.py
echo "    print(f'Hello, {name}!')" >> greet.py
echo "" >> greet.py
echo "hello('World')" >> greet.py`}</Code>
      <Code lang="text">{`> @greet.py を読んで、このコードを「'こんにちは、{name}さん！'」という日本語の挨拶にして`}</Code>
      <p>提案を <Cmd>y</Cmd> で承認し、<Cmd>python3 greet.py</Cmd> で日本語の挨拶が表示されることを確認。</p>
      <p><strong>課題4: 巻き戻しを試す</strong> ── セッション内でわざと変な変更（例:「greet.py の挨拶を、ふざけた感じの言い回しに書き換えて」）を頼み、<Cmd>Esc</Cmd> 2回で巻き戻し、<Cmd>cat greet.py</Cmd> で元に戻ったことを確認。</p>
      <Callout variant="tip" title="腕試し">
        <strong>お題</strong>: <Cmd>greet.py</Cmd> を改造して、コマンドライン引数で名前を受け取り、引数がない場合は "World" を使うようにする。「コツ3: 具体的に伝える」「コツ4: 検証方法をセットで渡す」を意識したプロンプトを書き、意図どおり動くところまで確認してみましょう。
      </Callout>
      <Callout variant="tip" title="課題5（任意）">
        5〜10往復してコンテキストを使った状態にし、<Cmd>/context</Cmd> で使用量を確認 → <Cmd>/compact focus on the greet.py changes</Cmd> を実行 → 再度 <Cmd>/context</Cmd> で減っていることを確認。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "プロジェクトディレクトリで claude 起動。REPL で自然文で依頼する",
          "権限モードは Shift+Tab で Default/Auto-accept/Plan を切替",
          "チェックポイントで巻き戻せる（Esc x2 / /rewind）。恐れず試す",
          "スラッシュコマンド・Tab 補完・@ファイル参照・画像ペーストを活用",
          "1セッション1タスク、Plan→Default、エラーは全文貼付、変更範囲は限定",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「4. プロンプトとセッション管理」で、より精度の高い指示の出し方とセッションの扱い方を学びます。
      </Callout>
    </>
  );
}

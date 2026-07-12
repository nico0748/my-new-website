import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "claude-code-04-prompt-session",
  title: "4. プロンプトとセッション管理 ─ Claudeとうまく会話する",
  description: "伝わるプロンプトの4つのコツ、曖昧な指示の具体化、検証方法をセットで渡す。セッションの再開・フォーク（--continue / --resume / --fork-session）とコンテキストウィンドウの圧縮まで。",
  domain: "claude-code",
  section: "setup",
  order: 3,
  level: "basic",
  tags: ["Claude Code", "プロンプト", "セッション", "コンテキスト"],
  updated: "2026-05-05",
  minutes: 90,
};

export default function Article() {
  return (
    <>
      <Lead>
        Claude の「伝え方」と「会話の管理」を学びます。プロンプトの書き方ひとつで結果が大きく変わります。長い会話の整理方法も身につけましょう。（目標学習時間：1.5時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Claude に伝わるプロンプトを書ける／曖昧な指示を具体化できる</li>
          <li>検証方法をセットで渡せる</li>
          <li>セッションを再開・フォークできる</li>
          <li>コンテキストを意識して圧縮できる</li>
          <li><Cmd>/clear</Cmd> と <Cmd>--continue</Cmd> を使い分けられる</li>
        </ul>
      </Callout>

      <Section>1. なぜプロンプトの書き方が重要か（10分）</Section>
      <p>
        Claude Code は強力ですが、<strong>「何をしてほしいか」を正確に伝えないと、的外れな結果が返ってきます</strong>。これは人間の同僚に頼むのと同じです。<strong>曖昧なプロンプト</strong>（「ログインを直して」）は Claude が推測で動き、関係ないファイルまで見て中途半端な修正になります。<strong>具体的なプロンプト</strong>（対象ファイル・やり方を明記）なら迷わず進み、期待通りの修正が返ります。
      </p>
      <Callout variant="info" title="伝え方のコツ">
        Claude を「察してくれる相棒」ではなく、「<strong>優秀だが文脈ゼロのジュニア</strong>」だと考えると伝え方のコツが見えてきます。
      </Callout>

      <Section>2. プロンプトの4つのコツ（20分）</Section>
      <p><strong>コツ1: 最初から具体的に伝える</strong>——関連ファイル・制約・参考にすべきパターンを最初から渡す。「どこを」「何を」「どうやって」を最低1つは明記する。</p>
      <Code lang="text">{`# ❌ 悪い例
> ログインを直して

# ✅ 良い例
> 期限切れカードを持つユーザーでチェックアウトフローが壊れています。
> src/payments/ を確認してください。特にトークン更新部分です。
> まず失敗するテストを書いてから修正してください。`}</Code>
      <p><strong>コツ2: 検証方法をセットで渡す</strong>——テストケース・期待する出力・実行コマンドをセットで渡す。</p>
      <Code lang="text">{`> validateEmail を実装してください。
> テストケース：
> - 'user@example.com' → true
> - 'invalid' → false
> - 'user@.com' → false
> 実装後にテストを実行してください。`}</Code>
      <p><strong>コツ3: 会話を重ねて洗練させる</strong>——大まかな依頼から始めて少しずつ絞り込む。「自分も全部わからない」状態でも、Claude に調べさせながら絞り込めます。</p>
      <Code lang="text">{`> ログインバグを修正して
[Claude が調査して試みる]
> それじゃない。問題はセッション処理にある。
[Claude がアプローチを調整する]
> session.ts の30行目あたりが怪しい。そこから見て
[Claude が該当箇所を集中的に調査]`}</Code>
      <p><strong>コツ4: 指示するのではなく委任する</strong>——どのファイルを読むか等を細かく指示せず、目的とコンテキストを伝えれば Claude が判断します。</p>
      <Code lang="text">{`> 期限切れカードのチェックアウトフローが壊れています。
> 関連コードは src/payments/ にあります。
> 調査して修正してもらえますか？`}</Code>

      <Section>3. セッションは一時的 ─ Claudeは記憶しない（10分）</Section>
      <p>
        <Cmd>/exit</Cmd> でセッションを終了して、また <Cmd>claude</Cmd> を起動すると、<strong>Claude は前回の会話を覚えていません</strong>。これがブラウザ版の ChatGPT / Claude と大きく違うところです。<strong>ただしローカルに会話履歴は保存されています</strong>。Claude が「思い出す」のではなく、あなたが「再開する」形で続きから作業できます。
      </p>
      <Code lang="bash" filename="セッションを再開する3つの方法">{`# 前回のセッションを再開する
claude --continue
# 過去のセッションをリストから選んで再開する
claude --resume
# 別のアプローチを試すために、元のセッションから分岐する
claude --continue --fork-session`}</Code>
      <ComparisonTable
        headers={["コマンド", "動作", "いつ使う？"]}
        rows={[
          [<Cmd>claude --continue</Cmd>, "最後のセッションを自動で再開", "「さっきの続きをやりたい」"],
          [<Cmd>claude --resume</Cmd>, "過去のセッション一覧から選んで再開", "「3日前のあの作業に戻りたい」"],
          [<Cmd>--fork-session</Cmd>, "セッションをコピーして別ブランチで続行", "「元の方向を残しつつ、別アプローチを試したい」"],
        ]}
      />

      <Section>4. コンテキストウィンドウの仕組み（15分）</Section>
      <p>
        Claude が一度に保持できる情報には<strong>上限</strong>があります。これを<strong>コンテキストウィンドウ</strong>（Claude の短期記憶の容量）と呼びます。会話履歴・読んだファイル内容・コマンド出力・<Cmd>CLAUDE.md</Cmd>・Skills の説明……これら全部が<strong>同じ容器に積み上がっていきます</strong>。
      </p>
      <p>
        Claude は限界に近づくと<strong>自動的にコンテキストを圧縮</strong>します（<strong>自動 compaction</strong>）。古い情報が要約され容量を空けますが、副作用として<strong>会話の初期に与えた指示が失われたり要約されすぎたり</strong>することがあります。対策は、永続ルールを <Cmd>CLAUDE.md</Cmd> に書く（次章）／自分のタイミングで <Cmd>/compact</Cmd> ／不要になったら <Cmd>/clear</Cmd> でリセット。
      </p>
      <ComparisonTable
        headers={["コマンド", "動作", "いつ使う？"]}
        rows={[
          [<Cmd>/context</Cmd>, "現在のコンテキスト使用状況を表示", "「今どれくらい使ってる？」を確認"],
          [<Cmd>/compact</Cmd>, "会話を要約して容量を空ける", "長時間使ってきて、まだ続けたい"],
          [<Cmd>/compact focus on X</Cmd>, "X に焦点を絞って圧縮", "「重要な部分は残してほしい」"],
          [<Cmd>/clear</Cmd>, "会話を完全リセット", "別のタスクに切り替えるとき"],
        ]}
      />

      <Section>5. /clear と --continue の使い分け（10分）</Section>
      <p>「いつ会話をリセットして、いつ続けるか」の判断基準を、よくあるシナリオで整理します。</p>
      <ul>
        <li><strong>シナリオ1: バグ修正の続きをやる</strong> → <Cmd>claude --continue</Cmd> で再開</li>
        <li><strong>シナリオ2: バグ修正が終わって別の機能追加に移る</strong> → 同じセッション内で <Cmd>/clear</Cmd> してから次の依頼。もしくは <Cmd>exit</Cmd> して新規起動</li>
        <li><strong>シナリオ3: 長時間使ってきて返事が遅い</strong> → <Cmd>/context</Cmd> で確認 → <Cmd>/compact</Cmd> で圧縮、または <Cmd>/clear</Cmd> でリセット</li>
        <li><strong>シナリオ4: 1週間前のあのプロジェクトに戻りたい</strong> → そのプロジェクトディレクトリで <Cmd>claude --resume</Cmd></li>
      </ul>

      <Section>6. アンチパターン（10分）</Section>
      <Callout variant="danger" title="❌ 1セッションで何でもやる">
        タスクを一気にやらせるとコンテキストが汚染されて混乱。<strong>対処</strong>: タスクが切り替わったら <Cmd>/clear</Cmd> でリセット。
      </Callout>
      <Callout variant="danger" title="❌ 「全部書き直して」と言う">
        既存コードを無視して書き直されるとレビューが大変。<strong>変更範囲を限定</strong>。悪い:「auth 周りを全部書き直して」／良い:「<Cmd>src/auth/login.ts</Cmd> の <Cmd>validateToken</Cmd> 関数だけを、Joi バリデーションを使うように書き直して」。
      </Callout>
      <Callout variant="danger" title="❌ エラーをエラーメッセージなしで投げる">
        「エラーが出た、直して」だけでは推測でしか動けません。良い:「以下のエラーが出ています: [エラーメッセージを貼り付け]。原因を特定して修正してください」。
      </Callout>
      <Callout variant="danger" title="❌ コンテキストを節約しすぎて情報を出し渋る">
        情報を絞りすぎると Claude が推測で動いて回り道します。<strong>ファイルパス・期待動作・既存パターンは出し惜しみしない</strong>。これがあると Claude は1発で動きます。
      </Callout>

      <Section>7. 課題（25分）</Section>
      <p><Cmd>~/claude-practice</Cmd> で <Cmd>claude</Cmd> を起動してください。</p>
      <p>
        <strong>課題1: 良いプロンプトを書く</strong> ── <strong>お題</strong>: <Cmd>greet.py</Cmd> を改造して、コマンドライン引数で名前を受け取り、引数がない場合は "World" を使う。実装後にテストもしてもらう。コツ1〜4を意識した具体的なプロンプトで依頼し、意図どおり動くところまで確認しましょう。
      </p>
      <p>
        <strong>課題2: セッション継続を体験する</strong> ── <Cmd>claude --continue</Cmd> で再開し、「さっきのコードに、引数が複数あった場合は全員に挨拶するように改造して」と依頼。Claude が<strong>前回の文脈を覚えているか</strong>を確認。
      </p>
      <p>
        <strong>課題3: コンテキスト管理を試す</strong> ── <Cmd>/context</Cmd> で使用量確認 → 5回程度会話 → 再度 <Cmd>/context</Cmd> で増加を確認 → <Cmd>/compact focus on greet.py の改造</Cmd> → もう一度 <Cmd>/context</Cmd> で減少を確認。3回の <Cmd>/context</Cmd> 出力を見比べて、使用量がどう変化したかを実感しましょう。
      </p>
      <Callout variant="tip" title="課題4（任意）">
        <Cmd>claude --continue --fork-session</Cmd> を試す。① 途中まで作業しているセッションを fork で開く ② 元とは違う方向の改造を依頼 ③ <Cmd>/exit</Cmd> 後、<Cmd>claude --resume</Cmd> で<strong>元のセッションがまだ残っている</strong>ことを確認。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Claude は『文脈ゼロの優秀なジュニア』。具体的に伝えるほど精度が上がる",
          "4つのコツ：具体的に／検証方法をセットで／会話で洗練／目的を委任",
          "セッションは永続記憶なし。--continue/--resume/--fork-session で再開",
          "コンテキストは同じ容器に積み上がる。/context で確認し /compact・/clear",
          "恒久ルールは CLAUDE.md へ（次章）",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「5. CLAUDE.md と Plan モード」で、プロジェクトのルールを Claude に覚えさせる方法と、実装前に計画を立てる方法を学びます。
      </Callout>
    </>
  );
}

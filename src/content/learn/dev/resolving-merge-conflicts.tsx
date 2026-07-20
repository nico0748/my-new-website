import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, Steps, Step, KVList, KeyPoints, Bridge, Quiz, Figure, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "resolving-merge-conflicts",
  title: "コンフリクト発生時の対処方法",
  description: "マージコンフリクトの仕組みと解決手順を、コンフリクトマーカーの読み方から実際のコマンドまで実践的に。AI（バイブコーディング）で衝突が増える理由と予防策も。",
  domain: "dev",
  section: "editor-git",
  order: 2,
  level: "basic",
  tags: ["Git", "コンフリクト", "AI開発"],
  updated: "2026-07-07",
  minutes: 12,
};

export default function Article() {
  return (
    <>
      <Lead>
        複数人・複数ブランチで開発すると、<strong>同じ箇所を別々に変更</strong>したときに Git が自動でまとめられず、
        <strong>コンフリクト（衝突）</strong>が起きます。近年は AI にコードを書かせる「バイブコーディング」が広まり、
        ファイルを<strong>丸ごとリファクタリング</strong>することも増えました。差分が広範囲になるぶんコンフリクトも起きやすいので、
        「慌てず、意味を理解して解消する」手順を身につけておきましょう。
      </Lead>

      <Section>コンフリクトとは何か</Section>
      <p>
        Git はふつう、別々の変更を<strong>自動でマージ</strong>してくれます。しかし<strong>同じファイルの同じ行付近</strong>を、
        2 つのブランチが<strong>異なる内容に変更</strong>していると、「どちらを採用すべきか」を Git は判断できません。
        このとき人間に解決を委ねるのがコンフリクトです。主に次の操作で発生します。
      </p>
      <KVList
        items={[
          { key: "git merge", val: "ブランチを取り込むとき、同じ箇所の変更がぶつかると発生" },
          { key: "git pull", val: "リモートの変更を取り込むとき（内部で merge / rebase する）" },
          { key: "git rebase", val: "コミットを別の土台に載せ替えるとき、各コミットで発生しうる" },
          { key: "git cherry-pick / stash pop", val: "変更を別の場所に当てるときにも起きうる" },
        ]}
      />

      <Section>なぜ AI 時代に増えるのか（バイブコーディング）</Section>
      <p>
        AI にリファクタや機能追加を任せると、<strong>関数の並び替え・命名変更・整形</strong>など、ファイル全体に及ぶ大きな差分が一度に生まれがちです。
        自分のブランチと他人のブランチ（あるいは AI が書き換える前後）で<strong>広い範囲が同時に動く</strong>ため、少しの重なりでも衝突しやすくなります。
      </p>
      <Callout variant="warn" title="AI の大規模差分に注意">
        「ファイルまるごと書き換えてもらう」のは楽ですが、他の人の変更とぶつかると<strong>コンフリクトの範囲も巨大</strong>になります。
        AI には<strong>変更を小さく・目的を1つに</strong>絞るよう指示し、こまめにコミット/プルするのが安全です。
      </Callout>

      <Section>コンフリクトの見た目 — マーカーを読む</Section>
      <p>
        コンフリクトが起きると、Git は該当箇所に<strong>3 つのマーカー</strong>を書き込みます。ファイルを開くと次のようになっています。
      </p>
      <Code lang="text" filename="conflict（コンフリクト中のファイル）">{`function greet(name) {
<<<<<<< HEAD
  return "こんにちは、" + name + "さん";       // 今の自分のブランチ側の変更
=======
  return \`Hello, \${name}!\`;                  // 取り込もうとしている側の変更
>>>>>>> feature/ai-refactor
}`}</Code>
      <KVList
        items={[
          { key: "<<<<<<< HEAD", val: "ここから下が「今いるブランチ（自分側）」の内容" },
          { key: "=======", val: "境界線。上が自分側、下が相手側" },
          { key: ">>>>>>> ブランチ名", val: "ここまでが「取り込もうとしている相手側」の内容" },
        ]}
      />
      <Callout variant="tip" title="解決とは「マーカーを消し切る」こと">
        解決作業のゴールは、<strong>3 つのマーカーをすべて取り除き</strong>、最終的に残したいコードだけにすることです。
        マーカーが 1 つでも残っていると、そのままではコードが壊れます（プログラムとして不正）。
      </Callout>

      <Section>解決の手順</Section>
      <StepFlow
        steps={[
          { title: "git status で衝突ファイルを確認", desc: "Unmerged paths に出るファイルが対象" },
          { title: "ファイルを開き、マーカーを探す", desc: "<<<<<<< / ======= / >>>>>>> の3点" },
          { title: "残す内容を決めてマーカーごと編集", desc: "自分側 / 相手側 / 両方を統合、から選ぶ" },
          { title: "git add で「解決済み」にする", desc: "Git に解決を伝える" },
          { title: "コミットして完了", desc: "merge なら git commit、rebase なら git rebase --continue" },
        ]}
        caption="コンフリクト解決の一連の流れ"
      />
      <Code lang="bash" filename="ターミナル（マージのコンフリクト）">{`# 1. どのファイルが衝突しているか確認
git status

# （ファイルをエディタで開き、マーカーを消して正しい内容に整える）

# 4. 解決したファイルをステージング
git add src/greet.js

# 5. コミットしてマージを完了
git commit          # マージ用のメッセージが自動で用意される`}</Code>
      <Figure
        src="/learn/shots/dev/resolving-merge-conflicts-01.svg"
        alt="コンフリクト発生後の git status の実行結果。Unmerged paths の下に both modified のファイルが並んでいる"
        caption="まず git status。Unmerged paths に出ているファイルが、手で直すべき対象のすべて。"
      />
      <Callout variant="info" title="rebase 中のコンフリクトは進め方が違う">
        <Cmd>git rebase</Cmd> 中に衝突したら、解決して <Cmd>git add</Cmd> したあとは <Cmd>git commit</Cmd> ではなく
        <Cmd>git rebase --continue</Cmd> で次のコミットへ進みます。複数コミットで連続して衝突することもあります。
      </Callout>

      <Section>どちらを残すか、どう判断するか</Section>
      <p>
        マーカーの間を、次のいずれかに書き換えます。<strong>「両方の意図を汲んで統合する」</strong>のが基本で、単純にどちらか一方を選ぶだけでは
        相手の変更を捨ててしまうことがあります。
      </p>
      <ul>
        <li><strong>自分側を残す</strong>：相手の変更が不要・古いとき</li>
        <li><strong>相手側を残す</strong>：相手の変更が正しく、自分側が不要なとき</li>
        <li><strong>両方を統合する</strong>：両者の意図が必要なとき（最も多い。手で組み合わせる）</li>
      </ul>
      <Callout variant="warn" title="AI が書いたコードのコンフリクトは特に「意味」を確認">
        AI の変更は見た目が整っていても、<strong>意図が自分の変更と食い違う</strong>ことがあります。マーカーを機械的に消すのではなく、
        「なぜこの変更なのか」を理解してから統合しましょう。不安なら、統合後に<strong>テストを実行</strong>して壊れていないか確認します。
      </Callout>

      <Section>やり直し・便利な道具</Section>
      <KVList
        items={[
          { key: "git merge --abort", val: "マージ中の衝突を全部なかったことにして、開始前の状態へ戻す" },
          { key: "git rebase --abort", val: "rebase 中の衝突をやめて、開始前の状態へ戻す" },
          { key: "エディタのマージツール", val: "VS Code などは自分側/相手側/両方を選べる3-wayマージUIを表示する" },
          { key: "git diff", val: "解決前後の差分を確認。取りこぼしがないか点検できる" },
          { key: "git log --oneline --graph", val: "分岐と合流を可視化して、何と何がぶつかったかを把握" },
        ]}
      />
      <Figure
        src="/learn/shots/dev/resolving-merge-conflicts-02.svg"
        alt="VS Code のマージエディタ。Current と Incoming の2ペインと、下に統合結果の Result ペインが並んでいる画面"
        caption="VS Code のマージエディタ。自分側・相手側を見比べながら、下の Result に最終形を組み立てられる。"
      />
      <p>迷ったら <Cmd>--abort</Cmd> で安全に元に戻せます。「壊したら戻せない」ものではないので、落ち着いて対処できます。</p>

      <Section>コンフリクトを減らす予防策</Section>
      <Steps>
        <Step title="こまめに最新を取り込む">
          作業前・作業中に <Cmd>git pull</Cmd>（または <Cmd>git fetch</Cmd> + <Cmd>rebase</Cmd>）して、差が開かないようにする。
        </Step>
        <Step title="小さく頻繁にコミット・PR">
          巨大な変更を一気に出すより、小さな単位で統合するほうが衝突が小さく済む。
        </Step>
        <Step title="AI には変更を小さく指示">
          「このファイル全部を書き直して」ではなく、対象と目的を絞る。整形だけの差分は分けてコミットする。
        </Step>
        <Step title="フォーマッタ・改行設定を統一">
          Prettier などの整形設定をチームで揃えると、「見た目だけの差分」による無用な衝突を防げる。
        </Step>
      </Steps>

      <Bridge course="ソフトウェア工学 / 分散システム（並行変更の統合）">
        コンフリクト解消は、講義で学ぶ<strong>バージョン管理</strong>と<strong>並行編集の競合解決</strong>そのものです。Git のマージは、
        2 つの変更と<strong>共通の祖先（base）</strong>を突き合わせる<strong>3-way マージ</strong>で行われ、base から見て「どちらがどこを変えたか」を比較します。
        両者が同じ箇所を変えたときだけ自動では決められず、人間の判断が要る——これは分散システムで学ぶ<strong>並行更新の競合</strong>と、
        「最終的な整合をどう取るか」という同じ問題です。AI による大規模な自動変更が増えるほど、この「人が意味を判断して統合する」力が重要になります。
      </Bridge>

      <Quiz
        question={<>コンフリクト中のファイルで、<Cmd>{"<<<<<<< HEAD"}</Cmd> と <Cmd>=======</Cmd> の間に書かれているのはどちら側の内容？</>}
        options={[
          <>取り込もうとしている相手側（マージ元）の内容</>,
          <>今いるブランチ（自分側）の内容</>,
          <>共通の祖先（base）の内容</>,
          <>Git が自動生成した候補</>,
        ]}
        answer={1}
        explanation={<><Cmd>{"<<<<<<< HEAD"}</Cmd> 〜 <Cmd>=======</Cmd> が<strong>自分側（今いるブランチ）</strong>、<Cmd>=======</Cmd> 〜 <Cmd>{">>>>>>> ブランチ名"}</Cmd> が<strong>相手側</strong>です。解決したらマーカーを全て消し、残したい内容だけにします。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "コンフリクトは「同じ箇所を別々に変更」して自動マージできないときに発生（merge/pull/rebase）",
          "AI のファイル丸ごとリファクタは差分が大きく衝突しやすい。変更は小さく・こまめに統合",
          "解決＝<<<<<<< / ======= / >>>>>>> の3マーカーを消し切り、残す内容に整える",
          "手順: git status → 手で編集 → git add → git commit（rebase 中は git rebase --continue）",
          "迷ったら merge --abort / rebase --abort で戻せる。統合後はテストで確認。予防はこまめな pull と小さなコミット",
        ]}
      />
    </>
  );
}

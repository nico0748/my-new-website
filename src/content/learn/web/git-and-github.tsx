import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "git-and-github",
  title: "Git と GitHub とは",
  description: "分散バージョン管理システム Git と、ホスティングサービス GitHub の違い。基本ワークフローと主要コマンドを押さえる。",
  domain: "web",
  section: "web-basics",
  order: 5,
  level: "intro",
  tags: ["Git", "GitHub", "バージョン管理"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        「Git と GitHub って同じもの？」は初学者が最初につまずくポイントです。<strong>Git は手元で動くバージョン管理ツール</strong>、<strong>GitHub はその成果を共有・協働するためのクラウドサービス</strong>。役割がはっきり分かれていると理解すれば、コマンドの意味も自然と見えてきます。
      </Lead>

      <Section>Git と GitHub は何が違うのか</Section>
      <p>
        Git は<strong>分散バージョン管理システム（VCS）</strong>で、ファイルの変更履歴をスナップショットとして記録します。GitHub は、その Git リポジトリをクラウドにホスティングし、Pull Request や Issue などの協働機能を乗せたサービスです。
      </p>
      <ComparisonTable
        headers={["観点", "Git", "GitHub"]}
        rows={[
          ["種類", "ツール（ローカル履歴管理）", "ホスティングサービス（共有・協働）"],
          ["動作場所", "自分の PC", "クラウド"],
          ["主な機能", "commit / branch / merge", "PR / Issue / Wiki / CI/CD / 権限管理"],
        ]}
      />

      <Section>Git の仕組み — 3 つの場所</Section>
      <p>
        Git では、変更は 3 つの領域を移動しながら記録されていきます。この流れを掴むと <Cmd>add</Cmd> と <Cmd>commit</Cmd> の役割の違いがはっきりします。
      </p>
      <p>
        作業ディレクトリ（編集中のファイル）<span aria-hidden="true">→</span> <Cmd>git add</Cmd> <span aria-hidden="true">→</span> ステージング（次のコミットに含める予約）<span aria-hidden="true">→</span> <Cmd>git commit</Cmd> <span aria-hidden="true">→</span> リポジトリ（<Cmd>.git</Cmd> に履歴として確定）。
      </p>
      <FlowChain
        nodes={[
          { label: "作業ツリー", sub: "編集中" },
          { label: "ステージング", sub: "git add" },
          { label: "ローカルリポ", sub: "git commit" },
          { label: "リモート", sub: "git push", variant: "alt" },
        ]}
        caption="変更が add → commit → push で流れていく"
      />
      <p>
        なぜ「ステージング」という中間段階がわざわざ挟まっているのでしょうか。設計思想は<strong>「編集した内容と、履歴に残す内容を切り離す」</strong>ことにあります。10 ファイル触っても、意味のある単位で <Cmd>git add</Cmd> して小分けにコミットできる。これが「1 コミット＝1 つの意図」を保ちやすくし、後からの読み解きやすさ（＝レビュー・原因追跡のしやすさ）につながります。
      </p>
      <Callout variant="tip" title="部分ステージングで意図を分ける">
        1 ファイルの中で「機能追加」と「typo 修正」が混ざったときは <Cmd>git add -p</Cmd>（patch モード）で行単位に分けてステージングできます。実務では「1 コミットに 2 つの話題を入れない」ためによく使います。
      </Callout>

      <Section>コミットの正体 — スナップショットとハッシュ</Section>
      <p>
        「コミット＝差分（diff）を保存している」と思われがちですが、内部的には<strong>その時点のファイルツリー全体のスナップショット</strong>を保存しています。差分は「見せるときに 2 つのスナップショットを比較して計算」しているだけです。同じ内容のファイルは中身から計算した ID（ハッシュ）が一致するため、重複は 1 つにまとめて保存されます（内容アドレス方式）。
      </p>
      <p>
        1 つ 1 つのコミットには <Cmd>SHA-1</Cmd>（40 桁の 16 進数）の ID が振られます。この ID は「コミットの中身」＝ツリー・親コミット・作者・メッセージ全部から計算されるので、履歴の 1 文字でも書き換えると ID が変わり、以降のすべてのコミット ID も連鎖的に変わります。これが Git の履歴が<strong>改ざんに気付ける</strong>理由です。
      </p>
      <Code lang="bash" filename="commit-id">{`$ git log --oneline
a1b2c3d  feat: ログイン画面を追加
9f8e7d6  fix: バリデーションの誤り
# a1b2c3d… は SHA-1 ハッシュの先頭 7 文字（省略表記）`}</Code>
      <Bridge course="データ構造とアルゴリズム / 暗号理論">
        コミット ID の <Cmd>SHA-1</Cmd> は、講義で習う<strong>ハッシュ関数</strong>そのものです。「任意長の入力 → 固定長の出力」「同じ入力なら必ず同じ出力」「1 ビット違えば全く別の値」という性質が、そのまま「内容アドレス（content-addressable）」＝<strong>中身が同じものは同じ ID</strong>という仕組みに使われています。ハッシュテーブルで学ぶ「キーから場所を引く」発想を、Git はファイル保存に応用していると考えると腑に落ちます。
      </Bridge>

      <Section>基本ワークフロー</Section>
      <Steps>
        <Step title="1. 変更を加える">ファイルを編集する。</Step>
        <Step title="2. ステージング">
          <Cmd>git add .</Cmd> で変更を次のコミット対象に加える。
        </Step>
        <Step title="3. コミット">
          <Cmd>git commit -m "メッセージ"</Cmd> で履歴に記録する。
        </Step>
        <Step title="4. プッシュ">
          <Cmd>git push origin &lt;branch&gt;</Cmd> でリモート（GitHub）に反映する。
        </Step>
        <Step title="5. プル">
          <Cmd>git pull origin &lt;branch&gt;</Cmd> で他者の変更を取り込む。
        </Step>
      </Steps>

      <Section>覚えておきたい主要コマンド</Section>
      <Code lang="bash" filename="git-commands">{`git init                        # リポジトリを新規作成
git clone [URL]                 # 既存リポジトリを複製
git status                      # 変更状況を確認
git add .                       # 全変更をステージング
git commit -am "msg"            # add + commit をまとめて
git log --oneline --graph --all # 履歴をグラフ表示
git diff                        # 差分を確認
git branch                      # ブランチ一覧
git switch -c [branch]          # ブランチ作成 + 移動
git merge [branch]              # ブランチを統合`}</Code>

      <Section>ブランチとマージ</Section>
      <p>
        ブランチを使うと、<Cmd>main</Cmd> を安定させたまま別の作業を並行して進められます。たとえば <Cmd>main</Cmd> が A <span aria-hidden="true">→</span> B <span aria-hidden="true">→</span> C と進む横で、<Cmd>feature</Cmd> ブランチで D <span aria-hidden="true">→</span> E を試作し、完成したら <Cmd>main</Cmd> にマージ（F）して取り込みます。失敗しても本流に影響しないため、安全に試行できます。
      </p>
      <p>
        実装の実体はとても軽量です。<strong>ブランチとは「あるコミットを指すポインタ（41 バイトのファイル）」にすぎません</strong>。<Cmd>git switch -c feature</Cmd> しても履歴はコピーされず、現在のコミットを指す名前が 1 つ増えるだけ。だから Git のブランチ作成は一瞬で終わります。<Cmd>HEAD</Cmd> は「いま自分がどのブランチにいるか」を指すポインタです。
      </p>

      <Section>コミット履歴は DAG（有向非巡回グラフ）</Section>
      <p>
        各コミットは<strong>「親コミット」への参照</strong>を持っています。最初のコミットだけ親がなく、通常のコミットは親 1 つ、マージコミットは親 2 つ（以上）を持ちます。この「コミットがノード・親への参照が辺」という構造は、まさに<strong>有向非巡回グラフ（DAG: Directed Acyclic Graph）</strong>です。矢印は必ず過去（親）へ向き、巡回（ループ）しません。
      </p>
      <Bridge course="離散数学 / グラフ理論">
        <Cmd>git log --graph</Cmd> で表示される履歴は、講義で扱う<strong>有向非巡回グラフ（DAG）</strong>そのものです。「マージの共通の起点（マージベース）を探す」処理は、2 つのコミットの<strong>最も近い共通祖先（LCA: Lowest Common Ancestor）</strong>を求める問題に対応します。<Cmd>git merge</Cmd> は内部でこの共通祖先を見つけ、そこからの差分を三方向で突き合わせています。トポロジカルソート・到達可能性・祖先関係といったグラフの概念が、Git の履歴操作の裏側で実際に動いていると考えると理解が深まります。
      </Bridge>
      <SubSection>マージ と リベース — グラフを「合流」させるか「並べ替える」か</SubSection>
      <p>
        枝分かれした履歴を 1 本に戻す方法は 2 つあります。グラフの形で考えると違いが明確になります。
      </p>
      <ComparisonTable
        headers={["観点", "merge", "rebase"]}
        rows={[
          ["履歴の形", "合流点（マージコミット）が残る", "一直線に付け替える"],
          ["やること", "2 つの枝の共通祖先から統合", "コミットを別の起点へ「移植」"],
          ["向いている場面", "共有ブランチ・事実を残したい", "自分専用ブランチを整えてから出す"],
          ["注意", "履歴がグラフ状に複雑化しやすい", "公開済みの履歴には使わない（ID が変わる）"],
        ]}
      />
      <Callout variant="danger" title="公開済みブランチを rebase しない">
        <Cmd>rebase</Cmd> はコミットを作り直す（＝ID が変わる）操作です。すでに <Cmd>push</Cmd> して他人が取り込んだ履歴を書き換えると、全員の履歴と食い違って大惨事になります。「自分だけが触っているブランチ」に限って使うのが鉄則です。
      </Callout>

      <Section>.gitignore で不要ファイルを除外する</Section>
      <p>
        ログや環境変数、依存ライブラリなどはバージョン管理の対象外にします。<Cmd>.gitignore</Cmd> に列挙するだけで無視されます。
      </p>
      <Code lang="gitignore" filename=".gitignore">{`*.log
.DS_Store
*.env
node_modules/`}</Code>
      <Callout variant="warn" title="すでにコミット済みのファイルは無視されない">
        <Cmd>.gitignore</Cmd> は「まだ追跡していないファイル」にしか効きません。すでにコミット済みのファイルを除外したいときは <Cmd>git rm --cached [file]</Cmd> で追跡から外します。
      </Callout>

      <Section>GitHub の主な機能</Section>
      <SubSection>コードの共有だけではない</SubSection>
      <p>
        GitHub はリポジトリのホスティングに加え、チーム開発を支える機能を備えています。
      </p>
      <ul>
        <li><strong>Repository</strong> — コードとその履歴を保管</li>
        <li><strong>Pull Request</strong> — 変更のレビューと統合の窓口</li>
        <li><strong>Issue</strong> — バグ・タスクの管理</li>
        <li><strong>Actions</strong> — CI/CD の自動化</li>
        <li><strong>Projects / Wiki</strong> — 進捗管理とドキュメント</li>
      </ul>

      <Callout variant="tip" title="困ったときのリカバリ">
        直前のコミットを取り消したいとき、変更を残すなら <Cmd>git reset --soft HEAD^</Cmd>、完全に破棄するなら <Cmd>git reset --hard HEAD^</Cmd>。作業を一時退避したいときは <Cmd>git stash</Cmd> <span aria-hidden="true">→</span> <Cmd>git stash pop</Cmd> が便利です。「操作をやりすぎて履歴が壊れた」ときは <Cmd>git reflog</Cmd> で過去の <Cmd>HEAD</Cmd> の移動履歴を辿れば、消したはずのコミットにも戻れます。
      </Callout>

      <Section>ブランチ戦略 — チームで衝突しないためのルール</Section>
      <p>
        個人開発ではブランチを自由に切って構いませんが、チーム開発では<strong>「誰がどのブランチに何を積むか」の約束（＝ブランチ戦略）</strong>を決めておかないと、マージが衝突だらけになります。これはソフトウェア工学でいう<strong>構成管理（Configuration Management）</strong>の実践そのものです。
      </p>
      <KVList
        items={[
          { key: "GitHub Flow", val: "main は常にデプロイ可能。作業は feature ブランチ → PR → main へマージ。シンプルで CI/CD 前提のチーム向け" },
          { key: "Git Flow", val: "main / develop / feature / release / hotfix を役割で分ける。リリース周期がある製品向けで重厚" },
          { key: "trunk-based", val: "小さな変更を頻繁に main へ。ブランチ寿命を短く保ち、統合の痛みを分散させる" },
        ]}
      />
      <Bridge course="ソフトウェア工学">
        バージョン管理とブランチ戦略は、講義で扱う<strong>「構成管理」「継続的インテグレーション（CI）」</strong>の中核です。「作業を小さな単位に分けて頻繁に統合する」ほど、統合時の衝突（マージコンフリクト）は小さくなる——これは「統合を遅らせるほどコストが増える」という工学的な経験則の裏返しです。PR レビューは<strong>コードレビュー</strong>、<Cmd>main</Cmd> を常に動く状態に保つ規律は<strong>品質保証</strong>の一環として、理論と実務が地続きになっています。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "Git はローカルで動くバージョン管理ツール、GitHub はそれを共有・協働するクラウドサービス",
          "変更は 作業ディレクトリ → add → ステージング → commit → リポジトリ の順に確定する",
          "コミットはスナップショット。SHA-1 ハッシュ（内容アドレス）で ID が振られ、履歴の改ざんに気付ける",
          "コミット履歴は親への参照で辺を張る DAG（有向非巡回グラフ）。マージは共通祖先（LCA）を探して統合する",
          "ブランチはコミットを指すポインタにすぎず作成が軽い。チームではブランチ戦略（構成管理）で衝突を防ぐ",
          "不要ファイルは .gitignore で除外。追跡済みは git rm --cached で外す",
        ]}
      />
    </>
  );
}

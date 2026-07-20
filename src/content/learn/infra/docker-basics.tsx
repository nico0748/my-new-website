import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "docker-basics",
  title: "Docker の基礎 — イメージ・コンテナ・ホストを掴む",
  description: "Docker / イメージ / コンテナ / ホストの4語を最初にはっきりさせ、VM との違い、namespace と cgroups による『隔離されたプロセス』の正体、公式リポジトリからのインストールまで。",
  domain: "infra",
  section: "container",
  order: 1,
  level: "intro",
  tags: ["Docker", "コンテナ", "VM", "namespace"],
  updated: "2026-07-07",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        この先で何百回も出てくる4つの言葉——<strong>Docker / イメージ / コンテナ / ホスト</strong>——をはっきりさせます。ここが曖昧だとずっと霧の中ですが、掴めばあとは全部その応用です。
      </Lead>

      <Section>4語さきどり</Section>
      <KVList
        items={[
          { key: "Docker", val: "アプリを「環境ごと箱に詰めて」どこでも同じに動かす仕組み・道具" },
          { key: "イメージ", val: "箱の設計図兼テンプレート（読み取り専用）。例: nginx, python" },
          { key: "コンテナ", val: "イメージから作って実際に動いている箱（インスタンス）" },
          { key: "ホスト", val: "コンテナを動かしている土台のマシン本体（＝あなたの VPS）" },
        ]}
      />

      <Section>Docker とは何か</Section>
      <p>
        一言でいうと、<strong>アプリ本体と、それが動くのに必要な環境（ライブラリ・設定・OS のユーザーランド）を1つの「箱」にまとめて、どのマシンでも同じように動かす仕組み</strong>です。
      </p>
      <Figure
        src="/learn/infra/docker-concept.svg"
        alt="アプリと依存一式を1つのイメージに固め、どのマシンでも同じに動かせることを示す図"
        caption="アプリと「動かすのに必要なもの一式」を1つのイメージに固める。だから『自分の PC では動くのに本番で落ちる』が消える。"
      />
      <p>
        たとえるなら引っ越し。家具を1つずつ運んで現地で組み直すと置き方が毎回ズレますが、Docker は<strong>部屋ごと箱に真空パックして運ぶ</strong>イメージ。どこで開けても中身は同じです。
      </p>

      <SubSection>イメージとコンテナ（料理でたとえる）</SubSection>
      <p>
        この2つは必ず混同します。<strong>イメージ＝レシピ</strong>（読み取り専用で何度でも使える）、<strong>コンテナ＝そのレシピで作った料理</strong>。プログラマ向けに言えば<strong>イメージ＝クラス、コンテナ＝インスタンス</strong>で、1つのイメージからコンテナは何個でも作れます。
      </p>
      <Figure
        src="/learn/infra/recipe-dish.svg"
        alt="イメージをレシピ、コンテナをそのレシピで作った料理にたとえた図"
        caption="docker run が「調理」にあたり、1つのレシピ（イメージ）から何皿でも作れる。"
      />

      <SubSection>ホストとは何か</SubSection>
      <p>
        意外と説明されない言葉が「ホスト」です。ホストとは<strong>コンテナを動かしている土台のマシン本体</strong>。この教材では、前の章で作って SSH ログインした<strong>あの VPS そのもの</strong>がホストです。あなたはローカル PC から SSH でホストに入り、ホスト上で <Cmd>docker</Cmd> コマンドを打ち、コンテナはそのホストの中で動きます。
      </p>
      <Figure
        src="/learn/infra/host-anatomy.svg"
        alt="ローカル PC から SSH でホストに入り、ホスト上で docker コマンドを打ちコンテナが動く位置関係の図"
        caption="ホスト＝コンテナを動かす土台の Linux サーバー本体。「ホスト側」「コンテナ側」という言い方が後で頻出する。"
      />

      <Section>VM とコンテナの違い</Section>
      <p>
        VM（仮想マシン）は1台のサーバーの中に仮想的なコンピュータを作り、その上に OS を丸ごと入れます。完全に分離されますが重く、起動は分単位です。コンテナは違い、<strong>ホスト OS のカーネルを共有</strong>し、その上で「隔離されたプロセス」としてアプリを動かします。ゲスト OS がないぶん軽く、起動は秒未満です。
      </p>
      <Figure
        src="/learn/infra/vm-vs-container.svg"
        alt="VM はゲスト OS を丸ごと載せ、コンテナはホスト OS のカーネルを共有することを比較した図"
        caption="VM は仮想ハードウェアの上にゲスト OS を載せる。コンテナはカーネルを共有し、ゲスト OS を持たない。"
      />
      <ComparisonTable
        headers={["観点", "仮想マシン (VM)", "コンテナ (Docker)"]}
        rows={[
          ["分離レベル", "カーネルまで完全分離", "カーネルは共有、プロセス分離"],
          ["サイズ", "数 GB（OS 込み）", "数 MB〜数百 MB"],
          ["起動速度", "分単位", "秒未満"],
          ["向いている用途", "異なる OS、強い分離", "アプリの配布・スケール"],
        ]}
      />

      <Section>コンテナは「隔離されたプロセス」</Section>
      <p>
        コンテナは魔法ではなく、ただの Linux プロセスです。それを次の2つのカーネル機能で「隔離」しているだけです。
      </p>
      <ul>
        <li><strong>namespace（名前空間）</strong>：プロセス・ネットワーク・ファイルシステムの「見え方」を分離する。コンテナ内からは自分しか見えない</li>
        <li><strong>cgroups</strong>：CPU・メモリの使用量を制限する。1つのコンテナがサーバー全体を食い潰さないようにする</li>
      </ul>
      <Callout variant="info" title="だから素のサーバーを先に学ぶ価値があった">
        「Docker は Linux のカーネル機能を抽象化しているだけ」とは、この namespace と cgroups のことです。素の Linux の上に薄く乗っている道具だと捉えると、トラブル時にも動じません。
      </Callout>

      <Section>公式リポジトリからインストールする</Section>
      <p>
        Ubuntu 標準の <Cmd>docker.io</Cmd> はバージョンが古く <Cmd>compose</Cmd> や <Cmd>buildx</Cmd> が付きません。Docker 公式の <Cmd>docker-ce</Cmd> を入れます。
      </p>
      <Code lang="bash" filename="サーバー上で実行（ubuntu ユーザー）">{`# 1. 公式 GPG 鍵を登録
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
# 2. リポジトリを追加
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# 3. インストールと動作確認
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world`}</Code>
      <Figure
        src="/learn/shots/infra/docker-basics-01.svg"
        alt="sudo docker run hello-world の実行結果。イメージの pull ログのあとに Hello from Docker! が表示されたターミナル"
        caption="Hello from Docker! が出れば導入成功。pull → create → start が実際に走ったログも同時に読める。"
      />
      <SubSection>deploy ユーザーを docker グループに入れる</SubSection>
      <Code lang="bash" filename="サーバー上で実行">{`sudo usermod -aG docker deploy   # sudo なしで docker を使えるように
exit                             # グループ変更は再ログインで反映される
# ssh my-vps-deploy で入り直すと sudo なしで docker が使える`}</Code>
      <Callout variant="danger" title="docker グループ ≒ root 権限">
        Docker デーモンは root で動いています。<Cmd>docker</Cmd> グループに入ったユーザーは、コンテナ経由でホストのファイルを root として読み書きできてしまいます（例: ホストの <Cmd>/</Cmd> をマウントしたコンテナを起動すれば実質 root）。<strong>docker グループへの追加は sudo 権限を与えるのと同じ重み</strong>です。信頼する <Cmd>deploy</Cmd> にだけ付与します。
      </Callout>

      <Divider />

      <Quiz
        question="コンテナが VM より軽く、起動が速いのはなぜ？"
        options={[
          <>ゲスト OS を持たず、ホスト OS のカーネルを共有するから</>,
          <>コンテナは常にメモリ上だけで動きディスクを使わないから</>,
          <>コンテナは1つしか起動できず競合しないから</>,
          <>Docker が専用の CPU を割り当てるから</>,
        ]}
        answer={0}
        explanation={<>コンテナは <strong>namespace</strong> と <strong>cgroups</strong> で隔離された「ただの Linux プロセス」で、ゲスト OS を持たずホストのカーネルを共有します。だから数 MB〜、起動は秒未満です。</>}
      />

      <KeyPoints
        items={[
          "Docker=道具、イメージ=設計図(読み取り専用)、コンテナ=動く実体、ホスト=土台のマシン",
          "イメージ=クラス、コンテナ=インスタンス。1イメージから何個でも作れる",
          "VM はゲスト OS を丸ごと載せ重い。コンテナはカーネル共有で軽く速い",
          "コンテナの正体は namespace(隔離)+cgroups(制限) で囲った Linux プロセス",
          "公式 docker-ce を入れ、信頼する deploy だけ docker グループへ（≒root 権限）",
        ]}
      />
    </>
  );
}

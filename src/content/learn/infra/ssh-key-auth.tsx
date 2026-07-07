import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "ssh-key-auth",
  title: "SSH 鍵認証 — サーバーへの安全な入口",
  description: "公開鍵暗号の仕組みを『錠前と鍵』で理解し、ssh-keygen で自分の鍵を作り authorized_keys に登録する。パスワード認証を使わない理由と ~/.ssh/config での省力化まで。",
  domain: "infra",
  section: "linux",
  order: 2,
  level: "basic",
  tags: ["SSH", "公開鍵暗号", "ed25519", "認証"],
  updated: "2026-07-07",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        22番ポートを開けた瞬間、世界中のボットが辞書攻撃を仕掛けてきます。パスワードはいつか突破されますが、鍵認証なら「秘密鍵ファイルを持たない限りログイン不可能」です。GitHub が 2021 年にパスワード認証を廃止したのと同じ理由です。
      </Lead>

      <Section>公開鍵暗号の仕組み — 錠前と鍵</Section>
      <p>SSH の鍵認証は「錠前と鍵」でたとえるとわかりやすいです。</p>
      <ComparisonTable
        headers={["鍵", "たとえ", "置き場所"]}
        rows={[
          ["公開鍵（.pub）", "錠前", "サーバーに置く。誰に見られても問題ない"],
          ["秘密鍵", "鍵", "自分の手元だけに保管。これがないとログインできない"],
        ]}
      />
      <p>
        サーバーに錠前を設置し、手元の鍵で開ける。鍵を持たない人は絶対に入れません。サーバー側で「ログインを許可する公開鍵の一覧」を持つファイルが <Cmd>~/.ssh/authorized_keys</Cmd> です。1行が1つの鍵で、ここに載っている鍵の持ち主だけが入れる<strong>ホワイトリスト</strong>です。
      </p>

      <Section>Oracle が作った鍵で初回ログイン</Section>
      <p>
        まずはインスタンス作成時にダウンロードした秘密鍵でログインします。SSH は鍵ファイルのパーミッションを厳密にチェックするので、<Cmd>chmod 600</Cmd> を忘れると拒否されます。
      </p>
      <Code lang="bash" filename="ローカル PC で実行">{`# ダウンロードした秘密鍵を ~/.ssh/ に移動
mv ~/Downloads/ssh-key-*.key ~/.ssh/oracle-vps-tmp.key
# パーミッションを設定（これをしないと SSH が拒否する）
chmod 600 ~/.ssh/oracle-vps-tmp.key
# ubuntu ユーザーでログイン
ssh -i ~/.ssh/oracle-vps-tmp.key ubuntu@<パブリックIP>`}</Code>
      <p>
        初回接続で「このサーバーを信頼しますか？」というフィンガープリント確認が出ます。これは中間者攻撃（MITM）を防ぐ仕組みで、<Cmd>yes</Cmd> と答えます。
      </p>

      <Section>自分の ed25519 鍵を作る</Section>
      <p>
        Oracle が作った鍵は RSA 形式で名前もわかりにくいので、自分専用の <Cmd>ed25519</Cmd> 鍵を作ります。実務では自分で鍵を管理するのが基本です。<strong>ローカル PC</strong>で実行します。
      </p>
      <Code lang="bash" filename="ローカル PC で実行">{`ssh-keygen -t ed25519 -f ~/.ssh/my-vps-key -C "your-email@example.com"
# -t ed25519 : RSA より短い鍵長で同等以上の強度
# -f         : ファイル名。用途がわかる名前をつける
# -C         : コメント（メールアドレスが慣例）
# → my-vps-key（秘密鍵）と my-vps-key.pub（公開鍵）の2つが生成される`}</Code>
      <Callout variant="tip" title="鍵には用途がわかる名前を">
        デフォルトの <Cmd>id_ed25519</Cmd> のままだと、サーバーが増えたとき混乱します。<Cmd>my-vps-key</Cmd>（学習用）、<Cmd>prod-sakura</Cmd>（本番）、<Cmd>github-deploy</Cmd>（CI 用）のように用途で名付けましょう。
      </Callout>

      <SubSection>ed25519 vs RSA</SubSection>
      <ComparisonTable
        headers={["観点", "ed25519", "RSA"]}
        rows={[
          ["鍵長", "256 bit", "2048〜4096 bit"],
          ["速度", "高速", "比較的遅い"],
          ["互換性", "OpenSSH 6.5 以降", "ほぼ全環境"],
        ]}
      />
      <p>古いシステムに繋ぐ必要がなければ <strong>ed25519 一択</strong>です。GitHub も ed25519 を推奨しています。</p>

      <Section>公開鍵をサーバーに登録する</Section>
      <p>
        <Cmd>cat ~/.ssh/my-vps-key.pub</Cmd> で表示された <Cmd>ssh-ed25519 AAAA...</Cmd> の1行をコピーし、サーバー側の <Cmd>authorized_keys</Cmd> に<strong>追記</strong>します。
      </p>
      <Code lang="bash" filename="サーバー上で実行">{`# authorized_keys に公開鍵を追記（>> は追記）
echo "ssh-ed25519 AAAA...（コピーした公開鍵）" >> ~/.ssh/authorized_keys
# 登録されたか確認（Oracle の鍵 + 自分の鍵で2行になる）
cat ~/.ssh/authorized_keys`}</Code>
      <Callout variant="danger" title="> と >> を間違えない">
        <Cmd>&gt;&gt;</Cmd> は追記、<Cmd>&gt;</Cmd> は上書き（中身を全消しして書き直す）です。<Cmd>authorized_keys</Cmd> に <Cmd>&gt;</Cmd> を使うと既存の鍵が消えてログインできなくなります。必ず <Cmd>&gt;&gt;</Cmd> を使ってください。
      </Callout>

      <Section>~/.ssh/config で省力化する</Section>
      <p>
        毎回 IP と鍵パスを打つのは面倒です。ローカル PC の <Cmd>~/.ssh/config</Cmd> にエイリアスを書けば、<Cmd>ssh my-vps</Cmd> だけで入れます。
      </p>
      <Code lang="bash" filename="~/.ssh/config">{`Host my-vps
    HostName <パブリックIP>
    User ubuntu
    IdentityFile ~/.ssh/my-vps-key`}</Code>

      <Section>パスワード認証が無効か確認する</Section>
      <Code lang="bash" filename="サーバー上で実行">{`# 実際に効いている SSH 設定を確認（複数ファイルを統合して表示）
sudo sshd -T | grep passwordauthentication
# => passwordauthentication no  と出れば OK`}</Code>
      <Callout variant="info" title="なぜ sshd -T なのか">
        Ubuntu 24.04 では SSH 設定が <Cmd>/etc/ssh/sshd_config.d/</Cmd> 配下の複数ファイルに分散しています。<Cmd>sshd -T</Cmd> はそれらを統合した「実際に効いている設定」を表示するので、単純な <Cmd>grep sshd_config</Cmd> より確実です。Oracle Cloud の Ubuntu イメージはデフォルトでパスワード認証が無効です。
      </Callout>

      <Divider />

      <Quiz
        question="新しく作った ed25519 鍵をサーバーに登録するとき、authorized_keys への書き込みとして正しいのはどれ？"
        options={[
          <>公開鍵を <Cmd>&gt;&gt;</Cmd> で追記する</>,
          <>秘密鍵を <Cmd>&gt;</Cmd> で上書きする</>,
          <>秘密鍵を <Cmd>&gt;&gt;</Cmd> で追記する</>,
          <>公開鍵を <Cmd>&gt;</Cmd> で上書きする</>,
        ]}
        answer={0}
        explanation={<>サーバーに置くのは<strong>公開鍵</strong>（錠前）。既存の鍵を消さないよう <Cmd>&gt;&gt;</Cmd>（追記）を使います。秘密鍵は絶対にサーバーへ送りません。</>}
      />

      <KeyPoints
        items={[
          "公開鍵＝錠前（サーバーに置く）、秘密鍵＝鍵（手元だけ）",
          "authorized_keys はログイン許可鍵のホワイトリスト。1行=1鍵",
          "自分の鍵は ed25519 で作る（短く速く安全）。用途がわかる名前を付ける",
          "登録は必ず >>（追記）。> で上書きすると既存の鍵が消える",
          "~/.ssh/config でエイリアス化、sshd -T でパスワード認証が無効か確認",
        ]}
      />
    </>
  );
}

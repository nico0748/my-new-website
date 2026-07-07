import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "user-management-sudo",
  title: "ユーザー管理と sudo — root を直接使わない理由",
  description: "root を避け最小権限で運用する考え方。デプロイ専用ユーザーの作成、.ssh 手動セットアップ、NOPASSWD sudoers、そして Docker で効いてくる UID/GID の基礎まで。",
  domain: "infra",
  section: "linux",
  order: 3,
  level: "basic",
  tags: ["ユーザー管理", "sudo", "最小権限", "UID"],
  updated: "2026-07-07",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        Linux のユーザーモデルは、アプリのロールベースアクセス制御（RBAC）と同じ発想が OS レベルにあるものです。核心は<strong>最小権限の原則</strong>——各ユーザーに必要最小限の権限だけを与えます。
      </Lead>

      <Section>root を直接使わない理由</Section>
      <p>
        <Cmd>root</Cmd>（UID 0）はすべてを読み書き・停止・変更できるスーパーユーザーです。だからこそ直接は使いません。
      </p>
      <ul>
        <li><strong>事故防止</strong>：<Cmd>rm -rf /</Cmd> のような操作を1ステップで実行できてしまう</li>
        <li><strong>監査</strong>：全員が root だと「誰がやったか」を追跡できない</li>
        <li><strong>攻撃対象の縮小</strong>：root の SSH ログインを禁止すれば、攻撃者は root を直接狙えない</li>
      </ul>

      <SubSection>sudo は「一時的に root」</SubSection>
      <Code lang="bash" filename="サーバー上で実行">{`whoami          # => ubuntu（普段は一般ユーザー）
sudo whoami     # => root（sudo を付けた1コマンドだけ root 権限）
groups          # => ubuntu adm ... sudo（sudo グループに属していれば使える）`}</Code>

      <Section>デプロイ専用ユーザーを作る</Section>
      <p>
        CI/CD（GitHub Actions）からデプロイするとき、人間用の <Cmd>ubuntu</Cmd> をそのまま使わず、専用の <Cmd>deploy</Cmd> ユーザーを作ります。鍵が漏れても被害を分離できるからです。
      </p>
      <Code lang="bash" filename="サーバー上で実行">{`sudo adduser deploy            # パスワードやフルネームを聞かれる
sudo usermod -aG sudo deploy   # sudo グループに追加`}</Code>
      <Callout variant="info" title="なぜ専用ユーザーか（最小権限）">
        <Cmd>ubuntu</Cmd> は人間のメンテ用、<Cmd>deploy</Cmd> は CI/CD 専用、と役割を分けます。<Cmd>deploy</Cmd> の鍵が漏洩しても <Cmd>ubuntu</Cmd> の鍵は無事で、被害を最小限に抑えられます。鍵のローテーションも独立してできます。
      </Callout>

      <Section>新規ユーザーの .ssh を手動で整える</Section>
      <p>
        <Cmd>ubuntu</Cmd> は Oracle が <Cmd>.ssh/</Cmd> を用意済みでしたが、新しいユーザーはゼロからです。ディレクトリ作成 → 鍵登録 → パーミッション → 所有者、を手動で行います。
      </p>
      <Code lang="bash" filename="サーバー上で実行（ubuntu ユーザーで）">{`# 1. .ssh ディレクトリを作成
sudo mkdir -p /home/deploy/.ssh
# 2. 公開鍵を登録（ローカルの my-vps-key.pub の中身を貼る）
echo "ssh-ed25519 AAAA...（公開鍵）" | sudo tee /home/deploy/.ssh/authorized_keys
# 3. パーミッションを設定
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
# 4. 所有者を deploy に変更（忘れると SSH が拒否する）
sudo chown -R deploy:deploy /home/deploy/.ssh`}</Code>
      <Callout variant="danger" title="パーミッションと所有者の両方が必要">
        SSH は厳密にチェックします。<Cmd>.ssh</Cmd> が <Cmd>700</Cmd> でない・<Cmd>authorized_keys</Cmd> が <Cmd>600</Cmd> でない・所有者が <Cmd>deploy</Cmd> でない（root のまま）——どれか1つでも間違うとログインが拒否されます。
      </Callout>

      <Section>パスワードなし sudo（sudoers）</Section>
      <p>
        CI/CD から <Cmd>deploy</Cmd> で SSH して <Cmd>docker compose up</Cmd> を実行するとき、対話的なパスワード入力はできません。そこで NOPASSWD を設定します。設定は<strong>メインファイルを直接編集せず</strong>、<Cmd>/etc/sudoers.d/</Cmd> に個別ファイルを置きます。
      </p>
      <Code lang="bash" filename="サーバー上で実行">{`# NOPASSWD を許可するファイルを作成
echo "deploy ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/deploy
# sudoers ファイルの慣例パーミッション
sudo chmod 440 /etc/sudoers.d/deploy`}</Code>
      <Callout variant="tip" title="Linux の .d/ パターン">
        メインファイル（<Cmd>/etc/sudoers</Cmd>）を直接いじる代わりに、<Cmd>xxx.d/</Cmd> ディレクトリへ個別ファイルを置く方式が Linux では広く使われます（SSH の <Cmd>sshd_config.d/</Cmd>、apt の <Cmd>sources.list.d/</Cmd> も同じ）。OS アップデートでメインファイルが上書きされても、自分の設定は消えません。
      </Callout>
      <p>
        <Cmd>deploy ALL=(ALL) NOPASSWD:ALL</Cmd> は「deploy が / どのホストでも / どのユーザーとしても / パスワードなしで全コマンド実行可」の意味です。実務ではセキュリティのため <Cmd>NOPASSWD:/usr/bin/docker</Cmd> のように特定コマンドだけ許可することもあります。
      </p>

      <Section>UID / GID — Docker で効いてくる伏線</Section>
      <p>
        Linux のユーザーは内部的には<strong>番号（UID）</strong>で管理されています。
      </p>
      <Code lang="bash" filename="サーバー上で実行">{`id ubuntu   # => uid=1000(ubuntu) gid=1000(ubuntu) ...
id deploy   # => uid=1001(deploy) gid=1001(deploy) ...`}</Code>
      <Callout variant="info" title="なぜ UID が重要か">
        Docker コンテナ内のファイル権限は名前ではなく <strong>UID</strong> で管理されます。コンテナ内で UID 1001 で動くプロセスは、ホスト側 UID 1001（＝<Cmd>deploy</Cmd>）のファイルにアクセスできます。この <Cmd>ubuntu=1000 / deploy=1001</Cmd> という並びは、コンテナのコンテンツ（非 root 化・bind mount の権限）で回収される伏線です。
      </Callout>

      <SubSection>サービスアカウント</SubSection>
      <p>
        人間がログインしない、プロセス実行専用のユーザーもあります。<Cmd>www-data</Cmd>（Web サーバー用）や <Cmd>nobody</Cmd>（最小権限プロセス用）はログインシェルが <Cmd>/usr/sbin/nologin</Cmd> で、SSH ログインできません。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "root は直接使わず sudo で一時的に。最小権限の原則が土台",
          "人間用(ubuntu)と CI/CD 用(deploy)でユーザーを分け、被害を分離する",
          "新規ユーザーの .ssh は 作成→登録→chmod(700/600)→chown を手動で",
          "sudoers は .d/ パターンで個別ファイル。CI 用に NOPASSWD を設定",
          "ユーザーは内部的に UID で管理。Docker のファイル権限もこの UID で効く",
        ]}
      />
    </>
  );
}

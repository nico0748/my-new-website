import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "systemd-process",
  title: "systemd とプロセス管理 — サーバーで何が動いているか",
  description: "OS 起動時にサービスを立ち上げる systemd の使い方、ss でリッスンポートを見る方法、journalctl と auth.log で実際に来ている攻撃を確認するところまで。",
  domain: "infra",
  section: "linux",
  order: 5,
  level: "basic",
  tags: ["systemd", "プロセス", "ログ", "journalctl"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        <Cmd>npm run dev</Cmd> を手で叩くのと、systemd でデーモン化するのは違います。サーバーは再起動後も自動でサービスが立ち上がる必要があります。それを担うのが systemd です。
      </Lead>

      <Section>systemd — Linux の init システム</Section>
      <p>systemd は OS 起動時にサービスを管理する仕組みです。サービスの状態確認・操作はすべて <Cmd>systemctl</Cmd> で行います。</p>
      <Code lang="bash" filename="サーバー上で実行">{`systemctl status sshd                                   # SSH デーモンの状態
systemctl list-units --type=service --state=running    # 動いているサービス一覧
# サービスの操作
systemctl start / stop / restart <service>   # 起動 / 停止 / 再起動
systemctl enable  <service>                   # OS 起動時に自動起動
systemctl disable <service>                   # 自動起動を無効化`}</Code>

      <Section>プロセスとポートを見る</Section>
      <Code lang="bash" filename="サーバー上で実行">{`ps aux --sort=-%mem | head -10   # メモリ使用量順に上位10
htop                             # インタラクティブなモニター（q で終了）
ss -tlnp                         # どのプロセスがどのポートで待ち受けているか`}</Code>
      <Callout variant="info" title="ss -tlnp はサーバー版の lsof -i">
        <Cmd>ss -tlnp</Cmd> は「どのプロセスが、どのポートでリッスンしているか」を表示します。開発で <Cmd>lsof -i :3000</Cmd> で dev サーバーを探すのと同じで、サーバーでは<strong>予期しないポートが開いていないか</strong>を確認するために使います。
      </Callout>

      <Section>ログを見る — journalctl</Section>
      <Code lang="bash" filename="サーバー上で実行">{`journalctl -u sshd --since "1 hour ago"   # SSH の過去1時間のログ
journalctl -f                             # リアルタイム追尾（tail -f 相当）`}</Code>

      <Section>実際に来ている攻撃を見る</Section>
      <p>
        SSH ポートを開けた瞬間から、世界中のボットが攻撃を仕掛けてきます。認証ログ <Cmd>/var/log/auth.log</Cmd> で実際に確認できます。
      </p>
      <Code lang="bash" filename="サーバー上で実行">{`# ログイン失敗の試行
sudo grep "Failed password" /var/log/auth.log | tail -20
# 存在しないユーザー名でのログイン試行
sudo grep "Invalid user"   /var/log/auth.log | tail -20
# 攻撃の総件数を数える
sudo grep "Failed\\|Invalid" /var/log/auth.log | wc -l`}</Code>
      <Callout variant="tip" title="鍵認証の判断が正しかったと実感できる">
        鍵認証にしているので、これらの攻撃は<strong>すべて失敗</strong>しています。VPS を立てて数時間〜1日経つと、驚くほどの攻撃試行が記録されているはずです。次の記事の fail2ban で、これらを自動ブロックします。
      </Callout>

      <Section>systemd でアプリを動かす vs Docker</Section>
      <p>
        素のサーバーでは <Cmd>.service</Cmd> ファイルを書いてアプリをデーモン化します。ただし Docker を使うと <Cmd>restart: unless-stopped</Cmd> で同じ「再起動後も自動で立つ」が実現でき、さらに<strong>環境の再現性</strong>も得られます。この「サービス管理の簡略化」が、後の章で Docker に移行する理由のひとつです。
      </p>
      <Callout variant="info" title="RHEL 系のログの場所">
        systemctl のコマンドはディストロ共通ですが、認証ログの場所が異なります。Debian 系は <Cmd>/var/log/auth.log</Cmd>、RHEL 系は <Cmd>/var/log/secure</Cmd> です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "systemd(systemctl) がサービスを管理。enable で再起動後も自動起動",
          "ps / htop でプロセス、ss -tlnp でリッスンポートを確認する",
          "journalctl でサービスログを追う（-f でリアルタイム）",
          "auth.log を見ると実際の攻撃試行が確認でき、鍵認証の価値がわかる",
          "Docker の restart ポリシーは systemd のデーモン化を簡略化したもの",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KVList, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "fail2ban",
  title: "fail2ban — ログ監視で攻撃を自動ブロックする",
  description: "auth.log を監視し、失敗が続く IP を iptables で自動 BAN する仕組み。jail.conf を直接いじらず jail.local で上書きする .local パターンと、鍵認証でも導入する理由。",
  domain: "infra",
  section: "network",
  order: 2,
  level: "basic",
  tags: ["fail2ban", "侵入検知", "セキュリティ", "ログ"],
  updated: "2026-07-07",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        認証ログを見ると、鍵認証で破られはしないものの、大量の攻撃試行でログが汚れリソースも消費されています。fail2ban は、こうした攻撃を<strong>自動でブロック</strong>してくれます。
      </Lead>

      <Section>fail2ban の仕組み</Section>
      <p>
        fail2ban はログファイルを監視し、パターンにマッチする行が一定回数出現したら、<Cmd>iptables</Cmd> にブロックルールを自動追加します。いわば「ログベースの侵入検知システム」です。
      </p>
      <Code lang="bash" filename="サーバー上で実行">{`sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban`}</Code>

      <Section>jail は jail.local で設定する</Section>
      <p>
        fail2ban の設定ディレクトリは <Cmd>/etc/fail2ban/</Cmd>。デフォルト設定は <Cmd>jail.conf</Cmd> にありますが、<strong>これは直接編集しません</strong>。アップデートで上書きされてしまうからです。代わりに <Cmd>jail.local</Cmd> を作ると、同じ項目を上書きできます。
      </p>
      <Callout variant="tip" title=".conf vs .local パターン">
        fail2ban は設定を2段階で読みます：<Cmd>jail.conf</Cmd>（デフォルト）→ <Cmd>jail.local</Cmd>（カスタム上書き）。<Cmd>.local</Cmd> に書いた設定が優先されます。ユーザー管理で学んだ <Cmd>.d/</Cmd> パターンと同じ「デフォルトと自分の設定を分離する」発想です。
      </Callout>
      <Code lang="ini" filename="/etc/fail2ban/jail.local">{`[sshd]
enabled   = true
port      = ssh
filter    = sshd
logpath   = /var/log/auth.log
maxretry  = 3
bantime   = 3600
findtime  = 600`}</Code>
      <KVList
        items={[
          { key: <Cmd>maxretry = 3</Cmd>, val: "3回失敗したら BAN する" },
          { key: <Cmd>bantime = 3600</Cmd>, val: "BAN 期間は 3600 秒（1時間）" },
          { key: <Cmd>findtime = 600</Cmd>, val: "600 秒（10分）以内の失敗を数える" },
        ]}
      />
      <Code lang="bash" filename="サーバー上で実行">{`sudo systemctl restart fail2ban       # 設定を反映
sudo fail2ban-client status           # 有効な jail 一覧
sudo fail2ban-client status sshd      # BAN 中の IP を確認
# sudo fail2ban-client set sshd unbanip <IP>   # 手動で解除`}</Code>

      <Section>鍵認証でも fail2ban を入れる理由</Section>
      <p>鍵認証ならパスワード突破はされません。それでも導入する価値があります。</p>
      <ul>
        <li><strong>ログノイズの削減</strong>：攻撃ログが減り、本当に重要なログが見やすくなる</li>
        <li><strong>リソース節約</strong>：大量の SSH 接続試行は CPU を消費する</li>
        <li><strong>将来の拡張基盤</strong>：nginx の rate limit 違反を fail2ban でブロックするなど、HTTP レイヤーにも応用できる</li>
      </ul>
      <Callout variant="info" title="RHEL 系での違い">
        fail2ban 自体は共通ですが、<Cmd>logpath</Cmd> を変える必要があります。RHEL 系は <Cmd>/var/log/secure</Cmd>（Debian 系の <Cmd>/var/log/auth.log</Cmd> に相当）です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "fail2ban はログ監視型の侵入検知。失敗が続く IP を iptables で自動 BAN",
          "設定は jail.conf を直接いじらず jail.local で上書き（.local パターン）",
          "maxretry / findtime / bantime で BAN 条件と期間を決める",
          "鍵認証でもログノイズ削減・リソース節約・将来拡張のため入れる価値がある",
        ]}
      />
    </>
  );
}

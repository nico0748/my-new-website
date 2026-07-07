import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "firewall-ufw",
  title: "ファイアウォール — UFW でサーバーの入口を絞る",
  description: "ポートで通信を制御する考え方、クラウド FW / OS FW / アプリの3層防御、iptables の裏側と UFW の使い方。さらに Docker が UFW を素通りする有名な罠と対策まで。",
  domain: "infra",
  section: "network",
  order: 1,
  level: "basic",
  tags: ["ファイアウォール", "UFW", "iptables", "多層防御"],
  updated: "2026-07-07",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        Express や Echo のミドルウェアでリクエストをフィルタするのと同じことを、OS レベルで IP アドレスとポート番号を使って行うのがファイアウォールです。原則はシンプル——「外部からの 80/443 だけを許可し、それ以外はすべて拒否する」。
      </Lead>

      <Section>ポートの考え方</Section>
      <p>
        開発で使う <Cmd>localhost:3000</Cmd> の発想を、サーバー全体に広げます。データベース（5432）や Redis（6379）のポートを外部に開ける必要はありません。これらは<strong>同じサーバー内のアプリからだけ</strong>アクセスできれば十分です。外に見せるべきポートだけを開ける、が鉄則です。
      </p>

      <Section>3層防御（Defense in Depth）</Section>
      <p>
        通信が届くには、<strong>すべてのレイヤーで許可</strong>されている必要があります（AND 条件）。片方だけでは守り切れません。
      </p>
      <ComparisonTable
        headers={["レイヤー", "実体", "役割"]}
        rows={[
          ["Layer 1", "Oracle Cloud セキュリティリスト", "クラウド側のファイアウォール"],
          ["Layer 2", "UFW / iptables", "OS 側のファイアウォール"],
          ["Layer 3", "アプリケーション", "ポートをリッスンするプロセス"],
        ]}
      />
      <Callout variant="info" title="なぜ二重管理するのか">
        クラウド FW だけだと、VPN や踏み台経由の内部攻撃を防げません。OS FW だけだと、クラウド側の設定ミスでポートが開いてしまいます。<strong>両方設定するのがベストプラクティス</strong>です。この冗長さが、後述の Docker の罠でも効いてきます。
      </Callout>

      <Section>iptables — UFW の裏側</Section>
      <p>
        UFW を使う前に、その裏にある <Cmd>iptables</Cmd> を少しだけ理解します。iptables には3つのチェーンがあります。
      </p>
      <ul>
        <li><Cmd>INPUT</Cmd> — 外部 → サーバーへの通信</li>
        <li><Cmd>OUTPUT</Cmd> — サーバー → 外部への通信</li>
        <li><Cmd>FORWARD</Cmd> — サーバーを通過する通信（Docker のコンテナ間通信で使われる）</li>
      </ul>
      <p>
        iptables を直接書くと数百行になります。そこで <strong>UFW（Uncomplicated Firewall）</strong>という使いやすいフロントエンドを使います。
      </p>

      <Section>UFW の設定</Section>
      <Callout variant="danger" title="enable の前に必ず allow ssh">
        <Cmd>ufw enable</Cmd> の前に必ず <Cmd>ufw allow ssh</Cmd> を実行してください。忘れると SSH が切断され、サーバーにログインできなくなります。万一ロックアウトされたら、Oracle Cloud コンソールの「シリアルコンソール」から復旧できます。
      </Callout>
      <Code lang="bash" filename="サーバー上で実行">{`sudo ufw status                  # => inactive
# デフォルトポリシー
sudo ufw default deny incoming   # 受信はすべて拒否
sudo ufw default allow outgoing  # 送信はすべて許可
# 必要なポートだけ許可
sudo ufw allow ssh               # = 22/tcp
sudo ufw allow 80/tcp            # HTTP
sudo ufw allow 443/tcp           # HTTPS
# 有効化（SSH を許可済みなので切断されない）
sudo ufw enable
sudo ufw status verbose`}</Code>
      <Callout variant="info" title="RHEL 系は firewalld">
        UFW は Debian 系専用です。RHEL 系ではゾーンベースの <Cmd>firewalld</Cmd> を使います（<Cmd>firewall-cmd --add-service=http</Cmd> のように）。
      </Callout>

      <Section>Docker が UFW を素通りする罠</Section>
      <p>
        ここは Docker 初学者が必ず引っかかるポイントです。UFW で「80/443 以外は拒否」にしても、<strong>Docker の <Cmd>-p 8080:80</Cmd> は UFW を無視してポートを外部公開してしまいます</strong>。
      </p>
      <Figure
        src="/learn/infra/docker-vs-ufw.svg"
        alt="Docker の -p が iptables を直書きして UFW を回避する一方、クラウド側 FW は別経路なので有効であることを示す図"
        caption="Docker は iptables を直接書き換え、UFW のルールより前に挿入する。だから -p で公開したポートは UFW の deny を素通りする。"
      />
      <p>
        理由は iptables です。Docker はコンテナ公開のために iptables を<strong>直接書き換え</strong>、UFW のルールより前に挿入します。結果、<Cmd>ufw deny</Cmd> していても <Cmd>-p</Cmd> で公開したポートは外から見えてしまいます。
      </p>
      <SubSection>対策</SubSection>
      <ul>
        <li><strong>ループバックに bind</strong>：<Cmd>-p 127.0.0.1:8080:80</Cmd> と書く。外部に出さず、後段の nginx からだけ繋ぐ。最も安全で推奨</li>
        <li><strong>クラウド側 FW で止める</strong>：セキュリティリスト（Layer 1）は Docker の iptables 改変の影響を受けないので有効。だから二重防御に意味がある</li>
        <li><strong>ufw-docker</strong> などのツールで UFW と Docker を統合する</li>
      </ul>
      <Callout variant="tip" title="「UFW を入れたから安全」という思い込みを崩す">
        この罠は、クラウド FW と OS FW を両方設定しておくことの価値を教えてくれます。Layer 1（クラウド側）が最後の砦になります。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "外に出すポートは最小限（80/443 等）。DB・Redis は外に開けない",
          "クラウド FW / OS FW / アプリの3層。すべてで許可されて初めて通信が届く",
          "UFW は iptables の使いやすいフロントエンド。enable 前に必ず allow ssh",
          "Docker の -p は iptables を直書きして UFW を素通りする",
          "対策は -p 127.0.0.1:... で bind、またはクラウド側 FW で止める",
        ]}
      />
    </>
  );
}

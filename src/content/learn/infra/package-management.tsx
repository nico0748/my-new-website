import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "package-management",
  title: "パッケージ管理 — apt でソフトを入れる・更新する",
  description: "npm や pip の OS 版が apt。update と upgrade の違い、リポジトリの概念、自動セキュリティ更新、サーバー初期セットアップに入れる定番パッケージまでを押さえる。",
  domain: "infra",
  section: "linux",
  order: 4,
  level: "intro",
  tags: ["apt", "パッケージ管理", "リポジトリ", "Ubuntu"],
  updated: "2026-07-07",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        <Cmd>apt</Cmd> は <Cmd>npm</Cmd> や <Cmd>pip</Cmd> の OS 版です。依存関係を解決してバイナリをインストールします。サーバー運用の最初の一歩は「システムを最新にして、必要な道具を揃える」ことです。
      </Lead>

      <Section>apt の基本操作</Section>
      <Code lang="bash" filename="サーバー上で実行">{`sudo apt update             # パッケージリストを更新（何が入るか調べる）
sudo apt upgrade -y         # インストール済みを更新
sudo apt install -y curl git htop tree jq   # インストール
sudo apt remove <package>   # 削除
sudo apt autoremove         # 不要な依存を掃除（npm prune 相当）`}</Code>
      <Callout variant="warn" title="update と upgrade は別物">
        <Cmd>apt update</Cmd> はパッケージの<strong>リスト</strong>を最新にするだけ（何がインストール可能か調べる）。実際にソフトを<strong>更新</strong>するのは <Cmd>apt upgrade</Cmd> です。新しいソフトを入れる前に <Cmd>update</Cmd> を打つ、と覚えておきましょう。
      </Callout>

      <Section>リポジトリの概念</Section>
      <p>
        パッケージは<strong>リポジトリ（倉庫）</strong>から取得します。npm registry がパッケージの倉庫であるように、Ubuntu にも倉庫があります。現在の設定は <Cmd>cat /etc/apt/sources.list.d/ubuntu.sources</Cmd> で確認できます。Docker を入れるときは Docker 公式リポジトリを追加します——npm で <Cmd>@scope</Cmd> 付きの private registry を足すのと似た概念です。
      </p>

      <Section>セキュリティアップデートの自動化</Section>
      <Code lang="bash" filename="サーバー上で実行">{`sudo apt list --upgradable                    # 更新可能なパッケージを確認
sudo apt install -y unattended-upgrades       # 自動セキュリティ更新
sudo dpkg-reconfigure -plow unattended-upgrades`}</Code>
      <Callout variant="info" title="自動更新はどこまでやるか">
        セキュリティパッチの自動適用は安全性を高めますが、稀に互換性問題を起こします。落としどころは<strong>セキュリティ更新のみ自動・それ以外は手動</strong>。<Cmd>unattended-upgrades</Cmd> のデフォルトがまさにこれです。
      </Callout>

      <Section>サーバー初期セットアップの定番パッケージ</Section>
      <Code lang="bash" filename="サーバー上で実行">{`sudo apt install -y \\
  curl wget git \\
  htop tree jq \\
  fail2ban ufw \\
  ca-certificates gnupg lsb-release \\
  unattended-upgrades`}</Code>
      <KVList
        items={[
          { key: <Cmd>curl / wget</Cmd>, val: "HTTP リクエスト / ファイルダウンロード" },
          { key: <Cmd>htop</Cmd>, val: "インタラクティブなプロセスモニター（top の高機能版）" },
          { key: <Cmd>tree</Cmd>, val: "ディレクトリ構造をツリー表示" },
          { key: <Cmd>jq</Cmd>, val: "JSON をコマンドラインで整形・加工" },
          { key: <Cmd>fail2ban</Cmd>, val: "ブルートフォース攻撃の自動ブロック" },
          { key: <Cmd>ufw</Cmd>, val: "ファイアウォール管理ツール" },
          { key: <Cmd>ca-certificates / gnupg</Cmd>, val: "HTTPS 通信と GPG 署名の検証に必要" },
        ]}
      />

      <Section>RHEL 系（dnf）との対応</Section>
      <ComparisonTable
        headers={["操作", "Ubuntu (apt)", "RHEL 系 (dnf)"]}
        rows={[
          ["リスト更新", "apt update", "dnf check-update"],
          ["アップグレード", "apt upgrade -y", "dnf upgrade -y"],
          ["インストール", "apt install -y pkg", "dnf install -y pkg"],
          ["検索", "apt search pkg", "dnf search pkg"],
          ["自動更新", "unattended-upgrades", "dnf-automatic"],
        ]}
      />

      <Divider />

      <Callout variant="tip" title="ついでにタイムゾーンを JST へ">
        サーバーのデフォルトは UTC です。ログの時刻が日本時間でないと読みにくいので、早めに <Cmd>sudo timedatectl set-timezone Asia/Tokyo</Cmd> を実行しておきましょう。
      </Callout>

      <KeyPoints
        items={[
          "apt は OS のパッケージマネージャ（npm/pip の OS 版）",
          "update=リスト更新、upgrade=実体の更新。順番に注意",
          "パッケージはリポジトリ（倉庫）から。Docker は公式リポジトリを追加する",
          "unattended-upgrades でセキュリティ更新を自動化",
          "初期セットアップで curl/git/htop/jq/fail2ban/ufw などを一括で入れる",
        ]}
      />
    </>
  );
}

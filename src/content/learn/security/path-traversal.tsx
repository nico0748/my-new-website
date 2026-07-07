import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "path-traversal",
  title: "パストラバーサル — 境界の外へ遡る",
  description: "ファイルパスに ../ 等を注入し公開領域の外のファイルを読み書きする脆弱性。エンコード回避の危うさ、正規化して基準ディレクトリ内かを検証する対策、Zip Slip までを理解する。",
  domain: "security",
  section: "web-sec",
  order: 7,
  level: "basic",
  tags: ["パストラバーサル", "ファイル", "正規化", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>パストラバーサル（ディレクトリトラバーサル）</strong>は、アプリがファイルパスの組み立てに信頼できない入力を使い、かつ正規化と境界チェックを怠ることで、攻撃者が <Cmd>../</Cmd>（親ディレクトリ参照）などを注入して、本来アクセスできる領域の<strong>外にあるファイルを読み書きできてしまう</strong>脆弱性です。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。動作する境界突破ペイロード列は掲載しません。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>なぜ起きるのか — パスを連結して遡られる</Section>
      <p>
        ファイルのダウンロード・アップロード・テンプレート読み込みなどで、<Cmd>base_dir + user_input</Cmd> のように<strong>基準ディレクトリと入力を連結</strong>してパスを組み立てる設計が温床です。入力に <Cmd>../../../</Cmd> のような相対パス要素が含まれると、OS のパス解決が基準ディレクトリの<strong>外へ「遡って」</strong>しまいます。サーバはアプリの実行権限でそのファイルへアクセスするため、公開すべきでない機密ファイルが露出します。
      </p>
      <FlowChain
        nodes={[
          { label: "入力", sub: "../../etc/passwd 等" },
          { label: "アプリ", sub: "base_dir と連結", variant: "alt" },
          { label: "OS パス解決", sub: "基準の外へ遡る" },
          { label: "境界外ファイル露出", sub: "設定・鍵など", variant: "cta" },
        ]}
        caption="相対パス要素により、基準ディレクトリの外にあるファイルへ到達してしまう"
      />

      <Section>拒否リストがなぜ破られるのか</Section>
      <p>
        ありがちな失敗は「入力から <Cmd>../</Cmd> という文字列を単純に除去する」対策です。これは<strong>エンコードのバリエーション</strong>で容易に回避されます。
      </p>
      <KVList
        items={[
          { key: "URL エンコード", val: "%2e%2e%2f が ../ に復元される" },
          { key: "二重エンコード", val: "%252e… がデコード段階を経て ../ になる" },
          { key: "Unicode / 混在区切り", val: "別表現や \\ と / の混在で検査をすり抜ける" },
          { key: "絶対パス・シンボリックリンク", val: "そもそも絶対パス指定やリンク経由で境界外へ" },
        ]}
      />
      <Callout variant="warn" title="単純な文字列除去は本質的に穴が残る">
        「危険な文字列を消す」拒否リスト方式は、表現の多様性に追いつけません。<strong>連結後のパスを正規化し、基準ディレクトリ配下に収まるかを検証する</strong>——という「結果を確かめる」発想に切り替えるのが本筋です。
      </Callout>

      <Section>種類</Section>
      <ComparisonTable
        headers={["種類", "内容", "最悪の帰結"]}
        rows={[
          ["読み取り型", "設定・鍵・/etc/passwd 等の機密ファイル漏えい", "資格情報の露出"],
          ["書き込み型 / Zip Slip", "アーカイブ展開やアップロードで任意の場所へ書き込み", "上書きや Web シェル設置から RCE"],
          ["LFI/RFI 連鎖", "ローカルファイルインクルードと結合", "ログポイズニング等で RCE へ"],
          ["シンボリックリンク追従", "リンク経由で境界外へ到達", "リンク先の機密資源へアクセス"],
        ]}
      />
      <Callout variant="warn" title="Zip Slip に注意">
        アーカイブ展開時、各エントリのファイル名に <Cmd>../</Cmd> が含まれていると、展開先が<strong>意図したディレクトリの外</strong>になり得ます（Zip Slip）。上書きや実行可能ファイルの設置から RCE へ至るため、展開時は<strong>各エントリの展開先を 1 つずつ検証</strong>する必要があります。
      </Callout>

      <Section>防御 — 正規化して基準内かを検証</Section>
      <p>
        最重要の対策は、連結後のパスを<strong>正規化（realpath / canonical 化）</strong>し、それが<strong>基準ディレクトリの配下に収まっているか</strong>を検証することです。正規化によって <Cmd>../</Cmd> や各種エンコードが実体のパスに解決されるので、そのうえで基準ディレクトリで始まるかを確かめれば、遡りを確実に検知できます。
      </p>
      <Code lang="python" filename="危険な書き方（連結のみ）">{`# 入力に ../ が入ると基準の外へ出てしまう
path = base_dir + "/" + user_input
open(path).read()`}</Code>
      <Code lang="python" filename="安全な書き方（正規化して基準内か検証）">{`import os
base = os.path.realpath(base_dir)
target = os.path.realpath(os.path.join(base, user_input))
# 正規化後のパスが基準ディレクトリ配下か検証
if not target.startswith(base + os.sep):
    raise PermissionError("境界外アクセスを拒否")
open(target).read()`}</Code>
      <SubSection>併用したい対策</SubSection>
      <ul>
        <li><strong>ファイル名のみ抽出しパスセパレータを禁止</strong> — 入力からディレクトリ区切りを許さない。</li>
        <li><strong>識別子 → パスの間接マッピング</strong> — 利用者にパスを直接指定させず、ID から内部で解決する。IDOR 対策とも重なる考え方。</li>
        <li><strong>許可リストでファイル名を厳格化</strong> — 扱ってよい名前を列挙する。</li>
        <li><strong>アーカイブ展開時に各エントリを検証</strong> — Zip Slip 対策。</li>
        <li><strong>最小権限・chroot・コンテナで隔離</strong> — 万一の到達範囲を狭める。</li>
      </ul>

      <Bridge course="オペレーティングシステム / ファイルシステム">
        パストラバーサルは、OS の授業で習う<strong>ファイルシステムのパス解決</strong>を理解すると本質が見えます。<Cmd>.</Cmd> は現在ディレクトリ、<Cmd>..</Cmd> は親ディレクトリを指す<strong>特殊なディレクトリエントリ</strong>で、カーネルはパスを左から辿りながらこれらを解決します。攻撃者はこの解決規則を悪用して、公開ツリーの外へ「登って」いきます。<Cmd>realpath</Cmd> による正規化は、シンボリックリンクや <Cmd>..</Cmd> をすべて解決した<strong>正準パス（canonical path）</strong>を得る操作で、「見かけのパス」ではなく「実際に到達するパス」で判断できるようにします。見かけと実体のギャップを埋めることが、境界を守る鍵なのです。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "../ 等の相対パス要素で基準ディレクトリの外へ遡られる",
          "文字列除去の拒否リストはエンコード変種で回避される",
          "最重要は正規化して基準ディレクトリ配下かを検証すること",
          "識別子→パスの間接マッピングや許可リストを併用する",
          "書き込み型・Zip Slip は RCE に至り得る。展開時は各エントリを検証",
        ]}
      />

      <Quiz
        question="パストラバーサルの最も確実な防御はどれ？"
        options={[
          "入力から ../ という文字列を削除する",
          "連結後のパスを正規化し、基準ディレクトリ配下に収まるか検証する",
          "ファイル名を Base64 でエンコードする",
          "読み取りを HTTPS 経由に限定する",
        ]}
        answer={1}
        explanation="正規化（realpath）で ../ やエンコードを実体パスに解決し、それが基準ディレクトリ配下かを検証すれば遡りを確実に検知できます。文字列除去はエンコード変種で回避されます。"
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-02-install",
  title: "2. インストールと初回起動 — 画面の地図を作る",
  description: "Burp Suite Community Edition を macOS/Windows/Linux にインストールし、初回起動フローと画面各パーツ（ツールタブ・Dashboard・Inspector・Settings）を一巡する。起動時のトラブルシュートも扱う。",
  domain: "burp-practice",
  section: "setup",
  order: 3,
  level: "intro",
  tags: ["Burp Suite", "インストール", "セットアップ", "トラブルシュート"],
  updated: "2026-07-28",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        Burp Suite Community Edition を自分の PC に入れて起動し、画面のどこに何があるかを一通り把握します。（目標学習時間：1時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>自分の OS（macOS / Windows / Linux）に Burp Suite Community Edition をインストールできる</li>
          <li>初回起動時のプロジェクト選択フローを理解している</li>
          <li>Dashboard・ツールタブ・Inspector・Settings の位置を把握している</li>
          <li>メモリ割り当てや表示設定など、最初にやっておくと快適になる設定を知っている</li>
          <li>起動しない・ポート競合などの初歩的なトラブルに対処できる</li>
        </ul>
      </Callout>

      <Section>1. 動作要件</Section>
      <ul>
        <li><strong>OS</strong>: macOS / Windows / Linux（各種ディストリビューション）</li>
        <li><strong>Java</strong>: 不要（インストーラに Java 実行環境が同梱されている）</li>
        <li><strong>メモリ</strong>: 4GB 以上推奨（Community でも Proxy History が肥大化するとメモリを食うため、余裕があると快適）</li>
        <li><strong>ディスク</strong>: インストーラ本体 + 展開後で数百MB〜1GB程度</li>
      </ul>
      <Callout variant="info" title="Java を別途入れる必要はない">
        PortSwigger の公式インストーラには実行に必要な Java 環境が同梱されています。システムに Java を別途インストールする必要はありません（古い情報では「Java が必要」と書かれていることがありますが、現行の公式インストーラでは不要です）。
      </Callout>

      <Section>2. インストール手順</Section>
      <SubSection>入手先</SubSection>
      <p>
        必ず <strong>PortSwigger 公式サイト</strong>（portswigger.net の Burp Suite ダウンロードページ）から入手してください。「Burp Suite Community Edition」を選ぶと OS ごとのインストーラが並んでいます。
      </p>

      <SubSection>macOS の場合</SubSection>
      <Steps>
        <Step title="インストーラをダウンロード">公式サイトから macOS 用（.dmg）を選んでダウンロードする。</Step>
        <Step title="dmg をマウントしてドラッグ">ダウンロードした .dmg を開き、Burp Suite Community Edition のアイコンを Applications フォルダへドラッグする。</Step>
        <Step title="初回起動時の警告を許可">「開発元が未確認」の警告が出たら、システム設定 → プライバシーとセキュリティ から「このまま開く」を選択する。</Step>
      </Steps>

      <SubSection>Windows の場合</SubSection>
      <Steps>
        <Step title="インストーラをダウンロード">公式サイトから Windows 用（.exe）をダウンロードする。</Step>
        <Step title="インストーラを実行">ダブルクリックしてウィザードに従う。インストール先はデフォルトのままで問題ない。</Step>
        <Step title="スタートメニューから起動">インストール完了後、スタートメニューに追加された Burp Suite Community Edition を起動する。</Step>
      </Steps>

      <SubSection>Linux の場合</SubSection>
      <Steps>
        <Step title="インストーラをダウンロード">公式サイトから Linux 用（.sh）をダウンロードする。</Step>
        <Step title="実行権限を付与して実行">下記コマンドでインストーラを実行し、ウィザードに従う。</Step>
        <Step title="インストール先から起動">インストール先ディレクトリの実行ファイル（既定は自分のホーム配下）から起動する。</Step>
      </Steps>
      <Code lang="bash" filename="Linux でのインストール">{`chmod +x burpsuite_community_linux_v*.sh
./burpsuite_community_linux_v*.sh`}</Code>

      <Figure
        src="/learn/shots/burp-practice/burp-02-install-01.svg"
        alt="PortSwigger 公式サイトの Burp Suite ダウンロードページで Community Edition のインストーラが OS 別に並んでいる画面"
        caption="公式サイトのダウンロードページ。必ず portswigger.net から入手する"
      />

      <Section>3. 初回起動フロー</Section>
      <p>
        Burp Suite を起動すると、まず<strong>プロジェクトの種類</strong>を選ぶ画面が出ます。ここが Community と Professional の大きな違いの一つです。
      </p>
      <ComparisonTable
        headers={["プロジェクト種別", "Community", "Professional"]}
        rows={[
          ["Temporary project（一時プロジェクト）", "選択可（実質これしか使えない）", "選択可"],
          ["New project on disk（ディスク保存）", "選択不可", "選択可。あとで開き直せる"],
        ]}
      />
      <Callout variant="warn" title="Community はプロジェクトを保存できない">
        Community Edition は <strong>Temporary project</strong> しか選べません。Burp を終了すると、その回の Proxy History や Site map はすべて消えます。<strong>検証で気づいたことや再現手順は、Burp の外側（メモ帳やドキュメント）に都度書き残す習慣</strong>をつけてください。Professional では Disk project を選べば作業を保存・再開できます。
      </Callout>
      <Steps>
        <Step title="Temporary project を選択">起動直後の画面で「Temporary project」を選び「Next」をクリックする。</Step>
        <Step title="Use Burp defaults を選択">設定プロファイルの選択画面で「Use Burp defaults」を選び「Start Burp」をクリックする。（2回目以降にプロファイルを保存・再利用したい場合は「Load a saved settings」から選べる）</Step>
      </Steps>

      <Section>4. 画面ツアー</Section>
      <p>
        起動すると、上部にタブが並んだメイン画面が表示されます。まず配置だけ頭に入れておきましょう。
      </p>
      <KVList
        items={[
          { key: "上部のツールタブ", val: "Dashboard・Target・Proxy・Intruder・Repeater・Sequencer・Decoder・Comparer・Logger・Extensions が並ぶ。クリックで切り替える" },
          { key: "Dashboard の Event log", val: "起動直後に表示される画面。Burp 自身の動作ログ（読み込んだ拡張機能など）が流れる" },
          { key: "Dashboard の Tasks", val: "バックグラウンドで動くタスク（Community では主に Live passive crawl 程度）の一覧" },
          { key: "右側の Inspector", val: "Proxy や Repeater でリクエストを選んだときに、ヘッダーやパラメータを見やすく分解して表示するパネル。Ctrl/Cmd+I などで開閉できる" },
          { key: "Settings（旧 User options / Project options）", val: "画面右上の歯車アイコン。プロキシのリッスンポート、表示テーマ、証明書、ホットキーなどを設定する" },
        ]}
      />
      <Figure
        src="/learn/shots/burp-practice/burp-02-install-02.svg"
        alt="Burp Suite 起動直後の Dashboard 画面。上部にツールタブ、中央に Event log と Tasks、右上に Settings の歯車アイコンが見える"
        caption="起動直後の Dashboard。ツールタブの並びと Settings の位置を確認する"
      />

      <Section>5. 最初にやっておきたい設定</Section>
      <SubSection>メモリ割り当ての調整</SubSection>
      <p>
        Proxy History や Site map を溜め込むと Burp はメモリを多く使います。デフォルトの割り当てで動作が重いと感じたら、起動オプションの <Cmd>-Xmx</Cmd>（最大ヒープサイズ）を増やせます。macOS/Linux では起動用スクリプトやショートカットの引数に追加します。
      </p>
      <Code lang="bash" filename="メモリを4GBに増やして起動する例（jar 形式で実行している場合）">{`java -Xmx4g -jar burpsuite_community.jar`}</Code>
      <Callout variant="info" title="インストーラ版はメニューから調整できる">
        インストーラでインストールした場合は、多くの環境で Settings 内の「Java」関連の項目、または起動ショートカットのプロパティからメモリ上限を編集できます。詳しい手順は環境によって異なるため、公式ドキュメントの該当ページも参照してください。
      </Callout>

      <SubSection>表示テーマ・フォントサイズ</SubSection>
      <p>
        Settings → Appearance から、ダークテーマへの切り替えやフォントサイズの調整ができます。長時間の作業になるコースなので、目が疲れにくい設定に整えておくと快適です。
      </p>

      <Section>6. 動作確認 — 内蔵ブラウザを開く</Section>
      <p>
        Burp Suite には、あらかじめ Burp のプロキシ経由に設定済みの<strong>内蔵の Chromium ベースブラウザ</strong>が付属しています。Proxy タブ内の「Open browser」ボタン（Community では Proxy 設定画面から起動できます）から開くと、証明書のインストールやプロキシ設定を自分で行わずに Burp 経由の通信をすぐ試せます。
      </p>
      <Steps>
        <Step title="Proxy タブを開く">上部タブから Proxy を選択する。</Step>
        <Step title="Intercept は一旦 off のまま">最初の動作確認では Intercept is off の状態でよい（次章で詳しく扱う）。</Step>
        <Step title="Open browser をクリック">内蔵ブラウザが開く。適当な HTTP サイトへアクセスしてみる。</Step>
        <Step title="HTTP history を確認">Proxy タブの HTTP history サブタブに、今アクセスした通信が記録されていれば成功。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-02-install-03.svg"
        alt="Burp 内蔵ブラウザで適当なページにアクセスした直後、Proxy の HTTP history タブに通信が1行記録されている画面"
        caption="内蔵ブラウザでアクセスした通信が HTTP history に記録されていれば、Burp を経由した通信が捕捉できている証拠"
      />

      <Section>7. よくあるトラブルと対処</Section>
      <Callout variant="warn" title="問題1: アプリが起動しない・すぐ落ちる">
        <strong>原因</strong>: メモリ不足、または別プロセスが異常終了した際のロックファイルが残っている。<br />
        <strong>対処</strong>: 一度 PC を再起動し、他の重いアプリを閉じてから再度起動する。それでも改善しない場合は再インストールを試す。
      </Callout>
      <Callout variant="warn" title="問題2: 「Java エラー」や互換性の警告が出る">
        <strong>原因</strong>: 古いバージョンのインストーラを使っている、もしくはシステムの Java と競合している。<br />
        <strong>対処</strong>: 公式サイトから最新のインストーラを取り直す。インストーラ版は同梱の Java を使うため、システム側の古い Java 設定と衝突している場合は環境変数 <Cmd>JAVA_HOME</Cmd> の影響を疑う。
      </Callout>
      <Callout variant="warn" title="問題3: プロキシのポート 8080 が競合している">
        <strong>原因</strong>: 他のアプリ（開発用のローカルサーバーなど）がすでに 8080 番ポートを使用している。<br />
        <strong>対処</strong>: Settings → Network → Proxy Listeners で Burp 側のリッスンポートを 8081 など別の番号に変更する。ブラウザ側のプロキシ設定も合わせて変更すること。
      </Callout>

      <Divider />

      <Quiz
        question="Burp Suite Community Edition の初回起動フローで正しいものはどれですか？"
        options={[
          "New project on disk を選び、あとで作業を再開できるように保存する",
          "Temporary project しか選べず、終了すると Proxy History 等は消える",
          "アカウント登録をしないとどのプロジェクト種別も選べない",
          "初回起動時に必ず拡張機能を選んでインストールする必要がある",
        ]}
        answer={1}
        explanation="Community Edition は Temporary project のみ選択可能です。ディスクへの保存（New project on disk）は Professional の機能で、Community では作業内容を Burp 内に永続化できないため、気づいた点は別途メモを取る必要があります。"
      />

      <KeyPoints
        items={[
          "公式インストーラには Java が同梱されており、別途インストール不要",
          "Community は Temporary project のみ。作業内容は保存できないので外部にメモを残す",
          "画面上部のツールタブ・Dashboard・右側 Inspector・Settings（歯車）の位置を押さえる",
          "動作が重ければ -Xmx でメモリ割り当てを増やせる",
          "内蔵ブラウザで HTTP history に通信が記録されれば動作確認は完了",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「3. 検証環境を用意する」で、実際に通信を捕まえる対象（Web Security Academy のラボや Docker のローカル脆弱アプリ）を準備します。
      </Callout>
    </>
  );
}

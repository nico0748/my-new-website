import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-05-ca-certificate",
  title: "5. CA 証明書と HTTPS 傍受 — 外部ブラウザを繋ぐ",
  description: "普段使いの Chrome / Firefox を Burp Suite に繋いで HTTPS を傍受する。CA 証明書のダウンロードとインポート、ブラウザのプロキシ設定、うまくいかないときのチェックリストまで。",
  domain: "burp-practice",
  section: "proxy",
  order: 2,
  level: "basic",
  tags: ["Burp Suite", "CA証明書", "HTTPS", "TLS"],
  updated: "2026-07-28",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        前章の内蔵ブラウザは便利ですが、拡張機能を使いたい・モバイル端末を通したいといった場面では外部ブラウザが必要になります。ここでは Burp の CA 証明書を外部ブラウザに信頼させ、HTTPS を安全に傍受できるようにします。（目標学習時間：1時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>なぜ CA 証明書のインポートが必要なのか、TLS の信頼チェーンの観点で説明できる</li>
          <li>Burp の CA 証明書をダウンロードし、Firefox / Chrome にインポートできる</li>
          <li>ブラウザ側のプロキシ設定を切り替えられる</li>
          <li>うまく傍受できないときに確認すべきポイントを知っている</li>
        </ul>
      </Callout>

      <Section>1. なぜ証明書が要るのか</Section>
      <p>
        通常の HTTPS では、サーバーは「信頼された認証局（CA）」が署名した証明書を提示し、ブラウザはその署名を OS やブラウザに組み込まれた<strong>信頼済み CA のリスト</strong>と照合します。一致すれば「このサーバーは本物だ」と判断し、鍵マークを表示して通信を続けます。
      </p>
      <p>
        前章で見たとおり、Burp は HTTPS 通信の中間に割り込み、<strong>自分自身の CA でその場で発行した証明書</strong>をブラウザに提示します。この Burp CA は、ブラウザや OS の信頼リストには最初から入っていません。そのため何もしなければ「この接続のプライバシーは保護されません」といった警告が出て、通信内容を見る前にブロックされてしまいます。
      </p>
      <Callout variant="info" title="CA 証明書をインポートするとはどういうことか">
        「Burp の CA 証明書をブラウザにインポートする」とは、<strong>Burp を信頼済みの認証局として登録する</strong>ことです。これにより、Burp が動的発行するどんな証明書もブラウザは正当なものとして受け入れるようになり、警告なしに HTTPS 通信の中身を見られるようになります。
      </Callout>

      <Section>2. Burp の CA 証明書をダウンロードする</Section>
      <p>
        Burp のプロキシ経由でアクセスしている状態（内蔵ブラウザ、またはプロキシ設定済みの状態）で、特別な URL にアクセスすると証明書がダウンロードできます。
      </p>
      <Steps>
        <Step title="Burp を起動しておく">Proxy の Listener（127.0.0.1:8080）が有効になっていることを確認する。</Step>
        <Step title="証明書ダウンロード用ページを開く">プロキシ経由の任意のブラウザで <Cmd>http://burp</Cmd>（うまく開かない場合は <Cmd>http://127.0.0.1:8080</Cmd>）へアクセスする。</Step>
        <Step title="CA Certificate をクリック">表示されたページの <Cmd>CA Certificate</Cmd> リンクをクリックし、<Cmd>cacert.der</Cmd> をダウンロードする。</Step>
      </Steps>
      <Code lang="text" filename="アクセス先">{`http://burp
（このドメインは実在のサイトではなく、Burp プロキシ自身が特別に応答するアドレス）`}</Code>
      <Callout variant="warn" title="このページが開けない場合">
        <Cmd>http://burp</Cmd> はプロキシ経由でアクセスして初めて Burp が応答するアドレスです。ブラウザのプロキシ設定がまだ Burp を向いていない場合は開けません。まず内蔵ブラウザでダウンロードしておき、後述の方法で各ブラウザ・OS にインポートする、という順序でも構いません。
      </Callout>

      <Section>3. Firefox へ導入する</Section>
      <p>
        Firefox は OS の証明書ストアを使わず、<strong>独自の証明書ストア</strong>を持っています。そのためインポート先も Firefox の設定画面から行います。
      </p>
      <Steps>
        <Step title="設定を開く">アドレスバーに <Cmd>about:preferences#privacy</Cmd> と入力する。</Step>
        <Step title="証明書を表示 を開く">ページ下部「証明書」欄にある <Cmd>証明書を表示</Cmd> ボタンをクリックする。</Step>
        <Step title="認証局証明書タブでインポート"><Cmd>認証局証明書</Cmd> タブを開き、<Cmd>インポート</Cmd> をクリックしてダウンロード済みの <Cmd>cacert.der</Cmd> を選択する。</Step>
        <Step title="信頼設定にチェック">「この CA を Web サイトの識別のために信頼する」にチェックを入れて OK。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-05-ca-certificate-01.svg"
        alt="Firefox の認証局証明書一覧に PortSwigger CA がインポートされ、信頼設定にチェックが入っている画面"
        caption="Firefox の認証局証明書タブ。PortSwigger CA が一覧に追加され信頼済みになっている"
      />

      <Section>4. Chrome / Edge へ導入する（OS の信頼ストアを使う）</Section>
      <p>
        Chrome や Edge は Firefox と違い、<strong>OS 標準の証明書ストア</strong>を利用します。そのため導入先は Firefox のような専用画面ではなく、OS 側の証明書管理ツールになります。
      </p>
      <SubSection>macOS（キーチェーンアクセス）</SubSection>
      <Steps>
        <Step title="キーチェーンアクセスを開く">Spotlight で「キーチェーンアクセス」を検索して起動する。</Step>
        <Step title="証明書をドラッグ&ドロップ">左メニューで「ログイン」または「システム」キーチェーンを選び、ダウンロードした <Cmd>cacert.der</Cmd> をウィンドウにドラッグする。</Step>
        <Step title="信頼設定を「常に信頼」に変更">追加された証明書（PortSwigger CA）をダブルクリックし、「信頼」の項目を展開して <Cmd>この証明書を使用するとき</Cmd> を「常に信頼」に変更する。</Step>
      </Steps>
      <SubSection>Windows（証明書マネージャ）</SubSection>
      <Steps>
        <Step title="ファイルの拡張子を変更">ダウンロードした <Cmd>cacert.der</Cmd> をダブルクリックして証明書ビューアを開く。</Step>
        <Step title="証明書のインストールを開始">「証明書のインストール」ボタンから、ウィザードで <Cmd>ローカルコンピューター</Cmd> を選ぶ（要管理者権限）。</Step>
        <Step title="信頼されたルート証明機関ストアを選ぶ">「証明書をすべて次のストアに配置する」を選び、<Cmd>信頼されたルート証明機関</Cmd> を明示的に指定してインストールを完了する。</Step>
      </Steps>
      <Callout variant="danger" title="この証明書は自分の検証端末だけに入れる">
        Burp の CA を「常に信頼」に設定するということは、<strong>その Burp インスタンスが発行するどんな証明書でもブラウザが無条件に信じる</strong>ということです。会社の共有 PC や本番運用端末には絶対にインポートしないでください。また、<strong>検証作業が終わったら、インポートした CA 証明書は削除しておく</strong>ことを習慣にしましょう（キーチェーンアクセス／証明書マネージャからいつでも削除できます）。
      </Callout>

      <Section>5. ブラウザのプロキシ設定を切り替える</Section>
      <p>
        証明書を信頼させただけでは通信は Burp を経由しません。ブラウザ（または OS）のプロキシ設定で、通信先を <Cmd>127.0.0.1:8080</Cmd> に向ける必要があります。
      </p>
      <ComparisonTable
        headers={["方法", "特徴"]}
        rows={[
          ["OS のネットワーク設定を直接変更", "全アプリの通信に影響する。検証が終わったら戻し忘れやすい"],
          ["ブラウザ拡張（FoxyProxy 等）で切り替え", "ワンクリックで Burp 経由 / 直接接続を切り替えられる。検証以外の通常利用と両立しやすい"],
        ]}
      />
      <Callout variant="tip" title="FoxyProxy がおすすめ">
        FoxyProxy のようなプロキシ切り替え拡張を使うと、ツールバーのアイコンをクリックするだけで「Burp 経由」と「直接接続」を切り替えられます。普段のブラウジングと検証作業を同じブラウザで両立させたい場合に便利です。
      </Callout>

      <Section>6. うまくいかないときのチェックリスト</Section>
      <p>
        証明書をインポートし、プロキシ設定も済ませたのに接続がブロックされる、あるいは HTTP history に何も記録されない場合は、以下を順に確認してください。
      </p>
      <ul>
        <li><strong>HSTS（HTTP Strict Transport Security）</strong>: 一度アクセスしたサイトをブラウザが「常に HTTPS で、かつこの証明書チェーンで」と記憶している場合がある。該当サイトのブラウザ内 HSTS キャッシュをクリアするか、別のブラウザプロファイルで試す</li>
        <li><strong>証明書ピンニング</strong>: アプリ側が特定の証明書のみを許可する実装（Certificate Pinning）をしている場合、CA を信頼させても突破できない。モバイルアプリで特に多い</li>
        <li><strong>QUIC / HTTP3 を無効化</strong>: QUIC は独自の暗号化・輸送層を使うため、TCP ベースの Burp プロキシを経由しない。Chrome の場合は <Cmd>chrome://flags</Cmd> で <Cmd>Experimental QUIC protocol</Cmd> を無効にする</li>
        <li><strong>ブラウザの再起動</strong>: プロキシ設定や証明書ストアの変更が反映されるまでブラウザの再起動が必要な場合がある</li>
      </ul>
      <Code lang="text" filename="Chrome で QUIC を無効化する">{`chrome://flags/#enable-quic
→ Disabled に変更 → Relaunch`}</Code>

      <Section>7. 動作確認</Section>
      <p>
        設定が完了したら、外部ブラウザで HTTPS のラボ（Web Security Academy の任意のラボ、または <Cmd>https://</Cmd> で起動した Juice Shop）を開き、証明書エラーが出ずにページが表示されることを確認します。
      </p>
      <Steps>
        <Step title="HTTPS のラボを開く">証明書警告が出ず、鍵マークが正常に表示されることを確認する。</Step>
        <Step title="HTTP history を確認する">Burp の <Cmd>Proxy → HTTP history</Cmd> に、そのラボへのリクエストが記録されていることを確認する。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-05-ca-certificate-02.svg"
        alt="外部ブラウザで HTTPS のラボが証明書警告なく表示され、Burp の HTTP history にそのリクエストが記録されている画面"
        caption="外部ブラウザでの HTTPS 傍受が成功した状態。証明書警告が出ず、HTTP history にも記録される"
      />

      <Divider />

      <Quiz
        question="Chrome や Edge で Burp の CA 証明書を信頼させるために、正しい導入先はどこか。"
        options={[
          "Chrome / Edge 独自の証明書ストア（about:preferences のような専用画面）",
          "OS 標準の証明書ストア（macOS のキーチェーンアクセス、Windows の証明書マネージャ）",
          "Burp 自体の設定画面（Proxy settings）にインポートすればブラウザ側の設定は不要",
        ]}
        answer={1}
        explanation="Firefox は独自の証明書ストアを持ちますが、Chrome / Edge は OS 標準の証明書ストアを利用します。そのため macOS はキーチェーンアクセス、Windows は証明書マネージャから信頼されたルート証明機関としてインポートする必要があります。"
      />

      <Divider />

      <KeyPoints
        items={[
          "Burp は独自 CA で動的に証明書を発行するため、ブラウザにその CA を信頼させる必要がある",
          "証明書は http://burp からダウンロードできる（プロキシ経由でアクセス）",
          "Firefox は独自ストア、Chrome/Edge は OS の証明書ストアにインポートする",
          "証明書は自分の検証端末だけに入れ、作業後は削除する",
          "うまくいかないときは HSTS・証明書ピンニング・QUIC を疑う",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「6. Intercept」では、止めたリクエストを実際に書き換えて送信し、クライアント側バリデーションがどれだけ簡単に迂回できるかを体感します。
      </Callout>
    </>
  );
}

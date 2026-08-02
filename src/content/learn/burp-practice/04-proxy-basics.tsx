import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-04-proxy-basics",
  title: "4. Proxy の仕組み — 通信の途中に立つ",
  description: "Burp Suite の中核機能 Proxy を理解する。ブラウザとサーバーの間に割り込む仕組み、HTTP/HTTPS での挙動の違い、Listener の設定、内蔵ブラウザを使った最短ルートまで。",
  domain: "burp-practice",
  section: "proxy",
  order: 1,
  level: "basic",
  tags: ["Burp Suite", "Proxy", "Listener", "内蔵ブラウザ"],
  updated: "2026-07-28",
  minutes: 50,
};

export default function Article() {
  return (
    <>
      <Lead>
        Burp Suite を通信の「途中」に立たせて、リクエストとレスポンスを覗き見る。この章では Proxy の基本原理と、最短で使い始めるための設定を身につけます。（目標学習時間：50分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>中間プロキシとしての Burp の役割を、通信の流れとして説明できる</li>
          <li>HTTP と HTTPS で Burp の動き方がどう違うか理解する</li>
          <li>Proxy listener の設定項目を理解し、安全な設定ができる</li>
          <li>内蔵ブラウザ（Burp's Browser）を使って最短で検証を始められる</li>
        </ul>
      </Callout>

      <Section>1. 中間プロキシとは何か</Section>
      <p>
        普段ブラウザは、サーバーへ直接 HTTP リクエストを送っています。Burp Suite の Proxy 機能は、この経路の<strong>途中に割り込むローカルサーバー</strong>です。ブラウザは「サーバーへ直接」ではなく「Burp へ」リクエストを送り、Burp がそれを代わりにサーバーへ転送し、返ってきたレスポンスをブラウザへ戻します。
      </p>
      <Code lang="text" filename="通信の流れ（イメージ）">{`[ ブラウザ ]  --- HTTP リクエスト --->  [ Burp Proxy (127.0.0.1:8080) ]  --- 転送 --->  [ Web サーバー ]
[ ブラウザ ]  <--- HTTP レスポンス ---  [ Burp Proxy (127.0.0.1:8080) ]  <--- 応答 ---  [ Web サーバー ]

                     ↑
           Burp はここで通信を「見る」「止める」「書き換える」ことができる`}</Code>
      <p>
        この「間に立つ」性質のおかげで、ブラウザが送受信する<strong>すべての通信をアプリのロジックを介さずに直接観測・改変</strong>できます。JavaScript のバリデーションや UI 上の制約は、通信そのものには何の強制力も持ちません。Proxy はその事実を体感するための一番手っ取り早い道具です。
      </p>
      <Callout variant="info" title="用語: プロキシ / フォワードプロキシ">
        Burp が行っているのは「フォワードプロキシ」の一種です。クライアント（ブラウザ）側に設定して、外向きの通信を中継させる方式です。企業ネットワークの Web フィルタリングプロキシと基本構造は同じで、Burp は「検証者自身が制御する」プロキシという点が違います。
      </Callout>

      <Section>2. HTTP と HTTPS で挙動が違う</Section>
      <p>
        平文の HTTP なら、Burp はリクエストの中身（メソッド・パス・ヘッダ・ボディ）をそのまま読み書きできます。しかし HTTPS は TLS で暗号化されているため、単純に中継するだけでは中身が見えません。
      </p>
      <SubSection>HTTPS の場合: CONNECT トンネル</SubSection>
      <p>
        ブラウザが HTTPS サイトへ接続しようとすると、まず Burp に対して <Cmd>CONNECT example.com:443</Cmd> というリクエストを送ります。これは「この先は生のTCPトンネルとして中継してくれ」という依頼です。
      </p>
      <Code lang="http" filename="CONNECT リクエストの例">{`CONNECT example.com:443 HTTP/1.1
Host: example.com:443`}</Code>
      <p>
        ここで Burp は単純にトンネルを繋ぐのではなく、<strong>自分自身を「中間者（MITM）」として割り込ませます</strong>。ブラウザに対しては Burp が発行した動的な証明書で応答し、サーバーに対しては Burp が別途 TLS 接続を張ります。結果として、ブラウザ ⇔ Burp 間、Burp ⇔ サーバー間のそれぞれで別々に TLS が終端され、Burp はその中身を平文として読み書きできます。
      </p>
      <Callout variant="warn" title="ブラウザが証明書エラーを出す理由">
        Burp が発行する証明書は Burp 独自の CA（認証局）で署名されています。ブラウザの信頼ストアはこの CA を知らないため、何もしなければ「この接続は安全ではありません」という警告が出ます。次章「5. CA 証明書と HTTPS 傍受」で、この CA をブラウザに信頼させる手順を扱います。
      </Callout>

      <Section>3. Proxy listener の設定</Section>
      <p>
        Burp の <Cmd>Proxy → Proxy settings</Cmd>（旧 UI では <Cmd>Options</Cmd> タブ）にある <strong>Proxy listeners</strong> で、Burp がどのアドレス・ポートで待ち受けるかを設定します。
      </p>
      <ComparisonTable
        headers={["項目", "既定値・推奨", "理由"]}
        rows={[
          ["Bind to address", "127.0.0.1（localhost）", "自分のPC以外から接続できないようにするため"],
          ["Bind to port", "8080", "多くのドキュメント・拡張機能がこの前提で書かれている"],
          ["Certificate", "Per-host（既定）", "アクセス先ホストごとに動的発行。互換性が高い"],
        ]}
      />
      <Callout variant="danger" title="バインドアドレスを All interfaces にしてはいけない">
        Listener の Bind to address を <Cmd>All interfaces</Cmd> にすると、同じネットワーク上の<strong>他の端末からも Burp のプロキシに接続できてしまいます</strong>。認証も暗号化もされていない素のプロキシ経路が外部に開くことになり、カフェの Wi-Fi や社内ネットワークなど共有環境では特に危険です。モバイル端末を通したい場合など、必要なとき以外は必ず <Cmd>127.0.0.1（Loopback only）</Cmd> のままにしておきましょう。
      </Callout>
      <p>
        ポート番号を変更したい場合（他のツールと 8080 が衝突する等）は、Listener の設定を編集して別のポートに変更できます。複数の Listener を同時に立てることも可能です（後述の応用は「8. Proxy の設定を詰める」で扱います）。
      </p>

      <Section>4. 内蔵ブラウザ（Burp's Browser）を使うのが最短</Section>
      <p>
        外部ブラウザ（Chrome や Firefox）を Burp に繋ぐには、プロキシ設定と CA 証明書のインポートが必要です。しかし Burp には<strong>あらかじめ Burp のプロキシと CA 証明書が設定済みの専用ブラウザ（Burp's Browser）</strong>が同梱されており、これを使えば面倒な設定なしに今すぐ検証を始められます。
      </p>
      <Steps>
        <Step title="Proxy タブを開く">Burp 上部のタブから <Cmd>Proxy</Cmd> を選ぶ。</Step>
        <Step title="Intercept サブタブを開く">Proxy 内の <Cmd>Intercept</Cmd> サブタブを開く。</Step>
        <Step title="Open browser をクリック">画面内にある <Cmd>Open browser</Cmd> ボタンをクリックする。数秒待つと、Burp 専用の Chromium ベースブラウザが起動する。</Step>
        <Step title="検証対象を開く">起動したブラウザで検証対象（Juice Shop や Web Security Academy のラボ）を開く。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-04-proxy-basics-01.svg"
        alt="Proxy タブの Intercept サブタブに表示された Open browser ボタン"
        caption="Proxy → Intercept サブタブ。Open browser ボタンから内蔵ブラウザを起動する"
      />
      <Callout variant="tip" title="内蔵ブラウザの利点">
        <ul>
          <li>プロキシ設定・CA 証明書のインポートが不要（すでに済んだ状態で起動する）</li>
          <li>普段使いのブラウザ（ログイン中のアカウント、拡張機能、Cookie）と<strong>完全に隔離</strong>されるため、検証中のノイズが混ざらない</li>
          <li>検証が終わればブラウザごと閉じるだけで後片付け不要</li>
        </ul>
      </Callout>

      <Section>5. 内蔵ブラウザと外部ブラウザの使い分け</Section>
      <p>
        学習の最初の一歩は内蔵ブラウザで十分です。ただし、状況によっては外部ブラウザを使う場面も出てきます。それぞれの特徴を比較しておきましょう。
      </p>
      <ComparisonTable
        headers={["", "内蔵ブラウザ（Burp's Browser）", "外部ブラウザ + プロキシ設定"]}
        rows={[
          ["セットアップの手間", "ほぼ不要（ボタン1つ）", "CA 証明書導入・プロキシ設定が必要"],
          ["拡張機能の利用", "基本的に不可（専用環境）", "FoxyProxy 等の拡張が使える"],
          ["普段の環境との分離", "完全に隔離される", "自分のブラウザ環境をそのまま使う（誤操作のリスクあり）"],
          ["向いている場面", "とにかく早く動かして試したいとき、学習の初期", "モバイル端末経由の検証、拡張機能を使う運用、日常的な繰り返し作業"],
        ]}
      />
      <p>
        この章とコース全体の学習では、まず<strong>内蔵ブラウザ</strong>で進めます。外部ブラウザを繋ぐ手順は次章「5. CA 証明書と HTTPS 傍受」で扱います。
      </p>

      <Section>6. 最初のトラフィックを見てみる（演習）</Section>
      <p>
        Intercept を一旦 off にした状態（Proxy → Intercept で <Cmd>Intercept is off</Cmd> と表示されている状態）で、内蔵ブラウザから検証対象を開いてみましょう。
      </p>
      <Steps>
        <Step title="検証対象を用意する">ローカルで起動した OWASP Juice Shop（<Cmd>http://localhost:3000</Cmd>）、または PortSwigger の Web Security Academy の適当なラボを開く。</Step>
        <Step title="いくつかページを操作する">トップページ → 商品一覧 → 商品詳細、のようにいくつかページ遷移してみる。</Step>
        <Step title="Proxy → HTTP history を確認する">Burp に戻り、<Cmd>Proxy → HTTP history</Cmd> タブを開く。ブラウザで行った操作が、行として次々に記録されているのを確認する。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-04-proxy-basics-02.svg"
        alt="HTTP history タブに複数のリクエスト行が時系列で並んでいる画面"
        caption="HTTP history。ブラウザで開いたページの数だけリクエストの行が積み上がっていく"
      />
      <p>
        ここで見えている一行一行が、ブラウザとサーバーの間で実際にやり取りされた生の HTTP リクエスト／レスポンスです。この「見える化」こそが Burp を使う出発点になります。詳しい読み方は「7. HTTP history」で扱います。
      </p>

      <Divider />

      <Quiz
        question="Burp が HTTPS 通信の中身を見られる仕組みとして正しいものはどれか。"
        options={[
          "ブラウザとサーバーの TLS 通信をそのまま中継しているだけなので、実は中身は見えていない",
          "ブラウザ ⇔ Burp、Burp ⇔ サーバーでそれぞれ別に TLS を終端し、Burp 独自の CA で発行した証明書をブラウザに提示することで中間者として割り込んでいる",
          "サーバー側の秘密鍵を事前に入手しているため、暗号化前のデータを直接復号できる",
        ]}
        answer={1}
        explanation="Burp は CONNECT トンネルの中でブラウザ向けとサーバー向けにそれぞれ独立した TLS 接続を張り、動的発行した証明書でブラウザに応答することで中間者として振る舞います。ブラウザ側がこの CA を信頼していないと警告が出ます。"
      />

      <Divider />

      <KeyPoints
        items={[
          "Burp Proxy はブラウザとサーバーの間に割り込む中間プロキシ",
          "HTTPS は CONNECT トンネル内で Burp が中間者として TLS を二重に終端する",
          "Listener の Bind to address は 127.0.0.1 のまま。All interfaces にしない",
          "内蔵ブラウザ（Open browser）を使えば証明書設定なしに今すぐ検証を始められる",
          "HTTP history に行が並べば、Burp が通信を捕捉できている証拠",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「5. CA 証明書と HTTPS 傍受」では、普段使っている外部ブラウザ（Chrome / Firefox）を Burp に繋ぐための CA 証明書のインポート手順を扱います。
      </Callout>
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Divider } from "../../../components/learn/kit";
import { LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "what-is-web",
  title: "Web とインターネットの違い",
  description: "「インターネット」と「Web」は何が違うのか。通信インフラとその上のサービスという関係を、TCP/IP・HTTP を軸に整理する。",
  domain: "web",
  section: "web-basics",
  order: 1,
  level: "intro",
  tags: ["Web", "インターネット", "基礎"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        「インターネット」と「Web」は日常ではほぼ同じ意味で使われますが、技術的にはまったく別の層のものです。ひとことで言えば、<strong>インターネットは通信のインフラ</strong>で、<strong>Web はその上で動くサービスの 1 つ</strong>。この関係が腑に落ちると、後で出てくる HTTP・DNS・サーバの話が一本の筋で理解できます。
      </Lead>

      <Section>インターネットとは — 通信の土台</Section>
      <p>
        インターネットは、世界中のコンピュータをつなぐ「ネットワークのネットワーク」です。データを目的地まで届けるための仕組みそのものであり、道路・電気・水道のような<strong>インフラ</strong>にあたります。
      </p>
      <p>
        インフラであるということは、その上で動くサービスは Web だけではない、ということです。実際、インターネットの上には次のような多様なサービスが同居しています。
      </p>
      <ul>
        <li>メール（SMTP）</li>
        <li>ファイル転送（FTP）</li>
        <li>リモート接続（SSH）</li>
        <li>オンラインゲームやビデオ通話</li>
      </ul>
      <p>
        なぜこれほど多様なサービスが 1 つのインフラの上で共存できるのでしょうか。答えは、インターネットが「どんなデータをどう使うか」には一切関知せず、ただ<strong>データの塊（パケット）を宛先まで運ぶことだけ</strong>に徹する設計だからです。運ぶ中身が Web ページであれメールであれ、ネットワークにとっては同じ「運ぶべき荷物」に過ぎません。この「中身に無関心な土管」という設計思想が、後から新しいサービスをいくらでも追加できる拡張性を生んでいます。
      </p>

      <Bridge course="ネットワーク（コンピュータネットワーク）">
        講義で最初に習う <strong>OSI 参照モデル / TCP-IP 参照モデル</strong> は、まさにこの「役割ごとに層を分ける」考え方そのものです。とくに大学で強調される<strong>パケット交換（packet switching）</strong>——データを小さなパケットに分割し、各パケットが独立に経路を選んで届く——という理論が、「インターネットは中身に無関心な土管である」という実務上の性質を裏づけています。回線交換（電話網）との対比で習ったはずのこの概念が、現場では「なぜ 1 本の回線で Web もメールも同時に流せるのか」の答えとして現れます。
      </Bridge>

      <Section>Web とは — 情報を閲覧・共有する仕組み</Section>
      <p>
        一方 Web（World Wide Web）は、インターネット上で情報を閲覧・共有するための仕組み・サービスです。あなたがブラウザで URL を開くと、次のような往復が起きています。
      </p>
      <p>
        ブラウザがリクエストを送り <span aria-hidden="true">→</span> インターネットを経由して Web サーバーに届き <span aria-hidden="true">→</span> サーバーが HTML や画像をレスポンスとして返す。この結果がページとして表示されます。つまり Web は、インターネットという道路の上を走る「情報配達サービス」なのです。
      </p>
      <p>
        Web を発明したティム・バーナーズ＝リーは、この仕組みを 3 つの発明の組み合わせとして設計しました。<strong>URL</strong>（資源の場所を一意に指す住所）、<strong>HTTP</strong>（その資源をやり取りする手順）、<strong>HTML</strong>（資源同士をリンクでつなぐ文書形式）です。「あらゆる文書に住所を与え、リンクでたどれるようにする」というハイパーテキストの発想が、Web を単なるファイル転送ではなく「情報の網（Web）」にしました。
      </p>

      <SubSection>クライアント・サーバという分散システムの型</SubSection>
      <p>
        ブラウザ（クライアント）とサーバが役割を分けて協調するこの形は、<strong>クライアント・サーバモデル</strong>と呼ばれる分散システムの代表的な構成です。処理を「要求する側」と「応答する側」に分けることで、1 台のサーバが世界中の多数のクライアントに同じサービスを提供できます。
      </p>

      <Bridge course="分散システム">
        講義で扱う<strong>クライアント・サーバモデル</strong>と<strong>ステートレス通信</strong>の理論が、Web ではそのまま HTTP の設計として現れます。「サーバが個々のクライアントの状態を持たない」ことでサーバを何台にでも水平にスケールできる——という分散システムの原則は、実務では「ロードバランサの背後にサーバを増やして負荷分散する」という日常の運用に直結します。座学で習う<strong>スケーラビリティ</strong>や<strong>耐障害性</strong>が、なぜ Web がこの形なのかを説明してくれます。
      </Bridge>

      <Section>両者の違いを表で整理する</Section>
      <ComparisonTable
        headers={["観点", "インターネット", "Web"]}
        rows={[
          ["意味", "通信インフラ", "閲覧・共有の仕組み"],
          ["例え", "道路・電気・水道", "その上を走るサービス"],
          ["役割", "データを届ける", "情報を見せる"],
          ["技術", "TCP/IP", "HTTP・URL・HTML"],
          ["代表例", "メール・FTP・SSH", "Web サイト・SNS・ブログ"],
        ]}
      />

      <Section>技術で見る階層構造</Section>
      <SubSection>インターネットを支える TCP/IP 4 階層</SubSection>
      <p>
        インターネットの通信は TCP/IP という 4 階層モデルで整理されます。上から順に役割が分かれており、Web を担う HTTP は一番上の層に位置します。
      </p>
      <KVList
        items={[
          { key: "アプリケーション層", val: "HTTP・SMTP・FTP など、用途ごとのプロトコル" },
          { key: "トランスポート層", val: "TCP・UDP（データを確実に/高速に運ぶ）" },
          { key: "インターネット層", val: "IP による経路制御（宛先へ届ける）" },
          { key: "ネットワークインターフェース層", val: "物理的な通信（配線・電波）" },
        ]}
      />
      <LayerStack
        layers={[
          { label: "アプリケーション層", sub: "HTTP / SMTP / FTP" },
          { label: "トランスポート層", sub: "TCP / UDP" },
          { label: "インターネット層", sub: "IP" },
          { label: "ネットワークインターフェース層", sub: "Ethernet / Wi-Fi" },
        ]}
        caption="TCP/IP 4 階層モデル"
      />

      <p>
        この階層構造の何が嬉しいのでしょうか。<strong>各層が下の層の詳細を知らなくてよい</strong>点です。HTTP を書くとき、私たちは「電波か有線か」「経路のどのルータを通るか」を一切気にしません。下の層が抽象化されているおかげで、Web エンジニアはアプリケーション層だけに集中できます。これは座学で習う<strong>関心の分離（separation of concerns）</strong>の実例そのものです。

      </p>

      <SubSection>Web を支える主要技術</SubSection>
      <p>
        HTTP/HTTPS でやり取りし、URL で場所を指定し、HTML で構造を、CSS で見た目を、JavaScript で動きを表現する。加えて画像や動画が組み合わさって、私たちが見る Web ページが成り立っています。
      </p>
      <KVList
        items={[
          { key: <Cmd>URL</Cmd>, val: "資源の住所（scheme://host:port/path?query）" },
          { key: <Cmd>HTTP/HTTPS</Cmd>, val: "資源をやり取りする手順（アプリケーション層）" },
          { key: <Cmd>HTML</Cmd>, val: "文書の構造とリンク" },
          { key: <Cmd>CSS</Cmd>, val: "見た目・レイアウト" },
          { key: <Cmd>JavaScript</Cmd>, val: "ブラウザ上の動的なふるまい" },
        ]}
      />

      <SubSection>1 本の URL を分解してみる</SubSection>
      <p>
        アドレスバーの 1 行は、実は上の階層構造を凝縮した情報です。分解すると「どのプロトコルで・どのホストの・どの資源を」が読み取れます。
      </p>
      <Code lang="text" filename="url-anatomy">{`https://nico-labo748.dev:443/articles/42?ref=top#section-2
└─┬─┘   └──────┬───────┘└┬┘└────┬────┘└──┬──┘└───┬───┘
scheme     host        port   path     query   fragment
（HTTP層） （DNSで解決）  （TCP層）（資源）  （引数） （ページ内位置）`}</Code>
      <p>
        <Cmd>host</Cmd> はこの後 DNS でIP アドレスに解決され（インターネット層）、<Cmd>port</Cmd> で TCP の接続先が決まり（トランスポート層）、<Cmd>path</Cmd> 以降を HTTP が運びます（アプリケーション層）。1 本の URL の中に TCP/IP の 4 階層が畳み込まれている、というわけです。
      </p>

      <Section>手を動かして層を体感する</Section>
      <p>
        「インターネット層」と「アプリケーション層」の違いは、身近なコマンドで体感できます。
      </p>
      <Steps>
        <Step title="インターネット層まで：ping で疎通を確認">
          <Cmd>ping</Cmd> は IP レベルで「相手まで届くか」だけを見ます。HTTP も Web サーバーも関係ありません。
          <Code lang="bash" filename="terminal">{`ping example.com
# → 応答が返れば「ネットワークは通じている」`}</Code>
        </Step>
        <Step title="アプリケーション層まで：curl で HTTP を話す">
          <Cmd>curl</Cmd> は実際に HTTP リクエストを送り、Web サービスとして応答が返るかを見ます。
          <Code lang="bash" filename="terminal">{`curl -I https://example.com
# → HTTP/1.1 200 OK が返れば「Web も動いている」`}</Code>
        </Step>
      </Steps>
      <Callout variant="tip" title="この 2 つが別レイヤーだと分かると障害切り分けが速い">
        実務でサイトが開けないとき、まず <Cmd>ping</Cmd> が通るか（ネットワークの問題か）、<Cmd>curl</Cmd> が応答するか（Web サーバー側の問題か）を分けて確認します。層を分けて考える習慣が、そのまま障害切り分けの手順になります。
      </Callout>

      <Callout variant="warn" title="よくある誤解：Web = インターネットではない">
        ネットにつながっていれば「基本的に」Web は使えますが、それは HTTP を扱う設定や Web サーバーの存在が前提です。ネットワークが通じることと、Web というサービスが動くことは別のレイヤーの話だと押さえておきましょう。上の <Cmd>ping</Cmd> は通るのに <Cmd>curl</Cmd> が失敗する、という状況はまさに「ネットワークは生きているが Web は死んでいる」ケースです。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "インターネット = 通信インフラ（道路）、Web = その上のサービス（配達）",
          "インターネット上にはメール・FTP・SSH・ゲームなど Web 以外のサービスも同居する",
          "インターネットは TCP/IP、Web は HTTP・URL・HTML が担う",
          "HTTP は TCP/IP 4 階層の最上位（アプリケーション層）に位置する",
        ]}
      />
    </>
  );
}

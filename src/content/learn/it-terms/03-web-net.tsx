import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-web-net",
  title: "Web・ネットワーク用語",
  description: "HTTP/HTTPS・DNS・IPアドレス・プロトコル・ポート・プロキシ・ルーティング・TCP/IP・VPN・Cookie/セッションなど、Web とネットワークの基本用語を収録。",
  domain: "it-terms",
  section: "web-net",
  order: 1,
  level: "intro",
  tags: ["Web", "ネットワーク", "用語"],
  updated: "2026-07-18",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        ブラウザとサーバーがどうやって通信しているか——その会話に出てくる用語です。Web の表側から、下を支えるネットワークの仕組みへと降りていきます。
      </Lead>

      <Section>Web の基本</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["HTTP", "HyperText Transfer Protocol", "Web でデータをやり取りするための約束事（プロトコル）"],
          ["HTTPS", "HTTP Secure", "HTTP を暗号化（SSL/TLS）して安全にしたもの"],
          ["URL", "Uniform Resource Locator", "Web 上の住所。どこにある何かを指す文字列"],
          ["ドメイン", "Domain", "URL やメールで使う識別名。example.com など"],
          ["DNS", "Domain Name System", "ドメイン名と IP アドレスを対応づけて引く仕組み"],
          ["Cookie", "Cookie", "訪問者のブラウザに保存する小さなデータ。ログイン状態などを保つ"],
          ["セッション", "Session", "サーバー側で管理する「一連のやり取り・ログイン状態」"],
          ["リクエスト / レスポンス", "Request / Response", "要求を送る / 結果が返る、の1往復"],
          ["API", "Application Programming Interface", "サービスの機能を外部から呼び出す窓口・約束事"],
          ["REST", "REST", "URL とHTTPメソッドでリソースを操作する API の主流スタイル"],
        ]}
      />

      <Section>ネットワークの基本</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["プロトコル", "Protocol", "通信のやり方を定めた約束事"],
          ["TCP/IP", "TCP/IP", "インターネットの最も基本的な通信の仕組み（プロトコル群）"],
          ["IP アドレス", "IP Address", "ネットワーク上の宛先を表す番号"],
          ["ポート", "Port", "1台の中で「どのサービス宛か」を区別する番号。HTTP=80, HTTPS=443 など"],
          ["パケット", "Packet", "通信データを小さく分割した単位"],
          ["ルータ", "Router", "複数のネットワークをつなぎ、通信を中継する機器"],
          ["ルーティング", "Routing", "通信を目的地まで届ける最適な経路を決めること"],
          ["ゲートウェイ", "Gateway", "異なるネットワークをつなぐ出入り口"],
          ["LAN / WAN", "LAN / WAN", "狭い範囲のネットワーク / 地理的に離れた拠点を結ぶネットワーク"],
          ["帯域 / トラフィック", "Bandwidth / Traffic", "回線の太さ（通信容量）/ 実際に流れる通信量"],
          ["レイテンシ", "Latency", "通信の応答にかかる遅延時間"],
        ]}
      />

      <Section>中継・接続の仕組み</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["プロキシ", "Proxy", "通信を代理で中継するサーバー"],
          ["ロードバランサ", "Load Balancer", "アクセスを複数サーバーに振り分けて負荷を分散する仕組み"],
          ["CDN", "Content Delivery Network", "コンテンツを各地に分散配置し、近い場所から高速配信する仕組み"],
          ["VPN", "Virtual Private Network", "公衆回線上に仮想的な専用線を作り、安全に接続する仕組み"],
          ["ファイアウォール", "Firewall", "通信を許可/拒否して不正アクセスを防ぐ仕組み"],
          ["SSH", "Secure Shell", "リモートのサーバーに安全に接続・操作するためのプロトコル"],
          ["SSL / TLS", "SSL / TLS", "通信を暗号化し、盗聴・改ざんから守る技術"],
          ["Webhook", "Webhook", "イベント発生時に、相手へ自動でHTTP通知を送る仕組み"],
        ]}
      />

      <Section>HTTP をもう少し詳しく</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["HTTP メソッド", "GET / POST / PUT / DELETE", "取得 / 作成 / 更新 / 削除など、操作の種類を表す動詞"],
          ["ステータスコード", "Status Code", "結果を表す3桁の番号。2xx=成功, 4xx=呼び出し側, 5xx=サーバ側"],
          ["ヘッダ / ボディ", "Header / Body", "付帯情報（種類・認証など）/ 本体のデータ"],
          ["クエリパラメータ", "Query Parameter", "URL の ? 以降に付ける絞り込み・指定の値"],
          ["CORS", "Cross-Origin Resource Sharing", "別ドメインへのアクセスを許可/制限するブラウザの仕組み"],
          ["MIME タイプ", "MIME Type", "データの種類を示す表記。text/html, application/json など"],
          ["JSON / XML / YAML", "JSON / XML / YAML", "データをやり取り・記述するための代表的な形式"],
          ["WebSocket / SSE", "WebSocket / Server-Sent Events", "双方向のリアルタイム通信 / サーバーからの一方向通知"],
          ["レートリミット", "Rate Limit", "一定時間あたりの呼び出し回数の上限"],
          ["ページネーション", "Pagination", "大量データをページ単位に分けて返す仕組み"],
          ["API キー / ベアラートークン", "API Key / Bearer Token", "API 利用者を識別する鍵 / 認証済みを示す引換券"],
        ]}
      />

      <Section>ネットワークをもう少し詳しく</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["OSI 参照モデル", "OSI Model", "通信の役割を7つの層に分けて整理した基本モデル"],
          ["リバースプロキシ", "Reverse Proxy", "サーバー側に置き、外からの通信を受けて内部へ振り分ける中継"],
          ["名前解決", "Name Resolution", "ドメイン名から IP アドレスを引くこと（DNS の働き）"],
          ["サブネット / CIDR", "Subnet / CIDR", "ネットワークを区切る単位 / その範囲の表記（/24 など）"],
          ["MAC アドレス", "MAC Address", "機器ごとに割り振られた物理的な識別番号"],
          ["NAT", "Network Address Translation", "プライベート IP と グローバル IP を変換する仕組み"],
          ["DHCP", "DHCP", "接続機器に IP アドレスを自動で割り当てる仕組み"],
          ["TLS ハンドシェイク / 証明書", "TLS Handshake / Certificate", "暗号通信を始める手続き / 通信相手の正当性を示す電子的な証明書"],
          ["HTTP/2・HTTP/3", "HTTP/2 / HTTP/3", "通信を高速化した新しい HTTP。HTTP/3 は QUIC を使う"],
          ["IPv4 / IPv6", "IPv4 / IPv6", "従来の IP アドレス方式 / 枯渇に対応した新しい方式"],
        ]}
      />

      <Callout variant="info" title="仕組みから学ぶなら">
        HTTP・DNS・Cookie・セッション・API・CORS などは「Web基礎」コース、TCP/IP やルーティングは「インフラ基礎」で詳しく扱っています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Web: HTTP(S)=通信規約、URL/ドメイン=住所、DNS=名前を IP に変換",
          "状態保持: Cookie=ブラウザ側、セッション=サーバー側",
          "ネットワーク: プロトコル=約束事、IP=宛先、ポート=サービスの区別、ルーティング=経路決定",
          "中継: プロキシ=代理中継、ロードバランサ=負荷分散、CDN=近くから配信、VPN=仮想専用線",
        ]}
      />
    </>
  );
}

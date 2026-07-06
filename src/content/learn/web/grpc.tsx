import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, TipBox, Bridge, Steps, Step, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "grpc",
  title: "gRPC 入門",
  description: "HTTP/2 と Protocol Buffers を使う高速な RPC フレームワーク gRPC。.proto 定義、4 種の通信方式、コード生成、REST との比較を押さえる。",
  domain: "web",
  section: "api",
  order: 7,
  level: "practice",
  tags: ["gRPC", "ProtocolBuffers", "マイクロサービス"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>gRPC</strong> は Google 発の高速な <strong>RPC（Remote Procedure Call）</strong>フレームワークです。「サーバ上の関数を、まるでローカル関数のように呼ぶ」という発想で、HTTP/2 と Protocol Buffers を組み合わせ、低レイテンシで型安全な通信を実現します。
      </Lead>

      <Section>gRPC とは — RPC の考え方</Section>
      <p>
        REST が「リソースを URL で表し、HTTP メソッドで操作する」のに対し、RPC は「<Cmd>getUser(id)</Cmd> のようなメソッドを直接呼ぶ」スタイルです。gRPC はこの RPC を、後述の <Cmd>.proto</Cmd> という契約ファイルから自動生成したクライアント／サーバのコードで実現します。
      </p>
      <p>
        RPC の狙いは「<strong>ネットワーク越しの呼び出しを、ローカル関数呼び出しのように書けるようにする</strong>」ことです。本来なら、引数をバイト列に変換して（シリアライズ）送信し、相手はそれを復元して（デシリアライズ）関数を実行し、戻り値をまた変換して返す、という煩雑な処理が必要です。gRPC はこの一連を自動生成コード（スタブ）に隠蔽し、呼び出し側はただ <Cmd>client.GetUser(req)</Cmd> と書くだけで済みます。</p>

      <Bridge course="分散システム">
        RPC（Remote Procedure Call）は分散システムの基礎概念そのものです。授業で扱う「透過性（transparency）」— リモートの呼び出しをローカルと同じように見せる — を体現しますが、同時に「<strong>ネットワークは信頼できない</strong>」という分散システムの現実（遅延・部分故障・タイムアウト）も背負います。だからこそ gRPC には deadline（締切）・リトライ・ステータスコードが組み込まれています。「ローカル関数と完全に同じではない」という <em>Fallacies of Distributed Computing</em> の教訓が、API 設計に直結している例です。
      </Bridge>

      <Section>HTTP/2 が支える速さ</Section>
      <p>
        gRPC は通信基盤に <strong>HTTP/2</strong> を使います。HTTP/2 の特徴が、そのまま gRPC の強みになります。
      </p>
      <ul>
        <li><strong>多重化（multiplexing）</strong> — 1 本の TCP コネクション上で複数のストリームを並行できる。HTTP/1.1 では 1 コネクション＝1 往復で、前のレスポンスを待つ間ほかが詰まる「Head-of-Line ブロッキング」が起きていた。</li>
        <li><strong>バイナリフレーム</strong> — リクエスト/レスポンスをフレームという単位のバイナリに分割して送る。テキストのパースが要らず軽量。</li>
        <li><strong>ヘッダ圧縮（HPACK）</strong> — 繰り返し送るヘッダを圧縮・差分化して転送量を減らす。</li>
        <li><strong>双方向ストリーミング</strong> — 1 本のコネクション上でサーバとクライアントが同時に送り合える。</li>
      </ul>

      <Bridge course="ネットワーク（コンピュータネットワーク）">
        gRPC の速さは、授業で学ぶ TCP/IP と HTTP の階層構造をそのまま活用したものです。<strong>多重化</strong>は「1 本の TCP コネクション（＝1 回の 3-way handshake と TLS ネゴシエーション）を張り直さずに使い回す」ことでコネクション確立コストを節約します。<strong>Head-of-Line ブロッキング</strong>や<strong>フロー制御（ウィンドウ）</strong>といった TCP の講義で出てくる概念が、HTTP/2 という上位層でどう再設計されたかを追うと、レイヤの積み重ねが実感できます。逆に「TCP レベルの HoL は HTTP/2 でも残る（だから QUIC/HTTP/3 が UDP ベースになった）」という話まで見ると、なぜ次の世代が要るのかも見えてきます。
      </Bridge>

      <Section>Protocol Buffers — .proto で契約を書く</Section>
      <p>
        gRPC のデータ形式は <strong>Protocol Buffers（protobuf）</strong>です。<Cmd>.proto</Cmd> ファイルにサービスとメッセージを型で定義し、これが唯一の契約になります。JSON よりコンパクトなバイナリにシリアライズされるため通信量が小さく、パースも速いのが特徴です。
      </p>

      <Code lang="protobuf" filename="user.proto">{`syntax = "proto3";

package user.v1;

message GetUserRequest {
  string id = 1;
}

message User {
  string id = 1;
  string name = 2;
  int32 age = 3;
}

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
}`}</Code>

      <p>各フィールドの <Cmd>= 1</Cmd> は「フィールド番号」で、バイナリ上の識別子です。名前ではなく番号で符号化するため、互換性を保ちやすい設計になっています。</p>

      <SubSection>なぜバイナリが速いのか</SubSection>
      <p>
        JSON は <Cmd>&#123;"age": 30&#125;</Cmd> のように<strong>キー名を文字列でそのまま含む</strong>テキスト形式です。protobuf はキー名を送らず、代わりに「フィールド番号 3、型は可変長整数、値は 30」という数バイトに符号化します。フィールド番号とワイヤ型（wire type）をまとめた 1 バイトのタグ＋値だけを並べるため、同じデータでも JSON より格段に小さく、パースも構文解析が不要で高速です。
      </p>

      <Bridge course="符号理論 / データ表現">
        Protocol Buffers は、講義で学ぶ<strong>符号化（encoding）とシリアライズ</strong>の実践例です。整数を <strong>Varint（可変長符号）</strong>で符号化する — 小さい数は 1 バイト、大きい数だけ多バイト使う — のは、情報量に応じてビット長を変える情報理論的な発想そのものです。負数を効率よく表す <strong>ZigZag 符号化</strong>や、フィールド番号＋型を 1 バイトに詰めるタグ設計も同系統。さらに <Cmd>.proto</Cmd> は <strong>IDL（Interface Definition Language）</strong>であり、「データの意味（スキーマ）と表現（バイト列）を分離する」という形式言語の考え方が効いています。JSON との差は「人間可読性 vs 転送効率」というトレードオフの好例です。
      </Bridge>

      <Callout variant="tip" title="スキーマ進化 — 番号は変えない・消さない・再利用しない">
        フィールド番号で符号化するおかげで、<strong>フィールドの追加</strong>は後方互換を保てます（古いクライアントは知らない番号を無視する）。ただし既存の番号を<strong>変える・別の型に再利用する</strong>と、古いバイナリが誤って解釈して壊れます。使わなくなったフィールドは <Cmd>reserved</Cmd> で番号を予約し、二度と再利用しないのが鉄則です。これが分散システムで「新旧のサービスが同時に動く」状況を安全に乗り切る鍵になります。
      </Callout>

      <Section>4 種類の RPC</Section>
      <p>gRPC は HTTP/2 のストリーミングを活かし、4 つの通信パターンを提供します。</p>
      <ComparisonTable
        headers={["種類", "リクエスト", "レスポンス", "用途の例"]}
        rows={[
          ["単一（Unary）", "1", "1", "通常の関数呼び出し・データ取得"],
          ["サーバストリーミング", "1", "多", "検索結果を逐次配信・進捗通知"],
          ["クライアントストリーミング", "多", "1", "ログやセンサ値をまとめて送信"],
          ["双方向ストリーミング", "多", "多", "チャット・リアルタイム同期"],
        ]}
      />

      <Code lang="protobuf" filename="streaming">{`service ChatService {
  // 双方向: どちらも stream を付ける
  rpc Chat (stream Message) returns (stream Message);
}`}</Code>

      <SequenceDiagram
        actors={["クライアント", "サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① リクエスト (stream)" },
          { from: 0, to: 1, label: "② 続けて送信" },
          { from: 1, to: 0, label: "③ レスポンス (stream)", cta: true },
          { from: 1, to: 0, label: "④ 続けて返す", cta: true },
        ]}
        caption="双方向ストリーミング RPC"
      />

      <Section>コード生成</Section>
      <p>
        <Cmd>.proto</Cmd> からコンパイラ（<Cmd>protoc</Cmd> や <Cmd>buf</Cmd>）で各言語のコードを生成します。型付きのクライアントとサーバの土台が自動で作られるため、手書きのシリアライズは不要です。
      </p>

      <Code lang="bash" filename="terminal">{`# buf を使った生成の例
buf generate

# protoc を直接使う例（Go 向け）
protoc --go_out=. --go-grpc_out=. user.proto`}</Code>

      <p>開発の流れは「契約を書く → 生成 → 実装」の 3 段です。</p>
      <Steps>
        <Step title=".proto を書く">
          サービスとメッセージを型で定義する。これがクライアントとサーバの唯一の契約になる。
        </Step>
        <Step title="コード生成する">
          <Cmd>buf generate</Cmd> や <Cmd>protoc</Cmd> で各言語のスタブ（型・シリアライズ・通信の土台）を生成する。手書きしない。
        </Step>
        <Step title="ビジネスロジックだけ実装する">
          生成されたサーバ interface を実装し、生成されたクライアントを呼ぶ。通信の中身は書かなくてよい。
        </Step>
      </Steps>

      <Callout variant="tip" title="ブラウザからは gRPC-Web / Connect">
        ブラウザは生の HTTP/2 トレーラを扱えないため、フロントエンドから呼ぶ場合は <Cmd>gRPC-Web</Cmd> や <Cmd>Connect</Cmd> といったプロトコルを間に挟むのが一般的です。
      </Callout>

      <Section>REST との比較</Section>
      <ComparisonTable
        headers={["観点", "gRPC", "REST"]}
        rows={[
          ["データ形式", "Protocol Buffers（バイナリ）", "JSON（テキスト）"],
          ["通信基盤", "HTTP/2 必須", "HTTP/1.1 でも可"],
          ["型安全", "強い（.proto から生成）", "弱い（別途 OpenAPI 等が必要）"],
          ["ストリーミング", "双方向まで標準対応", "限定的（SSE / WebSocket 併用）"],
          ["ブラウザ直呼び", "そのままは不可（gRPC-Web 経由）", "容易"],
        ]}
      />

      <Section>主な用途 — マイクロサービス</Section>
      <p>
        gRPC が最も活きるのは、<strong>サービス間（内部）通信</strong>です。マイクロサービス構成では多数のサービスが高頻度で通信するため、低レイテンシ・型安全・双方向ストリーミングが強力に効きます。一方、外部公開 API やブラウザ直呼びには REST / GraphQL の方が扱いやすい、という使い分けが定石です。
      </p>
      <SubSection>使いどころの目安</SubSection>
      <KVList
        items={[
          { key: "内部マイクロサービス間", val: "◎ 低レイテンシ・型安全が効く。gRPC の主戦場" },
          { key: "モバイル ↔ バックエンド", val: "○ 通信量が小さく電池に優しい。protobuf の小ささが効く" },
          { key: "ブラウザ ↔ サーバ", val: "△ 直呼び不可。gRPC-Web / Connect を挟む必要がある" },
          { key: "外部公開・パートナー向け API", val: "△ REST / GraphQL の方が扱いやすくエコシステムも広い" },
        ]}
      />
      <TipBox>
        「内部は gRPC、外部公開は REST（または GraphQL）」の二段構えが実務の定番です。ゲートウェイで外向きの REST を受け、内部のサービス間は gRPC で結ぶ、という構成が多く見られます。
      </TipBox>

      <Callout variant="warn" title="デバッグしにくさが落とし穴">
        バイナリなので <Cmd>curl</Cmd> で覗いても中身が読めず、パケットキャプチャも解読しづらいのが難点です。<Cmd>grpcurl</Cmd> や <Cmd>buf curl</Cmd>、<Cmd>Postman</Cmd> の gRPC 対応など、専用ツールを前提に運用します。「速い・小さい」の代償として「人間が読めない」点は最初に押さえておきましょう。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "gRPC は HTTP/2 + Protocol Buffers による高速・型安全な RPC フレームワーク",
          ".proto ファイルが唯一の契約で、そこからクライアント／サーバのコードを生成する",
          "単一・サーバ／クライアントストリーミング・双方向の 4 パターンをサポート",
          "内部のマイクロサービス間通信が主戦場。外部公開は REST / GraphQL と使い分ける",
        ]}
      />
    </>
  );
}

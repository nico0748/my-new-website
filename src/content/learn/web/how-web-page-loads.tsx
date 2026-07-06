import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Divider } from "../../../components/learn/kit";
import { SequenceDiagram, DomTreeFigure } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "how-web-page-loads",
  title: "Web ページが表示されるまでの流れ",
  description: "URL を入力してから画面に表示されるまでの 11 ステップ。DNS・TCP・TLS・HTTP・レンダリングの流れを俯瞰する。",
  domain: "web",
  section: "web-basics",
  order: 4,
  level: "basic",
  tags: ["Web", "HTTP", "DNS", "ブラウザ"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        アドレスバーに URL を打って Enter を押す。たったこれだけの操作の裏で、ブラウザ・DNS・サーバ・ネットワークが連携し、十を超える工程が数百ミリ秒のうちに走ります。全体像を 11 ステップで俯瞰すると、Web の仕組みが一望できます。
      </Lead>

      <SequenceDiagram
        actors={["ブラウザ", "DNS", "Web サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① ドメインを問い合わせ" },
          { from: 1, to: 0, label: "② IP アドレスを返す", cta: true },
          { from: 0, to: 2, label: "③ TCP/TLS 接続 + HTTP リクエスト" },
          { from: 2, to: 0, label: "④ HTML レスポンス", cta: true },
        ]}
        caption="URL 入力から HTML 取得までの往復"
      />

      <Section>URL 入力から表示までの 11 ステップ</Section>
      <Steps>
        <Step title="1. URL 入力">
          ブラウザに <Cmd>https://example.com</Cmd> のようなアドレスを入力します。
        </Step>
        <Step title="2. DNS で IP を取得">
          ドメイン名を DNS に問い合わせ、対応する IP アドレス（例 <Cmd>93.184.216.34</Cmd>）を得ます。
        </Step>
        <Step title="3. TCP 接続（3 ウェイハンドシェイク）">
          <Cmd>SYN</Cmd> <span aria-hidden="true">→</span> <Cmd>SYN/ACK</Cmd> <span aria-hidden="true">→</span> <Cmd>ACK</Cmd> の 3 往復で接続を確立。ポートは HTTP が 80、HTTPS が 443 です。
        </Step>
        <Step title="4. TLS/SSL ハンドシェイク（HTTPS のみ）">
          鍵交換と証明書の確認を行い、以降の通信を暗号化します。
        </Step>
        <Step title="5. HTTP リクエスト送信">
          取得したいリソースを指定してリクエストを送ります。
        </Step>
        <Step title="6. Web サーバーが処理">
          Nginx / Apache がリクエストを受け、PHP・Python・Node.js などのアプリが MySQL・PostgreSQL などの DB と連携して結果を組み立てます。
        </Step>
        <Step title="7. HTTP レスポンス送信">
          <Cmd>200 OK</Cmd> とともに <Cmd>Content-Type: text/html</Cmd> などのヘッダと本文を返します。
        </Step>
        <Step title="8. ブラウザが HTML を受信・解析">
          受け取った HTML を先頭から解析していきます。
        </Step>
        <Step title="9. リソースを並行取得">
          解析中に見つかった CSS・JS・画像・フォントを並行してダウンロードします。
        </Step>
        <Step title="10. レンダリング">
          HTML 解析 <span aria-hidden="true">→</span> CSSOM 構築 <span aria-hidden="true">→</span> レンダリングツリー <span aria-hidden="true">→</span> レイアウト <span aria-hidden="true">→</span> ペイントの順に描画準備が進みます。
        </Step>
        <Step title="11. ページ表示">
          描画が完了し、画面にページが現れます。
        </Step>
      </Steps>

      <Section>DNS — 名前を住所に変える分散データベース</Section>
      <p>
        ステップ 2 の DNS は、単なる変換表ではありません。世界中に分散した<strong>階層型のデータベース</strong>で、<Cmd>www.example.com</Cmd> を右から左（<Cmd>.</Cmd> ルート → <Cmd>com</Cmd> → <Cmd>example</Cmd>）へたどって解決します。1 か所に全ドメインを持たせず、責任を委譲していくこの構造が、インターネット規模の名前解決を可能にしています。
      </p>
      <Code lang="bash" filename="terminal">{`dig +short www.example.com
# → 93.184.216.34   （ドメイン名 → IP アドレス）

# 解決の階層をたどって見る
dig +trace www.example.com
# → ルート → com → example.com の順に問い合わせが進む`}</Code>

      <Bridge course="ネットワーク（DNS・名前解決）/ 分散システム">
        講義の<strong>DNS の階層構造</strong>と<strong>分散システムの委譲・キャッシュ</strong>がそのまま現れます。「ルートから権威サーバへ委譲する木構造」「各段でキャッシュ（TTL）を効かせて負荷を下げる」という設計は、座学で習う<strong>階層的な名前空間</strong>と<strong>キャッシュの一貫性</strong>の実例です。1 台に集中させず責任を分割する——という分散システムの基本方針が、なぜ DNS がこの形なのかを説明します。
      </Bridge>

      <Section>TCP と TLS — 信頼できる接続を作る</Section>
      <p>
        ステップ 3 の TCP 3 ウェイハンドシェイクは、通信を始める前に<strong>両者が「話す準備ができた」と確認し合う</strong>手順です。<Cmd>SYN</Cmd>（つなぎたい）→ <Cmd>SYN/ACK</Cmd>（いいよ、そちらは？）→ <Cmd>ACK</Cmd>（こちらもいい）の 3 往復で、順序保証・再送・輻輳制御を備えた「信頼できるパイプ」ができます。
      </p>
      <KVList
        items={[
          { key: "TCP が保証するもの", val: "パケットの順序・欠落時の再送・流量の調整" },
          { key: "UDP との違い", val: "UDP は保証なしで速い（動画・ゲーム向き）" },
          { key: "TLS が足すもの", val: "暗号化・改ざん検知・相手が本物かの証明書検証" },
          { key: "ポート", val: "HTTP=80 / HTTPS=443（どのサービス宛かの番号）" },
        ]}
      />
      <p>
        TLS ハンドシェイク（ステップ 4）では、公開鍵暗号で「盗聴されても解読できない共通鍵」を安全に共有し、以降はその共通鍵で高速に暗号化します。証明書によって「接続先が本物の example.com か」も検証されます。
      </p>

      <Bridge course="ネットワーク（TCP）/ 情報セキュリティ（暗号）">
        <strong>TCP の 3 ウェイハンドシェイク</strong>と<strong>フロー制御・輻輳制御</strong>はネットワークの中心的なテーマで、講義で状態遷移図（<Cmd>SYN_SENT</Cmd> → <Cmd>ESTABLISHED</Cmd> …）として習います。TLS のほうは<strong>公開鍵暗号・共通鍵暗号・ハッシュ</strong>という暗号理論の合わせ技で、「公開鍵で鍵を安全に配り、以降は速い共通鍵で暗号化する」というハイブリッド方式は暗号の授業の定番です。座学のプロトコル状態機械と暗号アルゴリズムが、1 回のページ表示の冒頭数十ミリ秒に凝縮されています。
      </Bridge>

      <Section>ステップ 5 のリクエストと 7 のレスポンス</Section>
      <p>
        中核となる HTTP のやり取りは、次のようなテキストで行われます。まずブラウザが送るリクエスト。
      </p>
      <Code lang="http" filename="request">{`GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html`}</Code>
      <p>これに対してサーバが返すレスポンス。</p>
      <Code lang="http" filename="response">{`HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!DOCTYPE html> ...`}</Code>

      <Section>各ステップの時間の目安</Section>
      <p>
        1 回のアクセスにかかる時間は、内訳を見ると工程ごとに大きさが違います。実測の目安は次のとおりです。
      </p>
      <ComparisonTable
        headers={["工程", "時間の目安"]}
        rows={[
          ["DNS 解決", "10〜50ms"],
          ["TCP 接続", "20〜50ms"],
          ["TLS ハンドシェイク", "50〜200ms"],
          ["サーバー処理", "100〜500ms"],
          ["合計", "数百 ms 〜 数秒"],
        ]}
      />

      <Callout variant="tip" title="2 回目以降が速い理由">
        DNS の結果や CSS・JS・画像はキャッシュされるため、2 回目以降のアクセスは多くの工程を省略でき高速化します。さらに CDN を使っている場合は、ユーザーから最も近いエッジサーバーへルーティングされ、物理的な距離による遅延も抑えられます。
      </Callout>

      <Section>ブラウザの内側 — プロセスとレンダリング</Section>
      <p>
        ステップ 8〜10 はブラウザの内部で起きています。現代のブラウザは 1 つのアプリに見えて、実は<strong>複数のプロセスに分かれて動く並行システム</strong>です。タブごとにレンダラプロセスを分離することで、1 つのタブがクラッシュしても他が巻き込まれず、悪意あるページが他タブのデータに触れられないよう<strong>プロセス間で隔離（サンドボックス）</strong>しています。
      </p>
      <SubSection>レンダリングパイプライン</SubSection>
      <p>
        受け取った HTML と CSS は、次の順で画面のピクセルへ変換されます。各段が前段の出力を入力にする<strong>パイプライン処理</strong>です。
      </p>
      <KVList
        items={[
          { key: "1. パース", val: "HTML → DOM ツリー、CSS → CSSOM ツリー" },
          { key: "2. レンダリングツリー", val: "DOM と CSSOM を合成（表示される要素だけ）" },
          { key: "3. レイアウト", val: "各要素の位置と大きさを計算（リフロー）" },
          { key: "4. ペイント", val: "色・文字・境界をピクセルに描く" },
          { key: "5. コンポジット", val: "レイヤーを重ねて最終画面を合成（GPU）" },
        ]}
      />
      <p>
        パースの最初の成果物が <strong>DOM ツリー</strong>です。ブラウザは HTML のタグの入れ子を、そのまま親子関係を持つ木構造に変換します。この木の各ノードが、画面上のひとつのブロックに対応します。左のツリーと右の表示を見比べてみましょう。
      </p>
      <DomTreeFigure caption="HTML の入れ子構造 → DOM ツリー → 画面上のブロック。タグの親子関係がそのまま表示の入れ子になる。" />
      <Callout variant="warn" title="JS は解析を止める（レンダリングブロック）">
        <Cmd>script</Cmd> はデフォルトで HTML 解析を一時停止させます。DOM を書き換える可能性があるためです。だから重い JS はページ末尾に置くか、<Cmd>defer</Cmd> / <Cmd>async</Cmd> 属性で「解析を止めない」ように指定するのが定石です。座学の「逐次実行と並行実行」の話が、ここで表示速度に直結します。
      </Callout>

      <Bridge course="OS（プロセス・並行処理）/ 計算機アーキテクチャ（キャッシュ・メモリ階層）">
        ブラウザのマルチプロセス設計は、OS で習う<strong>プロセス分離・仮想メモリ・サンドボックス</strong>の応用そのものです。「タブ＝プロセスで隔離し、権限を最小化する」という発想は保護リングやプロセス間通信（IPC）の理論に基づきます。また「2 回目が速い」のは、計算機アーキテクチャで習う<strong>キャッシュ（メモリ階層）</strong>と同じ原理——一度使ったデータを近くに置いて再アクセスを速くする——が、DNS キャッシュ・ブラウザキャッシュ・CDN という多段のキャッシュ階層として現れているからです。CPU の L1/L2 キャッシュで習った「局所性の原理」が、Web の速度最適化の土台になっています。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "表示までの流れは DNS → TCP → TLS → HTTP → レンダリング → 表示の順に進む",
          "DNS はルートから委譲してたどる階層型の分散データベース",
          "TCP は SYN → SYN/ACK → ACK の 3 ウェイハンドシェイクで信頼できる接続を確立する",
          "TLS は公開鍵で共通鍵を配り、以降を高速に暗号化するハイブリッド方式",
          "レンダリングは DOM/CSSOM → レイアウト → ペイント → コンポジットのパイプライン",
          "キャッシュ（DNS・ブラウザ・CDN）はメモリ階層と同じ局所性の原理で速くする",
        ]}
      />
    </>
  );
}

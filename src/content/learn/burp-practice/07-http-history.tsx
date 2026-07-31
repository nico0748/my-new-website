import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-07-http-history",
  title: "7. HTTP history — 通信ログを読み解く",
  description: "Proxy が記録し続ける HTTP history の列の意味、フィルタとハイライトによるノイズ削減、WebSocket history、そして「怪しい通信」を見つける視点を身につける。",
  domain: "burp-practice",
  section: "proxy",
  order: 4,
  level: "basic",
  tags: ["Burp Suite", "HTTP history", "フィルタ", "WebSocket"],
  updated: "2026-07-28",
  minutes: 55,
};

export default function Article() {
  return (
    <>
      <Lead>
        Intercept を off にしていても、通信は自動的に HTTP history へ記録され続けます。この章では、その膨大なログから必要な情報を素早く見つけ出す読み方とフィルタを身につけます。（目標学習時間：55分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>HTTP history の各列が何を表しているか説明できる</li>
          <li>フィルタバーでノイズを減らし、見たいリクエストだけに絞り込める</li>
          <li>Notes・ハイライトで気になる通信に印を付けられる</li>
          <li>WebSocket history の見方が分かる</li>
          <li>「怪しい通信を探す視点」を持ってログを眺められる</li>
        </ul>
      </Callout>

      <Section>1. HTTP history の列の意味</Section>
      <p>
        <Cmd>Proxy → HTTP history</Cmd> には、Burp を経由したすべてのリクエスト／レスポンスが1行ずつ記録されます。列は多いですが、覚えるべきものは限られています。
      </p>
      <KVList
        items={[
          { key: "#", val: "記録順の連番。上ほど古い" },
          { key: "Host", val: "接続先ホスト名（スキームやポートも含む場合あり）" },
          { key: "Method", val: "GET / POST / PUT / DELETE などの HTTP メソッド" },
          { key: "URL", val: "リクエスト先のパス・クエリ文字列" },
          { key: "Params", val: "クエリ・ボディ・Cookie にパラメータが含まれているかのフラグ" },
          { key: "Edited", val: "Intercept やその他の機能でリクエストが書き換えられたか" },
          { key: "Status", val: "レスポンスのステータスコード（200・302・404・500 等）" },
          { key: "Length", val: "レスポンスのボディサイズ（バイト）" },
          { key: "MIME type", val: "レスポンスの Content-Type から判定した種別（HTML/JSON/JS/CSS/画像 等）" },
          { key: "Extension", val: "URL のファイル拡張子（.js .png .php 等）" },
          { key: "Title", val: "HTML レスポンスの <title> の内容" },
          { key: "Notes", val: "自分で付けたメモ（後述）" },
          { key: "TLS", val: "TLS 接続かどうか（HTTPS 通信の識別）" },
          { key: "IP", val: "接続先の IP アドレス" },
          { key: "Cookies", val: "送受信された Cookie の有無" },
          { key: "Time", val: "リクエストが発生した時刻" },
          { key: "Listener port", val: "どの Proxy Listener 経由で記録されたか（複数 Listener 運用時に有用）" },
        ]}
      />
      <p>
        列はドラッグで並び替え・非表示にでき、右クリックで表示する列を選べます。最初は <Cmd>Method / URL / Status / Length / MIME type</Cmd> あたりに絞ると見やすくなります。
      </p>
      <Figure
        src="/learn/shots/burp-practice/burp-07-http-history-01.svg"
        alt="HTTP history の列ヘッダと、それに対応する複数行のリクエスト一覧"
        caption="HTTP history の一覧。Method・URL・Status・Length・MIME type あたりがまず見るべき列"
      />

      <Section>2. フィルタバーでノイズを減らす</Section>
      <p>
        1回のブラウジングで数百行が一気に記録されることも珍しくありません。一覧の上にあるフィルタバー（<Cmd>Filter: ...</Cmd> と表示された部分をクリックして展開）で絞り込みます。
      </p>
      <ComparisonTable
        headers={["フィルタ項目", "用途"]}
        rows={[
          ["Filter by request type", "In-scope items のみ表示（後述の Target で設定したスコープに限定）"],
          ["Filter by MIME type", "HTML/CSS/JS/画像などを個別にオン・オフ。まず画像・フォントを消すとログが一気に見やすくなる"],
          ["Filter by status code", "2xx/3xx/4xx/5xx で絞り込み。エラー応答だけ見たい時などに使う"],
          ["Search term", "URL やボディに含まれる文字列で検索"],
          ["Filter by file extension", "拡張子で絞り込み（.js だけ見る、.png を除外する 等）"],
          ["Annotation", "コメントが付いている行、ハイライトされている行だけ表示"],
        ]}
      />
      <Callout variant="tip" title="Show only in-scope items">
        Target タブで検証対象のドメインを Scope に登録しておくと、フィルタの <Cmd>Show only in-scope items</Cmd> にチェックを入れるだけで、analytics や CDN、無関係な広告ドメインへの通信を一括で除外できます。Scope の設定方法は「9. Target サイトマップとスコープ」で詳しく扱います。
      </Callout>

      <Section>3. 検索とハイライトで印を付ける</Section>
      <p>
        気になる行は、右クリックメニューの <Cmd>Highlight</Cmd> で色を付けたり、<Cmd>Add note</Cmd> でメモを残せます。Burp Suite Community Edition には保存機能やプロジェクトファイルの永続化に一部制限がありますが、<strong>作業中の一覧を見やすく整理する手段としては Notes とハイライトが実質的に唯一の記録手段</strong>です。
      </p>
      <Steps>
        <Step title="怪しい行を右クリック">認証関連や ID を含むパラメータが見える行など、後で見返したい行を選ぶ。</Step>
        <Step title="Highlight で色を付ける">好きな色を選択。一覧上で目立つようになる。</Step>
        <Step title="Add note でメモを残す">「価格書き換え可能性あり」のような短いメモを残しておくと、後から Notes 列で検索できる。</Step>
      </Steps>
      <Callout variant="warn" title="Community Edition の制限を意識する">
        Community Edition ではプロジェクトファイルとして保存できない（またはセッション終了で消える）場合があります。長時間の検証では、重要な発見をこまめに Notes に残す、あるいは Repeater のタブ名を変えて残す、といった工夫で情報を失わないようにしましょう。
      </Callout>

      <Section>4. WebSocket history の見方</Section>
      <p>
        WebSocket を使うアプリ（チャット、リアルタイム通知など）では、通常の HTTP history とは別に <Cmd>Proxy → WebSockets history</Cmd> にメッセージが記録されます。
      </p>
      <ul>
        <li>1行が1つの WebSocket メッセージ（HTTP のようなリクエスト/レスポンスの往復ではなく、双方向にメッセージが流れる）</li>
        <li><Cmd>Direction</Cmd> 列で「クライアント → サーバー」か「サーバー → クライアント」かを判別する</li>
        <li>WebSocket 接続を開始した最初のハンドシェイク（Upgrade: websocket のリクエスト）は通常の HTTP history 側に記録される</li>
      </ul>
      <Callout variant="info" title="WebSocket と Repeater/Intruder">
        WebSocket メッセージも Repeater 相当の機能（Burp では WebSocket 用の再送 UI）に送って手動で書き換え・再送信できます。詳細な操作は補助ツール群の章で扱います。
      </Callout>

      <Section>5. 「怪しい通信を探す視点」を持つ</Section>
      <p>
        フィルタを駆使しても、最終的には人間が「どの通信が調査に値するか」を判断する必要があります。次のような通信は優先的にチェックする価値があります。
      </p>
      <ul>
        <li><strong>認証系</strong>: ログイン・ログアウト・パスワードリセット・トークン発行のエンドポイント</li>
        <li><strong>ID を含むパラメータ</strong>: <Cmd>?user_id=123</Cmd> や <Cmd>/api/orders/456</Cmd> のように、数値や識別子がそのまま URL やボディに現れているもの（IDOR の兆候）</li>
        <li><strong>リダイレクト（3xx）</strong>: <Cmd>Location</Cmd> ヘッダの遷移先がユーザー入力由来になっていないか</li>
        <li><strong>JSON API</strong>: フロントの表示より多くのフィールドをレスポンスに含んでいないか（画面には出ない内部フィールドの漏洩）</li>
        <li><strong>エラー応答（4xx/5xx）</strong>: スタックトレースや内部パス、SQL の断片などが露出していないか</li>
      </ul>
      <Callout variant="tip" title="まずは一覧を眺めて仮説を立てる">
        いきなり細かく読み込む前に、Status 列と URL 列をざっと眺めて「このエンドポイント群は認証に関わっていそうだ」「このパスは管理画面っぽい」といった<strong>仮説を立ててから深掘りする</strong>と効率が良くなります。
      </Callout>

      <Section>6. 演習: ログインの一連の流れを再構成する</Section>
      <p>
        HTTP history だけを頼りに、ある操作の流れを再構成してみましょう。
      </p>
      <Steps>
        <Step title="HTTP history をクリアする">右クリック → <Cmd>Clear history</Cmd>（または新しい Filter で絞り込んで代用してもよい）。</Step>
        <Step title="ラボにログインする">Web Security Academy の任意のラボ、または Juice Shop にログインする。</Step>
        <Step title="ログイン後、いくつか操作する">プロフィール確認、商品検索、カート追加など、一通り操作する。</Step>
        <Step title="history だけを見て流れを説明してみる">「まずログインフォームに POST し、Set-Cookie でセッションを受け取り、その後のリクエストにこの Cookie が付与され続けている」というように、通信だけから流れを言葉で説明できるか試す。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-07-http-history-02.svg"
        alt="ログイン処理の POST リクエストと、それに続くセッション Cookie 付きの複数リクエストが history に並ぶ様子"
        caption="ログイン直後の POST と、Set-Cookie を受け取った以降のリクエストの流れ"
      />
      <p>
        これができるようになると、アプリの画面遷移を見なくても、通信ログだけでアプリの内部的な振る舞いを読み取れるようになります。これは診断作業の基礎体力です。
      </p>

      <Divider />

      <Quiz
        question="Target タブで検証対象ドメインを Scope に登録したあと、HTTP history のノイズを一括で減らすフィルタはどれか。"
        options={[
          "Filter by MIME type で HTML のみに絞る",
          "Show only in-scope items にチェックを入れる",
          "Search term に対象ドメイン名を毎回手入力する",
        ]}
        answer={1}
        explanation="Scope にドメインを登録しておけば、Show only in-scope items にチェックするだけで analytics や CDN など無関係な通信を一括除外できます。毎回手動で検索語を入力するより効率的です。"
      />

      <Divider />

      <KeyPoints
        items={[
          "HTTP history には全通信が自動記録される。まず見るべきは Method/URL/Status/Length/MIME type",
          "フィルタバー（MIME type・status・search term・extension）でノイズを減らす",
          "Scope 登録 + Show only in-scope items でさらにノイズを削減できる",
          "Highlight と Notes が Community Edition での記録手段",
          "WebSocket は別画面（WebSockets history）に Direction 付きで記録される",
          "認証系・ID パラメータ・リダイレクト・JSON API・エラー応答は優先的にチェックする",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「8. Proxy の設定を詰める」では、Match and replace による自動書き換えや、TLS pass through でさらにノイズを減らす設定を扱います。
      </Callout>
    </>
  );
}

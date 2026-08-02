import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-06-intercept",
  title: "6. Intercept — リクエストを止めて書き換える",
  description: "Burp Suite の Intercept 機能で通信を一時停止し、送信前に中身を書き換える。Forward / Drop / Action メニューの使い方、レスポンス傍受、実務での運用のコツまで。",
  domain: "burp-practice",
  section: "proxy",
  order: 3,
  level: "basic",
  tags: ["Burp Suite", "Intercept", "リクエスト改変", "クライアントサイドバリデーション"],
  updated: "2026-07-28",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        Intercept は、ブラウザが送ろうとしたリクエストをサーバーに届く<strong>直前</strong>で一時停止し、内容を見てから書き換えたり止めたりできる機能です。この章では止まったリクエストの読み方と、実務的な使いどころを身につけます。（目標学習時間：1時間）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Intercept の on/off を切り替え、止まったリクエストを読める</li>
          <li>Forward / Drop / Action メニューを使い分けられる</li>
          <li>クライアント側バリデーションを迂回して価格やロールを書き換える体験をする</li>
          <li>レスポンス傍受を有効にして、レスポンス側も書き換えられる</li>
          <li>Intercept を「常時 on」にしない、実務的な運用が分かる</li>
        </ul>
      </Callout>

      <Section>1. Intercept is on/off の切り替え</Section>
      <p>
        <Cmd>Proxy → Intercept</Cmd> サブタブの左上に、大きなトグルボタンがあります。<Cmd>Intercept is on</Cmd> の状態にすると、ブラウザから送られるすべてのリクエストが Burp 側で一時停止し、手動で <strong>Forward</strong>（転送）するまでサーバーには届きません。
      </p>
      <Callout variant="warn" title="on にしたままブラウジングすると固まる">
        Intercept is on のままブラウザを操作すると、画像・CSS・JS など1ページで発生する大量のリクエストがすべて止まってしまい、Forward を連打しないとページが表示されません。<strong>普段は off にしておき、狙ったタイミングだけ on にする</strong>のが基本です。
      </Callout>

      <Section>2. 止まったリクエストの読み方</Section>
      <p>
        Intercept でリクエストが止まると、生の HTTP メッセージがそのまま表示されます。構造は単純で、上から順に読めば理解できます。
      </p>
      <Code lang="http" filename="止まったリクエストの例">{`POST /api/basket/4/checkout HTTP/1.1
Host: localhost:3000
Cookie: token=eyJhbGciOiJI...
Content-Type: application/json
Content-Length: 42

{"couponData":"","paymentMode":"wallet"}`}</Code>
      <ComparisonTable
        headers={["部分", "内容"]}
        rows={[
          ["リクエストライン", "メソッド（POST 等）・パス・HTTP バージョン"],
          ["ヘッダ", "Host / Cookie / Content-Type など、リクエストに関するメタ情報"],
          ["空行", "ヘッダとボディの区切り"],
          ["ボディ", "送信するデータ本体（JSON、フォームデータなど）"],
        ]}
      />
      <p>
        このテキストエリアは<strong>直接編集可能</strong>です。パスを変える、ヘッダを追加する、ボディの値を書き換える、といった操作をここで行ってから Forward すれば、書き換えた内容がサーバーに届きます。
      </p>
      <Figure
        src="/learn/shots/burp-practice/burp-06-intercept-01.svg"
        alt="Intercept タブで POST リクエストが一時停止し、Forward / Drop ボタンが表示されている画面"
        caption="Intercept で止まったリクエスト。ボディ部分を直接編集してから Forward できる"
      />

      <Section>3. Forward / Drop / Action メニュー</Section>
      <ComparisonTable
        headers={["操作", "動作"]}
        rows={[
          ["Forward", "（編集した内容のまま）このリクエストをサーバーへ送信する"],
          ["Drop", "このリクエストを破棄し、サーバーへは送らない（ブラウザ側はタイムアウトやエラー扱いになる）"],
          ["Action → Send to Repeater", "このリクエストを Repeater に送り、何度も手動で調整しながら再送できるようにする"],
          ["Action → Send to Intruder", "このリクエストを Intruder に送り、パラメータを変えながら自動で反復送信する準備をする"],
          ["Action → Send to Comparer", "リクエストの内容を Comparer に送り、別のリクエストと差分比較する"],
          ["Action → Send to Decoder", "選択した値を Decoder に送り、エンコード・デコード処理を試す"],
        ]}
      />
      <Callout variant="info" title="Repeater / Intruder / Comparer / Decoder は後の章で">
        ここでは「Intercept から他のツールへ送れる」という導線だけ押さえておけば十分です。それぞれの使い方は後続の章（Repeater・Intruder の章、補助ツール群の章）で扱います。
      </Callout>

      <Section>4. 実践: 価格・ロール・隠しパラメータを書き換える</Section>
      <p>
        クライアント側（ブラウザの JavaScript）でどれだけ厳密にバリデーションしていても、<strong>最終的にサーバーへ届くのは Intercept で見えているこの生データ</strong>です。ここを直接書き換えれば、クライアント側の制約は関係なくなります。
      </p>
      <Steps>
        <Step title="Intercept を on にする">Proxy → Intercept で on に切り替える。</Step>
        <Step title="価格変更を伴う操作を行う">Juice Shop であればカートの合計金額が送られる画面、Web Security Academy であれば商品購入・数量変更のあるラボを操作する。</Step>
        <Step title="止まったリクエストのボディを確認する">価格・数量・クーポン適用結果などがボディの JSON やフォームデータに含まれていないか探す。</Step>
        <Step title="値を書き換えて Forward する">たとえば価格フィールドの値を極端に小さい数値に書き換えてから Forward し、サーバー側がその値をそのまま受け入れてしまうか観察する。</Step>
      </Steps>
      <Callout variant="tip" title="ロール（role）や isAdmin のようなフラグも狙い目">
        フォームの hidden な入力欄や、レスポンスに含まれる JSON の <Cmd>role</Cmd> <Cmd>isAdmin</Cmd> のようなフィールドは、画面上には見えなくてもリクエストのボディには含まれていることがあります。Intercept で止めてボディ全体を眺める癖をつけると、こうした「画面には出ないが実は送られている値」に気づけるようになります。
      </Callout>
      <Callout variant="warn" title="必ず許可された環境で行う">
        価格改ざんやロール偽装の検証は、<strong>Web Security Academy のラボや自分でローカルに立てた Juice Shop / DVWA</strong>など、明示的に許可された環境のみで行ってください。実在のサービスで同様の操作を行うことは不正アクセスにあたります。
      </Callout>

      <Section>5. レスポンスの傍受</Section>
      <p>
        Intercept は既定でリクエストのみを止めますが、<strong>レスポンス側</strong>を止めて書き換えることもできます。サーバーからブラウザに返る直前の HTML/JS/JSON を編集し、隠れた UI 要素を出現させたり、フロントエンドの分岐条件を変えたりする検証に使います。
      </p>
      <Steps>
        <Step title="Response interception rules を有効にする">Proxy settings 内の <Cmd>Response Interception Rules</Cmd> にあるチェックボックスを有効にする。</Step>
        <Step title="対象リクエストで Do intercept を指定する">Intercept でリクエストが止まったときに右クリックし、<Cmd>Do intercept → Response to this request</Cmd> を選ぶ。</Step>
        <Step title="Forward してレスポンスを待つ">リクエストを Forward すると、サーバーからのレスポンスが返ってきた時点で今度はレスポンス側が一時停止する。</Step>
        <Step title="レスポンスの中身を編集して Forward">HTML であれば <Cmd>disabled</Cmd> 属性の削除、JSON であればフラグの値変更などを行い、Forward してブラウザに渡す。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-06-intercept-02.svg"
        alt="Response interception rules を有効化する Proxy settings 画面"
        caption="Proxy settings の Response Interception Rules。有効にするとレスポンスも Intercept で止められる"
      />
      <p>
        たとえば、画面上は <Cmd>disabled</Cmd> でクリックできないボタンがあっても、レスポンス HTML からその属性を削除して Forward すれば、ブラウザ上でそのボタンが操作可能な状態として描画されます。これは「サーバー側の実際のアクセス制御」と「クライアント側の見た目の制約」が別物であることを確認する良い演習になります。
      </p>

      <Section>6. 実務での運用のコツ</Section>
      <p>
        Intercept を常時 on にしていると、通常の閲覧作業がまったく進まなくなります。実務では次のような運用が一般的です。
      </p>
      <ul>
        <li>普段は Intercept を<strong>off</strong> にしておき、通信は素通りさせて HTTP history に溜める</li>
        <li>HTTP history を眺めて「これを詳しく調べたい」と思ったリクエストだけを右クリックして <Cmd>Send to Repeater</Cmd> する</li>
        <li>Repeater 上で何度も値を変えながらリクエストを送り、挙動をじっくり観察する（次章以降で詳しく扱う）</li>
        <li>Intercept は「今まさに起きている一連の操作を、送信前に横取りしたい」という限定的な場面（ログイン直後の1回だけ書き換えたい、等）でピンポイントに on にする</li>
      </ul>
      <Callout variant="tip" title="Intercept と HTTP history の使い分け">
        Intercept は「送信前に止めて書き換える」道具、HTTP history は「送信済みの記録を後から見返す」道具です。作業の主戦場は基本的に HTTP history → Repeater であり、Intercept はここぞという場面のスポット的な出動、と覚えておきましょう。
      </Callout>

      <Divider />

      <Quiz
        question="Intercept is on のまま通常のブラウジングを続けると何が起きるか。"
        options={[
          "特に問題なく、普段どおりページが表示され続ける",
          "1ページに紐づく大量のリクエスト（画像・CSS・JS等）がすべて止まり、Forward を連打しないとページが表示されない",
          "Burp が自動的に off に戻してくれるので気にしなくてよい",
        ]}
        answer={1}
        explanation="Intercept is on の状態では、ブラウザが送るすべてのリクエストが一時停止します。1ページの読み込みだけでも大量のリクエストが発生するため、実務では必要な場面だけ on にし、それ以外は off にしておくのが基本です。"
      />

      <Divider />

      <KeyPoints
        items={[
          "Intercept は送信直前のリクエストを一時停止し、書き換えてから Forward できる",
          "止まったリクエストはリクエストライン・ヘッダ・空行・ボディの単純な構造",
          "Forward / Drop / Action(Send to Repeater 等) を使い分ける",
          "クライアント側バリデーションは通信そのものには強制力がないと体感する",
          "レスポンス傍受で隠れた UI 要素やフラグの挙動も確認できる",
          "実務では Intercept は常時 off。HTTP history → Repeater が主戦場",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「7. HTTP history」では、Intercept を off にして貯めた通信ログの読み方・フィルタ・怪しい通信の探し方を扱います。
      </Callout>
    </>
  );
}

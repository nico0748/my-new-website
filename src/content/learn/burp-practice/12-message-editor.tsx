import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Code, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-12-message-editor",
  title: "12. メッセージエディタと Inspector — 編集を速くする",
  description: "Repeater/Intruder/Proxy 共通のメッセージエディタと Inspector パネルを使い、エンコードを意識せずリクエストを編集する方法、右クリックメニューの便利機能、JWT のデコード表示までを身につける。",
  domain: "burp-practice",
  section: "repeater",
  order: 2,
  level: "basic",
  tags: ["Burp Suite", "Repeater", "Inspector", "JWT", "メッセージエディタ"],
  updated: "2026-07-28",
  minutes: 55,
};

export default function Article() {
  return (
    <>
      <Lead>
        Repeater の基本操作を覚えたら、次は編集そのものを速くする道具を知っておきましょう。メッセージエディタと Inspector パネルは、Repeater・Intruder・Proxy のどこでも共通で使える強力な機能です。（目標学習時間：55分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>メッセージエディタの共通機能（ビュー切り替え・検索・自動更新）を使える</li>
          <li>Inspector パネルでリクエストの各要素をフォーム形式で編集できる</li>
          <li>右クリックメニューの便利機能（変換・メソッド変更・エンコード変更）を使える</li>
          <li>JWT の中身を Inspector でデコード表示できる</li>
        </ul>
      </Callout>

      <Section>1. メッセージエディタの共通機能</Section>
      <p>
        Repeater・Intruder・Proxy のリクエスト/レスポンス表示は、見た目は違えど中身は同じ「メッセージエディタ」というコンポーネントです。一度使い方を覚えれば、どのツールでも同じ操作が通用します。
      </p>
      <KVList
        items={[
          { key: "Pretty / Raw / Hex ビュー", val: "整形表示・生バイト表示・16進ダンプを切り替えられる（前章参照）" },
          { key: "検索バー", val: "エディタ内で Ctrl+F（Cmd+F）を押すと文字列検索ができる。長いレスポンスから特定のキーを探すときに便利" },
          { key: "改行と Content-Length の自動更新", val: "ボディを書き換えて行数・文字数が変わると、Content-Length ヘッダを Burp が自動的に再計算してくれる（手で数え直す必要はない）" },
          { key: "Word wrap", val: "長い1行のログや Base64 文字列を折り返し表示に切り替え、横スクロールせずに読めるようにする" },
        ]}
      />
      <Callout variant="warn" title="Content-Length が合わないと弾かれる">
        自動更新は基本的に信頼して良い機能ですが、Raw ビューで手動編集したときに稀にズレることがあります。送信後に「Bad Request」などが返る場合は、まず Content-Length が本文の長さと一致しているかを疑いましょう。
      </Callout>

      <SubSection>自動整形とシンタックスハイライト</SubSection>
      <p>
        Pretty ビューでは、JSON や XML のボディが自動的にインデント整形され、キーと値・タグがハイライト表示されます。API のレスポンスが1行に詰め込まれた JSON で返ってくる場合でも、Pretty に切り替えるだけで構造を目で追えるようになります。長い配列やネストが深いオブジェクトを確認するときは、まず Pretty で全体構造をつかんでから、必要な値だけ Raw や検索バーで正確に確認する、という順番が効率的です。
      </p>

      <Section>2. Inspector パネル — フォームで編集する</Section>
      <p>
        リクエスト編集ペインの右端に表示できる<strong>Inspector</strong>パネルは、生のテキストを直接いじる代わりに、リクエストの構成要素をフォーム形式で編集できる機能です。
      </p>
      <KVList
        items={[
          { key: "Request attributes", val: "メソッド・URL・HTTP バージョンをフォームで確認・変更" },
          { key: "Query parameters", val: "URL のクエリ文字列をキーと値のペアとして一覧・編集" },
          { key: "Body parameters", val: "POST ボディ（form-urlencoded や multipart）のパラメータをキーと値で編集" },
          { key: "Request cookies", val: "Cookie ヘッダの中身を1つずつのキー・値として編集" },
          { key: "Request headers", val: "各ヘッダをキー・値の一覧として編集・追加・削除" },
        ]}
      />
      <p>
        Inspector の最大の利点は、<strong>URL エンコードや区切り文字を意識せずに値だけを書き換えられる</strong>ことです。生のテキストで <Cmd>{"a=1&b=2%20test"}</Cmd> のような文字列を直接編集すると、うっかり <Cmd>&</Cmd> や <Cmd>%20</Cmd> を壊してリクエスト自体を破損させがちですが、Inspector ならフォームの該当欄を書き換えるだけで、エンコードは Burp が面倒を見てくれます。
      </p>
      <Figure
        src="/learn/shots/burp-practice/burp-12-message-editor-01.svg"
        alt="Repeater 右側の Inspector パネル。Request attributes / Query parameters / Body parameters / Request cookies / Request headers が折りたたみ式のセクションで並ぶ"
        caption="Inspector パネル。各要素をフォーム形式で編集でき、エンコードを気にせずに済む"
      />

      <SubSection>値の自動デコード表示</SubSection>
      <p>
        Inspector は、値が Base64・URL エンコード・JWT などの既知の形式に見える場合、<strong>デコードした中身をその場に表示</strong>してくれます。Cookie の値が長い謎の文字列でも、Inspector で開けば「これは Base64 で、中身は JSON だった」といった発見がすぐにできます。
      </p>

      <Section>3. 右クリックメニューの便利機能</Section>
      <p>
        リクエストの一部を選択して右クリックすると、いくつかの変換・変更機能が使えます。
      </p>
      <ComparisonTable
        headers={["機能", "できること"]}
        rows={[
          ["Convert selection → URL encode/decode", "選択した文字列を URL エンコード/デコードした状態に変換する"],
          ["Convert selection → HTML encode/decode", "HTML エンティティのエンコード/デコード"],
          ["Convert selection → Base64 encode/decode", "選択部分を Base64 に変換、または Base64 をデコード"],
          ["Change request method", "GET ↔ POST（あるいは他のメソッド）へワンクリックで変換。パラメータの配置も自動的に調整される"],
          ["Change body encoding", "form-urlencoded ↔ multipart など、ボディのエンコード形式を切り替える"],
        ]}
      />
      <Callout variant="tip" title="変換系はまず選択してから">
        Convert 系のメニューは、テキストを選択していないと出てこない（または全体に適用される）ことがあります。狙った部分だけを変換したい場合は、必ず対象の文字列をドラッグで選択してから右クリックしましょう。選択範囲を誤ると意図しない箇所までエンコードされ、リクエストが壊れる原因になります。
      </Callout>

      <Section>4. JWT を Inspector で覗く</Section>
      <p>
        JWT（JSON Web Token）は <Cmd>ヘッダ.ペイロード.署名</Cmd> の3つを <Cmd>.</Cmd> で連結し、それぞれ Base64URL エンコードした文字列です。Authorization ヘッダやセッション Cookie に JWT らしき値が入っていると、Inspector はそれを自動検出し、<strong>ヘッダ・ペイロードのデコード結果をその場に表示</strong>してくれます。
      </p>
      <Callout variant="info" title="このセクションはあくまで「覗く」まで">
        ここではまず「JWT の中身をデコードして読む」ところまでを扱います。署名を無視した改ざん（alg: none 攻撃など）や再署名を伴う検証は、拡張機能（JWT Editor 等）を扱う後の章で取り上げます。
      </Callout>
      <p>Inspector がデコードして見せてくれるのは、おおむね次のような JSON です。</p>
      <Code lang="json" filename="JWT ペイロードのデコード例（Inspector 表示）">{`{
  "sub": "1234567890",
  "name": "test-user",
  "role": "user",
  "iat": 1716800000,
  "exp": 1716803600
}`}</Code>
      <p>
        <Cmd>role</Cmd> や <Cmd>exp</Cmd>（有効期限）のようなフィールドがそのまま読めるだけでも、「このトークンはどんな権限を表しているか」「有効期限はどのくらいか」を素早く把握できます。
      </p>
      <Figure
        src="/learn/shots/burp-practice/burp-12-message-editor-02.svg"
        alt="Inspector が JWT を自動検出し、ヘッダとペイロードの JSON をデコードして表示している画面"
        caption="Inspector が JWT を検出し、ヘッダ/ペイロードを自動デコード表示している様子"
      />

      <Section>5. HTTP/2 と HTTP/1.1 の切り替え</Section>
      <p>
        対象サーバーが HTTP/2 に対応している場合、Repeater のリクエストペインには HTTP/2 と HTTP/1.1 を切り替えるタブが表示されることがあります。<strong>同じリクエストでもプロトコルによってサーバーの挙動が変わることがある</strong>ため、片方で再現しない挙動をもう片方で試す、という切り分けに使えます。
      </p>
      <ComparisonTable
        headers={["観点", "HTTP/1.1", "HTTP/2"]}
        rows={[
          ["ヘッダ名の大文字小文字", "元のまま保持されることが多い", "仕様上すべて小文字に正規化される"],
          ["リクエスト行", "先頭行に GET /path HTTP/1.1 が明示される", "疑似ヘッダ（:method, :path 等）で表現される（表示上は Burp が読みやすく整形）"],
          ["複数リクエストの多重化", "1接続で1リクエストずつ（パイプライン以外）", "1接続で複数リクエストを並行して送れる（HTTP Request Smuggling 系の話題と関連）"],
        ]}
      />
      <Callout variant="warn" title="ヘッダの大文字小文字・ヘッダ順序に注意">
        HTTP/2 ではヘッダ名が小文字に正規化されるなど、HTTP/1.1 とは細かな違いがあります。プロトコルを切り替えたらリクエストの見た目が変わっても慌てず、意味的に同じ内容になっているかを確認しましょう。
      </Callout>

      <Section>6. 演習</Section>
      <Steps>
        <Step title="対象の POST リクエストを用意する">Web Security Academy のラボで、パラメータを含む POST リクエスト（プロフィール更新やコメント投稿など）を Repeater に送る</Step>
        <Step title="Change request method で GET に変換する">右クリック →「Change request method」で GET に変換し、パラメータがクエリ文字列に自動的に移動することを確認する</Step>
        <Step title="GET のまま送信してみる">サーバーが GET でも同じ操作を受け付けてしまうか（本来 POST 専用のはずの操作が GET でも通ってしまわないか）を確認する</Step>
        <Step title="結果を記録する">GET で通った場合、それはメソッドに依存した認可漏れの可能性がある、という観点で結果をメモしておく</Step>
      </Steps>
      <Callout variant="danger" title="ラボ環境でのみ実施">
        メソッド変換による挙動確認は、必ず Web Security Academy などの許可された検証環境でのみ行ってください。第三者が運用する本番サービスに対して無断で試すことは絶対にしないでください。
      </Callout>

      <Divider />

      <Quiz
        question="Inspector パネルを使ってパラメータの値を編集する最大の利点は何ですか？"
        options={[
          "レスポンスの表示速度が上がる",
          "URL エンコードや区切り文字を意識せず、値だけをフォーム形式で書き換えられる",
          "Content-Length の自動更新が不要になる",
          "HTTP/2 のリクエストしか編集できなくなる"
        ]}
        answer={1}
        explanation="Inspector はリクエストの各要素（クエリ・ボディ・Cookie・ヘッダ）をキーと値のフォームとして提示するため、生のテキストで区切り文字やエンコードを壊す心配なく値だけを書き換えられます。"
      />

      <KeyPoints
        items={[
          "メッセージエディタは Repeater/Intruder/Proxy 共通。検索・自動更新される Content-Length などが使える",
          "Inspector はリクエストの各要素をフォーム形式で編集でき、エンコードを気にしなくて済む",
          "値が Base64/URL エンコード/JWT に見える場合、Inspector が自動でデコード表示する",
          "右クリックの Convert 系・Change request method・Change body encoding で編集を高速化できる",
          "JWT はまず「デコードして読む」まで。署名の改ざん検証は拡張機能の章で扱う",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「13. ラボ実践」で、Repeater と Inspector を組み合わせ、実際に仮説を立てて検証するループを回していきます。
      </Callout>
    </>
  );
}

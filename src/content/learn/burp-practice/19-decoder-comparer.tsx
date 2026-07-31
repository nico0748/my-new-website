import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-19-decoder-comparer",
  title: "19. Decoder と Comparer — 値を読み解き、差を見つける",
  description: "手動でエンコード/デコードを行う Decoder と、2つのリクエスト/レスポンスの差分を機械的に見つける Comparer。地味だが実務で頻繁に使う2つの補助ツールの使い所を整理する。",
  domain: "burp-practice",
  section: "toolset",
  order: 1,
  level: "basic",
  tags: ["Burp Suite", "Decoder", "Comparer", "エンコーディング"],
  updated: "2026-07-28",
  minutes: 45,
};

export default function Article() {
  return (
    <>
      <Lead>
        Repeater や Intruder ほど目立ちませんが、Decoder と Comparer は実務で「地味に毎回使う」道具です。値の中身を読み解く、2つの応答の違いを見つける。この2つができるだけで、手作業の推測に頼らずに済む場面がぐっと増えます。（目標学習時間：45分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Decoder でエンコード/デコード、ハッシュ生成ができる</li>
          <li>Smart decode で多重エンコードを自動的にほどける</li>
          <li>Inspector の Convert selection と Decoder の使い分けを説明できる</li>
          <li>Comparer で2つの値の差分を words / bytes 単位で確認できる</li>
        </ul>
      </Callout>

      <Section>1. Decoder とは何をする画面か</Section>
      <p>
        Decoder は、上部に入力したテキストを様々な形式でエンコード／デコードしたり、ハッシュ値に変換したりできる、いわば「万能変換ツール」です。上段にテキストを貼り、下段のドロップダウンから変換方式を選ぶと、変換結果が別のペインに積み上がっていきます。
      </p>
      <ComparisonTable
        headers={["カテゴリ", "対応形式"]}
        rows={[
          ["エンコード/デコード", "URL / HTML / Base64 / ASCII hex / Hex / Octal / Binary / Gzip"],
          ["ハッシュ", "MD5 / SHA-1 / SHA-256 など"],
        ]}
      />
      <p>
        変換は積み重ねられるので、「Base64 デコード → URL デコード → もう一度 Base64 デコード」のように、多段の変換を1つの画面で追いながら進められるのが特長です。
      </p>

      <SubSection>Smart decode — 自動判定に任せる</SubSection>
      <p>
        どの形式でエンコードされているか分からないとき、いちいち手当たり次第に試すのは非効率です。Decoder には<strong>Smart decode</strong> というボタンがあり、Burp が入力の特徴（文字種・パディング・区切り文字など）から形式を推定し、自動的にデコードを進めてくれます。まずは Smart decode を押し、うまく崩れた表示になったら手動でやり直す、という流れが実務的です。
      </p>

      <SubSection>多重エンコードをほどく実例</SubSection>
      <p>
        たとえば Cookie の値が次のような文字列だったとします。
      </p>
      <Code lang="text">{`ewogICJ1c2VySWQiOiA0MiwKICAicm9sZSI6ICJhZG1pbiIKfQ%3D%3D`}</Code>
      <p>
        末尾に <Cmd>%3D%3D</Cmd> が見えるので、まず URL デコードをかけると Base64 らしい文字列に変わります。
      </p>
      <Code lang="text">{`ewogICJ1c2VySWQiOiA0MiwKICAicm9sZSI6ICJhZG1pbiIKfQ==`}</Code>
      <p>
        続けて Base64 デコードをかけると、中身が JSON だったことが分かります。
      </p>
      <Code lang="json">{`{
  "userId": 42,
  "role": "admin"
}`}</Code>
      <p>
        「URL エンコードされた Base64 の中に JSON が入っている」というのは、Cookie やリダイレクトパラメータでよくある形です。Decoder で1段ずつ剥がしていけば、推測ではなく手順として再現できます。
      </p>

      <Figure
        src="/learn/shots/burp-practice/burp-19-decoder-comparer-01.svg"
        alt="Decoder 画面。上段に入力テキスト、下段に変換方式のドロップダウン、その下に変換結果が積み重なって表示されている"
        caption="Decoder で URL デコード → Base64 デコードと段階的にほどいていく様子"
      />

      <SubSection>実務での使い所</SubSection>
      <ComparisonTable
        headers={["場面", "やること"]}
        rows={[
          ["Cookie の中身を覗く", "Set-Cookie の値を Decoder に貼り、Base64 / URL デコードで平文やJSONを取り出す"],
          ["リダイレクト先パラメータの確認", <>{"パラメータが URL エンコードされている場合、"}<Cmd>?next=</Cmd>{" のような値をデコードして遷移先を確認する"}</>],
          ["JWT の中身確認", <>{"JWT の "}<Cmd>header.payload.signature</Cmd>{" の各セクションを Base64URL としてそれぞれデコードし、アルゴリズムやクレームを読む"}</>],
        ]}
      />
      <Callout variant="info" title="JWT は3分割してから">
        JWT はピリオドで区切られた3つの Base64URL 文字列です。Decoder の変換方式には Base64URL が無い環境もあるため、パディング（<Cmd>=</Cmd>）を手で補ってから通常の Base64 デコードにかけると読めることがあります。改ざん検証ではなく「中身を読む」だけならこれで十分です。
      </Callout>

      <SubSection>Inspector / Convert selection との使い分け</SubSection>
      <p>
        Proxy や Repeater のメッセージエディタには、選択範囲を右クリックして変換する「Convert selection」や、値をクリックするだけで自動デコードして見せてくれる Inspector パネルがあります。ちょっとした値を1回だけ覗きたいときはこちらの方が速いです。一方で、多段階の変換を試行錯誤しながら追いたい、変換結果を残しながら次の変換に進みたい、という<strong>腰を据えた解析</strong>には Decoder のタブを使う方が見通しが良くなります。
      </p>
      <ComparisonTable
        headers={["ツール", "向いている場面"]}
        rows={[
          ["Inspector（Proxy/Repeater 内）", "リクエスト中の値をその場でさっと確認したいとき"],
          ["Convert selection（右クリック）", "選択した一部だけを1回変換したいとき"],
          ["Decoder（専用タブ）", "多段エンコードを段階的にほどく、変換の履歴を残しながら試したいとき"],
        ]}
      />

      <Section>2. Comparer とは何をする画面か</Section>
      <p>
        Comparer は、<strong>2つのリクエストまたはレスポンスを並べて差分を可視化する</strong>ツールです。プレーンテキストとして貼り付けることもできますが、実務では Proxy history や Repeater の結果を右クリックして「Send to Comparer」で送り込むのが基本の流れです。
      </p>
      <Steps>
        <Step title="比較したい2件を選ぶ">Proxy history や Repeater の結果一覧から、比較したいリクエスト（またはレスポンス）を2つ選ぶ</Step>
        <Step title="Send to Comparer">それぞれを右クリックし「Send to Comparer (request)」または「(response)」を選ぶ</Step>
        <Step title="Comparer タブで Compare">Comparer タブに切り替え、送った2件を選択して「Words」または「Bytes」で比較を実行する</Step>
        <Step title="差分をたどる">差分箇所がハイライトされた画面が開くので、追加・削除・変更された部分を確認する</Step>
      </Steps>
      <p>
        <strong>Words 単位</strong>は空白や記号で区切った単語ごとに差分を取るので、テキストの意味的なまとまりを見るのに向いています。<strong>Bytes 単位</strong>は文字通り1バイトずつの差分で、ヘッダの微妙な違いや制御文字まで拾いたいときに使います。迷ったらまず Words で概観し、細部を詰めたいときに Bytes に切り替えるとよいでしょう。
      </p>

      <Figure
        src="/learn/shots/burp-practice/burp-19-decoder-comparer-02.svg"
        alt="Comparer 画面。左右に2つのレスポンスが並び、差分箇所が色付きでハイライトされている"
        caption="Comparer で2つのレスポンスを Words 単位で比較し、差分箇所がハイライトされている様子"
      />

      <SubSection>実務での使い所</SubSection>
      <ComparisonTable
        headers={["場面", "比較する2件", "見えてくること"]}
        rows={[
          ["ログイン成否の判定", "正しい認証情報の応答 / 誤った認証情報の応答", "エラーメッセージやステータスコード以外に紛れている微差（レスポンス時間のヒントになるヘッダなど）"],
          ["権限の有無の確認", "管理者ユーザーの応答 / 一般ユーザーの応答", "同じ画面でも権限によって出し分けられている要素（ボタン・リンク・隠しフィールド）"],
          ["Intruder 結果の比較", "Intruder のペイロード違いによる2件の応答", "ステータスコードやレスポンス長は同じでも本文の一部だけが違う、といった見落としがちな差"],
          ["エラーメッセージの微差", "似た2つのエラー応答", "スタックトレースの有無やエラーコードの1文字違いなど、ブラインド系の判定材料になる差"],
        ]}
      />
      <Callout variant="tip" title="ブラインド系の判定は「差」が頼り">
        SQL インジェクションのブラインド系や、ユーザー列挙のように「見た目上は同じ応答」に見える脆弱性は、実は本文のごく一部やヘッダ・タイミングにしか差が出ないことがあります。Comparer は「どこに差が出るか」を目視の勘に頼らず機械的に洗い出せる点に価値があります。差分がゼロなら「区別できない」という判断材料そのものにもなります。
      </Callout>

      <Section>3. 演習</Section>
      <Steps>
        <Step title="ラボの Cookie をほどく">Web Security Academy の任意のラボでログインし、Set-Cookie の値を Decoder に貼り付けて Smart decode を試す。うまく崩れる場合は手動で URL デコード → Base64 デコードの順に試す</Step>
        <Step title="ログイン成否を Comparer にかける">同じユーザー名で「正しいパスワード」「誤ったパスワード」でログインを試し、それぞれのレスポンスを Send to Comparer（response）で送る。Words 比較で差分箇所を確認する</Step>
        <Step title="差分から一文を書く">「この2つの応答は◯◯の点で区別できる／できない」という一文をメモに残す。レポートの根拠として使える形にする</Step>
      </Steps>

      <Figure
        src="/learn/shots/burp-practice/burp-19-decoder-comparer-03.svg"
        alt="演習の流れ。Decoder で Cookie をほどく画面と、ログイン成否のレスポンスを Comparer で比較する画面が並んでいる"
        caption="演習：Cookie のデコードとログイン成否レスポンスの比較"
      />

      <Section>4. Decoder / Comparer / Inspector の使い分け早見表</Section>
      <ComparisonTable
        headers={["ツール", "得意なこと", "苦手なこと"]}
        rows={[
          ["Decoder", "多段エンコードを段階的にほどく、ハッシュ生成", "2つの値を並べて比較すること"],
          ["Comparer", "2つの値/応答の差分を words・bytes 単位で機械的に洗い出す", "値そのものをデコードして中身を読むこと"],
          ["Inspector（Proxy/Repeater 内）", "その場で値をさっと確認・簡易変換すること", "多段変換や2値比較のような込み入った作業"],
        ]}
      />

      <Divider />

      <Quiz
        question="ログイン成功時と失敗時のレスポンスに、見た目上はほとんど差が無いように見える。差の有無を機械的に確認したいとき、最も適したツールはどれですか？"
        options={[
          "Decoder で両方のレスポンスをデコードする",
          "Comparer に両方のレスポンスを送り、Words または Bytes 単位で比較する",
          "Sequencer でレスポンスのエントロピーを計測する",
          "Intruder でレスポンスを繰り返し送信する",
        ]}
        answer={1}
        explanation="2つの値・応答の差分を機械的に洗い出すのは Comparer の役割です。Words 単位で概観し、必要なら Bytes 単位で細部まで確認することで、目視では気づきにくい微差を見つけられます。"
      />

      <KeyPoints
        items={[
          "Decoder は URL/HTML/Base64/Hex/Octal/Binary/Gzip のエンコード/デコードとハッシュ生成ができる万能変換ツール",
          "Smart decode で形式の自動判定ができ、多段エンコードも段階的にほどける",
          "軽い変換は Inspector / Convert selection、腰を据えた解析は Decoder タブを使う",
          "Comparer は2つのリクエスト/レスポンスを Words / Bytes 単位で比較し、差分をハイライトする",
          "ログイン成否・権限有無・Intruder結果の比較など、ブラインド系の判定は「どこに差が出るか」を機械的に見つけられることに価値がある",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「20. Sequencer」では、トークンの「見た目の乱雑さ」ではなく統計的なランダム性を測定する方法を扱います。
      </Callout>
    </>
  );
}

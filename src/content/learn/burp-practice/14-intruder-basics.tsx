import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-14-intruder-basics",
  title: "14. Intruder の基本 — どこに何を入れるか",
  description: "Intruder は「1本のリクエストの一部を差し替えて大量に送る」ツール。Positions タブでの § マーカーの付け方、Payloads タブの4つの構成、主要な Payload type、攻撃の開始と Results の読み方、そして正しい使い所を整理する。",
  domain: "burp-practice",
  section: "intruder",
  order: 1,
  level: "basic",
  tags: ["Burp Suite", "Intruder", "Positions", "Payloads"],
  updated: "2026-07-28",
  minutes: 55,
};

export default function Article() {
  return (
    <>
      <Lead>
        Repeater で「この1本を書き換えて試す」ことに慣れたら、次は「同じ場所を何百・何千パターンも自動で試す」道具を使います。それが Intruder です。まずは基本の操作と考え方を押さえましょう。（目標学習時間：55分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Intruder が何をするツールか、Repeater とどう役割が違うかを説明できる</li>
          <li>Positions タブで § マーカーを正しく付けられる</li>
          <li>Payloads タブの4つの構成（Payload sets / settings / processing / encoding）を理解する</li>
          <li>主要な Payload type の違いを説明できる</li>
          <li>攻撃を開始し、Results ウィンドウの基本項目を読める</li>
        </ul>
      </Callout>

      <Section>1. Intruder とは何か — Repeater との使い分け</Section>
      <p>
        Intruder は一言で言うと、<strong>「1本のリクエストの一部を差し替えて、大量に送信する」ツール</strong>です。Repeater で「この値を書き換えたらどう反応するか」を1回ずつ手で試していた作業を、リストにした候補すべてに対して自動でまとめて実行してくれます。<strong>手作業の反復を機械にやらせる道具</strong>、という位置づけで捉えると理解しやすくなります。
      </p>
      <ComparisonTable
        headers={["観点", "Repeater", "Intruder"]}
        rows={[
          ["得意なこと", "1回ずつ丁寧に確かめる（仮説検証）", "候補を総当たりで比べる（探索・列挙）"],
          ["典型的な使い方", "パラメータを1つ書き換えて挙動を見る", "何百・何千のユーザー名/パスワード/IDを順に試す"],
          ["リクエスト数", "1回ずつ手動で送信", "1回の攻撃で数十〜数万リクエスト"],
          ["結果の見方", "レスポンスを1つずつじっくり読む", "一覧表でステータス/長さ/文字列の有無を比較する"],
        ]}
      />
      <p>
        つまり<strong>「これは効くのか？」を確かめるのが Repeater、「どれが効くのか？」を探すのが Intruder</strong>です。実務でも、まず Repeater で1〜2パターン手で試して挙動の当たりを付け、それを踏まえて Intruder で候補を広げる、という流れがよくあります。
      </p>

      <Section>2. Positions タブ — どこを差し替えるかをマークする</Section>
      <p>
        Intruder に送るリクエストは、Proxy history や Repeater から「Send to Intruder」で送り込みます。Positions タブでは、リクエストの中の<strong>どこを差し替え対象にするか</strong>を <Cmd>{"§"}</Cmd> マーカーで囲んで指定します。
      </p>
      <KVList
        items={[
          { key: "§ マーカーの意味", val: "§ で囲まれた範囲が、Payload リストの値に置き換えられる。§param§ のように前後を § で挟む" },
          { key: "Add §", val: "選択した文字列の前後に § を追加し、その範囲をマーク対象にする" },
          { key: "Clear §", val: "自動で付いたマークをすべて消し、まっさらな状態から自分でマークし直す" },
          { key: "Auto §", val: "パラメータ値・Cookie 値など『それらしい場所』を Burp が自動推測してマークする（あくまで叩き台。必ず見直す）" },
        ]}
      />
      <Callout variant="warn" title="Auto § は鵜呑みにしない">
        Auto § は便利ですが、フォームの全パラメータや不要な箇所まで一括でマークすることがあります。<strong>Clear § でいったん消してから、狙った箇所だけを手動でマークし直す</strong>癖をつけると、意図しない攻撃（無関係なパラメータへの大量送信）を防げます。
      </Callout>
      <SubSection>どこをマークすべきか</SubSection>
      <ul>
        <li><strong>パラメータ値</strong>: <Cmd>username=§carlos§</Cmd> のように、フォームやクエリの値そのもの</li>
        <li><strong>Cookie</strong>: セッション ID や認可トークンなど、Cookie ヘッダの値の一部</li>
        <li><strong>ヘッダ</strong>: <Cmd>X-Forwarded-For</Cmd> など、アプリの挙動に影響しうるカスタムヘッダの値</li>
        <li><strong>パスの一部</strong>: <Cmd>/user/§1§/profile</Cmd> のように URL パスに埋め込まれた ID</li>
      </ul>
      <Figure
        src="/learn/shots/burp-practice/burp-14-intruder-basics-01.svg"
        alt="Intruder の Positions タブ。リクエスト本文中の値が § マーカーで囲まれ、右側に Add §/Clear §/Auto § のボタンが並ぶ"
        caption="Positions タブ。§ で囲んだ範囲が Payload の差し替え対象になる"
      />

      <Section>3. Payloads タブの構成</Section>
      <p>
        マークが終わったら Payloads タブで「何を流し込むか」を決めます。Payloads タブは4つのサブセクションから成ります。
      </p>
      <KVList
        items={[
          { key: "Payload sets", val: "マークした位置ごとに、どの Payload set（リスト）と Payload type を割り当てるかを選ぶ。Attack type によって必要な set 数が変わる" },
          { key: "Payload settings", val: "選んだ Payload type ごとの詳細設定。リストの中身の追加・編集、ファイル読み込み、数値の範囲などをここで決める" },
          { key: "Payload processing", val: "生成した各値に対して、送信前にルール（プレフィックス付与・置換・エンコードなど）を適用する後処理" },
          { key: "Payload encoding", val: "URL 中で特別な意味を持つ文字（&・=・スペースなど）を自動で URL エンコードするかどうかのチェックボックス" },
        ]}
      />
      <Callout variant="info" title="Payload encoding は基本オンのままでよい">
        Payload encoding は既定でよく使う記号にチェックが入っています。ペイロード自体に URL の特殊文字（<Cmd>{"&"}</Cmd> や <Cmd>{"="}</Cmd> など）を意図的に含めたい場合を除き、オンのままにしておけばリクエストが壊れにくくなります。
      </Callout>

      <Section>4. Payload type を整理する</Section>
      <p>
        Payload type は「どんな値を、どう生成してリストにするか」を決めるものです。代表的なものを整理します。
      </p>
      <ComparisonTable
        headers={["Payload type", "何をするか", "典型的な使い所"]}
        rows={[
          ["Simple list", "手入力またはコピー&ペーストした値の固定リスト", "候補が少数・既知のユーザー名リストなど"],
          ["Runtime file", "ローカルのファイルを1行ずつ読み込む（メモリに載せず逐次読み）", "数万〜数十万行の大きな辞書ファイル"],
          ["Numbers", "指定した範囲・刻み幅・進数で連番を生成", "連番の会員ID・注文番号の列挙"],
          ["Dates", "指定した期間・書式で日付の値を生成", "日付ベースのトークンやログの探索"],
          ["Brute forcer", "指定した文字集合から全組み合わせを指定の桁数で総当たり生成", "短い PIN コードなどの完全総当たり"],
          ["Null payloads", "値を生成せず、位置だけ空のまま繰り返し送信する", "レート制限の挙動確認、時間差のみを変えたい場合"],
          ["Character substitution", "既存の値の文字を別の文字に置き換えたバリエーションを生成（leet 変換など）", "既知パスワードの亜種を試す"],
          ["Recursive grep", "前のレスポンスから正規表現で抜き出した値を次のペイロードに使う", "多段階トークンのように前段の結果に依存する攻撃"],
        ]}
      />
      <Callout variant="tip" title="まずは Simple list / Runtime file で十分">
        実務で最も使う頻度が高いのは Simple list（少数の候補を手で並べる）と Runtime file（既存の辞書ファイルを読み込む）です。他の Payload type は、必要になったときに個別に調べれば十分です。最初からすべてを覚えようとしなくて構いません。
      </Callout>

      <Section>5. 攻撃を開始する / Results ウィンドウを読む</Section>
      <p>
        Positions と Payloads の設定が終わったら、画面右上の「Start attack」ボタンで攻撃を開始します。Community Edition では速度に制限がありますが、少数のリストであれば数十秒〜数分で完了します。
      </p>
      <Steps>
        <Step title="Start attack を押す">別ウィンドウで Results が開き、リクエストが1件ずつ送信されるたびに一覧に行が追加されていく</Step>
        <Step title="一覧の列を眺める">Request 番号・Payload の値・Status code・Response の長さ（Length）などが列として並ぶ</Step>
        <Step title="列でソートする">列のヘッダをクリックすると並び替えられる。Status code や Length が他と違う行が「怪しい候補」になる</Step>
        <Step title="個別のレスポンスを確認する">気になる行をクリックすると、下部にその回のリクエスト/レスポンスの中身が表示される</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-14-intruder-basics-02.svg"
        alt="Intruder の Results ウィンドウ。Request/Payload/Status/Length の列を持つ一覧が表示され、1行だけ Status code が異なっている"
        caption="Results ウィンドウ。Status code や Length の列でソートすると、他と異なる挙動の行を見つけやすい"
      />
      <p>
        <strong>「他と違う行」を見つけるのが Intruder の結果分析の基本</strong>です。大半のリクエストが同じ Status code・同じ Length で返る中で、1件だけ違う値が返ってくる行こそが、次に Repeater で深掘りすべき候補になります。
      </p>

      <Section>6. 正しい使い所 — そして誤った使い所</Section>
      <p>
        Intruder が向いているのは、<strong>候補が有限個あり、その中から正しいもの・異なる挙動を示すものを機械的に絞り込みたい場面</strong>です。たとえば次のような用途です。
      </p>
      <ul>
        <li>既知のユーザー名リストから、実在するアカウントを見分ける（レスポンスの違いを利用）</li>
        <li>連番の ID を総当たりして、アクセス制御の抜け（IDOR）が無いかを確認する</li>
        <li>限られた候補の値（曜日・国コードなど）を1つずつ試して挙動の差を見る</li>
      </ul>
      <Callout variant="danger" title="Intruder は自動化ツール。無許可の対象に向けない">
        Intruder は短時間で大量のリクエストを送るため、<strong>許可のない対象に向けるとサービス妨害（DoS）や不正アクセスに当たり得ます</strong>。特にログインフォームへのパスワード総当たりは、対象のアカウントロックや業務妨害を引き起こす可能性があります。<strong>Intruder を向けてよいのは、明示的に許可された Web Security Academy のラボや、自分のローカル環境（DVWA / Juice Shop）だけ</strong>です。実在するサービスや他者の資産に無許可で使うことは絶対にしないでください。
      </Callout>
      <p>
        逆に向いていないのは、<strong>候補が1つしかない場面</strong>（それは Repeater で十分）や、<strong>大量アクセス自体が対象への負荷になる場面</strong>（許可なくスループットを上げるべきではない）です。「反復させたいから」という理由だけで安易に Intruder を使わず、まず何を確かめたいかを明確にしてから使いましょう。
      </p>

      <Section>7. 演習</Section>
      <Steps>
        <Step title="ラボを開く">Web Security Academy で任意のログイン系ラボ（例: Username enumeration 系）を開く</Step>
        <Step title="ログインリクエストを Intruder へ送る">Proxy history からログイン失敗時のリクエストを右クリックし「Send to Intruder」</Step>
        <Step title="Positions を設定する">Auto § をいったん Clear し、username パラメータの値だけを手動で § マークする</Step>
        <Step title="Simple list を用意する">数個のユーザー名候補（存在しそうなものと存在しなそうなもの）を Payload sets に入力する</Step>
        <Step title="攻撃して結果を比較する">Start attack を実行し、Results の Length や Status code に差が出るか観察する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-14-intruder-basics-03.svg"
        alt="演習で作成した Positions タブ。username パラメータの値だけが § マークされている"
        caption="演習の Positions 設定例。username の値だけを狙って § マークしている"
      />

      <Divider />

      <Quiz
        question="Intruder の Positions タブで「Auto §」を使ったあと、実務で推奨される次の一手はどれですか？"
        options={[
          "そのまま Start attack を押して攻撃を開始する",
          "Clear § でいったん消し、狙った箇所だけを手動でマークし直す",
          "Payload encoding をすべてオフにする",
          "Payload type を Recursive grep に固定する",
        ]}
        answer={1}
        explanation="Auto § は Burp による自動推測にすぎず、不要な箇所まで一括でマークしてしまうことがあります。Clear § でいったんクリアし、意図した箇所だけを手動でマークし直すことで、意図しない大量送信を避けられます。"
      />

      <KeyPoints
        items={[
          "Intruder は『1本のリクエストの一部を差し替えて大量に送る』ツール。1回ずつ確かめる Repeater とは役割が違う",
          "Positions タブで § マーカーを使い、パラメータ値・Cookie・ヘッダ・パスの一部などを差し替え対象にする",
          "Payloads タブは Payload sets / settings / processing / encoding の4構成",
          "Payload type は Simple list と Runtime file が最頻出。他は必要なときに調べれば十分",
          "Results ウィンドウでは Status code や Length の列でソートし『他と違う行』を探すのが基本の読み方",
          "Intruder は自動化ツール。許可された Web Security Academy / ローカル環境以外には絶対に向けない",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「15. 4つの Attack Type を使い分ける」で、Sniper / Battering ram / Pitchfork / Cluster bomb というペイロードの組み合わせ方の違いを扱います。
      </Callout>
    </>
  );
}

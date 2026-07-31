import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-16-payload-processing",
  title: "16. Payload Processing と Grep — レスポンスから自動で判定する",
  description: "Payload Processing ルールでペイロードを送信前に加工し、Grep - Match / Grep - Extract でレスポンスから自動的に判定材料を抜き出す。数千件の結果から『他と違う1件』を自力で目視せずに見つける方法。",
  domain: "burp-practice",
  section: "intruder",
  order: 3,
  level: "basic",
  tags: ["Burp Suite", "Intruder", "Payload Processing", "Grep"],
  updated: "2026-07-28",
  minutes: 50,
};

export default function Article() {
  return (
    <>
      <Lead>
        単純なリストをそのまま送るだけでは足りない場面があります。値を加工してから送りたい、あるいは大量の結果から目視ではなく自動で「怪しい行」を見つけたい——そのための機能が Payload Processing と Grep です。（目標学習時間：50分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Payload Processing で送信前にペイロードを加工できる</li>
          <li>Payload Encoding の役割を理解する</li>
          <li>Grep - Match でレスポンスに特定文字列が含まれるかを一覧に表示できる</li>
          <li>Grep - Extract で正規表現によりレスポンスから値を抜き出し一覧に並べられる</li>
          <li>Results の列を使って数百〜数千件から異常な行を効率よく見つけられる</li>
        </ul>
      </Callout>

      <Callout variant="danger" title="この章の演習も許可された環境だけで">
        Intruder は短時間に大量のリクエストを送ります。この章の演習は、
        <strong>Web Security Academy のラボ</strong>、または
        <strong>自分の PC 上に立てた Juice Shop / DVWA</strong> に対してのみ実行してください。
        許可のない対象へ向けた時点で、不正アクセスや業務妨害に問われ得ます。
      </Callout>

      <Section>1. なぜ後処理が必要なのか</Section>
      <p>
        Simple list や Runtime file で用意した値をそのまま送るだけでは対応できない場面があります。たとえば「候補の文字列そのものではなく、それを Base64 エンコードした値」を送りたい、あるいは「毎回異なる送信元 IP を装いたい」といったケースです。また、攻撃が終わったあとに数百〜数千件のレスポンスを1件ずつ目で確認するのは現実的ではありません。<strong>送信前の加工（Payload Processing）</strong>と<strong>送信後の自動判定（Grep）</strong>は、この2つの課題に対応する機能です。
      </p>

      <Section>2. Payload Processing — 送信前にペイロードを加工する</Section>
      <p>
        Payloads タブの「Payload processing」セクションでは、生成された各ペイロードに対して、送信前に適用するルールを順番に追加できます。ルールは上から順に適用されます。
      </p>
      <ComparisonTable
        headers={["ルール", "内容", "使い所の例"]}
        rows={[
          ["Add prefix / Add suffix", "値の前後に固定文字列を付け足す", "リストの単語に共通の接頭辞・接尾辞を機械的に付けたい場合"],
          ["Match / Replace", "正規表現にマッチした部分を別の文字列に置き換える", "リストの表記ゆれを統一する、特定の記号を除去する"],
          ["Encode", "Base64・URL エンコードなど、指定の方式でエンコードする", "認証ヘッダなど、事前にエンコードされた値を送る必要がある場合"],
          ["Hash", "MD5・SHA-1 などのハッシュ値に変換する", "パスワードのハッシュ値を直接検証したい場合"],
          ["Case modification", "大文字・小文字に変換する", "大文字小文字の揺れを試したいファジング"],
          ["Add raw payload processing rule (Extension)", "拡張機能で定義した独自の加工ロジックを適用する（拡張導入時）", "既存ルールでは対応できない独自の変換が必要な場合"],
        ]}
      />
      <Callout variant="info" title="ルールは複数重ねられる">
        Payload Processing のルールは1つだけでなく複数追加でき、上から順に適用されます。たとえば「Add prefix」で接頭辞を付けたあとに「Encode」で URL エンコードする、といった組み合わせも可能です。
      </Callout>
      <Figure
        src="/learn/shots/burp-practice/burp-16-payload-processing-01.svg"
        alt="Payloads タブの Payload processing セクション。Add rule ボタンと、追加済みのルールが上から順に並ぶ一覧"
        caption="Payload processing。追加したルールは上から順に適用される"
      />

      <Section>3. Payload Encoding — URL の特殊文字を自動処理する</Section>
      <p>
        Payloads タブ下部の「Payload encoding」は、生成したペイロードのうち URL 中で特別な意味を持つ文字（<Cmd>{"&"}</Cmd>・<Cmd>{"="}</Cmd>・スペースなど）を自動的に URL エンコードするかどうかのチェックボックスです。既定でよく使う文字にチェックが入っており、<strong>ペイロード自体にそれらの文字を意図的に含めたい特殊なケースを除き、オンのままにしておくのが安全</strong>です。オフにすると、ペイロードに含まれる記号がそのままリクエストの構文を壊してしまうことがあります。
      </p>

      <SubSection>Grep - Payloads — ペイロードの値そのものを列に出す</SubSection>
      <p>
        Options タブには Grep - Match / Extract のほかに「Grep - Payloads」というチェックボックスもあります。これを有効にすると、Results の一覧に<strong>そのリクエストで使ったペイロードの値そのもの</strong>が列として追加されます。地味な機能ですが、Payload Processing で加工した後の値を確認したいときや、Results を Payload の値順に並べ替えたいときに重宝します。
      </p>
      <Callout variant="tip" title="まず有効にしておいて損はない">
        Grep - Payloads は既定でオンになっていることが多い機能です。オフになっている場合は有効にしておくと、Results の一覧だけで「どの値を送った結果か」が一目で分かるようになります。
      </Callout>

      <Section>4. Grep - Match — レスポンスに含まれる文字列で判定する</Section>
      <p>
        Options タブの「Grep - Match」は、<strong>各レスポンスに指定した文字列（または正規表現）が含まれているかどうか</strong>を、Results の一覧にチェック列として追加してくれる機能です。数百件のレスポンスを1つずつ開かなくても、列を見るだけで「ログイン成功時のメッセージが出ているか」「エラーメッセージが出ているか」を一覧で判別できます。
      </p>
      <Steps>
        <Step title="判定したい文字列を確認する">まず Repeater などで1回試し、成功時／失敗時でレスポンスに現れる特徴的な文字列（例: "Invalid username" と "Invalid password" の違い）を見つける</Step>
        <Step title="Grep - Match に文字列を登録する">Options タブの Grep - Match で「Add」から、その文字列を登録する（複数登録可）</Step>
        <Step title="攻撃を実行する">Start attack で攻撃を実行すると、Results の列に登録した文字列ごとのチェック列が追加される</Step>
        <Step title="列でソートして絞り込む">チェックの有無で列をソートし、狙った文字列が含まれる／含まれない行を素早く抽出する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-16-payload-processing-02.svg"
        alt="Results 一覧に Grep - Match の列が追加され、大半の行にチェックが付く中で1行だけチェックが付いていない様子"
        caption="Grep - Match の列。多くの行がチェック付きの中、1行だけ違う挙動を示している"
      />
      <Callout variant="tip" title="典型例: ユーザー名の存在確認">
        ログイン失敗時のメッセージが「Invalid username」と「Invalid username or password」のように微妙に異なるアプリでは、Grep - Match にその文字列を登録しておくことで、<strong>実在するユーザー名だけを一覧上で機械的に見分けられます</strong>。
      </Callout>

      <Section>5. Grep - Extract — レスポンスから値そのものを抜き出す</Section>
      <p>
        「含まれているかどうか」ではなく、<strong>レスポンス中の値そのものを取り出して一覧の列に表示したい</strong>場合は「Grep - Extract」を使います。開始・終了の目印となる文字列（またはこれを自動検出させる方法）を指定すると、その間のテキストを抜き出して列に並べてくれます。
      </p>
      <ul>
        <li>エラーメッセージの詳細な内容そのものを一覧に並べて比較したい</li>
        <li>レスポンスに含まれる CSRF トークンや処理時間の値を、リクエストごとに比較したい</li>
        <li>次章で扱う実践演習のように、抜き出した値を後続の攻撃の判断材料にしたい</li>
      </ul>
      <Callout variant="info" title="Recursive grep との違い">
        前章で紹介した Payload type の「Recursive grep」は、<strong>抜き出した値を次のペイロードとして使う</strong>ものでした。一方この Grep - Extract は<strong>抜き出した値を Results の列に表示するだけ</strong>で、次の攻撃には使いません。「一覧で比較したいだけ」なら Grep - Extract、「前段の結果を次の入力に使いたい」なら Recursive grep、と役割で覚えると混同しません。
      </Callout>

      <Section>6. Content length・Status code でも異常を見つける</Section>
      <p>
        Grep を設定しなくても、Results には既定で<strong>Status code</strong>と<strong>Length（レスポンスの長さ）</strong>の列が表示されています。多くのアプリでは、成功と失敗でレスポンスの長さがわずかに異なることが多く、<strong>Length 列でソートするだけで異常な1件が見つかる</strong>ことも少なくありません。
      </p>
      <ComparisonTable
        headers={["着眼点", "何が分かるか"]}
        rows={[
          ["Status code の違い", "200 の中に1件だけ 302（リダイレクト）が混ざる、といった認可やログインの成否の違い"],
          ["Length の違い", "エラーページと正常ページで HTML のサイズが変わることによる成否の違い"],
          ["Response time の違い", "処理時間に差がある場合、タイミング攻撃の手がかり（Pro 版はより高精度な計測が可能）"],
        ]}
      />
      <p>
        Grep - Match / Extract は「探している文字列がすでに分かっている」場面で強力ですが、<strong>まず Length と Status code を眺めるだけで手がかりが見つかることも多い</strong>ため、いきなり Grep を設定する前に一度これらの列だけでソートしてみる習慣をつけておくと効率的です。
      </p>
      <KVList
        items={[
          { key: "Payload Processing", val: "送信前にペイロードを加工する（接頭辞・置換・エンコード・ハッシュ化など）" },
          { key: "Payload Encoding", val: "URL の特殊文字を自動でエンコードするかどうかの設定" },
          { key: "Grep - Payloads", val: "使ったペイロードの値そのものを Results の列に表示する" },
          { key: "Grep - Match", val: "レスポンスに特定の文字列が含まれるかを列に表示する" },
          { key: "Grep - Extract", val: "レスポンスから正規表現で値を抜き出し、列に並べる（次の攻撃には使わない）" },
          { key: "Status code / Length", val: "Grep を設定しなくても既定で表示される。まずここでソートしてみる" },
        ]}
      />

      <Section>7. 演習</Section>
      <Steps>
        <Step title="ラボを開く">Web Security Academy の Username enumeration 系ラボを開く</Step>
        <Step title="失敗時のメッセージの違いを確認する">存在するユーザー名と存在しないユーザー名でログインを試し、Repeater でレスポンスの文言の違いを見つける</Step>
        <Step title="Intruder に送り Grep - Match を設定する">ユーザー名リストで Sniper 攻撃を組み、見つけた文言を Grep - Match に登録する</Step>
        <Step title="列でソートして実在するユーザー名を特定する">攻撃後、Grep - Match の列やLength列でソートし、他と異なる行のユーザー名を特定する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-16-payload-processing-03.svg"
        alt="Results 一覧を Length 列でソートした状態。1行だけ他と異なる長さの値になっている"
        caption="Length 列でソートすると、他と異なる長さの行がひと目で分かる"
      />

      <Divider />

      <Quiz
        question="『抜き出した値を次のペイロードとして使う』ことができるのはどちらですか？"
        options={[
          "Grep - Match",
          "Grep - Extract（Recursive grep との組み合わせ以外の単体機能）",
          "Payload type の Recursive grep",
          "Payload Encoding",
        ]}
        answer={2}
        explanation="Grep - Extract はレスポンスから値を抜き出して Results の列に表示するだけの機能です。抜き出した値を次のリクエストのペイロードとして使い回すのは、Payload type の Recursive grep の役割です。"
      />

      <KeyPoints
        items={[
          "Payload Processing はペイロードを送信前に加工するルール群（接頭辞付与・置換・エンコード・ハッシュ化など）で、複数重ねて適用できる",
          "Payload Encoding は URL の特殊文字を自動エンコードする設定。基本はオンのままでよい",
          "Grep - Match はレスポンスに特定文字列が含まれるかを一覧の列として表示する",
          "Grep - Extract は正規表現でレスポンスから値そのものを抜き出し列に並べる（次の攻撃には使わない）",
          "Recursive grep は抜き出した値を次のペイロードとして使う点で Grep - Extract と役割が異なる",
          "Grep を設定する前に、まず Status code と Length の列だけでソートして手がかりを探す習慣が効率的",
        ]}
      />

      <p>
        この章で紹介した機能はどれも単体では地味に見えますが、<strong>組み合わせて使うことで数千件の結果から数秒で「怪しい1件」を絞り込める</strong>ようになります。次章の実践ラボでは、この組み合わせを実際に体験します。
      </p>

      <Callout variant="info" title="次のステップ">
        次章「17. 実践ラボ」で、ここまでの Positions・Attack type・Grep をまとめて使い、ログイン攻撃とロックアウト回避の演習に取り組みます。
      </Callout>
    </>
  );
}

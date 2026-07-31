import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-10-attack-surface",
  title: "10. 攻撃面を洗い出す — 手動クロールという基本動作",
  description: "自動クローラを持たない Community 版での基本動作である「手動でサイトマップを育てる」やり方を、網羅的な歩き方・見落としがちな入口・JS からのエンドポイント発見・パラメータ棚卸しの観点で身につける。",
  domain: "burp-practice",
  section: "target",
  order: 2,
  level: "practice",
  tags: ["Burp Suite", "Target", "攻撃面", "クロール", "偵察"],
  updated: "2026-07-28",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        Burp Suite Community Edition には自動クローラも自動スキャナもありません。だからこそ「手で歩いてサイトマップを育てる」動きが、この後のすべての診断作業の土台になります。（目標学習時間：60分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Community 版に自動クロール機能が無いことを前提に、手動でサイトマップを育てる意義を説明できる</li>
          <li>未認証・一般ユーザー・管理者の3視点で網羅的にアプリを歩けるようになる</li>
          <li>robots.txt・JS バンドル・エラーページなど見落としがちな入口を拾えるようになる</li>
          <li>見つけた入口とパラメータを表に整理し、次章以降の検証対象を準備できる</li>
        </ul>
      </Callout>

      <Section>1. 「手で歩く」が基本動作である理由</Section>
      <p>
        Burp Suite Professional / Enterprise には Scanner という自動クローラ兼脆弱性スキャナがあり、対象を渡せば自動的にリンクを辿ってサイトマップを埋めてくれます。<strong>しかし Community Edition にはこの機能がありません。</strong>Community で診断の練習をするなら、代わりに「アプリを実際に自分の手で操作し、Proxy を通過させることでサイトマップを育てる」動きが基本になります。
      </p>
      <Callout variant="info" title="手動クロールはむしろ実力になる">
        自動ツールに任せきりだと、ログイン後の画面やフォーム送信後の分岐など「クリックしないと辿り着けない」経路を見落とします。手で歩く力は、Pro 版を使う現場でも「自動スキャンだけでは拾えない経路を人間が埋める」ために必要とされる基礎スキルです。
      </Callout>

      <Section>2. 網羅的に歩くチェックリスト（3つの視点）</Section>
      <p>
        1人のユーザーとして触っただけでは、権限によって見える画面が変わるアプリの全体像はつかめません。最低でも3つの視点で歩きましょう。
      </p>
      <ComparisonTable
        headers={["視点", "確認すること", "具体例"]}
        rows={[
          ["未認証（ログイン前）", "ログイン不要で到達できる画面・API", "トップページ、商品一覧、検索、ログイン/登録フォーム、パスワードリセット"],
          ["一般ユーザー", "ログイン後に自分のアカウントでできること", "プロフィール編集、注文履歴、決済、ファイルアップロード、退会"],
          ["管理者（権限があれば）", "管理画面・管理者専用 API", "ユーザー管理、権限設定、ログ閲覧、設定変更"],
        ]}
      />
      <SubSection>機能単位のチェックリスト</SubSection>
      <ul>
        <li><strong>登録・ログイン</strong>: 新規登録、ログイン、ログアウト、多要素認証の有無</li>
        <li><strong>パスワードリセット</strong>: リセットリンクの発行、トークンの形式、再設定フォーム</li>
        <li><strong>プロフィール編集</strong>: 名前・メール・パスワード変更、アカウント削除</li>
        <li><strong>検索</strong>: 検索フォーム、フィルタ、ソート、ページネーション</li>
        <li><strong>アップロード</strong>: 画像・ファイルのアップロード先、許可される拡張子</li>
        <li><strong>決済</strong>: カート、注文確定、クーポン適用、金額計算がどこで行われるか</li>
        <li><strong>API</strong>: フロントが叩く内部 API、外部公開されている REST/GraphQL エンドポイント</li>
      </ul>

      <Section>3. 見落としがちな入口</Section>
      <p>
        ブラウザで見える画面を一通り触るだけでは足りません。以下は初心者が見落としやすい、しかし実務でよく見つかる入口です。
      </p>
      <KVList
        items={[
          { key: "robots.txt", val: "検索エンジンにクロールさせたくないパスの一覧。管理画面やバックアップの場所のヒントになることがある" },
          { key: "sitemap.xml", val: "サイト内ページの一覧。robots.txt とセットで確認する" },
          { key: "JS バンドル内の API パス", val: "フロントエンドのビルド済み JS に、まだ UI から辿れない API パスがハードコードされていることがある" },
          { key: "HTML/JS 内のコメント", val: "開発者が残した TODO・デバッグ用エンドポイント・内部メモが残っていることがある" },
          { key: "エラーページ", val: "存在しないパスへのアクセスで返るエラーメッセージに、内部パスやスタックトレースが漏れることがある" },
          { key: "古いバージョンのエンドポイント", val: "/api/v1/ が残ったまま /api/v2/ に移行しているなど、旧バージョンが生きている場合がある" },
        ]}
      />
      <Callout variant="warn" title="robots.txt はヒントであって保証ではない">
        robots.txt に載っているパスは「検索エンジンにインデックスさせたくない」という意思表示であり、認可の仕組みではありません。実際にアクセスできてしまうかどうかは別途確認が必要です（そしてそれ自体が調査対象になります）。
      </Callout>

      <Section>4. JS ファイルからエンドポイントを拾う実務</Section>
      <p>
        モダンな SPA は、UI に表示される前から多くの API パスを JS バンドルの中に持っています。Burp の Proxy history を使えば、これを効率よく洗い出せます。
      </p>
      <Steps>
        <Step title="MIME type で絞り込む">Proxy → HTTP history のカラム表示に「MIME type」を追加し、Script（JS ファイル）だけにフィルタする</Step>
        <Step title="レスポンス本文を検索する">気になる JS ファイルのレスポンスを開き、検索バーで「/api/」「fetch(」「axios.」などの文字列を探す</Step>
        <Step title="見つけたパスを手で叩いてみる">拾ったパスをブラウザや Repeater で実際にリクエストし、Site map に載せる（未認証で通るか、認証が要るかも確認する）</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-10-attack-surface-01.svg"
        alt="Proxy history で MIME type 列を Script に絞り込み、JS ファイルの一覧を表示している画面"
        caption="MIME type 列で Script に絞り込むと、JS ファイルだけを効率よく確認できる"
      />
      <Callout variant="tip" title="ソースマップが公開されている場合">
        本番ビルドでも <Cmd>.js.map</Cmd> ファイルが誤って公開されていると、元のソースコードに近い形で復元できてしまいます。JS ファイルと同じパスに <Cmd>.map</Cmd> が存在しないか確認する価値があります。
      </Callout>
      <p>
        検索は1つのファイルずつ行うより、Proxy history 全体を対象にした「Search」機能（画面上部の検索アイコン、または右クリックの Search メニュー）を使うと、複数の JS ファイルをまたいで一括検索できて効率的です。
      </p>

      <Section>5. パラメータの棚卸し</Section>
      <p>
        入口（URL）だけでなく、そこに渡っている<strong>値の置き場所</strong>も整理しておくと、後の検証（Repeater・Intruder の章）がスムーズになります。
      </p>
      <KVList
        items={[
          { key: "Params 列（Proxy history）", val: "クエリ文字列・POST ボディの値をまとめて一覧できる列。まず全体を俯瞰するのに使う" },
          { key: "Cookie", val: "セッション ID や設定値。改ざん検証・権限昇格の糸口になりやすい" },
          { key: "ヘッダ", val: "Authorization、X-Api-Key、カスタムヘッダ（X-Forwarded-For 等）" },
          { key: "JSON ボディ", val: "ネストしたオブジェクト内の隠しフィールド（isAdmin、role など）が無いか確認する" },
          { key: "パスパラメータ", val: "URL 自体に埋め込まれた ID（/users/123/ など）。他人の ID に置き換えられないか、次章以降の検証対象になる" },
        ]}
      />

      <Section>6. 見つけた入口を整理する</Section>
      <p>
        歩きながら見つけた入口は、その場で表にまとめておくと後の作業が段違いに速くなります。最低限、以下の列を持つ表を作りましょう。
      </p>
      <ComparisonTable
        headers={["URL", "メソッド", "パラメータ", "認証要否", "気になる点"]}
        rows={[
          ["/rest/products/search", "GET", "q（検索語）", "不要", "q をそのまま SQL に使っていそうな挙動（後で検証）"],
          ["/rest/user/change-password", "POST", "current, new, repeat", "要（セッション）", "current の一致チェックが甘い可能性"],
          ["/api/Products/1/reviews", "GET / PUT", "id（パス）, message", "要（PUT のみ）", "id を他人の商品IDに変えられるか未確認"],
          ["/#/administration", "GET（フロント側ルーティング）", "—", "UI 上は要ログインだが直リンクで到達可能か要確認", "権限チェックがフロントのみの疑い"],
        ]}
      />
      <Callout variant="info" title="表はそのまま次章の検証リストになる">
        「気になる点」列に書いたことが、次の章（Repeater の基本・実践）でそのまま仮説になります。歩きながら気づいたことはメモを惜しまないようにしましょう。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-10-attack-surface-02.svg"
        alt="入口一覧表のイメージ。URL・メソッド・パラメータ・認証要否・気になる点の列を持つ表"
        caption="歩きながら作る入口一覧表。列を固定しておくと抜け漏れが減る"
      />

      <Section>7. 演習</Section>
      <Callout variant="tip" title="演習: Juice Shop を30分歩く">
        Docker で起動した OWASP Juice Shop（<Cmd>docker run --rm -p 3000:3000 bkimminich/juice-shop</Cmd>）をブラウザ経由・Burp Proxy 通過で30分間操作してください。未認証・一般ユーザーの2視点で構いません。
        <ul>
          <li>トップページ、商品検索、カート、注文、ログイン・登録、プロフィール編集を一通り触る</li>
          <li>Proxy history の MIME type を Script で絞り、JS ファイルから API パスを最低3つ拾う</li>
          <li>見つけた入口を本章の表フォーマットで最低10行埋める</li>
          <li>robots.txt を確認し、記載されているパスに実際にアクセスできるか確かめる</li>
        </ul>
      </Callout>

      <Divider />

      <Quiz
        question="Burp Suite Community Edition でサイトマップを充実させる基本的な方法はどれですか？"
        options={[
          "Scanner を起動して自動クロールさせる",
          "アプリを自分の手で操作し、Proxy 経由の通信としてサイトマップに蓄積させる",
          "Collaborator を使って外部からのコールバックを待つ",
          "Site map comparison で過去のスナップショットと自動的にマージする",
        ]}
        answer={1}
        explanation="Scanner・Collaborator・Site map comparison はいずれも Professional/Enterprise 限定です。Community 版では、アプリを実際に手で操作し Proxy を通過させることでサイトマップを育てるのが基本動作になります。"
      />

      <KeyPoints
        items={[
          "Community 版に自動クローラ/スキャナは無い。手動でサイトマップを育てるのが基本",
          "未認証・一般ユーザー・管理者の3視点で網羅的に歩く",
          "robots.txt・sitemap.xml・JS バンドル・コメント・エラーページ・旧バージョン API に入口が隠れている",
          "Proxy history を MIME type: Script で絞ると、JS からの API パス発見が効率化する",
          "URL だけでなくパラメータの置き場所（Cookie/ヘッダ/JSON/パスパラメータ）も棚卸しする",
          "見つけた入口は URL/メソッド/パラメータ/認証要否/気になる点の表に整理し、次章以降の検証リストにする",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「11. Repeater の基本」から、いよいよ見つけた入口を1つずつ手で検証していく Repeater 編に入ります。
      </Callout>
    </>
  );
}

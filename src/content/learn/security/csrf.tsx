import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "csrf",
  title: "クロスサイトリクエストフォージェリ (CSRF)",
  description: "ログイン済みユーザーのブラウザを悪用し、本人の意図しない状態変更を送らせる攻撃。Cookie 自動付与の悪用、CSRF トークン、SameSite 属性による防御を罠ページのシーケンスで理解する。",
  domain: "security",
  section: "web-sec",
  order: 4,
  level: "basic",
  tags: ["CSRF", "Cookie", "セッション", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>クロスサイトリクエストフォージェリ（CSRF）</strong>は、ログイン済みの利用者が悪意あるサイトを開いた際、そのブラウザが<strong>自動で付ける認証情報（Cookie）を悪用</strong>して、攻撃者が用意したリクエストを本人の権限で標的サイトへ送らせる攻撃です。本人の意図に反した「状態変更」——送金・設定変更・退会など——が実行される点が本質です。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。動作する攻撃ページの構築コードは掲載しません。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>なぜ起きるのか — Cookie の自動付与</Section>
      <p>
        ブラウザは、あるオリジン宛のリクエストに対して、そのオリジンの Cookie を<strong>誰が発火させたかに関わらず自動的に付与</strong>します。標的サイトがリクエストの正当性を「有効な Cookie が付いているか」だけで判断していると、攻撃者のサイトから発行された偽リクエストにも本物の Cookie が付いてしまい、サーバは正規の操作と区別できません。
      </p>
      <p>
        巧妙なのは、攻撃者は<strong>応答を読む必要がない</strong>点です。同一オリジンポリシーにより攻撃者は応答を読み取れませんが、CSRF の目的は「読むこと」ではなく「<strong>状態を変えるリクエストを盲目的に発火させること</strong>」だからです。画像タグの読み込みや自動送信フォームを仕込むだけで、被害者のブラウザが勝手にリクエストを送ります。
      </p>
      <Callout variant="warn" title="XSS との違い">
        XSS は「攻撃者のスクリプトを被害者のブラウザで実行する」攻撃、CSRF は「被害者のブラウザに正規サイトへのリクエストを送らせる」攻撃です。CSRF ではスクリプト実行は不要で、Cookie が自動で付くという<strong>ブラウザの仕様そのもの</strong>を悪用します。
      </Callout>

      <Section>攻撃の流れ</Section>
      <SequenceDiagram
        actors={["被害者", "罠サイト", "標的サーバ"]}
        messages={[
          { from: 0, to: 1, label: "① ログイン中に罠ページを閲覧" },
          { from: 1, to: 0, label: "② 自動送信フォーム等を返す", cta: true },
          { from: 0, to: 2, label: "③ Cookie 付きで状態変更リクエスト", cta: true },
          { from: 2, to: 0, label: "④ 本人の操作として処理される", cta: true },
        ]}
        caption="罠ページが、被害者のブラウザに本人の権限でリクエストを送らせる"
      />
      <p>
        攻撃者は、標的の状態変更エンドポイントとパラメータを把握し、それを自動で発火させる罠ページを用意します。ログイン済みの被害者がそのページを開いた瞬間、被害者の権限でリクエストが実行されます。被害者は何も操作した覚えがないのに、設定が書き換わったり送金が実行されたりするわけです。
      </p>

      <Section>影響</Section>
      <KVList
        items={[
          { key: "不可逆な操作の強制", val: "送金・メールアドレス変更・退会など、取り消せない操作を実行させられる" },
          { key: "権限昇格・全体侵害", val: "管理者を狙えば、管理操作の実行から全体侵害へ発展し得る" },
        ]}
      />

      <Section>防御 — 出所を検証する</Section>
      <p>
        根本原因は「状態変更を Cookie 認証<strong>だけ</strong>で許し、リクエストの出所を確かめていない」ことです。そこで、正規の画面から来たリクエストであることを追加で証明させます。
      </p>
      <SubSection>CSRF トークン（Synchronizer Token Pattern）</SubSection>
      <p>
        サーバが正規のフォームに<strong>推測不可能なトークン</strong>を埋め込み、リクエスト時にそのトークンを検証します。攻撃者は他オリジンからこのトークンを読み取れない（同一オリジンポリシー）ため、罠ページからのリクエストにはトークンを付けられず、サーバが弾けます。これが最も確実な対策です。
      </p>
      <Code lang="html" filename="正規フォームに埋め込むトークン">{`<form action="/settings" method="post">
  <input type="hidden" name="csrf_token" value="（サーバ発行の推測不可能な値）">
  <!-- 送信時にサーバがこの値を検証する -->
</form>`}</Code>
      <SubSection>SameSite Cookie 属性</SubSection>
      <p>
        Cookie に <Cmd>SameSite=Lax</Cmd> または <Cmd>Strict</Cmd> を設定すると、<strong>他サイト起点のリクエストには Cookie を付けない</strong>ようブラウザが制御します。これは「Cookie の自動付与」という根っこに直接効く多層防御の基礎です。
      </p>
      <ComparisonTable
        headers={["SameSite 値", "挙動", "使いどころ"]}
        rows={[
          [<Cmd>Strict</Cmd>, "他サイト起点なら一切 Cookie を付けない", "最も厳格。外部リンクからの遷移でも未ログイン扱いになる点に注意"],
          [<Cmd>Lax</Cmd>, "トップレベルの GET 遷移では付くが、クロスサイトの POST 等では付かない", "実用的な既定。多くの CSRF を防ぎつつ利便性を保つ"],
          [<Cmd>None</Cmd>, "常に付く（Secure 必須）", "クロスサイトで Cookie が必要な場合のみ。CSRF 耐性は別途必要"],
        ]}
      />
      <Figure src="/learn/shots/security/csrf-01.svg" alt="ブラウザ DevTools の Application タブで Cookie 一覧を開き、SameSite 列と Secure 属性が表示されているスクリーンショット" caption="DevTools で自分のサイトの Cookie を確認する。SameSite が実際にどう設定されているかはここで見える" />
      <SubSection>併用したい対策</SubSection>
      <ul>
        <li><strong>Origin / Referer ヘッダの検証</strong> — リクエストの出所オリジンを確認する。</li>
        <li><strong>状態変更は GET を避ける</strong> — 副作用のある操作は POST/PUT/DELETE に限定する。画像タグ等で GET が発火しやすいため。</li>
        <li><strong>重要操作で再認証</strong> — 送金など致命的な操作はパスワード再入力や MFA を要求する。</li>
        <li><strong>フレームワーク標準の CSRF 保護を有効化</strong> — Django・Rails・Spring Security 等が用意する仕組みを使う。</li>
      </ul>
      <Callout variant="tip" title="トークン + SameSite の二段構え">
        SameSite だけ、トークンだけ、ではなく<strong>両方</strong>を入れるのが定石です。SameSite はブラウザ側の防御でブラウザ実装や設定に依存し、トークンはサーバ側の防御で確実性が高い——性質の異なる 2 層を重ねることで、どちらか一方が破れても守れます。
      </Callout>

      <Bridge course="ネットワーク / 認証・信頼境界">
        CSRF は、講義で習う<strong>認証（Authentication）と認可された意図の確認</strong>のギャップを突きます。Cookie は「この通信は誰のセッションか」は証明しますが、「この操作を<strong>本人が意図したか</strong>」までは証明しません。CSRF トークンは、正規画面から来たことを示す<strong>チャレンジ・レスポンス</strong>的な仕組みで、ネットワークで学ぶ「なりすまし対策としての nonce（使い捨ての値）」と同じ発想です。また SameSite は、ブラウザが<strong>オリジンという信頼境界</strong>をリクエスト送信時にも適用する仕組みで、CORS と同じく「オリジンを信頼の単位とする」設計思想の延長線上にあります。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "CSRF は Cookie の自動付与を悪用し、本人の権限で状態変更を送らせる",
          "攻撃者は応答を読む必要がない。盲目的に発火させれば目的を達する",
          "第一防御は推測不可能な CSRF トークンの検証",
          "SameSite=Lax/Strict で他サイト起点の Cookie 付与を止める",
          "GET で状態変更しない・再認証・フレームワーク標準保護を併用する",
        ]}
      />

      <Quiz
        question="CSRF が成立する主な理由はどれ？"
        options={[
          "攻撃者が被害者の Cookie を直接読み取れるから",
          "ブラウザがリクエストに Cookie を自動付与し、サーバが出所を検証しないから",
          "サーバが入力をエスケープせず HTML に反映するから",
          "TLS が有効になっていないから",
        ]}
        answer={1}
        explanation="ブラウザが Cookie を自動付与する仕様を悪用し、サーバが「Cookie さえあれば正規」と誤判定することで成立します。攻撃者は応答を読めなくても、状態変更を発火させれば目的を達します。"
      />
    </>
  );
}

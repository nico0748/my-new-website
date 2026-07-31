import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-09-sitemap-scope",
  title: "9. Target サイトマップとスコープ — 見る範囲を決める",
  description: "Target タブの構成、Site map の読み方（灰色/黒の違い）、そして診断すべてのベースになる Scope 設定（Include/Exclude・正規表現・Advanced scope control）を理解する。",
  domain: "burp-practice",
  section: "target",
  order: 1,
  level: "basic",
  tags: ["Burp Suite", "Target", "Scope", "Site map"],
  updated: "2026-07-28",
  minutes: 50,
};

export default function Article() {
  return (
    <>
      <Lead>
        Proxy で通信を捕まえられるようになったら、次は「どこまでを診断対象にするか」を決めます。Target タブと Scope 設定は、これ以降のすべての章で前提になる土台です。（目標学習時間：50分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Target タブの3つの構成要素（Site map / Scope settings / Issue definitions）を説明できる</li>
          <li>Site map のツリー表示・テーブル表示を読み、灰色と黒のアイテムの違いを理解する</li>
          <li>Scope を設定し、対象ホストだけに絞り込める</li>
          <li>Scope が Proxy history・Intruder・Repeater・拡張機能にどう影響するかを把握する</li>
        </ul>
      </Callout>

      <Section>1. Target タブの構成</Section>
      <p>
        Target タブは、Burp が観測した「対象の地図」を管理する場所です。中身は大きく3つに分かれています。
      </p>
      <KVList
        items={[
          { key: "Site map", val: "アクセスした（あるいは参照だけされた）ホスト・パスをツリー / テーブルで一覧表示する" },
          { key: "Scope settings", val: "「どのホスト・パスを診断対象とするか」を Include/Exclude のルールで定義する" },
          { key: "Issue definitions", val: "Burp が検出しうる脆弱性の種類・説明・参考情報をカタログとして参照できる（Community でも閲覧可）" },
        ]}
      />
      <p>
        この3つのうち、実務で最初に触るのは <strong>Scope settings</strong> です。スコープを決めてから Site map を育てていく、という順序を意識すると迷いません。
      </p>

      <Section>2. Site map の読み方</Section>
      <p>
        Site map はブラウザで（あるいは Proxy 経由で）アクセスしたホストとパスを、実際のディレクトリ構造のようなツリーとして蓄積していきます。左側のツリーでホスト・フォルダを選ぶと、右上のテーブルにそのパス配下のリクエスト一覧が、右下にリクエスト/レスポンスの中身が表示されます。
      </p>
      <SubSection>灰色のアイテムと黒のアイテム</SubSection>
      <p>
        Site map を眺めていると、同じ階層でも<strong>灰色（淡色）表示のアイテム</strong>と<strong>黒（濃色）表示のアイテム</strong>が混在していることに気づきます。これは意味が違います。
      </p>
      <ComparisonTable
        headers={["表示", "意味", "実務での扱い"]}
        rows={[
          ["黒（濃色）", "実際にリクエストを送りレスポンスを受け取った項目", "Proxy history と同じ内容。中身をそのまま確認できる"],
          ["灰色（淡色）", "HTML/JS 内のリンクや fetch 先として参照されているだけで、まだ自分からはリクエストしていない項目", "「存在は分かっているが未確認」の入口。次章の攻撃面の洗い出しで拾う対象"],
        ]}
      />
      <Callout variant="info" title="灰色アイテムは宝の山">
        灰色のパスは、HTML のリンクや JS 内の参照から Burp が自動的に見つけたものです。ここに管理画面や古い API のパスが混ざっていることがよくあります。次章「攻撃面を洗い出す」で重点的に扱います。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-09-sitemap-scope-01.svg"
        alt="Target タブの Site map。左にツリー、右上にテーブル、右下にリクエスト/レスポンスのペインが並ぶ"
        caption="Site map の画面構成。ツリーの階層と、灰色/黒のアイテムが混在している様子"
      />

      <Section>3. Scope の設定 — すべての土台</Section>
      <p>
        <strong>Scope は「今回の診断で何を対象にするか」を Burp 全体に伝える唯一の場所</strong>です。ここを設定しないまま作業を始めると、Proxy history が無関係な通信（広告・アナリティクス・OS のバックグラウンド通信など）で埋め尽くされ、Intruder や拡張機能まで無関係なホストへリクエストを送りかねません。
      </p>
      <Steps>
        <Step title="Add to scope">Site map のツリーで対象ホストを右クリックし「Add to scope」を選ぶ。最も手軽な方法</Step>
        <Step title="Scope settings を直接編集">「Target」→「Scope settings」タブを開き、Include/Exclude のルールを手で追加する</Step>
        <Step title="スコープ内かどうかを確認">Site map やテーブルの行に表示される in-scope の印で、意図した範囲になっているか確認する</Step>
      </Steps>

      <SubSection>Include / Exclude と正規表現</SubSection>
      <p>
        Scope settings には「Include in scope」と「Exclude from scope」の2つのリストがあります。それぞれプロトコル・ホスト・ポート・ファイルパスを指定でき、ホスト名やパスは<strong>正規表現</strong>で書けます。
      </p>
      <ComparisonTable
        headers={["設定項目", "書き方の例", "意図"]}
        rows={[
          ["Host（完全一致に近い）", <Cmd>0a1b00c1030f....web-security-academy.net</Cmd>, "ラボのホストだけをそのまま含める"],
          ["Host（正規表現）", <Cmd>{"^.*\\.web-security-academy\\.net$"}</Cmd>, "同じラボドメイン配下のサブドメインをまとめて含める"],
          ["File（除外）", <Cmd>{"^/analytics/.*"}</Cmd>, "計測系など診断上ノイズになるパスを Exclude で外す"],
          ["Protocol", "https のみに限定", "http へのリダイレクトなど余分な行を減らす"],
        ]}
      />
      <Callout variant="warn" title="Advanced scope control">
        Scope settings 下部の「Use advanced scope control」を有効にすると、Include/Exclude の各行を正規表現として厳密に扱えるようになります。デフォルトのシンプルモードでは URL の一部一致でも拾ってしまうことがあるため、対象が複数ホストにまたがる場合や、意図せぬドメインまで拾ってしまう場合は Advanced を有効にして正規表現で明示的に絞り込みましょう。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-09-sitemap-scope-02.svg"
        alt="Scope settings 画面。Include in scope / Exclude from scope のテーブルと Advanced scope control のチェックボックス"
        caption="Scope settings。Include/Exclude をそれぞれ正規表現で細かく制御できる"
      />

      <Section>4. スコープを設定すると何が変わるか</Section>
      <p>
        スコープはただの表示上のラベルではなく、Burp の各所の動作を実際に変えます。
      </p>
      <KVList
        items={[
          { key: "Proxy history", val: "「Show only in-scope items」フィルタを有効にすると、スコープ外の通信が一覧から消え、見るべき通信だけに集中できる" },
          { key: "Intruder / Repeater", val: "スコープ外のホストへ送信しようとすると、意図しない対象へ送っていないかの警告が出る（誤爆防止）" },
          { key: "拡張機能（BApp）", val: "多くの拡張は「in-scope のみ処理する」設定を持ち、対象範囲を尊重して動く" },
          { key: "Logger", val: "スコープでの絞り込みは Logger の表示フィルタにも反映され、大量の通信ログから対象だけを追いやすくなる" },
        ]}
      />
      <p>
        つまりスコープは「見た目のフィルタ」ではなく、<strong>Burp を横断して効いてくる共通設定</strong>だと考えてください。診断の最初にスコープを固めておくほど、後工程のノイズが減ります。
      </p>
      <Callout variant="danger" title="Drop all out-of-scope requests">
        Proxy の設定にある「Drop all out-of-scope requests」を有効にすると、<strong>スコープ外への通信そのものをブラウザから送らせない</strong>ようにできます。診断対象以外のサイトを誤って踏んでしまうのを防ぐ最後の砦です。特にラボ環境で作業する際は、この設定と Scope の組み合わせを習慣にしてください。
      </Callout>

      <Section>5. Issue definitions を資産として使う</Section>
      <p>
        Target タブの「Issue definitions」には、Burp が定義している脆弱性カテゴリ（SQL インジェクション、XSS、パストラバーサルなど）の説明・深刻度・参考リンクがまとめられています。<strong>Scanner が無い Community 版でも、このカタログ自体は自由に閲覧できます。</strong>「この脆弱性はどう説明すればいいか」「どんな観点で確認すべきか」を調べる辞書として活用できます。
      </p>
      <Callout variant="tip" title="レポート作成の下敷きに">
        Issue definitions の文言は、報告書を書く際の説明文のたたき台としても使えます。実践編（Repeater・通し演習の章）で見つけた事象を記録する際に見比べてみましょう。
      </Callout>

      <Section>6. Site map comparison は Pro 限定</Section>
      <p>
        Burp には2つの Site map のスナップショットを比較し、差分（新しく増えたパス・消えたパスなど）を検出する「Site map comparison」機能がありますが、これは<strong>Professional 限定機能</strong>です。Community 版では、手動で気づいた差分を自分でメモしていく必要があります。
      </p>

      <Section>7. 演習</Section>
      <Steps>
        <Step title="ラボを開く">PortSwigger の Web Security Academy で任意のラボ（例: Access control 系）を開始し、ブラウザで数ページ操作する</Step>
        <Step title="Proxy history を眺める">スコープ未設定の状態で Proxy → HTTP history を開き、ラボと無関係な通信（拡張機能の通信など）がどれだけ混ざっているか確認する</Step>
        <Step title="ラボのホストだけを Add to scope">Site map からラボのホストを右クリックして「Add to scope」</Step>
        <Step title="フィルタを有効化">Proxy → HTTP history のフィルタで「Show only in-scope items」を有効にし、history が静かになる（無関係な通信が消える）ことを確認する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-09-sitemap-scope-03.svg"
        alt="スコープ設定前後の Proxy history の比較。設定後は無関係な通信が消えて対象ホストの行だけが残る"
        caption="スコープを設定しフィルタを有効にした後の Proxy history。ノイズが消えて診断対象だけが残る"
      />

      <Divider />

      <Quiz
        question="Scope の Include/Exclude を「Advanced scope control」で有効にすると、何が変わりますか？"
        options={[
          "Site map の色分け（灰色/黒）が反転する",
          "Include/Exclude の各行を正規表現として厳密に評価するようになる",
          "Scanner が Community 版でも使えるようになる",
          "Proxy の待受ポートが自動的に変わる",
        ]}
        answer={1}
        explanation="Advanced scope control は Include/Exclude のルールを正規表現として厳密に扱うモードです。シンプルモードでの意図しない部分一致を避け、複数ホストやサブドメインを含む複雑な対象を正確に絞り込めます。"
      />

      <KeyPoints
        items={[
          "Target タブは Site map / Scope settings / Issue definitions の3つで構成される",
          "Site map の灰色アイテムは「参照だけされた未確認の入口」、黒は「実際に取得済み」",
          "Scope はすべての土台。設定しないと Proxy history・Intruder・拡張の対象が絞られない",
          "Include/Exclude は正規表現で書ける。複雑な対象は Advanced scope control を使う",
          "Drop all out-of-scope requests でスコープ外への誤送信そのものを防げる",
          "Site map comparison は Professional 限定。Community では差分を手動で追う",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「10. 攻撃面を洗い出す」で、Community 版に自動クローラが無い前提のもと、手動でサイトマップを育てて入口を洗い出す実践に入ります。
      </Callout>
    </>
  );
}

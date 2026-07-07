import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "xss",
  title: "クロスサイトスクリプティング (XSS)",
  description: "攻撃者のスクリプトを被害者のブラウザで「そのサイトのコード」として実行させる脆弱性。反射/格納/DOM/mXSS の違い、文脈別エスケープ、CSP、HttpOnly をシーケンス図とともに理解する。",
  domain: "security",
  section: "web-sec",
  order: 3,
  level: "basic",
  tags: ["XSS", "インジェクション", "ブラウザ", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>クロスサイトスクリプティング（XSS）</strong>は、Web アプリが利用者の入力を適切なエスケープなしに出力へ反映してしまい、攻撃者のスクリプトが<strong>被害者のブラウザ上で「そのサイトのコード」として実行される</strong>脆弱性です。実行は被害者の認証済みセッションの内側で起きるため、Cookie・セッション・DOM への完全なアクセスが攻撃者に渡ります。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。動作する攻撃スクリプトは掲載しません。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>なぜ起きるのか — 出力の文脈を壊す</Section>
      <p>
        ブラウザはサーバから受け取った HTML を解釈し、<Cmd>&lt;script&gt;</Cmd> などの実行可能な要素をそのページの文脈で実行します。アプリが利用者入力を HTML に埋め込む際にエスケープを怠ると、入力に含まれる <Cmd>&lt;</Cmd> <Cmd>&gt;</Cmd> <Cmd>"</Cmd> <Cmd>'</Cmd> といった文字が<strong>マークアップとして解釈</strong>され、攻撃者の書いたスクリプトがページの一部として動き出します。
      </p>
      <p>
        構図は SQL インジェクションとよく似ています。あちらは「入力が SQL の命令に化ける」、こちらは「入力が HTML/JS の命令に化ける」——どちらも<strong>データとして扱うべきものを命令として解釈させてしまう</strong>混同です。ただし XSS は実行の舞台が<strong>被害者のブラウザ</strong>である点が特徴で、被害者本人になりすました操作が可能になります。
      </p>

      <Section>XSS の種類</Section>
      <ComparisonTable
        headers={["種類", "どこで反映されるか", "発火の仕方"]}
        rows={[
          ["反射型 (Reflected)", "リクエストの入力が即座に応答へ返る", "罠リンクを踏ませて即発火。被害は踏んだ本人に限られる"],
          ["格納型 (Stored)", "入力が DB 等に保存される", "他の利用者が閲覧した時に発火。影響範囲が広くワーム化もあり得る"],
          ["DOM-based", "サーバを介さずクライアント JS が処理", "JS が入力を innerHTML/eval など危険な sink に渡して発火"],
          ["mutation (mXSS)", "ブラウザの HTML 正規化", "パーサの予期せぬ再解釈を悪用。サニタイズをすり抜けることがある"],
        ]}
      />
      <p>
        なかでも<strong>格納型</strong>は、掲示板・コメント・プロフィールなど「保存され、他人に表示される」場所で起きると被害が連鎖的に広がります。次のシーケンスで、格納型がどう発火するかを追ってみましょう。
      </p>

      <SequenceDiagram
        actors={["攻撃者", "サーバ (DB)", "被害者"]}
        messages={[
          { from: 0, to: 1, label: "① 悪性入力を投稿（保存される）", cta: true },
          { from: 2, to: 1, label: "② 該当ページを閲覧" },
          { from: 1, to: 2, label: "③ 未エスケープの HTML を返す", cta: true },
          { from: 2, to: 0, label: "④ 被害者ブラウザで実行→Cookie 等が漏れる", cta: true },
        ]}
        caption="格納型 XSS: 保存された入力が、後から閲覧した別ユーザーのブラウザで発火する"
      />

      <Section>影響</Section>
      <KVList
        items={[
          { key: "セッション窃取", val: "Cookie / トークンを盗みアカウントを乗っ取る" },
          { key: "画面の改ざん", val: "偽フォームやフィッシング表示でさらに情報を抜く" },
          { key: "本人操作の実行", val: "被害者の権限で送信・設定変更などを勝手に行う" },
          { key: "ワーム化", val: "格納型では感染が連鎖し大規模化することがある" },
        ]}
      />

      <Section>防御 — 出力時の文脈別エスケープが本丸</Section>
      <p>
        XSS の第一防御は<strong>出力時のエスケープ（エンコーディング）</strong>です。ポイントは「どの文脈へ出力するか」で必要なエスケープが違うことです。HTML 本文・属性値・JavaScript の中・URL の中では、危険な文字も無害化の方法も異なります。単に「<Cmd>&lt;</Cmd> を消す」だけでは属性文脈や JS 文脈で抜けが出ます。
      </p>
      <KVList
        items={[
          { key: "HTML 本文", val: "< > & \" ' を実体参照へ（<script> を実行させない）" },
          { key: "属性値", val: "クォートで囲み属性用にエスケープ。属性の分断を防ぐ" },
          { key: "JavaScript 内", val: "そもそも入力を JS に直挿ししない。データは JSON として安全に渡す" },
          { key: "URL", val: "URL エンコード。javascript: など危険スキームを排除する" },
        ]}
      />
      <Callout variant="tip" title="フレームワークの自動エスケープを無効化しない">
        React・Vue など現代のフレームワークは、既定で出力を自動エスケープします。<Cmd>{`{value}`}</Cmd> のように埋め込む限り安全です。危険なのは <Cmd>dangerouslySetInnerHTML</Cmd> や <Cmd>v-html</Cmd> のような<strong>自動エスケープを迂回する API</strong>で、これは最小限にとどめ、使うなら DOMPurify 等でサニタイズしてから渡します。
      </Callout>

      <SubSection>DOM-based は sink を避ける</SubSection>
      <p>
        DOM-based XSS はサーバを経由しないため、サーバ側のエスケープでは防げません。クライアント JS が入力を <Cmd>innerHTML</Cmd> や <Cmd>eval</Cmd> といった<strong>危険な sink</strong>に渡すことで発火します。対策は、<Cmd>innerHTML</Cmd> の代わりに <Cmd>textContent</Cmd> を使う、といった sink 側の選択です。
      </p>
      <Code lang="javascript" filename="危険な書き方（sink に直挿し）">{`// 入力がそのまま HTML として解釈される
el.innerHTML = userInput;`}</Code>
      <Code lang="javascript" filename="安全な書き方（テキストとして扱う）">{`// テキストとして挿入。HTML にはならない
el.textContent = userInput;`}</Code>

      <SubSection>多層防御 — CSP と Cookie 属性</SubSection>
      <ul>
        <li><strong>Content-Security-Policy (CSP)</strong> — インラインスクリプトの実行を禁止し、スクリプトの読み込み元を制限する。万一 XSS が入り込んでも<strong>被害を低減</strong>できる（詳細はセキュリティヘッダの記事で扱います）。</li>
        <li><strong>Cookie の <Cmd>HttpOnly</Cmd></strong> — JavaScript から Cookie を読めなくする。XSS が起きてもセッション Cookie の窃取を防ぐ。<Cmd>Secure</Cmd> / <Cmd>SameSite</Cmd> も併用する。</li>
        <li><strong>入力検証（許可リスト）</strong> — 多層防御として。ただし出力エスケープの代わりにはならない。</li>
      </ul>
      <Callout variant="warn" title="CSP は保険であって主対策ではない">
        CSP は「XSS が入っても悪用しにくくする」保険です。<Cmd>'unsafe-inline'</Cmd> を許すと保険が無力化します。あくまで<strong>出力エスケープが主対策</strong>で、CSP と HttpOnly はその上に重ねる層だと位置づけてください。
      </Callout>

      <Bridge course="オートマトン・形式言語 / コンパイラ">
        XSS もまた<strong>字句解析・構文解析</strong>の境界の問題です。ブラウザの HTML パーサは受け取った文字列をトークンに分解し、<Cmd>&lt;script&gt;</Cmd> を「スクリプト開始トークン」として認識します。攻撃者はデータの中にこの<strong>制御トークン</strong>を紛れ込ませ、パーサの状態遷移を乗っ取ります。出力エスケープとは、<Cmd>&lt;</Cmd> を <Cmd>&amp;lt;</Cmd> に変換して「これはタグの開始ではなく、ただの文字だ」とパーサに伝える操作にほかなりません。mXSS が厄介なのは、パーサが HTML を<strong>正規化（再解釈）</strong>する過程で、いったん無害化したはずのトークンが復活し得るからで、これは字句解析器の非自明な状態遷移が生む現象です。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "XSS は入力が HTML/JS の命令に化ける混同。実行の舞台は被害者のブラウザ",
          "種類は反射/格納/DOM/mXSS。格納型は影響範囲が広い",
          "第一防御は出力時の文脈別エスケープ。文脈で無害化の方法が違う",
          "フレームワークの自動エスケープを無効化しない。dangerouslySetInnerHTML は最小限",
          "CSP と HttpOnly は被害を低減する多層防御。主対策の代わりにはならない",
        ]}
      />

      <Quiz
        question="他の利用者が保存された投稿を閲覧したときに、その閲覧者のブラウザで発火する XSS はどれ？"
        options={["反射型 XSS", "格納型 XSS", "DOM-based XSS", "mutation XSS"]}
        answer={1}
        explanation="入力が DB 等に保存され、後から閲覧した別ユーザーのブラウザで発火するのが格納型（Stored）です。罠リンクを踏んだ本人だけに閉じる反射型より影響範囲が広くなります。"
      />
    </>
  );
}

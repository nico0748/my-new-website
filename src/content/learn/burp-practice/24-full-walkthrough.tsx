import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Steps, Step, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-24-full-walkthrough",
  title: "24. 通し演習 — 一つのアプリを最初から最後まで診る",
  description: "これまで学んだ Proxy・Target・Repeater・Intruder・拡張機能を、準備からスコープ設定・クロール・仮説立案・検証・記録までの一続きのワークフローに組み立てる総合演習。題材は OWASP Juice Shop。",
  domain: "burp-practice",
  section: "workflow",
  order: 1,
  level: "practice",
  tags: ["Burp Suite", "通し演習", "Juice Shop", "ワークフロー", "仮説検証"],
  updated: "2026-07-28",
  minutes: 120,
};

export default function Article() {
  return (
    <>
      <Lead>
        ここまでの章では Proxy・Target・Repeater・Intruder・拡張機能をそれぞれ個別に扱ってきました。この章では、それらを一続きのワークフローに組み立て、OWASP Juice Shop というひとつのアプリを最初から最後まで診断する通し演習を行います。（目標学習時間：120分）
      </Lead>

      <Callout variant="danger" title="対象は自分で立てたローカルインスタンスのみ">
        この演習は<strong>自分の PC 上に Docker で起動した OWASP Juice Shop</strong>に対してのみ実施してください。第三者が公開しているインスタンスや、許可を得ていない対象への同様の操作は不正アクセス行為に該当しうる違法行為です。
      </Callout>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>準備からスコープ設定・クロール・仮説立案・検証・記録までの一連の流れを自分の手で通せる</li>
          <li>攻撃面の棚卸しを一覧表として作成できる</li>
          <li>気づいた挙動を「仮説」として言語化し、適切な検証手段を選べる</li>
          <li>時間を区切って作業し、深追いをやめる判断ができる</li>
        </ul>
      </Callout>

      <Section>1. 全体の流れ — 8フェーズ</Section>
      <p>
        今回の通し演習は、次の8フェーズで進めます。実務の診断もおおむねこの流れで進行するため、ここで型として身につけておくと他のアプリにもそのまま応用できます。
      </p>
      <Steps>
        <Step title="フェーズ1: 準備">Juice Shop をローカルに起動し、Burp のスコープを設定して内蔵ブラウザで開く</Step>
        <Step title="フェーズ2: 手動クロール">複数の視点でアプリを歩き、サイトマップを育てる</Step>
        <Step title="フェーズ3: 攻撃面の棚卸し">見つかった入口を一覧表に整理する</Step>
        <Step title="フェーズ4: 仮説立案">気になった箇所ごとに、具体的な仮説を立てる</Step>
        <Step title="フェーズ5: Repeater で検証">立てた仮説を最小のリクエストで確認する</Step>
        <Step title="フェーズ6: 必要なら Intruder">パターン数が多い検証は Intruder に切り替える</Step>
        <Step title="フェーズ7: 記録">見つけた挙動を再現手順として整理する</Step>
        <Step title="フェーズ8: タイムボックスの判断">時間内で切り上げ、深追いをやめる</Step>
      </Steps>

      <Section>2. フェーズ1・2 — 準備とスコープ設定、手動クロール</Section>
      <p>
        まずは環境を整え、Burp が対象範囲だけを扱うようにします。
      </p>
      <Steps>
        <Step title="Docker で Juice Shop を起動する">ローカルで <code>docker run --rm -p 3000:3000 bkimminich/juice-shop</code> のようなコマンドで Juice Shop を起動し、<code>http://localhost:3000</code> で到達できることを確認する</Step>
        <Step title="Burp のスコープに localhost:3000 を追加する">Target → Scope で Include in scope に対象ホストを追加し、Proxy の設定で "Show only in-scope items" を有効にしてノイズを減らす</Step>
        <Step title="内蔵ブラウザで開く">Proxy → Intercept または Burp の内蔵ブラウザから Juice Shop を開き、Proxy に通信が記録されることを確認する</Step>
      </Steps>
      <p>
        準備ができたら、<strong>未認証・一般ユーザー・（可能であれば）管理者</strong>の3つの視点でアプリを歩き、サイトマップを育てます。視点を変えるたびに見える機能やリンクが変わるため、1視点だけで終わらせないことが重要です。
      </p>
      <ul>
        <li><strong>未認証</strong> — ログインせずに到達できるページ・API を洗い出す</li>
        <li><strong>一般ユーザー</strong> — 会員登録してログインし、マイページ・注文・レビュー投稿など認証後の機能を一通り触る</li>
        <li><strong>管理者（可能なら）</strong> — Juice Shop はチュートリアル要素として管理機能への手がかりを含むため、見つけられれば管理画面も歩いてみる</li>
      </ul>
      <Figure
        src="/learn/shots/burp-practice/burp-24-full-walkthrough-01.svg"
        alt="Burp の Target サイトマップに、未認証・一般ユーザー・管理者の3視点で歩いた結果、多数のエンドポイントが育っている画面"
        caption="3つの視点で歩いた結果、サイトマップにエンドポイントが積み上がっている様子"
      />

      <Section>3. フェーズ3 — 攻撃面の棚卸し</Section>
      <p>
        サイトマップができたら、目についた入口を一覧表に落とし込みます。表にすることで「後で見返せる」「抜け漏れに気づける」という利点があります。
      </p>
      <ComparisonTable
        headers={["URL", "メソッド", "パラメータ", "認証要否", "気になる点"]}
        rows={[
          ["/rest/products/:id/reviews", "GET", "id", "不要", "id を変えると他商品のレビューが見える。他人の投稿者情報も含む"],
          ["/rest/user/whoami", "GET", "なし（Cookie/Token 依存）", "必要", "認証状態の確認用。トークンの検証がどこまで厳密か気になる"],
          ["/rest/basket/:id", "GET", "id（カートID）", "必要", "id を他人のカートIDに変えたら見えるのでは"],
          ["/api/Feedbacks", "POST", "comment, rating", "不要", "入力値がそのまま表示に使われるならXSSの余地がありそう"],
          ["…", "…", "…", "…", "実際に歩いた分だけ行を追加していく"],
        ]}
      />
      <Callout variant="info" title="このテンプレートを毎回使い回す">
        「URL / メソッド / パラメータ / 認証要否 / 気になる点」の5列は、他のアプリの診断でもそのまま使い回せる最低限のテンプレートです。まずはこの形で機械的に埋めることを優先しましょう。
      </Callout>

      <Section>4. フェーズ4 — 仮説立案</Section>
      <p>
        棚卸しした一覧を眺めながら、「気になる点」を具体的な一文の仮説に変換していきます。仮説の立て方に迷ったら、次のような問いかけが手がかりになります。
      </p>
      <ul>
        <li>この ID を他人のものに変えたら、他人のデータが見えるのでは</li>
        <li>この価格やクーポン適用率は、クライアント側（JavaScript）でしか検証されていないのでは</li>
        <li>このトークン・ID は連番や予測可能な生成則になっていて、他人の値が推測できるのでは</li>
      </ul>
      <p>
        仮説が立ったら、それをどのツールで検証するのが適切かを判断します。
      </p>
      <ComparisonTable
        headers={["仮説の種類", "適した検証手段"]}
        rows={[
          ["ID を変えたら他人のデータが見える（IDOR）", "Repeater でIDだけを変えて1本ずつ送る"],
          ["価格・金額がクライアント側の検証に依存している", "Repeater で Body の金額パラメータを直接書き換えて送る"],
          ["トークン・ID が予測可能かもしれない", "Sequencer でランダム性を採取・分析する"],
          ["同じ仕様の値を大量パターンで確認したい（連番の総当たり等）", "Intruder で Payloads を用意して回す"],
          ["似たリクエストの微妙な差分に気づきたい", "Comparer で2つのリクエスト/レスポンスを並べて比較する"],
        ]}
      />

      <Section>5. フェーズ5・6 — Repeater で検証し、必要なら Intruder へ</Section>
      <p>
        仮説を立てたら、実際に Repeater で最小の1リクエストから検証します。ここまでの章で身につけた「仮説 → 最小の1リクエストで検証 → 記録」の型をそのまま使います。
      </p>
      <Steps>
        <Step title="仮説1: レビューの id を他商品に変える">/rest/products/:id/reviews の id を別商品の値に変え、Repeater で送って本文の差分を確認する</Step>
        <Step title="仮説2: カートの金額パラメータを書き換える">カート確定時のリクエストで金額・数量に関わるパラメータを直接書き換え、サーバー側で再計算されるか、クライアントの値がそのまま通ってしまうかを確認する</Step>
        <Step title="仮説3: バスケットIDを他人のものに変える">/rest/basket/:id の id を別の番号に変え、他人のカート内容が見えないかを確認する</Step>
      </Steps>
      <p>
        1つの ID だけを大量に総当たりしたい場合や、同じ検証を多数のパラメータに対して繰り返したい場合は、ここで Intruder に切り替えます。Repeater で「型」が確認できてから Intruder で数をこなす、という順序を守ると無駄がありません。
      </p>
      <Figure
        src="/learn/shots/burp-practice/burp-24-full-walkthrough-02.svg"
        alt="Repeater で3つのタブに分けて、レビューのID書き換え・金額の書き換え・カートIDの書き換えをそれぞれ検証している画面"
        caption="3つの仮説をそれぞれ別の Repeater タブで検証している様子"
      />

      <Section>6. フェーズ7・8 — 記録と、深追いをやめる判断</Section>
      <p>
        見つけた挙動は、その場で再現手順に落とし込みます。「最小のリクエスト」「前提条件（ログイン状態・対象アカウント）」「期待していた結果」「実際の結果」の4点を最低限メモしておけば、後で報告書に仕立てる際の土台になります（詳しい書き方は次章で扱います）。
      </p>
      <p>
        通し演習では、<strong>90分のようにあらかじめ時間を区切る</strong>ことも重要な技術です。時間内に見つかった範囲で一覧表と検証ログを完成させ、時間が来たら「もっと深掘りできそうだが、今日はここまで」と割り切る判断を意識的に行いましょう。実務でも際限なく1つの機能を深追いすると、他の攻撃面を見落とすリスクが高まります。
      </p>
      <Callout variant="tip" title="判断の目安">
        「同じ仮説を裏取りするために3回以上リクエストを送り直している」「30分以上同じエンドポイントだけを見ている」といった状態になったら、一度立ち止まって「今の仮説を保留し、他の入口に移る」判断を検討しましょう。
      </Callout>

      <Section>7. 演習課題</Section>
      <Callout variant="tip" title="演習課題: 90分のタイムボックスで通し演習を完成させる（ローカル環境限定）">
        ローカルの Juice Shop に対し、90分のタイムボックスを設定し、フェーズ1〜7を一通り実施してください。攻撃面の棚卸し表（最低10行）と、3つ以上の仮説の検証ログを完成させ、時間内に切り上げてください。
      </Callout>

      <Divider />

      <Quiz
        question="この通し演習のワークフローで、Intruder に切り替えるべきタイミングとして最も適切なのはどれですか？"
        options={[
          "アプリを開いた直後、まずクロールの代わりに Intruder で全パスを総当たりする",
          "Repeater で仮説の「型」を確認できたあと、同じ検証を大量パターンで繰り返したいとき",
          "攻撃面の棚卸し表を作る前に、とりあえず手当たり次第に Intruder を回しておく",
          "記録・報告の段階になってから、証跡集めのために Intruder を使う"
        ]}
        answer={1}
        explanation="この演習では、まず Repeater で仮説を1本のリクエストで確認し、型が固まったうえで大量パターンの検証が必要なときに Intruder へ切り替える、という順序を推奨しています。いきなり総当たりから入るとノイズが増え、仮説の検証にも時間がかかります。"
      />

      <KeyPoints
        items={[
          "通し演習は 準備→スコープ設定→手動クロール→棚卸し→仮説立案→Repeater検証→必要ならIntruder→記録 の8フェーズで進める",
          "手動クロールは未認証・一般ユーザー・管理者など複数視点で行い、サイトマップを育てる",
          "攻撃面の棚卸しは URL/メソッド/パラメータ/認証要否/気になる点の表に落とし込む",
          "仮説は一文で言えるレベルまで具体化し、仮説の性質に応じて Repeater/Intruder/Sequencer/Comparer を使い分ける",
          "見つけた挙動はその場で最小リクエスト・前提条件・期待/実際を記録する",
          "タイムボックスを決め、深追いをやめる判断も診断技術の一部",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次の章では、この演習で残した記録を、第三者に伝わるレポートの形に整える方法を学びます。
      </Callout>
    </>
  );
}

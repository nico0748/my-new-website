import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-11-repeater-basics",
  title: "11. Repeater の基本 — 1リクエストを何度でも",
  description: "Repeater が何をする道具かから、送り方・画面構成・タブの整理・レスポンスの見方・差分を見るコツまで、診断の主戦場である Repeater の基本操作を身につける。",
  domain: "burp-practice",
  section: "repeater",
  order: 1,
  level: "basic",
  tags: ["Burp Suite", "Repeater", "検証", "レスポンス比較"],
  updated: "2026-07-28",
  minutes: 50,
};

export default function Article() {
  return (
    <>
      <Lead>
        Target で対象を絞り込み、攻撃面を洗い出したら、いよいよ1つずつ手で確かめていきます。Repeater は Burp Suite における診断の主戦場です。（目標学習時間：50分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Repeater が何のための道具かを説明できる</li>
          <li>Proxy history や Intercept から Repeater へリクエストを送れる</li>
          <li>Repeater の画面構成（リクエスト/レスポンス・タブ・履歴）を理解できる</li>
          <li>レスポンスの差分（Length・時間・本文）を見て変化に気づけるようになる</li>
        </ul>
      </Callout>

      <Section>1. Repeater は何をする道具か</Section>
      <p>
        Repeater は、<strong>1本のリクエストを自由に編集し、何度でも送り直して、返ってきたレスポンスを見比べる</strong>ための道具です。Web アプリ診断の作業の多くは「パラメータを1つ変えたらどうなるか」「同じ操作を条件を変えて繰り返したらどうなるか」を地道に確かめる作業であり、その中心にいるのが Repeater です。
      </p>
      <p>
        Proxy が「通信を捕まえる」役割、Target が「範囲を決める」役割だとすれば、Repeater は<strong>「1つの仮説を、1本のリクエストで検証する」</strong>役割を担います。次章以降で扱う Intruder は同じことを大量パターンで自動化する道具ですが、まずは1本ずつ丁寧に確かめる Repeater の使い方を体に染み込ませることが、遠回りに見えて一番の近道です。
      </p>

      <Section>2. Repeater への送り方</Section>
      <p>
        Repeater を使うには、まず対象のリクエストを Repeater タブに送り込む必要があります。
      </p>
      <ComparisonTable
        headers={["操作元", "やり方"]}
        rows={[
          ["Proxy → HTTP history", "対象の行を選択 → 右クリック → Send to Repeater、またはショートカット Ctrl+R（macOS は Cmd+R）"],
          ["Proxy → Intercept", "一時停止中のリクエストで同様に右クリック → Send to Repeater（この場合、元のリクエストは別途 Forward/Drop する）"],
          ["Target → Site map", "任意の行を選択して同じ操作。まだ送信していない灰色アイテムに対しては、この経路で初めてリクエストを組み立てて送ることもある"],
        ]}
      />
      <Callout variant="info" title="ショートカットは覚えておく価値がある">
        <Cmd>Ctrl+R</Cmd>（<Cmd>Cmd+R</Cmd>）は診断作業中に一番使うショートカットと言っても過言ではありません。マウスでの右クリックよりも圧倒的に速く、この章の後半で他のショートカットも一覧にまとめます。
      </Callout>

      <Section>3. 画面構成</Section>
      <p>
        Repeater タブを開くと、左側にリクエスト編集ペイン、右側にレスポンス表示ペインが並びます。
      </p>
      <KVList
        items={[
          { key: "左ペイン（Request）", val: "送信するリクエストをそのまま編集できるテキストエリア。1行目のメソッド・パス、ヘッダ、空行、ボディをそのまま書き換えられる" },
          { key: "Send ボタン", val: "編集した内容でリクエストを送信する。ショートカットは Ctrl+Space（Cmd+Space）" },
          { key: "右ペイン（Response）", val: "送信結果のレスポンスが表示される。送信前は空欄" },
          { key: "上部のタブ", val: "Repeater は複数のリクエストを別々のタブとして同時に開いておける。タブごとに送信履歴も独立している" },
          { key: "履歴の戻る/進むボタン", val: "同じタブ内で送信した過去のリクエスト/レスポンスの組を遡って見返せる（ブラウザの戻る/進むに近い感覚）" },
        ]}
      />
      <Figure
        src="/learn/shots/burp-practice/burp-11-repeater-basics-01.svg"
        alt="Repeater の画面。左にリクエスト編集ペイン、右にレスポンス表示ペイン、上部にタブが並ぶ"
        caption="Repeater の基本レイアウト。左で編集し Send、右で結果を確認する"
      />

      <SubSection>タブの命名とグループ化</SubSection>
      <p>
        検証対象が増えてくると、Repeater のタブはあっという間に増殖します。タブをダブルクリックすると名前を変更できるので、<Cmd>login-baseline</Cmd> や <Cmd>idor-user2</Cmd> のように<strong>「何を試しているか」が分かる名前</strong>を付けておくと、後で見返すときに迷いません。関連するタブは右クリックの「Group」機能でまとめておくと、さらに散らかりにくくなります。
      </p>
      <Callout variant="tip" title="命名ルールを決めておく">
        「対象機能-試している内容」のように、自分の中で命名ルールを決めておくと迷いが減ります。例えば <Cmd>login-baseline</Cmd>、<Cmd>login-wrong-pw</Cmd>、<Cmd>profile-idor-user2</Cmd> のように統一しておくと、タブが増えても目的別に並び替えて眺められます。
      </Callout>

      <Section>4. レスポンスの見方</Section>
      <p>
        レスポンスペインには複数の表示モードがあります。目的に応じて切り替えましょう。
      </p>
      <ComparisonTable
        headers={["ビュー", "内容", "使いどころ"]}
        rows={[
          ["Pretty", "整形された HTML/JSON などを見やすく表示", "普段はまずこれで内容を確認する"],
          ["Raw", "生のバイト列に近い表示（改行・ヘッダも含む）", "ヘッダの細部やエンコードの問題を疑うとき"],
          ["Hex", "16進ダンプ表示", "バイナリデータや制御文字を扱うとき"],
          ["Render", "ブラウザのようにレンダリングして表示", "HTML の見た目・XSS の発火有無を目視するとき"],
        ]}
      />
      <p>
        レスポンスペインの上部には<strong>Status（ステータスコード）</strong>、<strong>Length（本文のバイト数）</strong>、送信からの<strong>所要時間</strong>が表示されます。この3つは、内容を読む前にまず目を通す習慣をつけましょう。
      </p>
      <SubSection>複数タブを並べて見比べる</SubSection>
      <p>
        Repeater は複数タブを横に並べて表示できます（タブを右クリック →「Open in new window」で別ウィンドウ化するか、画面分割の設定を使う）。「正常系のリクエストを送ったタブ」と「1箇所だけ変えたリクエストを送ったタブ」を並べて Status・Length を見比べると、差分に気づく速度が大きく上がります。慣れないうちは、この並べ見比べる操作を意識的に行うと良いでしょう。
      </p>

      <Section>5. 差分を見るコツ</Section>
      <p>
        Repeater での検証は「何かを変えて送る → 結果を比べる」の繰り返しです。差分を見落とさないための小さなコツがいくつかあります。
      </p>
      <ul>
        <li><strong>Length の変化に注目する</strong>: 本文を全部読まなくても、Length の数値が変わっただけで「何かが違う」と気づける。エラーメッセージが追加/削除されると Length は敏感に変化する</li>
        <li><strong>所要時間の変化に注目する</strong>: 同じ操作なのに応答が明らかに遅くなった場合、裏側で余分な処理（DB クエリの失敗、外部通信の待機など）が起きている可能性がある</li>
        <li><strong>ベースラインを先に取る</strong>: 何かを変える前に、まず「正常な入力での結果」を1回送って Length・時間・Status を記録しておく。比較対象が無いと差分に気づけない</li>
        <li><strong>1回で判断しない</strong>: ネットワークやサーバーの揺らぎで時間は多少ばらつく。同じ操作を2回送って再現するかを確認する</li>
      </ul>
      <Callout variant="tip" title="ベースラインを取ってから崩す">
        「まず正常系を1回送って基準を作り、そこから1箇所だけ変えて再送する」という順番を徹底すると、何が原因で差分が出たのかを切り分けやすくなります。次章以降のラボ実践でもこの型を使います。
      </Callout>
      <Callout variant="info" title="厳密な比較は Comparer へ（補助ツール群の章で扱う）">
        目視で気づいた「なんとなく違う」を、バイト単位・単語単位で正確に突き合わせたい場合は Comparer というツールを使います。Comparer の使い方は後の「補助ツール群」の章で扱うので、ここでは「目視での差分に気づく」練習に集中してください。この段階で目視の勘所を養っておくと、Comparer を使うべき場面の判断も速くなります。
      </Callout>

      <Section>6. ショートカット一覧</Section>
      <ComparisonTable
        headers={["操作", "macOS", "Windows/Linux"]}
        rows={[
          ["選択中のリクエストを Repeater へ送る", "Cmd+R", "Ctrl+R"],
          ["Repeater でリクエストを送信する", "Cmd+Space（Send ボタン相当）", "Ctrl+Space"],
          ["新しい Repeater タブを開く", "Cmd+T", "Ctrl+T"],
          ["現在のタブを閉じる", "Cmd+W", "Ctrl+W"],
          ["Intercept の一時停止を解除して転送", "Cmd+F（環境により異なる）", "Ctrl+F（環境により異なる）"],
        ]}
      />
      <Callout variant="info" title="ショートカットは環境依存もある">
        OS やキーボード配列、既存の Burp 設定によっては割り当てが異なる場合があります。「Repeater」メニューや設定画面で自分の環境の実際の割り当てを一度確認しておきましょう。
      </Callout>

      <Section>7. 演習</Section>
      <Steps>
        <Step title="ログイン API を Repeater に送る">Web Security Academy の任意のラボ、または Juice Shop のログイン画面でログインを試み、Proxy history からログイン API のリクエストを Repeater に送る</Step>
        <Step title="ベースラインを取る">正しいメールアドレス・間違ったパスワードで1回送信し、Status・Length・本文を記録する</Step>
        <Step title="パスワードを1文字だけ変えて再送する">同じリクエストのパスワード欄を1文字だけ変えて Send し、Status・Length・本文がどう変わるかを比較する</Step>
        <Step title="正しいパスワードでも試す">正しいメール・正しいパスワードで送り、失敗時との Length・所要時間の違いをまとめる</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-11-repeater-basics-02.svg"
        alt="Repeater で2つのリクエストのレスポンスを見比べている画面。Length と Status の違いが分かる"
        caption="パスワードを変えて送った2回のレスポンス比較。Length の違いに注目する"
      />

      <Divider />

      <Quiz
        question="Repeater で検証を行う際、差分に気づくために最初にすべきこととして最も適切なものはどれですか？"
        options={[
          "いきなり不正な値を大量に試す",
          "正常な入力でベースライン（基準となる Status・Length・時間）を取っておく",
          "Intruder に切り替えて自動化する",
          "レスポンスの Hex ビューだけを確認する",
        ]}
        answer={1}
        explanation="差分に気づくには比較対象が必要です。まず正常な入力で1回送信しベースラインを記録してから、1箇所だけ変えて再送し比較する、という型を身につけることが Repeater 活用の基本になります。"
      />

      <KeyPoints
        items={[
          "Repeater は1本のリクエストを編集して繰り返し送り、レスポンスの差分を見る道具",
          "Proxy history/Intercept/Site map から Ctrl+R（Cmd+R）で送れる",
          "タブに名前を付け、関連タブはグループ化して散らからないようにする",
          "レスポンスは Pretty/Raw/Hex/Render を使い分ける。Status・Length・時間をまず見る",
          "正常系でベースラインを取ってから1箇所だけ変えて比較するのが基本の型",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「12. メッセージエディタと Inspector」で、Repeater・Intruder・Proxy 共通のリクエスト編集機能を掘り下げ、編集をもっと速くする方法を学びます。
      </Callout>
    </>
  );
}

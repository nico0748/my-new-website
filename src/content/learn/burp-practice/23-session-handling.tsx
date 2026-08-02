import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-23-session-handling",
  title: "23. セッション処理ルールとマクロ — 認証を切らさず自動化する",
  description: "Intruder を回している途中でセッションが切れる、CSRF トークンが毎回変わって使い回せないといった悩みを、Sessions のマクロとセッション処理ルールで解決する方法を学ぶ。",
  domain: "burp-practice",
  section: "extend",
  order: 2,
  level: "practice",
  tags: ["Burp Suite", "セッション処理", "マクロ", "Cookie jar", "CSRF"],
  updated: "2026-07-28",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        Intruder で大量のリクエストを回している最中にセッションが切れる、CSRF トークンが毎回変わって同じリクエストを再送できない――こうした自動化の壁を、Burp の Sessions 機能（マクロとセッション処理ルール）で乗り越える方法を学びます。（目標学習時間：60分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Session handling rules・Cookie jar・Macros の役割を説明できる</li>
          <li>ログイン操作をマクロとして記録し、パラメータの引き継ぎを設定できる</li>
          <li>マクロとルールを組み合わせて、長時間の自動化中もセッションを維持できる</li>
          <li>毎回変わる CSRF トークンをマクロで取得し、次のリクエストに埋め込める</li>
          <li>ルールがうまく動かないときに Sessions tracer で原因を追える</li>
        </ul>
      </Callout>

      <Section>1. 困る場面</Section>
      <p>
        Repeater や Intruder で検証を進めていると、次のような場面にたびたび出会います。
      </p>
      <ul>
        <li>Intruder で数百リクエストを流している途中で、セッションタイムアウトによりログアウト状態になり、以降がすべて失敗になる</li>
        <li>CSRF トークンがリクエストごと・ページ読み込みごとに変わる仕様で、キャプチャした1本のリクエストをそのまま再送しても弾かれる</li>
        <li>ある操作（パスワード変更等）を実行すると強制的にログアウトさせられ、後続の確認ができなくなる</li>
      </ul>
      <p>
        これらはすべて「今のセッションが有効かどうか」「必要な値を毎回どう用意するか」という同じ根っこの問題です。Burp はこれを <strong>Settings → Sessions</strong> の機能でまとめて解決できるように設計されています。
      </p>

      <Section>2. Settings → Sessions の全体像</Section>
      <p>
        Sessions の設定は3つの要素で構成されます。
      </p>
      <KVList
        items={[
          { key: "Session handling rules", val: "「どのツールの、どの URL 範囲の通信に対して」「どんなアクション（マクロ実行・セッション有効性チェック・Cookie jar の利用等）を行うか」を定義するルール本体" },
          { key: "Cookie jar", val: "Burp が横断的に保持する Cookie の保管庫。どのツールの通信からクッキーを拾うかを設定し、Repeater/Intruder のリクエストに自動反映できる" },
          { key: "Macros", val: "ログイン等、複数リクエストからなる一連の操作を記録し、パラメータの引き継ぎを設定したうえで、ルールから呼び出せる部品にしたもの" },
        ]}
      />
      <Callout variant="info" title="3つは組み合わせて使う">
        Cookie jar 単体でも「別タブで取得した Cookie を自動反映する」用途に使えますが、真価を発揮するのはマクロ＋ルールの組み合わせです。「セッションが切れていたらマクロでログインし直し、取得した Cookie を今のリクエストに使う」という流れを自動化できます。
      </Callout>

      <Section>3. Cookie jar の仕組み</Section>
      <p>
        Cookie jar は、指定したツール（Proxy・Repeater・Intruder 等）を通過した通信の Set-Cookie を監視し、ドメインごとに最新の Cookie 値を保持します。Session handling rules で「Use cookies from the cookie jar」アクションを設定すると、そのルールが適用されたリクエストの Cookie ヘッダが、Cookie jar の最新値に自動で書き換えられます。
      </p>
      <p>
        たとえばブラウザ経由でログインし直した際、その通信を Proxy が通っていれば Cookie jar が新しい Cookie を拾い、以降 Repeater から送るリクエストにも反映させることができます。
      </p>

      <Section>4. マクロの作り方</Section>
      <p>
        マクロは「一連のリクエストの再現手順」を記録したものです。ログイン処理のように、複数リクエストを順番どおりに送る必要がある操作を部品化します。
      </p>
      <Steps>
        <Step title="対象操作を一度ブラウザで実行する">内蔵ブラウザでログインを実際に行い、Proxy history にログインに関わる一連のリクエストを記録させる</Step>
        <Step title="Sessions → Macros → Add を開く">Settings → Sessions → Macros の Add ボタンから、マクロ記録用のダイアログを開く</Step>
        <Step title="history から該当リクエストを選ぶ">表示された Proxy history の一覧から、ログインページの取得・認証情報の送信など、必要なリクエストを順番どおりに選択して OK を押す</Step>
        <Step title="Configure item でパラメータの引き継ぎを設定する">CSRF トークンのように「前のレスポンスから値を取って次のリクエストに埋め込む」必要がある箇所は、対象リクエストの Configure item を開き、引き継ぎ元のレスポンスと抽出方法（正規表現等）を指定する</Step>
        <Step title="Test macro でテスト実行する">マクロ一覧の Test ボタンで実際に一連のリクエストを走らせ、最終的に有効なセッションが得られているか結果を確認する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-23-session-handling-01.svg"
        alt="Sessions の Macros 設定画面で、ログインに関わる複数リクエストが順番に並び、Configure item でパラメータの引き継ぎを設定している様子"
        caption="ログイン処理をマクロとして記録し、パラメータの引き継ぎを設定している画面"
      />

      <Section>5. セッション処理ルールの作り方</Section>
      <p>
        マクロを作ったら、それを「いつ・どのリクエストに対して」実行するかをルールとして定義します。
      </p>
      <Steps>
        <Step title="Sessions → Session Handling Rules → Add を開く">ルールの追加ダイアログを開く</Step>
        <Step title="Rule Actions タブでアクションを組み合わせる">「Check session is valid」（セッションが有効か確認する）→「Run a macro」（無効ならログインマクロを実行する）→「Use cookies from the cookie jar」（取得した Cookie を今のリクエストに反映する）の順で複数アクションを積み上げる</Step>
        <Step title="Scope タブでツールと URL 範囲を絞る">Tool Scope で Intruder・Repeater 等、適用したいツールだけにチェックを入れ、URL Scope で対象アプリのドメイン配下だけに絞る</Step>
        <Step title="保存して対象のツールで通信を送ってみる">Repeater や Intruder から実際にリクエストを送り、ルールが意図どおりに発火しているか確認する</Step>
      </Steps>

      <Section>6. 実例1 — 長時間の Intruder を通す</Section>
      <p>
        ログインマクロと「セッションが無効なら再ログインする」ルールを組み合わせておけば、Intruder が数百〜数千リクエストを送る間にセッションが切れても、ルールが自動的にログインし直して処理を続行してくれます。長時間かかる攻撃を組む前に、必ずこの仕組みを準備しておきましょう。
      </p>
      <Figure
        src="/learn/shots/burp-practice/burp-23-session-handling-02.svg"
        alt="Session Handling Rules の Rule Actions タブで Check session is valid、Run a macro、Use cookies from the cookie jar の3つのアクションが順番に並んでいる画面"
        caption="セッション無効時に自動でログインマクロを実行するルールの構成例"
      />

      <Section>7. 実例2 — 毎回変わる CSRF トークンを引き継ぐ</Section>
      <p>
        CSRF トークンが毎回変わる場合、事前に叩いたページ取得リクエストのレスポンス本文からトークンを抽出し、それを次のリクエストのパラメータに埋め込む、という引き継ぎをマクロの Configure item で設定します。
      </p>
      <ComparisonTable
        headers={["設定項目", "内容"]}
        rows={[
          ["Derive from prior response", "マクロ内のどのレスポンスから値を取るかを選択する"],
          ["抽出方法", "正規表現、または開始/終了の目印文字列でレスポンス本文から値を切り出す"],
          ["適用先", "後続リクエストのどのパラメータ（Body/Header/Cookie）に、抽出した値を差し込むかを指定する"],
        ]}
      />
      <p>
        この設定をしたマクロをルールから呼び出せば、Repeater でリクエストを送るたびに最新の CSRF トークンが自動で埋め込まれた状態になります。
      </p>

      <Section>8. デバッグの仕方</Section>
      <p>
        ルールが期待どおりに動かないときは、次の手段で「何が起きているか」を追います。
      </p>
      <ul>
        <li><strong>Sessions tracer</strong> — Settings → Sessions の下部にあるトレース機能で、対象リクエストに対してどのルールがどう発火したか、マクロが何を送受信したかを1手ずつ確認できる</li>
        <li><strong>Dashboard の Event log</strong> — マクロ実行やセッションチェックに関するイベントがログに流れるので、エラーメッセージが出ていないか確認する</li>
      </ul>

      <Section>9. 落とし穴</Section>
      <ComparisonTable
        headers={["落とし穴", "対策"]}
        rows={[
          ["ルールのスコープが広すぎて全リクエストにマクロが走る", "Tool Scope と URL Scope を対象アプリ・対象ツールだけに絞る"],
          ["ログインを叩きすぎてレート制限やアカウントロックに当たる", "Check session is valid を先に置き、本当に必要なときだけログインマクロを走らせる構成にする"],
          ["マクロ内のパラメータ引き継ぎが途中で失敗する", "Test macro で毎回結果を確認し、レスポンスの構造が変わっていないかを見る"],
        ]}
      />

      <Section>10. 演習課題</Section>
      <Callout variant="tip" title="演習課題: Juice Shop でログインマクロを作る（ローカル環境限定）">
        ローカルで起動した Juice Shop に対し、ログイン処理をマクロとして記録し、「セッションが無効なら再ログイン」するルールを設定してください。認証必須の API（例: 自分の注文履歴取得）を Repeater から複数回叩き、セッションが切れずに動作し続けることを確認してください。
      </Callout>

      <Divider />

      <Quiz
        question="毎回変わる CSRF トークンを次のリクエストに引き継ぐには、どの機能を使いますか？"
        options={[
          "Cookie jar の「Use cookies from the cookie jar」だけで自動的に解決する",
          "マクロの Configure item で、前のレスポンスから値を抽出して後続リクエストに差し込む設定をする",
          "Session handling rules の Scope 設定でトークンの正規表現を直接指定する",
          "Logger++ のフィルタ機能でトークンを検索して手動でコピーする"
        ]}
        answer={1}
        explanation="毎回変わる値をリクエスト間で引き継ぐには、マクロ内の対象リクエストで Configure item を開き、前のレスポンスからの抽出方法と、差し込み先のパラメータを設定します。Cookie jar は Cookie 専用の仕組みで、任意のパラメータの引き継ぎには使えません。"
      />

      <KeyPoints
        items={[
          "Sessions は Session handling rules・Cookie jar・Macros の3要素で構成される",
          "マクロは複数リクエストの再現手順を記録し、Configure item でパラメータの引き継ぎ（前のレスポンスから値を取る）を設定できる",
          "ルールは Rule Actions（マクロ実行・セッション有効性チェック・Cookie jar 利用）と Scope（ツール・URL）を組み合わせて作る",
          "ログインマクロ＋セッション有効性チェックで、長時間の Intruder 実行中もセッションを維持できる",
          "毎回変わる CSRF トークンは、マクロのパラメータ引き継ぎで解決する",
          "うまく動かないときは Sessions tracer と Dashboard の Event log で追う。スコープを広げすぎない",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次の章では、ここまで学んだすべてのツールを1つの通し演習として組み立て、実際にアプリを最初から最後まで診断するワークフローを体験します。
      </Callout>
    </>
  );
}

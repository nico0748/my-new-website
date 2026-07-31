import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-13-repeater-lab",
  title: "13. ラボ実践 — Repeater で仮説を検証する",
  description: "「仮説→最小の1リクエストで検証→記録」のループを、アクセス制御の不備・入力検証の確認・レスポンスヘッダの点検という3つの実践を通して身につける、許可されたラボ環境限定の実践編。",
  domain: "burp-practice",
  section: "repeater",
  order: 3,
  level: "practice",
  tags: ["Burp Suite", "Repeater", "IDOR", "アクセス制御", "レスポンスヘッダ"],
  updated: "2026-07-28",
  minutes: 90,
};

export default function Article() {
  return (
    <>
      <Lead>
        Repeater の操作と Inspector の使い方を覚えたら、いよいよそれらを組み合わせて実際の検証を行います。この章は Repeater 編の総仕上げとして、3つの実践シナリオを手を動かしながら進めます。（目標学習時間：90分）
      </Lead>

      <Callout variant="danger" title="必ず許可されたラボ環境でのみ実施してください">
        この章で扱う手順は、<strong>PortSwigger Web Security Academy の無料ラボ</strong>や、<strong>自分の PC 上で Docker 起動した DVWA / OWASP Juice Shop</strong> など、<strong>自分に使用が許可されている環境</strong>に対してのみ実施してください。第三者が運営する本番サービスや、許可を得ていないシステムに対して同様の操作を行うことは、たとえ「観察するだけ」のつもりでも不正アクセス行為に該当しうる違法行為です。このコースは診断技術者としての基礎体力をつけるためのものであり、無断での攻撃行為を推奨・許容するものではありません。
      </Callout>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>「仮説 → 最小の1リクエストで検証 → 結果を記録」というループの型を実践できる</li>
          <li>アクセス制御の不備（IDOR・権限昇格）を Repeater で確認する手順を踏める</li>
          <li>入力検証の甘さを、レスポンスの差分観察という方法で見つけられる</li>
          <li>レスポンスヘッダ（Set-Cookie・CORS・キャッシュ制御）を点検できる</li>
          <li>Community 版でも使える記録の残し方を実践できる</li>
        </ul>
      </Callout>

      <Section>1. 検証の型 — 仮説・最小リクエスト・記録</Section>
      <p>
        診断作業は闇雲にパラメータをいじる作業ではありません。効率よく・見落としなく進めるには、次の3ステップを繰り返すのが基本です。
      </p>
      <Steps>
        <Step title="仮説を立てる">「この ID を他人のものに変えたら見えてしまうのでは」「この入力に特殊文字を入れたらエラーになるのでは」など、具体的に一文で言える仮説を作る</Step>
        <Step title="最小の1リクエストで検証する">仮説を確かめるのに必要な変更だけを加えた1本のリクエストを Repeater で送る。複数の変更を同時にしない</Step>
        <Step title="結果を記録する">Status・Length・本文の変化を見て、仮説が正しかったか・違ったかをその場でメモする</Step>
      </Steps>
      <Callout variant="info" title="1回に1つの変数だけ変える">
        パラメータを2つ同時に変えてしまうと、結果が変わってもどちらが原因か切り分けられなくなります。前章のベースラインの考え方と合わせて「1回の送信につき変数は1つ」を徹底しましょう。
      </Callout>

      <Section>2. 実践1 — アクセス制御の不備（IDOR / 権限昇格）</Section>
      <p>
        <strong>IDOR（Insecure Direct Object Reference）</strong>は、URL やパラメータに含まれる ID を他人のものに書き換えるだけで、本来アクセスできないはずのデータや操作に到達できてしまう不備です。Web Security Academy の「Access control vulnerabilities」系のラボを題材に、確認の手順を追ってみましょう。
      </p>
      <Steps>
        <Step title="自分のリソースへの正常なリクエストを取る">自分のアカウントでプロフィールや注文詳細など、ID を含む画面を開き、対応するリクエストを Repeater に送る（例: /my-account?id=101）</Step>
        <Step title="ID だけを他人のものに変える">Inspector の Query parameters（または Body parameters）で id の値だけを別の番号（例: 102）に変更し、他の値はそのままにして Send する</Step>
        <Step title="レスポンスを確認する">200 で他人のデータが返ってきていないか、403/404 など拒否されているかを Status と本文で確認する</Step>
        <Step title="権限昇格の視点でも試す">一般ユーザーのセッション Cookie のまま、管理者専用のパス（例: /admin/users）へ直接リクエストを送り、UI 上のリンクが無いだけで実際にはアクセスできてしまわないかを確認する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-13-repeater-lab-01.svg"
        alt="Repeater で id パラメータを別のユーザーの値に書き換え、200 OK で他人のデータが返ってきている様子"
        caption="id パラメータの書き換えだけで他人のリソースが返ってきてしまっている例（ラボでの確認）"
      />
      <Callout variant="warn" title="「見えた」で終わらせず条件を切り分ける">
        他人のデータが見えてしまった場合、「ログインしていれば誰でも見えるのか」「特定のロールでないと見えないのか」まで確認すると、報告の精度が上がります（例: Repeater のタブを分けて、一般ユーザー Cookie・別ユーザー Cookie・Cookie 無しの3パターンで比較する）。
      </Callout>

      <Section>3. 実践2 — 入力検証の確認</Section>
      <p>
        次に、フォームや API が想定外の入力に対してどう振る舞うかを観察します。ここで学ぶのは「攻撃コードを叩き込む」ことではなく、<strong>特殊文字を1つずつ入れてレスポンスの変化を観察する</strong>という調査の方法です。
      </p>
      <Steps>
        <Step title="ベースラインを取る">正常な値（例: 検索欄に普通の単語）を送信し、Status・Length・本文・応答時間を記録する</Step>
        <Step title="特殊文字を1つずつ試す">シングルクォート、ダブルクォート、山括弧、パーセント記号など、扱いを誤ると壊れやすい文字を1つずつ末尾に加えて送り、都度ベースラインと比較する</Step>
        <Step title="変化のパターンを分類する">「そのまま無害に表示された」「文字化けした」「エラーページに変わった」「Length が大きく増減した」「応答が明らかに遅くなった」のどれに当たるかを記録する</Step>
        <Step title="仮説をメモに残す">エラーメッセージにデータベース名や関数名らしき文字列が出た場合は、その旨をメモし、詳細な深掘りは別の専門章に譲る</Step>
      </Steps>
      <ComparisonTable
        headers={["観察された変化", "考えられる意味"]}
        rows={[
          ["Length・本文がベースラインと同一", "その文字はそのまま無害に扱われている可能性が高い"],
          ["汎用的な 500 エラーページに変わった", "サーバー側で未処理の例外が発生している可能性。原因の特定は別途必要"],
          ["エラーメッセージに内部情報（クエリ・パス・スタックトレース）が混ざる", "エラーハンドリングが甘く、情報漏えいにつながりうる。要注意ポイントとして記録"],
          ["応答時間が特定の入力でだけ明らかに伸びる", "裏側の処理（DB 問い合わせ等）に時間がかかっている兆候。深掘りの手がかりになる"],
        ]}
      />
      <Callout variant="ai" title="観察に徹する">
        この段階の目的は「攻撃を成立させる」ことではなく「挙動の差分から手がかりを得る」ことです。ペイロードの作り込みや悪用可能性の判断は、専門の脆弱性ごとの章（SQL インジェクションや XSS など）でじっくり扱います。
      </Callout>

      <Section>4. 実践3 — レスポンスヘッダの点検</Section>
      <p>
        本文だけでなく、レスポンスヘッダにも診断のヒントが詰まっています。Repeater でレスポンスペインを Raw ビューに切り替え、ヘッダを1行ずつ確認しましょう。
      </p>
      <KVList
        items={[
          { key: "Set-Cookie の属性", val: "HttpOnly（JS からアクセス不可か）、Secure（HTTPS 限定か）、SameSite（クロスサイト送信の可否）が設定されているかを確認する" },
          { key: "CORS ヘッダ", val: "Access-Control-Allow-Origin が * になっていないか、Access-Control-Allow-Credentials と組み合わさって危険な設定になっていないかを確認する" },
          { key: "キャッシュ制御", val: "Cache-Control・Pragma。個人情報を含む応答が意図せずキャッシュされる設定になっていないかを確認する" },
        ]}
      />
      <Steps>
        <Step title="ログイン後のレスポンスで Set-Cookie を確認する">ログイン直後のレスポンスを Repeater で送り直し（またはログイン処理を再現し）、Set-Cookie 行の属性を1つずつ確認する</Step>
        <Step title="Origin ヘッダを変えて CORS ヘッダの反応を見る">リクエストの Origin ヘッダを別ドメインの値に書き換えて送り、レスポンスの Access-Control-Allow-Origin がどう反応するかを確認する</Step>
        <Step title="個人情報を含む API のキャッシュ制御を確認する">マイページ等のレスポンスに Cache-Control: no-store 相当の指定があるかを確認する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-13-repeater-lab-02.svg"
        alt="Repeater の Raw ビューでレスポンスヘッダを確認している画面。Set-Cookie の属性や Access-Control-Allow-Origin が見える"
        caption="レスポンスヘッダを Raw ビューで点検している様子"
      />

      <Section>5. 記録の残し方（Community 版の制約の中で）</Section>
      <p>
        Burp Suite Community Edition には<strong>プロジェクトファイルとしてディスクに保存する機能がありません</strong>（Burp を閉じると Proxy history や Repeater のタブは消えます）。実務・学習の両方で、記録を失わない工夫が必要です。
      </p>
      <ComparisonTable
        headers={["方法", "やり方"]}
        rows={[
          ["Repeater タブに名前を付ける", "作業中は消えないので、セッション内での整理には有効（前章参照）"],
          ["Notes を使う", "Burp 内の Notes 機能に、確認した内容・仮説・結果を書き残しておく"],
          ["外部メモに Request/Response をコピー", "重要な検証結果は、Raw ビューの内容をテキストエディタや Obsidian 等の外部メモにコピーして保存する。作業終了時に必ず退避する習慣をつける"],
        ]}
      />
      <Callout variant="warn" title="Burp を閉じる前に退避する習慣を">
        Community 版では「閉じたら消える」を前提に動く必要があります。特にラボで再現に苦労した挙動は、見つけた瞬間にスクリーンショットか Raw のコピーを外部に残しておきましょう。
      </Callout>

      <Section>6. 詰まったときの切り分け手順</Section>
      <p>
        思うような結果が出ない・エラーばかり返ってくるときは、次の順で切り分けると原因が見つけやすくなります。
      </p>
      <Steps>
        <Step title="Content-Length を疑う">手動編集した場合、本文の長さとヘッダの数値が合っているか確認する（前章参照）</Step>
        <Step title="Cookie・トークンの有効期限を疑う">セッションが切れていないか、別のタブでログインし直してから再送してみる</Step>
        <Step title="1箇所だけ変える方針に立ち返る">複数箇所を同時に変えていないか見直し、変数を1つに絞って再検証する</Step>
        <Step title="ベースラインと本当に比較できているか確認する">比較対象のベースラインを取り直し、そもそも前提条件（ログイン状態・対象 ID 等）が揃っているか確認する</Step>
      </Steps>

      <Section>7. 演習課題</Section>
      <Callout variant="tip" title="演習課題1: IDOR の確認（ラボ限定）">
        Web Security Academy の Access control 系ラボを1つ選び、本章の手順に沿って自分の ID・他人の ID・Cookie 無しの3パターンを Repeater タブに分けて比較し、結果を表にまとめてください。
      </Callout>
      <Callout variant="tip" title="演習課題2: 入力検証の観察（ラボ or ローカル環境限定）">
        DVWA または Juice Shop の検索・お問い合わせフォームなど任意の入力欄に対し、特殊文字を1つずつ試して「実践2」の分類表に当てはめ、気づいた挙動を最低5件記録してください。
      </Callout>
      <Callout variant="tip" title="演習課題3: レスポンスヘッダ点検（ラボ or ローカル環境限定）">
        ログイン機能を持つ対象で、Set-Cookie の属性一覧・CORS ヘッダの挙動・キャッシュ制御ヘッダの3点をそれぞれ確認し、気になった設定があれば理由とともにメモしてください。
      </Callout>

      <Divider />

      <Quiz
        question="入力検証の確認で特殊文字を1つずつ試す際、最も重要な進め方はどれですか？"
        options={[
          "できるだけ多くの特殊文字を一度にまとめて1つのリクエストに入れて時間を節約する",
          "正常な値でベースラインを取り、1つの変数だけを変えて都度レスポンスを比較する",
          "レスポンスの本文だけを見て、Status コードは無視する",
          "最初から専用の攻撃ペイロードを使い、挙動の観察は省略する"
        ]}
        answer={1}
        explanation="複数の変更を同時に行うと、どの変更が結果に影響したのか切り分けられなくなります。ベースラインを取り、1回につき1つの変数だけを変えて比較するのが、この章で繰り返し扱ってきた検証の基本の型です。"
      />

      <KeyPoints
        items={[
          "検証は「仮説 → 最小の1リクエストで検証 → 記録」のループで進める",
          "IDOR/権限昇格は、ID だけを変える・Cookie の有無やロールを変えるなど1変数ずつ確認する",
          "入力検証の確認は攻撃ではなく観察。特殊文字ごとの Length・本文・応答時間の変化を記録する",
          "レスポンスヘッダ（Set-Cookie 属性・CORS・キャッシュ制御）も点検対象",
          "Community 版はプロジェクト保存不可。タブ命名・Notes・外部メモへの退避を習慣にする",
          "検証対象は必ず許可されたラボ・ローカル環境に限定する",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次の章からは Intruder 編に入り、ここまで1本ずつ手で確かめてきた検証を、大量パターンで反復・自動化する方法を学びます。
      </Callout>
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Steps, Step, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-22-bapp-store",
  title: "22. 拡張機能 — BApp Store で作業台を強化する",
  description: "Extensions タブの構成から、Community と Pro で使える拡張の見分け方、Autorize による認可不備の自動検出、Logger++ による通信の一元ログ化まで。拡張機能で Burp を自分の作業に合わせて拡張する方法を学ぶ。",
  domain: "burp-practice",
  section: "extend",
  order: 1,
  level: "practice",
  tags: ["Burp Suite", "拡張機能", "BApp Store", "Autorize", "Logger++"],
  updated: "2026-07-28",
  minutes: 55,
};

export default function Article() {
  return (
    <>
      <Lead>
        Burp Suite はそのままでも診断の中核ツールですが、拡張機能を入れることで「自分の作業に合わせた道具」に育てられます。この章では BApp Store の使い方と、実務でよく採用される拡張の代表格を見ていきます。（目標学習時間：55分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Extensions タブの構成と、拡張が Burp のどこを拡張できるのかを説明できる</li>
          <li>BApp Store で Community 版でも使える拡張と Pro 専用拡張を見分けられる</li>
          <li>Jython/JRuby が必要な拡張を導入する手順を踏める</li>
          <li>Autorize を設定し、認可不備の自動検出を実践できる</li>
          <li>Logger++ で通信を一元ログ化し、Community 版の記録不足を補える</li>
        </ul>
      </Callout>

      <Section>1. Extensions タブの構成</Section>
      <p>
        Extensions タブは3つのサブタブに分かれています。<strong>Installed</strong> は導入済みの拡張の一覧と有効・無効の切り替え、<strong>BApp Store</strong> は公式に配布されている拡張のカタログ、<strong>APIs</strong> は拡張開発者向けの API リファレンスです。診断者としては Installed と BApp Store を主に使います。
      </p>
      <p>
        拡張は Burp のさまざまな箇所に機能を足し込めます。代表的な拡張ポイントは次の5つです。
      </p>
      <ul>
        <li><strong>新しいタブ</strong> — Logger++ や Autorize のように、メインウィンドウに専用タブを追加する</li>
        <li><strong>スキャンチェック</strong> — Scanner（Pro）の診断項目を追加する</li>
        <li><strong>メッセージエディタのタブ</strong> — Repeater 等のリクエスト/レスポンス表示に、JWT のデコード結果のような専用ビューを追加する</li>
        <li><strong>右クリックメニュー</strong> — Proxy history や Repeater の右クリックメニューに、拡張独自の操作（「Autorize に送る」等）を追加する</li>
        <li><strong>セッション処理アクション</strong> — 次章で扱うセッション処理ルールから呼び出せる、拡張独自の処理を追加する</li>
      </ul>

      <Section>2. Community と Pro — 見分け方</Section>
      <p>
        BApp Store のカタログは Community 版と Professional 版の両方に表示されますが、中には<strong>Pro のライセンスが無いと動作しない拡張</strong>が混ざっています。多くは Scanner（能動的スキャン）と連携する拡張で、Scanner 自体が Pro 限定の機能だからです。
      </p>
      <ComparisonTable
        headers={["確認ポイント", "見分け方"]}
        rows={[
          ["拡張の詳細ページの説明文", "「requires Burp Suite Professional」等の記載が無いか確認する"],
          ["Install ボタンの状態", "Community 版では一部の拡張でボタンがグレーアウトしている、またはインストール後に起動時エラーが出る"],
          ["依存している Burp API", "Scanner 用の API（IScannerCheck 等）に依存する拡張は Pro が前提のことが多い"],
          ["迷ったら公式ドキュメント", "PortSwigger の BApp Store ページで、対象拡張の Edition 欄を確認するのが最も確実"],
        ]}
      />
      <Callout variant="info" title="Community でも十分に戦力になる拡張は多い">
        Autorize・Logger++・JWT Editor・Hackvertor など、ログ整理や特定機能の補助に徹した拡張の多くは Community でも問題なく動きます。「Pro 限定＝拡張全体が使えない」わけではないので、まずは Install して挙動を確かめましょう。
      </Callout>

      <Section>3. 導入手順</Section>
      <p>
        BApp Store から入れられる拡張の多くはそのまま Install で完結しますが、一部の拡張は Python 実装の Jython、または Ruby 実装の JRuby が必要です。事前準備を含めた手順は次のとおりです。
      </p>
      <Steps>
        <Step title="BApp Store でカタログを開く">Extensions → BApp Store タブを開き、名前で検索するか一覧をスクロールして目的の拡張を探す</Step>
        <Step title="詳細を確認する">拡張名をクリックし、説明・Author・Rating・必要な言語サポート（Java / Python / Ruby）を確認する</Step>
        <Step title="そのまま入る拡張は Install するだけ">Java 実装の拡張（Logger++、Autorize 等）は Install ボタン一つで完了する</Step>
        <Step title="Jython/JRuby が必要な場合は先に環境を用意する">拡張の詳細ページに「requires Jython」等の記載がある場合、公式サイトからスタンドアロン jar（jython-standalone-x.x.x.jar 等）をダウンロードしておく</Step>
        <Step title="Settings → Extensions でインタプリタの場所を指定する">Settings → Extensions → Python Environment（または Ruby Environment）で、ダウンロードした jar のパスを指定する</Step>
        <Step title="Install し、Output タブでエラーが無いか確認する">Installed タブで対象拡張をクリックし、Output/Errors サブタブに起動時エラーが出ていないか確認する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-22-bapp-store-01.svg"
        alt="Settings の Extensions セクションで Python Environment に jython-standalone jar のパスを指定している画面"
        caption="Jython が必要な拡張のために、スタンドアロン jar のパスを指定している様子"
      />

      <Section>4. 定番拡張の紹介</Section>
      <p>
        すべてを覚える必要はありませんが、名前と役割を知っておくと「こういう時にこの拡張が使える」と思い出せるようになります。
      </p>
      <ComparisonTable
        headers={["拡張", "何が嬉しいか", "Community 可否"]}
        rows={[
          ["Logger++", "全ツールの通信を1画面に集約し、フィルタ・エクスポートできる", "可"],
          ["Autorize", "低権限セッションでの再送を自動化し、認可不備を検出する", "可"],
          ["JSON Web Tokens（JWT Editor）", "JWT のデコード・再署名・鍵の生成を専用タブで行える", "可"],
          ["Param Miner", "隠れたパラメータやヘッダを総当たりで推測する", "Community でも動く（Scanner 連携部分は Pro）"],
          ["Turbo Intruder", "Python スクリプトで高速・大量のリクエスト送信を制御できる", "可"],
          ["Hackvertor", "エンコード/デコード・難読化の変換タグをリクエストに埋め込める", "可"],
          ["Retire.js", "フロントエンドの JS ライブラリの既知脆弱性バージョンを検出する", "可"],
          ["Software Vulnerability Scanner", "サーバーのバナー情報等から既知の CVE を照合する", "可"],
          ["Upload Scanner", "ファイルアップロード機能に対する一連の診断リクエストを自動生成する", "Pro 限定機能を含む"],
          ["Active Scan++", "Scanner の能動的スキャンに追加の診断ロジックを足し込む", "Pro 限定"],
        ]}
      />

      <Section>5. Autorize — 認可不備を自動で検出する</Section>
      <p>
        Autorize は、<strong>高権限のセッションで歩いた通信を、あらかじめ登録しておいた低権限セッションの Cookie で自動的に再送し、レスポンスを比較してくれる</strong>拡張です。前章までの IDOR 確認を1リクエストずつ手作業で行っていたのに対し、Autorize は Proxy を通る通信すべてに対してこれを自動でやってくれます。
      </p>
      <Steps>
        <Step title="Autorize を Install する">BApp Store から Autorize を検索して Install する</Step>
        <Step title="低権限ユーザーでログインし、Cookie を取得する">別のブラウザプロファイルまたはシークレットウィンドウで低権限アカウントにログインし、そのセッションの Cookie ヘッダの値をコピーする</Step>
        <Step title="Autorize タブに低権限 Cookie を登録する">Autorize タブの設定欄に、コピーした Cookie の文字列を貼り付ける</Step>
        <Step title="高権限のブラウザでアプリを歩く">高権限（管理者等）のセッションでアプリを普段どおり操作し、Proxy に通信を通す</Step>
        <Step title="Autorize の結果一覧を確認する">各リクエストについて「Bypassed!（低権限でも同じ結果が返った）」「Enforced（拒否された）」等の判定が並ぶので、Bypassed の行を優先的に見る</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-22-bapp-store-02.svg"
        alt="Autorize タブに低権限ユーザーの Cookie を登録し、高権限で歩いた通信の再送結果が一覧表示されている画面"
        caption="Autorize が高権限の通信を低権限で自動再送し、Bypassed/Enforced を判定している様子"
      />
      <Callout variant="warn" title="判定は必ず目視で裏取りする">
        Autorize の判定はステータスコードやレスポンス長の類似度から機械的に出されるものです。「Bypassed」と出ても実際には空のリストが返っているだけ、ということもあるため、気になった行は Repeater に送って本文を目で確認しましょう。
      </Callout>

      <Section>6. Logger++ — 通信を一元ログ化する</Section>
      <p>
        Community 版の弱点の一つは、Burp を閉じると Proxy history 等の記録が消えてしまうことでした。Logger++ は<strong>Proxy・Repeater・Intruder・Scanner など全ツールの通信を1つのログタブに集約</strong>し、フィルタ・検索・CSV エクスポートができるようにしてくれます。
      </p>
      <Steps>
        <Step title="Logger++ を Install する">BApp Store から Logger++ を検索して Install する</Step>
        <Step title="Logger++ タブでログの蓄積を確認する">Proxy や Repeater で通信を送るたびに、Logger++ のタブに行が積み上がっていくことを確認する</Step>
        <Step title="フィルタで絞り込む">ツール種別・ステータスコード・URL の正規表現などでフィルタをかけ、見たい通信だけを表示する</Step>
        <Step title="作業の節目でエクスポートする">対象範囲を選択し、右クリックから CSV 等の形式でエクスポートして外部に退避する</Step>
      </Steps>

      <Section>7. 拡張を入れすぎない運用</Section>
      <p>
        拡張は便利ですが、入れれば入れるほど良いわけではありません。有効な拡張が増えるほど Burp の起動・応答が重くなり、拡張によっては裏で想定外のリクエストを勝手に飛ばすものもあります（バージョンチェックの通信など）。診断対象や作業内容に応じて、必要な拡張だけを有効化する運用を心がけましょう。
      </p>
      <Callout variant="warn" title="サードパーティ拡張は自分の環境で動くコードそのもの">
        BApp Store 経由でも、拡張はあなたの Burp プロセス内で任意のコードを実行します。Author・Rating・ソースの公開状況を確認し、出所の分からない拡張を安易に導入しないようにしてください。特に社内ネットワークや機微な対象を扱うときは、事前にレビューされた拡張のみを使う運用が安全です。
      </Callout>

      <Section>8. 演習課題</Section>
      <Callout variant="tip" title="演習課題: Autorize でラボの認可不備を再現する（ラボ限定）">
        Web Security Academy の Access control 系ラボを1つ選び、低権限ユーザーの Cookie を Autorize に登録したうえで、高権限セッションでラボを一通り操作してください。Bypassed と判定された通信があれば Repeater で裏取りし、結果をメモにまとめてください。
      </Callout>

      <Divider />

      <Quiz
        question="Autorize の基本的な使い方として正しいものはどれですか？"
        options={[
          "高権限セッションの Cookie を登録し、低権限で歩いた通信を高権限で再送する",
          "低権限セッションの Cookie を登録し、高権限で歩いた通信を低権限で自動的に再送して比較する",
          "Cookie の登録は不要で、URL だけを指定すれば自動的に権限を判定してくれる",
          "Autorize は Scanner の能動的スキャンを代替する Pro 専用機能である"
        ]}
        answer={1}
        explanation="Autorize は低権限ユーザーの Cookie をあらかじめ登録しておき、高権限セッションで発生した通信を自動的に低権限 Cookie で再送してレスポンスを比較する拡張です。低権限でも同じ結果が返ってくれば認可不備の疑いがあります。"
      />

      <KeyPoints
        items={[
          "Extensions タブは Installed / BApp Store / APIs の3構成。拡張は新タブ・スキャンチェック・エディタタブ・右クリックメニュー・セッション処理アクションを拡張できる",
          "BApp Store には Community でも動く拡張と Pro 専用の拡張が混在する。詳細ページと起動後のエラーで確認する",
          "Jython/JRuby が必要な拡張は、スタンドアロン jar を Settings → Extensions で指定してから導入する",
          "Autorize は低権限 Cookie を登録し、高権限の通信を自動再送して認可不備を検出する。判定は必ず目視で裏取りする",
          "Logger++ は全ツールの通信を一元ログ化し、Community 版の記録の弱さを補える",
          "拡張は入れすぎない。出所不明のサードパーティ拡張は導入前に確認する",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次の章では、セッション処理ルールとマクロを扱い、ログインの自動化や CSRF トークンの引き継ぎなど、拡張機能とあわせて Burp をさらに自動化していきます。
      </Callout>
    </>
  );
}

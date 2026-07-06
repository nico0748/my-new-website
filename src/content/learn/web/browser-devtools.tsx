import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Code, Steps, Step, KVList, TipBox, KeyPoints, ComparisonTable, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "browser-devtools",
  title: "検証ツール（ブラウザ DevTools）の使い方",
  description: "Chrome DevTools の Elements/Console/Network/Lighthouse/Performance/Application/Sources の見方と、それぞれをどんな場面で使うかを実務目線で解説する。",
  domain: "web",
  section: "dev-tools",
  order: 1,
  level: "intro",
  tags: ["DevTools", "デバッグ", "Chrome"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        ブラウザの<strong>検証ツール（DevTools）</strong>は、フロントエンド開発で最も使う道具です。Chrome では
        <Cmd>F12</Cmd>、または <Cmd>Cmd + Option + I</Cmd>（Mac）/ <Cmd>Ctrl + Shift + I</Cmd>（Windows）で開きます。
        「何を調べたいときにどのパネルを開くか」を先に押さえると、迷わず一次調査ができます。
      </Lead>

      <p>
        DevTools は単なる「便利機能の寄せ集め」ではありません。その一つひとつが、情報系の講義で学ぶ理論を実際に「観測できる形」にした窓です。
        Network パネルは<strong>コンピュータネットワーク</strong>で学ぶプロトコルスタックの実物であり、Performance パネルは
        <strong>性能工学（パフォーマンス解析）</strong>で学ぶプロファイリングとボトルネック分析そのものです。
        Sources パネルのブレークポイントは、<strong>プログラミング言語処理系</strong>で学ぶ実行モデル（スタックフレーム・スコープ）を目で見る手段です。
        この記事では各パネルの使い方に加えて、「その裏でどんな理論が動いているか」も並べて説明します。
      </p>

      <Bridge course="コンピュータネットワーク / 性能工学 / デバッグ手法">
        本記事は座学の 3 分野が実務でどう交差するかの好例です。<strong>ネットワーク</strong>の講義で覚えた OSI 参照モデルや
        HTTP のステータスコードは Network パネルにそのまま現れ、<strong>性能工学</strong>で習う「計測なしに最適化するな
        （premature optimization）」という原則は Performance / Lighthouse の使い方に直結します。
        座学の抽象概念を、この記事で「触れるもの」に変えていきましょう。
      </Bridge>

      <Section>Elements — DOM と CSS をその場で編集</Section>
      <p>
        レンダリング後の<strong>実際の DOM ツリー</strong>と、要素に効いている CSS をライブ表示・編集するパネルです。
        画面上の要素を右クリックして「検証」を選ぶと、その要素にジャンプできます。
      </p>
      <KVList
        items={[
          { key: "要素の特定", val: "画面 → 右クリック → 検証で対象の DOM に即ジャンプ" },
          { key: "CSS のライブ編集", val: "Styles パネルで値を書き換え、その場で見た目を確認（保存はされない）" },
          { key: "レスポンシブ確認", val: "デバイスツールバー（端末アイコン）で画面幅を切り替えて崩れをチェック" },
          { key: "状態の固定", val: ":hov で :hover / :focus 状態を強制表示し、動的なスタイルを検証" },
        ]}
      />
      <TipBox>
        使う場面: 「レイアウトが崩れる」「余白や色が思った通りにならない」ときの一次調査。値を試行錯誤してから、確定した値をコードに反映します。
      </TipBox>
      <p>
        ここで表示されるのは、あなたが書いた HTML そのものではなく、ブラウザがパースして構築した
        <strong>レンダリングツリー（Render Tree）</strong>の元になる DOM です。JavaScript が後から挿入した要素も含まれます。
        「ソース（View Source）」と「Elements の表示」がズレるのはこのためで、両者を区別できることが不具合切り分けの第一歩になります。
      </p>
      <Callout variant="info" title="ソースと DOM は別物">
        <Cmd>Ctrl + U</Cmd>（View Source）はサーバが返した元の HTML、Elements はブラウザが構築した現在の DOM です。
        SPA（React など）では前者はほぼ空で、後者に実体があります。この違いは<strong>コンパイラ論</strong>でいう
        「ソースコード」と「実行時の構文木（AST）」の関係に似ています。
      </Callout>

      <Section>Console — ログ・エラー・その場で JS 実行</Section>
      <p>
        <Cmd>console.log()</Cmd> の出力や JavaScript のエラー・警告が流れる場所です。入力欄に式を打てば、その場で JS を実行できます。
      </p>
      <KVList
        items={[
          { key: "エラーの確認", val: "赤いエラーメッセージとスタックトレースから原因を追う" },
          { key: "その場で実行", val: "変数や関数を打ち込んで値を確認・API を叩いて動作検証" },
          { key: "$0", val: "Elements で選択中の要素を $0 で参照できる（$1 は 1 つ前に選択した要素）" },
          { key: "$$('sel')", val: "document.querySelectorAll のショートカット。要素を配列で取得" },
        ]}
      />
      <Callout variant="tip" title="$0 を活用する">
        Elements で要素を選択した状態で Console に切り替え、<Cmd>$0</Cmd> と打つとその要素そのものを操作できます。
        <Cmd>$0.getBoundingClientRect()</Cmd> でサイズや位置を数値で確認するなど、デバッグの起点として便利です。
      </Callout>

      <Section>Network — 通信の中身を見る</Section>
      <p>
        ページが読み込む<strong>すべての通信</strong>（HTML・CSS・JS・画像・API リクエスト）を一覧表示します。
        表示が遅い、API が失敗する、といった問題の一次調査はまずここです。
      </p>
      <KVList
        items={[
          { key: "リクエスト/レスポンス", val: "各通信の Headers / Payload / Response / Preview を確認" },
          { key: "ステータス", val: "200 系は成功、4xx はクライアント側、5xx はサーバ側の失敗" },
          { key: "ウォーターフォール", val: "各リソースの読み込みタイミングを横棒で可視化。遅い通信を特定" },
          { key: "スロットリング", val: "Fast/Slow 3G などに絞り、低速回線での挙動を再現" },
          { key: "キャッシュ", val: "Disable cache でキャッシュを無効化し、常に最新を取得して検証" },
        ]}
      />
      <TipBox>
        使う場面: 「ページが重い」「API が 404 / 500 を返す」「送っているパラメータを確認したい」。Fetch/XHR でフィルタすると API 通信だけに絞れます。
      </TipBox>

      <SubSection>ステータスコードの読み方（座学がそのまま出る場所）</SubSection>
      <p>
        Network パネルの <Cmd>Status</Cmd> 列は、<strong>ネットワークの講義で暗記した HTTP ステータスコード</strong>の実物です。
        頭の一桁で大分類が決まる、というルールを覚えておくと原因の当たりが一瞬でつきます。
      </p>
      <ComparisonTable
        headers={["範囲", "意味", "代表例", "誰の責任か"]}
        rows={[
          ["2xx", "成功", "200 OK / 201 Created / 204 No Content", "正常"],
          ["3xx", "リダイレクト", "301 恒久 / 302 一時 / 304 未更新", "多くはキャッシュ / 設定"],
          ["4xx", "クライアント側の誤り", "400 / 401 認証 / 403 権限 / 404 不在", "リクエストを送った側"],
          ["5xx", "サーバ側の誤り", "500 / 502 / 503 / 504 タイムアウト", "サーバ / インフラ側"],
        ]}
      />
      <p>
        たとえば <Cmd>401</Cmd> ならトークンの付け忘れ、<Cmd>403</Cmd> なら認証は通ったが権限不足、<Cmd>404</Cmd> なら URL の綴り違い、
        <Cmd>500</Cmd> ならバックエンドの例外、というように「どこを疑うか」が範囲だけで絞れます。フロントとバックの切り分けが Status 列一つで済むわけです。
      </p>

      <SubSection>1 本のリクエストを再現する（curl コピー）</SubSection>
      <p>
        問題のあるリクエストを右クリック →「Copy as cURL」すると、そのリクエストを<strong>ターミナルで完全再現</strong>できます。
        「ブラウザでは失敗するがサーバ側は正常か？」を切り分けるとき、フロントの複雑な状態を取り除いて<strong>通信だけ</strong>を検証できます。
      </p>
      <Code lang="bash" filename="reproduce.sh">{`# DevTools の Network で右クリック → Copy → Copy as cURL したものを貼り付け
curl 'https://api.example.com/v1/users/42' \\
  -H 'Authorization: Bearer eyJhbGciOi...' \\
  -H 'Accept: application/json' \\
  -i   # -i でレスポンスヘッダも表示（ステータス行が見える）`}</Code>
      <p>
        これで <Cmd>-i</Cmd> により先頭にステータス行（例 <Cmd>HTTP/2 401</Cmd>）が出ます。ブラウザ抜きで同じ結果なら原因はサーバ側、
        ブラウザだけ失敗するならフロント側（ヘッダ・Cookie・CORS など）に絞れます。これは<strong>二分探索</strong>による切り分けの実務版です。
      </p>

      <Bridge course="コンピュータネットワーク">
        Network パネルは OSI 参照モデルのうち主にアプリケーション層（HTTP）を可視化しています。座学で学ぶ
        <strong>リクエスト / レスポンスモデル</strong>、ステータスコード、ヘッダ、キャッシュ制御（<Cmd>Cache-Control</Cmd>）が
        そのまま列や行として現れます。ウォーターフォール表示は、TCP コネクションの確立（ハンドシェイク）・TLS ネゴシエーション・
        待機（TTFB）・ダウンロードといった<strong>プロトコルの各段階</strong>を時間軸に展開したもので、「なぜ遅いか」を層ごとに分解できます。
      </Bridge>

      <Section>Lighthouse — 品質スコアの自動計測</Section>
      <p>
        ページを自動で監査し、<strong>Performance / Accessibility / Best Practices / SEO / PWA</strong> の 5 観点をスコア化します。
        改善提案も具体的に出るため、リリース前のチェックに向いています。
      </p>
      <KVList
        items={[
          { key: "Performance", val: "読み込み速度・LCP など Core Web Vitals 系の指標" },
          { key: "Accessibility", val: "コントラスト比・alt 属性・ラベルなど支援技術対応" },
          { key: "Best Practices", val: "HTTPS・コンソールエラー・非推奨 API などの健全性" },
          { key: "SEO", val: "meta 情報・クロール可能性など検索最適化" },
          { key: "PWA", val: "manifest・Service Worker などのインストール可能性" },
        ]}
      />
      <TipBox>
        使う場面: リリース前の総合チェック。まず計測 → 提案の中から効果の大きいものから潰す、という流れで使います。
      </TipBox>

      <Section>Performance — 描画とフレームレート</Section>
      <p>
        操作を録画して、レンダリング・スクリプト実行・レイアウト計算などを時系列で分解するパネルです。
        「スクロールがカクつく」「アニメーションが重い」といった<strong>体感の遅さ</strong>を数値で追えます。
      </p>
      <KVList
        items={[
          { key: "録画", val: "録画開始 → 操作 → 停止で、その間の処理を炎グラフで確認" },
          { key: "FPS", val: "フレームレートの落ち込みからカクつきの発生箇所を特定" },
          { key: "Long Task", val: "メインスレッドを長く占有する重い処理を洗い出す" },
          { key: "Flame Chart", val: "関数の呼び出し階層と各処理の所要時間を積み上げて表示" },
        ]}
      />

      <SubSection>計測 → ボトルネック特定 → 改善（プロファイリングの型）</SubSection>
      <p>
        性能改善は「速そうな所を勘で直す」のではなく、<strong>計測してから一番遅い所を直す</strong>のが鉄則です。
        Performance パネルはそのための道具で、進め方は決まった型に落とせます。
      </p>
      <Steps>
        <Step title="1. 計測（Record）">
          録画してから、遅いと感じる操作（スクロール・ボタン押下）を実際に行い、停止します。まず「事実」を取ります。
        </Step>
        <Step title="2. ボトルネックの特定">
          Flame Chart で幅の広い（＝時間のかかっている）関数を探します。Long Task（50ms 超）の赤い印は最優先候補です。
        </Step>
        <Step title="3. 一点を改善して再計測">
          最も重い一箇所だけ直し、もう一度録画して比較します。効果があったかを数字で確認してから次へ進みます。
        </Step>
      </Steps>
      <Callout variant="tip" title="アムダールの法則を思い出す">
        全体の 10% しか占めない処理をどれだけ速くしても、全体は最大でも 10% しか縮みません。
        逆に全体の 70% を占める処理を半分にすれば、全体は 35% 縮みます。<strong>「全体に占める割合の大きい所から直す」</strong>——
        これがアムダールの法則の実務的な帰結で、Flame Chart で「幅の広い所」を先に狙う理由そのものです。
      </Callout>

      <Bridge course="性能工学 / 計算機アーキテクチャ（アムダールの法則）">
        講義で式として習うアムダールの法則 <Cmd>S = 1 / ((1 - p) + p/s)</Cmd>（p: 改善対象が全体に占める割合、s: その部分の高速化率）は、
        「改善の上限は改善しない部分に縛られる」ことを示します。Performance パネルの Flame Chart は、この <Cmd>p</Cmd> を目で測る道具です。
        幅（時間の割合）の大きい関数ほど <Cmd>p</Cmd> が大きく、直したときの全体効果も大きい。座学の式が、そのまま「どこから手を付けるか」の判断基準になります。
      </Bridge>

      <Section>Application — ストレージと Service Worker</Section>
      <p>
        ブラウザに保存されている<strong>状態</strong>を確認・編集するパネルです。認証やキャッシュのデバッグで開きます。
      </p>
      <KVList
        items={[
          { key: "Cookie", val: "セッションや認証トークンの中身・有効期限・属性を確認" },
          { key: "LocalStorage / SessionStorage", val: "保存された Key-Value を閲覧・編集・削除" },
          { key: "Cache Storage", val: "Service Worker がキャッシュしたレスポンスを確認" },
          { key: "Service Worker", val: "登録状態の確認・Unregister・更新の強制" },
        ]}
      />
      <Callout variant="warn" title="キャッシュに惑わされない">
        「直したはずなのに反映されない」の多くは Service Worker やキャッシュが原因です。
        Application で Service Worker を Unregister し、Network の Disable cache を有効にしてから再現確認すると切り分けられます。
      </Callout>

      <Section>Sources — ブレークポイントで JS デバッグ</Section>
      <p>
        読み込まれた JavaScript のソースを表示し、<strong>ブレークポイント</strong>を置いて実行を止めながら追えるパネルです。
        <Cmd>console.log</Cmd> を大量に仕込む前に、まずここで止めて変数を覗くほうが速いことが多いです。
      </p>
      <KVList
        items={[
          { key: "ブレークポイント", val: "行番号をクリックして設置。到達すると実行が一時停止" },
          { key: "ステップ実行", val: "1 行ずつ / 関数の中へ / 抜けるを選んで処理を追う" },
          { key: "Watch / Scope", val: "任意の式や、その時点の変数の値をリアルタイムに確認" },
          { key: "条件付き", val: "特定の条件を満たしたときだけ止める条件付きブレークポイント" },
          { key: "Call Stack", val: "今の関数がどこから呼ばれたか、呼び出しの連鎖を上から下へ辿る" },
        ]}
      />
      <p>
        ブレークポイントで止めたとき右側に出る <strong>Call Stack</strong> と <strong>Scope</strong> は、
        言語処理系の講義で習う<strong>スタックフレーム</strong>と<strong>スコープチェーン</strong>そのものです。
        「今どの関数の中にいて、その関数はどこから呼ばれ、今この瞬間どの変数が何を指しているか」を、抽象概念ではなく実データとして観察できます。
      </p>
      <p>
        <Cmd>console.log</Cmd> をばら撒く前に、コードの一点で止めて事実を確認する。とくに「特定のユーザーのときだけ落ちる」ような
        再現条件が狭いバグには、条件付きブレークポイントが効きます。
      </p>
      <Code lang="javascript" filename="orders.js">{`function total(order) {
  // この行の番号を右クリック → Add conditional breakpoint
  // 条件に order.userId === 42 と入れると、id 42 のときだけ止まる
  return order.items.reduce((sum, it) => sum + it.price * it.qty, 0);
}`}</Code>
      <p>
        条件 <Cmd>order.userId === 42</Cmd> を設定すれば、無数の呼び出しのうち問題のケースだけで停止します。
        これは全件を <Cmd>console.log</Cmd> で流して目 grep するより桁違いに速く、デバッグ手法として王道です。
      </p>

      <Bridge course="プログラミング言語処理系 / デバッグ手法">
        ステップ実行・Call Stack・Scope は、講義で図として学ぶ<strong>実行時スタック</strong>と<strong>変数束縛（スコープ）</strong>を
        インタラクティブに観測する装置です。また、条件付きブレークポイントと「再現条件を狭めてから止める」考え方は、
        バグの位置を絞り込む<strong>デルタデバッギング / 二分探索的な切り分け</strong>の実践そのものです。
        「動くはず」という思い込みではなく、止めて事実を見る——座学のデバッグ理論はここに集約されます。
      </Bridge>

      <SubSection>どのパネルを開くか（早見）</SubSection>
      <ul>
        <li>見た目が崩れる → <strong>Elements</strong></li>
        <li>エラーが出る・値を確認したい → <strong>Console</strong></li>
        <li>遅い・API が失敗する → <strong>Network</strong></li>
        <li>ロジックのバグを追う → <strong>Sources</strong></li>
        <li>認証・キャッシュがおかしい → <strong>Application</strong></li>
        <li>リリース前の総合チェック → <strong>Lighthouse</strong></li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "DevTools は「症状 → パネル」の対応を覚えると一次調査が速い",
          "Network はネットワークの講義そのもの。ステータスの一桁で責任範囲が絞れる",
          "Performance は性能工学の実践。アムダールの法則で「割合の大きい所」から直す",
          "Sources の Call Stack / Scope は言語処理系のスタックフレーム・スコープの実物",
          "Copy as cURL と条件付きブレークポイントで、二分探索的に原因を切り分ける",
        ]}
      />
    </>
  );
}

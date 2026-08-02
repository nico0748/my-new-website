import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-03-lab-environment",
  title: "3. 検証環境を用意する — 合法に手を動かせる場所",
  description: "PortSwigger Web Security Academy・OWASP Juice Shop・DVWA を比較し、それぞれの準備方法（アカウント作成・Docker 起動）を解説。バグバウンティへ進む際のスコープ確認の考え方まで。",
  domain: "burp-practice",
  section: "setup",
  order: 4,
  level: "intro",
  tags: ["Burp Suite", "Web Security Academy", "Juice Shop", "DVWA", "Docker"],
  updated: "2026-07-28",
  minutes: 60,
};

export default function Article() {
  return (
    <>
      <Lead>
        Burp Suite を向けてよい「合法な練習場所」を用意します。ここを疎かにすると次章以降の演習が始められないので、この章は必ず最後までやり切ってください。（目標学習時間：1時間）
      </Lead>

      <Callout variant="danger" title="最重要の原則: 許可のない対象にツールを向けない">
        Burp Suite のようなプロキシツールは、使い方を誤ると<strong>他人のサイトへの無許可アクセス・不正アクセスとみなされ得る</strong>行為に直結します。日本国内では不正アクセス禁止法、海外でも同種の法律に触れる可能性があります。<strong>このコースおよびそれ以降の演習で対象にしてよいのは、明示的に許可された練習環境（Web Security Academy のラボ・自分のPC上で起動した Juice Shop や DVWA、または明確なスコープ内のバグバウンティ対象）のみ</strong>です。「ちょっと試すだけだから」という理由で第三者のサイトに通信を送り込むことは絶対にしないでください。
      </Callout>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Web Security Academy / Juice Shop / DVWA の違いと使い分けを説明できる</li>
          <li>Web Security Academy でアカウントを作りラボを開ける</li>
          <li>Docker で Juice Shop / DVWA をローカルに起動・停止できる</li>
          <li>ローカル環境を外部に公開しないための基本的な注意点を知っている</li>
          <li>バグバウンティのスコープ確認の考え方を理解している</li>
        </ul>
      </Callout>

      <Section>1. 練習環境の三択</Section>
      <p>
        このコースで使う練習環境は主に3つです。それぞれ性格が異なるので、目的に応じて使い分けます。
      </p>
      <ComparisonTable
        headers={["環境", "費用", "準備の手間", "カバー範囲", "オフライン可否"]}
        rows={[
          ["PortSwigger Web Security Academy", "無料（要アカウント登録）", "登録だけで即使える。ラボは使い捨てインスタンス", "OWASP Top 10 系の脆弱性を体系的に、解説付きで網羅", "不可（オンライン必須）"],
          ["OWASP Juice Shop", "無料（OSS）", "Docker が必要。1コマンドで起動", "現代的な SPA（Node.js/Angular系）にありがちな脆弱性。ゲーム感覚のスコアボードあり", "可（ローカル完結）"],
          ["DVWA（Damn Vulnerable Web Application）", "無料（OSS）", "Docker が必要。1コマンドで起動", "PHP+MySQL の古典的な脆弱 Web アプリ。難易度を4段階に調整可能", "可（ローカル完結）"],
        ]}
      />
      <p>
        <strong>Web Security Academy</strong>は解説と課題が体系立てられているため学習効率が高く、<strong>Juice Shop / DVWA</strong>はオフラインで何度でも自由に触れる自分専用の的として使えます。このコースでは基本を Web Security Academy で学び、手元でじっくり試したいときに Juice Shop / DVWA を併用します。
      </p>
      <Callout variant="info" title="なぜ3つも用意するのか">
        Web Security Academy は解説が丁寧な反面、常にオンライン接続が必要で、通信環境によっては動作が重く感じることがあります。一方 Juice Shop / DVWA はオフラインで何度でも同じ操作を繰り返し練習できるので、「昨日学んだ手順を今日もう一度、時間を計って再現してみる」といった反復練習に向いています。目的に応じて使い分けてください。
      </Callout>

      <Section>2. Web Security Academy を使う</Section>
      <SubSection>アカウント作成〜ラボの開き方</SubSection>
      <Steps>
        <Step title="公式サイトにアクセス">PortSwigger の Web Security Academy（portswigger.net/web-security）を開く。</Step>
        <Step title="無料アカウントを作成">「Sign in」からメールアドレスで無料アカウントを作成する。クレジットカード登録は不要。</Step>
        <Step title="学習トピックを選ぶ">「All labs」または任意のトピック（例: SQL injection）を選ぶと、解説ページとラボ一覧が表示される。</Step>
        <Step title="ラボを開始する">ラボページの「Access the lab」ボタンを押すと、そのラボ専用の一時的な Web アプリインスタンスが新しいタブで開く。</Step>
      </Steps>
      <Callout variant="info" title="ラボは「使い捨てインスタンス」">
        各ラボは、あなたのアカウント専用に払い出される<strong>一時的なインスタンス</strong>です。他の受講者とは分離されており、ラボごとに URL も変わります。一定時間操作がないと自動的に破棄されるので、途中で席を外す場合は再度「Access the lab」から開き直せば問題ありません。
      </Callout>
      <p>
        Web Security Academy が Burp との相性がよい理由は、<strong>公式に「Burp Suite を使った攻略」を前提に設計されている</strong>点にあります。ラボの解説記事自体が「Burp の Proxy でリクエストを捕まえ、Repeater で書き換えて試す」という手順で書かれているため、ツールの使い方と脆弱性の知識を同時に身につけられます。
      </p>
      <Figure
        src="/learn/shots/burp-practice/burp-03-lab-environment-01.svg"
        alt="Web Security Academy のラボ一覧ページ。SQL injection などのトピックごとにラボの難易度と解決状況が表示されている"
        caption="Web Security Academy のラボ一覧。トピックごとに難易度と自分の攻略状況が表示される"
      />

      <Section>3. OWASP Juice Shop を Docker で立てる</Section>
      <p>
        Juice Shop は Node.js/Angular で作られた、意図的に脆弱性を仕込んだ EC サイト風の練習用アプリです。Docker が入っていれば1コマンドで起動できます。
      </p>
      <Callout variant="info" title="Docker が未導入の場合">
        Docker Desktop（macOS/Windows）または Docker Engine（Linux）を先にインストールしておいてください。<Cmd>docker --version</Cmd> でバージョンが表示されれば準備完了です。
      </Callout>
      <Code lang="bash" filename="Juice Shop を起動する">{`docker run --rm -p 3000:3000 bkimminich/juice-shop`}</Code>
      <p>
        起動したらブラウザ（または Burp の内蔵ブラウザ）で <Cmd>http://localhost:3000</Cmd> にアクセスすると Juice Shop の画面が表示されます。
      </p>
      <ul>
        <li><Cmd>--rm</Cmd>: コンテナ停止時に自動で削除する（ディスクを汚さない）</li>
        <li><Cmd>-p 3000:3000</Cmd>: ホストの 3000 番ポートをコンテナの 3000 番に転送する</li>
      </ul>
      <SubSection>停止方法</SubSection>
      <p>
        起動したターミナルで <Cmd>Ctrl + C</Cmd> を押すと、<Cmd>--rm</Cmd> 付きなのでコンテナごと片付きます。バックグラウンドで動かしたい場合は次のように起動し、止めるときは <Cmd>docker stop</Cmd> を使います。
      </p>
      <Code lang="bash" filename="バックグラウンド起動と停止">{`# バックグラウンドで起動（コンテナ名を付けておく）
docker run -d --rm -p 3000:3000 --name juice-shop bkimminich/juice-shop

# 停止（--rm 済みなので停止と同時にコンテナも削除される）
docker stop juice-shop`}</Code>

      <Section>4. DVWA を Docker で立てる</Section>
      <p>
        DVWA は PHP + MySQL で作られた古典的な脆弱 Web アプリで、<strong>セキュリティレベルを4段階（Low/Medium/High/Impossible）</strong>で切り替えられるのが特徴です。同じ脆弱性でも対策の有無によってどう攻略難度が変わるかを比較しながら学べます。
      </p>
      <Code lang="bash" filename="DVWA を起動する">{`docker run --rm -p 8081:80 vulnerables/web-dvwa`}</Code>
      <Callout variant="warn" title="ポート番号に注意">
        DVWA のコンテナはポート 80 番で待ち受けます。Burp Suite のプロキシがデフォルトの 8080 番を使っているのと衝突しないよう、ここでは <Cmd>-p 8081:80</Cmd> としてホスト側は 8081 番に転送しています。
      </Callout>
      <Steps>
        <Step title="ブラウザで初期設定ページを開く">{`http://localhost:8081/setup.php にアクセスする。`}</Step>
        <Step title="データベースを作成">「Create / Reset Database」ボタンを押し、MySQL のテーブルを初期化する。</Step>
        <Step title="ログイン">デフォルトの認証情報（ユーザー名 admin / パスワード password）でログインする。</Step>
        <Step title="セキュリティレベルを設定">「DVWA Security」ページで Low → Medium → High と段階的に切り替えながら演習する。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-03-lab-environment-02.svg"
        alt="DVWA の DVWA Security 設定ページ。セキュリティレベルが Low/Medium/High/Impossible のラジオボタンで選べる"
        caption="DVWA のセキュリティレベル設定画面。Low から順に難易度を上げて同じ脆弱性への対策の違いを比較できる"
      />

      <Section>5. ローカル環境を外部に公開しないための注意</Section>
      <p>
        Juice Shop や DVWA をローカルで動かす際、意図せず自宅・社内ネットワークの他の端末や外部からアクセスできる状態にしてしまうと、脆弱なアプリがそのまま攻撃の踏み台にされる恐れがあります。以下を確認してください。
      </p>
      <ul>
        <li><strong>bind するアドレス</strong>: 上記の <Cmd>docker run</Cmd> は既定でホストの全インターフェース（<Cmd>0.0.0.0</Cmd>）にポートを公開します。同じ Wi-Fi 上の他の端末からもアクセスできてしまうため、公共の Wi-Fi 等では特に注意する。ループバックのみに絞りたい場合は <Cmd>-p 127.0.0.1:3000:3000</Cmd> のように明示的にバインド先を指定する。</li>
        <li><strong>ファイアウォール</strong>: ルーターのポート転送（ポートフォワーディング）設定でうっかり外部公開しないよう確認する。自宅ルーターの管理画面で当該ポートが外部に開いていないかをチェックする。</li>
        <li><strong>使い終わったら停止する</strong>: 検証が終わったコンテナは <Cmd>docker stop</Cmd> で速やかに止める習慣をつける。</li>
        <li><strong>公共の Wi-Fi では特に注意する</strong>: カフェや共有オフィスなどの共有ネットワークで脆弱アプリを起動したまま放置しない。同じネットワーク上の他の利用者からアクセスされるリスクがある。</li>
      </ul>

      <Section>6. バグバウンティへ進む場合のスコープ確認</Section>
      <p>
        このコースをひと通り終えて、実際のバグバウンティプログラムに参加したくなったときのために、最低限の考え方を押さえておきます。
      </p>
      <ul>
        <li><strong>プログラムの Rules（ルール）を必ず読む</strong>: 各バグバウンティプラットフォーム（HackerOne・Bugcrowd 等）のプログラムページには、テストしてよい対象・方法・報告方法が明記されています。読まずに開始しない。</li>
        <li><strong>out-of-scope（対象外）を確認する</strong>: サブドメインの一部やサードパーティ連携サービスなど、明示的に「対象外」とされている資産は絶対にテストしない。</li>
        <li><strong>テスト用アカウントの使用</strong>: 多くのプログラムは自分専用のテストアカウントでの検証を求めており、他ユーザーのデータに影響する操作（大量アクセス・破壊的な操作）は禁止されていることが多い。DoS につながる負荷テストも通常は禁止。</li>
        <li><strong>Intruder を無許可対象に向けない</strong>: 次章以降で扱う Intruder は大量のリクエストを短時間に送り込める分、スコープ外の対象や許可のないサイトに対して行うとサービス妨害とみなされるリスクが特に高い機能です。使う前に必ず対象と許可範囲を確認する癖をつけてください。</li>
      </ul>
      <Callout variant="info" title="このコースの範囲では急ぐ必要はない">
        バグバウンティは Burp Suite の使い方と Web 脆弱性の知識、双方がある程度身についてから挑む方が安全かつ効率的です。まずは Web Security Academy と Juice Shop / DVWA で基礎を固めることを優先しましょう。焦らず一歩ずつ進めれば、後から見返しても自信を持って報告できる検証になります。
      </Callout>

      <Divider />

      <Quiz
        question="ローカルで DVWA や Juice Shop を Docker で起動する際に、最も注意すべき点はどれですか？"
        options={[
          "コンテナのイメージサイズをできるだけ小さくすること",
          "意図せず外部ネットワークからアクセス可能な状態で公開してしまわないこと",
          "必ず最新バージョンの Docker Desktop を使うこと",
          "起動時にインターネット接続を切断すること",
        ]}
        answer={1}
        explanation="脆弱性を意図的に含むアプリなので、bind アドレスやルーターのポート転送設定を確認し、自分以外がアクセスできる状態で公開しないことが重要です。使い終わったら停止する習慣も合わせて身につけましょう。"
      />

      <KeyPoints
        items={[
          "許可のない対象にツールを向けない、が全コースを通じての大原則",
          "体系的に学ぶなら Web Security Academy、オフラインで自由に試すなら Juice Shop / DVWA",
          "Web Security Academy のラボは使い捨てインスタンス。Burp を使う前提で解説が書かれている",
          "Juice Shop / DVWA は docker run 一発で起動、docker stop で片付く",
          "ローカル環境も bind アドレスとファイアウォールに注意し、外部公開しない",
          "バグバウンティに進むときはプログラムの Rules・out-of-scope・テストアカウントの使用を必ず確認する",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        検証環境が整ったら、次章「4. Proxy の仕組み — 通信の途中に立つ」に進みます。通信の途中に立つ仕組みを理解したうえで、6章の Intercept で実際にリクエストを止めて書き換えていきます。
      </Callout>
    </>
  );
}

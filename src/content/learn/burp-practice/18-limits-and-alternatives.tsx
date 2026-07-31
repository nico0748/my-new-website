import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-18-limits-and-alternatives",
  title: "18. Community 版の制限と代替ツール、そして倫理的な運用",
  description: "Intruder は Community Edition だとスレッド数やレート面で制限がある。Professional 版との違い、ffuf・Hydra など代替/補完ツールとの使い分け、そして負荷・スコープを守る運用のベストプラクティスをまとめ、Intruder 章を締めくくる。",
  domain: "burp-practice",
  section: "intruder",
  order: 5,
  level: "practice",
  tags: ["Burp Suite", "Intruder", "Community Edition", "ffuf", "倫理"],
  updated: "2026-07-28",
  minutes: 45,
};

export default function Article() {
  return (
    <>
      <Lead>
        Intruder 章の締めくくりとして、Community Edition ならではの制限、代替・補完となるツールとの使い分け、そして負荷や許可の範囲を守るための運用上の心構えを整理します。（目標学習時間：45分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Community Edition の Intruder が Professional 版とどう違うかを説明できる</li>
          <li>ffuf・wfuzz・Hydra など、目的が近い他ツールとの使い分けを理解する</li>
          <li>Intruder を使う際に負荷・スコープの観点で気をつけるべきことを実践できる</li>
          <li>この Intruder 章全体の要点を振り返る</li>
        </ul>
      </Callout>

      <Section>1. Community Edition の制限</Section>
      <p>
        ここまで使ってきた Intruder は、実は<strong>Community Edition では意図的に速度が絞られています</strong>。攻撃を実行すると、Professional 版に比べて明らかに時間がかかることに気づいたはずです。
      </p>
      <ComparisonTable
        headers={["観点", "Community Edition", "Professional"]}
        rows={[
          ["同時実行スレッド数", "実質1スレッドに近い速度に制限される", "スレッド数・リクエストレートを自由に設定できる"],
          ["リクエスト間隔", "内部的なレート制限がかかり高速化できない", "スロットリング設定を細かく調整可能"],
          ["Resource pool（対象ごとの負荷調整）", "利用不可", "対象ホストごとに同時接続数や間隔を分けて管理できる"],
          ["拡張機能との連携", "BApp Store の拡張は概ね利用可", "同様に利用可（機能差は主に速度・自動化まわり）"],
        ]}
      />
      <Callout variant="info" title="なぜ低速なのか">
        PortSwigger は Community Edition を「学習・小規模な手動診断」向けと位置づけており、大量・高速なリクエスト送信は有償版の価値の一つにしています。実務で継続的に脆弱性診断を行う場合は Professional 版の導入が一般的ですが、<strong>このコースで学ぶ考え方・使い方そのものは Community 版でも変わりません</strong>。速度が制限されている分、件数を絞った的確な検証を心がける訓練にもなります。
      </Callout>

      <Section>2. 体感速度をどう受け止めるか</Section>
      <p>
        Community 版で数千件のリストを Cluster bomb にかけると、数十分〜数時間かかることも珍しくありません。この制限は「不便」であると同時に、<strong>むやみに大きなリストを流す前に、本当にその件数が必要かを考え直させてくれる</strong>面もあります。
      </p>
      <ul>
        <li>まず数十件の小さなリストで動作確認し、想定通りに Grep が機能しているかを確かめる</li>
        <li>本番の件数に増やす前に、1件あたりの所要時間から総時間を見積もる</li>
        <li>本当に Cluster bomb（総当たり）が必要か、Sniper や Pitchfork で足りないかを再検討する</li>
      </ul>

      <Section>3. 代替・補完ツールとの比較</Section>
      <p>
        大量のリクエストを高速に送りたい場面では、コマンドラインの専用ツールが Intruder を補完します。それぞれ得意分野が異なるため、用途に応じて使い分けます。
      </p>
      <ComparisonTable
        headers={["ツール", "得意なこと", "Intruder との関係"]}
        rows={[
          ["ffuf", "URL パス・パラメータ名・サブドメインなどの高速な列挙（Go 製・非常に高速）", "GUI での細かい調整は Intruder、超高速な列挙だけしたい場面は ffuf"],
          ["wfuzz", "リクエストの複数箇所を柔軟にファジングできる汎用ツール（Python 製）", "考え方は Intruder に近いが CLI・スクリプト化に向く"],
          ["Hydra", "多数のプロトコル（SSH・FTP・各種ログインフォーム等）に対応した認証総当たり専用ツール", "Web フォーム以外のプロトコルまで総当たりしたい場合に使う"],
          ["Burp Intruder", "GUI でリクエストの中身を見ながら位置・処理・判定を細かく調整できる", "調査・分析の主軸。他ツールは高速化や自動化の補完として使う"],
        ]}
      />
      <Callout variant="tip" title="使い分けの基準">
        <strong>「中身をよく見ながら試行錯誤したい」段階は Intruder</strong>、<strong>「条件が固まったので大量に高速に流したい」段階は CLI ツール</strong>、という役割分担で考えると迷いません。Burp で見つけた挙動の差を、CLI ツールでスクリプト化して繰り返し実行する、という組み合わせも実務ではよく行われます。
      </Callout>
      <Figure
        src="/learn/shots/burp-practice/burp-18-limits-and-alternatives-01.svg"
        alt="ターミナルで ffuf を実行している様子と、同じ対象を Burp Intruder の Results で確認している様子を並べた図"
        caption="CLI ツール（高速な列挙）と Intruder（GUI での詳細な調整）は補完関係にある"
      />

      <SubSection>拡張機能で速度を補う: Turbo Intruder</SubSection>
      <p>
        BApp Store（拡張機能ストア）で配布されている<strong>Turbo Intruder</strong>は、Community Edition でも利用できる無料拡張です。Python 風のスクリプトでリクエストの生成・送信ロジックを自分で書けるため、標準の Intruder よりもはるかに高速な送信が可能になります。「Community 版は遅いから諦める」のではなく、<strong>速度が必要な場面ではこうした拡張機能を併用する</strong>という選択肢も覚えておきましょう。
      </p>
      <KVList
        items={[
          { key: "導入", val: "Extensions タブの BApp Store から「Turbo Intruder」を検索してインストールする" },
          { key: "使い方", val: "対象リクエストを右クリックし「Extensions」→「Turbo Intruder」から専用エディタを開く" },
          { key: "スクリプト", val: "Python 風の DSL でリクエスト生成ロジックを記述する。公式リポジトリの examples が手本になる" },
          { key: "注意点", val: "高速な分、対象への負荷も跳ね上がる。許可された環境以外では絶対に使わない" },
        ]}
      />
      <p>
        右クリックメニューから <Cmd>Send to Turbo Intruder</Cmd> を選ぶと専用エディタが開き、次のような最小限のスクリプトから始められます。
      </p>
      <Code lang="python" filename="Turbo Intruder の最小サンプル（queueRequests）">{`def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=5)
    for word in open('/path/to/wordlist.txt'):
        engine.queue(target.req, word.rstrip())

def handleResponse(req, interesting):
    if req.status != 404:
        table.add(req)`}</Code>
      <p>
        <Cmd>concurrentConnections</Cmd> の値で同時接続数を自分で制御できる点が、標準 Intruder との大きな違いです。<strong>値を大きくするほど対象への負荷も比例して増える</strong>ため、まずは小さな値から試すようにしてください。
      </p>
      <Callout variant="warn" title="速い道具ほど、誤用の被害も大きい">
        Turbo Intruder は標準の Intruder よりも桁違いに高速です。<strong>速度が上がるということは、無許可の対象に向けたときの被害（DoS・アカウントロックの大量発生）も同様に大きくなる</strong>ということです。導入・利用は必ずこのコースの許可原則の範囲内で行ってください。
      </Callout>

      <Section>4. 負荷・スコープを守る運用</Section>
      <Callout variant="danger" title="大量リクエストは、それ自体がリスクになり得る">
        許可された対象であっても、短時間に大量のリクエストを送ることは<strong>対象のサーバーに実質的な負荷をかける行為</strong>です。想定より遅い対象や、共有インフラ上で動く対象に対しては、意図せずサービス低下を招くことがあります。<strong>スコープ内であっても、無制限に高速化すればよいわけではありません。</strong>
      </Callout>
      <KVList
        items={[
          { key: "スコープの再確認", val: "攻撃対象のホストが Target の Scope 内に収まっているかを、攻撃前に必ず確認する" },
          { key: "件数の事前見積もり", val: "Payload sets 画面でリクエスト総数を確認し、想定外に多くないかを確認してから Start attack を押す" },
          { key: "許可書面の保持", val: "バグバウンティや受託診断では、許可の範囲（RoE）を示す書面をいつでも参照できる状態にしておく" },
          { key: "ログの記録", val: "いつ・どの対象に・何件のリクエストを送ったかを記録しておくと、後日の問い合わせに対応しやすい" },
        ]}
      />

      <Section>5. Intruder 運用のベストプラクティス</Section>
      <Steps>
        <Step title="小さく始める">まず数件〜数十件の候補で動作確認し、Positions・Payloads・Grep の設定が意図通りかを確かめる</Step>
        <Step title="本番件数に増やす前に見積もる">1件あたりの所要時間 × 件数で総時間を見積もり、対象への影響も含めて妥当か判断する</Step>
        <Step title="結果は Repeater で単発再現する">Intruder の結果だけで判断せず、気になる行は必ず Repeater に送って単発で再現確認する</Step>
        <Step title="必要な件数が終わったら停止する">目的が達成できたら攻撃を止め、だらだらと大量リクエストを送り続けない</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-18-limits-and-alternatives-02.svg"
        alt="Intruder の攻撃実行中の画面。進捗バーとリクエスト数のカウンタが表示されている"
        caption="攻撃実行中は進捗バーとリクエスト数が確認できる。目的が達成できたら早めに停止する"
      />

      <Section>6. Intruder 章のまとめ</Section>
      <p>
        この章（14〜18）を通じて、Intruder の基本操作から実践的な運用の注意点までを一通り扱いました。振り返ると次のような流れになります。
      </p>
      <ol>
        <li>Positions タブで § マークし、Payloads タブで候補と後処理を設定する（14章）</li>
        <li>Attack type で位置とリストの組み合わせ方を選ぶ（15章）</li>
        <li>Payload Processing と Grep で、送信前の加工と送信後の自動判定を行う（16章）</li>
        <li>実際の認証系ラボで、これらを組み合わせた実践演習を行う（17章）</li>
        <li>Community 版の制限を理解し、負荷・スコープを守った運用を心がける（この章）</li>
      </ol>

      <Section>7. 演習</Section>
      <Steps>
        <Step title="所要時間を見積もる">これまでの演習で使ったリストの件数から、1件あたりの平均所要時間を計算し、件数を10倍にした場合の総時間を見積もってみる</Step>
        <Step title="ツールの使い分けを言語化する">「この場面なら Intruder」「この場面なら CLI ツール」を、自分の言葉で3つずつ例を挙げてみる</Step>
        <Step title="運用チェックリストを作る">攻撃を開始する前に確認すべき項目（スコープ・件数見積もり・許可の有無）を箇条書きでまとめる</Step>
      </Steps>

      <Divider />

      <Quiz
        question="Burp Intruder（Community Edition）と ffuf のような CLI ツールの使い分けとして、最も適切な考え方はどれですか？"
        options={[
          "Intruder は古い技術なので、常に CLI ツールに置き換えるべきである",
          "中身を見ながら試行錯誤する段階は Intruder、条件が固まって高速に流したい段階は CLI ツール、という役割分担で使い分ける",
          "CLI ツールは違法なので使ってはいけない",
          "Intruder と CLI ツールは全く同じ機能なので、どちらを使っても差はない"
        ]}
        answer={1}
        explanation="Intruder は GUI でリクエストの中身を見ながら位置・処理・判定を細かく調整できる点が強みです。条件が固まり大量かつ高速に実行したい段階では、ffuf や wfuzz のような CLI ツールが補完的に使われます。どちらも許可された範囲でのみ使うべき点は共通です。"
      />

      <KeyPoints
        items={[
          "Community Edition の Intruder はスレッド数・レートが制限され、Professional 版より低速",
          "低速な分、件数を絞った的確な検証を意識する訓練にもなる",
          "ffuf・wfuzz・Hydra はそれぞれ得意分野が異なる補完ツール。Intruder は調査・分析の主軸として使う",
          "許可された対象であっても、大量リクエストそのものが負荷リスクになり得る",
          "小さく始めて見積もってから件数を増やし、結果は Repeater で単発再現し、目的達成後は早めに停止する",
          "この章(14〜18)で Positions・Attack type・Payload Processing・Grep・実践演習・運用まで Intruder を一通り扱った",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章からは「補助ツール群」の章に進み、Decoder・Comparer・Sequencer など、Intruder 以外の分析ツールを扱います。
      </Callout>
    </>
  );
}

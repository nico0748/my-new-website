import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-15-attack-types",
  title: "15. 4つの Attack Type を使い分ける — Sniper / Battering ram / Pitchfork / Cluster bomb",
  description: "Intruder の Attack type（Sniper・Battering ram・Pitchfork・Cluster bomb）は、マークした位置と Payload set の組み合わせ方を決める設定。それぞれの動き方とリクエスト数の増え方、使い分けの基準を整理する。",
  domain: "burp-practice",
  section: "intruder",
  order: 2,
  level: "basic",
  tags: ["Burp Suite", "Intruder", "Attack Type", "Sniper", "Cluster Bomb"],
  updated: "2026-07-28",
  minutes: 50,
};

export default function Article() {
  return (
    <>
      <Lead>
        前章で § マークと Payload の基本を押さえました。この章では「マークした位置と Payload set をどう組み合わせて送るか」を決める Attack type を扱います。選び方を誤るとリクエスト数が爆発的に増えるので、仕組みから理解しましょう。（目標学習時間：50分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Attack type が「位置」と「Payload set」の対応関係を決める設定であると理解する</li>
          <li>Sniper / Battering ram / Pitchfork / Cluster bomb それぞれの動き方を説明できる</li>
          <li>リクエスト数がどう変わるかを見積もれる</li>
          <li>目的に応じて適切な Attack type を選べる</li>
        </ul>
      </Callout>

      <Section>1. Attack type とは何を決める設定か</Section>
      <p>
        Positions タブでマークした § の数は、1つのこともあれば複数のこともあります。Attack type は<strong>「複数の § マーク位置に対して、Payload set をどう割り当て、どう組み合わせて送信するか」</strong>を決める設定です。Positions タブの上部にあるドロップダウンで選択します。マーク位置が1箇所しか無い場合は、実質的に Sniper と Battering ram の違いは意味を持ちません。
      </p>
      <ComparisonTable
        headers={["Attack type", "使う Payload set 数", "組み合わせ方", "リクエスト数の目安"]}
        rows={[
          ["Sniper", "1つ（全位置で共通に使い回す）", "位置を1つずつ順番に、他は元の値のまま差し替える", "位置の数 × リストの件数"],
          ["Battering ram", "1つ（全位置に同時に同じ値を入れる）", "全ての § マーク位置に、毎回同じ1つの値を同時に入れる", "リストの件数"],
          ["Pitchfork", "位置の数だけ（複数）", "各リストの同じ順番（インデックス）の値を、各位置に並行して入れる", "最も短いリストの件数"],
          ["Cluster bomb", "位置の数だけ（複数）", "全ての位置×全てのリストの組み合わせを総当たりする", "各リストの件数の掛け算"],
        ]}
      />
      <SubSection>マーク位置が1箇所しかない場合</SubSection>
      <p>
        § マークした位置が1箇所だけのとき、Sniper・Battering ram・Pitchfork・Cluster bomb のどれを選んでも<strong>実際の送信結果は同じ</strong>になります。位置が1つしかなければ「順番に差し替える」も「全位置に同時に入れる」も区別が付かないためです。この違いが意味を持ち始めるのは、<strong>§ マークが2箇所以上ある場合</strong>だけだと覚えておくと、Attack type の選択で迷ったときの判断が早くなります。
      </p>
      <Callout variant="tip" title="Payload sets タブの表示にも注目">
        Attack type を切り替えると、Payloads タブの「Payload set」選択欄に表示される番号（1, 2, 3…）の数も連動して変わります。位置が2箇所で Sniper/Battering ram を選ぶと Payload set は1つだけ、Pitchfork/Cluster bomb を選ぶと位置の数だけ Payload set を選べるようになります。<strong>切り替えた直後は、必ずこの欄の数が意図通りかを確認する</strong>癖をつけましょう。
      </Callout>

      <Section>2. Sniper — 1箇所ずつ試す（探索の基本形）</Section>
      <p>
        Sniper は<strong>1つの Payload set を使い回しながら、マークした位置を1つずつ順番に差し替えていく</strong>方式です。複数箇所をマークしていても、1回のリクエストで動くのは常に1箇所だけで、残りは元の値のままになります。
      </p>
      <p>
        たとえば <Cmd>{"§a§"}</Cmd> と <Cmd>{"§b§"}</Cmd> の2箇所をマークし、10件のリストを設定すると、まず <Cmd>a</Cmd> の位置に10件を順に試し（<Cmd>b</Cmd> は元の値のまま）、続けて <Cmd>b</Cmd> の位置に同じ10件を順に試します（<Cmd>a</Cmd> は元の値のまま）。合計 20 リクエストになります。
      </p>
      <Callout variant="info" title="典型的な使い所">
        1つのパラメータに対する単純なファジングや辞書攻撃（例: 1つの username パラメータへのユーザー名列挙）。<strong>最もよく使う Attack type</strong>で、迷ったらまず Sniper を検討します。
      </Callout>

      <Section>3. Battering ram — 全位置に同じ値を同時に入れる</Section>
      <p>
        Battering ram は<strong>1つの Payload set の値を、マークした全ての位置に毎回同じ値として同時に</strong>入れます。「同じ値をリクエストの複数箇所に反映させたい」場面専用の Attack type です。
      </p>
      <ComparisonTable
        headers={["典型例", "説明"]}
        rows={[
          ["Cookie ヘッダとリクエストボディの両方に同じセッション値を入れたい", "パラメータ改ざん確認用に、同一の値をヘッダとボディ両方に反映させて挙動を見る"],
          ["同じユーザー名をログインフォームの複数フィールド（例: username と confirm-username）に入れる", "確認用の2重入力フィールドを持つフォームでの一括テスト"],
        ]}
      />
      <p>
        Battering ram はリクエスト数が<strong>リストの件数と同じ</strong>で済むため、Sniper や Cluster bomb に比べて非常に少ないリクエスト数で完結します。
      </p>

      <Section>4. Pitchfork — 複数リストを並行してなぞる</Section>
      <p>
        Pitchfork は、マークした位置の数だけ<strong>別々の Payload set を用意し、同じインデックス（1件目同士、2件目同士…）を並行して各位置に入れる</strong>方式です。複数のリストが<strong>対応関係を持つペア</strong>になっている場合に使います。
      </p>
      <Code lang="text" filename="Pitchfork のイメージ（username と password が対応するペア）">{`Payload set 1（username）    Payload set 2（password）
carlos                        password123
wiener                        letmein
administrator                 adm1n2024

→ 1回目: username=carlos / password=password123
→ 2回目: username=wiener / password=letmein
→ 3回目: username=administrator / password=adm1n2024`}</Code>
      <Callout variant="info" title="典型的な使い所">
        すでに漏えいが判明している「ユーザー名とパスワードの既知の組み合わせリスト」を1件ずつ試す<strong>クレデンシャルスタッフィング型の検証</strong>や、複数の同期したパラメータ（トークンと署名のペアなど）を同時に変えたい場面。リスト同士の対応関係を保ったまま検証したいときに使います。
      </Callout>
      <p>
        リクエスト数は<strong>最も短いリストの件数</strong>に揃えられます。3件と5件のリストを組み合わせても、3件目で打ち切られます。リストの件数を事前に揃えておく（あるいは意図的に短い方に合わせる）ことが、Pitchfork をうまく使うコツです。
      </p>
      <KVList
        items={[
          { key: "リストの件数が揃っている場合", val: "全件が過不足なくペアとして送信される。最も分かりやすい使い方" },
          { key: "リストの件数が揃っていない場合", val: "短い方のリストの件数で処理が止まる。長い方のリストの余った分は使われない" },
          { key: "件数を揃える工夫", val: "短い方のリストに合わせて長い方を削るか、Payload type の Numbers で両方とも同じ件数に生成し直す" },
        ]}
      />

      <Section>5. Cluster bomb — 全組み合わせを総当たりする</Section>
      <p>
        Cluster bomb は、マークした位置ごとに別々の Payload set を用意し、<strong>すべての位置×すべてのリストの組み合わせを総当たり</strong>で試します。ペアの対応関係が無く、独立した2つ以上の値の組み合わせそのものを探索したいときに使います。
      </p>
      <Code lang="text" filename="Cluster bomb のイメージ（3件のリスト × 4件のリスト）">{`Payload set 1（username・3件） × Payload set 2（password・4件）
→ 3 × 4 = 12 リクエスト
（username[0]×password[0], username[0]×password[1], … username[2]×password[3]）`}</Code>
      <Callout variant="danger" title="組み合わせ爆発に注意">
        Cluster bomb はリスト同士の<strong>掛け算</strong>でリクエスト数が増えます。username 1,000 件 × password 1,000 件なら 100 万リクエストです。件数が増えるほど所要時間・対象への負荷ともに跳ね上がるため、<strong>件数を絞ったテスト実行で見積もりを立ててから本番の件数に増やす</strong>ようにしましょう。許可のない対象にこれほどの量を送ることは、それだけで妨害行為に当たり得ます。
      </Callout>
      <Figure
        src="/learn/shots/burp-practice/burp-15-attack-types-01.svg"
        alt="Positions タブ上部の Attack type ドロップダウン。Sniper/Battering ram/Pitchfork/Cluster bomb の4択が表示されている"
        caption="Attack type の選択ドロップダウン。位置の数と目的に応じて選ぶ"
      />

      <Section>6. 選び方のまとめ</Section>
      <ComparisonTable
        headers={["やりたいこと", "選ぶべき Attack type"]}
        rows={[
          ["1つのパラメータに1つのリストを順番に試したい", "Sniper"],
          ["複数箇所に毎回同じ1つの値を入れたい", "Battering ram"],
          ["対応関係のある複数リストをペアのまま並行して試したい", "Pitchfork"],
          ["独立した複数リストの組み合わせを総当たりしたい", "Cluster bomb（リクエスト数に要注意）"],
        ]}
      />
      <Callout variant="tip" title="迷ったら Sniper から">
        実務での使用頻度は圧倒的に Sniper が高く、次いで Pitchfork です。Cluster bomb はリクエスト数が急増するため、本当に全組み合わせが必要かをよく考えてから選びましょう。多くの場合、まず Sniper で当たりを付けてから範囲を絞り込む方が効率的です。
      </Callout>

      <Section>7. 演習</Section>
      <Steps>
        <Step title="ラボを開く">Web Security Academy の 2FA bypass 系ラボ、または broken authentication 系のラボを開く</Step>
        <Step title="Sniper で試す">username パラメータだけを § マークし、Sniper で数件のユーザー名候補を試す</Step>
        <Step title="Pitchfork で試す">username と password の両方を § マークし、対応関係のある小さな候補リスト（3〜5件程度）を用意して Pitchfork で試す</Step>
        <Step title="リクエスト数を見積もってから Cluster bomb を試す">同じ2箇所を Cluster bomb に切り替え、開始前に Payload sets 画面でリクエスト数の見積もりが何件になるか確認してから実行する</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-15-attack-types-02.svg"
        alt="Payload sets 画面。Cluster bomb を選んだ状態でリクエスト総数の見積もりが表示されている"
        caption="Cluster bomb 選択時は事前にリクエスト総数を確認できる。小さい件数で試してから広げる"
      />

      <Divider />

      <Quiz
        question="username と password の『既知の組み合わせ』のリストを、対応関係を保ったまま1件ずつ試したい場合に適した Attack type はどれですか？"
        options={[
          "Sniper",
          "Battering ram",
          "Pitchfork",
          "Cluster bomb",
        ]}
        answer={2}
        explanation="Pitchfork は複数の Payload set を用意し、同じインデックスの値を各位置に並行して入れます。username と password が対応するペアになっている場合、そのペアの関係を崩さずに1件ずつ試せます。全組み合わせを総当たりしたい場合は Cluster bomb を使いますが、リクエスト数は掛け算で増えます。"
      />

      <KeyPoints
        items={[
          "Attack type は『マークした位置』と『Payload set』の組み合わせ方を決める設定",
          "Sniper: 1つのリストを使い回し、位置を1つずつ順番に差し替える。最も使用頻度が高い",
          "Battering ram: 全位置に毎回同じ値を同時に入れる。リクエスト数はリストの件数と同じ",
          "Pitchfork: 対応関係のある複数リストを、同じインデックスで並行して各位置に入れる",
          "Cluster bomb: 全ての位置×全てのリストを総当たり。リクエスト数は掛け算で急増するため要注意",
          "迷ったら Sniper から。Cluster bomb は事前にリクエスト数を見積もってから実行する",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「16. Payload Processing と Grep」で、生成したペイロードの後処理と、レスポンスから自動で判定を行う Grep 機能を扱います。
      </Callout>
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-17-intruder-labs",
  title: "17. 実践ラボ — ログイン攻撃とアカウントロックアウトの回避",
  description: "Web Security Academy の認証系ラボを通し、ユーザー名列挙・パスワード総当たり・IP ベースのロックアウト回避・2要素認証バイパスまでを Intruder で通しで演習する。総当たり系の演習は必ず許可された環境でのみ行う。",
  domain: "burp-practice",
  section: "intruder",
  order: 4,
  level: "practice",
  tags: ["Burp Suite", "Intruder", "Web Security Academy", "ブルートフォース", "2FA"],
  updated: "2026-07-28",
  minutes: 65,
};

export default function Article() {
  return (
    <>
      <Lead>
        Positions・Attack type・Grep の使い方を押さえたら、実際の認証系ラボを通しで攻略してみます。ここまでの内容を総合的に使う実践編です。（目標学習時間：65分）
      </Lead>

      <Callout variant="danger" title="この章の演習は必ず自分のラボ環境だけで行う">
        ログイン試行の総当たりは、対象のアカウントロックや大量アクセスによる業務妨害を引き起こしうる<strong>最も誤用されやすい Intruder の使い方</strong>です。この章の手順は<strong>Web Security Academy の指定ラボ、または自分のローカル環境（DVWA / Juice Shop）以外には絶対に適用しないでください</strong>。実在するサービスのログインフォームへの無許可の総当たりは、不正アクセスや業務妨害に当たり得る行為です。
      </Callout>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>ユーザー名の存在確認（enumeration）を Intruder で実施できる</li>
          <li>パスワードリストでの総当たりを Sniper / Pitchfork で組み立てられる</li>
          <li>IP ベースのロックアウト対策がある場合の回避テクニック（ヘッダのランダム化）を理解する</li>
          <li>2要素認証のロジック不備を狙う攻撃の考え方を理解する</li>
          <li>演習結果を再現手順としてまとめられる</li>
        </ul>
      </Callout>

      <Section>1. この章でやること</Section>
      <p>
        Web Security Academy には「認証（Authentication）」のトピックに、Intruder の練習にちょうどよいラボが複数用意されています。この章では代表的な3パターンを通しで扱い、これまでの章で学んだ Positions・Attack type・Grep を実際に組み合わせます。
      </p>
      <ComparisonTable
        headers={["ラボの種類", "狙うポイント", "使う主な機能"]}
        rows={[
          ["Username enumeration via different responses", "レスポンスの違いから実在するユーザー名を特定する", "Sniper + Grep - Match"],
          ["2FA broken logic", "2要素認証のロジック不備（コード検証の抜け）を突く", "Sniper / Pitchfork"],
          ["Broken brute-force protection（IP ベース）", "IP 単位のロックアウトを、送信元 IP を偽装して回避する", "Sniper + Payload Processing"],
        ]}
      />

      <Section>2. ラボ1: ユーザー名の存在確認</Section>
      <p>
        16章の演習と同様の考え方ですが、ここでは「実在するユーザー名を1件特定した後、そのユーザーに対してパスワードリストを試す」までを通しで行います。
      </p>
      <Steps>
        <Step title="ユーザー名候補で Sniper を実行">username パラメータだけを § マークし、候補リスト（例: administrator, admin, carlos, wiener など）で Sniper 攻撃を実行する</Step>
        <Step title="Grep - Match で判定">失敗メッセージの文言の違いを Grep - Match に登録し、実在するユーザー名を特定する</Step>
        <Step title="特定したユーザー名を固定する">見つかったユーザー名をリクエストの username パラメータにそのまま書き込み、以降は固定値として扱う</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-17-intruder-labs-01.svg"
        alt="Results 一覧で Grep - Match の列が1行だけチェック無しとなり、その行の username が実在するユーザー名として特定されている"
        caption="ユーザー名列挙の結果。1行だけ他と異なる挙動を示す行が実在アカウント"
      />

      <Section>3. ラボ2: パスワードの総当たりとロックアウト回避</Section>
      <p>
        ユーザー名が固定できたら、次は password パラメータを § マークしてパスワードリストで Sniper 攻撃を組みます。しかし多くのログインフォームには、<strong>同一 IP から一定回数失敗すると一時的にブロックする</strong>対策（レート制限・ロックアウト）が入っています。「Broken brute-force protection」系のラボは、この対策に抜けがあるケースを扱います。
      </p>
      <SubSection>典型的な抜け: IP を送信元ヘッダで偽装できてしまう</SubSection>
      <p>
        アプリがロックアウト判定に <Cmd>X-Forwarded-For</Cmd> のような<strong>クライアントが自由に書き換えられるヘッダ</strong>を使っている場合、そのヘッダの値を試行のたびに変えることでロックアウトを回避できてしまいます。これを Intruder で自動化する手順は次の通りです。
      </p>
      <Steps>
        <Step title="X-Forwarded-For ヘッダを追加する">リクエストに存在しなければ、Repeater や Proxy でヘッダ行として X-Forwarded-For を1行追加しておく</Step>
        <Step title="password と X-Forwarded-For の値の両方を § マークする">2箇所をマークするので Attack type は Pitchfork を使う</Step>
        <Step title="password には Runtime file、IP には Numbers を割り当てる">password 側はパスワードリスト、X-Forwarded-For 側は Numbers（例: 1.1.1.1〜1.1.1.100 のような連番）で毎回異なる値を生成する</Step>
        <Step title="攻撃を実行し、ロックアウトされずに全件試せるか確認する">Results で Status code が試行のたびにブロックされていないかを確認する</Step>
      </Steps>
      <Code lang="http" filename="X-Forwarded-For を追加したリクエスト例">{`POST /login HTTP/1.1
Host: 0aXX00XX00XX.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
X-Forwarded-For: §1.1.1.1§

username=carlos&password=§password123§`}</Code>
      <Callout variant="warn" title="この手法は必ずラボ内で完結させる">
        IP 偽装ヘッダの悪用は、実在するサービスに対して行えばレート制限・不正アクセス対策の回避そのものであり、極めて悪質な行為とみなされます。Web Security Academy のラボはこの挙動を学習用に意図的に再現しているだけであることを理解した上で演習してください。
      </Callout>
      <Figure
        src="/learn/shots/burp-practice/burp-17-intruder-labs-02.svg"
        alt="Payload sets 画面。position 1 が password（Runtime file）、position 2 が X-Forwarded-For（Numbers）としてPitchforkで設定されている"
        caption="Pitchfork での2位置設定。password と偽装 IP を並行して変化させる"
      />

      <SubSection>Resource pool が無い Community 版での配慮</SubSection>
      <p>
        Professional 版には「Resource pool」という、対象ホストごとに同時接続数・リクエスト間隔を細かく調整できる機能があります。Community 版にはこの機能が無いため、ロックアウト回避を試す際も<strong>Burp 自体の速度がもともと抑えられている</strong>点を踏まえて結果を解釈する必要があります。想定より遅いからといって焦って設定を変えようとせず、<strong>まずは少数の候補で正しく動作しているかを確認する</strong>ことを優先しましょう。
      </p>

      <Section>4. ラボ3: 2要素認証のロジック不備</Section>
      <p>
        「2FA broken logic」系のラボでは、2段階目の確認コード入力においてサーバー側の検証に抜けがあるケースを扱います。たとえば、1段階目のログインが成功した時点でセッションが確立してしまい、2段階目のコード確認が実質的に「後付けのチェック」でしかない場合、コード自体を Intruder で総当たりできてしまいます。
      </p>
      <ul>
        <li>4桁の確認コードなら、候補は 0000〜9999 の1万通りしかない</li>
        <li>Payload type の <strong>Numbers</strong>（範囲 0〜9999・4桁ゼロ埋め）を使えば、この範囲を機械的に生成できる</li>
        <li>ロックアウトが正しく実装されていなければ、Sniper で全件試して正解コードを特定できてしまう</li>
      </ul>
      <Callout variant="info" title="ここでの学びの本質">
        このラボが示しているのは「2要素認証があるから安全」ではなく、<strong>2段階目の検証にも総当たり対策（レート制限・試行回数上限）が必要</strong>だという設計上の教訓です。Intruder はこの不備を機械的に暴く道具として使われています。
      </Callout>

      <Section>5. 結果を再現手順としてまとめる</Section>
      <p>
        実務の診断では、Intruder で見つけた結果は<strong>再現可能な手順として記録する</strong>ことが重要です。Results で見つけた1行を右クリックし「Send to Repeater」で個別に送り直し、単発のリクエストとして再現できることを確認してから記録に残しましょう。
      </p>
      <KVList
        items={[
          { key: "再現手順", val: "Intruder で見つけた値を使い、Repeater で1回だけ実行して同じ結果になることを確認する" },
          { key: "影響範囲", val: "見つかった不備がどこまで悪用され得るか（対象アカウント数・データの機微性）を整理する" },
          { key: "証跡", val: "見つけた行のリクエスト/レスポンスをエクスポートし、報告の根拠として保存する" },
        ]}
      />
      <ComparisonTable
        headers={["見つけた事象", "報告での位置づけの目安"]}
        rows={[
          ["ユーザー名列挙（実在確認ができる）", "中程度。単体では影響が小さいが、後続のパスワード攻撃の足がかりになる"],
          ["ロックアウト対策の回避（IP 偽装で無制限に試行可能）", "重大。アカウント乗っ取りの実現可能性が大きく上がる"],
          ["2要素認証のロジック不備（総当たりでバイパス可能）", "重大。認証の多層防御そのものが機能していないことを示す"],
        ]}
      />
      <p>
        重大度の最終判断は CVSS などの指標に照らして行いますが、<strong>Intruder の演習段階では「何が・どこまで機械的に突破できたか」を具体的な手順として言語化しておく</strong>ことが、後の報告作業を大きく楽にします。
      </p>

      <Section>6. 演習</Section>
      <Steps>
        <Step title="ラボ1を完了する">Username enumeration 系ラボで実在ユーザーを特定する</Step>
        <Step title="ラボ2を完了する">Broken brute-force protection 系ラボで X-Forwarded-For を使ったロックアウト回避を試す</Step>
        <Step title="ラボ3を完了する">2FA broken logic 系ラボで確認コードを総当たりする</Step>
        <Step title="1つのラボについて再現手順をメモにまとめる">Repeater での再現確認までを含めて、手順書形式で書き出してみる</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-17-intruder-labs-03.svg"
        alt="Web Security Academy のラボ完了画面。ソルブド（Solved）のバッジが表示されている"
        caption="ラボを解くと Solved のバッジが表示され、達成状況が記録される"
      />

      <Divider />

      <Quiz
        question="アプリがロックアウト判定に X-Forwarded-For ヘッダを利用しており、値をクライアント側で自由に書き換えられる場合、何が問題になりますか？"
        options={[
          "レスポンスの文字コードが変わってしまう",
          "送信元 IP を偽装したとみなされ、IP ベースのロックアウト対策を回避できてしまう",
          "Burp Suite のライセンスが無効になる",
          "Payload Encoding が自動的にオフになる"
        ]}
        answer={1}
        explanation="X-Forwarded-For はクライアントが自由に設定できるヘッダです。アプリがこれを信頼して IP ベースのロックアウト判定に使っていると、試行ごとに値を変えるだけでロックアウトを回避され、実質的に無制限の総当たりを許してしまいます。"
      />

      <KeyPoints
        items={[
          "認証系ラボで、Positions・Attack type・Grep を組み合わせた実践演習を行った",
          "ユーザー名列挙は Sniper + Grep - Match、対応関係のある値の並行変化は Pitchfork が向く",
          "クライアントが書き換えられるヘッダ（X-Forwarded-For 等）に依存したロックアウト対策は回避されうる",
          "2要素認証も、2段階目の検証にレート制限が無ければ Intruder で総当たりされ得る",
          "見つけた結果は Repeater で単発再現し、証跡として記録してから報告につなげる",
          "総当たり系の演習は許可されたラボ・ローカル環境以外では絶対に行わない",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「18. Community 版の制限と代替ツール」で、Intruder の速度面の制限と、負荷・倫理面での運用上の注意をまとめ、この Intruder 章を締めくくります。
      </Callout>
    </>
  );
}

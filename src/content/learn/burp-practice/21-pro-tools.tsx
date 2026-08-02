import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Cmd, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-21-pro-tools",
  title: "21. Professional 版の全体像 — Scanner・Collaborator・その先",
  description: "Community と Professional の機能差を地図として整理する。Scanner・Collaborator・Organizer・DOM Invader が何をしてくれるのか、Community ではそれぞれ何を手作業で代替するのかを解説する。",
  domain: "burp-practice",
  section: "toolset",
  order: 3,
  level: "practice",
  tags: ["Burp Suite", "Professional", "Scanner", "Collaborator", "ライセンス"],
  updated: "2026-07-28",
  minutes: 50,
};

export default function Article() {
  return (
    <>
      <Lead>
        ここまで Community Edition だけで手を動かしてきました。この章は手順書ではなく「地図」です。Professional 版に何があり、Community ではそれを何で代替しているのかを俯瞰しておくと、Pro を使う場面になったときも、Pro が返す結果を鵜呑みにせず正しく評価できるようになります。（目標学習時間：50分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Community と Professional の主要な機能差を説明できる</li>
          <li>Scanner・Collaborator・Organizer・DOM Invader が何をする機能か説明できる</li>
          <li>Community でそれぞれをどう代替するか、現実的な戦略を持てる</li>
          <li>ライセンスをどう考えればよいか、判断の軸を持てる</li>
        </ul>
      </Callout>

      <Section>1. Community と Professional の機能差</Section>
      <p>
        まず全体像を1枚の表にまとめます。ここまでの章で触れてきたツール（Proxy・Repeater・Intruder・Decoder・Comparer・Sequencer）は Community でもフル機能で使えます。差が出るのは主に「自動化」と「規模」に関わる部分です。
      </p>
      <ComparisonTable
        headers={["機能", "Community", "Professional"]}
        rows={[
          ["自動スキャン（Scanner）", "無し", "受動/能動スキャンあり"],
          ["Burp Collaborator", "無し（公開の Collaborator サーバーも使えない）", "あり。アウトオブバンド検知が可能"],
          ["プロジェクト保存", "不可（Temporary project のみ。終了時に履歴もサイトマップも破棄される。設定だけは Settings からファイルへ書き出せる）", "プロジェクトファイルとして保存・再開が可能"],
          ["Intruder の速度", "スレッド数・レートに制限あり", "無制限に近い速度で実行可能"],
          ["Organizer", "無し", "あり。リクエスト/レスポンスを整理・注釈できる"],
          ["DOM Invader", "無し", "あり。DOM ベースの脆弱性（DOM XSS等）をブラウザ内で検出支援"],
          ["Repeater の高度機能", "基本機能のみ", "タブのグループ化、履歴の永続化など拡張あり"],
          ["BApp Store の一部拡張", "多くは利用可（拡張自体は無料）", "一部の拡張が Pro の API 機能に依存"],
        ]}
      />
      <Callout variant="info" title="土台は共通">
        重要なのは、通信を捕まえて手で確かめる「Proxy → Repeater」というワークフローの土台は Community でも Professional でも同じという点です。Pro が追加するのは主に「自動化」「規模」「外部検知」の部分です。
      </Callout>

      <Section>2. Scanner（Pro 限定） — 自動化された当たりづけ</Section>
      <p>
        Scanner は、対象をクロールしながら既知の脆弱性パターンを自動的に検査する機能です。大きく2種類の動作があります。
      </p>
      <KVList
        items={[
          { key: "受動スキャン（Passive scan）", val: "通常の通信（Proxy経由の閲覧など）を観察するだけで、レスポンスヘッダの不備や情報漏えいなど「送信せずに分かる」問題を検出する" },
          { key: "能動スキャン（Active scan）", val: "実際に細工したリクエストを送り込み、SQL インジェクションや XSS など「反応を見ないと分からない」問題を検出する" },
        ]}
      />
      <p>
        能動スキャンを行う前提として、クロール（サイトの構造を自動でたどる）と監査（各パラメータに対する検査）の設定を細かく指定できます。対象の規模、認証状態の維持方法、除外したいパスなど、スキャン設定の粒度は Professional の中でもかなり作り込まれています。
      </p>
      <Callout variant="warn" title="スキャナは「当たりをつける道具」">
        Scanner が検出する Issue は、あくまで「可能性が高い」という当たりであり、<strong>誤検知（false positive）が一定数含まれます。</strong>スキャナの出力をそのまま報告書に転記するのではなく、Repeater で手動再現し、実際に影響があるかを人が検証してから確定させる、という姿勢が欠かせません。Community でここまで手作業をやってきた経験は、まさにこの「検証する目」を養うためのものです。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-21-pro-tools-01.svg"
        alt="Scanner の設定画面イメージ。クロール設定と監査設定のタブ、検出された Issue の一覧が並ぶ"
        caption="Scanner（Pro限定）のイメージ。クロール＋監査の設定と、検出された Issue の一覧"
      />

      <Section>3. Burp Collaborator（Pro 限定） — アウトオブバンドの検知</Section>
      <p>
        アプリケーションへの入力が、レスポンスとして直接返ってこない種類の脆弱性があります。たとえば SSRF でサーバーが外部にリクエストを送る、ブラインド XXE で外部の DTD を読み込む、非同期に実行される OS コマンドインジェクションなどです。これらは<strong>アプリケーションの応答を見ているだけでは検知できず、外部から「呼び出しが来たかどうか」を観測する必要</strong>があります。
      </p>
      <p>
        Burp Collaborator は、PortSwigger が用意した外部サーバーのアドレスを payload に埋め込み、対象アプリケーションがそこへ DNS・HTTP・SMTP などで通信してきたかどうかを検知する仕組みです。「外部サーバーが必要」なのは、対象アプリケーションの外側からしか観測できない挙動を捉えるためです。
      </p>
      <ComparisonTable
        headers={["選択肢", "内容"]}
        rows={[
          ["Burp Collaborator（Pro）", "PortSwigger 運用のサーバーを使う。Burp と統合済みで検知結果がそのまま Burp に戻る"],
          ["自前の VPS + DNS ログ", "自分で用意したサーバーのログを見て通信の有無を確認する。統合はされていないが無料"],
          ["公開の interactsh 系サービス", "OSS の out-of-band 検知サービス（interactsh 等）。無料で使えるが公開サーバーである点に注意"],
        ]}
      />
      <Callout variant="danger" title="外部サービスに情報を送るリスク">
        Collaborator や interactsh 系のサービスに payload を送ると、対象アプリケーションの内部情報（環境変数、内部ホスト名、認証情報の断片など）が、意図せず外部の第三者サーバーに漏れる可能性があります。<strong>業務での診断では契約・スコープの範囲内かを必ず確認し、機微情報を含みうる対象では利用可否を事前に合意しておく</strong>必要があります。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-21-pro-tools-02.svg"
        alt="Burp Collaborator の仕組み図。対象アプリケーションが外部の Collaborator サーバーへ DNS/HTTP で通信し、その結果が Burp にポーリングされて戻ってくる"
        caption="Collaborator（Pro限定）の仕組み。対象アプリの外側から通信の有無を観測する"
      />

      <Section>4. Organizer / DOM Invader / Logger（Pro）の概要</Section>
      <KVList
        items={[
          { key: "Organizer", val: "気になったリクエスト/レスポンスをフォルダ分けし、注釈を付けて整理できる機能。手作業の診断メモを Burp 内で一元管理したいときに使う" },
          { key: "DOM Invader", val: "ブラウザ拡張と連携し、DOM ベースの脆弱性（DOM XSS、クライアントサイドのプロトタイプ汚染など）をソースからシンクまで自動的に辿って可視化する。手動でのJS追跡がかなり楽になる" },
          { key: "Logger（Pro強化版）", val: "Community にも簡易的な Logger はあるが、Pro ではより高度なフィルタ・検索が可能で、大量の通信ログから対象を絞り込みやすい" },
        ]}
      />

      <Section>5. Community での現実的な代替戦略</Section>
      <p>
        Pro が無いからといって診断の質を落とす必要はありません。以下のような組み合わせで、多くの部分を代替できます。
      </p>
      <ComparisonTable
        headers={["Pro の機能", "Community での代替"]}
        rows={[
          ["Scanner の自動クロール", "手動でブラウザを操作し Site map を育てる（10章「攻撃面を洗い出す」の手法）"],
          ["Scanner の能動スキャン", "チェックリストを用意し、Repeater で1件ずつ逐次検証する"],
          ["Collaborator（アウトオブバンド検知）", "自前の VPS + DNS ログ、または interactsh 等の無料公開サービスを慎重に利用する"],
          ["Organizer", "Repeater のタブ名やコメントで整理する、あるいは外部のメモツールと併用する"],
          ["DOM Invader", "ブラウザの開発者ツールで手動デバッグする、あるいは無料の静的解析拡張を併用する"],
          ["高速な Intruder", "ffuf などの外部ツールで大規模なブルートフォース/ファジングを行い、Burp は解析・再現に使う"],
          ["広範な脆弱性発見の網羅性", "nuclei など既知パターンのテンプレートベーススキャナを併用する"],
        ]}
      />
      <Callout variant="tip" title="ツールを混ぜて使うのは普通のこと">
        実務の診断者は Burp 単体で完結させることの方が少なく、ffuf・nuclei・sqlmap などのCLIツールと Burp を行き来しながら作業します。Burp は「見る・確かめる・記録する」ハブとして使い、大規模な自動処理は専用ツールに任せる、という役割分担は Community/Professional を問わず実務的な発想です。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-21-pro-tools-03.svg"
        alt="Community での代替戦略の図。手動クロール、チェックリスト、Repeaterでの逐次検証、ffuf/nucleiなど外部ツールが Burp を中心に連携している様子"
        caption="Community 版での現実的な代替戦略。Burp を中心に外部ツールを組み合わせる"
      />

      <Section>6. ライセンスの考え方</Section>
      <p>
        Professional のライセンスをいつ検討すべきかは、使う目的によって変わります。
      </p>
      <KVList
        items={[
          { key: "個人学習", val: "Community で Web Security Academy のラボを一通りこなすだけでも、実務で使う基礎はほぼ身につく。まずは無料で学び切ることを優先してよい" },
          { key: "業務利用（診断業務など）", val: "Scanner・Collaborator による効率化や網羅性の向上が、稼働時間の削減に直結するため、業務であれば導入を検討する価値が高い" },
          { key: "費用感", val: <>{"年間ライセンス制で、個人向け・法人向けにプランが分かれている。金額は変動するため、必ず"}<Cmd>公式サイト（portswigger.net）</Cmd>{"で最新情報を確認すること"}</> },
        ]}
      />
      <p>
        大切なのは「Pro を持っていないと診断できない」わけではないという点です。むしろ<strong>Community で手を動かし、それぞれの脆弱性がどういう仕組みで成立するかを理解してから Pro を導入する</strong>方が、Scanner や Collaborator が返す結果を鵜呑みにせず、正しく評価できるようになります。無料版で学び切ってから Pro を買うと、Pro の出力を評価できる側に回れる、というのがこのコース全体を通じての結論です。
      </p>

      <Divider />

      <Quiz
        question="Burp Collaborator が「外部のサーバー」を必要とする理由として最も適切なものはどれですか？"
        options={[
          "Community 版のライセンス制限を回避するため",
          "対象アプリケーションのレスポンスに現れない、外部への通信（アウトオブバンド）でしか観測できない挙動を検知するため",
          "Scanner のクロール速度を上げるため",
          "Intruder のスレッド数の上限を増やすため",
        ]}
        answer={1}
        explanation="SSRF やブラインド XXE のように、アプリケーションの応答には現れず外部への通信としてしか観測できない脆弱性を検知するには、対象の外側にある観測点（外部サーバー）が必要です。これが Collaborator の存在理由です。"
      />

      <KeyPoints
        items={[
          "Community と Professional の土台（Proxy/Repeater/Intruder等）は共通。差は主に自動化・規模・外部検知の部分",
          "Scanner（Pro限定）は受動/能動スキャンで当たりをつける道具。誤検知はあるため人による検証が必須",
          "Collaborator（Pro限定）はアウトオブバンド検知のための外部サーバー連携。無料の代替（自前VPS+DNSログ、interactsh系）もあるが情報漏えいリスクに注意",
          "Organizer / DOM Invader / Logger は整理・DOM解析・高度なログ検索を助けるPro機能",
          "Community では手動クロール・チェックリスト・Repeaterでの逐次検証・ffuf/nucleiなど外部ツールの併用で多くを代替できる",
          "ライセンス費用は変動するため公式サイトで確認する。Community で仕組みを理解してから Pro を導入すると、Pro の出力を正しく評価できるようになる",
        ]}
      />

      <Callout variant="info" title="このコースのここまで">
        Proxy・Target・Repeater・Intruder・Decoder/Comparer/Sequencer と一通り触れてきました。次は「22. 拡張機能 — BApp Store で作業台を強化する」で無料版の弱点を拡張で補い、「23. セッション処理ルールとマクロ」で認証を切らさない自動化を身につけたうえで、24章の通し演習でこれらを組み合わせます。
      </Callout>
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-01-what-is",
  title: "1. Burp Suite とは — Web 診断の作業台を知る",
  description: "Web アプリ診断になぜローカルプロキシが必要かから、Burp Suite のツール構成、エディション（Community/Professional/Enterprise）の違い、代替ツールとの位置づけまでを整理する。",
  domain: "burp-practice",
  section: "setup",
  order: 2,
  level: "intro",
  tags: ["Burp Suite", "プロキシ", "Webセキュリティ", "診断ツール"],
  updated: "2026-07-28",
  minutes: 45,
};

export default function Article() {
  return (
    <>
      <Lead>
        Burp Suite が何をするツールで、なぜ Web アプリ診断の現場で標準になっているのかを理解します。まずは道具の全体像を頭に入れてから、次章で実際にインストールします。（目標学習時間：45分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Web アプリ診断で「ローカルプロキシ」が必要な理由を説明できる</li>
          <li>ブラウザの DevTools と Burp の役割の違いを説明できる</li>
          <li>Burp Suite の主要ツール（Proxy・Target・Repeater・Intruder ほか）を一覧できる</li>
          <li>Community / Professional / Enterprise の違いと、無料版でどこまでできるかを把握する</li>
        </ul>
      </Callout>

      <Section>1. なぜ「ローカルプロキシ」が要るのか</Section>
      <p>
        Web アプリの診断は、突き詰めると「ブラウザとサーバーの間でやり取りされる HTTP リクエスト・レスポンスを、狙った通りに作り替えて送り、返ってきた反応を観察する」作業です。ブラウザの画面から素直に操作しているだけでは、フォームや JavaScript が許した範囲の値しか送信できません。パラメータを本来ありえない値に書き換えたり、隠しフィールドを覗いたり、同じリクエストを微妙に変えて何十回も送ったりするには、<strong>ブラウザとサーバーの間に割り込んで通信を横取りする「プロキシ」</strong>が必要になります。
      </p>
      <p>
        Burp Suite の中核はまさにこの<strong>ローカルプロキシ（Proxy）</strong>です。ブラウザの通信設定を Burp（既定では <Cmd>127.0.0.1:8080</Cmd>）経由に変更するだけで、すべてのリクエスト・レスポンスが Burp を通過するようになります。通過するだけでなく、<strong>その場で一時停止して内容を書き換えてから送信する</strong>、<strong>過去のリクエストをまるごと保存して何度でも再送する</strong>、<strong>1つのリクエストのパラメータだけを変えて大量に送り込む</strong>といった操作が可能になります。
      </p>

      <SubSection>ブラウザ DevTools との違い</SubSection>
      <p>
        「通信を見るだけなら DevTools の Network タブでも十分では」と思うかもしれません。実際、レスポンスを眺めるだけなら DevTools でも足ります。しかし診断作業の本質は「送信前に止めて改ざんする」「同じ操作を何度も繰り返す」「多数のパターンを一括で試す」ことにあり、ここが決定的に違います。
      </p>
      <ComparisonTable
        headers={["観点", "ブラウザ DevTools", "Burp Suite"]}
        rows={[
          ["送信前に内容を止めて書き換える", "基本的にできない（送信後の確認のみ）", "Proxy でインターセプトしてその場で改変できる"],
          ["同じリクエストを繰り返し送る", "手動で毎回操作し直す必要がある", "Repeater に送って何度でもワンクリックで再送"],
          ["パラメータを大量パターンで一括送信", "不可（拡張機能でも限定的）", "Intruder で辞書・数値範囲などを自動投入"],
          ["サイト内の未リンクページ・古い API の把握", "自分がクリックしたページしか記録されない", "Target の Site map に通過した通信が自動蓄積"],
          ["リクエスト全体の履歴保存・比較", "タブを閉じると消える", "Proxy の History に永続、Comparer で差分比較"],
        ]}
      />
      <Callout variant="info" title="DevTools が要らなくなるわけではない">
        DevTools は JavaScript のデバッグや DOM 構造の確認、コンソールでの検証には引き続き便利です。Burp は「通信そのものを操作対象にする」役割に特化したツールだと考えると住み分けが分かりやすくなります。
      </Callout>

      <SubSection>HTTPS も同じように扱える</SubSection>
      <p>
        現在の Web サイトはほぼすべて HTTPS（TLS で暗号化された通信）です。Burp はブラウザと Burp の間、Burp とサーバーの間、それぞれ別々に TLS 接続を行う「中間者」として振る舞うことで、暗号化された通信の中身もそのまま読み書きできます。そのために、ブラウザ側には Burp 独自の CA 証明書を信頼させる設定が必要になりますが、これは次章の内蔵ブラウザを使えばあらかじめ済んだ状態で試せます。
      </p>

      <Section>2. Burp Suite のツール構成</Section>
      <p>
        Burp Suite は単機能のツールではなく、画面上部のタブで切り替える<strong>複数ツールの集合体</strong>です。それぞれが役割を分担し、Proxy で捕まえた通信を他のツールへ送り込んで深掘りしていく、という流れで使います。
      </p>
      <KVList
        items={[
          { key: "Proxy", val: "ブラウザとサーバーの間に立ち、通信を捕捉・一時停止・改変する。すべての起点" },
          { key: "Target", val: "アクセスしたホストとページを Site map として整理し、対象範囲（Scope）を管理する" },
          { key: "Repeater", val: "1つのリクエストを何度も手動で編集・再送し、反応の違いを確かめる。診断の主戦場" },
          { key: "Intruder", val: "リクエストの一部を変数化し、辞書や数値範囲などを自動で差し替えながら大量送信する" },
          { key: "Decoder", val: "Base64・URL エンコード・HTML エンティティなどの相互変換を行う" },
          { key: "Comparer", val: "2つのリクエスト/レスポンスをバイト単位・単語単位で比較し差分を見る" },
          { key: "Sequencer", val: "セッショントークンなどの値のランダム性（推測しやすさ）を統計的に分析する" },
          { key: "Extensions", val: "BApp Store や自作の拡張機能を追加し、機能を拡張する" },
        ]}
      />
      <Callout variant="warn" title="Professional / Enterprise 限定のツール">
        以下は<strong>有償エディション限定</strong>です。この章では概要のみ押さえ、このコースでは扱いません。
        <ul>
          <li><strong>Scanner</strong>: クロール＋自動診断で脆弱性を検出（Pro/Enterprise 限定）</li>
          <li><strong>Collaborator</strong>: 外部からのコールバック（DNS/HTTP）を観測し、Blind 系の脆弱性（SSRF・Blind XSS 等）を検出（Pro/Enterprise 限定）</li>
          <li><strong>Organizer</strong>: 大量のリクエストを分類・整理する（Pro 限定）</li>
          <li><strong>DOM Invader</strong>: ブラウザ拡張と連携し、DOM ベース XSS などクライアント側の脆弱性を調査（Pro 版内蔵ブラウザ + 拡張）</li>
        </ul>
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-01-what-is-01.svg"
        alt="Burp Suite のウィンドウ上部に並ぶツールタブ（Dashboard, Target, Proxy, Intruder, Repeater, Sequencer, Decoder, Comparer, Extensions）"
        caption="Burp Suite の画面上部。タブを切り替えて各ツールを行き来しながら診断を進める"
      />

      <Section>3. エディション比較 — 無料版でどこまでできるか</Section>
      <p>
        Burp Suite には3つのエディションがあります。<strong>このコースは Community Edition（無料）</strong>を前提に進めます。Pro/Enterprise の機能に触れる場面では、その都度「Pro 限定」と明記します。
      </p>
      <ComparisonTable
        headers={["エディション", "価格", "主な用途", "できないこと（Community比）"]}
        rows={[
          ["Community", "無料", "個人の学習・手動診断の練習", "Scanner・Collaborator・Organizer 不可。Intruder は速度制限あり。プロジェクトのディスク保存不可"],
          ["Professional", "年額サブスクリプション（個人〜チーム）", "実務のペネトレーションテスト・診断業務", "（制限なし。Community の全機能に加えて自動診断系が使える）"],
          ["Enterprise", "年額サブスクリプション（組織向け）", "CI/CD 組み込みの継続的スキャン・組織全体の脆弱性管理", "対話的な手動診断向けではなく、自動スキャン運用が主目的"],
        ]}
      />
      <Callout variant="tip" title="Community 版で診断の「考え方」は十分学べる">
        自動スキャン機能が無くても、Proxy・Repeater・Intruder・Decoder・Comparer だけで「通信を捕まえて」「手で確かめて」「反復を試す」という診断の基本サイクルは一通り体験できます。このコースはその基本サイクルの習得を目標にします。
      </Callout>

      <Section>4. 代替ツールとの位置づけ</Section>
      <p>
        Burp Suite 以外にも Web 診断向けのプロキシツールは存在します。それぞれの立ち位置を知っておくと、現場や案件によって使い分ける判断がしやすくなります。
      </p>
      <ComparisonTable
        headers={["ツール", "特徴", "位置づけ"]}
        rows={[
          ["OWASP ZAP", "完全無料・OSS。GUI は Burp に似た構成。自動スキャンも無料で使える", "予算をかけずに自動診断まで欲しい場合の代表的選択肢"],
          ["mitmproxy", "CUI/Python ベースのプロキシ。スクリプトでの自動加工に強い", "CI に組み込んだ自動テスト・API モックなど開発者寄りの用途"],
          ["Caido", "Rust製の比較的新しいGUIプロキシ。軽量・モダンなUI", "Burp の代替を模索するコミュニティで近年注目されている新興ツール"],
        ]}
      />
      <p>
        業界的には<strong>Burp Suite が事実上の標準（デファクトスタンダード）</strong>であり、求人票や診断報告書のテンプレートも Burp を前提にしていることが多いのが実情です。このコースで Burp の使い方を身につけておけば、他のツールへの応用も効きます。
      </p>
      <p>
        なお、これらのツールはいずれも「使い方次第で強力な攻撃ツールにもなる」という点は共通しています。ツールの選定基準は機能の多さだけでなく、自分がどこまで責任を持って安全に運用できるかも含めて考えるようにしましょう。
      </p>

      <Section>5. このコースの学び方</Section>
      <p>
        次章からは、実際に Burp Suite Community Edition をインストールし、Web Security Academy や Docker で立てたローカルの脆弱アプリを対象に、Proxy → Target → Repeater → Intruder → 補助ツール → 拡張機能、という順番で手を動かしながら学んでいきます。各章末に理解度チェックの小テストと課題があるので、実際に自分の PC で操作しながら進めてください。
      </p>
      <SubSection>典型的な診断の流れ（このコースで体験する範囲）</SubSection>
      <p>
        実務の診断もおおむね同じサイクルを繰り返しています。このコースを終える頃には、下記の一連の流れを Community 版の機能だけで一通り再現できるようになります。
      </p>
      <ComparisonTable
        headers={["ステップ", "何をするか", "主に使うツール"]}
        rows={[
          ["1. 通信を捕まえる", "対象サイトを普通に操作し、発生する全リクエストを記録する", "Proxy"],
          ["2. 攻撃対象を整理する", "触れたホスト・パスを一覧化し、テストする範囲（Scope）を絞る", "Target"],
          ["3. 気になる箇所を手で確かめる", "怪しいパラメータを持つリクエストを送り直し、値を変えて反応を見る", "Repeater"],
          ["4. パターンを一括で試す", "辞書や連番など、多数の値を自動で差し替えて送信する", "Intruder"],
          ["5. 補助的に分析する", "エンコード変換・レスポンス比較・トークンの推測しやすさ確認", "Decoder / Comparer / Sequencer"],
        ]}
      />
      <Callout variant="danger" title="必ず守ること">
        Burp Suite は「対象に許可なく通信を送り込む」ことも技術的には可能にしてしまうツールです。<strong>次章以降で扱う検証対象は、必ず自分に使用が許可された環境（公式ラボやローカルの脆弱アプリ）に限定</strong>します。第三者のサイトに無断で向けることは絶対にしないでください。
      </Callout>

      <Divider />

      <Quiz
        question="Burp Suite の Proxy が、ブラウザの DevTools の Network タブと最も大きく異なる点はどれですか？"
        options={[
          "レスポンスのステータスコードを見られる点",
          "リクエストを送信する前に一時停止し、内容を書き換えてから送れる点",
          "HTTPS の通信を暗号化できる点",
          "ページの読み込み時間を計測できる点",
        ]}
        answer={1}
        explanation="DevTools は基本的に送信済みの通信を確認するツールです。Burp の Proxy は送信前にリクエストをインターセプトして書き換えられる点が診断作業の核心であり、Repeater・Intruder などの他ツールもこの仕組みの上に成り立っています。"
      />

      <KeyPoints
        items={[
          "Web診断には「送信前に止めて改ざんし、何度も繰り返せる」ローカルプロキシが必要",
          "Burp の中核は Proxy。Target・Repeater・Intruder・Decoder・Comparer・Sequencer と連携して使う",
          "Scanner・Collaborator・Organizer・DOM Invader は Professional/Enterprise 限定",
          "Community（無料）でも Proxy・Repeater・Intruder（速度制限あり）で診断の基本サイクルは学べる",
          "検証対象は必ず許可された環境（公式ラボ・ローカル脆弱アプリ）に限定する",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「2. インストールと初回起動」で、実際に Burp Suite Community Edition を自分の PC に入れて、画面の各パーツを一巡します。
      </Callout>
    </>
  );
}

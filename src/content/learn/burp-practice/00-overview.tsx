import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KVList, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-practice-overview",
  title: "Burp Suite 実践 — コース概要",
  description:
    "Web アプリ診断の定番ツール Burp Suite を、公式ラボとローカル脆弱アプリで手を動かしながら習得する実践コースの概要。前提・進め方・全26記事の一覧。",
  domain: "burp-practice",
  section: "setup",
  order: 1,
  level: "intro",
  tags: ["Burp Suite", "Web セキュリティ", "診断", "コース概要"],
  updated: "2026-07-28",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>（目標学習時間：24〜28時間）</Lead>

      <p>
        このコースでは、Web アプリケーション診断の作業台として広く使われている{" "}
        <strong>Burp Suite</strong> を、実際に手を動かしながら習得します。ブラウザとサーバーの間に立って
        通信を捕まえ、止めて、書き換えて、繰り返す。この一連の動作を身体で覚えることが目的です。
      </p>

      <Callout variant="danger" title="はじめに — このコースの絶対条件">
        Burp Suite は<strong>自分に許可された対象にしか向けてはいけません</strong>。
        他人が運営するサイトへ無断でリクエストを送る行為は、国内では不正アクセス禁止法や
        電子計算機損壊等業務妨害に問われ得ます。このコースの演習はすべて、
        <strong>PortSwigger 公式の無料ラボ（Web Security Academy）</strong>、または
        <strong>自分の PC 上に立てた練習用アプリ（OWASP Juice Shop / DVWA）</strong>
        を対象に行います。この前提から外れないでください。
      </Callout>

      <Section>このコースで扱う範囲</Section>
      <p>
        Burp Suite には無料の <strong>Community Edition</strong> と有償の{" "}
        <strong>Professional</strong> があります。本コースは
        <strong>Community Edition で使える範囲を中心</strong>に構成しています。自動スキャナや
        Collaborator など Professional 限定の機能は「Pro 限定」と明示したうえで、
        何ができる機能なのか・無料版では何を手作業で代替するのかを解説します。
      </p>
      <KVList
        items={[
          { key: "主に使うツール", val: "Proxy / Target / Repeater / Intruder / Decoder / Comparer / Sequencer / Extensions" },
          { key: "検証環境", val: "Web Security Academy（オンライン公式ラボ）／ Juice Shop・DVWA（ローカル Docker）" },
          { key: "エディション", val: "Community Edition（無料）を前提。Pro 限定機能は概要のみ" },
          { key: "前提知識", val: "HTTP の基本（メソッド・ヘッダ・ステータスコード）、Cookie とセッションの概念" },
          { key: "あるとよい環境", val: "Docker（ローカル練習用アプリを立てるため）" },
        ]}
      />

      <Callout variant="info" title="前提知識に不安がある場合">
        HTTP・Cookie・認証まわりが曖昧なら、先に「Web基礎」コースの Web/HTTP の基礎、
        あるいは「セキュリティ基礎」コースの Web セキュリティの章に目を通しておくと、
        本コースの各章がずっと読みやすくなります。
      </Callout>

      <Section>進め方</Section>
      <p>各記事は次の流れで構成されています。上から順に進めてください。</p>
      <ul>
        <li>その章で何ができるようになるかの学習目標</li>
        <li>仕組みの解説（なぜその機能が必要なのか）</li>
        <li>実際の操作手順</li>
        <li>ラボ環境での演習課題</li>
        <li>要点のまとめと理解度チェック</li>
      </ul>
      <p>
        読むだけでは身につかないツールです。<strong>必ず Burp を起動した状態で読み進め、
        書かれている操作をその場で試してください</strong>。第3章までで環境を整えたら、
        以降はずっと手を動かしながら進むことになります。
      </p>

      <Callout variant="tip" title="記録を残す習慣をつける">
        Community Edition は<strong>プロジェクトの保存ができません</strong>。Burp を閉じると
        サイトマップも履歴も消えます。演習で気づいたことは、必ず外部のメモに残しながら進めてください。
        この「記録しながら進む」癖は、最終章のレポート作成にそのまま効いてきます。
      </Callout>

      <Divider />

      <Section>コース全体像（全26記事）</Section>
      <ComparisonTable
        headers={["タイトル", "章", "目安時間", "レベル"]}
        rows={[
          ["0. コース概要（この記事）", "導入と検証環境の構築", "20分", "入門"],
          ["1. Burp Suite とは — Web 診断の作業台を知る", "導入と検証環境の構築", "45分", "入門"],
          ["2. インストールと初回起動 — 画面の地図を作る", "導入と検証環境の構築", "1時間", "入門"],
          ["3. 検証環境を用意する — 合法に手を動かせる場所", "導入と検証環境の構築", "1時間", "入門"],
          ["4. Proxy の仕組み — 通信の途中に立つ", "Proxy", "50分", "基礎"],
          ["5. CA 証明書と HTTPS 傍受 — 外部ブラウザを繋ぐ", "Proxy", "1時間", "基礎"],
          ["6. Intercept — リクエストを止めて書き換える", "Proxy", "1時間", "基礎"],
          ["7. HTTP history — 通信ログを読み解く", "Proxy", "55分", "基礎"],
          ["8. Proxy の設定を詰める — Match and replace と除外ルール", "Proxy", "50分", "実践"],
          ["9. Target サイトマップとスコープ — 見る範囲を決める", "Target", "50分", "基礎"],
          ["10. 攻撃面を洗い出す — 手動クロールという基本動作", "Target", "1時間", "実践"],
          ["11. Repeater の基本 — 1リクエストを何度でも", "Repeater", "50分", "基礎"],
          ["12. メッセージエディタと Inspector — 編集を速くする", "Repeater", "55分", "基礎"],
          ["13. ラボ実践 — Repeater で仮説を検証する", "Repeater", "1.5時間", "実践"],
          ["14. Intruder の基本 — どこに何を入れるか", "Intruder", "55分", "基礎"],
          ["15. 4つの Attack Type を使い分ける", "Intruder", "50分", "基礎"],
          ["16. Payload Processing と Grep — 自動で判定する", "Intruder", "50分", "基礎"],
          ["17. 実践ラボ — ログイン攻撃とロックアウトの回避", "Intruder", "65分", "実践"],
          ["18. Community 版の制限と代替ツール、倫理的な運用", "Intruder", "45分", "実践"],
          ["19. Decoder と Comparer — 値を読み解き、差を見つける", "補助ツール群", "45分", "基礎"],
          ["20. Sequencer — トークンの推測しにくさを測る", "補助ツール群", "55分", "実践"],
          ["21. Professional 版の全体像 — Scanner・Collaborator", "補助ツール群", "50分", "実践"],
          ["22. 拡張機能 — BApp Store で作業台を強化する", "拡張とワークフロー自動化", "55分", "実践"],
          ["23. セッション処理ルールとマクロ — 認証を切らさず自動化する", "拡張とワークフロー自動化", "1時間", "実践"],
          ["24. 通し演習 — 一つのアプリを最初から最後まで診る", "通し演習とレポート", "2時間", "実践"],
          ["25. 記録とレポート — 見つけたものを伝わる形にする", "通し演習とレポート", "1時間", "実践"],
        ]}
      />

      <Section>このコースを終えると</Section>
      <ul>
        <li>ブラウザと Burp を繋ぎ、HTTPS を含む通信を自在に観察・改変できる</li>
        <li>スコープを切って、対象アプリの攻撃面を体系立てて洗い出せる</li>
        <li>「こうなっているのではないか」という仮説を、最小のリクエストで検証できる</li>
        <li>反復が必要な検証を Intruder に任せ、結果を読み解いて判断できる</li>
        <li>見つけた挙動を、第三者が再現できる報告の形にまとめられる</li>
      </ul>

      <Callout variant="info" title="次のステップ">
        まずは「1. Burp Suite とは」でツール全体の地図を掴み、続く2〜3章で環境を整えてください。
        第4章から実際の通信を触りはじめます。
      </Callout>
    </>
  );
}

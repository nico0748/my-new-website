import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-08-proxy-options",
  title: "8. Proxy の設定を詰める — Match and replace と除外ルール",
  description: "Burp Suite の Proxy 設定を実務レベルで使いこなす。Match and replace による自動書き換え、Intercept ルールの調整、TLS pass through、レスポンス改変の用途、設定の持ち運びまで。",
  domain: "burp-practice",
  section: "proxy",
  order: 5,
  level: "practice",
  tags: ["Burp Suite", "Match and replace", "TLS pass through", "Proxy settings"],
  updated: "2026-07-28",
  minutes: 50,
};

export default function Article() {
  return (
    <>
      <Lead>
        ここまでで Proxy の基本操作は身につきました。この章では <Cmd>Settings → Tools → Proxy</Cmd> の設定項目を掘り下げ、繰り返し作業を自動化したり、不要なノイズを事前に消したりする「詰め」の設定を扱います。（目標学習時間：50分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>Match and replace で正規表現によるリクエスト/レスポンスの自動書き換えができる</li>
          <li>Intercept のルールを編集し、拡張子や MIME type で自動 forward できる</li>
          <li>TLS pass through で傍受しないホストを指定できる</li>
          <li>レスポンス改変の代表的な用途（hidden 表示、JS バリデーション削除等）を理解する</li>
          <li>複数リスナー構成と、設定のエクスポート/インポートを理解する</li>
        </ul>
      </Callout>

      <Section>1. Settings → Tools → Proxy の全体像</Section>
      <p>
        Burp のメイン設定画面（<Cmd>Settings</Cmd> アイコン、または上部メニュー）の <Cmd>Tools → Proxy</Cmd> セクションに、Proxy に関する詳細設定がまとまっています。ここまでの章で触れた Listener 以外に、次のような項目があります。
      </p>
      <KVList
        items={[
          { key: "Proxy Listeners", val: "待受アドレス・ポートの管理（4章で扱った内容）" },
          { key: "Intercept Client Requests", val: "どんなリクエストを Intercept で止めるかのルール" },
          { key: "Intercept Server Responses", val: "どんなレスポンスを Intercept で止めるかのルール" },
          { key: "Response Modification", val: "自動的にレスポンスへ手を加える機能群（hidden 属性の除去等）" },
          { key: "Match and Replace", val: "正規表現によるリクエスト/レスポンスの自動置換ルール" },
          { key: "TLS Pass Through", val: "指定したホストの HTTPS 通信を傍受せずそのまま中継する設定" },
          { key: "Miscellaneous", val: "その他の細かい挙動（自動 Content-Length 修正等）" },
        ]}
      />

      <Section>2. Match and replace で自動書き換え</Section>
      <p>
        Intercept でその都度手動で書き換えるのは非効率です。<strong>いつも決まった箇所を書き換えたい</strong>場合は、Match and replace にルールを登録しておけば、通過するすべてのリクエスト（またはレスポンス）に自動で正規表現置換がかかります。
      </p>
      <SubSection>実用例1: User-Agent の書き換え（モバイル UA での表示差分確認）</SubSection>
      <p>
        レスポンシブ対応やモバイル専用の分岐がある画面を、PC のブラウザのまま確認したいときに使います。
      </p>
      <Code lang="text" filename="Match and replace ルール例（リクエストヘッダ）">{`Type: Request header
Match:   ^User-Agent:.*$
Replace: User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148`}</Code>
      <SubSection>実用例2: レスポンスの disabled 属性を除去する</SubSection>
      <p>
        フォームのボタンやフィールドに <Cmd>disabled</Cmd> が付与されているだけで実質的な制約になっていないケースを、手動で毎回編集せず自動化します。
      </p>
      <Code lang="text" filename="Match and replace ルール例（レスポンスボディ）">{`Type: Response body
Match:   \\sdisabled(="[^"]*")?
Replace: （空文字。マッチした部分を丸ごと削除する）`}</Code>
      <SubSection>実用例3: JS の書き換え（バリデーション関数を無効化）</SubSection>
      <Code lang="text" filename="Match and replace ルール例（クライアント側チェックの無効化）">{`Type: Response body
Match:   function validateCoupon\\([^)]*\\)\\s*\\{[^}]*\\}
Replace: function validateCoupon() { return true; }`}</Code>
      <Callout variant="warn" title="正規表現は対象を絞ってから書く">
        Match and replace はマッチした箇所すべてに適用されます。ホストを絞らずに広い正規表現を書くと、想定外のページまで壊れることがあります。ルールごとに <Cmd>Scope</Cmd>（対象ホスト）を指定し、まずは Proxy → HTTP history で影響範囲を確認しながら調整しましょう。
      </Callout>

      <Section>3. Intercept ルールの調整</Section>
      <p>
        Intercept Client Requests / Intercept Server Responses には、それぞれ「どんな条件のときに Intercept で止めるか」を細かく指定するルールリストがあります。既定では拡張子ベースの単純な条件が入っていますが、これを編集して<strong>静的ファイルは自動で forward し、API 呼び出しだけを止める</strong>ように調整できます。
      </p>
      <ComparisonTable
        headers={["調整例", "効果"]}
        rows={[
          ["File extension does not match (js|css|png|jpg|svg|woff2?)", "画像やスタイルシート、フォントなど検証対象になりにくいものを自動 forward し、Intercept で止まる回数を減らす"],
          ["Content-Type header matches application/json", "API 系の JSON リクエストだけを確実に止めたいときに追加する"],
          ["URL matches ^/api/", "特定のパス配下だけを Intercept 対象にする"],
        ]}
      />

      <Section>4. TLS pass through でノイズを消す</Section>
      <p>
        検証対象と無関係な HTTPS 通信（アナリティクス、フォントサービス、ブラウザ自体のバックグラウンド通信など）まで Burp が毎回 TLS を終端しようとすると、証明書関連のエラーが積み重なったり、ログが余計に汚れたりします。<strong>TLS pass through</strong> に登録したホストは、Burp が中身を覗かずにそのまま素通しでトンネリングします。
      </p>
      <Code lang="text" filename="TLS pass through に登録する例">{`fonts.googleapis.com
fonts.gstatic.com
*.doubleclick.net`}</Code>
      <Callout variant="info" title="検証対象以外はどんどん pass through してよい">
        Target の Scope に検証対象ドメインだけを登録しているなら、<strong>それ以外はまとめて TLS pass through に入れてしまう</strong>という運用も実務的です。診断対象そのものの通信だけが HTTP history に残るので、ログが劇的に読みやすくなります。
      </Callout>

      <Section>5. レスポンス改変の代表的な用途</Section>
      <p>
        Response Modification（および Match and replace のレスポンス側）は、<strong>クライアント側の制約がサーバー側のアクセス制御と別物であることを確認する</strong>ための機能です。代表的な用途を整理します。
      </p>
      <ComparisonTable
        headers={["用途", "何を確認するためか"]}
        rows={[
          ["hidden なフォームフィールドを表示する", "画面上は隠されているだけの入力欄を実際に操作できるようにし、サーバー側が本当にその値を制限しているか確認する"],
          ["JS のフォームバリデーションを削除する", "「保存」ボタンが JS 側の入力チェックで無効化されているだけなのか、サーバー側でも同じ制約があるのかを切り分ける"],
          ["Cookie の Secure / HttpOnly フラグを外す", "Cookie の保護属性がどう機能しているかを確認する（JavaScript からアクセスできるかどうかのテスト等）。学習・検証目的であり、悪用目的の恒久的な弱体化ではないことに注意"],
        ]}
      />
      <Callout variant="danger" title="レスポンス改変は「観察のための一時的な操作」">
        これらの改変は、あくまで自分のブラウザに表示される内容・自分の検証セッション内の挙動を変えているだけです。サーバー側の実際のセキュリティ設定を変更しているわけではありません。目的は常に「クライアント側の制約とサーバー側の制御が一致しているかを確認すること」に置きましょう。
      </Callout>

      <Section>6. 複数リスナーの構成</Section>
      <p>
        Proxy Listeners は複数同時に立てられます。たとえば、通常の作業用に <Cmd>127.0.0.1:8080</Cmd>、モバイル端末専用に別ポート（例: <Cmd>0.0.0.0:8081</Cmd>）を用意する、という構成が考えられます。
      </p>
      <Steps>
        <Step title="新しい Listener を追加する">Proxy Listeners で <Cmd>Add</Cmd> をクリックし、別ポート（例: 8081）を指定する。</Step>
        <Step title="モバイル端末用にだけ All interfaces を許可する">この用途に限り、必要な間だけ Bind to address を調整する（作業後は必ず戻す）。</Step>
        <Step title="モバイル端末のプロキシ設定をこのポートに向ける">スマートフォンの Wi-Fi 設定で、PC の IP アドレスとこのポート番号を手動プロキシとして設定する。</Step>
      </Steps>
      <Figure
        src="/learn/shots/burp-practice/burp-08-proxy-options-01.svg"
        alt="Proxy Listeners の設定画面に127.0.0.1:8080 と別ポートの8081の2つのListenerが登録されている様子"
        caption="複数の Proxy Listener。用途ごとにポートを分けて運用する"
      />
      <Callout variant="warn" title="モバイル端末経由でも Bind はできるだけ絞る">
        全ネットワークに開放する代わりに、可能であれば社内 LAN や自宅 Wi-Fi など<strong>信頼できるネットワーク内でのみ</strong>一時的に運用し、検証が終わったら Listener ごと削除するか無効化しましょう。
      </Callout>

      <Section>7. 設定のエクスポート/インポートで環境を持ち運ぶ</Section>
      <p>
        Match and replace のルールや Intercept のルール、Listener 設定などは、<Cmd>Settings</Cmd> 画面から丸ごとファイルにエクスポートできます。Community Edition ではプロジェクトファイルとしての永続化に制限がある分、<strong>この設定エクスポートを使って環境を使い回す</strong>のがコツです。
      </p>
      <Steps>
        <Step title="設定をエクスポートする">Settings 画面右上または該当セクションの <Cmd>Save</Cmd> / エクスポートボタンから、設定を JSON ファイルとして保存する。</Step>
        <Step title="別の環境でインポートする">別 PC や再インストール後の Burp で、同じ画面からインポートし、Match and replace ルールや Listener 設定を復元する。</Step>
        <Step title="バージョン管理しておく（任意）">個人の検証用設定であれば、機密情報を含まない範囲でファイルをバックアップしておくと再構築が速い。</Step>
      </Steps>
      <Callout variant="tip" title="Community 版で「設定を残す」ための現実的な手段">
        プロジェクトファイル保存に制限がある Community Edition では、この設定エクスポート/インポートが、次回の検証でも同じ Match and replace ルールやリスナー構成をすぐ再現するための実質的な手段になります。
      </Callout>

      <Divider />

      <Quiz
        question="検証対象と無関係な広告・フォントサービスなどの HTTPS 通信を、中身を見ずにそのまま中継してノイズを減らす設定はどれか。"
        options={[
          "Match and replace で該当ドメインへのリクエストをすべて空文字に置換する",
          "TLS pass through に該当ホストを登録する",
          "Intercept is on にして毎回手動で Forward する",
        ]}
        answer={1}
        explanation="TLS pass through に登録したホストは、Burp が TLS を終端せずそのまま素通しでトンネリングします。検証対象以外の通信をここに登録しておくと、HTTP history のノイズを大きく減らせます。"
      />

      <Divider />

      <KeyPoints
        items={[
          "Match and replace は正規表現でリクエスト/レスポンスを自動書き換えする機能",
          "Intercept ルールを調整すれば、静的ファイルは自動 forward・API だけ止める運用ができる",
          "TLS pass through で検証対象以外のホストを素通しにし、ログのノイズを減らす",
          "レスポンス改変はクライアント制約とサーバー制御が一致しているかを確認する手段",
          "複数 Listener でモバイル端末等を通す構成も可能。Bind は必要な範囲に絞る",
          "設定のエクスポート/インポートで、Community Edition でも環境を持ち運べる",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        Proxy の章はここまでです。次は「9. Target サイトマップとスコープ — 見る範囲を決める」で、Scope の設定と Site map の読み方を学びます。
      </Callout>
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, Steps, Step, KeyPoints, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "revenuecat",
  title: "RevenueCat — アプリ内課金基盤",
  description: "App Store/Google Play の複雑な課金仕様を吸収し、サブスク実装・運用・分析を簡単にする RevenueCat の役割を解説する。",
  domain: "web",
  section: "backend",
  order: 13,
  level: "basic",
  tags: ["課金", "サブスク", "RevenueCat"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        アプリ内課金（サブスクリプションや消耗型アイテム）を自前で実装しようとすると、App Store と Google Play で
        <strong>まったく異なる課金 API・レシート検証・サーバー通知</strong>に振り回されます。<strong>RevenueCat</strong> は、この複雑さを吸収し、
        課金の実装・運用・分析を一気に簡単にするサードパーティ基盤です。
      </Lead>

      <Section>RevenueCat が解決する課題</Section>
      <ul>
        <li><strong>ストア仕様の吸収</strong> — iOS/Android それぞれのレシート検証・購入検証を肩代わりする</li>
        <li><strong>クロスプラットフォーム</strong> — iOS/Android/Web を統一 SDK で扱える</li>
        <li><strong>エンタイトルメント管理</strong> — 「プレミアム権限を持っているか」を一元管理</li>
        <li><strong>LTV の可視化</strong> — 売上・継続率などをダッシュボードで分析</li>
      </ul>

      <Callout variant="info" title="エンタイトルメント（権限）という考え方">
        RevenueCat では個々の商品 ID ではなく<strong>「premium」などの権限（entitlement）</strong>を軸に判定します。
        たとえば月額プランと年額プランのどちらを買っても同じ <Cmd>premium</Cmd> 権限が有効になる、という設計にできるため、
        アプリ側のコードは「premium が有効か」だけを見ればよくなります。
      </Callout>

      <Section>主な機能</Section>
      <ul>
        <li><strong>レシート検証 / サーバー通知の自動処理</strong> — ストアからの通知を受けて購入状態を維持</li>
        <li><strong>購入状態のリアルタイム同期</strong> — 端末をまたいでも権限が一致する</li>
        <li><strong>REST API</strong> — サーバー側からも購入者情報を取得・操作できる</li>
        <li><strong>ダッシュボード</strong> — MRR・継続率・LTV・チャーンを可視化</li>
        <li><strong>オファー / プロモーション</strong> — 割引・トライアル・プロモコードに対応</li>
        <li><strong>カスタマーサポート</strong> — 個別ユーザーの購入状況を確認・調整</li>
      </ul>

      <Section>アーキテクチャ</Section>
      <p>
        クライアントの SDK が RevenueCat を経由してストアと通信し、購入結果を RevenueCat が検証・記録します。
        あなたのサーバーは REST API や Webhook を通じて購入状態を受け取ります。
      </p>

      <Code lang="text" filename="全体の流れ">{`クライアント(SDK) ──▶ RevenueCat ──▶ ストア(App Store / Google Play)
                        │
                        ├─ REST API ──▶ あなたのサーバー
                        └─ Webhook  ──▶ あなたのサーバー（購入・更新・解約の通知）`}</Code>

      <SubSection>SDK 実装例（Swift）</SubSection>
      <p>SDK の初期化と権限チェックは、数行で書けるのが RevenueCat の魅力です。</p>

      <Code lang="swift" filename="AppDelegate.swift">{`import RevenueCat

// 初期化（API キーを設定するだけ）
Purchases.configure(withAPIKey: "app_xxxxxxxxxxxx")

// 「premium」権限が有効かどうかを確認
Purchases.shared.getCustomerInfo { customerInfo, error in
    if customerInfo?.entitlements["premium"]?.isActive == true {
        // プレミアム機能を解放
    }
}`}</Code>

      <Callout variant="tip" title="実装が薄くなる">
        レシート検証・購入復元・サブスク更新・解約処理といった<strong>面倒でバグりやすい処理を RevenueCat 側に寄せられる</strong>ため、
        アプリ側は「entitlement が有効か」を見るだけで済みます。個人開発〜スタートアップで採用例が多いのはこのためです。
      </Callout>

      <Bridge course="システム設計 / 情報セキュリティ">
        「なぜクライアントだけで判定してはいけないのか」は、講義で学ぶ<strong>信頼境界（trust boundary）</strong>の問題です。クライアント（アプリ）は改ざん可能なので<strong>信頼できない領域</strong>にあり、「premium だ」という主張をそのまま信じると容易に不正解放されます。だから<strong>サーバー側（＝ストア／RevenueCat という信頼できる領域）でレシートを検証</strong>し、その結果を正とします。「入力を信用せず、権限判定は信頼できる側で行う」という原則の、課金という具体例です。
      </Bridge>

      <Section>サーバー側検証と状態同期</Section>
      <p>
        課金は「複数の当事者（アプリ・ストア・RevenueCat・自社サーバー・複数端末）が<strong>同じ購入状態を共有</strong>しなければならない」典型的な分散システム問題です。RevenueCat はこれを次のように扱います。
      </p>
      <Steps>
        <Step title="購入は必ずサーバー側で検証">
          クライアントの購入結果を鵜呑みにせず、ストアのレシートを RevenueCat が検証して<strong>権威ある状態</strong>を確定します。
        </Step>
        <Step title="状態は Webhook で自社に通知">
          更新・解約・返金などの状態変化を <Cmd>Webhook</Cmd> で自社サーバーへ push し、DB を追従させます。
        </Step>
        <Step title="端末をまたいで同期">
          同一ユーザーの entitlement は RevenueCat が一元管理するため、機種変更や複数端末でも権限が一致します。
        </Step>
      </Steps>

      <Code lang="typescript" filename="webhook.ts">{`// RevenueCat からの Webhook を受ける（Express 例）
app.post("/webhooks/revenuecat", (req, res) => {
  const event = req.body;

  // 冪等性: event.id で重複処理を防ぐ（同じ通知が再送されうる）
  if (alreadyProcessed(event.id)) {
    return res.status(200).end(); // 二重付与を避けつつ 200 で ack
  }

  if (event.type === "INITIAL_PURCHASE" || event.type === "RENEWAL") {
    grantPremium(event.app_user_id);
  } else if (event.type === "CANCELLATION" || event.type === "EXPIRATION") {
    revokePremium(event.app_user_id);
  }

  markProcessed(event.id);
  res.status(200).end();
});`}</Code>

      <Bridge course="分散システム">
        Webhook 連携で必ず問われるのが<strong>冪等性（idempotency）</strong>です。ネットワーク越しの通知は「少なくとも 1 回（at-least-once）」で届く前提——同じイベントが再送されることがあるため、<Cmd>event.id</Cmd> で処理済みを判定し、<strong>何度受けても結果が同じ</strong>になるよう設計します。これを怠ると「二重付与」「二重課金反映」が起きます。講義で扱う「exactly-once は難しく、at-least-once + 冪等キーで実質 exactly-once を作る」というメッセージング設計そのものです。返金・失効といった状態遷移を扱う点は、状態機械（ステートマシン）の同期問題でもあります。
      </Bridge>

      <Callout variant="warn" title="よくある落とし穴">
        <strong>クライアントだけで権限を持たせる</strong>実装は改ざんに弱いので避けます。Webhook は<strong>署名を検証</strong>して正規の送信元か確認し、受信ハンドラは<strong>冪等</strong>に。返金・チャージバックで権限を<strong>剥奪</strong>する処理も忘れがちなので、付与だけでなく失効側も必ず実装します。
      </Callout>

      <Section>料金プラン</Section>
      <ComparisonTable
        headers={["プラン", "条件", "料金"]}
        rows={[
          ["Starter", "月間トラッキング売上 $10,000 まで", "無料"],
          ["Pro", "それ以上", "課金売上の 1%"],
        ]}
      />

      <p>
        小さく始めて、売上が伸びてから課金される従量モデルなので、<strong>個人開発や検証段階では実質無料</strong>で使い始められます。
        課金機能を自前でゼロから作る工数と保守コストを考えると、多くのケースで導入メリットが上回ります。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "RevenueCat は App Store / Google Play の複雑な課金仕様を吸収するサブスク基盤",
          "レシート検証・サーバー通知・クロスプラットフォーム対応を肩代わりしてくれる",
          "商品 ID ではなく entitlement（premium などの権限）を軸に判定する設計",
          "SDK は数行で初期化・権限チェックが可能。REST API / Webhook でサーバー連携も",
          "料金は Starter（月商 $10,000 まで無料）/ Pro（売上の 1%）。小さく始められる",
        ]}
      />
    </>
  );
}

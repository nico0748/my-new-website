import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, TipBox, Bridge, Steps, Step, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "webhook",
  title: "Webhook — イベント駆動の連携",
  description: "ポーリングの逆で、イベント発生時にサーバへ通知が飛ぶ Webhook。仕組み、署名検証、リトライと冪等性、受信実装を解説する。",
  domain: "web",
  section: "api",
  order: 8,
  level: "basic",
  tags: ["Webhook", "API", "連携"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        通常の API は「こちらから聞きに行く（pull）」形ですが、<strong>Webhook</strong> は「向こうから知らせに来る（push）」形です。決済が完了した・issue が作られた、といったイベントが起きた瞬間に、相手のサーバがあなたの URL へ HTTP リクエストを送ってくれます。「逆向きの API」「ユーザ定義のコールバック」とも呼ばれます。
      </Lead>

      <Section>設計思想 — イベント駆動という考え方</Section>
      <p>
        Webhook の本質は「<strong>状態を問い合わせる</strong>」から「<strong>変化を通知される</strong>」への発想転換です。ポーリングは「今どうなってる？」を繰り返し聞く<em>プル</em>型。Webhook は「変わったら教えて」と一度登録しておく<em>プッシュ</em>型で、これは<strong>イベント駆動アーキテクチャ</strong>の一形態です。イベントの<em>発行者（producer）</em>である外部サービスと、<em>購読者（consumer）</em>であるあなたのサーバが、HTTP を介して疎結合につながります。
      </p>

      <Bridge course="分散システム">
        Webhook は、講義で学ぶ<strong>非同期メッセージング／イベント駆動</strong>を HTTP で実装したものです。送信側と受信側が同時に動いている必要はなく（あなたのサーバが一時的に落ちていても後でリトライされる）、これは Pub/Sub やメッセージキューと同じ「時間的な疎結合」です。さらに、後で出てくる<strong>at-least-once 配信</strong>（少なくとも 1 回は届くが、重複しうる）と<strong>冪等性</strong>は、分散システムの配信保証（at-most-once / at-least-once / exactly-once）の議論そのもの。「exactly-once は事実上作れないので、at-least-once ＋ 受信側の冪等化で達成する」という定石が、そのまま Webhook 受信の設計指針になります。
      </Bridge>

      <Section>ポーリング vs Webhook</Section>
      <p>
        「決済が完了したか」を知りたいとき、<strong>ポーリング</strong>では数秒おきに <Cmd>GET /payments/123</Cmd> を叩き続けます。無駄なリクエストが多く、反映も遅れます。Webhook なら、完了した瞬間に相手が 1 回だけ通知を送ってくれるので、効率的かつリアルタイムです。
      </p>
      <ComparisonTable
        headers={["観点", "ポーリング", "Webhook"]}
        rows={[
          ["方向", "自分 → 相手（聞きに行く）", "相手 → 自分（知らせに来る）"],
          ["即時性", "低い（間隔に依存）", "高い（発生時に届く）"],
          ["無駄", "多い（空振りが大量）", "少ない（発生時のみ）"],
          ["受信側の準備", "不要", "公開エンドポイントが必要"],
        ]}
      />

      <Section>仕組み — 登録した URL へ POST が届く</Section>
      <p>
        まず、あなたが受信用の URL（例: <Cmd>https://example.com/webhooks/stripe</Cmd>）を相手サービスに登録します。以降、対象イベントが起きるたびに、相手はその URL に対してイベント内容を JSON ボディで <Cmd>POST</Cmd> します。受信側は中身を処理し、<Cmd>200</Cmd> 系のステータスを返すだけです。
      </p>

      <SequenceDiagram
        actors={["外部サービス", "あなたのサーバー"]}
        messages={[
          { from: 0, to: 1, label: "① イベント発生時に POST 通知" },
          { from: 1, to: 0, label: "② 200 OK（受領）", cta: true },
          { from: 0, to: 1, label: "③ 失敗時はリトライ" },
        ]}
        caption="ポーリング不要。イベント発生時に通知が届く"
      />

      <Section>署名検証（セキュリティ）</Section>
      <p>
        Webhook の受信 URL は公開されているため、<strong>誰でも POST できてしまう</strong>のが最大のリスクです。悪意ある第三者が「決済成功」の偽通知を送れば、商品を不正に発送してしまいかねません。そこで、送信元が本物であることを<strong>署名（signature）</strong>で検証します。
      </p>
      <SubSection>検証の流れ</SubSection>
      <ul>
        <li>送信側は、事前に共有した<strong>シークレット</strong>でボディの HMAC を計算し、ヘッダ（例: <Cmd>Stripe-Signature</Cmd>）に載せて送る。</li>
        <li>受信側は、受け取った<strong>生のボディ</strong>と同じシークレットで HMAC を計算し、ヘッダの値と一致するか比べる。</li>
        <li>一致しなければ拒否（<Cmd>400</Cmd>）。一致すれば本物として処理する。</li>
      </ul>

      <Code lang="javascript" filename="verify.js">{`import crypto from "node:crypto";

// 受け取った raw ボディと共有シークレットから HMAC を計算し、
// ヘッダの署名と定数時間で比較する
function verify(rawBody, header, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody) // ← パース前の生ボディ
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  // 長さが違うと timingSafeEqual は例外 → 先に弾く
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}`}</Code>

      <Bridge course="情報セキュリティ / 暗号">
        署名検証は、講義で学ぶ<strong>メッセージ認証コード（MAC）</strong>の実応用です。<Cmd>HMAC-SHA256</Cmd> は「共有鍵＋ハッシュ関数」で<strong>完全性（改ざんされていない）</strong>と<strong>認証（送信元が鍵を持つ本物）</strong>を同時に保証します。公開鍵署名ではなく共通鍵の HMAC なのは、送受信で同じシークレットを共有しているため。さらに <Cmd>timingSafeEqual</Cmd> による<strong>定数時間比較</strong>は、比較の所要時間から 1 バイトずつ正解を探る<strong>タイミング攻撃（サイドチャネル攻撃）</strong>を防ぐためで、「暗号は理論だけでなく実装のリークまで守る」という授業の教訓がそのまま効く場面です。多くのサービスは署名にタイムスタンプも含め、<strong>リプレイ攻撃</strong>（過去の正規リクエストの使い回し）も防ぎます。
      </Bridge>

      <Callout variant="danger" title="生のボディで検証する">
        JSON をパースして再文字列化すると、キーの順序や空白が変わり署名が合わなくなります。署名検証は必ず<strong>受け取ったままの raw ボディ</strong>に対して行ってください。比較はタイミング攻撃を避けるため定数時間比較（<Cmd>timingSafeEqual</Cmd>）を使います。
      </Callout>

      <Section>リトライと冪等性</Section>
      <p>
        あなたのサーバが一時的に落ちていたり <Cmd>500</Cmd> を返したりすると、送信側は<strong>同じイベントを再送（リトライ）</strong>します。つまり「同じ通知が 2 回以上届く」ことが前提です。二重処理を防ぐには、各イベントに付く一意な ID（例: <Cmd>evt_xxx</Cmd>）を記録し、処理済みならスキップする<strong>冪等な受信</strong>にします。
      </p>

      <SubSection>冪等な受信の作り方</SubSection>
      <Steps>
        <Step title="イベント ID を取り出す">
          ペイロードに付く一意な ID（例: <Cmd>evt_xxx</Cmd>）を鍵にする。無ければ「本文のハッシュ」でも代用できる。
        </Step>
        <Step title="処理済みか確認する">
          DB / Redis に同じ ID の記録があればスキップして <Cmd>200</Cmd> を返す（再送は正常系）。
        </Step>
        <Step title="記録してから処理する">
          ID を保存し、実処理を行う。保存と処理はできればトランザクション／原子的に。
        </Step>
      </Steps>

      <Callout variant="tip" title="まず 200 を返してから処理する">
        重い処理を同期でやると相手のタイムアウトを招き、リトライが多発します。受信直後に検証だけ済ませて <Cmd>200</Cmd> を返し、実処理はキューに積んで非同期で行うのが定石です。「受信（速く 200）」と「処理（後で確実に）」を分けるのがポイントです。
      </Callout>

      <Callout variant="warn" title="配信順序は保証されない">
        リトライや並行配信により、<strong>イベントが発生順に届くとは限りません</strong>。「更新」の後に「作成」が届くこともあります。順序に依存せず、各イベントを単独で正しく処理できるよう設計するか、必要ならペイロード内のタイムスタンプ／バージョンで古い通知を無視します。</Callout>

      <Section>受信エンドポイントの実装例</Section>
      <p>Node.js（Express）で Stripe の Webhook を受ける最小例です。署名検証・冪等性・即時応答を押さえています。</p>

      <Code lang="javascript" filename="webhook.js">{`import express from "express";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET);
const seen = new Set(); // 実運用は DB / Redis で永続化

app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }), // 生ボディを保持
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      // 署名検証（失敗すれば例外）
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch {
      return res.status(400).send("invalid signature");
    }

    // 冪等性: 同じイベント ID は一度だけ処理
    if (seen.has(event.id)) return res.status(200).send("dup");
    seen.add(event.id);

    // 先に 200 を返し、重い処理はキューへ
    enqueue(event);
    res.status(200).send("ok");
  }
);`}</Code>

      <Section>代表例</Section>
      <ul>
        <li><strong>Stripe</strong> — 決済完了・返金・サブスク更新などを Webhook で通知。<Cmd>Stripe-Signature</Cmd> で検証。</li>
        <li><strong>GitHub</strong> — push / PR / issue などのイベントを送信。<Cmd>X-Hub-Signature-256</Cmd> ヘッダに HMAC-SHA256。</li>
        <li><strong>Slack / Discord</strong> — メッセージやスラッシュコマンドを Webhook で受け取り、Bot を動かす。</li>
      </ul>

      <SubSection>受信側の実装チェックリスト</SubSection>
      <KVList
        items={[
          { key: "署名検証", val: "生ボディ ＋ 共有シークレットで HMAC を照合。失敗は 400 で拒否" },
          { key: "冪等性", val: "イベント ID を記録し、二重処理を防ぐ（再送は前提）" },
          { key: "即時応答", val: "検証だけして先に 200。重い処理はキューへ" },
          { key: "順序非依存", val: "到着順に頼らない。必要ならタイムスタンプで新旧判定" },
          { key: "ローカル検証", val: "開発時は ngrok や webhook.site でトンネル／中身を確認" },
        ]}
      />
      <TipBox>
        ローカル開発では、公開 URL が無いと Webhook を受け取れません。<Cmd>ngrok</Cmd> でローカルサーバをトンネル公開するか、多くのサービスが提供する「テストイベント送信」ボタンで動作確認するのが定番です。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "Webhook は「イベント発生時に相手からあなたの URL へ POST」する push 型連携",
          "公開エンドポイントなので署名検証（HMAC）は必須。生ボディで検証する",
          "リトライで同じ通知が複数回届く前提。イベント ID で冪等に処理する",
          "受信後はまず 200 を返し、重い処理は非同期（キュー）に回す",
        ]}
      />
    </>
  );
}

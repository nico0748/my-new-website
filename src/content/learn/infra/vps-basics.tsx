import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Cmd, Steps, Step, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "vps-basics",
  title: "VPS の基礎 — 素のサーバーを1台持つ",
  description: "PaaS と違い OS がまるごと渡される VPS とは何か。Oracle Cloud Free Tier で Ubuntu サーバーを1台立て、クラウド側ファイアウォール（セキュリティリスト）まで押さえる。",
  domain: "infra",
  section: "cloud",
  order: 1,
  level: "intro",
  tags: ["VPS", "Oracle Cloud", "Ubuntu", "クラウド"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        Docker も CI/CD も、その下では大抵1台の Linux サーバーが動いています。まずは「自分専用のサーバーを1台持ち、SSH で安全に入れる状態にする」ところから始めます。基盤を理解しないと、トラブルのとき手も足も出なくなります。
      </Lead>

      <Section>VPS とは何か — PaaS との違い</Section>
      <p>
        Vercel や Netlify のような <strong>PaaS（Platform as a Service）</strong>は、デプロイ先のサーバーを意識しません。「コードを push すれば動く」世界です。
      </p>
      <p>
        <strong>VPS（Virtual Private Server）</strong>は違います。OS がまるごと1台、あなたに渡されます。何をインストールするか、どうセキュリティを固めるか、すべて自分で決めます。その代わり、自由度は圧倒的です。この教材は「素のサーバーに触れる」ことでインフラの土台を掴むのが狙いなので、あえて VPS を使います。
      </p>

      <Section>なぜ Oracle Cloud Free Tier か</Section>
      <p>
        学習用のサーバーは「コスト0で続けられる」ことが何より大事です。主要プロバイダの無料枠を比べると次のようになります。
      </p>
      <ComparisonTable
        headers={["プロバイダ", "無料枠", "特徴"]}
        rows={[
          ["Oracle Cloud", "E2.1.Micro 1コア 1GB（永久無料）", "x86 で互換性◎。ARM 枠もあるが在庫が枯渇しがち"],
          ["AWS Free Tier", "t2.micro 1コア 1GB（12ヶ月）", "期限切れ後は課金。情報量は多い"],
          ["GCP Free Tier", "e2-micro 0.25コア 1GB（永久無料）", "スペック低め。US リージョンのみ"],
          ["さくら VPS", "月700円〜", "有料だが SLA あり。本番向き"],
        ]}
      />
      <Callout variant="info" title="学習と本番で選び分ける">
        この教材では「コスト0で学べる」ことを重視し Oracle Cloud を選びます。実際の本番サービスには、SLA のある有料 VPS（さくら・ConoHa 等）の方が安心です。
      </Callout>

      <Section>Ubuntu インスタンスを作成する</Section>
      <p>
        <Cmd>https://cloud.oracle.com</Cmd> でアカウントを作成し（Free Tier でもカード登録は必要・無料枠を超えなければ課金なし）、ホームリージョンに Tokyo か Osaka を選びます（後から変更不可）。そのうえで「コンピュート → インスタンス → インスタンスの作成」から、次の設定で作ります。
      </p>
      <ComparisonTable
        headers={["項目", "設定値", "補足"]}
        rows={[
          ["OS", "Ubuntu 24.04", "「イメージの変更」から Canonical Ubuntu を選ぶ"],
          ["Shape", "VM.Standard.E2.1.Micro", "x86（AMD）1 OCPU。Always Free 対象"],
          ["メモリ", "1 GB", "Micro は固定"],
          ["パブリック IP", "ON", "外部から SSH/HTTP でアクセスするために必要"],
          ["SSH 鍵", "キー・ペアの自動生成", "秘密鍵を必ずダウンロードする"],
        ]}
      />
      <Figure
        src="/learn/shots/infra/vps-basics-01.svg"
        alt="Oracle Cloud のインスタンス作成画面で、イメージに Ubuntu 24.04、Shape に VM.Standard.E2.1.Micro を選んだ状態"
        caption="インスタンスの作成画面。イメージとシェイプをこの組み合わせにすると Always Free の対象になる。"
      />
      <Callout variant="danger" title="秘密鍵のダウンロードは作成時の1回だけ">
        「キー・ペアの自動生成」を選んだ場合、秘密鍵をダウンロードできるのは作成画面の <strong>1回だけ</strong>です。この画面を閉じると二度と取得できません。安全な場所に保存してください。
      </Callout>
      <Callout variant="tip" title="なぜ Oracle Linux ではなく Ubuntu か">
        デフォルトは RHEL 系の Oracle Linux ですが、この教材は Ubuntu を使います。<Cmd>apt</Cmd> / <Cmd>dpkg</Cmd> のエコシステムが広く Web 上の情報が多いこと、Docker 公式ドキュメントが Ubuntu ベースであることが理由です。
      </Callout>

      <Section>作成後に確認すること</Section>
      <p>インスタンスが「実行中（Running）」になったら、詳細ページで次の3点を確認します。</p>
      <Steps>
        <Step title="Public IP">サーバーの住所。SSH でつなぐときに使うのでメモする。</Step>
        <Step title="Username"><Cmd>ubuntu</Cmd>（Ubuntu イメージのデフォルトユーザー）。</Step>
        <Step title="State"><Cmd>Running</Cmd> であること。</Step>
      </Steps>
      <Figure
        src="/learn/shots/infra/vps-basics-02.svg"
        alt="作成後のインスタンス詳細ページで Public IP・Username・State が表示されている画面"
        caption="インスタンス詳細ページ。この3点（Public IP / Username / State）が次の SSH ログインで必要になる。"
      />

      <Section>クラウド側ファイアウォール — セキュリティリスト</Section>
      <p>
        Oracle Cloud には <strong>セキュリティリスト</strong>という「クラウドレベルのファイアウォール」があります。デフォルトでは SSH（ポート22）だけが許可されています。「ネットワーキング → 仮想クラウド・ネットワーク → サブネット → セキュリティリスト」を開き、受信ルール（Ingress）に <Cmd>0.0.0.0/0 : TCP / 22</Cmd> があることを確認します。HTTP(80) / HTTPS(443) は後で追加します。
      </p>
      <Figure
        src="/learn/shots/infra/vps-basics-03.svg"
        alt="セキュリティリストの受信ルール一覧に 0.0.0.0/0 TCP 22 の行が表示されている画面"
        caption="セキュリティリストの受信ルール。初期状態では SSH（22）だけが全世界から許可されている。"
      />
      <Callout variant="info" title="0.0.0.0/0 とは？（CIDR 表記）">
        <Cmd>0.0.0.0/0</Cmd> は「すべての IP アドレス＝全世界」を意味します。<Cmd>/0</Cmd> は CIDR というネットワーク範囲の書き方で、範囲制限なしを表します。特定の IP だけに絞るなら <Cmd>203.0.113.50/32</Cmd>（1つの IP）のように書きます。この <Cmd>/32</Cmd> は後の章で「自分の IP だけ許可する」ときに何度も使います。
      </Callout>

      <Divider />

      <p>
        これでインフラ全体の地図を1枚持っておきましょう。この VPS の上に、最終的には複数のコンテナ（nginx・アプリ・DB・キャッシュ）が載り、自動デプロイまで組み上がります。
      </p>
      <Figure
        src="/learn/infra/course-architecture.svg"
        alt="1台の VPS の上に nginx・アプリ・PostgreSQL・Redis が載り、GitHub Actions から自動デプロイされる最終構成図"
        caption="最終的に目指す姿。今はまだ『素のサーバー1台』だが、ここから育てていく。"
      />

      <KeyPoints
        items={[
          "VPS は OS がまるごと渡される。自由度が高い代わりに、設定もセキュリティも自分の責任",
          "学習は Oracle Cloud Free Tier（永久無料・x86）が手軽。本番は SLA のある有料 VPS",
          "作成後は Public IP / Username(ubuntu) / State(Running) を確認する",
          "セキュリティリストはクラウド側 FW。まず SSH(22) のみ許可されている",
          "0.0.0.0/0 は全世界、/32 は単一 IP。CIDR の読み方を掴んでおく",
        ]}
      />
    </>
  );
}

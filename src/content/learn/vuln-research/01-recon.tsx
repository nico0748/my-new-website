import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, Steps, Step, KeyPoints, TipBox, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "recon",
  title: "偵察・情報収集 — 許可範囲での攻撃面マッピング",
  description: "RoE（スコープ・禁止事項）を確定し、非破壊の偵察で攻撃面の地図を作る。ヒアリング・フィンガープリント・クロール・エンドポイント列挙・プロキシ設置まで、WSTG-INFO に沿って安全に情報を集める。",
  domain: "vuln-research",
  section: "recon",
  order: 2,
  level: "practice",
  tags: ["偵察", "RoE", "スコープ", "WSTG", "情報収集"],
  updated: "2026-07-25",
  minutes: 18,
};

export default function Article() {
  return (
    <>
      <Lead>
        偵察は「敵地に入る」ことではなく、<strong>許可された範囲の地図を作る</strong>作業です。まず RoE（Rules of Engagement）でスコープと禁止事項を確定し、次に<strong>非破壊</strong>の手順で画面・API・認証境界を洗い出します。ここで作る「攻撃面マップ」が、以降の調査の網羅性を決めます。
      </Lead>

      <Section>E0 — スコープと許可を確定する（RoE）</Section>
      <p>
        調査に入る前に、<strong>何を・どこまで・いつ・どうやって</strong>調べてよいかを書面で合意します。これが <strong>RoE（Rules of Engagement）</strong>です。RoE にクライアントの<strong>書面承認</strong>が無ければ、偵察も含めて一切開始しません。
      </p>
      <ComparisonTable
        headers={["RoE の項目", "確定する内容"]}
        rows={[
          ["イン・スコープ", "URL / FQDN / IP レンジ / API（OpenAPI・Swagger）/ 対象画面・機能"],
          ["認証境界・アカウント", "未認証/一般/管理/テナント別の境界。ロール別アカウントを最低2セット"],
          ["アウト・オブ・スコープ", "決済本番系・外部連携先・記載外サブドメイン 等（触れない対象）"],
          ["禁止行為", "DoS・大量負荷・ソーシャルエンジニアリング・物理侵入・本番データ破壊"],
          ["実施条件", "検証時間帯・診断元 IP の許可リスト登録・WAF/IPS 除外申請・緊急停止条件"],
          ["データ取扱い", "証跡の機微情報マスキング方針・NDA"],
        ]}
      />
      <Callout variant="danger" title="完了条件 — ここが無ければ次へ進まない">
        RoE と対象範囲に<strong>クライアントの書面承認</strong>があること。承認前に「ちょっと見るだけ」も禁止です。個人リサーチなら、対象が<strong>バグバウンティ等のスコープ内</strong>であること、禁止事項（自動スキャン禁止・特定パスの除外など）を読み切っていることが前提です。
      </Callout>

      <Section>E1 — 情報収集の入口：ヒアリング</Section>
      <p>
        いきなり触る前に、分かっていることを聞き出します。「聞いた構成」と「実機の挙動」の<strong>食い違いが脆弱性の温床</strong>になるため、後で突き合わせる材料を作る意味があります。
      </p>
      <KVList
        items={[
          { key: "技術スタック", val: "言語・フレームワーク・Web サーバ・DB・クラウド・WAF の有無" },
          { key: "認証方式", val: "Cookie セッション / JWT / OAuth / SAML / MFA のどれを使うか" },
          { key: "想定脅威・重要資産", val: "守りたいデータ・機能（決済・個人情報・管理機能など）" },
          { key: "過去の指摘", val: "以前の診断結果・既知の弱点・対応済み/未対応の状況" },
        ]}
      />

      <Section>攻撃面マッピング — 非破壊で「地図」を作る</Section>
      <p>
        WSTG の情報収集（WSTG-INFO）に沿って、<strong>壊さず・変更せず</strong>に構成を把握します。ここではまだ「攻撃」しません。<strong>見る・数える・並べる</strong>だけです。
      </p>
      <Steps>
        <Step title="フィンガープリント（構成の推定）">
          HTTP レスポンスヘッダ（<Cmd>Server</Cmd> / <Cmd>X-Powered-By</Cmd> 等）、エラー画面、HTML/JS のコメント、<Cmd>robots.txt</Cmd> や <Cmd>sitemap.xml</Cmd> から技術構成の手がかりを集める。
        </Step>
        <Step title="クロールしてエンドポイントを列挙">
          サイトを巡回してページ・フォーム・パラメータを洗い出す。<strong>認証の前と後の両方</strong>でサイトマップを取り、見える範囲の違いを把握する。
        </Step>
        <Step title="隠れた API を JS から抽出">
          フロントの JavaScript を読み、画面からは辿れない API エンドポイントやパラメータを見つける（SPA では特に重要）。
        </Step>
        <Step title="プロキシを設置して通信を観察">
          Burp Suite / OWASP ZAP をブラウザとサーバの間に挟み、リクエスト/レスポンスを記録・観察できる状態にする。
        </Step>
      </Steps>

      <SubSection>非破壊の確認コマンド例</SubSection>
      <p>
        まずは通信を「見る」ところから。以下は<strong>許可された対象に対して</strong>、構成を確認する無害な例です。
      </p>
      <Code lang="bash" filename="ヘッダと構成の確認（許可対象のみ）">{`# レスポンスヘッダだけを見る（本文は取得しない）
curl -sI https://target.example.com/

# robots.txt / sitemap を確認（公開情報）
curl -s https://target.example.com/robots.txt

# 提示された OpenAPI からエンドポイント一覧を把握
curl -s https://target.example.com/openapi.json | jq '.paths | keys'`}</Code>
      <Callout variant="warn" title="偵察でも「やりすぎ」は禁物">
        ディレクトリ総当たり・自動スキャナの全力実行・大量リクエストは、<strong>負荷（業務妨害）</strong>や<strong>スコープ逸脱</strong>につながります。RoE で許可された手段・時間帯・レートの範囲で行い、自動ツールは<strong>対象と強度を絞って</strong>使います。
      </Callout>

      <Section>プロキシツール — 観察と記録の土台</Section>
      <ComparisonTable
        headers={["ツール", "役割", "使いどころ"]}
        rows={[
          ["Burp Suite", "プロキシ / リピータ / スキャナ（Pro）", "手動調査の中心。リクエストの改変と再送、履歴の整理"],
          ["OWASP ZAP", "プロキシ / スキャナ（OSS）", "無償で始められる。自動スキャンと手動の併用"],
          ["ブラウザ DevTools", "通信・ストレージの確認", "Cookie / トークン / ネットワークの一次観察"],
        ]}
      />
      <TipBox>
        偵察の成果物は「攻撃面の一覧」です。<strong>画面・フォーム・API・パラメータ・認証境界</strong>を表にして、次章の調査チェックリストに落とし込みます。「どこを調べるべきか」が漏れなく見える状態になっていれば、この章は完了です。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "偵察の前に RoE でスコープ・禁止行為・実施条件を書面確定する（承認前は着手しない）",
          "ヒアリングで技術スタック・認証方式・重要資産・過去指摘を把握する",
          "WSTG-INFO に沿い、非破壊でフィンガープリント→クロール→API 抽出→プロキシ設置",
          "認証の前後でサイトマップを取り、見える範囲の差を掴む。JS から隠れ API を探す",
          "偵察でも大量リクエスト・総当たりは負荷/逸脱になる。攻撃面マップを作ったら完了",
        ]}
      />

      <Callout variant="info" title="次章">
        次章「Web 脆弱性の調査」で、作った攻撃面マップに沿って WSTG カテゴリ別に、無害な検証で脆弱性の有無を確かめます。
      </Callout>
    </>
  );
}

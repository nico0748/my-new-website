import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, ComparisonTable, KeyPoints, Bridge, TipBox, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "web-vuln-hunt",
  title: "Web 脆弱性の調査 — WSTG カテゴリ別に網羅する",
  description: "攻撃面マップに沿って、認証・セッション・認可・注入・偽造・ビジネスロジック・設定不備を WSTG のカテゴリで網羅的に調べる。破壊的ペイロードを使わず、無害な検証で「脆弱性の有無」を確かめる進め方。",
  domain: "vuln-research",
  section: "web-vuln-hunt",
  order: 1,
  level: "practice",
  tags: ["WSTG", "OWASP", "脆弱性調査", "認可", "注入"],
  updated: "2026-07-25",
  minutes: 22,
};

export default function Article() {
  return (
    <>
      <Lead>
        調査は「思いつきで叩く」のではなく、<strong>WSTG（Web Security Testing Guide）のカテゴリを一つずつ潰す</strong>ことで網羅性を担保します。この章では代表カテゴリの<strong>着眼点</strong>と、<strong>壊さずに有無を確かめる</strong>検証の考え方を扱います。攻撃コードの写経ではなく、「なぜそこが危ないか」「どう安全に確認するか」に軸を置きます。
      </Lead>

      <Callout variant="danger" title="この章の前提">
        以降はすべて<strong>許可された対象</strong>に対してのみ行います。検出は<strong>無害な検証文字列（マーカー）</strong>で確認し、データ破壊・DoS・他人の情報の持ち出しにつながる操作は行いません。
      </Callout>

      <Section>調査の進め方 — チェックリストで潰す</Section>
      <p>
        偵察で作った攻撃面マップを、WSTG のカテゴリに対応づけたチェックリストに落とし込み、各項目を「検証済み（検出<strong>有</strong> / 検出<strong>無</strong>）」で埋めていきます。全項目が埋まって初めて「網羅した」と言えます。
      </p>
      <ComparisonTable
        headers={["カテゴリ", "WSTG 系統", "着眼点"]}
        rows={[
          ["認証", "WSTG-ATHN", "パスワードポリシー・ログイン試行制限・アカウントロック・パスワードリセットの導線"],
          ["セッション管理", "WSTG-SESS", "セッション ID の再発行・ログアウト・有効期限・Cookie 属性（HttpOnly/Secure/SameSite）"],
          ["認可", "WSTG-ATHZ", "IDOR（他人の ID でアクセス）・権限昇格・テナント越境・強制ブラウジング"],
          ["注入", "WSTG-INPV", "SQLi・XSS・OS コマンド・SSTI・XXE（入力が命令として解釈されないか）"],
          ["偽造", "—", "CSRF（意図しない操作）・SSRF（サーバを踏み台に内部へ）"],
          ["ビジネスロジック", "WSTG-BUSL", "価格改ざん・ステップスキップ・レースコンディション"],
          ["ファイル入出力", "—", "パストラバーサル・アップロードの検証不備"],
          ["設定・情報漏えい", "WSTG-CONF", "エラー詳細の露出・不要な機能・デフォルト設定・機密ファイルの公開"],
        ]}
      />

      <Section>認可の調査 — 実務で最も刺さる（IDOR）</Section>
      <p>
        認可の不備は、特別なペイロードが要らず<strong>「ID を差し替えるだけ」</strong>で他人のデータに届いてしまうため、実務で頻出かつ影響が大きい領域です。ここは丁寧に扱います。
      </p>
      <SubSection>IDOR の安全な確認手順</SubSection>
      <p>
        RoE で確保した<strong>ロール別2アカウント</strong>（例: ユーザー A とユーザー B）を使い、「A のトークンで B の資源にアクセスできるか」を確かめます。<strong>自分が用意した2アカウント間</strong>なので、他人の情報には触れません。
      </p>
      <Code lang="http" filename="A の資源（正常）">{`GET /api/orders/1001 HTTP/1.1
Host: target.example.com
Authorization: Bearer <ユーザーA のトークン>
# → 200 で A 自身の注文が返る（正常）`}</Code>
      <Code lang="http" filename="ID を B の資源に差し替えて確認">{`GET /api/orders/1002 HTTP/1.1
Host: target.example.com
Authorization: Bearer <ユーザーA のトークン>
# → 期待: 403/404（他人の注文なので拒否）
# → 200 で B の注文が返ったら IDOR（認可不備）の疑い`}</Code>
      <Callout variant="tip" title="無害に、最小限で確認する">
        確認は<strong>「拒否されるべきものが拒否されるか」</strong>を見るだけ。実際に他人の大量データを引き出したり保存したりせず、<strong>1件・レスポンスの有無</strong>で判断します。検証で得た他人の情報は記録・持ち出ししません。
      </Callout>

      <Section>注入の調査 — マーカーで「解釈されるか」を見る</Section>
      <p>
        注入系（XSS・SQLi・SSTI 等）は、<strong>入力がデータではなく命令として解釈されてしまう</strong>のが本質です。確認は「破壊」ではなく「<strong>入力が特別な意味を持って処理されたか</strong>」を無害なマーカーで観察します。
      </p>
      <KVListLike />
      <Callout variant="warn" title="破壊的ペイロードは使わない">
        テーブル削除・全件更新・外部への大量送信・サーバ内部への実アクセスなど、<strong>実害や負荷を伴う検証は行いません</strong>。「解釈された兆候」まで確認したら十分で、影響の実証は最小の PoC（次章）で安全に示します。
      </Callout>

      <Section>偽造・設定不備の着眼</Section>
      <ComparisonTable
        headers={["脆弱性", "何を確かめるか", "無害な確認の考え方"]}
        rows={[
          ["CSRF", "重要操作に CSRF トークン等の対策があるか", "トークン無しのリクエストが受理されるかを自分のアカウントで確認"],
          ["SSRF", "サーバに URL を取りに行かせる入力があるか", "自分が管理する受信用エンドポイントへの到達可否で確認（内部資源は狙わない）"],
          ["セキュリティヘッダ", "CSP / HSTS / X-Content-Type-Options 等の有無", "レスポンスヘッダを見るだけ（非破壊）"],
          ["情報漏えい", "スタックトレース・デバッグ情報・.git 等の露出", "エラー画面や既知パスの応答を見るだけ"],
        ]}
      />

      <Bridge course="セキュリティ基礎 / OWASP Top 10・WSTG">
        ここで扱う各脆弱性の<strong>仕組み</strong>は「セキュリティ基礎」コースで詳説しています（XSS・CSRF・SQLi・SSRF・IDOR など）。本コースはその知識を<strong>「許可された対象で、網羅的に、無害に確かめる」</strong>という<strong>調査の運用</strong>に落とし込む位置づけです。仕組みが曖昧な項目は基礎コースに戻って確認してください。
      </Bridge>

      <TipBox>
        この章の完了条件は「チェックリストの全カテゴリが検証済みになっている」こと。検出した候補は次章で<strong>裏取り（FP 排除）→ 最小 PoC → CVSS 採点</strong>へ進めます。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "WSTG のカテゴリでチェックリストを作り、全項目を『検証済み(有/無)』で埋めて網羅する",
          "認可(IDOR)はロール別2アカウントで『拒否されるべきが拒否されるか』を最小確認",
          "注入は無害なマーカーで『入力が命令として解釈された兆候』だけを観察する",
          "破壊的ペイロード・DoS・他人データの持ち出しは行わない（実害の実証は最小 PoC で）",
          "各脆弱性の仕組みはセキュリティ基礎コース参照。本章は『網羅的・無害な調査運用』",
        ]}
      />

      <Callout variant="info" title="次章">
        次章「PoC 検証とトリアージ」で、検出候補から誤検知を排除し、最小限の PoC・CVSS 採点・指摘個票へまとめます。
      </Callout>
    </>
  );
}

/* 注入マーカーの説明（本文から分離して読みやすく） */
function KVListLike() {
  return (
    <ComparisonTable
      headers={["注入タイプ", "確認したい『解釈された兆候』", "考え方"]}
      rows={[
        ["反射/格納 XSS", "入力した文字列が HTML/JS として実行される文脈に出るか", "無害なマーカー文字列が『エスケープされずにそのまま』出力されるかを見る"],
        ["SQL インジェクション", "入力で SQL の構造が変わる兆候（挙動・エラーの差）", "真/偽で結果が変わるかなど、データを壊さない範囲の差分で判断"],
        ["SSTI（テンプレート注入）", "入力がサーバ側テンプレートとして評価されるか", "評価されると値が変わる無害な式で兆候だけ確認"],
      ]}
    />
  );
}

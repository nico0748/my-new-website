import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, ComparisonTable, KeyPoints, KVList, TipBox, Bridge, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "rendering-patterns",
  title: "SPA / SSR / CSR / SSG / ISR とは",
  description: "Web の代表的な 5 つのレンダリング手法の違いを、動作イメージ・特徴・比較表で整理し、選び方を掴む。",
  domain: "web",
  section: "frontend",
  order: 4,
  level: "basic",
  tags: ["レンダリング", "SPA", "SSR", "Next.js"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        「レンダリング」とは、サーバーやブラウザが <strong>HTML を生成して画面に表示するまでの処理</strong>のこと。
        どこで・いつ HTML を作るかによって、初回表示の速さ・SEO・サーバー負荷が大きく変わります。
        代表的な 5 方式を押さえれば、フレームワーク選定の軸が見えてきます。
      </Lead>

      <Section>5 つの方式の動作イメージ</Section>
      <p>
        まずはそれぞれが「どこで HTML を作るのか」を掴みましょう。ポイントは、生成のタイミングが
        <strong>ブラウザ内 / リクエスト毎 / ビルド時</strong>のどれかという点です。
      </p>
      <ul>
        <li><strong>SPA（Single Page Application）</strong> — 最小の HTML/CSS/JS を最初に取得し、以降の画面切替は JavaScript が動的に行う。ページ遷移が高速でサーバー負荷も小さい反面、SEO には工夫が要ります。管理画面や SNS・チャットに向きます。</li>
        <li><strong>SSR（Server Side Rendering）</strong> — リクエストが来るたびにサーバーで HTML を生成して返す。初回表示が速く SEO に強い一方、サーバー負荷は高め。ニュースサイトや EC に向きます。</li>
        <li><strong>CSR（Client Side Rendering）</strong> — 最小の HTML＋ブラウザ上の JS で画面を組み立てる。サーバー負荷は小さく実装もシンプルですが初回表示は遅め。社内ツールやログイン後の画面に向きます。</li>
        <li><strong>SSG（Static Site Generation）</strong> — ビルド時に全ページを静的な HTML として生成しておく。CDN 配信で非常に高速・サーバー負荷ほぼゼロですが、更新のたびにビルドが必要。ブログ・ドキュメント・LP に向きます。</li>
        <li><strong>ISR（Incremental Static Regeneration）</strong> — SSG をベースに、一定期間ごとにページを再生成する。静的の高速さを保ちつつ都度の再ビルドが不要。メディアや更新頻度がそこそこ高いページに向きます。</li>
      </ul>

      <SequenceDiagram
        actors={["ブラウザ", "サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① ページ要求" },
          { from: 1, to: 0, label: "② 完成した HTML を返す (SSR)", cta: true },
          { from: 0, to: 1, label: "③ 追加データを API 取得" },
          { from: 1, to: 0, label: "④ JSON を返す", cta: true },
        ]}
        caption="SSR：サーバーで HTML を生成して返す"
      />

      <Callout variant="info" title="SPA と CSR の関係">
        SPA は「1 ページで動的に切り替えるアプリの形態」、CSR は「ブラウザ側で HTML を組み立てる手法」を指します。
        SPA の多くは CSR で実装されるため混同されがちですが、視点が違う言葉です。
      </Callout>

      <Section>本質は「計算をどこに置くか」</Section>
      <p>
        5 方式は一見バラバラですが、突き詰めると問いは 1 つです — <strong>「HTML を生成する計算を、どのノードで、いつ実行するか」</strong>。
        選択肢は 3 か所（ビルドサーバー / リクエスト時のサーバー / ユーザーのブラウザ）× 2 タイミング（事前 / 都度）に整理できます。
      </p>
      <KVList
        items={[
          { key: "SSG", val: "ビルドサーバー・事前 — デプロイ前に全ページ計算し終える" },
          { key: "ISR", val: "ビルドサーバー・事前＋定期再計算 — 古くなったら裏で作り直す" },
          { key: "SSR", val: "サーバー・都度 — リクエストごとに計算する" },
          { key: "CSR / SPA", val: "ブラウザ・都度 — 計算をクライアントへ丸ごと押し出す" },
        ]}
      />
      <Bridge course="分散システム / 計算をどこで行うか">
        「同じ計算を、サーバーで先にやるか・クライアントに任せるか」は分散システムの中心テーマです。サーバー側でやれば（SSR/SSG）成果物（完成 HTML）は軽く、非力な端末でも速いが、サーバーの CPU と帯域を消費する。
        クライアント側でやれば（CSR）サーバーは JSON を返すだけで安いが、端末の性能に表示速度が左右される。これは講義で習う<strong>計算のオフロードと負荷分散</strong>のトレードオフそのもの。
        エッジ（CDN）で SSR する近年の潮流も、「計算をユーザーに近いノードへ寄せてレイテンシを削る」という分散システムの発想の延長です。
      </Bridge>

      <Section>初回表示は「レイテンシ」の勝負</Section>
      <p>
        なぜ SSG が「非常に速い」のか。理由はネットワークの<strong>レイテンシ（往復遅延）</strong>にあります。ユーザーが最初の画面を見るまでに何回サーバーと往復するか、その距離とデータ量が体感速度を決めます。
      </p>
      <SubSection>CSR は往復が積み重なる</SubSection>
      <p>
        CSR/SPA では、まず HTML の殻を取り、次に大きな JS バンドルを取り、それを実行して初めて API を叩き、返ってきた JSON で描画します。
        「取得 → 実行 → また取得」と<strong>直列の往復</strong>が重なるため、遅い回線・遠いサーバーほど初回が延びます。
      </p>
      <Code lang="text" filename="CSR-timeline">{`ブラウザ ──HTMLの殻──▶ サーバー
ブラウザ ──JSバンドル─▶ サーバー   (大きい・実行も必要)
ブラウザ ──API取得────▶ サーバー   (JSここで初めて発火)
        ← ここでようやく描画`}</Code>
      <p>
        SSG/SSR は、サーバー側で「取得 → 実行 → 描画」を済ませてから<strong>完成 HTML を 1 往復で返す</strong>ため、ユーザーは最初のレスポンスで中身が読めます。
        往復回数（RTT の積み重なり）を減らすことが、初回表示を速くする鍵です。
      </p>
      <Bridge course="コンピュータネットワーク（レイテンシ / RTT）">
        「帯域（bandwidth）は増やせても、レイテンシ（往復遅延・RTT）は光速と距離で下限が決まり、簡単には縮まない」— ネットワーク講義の重要な直観です。
        だからこそ Web 高速化の定石は「往復回数を減らす」「ユーザーに近い場所（CDN/エッジ）に置く」の 2 つ。SSG が速いのは往復が 1 回で済むから、CDN 配信が速いのは物理距離が短くレイテンシが小さいから。
        レンダリング方式の選定は、実は「RTT をどう削るか」というネットワーク最適化の問題です。
      </Bridge>

      <Section>SSG / ISR はキャッシュ理論の応用</Section>
      <p>
        SSG は「結果を事前に計算して保存しておき、リクエスト時は計算せず取り出すだけ」という<strong>キャッシュ（メモ化）</strong>です。ISR はそこに「保存した結果には賞味期限があり、切れたら裏で作り直す」という発想を足したもの。
      </p>
      <KVList
        items={[
          { key: "キャッシュヒット", val: "生成済みの静的 HTML をそのまま返す（SSG の高速さ）" },
          { key: "TTL（有効期限）", val: "ISR の revalidate 秒。切れるまでは古いページを返す" },
          { key: "無効化（invalidation）", val: "内容更新時にキャッシュを作り直す。最難問の1つ" },
          { key: "stale-while-revalidate", val: "古いページを即返しつつ裏で再生成（ISR の挙動）" },
        ]}
      />
      <Bridge course="キャッシュ理論 / OS・計算量（メモ化とトレードオフ）">
        「一度計算した結果を保存して再利用する」メモ化・キャッシュは、動的計画法から CPU キャッシュ、CDN まで貫く普遍的アイデアです。SSG はビルド時に全入力に対する出力を先に計算しておく完全メモ化、ISR は容量・鮮度のためにキャッシュへ TTL を付けたもの。
        「事前計算は初回を速くするが、鮮度を犠牲にする」「キャッシュ無効化は難しい（Phil Karlton の名言）」といった座学の教訓が、そのまま ISR の revalidate 設計の悩みどころになります。
        初回表示の速さ（レスポンス時間）と最新性・計算コストのトレードオフを比較衡量する — これは計算量とシステム設計の実地演習です。
      </Bridge>
      <TipBox>
        方式選定は「速さ・鮮度・コスト」の三すくみです。どれか 1 つを最大化すると別が犠牲になる。「万能の方式はなく、要件で選ぶ」という結論自体が、分散システム設計の典型的な帰結です。
      </TipBox>

      <Section>特徴を比較する</Section>
      <p>初回表示・遷移速度・SEO・サーバー負荷という観点で並べると、それぞれのトレードオフが一目で分かります。</p>

      <ComparisonTable
        headers={["観点", "SPA", "SSR", "CSR", "SSG", "ISR"]}
        rows={[
          ["レンダリング場所", "ブラウザ", "サーバー", "ブラウザ", "ビルド時", "ビルド時＋再生成"],
          ["初回表示", "遅い", "速い", "遅い", "非常に速い", "非常に速い"],
          ["遷移速度", "非常に速い", "通常", "通常", "速い", "速い"],
          ["SEO", "弱い", "強い", "弱い", "非常に強い", "強い"],
          ["サーバー負荷", "低", "高", "低", "ほぼゼロ", "低"],
        ]}
      />

      <Callout variant="tip" title="代表的なフレームワーク">
        SPA / CSR は React・Vue・Angular。SSR / SSG / ISR は Next.js・Nuxt.js・Gatsby・Remix。
        Next.js のように 1 つのフレームワークでページごとに方式を使い分けられるものが主流です。
      </Callout>

      <Section>選び方の指針</Section>
      <p>
        「集客したい公開ページ」なら SEO と初回表示が効く SSR / SSG / ISR、「ログイン後の操作性重視の画面」なら遷移の速い SPA、という切り分けが基本です。
        更新頻度が高いメディアは ISR、ほぼ更新のない LP やドキュメントは SSG、というように<strong>コンテンツの更新頻度</strong>も判断材料になります。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "レンダリングは「どこで・いつ HTML を作るか」で分類される",
          "SPA/CSR=ブラウザ生成、SSR=リクエスト毎、SSG=ビルド時、ISR=SSG＋定期再生成",
          "初回表示と SEO は SSR/SSG/ISR が強く、遷移速度は SPA が強い",
          "更新頻度と SEO 要否で方式を選ぶ。Next.js ならページ単位で使い分け可能",
        ]}
      />
    </>
  );
}

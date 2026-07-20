import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "kev-epss-ghsa",
  title: "悪用状況を測る — KEV・EPSS・GHSA",
  description: "深刻度だけでは優先順位はつかない。実際に悪用されたか（KEV）、悪用される確率（EPSS）、OSS 向けの配布形式（GHSA）を押さえ、トリアージの定石を身につける。",
  domain: "security",
  section: "sec-basics",
  order: 5,
  level: "basic",
  tags: ["KEV", "EPSS", "GHSA", "トリアージ"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        前章で「CVSS の深刻度は優先度ではない」と学びました。では、何を見て「今すぐ直すべきか」を決めればいいのでしょうか。答えは<strong>悪用の状況</strong>です。実際に悪用されたか（KEV）、これから悪用されそうか（EPSS）、そして OSS の脆弱性をどう受け取るか（GHSA）——この三つで、深刻度スコアを実務の優先順位へ翻訳します。
      </Lead>

      <Section>KEV — 実際に悪用が確認された脆弱性</Section>
      <p>
        <strong>KEV（Known Exploited Vulnerabilities Catalog）</strong>は、米国 CISA が管理する「実環境での悪用が確認された CVE」のカタログです。「理論上どれだけ危険か（CVSS）」ではなく「<strong>実際に攻撃に使われたか</strong>」という事実に基づくため、修正の優先順位づけで極めて実務的な指標になります。
      </p>
      <p>
        KEV は 2021 年の指令 <Cmd>BOD 22-01</Cmd> で創設され、米連邦民間機関（FCEB）に対して期限内の是正を義務づける拘束力を持ちます。CVE が KEV に掲載される条件は、次の三つすべてを満たすことです。
      </p>
      <KVList
        items={[
          { key: "① CVE ID がある", val: "識別子が割り当て済みであること" },
          { key: "② 明確な是正策がある", val: "ベンダーパッチや回避策など、取るべきアクションが示せること" },
          { key: "③ 実悪用の信頼できる証拠がある", val: "許可なく攻撃者が悪意あるコードを実行した、という信頼できる証拠があること" },
        ]}
      />
      <Figure src="/learn/shots/security/kev-epss-ghsa-01.svg" alt="CISA の KEV カタログ公開ページで、CVE ID・製品名・追加日・是正期限が一覧表示されているスクリーンショット" caption="KEV カタログの実物。是正期限まで明記されているのが特徴" />
      <Callout variant="warn" title="PoC 公開やスキャン試行だけでは載らない">
        「active exploitation（活発な悪用）」とは、システム所有者の許可なく攻撃者が悪意あるコードを実行した証拠がある状態を指します。実証コード（PoC）が公開されただけ、攻撃らしいスキャンが観測されただけでは掲載されません。KEV は「実際に悪用された」という重い事実だけを集めた、ハードルの高いカタログなのです。
      </Callout>

      <Section>EPSS — 悪用される確率の予測</Section>
      <p>
        KEV が「すでに悪用された」という<strong>過去の事実</strong>を示すのに対し、<strong>EPSS（Exploit Prediction Scoring System）</strong>は、その脆弱性が「今後 30 日以内に悪用される確率」を <Cmd>0〜1</Cmd> で予測する<strong>未来の見込み</strong>のモデルです。こちらも FIRST が運営しています。まだ悪用されていないが危なそうなものを早めに拾う、というのが EPSS の役割です。
      </p>
      <ComparisonTable
        headers={["指標", "何を表すか", "時制"]}
        rows={[
          [<Cmd>CVSS</Cmd>, "潜在的な深刻度", "固有・不変"],
          [<Cmd>KEV</Cmd>, "実際に悪用された事実", "過去（確定）"],
          [<Cmd>EPSS</Cmd>, "悪用される確率の予測", "未来（見込み）"],
        ]}
      />

      <Section>トリアージの定石</Section>
      <p>
        では、これらをどう組み合わせて優先順位をつけるのでしょうか。実務の定石は明快です。
      </p>
      <StepFlow
        steps={[
          { title: "まず KEV を最優先", desc: "KEV に載っている＝実際に悪用されている。理由を問わず即対応の最上位" },
          { title: "次に EPSS の高いもの", desc: "まだ悪用確認はないが、悪用確率が高いものを早めに拾う" },
          { title: "そして CVSS Critical", desc: "深刻度が高いものを見る。悪用の兆候と併せて判断する" },
          { title: "自環境の重要度で最終調整", desc: "その脆弱性が自分の基幹資産に刺さるかで最終的な順位を決める" },
        ]}
        caption="トリアージの定石。深刻度スコア単独ではなく『実悪用 → 悪用予測 → 深刻度 → 自環境』の順で優先度を決める。"
      />
      <Callout variant="tip" title="KEV に無い = 安全、ではない">
        KEV は網羅的ではありません。CISA が確認・公表したものだけが載るため、「KEV に無い＝悪用されていない」とは限りません。だからこそ EPSS や CVSS を併用し、多角的に見ます。また、何年も前の古い CVE が新たに悪用確認されて KEV に追加されることもあるので、番号の西暦に惑わされないようにします。
      </Callout>

      <Section>GHSA — OSS エコシステムの配布形式</Section>
      <p>
        ここまでは主に一般の脆弱性管理の話でした。<strong>GHSA（GitHub Security Advisory）</strong>は、その中でも OSS の依存パッケージに特化した仕組みです。GitHub が運営する脆弱性アドバイザリで、<Cmd>GHSA-xxxx-xxxx-xxxx</Cmd> という独自 ID を持ちます。
      </p>
      <p>
        GHSA の中身は、Google 主導の OSS 脆弱性共通スキーマ <strong>OSV フォーマット</strong>の JSON です。影響を受けるパッケージ名・脆弱なバージョン範囲・エコシステム（npm/PyPI/Maven など）まで構造化されているのが特徴で、この構造化データが、<strong>Dependabot や SCA ツールが「あなたの依存に既知の脆弱性がある」と警告できる根拠</strong>になっています。
      </p>
      <KVList
        items={[
          { key: "CVE との関係", val: "GHSA は CVE をエイリアスとして保持できる。重複排除は cve_id で突合する" },
          { key: "採番ルート", val: "GitHub 自身も CNA なので、GHSA から CVE を採番できる" },
          { key: "修正バージョンの精度", val: "『どのバージョンで導入され、どこで直ったか』のレンジ表現が CVE/NVD より実用的" },
          { key: "CVE 無し GHSA", val: "CVE が振られる前・振られない OSS 脆弱性でも GHSA だけ存在することがある" },
        ]}
      />
      <SubSection>個人のバグハンターにとっての意味</SubSection>
      <p>
        GitHub 上の OSS を対象にする場合、GHSA は<strong>最も摩擦の少ない報告・採番ルート</strong>になります。リポジトリ管理者がリポジトリ単位でアドバイザリを起票し、そこから CVE を取得できるため、発見から報告・採番までを GitHub 上で完結できるのです。CVE を取りたい個人のリサーチャーにとって、GHSA は重要な入口です。
      </p>

      <Bridge course="情報セキュリティ / 意思決定・優先順位づけ">
        KEV・EPSS・CVSS の使い分けは、<strong>確定情報・確率予測・潜在リスクを層別に扱う意思決定</strong>の実例です。KEV は「起きた事実」（後ろ向きの確実な情報）、EPSS は「起きる確率」（前向きの予測モデル）、CVSS は「起きたら最悪どうなるか」（潜在的影響度）。これはリスク管理で習う<strong>発生確率 × 影響度</strong>を、事実・予測・影響という三つの軸に分解して扱う考え方そのものです。限られた工数をどこに投じるかを、感覚ではなくデータで並べ替える——それが現代の脆弱性トリアージです。
      </Bridge>

      <Quiz
        question={
          <>
            二つの脆弱性があります。A は CVSS 9.8 だが悪用の報告はなし。B は CVSS 7.5 だが KEV に掲載されています（実際に悪用されている）。トリアージの定石ではどちらを先に対応すべきでしょうか。
          </>
        }
        options={[
          "A（CVSS が高いから）",
          "B（KEV に載っている＝実際に悪用されているから最優先）",
          "スコアが同じになるまで両方放置する",
          "どちらでもよい（CVSS だけで決まる）",
        ]}
        answer={1}
        explanation={
          <>
            定石は「まず KEV を最優先」です。B は実際に悪用されている確定情報があるため、CVSS が A より低くても先に対応します。深刻度スコア（潜在的な最悪ケース）よりも、実悪用の事実（KEV）が優先度を決める、という点が要点です。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "KEV = 実際に悪用が確認された CVE のカタログ（CISA 運営、実悪用の事実に基づく）",
          "PoC 公開やスキャン試行だけでは KEV に載らない（掲載条件は三つ）",
          "EPSS = 今後 30 日以内に悪用される確率の予測（未来の見込み）",
          "トリアージの定石: KEV 最優先 → EPSS/CVSS → 自環境の重要度",
          "GHSA = OSS 向けの構造化アドバイザリ。Dependabot/SCA の警告根拠、個人の採番ルート",
        ]}
      />
    </>
  );
}

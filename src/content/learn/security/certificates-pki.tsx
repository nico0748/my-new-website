import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { FlowChain, SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "certificates-pki",
  title: "デジタル署名と PKI・証明書",
  description: "秘密鍵で署名し公開鍵で検証する仕組みと、「その公開鍵は本物か」を解く PKI・証明書チェーン。証明書検証を省くと中間者攻撃を許す——通信の本人性を支える基盤を理解する。",
  domain: "security",
  section: "crypto",
  order: 4,
  level: "basic",
  tags: ["デジタル署名", "PKI", "証明書", "CA"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        TLS で「接続先が本物か」を検証していると前章で述べました。では、その<strong>本人性</strong>はどうやって証明されるのでしょうか。鍵になるのが<strong>デジタル署名</strong>と、それを社会的に信頼へつなげる <strong>PKI（公開鍵基盤）</strong>です。
      </Lead>

      <Section>デジタル署名 — 秘密鍵で署名し、公開鍵で検証する</Section>
      <p>
        <strong>デジタル署名</strong>は、公開鍵暗号のペアを「暗号化とは逆向き」に使う仕組みです。<strong>秘密鍵で署名し、対になる公開鍵で検証</strong>します。これにより二つのことが同時に保証されます。
      </p>
      <KVList
        items={[
          { key: "認証（誰が作ったか）", val: "その秘密鍵を持つ本人しか作れない署名なので、作成者を特定できる" },
          { key: "完全性（改ざんされていないか）", val: "内容が 1 ビットでも変わると署名検証が失敗し、改ざんを検知できる" },
        ]}
      />
      <SequenceDiagram
        actors={["署名者", "検証者"]}
        messages={[
          { from: 0, to: 0, label: "① メッセージのハッシュを秘密鍵で署名" },
          { from: 0, to: 1, label: "② メッセージ＋署名を送る" },
          { from: 1, to: 1, label: "③ 公開鍵で署名を検証（本人性・改ざんなしを確認）", cta: true },
        ]}
        caption="秘密鍵は本人だけが持つので署名は偽造できない。公開鍵は誰でも持てるので誰でも検証できる。"
      />
      <p>
        暗号化（機密性）とは目的が違う点に注意しましょう。署名は中身を隠すためではなく、<strong>「本物か」を証明する</strong>ためのものです。実際にはメッセージ全体ではなく、その<strong>ハッシュ値</strong>に署名することで高速化します（だからハッシュの衝突耐性が効いてきます）。
      </p>

      <Section>残る問い — 「その公開鍵は本当に本人のものか」</Section>
      <p>
        ここで一つ、根本的な問題が残ります。署名の検証には相手の公開鍵が必要ですが、<strong>その公開鍵が本当に相手本人のものだと、どうやって確かめるのでしょうか。</strong> 攻撃者が「これが example.com の公開鍵です」と偽物を渡してきたら、私たちは偽物で署名を検証してしまい、まんまと騙されます。
      </p>
      <Callout variant="warn" title="公開鍵の「本人性」こそが急所">
        公開鍵暗号は「公開鍵から秘密鍵は割り出せない」ことは保証しますが、「<strong>この公開鍵が誰のものか</strong>」までは保証しません。この結びつきを保証しないと、中間者が偽の公開鍵をすり替えるだけで盗聴・改ざんが可能になります。
      </Callout>

      <Section>PKI と証明書チェーン — 信頼を委譲する</Section>
      <p>
        この「公開鍵と実体の結びつき」を保証するのが <strong>PKI（公開鍵基盤）</strong>です。信頼された<strong>認証局（CA: Certificate Authority）</strong>が、「この公開鍵は確かに example.com のものだ」と<strong>証明書に署名</strong>します。証明書とは「公開鍵＋持ち主の情報＋CA の署名」をまとめたものです。
      </p>
      <p>
        では「その CA は信頼できるのか」——という問いは、上位の CA へと委譲されます。こうして<strong>証明書チェーン</strong>ができあがります。
      </p>
      <FlowChain
        nodes={[
          { label: "ルート CA", sub: "OS/ブラウザが信頼", variant: "cta" },
          { label: "中間 CA", sub: "ルートが署名", variant: "alt" },
          { label: "サーバ証明書", sub: "中間 CA が署名" },
        ]}
        caption="ルート CA → 中間 CA → サーバ証明書。各段が下位に署名し、信頼がルートまで一本の鎖でつながる。"
      />
      <p>
        検証する側（ブラウザ）は、サーバ証明書から順にこの鎖をたどり、最終的に<strong>OS やブラウザにあらかじめ組み込まれた信頼できるルート CA</strong>に到達できれば「本物」と判断します。信頼の起点（トラストアンカー）はルート CA で、そこから下へ署名で信頼が伝わっていく構造です。TLS のサーバ証明書はまさにこの仕組みで動いています。
      </p>
      <Figure src="/learn/shots/security/certificates-pki-01.svg" alt="ブラウザの証明書ビューアで、サーバ証明書から中間 CA、ルート CA へと続く証明書チェーンが表示されているスクリーンショット" caption="ブラウザの証明書ビューア。図で見たチェーンが実際に階層として表示される" />
      <Code lang="bash" filename="terminal">{`# サーバが提示する証明書チェーンを見る
openssl s_client -connect example.com:443 -showcerts
# → サーバ証明書 → 中間CA → （ルートは端末が保持）の順で提示される`}</Code>

      <Section>証明書検証不備と中間者攻撃</Section>
      <p>
        このチェーンの検証を<strong>省くと</strong>何が起きるでしょうか。答えは<strong>中間者攻撃（MITM）</strong>です。攻撃者が通信の間に割り込み、偽の証明書を差し出したとき、クライアントが「証明書を検証しない」「エラーを無視する」実装だと、偽物をそのまま信じてしまいます。
      </p>
      <Figure src="/learn/shots/security/certificates-pki-02.svg" alt="自己署名証明書のサーバへアクセスした際にブラウザが表示する証明書エラー警告画面のスクリーンショット" caption="検証に失敗したときブラウザが出す警告。これを「面倒だから」と無視する実装が証明書検証不備になる" />
      <Callout variant="danger" title="証明書検証を無効化しない">
        開発中に「証明書エラーが面倒だから」と検証を無効化（<Cmd>verify=False</Cmd>・自己署名を無条件許可など）したまま本番に残すのは、典型的な<strong>証明書検証不備</strong>です。これは中間者攻撃を招き、TLS の暗号化そのものを無意味にします。エラーは握りつぶさず、正しく検証してください。
      </Callout>
      <ComparisonTable
        headers={["観点", "正しい検証", "検証不備（危険）"]}
        rows={[
          ["チェーン検証", "ルート CA まで署名を検証", "検証しない・エラーを無視"],
          ["ホスト名照合", "証明書の名前と接続先を照合", "照合しない"],
          ["有効期限", "期限切れ・失効を確認", "無視して接続"],
          ["結果", "中間者を検知できる", "偽証明書を信じ MITM を許す"],
        ]}
      />

      <Bridge course="整数論・代数（署名）/ グラフ理論・信頼モデル">
        デジタル署名の「秘密鍵でしか作れず、公開鍵で誰でも検証できる」性質は、前章と同じく<strong>整数論・代数</strong>の非対称性に根ざしています。一方、PKI の面白さは<strong>信頼をどう構造化するか</strong>という点にあります。証明書チェーンは、信頼の起点（ルート）から末端へ有向に伸びる<strong>木構造・有向グラフ</strong>で、座学のグラフ理論や分散システムの<strong>トラストモデル</strong>そのものです。「一つひとつを直接信頼するのは不可能だから、少数の信頼の起点から委譲でスケールさせる」という発想は、DNS の階層委譲とも通じます。座学の抽象的な「信頼の推移」が、Web を安全に使えるかどうかという現実の基盤になっているのです。
      </Bridge>

      <Quiz
        question={<>PKI（証明書チェーン）が解決している問題は、次のうちどれでしょうか。</>}
        options={[
          "通信を暗号化して盗聴を防ぐこと",
          "パスワードを安全に保存すること",
          "「その公開鍵が本当に相手本人のものか」という本人性を保証すること",
          "通信を高速化すること",
        ]}
        answer={2}
        explanation={
          <>
            公開鍵暗号は「公開鍵から秘密鍵を割り出せない」ことは保証しますが、「<strong>この公開鍵が誰のものか</strong>」は保証しません。PKI は信頼された CA が証明書に署名し、ルート CA までの証明書チェーンを検証することで、この<strong>本人性</strong>を保証します。検証を省くと中間者攻撃を許します。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "デジタル署名は秘密鍵で署名し公開鍵で検証。認証と完全性を同時に保証する",
          "残る問い「その公開鍵は本物か」を解くのが PKI（公開鍵基盤）",
          "CA が証明書に署名し、ルート CA → 中間 CA → サーバ証明書の証明書チェーンで信頼をつなぐ",
          "ブラウザは端末が信頼するルート CA まで鎖をたどれれば本物と判断する",
          "証明書検証を省く・エラーを無視すると中間者攻撃（MITM）を許す",
        ]}
      />
    </>
  );
}

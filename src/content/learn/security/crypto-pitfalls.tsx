import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "crypto-pitfalls",
  title: "暗号の実装ミス",
  description: "暗号の失敗の大半はアルゴリズムではなく使い方にある。弱アルゴリズム・固定 IV・nonce 再利用・非定時間比較・鍵ハードコード——典型的な実装ミスと、CRYPTREC/NIST 推奨に従う姿勢を押さえる。",
  domain: "security",
  section: "crypto",
  order: 6,
  level: "practice",
  tags: ["暗号", "実装ミス", "CRYPTREC", "NIST"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        暗号の失敗は、ほぼすべて<strong>実装の誤り</strong>から生じます。頑丈な金庫（AES）を選んでも、鍵を扉に貼っておいたり、そもそも南京錠（MD5）で代用したりすれば中身は守れません。原則はただ一つ——<strong>「自作しない。正しく選び、正しく使う」</strong>です。
      </Lead>

      <Section>原則 — 暗号を自作しない</Section>
      <p>
        暗号の問題は大きく二系統に分けられます。(1) <strong>古い／弱いアルゴリズムを選んでしまう</strong>、(2) <strong>正しいアルゴリズムでも使い方を間違える</strong>。前者は「南京錠で代用」、後者は「頑丈な金庫の鍵を扉に貼る」に相当します。どちらか一つでも踏めば、暗号の保証はゼロになります。
      </p>
      <FlowChain
        nodes={[
          { label: "正しく選ぶ", sub: "強いアルゴリズム" },
          { label: "正しく使う", sub: "モード・IV・比較", variant: "alt" },
          { label: "自作しない", sub: "検証済みライブラリ", variant: "cta" },
        ]}
        caption="この三点が揃って初めて暗号は安全になる。一つでも欠ければ暗号強度に関係なく破られる。"
      />

      <Section>弱いアルゴリズムを避ける</Section>
      <p>
        まずは「壊れている／用途に対してリスクのある」アルゴリズムを選ばないことです。代表的な NG は次のとおりです。
      </p>
      <KVList
        items={[
          { key: "MD5 / SHA-1", val: "衝突が確立。署名・トークン・整合性検証に使えない" },
          { key: "DES / 3DES", val: "鍵長不足。現代の攻撃に耐えない" },
          { key: "RC4", val: "出力にバイアスがあり解読される" },
          { key: "AES-ECB", val: "同じ平文ブロックが同じ暗号文になり、模様が漏れる" },
          { key: "弱い RSA 鍵長（1024bit）", val: "強度不足。2048bit 以上、または ECC を使う" },
        ]}
      />
      <Callout variant="danger" title="AES-ECB は模様が透ける">
        ECB モードは各ブロックを独立に暗号化するため、<strong>同じ平文ブロックが同じ暗号文ブロック</strong>になります。画像を ECB で暗号化すると元の輪郭がうっすら見えてしまうほどで、パターンが漏れます。対称暗号は認証付き暗号（AEAD）である <strong>AES-GCM</strong> や ChaCha20-Poly1305 を使ってください。
      </Callout>

      <Section>正しいアルゴリズムでも「使い方」で破れる</Section>
      <SubSection>固定 IV・nonce 再利用</SubSection>
      <p>
        AES-GCM のような正しい暗号でも、<strong>IV（初期化ベクトル）や nonce を固定・使い回す</strong>と破綻します。CTR/GCM で nonce を再利用すると、鍵ストリームや認証鍵が露出し、平文が回復されることがあります。<strong>IV/nonce は毎回ランダムに生成し、一度使ったら二度と使わない</strong>のが鉄則です。
      </p>
      <SubSection>非定時間比較（タイミング攻撃）</SubSection>
      <p>
        MAC やトークンを <Cmd>==</Cmd> で比較すると、<strong>一致した先頭バイト数に応じて処理時間が変わる</strong>ことがあります。攻撃者は応答時間の統計差を測り、正解を<strong>1 バイトずつ</strong>当てられます（タイミングサイドチャネル）。秘密の比較には、必ず<strong>定数時間比較</strong>（<Cmd>hmac.compare_digest</Cmd>・<Cmd>hmac.Equal</Cmd>・<Cmd>hash_equals</Cmd>）を使います。
      </p>
      <SubSection>鍵のハードコード</SubSection>
      <p>
        署名鍵や暗号鍵を<strong>コードに直書き</strong>すると、ソース・出荷物・公開イメージ・Git 履歴から誰でも知り得ます。ある OSS は JWT の HS256 鍵を <Cmd>"changeme"</Cmd> のような固定値にしており、攻撃者が任意のクレーム（<Cmd>role: admin</Cmd>）でトークンを正規に署名できました。鍵は<strong>環境変数やシークレットストア（KMS）から注入</strong>し、未設定なら起動を失敗させます（fail-closed）。
      </p>
      <Code lang="python" filename="crypto_do_dont.py">{`# 危険: 高速ハッシュ・非定数時間比較・固定鍵
import hashlib
digest = hashlib.sha256(pw.encode()).hexdigest()   # パスワードに速いハッシュ
if mac == expected:                                # タイミング漏れ
    ...
SECRET_KEY = "changeme"                            # 出荷時固定鍵（全インスタンス共通）

# 安全: 遅い KDF・定数時間比較・外部注入の鍵
import hmac, os, secrets
from argon2 import PasswordHasher
ref = PasswordHasher().hash(pw)                    # 意図的に遅い KDF
if hmac.compare_digest(mac, expected):             # 定数時間比較
    ...
SECRET_KEY = os.environ["JWT_SIGNING_KEY"]         # 未設定なら KeyError で fail-closed`}</Code>

      <Callout variant="warn" title="JWT は「署名が通る ＝ 信頼」ではない">
        JWT は弱暗号の脆弱性が集中する場所です。検証側で<strong>許可アルゴリズムを明示固定</strong>し（<Cmd>algorithms=["RS256"]</Cmd>）、<strong><Cmd>alg: none</Cmd> を絶対に拒否</strong>し、RS256↔HS256 の鍵混同を防ぎ、<Cmd>exp</Cmd>/<Cmd>aud</Cmd>/<Cmd>iss</Cmd> まで検証して初めて安全です。どの鍵で・どのアルゴリズムで・どの用途のトークンかまで束縛してください。
      </Callout>

      <Section>迷ったら推奨リストに従う — CRYPTREC / NIST</Section>
      <p>
        「どのアルゴリズムを選べばいいか」で迷ったら、権威ある推奨リストに従うのが安全です。自分で判断せず、標準に乗ることが最も確実な防御になります。
      </p>
      <KVList
        items={[
          { key: "CRYPTREC", val: "日本の電子政府推奨暗号リスト。国内での選定基準" },
          { key: "NIST FIPS", val: "FIPS 197 = AES、FIPS 186 = 署名。国際的な標準" },
          { key: "NIST SP 800 シリーズ", val: "SP 800-57 = 鍵管理、SP 800-52 = TLS 設定" },
          { key: "耐量子暗号（PQC）", val: "量子計算機に耐える暗号。NIST の標準化を経て移行が始まりつつある" },
        ]}
      />
      <Callout variant="tip" title="長寿命データは PQC の動向を注視">
        将来を見据え、量子コンピュータに耐える<strong>耐量子暗号（PQC）</strong>への移行が NIST の標準化を経て始まっています。今日暗号化して長期間保存するデータは、「今記録しておいて将来解読する」攻撃の的になりうるため、長寿命のデータを扱うシステムでは PQC の動向を注視すべきです。
      </Callout>

      <ComparisonTable
        headers={["用途", "使ってはいけない", "使うべき"]}
        rows={[
          ["パスワード保存", "MD5 / SHA-1 / 素の SHA-256", "Argon2id / bcrypt / scrypt"],
          ["対称暗号", "DES / RC4 / AES-ECB / 認証なし", "AES-256-GCM / ChaCha20-Poly1305"],
          ["ハッシュ（署名・整合性）", "MD5 / SHA-1", "SHA-256 以上"],
          ["メッセージ認証", "自前 MAC・秘密連結・== 比較", "HMAC-SHA256 ＋定数時間比較"],
          ["署名・トークン", "HS256 固定鍵 / SHA-1 / alg:none", "EdDSA / RS256 / ES256（鍵は外部注入）"],
          ["鍵・トークン生成", "時刻・連番・Math.random / rand", "CSPRNG（128bit 以上）"],
          ["IV / nonce", "固定・再利用", "毎回ランダム・使い回さない"],
        ]}
      />
      <p>
        「迷ったら、遅い KDF・認証付き暗号・CSPRNG・標準ライブラリの高水準 API」を選べば、典型的な実装ミスの大半は未然に防げます。<strong>自前で暗号を組み立て始めた時点が、最大の危険信号</strong>です。
      </p>

      <Bridge course="計算量理論 / 情報理論 / ソフトウェア工学（安全な既定）">
        暗号の実装ミスは、理論と実装の<strong>橋渡しの失敗</strong>です。アルゴリズム自体は計算量理論・整数論に裏打ちされて安全でも、IV 再利用・非定時間比較・鍵漏洩といった<strong>運用と実装</strong>の層で保証が崩れます。とくにタイミング攻撃は、計算の<strong>実行時間</strong>という「理論では無視されがちな物理量」から秘密が漏れる好例で、座学の抽象モデルと現実のギャップを突いています。「自作せず標準に従う」という指針は、ソフトウェア工学の<strong>安全なデフォルト（secure by default）</strong>そのもの——正しく使うのが自然に易しく、間違えるのが難しい設計へ寄せる、という発想です。座学の理論を「正しく実装へ落とす」責任が、暗号ではとりわけ重くのしかかります。
      </Bridge>

      <Quiz
        question={<>次のうち、暗号の「実装ミス」に当たらない（正しい実装である）ものはどれでしょうか。</>}
        options={[
          "AES-GCM で nonce を全リクエストで固定値にする",
          "MAC の比較を == で行う",
          "JWT の署名鍵を環境変数から注入し、未設定なら起動を失敗させる",
          "JWT 署名鍵をコードに \"changeme\" と直書きする",
        ]}
        answer={2}
        explanation={
          <>
            鍵を<strong>環境変数から注入し、未設定なら fail-closed で起動失敗</strong>させるのは正しい実装です。他は典型的な実装ミスで、nonce の固定は鍵ストリーム露出、<Cmd>==</Cmd> 比較はタイミング攻撃、鍵の直書きは誰でもトークンを偽造できる状態を招きます。迷ったら CRYPTREC / NIST の推奨に従い、自作を避けましょう。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "暗号の失敗の大半はアルゴリズムでなく実装ミス。原則は「自作しない・正しく選び正しく使う」",
          "弱アルゴリズム（MD5 / SHA-1 / DES / RC4 / AES-ECB）を避ける",
          "固定 IV・nonce 再利用は正しい暗号でも破綻させる。毎回ランダムに",
          "秘密の比較は定数時間で行う（== はタイミング攻撃を許す）",
          "鍵はハードコードせず外部注入。JWT は alg 固定・none 拒否・クレーム検証まで",
          "迷ったら CRYPTREC / NIST 推奨に従い、長寿命データは PQC の動向を注視する",
        ]}
      />
    </>
  );
}

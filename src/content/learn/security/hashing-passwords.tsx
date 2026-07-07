import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "hashing-passwords",
  title: "ハッシュ関数とパスワード保存",
  description: "暗号学的ハッシュとは何か、なぜ MD5/SHA-1 は使えないのか。そして最重要の落とし穴——パスワードに速いハッシュを使ってはいけない理由と、Argon2id/bcrypt+ソルトという正解を押さえる。",
  domain: "security",
  section: "crypto",
  order: 2,
  level: "basic",
  tags: ["ハッシュ", "パスワード", "Argon2", "bcrypt"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        「パスワードをハッシュ化して保存しています」——よく聞く言葉ですが、実は<strong>どのハッシュを使うか</strong>で安全性は天と地ほど変わります。ここでは暗号学的ハッシュの性質と、パスワード保存にひそむ最重要の落とし穴を押さえます。
      </Lead>

      <Section>暗号学的ハッシュ関数とは</Section>
      <p>
        <strong>暗号学的ハッシュ関数</strong>は、任意の長さのデータを<strong>固定長の値</strong>に変換する関数です。ただの変換ではなく、次の三つの性質を満たすものを「暗号学的」と呼びます。
      </p>
      <KVList
        items={[
          { key: "一方向性（原像計算困難）", val: "ハッシュ値から元のデータを逆算できない" },
          { key: "第二原像計算困難", val: "あるデータと同じハッシュ値になる別のデータを見つけられない" },
          { key: "衝突困難", val: "同じハッシュ値になる二つのデータのペアを見つけられない" },
        ]}
      />
      <p>
        入力が 1 ビットでも変われば、出力はまるで別物になります。この性質のおかげで、ファイルやメッセージが<strong>改ざんされていないか</strong>を確かめる完全性検証や、デジタル署名の土台に使えます。
      </p>
      <Code lang="bash" filename="terminal">{`echo -n "hello" | sha256sum
# → 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

echo -n "hellp" | sha256sum   # 1 文字違うだけで
# → まったく別のハッシュ値になる（改ざんが一目で分かる）`}</Code>

      <Section>MD5 と SHA-1 は「衝突」で終わった</Section>
      <p>
        暗号学的ハッシュの生命線は<strong>衝突困難性</strong>です。ところが <strong>MD5</strong> と <strong>SHA-1</strong> は、実際に「同じハッシュ値になる別のデータ」を現実的なコストで作れることが証明されてしまいました。つまり<strong>衝突が壊れた</strong>のです。
      </p>
      <p>
        衝突が作れると何が困るのでしょうか。たとえば「無害なファイル」と「悪意あるファイル」を同じハッシュ値に揃えられれば、署名や整合性チェックをすり抜けて中身を差し替えられます。そのため、署名・トークン・整合性検証に MD5 / SHA-1 を使ってはいけません。<strong>現役は SHA-256 / SHA-512</strong> です。
      </p>
      <Callout variant="danger" title="MD5 / SHA-1 は署名・完全性検証に使わない">
        MD5・SHA-1 は衝突が確立しており、<strong>署名・トークン生成・改ざん検知</strong>には使えません。SHA-256 以上へ移行してください。SSH 署名で SHA-1（<Cmd>ssh-rsa</Cmd>）を許すのも、ダウングレードや衝突のリスクを残すため非推奨です（実際 Paramiko で SHA-1 署名許可が脆弱性として報告されています）。
      </Callout>

      <Section>最重要 — パスワードに速いハッシュを使ってはいけない</Section>
      <p>
        ここが本章で最も大事な区別です。「SHA-256 は安全なんだから、パスワードも SHA-256 で保存すればいい」——これが<strong>致命的な間違い</strong>です。理由は一言で言えます。
      </p>
      <Callout variant="danger" title="速い＝総当たりも速い">
        SHA-256 は完全性検証のために<strong>意図的に高速</strong>に設計されています。速いということは、攻撃者が漏洩したハッシュに対して<strong>秒間数十億回</strong>の総当たり（GPU）を回せるということです。人間が選ぶパスワードのエントロピーは低いので、速いハッシュだと現実的な時間で割られてしまいます。
      </Callout>
      <p>
        パスワードには、計算コストを<strong>意図的に高くした</strong>専用の関数——<strong>パスワードハッシュ関数（KDF）</strong>を使います。Argon2id、bcrypt、scrypt がその代表で、いずれも「1 回のハッシュ計算にわざと時間とメモリを食わせる」ことで、総当たりのコストを跳ね上げます。
      </p>
      <FlowChain
        nodes={[
          { label: "パスワード", sub: "ユーザー入力" },
          { label: "ソルトを付加", sub: "利用者ごとに一意", variant: "alt" },
          { label: "遅い KDF", sub: "Argon2id / bcrypt" },
          { label: "保存", sub: "総当たりが割に合わない", variant: "cta" },
        ]}
        caption="パスワードは「ソルト付き × 意図的に遅い KDF」で保存する。速い SHA-256 を直接使わない。"
      />

      <SubSection>ソルトとレインボーテーブル</SubSection>
      <p>
        <strong>ソルト</strong>は、パスワードごとに付ける<strong>ランダムな値</strong>です。なぜ必要なのでしょうか。ソルトがないと、同じパスワードは常に同じハッシュ値になります。攻撃者は「よくあるパスワード → そのハッシュ値」の巨大な対応表——<strong>レインボーテーブル</strong>——をあらかじめ作っておき、漏洩したハッシュを一瞬で逆引きできてしまいます。
      </p>
      <p>
        利用者ごとに異なるソルトを混ぜれば、同じパスワードでもハッシュ値がバラバラになり、事前計算した表が一気に無力化されます。<strong>「速い＝総当たり有利」を KDF で潰し、「事前計算」をソルトで潰す</strong>——この二段構えがパスワード保存の要です。
      </p>

      <ComparisonTable
        headers={["用途", "使うべき", "避けるべき", "理由"]}
        rows={[
          ["パスワード保存", "Argon2id / bcrypt / scrypt", "MD5 / SHA-1 / 素の SHA-256", "意図的に遅い KDF ＋ソルトで総当たり・事前計算を潰す"],
          ["完全性（改ざん検知）", "SHA-256 / SHA-512", "MD5 / SHA-1", "衝突が壊れたハッシュは署名・検証に使えない"],
          ["ファイル指紋（署名・トークン）", "SHA-256 以上", "MD5 / SHA-1", "衝突で差し替えを許す"],
          ["非セキュリティな整合性（ETag 等）", "MD5 も可", "—", "セキュリティ境界でなければ速さ優先でよい"],
        ]}
      />

      <Callout variant="tip" title="標準ライブラリの高水準 API を使う">
        自分でソルトを混ぜて…と組み立てる必要はありません。PHP なら <Cmd>password_hash($pw, PASSWORD_ARGON2ID)</Cmd>、Python なら argon2-cffi、Go なら bcrypt/argon2 ライブラリが、ソルト生成・保存・比較まで面倒を見てくれます。自作は事故のもとです。
      </Callout>

      <Code lang="php" filename="password.php">{`// 危険: 素の高速ハッシュ。ソルトもなく総当たり・レインボーで割られる
$hash = md5($pw);                          // 論外
$hash = hash('sha256', $pw);               // 速すぎてパスワードには不適

// 安全: 意図的に遅い KDF。ソルトは自動で付与・保存される
$hash = password_hash($pw, PASSWORD_ARGON2ID);
// 照合は password_verify（内部で定数時間比較）
if (password_verify($input, $hash)) { /* ログイン成功 */ }`}</Code>

      <Bridge course="情報理論（エントロピー）/ 計算量理論">
        「速い＝総当たりも速い」は、計算量理論の<strong>計算コスト</strong>の話そのものです。パスワードハッシュ関数はわざと計算量（時間・メモリ）を上げ、攻撃者の総当たりコストを実用不能なオーダーへ押し上げます。またソルトの効き目は情報理論の<strong>エントロピー</strong>で説明できます。人間の選ぶパスワードはエントロピーが低く、辞書に載る候補が少ないため事前計算が効く——だからソルトで「同じ入力でも出力を散らす」ことで、攻撃者は利用者ごとに計算をやり直す羽目になります。座学の「入力空間の広さ」と「1 計算あたりのコスト」という二軸が、そのままパスワード防御の設計軸になっているのです。
      </Bridge>

      <Quiz
        question={<>パスワードの保存方法として最も適切なのはどれでしょうか。</>}
        options={[
          "SHA-256 でハッシュ化して保存する",
          "MD5 でハッシュ化し、全員同じソルトを付ける",
          "Argon2id（または bcrypt/scrypt）で利用者ごとのソルト付きで保存する",
          "AES で暗号化して保存する",
        ]}
        answer={2}
        explanation={
          <>
            パスワードは<strong>意図的に遅い KDF（Argon2id / bcrypt / scrypt）</strong>で、<strong>利用者ごとに異なるソルト</strong>を付けて保存します。SHA-256 は速すぎて総当たりに弱く、MD5 は論外、固定ソルトはレインボーテーブルを防げません。暗号化（AES）は「鍵があれば復号できる」ため、そもそも復号できてはいけないパスワード保存には不適切です。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "暗号学的ハッシュは一方向・衝突困難な固定長変換。完全性検証・署名の土台",
          "MD5 / SHA-1 は衝突が壊れており、署名・整合性検証には使えない（SHA-256 以上へ）",
          "パスワードに速いハッシュ（SHA-256）は禁止。速い＝総当たりも速い",
          "パスワードは Argon2id / bcrypt / scrypt で、利用者ごとのソルト付きで保存する",
          "ソルトはレインボーテーブル（事前計算表）を無力化する",
        ]}
      />
    </>
  );
}

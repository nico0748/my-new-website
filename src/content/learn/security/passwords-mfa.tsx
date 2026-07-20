import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Cmd, ComparisonTable, Figure, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "passwords-mfa",
  title: "パスワードと多要素認証（MFA）",
  description: "知識・所持・生体の 3 要素、SMS の格下げ・TOTP・プッシュ（MFA 疲労）・FIDO2/WebAuthn/パスキーのフィッシング耐性まで。手法ごとの強度を NIST の AAL とあわせて整理する。",
  domain: "security",
  section: "auth",
  order: 2,
  level: "basic",
  tags: ["MFA", "多要素認証", "パスワード", "FIDO2", "パスキー", "WebAuthn"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        パスワードは長く認証の主役でしたが、漏洩・使い回し・フィッシングに弱く、単体では守り切れません。
        そこで異なる種類の証拠を重ねる<strong>多要素認証（MFA / Multi-Factor Authentication）</strong>が標準になりました。
        本記事では、認証要素の 3 分類と、代表的な MFA 手法の<strong>強度の違い</strong>を押さえます。
      </Lead>

      <Section>認証の 3 要素 — 知識・所持・生体</Section>
      <p>
        MFA の本質は「<strong>異なるカテゴリ</strong>の要素を 2 つ以上組み合わせる」ことにあります。認証要素は次の 3 つに分類されます。
      </p>
      <KVList
        items={[
          { key: "知識要素（something you know）", val: "パスワード・PIN・秘密の質問。もっとも弱く、漏洩・推測・フィッシングに弱い。" },
          { key: "所持要素（something you have）", val: "スマホ（認証アプリ / SMS）・ハードウェアトークン・FIDO2 セキュリティキー・スマートカード。" },
          { key: "生体要素（something you are）", val: "指紋・顔・虹彩・声紋などの生体情報。端末のロック解除などで使う。" },
        ]}
      />

      <Callout variant="warn" title="同カテゴリを 2 つ重ねても「多要素」ではない">
        <strong>パスワード＋秘密の質問</strong>は、どちらも「知識要素」なので多要素になりません。片方が漏れたときにもう片方も同じ手口で漏れやすいからです。
        真の MFA は<strong>異なるカテゴリ</strong>（例：知識＋所持）を組み合わせて初めて成立します。要素が 2 つの場合を特に <strong>2FA（二要素認証）</strong>と呼びます。
      </Callout>

      <Section>MFA 手法とその強度</Section>
      <p>
        「所持要素」と一口に言っても、手法によって耐性は大きく異なります。近年もっとも重要なのが<strong>リアルタイムフィッシング</strong>への耐性です。
        攻撃者が偽サイトへ誘導し、被害者が入力したコードをその場で本物のサイトへ中継する攻撃で、これに対する耐性が手法の格を分けます。
      </p>
      <ComparisonTable
        headers={["手法", "分類", "強度", "弱点・注意"]}
        rows={[
          ["SMS ワンタイムコード", "所持", "低〜中", "SIM スワップ・SS7 傍受・フィッシングに弱い。NIST は格下げ"],
          ["TOTP（認証アプリ）", "所持", "中", "SMS より強いが、リアルタイムフィッシングでコードを横取りされる"],
          ["プッシュ通知承認", "所持", "中", "利便性は高いが MFA 疲労攻撃（連打承認）のリスク。番号マッチで緩和"],
          [<><Cmd>FIDO2</Cmd> / WebAuthn / パスキー</>, "所持（＋生体）", "高", "公開鍵暗号ベース。フィッシング耐性を持つ現行のゴールドスタンダード"],
          ["ハードウェアキー（YubiKey 等）", "所持", "高", "FIDO2/U2F 対応の物理キー。最も堅牢な所持要素"],
        ]}
      />

      <Figure src="/learn/shots/security/passwords-mfa-01.svg" alt="認証アプリ(TOTP)の登録画面。QR コードと確認コードの入力欄" caption="TOTP の登録画面。QR コードで共有鍵を認証アプリに渡し、生成された 6 桁コードで登録を確定する" />

      <SubSection>なぜ SMS は格下げされたのか</SubSection>
      <p>
        SMS はもっとも普及した手法ですが、<strong>SIM スワップ</strong>（攻撃者が携帯番号を自分の SIM に移し替える）や、
        通信網の <strong>SS7</strong> という古いプロトコルの傍受、そしてフィッシングでコードを打たせる手口に弱いことが知られています。
        NIST（米国立標準技術研究所）は SMS を推奨手法から格下げしました。使わないよりはずっと良いものの、可能なら上位手法へ移行すべきです。
      </p>

      <SubSection>プッシュ通知と「MFA 疲労攻撃」</SubSection>
      <p>
        スマホに「ログインを承認しますか？」と表示して押させるプッシュ承認は便利ですが、
        攻撃者がパスワードを握った状態で<strong>承認要求を連打</strong>し、疲れたユーザーがつい承認してしまう
        <strong>MFA 疲労攻撃（prompt bombing）</strong>が問題になりました。対策として、画面に表示された<strong>番号を入力させる（番号マッチング）</strong>方式が広まっています。
      </p>

      <Section>フィッシング耐性 MFA — FIDO2 / WebAuthn / パスキー</Section>
      <p>
        TOTP・SMS・プッシュは、いずれも「ユーザーが見聞きしたコードや承認を、攻撃者が中継できる」構造的な弱点を持ちます。
        これを原理的に断つのが <strong>FIDO2 / WebAuthn / パスキー</strong>です。
      </p>
      <LayerStack
        layers={[
          { label: "パスキー / FIDO2", sub: "ユーザー体験の呼び名（同期パスキー・デバイス束縛キー）" },
          { label: "WebAuthn", sub: "ブラウザ ↔ 認証器の Web 標準 API" },
          { label: "公開鍵暗号（チャレンジ署名）", sub: "秘密鍵は端末から出ない。署名は正規ドメインに束縛される" },
        ]}
        caption="パスキーは WebAuthn の上に成り、その土台は公開鍵暗号。秘密鍵が端末に留まる点がフィッシング耐性の源泉"
      />
      <p>
        仕組みの核心は 2 点です。第一に、<strong>秘密鍵が端末（認証器）から外に出ない</strong>ため、漏らしようがありません。
        第二に、認証時にサーバから送られたチャレンジへ署名しますが、その署名が<strong>アクセス中のドメインに結び付く</strong>ため、
        偽サイト（別ドメイン）では正しい署名が作れず、認証が成立しません。これが「<strong>フィッシング耐性（phishing-resistant）</strong>」の意味です。
      </p>

      <Figure src="/learn/shots/security/passwords-mfa-02.svg" alt="ブラウザのパスキー登録ダイアログと生体認証のプロンプト" caption="パスキー登録時のダイアログ。鍵の生成と署名は端末側で完結し、秘密鍵はブラウザにもサーバにも渡らない" />

      <Callout variant="tip" title="パスキーはパスワードの置き換えを目指す">
        パスキーは公開鍵暗号を使ったログイン資格情報で、覚える必要がなく、フィッシングにも強いため、
        <strong>パスワードそのものを不要にする</strong>方向で普及が進んでいます。CISA も最優先で推奨しています。
      </Callout>

      <Section>NIST SP 800-63B と認証保証レベル（AAL）</Section>
      <p>
        「どのくらい強く本人確認できているか」を段階化したのが、NIST SP 800-63B の<strong>認証保証レベル（AAL / Authentication Assurance Level）</strong>です。
      </p>
      <ComparisonTable
        headers={["レベル", "要件のイメージ", "例"]}
        rows={[
          ["AAL1", "単一要素でも可（最低限）", "パスワードのみ"],
          ["AAL2", "MFA が必須", "パスワード＋TOTP / プッシュ"],
          ["AAL3", "ハードウェア＋フィッシング耐性", "FIDO2 セキュリティキー"],
        ]}
      />
      <p>
        近年の改訂では、<strong>フィッシング耐性 MFA が AAL2/AAL3 で重視</strong>され、<strong>パスキー（FIDO2）が統合</strong>される一方で、
        <strong>email OTP は非推奨化、SMS は格下げ</strong>されました。まずは特権アカウント・管理コンソール・VPN/SSO から、
        できればフィッシング耐性のある手法を必須化するのが定石です。
      </p>

      <Callout variant="danger" title="リカバリ経路が最弱点になりやすい">
        強い MFA を入れても、「MFA を忘れたときの復旧」がメール 1 通で済むなら、そこが攻撃面になります。
        <strong>復旧フローも本認証と同等以上に堅牢化</strong>することを忘れないでください。
      </Callout>

      <Bridge course="情報セキュリティ / 暗号理論">
        FIDO2/WebAuthn は、講義で学ぶ<strong>公開鍵暗号とデジタル署名（チャレンジ・レスポンス認証）</strong>の応用そのものです。
        サーバがランダムなチャレンジを送り、認証器が<strong>秘密鍵で署名</strong>し、サーバが<strong>公開鍵で検証</strong>する——という流れは、
        「秘密を送らずに本人性を証明する」ゼロ知識的な発想に近いものがあります。座学で学ぶ「共通鍵 vs 公開鍵」「リプレイ攻撃とチャレンジによる対策」が、
        パスワードレス認証という現代的な UX に結実しているのです。多要素という考え方自体も、単一の防御に頼らない<strong>多層防御（defense in depth）</strong>の一例です。
      </Bridge>

      <Divider />

      <Quiz
        question="TOTP（認証アプリのワンタイムコード）と比べて、FIDO2/パスキーが「フィッシング耐性がある」と言える最大の理由は？"
        options={[
          "コードの桁数が多く、総当たりされにくいから",
          "署名が正規ドメインに束縛され、偽サイトでは正しい署名を作れないから",
          "有効期限が 30 秒と短いから",
          "SMS を使わず通信が暗号化されているから",
        ]}
        answer={1}
        explanation="TOTP はユーザーが見たコードを攻撃者が偽サイト経由で中継できます。FIDO2 は署名が接続中のドメインに結び付くため、別ドメインの偽サイトでは検証を通せず、リアルタイムフィッシングが原理的に成立しません。"
      />

      <KeyPoints
        items={[
          "認証要素は知識・所持・生体の 3 分類。異なるカテゴリを重ねて初めて MFA になる",
          "SMS は SIM スワップ・傍受・フィッシングに弱く NIST は格下げ、プッシュは MFA 疲労に注意",
          "FIDO2/WebAuthn/パスキーは秘密鍵が端末に留まり、署名がドメインに束縛されるためフィッシング耐性を持つ",
          "NIST の AAL は AAL1(単要素)→AAL2(MFA)→AAL3(HW＋フィッシング耐性)。特権アカウントから優先導入",
          "強い MFA でもリカバリ経路が弱いと台無し。復旧フローも同等に堅牢化する",
        ]}
      />
    </>
  );
}

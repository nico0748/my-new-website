import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "randomness",
  title: "乱数と予測可能性",
  description: "「統計的にランダム」でも「暗号的に予測可能」なら鍵もトークンも守れない。非暗号 PRNG と CSPRNG の決定的な違い、弱シード・時刻ベース・フォールバック退化という落とし穴を実例で押さえる。",
  domain: "security",
  section: "crypto",
  order: 5,
  level: "practice",
  tags: ["乱数", "CSPRNG", "セッション", "トークン"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        セッション ID・暗号鍵・パスワード再設定トークン——これらの安全性は、たった一つの前提に立っています。<strong>「推測できないこと」</strong>です。ところが「ランダムに見える」値が、実は<strong>予測可能</strong>で足元をすくうことがあります。乱数の落とし穴を見ていきましょう。
      </Lead>

      <Section>「統計的にランダム」と「暗号的に安全」は別物</Section>
      <p>
        <Cmd>Math.random()</Cmd>・<Cmd>math/rand</Cmd>・<Cmd>mt_rand()</Cmd> のような<strong>非暗号 PRNG（擬似乱数生成器）</strong>は、出力が一様に散らばる<strong>統計的ランダム性</strong>を目標に設計されています。χ² 検定を通り、見た目にはランダムです。しかし、これらは<strong>予測不能性</strong>を保証しません。
      </p>
      <p>
        多くは線形合同法（LCG）やメルセンヌ・ツイスタ（<strong>MT19937</strong>）で、いずれも<strong>決定的な漸化式</strong>で次の値を計算します。攻撃者が出力を一定数観測すれば、内部状態を<strong>連立方程式として復元</strong>でき、以後の全出力を予測できます（MT19937 は 624 個の出力で状態が完全に復元されることが知られています）。
      </p>
      <Callout variant="warn" title="統計検定を通った ＝ 安全 ではない">
        「乱数テストを通ったから安全」は早合点です。見た目のばらつき（統計的ランダム性）と、過去の出力から未来を予測できない性質（暗号的安全性）は<strong>別物</strong>です。金庫の暗証番号を「今の時刻」から作れば、桁はバラバラに見えても、いつ設定したか分かれば数百通りに絞れてしまうのと同じです。
      </Callout>

      <Section>CSPRNG を使う</Section>
      <p>
        秘密の生成には、<strong>CSPRNG（暗号論的擬似乱数生成器）</strong>を使います。CSPRNG は「出力から内部状態を復元するのが計算量的に困難」になるよう設計され、OS のエントロピー源（<Cmd>/dev/urandom</Cmd>・<Cmd>getrandom(2)</Cmd> 等）から再シードされます。言語ごとに「危険な API」と「安全な CSPRNG」がはっきり分かれています。
      </p>
      <ComparisonTable
        headers={["言語", "危険（非暗号 / 時刻）", "安全（CSPRNG）"]}
        rows={[
          ["Go", <><Cmd>math/rand</Cmd>・<Cmd>UnixNano()</Cmd> シード</>, <Cmd>crypto/rand</Cmd>],
          ["Python", <Cmd>random.*</Cmd>, <Cmd>secrets</Cmd>],
          ["Node/JS", <Cmd>Math.random()</Cmd>, <><Cmd>crypto.randomBytes</Cmd>・<Cmd>randomUUID</Cmd></>],
          ["PHP", <><Cmd>mt_rand</Cmd>・<Cmd>uniqid</Cmd>・<Cmd>md5(time())</Cmd></>, <><Cmd>random_bytes</Cmd>・<Cmd>random_int</Cmd></>],
          ["Java", <Cmd>java.util.Random</Cmd>, <Cmd>SecureRandom</Cmd>],
        ]}
      />
      <Code lang="python" filename="token.py">{`# 危険: random モジュールは非暗号。出力から状態を復元でき予測可能
import random
token = "".join(random.choices(string.ascii_letters, k=32))

# 安全: secrets モジュール（CSPRNG・URL 安全）
import secrets
token = secrets.token_urlsafe(32)   # セッション/トークンはこちら`}</Code>
      <p>「秘密生成では左を見たら右へ」——この単純ルールをチームで共有するだけで、レビューでの取りこぼしが大きく減ります。</p>

      <Section>典型的な落とし穴 — どこでエントロピーが失われるか</Section>
      <p>
        「不十分な乱数」は、エントロピー（不確実性の量）が<strong>どの段階で目減りするか</strong>で亜種が分かれます。代表的な三つを、実際の脆弱性報告に沿って見ていきます。
      </p>
      <StepFlow
        steps={[
          { title: "弱シード型", desc: <>PRNG 自体は強くても、シードが時刻・PID・連番など低エントロピーで全探索できる。ある Go 製 OSS は <Cmd>math/rand</Cmd> を <Cmd>time.Now().UnixNano()</Cmd> でシードして署名鍵を生成。管理者の作成時刻からシードを短時間で全探索され、JWT を偽造された。</> },
          { title: "時刻ベース直接生成型", desc: <>出力が時刻の関数。ある PHP 製 EC は API セッション ID を <Cmd>md5(time() . uniqid())</Cmd> で生成し、µ 秒成分をレイテンシで推定・総当たりでハイジャックされた。</> },
          { title: "フォールバック退化型", desc: <>CSPRNG が失敗したとき安全でない既定値へ無言で退化する。ある Web フレームワークは <Cmd>crypto/rand</Cmd> のエラー時に<strong>ゼロ UUID（000…）</strong>へフォールバックし、トークンが予測可能・衝突した。</> },
        ]}
        caption="エントロピーが失われる代表パターン。乱数源を CSPRNG にするだけでなく、シード・時刻依存・失敗時の挙動まで見る。"
      />
      <KVList
        items={[
          { key: "弱シード", val: "強い PRNG でもシードが時刻/連番なら全探索される" },
          { key: "時刻ベース", val: "md5(time())・uniqid は生成時刻を推定されると再現される" },
          { key: "フォールバック退化", val: "乱数源失敗時にゼロ値・固定値を返すと予測可能に" },
          { key: "nonce/IV 再利用", val: "一度きりの値を使い回すと乱数源が強くても破れる" },
        ]}
      />

      <Section>影響 — 何を生成していたかで被害が決まる</Section>
      <p>
        弱い乱数の怖さは、<strong>何の生成に使っていたか</strong>で被害の大きさが決まる点にあります。診断で影響を見積もるときの代表パターンです。
      </p>
      <KVList
        items={[
          { key: "署名鍵の復元", val: "JWT secret 等を復元されると任意ユーザになりすませる。最も深刻" },
          { key: "セッション ID 予測", val: "他ユーザのセッションを乗っ取られる（セッションハイジャック）" },
          { key: "CSRF トークン予測", val: "予測可能だと CSRF 対策が空洞化する" },
          { key: "パスワード再設定トークン予測", val: "メールを傍受せずにアカウントを乗っ取られる" },
          { key: "nonce/IV 再利用", val: "ストリーム暗号では平文が回復される（致命的）" },
        ]}
      />
      <Callout variant="tip" title="fail-closed と十分なビット長">
        乱数源の失敗は握りつぶさず、<strong>例外/パニックで停止（fail-closed）</strong>させます。ゼロ値・固定値を返してはいけません。またトークン長は<strong>十分に長く</strong>（目安 128 ビット以上）します。コンテナやサーバレスは起動直後にエントロピーが枯渇しがちで、フォールバック退化が顕在化しやすい点にも注意します。
      </Callout>

      <Bridge course="情報理論（エントロピー）/ 確率・統計 / 計算量理論">
        乱数の安全性は、情報理論の<strong>エントロピー</strong>で定量化できます。理想の n ビットトークンは 2^n 通りですが、時刻シードや弱シードだと<strong>実効エントロピー</strong>が激減し、全探索が数秒で終わります。「理論ビット長」と「攻撃者が絞り込んだ後の実効ビット長」を分けて評価する——これは確率・統計の考え方そのものです。また「統計的ランダム性 ≠ 予測不能性」は、擬似乱数の<strong>決定性</strong>と、状態復元の<strong>計算量</strong>の話です。座学で「メルセンヌ・ツイスタは周期が長い」と習ったその決定的漸化式が、逆に「出力から状態を復元できる」弱点になる——理論の裏表がそのまま攻撃面になっています。
      </Bridge>

      <Quiz
        question={<>セッション ID の生成に <Cmd>Math.random()</Cmd> を使っているコードを見つけました。統計的なランダム性テストは通ります。この評価として正しいのはどれでしょうか。</>}
        options={[
          "テストを通っているので安全。問題ない",
          "非暗号 PRNG は出力から状態を復元でき予測可能なので危険。CSPRNG に置き換えるべき",
          "ビット長さえ長ければ Math.random でも安全",
          "セッション ID は秘密ではないので乱数の強さは関係ない",
        ]}
        answer={1}
        explanation={
          <>
            <Cmd>Math.random()</Cmd> は非暗号 PRNG で、<strong>統計的にランダムでも予測可能</strong>です。少数の出力から内部状態を復元でき、以後のセッション ID を予測されます。セッション ID は「推測できないこと」が安全性の土台なので、<Cmd>crypto.randomBytes</Cmd>・<Cmd>randomUUID</Cmd> のような CSPRNG に置き換える必要があります。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "非暗号 PRNG（Math.random・math/rand・MT19937）は統計的にランダムでも予測可能",
          "秘密の生成には CSPRNG（crypto/rand・secrets・SecureRandom）を使う",
          "弱シード・時刻ベース生成・フォールバック退化がエントロピーを失わせる典型",
          "乱数源の失敗は fail-closed で停止し、ゼロ値・固定値を返さない",
          "被害はセッション ID・鍵・トークンの予測（乗っ取り・偽造）に直結する",
        ]}
      />
    </>
  );
}

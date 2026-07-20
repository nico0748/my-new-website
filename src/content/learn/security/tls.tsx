import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, Figure, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "tls",
  title: "TLS/SSL — 通信の暗号化",
  description: "HTTPS の土台 TLS。ハンドシェイクで何が起きているのか、TLS 1.3 が前方秘匿性・AEAD・1-RTT で何を変えたのか、そして Mozilla の設定指針まで。通信を守るプロトコルを俯瞰する。",
  domain: "security",
  section: "crypto",
  order: 3,
  level: "basic",
  tags: ["TLS", "SSL", "HTTPS", "暗号"],
  updated: "2026-07-07",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        アドレスバーの鍵アイコン——その裏で働いているのが <strong>TLS（Transport Layer Security）</strong>です。TLS は通信路を暗号化し、
        <strong>機密性（盗聴防止）・完全性（改ざん検知）・サーバ認証（なりすまし防止）</strong>を提供する、インターネットの基盤プロトコルです。前章のハイブリッド方式が、ここで実際に動きます。
      </Lead>

      <Section>TLS/SSL とは — 何を守るのか</Section>
      <p>
        TLS の前身は <strong>SSL（Secure Sockets Layer）</strong>ですが、SSL 2.0 / 3.0 はいずれも脆弱性のため<strong>廃止済み</strong>です。現在の現役は <strong>TLS 1.2</strong> と <strong>TLS 1.3</strong>（RFC 8446）で、HTTPS をはじめあらゆる安全な通信の土台になっています。
      </p>
      <KVList
        items={[
          { key: "機密性", val: "通信内容を暗号化し、盗聴されても読めない" },
          { key: "完全性", val: "途中で改ざんされたら検知できる" },
          { key: "サーバ認証", val: "接続先が本物か（なりすましでないか）を証明書で検証する" },
        ]}
      />

      <Figure src="/learn/shots/security/tls-01.svg" alt="ブラウザの鍵アイコンから開いた証明書情報。発行者・有効期限・SAN" caption="鍵アイコンから証明書を開くと、ハンドシェイクでサーバが提示した証明書の中身をそのまま確認できる" />

      <Section>TLS ハンドシェイク — 暗号通信を始める儀式</Section>
      <p>
        暗号化された通信を始めるには、まず両者が「どの暗号方式を使い、どの鍵で話すか」を決める必要があります。この最初の取り決めが<strong>ハンドシェイク</strong>です。大きく次の流れで進みます。
      </p>
      <SequenceDiagram
        actors={["クライアント", "サーバー"]}
        messages={[
          { from: 0, to: 1, label: "① ClientHello（対応バージョン・暗号候補・乱数）" },
          { from: 1, to: 0, label: "② ServerHello（暗号を1つ選択）＋証明書", cta: true },
          { from: 0, to: 1, label: "③ 鍵交換（(EC)DHE で共有鍵を確立）" },
          { from: 1, to: 0, label: "④ Finished（鍵確定・以降は暗号化通信）", cta: true },
        ]}
        caption="TLS ハンドシェイクの骨格。乱数と証明書を交換し、鍵交換で共有鍵を作り、Finished 以降は暗号化された本文が流れる。"
      />
      <KVList
        items={[
          { key: "① ClientHello", val: "クライアントが対応 TLS バージョン・暗号スイート候補・乱数を送る" },
          { key: "② ServerHello", val: "サーバが候補から単一の暗号スイートを選び、証明書を提示する" },
          { key: "③ 鍵交換", val: "(EC)DHE で共有鍵を確立。証明書で公開鍵の正当性を検証" },
          { key: "④ Finished", val: "双方が鍵を確定し、以降は暗号化通信へ移行" },
        ]}
      />
      <Callout variant="warn" title="提示していない暗号を返されたら中断">
        サーバがクライアントの提示していない暗号スイートを選んで返した場合、クライアントは <Cmd>illegal_parameter</Cmd> でハンドシェイクを中断します。「勝手に弱い暗号へ引き下げる」ダウングレードを防ぐための取り決めです。
      </Callout>

      <Section>TLS 1.3 が変えたこと</Section>
      <p>
        TLS 1.3 は、それまでの積み重ねを整理し、安全性と速度を同時に引き上げました。押さえるべき変更点は三つです。
      </p>
      <SubSection>前方秘匿性（Forward Secrecy）の必須化</SubSection>
      <p>
        TLS 1.3 は静的 RSA・静的 DH 鍵交換を<strong>削除</strong>し、すべての鍵交換が<strong>前方秘匿性</strong>を持つようになりました。前方秘匿性とは、「サーバの長期秘密鍵が将来漏れても、<strong>過去に記録された通信は解読できない</strong>」という性質です。毎回その場限りの鍵を作るため、一度捨てた鍵は後から再現できません。
      </p>
      <SubSection>AEAD 暗号のみ・1-RTT</SubSection>
      <p>
        TLS 1.3 専用の暗号スイートはすべて <strong>AEAD（認証付き暗号）</strong>で、暗号化と改ざん検知を一体で行います。RC4・CBC モードの一部・MD5/SHA-1 といった旧式・脆弱なアルゴリズムは排除されました。さらにハンドシェイクが <strong>1-RTT</strong>（往復 1 回）に短縮され、再開時は 0-RTT も可能になり、体感速度も向上しています。
      </p>
      <Code lang="text" filename="TLS 1.3 の代表的な暗号スイート">{`TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
# すべて AEAD（認証付き暗号）。鍵合意・認証は別途交渉される`}</Code>

      <Section>サーバ設定の指針 — Mozilla Server Side TLS</Section>
      <p>
        「どの TLS 設定にすべきか」で迷ったら、権威ある指針に従うのが安全です。Mozilla の <strong>Server Side TLS</strong> は、互換性と安全性のバランスで三段階を示しています。
      </p>
      <ComparisonTable
        headers={["プロファイル", "対応", "使いどころ"]}
        rows={[
          ["Modern", "TLS 1.3 のみ", "最高水準。直近5年程度のクライアントと互換"],
          ["Intermediate", "TLS 1.2 ＋ 1.3", "幅広い互換性を保ちつつ安全（一般的推奨）"],
          ["Old", "レガシー含む", "古い環境対応が必要な場合のみ（非推奨方向）"],
        ]}
      />
      <Callout variant="tip" title="設定は実測で確かめる">
        TLS は<strong>設定ミスで容易に脆弱化</strong>します（古いプロトコル・弱い暗号の有効化、証明書管理不備など）。<Cmd>testssl.sh</Cmd> / <Cmd>sslscan</Cmd> / Qualys SSL Labs といったツールで、自分のサーバに弱い暗号や古いプロトコルが残っていないかを実際にスキャンして確認しましょう。
      </Callout>

      <Figure src="/learn/shots/security/tls-02.svg" alt="自分の検証サーバに testssl.sh を実行したターミナル出力" caption="実測すると、有効なプロトコルと暗号スイートが一覧で出る。古い TLS や弱い暗号が残っていないかをここで確かめる" />

      <Bridge course="ネットワーク（トランスポート層・プロトコル）/ 情報理論（暗号）">
        TLS は名前のとおり<strong>トランスポート層セキュリティ</strong>で、ネットワークの講義で習う<strong>プロトコルの状態遷移</strong>（ハンドシェイクの各段階）と、暗号理論で習う<strong>鍵交換・共通鍵・ハッシュ</strong>の合わせ技です。前章のハイブリッド方式——「公開鍵で鍵を配り、以降は速い対称鍵で暗号化する」——が、ここで実プロトコルとして立ち上がります。前方秘匿性は情報理論の観点では「過去の鍵と未来の鍵を独立にする」設計で、一つの鍵が漏れても他の通信の秘匿が崩れないよう<strong>被害を局所化</strong>する考え方です。座学のプロトコル状態機械と暗号アルゴリズムが、1 回の HTTPS 接続の冒頭数十ミリ秒に凝縮されています。
      </Bridge>

      <Quiz
        question={<>TLS 1.3 で必須化された「前方秘匿性（Forward Secrecy）」が保証するのはどれでしょうか。</>}
        options={[
          "サーバの処理速度が必ず速くなる",
          "サーバの長期秘密鍵が将来漏れても、過去に記録された通信は解読されない",
          "パスワードが自動的に強くなる",
          "証明書の検証が不要になる",
        ]}
        answer={1}
        explanation={
          <>
            前方秘匿性は、毎回その場限りの鍵を使うことで、<strong>長期鍵が後で漏洩しても過去の通信は解読できない</strong>ようにする性質です。攻撃者が暗号文を記録しておき「いつか鍵が漏れたら解読する」という攻撃を無力化します。TLS 1.3 は静的 RSA/DH 鍵交換を削除してこれを必須化しました。
          </>
        }
      />

      <Divider />

      <KeyPoints
        items={[
          "TLS は通信の機密性・完全性・サーバ認証を提供する基盤プロトコル（SSL は廃止済み）",
          "ハンドシェイクは ClientHello → ServerHello → 鍵交換 → Finished の流れで暗号通信を準備する",
          "TLS 1.3 は前方秘匿性を必須化し、AEAD のみ・1-RTT で安全性と速度を両立",
          "設定は Mozilla の Modern / Intermediate / Old を指針にする（一般には Intermediate）",
          "TLS は設定ミスで脆弱化する。testssl.sh 等で実測して確認する",
        ]}
      />
    </>
  );
}

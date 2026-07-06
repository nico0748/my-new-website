import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "linux-basics",
  title: "Linux 基礎 — 迷子にならないファイルシステムと権限",
  description: "サーバ運用の土台。ディレクトリ構成、パーミッション、プロセスの基本コマンドを手を動かしながら押さえる。",
  domain: "infra",
  section: "linux",
  order: 1,
  level: "intro",
  tags: ["Linux", "CLI", "権限"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        クラウドもコンテナも、その下では大抵 Linux が動いています。「今どこにいて、誰として、何を触っているか」を把握できれば怖くありません。
      </Lead>

      <Section>まず現在地を知る 3 コマンド</Section>
      <Steps>
        <Step title="今いる場所">
          <Cmd>pwd</Cmd> で現在のディレクトリの絶対パスを表示。
        </Step>
        <Step title="中身を見る">
          <Cmd>ls -la</Cmd> で隠しファイルと権限を含めて一覧。
        </Step>
        <Step title="自分は誰か">
          <Cmd>whoami</Cmd> と <Cmd>id</Cmd> で実行ユーザーと所属グループを確認。
        </Step>
      </Steps>

      <Section>パーミッションの読み方</Section>
      <p>
        <Cmd>ls -l</Cmd> の先頭 <Cmd>-rwxr-xr--</Cmd> は、左から「種別 / 所有者 / グループ / その他」の権限です。
      </p>
      <Code lang="bash" filename="terminal">{`$ ls -l app.sh
-rwxr-xr--  1 nico  staff  128  Jul  7 10:00 app.sh
#  ^owner ^group ^others
#  rwx    r-x    r--   → 所有者=読み書き実行, グループ=読み実行, 他=読みのみ`}</Code>

      <SubSection>数値表記（chmod）</SubSection>
      <p>r=4, w=2, x=1 を足します。<Cmd>chmod 755 app.sh</Cmd> は所有者 7(rwx)・グループ 5(r-x)・その他 5(r-x)。</p>

      <Callout variant="danger" title="777 を安易に使わない">
        <Cmd>chmod 777</Cmd> は「誰でも書き込み・実行可能」。トラブルの温床です。必要最小限の権限を与えるのが鉄則です。
      </Callout>

      <Section>プロセスを見る・止める</Section>
      <ul>
        <li><Cmd>ps aux</Cmd> — 実行中プロセスの一覧</li>
        <li><Cmd>top</Cmd> / <Cmd>htop</Cmd> — リアルタイムの負荷監視</li>
        <li><Cmd>kill -9 &lt;PID&gt;</Cmd> — プロセスの強制終了</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "pwd / ls -la / whoami で現在地・中身・実行者を掴む",
          "権限は 所有者/グループ/その他 の rwx。数値は r4 w2 x1 の和",
          "chmod 777 は避け、必要最小限の権限を与える",
          "ps aux と kill でプロセスを確認・停止できる",
        ]}
      />
    </>
  );
}

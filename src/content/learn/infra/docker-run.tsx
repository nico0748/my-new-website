import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "docker-run",
  title: "docker run — コンテナを動かす・つなぐ・残す",
  description: "最初のコンテナ（nginx）を docker run で起動し、-p でポートをつなぐ。イメージとコンテナの違い（レイヤーと書き込み可能層）、bind mount と named volume でデータを残す方法まで。",
  domain: "infra",
  section: "container",
  order: 2,
  level: "basic",
  tags: ["Docker", "docker run", "ポート", "ボリューム"],
  updated: "2026-07-07",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        <Cmd>docker run</Cmd> は「イメージを取ってきて使い捨てで実行する」感覚に近いコマンドです。実際に nginx を動かしながら、ポートのつなぎ方とデータの残し方を掴みます。
      </Lead>

      <Section>最初のコンテナ — nginx</Section>
      <p>
        <Cmd>docker run</Cmd> は内部で <strong>pull（取得）→ create（作成）→ start（起動）</strong>の3ステップをまとめて実行します。
      </p>
      <Figure
        src="/learn/infra/docker-run-flow.svg"
        alt="docker run が pull→create→start の3ステップを1コマンドにまとめている流れの図"
        caption="docker run は pull → create → start を1コマンドに束ねたもの。"
      />
      <Code lang="bash" filename="サーバー上で実行">{`# バックグラウンド(-d)で起動し web と名付け、ホスト8080をコンテナ80につなぐ
docker run -d --name web -p 8080:80 nginx
docker ps                         # 起動中のコンテナを確認
curl http://localhost:8080/       # サーバー内部からアクセス（成功）`}</Code>
      <Figure
        src="/learn/shots/infra/docker-run-01.svg"
        alt="docker ps の実行結果。CONTAINER ID・IMAGE・STATUS・PORTS・NAMES の列が表形式で並んだターミナル"
        caption="docker ps の出力。PORTS 列の 0.0.0.0:8080 の表記で、どのポートがどこにつながっているか読み取れる。"
      />
      <KVList
        items={[
          { key: <Cmd>-d</Cmd>, val: "デタッチド（バックグラウンド実行）" },
          { key: <Cmd>--name web</Cmd>, val: "コンテナに名前を付ける（docker stop web のように指定できる）" },
          { key: <Cmd>-p 8080:80</Cmd>, val: "ホストの8080 → コンテナの80。左がホスト、右がコンテナ" },
          { key: <Cmd>nginx</Cmd>, val: "使うイメージ名。タグ省略時は nginx:latest" },
        ]}
      />
      <Figure
        src="/learn/infra/port-mapping.svg"
        alt="-p ホスト:コンテナ でホストのポートに来た通信をコンテナ内へ転送する図"
        caption="-p 8080:80 は「ホストの8080 → コンテナの80」。左がホスト、右がコンテナと覚える。"
      />
      <Callout variant="tip" title="使い捨て実行 run と、再開 start">
        <Cmd>docker run</Cmd> は毎回<strong>新しいコンテナを作って</strong>起動します（npx のようにフレッシュ）。一度作ったコンテナを止めて再開するなら <Cmd>docker stop web</Cmd> / <Cmd>docker start web</Cmd> を使います。
      </Callout>

      <Section>イメージとコンテナの違い — レイヤー</Section>
      <p>
        イメージは、変更を1つずつ積み上げた<strong>読み取り専用レイヤー</strong>の集まりです（Git のコミット履歴に似ています）。コンテナは、そのイメージの上に<strong>書き込み可能層を1枚だけ</strong>載せたもの。コンテナ内でファイルを書き換えても変更はこの最上層にだけ記録され、下のイメージは汚れません。だから同じイメージから何個でもコンテナを作れます。
      </p>
      <Figure
        src="/learn/infra/image-layers.svg"
        alt="イメージは読み取り専用レイヤーの積み重ね、コンテナはその上に書き込み可能層を1枚載せて動くことを示す図"
        caption="イメージ=読み取り専用レイヤーの積み重ね。コンテナ=その上に書き込み可能層を1枚載せた実体。"
      />
      <Code lang="bash" filename="サーバー上で実行">{`docker images               # ローカルのイメージ一覧
docker history nginx        # どんなレイヤーで出来ているか
docker pull nginx:1.27-alpine   # タグを指定して取得
docker images | grep nginx      # サイズを比べる（alpine 版は小さい）`}</Code>
      <Callout variant="warn" title="latest タグを本番で使わない">
        <Cmd>nginx</Cmd> と書くと <Cmd>nginx:latest</Cmd> が使われますが、<Cmd>latest</Cmd> はいつの間にか中身が変わります。「昨日は通ったのに今日は通らない」という再現性の崩壊を招きます。<Cmd>nginx:1.27-alpine</Cmd> のようにバージョンを固定しましょう。<Cmd>-alpine</Cmd> は極小ディストリ Alpine ベースで、pull もデプロイも速く攻撃対象も減ります。
      </Callout>

      <Section>ボリューム — コンテナが消えてもデータを残す</Section>
      <p>
        コンテナの書き込み可能層は、コンテナを <Cmd>rm</Cmd> すると一緒に消えます。データベースの中身がそれでは困ります。そこで、データをコンテナの外（ホスト側）に置く仕組みが<strong>ボリューム</strong>で、2種類あります。
      </p>
      <Figure
        src="/learn/infra/bind-vs-volume.svg"
        alt="bind mount はホストの任意パス、named volume は Docker 管理領域を、コンテナ内のパスに結びつける図"
        caption="どちらもコンテナ内のパスに「外の保存先」を結びつける。bind mount はホストの任意パス、named volume は Docker 管理領域。"
      />
      <SubSection>bind mount — ホストのディレクトリを直接マウント</SubSection>
      <Code lang="bash" filename="サーバー上で実行">{`mkdir -p ~/site
echo "<h1>Hello from a bind mount</h1>" > ~/site/index.html
# ホストの ~/site を nginx の公開ディレクトリにマウント（:ro = 読み取り専用）
docker run -d --name web -p 8080:80 \\
  -v ~/site:/usr/share/nginx/html:ro nginx:1.27-alpine
curl http://localhost:8080/      # => Hello from a bind mount
# ホスト側を書き換えると即座に反映される（開発のホットリロード的な使い方）
echo "<h1>Edited on the host</h1>" > ~/site/index.html`}</Code>
      <SubSection>named volume — Docker が管理する保存領域</SubSection>
      <Code lang="bash" filename="サーバー上で実行">{`docker volume create app-data
docker volume ls
docker volume inspect app-data
# DB などのデータはこちら（第3章で実践）
# docker run -d -v app-data:/var/lib/postgresql/data postgres:16`}</Code>
      <ComparisonTable
        headers={["観点", "bind mount", "named volume"]}
        rows={[
          ["実体", "ホストの任意パス", "Docker 管理領域"],
          ["得意なこと", "開発中のソース共有、設定ファイル", "DB などの永続データ"],
          ["権限の罠", "UID 不一致が起きやすい", "比較的安全"],
        ]}
      />
      <Callout variant="danger" title="DB を裸のコンテナで動かさない">
        ボリューム無しで <Cmd>docker run postgres</Cmd> すると、コンテナを <Cmd>rm</Cmd> した瞬間にデータが全部消えます。<strong>永続化が必要なものは必ずボリュームを付ける</strong>。事故で一番多いパターンです。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "docker run = pull→create→start。-d 背景実行、--name 命名、-p ホスト:コンテナ",
          "イメージ=読み取り専用レイヤーの積み重ね、コンテナ=書き込み可能層を1枚載せた実体",
          "latest は使わずタグを固定。alpine 版は小さく速い",
          "データを残すにはボリューム。設定/ソースは bind mount、DB は named volume",
          "ボリューム無しの DB はコンテナ削除で全消失。必ずボリュームを付ける",
        ]}
      />
    </>
  );
}

import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "docker-compose",
  title: "docker-compose — 役割で分けて、宣言的に束ねる",
  description: "なぜ1コンテナに詰めず役割で分けるのか、docker run の4つの限界、YAML の読み方（インデントと真偽値の罠）、そして最初の compose と build/image の違いまで。",
  domain: "infra",
  section: "container",
  order: 4,
  level: "basic",
  tags: ["docker-compose", "YAML", "宣言的", "マイクロサービス"],
  updated: "2026-07-07",
  minutes: 10,
};

export default function Article() {
  return (
    <>
      <Lead>
        実際のアプリは、フロント・バック・DB・キャッシュなど<strong>複数のコンテナの集まり</strong>です。それを1枚の <Cmd>docker-compose.yml</Cmd> に宣言的に書いて、<Cmd>docker compose up -d</Cmd> の一発で束ねて立ち上げます。
      </Lead>

      <Section>なぜ1コンテナに全部詰めないのか</Section>
      <p>
        技術的には nginx・アプリ・DB を1コンテナに詰めても動きます。それでもプロは「役割ごと」に分けます。小さな定食屋で例えると、繁盛すればホール係・調理・仕入れと分業するのと同じ。片方が忙しくても・壊れても、全体が道連れになりません。
      </p>
      <Figure
        src="/learn/infra/monolith-vs-services.svg"
        alt="全部1コンテナは寿命も再起動もスケールも縛られる一方、役割で分割すると各自が独立して動けることを示す図"
        caption="左「全部1コンテナ」は一見シンプルだが全部が縛られる。右「役割で分割」はそれぞれが独立して動ける。"
      />
      <SubSection>1コンテナ = 1プロセス = 1つの仕事</SubSection>
      <p>この原則を守ると、次の5つが自然に手に入ります。</p>
      <ComparisonTable
        headers={["観点", "全部1コンテナ", "役割ごとに分割（採用）"]}
        rows={[
          ["再起動", "1行直すと全部落ちる", "直した1つだけ再起動"],
          ["スケール", "全体を丸ごと複製", "混む役割だけ増やせる"],
          ["技術選択", "同居できる範囲に縛られる", "役割ごとに最適な技術"],
          ["障害", "1つの故障が全滅", "故障が局所で止まる"],
          ["最初の手軽さ", "◎（1つだけ）", "△（束ねる仕組みが要る）"],
        ]}
      />
      <Callout variant="info" title="分ければ分けるほど良い、わけではない">
        役割を細かく切りすぎると、コンテナ同士の通信・整合性・デバッグが複雑になります（マイクロサービスは大規模組織の道具）。指針は<strong>「明らかに寿命・技術・スケールが違うものだけ分ける」</strong>。front / back / DB / cache はまさにその典型で、1台の VPS にはちょうどいい粒度です。
      </Callout>

      <Section>docker run の限界 — なぜ compose か</Section>
      <p>複数コンテナを <Cmd>docker run</Cmd> で捌こうとすると、4つの痛みが襲ってきます。</p>
      <ul>
        <li><strong>オプション地獄</strong>：<Cmd>-p -v -e --restart</Cmd> の長い呪文を毎回手打ち</li>
        <li><strong>起動順序</strong>：「DB が立ってから backend」を自分で気をつける</li>
        <li><strong>コンテナ間通信</strong>：ネットワークを手で作り各コンテナを繋ぐ</li>
        <li><strong>再現性</strong>：手順がどこにも残らず属人化する</li>
      </ul>
      <Figure
        src="/learn/infra/run-hell-vs-compose.svg"
        alt="docker run の長い呪文を並べる世界と、1枚の宣言ファイルにまとめて up -d 一発で再現する世界の対比図"
        caption="左は docker run の長い呪文の世界。右はそれを1枚の宣言ファイルにまとめ、docker compose up -d 一発で再現する世界。"
      />
      <Callout variant="tip" title="命令（how）から宣言（what）へ">
        <Cmd>docker run</Cmd> は「どうやるか」を1手ずつ命令するスタイル。<Cmd>docker-compose.yml</Cmd> は「どうあってほしいか」だけを書く宣言的スタイルです。ファイルに残るから、再現でき・レビューでき・Git で差分を追える。前章の <strong>Infrastructure as Code</strong> がコンテナの世界でも続きます。
      </Callout>

      <Section>YAML の読み方</Section>
      <p>
        <Cmd>docker-compose.yml</Cmd> は <strong>YAML</strong> で書きます。ここを飛ばすと「なぜか動かない」の大半が YAML の書き間違いになります。決定的に大事なのは<strong>字下げ（インデント）の深さで入れ子（親子関係）を表す</strong>こと。
      </p>
      <Figure
        src="/learn/infra/yaml-structure.svg"
        alt="YAML のマップ・リスト・入れ子を示す構造図"
        caption="key: value は対応（マップ）、先頭の - はリストの1項目。字下げがずれると意味が変わる。"
      />
      <Code lang="yaml" filename="YAML の4要素">{`# ① コメント：# から行末まで
# ② マップ（key: value）：コロンの後ろに半角スペースが要る
image: nginx:alpine
# ③ 入れ子：字下げ（半角スペース2つが定番）で親子を表す
services:
  web:            # web は services の子
    image: nginx  # image は web の子
# ④ リスト：先頭の "- " で1項目
ports:
  - "8080:80"`}</Code>
      <Callout variant="warn" title="真偽値の罠と、インデントの罠">
        YAML はクォートしていない <Cmd>yes/no/on/off/true/false</Cmd> をすべて真偽値と解釈します（国コード <Cmd>NO</Cmd> が偽に化ける「ノルウェー問題」）。<Cmd>1.10</Cmd> も 1.1 に丸められます。<strong>文字列は <Cmd>"postgres:16"</Cmd> のようにクォート</strong>で守ります。また YAML は<strong>タブ禁止・スペースのみ</strong>。迷ったら <Cmd>docker compose config</Cmd> で構文チェックできます。
      </Callout>
      <p>
        トップレベルに来るキーは基本この3つ：<Cmd>services</Cmd>（動かすコンテナ）、<Cmd>volumes</Cmd>（消えない保管場所）、<Cmd>networks</Cmd>（コンテナ同士をつなぐ仮想 LAN・省略すると自動生成）。なお現在の Compose（v2）では先頭の <Cmd>version:</Cmd> はもう書きません。
      </p>

      <Section>最初の compose と、build / image の違い</Section>
      <p>
        まずは <Cmd>docker run -p 8080:80 nginx:alpine</Cmd> を compose で書き直すだけから始めます。フォルダごとに1つの <Cmd>docker-compose.yml</Cmd> を置く運用です。
      </p>
      <Code lang="yaml" filename="~/myapp/docker-compose.yml">{`services:
  web:                      # サービス名（好きに付けられる）
    image: nginx:alpine     # 使うイメージ
    ports:
      - "8080:80"           # ホスト8080 → コンテナ80
    restart: unless-stopped`}</Code>
      <Code lang="bash" filename="~/myapp で実行">{`docker compose up -d       # バックグラウンドで起動（ネットワークも自動作成）
docker compose ps          # コンテナ一覧
docker compose logs -f web # web のログを追う
docker compose down        # 停止＋コンテナ・ネットワーク削除`}</Code>
      <Callout variant="info" title="docker compose（スペース）が正">
        古い記事の <Cmd>docker-compose</Cmd>（ハイフン）は旧 v1（別インストール）。現在は Docker 本体にプラグイン統合された <Cmd>docker compose</Cmd>（スペース）が正しい形です。
      </Callout>
      <SubSection>image: と build: の使い分け</SubSection>
      <p>アプリを組み込むと <Cmd>build:</Cmd> が登場します。イメージの入手方法が「取ってくる」か「作る」かの違いです。</p>
      <Figure
        src="/learn/infra/image-source.svg"
        alt="image: はレジストリから pull、build: は Dockerfile から build。どちらもイメージになってからコンテナが動く図"
        caption="image: はレジストリ（Docker Hub）から取ってくる、build: は Dockerfile から作る。どちらもイメージになってから動く。"
      />
      <ComparisonTable
        headers={["", "image: postgres:16-alpine", "build: ./api-python"]}
        rows={[
          ["意味", "既製イメージを取ってくる", "手元の Dockerfile から自作する"],
          ["使う場面", "DB・Redis・nginx など出来合いの部品", "自分のアプリ（backend・frontend）"],
          ["更新", "pull で取り直す", "コードを変えたら --build で作り直す"],
        ]}
      />
      <Callout variant="warn" title="コードを直したのに反映されない">
        <Cmd>build:</Cmd> のイメージは一度作るとキャッシュされ、<Cmd>up</Cmd> だけでは作り直されません。コードを変えたら <Cmd>docker compose up -d --build</Cmd> を使います。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "寿命・技術・スケールが違うものだけ役割で分ける（front/back/DB/cache が典型）",
          "docker run の4痛み（オプション地獄・起動順・通信・再現性）を compose が解決",
          "compose は宣言的（what）。ファイルに残るので再現・レビュー・Git 管理できる",
          "YAML はインデントで階層。タブ禁止、文字列はクォートで真偽値の罠を回避",
          "既製部品は image:、自作アプリは build:。コード変更後は --build",
        ]}
      />
    </>
  );
}

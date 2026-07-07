import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "compose-multi-service",
  title: "複数サービスを束ねる — 通信・DB・healthcheck・リバースプロキシ",
  description: "front/back を API で分ける境界、サービス名によるコンテナ間通信、DB とキャッシュの役割分担、healthcheck での起動順序、.env での秘密分離、nginx リバースプロキシと本番向けの仕上げまで。5サービスを1コマンドで動かす。",
  domain: "infra",
  section: "container",
  order: 5,
  level: "practice",
  tags: ["docker-compose", "コンテナ間通信", "healthcheck", "リバースプロキシ"],
  updated: "2026-07-07",
  minutes: 14,
};

export default function Article() {
  return (
    <>
      <Lead>
        「ひとこと掲示板」を題材に、フロント・バック・DB・キャッシュ・nginx の5サービスを1枚の <Cmd>docker-compose.yml</Cmd> で束ねます。最初は数行から始め、サービスを1つ足すたびに設計判断を1つ学びます。
      </Lead>

      <Section>front と back を分ける — 境界で考える</Section>
      <p>
        初心者がいちばん混乱するのが front と back の境目です。ここを<strong>「HTTP と JSON という約束（＝API）で喋る2つのサービス」</strong>と捉えると一気に楽になります。レストランでいえば、お客さん（ブラウザ）と話すホール係（frontend）が、注文票（API）を厨房（backend）に通す関係です。
      </p>
      <Figure
        src="/learn/infra/front-back-boundary.svg"
        alt="front と back が API（HTTP+JSON）という約束だけで繋がり、互いの中身を知らなくてよいことを示す図"
        caption="GET /api/messages を送れば一覧が返る——その形さえ守れば、中身（DB 構造やロジック）は互いに知らなくていい。"
      />
      <Callout variant="danger" title="front から直接 DB を触りたくなる罠">
        「backend 経由は面倒。front から直接 PostgreSQL に繋げば速いのでは？」——front はブラウザで動くので<strong>DB のパスワードがユーザーに丸見え</strong>になります。必ず <Cmd>front → backend(API) → DB</Cmd> の順に経由し、DB に触れるのは backend だけ、という境界を守ります。
      </Callout>

      <Section>コンテナ間通信 — サービス名がホスト名になる</Section>
      <p>
        この章最大のヤマです。<Cmd>docker compose up</Cmd> はプロジェクト専用の仮想ネットワークを自動で作り、全サービスをそこに繋ぎます。そのネットワークの中では<strong>「サービス名」がそのまま「ホスト名」</strong>として使えます。だから backend は IP を知らずに、ただ <Cmd>postgres</Cmd> という名前で DB に繋げます。
      </p>
      <Figure
        src="/learn/infra/compose-network.svg"
        alt="compose が作る仮想ネットワーク内でサービス名がホスト名になり、backend が postgres:5432 で届く図"
        caption="仮想ネットワークの中では、サービス名がホスト名になる。backend は postgres:5432 と書くだけで DB に届く。"
      />
      <Code lang="yaml" filename="~/myapp/docker-compose.yml（postgres を追加）">{`services:
  backend:
    build: ./api-python
    environment:
      DB_HOST: postgres          # ← サービス名を“ホスト名”として書く
      DB_NAME: board
      DB_USER: app
      DB_PASSWORD: devsecret     # 仮。あとで .env に移す
    ports:
      - "8000:8000"
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: board
      POSTGRES_USER: app
      POSTGRES_PASSWORD: devsecret
    volumes:
      - pg_data:/var/lib/postgresql/data          # named volume（消えない）
      - ./db/init:/docker-entrypoint-initdb.d:ro  # 初回だけ実行される初期化SQL
volumes:
  pg_data:`}</Code>
      <Callout variant="danger" title="localhost は「隣」ではなく「自分」">
        「backend から DB へ」だからと <Cmd>DB_HOST: localhost</Cmd> と書くと<strong>必ず失敗</strong>します。コンテナの中の <Cmd>localhost</Cmd> は「そのコンテナ自身」を指すからです。隣のサービスは<strong>名前</strong>（<Cmd>postgres</Cmd>）で呼びます。
      </Callout>
      <Figure
        src="/learn/infra/localhost-trap.svg"
        alt="コンテナ内の localhost は自分自身を指し、隣のサービスは名前で呼ぶ必要があることを示す図"
        caption="backend の localhost に DB はいない。隣のサービスはサービス名で呼ぶ。"
      />

      <SubSection>公開（ports）と内部通信は別もの</SubSection>
      <p>
        「backend には <Cmd>ports</Cmd> を付けたのに、なぜ postgres には付けないのか？」——<Cmd>ports</Cmd> は「ホストの外から中へ入る門」です。一方、コンテナ同士は同じネットワーク内なので、門を開けなくてもサービス名で直通します。だから <strong>DB には <Cmd>ports</Cmd> を付けない＝外から触れない＝安全</strong>。触れるのは内部の backend だけです。
      </p>
      <Figure
        src="/learn/infra/publish-vs-internal.svg"
        alt="ports は外から入る門、内部通信はネットワーク内でサービス名による直通であることを対比した図"
        caption="ports は外から入る「門」（公開）。内部通信は ports なしでサービス名で直通する。"
      />

      <Section>DB とキャッシュの役割分担</Section>
      <p>
        Redis を足して、<strong>「消えたら困るデータ」と「速くて消えてもいいデータ」</strong>を分けます。アプリのコンテナは使い捨て（stateless）が正しい姿で、投稿データは残す（stateful）もの。この2つを同居させず別サービスに切り出すのが定石です。
      </p>
      <Figure
        src="/learn/infra/stateless-vs-stateful.svg"
        alt="アプリは使い捨て(stateless)、データは残す(stateful)。状態を持つものは専用サービス＋volume に切り出す図"
        caption="アプリは何度でも作り直していい。状態を持つものは専用のサービス＋volume に切り出す。"
      />
      <ComparisonTable
        headers={["観点", "PostgreSQL（DB）", "Redis（キャッシュ）"]}
        rows={[
          ["置き場所", "ディスク（永続）", "メモリ（基本は揮発）"],
          ["役割", "真実の源（source of truth）", "高速化のための写し・一時的な数値"],
          ["消えたら", "致命的（投稿が失われる）", "平気（DB から作り直せる）"],
          ["掲示板での用途", "メッセージ本体の保存", "一覧のキャッシュ・閲覧数カウンタ"],
        ]}
      />
      <Figure
        src="/learn/infra/db-vs-cache.svg"
        alt="Postgres は金庫（遅いが正確・消えては困る）、Redis は付箋（高速・消えても再生成できる）とたとえた図"
        caption="Postgres は「金庫」＝真実の源。Redis は「付箋」＝消えても再生成できる使い方をする。"
      />
      <Callout variant="tip" title="キャッシュの3原則">
        ① 真実の源ではない（正解は必ず DB にある）。② 消えても再生成できる（だから volume 不要）。③ 無効化は自分の責任（元データが変わったら古い写しを <Cmd>delete</Cmd> する。忘れると「古い情報が出続ける」バグ）。Redis は <Cmd>--maxmemory</Cmd> と <Cmd>--maxmemory-policy allkeys-lru</Cmd> で上限を必ず付けます（未設定だと際限なく増える）。
      </Callout>

      <Section>起動順序と healthcheck — 「立った」と「使える」は違う</Section>
      <p>
        PostgreSQL はプロセスが立ち上がってから接続を受け付けるまで数秒かかります。その「まだ受付前」に backend が繋ぎに行くと落ちます。<Cmd>depends_on</Cmd> は「起動の順番」しか保証しないので、<Cmd>healthcheck</Cmd>（健康診断）と組み合わせます。
      </p>
      <Figure
        src="/learn/infra/depends-vs-healthcheck.svg"
        alt="depends_on だけでは起動した瞬間に繋いで失敗しうるが、healthcheck で healthy を待てば確実に繋がる図"
        caption="healthcheck で「本当に受付 OK（healthy）」を待ってから backend を起こせば、確実に繋がる。"
      />
      <Code lang="yaml" filename="docker-compose.yml（healthcheck と依存）">{`  backend:
    depends_on:
      postgres:
        condition: service_healthy   # postgres が healthy になるまで待つ
      redis:
        condition: service_healthy
  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d board"]  # 受付できるか診断
      interval: 5s
      timeout: 3s
      retries: 5
  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]   # PONG が返れば健康`}</Code>
      <Callout variant="info" title="本筋はアプリ側のリトライ">
        healthcheck は起動時の事故を減らしますが万能ではありません。運用中に DB が一瞬切れることもある。堅牢なアプリは<strong>「繋がらなければ少し待って何度か試す」を自分の中に持つ</strong>のが本筋（12-Factor App の考え方）。<Cmd>restart: unless-stopped</Cmd> と合わせると自己修復します。
      </Callout>

      <Section>秘密情報を .env に切り離す</Section>
      <p>
        <Cmd>DB_PASSWORD: devsecret</Cmd> を compose に直書きするのは危険です。<strong>12-Factor App</strong>の「設定は環境変数に持て」に従い、<Cmd>.env</Cmd> に切り出します。compose は同じフォルダの <Cmd>.env</Cmd> を自動で読み、<Cmd>${"{VAR}"}</Cmd> を置き換えます。
      </p>
      <Figure
        src="/learn/infra/env-injection.svg"
        alt="秘密を .env に集約し compose が ${...} を置換して各コンテナに環境変数として注入する図。.env は Git に載せない"
        caption="秘密は .env に集約 → compose が ${...} を置換 → 各コンテナに注入。.env 自体は Git に載せない。"
      />
      <Code lang="yaml" filename="docker-compose.yml と .env">{`# ~/myapp/.env（絶対に Git に載せない）
DB_PASSWORD=change-me-to-a-long-random-string

# docker-compose.yml
  backend:
    environment:
      DB_PASSWORD: \${DB_PASSWORD}      # ← .env から注入
  postgres:
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD} # ← 同じ値を参照`}</Code>
      <Callout variant="danger" title="秘密は事故が多い">
        GitHub に <Cmd>.env</Cmd> を一度でも push すると、後で消しても履歴に残り続けます（ボットが公開リポジトリを常時スキャンしています）。うっかり上げた秘密は「漏れた」とみなして即座に無効化・再発行を。<Cmd>.gitignore</Cmd> に <Cmd>.env</Cmd> を書き、値を空にした <Cmd>.env.example</Cmd> だけコミットするのが鉄則です。
      </Callout>

      <Section>nginx を「振り分け役」に — リバースプロキシ</Section>
      <p>
        frontend を足すと、表（frontend :8080）と裏（backend :8000）で入口が2つに割れます。前段に nginx を置き、<Cmd>/</Cmd> は frontend へ、<Cmd>/api</Cmd> は backend へ振り分けると、<Cmd>http://サーバー/</Cmd> という1つの入口だけで掲示板が完成します。大きな建物の受付と同じ発想です。
      </p>
      <Figure
        src="/learn/infra/reverse-proxy.svg"
        alt="nginx が唯一の入口(:80)になり / は frontend、/api は backend へ振り分ける図"
        caption="nginx が唯一の入口になり、URL のパスを見て裏のサービスへ取り次ぐ。ブラウザからはすべて同じ場所に見える。"
      />
      <Code lang="nginx" filename="~/myapp/nginx/nginx.conf">{`events {}
http {
  server {
    listen 80;
    location /api/ {
      proxy_pass http://backend:8000;   # ← サービス名で行き先を指定
      proxy_set_header Host $host;
    }
    location / {
      proxy_pass http://frontend:80;
    }
  }
}`}</Code>
      <Callout variant="warn" title="proxy_pass の末尾スラッシュに注意">
        <Cmd>proxy_pass http://backend:8000/;</Cmd> と<strong>末尾スラッシュ</strong>を付けると <Cmd>/api/</Cmd> が削られて <Cmd>/messages</Cmd> に化け、404 になります。スラッシュ無しならパスがそのまま渡ります。外に晒すのは nginx の <Cmd>:80</Cmd> だけにして、front/back の <Cmd>ports</Cmd> は削除します（門は最小限に）。
      </Callout>

      <Section>本番に向けた仕上げ</Section>
      <p>1台の VPS で長く安定して動かすため、完成版 compose には次を入れます。</p>
      <ul>
        <li><strong>リソース制限</strong>：<Cmd>mem_limit</Cmd> / <Cmd>cpus</Cmd> で1サービスの暴走を隔離し、共倒れを防ぐ（DB は厚め・nginx や redis は小さめ）</li>
        <li><strong>ネットワーク隔離</strong>：<Cmd>edge</Cmd>（外向き）と <Cmd>internal</Cmd>（外に出ない）に分け、backend だけ両方に所属。frontend が乗っ取られても DB に手が届かない</li>
        <li><strong>ログのローテーション</strong>：<Cmd>json-file</Cmd> の <Cmd>max-size</Cmd> / <Cmd>max-file</Cmd> でディスクフルを防ぐ</li>
        <li><strong>本番サーバー</strong>：Flask の <Cmd>app.run()</Cmd> は開発用。本番は <Cmd>gunicorn</Cmd> に置き換える</li>
        <li><strong>profiles</strong>：バックアップのように、常駐せず必要な時だけ走らせる「オンデマンド枠」</li>
      </ul>
      <Figure
        src="/learn/infra/network-layers.svg"
        alt="edge と internal の2ネットワークに分け、backend だけを両方に所属させて DB/cache を隔離する図"
        caption="edge（外向き）と internal（外に出ない）に分け、backend だけを橋渡しにする。nginx や frontend から DB へは直接届かない。"
      />
      <Figure
        src="/learn/infra/final-architecture.svg"
        alt="nginx を入口に frontend/backend、その奥に postgres と redis が協調する完成構成図"
        caption="1枚の compose から生まれた5サービス。閲覧数は Redis、メッセージ本体は PostgreSQL に入り、この1画面の裏で協調している。"
      />

      <Divider />

      <Quiz
        question="compose のネットワーク内で backend から postgres に繋ぐとき、DB_HOST に指定すべき値は？"
        options={[
          <>サービス名 <Cmd>postgres</Cmd></>,
          <><Cmd>localhost</Cmd></>,
          <>postgres コンテナの IP アドレスを毎回調べて指定</>,
          <><Cmd>127.0.0.1</Cmd></>,
        ]}
        answer={0}
        explanation={<>同じ compose ネットワーク内では<strong>サービス名がホスト名</strong>になります。<Cmd>localhost</Cmd> / <Cmd>127.0.0.1</Cmd> は「backend 自身」を指すので失敗します。IP は再起動で変わるため、名前で繋ぐのが正解です。</>}
      />

      <KeyPoints
        items={[
          "front/back は API（HTTP+JSON）という境界で分ける。DB に触るのは backend だけ",
          "同じ compose ネットワーク内はサービス名で通信。localhost は自分を指す罠",
          "ports は外への門。DB は ports を付けず内部通信のみ＝非公開で安全",
          "DB は永続(金庫)、Redis はキャッシュ(付箋)。healthcheck で受付完了を待つ",
          "秘密は .env に外出し、入口は nginx だけ。リソース制限・網隔離・gunicorn で本番化",
        ]}
      />
    </>
  );
}

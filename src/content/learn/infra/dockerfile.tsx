import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "dockerfile",
  title: "Dockerfile — 自分のイメージを作り、本番向けに仕上げる",
  description: "Dockerfile でイメージを build し、レイヤーキャッシュを効かせる。USER で非 root 化、restart ポリシーでの運用、そしてマルチステージビルドでイメージを小さく・安全にするまで。",
  domain: "infra",
  section: "container",
  order: 3,
  level: "basic",
  tags: ["Dockerfile", "build", "非root", "マルチステージ"],
  updated: "2026-07-07",
  minutes: 11,
};

export default function Article() {
  return (
    <>
      <Lead>
        ここまでは他人のイメージ（nginx）を使うだけでした。<Cmd>Dockerfile</Cmd> はイメージの<strong>レシピ</strong>です。これを書いて <Cmd>docker build</Cmd> すると、自分専用のイメージが出来上がります。
      </Lead>

      <Section>最初の Dockerfile</Section>
      <p>HTML をイメージの中に焼き込み、どこでも同じ内容が出る自己完結イメージを作ります。</p>
      <Code lang="docker" filename="~/my-site/Dockerfile">{`# ベースイメージ（土台）を指定
FROM nginx:1.27-alpine
# ホストの html/ をイメージ内の公開ディレクトリにコピー
COPY ./html /usr/share/nginx/html
# このコンテナが 80 番を使うという宣言（ドキュメント目的）
EXPOSE 80`}</Code>
      <Code lang="bash" filename="サーバー上で実行">{`# -t で 名前:タグ、最後の . は Dockerfile のある場所（ビルドコンテキスト）
docker build -t my-site:1.0 .
docker run -d --name my-site -p 8080:80 my-site:1.0`}</Code>
      <SubSection>主な Dockerfile 命令</SubSection>
      <KVList
        items={[
          { key: <Cmd>FROM</Cmd>, val: "土台にするベースイメージ。必ず最初に書く" },
          { key: <Cmd>WORKDIR</Cmd>, val: "以降の作業ディレクトリ（cd 相当）" },
          { key: <Cmd>COPY</Cmd>, val: "ホストのファイルをイメージ内にコピー" },
          { key: <Cmd>RUN</Cmd>, val: "ビルド時にコマンドを実行（apt install など）" },
          { key: <Cmd>EXPOSE</Cmd>, val: "使用ポートの宣言（実際の公開は -p）" },
          { key: <Cmd>CMD</Cmd>, val: "コンテナ起動時に実行する既定コマンド" },
        ]}
      />
      <Figure
        src="/learn/shots/infra/dockerfile-01.svg"
        alt="docker build を2回目に実行したログ。各ステップに CACHED と表示され、ビルドが数秒で終わっている"
        caption="2回目のビルド。変更のないステップに CACHED が付き、そこは再実行されないのでビルドが一気に速くなる。"
      />
      <Callout variant="tip" title="レイヤーキャッシュを効かせる COPY の順序">
        各命令が1レイヤーになり、Docker は変わっていないレイヤーをキャッシュして再利用します。だから「変わりにくいもの → 変わりやすいもの」の順に書くとビルドが速くなります。Node アプリなら <Cmd>COPY package*.json ./</Cmd> → <Cmd>RUN npm ci</Cmd>（依存は滅多に変わらない）を先に、<Cmd>COPY . .</Cmd>（ソースは頻繁に変わる）を後に。
      </Callout>
      <Callout variant="info" title=".dockerignore を置く">
        <Cmd>.gitignore</Cmd> と同じ発想で、<Cmd>COPY . .</Cmd> のときに不要物や秘密（<Cmd>.git</Cmd> / <Cmd>node_modules</Cmd> / <Cmd>.env</Cmd> / <Cmd>*.log</Cmd>）をイメージに入れないようにします。
      </Callout>

      <Section>非 root で動かす</Section>
      <p>
        多くの公式イメージはデフォルトでコンテナ内 root（UID 0）でプロセスを動かします。アプリに脆弱性があり攻撃者が侵入した場合、<strong>コンテナ内 root はホスト侵害（コンテナ脱出）の足がかりになりやすい</strong>。アプリ専用の非特権ユーザーで動かせば被害を一段抑えられます。
      </p>
      <Code lang="docker" filename="~/api-python/Dockerfile">{`FROM python:3.12-slim
WORKDIR /app
# 依存を先にコピー → install（レイヤーキャッシュ）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
# UID 1001 の非特権ユーザーを作成して切り替える
RUN useradd --create-home --uid 1001 appuser
USER appuser
EXPOSE 8000
CMD ["python", "app.py"]`}</Code>
      <Callout variant="info" title="UID を数字で指定する意味（前章の回収）">
        ユーザー管理の章で「コンテナ内のファイル権限は UID で管理される」と学びました。<Cmd>--uid 1001</Cmd> と数字で指定したのはそのため。前章で作った <Cmd>deploy</Cmd> は UID 1001 なので、このコンテナが bind mount 経由で書き出すファイルはホストの deploy と同じ UID になり、権限がすれ違いません。名前が別物でも<strong>UID という数字が一致</strong>していれば権限は通ります。
      </Callout>
      <Callout variant="warn" title="非 root にしたら書き込めなくなった">
        <Cmd>USER</Cmd> に切り替える<strong>前</strong>のディレクトリは root 所有です。書き込みが要る場所は <Cmd>USER</Cmd> の前に <Cmd>RUN chown -R appuser:appuser /app</Cmd> で渡すか、書き込み先を named volume にします。読み取りだけの場所は root 所有のままで問題ありません。
      </Callout>

      <Section>ライフサイクルと再起動ポリシー</Section>
      <Figure
        src="/learn/infra/container-lifecycle.svg"
        alt="run/start/stop/rm でコンテナの状態を行き来し、rm すると書き込み可能層も消えることを示す図"
        caption="run / start / stop / rm がコンテナの状態を行き来させる。rm すると書き込み可能層も消える。"
      />
      <Code lang="bash" filename="サーバー上で実行">{`docker logs -f web        # ログをリアルタイムで追う
docker exec -it web sh    # コンテナ内でシェルを起動して中を歩く
docker inspect web        # 全設定を JSON で（困ったらまずこれ）
docker stats              # CPU・メモリ使用量をリアルタイム表示
# 手動 stop 以外は常に立て直す（実運用の定番）
docker run -d --name web --restart unless-stopped -p 8080:80 nginx:1.27-alpine`}</Code>
      <ComparisonTable
        headers={["restart ポリシー", "挙動"]}
        rows={[
          ["no", "自動再起動しない（デフォルト）"],
          ["on-failure", "異常終了したときだけ再起動"],
          ["always", "常に再起動"],
          ["unless-stopped", "手動 stop 以外は再起動（推奨）"],
        ]}
      />
      <Callout variant="info" title="systemd の .service を書かずに済む">
        前章で「アプリを systemd でデーモン化」と学びましたが、Docker なら <Cmd>--restart unless-stopped</Cmd> で済みます。Docker デーモン自体を systemd が起動し、そのデーモンが restart ポリシーに従って各コンテナを立て直すからです。
      </Callout>

      <Section>マルチステージビルド — 小さく・安全に</Section>
      <p>
        素朴に1段でビルドすると、ビルドにしか使わない物（開発用依存・ビルドツール・フルの Node ベース）が最終イメージに丸ごと残り、1GB を超えることも珍しくありません。<strong>マルチステージビルド</strong>は、1つの Dockerfile に複数の <Cmd>FROM</Cmd>（ステージ）を書き、ビルド用ステージで作った成果物だけを本番用ステージにコピーします。
      </p>
      <Figure
        src="/learn/infra/multistage.svg"
        alt="builder ステージで作った成果物だけを COPY --from で小さな runner ステージに移し、道具は破棄する図"
        caption="builder ステージ（道具入り・約1GB）はビルド後に丸ごと破棄。COPY --from で成果物だけを小さな runner ステージへ。"
      />
      <Code lang="docker" filename="Dockerfile（マルチステージ）">{`# ---- builder ステージ：ビルド専用（最終イメージには残らない）----
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                 # 全依存（dev 含む）
COPY . .
RUN npm run build          # dist/ を生成

# ---- runner ステージ：本番で動く本体 ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev      # 本番依存だけ
COPY --from=builder /app/dist ./dist   # builder から成果物だけ持ってくる
RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]`}</Code>
      <Figure
        src="/learn/shots/infra/dockerfile-02.svg"
        alt="docker images の実行結果。1段ビルドのイメージとマルチステージのイメージが並び SIZE の桁が違う"
        caption="同じアプリを1段ビルドとマルチステージで作った結果。SIZE 列を並べると削減幅がそのまま数字で見える。"
      />
      <Callout variant="info" title="なぜ install を2回やるのか">
        builder 側の <Cmd>node_modules</Cmd> には開発用依存が混ざっています。それを本番に持ち込みたくないので、builder の node_modules は捨て、runner で <Cmd>--omit=dev</Cmd> して本番依存だけ入れ直します。builder からコピーするのは<strong>ビルド結果（dist/）だけ</strong>。サイズが 1/9 になることもよくあります。
      </Callout>
      <Callout variant="tip" title="1イメージのベストプラクティス">
        ベースを軽く（alpine/slim）／タグを pin／マルチステージ／<Cmd>.dockerignore</Cmd>／<Cmd>USER</Cmd> で非 root／キャッシュ順序／秘密を焼かない（実行時に渡す）／1コンテナ1役。「小さくする」は見た目でなく、セキュリティ・速度・コストの話です。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Dockerfile はイメージのレシピ。docker build で自作イメージを作る",
          "レイヤーキャッシュを効かせるため『変わりにくい物を先に COPY』",
          "USER で非 root 化。UID を数字で揃えると bind mount の権限がすれ違わない",
          "restart: unless-stopped で systemd の .service なしに自動再起動",
          "マルチステージで成果物だけ残し、イメージを小さく・安全にする",
        ]}
      />
    </>
  );
}

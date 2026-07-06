import type { LearnMeta } from "../../../lib/learnCategories";
import {
  Lead,
  Section,
  SubSection,
  Callout,
  Code,
  Cmd,
  Bridge,
  Steps,
  Step,
  KeyPoints,
  ComparisonTable,
  KVList,
  TipBox,
  Divider,
} from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "nextjs",
  title: "Next.js — React のフルスタックフレームワーク",
  description:
    "React 上に構築されたフルスタック FW。App Router、Server/Client Components、レンダリング方式、API Routes、Server Actions を理解する。",
  domain: "web",
  section: "frontend",
  order: 18,
  level: "basic",
  tags: ["Next.js", "React", "SSR"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Next.js</strong> は、React の上に構築された
        <strong>フルスタックフレームワーク</strong>
        です。React 単体では別ライブラリで補う必要があったルーティング・レンダリング戦略・データ取得・サーバ処理までを一式提供し、
        「フロントエンドとバックエンドを 1 つのプロジェクトで書ける」のが最大の特徴です。
      </Lead>

      <Section>Next.js とは何か</Section>
      <p>
        React は「UI を描くライブラリ」であり、それ単体ではページ遷移やサーバサイドレンダリング、API サーバの機能を持ちません。Next.js はそこを埋める
        <strong>メタフレームワーク</strong>で、Vercel 社が開発しています。
      </p>
      <KVList
        items={[
          { key: "土台", val: "React（コンポーネント・フック・JSX はそのまま使える）" },
          { key: "ルーティング", val: "ファイル/フォルダ構成がそのまま URL になる（App Router）" },
          { key: "レンダリング", val: "SSR / SSG / ISR / CSR を用途ごとに選べる" },
          { key: "バックエンド", val: "Route Handlers・Server Actions でサーバ処理も同居できる" },
        ]}
      />

      <Section>Next.js を分散システムとして捉える</Section>
      <p>
        Next.js の設計を一段深く理解する鍵は、これを<strong>「計算をどこで実行するかを決める枠組み」</strong>として見ることです。ブラウザ（クライアント）と Vercel などのサーバは、ネットワークを挟んで協調する<strong>分散システム</strong>を構成しています。ある処理をサーバで走らせるか、ブラウザで走らせるか——この<strong>計算配置（computation placement）</strong>の決定こそ、Next.js が開発者に握らせている本質です。
      </p>
      <KVList
        items={[
          { key: "サーバ側の得意", val: "DB への直アクセス、秘密鍵の保持、重い計算。クライアントに渡さず済むデータを扱える。" },
          { key: "クライアント側の得意", val: "クリック・入力・アニメーションなど、ユーザーの手元で即座に反応すべき対話。" },
          { key: "境界を越えるコスト", val: "両者の間はネットワーク。往復するたびにレイテンシ（遅延）が乗る。" },
        ]}
      />
      <Bridge course="分散システム / ネットワーク">
        座学の分散システムで習う「どのノードに計算を置くか」「データの局所性（locality）を高めて通信を減らす」という発想が、そのまま Server / Client Components の使い分けです。DB に近いサーバでデータを整形してから最小の HTML だけ送るのは、分散処理の「計算をデータのそばへ動かす（move computation to data）」原則の実演。RSC（React Server Components）は、この配置の境界を<strong>コンポーネント単位</strong>まで細かくした仕組みだと捉えると腑に落ちます。
      </Bridge>

      <Section>なぜ React に乗せるのか</Section>
      <p>
        React の学び方や書き方を活かしつつ、実アプリに必要な「足りない部分」を補えるからです。素の React で SPA を作ると、次のような課題に直面します。
      </p>
      <ul>
        <li>初回表示が遅い（JS を全部ダウンロードしてから描画するため）</li>
        <li>SEO に弱い（クローラが空の HTML を見てしまいやすい）</li>
        <li>ルーティング・データ取得・ビルド最適化を自前で組む手間</li>
      </ul>
      <p>
        Next.js はサーバ側であらかじめ HTML を生成し、ルーティングやコード分割を自動化することで、これらをまとめて解決します。React の知識がそのまま資産になるのが乗せる理由です。
      </p>

      <Section>App Router — ファイルベースルーティング</Section>
      <p>
        現在の標準は <Cmd>app/</Cmd> ディレクトリを使う <strong>App Router</strong> です。フォルダ構成が URL に対応し、<Cmd>page.tsx</Cmd> がその経路の画面になります。
      </p>
      <Code lang="text" filename="ディレクトリ構成">{`app/
  page.tsx            ->  /
  about/
    page.tsx          ->  /about
  blog/
    [slug]/
      page.tsx        ->  /blog/:slug（動的ルート）
  layout.tsx          ->  全ページ共通レイアウト`}</Code>
      <p>
        <Cmd>layout.tsx</Cmd> は共通の外枠（ヘッダー・フッター等）、<Cmd>[slug]</Cmd> のような角括弧フォルダは動的ルートを表します。ルーティング設定を別途書く必要はありません。
      </p>

      <Section>Server Components と Client Components</Section>
      <p>
        App Router のコンポーネントは<strong>デフォルトで Server Component</strong>です。サーバ上でだけ実行され、その結果の HTML がクライアントに届きます。ブラウザに送る JavaScript を減らせるのが利点です。
      </p>

      <FlowChain
        nodes={[
          { label: "リクエスト", variant: "alt" },
          { label: "Server Components", sub: "サーバーで実行" },
          { label: "HTML/RSC を送信" },
          { label: "ブラウザで hydration", variant: "cta" },
        ]}
        caption="サーバーで描画し、クライアントで対話可能に"
      />

      <SubSection>使い分け</SubSection>
      <ComparisonTable
        headers={["観点", "Server Component（既定）", "Client Component"]}
        rows={[
          ["実行場所", "サーバのみ", "サーバ + ブラウザ"],
          ["宣言", "何も書かない（既定）", <Cmd key="uc">"use client"</Cmd>],
          ["得意なこと", "DB 直アクセス / 秘密情報 / 重い処理", "状態・イベント・ブラウザ API"],
          ["useState / onClick", "使えない", "使える"],
          ["送る JS", "少ない（0 に近い）", "そのぶん増える"],
        ]}
      />
      <p>
        インタラクション（クリック・入力・<Cmd>useState</Cmd>・<Cmd>useEffect</Cmd>）が必要なコンポーネントの先頭にだけ、次の 1 行を書いて Client Component にします。
      </p>
      <Code lang="tsx" filename="LikeButton.tsx">{`"use client";

import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? "Liked" : "Like"}</button>;
}`}</Code>
      <Callout variant="tip" title="設計の基本">
        まずは Server Component で作り、対話が必要な葉（末端）だけを Client Component に切り出すのが定石です。ページ全体を安易に <Cmd>"use client"</Cmd> にしない。
      </Callout>

      <Section>レンダリング方式</Section>
      <p>
        Next.js の強みは、ページごとに描画のタイミングを選べる点です（各方式の詳細は「レンダリングパターン」の章と対応します）。
      </p>
      <KVList
        items={[
          { key: "SSR（サーバサイドレンダリング）", val: "リクエストごとにサーバで HTML を生成。最新データや個別内容に強い。" },
          { key: "SSG（静的サイト生成）", val: "ビルド時に HTML を生成。ブログや LP など内容が固定のページに最速。" },
          { key: "ISR（増分静的再生成）", val: "SSG をベースに、一定時間ごとにバックグラウンドで再生成。静的の速さと更新性を両立。" },
          { key: "CSR（クライアントサイド）", val: "ブラウザ側で描画。ダッシュボードなど対話中心の画面向け。" },
        ]}
      />
      <p>
        4 つの方式の本質的な違いは<strong>「HTML をいつ・どこで計算するか」</strong>と<strong>「その結果をどれだけキャッシュできるか」</strong>の 2 軸に集約されます。ネットワークの授業で習う「計算コストとキャッシュのトレードオフ」を、ページ単位で選んでいるだけです。
      </p>
      <ComparisonTable
        headers={["方式", "HTML を作るタイミング", "キャッシュ性", "向くページ"]}
        rows={[
          ["SSG", "ビルド時（1 回）", "非常に高い（CDN 配信）", "内容が固定の LP・ドキュメント"],
          ["ISR", "ビルド時 + 定期再生成", "高い（期限付きキャッシュ）", "更新頻度が中程度のブログ・商品一覧"],
          ["SSR", "リクエストごと", "低い（都度生成）", "ログイン後・在庫など最新性が要る画面"],
          ["CSR", "ブラウザで実行時", "静的殻はキャッシュ可", "管理画面・対話中心のダッシュボード"],
        ]}
      />
      <Bridge course="ネットワーク / OS（キャッシュ）">
        SSG/ISR で HTML を CDN にキャッシュするのは、ネットワークで習う「エッジキャッシュでオリジンへの往復を減らし、レイテンシを下げる」話そのもの。ISR の <Cmd>revalidate</Cmd>（期限が切れたら再生成）は、キャッシュの<strong>TTL（Time To Live）</strong>と<strong>キャッシュ無効化（invalidation）</strong>の実装例です。「キャッシュ無効化はコンピュータサイエンスの二大難問の一つ」という格言が、なぜレンダリング方式選びが悩ましいのかを言い当てています。<Cmd>stale-while-revalidate</Cmd>（古い値を返しつつ裏で更新）という HTTP キャッシュ戦略まで、そのまま ISR の挙動と対応します。
      </Bridge>
      <Callout variant="warn" title="レンダリング方式でハマりやすい点">
        <ul>
          <li><strong>全ページを SSR にする</strong> — 都度生成はサーバ負荷とレイテンシが最大。静的にできるページまで SSR にすると、キャッシュの利点を捨てることになる。</li>
          <li><strong>ISR の期限を短くしすぎる</strong> — <Cmd>revalidate</Cmd> を数秒にすると、ほぼ SSR と変わらず再生成が頻発する。更新頻度の実態に合わせる。</li>
          <li><strong>個人情報を SSG/ISR に載せる</strong> — 静的キャッシュは全員で共有される。ユーザー固有の内容をキャッシュすると別人に見えてしまう事故につながる。</li>
        </ul>
      </Callout>

      <Section>データフェッチ</Section>
      <p>
        Server Component の中では、コンポーネントを <Cmd>async</Cmd> 関数にして直接 <Cmd>await</Cmd> でデータを取得できます。API のためのラッパーや <Cmd>useEffect</Cmd> は不要です。
      </p>
      <Code lang="tsx" filename="app/posts/page.tsx">{`async function PostsPage() {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 }, // 60 秒ごとに再取得（ISR 相当）
  });
  const posts = await res.json();
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}`}</Code>
      <p>
        <Cmd>fetch</Cmd> のオプション（<Cmd>cache</Cmd> / <Cmd>revalidate</Cmd>）で、そのデータを静的に扱うか・どれくらいの頻度で更新するかを制御します。これがそのままレンダリング方式の切り替えにもなります。
      </p>

      <Section>バックエンド機能 — Route Handlers と Server Actions</Section>
      <p>
        ここが「フルスタック」と呼ばれる核心です。Next.js は画面だけでなく、<strong>サーバ側の処理</strong>も同じプロジェクト内に書けます。
      </p>

      <SubSection>Route Handlers（API エンドポイント）</SubSection>
      <p>
        <Cmd>app/api/</Cmd> 配下に <Cmd>route.ts</Cmd> を置くと、HTTP メソッドに対応した API を作れます。従来の Pages Router では API Routes と呼ばれていた機能の後継です。
      </p>
      <Code lang="ts" filename="app/api/hello/route.ts">{`export async function GET() {
  return Response.json({ message: "hello from the server" });
}

export async function POST(req: Request) {
  const body = await req.json();
  // ここで DB 保存などのサーバ処理を実行
  return Response.json({ ok: true, received: body });
}`}</Code>

      <SubSection>Server Actions（サーバ関数の直接呼び出し）</SubSection>
      <p>
        <Cmd>"use server"</Cmd> を付けた関数はサーバ上で実行され、フォームやクライアントから直接呼び出せます。API を明示的に作らずにサーバ処理を書けるのが特徴です。
      </p>
      <Code lang="tsx" filename="app/todo/page.tsx">{`async function addTodo(formData: FormData) {
  "use server";
  const title = formData.get("title");
  // サーバ側で DB に保存
  await db.todo.create({ data: { title: String(title) } });
}

export default function TodoPage() {
  return (
    <form action={addTodo}>
      <input name="title" />
      <button type="submit">追加</button>
    </form>
  );
}`}</Code>
      <Callout variant="info" title="純粋なバックエンドではなく「フルスタック」">
        Route Handlers や Server Actions で DB アクセス・認証・外部 API 連携までこなせますが、Next.js は
        <strong>あくまでフロントエンドと一体化したフルスタック FW</strong>
        であり、単体のバックエンド専用サーバ（Express や NestJS のような API 専業基盤）を完全に置き換えるものではありません。大規模で独立したバックエンドが必要な場合は、別途 API サーバを分離する構成も検討します。
      </Callout>

      <Section>デプロイ</Section>
      <p>Next.js は開発元の Vercel に最も相性よくデプロイできます。</p>
      <Steps>
        <Step title="リポジトリを接続">
          GitHub 等のリポジトリを Vercel に接続する。フレームワークは自動検出される。
        </Step>
        <Step title="ビルド設定は自動">
          <Cmd>next build</Cmd> が自動で実行され、SSG/SSR/ISR の振り分けや最適化もフレームワーク側が処理する。
        </Step>
        <Step title="Push で自動デプロイ">
          ブランチへの push ごとにプレビュー環境が作られ、本番反映まで CI/CD が回る。
        </Step>
      </Steps>
      <TipBox>
        Vercel 以外（自前サーバ・Docker・各種クラウド）でも <Cmd>next build</Cmd> + <Cmd>next start</Cmd> や静的書き出しで動かせます。Vercel は最適化が効くだけで、必須ではありません。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "Next.js は React の上に構築されたフルスタックフレームワーク（開発元は Vercel）",
          "App Router でフォルダ構成がそのまま URL になり、コンポーネントは既定で Server Component",
          "対話が必要な末端だけ \"use client\" で Client Component にするのが定石",
          "SSR / SSG / ISR / CSR をページ・データ単位で選べる。fetch の設定が切り替えの起点",
          "Route Handlers・Server Actions でバックエンド機能も持つが、純粋なバックエンドではなくフルスタック",
        ]}
      />
    </>
  );
}

import { Code, H4, Lead, Section, Sub, Table } from "../../components/works/kit";
import { Flow, Layers } from "../../components/works/motion";

export default function Article() {
  return (
    <>
      <Lead>
        4 ヶ月。ずっと書きたいと思っていた、初の個人開発プロダクトについての記事です。先日学内ハッカソンで発表する機会があり、自分の中で一区切りついたので、設計のあれこれをまとめておきます。
      </Lead>

      <Section id="overview" no="1">
        システム概要
      </Section>

      <p>
        「同人++（doujin++）」は、同人即売会（コミケ・コミティア・文学フリマ等）の参加者を対象にした、
        <strong>蔵書管理 + 買い物リスト + 会場 MAP ナビ + POS レジ</strong>を一体化した PWA です。
      </p>

      <p>
        買い手モードでは、サークルと頒布物の事前登録、巡回順のドラッグ並び替え、ナビモードでの「次の目的地」案内、購入後の本棚管理までをひとつのアプリで完結できます。売り手モードでは自サークルの頒布物登録と
        POS レジ（紙幣・硬貨ボタンでお釣り自動計算）まで対応しています。
      </p>

      <Section id="background" no="2">
        導入決定までの背景
      </Section>

      <Sub no="2-1">即売会当日の現状フロー</Sub>

      <p>僕自身が同人イベントに通っていて、当日のフローはだいたいこんな感じでした。</p>

      <Flow
        label="即売会の現状フローは、公式サイトから紙のマップを DL・印刷し、行きたいサークルに手書きでマーカーを付け、前日にスプレッドシートで購入リストを整理し、当日は紙とスマホを両手に会場を歩き回り、立ち寄ったサークルに手書きでチェックする。"
        steps={[
          { title: "紙のマップ", detail: "公式サイトから紙のマップを DL・印刷" },
          { title: "マーカー", detail: "行きたいサークルに手書きでマーカー" },
          { title: "購入リスト", detail: "前日にスプレッドシートで購入リストを整理" },
          { title: "会場を歩く", detail: "当日、紙とスマホを両手に会場を歩き回る" },
          { title: "チェック", detail: "立ち寄ったサークルに手書きチェック" },
        ]}
        caption="紙のマップの DL・印刷、手書きのマーカー、前日のスプレッドシート整理、当日の会場巡回、手書きチェックの 5 段階。"
      />

      <p>混沌と化した会場でペンと紙を出してメモメモ……果たして本当に出来るか？というのが出発点でした。</p>

      <Sub no="2-2">紙とスプレッドシートの限界</Sub>

      <Table
        head={["知りたいこと", "紙だと", "同人++ なら"]}
        rows={[
          ["買えた？ / 売り切れ？", "判別不能", "ステータスで一発管理"],
          ["いくら使った？", "暗算が必要", "リアルタイム集計"],
          ["次はどこへ行く？", "地図を広げて判断", "最短ルートを自動案内"],
          ["買った本をあとで探せる？", "記憶頼り", "本棚機能で完全管理"],
        ]}
      />

      <p>
        スマホは常に手元にあるのに、紙・ペンの用意、「買えた」「売り切れ」の区別、当日〜帰宅後の蔵書管理 —
        この間で文明の利器がほとんど活かされていませんでした。
      </p>

      <Sub no="2-3">市場としても十分大きいことを確認した</Sub>

      <p>ニッチに見えて、調べてみると想像以上に広いマーケットでした。</p>

      <Table
        head={["指標", "値"]}
        rows={[
          ["コミケ 1 回あたりの動員数", "15〜20 万人"],
          ["全国で年間に開催される即売会の数", "数百〜千以上"],
          ["ユーザーの利用頻度", "週 1 〜 複数回（高継続率）"],
          ["直接競合", "ゼロ（先行者優位）"],
        ]}
      />

      <p>
        「購入後の蔵書管理」に特化したアプリは既に存在していますが、
        <strong>購入前〜購入後を一気通貫でカバーするものはほぼ存在しない</strong>。ここが差別化の出発点になりました。
      </p>

      <Section id="architecture" no="3">
        技術的な構成
      </Section>

      <Sub no="3-1">フロントエンド</Sub>

      <p>React 19 + TypeScript 5 + Vite 7 + Tailwind CSS 4 で開発しました。</p>

      <ul>
        <li>
          <strong>React 19</strong>：並行レンダリングと Transitions、エコシステムの成熟度
        </li>
        <li>
          <strong>TypeScript 5</strong>：API レスポンス型から UI の Props 型まで一貫した型安全
        </li>
        <li>
          <strong>Vite 7</strong>：webpack と比べてビルドが 10 倍以上高速、HMR が即時反映
        </li>
        <li>
          <strong>Tailwind CSS 4</strong>：ユーティリティファーストで設計の一貫性、テーマも CSS 変数で完結
        </li>
      </ul>

      <H4>サーバー状態管理：TanStack Query</H4>

      <p>
        会場ではモバイル回線が混雑して API が不安定になりがちなので、サーバー状態管理は TanStack Query を採用しました。
      </p>

      <ol>
        <li>30 秒キャッシュ → 不要な API リクエストの削減</li>
        <li>
          <code>mutate + invalidate</code> → データ更新後の自動再取得
        </li>
        <li>楽観的更新 → UI が即時反応</li>
        <li>エラーリトライ → ネットワーク不安定な会場でも安定動作</li>
      </ol>

      <Code lang="ts">{`
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 1 },
  },
});
`}</Code>

      <H4>なぜ PWA にしたか — ドメインから逆算した技術選定</H4>

      <p>
        ネイティブアプリではなく PWA を選んだのは、<strong>「即売会」というドメインの特性から逆算した結果</strong>です。
      </p>

      <Table
        head={["観点", "PWA を選んだ理由"]}
        rows={[
          [
            "即時デプロイ",
            "即売会はイベント直前にニーズが急増する。App Store のレビューを 1 週間待っていたら開催日が終わってしまう。「審査を待つコスト」がドメインに対して致命的すぎた",
          ],
          ["インストール不要", "ストアアカウントすら不要で、参入障壁がゼロ"],
          ["ネイティブ同等 UX", "ホーム画面追加・オフライン対応・プッシュ通知まで実現可能"],
          ["マルチプラットフォーム", "iOS / Android / Windows をひとつのコードでカバー"],
        ]}
      />

      <p>
        「流行ってるから React Native」ではなく、「ドメインの制約上、審査の待ち時間が許容できないから
        PWA」というふうに、選定理由をドメイン側の言葉で説明できる形に持っていけたのが、自分の中では大きな前進でした。
      </p>

      <Sub no="3-2">バックエンド</Sub>

      <p>Node.js + Express 5 + TypeScript + Prisma ORM + PostgreSQL 16 で開発しました。</p>

      <H4>Prisma ORM の何が嬉しかったか</H4>

      <p>
        スキーマから DB 定義と TypeScript 型を<strong>同時生成</strong>してくれるので、こういうことが起きます。
      </p>

      <Code lang="prisma">{`
model Book {
  id       String  @id
  title    String
  isbn     String?
  coverUrl String?  // ← この行を追加した瞬間に型が更新される
}
`}</Code>

      <p>
        <code>coverUrl</code>{" "}
        を追加した瞬間、TypeScript が全参照箇所をチェックしてくれる。「DB
        変更を忘れてどこかでサービスが落ちる」というよくあるパターンを構造的に防げます。マイグレーション履歴もコード管理されるので、本番反映も{" "}
        <code>prisma migrate deploy</code> だけで済みます。
      </p>

      <Sub no="3-3">認証 — Firebase Authentication</Sub>

      <p>
        Email / パスワード + Google OAuth に対応しています。フロントで取得した ID トークンを Express
        側のミドルウェアで検証する構成です。
      </p>

      <Code lang="ts">{`
export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
`}</Code>

      <p>将来 LINE ログインを追加するときも、バックエンド側の変更はほぼゼロで済む設計にしています。</p>

      <Sub no="3-4">ストレージ — Cloudflare R2 を選んだ「金額」の理由</Sub>

      <p>
        会場 MAP 画像や書影など、画像系データの置き場が必要になりました。最初は AWS S3
        を検討していたのですが、結論として Cloudflare R2 を採用しました。理由は単純で、<strong>金額</strong>です。
      </p>

      <Table
        head={["サービス", "データ転送料"]}
        rows={[
          ["AWS S3", "$0.09 / GB"],
          ["Cloudflare R2", "$0.00"],
        ]}
      />

      <p>
        会場 MAP は 1
        ファイル数 MB で、画像を頻繁に取得する性質のアプリなので、転送料が真っ先に効いてきます。R2
        にしておけば「ユーザーが増えても転送料の心配がない」という構造になりました。
      </p>

      <p>
        加えて、Presigned URL を発行することで、ブラウザから R2 へ直接 PUT
        できます。バックエンドのメモリ・CPU を一切経由しない画像アップロードが実現できて、これも嬉しい副産物でした。
      </p>

      <Sub no="3-5">インフラ全体像</Sub>

      <Layers
        label="インフラ全体像は、ブラウザから HTTPS で Cloudflare CDN を通り、ConoHa VPS のホスト Nginx、Docker Compose の frontend・backend・db（PostgreSQL 16）へ進み、画像だけはブラウザから Cloudflare R2 へ presigned PUT で直接アップロードする。"
        boundary="ConoHa VPS（Ubuntu 22.04）"
        layers={[
          {
            title: "ブラウザ",
            link: "HTTPS",
            outside: true,
            aside: { title: "Cloudflare R2", detail: "画像を presigned PUT で直接アップロード" },
          },
          {
            title: "Cloudflare CDN",
            items: ["DDoS 保護", "HTTP/3", "静的アセット 1 年 immutable キャッシュ"],
            outside: true,
          },
          {
            title: "Nginx（host）",
            items: ["Let's Encrypt", "HTTP→HTTPS リダイレクト"],
          },
          {
            title: "frontend",
            detail: "Docker Compose",
            items: ["Nginx", "React build"],
            link: "/api/* をリバースプロキシ",
          },
          {
            title: "backend",
            detail: "Docker Compose",
            items: ["Express", "Prisma"],
          },
          {
            title: "db",
            detail: "Docker Compose",
            items: ["PostgreSQL 16"],
          },
        ]}
        caption="ブラウザからのリクエストは Cloudflare CDN、ConoHa VPS のホスト Nginx を経て Docker Compose 上の frontend・backend・db へ進み、画像だけはブラウザから Cloudflare R2 へ presigned PUT で直接送る。"
      />

      <p>
        frontend の Nginx が <code>/api/*</code> を backend
        へリバースプロキシしているので、ブラウザからは全て同一オリジンに見えて、CORS が発生しないようにしています。
      </p>

      <Section id="design-philosophy" no="4">
        設計思想
      </Section>

      <p>ここが一番、自分なりに考えたところでした。</p>

      <Sub no="4-1">「既存のやり方を全部取っ替え」ではなく、「既存をデジタルに置き換える」</Sub>

      <p>
        既存の紙のマップ +
        スプレッドシート運用は、確かに不便ではあるけれど、ユーザーが長年蓄積してきた資産でもあります。「全部新しくしたほうが便利ですよ！」というアプリは、便利でも移行コストが高すぎて結局誰も使ってくれません。
      </p>

      <p>
        なので、設計のスタンスを <strong>「既存の運用フローをそのままデジタルに置き換える」</strong>{" "}
        に振り切りました。
      </p>

      <p>
        具体的には、CSV / Excel
        インポート機能を最優先で実装しています。長年スプレッドシートで管理してきたデータをゼロから再入力する必要はない、というメッセージです。これは「機能要件の優先順位は、ドメイン理解から決まる」という体験そのものでした。
      </p>

      <Sub no="4-2">オフラインファーストからの軌道修正</Sub>

      <p>
        実は最初の要件定義書では、「クラウドを使用しない、ローカル DB のみ、運営費 0
        円」というオフラインファーストのアーキテクチャを目指していました。実際{" "}
        <code>feat: Firebase 依存を完全に除去</code> というコミットも履歴に残っています。
      </p>

      <p>
        ただ、開発を進めるうちに「マルチユーザー対応」「サークル間でのデータ共有」「ランディングページからの集客」を視野に入れるようになり、サーバー構成への転換を決めました。
      </p>

      <p>
        オフラインの良さ（会場で API が落ちてもアプリが真っ白にならない）は捨てたくなかったので、Service Worker +
        IndexedDB 書き込みキュー → オンライン復帰時に Last-Write-Wins で自動同期、という Phase 2
        をロードマップに残しています。CRDT は同人即売会のドメインに対して過剰設計だと判断しました。
      </p>

      <Sub no="4-3">ドメイン駆動設計（DDD）</Sub>

      <p>
        「即売会」というドメインをシステムの中心に据えて、サークル・頒布物・会場 MAP・買い物リストといったドメインオブジェクトを
        Prisma スキーマに直接対応させています。
      </p>

      <ul>
        <li>機能追加が容易：新機能はドメインに追加するだけ</li>
        <li>テスト可能：ドメインロジックを独立してテストできる</li>
        <li>スケーリング：DB スケールアップをアプリロジックに影響なく実施</li>
      </ul>

      <Section id="dev-process" no="5" toc="開発プロセスの工夫">
        開発プロセスの工夫 — AI エージェントを「PdM 的存在」として運用ループに組み込む
      </Section>

      <p>
        ここは技術スタックではなく、開発プロセスそのものの工夫です。個人的に一番効いたところでもあるので、独立して書きます。
      </p>

      <p>
        個人開発で一番つらかったのが「ユーザーフィードバックを受けてから実装するまでの導線」でした。フィードバックが
        Twitter の DM や Form の回答に散乱して、気付いたら忘れていた、というのを最初の方で何度かやってしまいました。
      </p>

      <p>そこで、Claude を使って フィードバック → タスク化 → 実装 を半自動化するループを組みました。</p>

      <Flow
        label="フィードバックから実装までのループは、ユーザーが Google Form に投稿したフィードバックを Notion DB に自動蓄積し、Claude Code が Notion コネクトで取得・分析して優先度・実装方針付きでタスク DB にタスク化し、Claude Code がそのまま実装する。"
        steps={[
          { title: "Google Form", detail: "ユーザーにフィードバックを投稿してもらう" },
          { title: "Notion DB", detail: "Form の回答を自動蓄積" },
          { title: "Claude Code", detail: "Notion コネクトで FB を取得・分析" },
          { title: "タスク DB", detail: "優先度・実装方針付きでタスク化" },
          { title: "コーディング", detail: "Claude Code がそのまま実装" },
        ]}
        note="実装したあとに届くフィードバックも、また 01 の Google Form から同じ流れに乗る（ループ）。"
        caption="ユーザーが Google Form に投稿したフィードバックを Notion DB に蓄積し、Claude Code が取得・分析してタスク DB にタスク化し、そのまま実装する。"
      />

      <p>
        ポイントは、Claude が<strong>「フィードバックを読み取ってタスクに落とす」工程を担っている</strong>
        ことです。「同じ要望が複数件あるか」「既存機能の延長か新規実装か」「セキュリティへの影響はあるか」を判断してタスク DB
        に整理してくれるので、僕はタスク DB の優先順だけを眺めればよくなりました。
      </p>

      <p>「個人開発なのに PdM と PG が分業しているような状態」が実現できて、これは想像以上に効いた工夫でした。</p>

      <Section id="security" no="6">
        セキュリティ
      </Section>

      <p>
        OWASP Top 10 に沿って{" "}
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          <code>docs/security-requirements.md</code>
        </a>{" "}
        を作成し、優先度付きで実装しました。
      </p>

      <p>実装済みのもの：</p>

      <ul>
        <li>
          Firebase ID トークン検証ミドルウェアで全 <code>/api</code> を保護
        </li>
        <li>
          <code>app.disable('x-powered-by')</code> でサーバー情報の露出を抑制
        </li>
        <li>
          <code>CORS_ORIGIN</code> 環境変数で本番オリジンを明示（ワイルドカード回避）
        </li>
        <li>Prisma 経由のパラメタライズドクエリで SQL インジェクション対策</li>
        <li>DB ポートを外部公開しない（Docker 内部ネットワークのみ）</li>
        <li>
          <code>.env.prod</code> を gitignore、Firebase Service Account は Base64 で環境変数注入
        </li>
        <li>
          Cloudflare 経由の <code>trust proxy</code> 設定で正しいクライアント IP を取得
        </li>
        <li>Let's Encrypt + HTTP→HTTPS リダイレクト、証明書の自動更新</li>
      </ul>

      <p>
        ロードマップ化された未対応項目（helmet・express-rate-limit・Zod バリデーション・HSTS
        など）も優先度付きで明文化しています。「全部やるぞ」ではなく「優先度を決めて段階的に対応するぞ」という設計を、セキュリティの領域でもやっておきたかったところです。
      </p>

      <Section id="others" no="7">
        その他
      </Section>

      <Sub no="7-1">開発期間とコミット履歴</Sub>

      <Table
        head={["項目", "値"]}
        rows={[
          ["期間", "2025-12-27 〜 2026-04-21（約 4 ヶ月）"],
          ["コミット数", "214"],
          ["マージされた PR", "67"],
          ["内訳", "feat 54 / fix 40 / chore 23 / docs 4 / refactor 3"],
        ]}
      />

      <p>
        <code>main</code> への直コミットは禁止して、<code>feature/*</code> <code>fix/*</code> <code>chore/*</code>{" "}
        のブランチ運用ルールを <code>CLAUDE.md</code>{" "}
        に明文化し、PR
        駆動で運用しました。個人開発でもブランチを切ることで「今何を直しているか」が明確になり、後から振り返りやすくなりました。
      </p>

      <Sub no="7-2">ハマったところ</Sub>

      <ul>
        <li>
          <strong>スマホ実機でカメラ API が動かなかった</strong>：ISBN バーコードスキャンに使っている{" "}
          <code>getUserMedia()</code> は HTTPS でしか動かない。<code>mkcert + vite-plugin-mkcert</code>{" "}
          でローカル CA を作ってユーザーキーチェーンに登録する手順までドキュメント化したのが地味に大変でした。
        </li>
        <li>
          <strong>
            会場 MAP 画像が <code>express.json</code> のデフォルト 100kb 制限を超える
          </strong>
          ：<code>limit: '50mb'</code> まで上げて、ホスト側 Nginx でも <code>client_max_body_size 60m</code>{" "}
          を設定。最終的には R2 への直接 PUT に切り替えました。
        </li>
        <li>
          <strong>Phase 2 のオフライン書き込みキューでの競合</strong>
          ：複数端末から同じサークルを更新する可能性があるので、Last-Write-Wins（<code>updatedAt</code>{" "}
          比較）を採用。CRDT は同人即売会のドメインに対して明らかに過剰でした。
        </li>
      </ul>

      <Sub no="7-3">今後の展開</Sub>

      <ul>
        <li>有料プラン（登録書数・買い物リストの制限解除）</li>
        <li>LINE ソーシャルログイン</li>
        <li>Service Worker でのオフライン対応（Phase 2）</li>
        <li>表紙画像の R2 移行（localStorage 容量制限の解消）</li>
        <li>公式カタログ API との連携で自動入力対応</li>
        <li>購入リスト忘れ物リマインダーのプッシュ通知</li>
      </ul>

      <Section id="closing" no="8">
        さいごに
      </Section>

      <p>最初の提案から 4 ヶ月。214 コミット、67 PR、学内ハッカソンでの発表で一区切りになりました。</p>

      <p>
        「紙とペンを両手に会場を歩き回る」という現状の不便さを、PWA
        という形でなんとかしたかっただけだったのですが、結果として React 19・Prisma・Cloudflare R2
        まで含む実運用のスタックを一通り触ることになりました。
      </p>

      <p>
        技術選定は「流行っているから」で決めるよりも、
        <strong>ドメインの制約から逆算したほうが自分の言葉で説明できる</strong>ということ —
        「審査を待つコストが致命的だから PWA」「転送料が効くから R2」「即売会の競合更新パターン的に Last-Write-Wins
        で十分」— これが、4 ヶ月で得た一番大きな収穫だったと思います。
      </p>

      <p>
        「同人活動のすべてをポケットの中に。」 —
        まだまだ未完成ですが、引き続き育てていきたいプロダクトです。ここまで読んでくださってありがとうございました。
      </p>
    </>
  );
}

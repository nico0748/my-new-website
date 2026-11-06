# GitHub の「Activity」の設定

トップの SKILLS と TIMELINE のあいだの **ACTIVITY** に、GitHub のコントリビューション（過去 1 年のヒートマップ）と、最近更新したリポジトリ（WORKS に載っていないもの 3 件）を出すための設定です。設定するまでは何も表示されません（セクションごと出ません）。

## 仕組み

- `api/github.js`（Vercel Function）が GitHub の GraphQL API v4 にクエリを 1 本だけ投げ（1 point）、表示に使う項目だけに絞って返します。
  - リポジトリ: 自分が持ち主の公開・非 fork・非アーカイブのものを最近 push した順に 30 件。返すのは名前・説明・URL・主な言語・最後に push した日（日本時間の日付）だけです。プロフィール README 用の `nico0748/nico0748` は除き、説明の絵文字（`:rocket:` のような略記も）は消します。
  - コントリビューション: 合計と、日ごとの件数・段階（GitHub の `contributionLevel` をそのまま 0〜4 に）。
  - 取らないもの: 言語の色、スター数、リポジトリの総数、リポジトリ名を含むコントリビューションの内訳、時刻。
- 画面側（`src/lib/github.ts` と `src/components/ui/GitHubActivity.tsx`）は、Projects シートの `repoUrl` に載っているリポジトリを除き、説明のあるものを優先して 3 件を選びます。
- 応答は CDN に 6 時間キャッシュし、取り直しのあいだは 1 週間まで古い値を出します（GitHub へのリクエストはリージョンごとに 6 時間に 1 回程度）。
- 失敗したとき（GitHub が 200 以外・GraphQL のエラー・ユーザーが見つからない・5 秒のタイムアウト）は **502 + `Cache-Control: no-store`** を返します。5xx はキャッシュされないので、CDN にある正常な値は空で上書きされず、古い値が出続けます。画面ではそのタブのあいだは取り直しません。
- トークンは Vercel の環境変数にだけ置き、ブラウザにもログにも出しません。**`VITE_` を付けないでください**（付けると JS に埋め込まれて公開されます）。
- 変数名は **`GITHUB_READ_TOKEN`** です。`GITHUB_TOKEN` は gh CLI や CI の権限の広いトークンを拾う恐れがあるので使いません。

## 手順（10 分ほど）

1. GitHub の **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token** を開く
   - Token name: 自由（例 `nico-labo748.dev activity`）
   - Resource owner: **nico0748**
   - Expiration: 期限を付ける（例 1 年。下の「期限の更新」に日付を書いておく）
   - Repository access: **Public repositories**（公開リポジトリの読み取りだけ）
   - Permissions: **何も足さない**
2. 作ったトークンを控える（チャットやリポジトリに貼らない。貼ってしまったらすぐ GitHub でそのトークンを Delete して作り直す）
   - fine-grained で取れないときは、**スコープに 1 つもチェックを入れない classic token**（Tokens (classic) → Generate new token (classic)）でも動きます。スコープ無しの classic token は公開情報の読み取りしかできません
3. Vercel の **Project → Settings → Environment Variables** に `GITHUB_READ_TOKEN` を登録する（Environment は **Production と Preview**）
4. 再デプロイする

## 確認

- 応答を見る（6 時間キャッシュされます）
  ```zsh
  curl -s https://nico-labo748.dev/api/github | head -c 600; echo
  curl -sI https://nico-labo748.dev/api/github | grep -iE '^(cache-control|x-vercel-cache)'
  ```
  `{"repos":[...],"calendar":{"total":...,"weeks":[...]}}` が返れば完了です。`jq` があれば `curl -s https://nico-labo748.dev/api/github | jq '.calendar.total, [.repos[].name]'` で合計とリポジトリ名だけ見られます。
- **合計の照合**: ブラウザの**ログアウト状態（シークレットウィンドウ）**で `https://github.com/nico0748` を開き、「○○ contributions in the last year」と `calendar.total` を比べます。
  - 同じなら正常です。トップの「過去 1 年 · ○○ 件」も同じ数になります。
  - プロフィールの **Contribution settings → Private contributions** をオンにしていると、非公開リポジトリでの活動も（リポジトリ名なしで）件数に入ります。オフなら公開リポジトリの分だけです。どちらにするかはプロフィールの設定で決め、サイトは GitHub が他人に見せている数に揃えます。
  - ログアウト状態の数より多いときは、トークンの権限が広すぎる可能性があります（Repository access が Public repositories になっているか確かめる）。

## 期限の更新

- 今のトークンの期限: **（作ったらここに日付を書く。例 2027-11-06）**
- 期限の 1 週間ほど前に GitHub からメールが届きます。手順 1〜4 で新しいトークンを作り、`GITHUB_READ_TOKEN` を差し替えて再デプロイし、古いトークンを Delete します。上の期限の日付も書き換えます。

## 空のとき・502 のとき

- `{"repos":[],"calendar":null}` が **200** で返る: `GITHUB_READ_TOKEN` が設定されていません（この応答は 5 分だけキャッシュされます）。環境変数を登録して再デプロイします。
- **502** が返る: Vercel の **Project → Logs**（Functions のログ）で `[github]` の行を見ます。
  - `graphql 401: GITHUB_READ_TOKEN が無効か期限切れの可能性があります` … トークンの期限切れ・削除・貼り間違い。上の「期限の更新」の手順で差し替えます
  - `graphql 403` … 上と同じか、権限不足・レート制限
  - `graphql errors: ...` / `graphql: user is null` … クエリかユーザー名（`api/github.js` の `LOGIN`）の問題
  - `TimeoutError` … GitHub の応答が 5 秒を超えた（一時的なものなら、次のアクセスで取り直されます）
  - 502 のあいだも、CDN に正常な値が残っていればそれが出続けます。
- 画面の ACTIVITY は、コントリビューションが 0 件ならヒートマップの欄を、WORKS 以外のリポジトリが無ければリポジトリの欄を出しません。両方無ければセクションごと出ません。

## 注意

- **デプロイのたびに CDN のキャッシュは消えます。** デプロイ直後の最初のアクセスで GitHub に取りに行きます。
- ローカルの `npm run dev` では関数が動かない（`/api/github` には JSON ではなく関数のソースがそのまま返る）ため、ACTIVITY は出ません。確かめたいときは `vercel dev` を使います（`GITHUB_READ_TOKEN` を `.env` か `vercel env pull` で用意する）。
- PWA の Service Worker は `/api/*` を index.html に差し替えません（`vite.config.ts` の `navigateFallbackDenylist`）。古い Service Worker が残っているブラウザでは、更新されるまで `/api/github` を直接開くと index.html が出ることがあります。

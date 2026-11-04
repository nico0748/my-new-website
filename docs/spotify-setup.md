# Spotify の「最近よく聴いている曲」の設定

トップの OFF-HOURS の「音楽」の箱に、直近 4 週間によく聴いている曲（最大 12 曲、explicit の曲は除外）を出すための設定です。設定するまでは何も表示されません（手入力の音楽の記録だけが出ます）。

## 仕組み

- `api/spotify.js`（Vercel Function）が Spotify Web API の `GET /v1/me/top/tracks?time_range=short_term` を呼び、曲名・アーティスト・ジャケット画像・曲の URL だけを返します。
- 権限は **`user-top-read` だけ** です。再生中の曲や再生履歴は取りません（いつ起きているかが分かってしまうため）。
- 応答は CDN に 1 日キャッシュするので、Spotify へのリクエストはリージョンごとに 1 日 1 回程度です。失敗したときは 5 分だけキャッシュし、空の配列を返します（画面では曲の欄が出ないだけ）。
- トークンは Vercel の環境変数にだけ置き、ブラウザには一切出しません。**`VITE_` を付けないでください**（付けると JS に埋め込まれて公開されます）。

## 前提

- 2026 年 3 月以降、Spotify の Development Mode のアプリは**持ち主が Spotify Premium 会員であること**が必要です。

## 手順（15 分ほど・最初の 1 回だけ）

1. [Spotify for Developers のダッシュボード](https://developer.spotify.com/dashboard) で **Create app** を押す
   - App name / description: 自由（例 `nico-labo748.dev`）
   - Redirect URI: `http://127.0.0.1:8888/callback`（`localhost` は使えません。このページは開けなくて大丈夫です）
   - Which API/SDKs: **Web API** にチェック
2. 作ったアプリの **Settings** から Client ID と Client secret を控える
3. ブラウザで次の URL を開き（`<CLIENT_ID>` を置き換え）、許可する
   ```
   https://accounts.spotify.com/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8888%2Fcallback&scope=user-top-read
   ```
   開けないページに飛びますが、**アドレスバーの URL をまるごと**コピーします（コードは数分で無効になるので、すぐ次へ）
   - URL は `...callback?code=XXXX&ubi=YYYY` のように `code` の後ろにも続きます。必要なのは `code=` から `&` の手前までです
4. ターミナルで refresh token を取得する（URL は**シングルクォートで囲む**。囲まないと zsh が `&` で命令を区切り `parse error near '&'` になります）
   ```zsh
   CLIENT_ID='...'
   CLIENT_SECRET='...'
   URL='http://127.0.0.1:8888/callback?code=...&ubi=...'
   CODE=$(printf %s "$URL" | sed -E 's/.*[?&]code=([^&]+).*/\1/')
   curl -s -X POST https://accounts.spotify.com/api/token -u "$CLIENT_ID:$CLIENT_SECRET" -d grant_type=authorization_code -d code="$CODE" -d redirect_uri=http://127.0.0.1:8888/callback
   ```
   返ってきた JSON の `refresh_token` を控える（Client secret やトークンはチャットやリポジトリに貼らない。貼ってしまったらダッシュボードの Settings で client secret を Rotate する）
5. Vercel の **Project → Settings → Environment Variables** に 3 つ登録する（Environment は Production。Preview でも確認したいなら Preview にも）
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
6. 再デプロイする

## 確認とトラブル

- `https://<デプロイ先>/api/spotify` を開いて `{"tracks":[...]}` に曲が入っていれば完了です（1 日キャッシュされます）。
- 空のままなら Vercel の Functions のログを見てください。`token 400`（`invalid_grant`）は refresh token の失効、`top tracks 403` は Premium が切れたか、アプリの User Management に自分が入っていない可能性があります。
- ログに「new refresh token」と出たら、表示された新しいトークンではなく手順 3〜5 をやり直して差し替えてください（ログにはトークンを出していません）。
- ローカルの `npm run dev` では関数が動かないため、曲の欄は出ません。確かめたいときは `vercel dev` を使います。

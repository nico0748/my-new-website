# Topics 行追記 Web App（Google Apps Script）

claude-obsidian で毎日生成されるセキュリティニュース記事を、この個人サイトの **Topics** に
自動連携するための「書き込み口」です。サイト本体は読み取り専用 API キーで Topics シートを
取得する静的 SPA のため、行の**追記**はシートに紐づく **GAS をウェブアプリ（doPost）** として
公開して受け持ちます。

```
claude-obsidian（ローカル定期タスク 7:00 / 19:00）
  └─ art-*.md を生成
       └─ tools/sync_topics_to_website.py
            ├─(A) 本文 md を my-new-website/public/topics/<id>.md に書き出し → git push → Vercel デプロイ
            └─(B) 索引行を JSON で POST ──▶ この Web App(doPost) ──▶ Topics シートに appendRow
                                                                          └─ notify-topics.gs(onChange) が Slack 通知
```

- 実行コード本体: [`append-topic.gs`](./append-topic.gs)（リポジトリ管理用の参照コピー）
- 実体は対象スプレッドシートの Apps Script プロジェクトで動作します。
- 既存の [`notify-topics.gs`](./notify-topics.gs)（行追加→Slack 通知）とは独立して共存できます。

## セットアップ手順

### 1. Apps Script にコードを配置
1. 対象の Google Sheets を開く → **拡張機能 → Apps Script**。
2. 新しいスクリプトファイルを追加し、[`append-topic.gs`](./append-topic.gs) の中身を貼り付けて保存。
   （`notify-topics.gs` と同じプロジェクト内に併置して構いません。）

### 2. スクリプトプロパティを設定
**プロジェクトの設定（⚙）→ スクリプト プロパティ** で以下を追加:

| プロパティ | 値 |
|---|---|
| `APPEND_TOPIC_TOKEN` | 任意の長いランダム文字列（共有トークン）。ローカル設定 `topics_sync.local.json` の `shared_token` と**一致**させる。 |

> トークン生成例（ターミナル）: `openssl rand -hex 24`

### 3. ウェブアプリとしてデプロイ
1. 右上 **デプロイ → 新しいデプロイ**。
2. 種類で **ウェブアプリ** を選択。
3. 設定:
   - 説明: `append-topic`
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員**（トークンで保護するため可）
4. **デプロイ** → 表示される **ウェブアプリ URL**（`https://script.google.com/macros/s/.../exec`）をコピー。
   これを `topics_sync.local.json` の `gas_webapp_url` に設定する。

> 初回デプロイ時に権限承認（スプレッドシートへのアクセス）が必要です。
> コードを更新したら **デプロイ → デプロイを管理 → 編集 → 新バージョン** で反映します（URL は不変）。

### 4. 動作確認
- Apps Script エディタで関数 `testAppend_` を手動実行 → Topics に `test-...` 行が1行増えれば OK。
- もしくはローカルから疎通テスト:
  ```bash
  curl -L "<ウェブアプリURL>"   # doGet が {"ok":true,...} を返す
  ```

## リクエスト/レスポンス仕様

**POST** `application/json`:
```json
{
  "token": "<APPEND_TOPIC_TOKEN と一致>",
  "rows": [
    {
      "id": "2026-06-18-joomla-jce-rce",
      "title": "Joomla JCE 未認証RCE（CVE-2026-48907）",
      "description": "ログイン不要でPHP実行。CISA KEV登録・自動化攻撃中。",
      "category": "cve",
      "date": "2026-06-18",
      "tags": "cve, web, rce",
      "thumbnail": "",
      "author": "自動収集 (claude-obsidian)",
      "markdownFile": "/topics/2026-06-18-joomla-jce-rce.md",
      "externalUrl": "https://thehackernews.com/...",
      "source": "auto"
    }
  ]
}
```
**レスポンス**:
```json
{ "ok": true, "added": ["..."], "duplicated": ["..."], "errors": [] }
```

- `id` が既にシートに存在する場合は `duplicated` に入り、重複追記されません（冪等）。
- `token` 不一致は `{ "ok": false, "error": "unauthorized" }`。

## 補足
- `source` は将来の自動取込用に予約されていた値。本連携では `"auto"` を入れます。
- カテゴリ（news/cve/vuln/daily/it/other）の色・絵文字はフロントの `src/lib/topicCategories.ts` と対応。
- セキュリティ: ウェブアプリは「全員」公開ですが、**トークンが無ければ追記不可**。トークンは
  リポジトリにコミットしない（`topics_sync.local.json` は claude-obsidian 側で gitignore 済み）。

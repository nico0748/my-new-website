# Topics 更新時の Slack 通知（Google Apps Script）

Google Sheets「Topics」シートに行が追加されたら、Slack に即時通知を飛ばす仕組みです。
このサイトはバックエンドを持たない静的 SPA のため、データソースである Google Sheets 側に
紐づく **Google Apps Script (GAS)** で通知を実装します。

- 実行コード本体: [`notify-topics.gs`](./notify-topics.gs)（このファイルはリポジトリ管理用の参照コピー）
- 実体は対象スプレッドシートの Apps Script プロジェクトで動作します。

```
Google Sheets「Topics」に行追加
   └─ onChange トリガー（即時）
        └─ GAS が Slack Incoming Webhook を POST
             └─ #security チャンネルに通知 🔔
```

## セットアップ手順

### 1. Slack Incoming Webhook を作成
1. Slack App を作成（https://api.slack.com/apps）→ **Incoming Webhooks** を有効化。
2. 通知したいチャンネル（例: `#security`）を選び、**Webhook URL** を発行・コピー。

### 2. Apps Script にコードを配置
1. 対象の Google Sheets を開く → **拡張機能 → Apps Script**。
2. [`notify-topics.gs`](./notify-topics.gs) の中身を貼り付けて保存。

### 3. スクリプトプロパティを設定
Apps Script の **プロジェクトの設定（⚙）→ スクリプト プロパティ** で以下を追加:

| プロパティ | 値 |
|---|---|
| `SLACK_WEBHOOK_URL` | 手順1で取得した Webhook URL |
| `SITE_BASE_URL` | `https://nico-labo748.dev`（末尾スラッシュ無し） |

> `LAST_NOTIFIED_ROW` は内部状態として自動で作成・更新されるので手動設定は不要。

### 4. トリガーを追加
Apps Script の **トリガー（⏰）→ トリガーを追加**:
- 実行する関数: `handleTopicsChange`
- イベントのソース: **スプレッドシートから**
- イベントの種類: **変更時（onChange）**

> onChange はインストール型トリガーのため、初回追加時に権限承認が必要です。

### 5. 動作確認
- 関数 `testNotifyLatest` を手動実行すると、最新行の内容で Slack にテスト通知が飛びます。
- 実際に「Topics」シートへ1行追加し、Slack に通知が届くことを確認してください。
- 通知メッセージ内のリンクは `SITE_BASE_URL/topics/<id>` を指します。

## 補足
- 初回の onChange 発火時は「取りこぼし防止」のため基準行だけ記録し、通知はしません（2回目以降の新規行から通知）。
- カテゴリの絵文字はフロントの `src/lib/topicCategories.ts` と対応しています。
- 将来 CVE/ニュースフィードを自動取り込み（`source = "auto"`）してシートへ追記する運用にしても、この通知はそのまま発火します。

# Google Sheets API 設定 & データインポートガイド

このガイドでは、プロジェクトのデータをGoogleスプレッドシートに移行し、API連携するための手順を説明します。

## 1. データのインポート
以下のフォルダに現在のデータをCSV形式で出力しました：
`data_export/`
- \`profile.csv\`
- \`timeline.csv\`
- \`skills.csv\`
- \`projects.csv\`

**手順:**
1. 新しいGoogleスプレッドシートを作成します。
2. スプレッドシート内に、以下の4つのシート（タブ）を作成し、名前を変更します：
   - `Profile`
   - `Timeline`
   - `Skills`
   - `Projects`
3. 各シートについて、「ファイル」 -> 「インポート」 -> 「アップロード」を選択し、対応するCSVファイルをドラッグ&ドロップします。
4. インポート場所として「**現在のシートを置換する**」を選択するとスムーズです。

---

## 2. API Key と Spreadsheet ID の取得

### ステップ 1: プロジェクトの作成とAPIの有効化
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセスします。
2. 左上のプロジェクト選択ドロップダウンから「新しいプロジェクト」を作成します（例: "My Portfolio"）。
3. 左サイドメニューの「APIとサービス」 -> 「ライブラリ」をクリックします。
4. 検索バーに「**Google Sheets API**」と入力して検索し、クリックして「**有効にする**」を押します。

### ステップ 2: API Key の取得
1. 「APIとサービス」 -> 「認証情報」をクリックします。
2. 上部の「+ 認証情報を作成」 -> 「**APIキー**」を選択します。
3. 生成されたAPIキーをコピーします。（これが \`GOOGLE_SHEETS_API_KEY\` になります）。
4. キーの編集画面で「**API の制限**」を「キーを制限」にし、**Google Sheets API だけ**を選びます。
   「アプリケーションの制限」は「なし」のままにします（キーを使うのはブラウザではなく Vercel Function で、リファラーも固定 IP も無いため）。

> **キーはブラウザに渡しません。** 環境変数の名前に \`VITE_\` を付けると、ビルド時に JS へ埋め込まれて誰でも読めるようになります。
> キーは Vercel Function（\`api/sheets.js\`）だけが読み、ブラウザは \`/api/sheets?sheet=シート名\` を呼びます。

### ステップ 3: Spreadsheet ID の取得
1. 作成したGoogleスプレッドシートを開きます。
2. ブラウザのアドレスバーのURLを確認します。
   \`https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXX/edit#gid=0\`
3. `/d/` と `/edit` の間にある文字列（上記の `XXXXXXXXXXXXXXXXXXXX` の部分）が **Spreadsheet ID** です。
4. これをコピーします。（これが \`SPREADSHEET_ID\` になります）。

### ステップ 4: データへのアクセス権限設定
1. スプレッドシートの右上にある「**共有**」ボタンをクリックします。
2. 「一般的なアクセス」を「**リンクを知っている全員**」に変更し、権限を「**閲覧者**」にします。
   *(注意: APIキー方式の場合、シートが公開されている必要があります。非公開にしたい場合はOAuth認証などより複雑な手順が必要です)*

---

## 3. アプリケーションへの設定

プロジェクトのルートディレクトリにある `.env.local` ファイル（なければ作成）に、取得したキーを設定します：

```env
GOOGLE_SHEETS_API_KEY=取得したAPIキー
SPREADSHEET_ID=取得したスプレッドシートID
```

設定後、開発サーバーを再起動（`npm run dev` を一度停止して再実行）すれば、データがスプレッドシートから読み込まれます（開発サーバーの中で `api/sheets.js` を動かしています）。

本番・Preview は Vercel の **Settings → Environment Variables** に同じ 2 つ（`GOOGLE_SHEETS_API_KEY` / `SPREADSHEET_ID`）を Production と Preview の両方に入れ、再デプロイします。

### 読めるシートを増やすとき

`/api/sheets` が返すのは `api/sheets.js` の `SHEETS` に書いたシートだけです。サイトで新しいシートを読むときは、そこにシート名を足してください。

### キーが漏れたとき・入れ替えるとき

1. Google Cloud Console の「認証情報」で新しいキーを作り、上と同じ制限をかけます。
2. Vercel の `GOOGLE_SHEETS_API_KEY` を新しいキーに書き換えて再デプロイし、サイトにデータが出ることを確かめます。
3. 古いキーを Google Cloud Console で削除します。

以前の `VITE_GOOGLE_SHEETS_API_KEY` / `VITE_SPREADSHEET_ID` は、移行のあいだだけ `api/sheets.js` が代わりに読みます。新しい名前に移したら、Vercel と `.env.local` から消してください。

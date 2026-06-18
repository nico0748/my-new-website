/**
 * append-topic.gs — Google Sheets「Topics」へ外部から行を追記する Web App（GAS）
 *
 * ＝＝ これはリポジトリ管理用の参照コピーです ＝＝
 * 実体は対象スプレッドシートに紐づく Apps Script プロジェクトで「ウェブアプリ」として
 * デプロイして動かします。セットアップ手順は同ディレクトリの README-append-topic.md を参照。
 *
 * 役割:
 *   このサイトは読み取り専用 API キーで Topics シートを取得する静的 SPA。
 *   行の「追記（書き込み）」はバックエンドが無いため、シートに紐づく GAS を
 *   ウェブアプリ(doPost)として公開し、ローカルの定期タスクからトークン付き POST で追記する。
 *
 * 仕組み:
 *   ローカル sync スクリプト
 *     → POST(JSON) { token, rows:[{id,title,...}] }
 *       → doPost がトークン検証 → 既存 id は重複スキップ → Topics に appendRow
 *         → 既存の notify-topics.gs（onChange）が Slack 通知を発火（連携はそのまま）
 *
 * スクリプトプロパティ（プロジェクトの設定 → スクリプト プロパティ）:
 *   APPEND_TOPIC_TOKEN ... 追記を許可する共有トークン（必須／ローカル設定と一致させる）
 *
 * シートの想定ヘッダー（1行目）:
 *   id, title, description, category, date, tags, thumbnail, author, markdownFile, externalUrl, source
 */

var SHEET_NAME = 'Topics';
var EXPECTED_HEADERS = [
  'id', 'title', 'description', 'category', 'date',
  'tags', 'thumbnail', 'author', 'markdownFile', 'externalUrl', 'source'
];

/**
 * ウェブアプリのPOSTエントリポイント。
 * リクエストボディ(JSON):
 *   { "token": "<共有トークン>", "rows": [ { id, title, description, category, date, tags, thumbnail, author, markdownFile, externalUrl, source }, ... ] }
 *   ※ rows の代わりに単一オブジェクト row でも可。tags は "a, b, c" のカンマ区切り文字列。
 * レスポンス(JSON):
 *   { ok, added:[id...], duplicated:[id...], errors:[...] }
 */
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    var expected = PropertiesService.getScriptProperties().getProperty('APPEND_TOPIC_TOKEN');
    if (!expected || body.token !== expected) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    var rows = body.rows || (body.row ? [body.row] : []);
    if (!rows.length) {
      return json_({ ok: false, error: 'no rows' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return json_({ ok: false, error: 'sheet not found: ' + SHEET_NAME });
    }

    // ヘッダー取得（無ければ既定ヘッダーを敷く）
    var lastCol = Math.max(sheet.getLastColumn(), EXPECTED_HEADERS.length);
    var headerRange = sheet.getRange(1, 1, 1, lastCol);
    var headers = headerRange.getValues()[0].map(function (h) { return String(h).trim(); });
    if (!headers[0]) {
      sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setValues([EXPECTED_HEADERS]);
      headers = EXPECTED_HEADERS.slice();
    }

    // 既存 id 集合（id 列）
    var idColIdx = headers.indexOf('id'); // 0-based
    var existing = {};
    var lastRow = sheet.getLastRow();
    if (idColIdx >= 0 && lastRow >= 2) {
      var idVals = sheet.getRange(2, idColIdx + 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < idVals.length; i++) {
        var v = String(idVals[i][0]).trim();
        if (v) existing[v] = true;
      }
    }

    var added = [], duplicated = [], errors = [];
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      for (var r = 0; r < rows.length; r++) {
        var rec = rows[r] || {};
        var id = String(rec.id || '').trim();
        if (!id || !String(rec.title || '').trim()) {
          errors.push({ id: id, error: 'missing id or title' });
          continue;
        }
        if (existing[id]) {
          duplicated.push(id);
          continue;
        }
        // ヘッダー順に値を並べる
        var line = headers.map(function (h) {
          var val = rec[h];
          return (val === undefined || val === null) ? '' : String(val);
        });
        sheet.appendRow(line);
        existing[id] = true;
        added.push(id);
      }
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true, added: added, duplicated: duplicated, errors: errors });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** 動作確認用: GET で疎通だけ返す（トークンは検証しない簡易ヘルスチェック）。 */
function doGet() {
  return json_({ ok: true, service: 'append-topic', sheet: SHEET_NAME });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Apps Script エディタから手動実行して、ダミー行の追記を試すテスト。 */
function testAppend_() {
  var token = PropertiesService.getScriptProperties().getProperty('APPEND_TOPIC_TOKEN');
  var fake = {
    postData: {
      contents: JSON.stringify({
        token: token,
        rows: [{
          id: 'test-' + new Date().getTime(),
          title: 'テスト追記',
          description: 'append-topic.gs の動作確認行',
          category: 'news',
          date: Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd'),
          tags: 'test, gas',
          thumbnail: '',
          author: '自動収集 (claude-obsidian)',
          markdownFile: '',
          externalUrl: '',
          source: 'auto'
        }]
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}

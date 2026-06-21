/**
 * notify-topics.gs — Google Sheets「Topics」「Study」更新時に Slack へ即時通知する Apps Script
 *
 * ＝＝ これはリポジトリ管理用の参照コピーです ＝＝
 * 実体は対象スプレッドシートに紐づく Apps Script プロジェクトで動かします。
 * セットアップ手順は同ディレクトリの README.md を参照。
 *
 * 仕組み:
 *   Google Sheets「Topics」/「Study」に行が追加される
 *     → インストール型 onChange トリガー（handleTopicsChange）が発火
 *     → シートごとに、前回通知済みの行番号より後の新規行を Slack Incoming Webhook へ POST
 *
 * スクリプトプロパティ（プロジェクトの設定 → スクリプト プロパティ）:
 *   SLACK_WEBHOOK_URL          ... Slack Incoming Webhook URL（必須）
 *   SITE_BASE_URL              ... 例: https://nico-labo748.dev（必須／末尾スラッシュ無し）
 *   LAST_NOTIFIED_ROW_<sheet>  ... 内部状態（シートごと・自動更新。手動設定不要）
 *
 * シートの想定ヘッダー（1行目）:
 *   id, title, description, category, date, tags, thumbnail, author, markdownFile, externalUrl, source
 */

// 通知対象シートの設定（name=シート名 / path=サイトのURLパス / label=通知文言）
var SHEETS = [
  { name: 'Topics', path: 'topics', label: 'Topic' },
  { name: 'Study',  path: 'study',  label: 'Study' }
];

// カテゴリ → 絵文字（フロントの topicCategories.ts / studyCategories.ts と対応）
var CATEGORY_EMOJI = {
  // Topics
  news: '📰', cve: '🛡️', vuln: '⚠️', daily: '🧩', it: '💻',
  // Study
  language: '📝', framework: '🧱', cs: '🧠', security: '🛡️', infra: '☁️', book: '📚',
  // 共通
  other: '📌'
};

/**
 * インストール型 onChange トリガーから呼ばれるエントリポイント。
 * 「拡張機能 → Apps Script → トリガー」で、関数 handleTopicsChange /
 * イベント「変更時(onChange)」のトリガーを作成すること（1つで全シートをカバー）。
 */
function handleTopicsChange(e) {
  // 行の挿入・編集・貼り付け以外（フォーマット変更等）は無視
  if (e && e.changeType && ['INSERT_ROW', 'EDIT', 'PASTE', 'OTHER'].indexOf(e.changeType) === -1) {
    return;
  }
  notifyNewRows_();
}

/**
 * 全対象シートをチェックし、新規行を検出して Slack に通知する本体。手動実行でのテストも可能。
 */
function notifyNewRows_() {
  var props = PropertiesService.getScriptProperties();
  var webhookUrl = props.getProperty('SLACK_WEBHOOK_URL');
  var siteBaseUrl = (props.getProperty('SITE_BASE_URL') || '').replace(/\/+$/, '');

  if (!webhookUrl) {
    Logger.log('SLACK_WEBHOOK_URL が未設定です。');
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  for (var s = 0; s < SHEETS.length; s++) {
    var cfg = SHEETS[s];
    var sheet = ss.getSheetByName(cfg.name);
    if (!sheet) continue; // シートが無ければスキップ

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) continue; // ヘッダーのみ

    var headers = values[0].map(function (h) { return String(h).trim(); });
    var lastDataRow = values.length; // 1-indexed の最終行

    // シートごとの状態キー。Topics は旧キー(LAST_NOTIFIED_ROW)からの移行に対応。
    var stateKey = 'LAST_NOTIFIED_ROW_' + cfg.name;
    var stored = props.getProperty(stateKey);
    if (stored === null && cfg.name === 'Topics') {
      stored = props.getProperty('LAST_NOTIFIED_ROW'); // 旧キーのフォールバック
    }

    // 初回（状態が無い）は取りこぼし防止のため基準だけ記録して次のシートへ
    if (stored === null) {
      props.setProperty(stateKey, String(lastDataRow));
      Logger.log(cfg.name + ' 初回基準を設定: ' + lastDataRow);
      continue;
    }

    var lastNotified = parseInt(stored || '1', 10);
    if (lastDataRow <= lastNotified) continue; // 新規行なし

    for (var row = lastNotified + 1; row <= lastDataRow; row++) {
      var item = rowToObject_(headers, values[row - 1]);
      if (!item.id || !item.title) continue; // 空行スキップ
      postToSlack_(webhookUrl, siteBaseUrl, item, cfg);
    }

    props.setProperty(stateKey, String(lastDataRow));
  }
}

/** ヘッダー配列と行配列から { ヘッダー: 値 } のオブジェクトを作る */
function rowToObject_(headers, row) {
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    obj[headers[i]] = row[i] !== undefined && row[i] !== null ? String(row[i]).trim() : '';
  }
  return obj;
}

/** 1件を Slack へ POST */
function postToSlack_(webhookUrl, siteBaseUrl, item, cfg) {
  var category = (item.category || 'other').toLowerCase();
  var emoji = CATEGORY_EMOJI[category] || CATEGORY_EMOJI.other;
  var url = siteBaseUrl ? (siteBaseUrl + '/' + cfg.path + '/' + item.id) : '';

  var lines = [];
  lines.push(emoji + ' *新しい ' + cfg.label + ' が公開されました* — `' + (item.category || 'other') + '`');
  lines.push('*' + item.title + '*');
  if (item.description) lines.push(item.description);
  var meta = [];
  if (item.date) meta.push('🗓 ' + item.date);
  if (item.author) meta.push('✍️ ' + item.author);
  if (meta.length) lines.push(meta.join('　'));
  if (url) lines.push('🔗 ' + url);
  if (item.externalUrl) lines.push('📎 参考: ' + item.externalUrl);

  var payload = { text: lines.join('\n') };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var res = UrlFetchApp.fetch(webhookUrl, options);
  Logger.log('Slack 応答: ' + res.getResponseCode() + ' / ' + cfg.name + ' / ' + item.id);
}

/** 手動テスト用: 各対象シートの最新1行を強制的に通知する */
function testNotifyLatest() {
  var props = PropertiesService.getScriptProperties();
  var webhookUrl = props.getProperty('SLACK_WEBHOOK_URL');
  var siteBaseUrl = (props.getProperty('SITE_BASE_URL') || '').replace(/\/+$/, '');
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  for (var s = 0; s < SHEETS.length; s++) {
    var cfg = SHEETS[s];
    var sheet = ss.getSheetByName(cfg.name);
    if (!sheet) continue;
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) continue;
    var headers = values[0].map(function (h) { return String(h).trim(); });
    var item = rowToObject_(headers, values[values.length - 1]);
    postToSlack_(webhookUrl, siteBaseUrl, item, cfg);
  }
}

/**
 * notify-topics.gs — Google Sheets「Topics」更新時に Slack へ即時通知する Apps Script
 *
 * ＝＝ これはリポジトリ管理用の参照コピーです ＝＝
 * 実体は対象スプレッドシートに紐づく Apps Script プロジェクトで動かします。
 * セットアップ手順は同ディレクトリの README.md を参照。
 *
 * 仕組み:
 *   Google Sheets「Topics」に行が追加される
 *     → インストール型 onChange トリガー（handleTopicsChange）が発火
 *     → 前回通知済みの行番号より後の新規行を Slack Incoming Webhook へ POST
 *
 * スクリプトプロパティ（プロジェクトの設定 → スクリプト プロパティ）:
 *   SLACK_WEBHOOK_URL  ... Slack Incoming Webhook URL（必須）
 *   SITE_BASE_URL      ... 例: https://nico-labo748.dev（必須／末尾スラッシュ無し）
 *   LAST_NOTIFIED_ROW  ... 内部状態（自動更新。手動設定不要）
 *
 * シートの想定ヘッダー（1行目）:
 *   id, title, description, category, date, tags, thumbnail, author, markdownFile, externalUrl, source
 */

var SHEET_NAME = 'Topics';

// カテゴリ → 絵文字（フロントの topicCategories.ts と対応）
var CATEGORY_EMOJI = {
  news: '📰',
  cve: '🛡️',
  vuln: '⚠️',
  daily: '🧩',
  it: '💻',
  other: '📌'
};

/**
 * インストール型 onChange トリガーから呼ばれるエントリポイント。
 * 「拡張機能 → Apps Script → トリガー」で、関数 handleTopicsChange /
 * イベント「変更時(onChange)」のトリガーを作成すること。
 */
function handleTopicsChange(e) {
  // 行の挿入・編集・貼り付け以外（フォーマット変更等）は無視
  if (e && e.changeType && ['INSERT_ROW', 'EDIT', 'PASTE', 'OTHER'].indexOf(e.changeType) === -1) {
    return;
  }
  notifyNewTopics_();
}

/**
 * 新規行を検出して Slack に通知する本体。手動実行でのテストも可能。
 */
function notifyNewTopics_() {
  var props = PropertiesService.getScriptProperties();
  var webhookUrl = props.getProperty('SLACK_WEBHOOK_URL');
  var siteBaseUrl = (props.getProperty('SITE_BASE_URL') || '').replace(/\/+$/, '');

  if (!webhookUrl) {
    Logger.log('SLACK_WEBHOOK_URL が未設定です。');
    return;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('シート「' + SHEET_NAME + '」が見つかりません。');
    return;
  }

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return; // ヘッダーのみ

  var headers = values[0].map(function (h) { return String(h).trim(); });
  var lastDataRow = values.length;                 // 1-indexed の最終行
  var lastNotified = parseInt(props.getProperty('LAST_NOTIFIED_ROW') || '1', 10);

  // 初回（状態が無い）は通知の取りこぼし防止のため基準だけ記録して終了
  if (!props.getProperty('LAST_NOTIFIED_ROW')) {
    props.setProperty('LAST_NOTIFIED_ROW', String(lastDataRow));
    Logger.log('初回基準を設定: ' + lastDataRow);
    return;
  }

  if (lastDataRow <= lastNotified) return; // 新規行なし

  for (var row = lastNotified + 1; row <= lastDataRow; row++) {
    var item = rowToObject_(headers, values[row - 1]);
    if (!item.id || !item.title) continue;       // 空行スキップ
    postToSlack_(webhookUrl, siteBaseUrl, item);
  }

  props.setProperty('LAST_NOTIFIED_ROW', String(lastDataRow));
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
function postToSlack_(webhookUrl, siteBaseUrl, item) {
  var category = (item.category || 'other').toLowerCase();
  var emoji = CATEGORY_EMOJI[category] || CATEGORY_EMOJI.other;
  var url = siteBaseUrl ? (siteBaseUrl + '/topics/' + item.id) : '';

  var lines = [];
  lines.push(emoji + ' *新しい Topic が公開されました* — `' + (item.category || 'other') + '`');
  lines.push('*' + item.title + '*');
  if (item.description) lines.push(item.description);
  var meta = [];
  if (item.date) meta.push('🗓 ' + item.date);
  if (item.author) meta.push('✍️ ' + item.author);
  if (meta.length) lines.push(meta.join('　'));
  if (url) lines.push('🔗 ' + url);
  if (item.externalUrl) lines.push('📎 原典: ' + item.externalUrl);

  var payload = { text: lines.join('\n') };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var res = UrlFetchApp.fetch(webhookUrl, options);
  Logger.log('Slack 応答: ' + res.getResponseCode() + ' / ' + item.id);
}

/** 手動テスト用: 最新1行を強制的に通知する */
function testNotifyLatest() {
  var props = PropertiesService.getScriptProperties();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) { Logger.log('データ行がありません'); return; }
  var headers = values[0].map(function (h) { return String(h).trim(); });
  var item = rowToObject_(headers, values[values.length - 1]);
  postToSlack_(
    props.getProperty('SLACK_WEBHOOK_URL'),
    (props.getProperty('SITE_BASE_URL') || '').replace(/\/+$/, ''),
    item
  );
}

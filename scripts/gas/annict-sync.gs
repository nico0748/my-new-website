/**
 * Annict → Google Sheets 定期同期スクリプト
 * （このファイルはリポジトリ管理用の参照コピー。実体はスプレッドシートに紐づく Apps Script で動く）
 *
 * 対象シート（ポートフォリオサイトの /anime とトップの OFF-HOURS が読む3シート）
 *   all-watched-anime      … 見た
 *   all-watching-anime     … 見てる
 *   all-wanna-watch-anime  … 見たい
 * 列: id | title | official_site_url | release_season | twitter_avatar_url | official_site_twitter_image_url
 *     | media | episodes_count | watchers_count | original | director | studio | cast | wikipedia_url | twitter_hashtag
 *
 * 使い方
 *   1. スクリプトプロパティ ANNICT_TOKEN に Annict の個人用アクセストークン（read スコープ）を入れる
 *      （エディタ左の「プロジェクトの設定」→「スクリプト プロパティ」）
 *   2. setupTrigger() を一度だけ手動実行 → 6時間ごとに syncAnnict() が自動実行される
 *   3. 今すぐ反映したいときは syncAnnict() を手動実行
 *
 * 方針
 *   - 作品は Annict の work id で照合する。期・クール・劇場版は id が別なので別作品として扱う。
 *   - シートに既に値が入っているセルは上書きしない（手で調べて埋めた値を守るため）。
 *     空のセルだけ Annict の値で埋める。title と release_season は Annict を正とする。
 *   - media 以降（詳細の列）は GraphQL API でまとめて取り、取れた値を正とする（話数・記録数は変わるため）。
 *     詳細の取得に失敗しても、一覧の同期は続け、詳細の列は前回の値を残す。
 *   - 「見てる」→「見た」のようにステータスが移った作品も、id で全シートから値を引き継ぐ。
 *   - 取得に失敗したとき・0件が返ったときはシートを書き換えない。
 *   - cast は 1 行に 1 人「キャラクター名：声優名」（セル内改行区切り）。
 */

const ANNICT_API = 'https://api.annict.com/v1/me/works';
const ANNICT_GRAPHQL = 'https://api.annict.com/graphql';
const HEADER = [
  'id', 'title', 'official_site_url', 'release_season', 'twitter_avatar_url', 'official_site_twitter_image_url',
  'media', 'episodes_count', 'watchers_count', 'original', 'director', 'studio', 'cast', 'wikipedia_url', 'twitter_hashtag',
];
const DETAIL_FROM = 6; // この列から右が詳細（GraphQL で取る）
const DETAIL_COLUMNS = HEADER.length - DETAIL_FROM;
const TARGETS = [
  { status: 'watched',     sheet: 'all-watched-anime' },
  { status: 'watching',    sheet: 'all-watching-anime' },
  { status: 'wanna_watch', sheet: 'all-wanna-watch-anime' },
];
const TRIGGER_HOURS = 6;
const DETAIL_BATCH = 25; // GraphQL 1 回で取る作品数
const STAFF_LIMIT = 30;
const CAST_LIMIT = 6;
const MEDIA_LABEL = { TV: 'TV', OVA: 'OVA', MOVIE: '映画', WEB: 'Web', OTHER: 'その他' };
// Annict 側の画像が非公式・無関係と確認済みで、意図的に空にしている作品 id（空でも Annict の値で埋め直さない）
const IGNORE_ANNICT_IMAGE_IDS = ['4089', '15792', '4328', '4777', '4385', '1744', '5587', '3637', '1090', '5735'];

/** 定期実行の本体 */
function syncAnnict() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30 * 1000)) {
    console.warn('前回の同期がまだ実行中のためスキップしました');
    return;
  }
  try {
    const token = PropertiesService.getScriptProperties().getProperty('ANNICT_TOKEN');
    if (!token) throw new Error('スクリプトプロパティ ANNICT_TOKEN が未設定です');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const known = collectExistingRows_(ss); // id -> 既存行（全シート横断）

    // 1. 状態ごとの作品一覧（REST）
    const lists = TARGETS.map(t => Object.assign({}, t, { works: fetchAllWorks_(token, t.status) }));

    // 2. 詳細（GraphQL）。失敗しても一覧の同期は続ける
    let details = {};
    try {
      const ids = [];
      lists.forEach(l => l.works.forEach(w => ids.push(Number(w.id))));
      details = fetchDetails_(token, ids);
      console.log(`詳細: ${Object.keys(details).length}/${ids.length}件を取得しました`);
    } catch (e) {
      console.warn(`詳細の取得に失敗しました（詳細の列は前回の値を残します）: ${e.message}`);
    }

    // 3. シートへ書き込み
    lists.forEach(({ sheet, works }) => {
      const sh = ss.getSheetByName(sheet) || ss.insertSheet(sheet);
      const currentCount = Math.max(sh.getLastRow() - 1, 0);

      if (works.length === 0 && currentCount > 0) {
        console.warn(`${sheet}: Annict から0件が返ったため書き換えを中止しました`);
        return;
      }

      const rows = works.map(w => mergeRow_(toRow_(w, details[String(w.id)]), known[String(w.id)]));
      writeSheet_(sh, rows);
      console.log(`${sheet}: ${rows.length}件を同期しました（前回 ${currentCount}件）`);
    });

    PropertiesService.getScriptProperties().setProperty('LAST_SYNCED_AT', new Date().toISOString());
  } finally {
    lock.releaseLock();
  }
}

/** 6時間ごとのトリガーを作る（重複は削除）。一度だけ手動で実行する */
function setupTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncAnnict')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('syncAnnict').timeBased().everyHours(TRIGGER_HOURS).create();
  console.log(`syncAnnict を ${TRIGGER_HOURS} 時間ごとに実行するトリガーを作成しました`);
}

/** トリガーを止めたいとき用 */
function removeTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncAnnict')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

// ---------------------------------------------------------------------------

function fetchAllWorks_(token, status) {
  const fields = 'id,title,official_site_url,season_name_text,twitter_username,images';
  let page = 1;
  const all = [];
  while (page) {
    const url = `${ANNICT_API}?filter_status=${status}&per_page=50&page=${page}` +
      `&fields=${fields}&sort_id=desc&access_token=${encodeURIComponent(token)}`;
    const res = fetchWithRetry_(url);
    const body = JSON.parse(res.getContentText());
    all.push(...(body.works || []));
    page = body.next_page || null;
  }
  return all;
}

const DETAIL_QUERY = `query ($ids: [Int!]) {
  searchWorks(annictIds: $ids, first: ${DETAIL_BATCH}) {
    nodes {
      annictId
      media
      episodesCount
      noEpisodes
      watchersCount
      wikipediaUrl
      twitterHashtag
      staffs(first: ${STAFF_LIMIT}, orderBy: { field: SORT_NUMBER, direction: ASC }) { nodes { name roleText roleOther } }
      casts(first: ${CAST_LIMIT}, orderBy: { field: SORT_NUMBER, direction: ASC }) { nodes { name character { name } } }
    }
  }
}`;

/** 作品 id → 詳細の列（DETAIL_COLUMNS 個）。並び順の指定が通らない場合は指定なしで取り直す */
function fetchDetails_(token, ids) {
  const out = {};
  let query = DETAIL_QUERY;
  for (let i = 0; i < ids.length; i += DETAIL_BATCH) {
    const batch = ids.slice(i, i + DETAIL_BATCH);
    let data;
    try {
      data = graphql_(token, query, { ids: batch });
    } catch (e) {
      if (query === DETAIL_QUERY && /orderBy|SORT_NUMBER|field/i.test(e.message)) {
        console.warn(`並び順の指定なしで取り直します: ${e.message}`);
        query = DETAIL_QUERY.replace(/, orderBy: \{[^}]*\}/g, '');
        data = graphql_(token, query, { ids: batch });
      } else {
        throw e;
      }
    }
    const nodes = (data.searchWorks && data.searchWorks.nodes) || [];
    nodes.forEach(n => { out[String(n.annictId)] = toDetail_(n); });
  }
  return out;
}

function graphql_(token, query, variables) {
  const res = fetchWithRetry_(ANNICT_GRAPHQL, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify({ query, variables }),
  });
  const body = JSON.parse(res.getContentText());
  if (body.errors && body.errors.length) throw new Error(`Annict GraphQL: ${body.errors[0].message}`);
  return body.data || {};
}

function toDetail_(n) {
  const staffs = (n.staffs && n.staffs.nodes) || [];
  const byRole = role => unique_(
    staffs.filter(s => s.roleText === role || s.roleOther === role).map(s => s.name)
  ).join('、');
  const cast = ((n.casts && n.casts.nodes) || [])
    .map(c => (c.character && c.character.name ? `${c.character.name}：` : '') + (c.name || ''))
    .filter(Boolean)
    .join('\n');
  return [
    MEDIA_LABEL[n.media] || '',
    !n.noEpisodes && n.episodesCount ? String(n.episodesCount) : '',
    n.watchersCount ? String(n.watchersCount) : '',
    byRole('原作'),
    byRole('監督') || byRole('総監督'),
    byRole('アニメーション制作'),
    cast,
    n.wikipediaUrl || '',
    String(n.twitterHashtag || '').replace(/^#/, ''),
  ];
}

function unique_(arr) {
  return arr.filter((v, i) => v && arr.indexOf(v) === i);
}

function fetchWithRetry_(url, options) {
  let lastErr;
  for (let i = 0; i < 4; i++) {
    try {
      const res = UrlFetchApp.fetch(url, Object.assign({ muteHttpExceptions: true }, options || {}));
      const code = res.getResponseCode();
      if (code === 200) return res;
      if (code === 401) throw new Error('Annict トークンが無効です（401）');
      lastErr = new Error(`Annict API ${code}: ${res.getContentText().slice(0, 200)}`);
    } catch (e) {
      lastErr = e;
      if (String(e.message).includes('401')) throw e;
    }
    Utilities.sleep(1000 * Math.pow(2, i));
  }
  throw lastErr;
}

function toRow_(w, detail) {
  const site = normalizeUrl_(w.official_site_url || '');
  const tw = (w.images && w.images.twitter) || {};
  const fb = (w.images && w.images.facebook) || {};
  const avatar = tw.original_avatar_url ||
    (w.twitter_username ? `https://twitter.com/${w.twitter_username}/profile_image?size=original` : '');
  const image = absolutize_(tw.image_url || fb.og_image_url || '', site);
  const base = [String(w.id), w.title || '', site, w.season_name_text || '', avatar, image];
  return base.concat(detail || new Array(DETAIL_COLUMNS).fill(''));
}

/**
 * 既存の値があるセルは残し、空のセルだけ Annict の値で埋める。
 * title / season と詳細の列は Annict を正とする（取れなかったときは既存の値を残す）
 */
function mergeRow_(fresh, existing) {
  if (IGNORE_ANNICT_IMAGE_IDS.includes(fresh[0])) fresh[5] = existing ? existing[5] : '';
  if (!existing) return fresh;
  return fresh.map((v, i) => {
    if (i === 0 || i === 1 || i === 3 || i >= DETAIL_FROM) return v || existing[i] || '';
    return existing[i] ? existing[i] : v;
  });
}

function collectExistingRows_(ss) {
  const map = {};
  TARGETS.forEach(({ sheet }) => {
    const sh = ss.getSheetByName(sheet);
    if (!sh || sh.getLastRow() < 2) return;
    sh.getRange(2, 1, sh.getLastRow() - 1, HEADER.length).getDisplayValues().forEach(r => {
      if (r[0]) map[String(r[0])] = r;
    });
  });
  return map;
}

function writeSheet_(sh, rows) {
  const lastRow = sh.getLastRow();
  if (lastRow > 1) sh.getRange(2, 1, lastRow - 1, HEADER.length).clearContent();
  sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
  if (rows.length) {
    const range = sh.getRange(2, 1, rows.length, HEADER.length);
    range.setNumberFormat('@'); // id を文字列のまま保つ
    range.setValues(rows);
  }
}

function normalizeUrl_(url) {
  return String(url || '').trim();
}

/** "/wp/.../ogp.png" のような相対パスを公式サイト基準の絶対URLにする */
function absolutize_(img, base) {
  img = String(img || '').trim();
  if (!img) return '';
  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith('//')) return 'https:' + img;
  const m = String(base || '').match(/^(https?:\/\/[^/]+)(\/.*)?$/i);
  if (!m) return '';
  if (img.startsWith('/')) return m[1] + img;
  const dir = (m[2] || '/').replace(/[^/]*$/, '');
  return m[1] + dir + img;
}

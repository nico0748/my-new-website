import fetch from "node-fetch";
import fs from "fs";
import * as cheerio from 'cheerio';
import dotenv from "dotenv";

dotenv.config(); // ★ 2. .envファイルを読み込む設定
    
// ① ご自身のアクセストークンに置き換えてください
const accessToken = process.env.ANNICT_ACCESS_TOKEN;
const BASE_URL = "https://api.annict.com/v1";

// アクセストークンが設定されていない場合はエラーを出す
if (!accessToken) {
  console.error("エラー: .envファイルにANNICT_ACCESS_TOKENが設定されていません。");
  process.exit(1); // プログラムを終了
}

/**
 * 公式サイトのURLからtwitter:imageのURLを取得する
 * @param {string} siteUrl - アニメの公式サイトURL
 * @returns {Promise<string|null>} twitter:imageのURL or null
 */
async function fetchTwitterImage(siteUrl) {
  if (!siteUrl) return null;
  try {
    const response = await fetch(siteUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' }
    });
    if (!response.ok) return null;
    const html = await response.text();
    const $ = cheerio.load(html);
    return $('meta[name="twitter:image"]').attr('content') ||
           $('meta[property="twitter:image"]').attr('content') ||
           $('meta[property="og:image"]').attr('content') || null;
  } catch (error) {
    console.error(`❌ twitter:image取得エラー (${siteUrl}):`, error.message);
    return null;
  }
}

/**
 * Annictのworkオブジェクトから必要な情報を整形する
 * @param {object} work - Annict APIから取得したworkオブジェクト
 * @returns {Promise<object>} 整形後の作品データ
 */
async function formatWorkData(work) {
  const twitterAvatarUrl = work.twitter_username ? `https://twitter.com/${work.twitter_username}/profile_image?size=original` : null;
  const twitterImageUrl = await fetchTwitterImage(work.official_site_url);

  return {
    id: work.id,
    title: work.title,
    official_site_url: work.official_site_url,
    release_season: work.season_name_text,
    twitter_avatar_url: twitterAvatarUrl,
    official_site_twitter_image_url: twitterImageUrl,
  };
}

/**
 * すべての「見たことあるアニメ」をページネーションを考慮して取得する
 * @returns {Promise<Array<object>>} すべての作品データが入った配列
 */
async function fetchAllWatchedWorks() {
  let allWorks = [];
  let currentPage = 1;

  while (true) {
    console.log(`- 📄 ${currentPage}ページ目のデータを取得中...`);
    // per_page=50 は1リクエストあたりの最大取得数
    const url = `${BASE_URL}/me/works?access_token=${accessToken}&filter_status=watched&per_page=50&page=${currentPage}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`APIリクエストに失敗しました (ステータス: ${response.status})`);
    }
    const data = await response.json();

    // 取得した作品データを配列に追加
    if (data.works && data.works.length > 0) {
      allWorks.push(...data.works);
    }

    // 次のページがなければループを終了
    if (!data.next_page) {
      console.log("- ✅ すべてのページの取得が完了しました。");
      break;
    }

    // 次のページ番号をセット
    currentPage = data.next_page;
  }
  return allWorks;
}


async function main() {
  try {
    console.log("🔄 すべての「見たことあるアニメ」の取得を開始します...");

    // 1. Annict APIから全件取得
    const rawWorks = await fetchAllWatchedWorks();
    console.log(`\n🎉 合計 ${rawWorks.length} 件のアニメが見つかりました。`);
    console.log("... 各作品の詳細情報を整形します。件数が多い場合、時間がかかりますのでお待ちください ...");

    // 2. 取得した全件データを整形
    // Promise.allで並列処理
    const formattedWorks = await Promise.all(rawWorks.map(work => formatWorkData(work)));
    
    // 3. ファイルに保存
    fs.writeFileSync("all_watched_anime.json", JSON.stringify(formattedWorks, null, 2));
    console.log("\n✅ all_watched_anime.json にすべてのデータを保存しました！");

  } catch (error) {
    console.error("\n❌ エラーが発生しました:", error);
  }
}

main();
import fetch from "node-fetch";
import fs from "fs";
import * as cheerio from 'cheerio';
import dotenv from "dotenv";

dotenv.config();
    
// .envファイルからご自身のアクセストークンを読み込みます
const accessToken = process.env.ANNICT_ACCESS_TOKEN;
const BASE_URL = "https://api.annict.com/v1";

// アクセストークンが設定されていない場合はエラーを出力して終了します
if (!accessToken) {
  console.error("エラー: .envファイルにANNICT_ACCESS_TOKENが設定されていません。");
  process.exit(1);
}

// 指定した時間だけ処理を待機させるためのヘルパー関数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 公式サイトのURLからOGP画像(twitter:imageなど)のURLを取得します
 * @param {string} siteUrl - アニメの公式サイトURL
 * @returns {Promise<string|null>} OGP画像のURL or null
 */
async function fetchTwitterImage(siteUrl) {
  if (!siteUrl) return null;
  try {
    // ユーザーエージェントを設定して403エラーを回避します
    const response = await fetch(siteUrl, {
      headers: { 'User-Agent': 'Mozilla.5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' }
    });
    if (!response.ok) return null;
    const html = await response.text();
    const $ = cheerio.load(html);
    // 複数のmetaタグに対応します
    return $('meta[name="twitter:image"]').attr('content') ||
           $('meta[property="twitter:image"]').attr('content') ||
           $('meta[property="og:image"]').attr('content') || null;
  } catch (error) {
    console.error(`❌ OGP画像取得エラー (${siteUrl}):`, error.message);
    return null;
  }
}

/**
 * Annictのworkオブジェクトから必要な情報を整形します
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
 * すべての「現在見ているアニメ」をページネーションを考慮して取得します
 * @returns {Promise<Array<object>>} すべての作品データが入った配列
 */
async function fetchAllWatchingWorks() {
  let allWorks = [];
  let currentPage = 1;

  while (true) {
    console.log(`- 📄 ${currentPage}ページ目のデータを取得中...`);
    
    const url = `${BASE_URL}/me/works?access_token=${accessToken}&filter_status=watching&per_page=50&page=${currentPage}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      // 429エラーの場合は少し待ってからリトライするなどの処理も考えられます
      throw new Error(`APIリクエストに失敗しました (ステータス: ${response.status})`);
    }
    const data = await response.json();

    if (data.works && data.works.length > 0) {
      allWorks.push(...data.works);
    }

    if (!data.next_page) {
      console.log("- ✅ すべてのページの取得が完了しました。");
      break;
    }

    currentPage = data.next_page;
    // ★ 変更点: APIへの負荷を減らすため、1秒待機します
    await sleep(1000); 
  }
  return allWorks;
}


async function main() {
  try {
    console.log("🔄 すべての「現在見ているアニメ」の取得を開始します...");

    // 1. Annict APIから全件取得
    const rawWorks = await fetchAllWatchingWorks();
    console.log(`\n🎉 合計 ${rawWorks.length} 件のアニメが見つかりました。`);
    console.log("... 各作品のOGP画像を取得します。件数が多い場合、時間がかかりますのでお待ちください ...");

    // ★ 変更点: Promise.allによる並列処理から、1件ずつ処理する直列処理に変更
    const formattedWorks = [];
    for (const [index, work] of rawWorks.entries()) {
      const formattedWork = await formatWorkData(work);
      formattedWorks.push(formattedWork);
      // 処理状況がわかるようにログを出力します
      console.log(`- [${index + 1}/${rawWorks.length}] ${work.title} の情報を取得しました。`);
      // ★ 変更点: 各公式サイトへの負荷を減らすため、200ミリ秒待機します
      await sleep(200);
    }
    
    // 3. ファイルに保存
    fs.writeFileSync("all_watching_anime.json", JSON.stringify(formattedWorks, null, 2));
    console.log("\n✅ all_watching_anime.json にすべてのデータを保存しました！");

  } catch (error) {
    console.error("\n❌ エラーが発生しました:", error);
  }
}

main();


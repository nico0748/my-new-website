import fetch from "node-fetch";
import fs from "fs";
import * as cheerio from 'cheerio';
import dotenv from "dotenv";

dotenv.config(); // ★ 2. .envファイルを読み込む設定

// ① アクセストークン（大切に保管してください）
const accessToken = process.env.ANNICT_ACCESS_TOKEN;
const BASE_URL = "https://api.annict.com/v1";

/**
 * 公式サイトのURLからtwitter:imageのURLを取得する
 * @param {string} siteUrl - アニメの公式サイトURL
 * @returns {Promise<string|null>} twitter:imageのURL or null
 */
async function fetchTwitterImage(siteUrl) {
  if (!siteUrl) {
    return null;
  }
  try {
    const response = await fetch(siteUrl, {
        // 一部のサイトではUser-Agentがないと403エラーになるため設定
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        }
    });
    if (!response.ok) {
        console.warn(`⚠️  公式サイトにアクセスできませんでした: ${siteUrl}`);
        return null;
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // twitter:image または og:image を探す
    const imageUrl = 
        $('meta[name="twitter:image"]').attr('content') ||
        $('meta[property="twitter:image"]').attr('content') ||
        $('meta[property="og:image"]').attr('content');

    return imageUrl || null;

  } catch (error) {
    console.error(`❌ twitter:imageの取得中にエラーが発生しました (${siteUrl}):`, error.message);
    return null;
  }
}

/**
 * Annictのworkオブジェクトから必要な情報を整形する
 * @param {object} work - Annict APIから取得したworkオブジェクト
 * @returns {Promise<object>} 整形後の作品データ
 */
async function formatWorkData(work) {
    // TwitterのアバターURLは、ユーザー名があれば組み立て可能
    const twitterAvatarUrl = work.twitter_username
        ? `https://twitter.com/${work.twitter_username}/profile_image?size=original`
        : null;
        
    const twitterImageUrl = await fetchTwitterImage(work.official_site_url);

    return {
        id: work.id,
        title: work.title,
        official_site_url: work.official_site_url,
        release_season: work.season_name_text, // 例: "2023年秋"
        twitter_avatar_url: twitterAvatarUrl,
        official_site_twitter_image_url: twitterImageUrl,
    };
}


async function main() {
    try {
        console.log("🔄 Annictからデータの取得を開始します...");

        // --- 1. 最近見たアニメ (視聴記録) の取得 ---
        console.log("  - 最近見たアニメの記録を取得中...");
        const recordsResponse = await fetch(`${BASE_URL}/records?access_token=${accessToken}&sort_id=desc&per_page=25`);
        if (!recordsResponse.ok) throw new Error('視聴記録の取得に失敗しました');
        const recordsData = await recordsResponse.json();
        // 視聴記録から重複を除いた作品リストを作成
        const recentWorks = recordsData.records.reduce((acc, record) => {
            if (!acc.some(work => work.id === record.work.id)) {
                acc.push(record.work);
            }
            return acc;
        }, []);
        const recentAnimeData = await Promise.all(recentWorks.map(formatWorkData));
        fs.writeFileSync("recent_anime.json", JSON.stringify(recentAnimeData, null, 2));
        console.log("  ✅ 最近見たアニメの記録を recent_anime.json に保存しました！");

        // --- 2. 見てるアニメの取得 ---
        console.log("  - 見てるアニメの記録を取得中...");
        const watchingResponse = await fetch(`${BASE_URL}/me/works?access_token=${accessToken}&filter_status=watching&sort_id=desc&per_page=50`);
        if (!watchingResponse.ok) throw new Error('見てるアニメの取得に失敗しました');
        const watchingData = await watchingResponse.json();
        const watchingAnimeData = await Promise.all(watchingData.works.map(formatWorkData));
        fs.writeFileSync("watching_anime.json", JSON.stringify(watchingAnimeData, null, 2));
        console.log("  ✅ 見てるアニメの記録を watching_anime.json に保存しました！");

        // --- 3. 見たことがあるアニメの取得 ---
        console.log("  - 見たことがあるアニメの記録を取得中...");
        const watchedResponse = await fetch(`${BASE_URL}/me/works?access_token=${accessToken}&filter_status=watched&sort_id=desc&per_page=50`);
        if (!watchedResponse.ok) throw new Error('見たことがあるアニメの取得に失敗しました');
        const watchedData = await watchedResponse.json();
        const watchedAnimeData = await Promise.all(watchedData.works.map(formatWorkData));
        fs.writeFileSync("watched_anime.json", JSON.stringify(watchedAnimeData, null, 2));
        console.log("  ✅ 見たことがあるアニメの記録を watched_anime.json に保存しました！");

        console.log("\n🎉 すべての処理が完了しました！");

    } catch (error) {
        console.error("\n❌ エラーが発生しました:", error);
    }
}

main();
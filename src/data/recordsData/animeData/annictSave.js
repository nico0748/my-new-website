import fetch from "node-fetch";
import fs from "fs";

// ① アクセストークンをここに入れる（Annictから取得したもの）
const accessToken = "ZGO1XSo2Bgo_rWvbV-gdLkHsncCVnRQDuH3zA6tasrQ";

// ② Annict API エンドポイント（最新の視聴記録を取得）
const url = `https://api.annict.com/v1/records?access_token=${accessToken}&per_page=100&sort_id=desc`;

async function fetchAnnictData() {
  try {
    // APIリクエスト
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 必要な要素だけ抽出
    const records = data.records.map((record) => ({
      id: record.id,
      work_title: record.work.title,
      episode_title: record.episode ? record.episode.title : null,
      comment: record.comment,
      rating: record.rating,
      created_at: record.created_at,
    }));

    // JSONとして保存
    fs.writeFileSync("record.json", JSON.stringify(records, null, 2));
    console.log("✅ 最新の視聴記録を record.json に保存しました！");
  } catch (error) {
    console.error("❌ エラー:", error);
  }
}

fetchAnnictData();
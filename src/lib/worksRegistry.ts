/** Works 記事（作品詳細の本文）の自動索引。
 *  src/content/works/<作品 id>.tsx を Vite の import.meta.glob で走査する。ファイル名がそのまま作品 id。
 *
 *  - タイトル・期間・タグなどのメタは Projects シートが正。TSX には本文（default export）だけを置く
 *  - lazy の glob だけにする（eager の glob と併用すると本文がメインチャンクに入ってしまう）
 *  - 記事を増やすときは content/works に TSX を 1 つ足すだけ。ここは編集不要 */

import type { ComponentType } from "react";

type WorkModule = { default: ComponentType };

const modules = import.meta.glob<WorkModule>("../content/works/*.tsx");

const loaders = new Map<string, () => Promise<WorkModule>>();
for (const [path, load] of Object.entries(modules)) {
  const id = path.split("/").pop()!.replace(/\.tsx$/, "");
  loaders.set(id, load);
}

/** 作品 id に TSX の記事があれば、その loader（React.lazy に渡せる）を返す。 */
export const getWorkArticleLoader = (id: string) => loaders.get(id);

/** 前後の作品などを先読みしておく（チャンクの取得だけ。描画はしない）。 */
export const preloadWorkArticle = (id?: string) => {
  if (!id) return;
  loaders.get(id)?.().catch(() => undefined);
};

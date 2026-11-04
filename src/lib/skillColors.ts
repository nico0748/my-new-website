/**
 * スキルのカテゴリごとの色。サンド（--accent）は見出しの色なので、チャートには使わない。
 * Frontend = 緑系 / Backend = 青系 / Database = ラベンダー / Infrastructure = 赤系
 */
const BY_CATEGORY: { match: RegExp; color: string }[] = [
  { match: /front/i, color: "var(--accent-2)" },
  { match: /back/i, color: "var(--accent-3)" },
  { match: /data|db/i, color: "var(--accent-5)" },
  { match: /infra|cloud|devops/i, color: "var(--accent-4)" },
];

/** 上のどれにも当たらないカテゴリは、並び順でこの色を順に使う。 */
const FALLBACK = ["var(--accent-2)", "var(--accent-3)", "var(--accent-5)", "var(--accent-4)"];

export const skillColor = (category: string, index: number): string =>
  BY_CATEGORY.find((c) => c.match.test(category))?.color ?? FALLBACK[index % FALLBACK.length];

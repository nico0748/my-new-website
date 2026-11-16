/** api/_lib/embed.js の型（vite.config.ts から使う分だけ）。 */
export type ComponentEmbed = { component: Record<string, unknown> };
export function topEmbed(links?: { xUrl?: string; githubUrl?: string; qiitaUrl?: string }): ComponentEmbed | null;
export function componentEmbedScript(payload: ComponentEmbed): string;

// Vercel Routing Middleware: SNS のクローラーが トップ（/）を読みに来たときだけ、api/embed.js（?page=top）へ回す。
// トップは静的な index.html が vercel.json の rewrites より先に返るため、ここで振り分ける。
// 人のアクセスは何もせず素通り（静的な index.html のまま）。下層ページの振り分けは vercel.json の rewrites。

export const config = { matcher: "/" };

const CRAWLER = /Discordbot|Twitterbot|Slackbot|facebookexternalhit|LinkedInBot|TelegramBot|Bluesky|Misskey|Mastodon/;

export default function middleware(request) {
  if (!CRAWLER.test(request.headers.get("user-agent") ?? "")) {
    return new Response(null, { headers: { "x-middleware-next": "1" } });
  }
  const url = new URL("/api/embed?page=top", request.url);
  return new Response(null, { headers: { "x-middleware-rewrite": url.href } });
}

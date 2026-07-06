/** kit.tsx の Code 用シンタックスハイライト。
 *  highlight.js のコアに、教材で使う言語だけを登録して軽量化する。
 *  記事チャンク側で読み込まれるため、ポートフォリオ本体のバンドルには載らない。 */

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import go from "highlight.js/lib/languages/go";
import sql from "highlight.js/lib/languages/sql";
import ruby from "highlight.js/lib/languages/ruby";
import php from "highlight.js/lib/languages/php";
import swift from "highlight.js/lib/languages/swift";
import graphql from "highlight.js/lib/languages/graphql";
import protobuf from "highlight.js/lib/languages/protobuf";
import http from "highlight.js/lib/languages/http";

let registered = false;
function ensureRegistered() {
  if (registered) return;
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("xml", xml); // html / vue / erb の近似にも使う
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("yaml", yaml);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("rust", rust);
  hljs.registerLanguage("go", go);
  hljs.registerLanguage("sql", sql);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("php", php);
  hljs.registerLanguage("swift", swift);
  hljs.registerLanguage("graphql", graphql);
  hljs.registerLanguage("protobuf", protobuf);
  hljs.registerLanguage("http", http);
  registered = true;
}

/** 記事で使う lang 指定 → highlight.js の言語名へ正規化。未対応は plaintext。 */
const LANG_MAP: Record<string, string> = {
  ts: "typescript", tsx: "typescript", typescript: "typescript",
  js: "javascript", jsx: "javascript", javascript: "javascript", mjs: "javascript",
  bash: "bash", shell: "bash", sh: "bash", zsh: "bash",
  json: "json",
  yaml: "yaml", yml: "yaml",
  css: "css", scss: "css",
  html: "xml", xml: "xml", vue: "xml", erb: "xml", svg: "xml",
  python: "python", py: "python",
  rust: "rust",
  go: "go",
  sql: "sql",
  ruby: "ruby", rb: "ruby",
  php: "php",
  swift: "swift",
  graphql: "graphql", gql: "graphql",
  protobuf: "protobuf", proto: "protobuf",
  http: "http",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface HighlightResult {
  /** ハイライト済み HTML（.hljs トークンの span を含む） */
  html: string;
  /** 実際に使った highlight.js の言語名（未対応なら "plaintext"） */
  language: string;
}

export function highlightCode(code: string, lang?: string): HighlightResult {
  ensureRegistered();
  const mapped = lang ? LANG_MAP[lang.toLowerCase()] : undefined;
  if (mapped && hljs.getLanguage(mapped)) {
    try {
      const { value } = hljs.highlight(code, { language: mapped, ignoreIllegals: true });
      return { html: value, language: mapped };
    } catch {
      /* fallthrough to plaintext */
    }
  }
  return { html: escapeHtml(code), language: "plaintext" };
}

import re, json, os, glob

SRC = "src/content/learn/it-terms"
OUT = "src/lib/itTerms.ts"

# meta section key + title from each article
meta_re   = re.compile(r'section:\s*"([^"]+)"')
sec_re    = re.compile(r'<Section>(.*?)</Section>', re.S)
row3_re   = re.compile(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\]')
kv_re     = re.compile(r'\{\s*key:\s*"((?:[^"\\]|\\.)*)"\s*,\s*val:\s*"((?:[^"\\]|\\.)*)"\s*\}')
# 記事末尾の関連語マップ: export const RELATED: Record<string, string[]> = { "語": ["関連語", ...], ... };
related_block_re = re.compile(r'export const RELATED[\s\S]*?\n\};')
related_pair_re  = re.compile(r'"((?:[^"\\]|\\.)*)"\s*:\s*\[([^\]]*)\]')
str_re           = re.compile(r'"((?:[^"\\]|\\.)*)"')

entries = []
for path in sorted(glob.glob(f"{SRC}/*.tsx")):
    src = open(path, encoding="utf-8").read()
    m = meta_re.search(src)
    # 誤検出を除去（meta ブロックと headers={[...]}）: オフセットを保つため空白で潰す
    def blank(match):
        return " " * (match.end() - match.start())
    src = re.sub(r'export const meta[\s\S]*?\n\};', blank, src, count=1)
    src = re.sub(r'headers=\{\[[\s\S]*?\]\}', blank, src)
    # 関連語マップは先に切り出して本文スキャンからは除外する
    # （値が3語の配列だと row3_re が用語行と誤認するため）
    related = {}
    rb = related_block_re.search(src)
    if rb:
        for pm in related_pair_re.finditer(rb.group(0)):
            related[pm.group(1)] = str_re.findall(pm.group(2))
        src = related_block_re.sub(blank, src, count=1)
    if not m:
        continue
    section = m.group(1)
    # walk linearly, tracking current <Section> heading
    events = []
    for mm in sec_re.finditer(src):
        events.append((mm.start(), "sec", re.sub(r'<[^>]+>', '', mm.group(1)).strip()))
    for mm in row3_re.finditer(src):
        events.append((mm.start(), "row", (mm.group(1), mm.group(2), mm.group(3))))
    for mm in kv_re.finditer(src):
        events.append((mm.start(), "kv", (mm.group(1), "", mm.group(2))))
    events.sort(key=lambda e: e[0])
    cur = ""
    for _, kind, val in events:
        if kind == "sec":
            cur = val
        else:
            term, en, desc = val
            if not term or not desc:
                continue
            entries.append({
                "term": term, "en": en, "desc": desc,
                "section": section, "group": cur,
                "related": related.get(term, []),
            })

# de-dup on (term, section)
seen, uniq = set(), []
for e in entries:
    k = (e["term"], e["section"])
    if k in seen:
        continue
    seen.add(k)
    uniq.append(e)

# ── 関連語の正規化 ──────────────────────────────────
# 記事側は「リクエスト」のように素の語で書けるが、見出し語は
# 「リクエスト / レスポンス」のような複合形のことがある。
# スラッシュ分割・括弧除去した別名から正引きして、実在する見出し語へ寄せる。
canonical = {}
def _reg(a, canon):
    a = a.strip()
    if a and a not in canonical:
        canonical[a] = canon

for e in uniq:                       # 完全一致を最優先で登録
    _reg(e["term"], e["term"])
for e in uniq:                       # 次に別名（括弧除去・スラッシュ分割）
    t = e["term"]
    _reg(re.sub(r'（[^）]*）', '', t), t)
    for part in re.split(r'\s*/\s*', t):
        _reg(part, t)
        _reg(re.sub(r'（[^）]*）', '', part), t)

unresolved = []
for e in uniq:
    out = []
    for r in e["related"]:
        c = canonical.get(r.strip())
        if c is None:
            unresolved.append((e["term"], r))
            continue
        if c == e["term"] or c in out:   # 自己参照・正規化後の重複は落とす
            continue
        out.append(c)
    e["related"] = out

header = '''/** IT用語コースの用語インデックス（自動生成）。
 *  生成元: src/content/learn/it-terms/*.tsx
 *  再生成: python3 scripts/gen-it-terms.py
 *  検索パレット（LearnSearch）が用語＋意味を表示するために使う。 */

export interface ItTerm {
  /** 見出し語 */
  term: string;
  /** 英語表記・分類（無い場合は空文字） */
  en: string;
  /** 意味 */
  desc: string;
  /** it-terms の章キー */
  section: string;
  /** 記事内の見出し（グループ） */
  group: string;
  /** 関連語（意味的に近い語・対義語）。記事 TSX の `export const RELATED` 由来 */
  related: string[];
}

export const IT_TERMS: ItTerm[] = '''

with open(OUT, "w", encoding="utf-8") as f:
    f.write(header + json.dumps(uniq, ensure_ascii=False, indent=2) + ";\n")

print(f"extracted {len(uniq)} terms -> {OUT}")
from collections import Counter
for s, c in Counter(e["section"] for e in uniq).items():
    print(f"  {s}: {c}")

no_rel = [e["term"] for e in uniq if not e["related"]]
print(f"related: {sum(len(e['related']) for e in uniq)} links, 関連語なし {len(no_rel)} 語")
if no_rel:
    print("  " + " / ".join(no_rel[:20]))
if unresolved:
    print(f"WARNING: 見出し語に存在しない関連語 {len(unresolved)} 件（該当語を追加するか綴りを直してください）")
    for term, bad in unresolved[:30]:
        print(f"  {term} -> {bad}")

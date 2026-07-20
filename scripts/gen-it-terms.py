import re, json, os, glob

SRC = "src/content/learn/it-terms"
OUT = "src/lib/itTerms.ts"

# meta section key + title from each article
meta_re   = re.compile(r'section:\s*"([^"]+)"')
sec_re    = re.compile(r'<Section>(.*?)</Section>', re.S)
row3_re   = re.compile(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\]')
kv_re     = re.compile(r'\{\s*key:\s*"((?:[^"\\]|\\.)*)"\s*,\s*val:\s*"((?:[^"\\]|\\.)*)"\s*\}')

entries = []
for path in sorted(glob.glob(f"{SRC}/*.tsx")):
    src = open(path, encoding="utf-8").read()
    m = meta_re.search(src)
    # 誤検出を除去（meta ブロックと headers={[...]}）: オフセットを保つため空白で潰す
    def blank(match):
        return " " * (match.end() - match.start())
    src = re.sub(r'export const meta[\s\S]*?\n\};', blank, src, count=1)
    src = re.sub(r'headers=\{\[[\s\S]*?\]\}', blank, src)
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
            entries.append({"term": term, "en": en, "desc": desc, "section": section, "group": cur})

# de-dup on (term, section)
seen, uniq = set(), []
for e in entries:
    k = (e["term"], e["section"])
    if k in seen:
        continue
    seen.add(k)
    uniq.append(e)

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
}

export const IT_TERMS: ItTerm[] = '''

with open(OUT, "w", encoding="utf-8") as f:
    f.write(header + json.dumps(uniq, ensure_ascii=False, indent=2) + ";\n")

print(f"extracted {len(uniq)} terms -> {OUT}")
from collections import Counter
for s, c in Counter(e["section"] for e in uniq).items():
    print(f"  {s}: {c}")

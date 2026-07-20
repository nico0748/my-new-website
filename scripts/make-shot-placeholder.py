#!/usr/bin/env python3
"""教材記事に差し込むスクリーンショットのプレースホルダ SVG を生成する。

使い方:
    python3 scripts/make-shot-placeholder.py <domain> <article-id> <連番> "<撮影指示>"

例:
    python3 scripts/make-shot-placeholder.py api-practice go-setup-and-project 1 "go version の実行結果"

出力先:
    public/learn/shots/<domain>/<article-id>-<連番2桁>.svg

生成した SVG には「何を撮るか」「差し替え先のファイル名」が描かれているので、
サイト上でも一覧上でも、どのキャプチャが必要な枠かがそのまま読める。
実際のキャプチャができたら、この SVG を同名の画像に差し替える
（拡張子を変える場合は記事側の Figure の src も合わせて更新する）。
"""

import sys
import os
import re
from xml.sax.saxutils import escape

W, H = 1200, 675  # 16:9。記事本文の幅で見たときに収まりが良い比率

# 見た目は Learn テーマ（ライト・ティール）に合わせる
BG = "#f4f7f8"
BORDER = "#22b0a0"
LABEL = "#0f6e56"
TEXT = "#34495e"
MUTED = "#7b8794"


def wrap(text: str, limit: int) -> list[str]:
    """日本語混在を想定し、文字数ベースで素朴に折り返す。"""
    lines, cur = [], ""
    for ch in text:
        cur += ch
        if len(cur) >= limit:
            lines.append(cur)
            cur = ""
    if cur:
        lines.append(cur)
    return lines[:3]  # 3行を超える指示は切り詰める（一覧側に全文が残る）


def build_svg(filename: str, instruction: str) -> str:
    lines = wrap(instruction, 30)
    # 指示文を縦中央に配置する
    start_y = 372 - (len(lines) - 1) * 21
    body = "\n".join(
        f'  <text x="{W//2}" y="{start_y + i*42}" text-anchor="middle" '
        f'font-family="Inter, \'Noto Sans JP\', sans-serif" font-size="30" fill="{TEXT}">'
        f"{escape(line)}</text>"
        for i, line in enumerate(lines)
    )

    return f"""<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="スクリーンショット差し込み予定: {escape(instruction)}">
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <rect x="10" y="10" width="{W-20}" height="{H-20}" fill="none" stroke="{BORDER}" stroke-width="3" stroke-dasharray="14 10" rx="10"/>

  <rect x="{W//2-150}" y="188" width="300" height="46" rx="23" fill="{BORDER}" opacity="0.14"/>
  <text x="{W//2}" y="219" text-anchor="middle" font-family="Inter, sans-serif" font-size="21" font-weight="700" letter-spacing="3" fill="{LABEL}">SCREENSHOT</text>

  <text x="{W//2}" y="288" text-anchor="middle" font-family="Inter, 'Noto Sans JP', sans-serif" font-size="21" fill="{MUTED}">ここに実際のキャプチャを入れる</text>

{body}

  <text x="{W//2}" y="{H-56}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="20" fill="{MUTED}">{escape(filename)}</text>
</svg>
"""


def main() -> int:
    if len(sys.argv) != 5:
        print(__doc__)
        return 1

    domain, article_id, seq, instruction = sys.argv[1:5]

    # パスに使う値なので、想定外の文字が混ざっていないか検証する
    for label, value in (("domain", domain), ("article-id", article_id)):
        if not re.fullmatch(r"[a-z0-9\-]+", value):
            print(f"error: {label} に使えない文字が含まれています: {value}")
            return 1
    if not seq.isdigit():
        print(f"error: 連番は数字で指定してください: {seq}")
        return 1

    filename = f"{article_id}-{int(seq):02d}.svg"
    out_dir = os.path.join("public", "learn", "shots", domain)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, filename)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(build_svg(filename, instruction))

    # 記事に貼る src と、一覧に載せる行をそのまま出力する
    print(f"/learn/shots/{domain}/{filename}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

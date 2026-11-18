import React from "react";
import { ExternalLink } from "lucide-react";

/**
 * 外部サイトへのリンク（新しいタブで開くもの）に付ける印。文字の大きさに合わせて伸び縮みする。
 * 読み上げない（リンクの名前はリンクの文字だけにする）。Markdown・Works 記事の本文では CSS で同じ形を付けている。
 */
const ExternalIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <ExternalLink
    aria-hidden
    focusable={false}
    size="0.85em"
    strokeWidth={2}
    className={`inline-block shrink-0 align-[-0.08em] ${className}`}
  />
);

export default ExternalIcon;

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface FoxPeekProps {
  children: ReactNode;
  /** どちらの側から覗かせるか（要素の裏から左右どちらに頭を出すか） */
  side?: "left" | "right";
  /** 狐の幅（px）。default 100 */
  size?: number;
  /** ピーク開始の追加遅延（秒） */
  delay?: number;
  /** ラッパーに付与する追加クラス */
  className?: string;
  /** 縦位置（'50%' = 中央。'80%' で下寄りなど） */
  topOffset?: string;
  /** true なら block 表示（grid/flex の子に向く）。false なら inline-block */
  block?: boolean;
  /** 狐画像の URL（public/ 以下の絶対パス）。指定された場合は SVG ではなく画像を使う。 */
  image?: string;
  /** 画像が元々向いている向き。素材画像の鼻先がどちらを向いているか。default "left" */
  imageFacing?: "left" | "right";
  /** 顔をのぞかせる割合（width 比、0〜1）。default 0.55 */
  peekRatio?: number;
}

/**
 * 化け猫の側面シルエット（黒）— 妖艶な金の眼が一つ浮かぶ。
 * 既定では右向き（鼻先が右）。`mirror` で左向きに反転。
 * （image プロップが無いときのフォールバック）
 */
const MysticCatSilhouette = ({
  size,
  mirror = false,
}: {
  size: number;
  mirror?: boolean;
}) => (
  <svg
    viewBox="0 0 80 50"
    width={size}
    height={(size * 50) / 80}
    aria-hidden
    style={{
      display: "block",
      overflow: "visible",
      transform: mirror ? "scaleX(-1)" : undefined,
    }}
  >
    <path
      d="M 4 42 L 4 28 Q 4 22 8 16 L 14 4 L 22 16 L 32 16 L 40 4 L 50 18 Q 60 18 70 24 Q 76 28 76 32 Q 72 36 64 36 L 56 36 L 44 38 Q 26 42 4 42 Z"
      fill="#080605"
    />
    <path d="M 4 42 Q 12 46 24 46 L 28 50 L 4 50 Z" fill="#080605" />
    <ellipse cx="34" cy="22" rx="3.2" ry="3.2" fill="var(--accent-gold)" opacity="0.28" />
    <ellipse cx="34" cy="22" rx="1.2" ry="2.2" fill="var(--accent-gold)" />
    <ellipse cx="34" cy="22" rx="0.4" ry="2" fill="#3a2810" opacity="0.85" />
  </svg>
);

/**
 * 子要素の「裏」に狐を仕込んで、ビューポート進入時に横からひょっこり顔を出すラッパー。
 *
 * 仕組み:
 * - ラッパーは `position: relative` + `isolation: isolate` で独立スタッキング。
 * - 狐は `z-index: 0`（裏）、子要素は `z-index: 1`（表）。
 * - 初期は要素と完全に重なって不可視。InView で translateX して半分顔を出し、首を傾げて引っ込む。
 *
 * 画像の向きについて:
 * - 画像は `imageFacing` で「素材の鼻先の向き」を指定（default "left"）。
 * - 覗く側（side）と素材向きが逆のとき、自動で scaleX(-1) で反転して、
 *   常に頭側がアイテム外に向くように調整する。
 */
const FoxPeek = ({
  children,
  side = "left",
  size = 100,
  delay = 0,
  className = "",
  topOffset = "50%",
  block = false,
  image,
  imageFacing = "left",
  peekRatio = 0.55,
}: FoxPeekProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const peekPct = `${peekRatio * 100}%`;
  const peekX = side === "left" ? `-${peekPct}` : peekPct;
  const tilt = side === "left" ? -1 : 1;

  // 顔（鼻先）が外側を向くように mirror を決める
  // - side="left" なら鼻先は左を向いてほしい
  // - side="right" なら鼻先は右を向いてほしい
  // 素材の鼻先 (imageFacing) と覗く側 (side) が一致しなければ反転する
  const mirror = side !== imageFacing;

  return (
    <div
      ref={ref}
      className={`relative ${block ? "block w-full h-full" : "inline-block"} ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* 狐 — 裏に配置 */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: topOffset,
          [side === "left" ? "left" : "right"]: 0,
          transform: "translateY(-50%)",
          zIndex: 0,
        }}
        aria-hidden
      >
        <motion.div
          initial={{ x: "0%", rotate: 0 }}
          animate={
            inView
              ? {
                  x: ["0%", peekX, peekX, peekX, "0%"],
                  rotate: [0, 0, -6 * tilt, 6 * tilt, 0],
                }
              : { x: "0%", rotate: 0 }
          }
          transition={{
            duration: 2.8,
            times: [0, 0.18, 0.45, 0.72, 1],
            ease: "easeInOut",
            delay: 0.45 + delay,
          }}
          style={{ transformOrigin: "50% 100%" }}
        >
          {image ? (
            <img
              src={image}
              alt=""
              aria-hidden
              draggable={false}
              style={{
                width: size,
                height: "auto",
                display: "block",
                transform: mirror ? "scaleX(-1)" : undefined,
                userSelect: "none",
              }}
            />
          ) : (
            <MysticCatSilhouette size={size} mirror={mirror} />
          )}
        </motion.div>
      </div>

      {/* 子要素 — 表に配置（狐の前に出る） */}
      <div className="relative h-full" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default FoxPeek;

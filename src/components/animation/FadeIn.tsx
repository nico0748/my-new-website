import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// コンポーネントが受け取るpropsの型を定義
interface Props {
  children: React.ReactNode;
  delay?: number; // アニメーションの遅延時間（任意）
  duration?: number; // アニメーションの再生時間（任意）
}

// アニメーションのバリエーションを定義
const fadeInVariants: Variants = {
  // 初期状態: Y軸方向に20pxずらし、透明にする
  hidden: { y: 20, opacity: 0 },
  // 表示後の状態: Y軸を0にし、不透明にする
  visible: { y: 0, opacity: 1 },
};

const FadeIn: React.FC<Props> = ({ children, delay = 0, duration = 0.5 }) => {
  return (
    // motion.divで囲み、アニメーションのプロパティを設定
    <motion.div
      variants={fadeInVariants}
      initial="hidden"       // 初期状態
      whileInView="visible"  // 画面内に入ったら"visible"に変化
      viewport={{ once: true }} // アニメーションを一度だけ再生
      transition={{ 
        duration: duration,  // 再生時間
        delay: delay,        // 遅延時間
        ease: 'easeOut'      // イージング（動きの緩急）
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
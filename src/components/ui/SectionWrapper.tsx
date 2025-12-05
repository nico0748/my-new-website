import React from 'react';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  id, 
  title, 
  children, 
  className = "" 
}) => {
  return (
    //セクション総高さ = min-height + padding-top + padding-bottom + コンテンツ高さ
    //基本の高さ：min-h-screen→最小の高さを100vhで設定  ＊詳細設定するならmin-h-[75vh]
    //レスポンシブ対応： py-20→上下パディング80px(モバイル)  md:py-32→上下パディング128px
    //最小の場合：
    //- モバイル: 100vh + 80px(py-20) + 80px(py-20) = 100vh + 160px
    //- デスクトップ: 100vh + 128px(py-32) + 128px(py-32) = 100vh + 256px
    <section 
      id={id} 
      className={`py-10 md:py-16 min-h-[50vh] flex items-center justify-center w-full max-w-full overflow-x-hidden ${className}`}
    >
      <div className="w-full max-w-8xl mx-auto px-4 flex flex-col items-center ">
        <h2 className="text-5xl md:text-7xl font-bold mb-12 text-center w-full text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {title}
        </h2>
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;
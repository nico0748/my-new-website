import React from 'react';

const Hero: React.FC = () => {
  return (
    // <section> に高さを指定し、要素を中央に配置
    <section className="h-screen flex justify-center items-center overflow-x: hidden;">
      <div className="text-center">
        {/* rubyタグとrtタグを使用してルビを表現 */}
        <ruby className="font-concert-one text-[#333]">
          {/* h1 にアニメーションとフォントサイズを適用 */}
          <h1 className="text-hero-title inline-block animate-fade-in">
            {/* ルビのテキストと親テキストを配置 */}
            NI<rt className="text-hero-ruby font-extrabold transition-all duration-500 ease-in-out">に</rt>
            CO<rt className="text-hero-ruby font-extrabold transition-all duration-500 ease-in-out">こ</rt>
            <div>
              LA<rt className="text-hero-ruby font-extrabold transition-all duration-500 ease-in-out">ラ</rt>
              BO<rt className="text-hero-ruby font-extrabold transition-all duration-500 ease-in-out">ボ</rt>
            </div>
          </h1>
        </ruby>
        {/* リード文とタグにカスタムフォントサイズを適用 */}
        <p className="text-hero-lead my-2">Welcome to my homepage!</p>
        <p className="text-hero-tag">Let's see it!</p>
      </div>
    </section>
  );
};

export default Hero;
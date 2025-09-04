import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4">NICOLABO -にこラボ-</h1>
      <p className="text-lg sm:text-xl md:text-2xl">あなたの活動をサポートする個人サイトです。</p>
    </section>
  );
};

export default Hero;

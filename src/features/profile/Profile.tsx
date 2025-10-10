// Profile Component
import React from 'react';
import type { ProfileData } from '../../types';

// =================================================================
// 1. 型定義は types/index.ts に移行済み
// =================================================================

// Profileコンポーネントが受け取るPropsの型を定義します
interface ProfileProps {
  data: ProfileData;
}


// =================================================================
// 2. コンポーネント
// =================================================================

const Profile: React.FC<ProfileProps> = ({ data }) => {
  return (
    <section id="profile" className="py-10 md:py-16 min-h-[50vh] flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Profile</h2>
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* 左のボックス */}
          <div className="md:w-1/3 w-full bg-[#e8dbc6] p-6 rounded-lg shadow-md flex flex-col">
            <img src={data.imageUrl} alt={data.name} className="w-full h-auto aspect-square object-cover rounded-md mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-center">{data.name}</h3>
            <p className="text-base text-gray-700 text-center">{data.title}</p>
            <div className="flex justify-center space-x-4 mt-auto pt-4">
              {/* `data.socialLinks`が`SocialLink[]`型なので、
                TypeScriptは自動的に`link`変数が`SocialLink`型であると推論します。
                これにより、`link.url`や`link.icon`などのプロパティを安全に呼び出せます。
              */}
              {data.socialLinks.map(link => (
                <a key={link.name} href={link.url} aria-label={link.name} className="text-gray-600 hover:text-blue-500 transition-colors">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          {/* 右のボックス */}
          <div className="md:w-2/3 w-full bg-[#e8dbc6] p-6 md:p-8 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: data.bio }}></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

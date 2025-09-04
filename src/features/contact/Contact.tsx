import React from 'react';
import type { ContactProps } from '../../types';

const Contact: React.FC<ContactProps> = ({ handleContactSubmit }) => {
  return (
    <section id="contact" className="py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Contact</h2>
        <div className="bg-[#e8dbc6] p-6 md:p-8 rounded-lg shadow-md">
          <form onSubmit={handleContactSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-2">お名前</label>
              <input type="text" id="name" name="name" required className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2">メールアドレス</label>
              <input type="email" id="email" name="email" required className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 text-lg font-bold mb-2">お問い合わせ内容</label>
              <textarea id="message" name="message" rows={5} required className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                送信する
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

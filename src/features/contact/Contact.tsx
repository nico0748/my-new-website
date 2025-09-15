import React from 'react';
import type { ContactProps } from '../../types';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';

const Contact: React.FC<ContactProps> = ({ handleContactSubmit }) => {
  return (
    <SectionWrapper id="contact" title="Contact">
      <div className="bg-[#e8dbc6] p-6 md:p-8 rounded-lg shadow-md w-full max-w-2xl">
        <form onSubmit={handleContactSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium mb-2">お名前</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">メールアドレス</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium mb-2">メッセージ</label>
            <textarea 
              id="message" 
              name="message" 
              rows={5} 
              required 
              className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
            ></textarea>
          </div>
          <div className="text-center">
            <Button type="submit" size="lg">
              送信
            </Button>
          </div>
        </form>
      </div>
    </SectionWrapper>
  );
};

export default Contact;

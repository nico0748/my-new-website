import React from 'react';
import type { ContactProps } from '../../types';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';
import { useContactForm } from './useContactForm';

const Contact: React.FC<ContactProps> = ({ handleContactSubmit }) => {
  const {
    formData,
    isLoading,
    isSubmitted,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useContactForm(() => {
    // 成功時のコールバック - App.tsxの元のhandleContactSubmitを呼び出し
    const mockEvent = {
      preventDefault: () => {},
      target: document.createElement('form')
    } as unknown as React.FormEvent<HTMLFormElement>;
    
    handleContactSubmit(mockEvent);
  });

  return (
    <SectionWrapper id="contact" title="Contact">
      <div className="bg-[#e8dbc6] p-6 md:p-8 rounded-lg shadow-md w-full max-w-2xl">
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-xl font-semibold mb-4">
              ✓ 送信完了
            </div>
            <p className="text-gray-700 mb-6">
              お問い合わせありがとうございます。<br />
              内容を確認の上、3営業日以内に返信いたします。
            </p>
            <Button onClick={resetForm} variant="secondary">
              新しいメッセージを送信
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm">{error}</div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required 
                disabled={isLoading}
                className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50" 
                placeholder="山田太郎"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required 
                disabled={isLoading}
                className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50" 
                placeholder="example@email.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                メッセージ <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required 
                disabled={isLoading}
                className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none disabled:opacity-50"
                placeholder="お問い合わせ内容をご記入ください..."
              />
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? '送信中...' : '送信'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Contact;

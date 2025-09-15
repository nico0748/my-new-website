import { useState } from 'react';
import type { ContactFormData } from '../../types';
import { sendContactEmail, sanitizeContactData } from './contactService';

export interface UseContactFormReturn {
  formData: ContactFormData;
  isLoading: boolean;
  isSubmitted: boolean;
  errors: string[];
  handleInputChange: (field: keyof ContactFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
}

export const useContactForm = (onSuccess?: (message: string) => void): UseContactFormReturn => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // エラーをクリア
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLoading) return;

    setIsLoading(true);
    setErrors([]);

    try {
      // データのサニタイズ
      const sanitizedData = sanitizeContactData(formData);
      
      // メール送信
      const response = await sendContactEmail(sanitizedData);

      if (response.success) {
        setIsSubmitted(true);
        if (onSuccess) {
          onSuccess(response.message);
        }
      } else {
        setErrors(response.error ? response.error.split('\n') : [response.message]);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setErrors(['予期しないエラーが発生しました。もう一度お試しください。']);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setIsSubmitted(false);
    setErrors([]);
    setIsLoading(false);
  };

  return {
    formData,
    isLoading,
    isSubmitted,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};
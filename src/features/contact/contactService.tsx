import type { ContactFormData, ContactResponse } from '../../types';

// フォームデータのバリデーション
export const validateContactForm = (data: ContactFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 名前のバリデーション
  if (!data.name.trim()) {
    errors.push('お名前を入力してください。');
  } else if (data.name.trim().length < 2) {
    errors.push('お名前は2文字以上で入力してください。');
  } else if (data.name.trim().length > 50) {
    errors.push('お名前は50文字以下で入力してください。');
  }

  // メールアドレスのバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.push('メールアドレスを入力してください。');
  } else if (!emailRegex.test(data.email.trim())) {
    errors.push('有効なメールアドレスを入力してください。');
  }

  // メッセージのバリデーション
  if (!data.message.trim()) {
    errors.push('メッセージを入力してください。');
  } else if (data.message.trim().length < 10) {
    errors.push('メッセージは10文字以上で入力してください。');
  } else if (data.message.trim().length > 1000) {
    errors.push('メッセージは1000文字以下で入力してください。');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 模擬的なメール送信機能
export const sendContactEmail = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    // バリデーション実行
    const validation = validateContactForm(data);
    if (!validation.isValid) {
      return {
        success: false,
        message: '入力内容にエラーがあります。',
        error: validation.errors.join('\n')
      };
    }

    // 模擬的な処理として2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 成功レスポンス
    console.log('お問い合わせフォーム送信:', {
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: 'お問い合わせありがとうございます。内容を確認の上、3営業日以内に返信いたします。'
    };

  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      message: 'メールの送信に失敗しました。しばらく時間をおいてから再度お試しください。',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// フォームデータのサニタイズ
export const sanitizeContactData = (data: ContactFormData): ContactFormData => {
  return {
    name: data.name.trim().replace(/[<>]/g, ''),
    email: data.email.trim().toLowerCase(),
    message: data.message.trim().replace(/[<>]/g, '')
  };
};
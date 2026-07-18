import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {t('layout.appName')}
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {t('auth.welcomeTitle')}
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

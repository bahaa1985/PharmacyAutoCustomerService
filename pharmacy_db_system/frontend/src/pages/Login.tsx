import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';
import { useLanguage } from '../context/LanguageContext';
import medispondLogo from "../../public/medispond_logo.png"
export const LoginPage: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4" dir={dir}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {t('layout.appName')}
        </h1> */}
  <img src={medispondLogo} className='w-full h-auto' />
        <p className="text-gray-600 text-center mb-8">
          {t('auth.welcomeTitle')}
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

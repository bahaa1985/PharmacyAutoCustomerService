import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MessagesList } from '../features/messages/MessagesList';
import { useLanguage } from '../context/LanguageContext';

export const MessagesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{t('messages.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('messages.subtitle')}
          </p>
        </div>
        <MessagesList />
      </div>
    </PageWrapper>
  );
};

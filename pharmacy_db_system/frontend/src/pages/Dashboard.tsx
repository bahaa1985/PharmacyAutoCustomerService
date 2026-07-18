import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { DashboardStats } from '../features/dashboard/DashboardStats';
import { useLanguage } from '../context/LanguageContext';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('dashboard.welcome')}
          </p>
        </div>
        <DashboardStats />
      </div>
    </PageWrapper>
  );
};

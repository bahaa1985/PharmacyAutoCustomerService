import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { DashboardStats } from '../features/dashboard/DashboardStats';

export const DashboardPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your pharmacy.
          </p>
        </div>
        <DashboardStats />
      </div>
    </PageWrapper>
  );
};

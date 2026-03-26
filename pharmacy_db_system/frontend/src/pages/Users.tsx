import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { NewUser } from '../features/users/NewUser';

export const UsersPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">
            Manage your pharmacy users.
          </p>
        </div>
        <NewUser />
      </div>
    </PageWrapper>
  );
};

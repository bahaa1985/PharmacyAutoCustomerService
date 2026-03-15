import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MessagesList } from '../features/messages/MessagesList';

export const MessagesPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Manage your pharmacy notifications and messages.
          </p>
        </div>
        <MessagesList />
      </div>
    </PageWrapper>
  );
};

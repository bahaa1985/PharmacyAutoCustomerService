import React, { useEffect, useState } from 'react';
import { messagesAPI } from '../../api/messagesAPI';
import type{ Message } from '../../types/message';
import { MessageItem } from './MessageItem';

export const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await messagesAPI.getMessages();
      setMessages(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await messagesAPI.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete message';
      setError(message);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading messages...</div>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No messages found</div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

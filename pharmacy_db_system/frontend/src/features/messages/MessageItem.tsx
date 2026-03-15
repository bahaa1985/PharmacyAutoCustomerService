import React from 'react';
import type { Message } from '../../types/message';

interface MessageItemProps {
  message: Message;
  onDelete?: (id: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onDelete,
}) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {message.title}
          </h3>
          <p className="text-gray-600 mt-2">{message.content}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(message.id)}
            className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        {new Date(message.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

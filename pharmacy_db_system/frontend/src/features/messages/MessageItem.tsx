import React from 'react';
import type { Message } from '../../types/message';
import { useLanguage } from '../../context/LanguageContext';

interface MessageItemProps {
  message: Message;
  onDelete?: (id: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onDelete,
}) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {message.from_number} → {message.to_number}
          </h3>
          <p className="text-gray-600 mt-2">{message.message || (message.image_url ? t('messages.imageMessage') : t('messages.noContent'))}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(message.id)}
            className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            {t('common.delete')}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        {new Date(message.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

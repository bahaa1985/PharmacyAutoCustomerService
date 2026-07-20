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
    <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-lg text-gray-900 truncate">
            {message.from_number} → {message.to_number}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 break-words">
            {message.message || (message.image_url ? t('messages.imageMessage') : t('messages.noContent'))}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(message.id)}
            className="shrink-0 px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            {t('common.delete')}
          </button>
        )}
      </div>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-4">
        {new Date(message.created_at).toLocaleString()}
      </p>
    </div>
  );
};


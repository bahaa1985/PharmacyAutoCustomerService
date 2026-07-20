import React, { useMemo } from 'react';
import type { Contact } from '../../types/contact';
import type { Message } from '../../types/message';
import { useLanguage } from '../../context/LanguageContext';

interface ContactsListProps {
  contacts: Contact[];
  messages: Message[];
  selectedClient: string;
  clientSearch: string;
  currentUserMobile: string;
  contactMap: Map<string, Contact>;
  onClientSearchChange: (value: string) => void;
  onSelectClient: (phone: string) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  messages,
  selectedClient,
  clientSearch,
  currentUserMobile,
  contactMap,
  onClientSearchChange,
  onSelectClient,
}) => {
  const { t } = useLanguage();
  const participants = useMemo(() => {
    const set = new Set<string>();

    messages.forEach((message) => {
      const other = message.from_number === currentUserMobile ? message.to_number : message.from_number;
      if (other && other !== currentUserMobile) {
        set.add(other);
      }
    });

    contacts.forEach((contact) => {
      if (contact.phone !== currentUserMobile) {
        set.add(contact.phone);
      }
    });

    return Array.from(set).sort((a, b) => {
      const nameA = contactMap.get(a)?.name || a;
      const nameB = contactMap.get(b)?.name || b;
      return nameA.localeCompare(nameB);
    });
  }, [messages, contacts, contactMap, currentUserMobile]);

  const filteredParticipants = useMemo(() => {
    const term = clientSearch.toLowerCase();

    return participants.filter((phone) => {
      const name = contactMap.get(phone)?.name || phone;
      return name.toLowerCase().includes(term) || phone.includes(term);
    });
  }, [participants, contactMap, clientSearch]);

    return (
    <aside className="flex flex-col gap-4 h-full">
      <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm shrink-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{t('messages.clients')}</h2>
        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">{t('messages.clientsHint')}</p>
        <input
          type="text"
          value={clientSearch}
          onChange={(event) => onClientSearchChange(event.target.value)}
          placeholder={t('messages.searchClients')}
          className="mt-2 sm:mt-3 w-full rounded-md border border-gray-300 px-3 py-1.5 sm:py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 sm:p-4 shadow-sm">
        {filteredParticipants.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">{t('messages.noClients')}</p>
        ) : (
          <ul className="space-y-1.5 sm:space-y-2">
            {filteredParticipants.map((phone) => {
              const contact = contactMap.get(phone);

              return (
                <li key={phone}>
                  <button
                    type="button"
                    onClick={() => onSelectClient(phone)}
                    className={`w-full rounded-lg sm:rounded-xl px-3 py-2 sm:py-3 text-left transition ${
                      selectedClient === phone
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-sm sm:text-base truncate">{contact?.name || phone}</div>
                    <div className={`text-[10px] sm:text-xs ${selectedClient === phone ? 'text-blue-100' : 'text-gray-500'}`}>
                      {phone}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );

};

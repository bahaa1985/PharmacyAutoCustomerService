import React, { useEffect, useMemo, useRef, useState } from 'react';
import { messagesAPI } from '../../api/messagesAPI';
import { contactsAPI } from '../../api/contactsAPI';
import { userAPI } from '../../api/userAPI';
import type { Message } from '../../types/message';
import type { Contact } from '../../types/contact';
import { useAuth } from '../../context/AuthContext';
import { supabaseClient } from '../../lib/supabaseClient';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const MessagesList: React.FC = () => {
  const { user, setUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [saveContactName, setSaveContactName] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState('');
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiMode, setIsAiMode] = useState(user?.ai_mode ?? true);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const isOwner = user?.role_id === 1;
  const currentUserMobile = user?.mobile || '';

  const loadContacts = async () => {
    try {
      const data = await contactsAPI.getContacts();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    }
  };

  const loadMessages = async (clientPhone?: string) => {
    if (!user) return;
    setIsLoading(true);
    setError('');
    try {
      const data = isOwner
        ? await messagesAPI.getMessagesByPharmacy(user.pharmacy_id, clientPhone)
        : await messagesAPI.getMessages(user.mobile, clientPhone);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsAiMode(user.ai_mode ?? true);
      loadContacts();
      loadMessages(selectedClient || undefined);
    }
  }, [user, selectedClient]);

  useEffect(() => {
    if (!supabaseClient || !user) return;
    const client = supabaseClient;

    const channel = client
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          const newMessageData = payload.new as Message | null;
          const oldMessageData = payload.old as Message | null;
          if (!newMessageData && !oldMessageData) return;

          const matchesCurrentUser = (msg: Message) => {
            if (!user) return false;
            if (isOwner) {
              return msg.pharmacy_id === String(user.pharmacy_id);
            }
            return msg.from_number === user.mobile || msg.to_number === user.mobile;
          };

          const matchesClientSelection = (msg: Message) => {
            if (!selectedClient) return true;
            return (
              (msg.from_number === currentUserMobile && msg.to_number === selectedClient) ||
              (msg.from_number === selectedClient && msg.to_number === currentUserMobile)
            );
          };

          if (payload.eventType === 'INSERT' && newMessageData && matchesCurrentUser(newMessageData)) {
            if (matchesClientSelection(newMessageData)) {
              setMessages((prev) => {
                const exists = prev.some((item) => item.id === newMessageData.id);
                if (exists) return prev;
                const next = [...prev, { ...newMessageData, id: String(newMessageData.id) }];
                return next.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              });
            }
          }

          if (payload.eventType === 'UPDATE' && newMessageData && matchesCurrentUser(newMessageData)) {
            setMessages((prev) => prev.map((message) => (message.id === newMessageData.id ? { ...message, ...newMessageData } : message)));
          }

          if (payload.eventType === 'DELETE' && oldMessageData) {
            setMessages((prev) => prev.filter((message) => message.id !== oldMessageData.id));
          }
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [user, selectedClient, isOwner, currentUserMobile]);

  useEffect(() => {
    if (!selectedClient && !isOwner && messages.length > 0 && user) {
      const firstClient = messages.find((message) => message.from_number !== user.mobile)?.from_number ||
        messages.find((message) => message.to_number !== user.mobile)?.to_number || '';
      if (firstClient) {
        setSelectedClient(firstClient);
      }
    }
  }, [messages, selectedClient, isOwner, user]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const contactMap = useMemo(() => {
    const map = new Map<string, Contact>();
    contacts.forEach((contact) => map.set(contact.phone, contact));
    return map;
  }, [contacts]);

  const participants = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((message) => {
      const other = message.from_number === currentUserMobile ? message.to_number : message.from_number;
      if (other && other !== currentUserMobile) set.add(other);
    });
    contacts.forEach((contact) => {
      if (contact.phone !== currentUserMobile) set.add(contact.phone);
    });
    return Array.from(set).sort((a, b) => {
      const nameA = contactMap.get(a)?.name || a;
      const nameB = contactMap.get(b)?.name || b;
      return nameA.localeCompare(nameB);
    });
  }, [messages, contacts, contactMap, currentUserMobile]);

  const filteredParticipants = useMemo(() => {
    return participants.filter((phone) => {
      const name = contactMap.get(phone)?.name || phone;
      const term = clientSearch.toLowerCase();
      return name.toLowerCase().includes(term) || phone.includes(term);
    });
  }, [participants, contactMap, clientSearch]);

  const conversationMessages = useMemo(() => {
    const items = selectedClient
      ? messages.filter(
        (message) =>
          (message.from_number === currentUserMobile && message.to_number === selectedClient) ||
          (message.from_number === selectedClient && message.to_number === currentUserMobile),
      )
      : messages;
    const term = messageSearch.toLowerCase();
    return items.filter(
      (message) =>
        !term ||
        message.message?.toLowerCase().includes(term) ||
        message.image_url?.toLowerCase().includes(term) ||
        message.from_number.toLowerCase().includes(term) ||
        message.to_number.toLowerCase().includes(term),
    );
  }, [messages, selectedClient, messageSearch, currentUserMobile]);

  const selectedClientName = selectedClient ? contactMap.get(selectedClient)?.name || selectedClient : 'All clients';

  const handleSendMessage = async () => {
    if (!selectedClient) {
      setError('Please select a client to send a message.');
      return;
    }

    if (!newMessage.trim()) {
      setError('Please enter a message.');
      return;
    }

    setError('');
    try {
      const created = await messagesAPI.createMessage({
        to_number: selectedClient,
        message: newMessage.trim(),
      });
      setMessages((prev) => [...prev, created]);
      setNewMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await messagesAPI.deleteMessage(messageId);
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  const handleStartEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingText(message.message || '');
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId) return;
    try {
      const updated = await messagesAPI.updateMessage(editingMessageId, { message: editingText });
      setMessages((prev) => prev.map((message) => (message.id === updated.id ? updated : message)));
      setEditingMessageId(null);
      setEditingText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const handleSaveContact = async () => {
    if (!selectedClient) {
      setError('No client selected for saving contact information.');
      return;
    }
    if (!saveContactName.trim()) {
      setError('Please enter a name for the contact.');
      return;
    }

    setError('');
    setIsSavingContact(true);
    try {
      const contact = await contactsAPI.createContact({
        name: saveContactName.trim(),
        phone: selectedClient,
      });
      setContacts((prev) => [contact, ...prev]);
      setSaveContactName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact');
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleToggleAiMode = async () => {
    if (!user) return;
    try {
      const updatedUser = await userAPI.updateUser(BigInt(user.id), { ai_mode: !isAiMode });
      setIsAiMode(updatedUser.ai_mode);
      setUser({ ...user, ai_mode: updatedUser.ai_mode });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update AI mode');
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please sign in to view messages.</div>;
  }

  if (isLoading) return <div className="text-center py-8">Loading messages...</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
          <p className="text-sm text-gray-500 mt-1">Search and choose a client to open the conversation.</p>
          <input
            type="text"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            placeholder="Search clients"
            className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm h-[calc(100vh-220px)] overflow-y-auto">
          {filteredParticipants.length === 0 ? (
            <p className="text-sm text-gray-500">No clients match your search.</p>
          ) : (
            <ul className="space-y-2">
              {filteredParticipants.map((phone) => {
                const contact = contactMap.get(phone);
                return (
                  <li key={phone}>
                    <button
                      type="button"
                      onClick={() => setSelectedClient(phone)}
                      className={`w-full rounded-xl px-3 py-3 text-left transition ${
                        selectedClient === phone
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold">{contact?.name || phone}</div>
                      <div className="text-xs text-gray-500">{phone}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <section className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Conversation</h2>
              <p className="text-sm text-gray-500">{selectedClient ? `${selectedClientName}` : isOwner ? 'Viewing all pharmacy messages' : 'Select a client to start chatting'}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleToggleAiMode}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                AI mode: {isAiMode ? 'Enabled' : 'Disabled'}
              </button>
              {isOwner && selectedClient && (
                <button
                  type="button"
                  onClick={() => setSelectedClient('')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Show all messages
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">User</span>
              <p className="mt-1 text-sm text-gray-700">{user.username}</p>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Role</span>
              <p className="mt-1 text-sm text-gray-700">{isOwner ? 'Owner' : 'Team member'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <input
              type="text"
              value={messageSearch}
              onChange={(e) => setMessageSearch(e.target.value)}
              placeholder="Search messages"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-64"
            />
          </div>

          <div
            ref={messageContainerRef}
            className="mt-4 flex h-[calc(100vh-380px)] flex-col gap-3 overflow-y-auto rounded-xl border border-gray-200 bg-slate-50 p-4"
          >
            {conversationMessages.length === 0 ? (
              <div className="text-center text-sm text-gray-500">No messages in this conversation yet.</div>
            ) : (
              conversationMessages.map((message) => {
                const isOwnMessage = message.from_number === currentUserMobile;
                const otherPhone = isOwnMessage ? message.to_number : message.from_number;
                const senderName = isOwnMessage ? 'You' : contactMap.get(otherPhone)?.name || otherPhone;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-start' : 'justify-end'} items-start gap-3`}
                  >
                    <div className={`max-w-[80%] rounded-3xl border px-4 py-3 shadow-sm ${
                      isOwnMessage ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{senderName}</div>
                      {editingMessageId === message.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMessageId(null)}
                              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.image_url ? (
                            <img
                              src={message.image_url}
                              alt="Client media"
                              className="max-h-80 w-full rounded-xl object-cover"
                            />
                          ) : (
                            <p className="whitespace-pre-wrap text-sm text-gray-900">{message.message}</p>
                          )}
                          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
                            <span>{new Date(message.created_at).toLocaleString()}</span>
                            {isOwnMessage && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditing(message)}
                                  className="rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(message.id)}
                                  className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Send a message</h3>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
            placeholder={selectedClient ? `Message ${selectedClientName}` : 'Select a client before sending a message...'}
            className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleSendMessage}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={!selectedClient || !newMessage.trim()}
            >
              Send Message
            </button>
            {selectedClient && !contactMap.has(selectedClient) && (
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={saveContactName}
                  onChange={(e) => setSaveContactName(e.target.value)}
                  placeholder="Contact name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleSaveContact}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  disabled={isSavingContact}
                >
                  Save contact
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>
      </section>
    </div>
  );
};

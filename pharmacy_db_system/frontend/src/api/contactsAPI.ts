import api from './axios';
import type { Contact } from '../types/contact';

type BlockedContact = {
  blocked: boolean;
  contact_number: string;
};

export const contactsAPI = {
  getContacts: async (userId?: number): Promise<Contact[]> => {
    const search = userId ? `?userId=${userId}` : '';
    const response = await api.get<Contact[]>(`/contacts${search}`);
    return response.data;
  },

  createContact: async (data: { name: string, phone: string, userId: number }): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts/new', data);
    return response.data;
  },

  getBlockedContacts: async (): Promise<BlockedContact[]> => {
    const response = await api.get<BlockedContact[]>('/contacts/blocked');
    return response.data;
  },

  toggleBlockContact: async (phone: string, block: boolean): Promise<BlockedContact> => {
    const response = await api.post<BlockedContact>('/contacts/toggle-block', { phone, block });
    return response.data;
  },
};


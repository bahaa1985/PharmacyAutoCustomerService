import api from './axios';
import type { Contact } from '../types/contact';

export const contactsAPI = {
  getContacts: async (): Promise<Contact[]> => {
    const response = await api.get<Contact[]>('/contacts');
    return response.data;
  },

  createContact: async (data: { name: string, phone: string, userId: number }): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts/new', data);
    return response.data;
  },

  getBlockedContacts: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/contacts/blocked');
    return response.data;
  },

  toggleBlockContact: async (phone: string, block: boolean): Promise<any> => {
    const response = await api.post<any>('/contacts/toggle-block', { phone, block });
    return response.data;
  },
};


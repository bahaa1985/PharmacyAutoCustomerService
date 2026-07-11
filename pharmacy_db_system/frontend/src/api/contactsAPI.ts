import api from './axios';
import type { Contact } from '../types/contact';

export const contactsAPI = {
  getContacts: async (): Promise<Contact[]> => {
    const response = await api.get<Contact[]>('/contacts');
    return response.data;
  },

  createContact: async (data: { name: string; phone: string }): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts/new', data);
    return response.data;
  },
};

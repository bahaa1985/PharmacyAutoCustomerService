import api from './axios';
import type { Message, CreateMessageDto } from '../types/message';

export const messagesAPI = {
  getMessages: async (userNumber: string, contactPhone?: string): Promise<Message[]> => {
    const search = contactPhone ? `?contactPhone=${encodeURIComponent(contactPhone)}` : '';
    const response = await api.get<Message[]>(`/messages/user/${userNumber}${search}`);
    return response.data;
  },

  getMessagesByPharmacy: async (
    pharmacyId: number,
    contactPhone?: string,
  ): Promise<Message[]> => {
    const search = contactPhone ? `?contactPhone=${encodeURIComponent(contactPhone)}` : '';
    const response = await api.get<Message[]>(`/messages/pharmacy/${pharmacyId}${search}`);
    return response.data;
  },

  getMessage: async (id: string): Promise<Message> => {
    const response = await api.get<Message>(`/messages/${id}`);
    return response.data;
  },

  createMessage: async (data: CreateMessageDto): Promise<Message> => {
    const response = await api.post<Message>(`/messages/new`,data);
    return response.data;
  },

  updateMessage: async (
    id: string,
    data: Partial<CreateMessageDto>,
  ): Promise<Message> => {
    const response = await api.patch<Message>(`/messages/${id}`, data);
    return response.data;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/messages/${id}`);
  },
};
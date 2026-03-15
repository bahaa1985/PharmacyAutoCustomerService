import api from './axios';
import type { Message, CreateMessageDto } from '../types/message';

export const messagesAPI = {
  /**
   * Get all messages for the current user
   */
  getMessages: async (): Promise<Message[]> => {
    const response = await api.get<Message[]>('/api/messages');
    return response.data;
  },

  /**
   * Get a specific message by ID
   */
  getMessage: async (id: string): Promise<Message> => {
    const response = await api.get<Message>(`/api/messages/${id}`);
    return response.data;
  },

  /**
   * Create a new message
   */
  createMessage: async (data: CreateMessageDto): Promise<Message> => {
    const response = await api.post<Message>('/api/messages', data);
    return response.data;
  },

  /**
   * Update an existing message
   */
  updateMessage: async (
    id: string,
    data: Partial<CreateMessageDto>
  ): Promise<Message> => {
    const response = await api.patch<Message>(`/api/messages/${id}`, data);
    return response.data;
  },

  /**
   * Delete a message
   */
  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/api/messages/${id}`);
  },
};

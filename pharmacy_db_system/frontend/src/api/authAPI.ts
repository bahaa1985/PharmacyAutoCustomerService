import api from './axios';
import type { LoginCredentials, AuthResponse, User } from '../types/user';

/**
 * Login with email and password
 * Sets HTTP-only cookie automatically via axios credentials
 */
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  /**
   * Logout and clear server-side session
   */
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  /**
   * Register a new user
   */
  register: async (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },
};

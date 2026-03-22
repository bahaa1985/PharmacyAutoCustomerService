import api from './axios';
import type { LoginCredentials, AuthResponse, User } from '../types/user';

/**
 * Login with email and password
 * Sets HTTP-only cookie automatically via axios credentials
 */
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/me');
    return response.data;
  },

  /**
   * Logout and clear server-side session
   */
  logout: async (): Promise<void> => {
    await api.post('/logout');
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

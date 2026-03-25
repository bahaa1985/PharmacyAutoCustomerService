import api from './axios'
import type { RegisterResponse } from '../types/user';

export const userAPI = {
    /**
   * Register a new user
   */
  register: async (data: {
    mobile: string;
    password: string;
    username: string;
    role_id:number;
    pharmacy_id:number;
  }): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/user', data);
    return response.data;
  },
    
}


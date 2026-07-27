import api from './axios'
import type { RegisterResponse, User } from '../types/user';

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
    instance_name:string
  }): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/users/new', data);
    return response.data;
  },
  
  /**
   * Fetch all users by pharmacy ID
   */
  getUsers: async (pharmacyId:number):Promise<User[]|undefined> =>{
    if(pharmacyId){
    const response = await api.get(`/users/all/${pharmacyId}`)
    return response.data
    }
  },

  /**
   * Update user
   */
  updateUser:async(userId:bigint,data:Partial<User>):Promise<User> =>{
    const response = await api.patch(`/users/update/${userId}`,data)
    return response.data
  }
}


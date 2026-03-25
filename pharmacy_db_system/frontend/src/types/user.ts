export interface User {
  id: string;
  mobile: string;
  username: string;
  role_id: string;
  pharmacy_id: string;
  is_active:boolean;
  is_logging_at: string,
  createdAt: string;
}

export interface LoginCredentials {
  mobile: string;
  password: string;
}

export interface AuthResponse {
  status:boolean,
  user: User;
  token?: string;
}

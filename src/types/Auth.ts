export interface AuthTypes {
  id: number;
  token: string;
  refresh_token: string;
  user: {
    id: number;
  };
  created_at: string;
  updated_at: string;
  
}

export interface AuthApiResponse<T> {
  data: T;
  status: string;
  code: number;
  messages: string;
}
export interface UserTypes {
  id: number;
  username: string;
  email: string;
  password: string;
  token: string | null;
  refresh_token: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: number[];
}

export interface UsersApiResponse<T> {
  data: T;
  status: string;
  code: number;
  messages: string;
}

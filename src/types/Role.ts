export interface RoleTypes {
  id: number;
  rolename: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleTypes {
  id: number;
  user: number;
  role: number;
  created_at: string;
  updated_at: string;
}

export interface RolesApiResponse<T> {
  data: T;
  status: string;
  code: number;
  messages: string;
}
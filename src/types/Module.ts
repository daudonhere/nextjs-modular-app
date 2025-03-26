export interface ModuleTypes {
  id: number;
  name: string;
  version: string;
  installed: boolean;
  created_at: string;
  updated_at: string;
}
export interface ModuleApiResponse<T> {
  data: T;
  status: string;
  code: number;
  messages: string;
}

  
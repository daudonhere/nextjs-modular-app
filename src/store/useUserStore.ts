import { create } from 'zustand';
import axios from 'axios';
import { UserTypes, UsersApiResponse } from '@/types/User';
import {
  CREATE_USER_API,
  DELETE_USER_API,
  DELETE_ALL_USERS_API,
  GET_USER_API,
  GET_ALL_USERS_API,
  UPDATE_USER_API,
} from '@/app/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useStatusStore } from '@/store/useStatusStore';

interface useUserState {
  user: UserTypes | null;
  users: UserTypes[];
  createUser: (userData: Partial<UserTypes>) => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateUser: (id: number, userData: Partial<UserTypes>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  deleteAllUsers: () => Promise<void>;
  resetUsers: () => void;
}

export const useUserStore = create<useUserState>((set) => ({
  user: null,
  users: [],
  resetUsers: () => {
    set({ user: null, users: [] });
    useStatusStore.getState().setLoading(false);
    useStatusStore.getState().setError(null);
  },

  createUser: async (userData) => {
    const { setError } = useStatusStore.getState();
        setError(null);
    try {
      const response = await axios.post<UsersApiResponse<UserTypes>>(CREATE_USER_API, userData);
      set({ user: response.data.data });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed create user";
      setError(errorMessage);
    }
  },

  fetchUser: async (id) => {
    const token = useAuthStore.getState().token;
    const { setError } = useStatusStore.getState();
        setError(null);
    try {
      const response = await axios.get<UsersApiResponse<UserTypes>>(`${GET_USER_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ user: response.data.data });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed fetching user";
      setError(errorMessage);
    }
  },

  fetchAllUsers: async () => {
    const token = useAuthStore.getState().token;
    const { setError } = useStatusStore.getState();
      setError(null);
    try {
      const response = await axios.get<UsersApiResponse<UserTypes[]>>(GET_ALL_USERS_API, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ users: response.data.data });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed fetch all user";
      setError(errorMessage);
    }
  },

  updateUser: async (id, userData) => {
    const token = useAuthStore.getState().token;
    const { setError } = useStatusStore.getState();
      setError(null);
    try {
      const response = await axios.put<UsersApiResponse<UserTypes>>(`${UPDATE_USER_API}/${id}`, userData, {
        headers: { Authorization: `Token ${token}` },
      });
      set((state) => ({
        user: response.data.data,
        users: state.users.map(user => user.id === id ? response.data.data : user),
      }));
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed update user";
      setError(errorMessage);
    }
  },

  deleteUser: async (id) => {
    const token = useAuthStore.getState().token;
    const { setError } = useStatusStore.getState();
        setError(null);
    try {
      await axios.delete<UsersApiResponse<null>>(`${DELETE_USER_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      set((state) => ({
        user: null,
        users: state.users.filter(user => user.id !== id)
      }));
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed delete user";
      setError(errorMessage);
    }
  },

  deleteAllUsers: async () => {
    const token = useAuthStore.getState().token;
    const { setError } = useStatusStore.getState();
        setError(null);
    try {
      await axios.delete<UsersApiResponse<null>>(DELETE_ALL_USERS_API, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ user: null, users: [] });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed delete All user";
      setError(errorMessage);
    }
  },
}));

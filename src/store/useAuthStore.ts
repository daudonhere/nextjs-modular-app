import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { AuthTypes, AuthApiResponse } from '@/types/Auth';
import { useStatusStore } from '@/store/useStatusStore';
import { LOGIN_API, LOGOUT_API } from '@/app/api';

interface useAuthState {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  trigerLogin: (username: string, password: string) => Promise<void>;
  trigerLogout: () => Promise<void>;
  resetAuth: () => void;
}

export const useAuthStore = create<useAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
      resetAuth: () => {
        set({ userId: null, isAuthenticated: false, token: null, refreshToken: null });
        useStatusStore.getState().setLoading(false);
        useStatusStore.getState().setError(null);
      },

      trigerLogin: async (username, password) => {
        const { setError } = useStatusStore.getState();
        setError(null);
        try {
          const response = await axios.post<AuthApiResponse<AuthTypes>>(LOGIN_API, { username, password });
          const { token, refresh_token } = response.data.data;
          set({ 
            token,
            refreshToken: refresh_token,
            userId: String(response.data.data.user.id),
            isAuthenticated: true,
          });
        } catch (error: unknown) {
          set({
            isAuthenticated: false,
          });
          const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
            ? error.response.data.messages 
            : "Login Failed";
          setError(errorMessage);
        }
      },

      trigerLogout: async () => {
        const { setError } = useStatusStore.getState();
        setError(null);
        try {
          const token = get().token;
          if (token) {
            await axios.post(LOGOUT_API,{ token },
              {
                headers: {
                  Authorization: `Token ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          }
        } catch (error: unknown) {
          const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
            ? error.response.data.messages 
            : "Logout Failed";
          setError(errorMessage);
        } finally {
          set({
            token: null,
            refreshToken: null,
            userId: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);


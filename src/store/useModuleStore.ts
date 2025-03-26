import { create } from 'zustand';
import axios from 'axios';
import { ModuleTypes, ModuleApiResponse } from '@/types/Module';
import {
  GET_MODULE_API,
  GET_ACTIVE_MODULES_API,
  GET_ALL_MODULES_API,
  INSTALL_MODULE_API,
  UNINSTALL_MODULE_API,
  UPGRADE_MODULE_API,
} from '@/app/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useStatusStore } from '@/store/useStatusStore';

interface ModuleState {
  modules: ModuleTypes[];
  activeModules: ModuleTypes[];
  fetchModule: (id: number) => Promise<void>;
  fetchAllModules: () => Promise<void>;
  fetchActiveModules: () => Promise<void>;
  installModule: (id: number) => Promise<void>;
  uninstallModule: (id: number) => Promise<void>;
  upgradeModule: (id: number) => Promise<void>;
  resetModule: () => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  activeModules: [],

  resetModule: () => {
    set({ modules: [], activeModules: [] });
    useStatusStore.getState().setLoading(false);
    useStatusStore.getState().setError(null);
  },

  fetchAllModules: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get<ModuleApiResponse<ModuleTypes[]>>(GET_ALL_MODULES_API, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ modules: response.data.data || [] });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed fetching all modlue";
      setError(errorMessage);
    }
  },

  fetchActiveModules: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const response = await axios.get<ModuleApiResponse<ModuleTypes[]>>(GET_ACTIVE_MODULES_API);
      set({ activeModules: response.data.data || [] });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed fetching active module";
      setError(errorMessage);
    }
  },

  fetchModule: async (id: number) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get<ModuleApiResponse<ModuleTypes>>(`${GET_MODULE_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      set((state) => ({ modules: [...state.modules, response.data.data] }));
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed fetching module";
      setError(errorMessage);
    }
  },

  installModule: async (id: number) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const token = useAuthStore.getState().token;
      await axios.get(`${INSTALL_MODULE_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      const response = await axios.get<ModuleApiResponse<ModuleTypes[]>>(GET_ACTIVE_MODULES_API);
      set({ activeModules: response.data.data || [] });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed install module";
      setError(errorMessage);
    }
  },

  uninstallModule: async (id: number) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const token = useAuthStore.getState().token;
      await axios.get(`${UNINSTALL_MODULE_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      const response = await axios.get<ModuleApiResponse<ModuleTypes[]>>(GET_ACTIVE_MODULES_API);
      set({ activeModules: response.data.data || [] });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed uninstall module";
      setError(errorMessage);
    }
  },

  upgradeModule: async (id: number) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    try {
      const token = useAuthStore.getState().token;
      await axios.get(`${UPGRADE_MODULE_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      const response = await axios.get<ModuleApiResponse<ModuleTypes[]>>(GET_ACTIVE_MODULES_API);
      set({ activeModules: response.data.data || [] });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.messages 
        ? error.response.data.messages 
        : "Failed upgrade module";
      setError(errorMessage);
    }
  }
}));

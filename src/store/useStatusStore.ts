import { create } from 'zustand';

interface useStatusState {
    isLoading: boolean;
    isError: string | null;
    setLoading: (value: boolean) => void;
    setError: (value: string | null ) => void;
  }
  
  export const useStatusStore = create<useStatusState>((set) => ({
    isLoading: false,
    isError: null,
    setLoading: (value: boolean) => set({ isLoading: value }),
    setError: (value: string | null) => set({ isError: value }),
  }));

  
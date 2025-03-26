import { create } from 'zustand';

interface useSidebarState {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  }
  
  export const useSidebarStore = create<useSidebarState>((set) => ({
    isOpen: false,
    setIsOpen: (value: boolean) => set({ isOpen: value }),
  }));

  
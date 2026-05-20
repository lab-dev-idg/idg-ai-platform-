import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  theme: 'system',
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  adminUser: any | null;
  setLogin: (userData: any) => void;
  setLogout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminUser: null,
      setLogin: (userData) => set({ isAuthenticated: true, adminUser: userData }),
      setLogout: () => set({ isAuthenticated: false, adminUser: null }),
    }),
    {
      name: 'admin-storage', // unique name for localStorage key
    }
  )
);

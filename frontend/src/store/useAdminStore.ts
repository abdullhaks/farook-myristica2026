import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  adminUser: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  setLogin: (userData: any, access?: string, refresh?: string) => void;
  setTokens: (access: string, refresh: string) => void;
  setLogout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminUser: null,
      accessToken: null,
      refreshToken: null,
      setLogin: (userData, access, refresh) => set({ isAuthenticated: true, adminUser: userData, accessToken: access || null, refreshToken: refresh || null }),
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      setLogout: () => set({ isAuthenticated: false, adminUser: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'admin-storage', // unique name for localStorage key
    }
  )
);

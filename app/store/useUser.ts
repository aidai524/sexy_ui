import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  userInfo: Record<string, any>;
  set: (params: any) => void;
}

export const useUser = create(
  persist<UserState>(
    (set, get: any) => ({
      userInfo: {},
      set: (params) => set(() => ({ ...params })),
    }),
    {
      name: '_user',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

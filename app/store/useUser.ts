import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useUser = create(
  persist(
    (set, get: any) => ({
      userInfo: {},
      set: (params: any) => set(() => ({ ...params })),
    }),
    {
      name: '_user',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

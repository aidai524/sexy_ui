import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useConfig = create(
  persist(
    (set, get: any) => ({
      config: {},
      set: (params: any) => set(() => ({ ...params })),
    }),
    {
      name: '_config',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

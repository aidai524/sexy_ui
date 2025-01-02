import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useSlip = create(
    persist(
      (set, get: any) => ({
        slip: 3,
        set: (params: any) => set(() => ({ ...params })),
      }),
      {
        name: '_slip',
        version: 0.1,
        storage: createJSONStorage(() => localStorage)
      }
    )
  );
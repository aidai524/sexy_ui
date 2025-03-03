import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCloseCopy = create(
  persist(
    (set, get: any) => ({
        lastCloseCopyTime: 0,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_close_copy",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCopyTimes = create(
  persist(
    (set, get: any) => ({
      copyTimes: 0,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_copy_times",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

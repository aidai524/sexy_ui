import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSetting = create(
  persist(
    (set, get: any) => ({
      menuExpand: true,
      autoPlay: false,
      flipMax: 1,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_user_setting",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

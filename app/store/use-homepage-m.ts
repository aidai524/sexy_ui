import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useHomePageM = create(
  persist(
    (set, get: any) => ({
      token: null,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_homepage",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

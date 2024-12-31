import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useFullScreen = create(
  persist(
    (set, get: any) => ({
      isFull: false,
      launchType: 0,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_fullscreen",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

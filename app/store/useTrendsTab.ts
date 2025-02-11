import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTrendsTab = create(
  persist(
    (set, get: any) => ({
      homeTabIndex: 0,
      profileTabName: "Hot Memes",
      currentSummary: "",
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_trends_tab",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

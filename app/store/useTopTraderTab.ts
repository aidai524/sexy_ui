import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTopTraderTab = create(
  persist(
    (set, get: any) => ({
        topTraderTab: 'pnl7D',
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_top_trader_tab",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

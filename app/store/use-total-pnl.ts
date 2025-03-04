import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTotalPnl = create(
  persist(
    (set, get: any) => ({
        totalPnl: '0',
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_total_pnl",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

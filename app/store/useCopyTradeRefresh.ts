import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCopyTradeRefresh = create(
  persist(
    (set, get: any) => ({
        lastCopyTradeTime: 0,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_copy_trade_refresh",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

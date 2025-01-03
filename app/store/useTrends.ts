import { create } from "zustand";
import { Trend } from "@/app/sections/trends/hooks";
import { createJSONStorage, persist } from "zustand/middleware";

interface TrendsState {
  tableList: Trend[];
  hottestList: Trend[];
  top1: Trend | undefined;
  setHottestList: (list: Trend[]) => void;
  setTableList: (list: Trend[]) => void;
  setTop1: (top1: Trend) => void;
}

export const useTrendsStore = create<TrendsState>((set) => ({
  hottestList: [],
  tableList: [],
  top1: void 0,
  setHottestList: (list: Trend[]) => set((state) => ({ ...state, hottestList: list })),
  setTableList: (list: Trend[]) => set((state) => ({ ...state, tableList: list })),
  setTop1: (top1: Trend) => set((state) => ({ ...state, top1 }))
}));

export const useTrendsBannerStore = create(
  persist(
    (set, get: any) => ({
      visible: true,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "trends_banner",
      version: 0.2,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

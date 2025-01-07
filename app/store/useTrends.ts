import { create } from "zustand";
import { Trend } from "@/app/sections/trends/hooks";
import { createJSONStorage, persist } from "zustand/middleware";

interface TrendsState {
  allListLoading: boolean;
  allList: Trend[];
  tableList: Trend[];
  hottestList: Trend[];
  top1: Trend | undefined;
  setAllList: (list: Trend[]) => void;
  setHottestList: (list: Trend[]) => void;
  setTableList: (list: Trend[]) => void;
  setTop1: (top1: Trend) => void;
  setAllListLoading: (loading: boolean) => void;
}

export const useTrendsStore = create<TrendsState>((set) => ({
  allListLoading: false,
  allList: [],
  hottestList: [],
  tableList: [],
  top1: void 0,
  setAllList: (list: Trend[]) => set((state) => ({ ...state, allList: list })),
  setHottestList: (list: Trend[]) => set((state) => ({ ...state, hottestList: list })),
  setTableList: (list: Trend[]) => set((state) => ({ ...state, tableList: list })),
  setTop1: (top1: Trend) => set((state) => ({ ...state, top1 })),
  setAllListLoading: (loading) => set((state) => ({ ...state, allListLoading: loading }))
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

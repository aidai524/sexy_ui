import { create } from "zustand";
import { Trend } from '@/app/sections/trends/hooks';

interface TrendsState {
  list: Trend[];
  allList: Trend[];
  top1: Trend | undefined;
  setList: (list: Trend[]) => void;
  setAllList: (list: Trend[]) => void;
  setTop1: (top1: Trend) => void;
}

export const useTrendsStore = create<TrendsState>((set) => ({
  list: [],
  allList: [],
  top1: void 0,
  setList: (list: Trend[]) => set((state) => ({ ...state, list })),
  setAllList: (allList: Trend[]) => set((state) => ({ ...state, allList })),
  setTop1: (top1: Trend) => set((state) => ({ ...state, top1 })),
}));

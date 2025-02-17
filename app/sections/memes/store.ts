import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import { TABS } from '@/app/sections/memes/config';

interface MemesState {
  currentTab: number;
  prevTab: number;
  setCurrentTab: (tab: number) => void;
  setPrevTab: (tab: number) => void;
}

export const useMemesStore = create(persist<MemesState>((set) => ({
  currentTab: TABS[0].value,
  prevTab: TABS[0].value,
  setCurrentTab: (tab) => set((state) => ({ ...state, currentTab: tab })),
  setPrevTab: (tab) => set((state) => ({ ...state, prevTab: tab })),
}), {
  name: '_memes_tab',
  version: 0.1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    currentTab: state.currentTab,
    prevTab: state.prevTab,
  } as any)
}));

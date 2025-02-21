import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import { Filter, Tab, TABS } from '@/app/sections/memes/config';
import { cloneDeep } from 'lodash-es';

export interface MemesState {
  currentTab: Tab;
  prevTab: Tab;
  currentFilter?: Filter;
  setCurrentTab: (tab: Tab) => void;
  setPrevTab: (tab?: Tab) => void;
  setCurrentFilter: (filter?: Filter) => void;
}

export const useMemesStore = create(persist<MemesState>((set) => ({
  currentTab: cloneDeep(TABS[0]),
  prevTab: cloneDeep(TABS[0]),
  currentFilter: { ...TABS[0].filters?.[0] } as Filter,
  setCurrentTab: (tab) => set((state) => ({ ...state, currentTab: tab })),
  setPrevTab: (tab) => set((state) => ({ ...state, prevTab: tab })),
  setCurrentFilter: (filter) => set((state) => ({ ...state, currentFilter: filter })),
}), {
  name: '_memes_tab',
  version: 0.1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    currentTab: state.currentTab,
    prevTab: state.prevTab,
    currentFilter: state.currentFilter,
  } as any)
}));

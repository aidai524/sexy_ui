import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

interface AirdropState {
  visible: boolean;
  entryVisible: boolean;
  entryVisibleTimes: number;
  setVisible: (visible: boolean) => void;
  setEntryVisible: (visible: boolean) => void;
  setEntryVisibleTimes: (times: number) => void;
}

export const useAirdropStore = create(persist<AirdropState>((set) => ({
  visible: false,
  entryVisible: false,
  entryVisibleTimes: 0,
  setVisible: (visible) => set((state) => ({ ...state, visible })),
  setEntryVisible: (visible) => set((state) => ({ ...state, entryVisible: visible })),
  setEntryVisibleTimes: (times) => set((state) => ({ ...state, entryVisibleTimes: times })),
}), {
  name: '_airdrop',
  version: 0.1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ entryVisible: state.entryVisible, entryVisibleTimes: state.entryVisibleTimes } as any)
}));

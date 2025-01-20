import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

interface AirdropState {
  visible: boolean;
  entryVisible: boolean;
  entryVisibleTimes: number;
  connectVisible: boolean;
  homepageVisited: Record<string, boolean>;
  setVisible: (visible: boolean) => void;
  setEntryVisible: (visible: boolean) => void;
  setEntryVisibleTimes: (times: number) => void;
  setConnectVisible: (visible: boolean) => void;
  setHomepageVisited: (address?: string, visited?: boolean) => void;
}

export const useAirdropStore = create(persist<AirdropState>((set) => ({
  visible: false,
  entryVisible: false,
  entryVisibleTimes: 0,
  connectVisible: false,
  homepageVisited: {},
  setVisible: (visible) => set((state) => ({ ...state, visible })),
  setEntryVisible: (visible) => set((state) => ({ ...state, entryVisible: visible })),
  setEntryVisibleTimes: (times) => set((state) => ({ ...state, entryVisibleTimes: times })),
  setConnectVisible: (visible) => set((state) => ({ ...state, connectVisible: visible })),
  setHomepageVisited: (address, visited) => set((state) => {
    if (!address) {
      address = 'default';
    }
    const _visited = state.homepageVisited;
    _visited[address] = typeof visited === 'boolean' ? visited : false;
    _visited.default = typeof visited === 'boolean' ? visited : false;
    state.homepageVisited = _visited;
    return state;
  }),
}), {
  name: '_airdrop',
  version: 0.2,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    entryVisible: state.entryVisible,
    entryVisibleTimes: state.entryVisibleTimes,
    homepageVisited: state.homepageVisited,
  } as any)
}));

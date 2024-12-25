import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReferState {
  entryVisible: boolean;
  visible: boolean;
}

interface ReferStore extends ReferState {
  setVisible: (visible: boolean) => void;
  setEntryVisible: (visible: boolean) => void;
}

export const useReferStore = create(persist<ReferStore>((set) => ({
  entryVisible: true,
  visible: false,
  setEntryVisible: (entryVisible: boolean) => set((state) => ({ ...state, entryVisible })),
  setVisible: (visible: boolean) => set((state) => ({ ...state, visible })),
}), {
  name: '_refer',
  version: 0.1,
  storage: createJSONStorage(() => localStorage)
}));

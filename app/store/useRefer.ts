import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReferState {
  entryVisible: boolean;
  visible: boolean;
  isInvite: boolean;
  bind: boolean;
}

interface ReferStore extends ReferState {
  setVisible: (visible: boolean, isInvite?: boolean) => void;
  setEntryVisible: (visible: boolean) => void;
  setBind: (bind: boolean) => void;
}

export const useReferStore = create(persist<ReferStore>((set) => ({
  entryVisible: true,
  visible: false,
  isInvite: false,
  bind: false,
  setEntryVisible: (entryVisible) => set((state) => ({ ...state, entryVisible })),
  setVisible: (visible, isInvite) => set((state) => ({ ...state, visible, isInvite: typeof isInvite === 'boolean' ? isInvite : false })),
  setBind: (bind) => set((state) => ({ ...state, bind })),
}), {
  name: '_refer',
  version: 0.1,
  storage: createJSONStorage(() => localStorage)
}));

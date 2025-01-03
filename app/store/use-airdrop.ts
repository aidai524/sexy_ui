import { create } from "zustand";

interface AirdropState {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useAirdropStore = create<AirdropState>((set) => ({
  visible: false,
  setVisible: (visible) => set((state) => ({ ...state, visible })),
}));

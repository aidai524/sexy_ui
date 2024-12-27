import { create } from "zustand";

interface PrepaidDelayTimeState {
  prepaidDelayTime: number | undefined;
  setPrepaidDelayTime: (prepaidDelayTime: number) => void;
}

export const usePrepaidDelayTimeStore = create<PrepaidDelayTimeState>((set) => ({
  prepaidDelayTime: 0,
  setPrepaidDelayTime: (prepaidDelayTime: number) => set((state) => ({ ...state, prepaidDelayTime })),
}));

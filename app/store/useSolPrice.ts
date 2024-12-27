import { create } from "zustand";

interface SolPriceState {
  solPrice: number | undefined;
  setSolPrice: (solPrice: number) => void;
}

export const useSolPriceStore = create<SolPriceState>((set) => ({
    solPrice: 189.54,
    setSolPrice: (solPrice: number) => set((state) => ({ ...state, solPrice })),
}));

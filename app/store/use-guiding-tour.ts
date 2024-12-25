import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GuidingTourState {
  hasShownTour: boolean;
  setHasShownTour: (value: boolean) => void;
}

export const useGuidingTour = create(
  persist<GuidingTourState>(
    (set) => ({
      hasShownTour: false,
      setHasShownTour: (value: boolean) => set({ hasShownTour: value })
    }),
    {
      name: "_guidingTour",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const CODE = "DcTcE9wSsKk8okrwk3fCxKnvMK3nQ4WGnfh23YKJauvV";

export const useCodeStore = create(
  persist(
    (set, get: any) => ({
      a: "",
      set: (params: any) => set(() => ({ a: CODE }))
    }),
    {
      name: "_user_code",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

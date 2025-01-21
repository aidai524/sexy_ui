import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useMessageStatus = create(
  persist(
    (set, get: any) => ({
      jumpId: "",
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_message_status",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useDetailStatus = create(
  persist(
    (set, get: any) => ({
      showTrade: false,
      tab: "chart",
      token: null,
      setShow: (key: string, show: boolean) => {
        const params: Record<string, boolean> = {
          showTrade: false
        };
        params[key] = show;
        set(params);
      },
      hasShow() {
        const params = get();

        return params.showTrade;
      },
      setTab(tab: string) {
        set({ tab });
      },
      setToken(token: any) {
        set({
          token,
          showTrade: false
        });
      }
    }),
    {
      name: "_token_panels",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

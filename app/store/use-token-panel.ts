import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTokenPanelStatus = create(
  persist(
    (set, get: any) => ({
      showTrade: false,
      tab: "chart",
      setShow: (key: string, show: boolean) => {
        const params: Record<string, boolean> = {
          showTrade: false
        };
        params[key] = show;
        set(params);
      },
      hasShow(tab: string) {
        const params = get();

        return params.showTrade;
      },
      setTab(tab: string) {
        set({ tab });
      }
    }),
    {
      name: "_token_panels",
      version: 0.11,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

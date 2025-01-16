import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTokenPanelStatus = create(
  persist(
    (set, get: any) => ({
      showDetail: false,
      showComments: false,
      showFlip: false,
      showTrade: false,
      setShow: (key: string, show: boolean) => {
        const params: Record<string, boolean> = {
          showDetail: false,
          showComments: false,
          showFlip: false,
          showTrade: false
        };
        params[key] = show;
        set(params);
      },
      hasShow() {
        const params = get();
        return (
          params.showDetail ||
          params.showComments ||
          params.showFlip ||
          params.showTrade
        );
      }
    }),
    {
      name: "_token_panels",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

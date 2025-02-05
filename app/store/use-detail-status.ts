import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useDetailStatus = create(
  persist(
    (set, get: any) => ({
      showDetail: false,
      showComments: false,
      showFlip: false,
      showTrade: false,
      tab: "chart",
      token: null,
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
          (params.showFlip && params.token?.status === 0) ||
          (params.showTrade && params.token?.status !== 0)
        );
      },
      setTab(tab: string) {
        set({ tab });
      },
      setToken(token: any) {
        set({ token });
      }
    }),
    {
      name: "_token_panels",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

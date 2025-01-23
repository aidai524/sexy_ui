import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSearchStore = create(
  persist(
    (set, get: any) => ({
      cachedList: [],
      addCachedItem: (item: any) => {
        const cachedList = get().cachedList;
        const i = cachedList.findIndex((i: any) => i === item);

        if (i !== -1) {
          cachedList.splice(i, 1);
        }
        if (cachedList.length === 5) {
          cachedList.pop();
        }
        cachedList.unshift(item);
        set({ cachedList });
      },
      removeCachedItem: (index: number) => {
        let cachedList = get().cachedList;
        if (cachedList.length === 1) {
          cachedList = [];
        } else {
          cachedList.splice(index, 1);
        }

        set({ cachedList });
      }
    }),
    {
      name: "_user_search",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

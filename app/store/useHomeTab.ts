import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useHomeTab = create(
    persist(
        (set, get: any) => ({
            homeTabIndex: 0,
            profileTabIndex: 0,
            set: (params: any) => set(() => ({ ...params })),
        }),
        {
            name: '_home_tab',
            version: 0.1,
            storage: createJSONStorage(() => localStorage)
        }
    )
);
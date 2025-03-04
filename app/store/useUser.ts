import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  userInfo: Record<string, any>;
  set: (params: any) => void;
  setUserInfo: (info: Record<string, any>) => void;
  setReferer: (allow_login: boolean) => void;
}

export const useUser = create(
  persist<UserState>(
    (set, get: any) => ({
      userInfo: {},
      set: (params) => set(() => ({ ...params })),
      setUserInfo: (info) => set((state) => {
        const _userInfo = { ...state.userInfo, ...info };
        return { ...state, userInfo: _userInfo };
      }),
      setReferer: (allow_login) => set((state) => {
        const _userInfo = { ...state.userInfo };
        _userInfo.allow_login = allow_login;
        return { ...state, userInfo: _userInfo };
      }),
    }),
    {
      name: '_user',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

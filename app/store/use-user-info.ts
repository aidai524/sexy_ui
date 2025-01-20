import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserInfo } from '@/app/type';

type Address = string;

interface UserInfoState {
  info: Record<Address, Partial<UserInfo>>
}

interface UserInfoStore extends UserInfoState {
  setInfo: (address?: string, info?: Partial<UserInfo>) => void;
}

export const useReferStore = create(persist<UserInfoStore>((set) => ({
  info: {},
  setInfo: (address, info) => set((state) => {
    const _info = state.info;
    if (!address) {
      address = 'default';
    }
    if (_info[address]) {
      _info[address] = { ..._info[address], ...info };
    } else {
      _info[address] = info ?? {};
    }
    state.info = _info;
    return state;
  }),
}), {
  name: '_user_info',
  version: 0.1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    info: state.info,
  } as any)
}));

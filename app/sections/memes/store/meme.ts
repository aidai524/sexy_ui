import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Big from 'big.js';

interface MemesState {
  allListLoading: boolean;
  allList: Meme[];
  setAllList: (list: Meme[]) => void;
  setAllListLoading: (loading: boolean) => void;
}

export const useMemesStore = create(persist<MemesState>((set) => ({
  allListLoading: false,
  allList: [],
  setAllList: (list: Meme[]) => set((state) => ({ ...state, allList: list })),
  setAllListLoading: (loading) => set((state) => ({ ...state, allListLoading: loading }))
}), {
  name: "_memes_list",
  version: 0.1,
  storage: createJSONStorage(() => localStorage),
  // partialize: (state) => ({} as any)
}));

export interface Meme {
  id: number;
  created_at: string;
  updated_at: string;
  ranking: number;
  project_id: number;
  sol_amount: string;
  token_amount: string;
  market_cap_percentage: string;
  virtual_volume: string;
  time: number;
  project_created: string;
  project_creator: string;
  creator_name: string;
  address: string;
  like: string;
  token_decimals: number;
  token_name: string;
  token_symbol: string;
  ticker: string;
  Icon: string;
  token_supply: string;
  token_reserve: string;
  sol_reserve: string;
  market_cap: string;
  initiative_launching: boolean;
  is_king: boolean;
  last_king_time: number;
  status: number;

  // front-end attributes
  created2Now?: string;
  progress?: string;
  poolAmount?: Big.Big;
  solAmount?: Big.Big;
  marketCapTrends?: string;
  marketCapTrendsDirection?: '+' | '-';
  holder?: number;
}

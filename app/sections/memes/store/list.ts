import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Big from 'big.js';

interface MemesState {
  hotListLoading: boolean;
  hotList: Hot[];
  setHotList: (list: Hot[]) => void;
  setHotListLoading: (loading: boolean) => void;
  memesListLoading: boolean;
  memesList: Meme[];
  memesListPageLimit: number;
  memesListPageOffset: number;
  memesListPageNext: boolean;
  setMemesList: (list: Meme[]) => void;
  setMemesListLoading: (loading: boolean) => void;
  setMemesListPageLimit: (limit: number) => void;
  setMemesListPageOffset: (offset: number) => void;
  setMemesListPageNext: (next: boolean) => void;
}

export const useMemesListStore = create(persist<MemesState>((set) => ({
  hotListLoading: false,
  hotList: [],
  setHotList: (list: Hot[]) => set((state) => ({ ...state, hotList: list })),
  setHotListLoading: (loading) => set((state) => ({ ...state, hotListLoading: loading })),
  memesListLoading: false,
  memesList: [],
  memesListPageLimit: 20,
  memesListPageOffset: 0,
  memesListPageNext: true,
  setMemesList: (list: Meme[]) => set((state) => ({ ...state, memesList: list })),
  setMemesListLoading: (loading) => set((state) => ({ ...state, memesListLoading: loading })),
  setMemesListPageLimit: (limit) => set((state) => ({ ...state, memesListPageLimit: limit })),
  setMemesListPageOffset: (offset) => set((state) => ({ ...state, memesListPageOffset: offset })),
  setMemesListPageNext: (next) => set((state) => ({ ...state, memesListPageNext: next })),
}), {
  name: "_memes_list",
  version: 0.1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({} as any)
}));

export interface Hot {
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
  kind: 'Hot',
  created2Now?: string;
  progress?: string;
  poolAmount?: Big.Big;
  solAmount?: Big.Big;
  marketCapTrends?: string;
  marketCapTrendsDirection?: '+' | '-';
  holder?: number;
}

export interface Meme {
  id: number;
  created_at: number;
  updated_at: number;
  account: string;
  account_data: null;
  address: string;
  DApp: string;
  pool_address: string;
  token_name: string;
  token_symbol: string;
  token_decimals: number;
  token_supply: string;
  initial_sol: string;
  icon: string;
  video: string;
  ticker: string;
  about_us: string;
  website: string;
  x: string;
  tg: string;
  discord: string;
  like: number;
  un_like: number;
  super_like: number;
  pre_paid: number;
  pre_paid_amount: string;
  tx: number;
  collect: number;
  comment: number;
  is_collect: boolean;
  is_like: boolean;
  is_un_like: boolean;
  is_pre_paid: boolean;
  boost_time: number;
  status: number;
  is_show: boolean;
  concentrated_holdings: boolean;
  initiative_launching: boolean;
  launching_type: number;
  is_king: boolean;
  last_king_time: number;
  almost: string;
  volume: string;
  price: string;
  share_num: number;
  total_amount: number;
  bonding_progress: number;
  king_progress: number;
  market_cap_change: number;
  time: number;

  // front-end attributes
  kind: 'Meme',
  created2Now?: string;
}

import { PublicKey, SystemProgram } from '@solana/web3.js';

export const total_supply = 1000000000
export const referral_address = 'EEYm1sXVhH1EpsUan6Sj31zdydALoAVCEYdVncJQJ8s6'
// AYdgC17ymp4CkbbZ7pED2oa5hdnsp4dZVKJtt9542kFh
export const programId_address = process.env.NEXT_PUBLIC_PROGRAM_ID || '67g5ZLhs2Nhobhm69u5vdxJutF5VesaB21G23RdXWshx'

export const defaultAvatar = "/img/avatar.png";

export const solana_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzQ5NjY4NzIwMzUsImVtYWlsIjoiemVyb2NobHdvcmtAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzM0OTY2ODcyfQ.IHW9Ohb7kpn0hUDwlBKlN7C-qREogjwr_VxQvP9pJQw'

// pump address
export const GLOBAL = new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf");
export const FEE_RECIPIENT = new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM");
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export const ASSOC_TOKEN_ACC_PROG = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
export const RENT = new PublicKey("SysvarRent111111111111111111111111111111111");
export const PUMP_FUN_PROGRAM = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
export const PUMP_FUN_ACCOUNT = new PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1");
export const SYSTEM_PROGRAM_ID = SystemProgram.programId;
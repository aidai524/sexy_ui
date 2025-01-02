import { create } from "zustand";
import { referral_address } from "../utils/config";
import { getCookie } from "../utils/common";
import { PublicKey } from "@solana/web3.js";

interface ReferralState {
    referral: string;
    setReferral: (referral: string) => void;
}

export const useReferraltore = create<ReferralState>((set) => {
    let _referral_address = referral_address
    
    if (typeof(window) !== 'undefined') {
        const cookieReferral = getCookie('referral')
        if (cookieReferral) {
            try {
                const publicKey = new PublicKey(cookieReferral);
                PublicKey.isOnCurve(publicKey.toBuffer());
                _referral_address = cookieReferral
              } catch (error) {
              }
        }
    }

    return {
        referral: _referral_address,
        setReferral: (referral: string) => set((state) => ({ ...state, referral })),
    }
});

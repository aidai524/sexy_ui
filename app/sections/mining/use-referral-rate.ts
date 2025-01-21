import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { programId_address } from "@/app/utils/config";
import { Program } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAuth } from "@/app/context/auth";
import idl from "@/app/hooks/meme_launchpad.json";
import Big from "big.js";

export default function useReferralRate() {
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState("15");
  const { userInfo, accountRefresher } = useAuth();
  const { connection } = useConnection();

  const queryRate = async () => {
    try {
      setIsLoading(true);
      const programId = new PublicKey(programId_address);
      const state = PublicKey.findProgramAddressSync(
        [Buffer.from("launchpad")],
        programId
      );
      const [pda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral_fee_rate_record"),
          state[0].toBuffer(),
          new PublicKey(userInfo.address).toBuffer()
        ],
        programId
      );
      const accountInfo = await connection.getAccountInfo(pda);
      if (!accountInfo) {
        throw "Account not exist";
      }
      const program = new Program<any>(idl, programId, {
        connection: connection
      } as any);

      const referralRecord: any = await program.account.feeRateRecord.fetch(
        pda
      );

      if (!referralRecord.rate) {
        throw "Rate unavailable";
      }
      setRate(Big(referralRecord?.rate).div(1e2).toFixed(0));
    } catch (err) {
      setRate("15");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.address) {
      queryRate();
    }
  }, [accountRefresher]);

  return {
    isLoading,
    rate
  };
}

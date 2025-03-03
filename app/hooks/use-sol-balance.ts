import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@/app/hooks/use-wallet";
import Big from "big.js";

export default function useSolBalance(refresher?: number, round?: number) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!publicKey || !connection) return;
    setIsLoading(true);
    connection
      .getBalance(publicKey!)
      .then((res) => {
        if (res) {
          if (round) {
            setSolBalance(new Big(res).div(10 ** 9).round(round, 0).toString());
          } else {
            setSolBalance(new Big(res).div(10 ** 9).toFixed(2));
          }
        } else {
          setSolBalance("0");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [publicKey, connection, refresher]);

  return {
    solBalance,
    isLoading
  };
}

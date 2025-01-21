import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import Big from "big.js";

export default function useSolBalance(refresher?: number) {
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
          setSolBalance(new Big(res).div(10 ** 9).toFixed(2));
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

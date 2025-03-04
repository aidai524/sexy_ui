import { useCallback, useEffect, useState } from "react";
import { getHoldersByToken } from "@/app/utils/solanaScanApi";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function useHolders(token: any) {
  const [total, setTotal] = useState(0);
  const { connection } = useConnection();
  const onQuery = useCallback(async () => {
    try {
      if (process.env.NEXT_PUBLIC_NET === "Devnet") {
        const tokenAccounts = await connection.getTokenLargestAccounts(
          new PublicKey(token.address),
          "confirmed"
        );

        const size = tokenAccounts.value.filter((item) => Number(item.amount) > 0).length;

        setTotal(size);
      } else {
        const response = await getHoldersByToken(token.address, 1, 10);
        setTotal(response.total);
      }
    } catch (err) {
      console.log("err:", err);
      setTotal(0);
    }
  }, [token]);

  useEffect(() => {
    if (token?.status === 0 || !token?.address) return;
    onQuery();
  }, [token]);

  return { total };
}

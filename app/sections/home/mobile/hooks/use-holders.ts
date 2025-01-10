import { useCallback, useEffect, useState } from "react";
import { getHoldersByToken } from "@/app/utils/solanaScanApi";

export default function useHolders(token: any) {
  const [total, setTotal] = useState(0);
  const onQuery = useCallback(async () => {
    try {
      const response = await getHoldersByToken(token.address, 1, 1);
      setTotal(response.total);
    } catch (err) {
      setTotal(0);
    }
  }, [token]);

  useEffect(() => {
    if (token?.status !== 3 || !token?.address) return;
    onQuery();
  }, [token]);

  return { total };
}

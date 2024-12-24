import { useCallback, useEffect, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAccount } from "@/app/hooks/useAccount";

export default function useNum() {
  const [num, setNum] = useState(0);
  const { address: userAddress } = useAccount();

  const onQuery = useCallback(async () => {
    try {
      const response = await httpAuthGet("/inform/un_read_num");
      setNum(response.data);
    } catch (err) {
      setNum(0);
    }
  }, []);

  useEffect(() => {
    if (userAddress) onQuery();
  }, [userAddress]);

  return {
    num,
    onQuery
  };
}

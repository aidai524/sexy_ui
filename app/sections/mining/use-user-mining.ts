import { httpAuthGet } from "@/app/utils";
import { useEffect, useState } from "react";
import { useAccount } from "@/app/hooks/useAccount";

export default function useUserMining() {
  const { address: userAddress } = useAccount();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onQuery = async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet("/account/mint");
      setInfo(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userAddress) onQuery();
  }, [userAddress]);

  return {
    info,
    loading
  };
}

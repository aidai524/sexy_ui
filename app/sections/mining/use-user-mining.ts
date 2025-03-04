import { httpAuthGet } from "@/app/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";

export default function useUserMining() {
  const { accountRefresher, userInfo } = useAuth();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onQuery = async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet("/account/mining");
      const pointsResponse = await httpAuthGet(
        `/airdrop/account/level_points?account=${userInfo.address}`
      );

      setInfo({
        ...response.data,
        clime_created: Number(pointsResponse.data.points) > 0
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountRefresher) onQuery();
  }, [accountRefresher]);

  return {
    info,
    loading,
    onQuery
  };
}

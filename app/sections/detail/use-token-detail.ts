import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import { updateOneInList } from "@/app/utils/listStore";
import { httpAuthGet, httpGet } from "@/app/utils";
import { mapDataToProject } from "@/app/utils/mapTo";

export default function useTokenDetail({ token }: any) {
  const [infoData, setInfoData] = useState<any>();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(!token);
  const { userInfo } = useAuth();

  const getDetailInfo = useCallback(() => {
    const address = params.get("address") || token?.address;
    if (!address) {
      setIsLoading(false);
      return;
    }

    if (!token) {
      setIsLoading(true);
    }
    
    return httpAuthGet("/project", { address: address })
      .then((res) => {
        if (res.code === 0 && res.data && res.data.length) {
          const infoData = mapDataToProject(res.data[0]);
          setInfoData(infoData);
          updateOneInList(
            {
              ...res.data[0]
            },
            userInfo?.address
          );
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [params, userInfo, token]);

  useEffect(() => {
    getDetailInfo();
  }, [params, token]);

  return { infoData, isLoading, getDetailInfo };
}

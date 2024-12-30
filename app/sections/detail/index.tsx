"use client";

import { memo, useCallback, useState, useEffect } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import { useUserAgent } from "@/app/context/user-agent";
import { useSearchParams } from "next/navigation";
import { updateOneInList } from "@/app/utils/listStore";
import { httpGet } from "@/app/utils";
import { mapDataToProject } from "@/app/utils/mapTo";
import type { Project } from "@/app/type";

export default memo(function Detail(props: any) {
  const { isMobile } = useUserAgent();
  const params = useSearchParams();
  const [infoData, setInfoData] = useState<Project>();

  const getDetailInfo = useCallback(() => {
    const id = params.get("id");
    if (id) {
      return httpGet("/project", { id }).then((res) => {
        if (res.code === 0 && res.data && res.data.length) {
          const infoData = mapDataToProject(res.data[0]);
          setInfoData(infoData);
          updateOneInList({
            ...res.data[0]
          });
        }
      });
    }
  }, [params]);

  useEffect(() => {
    getDetailInfo();
  }, [params]);

  const comParams = { infoData, getDetailInfo };

  return isMobile ? (
    <Mobile {...props} {...comParams} />
  ) : (
    <Laptop {...props} {...comParams} />
  );
});

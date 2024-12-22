import { useEffect, useState } from "react";
import Token from "../token";
import { httpGet, mapDataToProject } from "@/app/utils";
import Empty from "../empty";
import type { Project } from "@/app/type";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";

interface Props {
  address: string | undefined;
  type: string;
  prepaidWithdrawDelayTime: number;
  hideHot?: boolean;
}

const urls: any = {
  created: "/project/account/list",
  hot: "/project/super_like/list",
  liked: "/project/like/list"
};

export default function Created({ address, type, prepaidWithdrawDelayTime, hideHot = false }: Props) {
  const [list, setList] = useState<Project[]>([]);
  const [refresh, setRefresh] = useState<number>(1);
  const userStore: any = useUser()
  const { fecthUserInfo } = useUserInfo(undefined)

  useEffect(() => {
    if (address) {
      httpGet(urls[type], { address, limit: 20 }).then((res) => {
        if (res.code === 0 && res.data?.list?.length > 0) {
          setList(res.data?.list.map(mapDataToProject));
        }
      });
    }
  }, [address, type, refresh]);

  if (list.length === 0) {
    return <Empty msg={"No sexy coins " + type + " yet"} />;
  }

  return (
    <div>
      {list.map((item) => {
        return <Token
          data={item}
          key={item.id}
          hideHot={hideHot}
          prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
          update={async () => {
            setRefresh(refresh + 1)
            const userInfo = await fecthUserInfo(address as string)
            console.log('userInfo:', userInfo)
            
            if (userInfo) {
              userStore.set({
                userInfo
              })
            }
          }} />;
      })}
    </div>
  );
}

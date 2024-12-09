import { useEffect, useState } from "react";
import Token from "../token";
import { httpGet, mapDataToProject } from "@/app/utils";
import Empty from "../empty";
import type { Project } from "@/app/type";

interface Props {
  address: string | undefined;
  type: string;
}

const urls: any = {
  created: "/project/account/list",
  hot: "/project/super_like/list",
  liked: "/project/like/list"
};

export default function Created({ address, type }: Props) {
  const [list, setList] = useState<Project[]>([]);

  useEffect(() => {
    if (address) {
      httpGet(urls[type], { address, limit: 20 }).then((res) => {
        if (res.code === 0 && res.data?.list?.length > 0) {
          setList(res.data?.list.map(mapDataToProject));
        }
      });
    }
  }, [address, type]);

  if (list.length === 0) {
    return <Empty msg={"No sexy coins " + type + " yet"} />;
  }

  return (
    <div>
      {list.map((item) => {
        return <Token data={item} key={item.id} />;
      })}
    </div>
  );
}

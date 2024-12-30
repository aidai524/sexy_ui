import { useState } from "react";
import { httpAuthDelete, httpAuthPost } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";

export default function useFollow(account?: string) {
  const [freshNum, setFreshNum] = useState(0);

  async function follow(address: string) {
    const val = await httpAuthPost("/account/follower?address=" + address);
    if (val.code === 0) {
      success("Follow success");
      setFreshNum(freshNum + 1);
    } else {
      fail("Follow fail");
    }
  }

  async function unFollow(address: string) {
    const val = await httpAuthDelete("/account/follower?address=" + address);
    if (val.code === 0) {
      success("UnFollow success");
      setFreshNum(freshNum + 1);
    } else {
      fail("UnFollow fail");
    }
  }

  return {
    follow,
    unFollow,
    update: () => {
      setFreshNum(freshNum + 1);
    }
  };
}

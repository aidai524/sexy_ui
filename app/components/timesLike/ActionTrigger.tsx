import { Modal } from "antd-mobile";
import FirstTimeLike from "./firstTimeLike";
import SecondTimeLike from "./secondTimesLike";
import type { Project } from "@/app/type";
import { httpAuthPost } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import Big from "big.js";

export const FIRST_LIKE_TIMES = 10;
export const SECOND_LIKE_TIMES = 30;

const LIKE_ERROR = -1;

const onLike = async (data: any) => {
  try {
    if (data) {
      const v = await httpAuthPost("/project/like?id=" + data!.id, {});
      console.log("v:", v);
      if (v.code === 0) {
        success(
          "You liked " +
            (data.token_name || data.tokenName) +
            ", You are expected to receive " +
            new Big(v.data?.point || 0).toFixed(2) + ' points'
        );
        return v.data?.likeNum;
      } else if (v.code === 100002) {
        fail("You've run out of like times. You can come back tomorrow");
        return -1;
      }
    }
  } catch (e) {}

  return 0;
};

const onHate = async (data: Project) => {
  try {
    if (data) {
      await httpAuthPost("/project/un_like?id=" + data!.id, {});
    }
  } catch {}
};

export async function actionLikeTrigger(data: Project) {
  const times = await onLike(data);

  if (times === LIKE_ERROR) {
    return false;
  }

  if (times === FIRST_LIKE_TIMES) {
    if (data) {
      const timeLikeHandler = Modal.show({
        content: (
          <FirstTimeLike
            data={data}
            onClose={() => {
              timeLikeHandler.close();
            }}
          />
        ),
        closeOnMaskClick: true,
        className: "no-bg"
      });
    }
  }

  if (times === SECOND_LIKE_TIMES) {
    if (data) {
      const timeLikeHandler = Modal.show({
        content: (
          <SecondTimeLike
            data={data}
            onClose={() => {
              timeLikeHandler.close();
            }}
          />
        ),
        closeOnMaskClick: true,
        className: "no-bg"
      });
    }
  }

  return true;
}

export function actionHateTrigger(data: Project) {
  return onHate(data);
}

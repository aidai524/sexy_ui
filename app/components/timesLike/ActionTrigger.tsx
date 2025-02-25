import { Modal } from "antd-mobile";
import FirstTimeLike from "./firstTimeLike";
import SecondTimeLike from "./secondTimesLike";
import FinalLike from "./final-like";
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
      if (v.code === 0 && data.status === 0) {
        const points =
          Number(v.data?.point) < 0.01
            ? "0.01"
            : new Big(v.data?.point || 0).toFixed(2, 0);

        success(
          "You liked '" +
            (data.token_name || data.tokenName) +
            "', You are expected to receive " +
            points +
            " points"
        );
        return v.data || {};
      } else if (v.code === 100002 && data.status === 0) {
        fail("You've run out of like times. You can come back tomorrow");
      }
      return {
        likeNum: -1
      };
    }
  } catch (e) {
    return {
      likeNum: -1
    };
  }
};

const onHate = async (data: Project) => {
  try {
    if (data) {
      await httpAuthPost("/project/un_like?id=" + data!.id, {});
    }
  } catch {}
};

export async function actionLikeTrigger({ data, onShare, onSuccess }: any) {
  const { likeNum, likeNumToday, projectLikeNum } = await onLike(data);

  if (data.status !== 0) return;

  if (likeNum !== LIKE_ERROR) onSuccess?.(likeNumToday);

  if (projectLikeNum === 100) {
    const timeLikeHandler = Modal.show({
      content: (
        <FinalLike
          token={data}
          onClose={() => {
            timeLikeHandler.close();
          }}
        />
      ),
      maskStyle: {
        backdropFilter: "none"
      },
      closeOnMaskClick: true,
      className: "final-like-modal no-bg"
    });
  }
  if (likeNum === FIRST_LIKE_TIMES) {
    if (data) {
      const timeLikeHandler = Modal.show({
        content: (
          <FirstTimeLike
            data={data}
            onShare={onShare}
            onClose={() => {
              timeLikeHandler.close();
            }}
          />
        ),
        maskStyle: {
          backdropFilter: "none"
        },
        closeOnMaskClick: true,
        className: "no-bg"
      });
    }
  }

  if (likeNum === SECOND_LIKE_TIMES) {
    if (data) {
      const timeLikeHandler = Modal.show({
        content: (
          <SecondTimeLike
            data={data}
            onShare={onShare}
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
  return likeNum === LIKE_ERROR ? false : true;
}

export function actionHateTrigger(data: Project) {
  return onHate(data);
}

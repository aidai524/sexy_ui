import RocketIcon from "../rocket-icon";
import Rockets from "./rockets";
import { numberFormatter } from "@/app/utils/common";
import { useEffect, useState } from "react";
export default function LaunchesLike({
  className,
  buttonClassName,
  onSuccess,
  disabled,
  actionLikeTrigger,
  token
}: any) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [mergedLiked, setMergedLiked] = useState(token.is_launched_like);
  const [mergedNum, setMergedNum] = useState(token.launched_like);

  useEffect(() => {
    setMergedLiked(token.is_launched_like);
    setMergedNum(token.launched_like);
  }, [token]);

  return (
    <div
      className={className}
      onClick={async () => {
        if (mergedLiked || disabled) return;
        if (!window.sexAddress) {
          window.connect();
          return;
        }
        setShowAnimation(true);
        const res = await actionLikeTrigger({
          data: token,
          onShare: false
        });
        if (res) {
          setMergedLiked(true);
          setMergedNum(mergedNum + 1);
          setTimeout(() => {
            onSuccess("launched_like");
            setShowAnimation(false);
          }, 6000);
        } else {
          setTimeout(() => {
            setShowAnimation(false);
          }, 6000);
        }
      }}
      style={{ position: "relative" }}
    >
      <button className={buttonClassName}>
        <RocketIcon isActive={mergedLiked} />
      </button>
      <span>
        {numberFormatter(mergedNum, 1, true, {
          isShort: true,
          isShortUppercase: true
        }) || 0}
      </span>
      {showAnimation && <Rockets />}
    </div>
  );
}

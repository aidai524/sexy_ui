import RocketIcon from "../rocket-icon";
import Rockets from "./rockets";
import { numberFormatter } from "@/app/utils/common";
import { useEffect, useState } from "react";
export default function LaunchesLike({
  className,
  buttonClassName,
  onClick,
  isLiked,
  like,
  id
}: any) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [mergedLiked, setMergedLiked] = useState(isLiked);
  const [mergedNum, setMergedNum] = useState(like);

  useEffect(() => {
    setMergedLiked(isLiked);
    setMergedNum(like);
  }, [isLiked, like]);

  return (
    <div
      className={className}
      onClick={() => {
        setShowAnimation(true);
        setMergedLiked(true);
        setMergedNum(mergedNum + 1);
        setTimeout(() => {
          onClick();
        }, 6000);
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

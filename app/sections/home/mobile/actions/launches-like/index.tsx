import RocketIcon from "../rocket-icon";
import Rockets from "./rockets";
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
      <span>{mergedNum}</span>
      {showAnimation && <Rockets />}
    </div>
  );
}

import RocketIcon from "../rocket-icon";
import Rockets from "./rockets";
import { useState } from "react";
export default function LaunchesLike({
  className,
  buttonClassName,
  onClick,
  isLiked,
  like
}: any) {
  const [showAnimation, setShowAnimation] = useState(false);
  return (
    <div
      className={className}
      onClick={() => {
        onClick();
        setShowAnimation(true);

        setTimeout(() => {
          setShowAnimation(false);
        }, 6000);
      }}
      style={{ position: "relative" }}
    >
      <button className={buttonClassName}>
        <RocketIcon isActive={isLiked} />
      </button>
      <span>{like}</span>
      {showAnimation && <Rockets />}
    </div>
  );
}

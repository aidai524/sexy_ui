import styles from "./thumbnail.module.css";
import type { Project } from "@/app/type";
import { useEffect, useRef, useState } from "react";
import Likes from "./likes";
import { AvatarBack } from "./avatar";
import Media from "./media";
import Progress from "./progress";

interface Props {
  showDesc: boolean;
  topDesc?: boolean;
  showProgress?: boolean;
  data: Project;
  autoHeight?: boolean;
  showBackIcon?: boolean;
  showLaunchType?: boolean;
  showLikes?: boolean;
  showTags?: boolean;
  showDropdownIcon?: boolean;
  style?: any;
  onGoDetail?: any;
}

export default function Thumbnail({
  showDesc = true,
  topDesc = false,
  showProgress = false,
  autoHeight = false,
  showBackIcon = true,
  showLaunchType = true,
  showLikes = false,
  showTags = true,
  showDropdownIcon = true,
  data,
  style = {},
  onGoDetail
}: Props) {
  const [height, setHeight] = useState("calc(100vh - 232px)");
  const [imgHeight, setImgHeight] = useState("80%");

  const descContentRef = useRef<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHeight(window.innerHeight - 232 + "px");
    }
    if (descContentRef.current) {
      setImgHeight(`calc(100% - ${descContentRef.current.clientHeight}px)`);
    }
  }, []);

  if (!data) {
    return;
  }

  return (
    <div className={styles.Container}>
      {topDesc && (
        <AvatarBack
          data={data}
          showBackIcon={showBackIcon}
          showLaunchType={showLaunchType}
        />
      )}

      <div
        className={styles.thumbnail}
        style={{
          height: autoHeight ? "auto" : height,
          ...style
        }}
      >
        <Media imgHeight={imgHeight} data={data} />

        {showLikes && (
          <div className={styles.bottomLike} ref={descContentRef}>
            <Likes data={data} />{" "}
          </div>
        )}

        <Progress
          {...{
            data,
            showTags,
            showDesc,
            showProgress,
            descContentRef,
            onGoDetail,
            showDropdownIcon
          }}
        />
      </div>
    </div>
  );
}

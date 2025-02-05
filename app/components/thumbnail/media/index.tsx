import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./index.module.css";
import { getVideoExt, videoReg, imgReg } from "../../upload";
import VideoPlayer from "../../video";

export default function Media({
  imgHeight,
  data,
  imgStyle,
  videoStyle,
  style,
  autoPlay
}: any) {
  return (
    <div className={styles.imgList}>
      <div
        className={styles.ImgWrapper}
        style={{
          height: imgHeight,
          ...style
        }}
      >
        {videoReg.test(data.tokenImg || "") ? (
          <VideoPlayer
            key={data.tokenImg}
            src={data.tokenImg}
            type={getVideoExt(data.tokenImg)}
            className={styles.tokenImg}
            style={videoStyle}
            autoPlay={autoPlay}
            token={data}
          />
        ) : (
          <img
            className={styles.tokenImg}
            src={data.tokenImg || "/img/token-placeholder.png"}
            style={imgStyle}
          />
        )}
      </div>
    </div>
  );
}

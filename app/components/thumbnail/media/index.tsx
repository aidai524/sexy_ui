import styles from "./index.module.css";
import { getVideoExt, videoReg, imgReg } from "../../upload";
import VideoPlayer from "../../video";

export default function Media({
  imgHeight,
  data,
  imgStyle,
  videoStyle,
  style,
  autoPlay,
  videoProgressStyle
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
            id={data.id}
            src={data.tokenImg}
            type={getVideoExt(data.tokenImg)}
            className={styles.Video}
            style={videoStyle}
            autoPlay={autoPlay}
            token={data}
            videoProgressStyle={videoProgressStyle}
          />
        ) : (
          <div
            className={styles.TokenImg}
            style={{
              ...imgStyle,
              backgroundImage: `url(${
                data.tokenImg
                  ? '"' + data.tokenImg + '"'
                  : "/img/token-placeholder.png"
              })`
            }}
          />
        )}
      </div>
    </div>
  );
}

import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./index.module.css";
import { getVideoExt, videoReg, imgReg } from "../../upload";
import VideoPlayer from "../../video";

export default function Media({ imgHeight, data }: any) {
  return (
    <div className={styles.imgList}>
      <div
        className={styles.ImgWrapper}
        style={{
          height: imgHeight
        }}
      >
        {
          videoReg.test(data.tokenImg || '') &&
          <VideoPlayer
            src={data.tokenImg}
            type={getVideoExt(data.tokenImg)}
            className={styles.tokenImg}
          />
        }
        {imgReg.test(data.tokenImg) && (
          <LazyLoadImage
            effect="blur"
            className={styles.tokenImg}
            src={data.tokenImg || "/img/token-placeholder.png"}
            placeholderSrc="/img/token-placeholder.png"
          />
        )}
      </div>
    </div>
  );
}

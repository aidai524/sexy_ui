import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./index.module.css";
import { videoReg } from "../../upload";

export default function Media({ imgHeight, data }: any) {
  return (
    <div className={styles.imgList}>
      <div
        className={styles.ImgWrapper}
        style={{
          height: imgHeight
        }}
      >
        {videoReg.test(data.tokenImg) ? (
          <video width="100%" autoPlay={false}>
            <source src={data.tokenImg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
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

import styles from "./mobile.module.css";

export default function Multiple({ num }: any) {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.multipleContent}>
        <div className={styles.multipleIcon}>
          <svg
            width="70"
            height="74"
            viewBox="0 0 70 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38.679 16.9866L45.9426 22.7799L23.4569 50.9727L16.1932 45.1794L38.679 16.9866Z"
              fill="#FFBFFD"
            />
            <path
              d="M31.4099 11.1886L38.6736 16.9819L16.1878 45.1747L8.92409 39.3814L31.4099 11.1886ZM45.943 22.7798L54.8668 11.5912L38.6793 16.9865L45.943 22.7798Z"
              fill="#FF98E3"
            />
            <path
              d="M54.8668 11.5912L31.4099 11.1886L38.6793 16.9865L54.8668 11.5912Z"
              fill="#FB7DC9"
            />
            <path
              d="M30.723 56.7674L23.4593 50.974L45.9451 22.7812L53.2088 28.5746L30.723 56.7674Z"
              fill="#FF98E3"
            />
            <path
              d="M37.9904 62.5641L30.7267 56.7708L53.2125 28.578L60.4762 34.3713L37.9904 62.5641ZM45.9428 22.7799L54.8666 11.5913L53.2065 28.5733L45.9428 22.7799Z"
              fill="#FB7DC9"
            />
            <path
              d="M54.8666 11.5913L60.476 34.3712L53.2065 28.5733L54.8666 11.5913Z"
              fill="#FA56A2"
            />
            <path
              d="M23.4569 50.9725L14.5332 62.1611L16.1932 45.1792L23.4569 50.9725Z"
              fill="#FF98E3"
            />
            <path
              d="M14.5334 62.1612L8.92395 39.3813L16.1934 45.1793L14.5334 62.1612ZM23.4571 50.9726L14.5334 62.1612L30.7208 56.7659L23.4571 50.9726Z"
              fill="#FB7DC9"
            />
            <path
              d="M14.5333 62.1615L37.9902 62.5641L30.7207 56.7662L14.5333 62.1615Z"
              fill="#FA56A2"
            />
            <path
              d="M49.209 23.0803C48.0182 22.7716 47.0773 21.8307 46.7686 20.64C46.7392 20.5224 46.5849 20.5224 46.5481 20.64C46.2394 21.8307 45.2985 22.7716 44.1077 23.0803C43.9901 23.1097 43.9901 23.2641 44.1077 23.3009C45.2985 23.6096 46.2394 24.5504 46.5481 25.7412C46.5775 25.8588 46.7319 25.8588 46.7686 25.7412C47.0773 24.5504 48.0182 23.6096 49.209 23.3009C49.3266 23.2641 49.3266 23.1097 49.209 23.0803Z"
              fill="white"
            />
            <path
              d="M50.4529 28.3214C50.7984 29.8356 51.9892 31.0337 53.5107 31.3792C53.621 31.4012 53.621 31.5556 53.5107 31.585C51.9965 31.9305 50.7984 33.1213 50.4529 34.6428C50.4235 34.7604 50.2765 34.7604 50.2471 34.6428C49.9016 33.1286 48.7108 31.9305 47.1893 31.585C47.0717 31.5556 47.0717 31.4086 47.1893 31.3792C48.7035 31.0337 49.9016 29.8429 50.2471 28.3214C50.2765 28.2038 50.4235 28.2038 50.4529 28.3214Z"
              fill="white"
            />
          </svg>
        </div>
        <div className={styles.multipleNum}>{num}</div>
      </div>
    </div>
  );
}

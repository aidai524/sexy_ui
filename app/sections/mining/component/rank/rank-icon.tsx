import styles from "./avatar.module.css";

const COLORS: Record<number, string[]> = {
  1: ["#FF97C3", "#FF2681"],
  2: ["#CD97FF", "#7926FF"],
  3: ["#97FFCD", "#2CBF82"]
};

function RankIcon({ rank }: any) {
  const color = COLORS[rank];
  if (color) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        className={`${styles.RankIcon} ${styles.RankIconSvg}`}
      >
        <path
          d="M9.77538 1.76192C10.1696 1.34745 10.8304 1.34745 11.2246 1.76192L12.9352 3.56058C13.13 3.76539 13.4024 3.87821 13.6849 3.87112L16.1664 3.80886C16.7382 3.79451 17.2055 4.26183 17.1911 4.83363L17.1289 7.31506C17.1218 7.59762 17.2346 7.86998 17.4394 8.06476L19.2381 9.77538C19.6526 10.1696 19.6526 10.8304 19.2381 11.2246L17.4394 12.9352C17.2346 13.13 17.1218 13.4024 17.1289 13.6849L17.1911 16.1664C17.2055 16.7382 16.7382 17.2055 16.1664 17.1911L13.6849 17.1289C13.4024 17.1218 13.13 17.2346 12.9352 17.4394L11.2246 19.2381C10.8304 19.6526 10.1696 19.6526 9.77538 19.2381L8.06476 17.4394C7.86998 17.2346 7.59762 17.1218 7.31506 17.1289L4.83362 17.1911C4.26182 17.2055 3.79451 16.7382 3.80886 16.1664L3.87112 13.6849C3.87821 13.4024 3.76539 13.13 3.56058 12.9352L1.76192 11.2246C1.34745 10.8304 1.34745 10.1696 1.76192 9.77538L3.56058 8.06476C3.76539 7.86998 3.87821 7.59762 3.87112 7.31506L3.80886 4.83362C3.79451 4.26182 4.26183 3.79451 4.83363 3.80886L7.31506 3.87112C7.59762 3.87821 7.86998 3.76539 8.06476 3.56058L9.77538 1.76192Z"
          fill={`url(#paint0_linear_4443_953_${rank})`}
          stroke="black"
        />
        <defs>
          <linearGradient
            id={`paint0_linear_4443_953_${rank}`}
            x1="10.5"
            y1="1"
            x2="10.5"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color[0]} />
            <stop offset="1" stopColor={color[1]} />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  return <div className={`${styles.RankIcon} ${styles.RankIconNormal}`} />;
}

export default function Rank({ rank }: any) {
  return (
    <div
      className={styles.Rank}
      style={{
        width: rank < 4 ? 19 : 17,
        height: rank < 4 ? 19 : 17
      }}
    >
      <RankIcon rank={rank} />
      <span className={styles.RankText}>{rank}</span>
    </div>
  );
}

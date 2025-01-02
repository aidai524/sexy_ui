import styles from "./index.module.css";
export default function Level({ level }: any) {
  const _level = level || 1;
  return (
    <div className={styles.Container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
      >
        <path
          d="M12.7498 0L4.24976 0L5.31226 2.125L11.6873 2.125L12.7498 0Z"
          fill="url(#paint0_linear_5421_466)"
        />
        <path
          d="M11.6873 2.125L4.24976 0L5.31226 2.125L11.6873 2.125Z"
          fill="url(#paint1_linear_5421_466)"
        />
        <path
          d="M11.6875 2.125L14.875 5.3125V5.84375L8.5 12.4844L2.125 5.84375V5.3125L5.3125 2.125L11.6875 2.125Z"
          fill="url(#paint2_linear_5421_466)"
        />
        <path
          d="M12.75 0L17 4.51562L14.875 5.3125L11.6875 2.125L12.75 0Z"
          fill="#C813EC"
        />
        <path
          d="M17 6.63965V4.51465L14.875 5.31152V5.84277L17 6.63965Z"
          fill="#9F03CE"
        />
        <path
          d="M0 6.63965V4.51465L2.125 5.31152V5.84277L0 6.63965Z"
          fill="#F143FA"
        />
        <path
          d="M0 6.64063L8.5 15.1406V12.4844L2.125 5.84375L0 6.64063Z"
          fill="#A917E7"
        />
        <path
          d="M17 6.64063L8.5 15.1406V12.4844L14.875 5.84375L17 6.64063Z"
          fill="url(#paint3_linear_5421_466)"
        />
        <path
          d="M4.25 0L4.76837e-07 4.51562L2.125 5.3125L5.3125 2.125L4.25 0Z"
          fill="url(#paint4_linear_5421_466)"
        />
        <path
          d="M3.71851 5.0459V4.51465H6.10913L8.49976 7.70215H8.76538L10.8904 4.51465L13.281 4.51465V5.0459L12.4841 5.0459L9.56226 9.2959H7.70288L4.51538 5.0459H3.71851Z"
          fill="white"
          fillOpacity="0.7"
        />
        <defs>
          <linearGradient
            id="paint0_linear_5421_466"
            x1="2.65601"
            y1="3.71875"
            x2="12.7498"
            y2="1.0625"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8CDEFF" />
            <stop offset="1" stopColor="#C350FD" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_5421_466"
            x1="5.57788"
            y1="1.85938"
            x2="10.8904"
            y2="3.71875"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AF8CFF" />
            <stop offset="1" stopColor="#B550FD" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_5421_466"
            x1="5.57813"
            y1="1.85937"
            x2="10.0937"
            y2="11.1562"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8CB2FF" />
            <stop offset="1" stopColor="#B937FF" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_5421_466"
            x1="12.75"
            y1="5.84375"
            x2="12.75"
            y2="15.1406"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5506CC" />
            <stop offset="1" stopColor="#E205DB" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_5421_466"
            x1="2.65625"
            y1="0"
            x2="2.65625"
            y2="5.3125"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#87C3FF" />
            <stop offset="1" stopColor="#CB24FE" />
          </linearGradient>
        </defs>
      </svg>
      <div>Lv.{_level}</div>
    </div>
  );
}

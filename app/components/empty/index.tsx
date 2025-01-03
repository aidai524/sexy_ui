import styles from "./index.module.css";

export default function Empty({ style, height, text, icon, textStyle }: Props) {
  return (
    <div className={styles.Container} style={{ height, ...style }}>
      {
        icon ? (
          <img src={icon} alt="" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="41"
            height="38"
            viewBox="0 0 41 38"
            fill="none"
          >
            <path
              d="M28.8186 34.386C27.6536 34.386 26.503 34.1194 25.4494 33.6052C24.3959 33.0911 23.4656 32.3421 22.7253 31.4122C22.3923 30.9975 21.8978 30.7583 21.3767 30.7566H18.8395C18.3184 30.7566 17.8239 30.9975 17.491 31.4122C16.7522 32.3427 15.8229 33.092 14.77 33.6063C13.7172 34.1205 12.5671 34.3868 11.4026 34.386C9.3067 34.3847 7.29695 33.5237 5.8146 31.992C4.33225 30.4603 3.49844 28.3832 3.49624 26.2167C3.49624 24.2118 4.19048 22.3274 5.43746 20.8542C8.23108 23.8487 12.4265 27.5504 17.9804 30.3194C18.2185 30.4399 18.4766 30.5001 18.7396 30.5001H21.485C21.7463 30.5001 22.0044 30.4382 22.2408 30.3194C27.7981 27.5504 31.9902 23.8521 34.7871 20.8542C35.7792 22.0383 36.4214 23.4919 36.6374 25.0423C36.8534 26.5927 36.6341 28.1746 36.0056 29.5999C35.3771 31.0253 34.3659 32.234 33.0921 33.0825C31.8183 33.9309 30.3356 34.3834 28.8203 34.386M36.3987 17.4416C36.2821 11.704 35.5113 0.378418 31.1494 0.378418C26.8924 0.378418 26.03 11.0448 25.8985 17.4055C25.906 17.8728 26.0883 18.3189 26.4072 18.6501C26.7261 18.9814 27.1568 19.1721 27.6088 19.1821C28.0609 19.1921 28.499 19.0207 28.8314 18.7039C29.1638 18.3871 29.3645 17.9494 29.3913 17.4829C29.5278 10.859 30.4319 6.54285 31.1494 4.73069C31.8786 6.56006 32.7726 10.9468 32.8975 17.6533C30.3902 20.4584 26.4479 24.1326 21.0737 26.8896H19.1392C13.4704 23.9864 9.38648 20.0488 6.91418 17.1972C7.06901 10.7557 7.93806 6.52048 8.64562 4.73413C9.36317 6.54801 10.2639 10.8607 10.4054 17.4829C10.4206 17.9601 10.6158 18.4122 10.9494 18.7425C11.2829 19.0728 11.7282 19.2551 12.1901 19.2503C12.6532 19.2395 13.0931 19.0391 13.4134 18.6932C13.7337 18.3473 13.9081 17.8842 13.8982 17.4055C13.7667 11.0448 12.9093 0.378418 8.65228 0.378418C4.19048 0.378418 3.48126 12.2375 3.39635 17.8288C2.31687 18.9219 1.46019 20.2274 0.876867 21.6683C0.293544 23.1093 -0.00459389 24.6564 5.35071e-05 26.2184C0.00401979 29.3424 1.20656 32.3373 3.34388 34.546C5.4812 36.7547 8.37877 37.9968 11.401 38C12.9368 38.0019 14.4571 37.6811 15.8694 37.0572C17.2818 36.4333 18.5567 35.5192 19.617 34.3706H20.5976C21.6589 35.5192 22.9348 36.4331 24.348 37.0569C25.7611 37.6808 27.282 38.0017 28.8186 38C31.8404 37.9964 34.7373 36.7539 36.874 34.5453C39.0107 32.3366 40.2127 29.342 40.2162 26.2184C40.2198 24.5587 39.8809 22.9173 39.222 21.4038C38.5631 19.8903 37.5995 18.5395 36.3954 17.4416"
              fill="#FF2681"
            />
          </svg>
        )
      }
      {text && <div className={styles.Text} style={textStyle}>{text}</div>}
    </div>
  );
}

interface Props {
  style?: React.CSSProperties;
  height?: number | string;
  text?: any;
  icon?: string;
  textStyle?: React.CSSProperties;
}

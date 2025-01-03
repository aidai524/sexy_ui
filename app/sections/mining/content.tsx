import Multiple from "./component/multiple";
import Statistics from "./component/statistics";
import Rank from "./component/rank";

export default function Mining({ styles, isMobile, info }: any) {
  return (
    <div className={styles.main}>
      <div className={styles.Content}>
        <div className={styles.Bg} />
        <div className={styles.zBox}>
          <Multiple num={info?.once_like_amount || 0} />
          <Statistics
            style={{
              justifyContent: "center"
            }}
            itemStyle={{
              width: isMobile ? "50%" : "20%"
            }}
            info={info}
          />
        </div>
        <Rank rank={info?.your_rank} />
      </div>
      {/* <div className={styles.AniBg} /> */}
      {/* <div className={styles.bottomAni}>
        <div className={styles.boxAni} style={{ width: "200%" }}>
          {[1, 2].map((item) => {
            return (
              <img
                key={item}
                className={styles.boxImg}
                src="/img/mining/make-meme-sexier.png"
              />
            );
          })}
        </div>
      </div> */}
    </div>
  );
}

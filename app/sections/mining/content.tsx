import Multiple from "./component/multiple";
import Statistics from "./component/statistics";
import Rank from "./component/rank";

export default function Mining({ styles }: any) {
  return (
    <div className={styles.main}>
      <div className={styles.zBox}>
        <Multiple />
        <Statistics
          style={{
            justifyContent: "center"
          }}
          itemStyle={{
            width: "20%"
          }}
        />
      </div>
      <Rank />
      <div className={styles.bottomAni}>
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
      </div>
    </div>
  );
}

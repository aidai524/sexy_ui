import styles from "./held.module.css";

const list = [1, 2, 3, 4];

export default function Held({ from }: any) {
  return (
    <div
      className={styles.main}
      style={{
        backgroundColor:
          from === "page" ? "transparent" : "rgba(255, 255, 255, 0.08)"
      }}
    >
      {list.map((item) => {
        return (
          <div
            className={`${styles.heldToken} ${
              from === "page" && styles.PageHeldToken
            }`}
            key={item}
          >
            <div className={styles.tokenMsg}>
              <img
                className={styles.tokenImg}
                src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect"
              />
              <div className={styles.tokenNames}>
                <div className={styles.name}>CAT</div>
                <div className={styles.viewCoin}>
                  <span className={styles.viewCoinText}>View Coin</span>
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 1C7.5 0.723858 7.27614 0.5 7 0.5L2.5 0.500001C2.22386 0.5 2 0.723858 2 1C2 1.27614 2.22386 1.5 2.5 1.5L6.5 1.5L6.5 5.5C6.5 5.77614 6.72386 6 7 6C7.27614 6 7.5 5.77614 7.5 5.5L7.5 1ZM1.35355 7.35355L7.35355 1.35355L6.64645 0.646447L0.646447 6.64645L1.35355 7.35355Z"
                      fill="#7E8A93"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.tokenValue}>
              <div className={styles.tokenAmount}>10.32K</div>
              <div className={styles.solPrice}>0.005 SOL</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

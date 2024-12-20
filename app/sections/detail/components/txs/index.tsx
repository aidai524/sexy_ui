import CA from "../ca";
import styles from "./txs.module.css";

const list = [1, 2, 3, 4];

export default function Txs({ from, data }: any) {
  return (
    <div className={styles.main}>
      <CA from={from} data={data} />

      <div
        className={`${styles.txContent} ${
          from === "laptop" ? styles.LaptopContent : ""
        }`}
      >
        {/* <div className={styles.txTtitles}>
                <div style={{ flex: 2 }} className={styles.titleItem}>Account</div>
                <div className={styles.titleItem}>Type</div>
                <div className={styles.titleItem}>SOL</div>
                <div className={styles.titleItem}>VVA</div>
                <div style={{ textAlign: 'right' }} className={styles.titleItem}>Txn</div>
            </div>

            <div className={styles.txList}>
                {
                    list.map(item => {
                        return <div key={item} className={styles.item}>
                        <div className={styles.account}>
                            <img className={styles.avatar} src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                            <span>Bro098</span>
                        </div>
    
                        <div className={ styles.type + ' ' + styles.sell }>sell 1s</div>
    
                        <div className={ styles.value }>0.1964</div>
    
                        <div className={ styles.vva }>5.71m</div>
    
                        <div className={ styles.link } style={{ textAlign: 'right' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1H2C1.44772 1 1 1.44772 1 2V12C1 12.5523 1.44772 13 2 13H7H12C12.5523 13 13 12.5523 13 12V8" stroke="#9290B1" strokeWidth="1.2" />
                                <path d="M9 1H13V5" stroke="#9290B1" strokeWidth="1.2" />
                                <path d="M12.9999 1L5.19995 8.8" stroke="#9290B1" strokeWidth="1.2" />
                            </svg>
                        </div>
                    </div>
                    })
                }
                
            </div> */}

        <iframe
          style={{
            height:
              from === "laptop" ? "calc(100vh - 430px)" : "calc(100vh - 210px)"
          }}
          id="dexscreener-embed"
          title="Dexscreener Trading Chart"
          width="100%"
          height="800"
          frameBorder="none"
          src={`https://dexscreener.com/near/refv1-4276?embed=1&theme=${"dark"}&info=0&trades=1&chart=0`}
        ></iframe>
      </div>
    </div>
  );
}

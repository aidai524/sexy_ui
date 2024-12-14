import LimitProject from './component/limitProjects'
import styles from './ming.module.css'

export default function Mining() {
    return <div className={styles.main}>
        <div className={ styles.zBox }>
        <div className={styles.multipleContent}>
            <div className={styles.multipleIcon}>
                <svg width="70" height="74" viewBox="0 0 70 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38.679 16.9866L45.9426 22.7799L23.4569 50.9727L16.1932 45.1794L38.679 16.9866Z" fill="#FFBFFD" />
                    <path d="M31.4099 11.1886L38.6736 16.9819L16.1878 45.1747L8.92409 39.3814L31.4099 11.1886ZM45.943 22.7798L54.8668 11.5912L38.6793 16.9865L45.943 22.7798Z" fill="#FF98E3" />
                    <path d="M54.8668 11.5912L31.4099 11.1886L38.6793 16.9865L54.8668 11.5912Z" fill="#FB7DC9" />
                    <path d="M30.723 56.7674L23.4593 50.974L45.9451 22.7812L53.2088 28.5746L30.723 56.7674Z" fill="#FF98E3" />
                    <path d="M37.9904 62.5641L30.7267 56.7708L53.2125 28.578L60.4762 34.3713L37.9904 62.5641ZM45.9428 22.7799L54.8666 11.5913L53.2065 28.5733L45.9428 22.7799Z" fill="#FB7DC9" />
                    <path d="M54.8666 11.5913L60.476 34.3712L53.2065 28.5733L54.8666 11.5913Z" fill="#FA56A2" />
                    <path d="M23.4569 50.9725L14.5332 62.1611L16.1932 45.1792L23.4569 50.9725Z" fill="#FF98E3" />
                    <path d="M14.5334 62.1612L8.92395 39.3813L16.1934 45.1793L14.5334 62.1612ZM23.4571 50.9726L14.5334 62.1612L30.7208 56.7659L23.4571 50.9726Z" fill="#FB7DC9" />
                    <path d="M14.5333 62.1615L37.9902 62.5641L30.7207 56.7662L14.5333 62.1615Z" fill="#FA56A2" />
                    <path d="M49.209 23.0803C48.0182 22.7716 47.0773 21.8307 46.7686 20.64C46.7392 20.5224 46.5849 20.5224 46.5481 20.64C46.2394 21.8307 45.2985 22.7716 44.1077 23.0803C43.9901 23.1097 43.9901 23.2641 44.1077 23.3009C45.2985 23.6096 46.2394 24.5504 46.5481 25.7412C46.5775 25.8588 46.7319 25.8588 46.7686 25.7412C47.0773 24.5504 48.0182 23.6096 49.209 23.3009C49.3266 23.2641 49.3266 23.1097 49.209 23.0803Z" fill="white" />
                    <path d="M50.4529 28.3214C50.7984 29.8356 51.9892 31.0337 53.5107 31.3792C53.621 31.4012 53.621 31.5556 53.5107 31.585C51.9965 31.9305 50.7984 33.1213 50.4529 34.6428C50.4235 34.7604 50.2765 34.7604 50.2471 34.6428C49.9016 33.1286 48.7108 31.9305 47.1893 31.585C47.0717 31.5556 47.0717 31.4086 47.1893 31.3792C48.7035 31.0337 49.9016 29.8429 50.2471 28.3214C50.2765 28.2038 50.4235 28.2038 50.4529 28.3214Z" fill="white" />
                </svg>
            </div>
            <div className={styles.multipleNum}>1.2x</div>
        </div>

        <div className={styles.statistics}>
            <div className={styles.statisticsItem}>
                <div className={styles.statisticsTitle}>Total Mining</div>
                <div style={{ fontSize: 26 }} className={styles.value}>5,256</div>
            </div>
            <div className={styles.statisticsItem}>
                <div className={styles.statisticsTitle}>You Liked</div>
                <div style={{ borderBottom: '1px dashed #fff' }} className={styles.value}>5,256</div>
            </div>
            <div className={styles.statisticsItem}>
                <div className={styles.statisticsTitle}>Launching Rate</div>
                <div className={styles.value}>0.37%</div>
            </div>
            <div className={styles.statisticsItem}>
                <div className={styles.statisticsTitle}>Launched Projects</div>
                <div style={{ marginTop: 5 }}>
                    <LimitProject />
                </div>
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>Basic Gameplay:</div>
            <div className={styles.groupContent}>The primary gameplay mechanic in Swipe-to-Earn games involves simple action of swiping ‘like’ on the screen. The action typically lead to the accumulation of in-game currency or points. </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>Task Completion: </div>
            <div className={styles.groupContent}>Players often complete basic tasks or objectives by performing these actions.</div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>More Details</div>
            <div className={styles.groupContent}>
                <div className={styles.gitbook}>
                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.4275 0C9.88996 0 9.39996 0.28067 8.42163 0.839532L3.06249 3.89883C2.13968 4.41528 1.37066 5.16364 0.83298 6.06845C0.295304 6.97326 0.00798482 8.00251 0 9.05242L0 9.24724C0.00804415 10.2958 0.294702 11.3238 0.831137 12.2277C1.36757 13.1317 2.13486 13.8798 3.05582 14.3967L6.40831 16.3143C8.36997 17.437 9.3508 18 10.4283 18C11.505 18.0008 12.4866 17.4403 14.4491 16.3176L17.9916 14.2927C18.9724 13.7313 19.4616 13.4507 19.7308 12.9892C19.9999 12.5269 20.0008 11.9656 19.9999 10.8429V8.67186C20.0001 8.52124 19.9603 8.37323 19.8844 8.24268C19.8086 8.11213 19.6994 8.00364 19.5679 7.92811C19.4363 7.85258 19.287 7.81266 19.1349 7.81237C18.9829 7.81208 18.8334 7.85142 18.7016 7.92644L11.4283 12.0737C10.9391 12.3519 10.695 12.4923 10.4275 12.4923C10.1583 12.4923 9.91413 12.3536 9.42413 12.0746L4.50415 9.27365C4.25665 9.13249 4.13248 9.06233 4.03332 9.04994C3.92379 9.03604 3.8127 9.05826 3.7172 9.11317C3.6217 9.16808 3.54712 9.25262 3.50499 9.35373C3.46749 9.44536 3.46749 9.58652 3.46915 9.86966C3.47082 10.0777 3.46915 10.1817 3.48999 10.2775C3.53415 10.4913 3.64749 10.6844 3.81248 10.8281C3.88665 10.8916 3.97748 10.9436 4.15915 11.0476L9.42163 14.0607C9.91246 14.3414 10.1583 14.4817 10.4275 14.4817C10.6975 14.4817 10.9416 14.3414 11.4325 14.0615L17.8824 10.3724C18.0508 10.2766 18.1341 10.2304 18.1966 10.2651C18.2591 10.3014 18.2591 10.3972 18.2591 10.5887V11.5735C18.2591 11.8542 18.2599 11.9945 18.1924 12.1092C18.1258 12.2248 18.0033 12.2942 17.7574 12.4345L12.4391 15.4764C11.4575 16.0378 10.9666 16.3185 10.4283 16.3185C9.88996 16.3185 9.3983 16.0378 8.4183 15.4748L3.44332 12.6252L3.40749 12.6045C2.89511 12.3073 2.46964 11.8831 2.17289 11.3736C1.87614 10.8642 1.71834 10.287 1.71499 9.69878V8.75276C1.71524 8.42777 1.80156 8.10852 1.96534 7.82692C2.12912 7.54532 2.36462 7.31121 2.64832 7.14799C2.89925 7.00402 3.18406 6.92814 3.47404 6.928C3.76402 6.92785 4.04891 7.00345 4.29998 7.14717L8.42163 9.50644C9.39996 10.067 9.88996 10.3476 10.4275 10.3485C10.965 10.3485 11.455 10.0678 12.4358 9.50892L18.6708 5.95432C18.8092 5.87535 18.9242 5.76162 19.0042 5.6246C19.0842 5.48758 19.1263 5.33209 19.1263 5.17381C19.1263 5.01553 19.0842 4.86005 19.0042 4.72303C18.9242 4.586 18.8092 4.47228 18.6708 4.3933L12.4333 0.83623C11.4541 0.279019 10.965 1.93476e-08 10.4283 0H10.4275Z" fill="#9290B1" />
                    </svg>
                    <div>View on Gitbook</div>
                </div>
            </div>
        </div>
        </div>

        <div className={ styles.bottomAni }>
            <div className={ styles.boxAni } style={{ width: '300vw' }}>
                {
                    [1,2,3,4,5,6,7,8,9,10].map(item => {
                        return <img key={item} className={ styles.boxImg } src="/img/mining/bottom-bg.png" />
                    })
                }
            </div>
        </div>
    </div>
}
import { useCallback } from 'react'
import styles from './token.module.css'
import { Modal } from 'antd-mobile'
import BoostJust from '@/app/components/boost/boostJust'

export default function Token() {
    const showBoostJust = useCallback(() => {
        const vipHandler = Modal.show({
            content: <BoostJust onBoost={() => {
                vipHandler.close() 
            }} />,
            closeOnMaskClick: true,
          })
    }, [])

    return <div className={styles.main}>
        <div className={styles.tokenMag}>
            <div className={styles.tokenImgContent}>
                <img className={styles.tokenImg} src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                <LaunchTag type={1} />
            </div>

            <div className={styles.nameContent}>
                <div className={styles.name}>GM bera frenz</div>
                <div className={styles.trikerContent}>
                    <span>Ticker: GMBM</span>
                    <img className={styles.createrImg} src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                </div>
                <div className={styles.MarketCap}>Market cap: 4.25K</div>
                <div className={styles.createTime}>18m ago</div>
            </div>
        </div>

        <div className={styles.actionContent}>
            <div className={styles.actionItem} onClick={() => {
                showBoostJust()
            }}>
                <div className={styles.actionIcon}>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="18" fill="#00FFEE" />
                        <path d="M3.91302 18C3.91302 25.7801 10.22 32.087 18 32.087C25.78 32.087 32.0869 25.7801 32.0869 18C32.0869 10.22 25.78 3.91309 18 3.91309" stroke="black" stroke-width="2" stroke-linecap="round" />
                        <path d="M19.7642 10.1909C20.2299 10.2771 20.5291 10.6879 20.4305 11.107L19.1867 16.4393L22.8576 17.3996C22.9523 17.4241 23.042 17.4634 23.1228 17.5157C23.2137 17.5728 23.2911 17.6468 23.3503 17.7331C23.4096 17.8193 23.4494 17.9159 23.4674 18.0171C23.4853 18.1183 23.481 18.2218 23.4548 18.3214C23.4285 18.421 23.3808 18.5145 23.3146 18.5961L17.1113 26.2886C17.0104 26.4107 16.8749 26.5038 16.7203 26.5574C16.5658 26.6109 16.3983 26.6228 16.2369 26.5916C15.7712 26.5043 15.472 26.0945 15.5695 25.6755L16.8132 20.3421L13.1424 19.3818C13.047 19.3571 12.9572 19.3171 12.8772 19.2657C12.7863 19.2086 12.7089 19.1346 12.6496 19.0484C12.5904 18.9621 12.5506 18.8655 12.5326 18.7643C12.5147 18.6631 12.5189 18.5596 12.5452 18.46C12.5715 18.3604 12.6192 18.267 12.6854 18.1853L18.8898 10.4938C18.9907 10.3717 19.1262 10.2786 19.2807 10.2251C19.4353 10.1715 19.6028 10.1597 19.7642 10.1909Z" fill="black" />
                    </svg>
                </div>
                <div className={styles.actionTimes}>
                    <span className={styles.whiteAmount}>0</span>
                    <span>/2</span>
                </div>
            </div>

            <div className={styles.actionItem}>
                <div className={styles.actionIcon}>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle opacity="0.4" cx="18" cy="18" r="18" fill="black" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.01044 19.995C6.8764 17.9844 8.00804 13.8644 11.8814 11.3248C12.1238 11.1659 12.4422 11.3262 12.487 11.6126C12.7104 13.0404 13.1543 13.9675 13.9319 14.7332C14.0371 14.8369 14.1938 14.8666 14.3317 14.8134C17.3915 13.6323 19.7746 11.2557 18.9299 5.46167C18.8833 5.1419 19.2045 4.89199 19.4879 5.04738C22.978 6.96147 29.0924 12.5165 28.9989 19.995C28.9989 28.4906 22.0026 31.3891 17.8048 31.3891C13.607 31.3891 7.01044 28.0908 7.01044 19.995ZM11.6129 18.5478C11.1536 19.2395 10.9083 20.0545 10.9083 20.8884C10.9078 21.4943 11.0371 22.0931 11.2873 22.6433C11.5375 23.1936 11.9026 23.6821 12.3574 24.0751L16.9132 28.133C17.1664 28.3586 17.4906 28.4854 17.8276 28.4907C18.1646 28.4961 18.4925 28.3796 18.7526 28.1623L23.4299 24.2541C23.9495 23.8654 24.3714 23.3582 24.6617 22.7735C24.952 22.1888 25.1025 21.543 25.1009 20.8884C25.1009 20.0545 24.8556 19.2395 24.3964 18.5478C23.9371 17.856 23.2848 17.3189 22.5229 17.0051C21.7609 16.6913 20.924 16.6151 20.1191 16.7863C19.5862 16.8997 19.0833 17.118 18.6379 17.4262C18.264 17.6848 17.7452 17.6848 17.3713 17.4262C16.9259 17.118 16.423 16.8997 15.8901 16.7863C15.0852 16.6151 14.2483 16.6913 13.4864 17.0051C12.7244 17.3189 12.0721 17.856 11.6129 18.5478ZM16.0042 20.1502C16.1779 20.0591 16.3652 20.2465 16.2741 20.4201L15.805 21.3141C15.7744 21.3722 15.7744 21.4417 15.805 21.4999L16.2741 22.3938C16.3652 22.5675 16.1779 22.7548 16.0042 22.6637L15.1103 22.1945C15.0521 22.164 14.9827 22.164 14.9245 22.1945L14.0306 22.6637C13.8569 22.7548 13.6695 22.5675 13.7607 22.3938L14.2298 21.4999C14.2603 21.4417 14.2603 21.3722 14.2298 21.3141L13.7607 20.4201C13.6695 20.2465 13.8569 20.0591 14.0306 20.1502L14.9245 20.6194C14.9827 20.6499 15.0521 20.6499 15.1103 20.6194L16.0042 20.1502ZM22.471 20.4201C22.5622 20.2465 22.3748 20.0591 22.2011 20.1502L21.3072 20.6194C21.249 20.6499 21.1796 20.6499 21.1214 20.6194L20.2275 20.1502C20.0538 20.0591 19.8664 20.2465 19.9576 20.4201L20.4267 21.3141C20.4573 21.3722 20.4573 21.4417 20.4267 21.4999L19.9576 22.3938C19.8664 22.5675 20.0538 22.7548 20.2275 22.6637L21.1214 22.1945C21.1796 22.164 21.249 22.164 21.3072 22.1945L22.2011 22.6637C22.3748 22.7548 22.5622 22.5675 22.471 22.3938L22.0019 21.4999C21.9713 21.4417 21.9713 21.3722 22.0019 21.3141L22.471 20.4201Z" fill="url(#paint0_linear_89_9484)" />
                        <defs>
                            <linearGradient id="paint0_linear_89_9484" x1="18" y1="5" x2="18" y2="31.3891" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#D9ABFF" />
                                <stop offset="1" stop-color="#B65AFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className={styles.actionTimes}>
                    <span className={styles.whiteAmount}>0</span>
                    <span>/2</span>
                </div>
            </div>
        </div>
    </div>
}

function LaunchTag({ type }: { type: number }) {
    if (type === 1) {
        return <div className={styles.launchTag + ' ' + styles.launch1}>Pre-Launch</div>
    }

    if (type === 2) {
        return <div className={styles.launchTag + ' ' + styles.launch2}>Pre-Launch</div>
    }

    if (type === 3) {
        return <div className={styles.launchTag + ' ' + styles.launch3}>Pre-Launch</div>
    }
}
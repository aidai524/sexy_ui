import { useEffect } from 'react';
import styles from './boost.module.css'

interface Props {
    onBoost: () => void;
    onCancel: () => void;
    num: number | undefined;
}

export default function BoostInit({
    onBoost, onCancel, num
}: Props) {



    return <div className={styles.panel}>
        <div className={styles.boostInit  + ' ' + styles.boosting}>
            <div className={styles.initTipContent}>
                <div className={ styles.mulBox }>
                    <div className={ styles.mulNum }>8.5X</div>
                    <div className={ styles.views }>Views</div>
                </div>
                <div className={styles.initTitle}>Your Boost was a success!</div>
                <div style={{ textAlign: 'center' }} className={styles.initTip}>You got up to 8.5x more views.</div>
            </div>
        </div>

        <div onClick={() => {
            onBoost()
        }} className={ styles.sureBtn }>Boost again</div>
        <div onClick={() => {
            onCancel()
        }} className={ styles.cancelBtn }>Okay</div>
    </div> 
}

const BoostingIcon = () => <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_87_18)">
<circle cx="46" cy="46" r="36" fill="#00FFEE"/>
</g>
<circle opacity="0.1" cx="46" cy="46" r="30" stroke="black" stroke-width="3" stroke-linecap="round"/>
<path d="M49.5196 28.0373C50.5176 28.2263 51.1586 29.1262 50.9473 30.044L48.2821 41.7245L56.1484 43.8279C56.3513 43.8816 56.5434 43.9675 56.7166 44.0821C56.9113 44.2074 57.0772 44.3694 57.2041 44.5583C57.3311 44.7472 57.4164 44.9589 57.4549 45.1805C57.4934 45.4022 57.4842 45.629 57.4279 45.8471C57.3716 46.0652 57.2694 46.2699 57.1275 46.4488L43.8348 63.299C43.6185 63.5665 43.3283 63.7705 42.997 63.8878C42.6658 64.0051 42.3069 64.0311 41.961 63.9627C40.963 63.7715 40.322 62.8738 40.531 61.956L43.1961 50.2733L35.3299 48.1698C35.1256 48.1158 34.9331 48.0281 34.7617 47.9156C34.567 47.7904 34.4011 47.6283 34.2741 47.4395C34.1471 47.2506 34.0618 47.0388 34.0233 46.8172C33.9849 46.5956 33.994 46.3688 34.0503 46.1507C34.1066 45.9326 34.2089 45.7278 34.3507 45.5489L47.6458 28.701C47.8621 28.4335 48.1523 28.2295 48.4836 28.1122C48.8148 27.9949 49.1737 27.9689 49.5196 28.0373Z" fill="black"/>
<path d="M46 16C49.1356 16 52.1589 16.4811 55 17.3734" stroke="black" stroke-width="3" stroke-linecap="round"/>
<defs>
<filter id="filter0_d_87_18" x="0" y="0" width="92" height="92" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.933333 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_87_18"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_87_18" result="shape"/>
</filter>
</defs>
</svg>

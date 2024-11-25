'use client'

import styles from './action.module.css'

export default function MainAction() {
    return <div className={styles.mainAction}>
        <div className={styles.actionIcon}>
            <DisLike />
        </div>
        <div className={styles.actionIcon}>
            <Like />
        </div>
    </div>
}


function DisLike() {
    return <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9101 3.38013C13.409 1.3308 10.9849 0 8.25 0C3.69365 0 0 3.69368 0 8.25C0 14.6307 5.83218 20.5627 10.904 23.7305L17.0441 13.9931L11.1571 10.9349L14.9101 3.38013ZM13.1575 24.9833C13.8123 25.3002 14.4324 25.556 15 25.7446C20.25 24 30 16.5 30 8.25C30 3.69368 26.3063 0 21.75 0C20.8882 0 20.0573 0.132128 19.2765 0.37723L14.5876 9.81583L20.7147 12.9987L13.1575 24.9833Z" fill="#C7DDEE" />
    </svg>
}

function Like() {
    return <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.25 0C3.69365 0 0 3.69368 0 8.25C0 16.5 9.75 24 15 25.7446C20.25 24 30 16.5 30 8.25C30 3.69368 26.3063 0 21.75 0C18.9598 0 16.493 1.38518 15 3.50535C13.507 1.38518 11.0402 0 8.25 0Z" fill="url(#paint0_linear_60_3189)"/>
    <defs>
    <linearGradient id="paint0_linear_60_3189" x1="15" y1="0" x2="15" y2="25.7446" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FF8ABB"/>
    <stop offset="1" stop-color="#FF2681"/>
    </linearGradient>
    </defs>
    </svg>
    
}


function SuperLike() {
    return <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27" cy="27" r="27" fill="white" fill-opacity="0.1" />
        <g filter="url(#filter0_i_77_1897)">
            <circle cx="27" cy="27.0002" r="13" fill="url(#paint0_radial_77_1897)" />
        </g>
        <circle cx="27.0004" cy="27.0002" r="11.8696" fill="url(#paint1_linear_77_1897)" />
        <path d="M22 25.0002L24.6256 26.7506C24.8037 26.8694 24.8037 27.1311 24.6256 27.2499L22 29.0002" stroke="#6A430C" stroke-width="1.5" stroke-linecap="round" />
        <path d="M33 25.0002L30.3744 26.7506C30.1963 26.8694 30.1963 27.1311 30.3744 27.2499L33 29.0002" stroke="#6A430C" stroke-width="1.5" stroke-linecap="round" />
        <path d="M30.5605 13.6144C29.2348 13.9476 28.44 15.3309 28.7852 16.7041C29.4102 19.1903 32.8151 20.7375 34.4747 20.8793C35.8701 19.9695 38.1386 16.9962 37.5136 14.5099C37.1684 13.1368 35.8139 12.2938 34.4883 12.627C33.6765 12.8311 33.0637 13.4289 32.7899 14.1771C32.1949 13.6473 31.3723 13.4103 30.5605 13.6144Z" fill="url(#paint2_radial_77_1897)" />
        <path d="M36.4124 30.6508C35.0795 30.3477 33.7446 31.2213 33.4307 32.6019C32.8623 35.1017 35.1978 38.0228 36.6135 38.9006C38.2695 38.7211 41.6384 37.097 42.2067 34.5972C42.5206 33.2166 41.6945 31.8517 40.3617 31.5486C39.5454 31.3631 38.7284 31.6187 38.1456 32.1619C37.8549 31.4201 37.2287 30.8363 36.4124 30.6508Z" fill="url(#paint3_radial_77_1897)" />
        <path d="M13.475 30.0002C12.1081 30.0002 11 31.148 11 32.5639C11 35.1275 13.925 37.4581 15.5 38.0002C17.075 37.4581 20 35.1275 20 32.5639C20 31.148 18.8919 30.0002 17.525 30.0002C16.6879 30.0002 15.9479 30.4307 15.5 31.0895C15.0521 30.4307 14.3121 30.0002 13.475 30.0002Z" fill="url(#paint4_radial_77_1897)" />
        <path d="M25.1123 30.2446C25.4292 31.2618 26.3781 32.0002 27.4996 32.0002C28.621 32.0002 29.57 31.2618 29.8869 30.2446" stroke="#6A430C" stroke-width="1.5" stroke-linecap="round" />
        <defs>
            <filter id="filter0_i_77_1897" x="14" y="14.0002" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.416667 0 0 0 0 0 0 0 0 1 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_77_1897" />
            </filter>
            <radialGradient id="paint0_radial_77_1897" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26.4348 23.6089) rotate(86.9059) scale(20.9436)">
                <stop stop-color="#FFF144" />
                <stop offset="1" stop-color="#EA7400" />
            </radialGradient>
            <linearGradient id="paint1_linear_77_1897" x1="26.4844" y1="11.0021" x2="26.4352" y2="29.2611" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FFFEED" />
                <stop offset="1" stop-color="#FFFC46" stop-opacity="0" />
            </linearGradient>
            <radialGradient id="paint2_radial_77_1897" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(31.5599 17.4876) rotate(49.3242) scale(4.47214 5.03115)">
                <stop stop-color="#FE81B4" />
                <stop offset="1" stop-color="#F0367C" />
            </radialGradient>
            <radialGradient id="paint3_radial_77_1897" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.55 34.5568) rotate(76.2438) scale(4.47214 5.03115)">
                <stop stop-color="#FE81B4" />
                <stop offset="1" stop-color="#F0367C" />
            </radialGradient>
            <radialGradient id="paint4_radial_77_1897" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.5 34.0002) rotate(63.4349) scale(4.47214 5.03115)">
                <stop stop-color="#FE81B4" />
                <stop offset="1" stop-color="#F0367C" />
            </radialGradient>
        </defs>
    </svg>
}
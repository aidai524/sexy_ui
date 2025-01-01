import type { Project } from "@/app/type"
import styles from './index.module.css'
import { useMessage } from "@/app/context/messageContext"

interface Props {
    token: Project
}

export default function Share({ token }: Props) {
    const { showShare } = useMessage()

    return <div
    className={ styles.share }
    onClick={() => {
        showShare(token)
    }}
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_b_4443_336)">
        <circle cx="20" cy="20" r="20" fill="black" fillOpacity="0.4" />
      </g>
      <circle
        cx="25.7727"
        cy="13.8636"
        r="2.86364"
        stroke="white"
        stroke-width="2"
      />
      <circle
        cx="25.7727"
        cy="26.1366"
        r="2.86364"
        stroke="white"
        stroke-width="2"
      />
      <circle cx="13.0908" cy="20.0001" r="4.09091" fill="white" />
      <path
        d="M23.3181 15.0908L13.9091 19.9999L23.3181 24.909"
        stroke="white"
        stroke-width="2"
      />
      <defs>
        <filter
          id="filter0_b_4443_336"
          x="-10"
          y="-10"
          width="60"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4443_336"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4443_336"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
}
"use client";

import { useState } from "react";
import styles from "./action.module.css";
import { useMessage } from "@/app/context/messageContext";
import { useAccount } from "@/app/hooks/useAccount";
import { useUserAgent } from "@/app/context/user-agent";
import SmokeBtn from "../smokHot";
import SmokeButtonWithFlip from "../smokHot/smoke-button-flip";

const likeAnis = [
  "/img/home/likeAni1.svg",
  "/img/home/likeAni2.svg",
  "/img/home/likeAni3.svg",
  "/img/home/likeAni4.svg"
];

export default function MainAction({
  onLike,
  onHate,
  ids,
  canFlip,
  onSuperLike,
  token
}: any) {

  const { likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger, showShare } =
    useMessage();
  const { address } = useAccount();
  const { isMobile } = useUserAgent();

  return (
    <div className={styles.mainAction}>
      <div
        onClick={() => {
          if (!address) {
            //@ts-ignore
            window.connect();
            return;
          }

          if (likeTrigger) {
            return;
          }
          setLikeTrigger(true);
          onLike();

          setTimeout(() => {
            setLikeTrigger(false);
          }, 1600);
        }}
        className={[
          styles.actionIcon,
          styles.likeIcon,
          "button"
        ].join(" ")}
        style={{ backgroundColor: token.isLike ? '#000' : '#FF045C', border: token.isLike ? '1px solid #FF045C': 'none'}}
      >
        <Like id={ids?.like} liked={token.isLike} />
      </div>

      <div className={styles.actionIcon + ' ' + styles.smokeIcon}>
        <SmokeBtn
          isBigIcon={true}
          token={token}
          onClick={() => {
            onSuperLike && onSuperLike();
          }}
          id={ids?.smoke}
        />
      </div>

      <div onClick={() => {
          if (!address) {
            //@ts-ignore
            window.connect();
            return;
          }


      }}>
        <Share />
      </div>
    </div>
  );
}

function DisLike({ fill = "#C7DDEE", id }: { fill?: string; id?: string }) {
  return (
    <svg
      width="30"
      height="26"
      viewBox="0 0 30 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id={id}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9101 3.38013C13.409 1.3308 10.9849 0 8.25 0C3.69365 0 0 3.69368 0 8.25C0 14.6307 5.83218 20.5627 10.904 23.7305L17.0441 13.9931L11.1571 10.9349L14.9101 3.38013ZM13.1575 24.9833C13.8123 25.3002 14.4324 25.556 15 25.7446C20.25 24 30 16.5 30 8.25C30 3.69368 26.3063 0 21.75 0C20.8882 0 20.0573 0.132128 19.2765 0.37723L14.5876 9.81583L20.7147 12.9987L13.1575 24.9833Z"
        fill={fill}
      />
    </svg>
  );
}

function Like({ id, liked }: any) {
  return (
    <div className={styles.likeSvg}>
      <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.188688 4.05842C-1.39401 10.3649 7.41097 16.9674 10.5062 18C15.665 15.9347 22.1558 9.36409 20.8238 4.05832C19.2567 -2.18416 12.8277 -0.0727158 10.5062 2.76718C8.9586 0.185311 1.75531 -2.18404 0.188688 4.05842Z" fill={liked ? "#FF045C" : '#fff'} />
      </svg>
      <span style={{ color: liked ? '#FF045C': '#fff' }}>{liked ? 'Liked' : 'Like'}</span>
    </div>
  );
}


function Share() {
  return <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_b_6153_1611)">
      <circle cx="25" cy="25" r="25" fill="#9290B1" fill-opacity="0.3" />
    </g>
    <circle cx="29.7049" cy="19.5455" r="2.54547" stroke="white" stroke-width="2" />
    <circle cx="29.7049" cy="30.4549" r="2.54547" stroke="white" stroke-width="2" />
    <circle cx="18.4318" cy="25.0004" r="3.63638" fill="white" />
    <path d="M27.5231 20.6362L19.1594 24.9999L27.5231 29.3635" stroke="white" stroke-width="2" />
    <defs>
      <filter id="filter0_b_6153_1611" x="-10" y="-10" width="70" height="70" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_6153_1611" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_6153_1611" result="shape" />
      </filter>
    </defs>
  </svg>

}

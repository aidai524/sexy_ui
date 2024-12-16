"use client";

import { useState } from "react";
import styles from "./action.module.css";
import { useMessage } from "@/app/context/messageContext";

interface Props {
  onLike: () => void;
  onHate: () => void;
}

const likeAnis = [
  "/img/home/likeAni1.svg",
  "/img/home/likeAni2.svg",
  "/img/home/likeAni3.svg",
  "/img/home/likeAni4.svg"
];

export default function MainAction({ onLike, onHate }: Props) {
  const { likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger } = useMessage();

  return (
    <div className={styles.mainAction}>
      <div
        onClick={() => {
          setHateTrigger(true);
          onHate();
          setTimeout(() => {
            setHateTrigger(false);
          }, 1600);
        }}
        className={[
          styles.actionIcon,
          hateTrigger ? styles.hate : "",
          "button"
        ].join(" ")}
      >
        <DisLike fill={hateTrigger ? "#000000" : "#C7DDEE"} />

        {/* <DisLike fill="#000000" /> */}
      </div>

      <div
        onClick={() => {
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
          likeTrigger ? styles.tick : "",
          "button"
        ].join(" ")}
      >
        <Like />
        {likeAnis.map((item, index) => {
          return (
            <div
              key={item}
              style={{
                animationDelay: `${index / 4}s`,
                animationName: likeTrigger ? styles["float" + (index + 1)] : ""
              }}
              className={styles.bolloon}
            >
              <img src={item} key={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DisLike({ fill = "#C7DDEE" }: { fill?: string }) {
  return (
    <svg
      width="30"
      height="26"
      viewBox="0 0 30 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.9101 3.38013C13.409 1.3308 10.9849 0 8.25 0C3.69365 0 0 3.69368 0 8.25C0 14.6307 5.83218 20.5627 10.904 23.7305L17.0441 13.9931L11.1571 10.9349L14.9101 3.38013ZM13.1575 24.9833C13.8123 25.3002 14.4324 25.556 15 25.7446C20.25 24 30 16.5 30 8.25C30 3.69368 26.3063 0 21.75 0C20.8882 0 20.0573 0.132128 19.2765 0.37723L14.5876 9.81583L20.7147 12.9987L13.1575 24.9833Z"
        fill={fill}
      />
    </svg>
  );
}

function Like() {
  return (
    <div className={styles.likeSvg}>
      <svg
        width="30"
        height="26"
        viewBox="0 0 30 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.25 0C3.69365 0 0 3.69368 0 8.25C0 16.5 9.75 24 15 25.7446C20.25 24 30 16.5 30 8.25C30 3.69368 26.3063 0 21.75 0C18.9598 0 16.493 1.38518 15 3.50535C13.507 1.38518 11.0402 0 8.25 0Z"
          fill="url(#paint0_linear_60_3189)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_60_3189"
            x1="15"
            y1="0"
            x2="15"
            y2="25.7446"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF8ABB" />
            <stop offset="1" stop-color="#FF2681" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

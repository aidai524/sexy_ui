"use client";

import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useReferStore } from "@/app/store/useRefer";
import ReferModal from "@/app/components/layout/laptop/user/refer/modal";
import { useAccount } from "@/app/hooks/useAccount";
import { useGuidingTour } from "@/app/store/use-guiding-tour";

const Refer = (props: any) => {
  const { isMobile } = props;

  const store = useReferStore();
  const { address } = useAccount();

  const handleEntryOpen = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    store.setEntryVisible(true);
  };

  const handleEntryClose = () => {
    store.setEntryVisible(false);
  };

  const handleOpen = () => {
    if (!address) {
      //@ts-ignore
      window.connect();
      return;
    }
    store.setVisible(true);
  };

  return (
    <div className={isMobile ? styles.ContainerMobile : styles.Container}>
      {isMobile && store.entryVisible ? null : (
        <div
          className={isMobile ? styles.EntryMobile : styles.Entry}
          onClick={handleEntryOpen}
        >
          <EntryAnimation />
        </div>
      )}
      <motion.div
        className={styles.Card}
        variants={{
          visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 20
            }
          },
          invisible: {
            opacity: 0,
            scale: 0,
            x: "-100%",
            y: "100%"
          }
        }}
        initial="invisible"
        animate={store.entryVisible && !isMobile ? "visible" : "invisible"}
      >
        <ReferContent
          handleOpen={handleOpen}
          handleEntryClose={handleEntryClose}
        />
      </motion.div>
      <ReferModal {...props} />
    </div>
  );
};

export default Refer;

const ReferContent = (props: any) => {
  const { handleOpen, handleEntryClose, isMobile } = props;

  return (
    <>
      <div className={isMobile ? styles.CardInnerMobile : styles.CardInner}>
        <div className={styles.Title}>Refer to Earn</div>
        <div className={styles.Content}>
          <div className={styles.Rebates}>
            <div className={styles.RebatesValue}>$5000</div>
            <div className={styles.RebatesUnit}>Rebates</div>
          </div>
          <button
            type="button"
            className={styles.ReferBtn}
            onClick={handleOpen}
          >
            <div className={styles.ReferBtnText}>REFER</div>
          </button>
        </div>
      </div>
      <button
        type="button"
        className={styles.CloseBtn}
        onClick={handleEntryClose}
      />
    </>
  );
};

const EntryAnimation = (props: any) => {
  const { style } = props;
  return (
    <motion.svg
      width="52"
      height="72"
      viewBox="0 0 52 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g filter="url(#filter0_f_4629_544)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.018 32.8587C6.78686 29.3914 8.73834 22.2864 15.4178 17.9071C15.8359 17.6329 16.3849 17.9094 16.4622 18.4033C16.8474 20.8656 17.6129 22.4643 18.9539 23.7847C19.1354 23.9635 19.4056 24.0149 19.6433 23.9231C24.92 21.8863 29.0295 17.7879 27.5729 7.79615C27.4925 7.2447 28.0465 6.81374 28.5351 7.08171C34.5538 10.3825 45.098 19.962 44.9368 32.8587C44.9368 43.9959 37.9644 49.5552 31.4401 51.581C33.1131 53.5682 34.1624 56.1839 34.1624 58.3292C34.1624 59.4787 33.8612 60.3697 33.3242 61.0565L35.8596 61.7358C36.2677 61.8452 36.6766 61.5659 36.7119 61.1448C36.84 59.6187 36.9656 57.112 36.7858 55.1454C36.5923 53.0305 39.0668 53.4165 40.7312 54.0073C41.0545 54.1221 41.2217 54.4703 41.1329 54.8018L38.5788 64.3341C38.4802 64.7019 38.1022 64.9202 37.7344 64.8216L30.4172 62.861C30.3614 62.846 30.309 62.8246 30.2607 62.7978C28.9685 63.1162 27.4372 63.2222 25.7954 63.2222C24.1007 63.2222 22.5236 63.1093 21.2058 62.7663C21.1439 62.8082 21.0742 62.8406 20.998 62.861L13.6808 64.8216C13.313 64.9202 12.935 64.7019 12.8364 64.3341L10.2822 54.8018C10.1934 54.4703 10.3606 54.1221 10.6839 54.0073C12.3484 53.4165 14.8228 53.0305 14.6294 55.1454C14.4496 57.112 14.5752 59.6187 14.7032 61.1448C14.7386 61.5659 15.1475 61.8452 15.5556 61.7358L18.2366 61.0174C17.7184 60.3361 17.4284 59.4571 17.4284 58.3292C17.4284 56.1799 18.4816 53.5586 20.16 51.5701C13.7556 49.4474 7.018 43.6031 7.018 32.8587Z"
          fill="url(#paint0_radial_4629_544)"
          fillOpacity="0.6"
        />
      </g>
      <g filter="url(#filter1_i_4629_544)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.018 32.8587C6.78686 29.3914 8.73834 22.2864 15.4178 17.9071C15.8359 17.6329 16.3849 17.9094 16.4622 18.4033C16.8474 20.8656 17.6129 22.4643 18.9539 23.7847C19.1354 23.9635 19.4056 24.0149 19.6433 23.9231C24.92 21.8863 29.0295 17.7879 27.5729 7.79615C27.4925 7.2447 28.0465 6.81374 28.5351 7.08171C34.5538 10.3825 45.098 19.962 44.9368 32.8587C44.9368 43.9959 37.9644 49.5552 31.4401 51.581C33.1131 53.5682 34.1624 56.1839 34.1624 58.3292C34.1624 59.4787 33.8612 60.3697 33.3242 61.0565L35.8596 61.7358C36.2677 61.8452 36.6766 61.5659 36.7119 61.1448C36.84 59.6187 36.9656 57.112 36.7858 55.1454C36.5923 53.0305 39.0668 53.4165 40.7312 54.0073C41.0545 54.1221 41.2217 54.4703 41.1329 54.8018L38.5788 64.3341C38.4802 64.7019 38.1022 64.9202 37.7344 64.8216L30.4172 62.861C30.3614 62.846 30.309 62.8246 30.2607 62.7978C28.9685 63.1162 27.4372 63.2222 25.7954 63.2222C24.1007 63.2222 22.5236 63.1093 21.2058 62.7663C21.1439 62.8082 21.0742 62.8406 20.998 62.861L13.6808 64.8216C13.313 64.9202 12.935 64.7019 12.8364 64.3341L10.2822 54.8018C10.1934 54.4703 10.3606 54.1221 10.6839 54.0073C12.3484 53.4165 14.8228 53.0305 14.6294 55.1454C14.4496 57.112 14.5752 59.6187 14.7032 61.1448C14.7386 61.5659 15.1475 61.8452 15.5556 61.7358L18.2366 61.0174C17.7184 60.3361 17.4284 59.4571 17.4284 58.3292C17.4284 56.1799 18.4816 53.5586 20.16 51.5701C13.7556 49.4474 7.018 43.6031 7.018 32.8587Z"
          fill="url(#paint1_radial_4629_544)"
        />
      </g>
      <g
        style={{ mixBlendMode: "soft-light" }}
        filter="url(#filter2_i_4629_544)"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.018 32.8587C6.78686 29.3914 8.73834 22.2864 15.4178 17.9071C15.8359 17.6329 16.3849 17.9094 16.4622 18.4033C16.8474 20.8656 17.6129 22.4643 18.9539 23.7847C19.1354 23.9635 19.4056 24.0149 19.6433 23.9231C24.92 21.8863 29.0295 17.7879 27.5729 7.79615C27.4925 7.2447 28.0465 6.81374 28.5351 7.08171C34.5538 10.3825 45.098 19.962 44.9368 32.8587C44.9368 43.9959 37.9644 49.5552 31.4401 51.581C33.1131 53.5682 34.1624 56.1839 34.1624 58.3292C34.1624 59.4787 33.8612 60.3697 33.3242 61.0565L35.8596 61.7358C36.2677 61.8452 36.6766 61.5659 36.7119 61.1448C36.84 59.6187 36.9656 57.112 36.7858 55.1454C36.5923 53.0305 39.0668 53.4165 40.7312 54.0073C41.0545 54.1221 41.2217 54.4703 41.1329 54.8018L38.5788 64.3341C38.4802 64.7019 38.1022 64.9202 37.7344 64.8216L30.4172 62.861C30.3614 62.846 30.309 62.8246 30.2607 62.7978C28.9685 63.1162 27.4372 63.2222 25.7954 63.2222C24.1007 63.2222 22.5236 63.1093 21.2058 62.7663C21.1439 62.8082 21.0742 62.8406 20.998 62.861L13.6808 64.8216C13.313 64.9202 12.935 64.7019 12.8364 64.3341L10.2822 54.8018C10.1934 54.4703 10.3606 54.1221 10.6839 54.0073C12.3484 53.4165 14.8228 53.0305 14.6294 55.1454C14.4496 57.112 14.5752 59.6187 14.7032 61.1448C14.7386 61.5659 15.1475 61.8452 15.5556 61.7358L18.2366 61.0174C17.7184 60.3361 17.4284 59.4571 17.4284 58.3292C17.4284 56.1799 18.4816 53.5586 20.16 51.5701C13.7556 49.4474 7.018 43.6031 7.018 32.8587Z"
          fill="url(#paint2_radial_4629_544)"
        />
      </g>
      <path
        d="M13.7399 34.3983C13.7398 32.9602 14.1629 31.5549 14.9548 30.3619C15.7468 29.169 16.8717 28.2427 18.1856 27.7016C19.4996 27.1605 20.9429 27.0291 22.3309 27.3243C23.2499 27.5198 24.117 27.8963 24.8851 28.4277C25.5299 28.8738 26.4247 28.8738 27.0694 28.4277C27.8375 27.8963 28.7047 27.5198 29.6237 27.3243C31.0117 27.0291 32.455 27.1605 33.7689 27.7016C35.0829 28.2427 36.2078 29.169 36.9997 30.3619C37.7917 31.5549 38.2147 32.9602 38.2147 34.3983C38.2174 35.5272 37.958 36.6409 37.4574 37.6492C36.9568 38.6575 36.2291 39.5321 35.3332 40.2023L27.2671 46.9419C26.8186 47.3168 26.2531 47.5176 25.672 47.5083C25.0908 47.4991 24.5319 47.2804 24.0952 46.8915L16.2387 39.8937C15.4545 39.216 14.8249 38.3735 14.3934 37.4246C13.9619 36.4758 13.7389 35.4432 13.7399 34.3983Z"
        fill="#FFFCC4"
      />
      {/*#region Left Eye*/}
      <motion.path
        d="M19.9456 32.2441L22.3558 33.4493C22.4295 33.4861 22.4295 33.5913 22.3558 33.6282L19.9456 34.8333"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          blink: {
            opacity: [1, 0, 1],
            transition: {
              duration: 1,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity,
              delay: 0.5
            }
          }
        }}
        animate="blink"
      />
      <motion.circle
        cx="21.165"
        cy="33.5406"
        r="1.94186"
        fill="black"
        variants={{
          blink: {
            opacity: [1, 0, 1],
            transition: {
              duration: 1,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity
            }
          }
        }}
        animate="blink"
      />
      {/*#endregion*/}
      <circle cx="30.9495" cy="33.5385" r="1.94186" fill="black" />
      <path
        d="M19.9456 38.0698C20.8472 40.3417 23.1155 41.9535 25.7711 41.9535C28.4268 41.9535 30.695 40.3417 31.5967 38.0698"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M41.9276 28.8296C43.0567 30.3351 43.4331 33.7225 42.6804 35.9807"
        stroke="#FFFEFE"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M41.9276 37.8628C41.9276 37.9604 41.6999 38.5894 41.2444 39.2183"
        stroke="#FFFEFE"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.194 23.5605C11.4412 24.3133 9.78518 26.4963 9.18298 29.2062"
        stroke="#FFFEFE"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <filter
          id="filter0_f_4629_544"
          x="0"
          y="0"
          width="51.9386"
          height="71.8452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.5"
            result="effect1_foregroundBlur_4629_544"
          />
        </filter>
        <filter
          id="filter1_i_4629_544"
          x="7"
          y="7"
          width="37.9386"
          height="57.8452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_4629_544"
          />
        </filter>
        <filter
          id="filter2_i_4629_544"
          x="7"
          y="7"
          width="37.9386"
          height="57.8452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_4629_544"
          />
        </filter>
        <radialGradient
          id="paint0_radial_4629_544"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(27.249 36.7336) rotate(92.8624) scale(30.1476 34.6353)"
        >
          <stop stopColor="#FFF366" />
          <stop offset="1" stopColor="#FF0189" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_4629_544"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(27.249 36.7336) rotate(92.8624) scale(30.1476 34.6353)"
        >
          <stop stopColor="#FFF366" />
          <stop offset="1" stopColor="#FF0189" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_4629_544"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(27.249 36.7336) rotate(92.8624) scale(30.1476 34.6353)"
        >
          <stop stopColor="#FFF366" />
          <stop offset="1" stopColor="#FF0189" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

export const ReferContentCard = (props: any) => {
  const {} = props;

  const store = useReferStore();
  const { address } = useAccount();

  const handleEntryClose = () => {
    store.setEntryVisible(false);
  };

  const handleOpen = () => {
    if (!address) {
      //@ts-ignore
      window.connect();
      return;
    }
    store.setVisible(true);
  };

  return (
    <motion.div
      className={styles.CardMobile}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
          }
        },
        invisible: {
          opacity: 0,
          y: "100%"
        }
      }}
      initial="invisible"
      animate={store.entryVisible ? "visible" : "invisible"}
    >
      <EntryAnimation
        style={{ flexShrink: 0, transform: "scale(0.8) translateY(-10px)" }}
      />
      <ReferContent
        handleOpen={handleOpen}
        handleEntryClose={handleEntryClose}
        isMobile={true}
      />
    </motion.div>
  );
};

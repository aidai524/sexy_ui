import Modal from "../modal";
import { Avatar } from "../messages/avatar";
import config from "./config";
import styles from "./index.module.css";
import { useState } from "react";
export default function HowToWork({ open, onClose }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <Modal open={open} onClose={onClose} mainStyle={{ border: "none" }}>
      <div className={styles.Container}>
        <div className={styles.Header}>
          <Avatar />
          <div>
            <div className={styles.Title}>SexyFi: Pump Launchpad 2.0</div>
            <div className={styles.HeaderHints}>
              <span>
                Focusing on Social Interaction that is addictive and fun!
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="8"
                viewBox="0 0 9 8"
                fill="none"
                className={styles.HeaderHintsAnchor}
              >
                <path
                  d="M1.11009 0.906616C4.78123 2.22858 8.48107 0.90812 9 0L8 8C4.06958 7.71039 1.5472 4.08002 0.432855 1.55117C0.25294 1.14287 0.690296 0.755451 1.11009 0.906616Z"
                  fill="#FFAFD0"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={styles.Content}>
          <div className={styles.SubTitle}>Platform Overview</div>
          <div
            className={styles.Desc}
            style={{
              marginTop: 16
            }}
          >
            SexyFi is a next-generation meme token launch platform on Solana,
            blending social interaction, gamification, and cutting-edge UX to
            empower project creators, users, and influencers.
          </div>
          <div
            className={styles.Desc}
            style={{
              marginTop: 16
            }}
          >
            Inspired by pump.fun, SexyFi stands out with its platform token,
            Tinder-like experience, and a swipe-to-earn economy, where both
            creators and users benefit from meaningful engagement.
          </div>
          <div
            className={styles.SubTitle}
            style={{
              marginTop: 40
            }}
          >
            How It Works?
          </div>
          <div
            className={styles.Items}
            style={{
              marginTop: 24
            }}
          >
            {config.map((item: any, i: number) => (
              <button
                className={`${styles.Item} ${
                  i === currentIndex && styles.ItemActive
                }`}
                onClick={() => {
                  setCurrentIndex(i);
                }}
              >
                {i + 1}. {item.title}
              </button>
            ))}
          </div>
          <ul>
            {config[currentIndex].items.map((item: string, i: number) => (
              <li
                className={styles.Desc}
                key={i}
                style={{
                  marginTop: 16,
                  listStyle: "inside"
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}

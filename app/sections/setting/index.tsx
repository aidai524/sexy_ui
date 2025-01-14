"use client";

import Link from "next/link";
import styles from "./setting.module.css";
import BackNew from "@/app/components/backNew";
import { useAuth } from "@/app/context/auth";

export default function Settings() {
  const { logout } = useAuth();
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backButton}>
          <BackNew />
        </div>
        <div>Setting</div>
      </div>

      <div className={styles.menuContainer}>
        <Link href="/profile/edit" className={styles.menuItem}>
          <div className={styles.textWrapper}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="10" fill="#A031EF" />
              <path d="M12.2427 19.8624L10.1659 20.0592C10.1016 20.0654 10.0367 20.0573 9.97594 20.0354C9.91515 20.0136 9.85992 19.9787 9.81421 19.933C9.7685 19.8874 9.73344 19.8322 9.71153 19.7715C9.68963 19.7107 9.68142 19.6459 9.68749 19.5816L9.88429 17.5048C9.90829 17.2512 10.0203 17.0136 10.2011 16.8328L17.8899 9.14398C17.9917 9.04214 18.1125 8.96136 18.2455 8.90624C18.3785 8.85112 18.5211 8.82275 18.6651 8.82275C18.8091 8.82275 18.9516 8.85112 19.0846 8.90624C19.2177 8.96136 19.3385 9.04214 19.4403 9.14398L20.6035 10.3072C20.7053 10.409 20.7861 10.5298 20.8412 10.6628C20.8963 10.7958 20.9247 10.9384 20.9247 11.0824C20.9247 11.2264 20.8963 11.3689 20.8412 11.5019C20.7861 11.6349 20.7053 11.7558 20.6035 11.8576L12.9139 19.5472C12.7333 19.7271 12.4957 19.8386 12.2419 19.8624H12.2427Z" fill="white" />
            </svg>
            <span>Edit profile</span>
          </div>

          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 14L7 7.5L1 1" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        </Link>

        <div className={styles.menuItem} onClick={() => {
          logout()
        }}>
          <div className={styles.textWrapper}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="10" fill="#FF008A" />
              <path d="M17.1333 7H7V22.2H17.1333" stroke="white" stroke-width="2" />
              <path d="M13.333 14.6H19.6663" stroke="white" stroke-width="2" />
              <path d="M23.4668 14.6L19.6668 18.9879L19.6668 10.2121L23.4668 14.6Z" fill="white" />
            </svg>
            <span>Disconnect</span>
          </div>

        </div>
      </div>
    </div>
  );
}
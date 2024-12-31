import type { Project } from "@/app/type";
import styles from "./preUser.module.css";
import { useEffect, useState } from "react";
import { formatAddress, httpGet } from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import Big from "big.js";
import { useRouter } from "next/navigation";

interface Props {
  token: Project;
}

export default function PreUser({ token }: Props) {
  const [superLikeList, setSuperLikeList] = useState([]);
  const [likeList, setLikeList] = useState([]);

  useEffect(() => {
    if (token) {
      console.log(token);
      httpGet(
        "/project/like/accounts?project_id=" + token.id + "&limit=100"
      ).then((v) => {
        if (v.code === 0) {
          setSuperLikeList(v.data.super_like_account_list);
          setLikeList(v.data.like_account_list);
        }
      });
    }
  }, [token]);

  return (
    <div className={styles.main}>
      <div className={styles.title}>Founders</div>
      <UserItem item={token.creater} type={1} />
      {superLikeList.map((item: any) => {
        return <UserItem key={"super-like-" + item.id} item={item} type={3} />;
      })}
      {likeList.map((item: any) => {
        return <UserItem key={"like-" + item.id} item={item} type={2} />;
      })}
    </div>
  );
}

function UserItem({ item, type }: any) {
  const router = useRouter();

  return (
    <div className={styles.userItem}>
      <div
        className={styles.userBox}
        onClick={() => {
          router.push("/profile/user?account=" + item.address);
        }}
      >
        <div className={styles.avatar}>
          <img className={styles.avatarImg} src={item.icon || defaultAvatar} />
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {item.name ? item.name : formatAddress(item.address)}
          </div>
          <div className={styles.followers}>
            {item.followers || 0} followers
          </div>
        </div>
      </div>

      {type === 1 && <div className={styles.creator}>Creator</div>}

      {type === 2 && (
        <div className={styles.like}>
          <svg
            width="17"
            height="15"
            viewBox="0 0 17 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.675 0C2.09307 0 0 2.1521 0 4.80682C0 9.61365 5.525 13.9835 8.5 15C11.475 13.9835 17 9.61365 17 4.80682C17 2.1521 14.9069 0 12.325 0C10.7439 0 9.34605 0.807066 8.5 2.04238C7.65395 0.807066 6.25613 0 4.675 0Z"
              fill="url(#paint0_linear_3957_1490)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_3957_1490"
                x1="8.5"
                y1="0"
                x2="8.5"
                y2="15"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF8ABB" />
                <stop offset="1" stop-color="#FF2681" />
              </linearGradient>
            </defs>
          </svg>
          <span>Liked</span>
        </div>
      )}

      {type === 3 && (
        <div className={styles.like}>
          <svg
            width="17"
            height="15"
            viewBox="0 0 17 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.675 0C2.09307 0 0 2.1521 0 4.80682C0 9.61365 5.525 13.9835 8.5 15C11.475 13.9835 17 9.61365 17 4.80682C17 2.1521 14.9069 0 12.325 0C10.7439 0 9.34605 0.807066 8.5 2.04238C7.65395 0.807066 6.25613 0 4.675 0Z"
              fill="url(#paint0_linear_3957_1490)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_3957_1490"
                x1="8.5"
                y1="0"
                x2="8.5"
                y2="15"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF8ABB" />
                <stop offset="1" stop-color="#FF2681" />
              </linearGradient>
            </defs>
          </svg>
          <span>
            {item.buy_amount
              ? new Big(item.buy_amount).div(10 ** 9).toString()
              : 0}{" "}
            SOL
          </span>
        </div>
      )}
    </div>
  );
}

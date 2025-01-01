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
                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.00698843 10.0413C-0.0827662 8.69489 0.675021 5.93592 3.26876 4.23536C3.43111 4.12891 3.64428 4.23625 3.67429 4.42806C3.82387 5.38418 4.12114 6.005 4.64184 6.51773C4.71234 6.58715 4.81727 6.60709 4.90957 6.57146C6.95857 5.78056 8.55436 4.18907 7.98871 0.309155C7.95749 0.095019 8.17261 -0.0723279 8.36235 0.0317295C10.6995 1.31347 14.7939 5.03332 14.7313 10.0413C14.7313 15.7302 10.0463 17.6712 7.23531 17.6712C4.42429 17.6712 0.00698843 15.4625 0.00698843 10.0413ZM3.08893 9.07205C2.7814 9.53528 2.61713 10.081 2.61714 10.6394C2.61678 11.0452 2.70337 11.4461 2.87091 11.8146C3.03846 12.183 3.28296 12.5102 3.58749 12.7734L6.63824 15.4907C6.80781 15.6417 7.02486 15.7266 7.25054 15.7302C7.47621 15.7338 7.69578 15.6559 7.86995 15.5103L11.0021 12.8932C11.35 12.633 11.6326 12.2933 11.827 11.9018C12.0214 11.5102 12.1221 11.0778 12.121 10.6394C12.1211 10.081 11.9568 9.53528 11.6493 9.07205C11.3417 8.60882 10.9049 8.24914 10.3947 8.03902C9.88446 7.82889 9.32401 7.77788 8.78504 7.89251C8.42817 7.9684 8.09145 8.11463 7.79319 8.32098C7.54283 8.4942 7.19536 8.4942 6.94499 8.32098C6.64673 8.11463 6.31001 7.9684 5.95314 7.89251C5.41417 7.77788 4.85372 7.82889 4.3435 8.03902C3.83327 8.24914 3.39645 8.60882 3.08893 9.07205ZM6.02954 10.1452C6.14582 10.0842 6.2713 10.2097 6.21027 10.326L5.8961 10.9246C5.87566 10.9635 5.87566 11.0101 5.8961 11.049L6.21027 11.6476C6.2713 11.7639 6.14582 11.8894 6.02954 11.8284L5.43092 11.5142C5.39197 11.4937 5.34546 11.4937 5.30651 11.5142L4.70789 11.8284C4.59161 11.8894 4.46614 11.7639 4.52716 11.6476L4.84133 11.049C4.86177 11.0101 4.86177 10.9635 4.84133 10.9246L4.52716 10.326C4.46614 10.2097 4.59161 10.0842 4.70789 10.1452L5.30651 10.4594C5.34546 10.4799 5.39197 10.4799 5.43092 10.4594L6.02954 10.1452ZM10.36 10.326C10.4211 10.2097 10.2956 10.0842 10.1793 10.1452L9.58069 10.4594C9.54174 10.4799 9.49523 10.4799 9.45628 10.4594L8.85766 10.1452C8.74138 10.0842 8.6159 10.2097 8.67693 10.326L8.9911 10.9246C9.01154 10.9635 9.01154 11.0101 8.9911 11.049L8.67693 11.6476C8.6159 11.7639 8.74138 11.8894 8.85766 11.8284L9.45628 11.5142C9.49523 11.4937 9.54174 11.4937 9.58069 11.5142L10.1793 11.8284C10.2956 11.8894 10.4211 11.7639 10.36 11.6476L10.0459 11.049C10.0254 11.0101 10.0254 10.9635 10.0459 10.9246L10.36 10.326Z" fill="url(#paint0_linear_3957_1484)" />
                        <defs>
                            <linearGradient id="paint0_linear_3957_1484" x1="7.36603" y1="0" x2="7.36603" y2="17.6712" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#D9ABFF" />
                                <stop offset="1" stop-color="#B65AFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span>
                        {item.buy_amount
                            ? new Big(item.buy_amount).div(1 - 0.015).div(10 ** 9).toString()
                            : 0}{" "}
                        SOL
                    </span>
                </div>
            )}
        </div>
    );
}

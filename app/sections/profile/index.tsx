import styles from "./profile.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { httpAuthGet, httpAuthPost } from "@/app/utils";
import useUserInfo from "./hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import Back from "@/app/components/back";
import { useRouter, useSearchParams } from "next/navigation";
import Tabs from "./components/tabs";
import Avatar from "@/app/components/avatar";
import FollowerActions from "./components/follower-actions";
import Address from "./components/address";
import HotBoost from "./components/hot-boost";
import VipModal from "./components/vip-modal";
import useFollow from "./hooks/useFollow";

interface Props {
    showHot?: boolean;
    isOther?: boolean;
}

export default function Profile({ showHot = true, isOther = false }: Props) {
    const router = useRouter();
    const params = useSearchParams();
    const { address: userAddress } = useAccount();
    const { follow, unFollow } = useFollow();
    const [isFollower, setIsFollower] = useState(false);
    const [refreshNum, setRefreshNum] = useState(0);
    const [showVip, setShowVip] = useState(false);

    useEffect(() => {
        if (userAddress && params) {
            if (params.get("account")?.toString() === userAddress && isOther) {
                router.replace('/profile')
            } 
        }
    }, [userAddress, params, isOther]);

    const address = useMemo(() => {
        if (isOther && params) {
            return params.get("account")?.toString();
        }

        return userAddress;
    }, [userAddress, params, isOther]);

    const { userInfo } = useUserInfo(address);

    useEffect(() => {
        if (address && isOther) {
            httpAuthGet("/follower/account", { address: address }).then((res) => {
                console.log("res:", res);
                if (res.code === 0 && res.data) {
                    setIsFollower(res.data.is_follower);
                }
            });
        }
    }, [address, isOther, refreshNum]);

    const backgroundImgStyle = userInfo?.banner
        ? {
            backgroundImage: `linear-gradient(360deg, #0D1012 41.35%, rgba(0, 0, 0, 0) 100%)`,
            backgroundSize: "100% auto"
        }
        : {};

    const backgroundImgStyle1 = userInfo?.banner
        ? {
            backgroundImage: `url(${userInfo?.banner})`,
            backgroundSize: "100% auto"
        }
        : {};

    return (
        <div className={styles.main}>
            <div style={backgroundImgStyle1}>
                {isOther ? (
                    <div className={styles.isOther}>
                        <div>
                            <Back style={{ left: 0, top: 0 }} />
                        </div>

                        <div className={styles.followerType}>
                            {!isFollower ? (
                                <div
                                    className={styles.isFollow}
                                    onClick={async () => {
                                        if (!address) {
                                            return;
                                        }
                                        await follow(address);
                                        setRefreshNum(refreshNum + 1);
                                    }}
                                >
                                    Follow
                                </div>
                            ) : (
                                <div
                                    onClick={async () => {
                                        if (!address) {
                                            return;
                                        }
                                        await unFollow(address);
                                        setRefreshNum(refreshNum + 1);
                                    }}
                                    className={styles.isFollow}
                                >
                                    UnFollow
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
                <div className={styles.avatarContent} style={backgroundImgStyle}>
                    <Avatar
                        userInfo={userInfo}
                        onEdit={() => {
                            router.push("/profile/edit");
                        }}
                    />
                </div>
            </div>

            <FollowerActions
                userInfo={userInfo}
                onItemClick={() => {
                    router.push("/profile/follower?account=" + address);
                }}
            />
            <Address address={address} />
            {
                !isOther && <HotBoost
                    user={userInfo}
                    onMoreClick={() => {
                        setShowVip(true);
                    }}
                    style={{ margin: "20px 10px" }}
                />
            }

            <Tabs address={address} showHot={showHot} />
            <VipModal
                show={showVip}
                onClose={() => {
                    setShowVip(false);
                }}
            />
        </div>
    );
}

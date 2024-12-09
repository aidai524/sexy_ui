import Created from './components/created'
import Held from './components/held'
import Tab from './components/tab'
import styles from './profile.module.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd-mobile'
import BoostVip from '@/app/components/boost/boostVip'
import { httpAuthGet, httpAuthPost } from '@/app/utils'
import type { UserInfo } from '@/app/type/index'
import useUserInfo from './hooks/useUserInfo'
import { useAccount } from '@/app/hooks/useAccount';
import { success, fail } from '@/app/utils/toast'
import Back from '@/app/components/back'
import { useRouter, useSearchParams } from "next/navigation";
import Tabs from "./components/tabs";
import Avatar from "@/app/components/avatar";
import FollowerActions from "./components/follower-actions";
import Address from "./components/address";
import HotBoost from "./components/hot-boost";
import useFollow from "./hooks/useFollow";

interface Props {
    showHot?: boolean;
    isOther?: boolean;
}

export default function Profile({
    showHot = true, isOther = false
}: Props) {
    const router = useRouter()
    const params = useSearchParams()
    const { address: userAddress } = useAccount()
    const { follow, unFollow } = useFollow()
    const [isFollower, setIsFollower] = useState(false)
    const [refreshNum, setRefreshNum] = useState(0)
    const [showVip, setShowVip] = useState(false)
    const address = useMemo(() => {
        if (isOther && params) {
            return params.get("account")?.toString();
        }

        return userAddress;
    }, [userAddress, params, isOther]);

    const { userInfo } = useUserInfo(address);

    useEffect(() => {
        if (address && isOther) {
            httpAuthGet('/follower/account', { address: address }).then(res => {
                console.log('res:', res)
                if (res.code === 0) {
                    setIsFollower(res.data.is_follower)
                }
            })
        }
    }, [address, isOther, refreshNum])

    const tabs = useMemo(() => {
        const _tabs = [{
            name: 'Held',
            content: <Held />
        }, {
            name: 'Created',
            content: <Created address={address} type="created" />
        }, {
            name: 'Liked',
            content: <Created address={address} type="liked" />
        }]
        return _tabs
    }, [showHot, address])

    const VipModal = <BoostVip onStartVip={() => {

    }} onCanceVip={() => {
        setShowVip(false)
    }} />

    const backgroundImgStyle = userInfo?.banner ? {
        backgroundImage: `linear-gradient(360deg, #0D1012 41.35%, rgba(0, 0, 0, 0) 100%)`,
        backgroundSize: "100% auto"
    } : {};

    const backgroundImgStyle1 = userInfo?.banner
        ? {
            backgroundImage: `url(${userInfo?.banner})`,
            backgroundSize: "100% auto"
        } : {};

    return <div className={styles.main}>
        <div style={backgroundImgStyle1}>
            {
                isOther ? <div className={styles.isOther}>
                    <div>
                        <Back style={{ left: 0, top: 0 }} />
                    </div>

                    <div className={styles.followerType}>
                        {
                            !isFollower ? <div className={styles.isFollow} onClick={async () => {
                                if (!address) {
                                    return
                                }
                                await follow(address)
                                setRefreshNum(refreshNum + 1)
                            }}>Follow</div> : <div onClick={async () => {
                                if (!address) {
                                    return
                                }
                                await unFollow(address)
                                setRefreshNum(refreshNum + 1)
                            }} className={styles.isFollow}>UnFollow</div>
                        }
                    </div>
                </div> : null
            }
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
            <HotBoost onMoreClick={() => { setShowVip(true) }} style={{ margin: "20px 10px" }} />
            <Tabs address={address} showHot={showHot} />

            <Modal
                visible={showVip}
                content={VipModal}
                closeOnAction
                closeOnMaskClick
                onClose={() => {
                    setShowVip(false)
                }}
            />
    </div>
}

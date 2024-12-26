"use client";

import { memo, useCallback } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import VipModal from "./components/vip-modal";
import { useUserAgent } from "@/app/context/user-agent";
import useUserInfo from "../../hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useUser } from "@/app/store/useUser";
import { httpAuthGet } from "@/app/utils";
import SexPullToRefresh from "@/app/components/sexPullToRefresh";
import { Button } from "antd-mobile";
import useJupiter from "@/app/hooks/useJupiter";

export default memo(function Home(props: any) {
    const { showHot = true, isOther = false } = props;
    const { isMobile } = useUserAgent();
    const router = useRouter();
    const params = useSearchParams();
    const { address: userAddress } = useAccount();
    const [isFollower, setIsFollower] = useState(false);
    const [refreshNum, setRefreshNum] = useState(0);
    const [showVip, setShowVip] = useState(false);
    const { profileTabIndex, set: setProfileTabIndex }: any = useHomeTab();

    useEffect(() => {
        if (userAddress && params) {
            if (params.get("account")?.toString() === userAddress && isOther) {
                router.replace("/profile");
            }
        }
    }, [userAddress, params, isOther]);

    const address = useMemo(() => {
        if (isOther && params) {
            return params.get("account")?.toString();
        }

        return userAddress;
    }, [userAddress, params, isOther]);

    const { onQueryInfo, userInfo } = useUserInfo(address);
    const { userInfo: ownUserInfo, set: setUserInfo }: any = useUser();

    const comProps = {
        userInfo,
        address,
        isFollower,
        refreshNum,
        setRefreshNum,
        onQueryInfo,
        setUserInfo,
        setShowVip,
        router,
        profileTabIndex
    };

    useEffect(() => {
        getAccountFollower()
    }, [address, isOther, refreshNum]);

    const getAccountFollower = useCallback(() => {
        if (address && isOther) {
            httpAuthGet("/follower/account", { address: address }).then((res) => {
                if (res.code === 0) {
                    if (res.data) {
                        setIsFollower(res.data.is_follower);
                    } else {
                        setIsFollower(false);
                    }
                }
            });
        }
    }, [address, isOther, refreshNum])

    const { trade } = useJupiter({
        tokenAddress: '4MvdsczbZ7PpZPdjcw793sRqGeH9RsxqtrQvxniLpump'
      })

    return (
        <SexPullToRefresh
            onRefresh={async () => {
                await getAccountFollower()
                await onQueryInfo()
            }}>

                {/* <Button onClick={() => {
                    trade('5000000', 'sell')
                }}>test juipter</Button> */}
            {isMobile ? (
                <Mobile {...props} {...comProps} />
            ) : (
                <Laptop {...props} {...comProps} />
            )}
            <VipModal
                show={showVip}
                onClose={() => {
                    setShowVip(false);
                }}
            />
        </SexPullToRefresh>
    );
});

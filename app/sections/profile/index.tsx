"use client";

import { memo, useCallback } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import VipModal from "./components/vip-modal";
import { useUserAgent } from "@/app/context/user-agent";
import useUserInfo from "../../hooks/useUserInfo";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/app/store/useUser";
import { httpAuthGet } from "@/app/utils";
import SexPullToRefresh from "@/app/components/sexPullToRefresh";
import { TokenActionsProvider, useTokenActions } from "./token-context";
import TradeModal from "@/app/components/trade-modal";
import { useAuth } from "@/app/context/auth";

export default memo(function Home(props: any) {
  const { showHot = true, isOther = false } = props;

  const router = useRouter();
  const params = useSearchParams();
  const { accountRefresher, userInfo: currentUserInfo } = useAuth();
  const [isFollower, setIsFollower] = useState(false);
  const [refreshNum, setRefreshNum] = useState(0);
  const [showVip, setShowVip] = useState(false);

  useEffect(() => {
    if (currentUserInfo?.address && params) {
      if (
        params.get("account")?.toString() === currentUserInfo.address &&
        isOther
      ) {
        router.replace("/profile");
      }
    }
  }, [currentUserInfo, params, isOther]);

  const address = useMemo(() => {
    if (isOther && params) {
      return params.get("account")?.toString();
    }

    return currentUserInfo?.address;
  }, [currentUserInfo, params, isOther]);

  const { onQueryInfo, userInfo, isLoading } = useUserInfo(
    address,
    !isOther,
    accountRefresher
  );

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
    isOther,
    isLoading
  };

  useEffect(() => {
    getAccountFollower();
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
  }, [address, isOther, refreshNum]);

  return (
    <TokenActionsProvider>
      <Content {...props} {...comProps} />
      <VipModal
        show={showVip}
        onClose={() => {
          setShowVip(false);
        }}
      />
    </TokenActionsProvider>
  );
});

const Content = (props: any) => {
  const { isMobile } = useUserAgent();
  const { showTradeModal, currentToken, onCloseTradeModal } = useTokenActions();

  return (
    <>
      {isMobile ? (
        <SexPullToRefresh
          onRefresh={async () => {
            await props.getAccountFollower();
            await props.onQueryInfo();
          }}
        >
          <Mobile {...props} />
        </SexPullToRefresh>
      ) : (
        <Laptop {...props} />
      )}
      {showTradeModal && currentToken && (
        <TradeModal
          show={showTradeModal}
          onClose={() => {
            onCloseTradeModal(false);
          }}
          data={currentToken}
          initType={"buy"}
        />
      )}
    </>
  );
};

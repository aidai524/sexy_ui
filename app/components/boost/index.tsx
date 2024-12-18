import { Modal } from "antd-mobile";
import styles from './boost.module.css'
import BoostInit from "./boostInit";
import BoostVip from "./boostVip";
import BoostJust from "./boostJust";
import BoostTime from "./boostTime";
import BoostStatus from "./boostStatus";
import BoostSuperNoTimes from "./boostSuperNoTimes";
import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "@/app/hooks/useAccount";
import { httpAuthPost } from "@/app/utils";
import type { Project } from "@/app/type";
import { fail, success } from "@/app/utils/toast";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";

export default function Boost({
    onClick,
    token,
    isGrey = false,
}: {
    onClick: () => void;
    token: Project;
    isGrey?: boolean;
}) {
    const [vipShow, setVipShow] = useState(false);
    const [boostVipShow, setBoostVipShow] = useState(false);
    const [boostShow, setBoostShow] = useState(false);
    const [boostTimeShow, setBoostTimeShow] = useState(false);
    const [boostStatusShow, setBoostStatusShow] = useState(false);
    const [boostSuperNoTimesShow, setBoostSuperNoTimesShow] = useState(false);

    const { address } = useAccount();
    const { userInfo, set }: any = useUser();
    const { fecthUserInfo } = useUserInfo(undefined)

    const VipModal = (
        <BoostVip
            onStartVip={() => {
                setBoostShow(true)
            }}
            onCanceVip={() => {
                setVipShow(false);
            }}
        />
    );

    const BoostVipModal = (
        <BoostInit
            onJoinVip={() => {
                setVipShow(true);
                setBoostVipShow(false);
            }}
            onCanceVip={() => {
                setBoostVipShow(false);
            }}
        />
    );


    const BoostModal = (
        <BoostJust
            token={token}
            usingBoostNum={userInfo?.usingBoostNum}
            boostNum={userInfo?.boostNum}
            onBoost={async () => {
                setBoostShow(false);
                setBoostStatusShow(true);
                onClick && onClick()
                const userInfo = await fecthUserInfo(address as string)
                set({
                    userInfo
                })
            }}
        />
    );

    const BoostTimeModal = (
        <BoostTime
            time={token.boostTime}
            onBoost={() => {
                checkBoostVip()
                setBoostTimeShow(false);
            }}
            onCancel={() => {
                setBoostTimeShow(false);
            }}
        />
    );

    const BoostStatusModal = (
        <BoostStatus
            num={token.boostTime}
            onBoost={() => {
                checkBoostVip()
                setBoostStatusShow(false);
            }}
            onCancel={() => {
                setBoostStatusShow(false);
                setBoostTimeShow(false);
            }}
        />
    );

    const BoostSuperNoTimesModal = <BoostSuperNoTimes
        token={token}
        usingNum={userInfo?.usingBoostNum}
        num={userInfo?.boostNum}
        onClose={() => {
            setBoostSuperNoTimesShow(false)
        }}
        type={1}
    />

    const checkBoostVip = () => {
        // setBoostShow(true);
        // return

        if (userInfo?.boostNum && (userInfo?.boostNum - userInfo?.usingBoostNum)> 0) {
            setBoostShow(true);
        } else {
            if (userInfo.vipType === 'vip') {
                setBoostSuperNoTimesShow(true)
            } else {
                setBoostVipShow(true);
            }
        }
    }

    return (
        <div
            onClick={() => {
                
                if (!address) {
                    //@ts-ignore
                    window.connect()
                    return
                }

                if (token.boostTime && Number(token.boostTime) - Date.now() > 0) {
                    setBoostTimeShow(true);
                    return;
                }

                checkBoostVip()

                onClick();
            }}
        >
            <div className={styles.btn}>
                {token.boostTime && Number(token.boostTime) - Date.now() > 0 ? (
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="18" cy="18" r="18" fill="#00FFEE" />
                        <path
                            d="M3.91302 18C3.91302 25.7801 10.22 32.087 18 32.087C25.78 32.087 32.0869 25.7801 32.0869 18C32.0869 10.22 25.78 3.91309 18 3.91309"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                        <path
                            d="M19.7642 10.1909C20.2299 10.2771 20.5291 10.6879 20.4305 11.107L19.1867 16.4393L22.8576 17.3996C22.9523 17.4241 23.042 17.4634 23.1228 17.5157C23.2137 17.5728 23.2911 17.6468 23.3503 17.7331C23.4096 17.8193 23.4494 17.9159 23.4674 18.0171C23.4853 18.1183 23.481 18.2218 23.4548 18.3214C23.4285 18.421 23.3808 18.5145 23.3146 18.5961L17.1113 26.2886C17.0104 26.4107 16.8749 26.5038 16.7203 26.5574C16.5658 26.6109 16.3983 26.6228 16.2369 26.5916C15.7712 26.5043 15.472 26.0945 15.5695 25.6755L16.8132 20.3421L13.1424 19.3818C13.047 19.3571 12.9572 19.3171 12.8772 19.2657C12.7863 19.2086 12.7089 19.1346 12.6496 19.0484C12.5904 18.9621 12.5506 18.8655 12.5326 18.7643C12.5147 18.6631 12.5189 18.5596 12.5452 18.46C12.5715 18.3604 12.6192 18.267 12.6854 18.1853L18.8898 10.4938C18.9907 10.3717 19.1262 10.2786 19.2807 10.2251C19.4353 10.1715 19.6028 10.1597 19.7642 10.1909Z"
                            fill="black"
                        />
                    </svg>
                ) : (

                    isGrey
                        ? <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.4" cx="18" cy="18" r="18" fill="black" />
                            <path d="M19.9322 9.01969C20.4423 9.11942 20.7699 9.59436 20.6619 10.0788L19.2998 16.2435L23.3203 17.3536C23.424 17.382 23.5222 17.4273 23.6107 17.4878C23.7102 17.5539 23.795 17.6394 23.8599 17.7391C23.9248 17.8388 23.9684 17.9505 23.9881 18.0675C24.0077 18.1845 24.003 18.3042 23.9743 18.4193C23.9455 18.5344 23.8932 18.6425 23.8207 18.7369L17.0267 27.63C16.9161 27.7712 16.7678 27.8789 16.5985 27.9408C16.4292 28.0027 16.2457 28.0164 16.069 27.9803C15.5589 27.8794 15.2313 27.4056 15.3381 26.9212L16.7002 20.7554L12.6797 19.6452C12.5753 19.6167 12.4769 19.5704 12.3893 19.511C12.2898 19.4449 12.205 19.3594 12.1401 19.2597C12.0752 19.16 12.0316 19.0483 12.0119 18.9313C11.9923 18.8143 11.997 18.6946 12.0257 18.5795C12.0545 18.4644 12.1068 18.3563 12.1793 18.2619L18.9745 9.36995C19.0851 9.22879 19.2334 9.12114 19.4027 9.05922C19.572 8.99731 19.7555 8.98361 19.9322 9.01969Z" stroke="white" stroke-width="2" />
                        </svg>
                        : <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle opacity="0.4" cx="24" cy="24" r="24" fill="black" />
                            <path
                                d="M26.2085 13.7368C26.7914 13.8508 27.1659 14.3936 27.0424 14.9472L25.4857 21.9925L30.0805 23.2613C30.1991 23.2937 30.3113 23.3455 30.4124 23.4146C30.5262 23.4902 30.6231 23.5879 30.6972 23.7018C30.7714 23.8158 30.8212 23.9435 30.8437 24.0772C30.8662 24.2108 30.8608 24.3476 30.8279 24.4792C30.7951 24.6107 30.7353 24.7343 30.6525 24.8422L22.8878 35.0058C22.7615 35.1671 22.592 35.2901 22.3985 35.3609C22.205 35.4317 21.9953 35.4473 21.7933 35.4061C21.2104 35.2907 20.8359 34.7493 20.958 34.1957L22.5148 27.149L17.9199 25.8802C17.8006 25.8477 17.6881 25.7947 17.588 25.7269C17.4743 25.6513 17.3773 25.5536 17.3032 25.4397C17.229 25.3257 17.1792 25.198 17.1567 25.0644C17.1342 24.9307 17.1396 24.7939 17.1725 24.6623C17.2054 24.5308 17.2651 24.4073 17.3479 24.2994L25.1139 14.1371C25.2403 13.9758 25.4098 13.8527 25.6033 13.782C25.7968 13.7112 26.0065 13.6956 26.2085 13.7368Z"
                                fill="#00FFEE"
                            />
                        </svg>
                )}
            </div>


            <Modal
                visible={boostVipShow}
                content={BoostVipModal}
                closeOnAction
                closeOnMaskClick
                onClose={() => {
                    setVipShow(false);
                }}
            />

            <Modal
                visible={vipShow}
                content={VipModal}
                closeOnAction
                closeOnMaskClick
                onClose={() => {
                    setBoostVipShow(false);
                }}
            />

            <Modal
                visible={boostShow}
                content={BoostModal}
                closeOnMaskClick
                closeOnAction
                onClose={() => {
                    setBoostShow(false);
                }}
            />

            <Modal
                visible={boostTimeShow}
                content={BoostTimeModal}
                closeOnMaskClick
                closeOnAction
                onClose={() => {
                    setBoostTimeShow(false);
                }}
            />

            <Modal
                visible={boostStatusShow}
                content={BoostStatusModal}
                closeOnMaskClick
                closeOnAction
                onClose={() => {
                    setBoostStatusShow(false);
                }}
            />

            <Modal
                visible={boostSuperNoTimesShow}
                content={BoostSuperNoTimesModal}
                closeOnMaskClick
                closeOnAction
                onClose={() => {
                    setBoostSuperNoTimesShow(false);
                }}
            />
        </div>
    );
}

import { Modal } from "antd-mobile";

import BoostInit from "./boostInit";
import BoostVip from "./boostVip";
import BoostJust from "./boostJust";
import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "@/app/hooks/useAccount";

export default function Boost({ onClick }: { onClick: () => void; }) {
    const [vipShow, setVipShow] = useState(false)
    const [boostVipShow, setBoostVipShow] = useState(false)
    const [boostShow, setBoostShow] = useState(false)

    const { address } = useAccount()

    const VipModal = <BoostVip address={address} onStartVip={() => {
        
    }} onCanceVip={() => {
        setBoostShow(true)
        setVipShow(false)
    }} />

    const BoostVipModal = <BoostInit onJoinVip={() => {
        setVipShow(true)
        setBoostVipShow(false)
    }} onCanceVip={() => {
        setBoostShow(true)
        setBoostVipShow(false)
    }} />

    const BoostModal = <BoostJust onBoost={() => {
        setBoostShow(false)
    }} />

    // const showVip = useCallback(() => {
    //     const vipHandler = Modal.show({
    //         content: BoostVipModal,
    //         closeOnMaskClick: true,
    //     })
    // }, [address])

    // const showBoostJust = useCallback(() => {
    //     const vipHandler = Modal.show({
    //         content: <BoostJust onBoost={() => {
    //             vipHandler.close()
    //         }} />,
    //         closeOnMaskClick: true,
    //     })
    // }, [])

    return <div onClick={() => {
        setBoostVipShow(true)
        // const initHandler = Modal.show({
        //     content: <BoostInit onJoinVip={() => {
        //         initHandler.close()
        //         showVip()

        //     }} onCanceVip={() => {
        //         showBoostJust()
        //         initHandler.close()
        //     }} />,
        //     closeOnMaskClick: true,
        // })
        onClick()
    }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.4" cx="24" cy="24" r="24" fill="black" />
            <path d="M26.2085 13.7368C26.7914 13.8508 27.1659 14.3936 27.0424 14.9472L25.4857 21.9925L30.0805 23.2613C30.1991 23.2937 30.3113 23.3455 30.4124 23.4146C30.5262 23.4902 30.6231 23.5879 30.6972 23.7018C30.7714 23.8158 30.8212 23.9435 30.8437 24.0772C30.8662 24.2108 30.8608 24.3476 30.8279 24.4792C30.7951 24.6107 30.7353 24.7343 30.6525 24.8422L22.8878 35.0058C22.7615 35.1671 22.592 35.2901 22.3985 35.3609C22.205 35.4317 21.9953 35.4473 21.7933 35.4061C21.2104 35.2907 20.8359 34.7493 20.958 34.1957L22.5148 27.149L17.9199 25.8802C17.8006 25.8477 17.6881 25.7947 17.588 25.7269C17.4743 25.6513 17.3773 25.5536 17.3032 25.4397C17.229 25.3257 17.1792 25.198 17.1567 25.0644C17.1342 24.9307 17.1396 24.7939 17.1725 24.6623C17.2054 24.5308 17.2651 24.4073 17.3479 24.2994L25.1139 14.1371C25.2403 13.9758 25.4098 13.8527 25.6033 13.782C25.7968 13.7112 26.0065 13.6956 26.2085 13.7368Z" fill="#00FFEE" />
        </svg>

        <Modal
            visible={vipShow}
            content={BoostVipModal}
            closeOnAction
            closeOnMaskClick
            onClose={() => {
                setVipShow(false)
            }}
        />

        <Modal
            visible={boostVipShow}
            content={VipModal}
            closeOnAction
            closeOnMaskClick
            onClose={() => {
                setBoostVipShow(false)
            }}
        />

        <Modal
            visible={boostShow}
            content={BoostModal}
            closeOnMaskClick
            closeOnAction
            onClose={() => {
                setBoostShow(false)
            }}
        />
    </div>
}
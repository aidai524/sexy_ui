import { useState } from 'react'
import ActionList from './actionList'
import styles from './index.module.css'
import type { Project } from "@/app/type"
import { Popup } from "antd-mobile";

interface Props {
    token: Project;
    prepaidWithdrawDelayTime: number;
}

export default function TokenAction({
    token,
    prepaidWithdrawDelayTime,
}: Props) {
    const [modalShow, setModalShow] = useState(false)

    return <div className={styles.main}>
        <div onClick={() => { setModalShow(true) }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13.5" stroke="white" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.75 14C9.75 14.9665 8.9665 15.75 8 15.75C7.0335 15.75 6.25 14.9665 6.25 14C6.25 13.0335 7.0335 12.25 8 12.25C8.9665 12.25 9.75 13.0335 9.75 14ZM15.75 14C15.75 14.9665 14.9665 15.75 14 15.75C13.0335 15.75 12.25 14.9665 12.25 14C12.25 13.0335 13.0335 12.25 14 12.25C14.9665 12.25 15.75 13.0335 15.75 14ZM20 15.75C20.9665 15.75 21.75 14.9665 21.75 14C21.75 13.0335 20.9665 12.25 20 12.25C19.0335 12.25 18.25 13.0335 18.25 14C18.25 14.9665 19.0335 15.75 20 15.75Z" fill="white" />
            </svg>
        </div>

        <Popup
            visible={modalShow}
            onMaskClick={() => {
                setModalShow(false)
            }}
            onClose={() => {
                setModalShow(false)
            }}
            bodyStyle={{
                borderTopLeftRadius: "30px",
                borderTopRightRadius: "30px",
                paddingTop: 0,
                paddingBottom: 0
                // height: '50vh'
            }}
        >
            <ActionList token={token} prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}/>
        </Popup>
    </div>
}
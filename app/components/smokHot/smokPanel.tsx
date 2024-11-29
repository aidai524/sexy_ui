import { Popup, } from 'antd-mobile'
import { useState } from 'react'

import styles from './smokeHot.module.css'
import Trade from './trade';

interface Props {
    show: boolean;
    onHide?: () => void;
}

export default function SmokPanel({ show, onHide }: Props) {

    return <div>
        <Popup
            visible={show}
            onMaskClick={() => {
                onHide && onHide()
            }}
            onClose={() => {
                onHide && onHide()
            }}
            bodyStyle={{ 
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                height: '67vh' 
            }}
        >
            <div className={ styles.main }>
                <div className={ styles.smokeLogo }>
                    <img className={ styles.smokeImg } src="/img/home/smokeHotLogo.svg" />
                </div>

                <Trade />
            </div>
        </Popup>
    </div>
}
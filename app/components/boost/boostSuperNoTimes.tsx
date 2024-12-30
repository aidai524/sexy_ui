import { useVip } from '@/app/hooks/useVip';
import styles from './boost.module.css'
import { BoostIcon, SuperLikeIcon } from './boostIocn'
import { fail, success } from '@/app/utils/toast';
import MainBtn from '../mainBtn';
import { useState } from 'react';
import { httpAuthPost } from '@/app/utils';
import type { Project } from '@/app/type';

interface Props {
    onClose: () => void;
    num?: number | undefined;
    usingNum?: number | undefined;
    token: Project;
    type: number;
}

export default function boostSuperNoTimes({
    onClose, num, usingNum, token, type
}: Props) {
    const text = (type === 1 ? 'Boost' : 'Flip')
    return <div className={styles.panel}>
        <div className={styles.boostInit}>
            <div className={styles.initTipContent}>
                {
                    type === 1 ? <BoostIcon /> : <SuperLikeIcon />
                }
                <div className={styles.initTitle}>{ text }</div>
                <div className={styles.initAmount}>{ usingNum }/{ num }</div>
                <div className={styles.initTip}>Your { text } opportunities have run out for today, so try again tomorrow!</div>
            </div>
        </div>

        <MainBtn onClick={async () => {
            onClose && onClose()
        }} style={{ marginTop: 10 }} >Okay</MainBtn>
    </div> 
}
'use client'

import styles from './action.module.css'
import MainAction from '@/app/components/MainAction'
import Boost from '@/app/components/boost'
import SmokeBtn from '../smokHot';

interface Props {
    style?: any;
    onLike?: () => void;
    onSuperLike?: () => void;
    onHate?: () => void;
    onBoost?: () => void;
}

export default function Action({
    style,
    onLike,
    onSuperLike,
    onHate,
    onBoost,
}: Props) {
    return <div className={styles.action} style={style}>
        <div>
            <Boost onClick={() => {
                onBoost && onBoost()
            }} />
        </div>
        <MainAction onLike={() => {
            onLike && onLike()
        }} onHate={() => {
            onHate && onHate()
        }} />
        <div>
            <SmokeBtn onClick={() => {
                onSuperLike && onSuperLike()
            }}/>
        </div>
    </div>
}

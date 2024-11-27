import { memo } from 'react';
import styles from './checkBox.module.css'

interface Props {
    checked?: boolean;
    onCheckChange?: (v: boolean) => void;
}

export default function CheckBox({
    checked,
    onCheckChange,
}: Props) {

    return <>
        {
            checked
                ? <div onClick={() => {
                    onCheckChange && onCheckChange(false)
                }} className={styles.wrapper + ' ' + styles.checked}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 3.30769L3.8 6L9 1" stroke="white" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </div>
                : <div onClick={() => {
                    onCheckChange && onCheckChange(true)
                }} className={styles.wrapper}></div>
        }
    </>
}
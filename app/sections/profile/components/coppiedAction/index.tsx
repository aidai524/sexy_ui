import React from 'react'
import styles from './index.module.css';
import Modal from '@/app/components/modal';

export default function CoppiedAction({show,onClose}:any) {
  return (
    <Modal 
        open={show}
        onClose={onClose}
        animation="popup"
        closeStyle={{ display: "none" }}
    >
        <div className={styles.main}>111111</div>
    </Modal>
  )
}

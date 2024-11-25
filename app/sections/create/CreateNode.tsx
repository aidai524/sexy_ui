import type { ImageUploadItem } from 'antd-mobile'
import styles from './create.module.css'
import { useState } from 'react'
import Upload from '@/app/components/upload'
import Link from './components/link'
import MainBtn from '@/app/components/mainBtn'


export default function CreateNode() {
    const [fileList, setFileList] = useState<ImageUploadItem[]>([

    ])

    return <div className={styles.create}>
        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Name
            </div>
            <div className={styles.groupContent}>
                <input className={styles.inputText} placeholder='say something' />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Ticker
            </div>
            <div className={styles.groupContent}>
                <input className={styles.inputText} placeholder='say something' />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Token Icon
            </div>
            <div className={styles.groupContent} style={{ paddingLeft: 15, paddingTop: 10 }}>
                <Upload fileList={fileList} setFileList={setFileList} />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Image or Video
            </div>
            <div className={styles.groupContent} style={{ paddingLeft: 15, paddingTop: 10 }}>
                <Upload fileList={fileList} setFileList={setFileList} />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Description
            </div>
            <div className={styles.groupContent}>
                <input className={styles.inputText} placeholder='say something' />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                Project white paper
            </div>
            <div className={styles.groupContent}>
                <input className={styles.inputText} placeholder='say something' />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Community
            </div>
            <div className={styles.groupContent}>
                <Link type='Twitter' img="/img/community/x.svg" />
            </div>

            <div className={styles.groupContent}>
                <Link type='Telegram' img="/img/community/telegram.svg" />
            </div>

            <div className={styles.groupContent}>
                <Link type='Discord' img="/img/community/discard.svg" />
            </div>
        </div>
        
        <div className={ styles.btnWapper }>
            <MainBtn>Preview</MainBtn>
        </div>
    </div>
}
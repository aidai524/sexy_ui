import Back from '@/app/components/back'
import styles from './edit.module.css'
import Upload from '@/app/components/upload'
import { useState } from 'react'
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import { useRouter } from 'next/navigation'

export default function ProfileEdit() {
    const router = useRouter()

    const [fileList, setFileList] = useState<ImageUploadItem[]>([

    ])

    return <div className={ styles.main }>
        <div className={ styles.header }>
            <Back />
            <div className={ styles.headerTitle }>Edit Profile</div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Username
            </div>
            <div className={styles.groupContent}>
                <input className={styles.inputText} placeholder='say something' />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Profile Photo
            </div>
            <div className={styles.groupContent} style={{ paddingLeft: 15, paddingTop: 10 }}>
                <Upload fileList={fileList} setFileList={setFileList} />
            </div>
        </div>

        <div className={styles.group}>
            <div className={styles.groupTitle}>
                <span className={styles.require}>*</span>Head Banner
            </div>
            <div className={styles.groupContent} style={{ paddingLeft: 15, paddingTop: 10, height: 174, overflow: 'hidden' }}>
                <Upload fileList={fileList} setFileList={setFileList} >
                    <div className={ styles.bannerBgContent }>
                        <div className={ styles.bgImg }>
                            <img className={ styles.bgImgPreview } src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                        </div>
                        <div className={ styles.changeBtn }>Change</div>
                    </div>
                </Upload>
            </div>
        </div>

        <div className={ styles.actionBtns }>
            <div onClick={() => {
                router.back()
            }} className={ styles.cancel + ' ' + styles.btn }>Cancel</div>
            <div className={ styles.save + ' ' + styles.btn }>Save</div>
        </div>
    </div>
}
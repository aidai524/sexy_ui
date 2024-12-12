import { ImageUploader, ImageUploadItem, ImageUploaderRef } from 'antd-mobile'
import { CloseCircleFill, CloseShieldOutline } from 'antd-mobile-icons'

import styles from './upload.module.css'
import { upload } from '@/app/utils';
import { useCallback, useMemo, useRef, useState } from 'react';

interface Props {
    fileList: ImageUploadItem[];
    setFileList: any;
    children?: React.ReactNode;
    accept?: string;

}

// export async function mockUpload(file: File): Promise<ImageUploadItem> {
//     console.log('file:', file)
//     const url = await upload(file.name, file)

//     if (url) {
//         return {
//             url,
//         }
//     }

//     return {
//         url: '',
//     }
// }

export const imgReg = /(.+\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif))$/i
export const videoReg = /(.+\.(mp4))$/i

export default function Upload({
    fileList,
    setFileList,
    accept = 'image/*',
    children,
}: Props) {
    const [isUplaod, setIsUpload] = useState(false)
    const input = useRef<ImageUploaderRef>(null)

    const uploadImg = useCallback(async (file: File) => {

        setIsUpload(true)
        const url = await upload(file.name, file, imgReg.test(file.name))
        setIsUpload(false)

        if (url) {
            return {
                url,
            }
        }

        return {
            url: '',
        }
    }, [])

    const fileType = useMemo<'image' | 'video' | undefined>(() => {
        if (fileList && fileList.length) {
            const url = fileList[0].url
            if (imgReg.test(url)) {
                return 'image'
            } else if (videoReg.test(url)) {
                return 'video'
            }
        }
    }, [fileList])

    return <div className={styles.main}>
        <div className={styles.uploadBox}>
            <ImageUploader ref={input} accept={accept} maxCount={1} value={fileList} onChange={setFileList} upload={uploadImg}>

            </ImageUploader>
        </div>


        <div style={{ position: 'relative' }}>
            {
                fileList.length === 0
                    ? <div className={styles.imgUpload} onClick={() => {
                        const nativeInput = input.current?.nativeElement
                        if (nativeInput) {
                            nativeInput.click()
                        }
                    }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M25 3H3L3 22.6667L14.4258 13.1452C15.9152 11.904 18.0802 11.9096 19.5631 13.1584L25 17.7368V3ZM3 0C1.34315 0 0 1.34315 0 3V25C0 26.6569 1.34315 28 3 28H25C26.6569 28 28 26.6569 28 25V3C28 1.34315 26.6569 0 25 0H3ZM7.5 11C8.88071 11 10 9.88071 10 8.5C10 7.11929 8.88071 6 7.5 6C6.11929 6 5 7.11929 5 8.5C5 9.88071 6.11929 11 7.5 11Z" fill="#9290B1" fill-opacity="0.6" />
                        </svg>
                    </div>
                    : <div className={styles.preview}>
                        {
                            fileType === 'image' && <img className={styles.imgPreview} src={fileList[0].url} />
                        }
                        {
                            fileType === 'video' && <video className={styles.imgPreview} controls>
                                <source src={fileList[0].url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        }
                        <div className={styles.close} onClick={() => {
                            setFileList([])
                        }}>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 11L21 21" stroke="#888197" stroke-width="2" stroke-linecap="round" />
                                <path d="M21 11L11 21" stroke="#888197" stroke-width="2" stroke-linecap="round" />
                                <circle cx="16" cy="16" r="15.25" stroke="#888197" stroke-width="1.5" />
                            </svg>
                        </div>
                    </div>
            }

            {
                isUplaod && <div className={styles.loadingBox}>
                    <div className={styles.loader}></div>
                </div>
            }
        </div>
    </div>
}
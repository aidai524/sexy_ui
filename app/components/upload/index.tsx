import { ImageUploader, ImageUploadItem } from 'antd-mobile'

import styles from './upload.module.css'

interface Props {
    fileList: ImageUploadItem[];
    setFileList: any;
    children?: React.ReactNode;

}

export async function mockUpload(file: File) {
    return {
        url: URL.createObjectURL(file),
    }
}

export default function Upload({
    fileList,
    setFileList,
    children,
}: Props) {
    return <ImageUploader value={fileList} onChange={setFileList} upload={mockUpload}>
    {
        fileList.length === 0 ? (children ? children : <div
            className={styles.imgUpload}
        >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M25 3H3L3 22.6667L14.4258 13.1452C15.9152 11.904 18.0802 11.9096 19.5631 13.1584L25 17.7368V3ZM3 0C1.34315 0 0 1.34315 0 3V25C0 26.6569 1.34315 28 3 28H25C26.6569 28 28 26.6569 28 25V3C28 1.34315 26.6569 0 25 0H3ZM7.5 11C8.88071 11 10 9.88071 10 8.5C10 7.11929 8.88071 6 7.5 6C6.11929 6 5 7.11929 5 8.5C5 9.88071 6.11929 11 7.5 11Z" fill="#9290B1" fill-opacity="0.6" />
            </svg>
        </div>) : <div></div>
    }
</ImageUploader>
}
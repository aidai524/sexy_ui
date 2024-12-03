import InfoPart from "../detail/components/info/infoPart";
import styles from './preview.module.css'
import Create from "./components/create";


import type { Project } from "@/app/type";
import { useState } from "react";
interface Props {
    onAddDataCancel: () => void;
    show: boolean;
    data: Project;
}

export default function PreviewNode({
    onAddDataCancel, show, data
}: Props) {
    const [showCreate, setShowCreate] = useState(false)

    return <div className={ styles.mainContent } style={{ display: show ? 'block' : 'none' }}>
        <div className={ styles.main }>
            <InfoPart showThumbnailHead={true} showThumbnailProgress={false} data={data}/>
        </div>

        <div className={ styles.actionBtns }>
            <div onClick={() => {
                onAddDataCancel()
            }} className={ styles.btn + ' ' + styles.edit }>Edit</div>
            <div onClick={() => {
                setShowCreate(true)
            }} className={ styles.btn + ' ' + styles.create }>Create</div>
        </div>

        <Create show={showCreate} token={{
            tokenName: 'Cpu',
            tokenSymbol: 'CPU',
            tokenDecimals: 2,
            tokenUri: 'https://pump.mypinata.cloud/ipfs/QmS3C8tTmeUu3qnJW1vzDXaCqaZsxLAfsieDms7hfyVvjB?img-width=800&img-dpr=2&img-onerror=redirect'
        }} onHide={() => { setShowCreate(false) }}/>
    </div>
}
import InfoPart from "../detail/components/info/infoPart";
import styles from './preview.module.css'

import type { Project } from "@/app/type";
interface Props {
    onAddDataCancel: () => void;
    show: boolean;
    data: Project;
}

export default function PreviewNode({
    onAddDataCancel, show, data
}: Props) {
    return <div className={ styles.mainContent } style={{ display: show ? 'block' : 'none' }}>
        <div className={ styles.main }>
            <InfoPart showThumbnailHead={true} showThumbnailProgress={false} data={data}/>
        </div>

        <div className={ styles.actionBtns }>
            <div onClick={() => {
                onAddDataCancel()
            }} className={ styles.btn + ' ' + styles.edit }>Edit</div>
            <div className={ styles.btn + ' ' + styles.create }>Create</div>
        </div>
    </div>
}
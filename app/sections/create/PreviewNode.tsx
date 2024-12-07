import InfoPart from "../detail/components/info/infoPart";
import styles from './preview.module.css'
import Create from "./components/create";


import type { Project } from "@/app/type";
import { useState } from "react";
import { httpAuthPost, sleep } from "@/app/utils";
interface Props {
    onAddDataCancel: () => void;
    show: boolean;
    data: Project;
}

export default function PreviewNode({
    onAddDataCancel, show, data
}: Props) {
    const [showCreate, setShowCreate] = useState(false)

    return <div className={styles.mainContent} style={{ display: show ? 'block' : 'none' }}>
        <div className={styles.main}>
            <InfoPart showBackIcon={false} showThumbnailHead={true} showThumbnailProgress={false} data={data} />
        </div>

        <div className={styles.actionBtns}>
            <div onClick={() => {
                onAddDataCancel()
            }} className={styles.btn + ' ' + styles.edit}>Edit</div>
            <div onClick={() => {
                setShowCreate(true)
            }} className={styles.btn + ' ' + styles.create}>Create</div>
        </div>

        <Create
            show={showCreate}
            token={{
                tokenName: data.tokenName,
                tokenSymbol: data.tokenName.toUpperCase(),
                tokenDecimals: 2,
                tokenUri: data.tokenImg,
            }}
            data={data}
            onHide={() => { setShowCreate(false) }}
            onCreateTokenSuccess={async () => {
                const query: any  = {
                    about_us: data.about,
                    discord: data.discord,
                    icon: data.tokenImg,
                    // icon: 'http://localhost:3000/create',
                    tg: '',
                    ticker: data.ticker,
                    token_name: data.tokenName,
                    token_symbol: data.tokenName.toUpperCase(),
                    video: data.tokenImg,
                    // video: 'http://localhost:3000/create',
                    website: data.website,
                    x: data.twitter
                }

                const queryStr = Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&')

                let times = 0
                while (true && times < 10) {
                    const val = await httpAuthPost(`/project?${queryStr}`, {})
                    if (val.code === 100000) {
                        times++
                        sleep(500)
                    } else {
                        break
                    }
                }
                // const _data = {token_symbol: 'NAME', "about_us":"sd","discord":"http://localhost:3000/create","icon":"blob:http://localhost:3000/158258b6-21e6-42ec-b4b3-119ff2be3aa4","tg":"","ticker":"Me","token_name":"Name","video":"blob:http://localhost:3000/158258b6-21e6-42ec-b4b3-119ff2be3aa4","website":"http://localhost:3000/create","x":"http://localhost:3000/create"}

                // const val = await httpAuthPost('/project', _data)

                // console.log(val)
            }}
        />
    </div>
}
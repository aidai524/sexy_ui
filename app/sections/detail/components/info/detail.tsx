import Thumbnail, { AvatarBack } from '@/app/components/thumbnail'
import CommentComp from '@/app/components/comment'
import Panel from '../../../../components/panel'


import styles from './detail.module.css'
import Action from '@/app/components/action'
import { Button } from 'antd-mobile'
import { useTokenTrade } from '@/app/hooks/useTokenTrade'
import InfoPart from './infoPart'
import { useEffect, useState } from 'react'
import type { Comment, Project } from '@/app/type'
import { httpAuthPost, httpGet } from '@/app/utils'

interface Props {
    data: Project
}

export default function Info({
    data
}: Props) {
    return <div className={styles.main}>
        <InfoPart data={data} showThumbnailHead={false} />
        <CommentComp id={data.id} />

        <div className={styles.action}>
            <Action
                token={data}
                style={{ position: 'static' }}
                onLike={async () => {
                    await httpAuthPost('/project/like?id=' + data!.id, {})

                }}
                onHate={async () => {
                    await httpAuthPost('/project/un_like?id=' + data!.id, {})
                }}
                onSuperLike={() => { }}
                onBoost={() => { }} />
        </div>

    </div>
}

function Sep() {
    return <div style={{ height: 10 }}></div>
}
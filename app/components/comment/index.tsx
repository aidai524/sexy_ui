import { useEffect, useState } from 'react'
import Panel from '../panel'
import styles from './comment.module.css'

import type { Comment, Project } from '@/app/type'
import { formatAddress, formatDateTime, httpGet, httpAuthPost } from '@/app/utils'

interface Props {
    id: number | undefined
}

export default function CommentComp({
    id
}: Props) {
    const [commentList, setCommentList] = useState<Comment[]>([])
    const [commentText, setCommentText] = useState('')
    const [reReashNum, setReReashNum] = useState(1)

    useEffect(() => {
        if (id) {
            httpGet('/project/comment/list', { limit: 20, project_id: id }).then(res => {
                if (res?.code === 0 && res.data.list?.length) {
                    const commentList = res.data.list.map((item: any) => {
                        return mapDataToComment(item)
                    })
                    setCommentList(commentList)
                }
            })
        } else {
            setCommentList([])
        }
    }, [id, reReashNum])

    return <div className={styles.main}>
        <div className={styles.title}>discussion</div>
        <input value={commentText} onKeyUp={async (e) => {
            if (e.code === 'Enter') {
                const query: any = {
                    project_id: id,
                    text: commentText
                }
                const queryStr = Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&')
                const val = await httpAuthPost('/project/comment?' + queryStr)


                if (val.code === 0) {
                    setReReashNum(reReashNum + 1)
                    setCommentText('')
                }
            }
        }} onChange={(e) => {
            // console.log(e)
            setCommentText(e.target.value)
        }} className={styles.input} placeholder='Say something...' />

        {
            commentList.length && <Panel>
                {
                    commentList.map(item => {
                        return <div key={item.id} className={styles.comment}>
                            <div className={styles.replyer}>
                                <div className={styles.person}>
                                    <div className={styles.avtar}>

                                    </div>
                                    <div className={styles.name}>{formatAddress(item.address)}</div>
                                    <div className={styles.time}>{formatDateTime(item.time)}</div>
                                </div>

                                {/* <div className={styles.relayBtn}>Reply</div> */}
                            </div>
                            <div className={styles.relayText}>{item.text}</div>

                            <div className={styles.commentAction}>
                                <div onClick={async () => {
                                    const val = await httpAuthPost('/project/comment/like?id=' + item.id)
                                    if (val.code === 0) {
                                        setReReashNum(reReashNum + 1)
                                    }
                                }} className={styles.zan}>
                                    <div>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1655 6.40869H14.4261C14.4261 6.40869 15.4967 6.31979 15.4967 7.43242C15.4967 7.43242 15.4967 9.03475 13.9129 14.42C13.9129 14.42 13.4223 16 12.8199 16H6.41836C5.97214 16 4.83464 15.6994 4.83464 14.8647V6.40869C4.83464 6.40869 8.00179 4.07215 8.00179 1.09031C8.02017 1.05827 8.02441 0.9933 8.02982 0.910295C8.05074 0.589675 8.08921 0 9.02801 0C9.02801 0 11.8164 0.311415 10.1655 6.40869ZM0.534994 6.4115H3.08621C3.08621 6.4115 3.73464 6.40322 3.73464 7.05821V15.6409C3.73464 15.6409 3.73871 16 3.2787 16H1.07061C1.07061 16 0.526875 16 0.526875 15.4572L0 6.929C0 6.929 0.0081184 6.4115 0.534994 6.4115Z" fill="#515B63" />
                                        </svg>
                                    </div>
                                    <div>{item.like}</div>
                                </div>

                                <div onClick={async () => {
                                    const val = await httpAuthPost('/project/comment/un_like?id=' + item.id)
                                    if (val.code === 0) {
                                        setReReashNum(reReashNum + 1)
                                    }
                                }} className={styles.zan}>
                                    <div>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1655 9.59131H14.4261C14.4261 9.59131 15.4967 9.68021 15.4967 8.56758C15.4967 8.56758 15.4967 6.96525 13.9129 1.58C13.9129 1.58 13.4223 2.00272e-05 12.8199 2.00272e-05H6.41836C5.97214 2.00272e-05 4.83464 0.300641 4.83464 1.13532V9.59131C4.83464 9.59131 8.00179 11.9279 8.00179 14.9097C8.02017 14.9417 8.02441 15.0067 8.02982 15.0897C8.05074 15.4103 8.08921 16 9.02801 16C9.02801 16 11.8164 15.6886 10.1655 9.59131ZM0.534994 9.5885H3.08621C3.08621 9.5885 3.73464 9.59678 3.73464 8.94179V0.359091C3.73464 0.359091 3.73871 2.86102e-05 3.2787 2.86102e-05H1.07061C1.07061 2.86102e-05 0.526875 2.95639e-05 0.526875 0.54283L0 9.071C0 9.071 0.0081184 9.5885 0.534994 9.5885Z" fill="#515B63" />
                                        </svg>
                                    </div>
                                    <div>{item.unLike}</div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </Panel>
        }

    </div>
}

function mapDataToComment(data: any): Comment {
    return {
        address: data.address,
        projectId: data.project_id,
        text: data.text,
        id: data.id,
        isLike: data.is_like,
        isUnlike: data.is_unlike,
        like: data.like,
        unLike: data.un_like,
        time: data.time,
    }
}
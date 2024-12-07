import Back from '@/app/components/back'
import styles from './follower.module.css'
import Tab from '../components/tab'
import FollowerList from './component/followerList'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { httpGet, httpAuthGet } from '@/app/utils'

export default function Follower() {
    const params = useSearchParams()

    useEffect(() => {
        const id = params.get('id')
        if (id) {
            httpAuthGet('/project/follower/list', {
                address: id,
                limit: 9999,
            }).then(res => {
                console.log(res)
            })
        }
    }, [params])

    return <div className={ styles.main }>
        <div className={ styles.header }>
            <Back/>
            <div>rSopT53</div>
        </div>

        <Tab nodes={[
            {
                name: '12 Followers',
                content: <FollowerList />
            },
            {
                name: '12 Following',
                content: <FollowerList />
            }
        ]}/>
    </div>
}
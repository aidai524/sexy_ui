import Back from '@/app/components/back'
import styles from './follower.module.css'
import Tab from '../components/tab'
import FollowList from './component/followList'

export default function Follower() {
    return <div className={ styles.main }>
        <div className={ styles.header }>
            <Back/>
            <div>rSopT53</div>
        </div>

        <Tab nodes={[
            {
                name: '12 Followers',
                content: <FollowList />
            },
            {
                name: '12 Following',
                content: <FollowList />
            }
        ]}/>
    </div>
}
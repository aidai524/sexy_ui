import Back from '@/app/components/back'
import styles from './follower.module.css'
import Tab from '../components/tab'
import FollowerList from './component/followerList'

export default function Follower() {
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
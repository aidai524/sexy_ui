'use client'

import { TabBar } from 'antd-mobile'
import { useRouter, usePathname } from 'next/navigation'
import {
  AppOutline,
  UserOutline,
  AddCircleOutline,
  UnorderedListOutline
} from 'antd-mobile-icons'
import ConnectButton from './ConnectButton'
import styles from './layout.module.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    {
      key: '/',
      title: 'Home',
      icon: <AppOutline />,
    },
    {
      key: '/create',
      title: 'Create',
      icon: <AddCircleOutline />,
    },
    {
      key: '/list',
      title: 'List',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/profile',
      title: 'Profile',
      icon: <UserOutline />,
    },
  ]

  return (
    <div className="app-container">
      <div className={styles.walletButton}>
        <ConnectButton />
      </div>
      {children}
      <TabBar
        activeKey={pathname}
        onChange={value => router.push(value)}
      >
        {tabs.map(item => (
          <TabBar.Item
            key={item.key}
            icon={item.icon}
            title={item.title}
          />
        ))}
      </TabBar>
    </div>
  )
} 
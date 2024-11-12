'use client'

import { TabBar } from 'antd-mobile'
import { useRouter, usePathname } from 'next/navigation'
import {
  AppOutline,
  ContentOutline,
  AddSquareOutline,
  MessageOutline,
  UserOutline
} from 'antd-mobile-icons'
import ConnectButton from './ConnectButton'
import styles from './layout.module.css'

export default function Component({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    {
      key: '/',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/discover',
      title: '发现',
      icon: <ContentOutline />,
    },
    {
      key: '/create',
      title: '创建',
      icon: <AddSquareOutline />,
    },
    {
      key: '/message',
      title: '消息',
      icon: <MessageOutline />,
    },
    {
      key: '/profile',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className={styles.walletButton}>
        <ConnectButton />
      </div>
      <main className="pb-16">{children}</main>
      <TabBar className={styles.tabBar} activeKey={pathname} onChange={key => router.push(key)}>
        {tabs.map(item => (
          <TabBar.Item
            key={item.key}
            icon={item.icon}
            title={item.title}
            className={pathname === item.key ? styles.activeTab : ''}
          />
        ))}
      </TabBar>
    </div>
  )
}
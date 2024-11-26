'use client'

import { TabBar } from 'antd-mobile'
import { useRouter, usePathname } from 'next/navigation'
import { Provider, SolanaAdapter, useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import {
  AppOutline,
  ContentOutline,
  AddSquareOutline,
  MessageOutline,
  UserOutline
} from 'antd-mobile-icons'
import styles from './layout.module.css'
import { useCallback, useEffect, useMemo } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { bufferToBase64, getAuthorization, getAuthorizationByLocal, httpGet, initAuthorization } from '@/app/utils'



function CustomIcon({
  url
}: {
  url: string;
}) {
  return <img className={styles.tabIcon} src={url} />
}

const tabs = [
  {
    key: '/',
    icon: <CustomIcon url="/img/tabs/tab1.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab1-active.svg" />,
    
  },
  {
    key: '/create',
    icon: <CustomIcon url="/img/tabs/tab3.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab3-active.svg" />,
  },
  {
    key: '/discover',
    icon: <CustomIcon url="/img/tabs/tab2.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab2-active.svg" />,
  },
  {
    key: '/profile',
    icon: <CustomIcon url="/img/tabs/tab4.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab4-active.svg" />,
  },
]

export default function Component({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider<Provider>('solana')

  const showTabs = useMemo(() => {
    return tabs.find((tab) => {
      return pathname.indexOf(tab.key) === 0 
    })
  }, [pathname])


  const initToken = useCallback(async () => {
    const auth = getAuthorizationByLocal()
    if (!auth) {
      initAuthorization(walletProvider, address as string)
    }
  }, [address])

  useEffect(() => {
    if (!address) {
      return
    }

    initToken()
  }, [address])

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pb-16">{children}</main>

      {
        showTabs && <TabBar className={styles.tabBar} activeKey={pathname} onChange={key => router.push(key)}>
          {tabs.map(item => (
            <TabBar.Item
              key={item.key}
              icon={pathname === item.key ? item.iconActive : item.icon}
              className={pathname === item.key ? styles.activeTab : ''}
            />
          ))}
        </TabBar>
      }
    </div>
  )
}



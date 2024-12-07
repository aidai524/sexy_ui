'use client'

import { TabBar } from 'antd-mobile'
import { useRouter, usePathname } from 'next/navigation'
import styles from './layout.module.css'
import { useCallback, useEffect, useMemo } from 'react'
import { bufferToBase64, getAuthorization, getAuthorizationByLocal, getAuthorizationByLocalAndServer, httpGet, initAuthorization } from '@/app/utils'
import { useMessage } from '@/app/context/messageContext'
import { useAccount } from '@/app/hooks/useAccount';

function CustomIcon({
  url,
  showPlus = false,
}: {
  url: string;
  showPlus?: boolean;
}) {
  const { likeTrigger } = useMessage()

  return <div className={ styles.tabIconWapper }>
    <img className={styles.tabIcon} src={url} />
    {
      showPlus && <div className={ styles.showPlus + ' ' + (likeTrigger ? styles.ani : '' ) }>+1</div>
    }
  </div>
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
    key: '/mining',
    icon: <CustomIcon showPlus={true} url="/img/tabs/tab2.svg" />,
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
  const { address, walletProvider } = useAccount();

  const showTabs = useMemo(() => {
    return tabs.find((tab) => {
      if (tab.key === '/') {
        return pathname === tab.key
      }
      return pathname.indexOf(tab.key) === 0 
    })
  }, [pathname])


  const initToken = useCallback(async () => {
    const auth = await getAuthorizationByLocalAndServer()
    if (!auth) {
      
      initAuthorization()
    }
  }, [address])

  useEffect(() => {
    if (!address) {
      return
    }

    // @ts-ignore
    window.walletProvider = walletProvider
    // @ts-ignore
    window.sexAddress = address

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



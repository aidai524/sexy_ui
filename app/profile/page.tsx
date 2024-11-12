'use client'
import React from 'react'
import { Avatar, Card } from 'antd-mobile'
import Image from 'next/image'
import styles from './profile.module.css'
import ConnectButton from '../components/ConnectButton'
import { useAppKit } from '@reown/appkit/react'

// 模拟用户数据
const userData = {
  name: '用户名称',
  avatar: 'https://picsum.photos/100/100?random=1',
  likedItems: [
    {
      id: '1',
      image: 'https://picsum.photos/300/500?random=2',
      title: '艾米丽',
      description: '喜欢旅行和摄影的设计师'
    },
    {
      id: '2',
      image: 'https://picsum.photos/300/500?random=3',
      title: '杰克',
      description: '热爱音乐的吉他手'
    },
    // 可以添加更多喜欢的项目
  ]
}

export default function Profile() {
  const appKit = useAppKit()
  const isConnected = Boolean(appKit.address)

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <div className={styles.connectPrompt}>
          <h2>请先连接钱包</h2>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 用户信息区域 */}
      <div className={styles.userInfo}>
        <Avatar
          src={userData.avatar}
          className={styles.avatar}
        />
        <h2 className={styles.userName}>{userData.name}</h2>
      </div>

      {/* 喜欢的内容列表 */}
      <div className={styles.likedContent}>
        <h3 className={styles.sectionTitle}>喜欢的内容</h3>
        <div className={styles.cardList}>
          {userData.likedItems.map(item => (
            <Card key={item.id} className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 
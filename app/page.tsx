'use client'
import React from 'react'
import { Toast } from 'antd-mobile'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from './pages/home/page.module.css'

// 预加载图片的函数
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve()
    img.onerror = () => reject()
  })
}

// 模拟数据
const items = [
  {
    id: '1',
    image: 'https://picsum.photos/300/500?random=1',
    title: '艾米丽',
    description: '喜欢旅行和摄影的设计师，总是能发现生活中的美'
  },
  {
    id: '2', 
    image: 'https://picsum.photos/300/500?random=2',
    title: '杰克',
    description: '热爱音乐的吉他手，擅长创作民谣'
  },
  // ... 其他数据
]

export default function Home() {
  const [cards, setCards] = useState([...items])
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // 添加事件处理函数
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return
    setIsDragging(true)
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isAnimating) return
    
    const touchX = e.touches[0].clientX
    const deltaX = touchX - touchStartX.current
    setDragX(deltaX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating) return
    
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const isLike = deltaX > 0
      
      Toast.show({
        content: isLike ? '喜欢' : '不喜欢',
        position: 'center',
      })

      setIsAnimating(true)

      setTimeout(() => {
        setCards(prevCards => prevCards.slice(1))
        setIsAnimating(false)
      }, 500)
    }

    setIsDragging(false)
    setDragX(0)
  }

  // 预加载下一批图片
  const currentCard = cards[0]
  useEffect(() => {
    const preloadNextImages = async () => {
      if (cards.length > 1) {
        const nextFiveImages = cards
          .slice(1, 6)
          .map(card => card.image)
        
        try {
          await Promise.all(nextFiveImages.map(src => preloadImage(src)))
        } catch (error) {
          console.log('Image preload error:', error)
        }
      }
    }

    preloadNextImages()
  }, [currentCard, cards])

  if (cards.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.endMessage}>
          没有更多卡片了
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      {/* 当前卡片 */}
      <div 
        className={`${styles.cardContainer} ${dragX > 50 ? styles.swipeRight : dragX < -50 ? styles.swipeLeft : ''}`}
        style={{
          transform: isDragging ? `rotate(${dragX * 0.1}deg) translateX(${dragX}px)` : 'none',
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          zIndex: 2,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image 
          src={cards[0].image} 
          alt={cards[0].title}
          fill
          style={{ objectFit: 'cover' }}
          className={styles.cardImage} 
        />
        <div className={styles.cardContent}>
          <h2>{cards[0].title}</h2>
          <p>{cards[0].description}</p>
        </div>
      </div>

      {/* 预加载下一张卡片 */}
      {cards.length > 1 && (
        <div 
          className={styles.cardContainer}
          style={{ 
            position: 'absolute',
            zIndex: 1,
          }}
        >
          <Image 
            src={cards[1].image} 
            alt={cards[1].title}
            fill
            style={{ objectFit: 'cover' }}
            className={styles.cardImage} 
          />
          <div className={styles.cardContent}>
            <h2>{cards[1].title}</h2>
            <p>{cards[1].description}</p>
          </div>
        </div>
      )}
    </main>
  )
} 
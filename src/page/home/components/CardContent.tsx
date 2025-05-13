'use client'
import Image from 'next/image'
import { useRef, memo } from 'react'
import styles from '@/styles/home/invocation.module.css';
import { useTranslations } from 'next-intl';
import useIntersectionObserver from '@/hooks/useIntersectionObserver'

interface CardContentProps {
  imageUrl: string
}

function CardContent({imageUrl}: CardContentProps) {
  const t = useTranslations('home.coffeeTea');
  const containerRef = useRef(null)
  
  useIntersectionObserver(containerRef, styles.visible, { once: false })
  
  return (
    <div ref={containerRef} className={styles.cardContainer}>
      <div className={styles.cardImageWrapper}>
        <div className={styles.cardImageContainer}>
          <Image className={styles.cardImage}
              src={imageUrl} fill={true} alt=''/>
        </div>
        <div className={styles.decorTopRight} />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardSubtitle}>{t('subtitle')}</h3>
        <h2 className={styles.cardTitle}>{t('title')}</h2>
      </div>
    </div>
  )
}

export default memo(CardContent);
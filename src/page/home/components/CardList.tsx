'use client'
import Image from 'next/image'
import { useRef, memo } from 'react'
import styles from '@/styles/home/services.module.css';
import useIntersectionObserver from '@/hooks/useIntersectionObserver'

export interface ICard {
  index: string
  title: string
  description: string
}

interface CardProps extends ICard {
  key: string;
}

const Card = ({ index, title, description }: CardProps) => {
  return (
    <div className={styles.cardOuter}>
      <div className={styles.cardMain}>
        <div className={styles.cardInner}>
          <span className={styles.cardIndex}>{index}</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
const MemoizedCard = memo(Card)

interface CardListProps {
  cards: ICard[]
  imageUrl: string
}

function CardList({cards, imageUrl}: CardListProps) {
  const cardListRef = useRef(null)
  
  useIntersectionObserver(cardListRef, styles.visible, { once: false, threshold: 0 })
  
  return (
    <div ref={cardListRef} className={styles.sectionInner}>
        <div className={styles.heroBackground}>
          <Image className={styles.heroImage}
              src={imageUrl} fill={true} alt=''/>
        </div>

        <div className={styles.cardListOuter}>
          <div className={styles.cardListMain}>
            <div className={styles.cardListInner}>
              {cards.map((card) => (
                <MemoizedCard
                  key={card.index}
                  index={card.index}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default memo(CardList);
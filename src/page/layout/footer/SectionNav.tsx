'use client';

import { useState, useEffect, useRef, forwardRef, memo } from 'react';
import { Ref } from 'react';
import styles from '@/styles/layout/footer/sectionNav.module.css';

export interface INavItem {
  href: string;
  label: string;
}

interface NavItemProps {
  key: string | number
  name: string
  handleClick: () => void
}


const NavItem = ({ name, handleClick }: NavItemProps, ref: Ref<HTMLDivElement>) => {
  return (<div ref={ref}
      className={styles.sectionNavItem}>
      <button
        onClick={handleClick}
        className={styles.sectionNavLink}>
        {name}
      </button>
    </div>
  )
}

const MemoizedNavItem = memo( forwardRef<HTMLDivElement, NavItemProps>(NavItem) )

interface SectionNavProps {
  items: INavItem[];
}

export default function SectionNav({ items }: SectionNavProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Индекс первого видимого элемента
  const [atStart, setAtStart] = useState<boolean>(true); // Находимся ли в начале
  const [atEnd, setAtEnd] = useState<boolean>(false); // Находимся ли в конце
  
  const navListRef = useRef<HTMLDivElement>(null)
  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const toLeftRef = useRef<HTMLButtonElement>(null)
  const toRightRef = useRef<HTMLButtonElement>(null)

  // Инициализация списка
  useEffect(() => {
    navItemRefs.current = navItemRefs.current.slice(0, items.length);
  }, [items]);
  
  // Обработчик клика для перехода к секции
  const onLinkClick = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Вычисляем индекс последнего видимого элемента
  const getLastVisibleIndex = (): number => {
    if (!navListRef.current || !navItemRefs.current[0]) return 0;
    const containerWidth = navListRef.current.offsetWidth;
    let totalWidth = 0;
    for (let i = currentIndex; i < items.length; i++) {
      const itemWidth = ( navItemRefs.current[i]?.offsetWidth ?? 0 ) + 10
      if (itemWidth) totalWidth += itemWidth;
      if (totalWidth > containerWidth) {
        return Math.max(currentIndex, i - 1); // Последний полностью видимый элемент
      }
    }
    return items.length - 1; // Если все элементы видны
  };
    
  // Прокрутка к элементу
  const scrollToItem = (index: number): void => {
    if (index >= 0 && index < items.length) {
      navItemRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setCurrentIndex(index);
      setAtStart(index === 0);
      setAtEnd(index >= items.length - 1);
    }
  };

  // Обработчик для кнопки "Next"
  const toNext = (): void => {
    if (atEnd) {
      // Возврат к началу
      scrollToItem(0);
    } else {
      // Прокрутка к элементу после последнего видимого
      const lastVisibleIndex = getLastVisibleIndex();
      const nextIndex = Math.min(lastVisibleIndex + 1, items.length - 1);
      scrollToItem(nextIndex);
    }
  };

  // Обработчик для кнопки "Prev"
  const toPrev = (): void => {
    if (atStart) {
      // Возврат к концу (последний элемент, который помещается)
      const lastVisibleIndex = items.length - 1;
      scrollToItem(lastVisibleIndex);
    } else {
      // Прокрутка к элементу перед первым видимым
      const prevIndex = Math.max(currentIndex - 1, 0);
      scrollToItem(prevIndex);
    }
  };

  return (
    <div className={styles.sectionNavOuter}>
      <div className={styles.control}>
        <button ref={toLeftRef}
            className={styles.toLeft}
            onClick={toPrev}>
        </button>
      </div>
      <nav className={styles.sectionNav}>
        <div className={styles.sectionNavContainer}>
          <div ref={navListRef} className={styles.sectionNavList}>
            {items.map((item, index) => (
              <MemoizedNavItem key={index}
                ref={ (el) => { navItemRefs.current[index] = el } }
                name={item.label}
                handleClick={() => onLinkClick(item.href)}/>
            ))}
          </div>
        </div>
      </nav>
      <div className={styles.control}>
        <button ref={toRightRef}
            className={styles.toRight}
            onClick={toNext}>
        </button>
      </div>
    </div>
  );
}
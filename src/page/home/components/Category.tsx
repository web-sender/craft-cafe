'use client'
import Image from 'next/image'
import { useRef, memo } from 'react'
import styles from '@/styles/home/categoryList.module.css';
import useIntersectionObserver from '@/hooks/useIntersectionObserver'

interface CategoryProps {
  key: string | number
  logo: string;
  title: string;
}

function Category({ logo, title }: CategoryProps) {
  const catergoryRef = useRef(null)
  
  useIntersectionObserver(catergoryRef, styles.visible, { once: false })
  
  return (
    <div ref={catergoryRef} className={styles.categoryOuter}>
      <div className={styles.categoryMain}>
        <div className={styles.categoryInner}>
          <div className={styles.categoryLogoContainer}>
            <Image className={styles.categoryLogo} 
              src={logo} width={48} height={48} alt=''/>
          </div>
          <h3 className={styles.categoryTitle}>{title}</h3>
        </div>
      </div>
    </div>
  );
}

export default memo(Category);
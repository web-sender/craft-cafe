'use client';

import { useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import styles from '@/styles/layout/footer.module.css';

export interface IItemExplore {
  href: string;
  label: string;
}

interface ExploreItemProps {
  key: string | number
  link: IItemExplore;
}

const ExploreItem = ({ link }: ExploreItemProps) => {
  return (
    <li className={styles.exploreItem}>
      <Link href={link.href} className={styles.footerLink}>
        {link.label}
      </Link>
    </li>
  )
}
const MemoizedExploreItem = memo(ExploreItem)

interface ExploreSectionProps {
  title: string;
  links: IItemExplore[];
}

export default function ExploreSection({ title, links }: ExploreSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const width = titleRef.current.offsetWidth;
      titleRef.current.style.setProperty('--title-width', `${width}px`);
    }
  }, []);

  return (
    <div className={styles.footerSection}>
      <h3 ref={titleRef}>{title}</h3>
      <ul className={styles.footerSectionContent}>
        {links.map((link, index) => (
          <MemoizedExploreItem key={index} link={link}/>
        ))}
      </ul>
    </div>
  );
}
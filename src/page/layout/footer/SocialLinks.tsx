'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/layout/footer.module.css';

export interface IItemSocial {
  href: string;
  label: string;
  logoSrc: string;
}

interface SocialLinksProps {
  title: string;
  links: IItemSocial[];
}

export default function SocialLinks({ title, links }: SocialLinksProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const width = titleRef.current.offsetWidth;
      titleRef.current.style.setProperty('--title-width', `${width}px`);
    }
  }, []);

  return (
    <div className={styles.socialSection}>
      <h3 ref={titleRef}>{title}</h3>
      <div className={styles.socialLinks}>
        {links.map((link, index) => (
          <Link className={styles.socialItem} href={link.href} key={index}>
            <Image className={styles.socialItemLogo}
              width={40} height={40}
              src={link.logoSrc} alt={link.label}/>
          </Link>
        ))}
      </div>
    </div>
  );
}
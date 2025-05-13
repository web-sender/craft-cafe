'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import styles from '@/styles/layout/header.module.css';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface NavProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Nav({ setIsOpen }: NavProps) {
  const t = useTranslations('home.header');
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useIntersectionObserver(navRef, styles.visible, { once: false });

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/catalog', label: t('nav.catalog') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/about', label: t('nav.about') },
    { href: '/gallery', label: t('nav.gallery') },
  ];

  return (
    <nav ref={navRef} className={styles.nav}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href} className={styles.navItem}>
            <Link
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.activeNavLink : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
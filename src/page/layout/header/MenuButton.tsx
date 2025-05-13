'use client';

import { useTranslations } from 'next-intl';
import styles from '@/styles/layout/header.module.css';

interface MenuButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function MenuButton({ isOpen, toggleMenu }: MenuButtonProps) {
  const t = useTranslations('home.header');

  return (
    <button
      className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
      onClick={toggleMenu}
      aria-label={isOpen ? t('closeMenu') : t('openMenu')}
    >
      <svg className={styles.menuIcon} viewBox="0 0 24 24">
        <path
          className={`${styles.line} ${styles.line1}`}
          d="M3 6h18"
        />
        <path
          className={`${styles.line} ${styles.line2}`}
          d="M3 12h18"
        />
        <path
          className={`${styles.line} ${styles.line3}`}
          d="M3 18h18"
        />
      </svg>
    </button>
  );
}
'use client';

import { useState } from 'react';
import styles from '@/styles/layout/header.module.css';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import LanguageSwitcher from './LanguageSwitcher';

interface MenuProps {
  locales: string[]
}

export default function Menu({ locales }: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.menuWrapper}>
      <MenuButton isOpen={isMenuOpen} toggle={toggleMenu} />
      <div className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.menuLanguage}>
          <LanguageSwitcher locales={locales}/>
        </div>
        <MenuContent setIsOpen={setIsMenuOpen} />
      </div>
    </div>
  );
}
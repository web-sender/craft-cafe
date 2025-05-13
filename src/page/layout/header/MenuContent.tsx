'use client';

import styles from '@/styles/layout/header.module.css';
import Nav from './Nav';
import SocialLinks from './SocialLinks';

interface MenuContentProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function MenuContent({ setIsOpen }: MenuContentProps) {
  return (
    <div className={styles.menuContent}>
      <Nav setIsOpen={setIsOpen} />
      <SocialLinks />
    </div>
  );
}
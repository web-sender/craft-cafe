'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import GlobeToggle from '@/layout/components/GlobeToggle';
import styles from '@/styles/layout/header.module.css';

interface LanguageProps {
  locales: string[]
}

export default function LanguageSwitcher({ locales }: LanguageProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  const switchLanguage = async (nextLocale: string) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/locale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: nextLocale }),
        });
        if (response.ok) {
          router.refresh();
        } else {
          console.error('Failed to set locale');
        }
      } catch (error) {
        console.error('Error setting locale:', error);
      }
      setIsOpen(false);
    });
  };

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        globeRef.current &&
        !globeRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.languageSwitcher}>
      <div ref={panelRef}
        className={`${styles.languagePanel} ${isOpen ? styles.open : ''}`}
      >
        <ul className={styles.languageList}>
          {locales.map((loc) => (
            <li key={loc} className={styles.languageItem}>
              <button
                className={`${styles.languageLink} ${
                  loc === locale ? styles.activeLanguage : ''
                }`}
                onClick={() => switchLanguage(loc)}
                disabled={isPending}
              >
                {loc}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div ref={globeRef} className={styles.languageButton}>
        <GlobeToggle isActive={isOpen}
          isPending={isPending}
          onToggle={togglePanel}
          locale={locale}/>
      </div>
    </div>
  );
}
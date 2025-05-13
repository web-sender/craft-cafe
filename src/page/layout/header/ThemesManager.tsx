'use client';
import { useState, useEffect, memo } from 'react';
import ThemeToggle from '@/layout/components/ThemeToggle';
import styles from '@/styles/layout/header/component.module.css';

function ThemesManager() {
  const [theme, setTheme] = useState<'night' | 'day'>('day');

  // Инициализация темы на клиенте
  useEffect(() => {
    const savedTheme = sessionStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    const initialTheme = savedTheme || systemTheme;
    if (initialTheme === 'night' || initialTheme === 'day') {
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
      sessionStorage.setItem('theme', initialTheme);
    }
  }, []);

  // Отслеживание изменений системной темы
  useEffect(() => {
    if (!theme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'night' : 'day';
      // Обновляем только если нет сохранённой темы
      if (!sessionStorage.getItem('theme')) {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        sessionStorage.setItem('theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  const toggleTheme = (nextTheme: 'day' | 'night') => {
    document.documentElement.setAttribute('data-theme', nextTheme);
    sessionStorage.setItem('theme', nextTheme);
  };

  return (
    <div className={styles.themesManager}>
      <ThemeToggle onToggle={toggleTheme}/>
    </div>
  );
}

export default memo(ThemesManager)
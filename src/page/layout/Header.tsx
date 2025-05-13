import { getTranslations } from 'next-intl/server';
import Menu from './header/Menu';
import ThemesManager from './header/ThemesManager';
import LanguageSwitcher from './header/LanguageSwitcher';
import { config } from '@/lib/config'
import styles from '@/styles/layout/header.module.css';

interface ILocale {
  locales: string[]
}

const defaultILocales: ILocale = {
  locales: ['en', 'ru']
}

export default async function Header() {
  const t = await getTranslations('home.header');
  const res = await fetch(`${config.apiBaseUrl}/api/locale`)
  const locale: ILocale = (res.ok) ? await res.json() : defaultILocales

  return (
    <header className={styles.headerMain}>
      <div className={styles.headerInner}>
        <h1 className={styles.headerTitle}>{t('title')}</h1>
        <div className={styles.headerControls}>
          <ThemesManager />
          <LanguageSwitcher locales={locale.locales}/>
          <Menu locales={locale.locales}/>
        </div>
      </div>
    </header>
  );
}
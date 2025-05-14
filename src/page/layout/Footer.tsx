import { getTranslations } from 'next-intl/server';
import styles from '@/styles/layout/footer.module.css';
import Notification from '@/layout/Notification';
import SectionNav, { INavItem } from './footer/SectionNav';
import ExploreSection, { IItemExplore } from './footer/ExploreSection';
import ContactInfo from './footer/ContactInfo';
import SocialLinks, { IItemSocial } from './footer/SocialLinks';
import SubscriptionForm from './footer/SubscriptionForm';
import Established from './footer/Established';

type INavList = INavItem[]
type IExploreList = IItemExplore[]
type ISocialList = IItemSocial[]

export default async function FooterSection() {
  const t = await getTranslations('home.footer');

  const navItems: INavList = [
    { href: 'feature', label: t('nav.feature') },
    { href: 'coffee-cakes', label: t('nav.coffee-cakes') },
    { href: 'services', label: t('nav.services') },
    { href: 'category-list', label: t('nav.category-list') },
    { href: 'popular', label: t('nav.popular') },
    { href: 'additional-info', label: t('nav.additional-info') },
    { href: 'stories', label: t('nav.stories') },
    { href: 'invocation', label: t('nav.invocation') },
    { href: 'contact', label: t('nav.contact') },
  ];

  const exploreLinks: IExploreList = [
    { href: '/catalog', label: t('explore.links.catalog') },
    { href: '/blog', label: t('explore.links.blog') },
    { href: '/about', label: t('explore.links.about') },
    { href: '/gallery', label: t('explore.links.gallery') },
  ];

  const socialLinks: ISocialList = [
    {
      href: 'https://instagram.com/',
      label: t('connect.links.instagram.label'),
      logoSrc: t('connect.links.instagram.logoSrc')
    },
    {
      href: 'https://facebook.com/',
      label: t('connect.links.facebook.label'),
      logoSrc: t('connect.links.facebook.logoSrc')
    },
    {
      href: 'https://twitter.com/',
      label: t('connect.links.twitter.label'),
      logoSrc: t('connect.links.twitter.logoSrc')
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerNotification}>
          <Notification />
        </div>
        <SectionNav items={navItems} />
        <div className={styles.footerContent}>
          <SubscriptionForm
            title={t('subscribe.title')}
            placeholder={t('subscribe.placeholder')}
            buttonText={t('subscribe.button')}
          />
          <div className={styles.footerSections}>
            <ExploreSection 
              title={t('explore.title')} 
              links={exploreLinks} />
            <ContactInfo
              title={t('contact.title')}
              address={t('contact.address')}
              email={t('contact.email')}
              phone={t('contact.phone')}
            />
          </div>
        </div>
        <SocialLinks title={t('connect.title')} links={socialLinks} />
      </div>
      <Established text={t('established')} />
    </footer>
  );
}
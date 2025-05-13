import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';
import Head from 'next/head';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import './globals.css';

type Locale = 'en' | 'ru' | 'zh';

interface IMetaText {
  en: string;
  ru: string;
  zh: string;
}

export async function generateMetadata() {
  const locale: Locale = (headers().get('x-locale') || 'en') as Locale;
  const messages = (await import(`../page/content/${locale}.json`)).default;

  const titles: IMetaText = {
    en: 'Craft Cafe | Artisanal Coffee & Pastries in NYC',
    ru: 'Крафт Кафе | Ремесленный кофе и выпечка в Нью-Йорке',
    zh: '匠心咖啡馆 | 纽约手工咖啡与甜点',
  };

  const descriptions: IMetaText = {
    en: 'Discover Craft Cafe, a cozy NYC haven offering artisanal coffee, fresh pastries, and a warm atmosphere. Perfect for a relaxing break in Manhattan.',
    ru: 'Откройте для себя Крафт Кафе — уютное место в Нью-Йорке с ремесленным кофе, свежей выпечкой и тёплой атмосферой. Идеально для отдыха в Манхэттене.',
    zh: '探索匠心咖啡馆，纽约的温馨港湾，提供手工咖啡、新鲜甜点和舒适氛围。曼哈顿放松身心的完美去处。',
  };

  const ogDescriptions: IMetaText = {
    en: 'Savor handcrafted coffee and pastries at Craft Cafe, a cozy NYC retreat. Join us for a moment of calm in the heart of Manhattan.',
    ru: 'Насладитесь ремесленным кофе и выпечкой в Крафт Кафе, уютном уголке Нью-Йорка. Присоединяйтесь к нам для момента покоя в сердце Манхэттена.',
    zh: '在匠心咖啡馆品尝手工咖啡与甜点，纽约的温馨庇护所。加入我们，在曼哈顿中心享受片刻宁静。',
  };

  const twitterDescriptions: IMetaText = {
    en: 'Craft Cafe: Artisanal coffee & pastries in NYC. Visit us for a cozy break! ☕',
    ru: 'Крафт Кафе: Ремесленный кофе и выпечка в Нью-Йорке. Заходите за уютным отдыхом! ☕',
    zh: '匠心咖啡馆：纽约手工咖啡与甜点。来体验温馨时光！☕',
  };

  const keywords: IMetaText = {
    en: 'craft cafe, artisanal coffee, NYC cafe, Manhattan coffee shop, pastries, vegetarian menu',
    ru: 'крафт кафе, ремесленный кофе, кафе в Нью-Йорке, кофейня в Манхэттене, выпечка, вегетарианское меню',
    zh: '匠心咖啡馆, 手工咖啡, 纽约咖啡店, 曼哈顿咖啡店, 甜点, 素食菜单',
  };

  const siteUrl = 'https://www.craftcafe.com';
  const ogImage = '/og-image.jpg';

  return {
    title: titles[locale in titles ? locale : 'en'],
    description: descriptions[locale in descriptions ? locale : 'en'],
    alternates: {
      languages: {
        en: '/',
        ru: '/',
        zh: '/',
        'x-default': '/',
      },
    },
    openGraph: {
      title: titles[locale in titles ? locale : 'en'],
      description: ogDescriptions[locale in ogDescriptions ? locale : 'en'],
      images: [{ url: `${siteUrl}${ogImage}`, width: 1200, height: 630 }],
      url: `${siteUrl}`,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : locale,
      siteName: messages.header?.title || 'Craft Cafe',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale in titles ? locale : 'en'],
      description: twitterDescriptions[locale in twitterDescriptions ? locale : 'en'],
      images: [`${siteUrl}${ogImage}`],
      site: '@CraftCafeNYC',
    },
    other: {
      'content-language': locale,
      keywords: keywords[locale in keywords ? locale : 'en'],
      robots: 'index, follow',
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = headers().get('x-locale') || 'en';
  const messages = (await import(`../page/content/${locale}.json`)).default;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: messages.header?.title || 'Craft Cafe',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Coffee Lane',
      addressLocality: 'Manhattan',
      addressRegion: 'NYC',
      postalCode: '10001',
      addressCountry: 'US',
    },
    telephone: '(123) 456-7890',
    url: 'https://www.craftcafe.com',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.748817,
      longitude: -73.985428,
    },
    openingHours: 'Mo-Su 08:00-20:00',
    servesCuisine: ['Coffee', 'Pastries', 'Vegetarian'],
    image: 'https://www.craftcafe.com/og-image.jpg',
    sameAs: [
      'https://www.instagram.com/craftcafenyc',
      'https://www.facebook.com/craftcafenyc',
      'https://twitter.com/CraftCafeNYC',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '(123) 456-7890',
      contactType: 'Customer Service',
      email: 'hello@craftcafe.com',
    },
  };

  return (
    <html lang={locale}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
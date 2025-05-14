import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { config } from '@/lib/config';

// In-memory кэш для локалей
let inMemoryLocales: string[] | null = null;

// Кэшированная функция для получения локалей из API
const getCachedLocales = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/locale`, {
        next: { revalidate: 86400 }, // Кэшировать на 24 часа
      });
      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }
      const { locales } = await res.json();
      if (!Array.isArray(locales) || locales.length === 0) {
        throw new Error('Invalid locales format');
      }
      // Сохраняем только валидные локали
      inMemoryLocales = locales.filter((loc: string) => typeof loc === 'string');
      return inMemoryLocales;
    } catch (error) {
      console.error('Failed to fetch locales from API:', { error });
      // Не кэшируем ошибку, возвращаем null
      return null;
    }
  },
  ['locales'],
  { revalidate: 86400 } // 24 часа
);

// Нормализация локали (например, en-US → en)
const normalizeLocale = (locale: string, availableLocales: string[]): string => {
  const baseLocale = locale.split('-')[0].toLowerCase();
  return availableLocales.includes(baseLocale) ? baseLocale : config.defaultLocale;
};

// Парсинг accept-language с учётом приоритетов
const parseAcceptLanguage = (acceptLanguage: string | null, availableLocales: string[]): string => {
  if (!acceptLanguage) return config.defaultLocale;
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, q = '1'] = lang.split(';q=');
      return { locale: locale.trim(), q: parseFloat(q) };
    })
    .sort((a, b) => b.q - a.q); // Сортировка по приоритету

  for (const { locale } of languages) {
    const normalized = normalizeLocale(locale, availableLocales);
    if (availableLocales.includes(normalized)) return normalized;
  }
  return config.defaultLocale;
};

// Загрузка сообщений
const loadMessages = async (locale: string) => {
  try {
    const messages = (await import(`../page/content/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, { error });
    return (await import(`../page/content/${config.defaultLocale}.json`)).default;
  }
};

export default getRequestConfig(async () => {
  const headersList = headers();
  const xLocale = headersList.get('x-locale');
  const acceptLanguage = headersList.get('accept-language');

  // Получаем доступные локали
  let availableLocales = inMemoryLocales;
  if (!availableLocales) {
    const cachedLocales = await getCachedLocales();
    availableLocales = cachedLocales || [config.defaultLocale];
  }

  // Определяем локаль
  let locale: string;
  if (xLocale && normalizeLocale(xLocale, availableLocales) !== config.defaultLocale) {
    locale = normalizeLocale(xLocale, availableLocales);
  } else {
    locale = parseAcceptLanguage(acceptLanguage, availableLocales);
  }

  // Проверяем, поддерживается ли локаль
  if (!availableLocales.includes(locale)) {
    locale = config.defaultLocale;
  }

  // Загружаем сообщения
  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
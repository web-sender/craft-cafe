import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  const headersList = headers();
  const locale = headersList.get('x-locale') || 'ru';
  try {
    const messages = (await import(`../page/content/${locale}.json`)).default;
    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`);
    console.error('This error from i18/request.ts: \n', error);
    const messages = (await import(`../page/content/ru.json`)).default;
    return {
      locale: 'ru',
      messages,
    };
  }
});
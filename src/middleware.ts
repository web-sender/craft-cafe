import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Negotiator from 'negotiator';
import { config as appConfig } from '@/lib/config'

interface ILocale {
  locales: string[]
}

function getLocale(request: NextRequest, locale: ILocale): string {
  // 1. Проверяем cookies
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locale.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Проверяем Accept-Language
  const headers = Object.fromEntries(request.headers.entries());
  const negotiator = new Negotiator({ headers });
  const userLanguages = negotiator.languages();

  // 3. Определяем регион на основе первого предпочтительного языка
  const primaryLanguage = userLanguages[0] || 'en';
  return primaryLanguage
}

export async function middleware(request: NextRequest) {
  const res = await fetch(`${appConfig.apiBaseUrl}/api/locale`)
  
  if (res.ok) {
    const locale: ILocale = await res.json()
    const currentLocale = getLocale(request, locale);
    
    if (!locale.locales.includes(currentLocale)) return NextResponse.next();
    
    const response = NextResponse.next();
    response.headers.set('x-locale', currentLocale);
    
    // Устанавливаем cookie, если его нет
    const cookieStore = cookies();
    if (!cookieStore.get('NEXT_LOCALE')) {
      response.cookies.set('NEXT_LOCALE', currentLocale, {
        path: '/',
        sameSite: 'strict',
        maxAge: 31536000, // 1 год
      });
    }
    return response;
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
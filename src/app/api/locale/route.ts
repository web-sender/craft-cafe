import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

const errorToString = (error: unknown): string => (
  (error instanceof Error) ? error.message : String(error)
)

async function getLocales(): Promise<string[]> {
    // Формируем абсолютный путь к папке src/page/content/
  const contentDir = path.join(process.cwd(), 'src', 'page', 'content');
  // Читаем находящиеся locale
  const files = await readdir(contentDir);
  const locales = files
    .filter((file) => path.extname(file).toLowerCase() === '.json')
    .map((file) => path.parse(file).name);
  return locales
}

// Функция для обработки GET-запроса на получение locale's
export async function GET() {
  try {
    const locales = await getLocales()

    // Возвращаем список locales JSON-файлов в ответе
    return NextResponse.json({ locales });
  } catch (error: unknown) {
    const message: string = errorToString(error)

    return NextResponse.json(
      { error: 'Failed to read locales', message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { locale } = await request.json();
  try {
    const locales = await getLocales()
    if (!locales.includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }
  
    const response = NextResponse.json({ success: true });
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      sameSite: 'strict',
      maxAge: 31536000, // 1 год
    });
  
    return response;
  } catch (error: unknown) {
    const message: string = errorToString(error)
    
    return NextResponse.json(
      { error: 'Failed to read locales', message },
      { status: 500 }
    );
  }
}
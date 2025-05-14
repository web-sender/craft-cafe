// lib/config.ts
export interface IConfig {
  apiBaseUrl: string;
  defaultLocale: string;
}

export const config: IConfig = {
  apiBaseUrl: process.env.API_BASE_URL || 'https://localhost:3000', // Fallback для локальной разработки
  defaultLocale: process.env.DEFAULT_LOCALE || 'ru',
};
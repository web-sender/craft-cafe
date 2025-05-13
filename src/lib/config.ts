// lib/config.ts
export interface IConfig {
  apiBaseUrl: string;
}

export const config: IConfig = {
  apiBaseUrl: process.env.API_BASE_URL || 'https://localhost:3000', // Fallback для локальной разработки
};
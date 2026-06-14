export const SUPPORTED_LOCALES = ['pt-BR', 'en-US'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt-BR';
export const LOCALE_COOKIE = 'NEXT_LOCALE' as const;

export const isValidLocale = (value: unknown): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale);

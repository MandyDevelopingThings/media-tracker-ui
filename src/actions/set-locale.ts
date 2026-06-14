'use server';

import { cookies } from 'next/headers';
import { isValidLocale, LOCALE_COOKIE } from '@/lib/i18n-config';
import type { Locale } from '@/lib/i18n-config';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const setLocaleAction = async (locale: Locale): Promise<void> => {
  if (!isValidLocale(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    maxAge: ONE_YEAR_SECONDS,
  });
};

import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale, SUPPORTED_LOCALES } from '@/lib/i18n-config';
import type { Locale } from '@/lib/i18n-config';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const resolveLocaleFromHeader = (header: string | null): Locale => {
  if (!header) return DEFAULT_LOCALE;

  const candidates = header
    .split(',')
    .map((part) => part.split(';')[0].trim());

  for (const candidate of candidates) {
    if (isValidLocale(candidate)) return candidate;

    const languagePrefix = candidate.split('-')[0];
    const match = SUPPORTED_LOCALES.find((l) => l.startsWith(languagePrefix));
    if (match) return match;
  }

  return DEFAULT_LOCALE;
};

export const proxy = (request: NextRequest): NextResponse => {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (isValidLocale(cookieLocale)) {
    return NextResponse.next();
  }

  const resolved = resolveLocaleFromHeader(
    request.headers.get('Accept-Language'),
  );

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, resolved, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    maxAge: ONE_YEAR_SECONDS,
  });

  return response;
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
